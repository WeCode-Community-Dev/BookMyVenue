import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../../src/app';
import { generateAccessToken } from '../../../src/utils/tokenUtils';
import { createAuthenticatedSession } from '../../helpers/auth.helper';
import { UserModel } from '../../../src/modules/user/user.models';
import { RoleModel } from '../../../src/models/role.model';
import { UserRoleModel } from '../../../src/models/user-role.model';
import { ReviewModel } from '../../../src/modules/review/review.model';

const API = '/api/v1/reviews';

async function seedSuperAdmin(): Promise<mongoose.Types.ObjectId> {
  const role = await RoleModel.create({
    name: 'superAdmin',
    displayName: 'Super Admin',
    description: '',
    isSystem: true,
    parentRole: null,
    priority: 1,
    active: true,
    deleted: false,
  });
  const admin = await UserModel.create({
    username: 'superadmin',
    email: 'sa@example.com',
    password: 'hashed',
    active: true,
    deleted: false,
    isBanned: false,
  });
  await UserRoleModel.create({ userId: admin._id, roleId: role._id, active: true, deleted: false });
  return admin._id;
}

async function createAdminCookie(): Promise<string> {
  const adminId = await seedSuperAdmin();
  const admin = await UserModel.findById(adminId).exec();
  const accessToken = generateAccessToken(adminId.toString(), admin?.username ?? 'sa', 'sa@example.com');
  return `accessToken=${accessToken}`;
}

async function seedReview(venueId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) {
  return ReviewModel.create({
    venueId,
    userId,
    rating: 5,
    comment: 'Great place to host an event',
    status: 'visible',
    hideRequestStatus: 'none',
  });
}

describe('POST /reviews/:id/moderate (admin)', () => {
  async function seedFreshReview(): Promise<string> {
    const review = await seedReview(new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId());
    return review._id.toString();
  }

  it('should reject unauthenticated request with 401', async () => {
    const reviewId = await seedFreshReview();

    const response = await request(app)
      .post(`${API}/${reviewId}/moderate`)
      .send({ action: 'remove', reason: 'Inappropriate content' });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('should reject non-admin user with 401/403', async () => {
    const reviewId = await seedFreshReview();
    const session = await createAuthenticatedSession();

    const response = await request(app)
      .post(`${API}/${reviewId}/moderate`)
      .set('Cookie', [session.cookieHeader])
      .send({ action: 'remove', reason: 'Inappropriate content' });

    expect([401, 403]).toContain(response.status);
    expect(response.body.success).toBe(false);
  });

  it('should remove a review when moderated by admin', async () => {
    const reviewId = await seedFreshReview();
    const cookie = await createAdminCookie();

    const response = await request(app)
      .post(`${API}/${reviewId}/moderate`)
      .set('Cookie', [cookie])
      .send({ action: 'remove', reason: 'Inappropriate content detected' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const updated = await ReviewModel.findById(reviewId).exec();
    expect(updated?.status).toBe('removed');
    expect(updated?.moderatedBy).toBeTruthy();
    expect(updated?.moderatedAt).toBeTruthy();
  });

  it('should restore a removed review when moderated by admin', async () => {
    const reviewId = await seedFreshReview();
    const cookie = await createAdminCookie();

    const response = await request(app)
      .post(`${API}/${reviewId}/moderate`)
      .set('Cookie', [cookie])
      .send({ action: 'restore' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const updated = await ReviewModel.findById(reviewId).exec();
    expect(updated?.status).toBe('visible');
    expect(updated?.moderationReason).toBeNull();
  });

  it('should reject an invalid action with 400', async () => {
    const reviewId = await seedFreshReview();
    const cookie = await createAdminCookie();

    const response = await request(app)
      .post(`${API}/${reviewId}/moderate`)
      .set('Cookie', [cookie])
      .send({ action: 'nuke' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('should reject remove without a reason with 400', async () => {
    const reviewId = await seedFreshReview();
    const cookie = await createAdminCookie();

    const response = await request(app)
      .post(`${API}/${reviewId}/moderate`)
      .set('Cookie', [cookie])
      .send({ action: 'remove' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
