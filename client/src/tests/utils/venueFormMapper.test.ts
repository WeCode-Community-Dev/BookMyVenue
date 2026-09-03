import { describe, it, expect } from 'vitest';

function createBaseFormValues(overrides = {}) {
  return {
    VenueName: 'Grand Hall',
    VenueDescription: 'A beautiful venue',
    fullAddress: '123 Main St',
    googleMapsLink: '',
    venueType: 'hall',
    district: 'Ernakulam',
    state: 'Kerala',
    city: 'Kochi',
    pincode: '682001',
    spaceAttributes: ['ac'],
    seatingConfigurations: ['theatre'],
    maxCapacity: '200',
    bookingType: 'fixedBooking',
    workingDays: ['monday', 'friday'],
    amenities: ['parking', 'wifi'],
    contact: { name: 'John', phone: '9876543210', email: '' },
    cancellation: {
      policy: 'refundable',
      refundType: 'fullRefund',
      refundRules: [{ daysBefore: '7', refundPercentage: '100' }],
    },
    fixedPackages: [{ slotName: 'Morning', startTime: '09:00', endTime: '12:00', price: '5000' }],
    workingHours: { open: '09:00', close: '18:00' },
    flexibleBooking: { slotDuration: '60', bufferTime: '15' },
    pricing: { pricingType: 'fixedPricing', basePrice: '0', pricingRules: [] },
    blockedTimes: [],
    pricingType: 'fixedPricing',
    samePrice: '10000',
    venuePhotos: [],
    ...overrides,
  };
}

describe('mapFormToDTO', () => {
  it('should map fixed booking form values to DTO', async () => {
    const { mapFormToDTO } = await import('../../utils/venueFormMapper');
    const values = createBaseFormValues();
    const result = mapFormToDTO(values as Record<string, unknown>, ['cover.jpg', 'gallery1.jpg']);

    expect(result.name).toBe('Grand Hall');
    expect(result.description).toBe('A beautiful venue');
    expect(result.address).toBe('123 Main St');
    expect(result.venueType).toBe('hall');
    expect(result.bookingType).toBe('fixedBooking');
    expect(result.fixedPackages).toHaveLength(1);
    expect(result.fixedPackages[0]).toEqual({
      slotName: 'Morning',
      startTime: '09:00',
      endTime: '12:00',
      price: 5000,
    });
    expect(result.coverImage).toBe('cover.jpg');
    expect(result.galleryImages).toEqual(['gallery1.jpg']);
    expect(result.maxCapacity).toBe(200);
    expect(result.contact.name).toBe('John');
    expect(result.cancellation.refundRules[0]).toEqual({ daysBefore: 7, refundPercentage: 100 });
  });

  it('should map flexible booking form values to DTO', async () => {
    const { mapFormToDTO } = await import('../../utils/venueFormMapper');
    const values = createBaseFormValues({
      bookingType: 'flexibleBooking',
      fixedPackages: [],
      samePrice: undefined,
      pricingType: 'timeBasedPricing',
      pricing: {
        pricingType: 'timeBasedPricing',
        basePrice: '2000',
        pricingRules: [
          { fromTime: '09:00', toTime: '12:00', price: '5000' },
          { fromTime: '', toTime: '', price: '' },
        ],
      },
    });
    const result = mapFormToDTO(values as Record<string, unknown>, ['cover.jpg']);

    expect(result.bookingType).toBe('flexibleBooking');
    expect(result.fixedPackages).toBeUndefined();
    expect(result.workingHours).toEqual({ open: '09:00', close: '18:00' });
    expect(result.flexibleBooking).toEqual({ slotDuration: 60, bufferTime: 15 });
    expect(result.pricing.pricingType).toBe('timeBasedPricing');
    expect(result.pricing.basePrice).toBe(2000);
    expect(result.pricing.pricingRules).toHaveLength(1);
    expect(result.pricing.pricingRules[0]).toEqual({
      fromTime: '09:00',
      toTime: '12:00',
      price: 5000,
    });
  });

  it('should handle fixedPricing with samePrice for flexible booking', async () => {
    const { mapFormToDTO } = await import('../../utils/venueFormMapper');
    const values = createBaseFormValues({
      bookingType: 'flexibleBooking',
      fixedPackages: [],
      pricingType: 'fixedPricing',
      samePrice: '15000',
      pricing: {
        pricingType: 'fixedPricing',
        basePrice: '0',
        pricingRules: [],
      },
    });
    const result = mapFormToDTO(values as Record<string, unknown>, ['cover.jpg']);
    expect(result.pricing.pricingType).toBe('fixedPricing');
    expect(result.pricing.basePrice).toBe(15000);
    expect(result.pricing.pricingRules).toEqual([]);
  });

  it('should omit googleMapsUrl when link is empty', async () => {
    const { mapFormToDTO } = await import('../../utils/venueFormMapper');
    const values = createBaseFormValues();
    const result = mapFormToDTO(values as Record<string, unknown>, ['cover.jpg']);
    expect(result.googleMapsUrl).toBeUndefined();
  });

  it('should include googleMapsUrl when link is provided', async () => {
    const { mapFormToDTO } = await import('../../utils/venueFormMapper');
    const values = createBaseFormValues({ googleMapsLink: 'https://maps.google.com/xyz' });
    const result = mapFormToDTO(values as Record<string, unknown>, ['cover.jpg']);
    expect(result.googleMapsUrl).toBe('https://maps.google.com/xyz');
  });

  it('should filter empty refund rules', async () => {
    const { mapFormToDTO } = await import('../../utils/venueFormMapper');
    const values = createBaseFormValues({
      cancellation: {
        policy: 'refundable',
        refundType: 'timeBasedRefund',
        refundRules: [
          { daysBefore: '7', refundPercentage: '100' },
          { daysBefore: '', refundPercentage: '' },
        ],
      },
    });
    const result = mapFormToDTO(values as Record<string, unknown>, ['cover.jpg']);
    expect(result.cancellation.refundRules).toHaveLength(1);
  });

  it('should handle empty maxCapacity', async () => {
    const { mapFormToDTO } = await import('../../utils/venueFormMapper');
    const values = createBaseFormValues({ maxCapacity: '' });
    const result = mapFormToDTO(values as Record<string, unknown>, ['cover.jpg']);
    expect(result.maxCapacity).toBeUndefined();
  });

  it('should set default slotDuration and bufferTime when empty', async () => {
    const { mapFormToDTO } = await import('../../utils/venueFormMapper');
    const values = createBaseFormValues({
      bookingType: 'flexibleBooking',
      fixedPackages: [],
      flexibleBooking: { slotDuration: '', bufferTime: '' },
      samePrice: '5000',
      pricingType: 'fixedPricing',
      pricing: { pricingType: 'fixedPricing', basePrice: '0', pricingRules: [] },
    });
    const result = mapFormToDTO(values as Record<string, unknown>, ['cover.jpg']);
    expect(result.flexibleBooking.slotDuration).toBe(60);
    expect(result.flexibleBooking.bufferTime).toBe(0);
  });
});
