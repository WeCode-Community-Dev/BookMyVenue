import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import type mongoose from 'mongoose';
import { app } from '../../../src/app';
import { VenueModel } from '../../../src/modules/venue/venue.model';
import { createSessionWithRole, type RoleSession } from '../../helpers/rbac.helper';

const OWNER_PERMISSIONS = ['read:venues', 'update:venues'];
// approve-review needs activate:venues; reject-review needs deactivate:venues
const ADMIN_PERMISSIONS = [
  'read:venues',
  'update:venues',
  'activate:venues',
  'deactivate:venues',
];

const API = '/api/v1';

async function seedApprovedVenue(ownerId: mongoose.Types.ObjectId): Promise<string> {
  const venue = await VenueModel.create({
    name: 'Integration Venue',
    description: 'desc',
    venueType: 'banquet',
    address: 'addr',
    city: 'city',
    district: 'district',
    pincode: '682001',
    bookingType: 'fixedBooking',
    coverImage: 'https://example.com/img.jpg',
    contact: { name: 'Owner', phone: '9999999999', email: 'owner@example.com' },
    cancellation: { policy: 'nonRefundable' },
    status: 'Approved',
    ownerUserId: ownerId,
    createdBy: ownerId,
    updatedBy: ownerId,
    active: true,
    deleted: false,
  });
  return venue._id.toString();
}

describe('Venue inactivity API', () => {
  let owner: RoleSession;
  let admin: RoleSession;
  let venueId: string;

  beforeEach(async () => {
    owner = await createSessionWithRole('owner', OWNER_PERMISSIONS, {
      username: 'venue_owner',
      email: 'venue_owner@example.com',
    });
    admin = await createSessionWithRole('admin', ADMIN_PERMISSIONS, {
      username: 'venue_admin',
      email: 'venue_admin@example.com',
    });
    venueId = await seedApprovedVenue(owner.user._id);
  });

  describe('POST /owner/venue/:venueId/request-inactivity', () => {
    it('submits a request and surfaces it in the admin review queue', async () => {
      const submit = await request(app)
        .post(`${API}/owner/venue/${venueId}/request-inactivity`)
        .set('Cookie', [owner.cookieHeader])
        .send({ reason: 'Closing for renovation work' });

      expect(submit.status).toBe(200);
      expect(submit.body.success).toBe(true);
      expect(submit.body.data.status).toBe('Approved');
      expect(submit.body.data.pendingReview.intent).toBe('inactivity_request');

      const queue = await request(app)
        .get(`${API}/venues/reviews`)
        .set('Cookie', [admin.cookieHeader]);

      expect(queue.status).toBe(200);
      expect(queue.body.data.count).toBe(1);
      expect(queue.body.data.venues[0].pendingReview.intent).toBe('inactivity_request');
    });

    it('rejects a reason below the minimum length rather than failing silently', async () => {
      const response = await request(app)
        .post(`${API}/owner/venue/${venueId}/request-inactivity`)
        .set('Cookie', [owner.cookieHeader])
        .send({ reason: 'closed' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('accepts a request with no reason at all', async () => {
      const response = await request(app)
        .post(`${API}/owner/venue/${venueId}/request-inactivity`)
        .set('Cookie', [owner.cookieHeader])
        .send({});

      expect(response.status).toBe(200);
    });

    it('refuses a second request while one is awaiting review', async () => {
      await request(app)
        .post(`${API}/owner/venue/${venueId}/request-inactivity`)
        .set('Cookie', [owner.cookieHeader])
        .send({});

      const duplicate = await request(app)
        .post(`${API}/owner/venue/${venueId}/request-inactivity`)
        .set('Cookie', [owner.cookieHeader])
        .send({});

      expect(duplicate.status).toBe(409);
    });

    it("denies a different owner access to someone else's venue", async () => {
      const stranger = await createSessionWithRole('owner', OWNER_PERMISSIONS, {
        username: 'other_owner',
        email: 'other_owner@example.com',
      });

      const response = await request(app)
        .post(`${API}/owner/venue/${venueId}/request-inactivity`)
        .set('Cookie', [stranger.cookieHeader])
        .send({});

      expect([403, 404]).toContain(response.status);
    });

    it('rejects an unauthenticated request', async () => {
      const response = await request(app)
        .post(`${API}/owner/venue/${venueId}/request-inactivity`)
        .send({});

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /owner/venue/:venueId/request-inactivity', () => {
    it('cancels a request that is still awaiting review', async () => {
      await request(app)
        .post(`${API}/owner/venue/${venueId}/request-inactivity`)
        .set('Cookie', [owner.cookieHeader])
        .send({});

      const cancel = await request(app)
        .delete(`${API}/owner/venue/${venueId}/request-inactivity`)
        .set('Cookie', [owner.cookieHeader]);

      expect(cancel.status).toBe(200);
      expect(cancel.body.data.pendingReview).toBeUndefined();

      const queue = await request(app)
        .get(`${API}/venues/reviews`)
        .set('Cookie', [admin.cookieHeader]);
      expect(queue.body.data.count).toBe(0);
    });

    it('cancels an approved closure while the venue is still winding down', async () => {
      await request(app)
        .post(`${API}/owner/venue/${venueId}/request-inactivity`)
        .set('Cookie', [owner.cookieHeader])
        .send({});

      const approve = await request(app)
        .post(`${API}/venues/${venueId}/approve-review`)
        .set('Cookie', [admin.cookieHeader])
        .send({});
      expect(approve.status).toBe(200);
      expect(approve.body.data.status).toBe('Approved');
      expect(approve.body.data.inactivity.blockedAfterDate).toBeDefined();

      const cancel = await request(app)
        .delete(`${API}/owner/venue/${venueId}/request-inactivity`)
        .set('Cookie', [owner.cookieHeader]);

      expect(cancel.status).toBe(200);
      expect(cancel.body.data.inactivity?.blockedAfterDate).toBeUndefined();
      expect(cancel.body.data.inactivity?.approvedAt).toBeUndefined();
    });

    it('returns a conflict when there is nothing to cancel', async () => {
      const response = await request(app)
        .delete(`${API}/owner/venue/${venueId}/request-inactivity`)
        .set('Cookie', [owner.cookieHeader]);

      expect(response.status).toBe(409);
    });
  });

  describe('admin review actions', () => {
    it('approves without closing the venue outright', async () => {
      await request(app)
        .post(`${API}/owner/venue/${venueId}/request-inactivity`)
        .set('Cookie', [owner.cookieHeader])
        .send({});

      const approve = await request(app)
        .post(`${API}/venues/${venueId}/approve-review`)
        .set('Cookie', [admin.cookieHeader])
        .send({});

      expect(approve.status).toBe(200);
      // The wind-down keeps the venue open so confirmed bookings can be honoured
      expect(approve.body.data.status).toBe('Approved');
      expect(approve.body.data.inactivity.inactiveAt).toBeUndefined();
    });

    it('leaves the owner able to act again after a rejection', async () => {
      await request(app)
        .post(`${API}/owner/venue/${venueId}/request-inactivity`)
        .set('Cookie', [owner.cookieHeader])
        .send({});

      const reject = await request(app)
        .post(`${API}/venues/${venueId}/reject-review`)
        .set('Cookie', [admin.cookieHeader])
        .send({ note: 'Peak season, please postpone' });
      expect(reject.status).toBe(200);

      // The stale-state bug made this second request impossible
      const retry = await request(app)
        .post(`${API}/owner/venue/${venueId}/request-inactivity`)
        .set('Cookie', [owner.cookieHeader])
        .send({});
      expect(retry.status).toBe(200);
    });

    it('denies an owner access to the admin review queue', async () => {
      const response = await request(app)
        .get(`${API}/venues/reviews`)
        .set('Cookie', [owner.cookieHeader]);

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('GET /owner/venue/:venueId/activity', () => {
    it('returns the venue history to its owner', async () => {
      await request(app)
        .post(`${API}/owner/venue/${venueId}/request-inactivity`)
        .set('Cookie', [owner.cookieHeader])
        .send({ reason: 'Closing for renovation work' });

      const response = await request(app)
        .get(`${API}/owner/venue/${venueId}/activity`)
        .set('Cookie', [owner.cookieHeader]);

      expect(response.status).toBe(200);
      expect(response.body.data.logs).toHaveLength(1);
      expect(response.body.data.logs[0].action).toBe('request_inactivity');
      expect(response.body.data.logs[0].actorRole).toBe('owner');
    });

    it("denies access to another owner's venue history", async () => {
      const stranger = await createSessionWithRole('owner', OWNER_PERMISSIONS, {
        username: 'nosy_owner',
        email: 'nosy_owner@example.com',
      });

      const response = await request(app)
        .get(`${API}/owner/venue/${venueId}/activity`)
        .set('Cookie', [stranger.cookieHeader]);

      expect([403, 404]).toContain(response.status);
    });
  });
});
