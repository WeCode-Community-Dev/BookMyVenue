import { db } from '../../db/index.js';
import { paymentsTable } from '../../models/paymentModel.js';

export const seedPayments = async () => {
  console.log('Seeding payments...');

  const paymentsData = [
    // 1. Payment for Booking 1 (Completed)
    {
      id: '550e8400-e29b-41d4-a716-446655440070',
      bookingId: '550e8400-e29b-41d4-a716-446655440050',
      amount: '70000.00',
      status: 'completed',
      razorpayOrderId: 'order_ballroom_001',
      razorpayPaymentId: 'pay_ballroom_001',
      razorpaySignature: 'sig_ballroom_001_abc123xyz',
      paidAt: new Date('2026-06-14T10:05:00Z'),
    },
    // 2. Payment for Booking 2 (Pending)
    {
      id: '550e8400-e29b-41d4-a716-446655440071',
      bookingId: '550e8400-e29b-41d4-a716-446655440051',
      amount: '3600.00',
      status: 'pending',
      razorpayOrderId: 'order_tech_001',
      razorpayPaymentId: null,
      razorpaySignature: null,
      paidAt: null,
    },
    // 3. Payment for Booking 3 (Failed)
    {
      id: '550e8400-e29b-41d4-a716-446655440072',
      bookingId: '550e8400-e29b-41d4-a716-446655440052',
      amount: '40000.00',
      status: 'failed',
      razorpayOrderId: 'order_bistro_001',
      razorpayPaymentId: 'pay_bistro_001_failed',
      razorpaySignature: null,
      paidAt: null,
    },
    // 4. Payment for Booking 4 (Failed)
    {
      id: '550e8400-e29b-41d4-a716-446655440073',
      bookingId: '550e8400-e29b-41d4-a716-446655440053',
      amount: '500.00',
      status: 'failed',
      razorpayOrderId: 'order_cozy_001',
      razorpayPaymentId: null,
      razorpaySignature: null,
      paidAt: null,
    },
    // 5. Payment for Booking 5 (Completed)
    {
      id: '550e8400-e29b-41d4-a716-446655440074',
      bookingId: '550e8400-e29b-41d4-a716-446655440054',
      amount: '35000.00',
      status: 'completed',
      razorpayOrderId: 'order_ballroom_002',
      razorpayPaymentId: 'pay_ballroom_002',
      razorpaySignature: 'sig_ballroom_002_def456uvw',
      paidAt: new Date('2026-06-14T15:20:00Z'),
    },
    // 6. Payment for Booking 6 (Completed)
    {
      id: '550e8400-e29b-41d4-a716-446655440075',
      bookingId: '550e8400-e29b-41d4-a716-446655440055',
      amount: '1200.00',
      status: 'completed',
      razorpayOrderId: 'order_cozy_002',
      razorpayPaymentId: 'pay_cozy_002',
      razorpaySignature: 'sig_cozy_002_ghi789rst',
      paidAt: new Date('2026-06-13T09:12:00Z'),
    },
    // 7. Payment for Booking 7 (Completed)
    {
      id: '550e8400-e29b-41d4-a716-446655440076',
      bookingId: '550e8400-e29b-41d4-a716-446655440056',
      amount: '1800.00',
      status: 'completed',
      razorpayOrderId: 'order_tech_002',
      razorpayPaymentId: 'pay_tech_002',
      razorpaySignature: 'sig_tech_002_jkl012opq',
      paidAt: new Date('2026-06-15T08:30:00Z'),
    },
  ];

  await db.insert(paymentsTable).values(paymentsData).onConflictDoNothing();
  console.log('✓ Payments done');
};
