import { describe, it, expect } from 'vitest';
import { mapFormToDTO } from '@/utils/venueFormMapper';
import type { AddVenueFormValues } from '@/types/venue.types';

describe('client venueFormMapper', () => {
  describe('mapFormToDTO', () => {
    it('should map fixed booking form values to DTO payload', () => {
      const mockForm: AddVenueFormValues = {
        VenueName: 'Royal Palace Hall',
        VenueDescription: 'Grand event hall for luxury weddings',
        venueType: 'Convention Center',
        district: 'Ernakulam',
        state: 'Kerala',
        city: 'Kochi',
        pincode: '682001',
        fullAddress: 'MG Road, Kochi',
        googleMapsLink: 'https://maps.google.com',
        coordinates: { lat: 9.9312, lng: 76.2673 },
        spaceAttributes: ['AC', 'Parking'],
        seatingConfigurations: [],
        maxCapacity: '500',
        bookingType: 'fixedBooking',
        workingDays: ['Monday', 'Tuesday', 'Wednesday'],
        fixedPackages: [
          { slotName: 'Full Day Package', startTime: '08:00', endTime: '22:00', price: 25000 },
        ],
        workingHours: { open: '', close: '' },
        flexibleBooking: { slotDuration: '', bufferTime: '' },
        pricing: { pricingType: 'fixedPricing', basePrice: 25000, pricingRules: [] },
        pricingType: 'fixedPricing',
        samePrice: 25000,
        blockedTimes: [],
        amenities: ['WiFi', 'Stage'],
        venuePhotos: [],
        existingImages: { coverImage: '', galleryImages: [] },
        contact: { name: 'Manager John', phone: '9876543210', email: 'john@example.com' },
        cancellation: { policy: 'nonRefundable', refundType: 'fullRefund', refundRules: [] },
      };

      const dto = mapFormToDTO(mockForm, ['https://res.cloudinary.com/cover.jpg']);

      expect(dto.name).toBe('Royal Palace Hall');
      expect(dto.coverImage).toBe('https://res.cloudinary.com/cover.jpg');
      if ('fixedPackages' in dto) {
        expect(dto.fixedPackages).toEqual([
          { slotName: 'Full Day Package', startTime: '08:00', endTime: '22:00', price: 25000 },
        ]);
      }
      expect(dto.maxCapacity).toBe(500);
    });
  });
});
