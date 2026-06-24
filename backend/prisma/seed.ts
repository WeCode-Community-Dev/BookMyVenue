import 'dotenv/config';
import * as crypto from 'crypto';
import { PrismaClient } from '../src/infra/database/prisma/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { AMENITIES } from '../src/constants/amenities';

// ──────────────────────────────────────────────────────────
// Password hashing (mirrors CryptoPasswordHasher in the app)
// ──────────────────────────────────────────────────────────
function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────
function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function daysAgo(days: number): Date {
  return daysFromNow(-days);
}

// ──────────────────────────────────────────────────────────
// Venue image sets
// ──────────────────────────────────────────────────────────
const VENUE_IMAGES: Record<string, string[]> = {
  grand_hall: [
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200',
    'https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=1200',
  ],
  conference: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
    'https://images.unsplash.com/photo-1560472355-536de3962603?w=1200',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200',
  ],
  wedding: [
    'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=1200',
    'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=1200',
    'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=1200',
  ],
  rooftop: [
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200',
  ],
  outdoor: [
    'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200',
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200',
  ],
  banquet: [
    'https://images.unsplash.com/photo-1555244162-803834f70033?w=1200',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
  ],
};

// ──────────────────────────────────────────────────────────
// Per-venue amenity selections (values must exist in AMENITIES)
// ──────────────────────────────────────────────────────────
const [
  WiFi, Parking, AC, Projector, Catering, Sound,
  Kitchen, Stage, Security, Pool, Generator,
  Wheelchair, Valet, Bridal, Lockers, DanceFloor,
  OpenBar, PhotoBooth, Terrace, GreenRoom,
] = AMENITIES;

const VENUE_AMENITIES = {
  grand_hall: [WiFi, Parking, AC, Catering, Sound, Stage, Security, Generator, Valet, Bridal, DanceFloor, OpenBar],
  conference: [WiFi, Parking, AC, Projector, Catering, Sound, Generator, Wheelchair],
  wedding: [WiFi, Parking, AC, Catering, Sound, Kitchen, Stage, Security, Pool, Generator, Valet, Bridal, DanceFloor, OpenBar, PhotoBooth, GreenRoom],
  elite_biz: [WiFi, Parking, AC, Projector, Catering, Sound, Wheelchair],
  rooftop: [WiFi, AC, Sound, Security, Generator, OpenBar, Terrace],
  tech_park: [WiFi, Parking, AC, Projector, Catering, Sound, Stage, Security, Generator, Wheelchair],
  garden: [WiFi, Parking, Catering, Sound, Stage, Security, Generator, Terrace, PhotoBooth],
  banquet: [WiFi, Parking, AC, Catering, Sound, Generator, DanceFloor],
};

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('🌱  Starting database seed…\n');

    // ── 0. Clean existing data ─────────────────────────────────────
    console.log('🗑   Cleaning existing data…');
    await prisma.payments.deleteMany();
    await prisma.bookings.deleteMany();
    await prisma.venue_images.deleteMany();
    await prisma.venues.deleteMany();
    await prisma.refresh_tokens.deleteMany();
    await prisma.users.deleteMany();
    console.log('✅  Cleaned.\n');

    // ── 1. Users ───────────────────────────────────────────────────
    console.log('👤  Seeding users…');
    const hashedPassword = await hashPassword('password123');

    const admin = await prisma.users.create({
      data: {
        email: 'admin@bmv.com',
        password: hashedPassword,
        first_name: 'Super',
        last_name: 'Admin',
        phone: '+91-9000000000',
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    });

    const owner1 = await prisma.users.create({
      data: {
        email: 'owner@bmv.com',
        password: hashedPassword,
        first_name: 'Owner',
        last_name: 'Sharma',
        phone: '+91-9811234567',
        role: 'VENUE_OWNER',
        status: 'ACTIVE',
      },
    });

    const owner2 = await prisma.users.create({
      data: {
        email: 'priya.patel@bmv.com',
        password: hashedPassword,
        first_name: 'Priya',
        last_name: 'Patel',
        phone: '+91-9822345678',
        role: 'VENUE_OWNER',
        status: 'ACTIVE',
      },
    });

    const owner3 = await prisma.users.create({
      data: {
        email: 'amit.verma@bmv.com',
        password: hashedPassword,
        first_name: 'Amit',
        last_name: 'Verma',
        phone: '+91-9833456789',
        role: 'VENUE_OWNER',
        status: 'ACTIVE',
      },
    });

    const user1 = await prisma.users.create({
      data: {
        email: 'user@bmv.com',
        password: hashedPassword,
        first_name: 'John',
        last_name: 'Doe',
        phone: '+91-9844567890',
        role: 'USER',
        status: 'ACTIVE',
      },
    });

    const user2 = await prisma.users.create({
      data: {
        email: 'sneha.gupta@bmv.com',
        password: hashedPassword,
        first_name: 'Sneha',
        last_name: 'Gupta',
        phone: '+91-9855678901',
        role: 'USER',
        status: 'ACTIVE',
      },
    });

    const user3 = await prisma.users.create({
      data: {
        email: 'aryan.mehta@bmv.com',
        password: hashedPassword,
        first_name: 'Aryan',
        last_name: 'Mehta',
        phone: '+91-9866789012',
        role: 'USER',
        status: 'ACTIVE',
      },
    });

    const user4 = await prisma.users.create({
      data: {
        email: 'deepika.nair@bmv.com',
        password: hashedPassword,
        first_name: 'Deepika',
        last_name: 'Nair',
        phone: '+91-9877890123',
        role: 'USER',
        status: 'ACTIVE',
      },
    });

    const user5 = await prisma.users.create({
      data: {
        email: 'vikram.singh@bmv.com',
        password: hashedPassword,
        first_name: 'Vikram',
        last_name: 'Singh',
        phone: '+91-9888901234',
        role: 'USER',
        status: 'ACTIVE',
      },
    });

    console.log('✅  9 users created (1 admin, 3 owners, 5 users).\n');

    // ── 2. Venues (amenities stored as String[] on the venue) ──────
    console.log('🏛   Seeding venues…');

    // Owner 1 – Mumbai
    const venue1 = await prisma.venues.create({
      data: {
        owner_id: owner1.id,
        title: 'Grand Celebration Hall',
        description:
          'A stunning 5-star banquet hall nestled in the heart of Mumbai, ideal for grand weddings, corporate galas, and milestone celebrations. Features floor-to-ceiling windows with panoramic sea views, state-of-the-art lighting, and a dedicated bridal suite.',
        venue_type: 'BANQUET_HALL',
        address_line_1: '14, Marine Drive',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        postal_code: '400001',
        latitude: 18.9441,
        longitude: 72.8233,
        capacity: 500,
        price_per_day: 120000.0,
        status: 'APPROVED',
        amenities: VENUE_AMENITIES.grand_hall,
      },
    });

    const venue2 = await prisma.venues.create({
      data: {
        owner_id: owner1.id,
        title: 'Seaside Conference Centre',
        description:
          'A modern, fully-equipped conference centre overlooking the Arabian Sea. Perfect for corporate seminars, product launches, and executive off-sites. High-speed fibre internet, modular breakout rooms, and in-house catering available.',
        venue_type: 'CONFERENCE_HALL',
        address_line_1: '7, Nariman Point',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        postal_code: '400021',
        latitude: 18.9255,
        longitude: 72.8242,
        capacity: 200,
        price_per_day: 55000.0,
        status: 'APPROVED',
        amenities: VENUE_AMENITIES.conference,
      },
    });

    // Owner 2 – Delhi
    const venue3 = await prisma.venues.create({
      data: {
        owner_id: owner2.id,
        title: 'Royal Garden Palace',
        description:
          'An opulent wedding palace spread across 3 acres in South Delhi, featuring lush manicured gardens, an ornate ballroom, and a heritage courtyard. Our in-house décor team crafts bespoke experiences for each event.',
        venue_type: 'WEDDING_HALL',
        address_line_1: '22, Mehrauli Road',
        city: 'Delhi',
        state: 'Delhi',
        country: 'India',
        postal_code: '110030',
        latitude: 28.5244,
        longitude: 77.1855,
        capacity: 800,
        price_per_day: 250000.0,
        status: 'APPROVED',
        amenities: VENUE_AMENITIES.wedding,
      },
    });

    const venue4 = await prisma.venues.create({
      data: {
        owner_id: owner2.id,
        title: 'Elite Business Hub',
        description:
          'Premium co-working and event space in Connaught Place offering flexible conference rooms, a large training hall, and networking lounges. Ideal for workshops, board meetings, and company town halls.',
        venue_type: 'CONFERENCE_HALL',
        address_line_1: 'Block A, Connaught Place',
        city: 'Delhi',
        state: 'Delhi',
        country: 'India',
        postal_code: '110001',
        latitude: 28.6315,
        longitude: 77.2167,
        capacity: 150,
        price_per_day: 38000.0,
        status: 'APPROVED',
        amenities: VENUE_AMENITIES.elite_biz,
      },
    });

    const venue5 = await prisma.venues.create({
      data: {
        owner_id: owner2.id,
        title: 'The Rooftop Lounge & Events',
        description:
          'Chic open-air rooftop venue perched 14 floors above Delhi with a breathtaking city skyline backdrop. Ideal for sunset cocktail parties, private celebrations, and intimate corporate evenings.',
        venue_type: 'PARTY_HALL',
        address_line_1: '45, Cyber City Tower',
        city: 'Delhi',
        state: 'Delhi',
        country: 'India',
        postal_code: '110048',
        latitude: 28.4964,
        longitude: 77.0912,
        capacity: 100,
        price_per_day: 45000.0,
        status: 'PENDING',
        amenities: VENUE_AMENITIES.rooftop,
      },
    });

    // Owner 3 – Bangalore
    const venue6 = await prisma.venues.create({
      data: {
        owner_id: owner3.id,
        title: 'Tech Park Convention Centre',
        description:
          'A cutting-edge convention centre located in Whitefield, designed for large-scale tech conferences, hackathons, and corporate summits. Features 4K laser projection, simultaneous interpretation booths, and enterprise-grade AV infrastructure.',
        venue_type: 'CONFERENCE_HALL',
        address_line_1: 'ITPL Road, Whitefield',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        postal_code: '560066',
        latitude: 12.9784,
        longitude: 77.7477,
        capacity: 600,
        price_per_day: 95000.0,
        status: 'APPROVED',
        amenities: VENUE_AMENITIES.tech_park,
      },
    });

    const venue7 = await prisma.venues.create({
      data: {
        owner_id: owner3.id,
        title: 'Garden Grove Outdoor Events',
        description:
          'A serene 2-acre garden retreat in South Bangalore, perfect for open-air receptions, themed celebrations, and nature-inspired weddings. Features a covered pavilion, ambient lighting, and on-site parking for 150 vehicles.',
        venue_type: 'GARDEN_VENUE',
        address_line_1: '88, Bannerghatta Road',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        postal_code: '560076',
        latitude: 12.8826,
        longitude: 77.5970,
        capacity: 350,
        price_per_day: 70000.0,
        status: 'APPROVED',
        amenities: VENUE_AMENITIES.garden,
      },
    });

    const venue8 = await prisma.venues.create({
      data: {
        owner_id: owner3.id,
        title: 'Skyline Banquet & Events',
        description:
          'A modern banquet hall in Indiranagar with a contemporary design aesthetic. Accommodates up to 250 guests with flexible seating arrangements. Pending re-inspection after recent renovations.',
        venue_type: 'BANQUET_HALL',
        address_line_1: '12, 100 Feet Road, Indiranagar',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        postal_code: '560038',
        latitude: 12.9784,
        longitude: 77.6408,
        capacity: 250,
        price_per_day: 58000.0,
        status: 'REJECTED',
        amenities: VENUE_AMENITIES.banquet,
      },
    });

    console.log('✅  8 venues created.\n');

    // ── 3. Venue Images ────────────────────────────────────────────
    console.log('🖼   Seeding venue images…');

    const imageInserts: Array<{
      venue_id: string;
      image_url: string;
      sort_order: number;
    }> = [];

    const venueImageMap: Array<[string, string[]]> = [
      [venue1.id, VENUE_IMAGES.grand_hall],
      [venue2.id, VENUE_IMAGES.conference],
      [venue3.id, VENUE_IMAGES.wedding],
      [venue4.id, VENUE_IMAGES.conference],
      [venue5.id, VENUE_IMAGES.rooftop],
      [venue6.id, VENUE_IMAGES.conference],
      [venue7.id, VENUE_IMAGES.outdoor],
      [venue8.id, VENUE_IMAGES.banquet],
    ];

    for (const [venueId, urls] of venueImageMap) {
      urls.forEach((url, idx) =>
        imageInserts.push({ venue_id: venueId, image_url: url, sort_order: idx }),
      );
    }

    await prisma.venue_images.createMany({ data: imageInserts });
    console.log(`✅  ${imageInserts.length} venue images created.\n`);

    // ── 4. Bookings ────────────────────────────────────────────────
    console.log('📅  Seeding bookings…');

    const booking1 = await prisma.bookings.create({
      data: {
        user_id: user1.id,
        venue_id: venue1.id,
        booking_start: daysAgo(30),
        booking_end: daysAgo(28),
        guests_count: 300,
        total_amount: 240000.0,
        created_at: daysAgo(45),
      },
    });

    const booking2 = await prisma.bookings.create({
      data: {
        user_id: user2.id,
        venue_id: venue3.id,
        booking_start: daysAgo(60),
        booking_end: daysAgo(59),
        guests_count: 600,
        total_amount: 250000.0,
        created_at: daysAgo(75),
      },
    });

    const booking3 = await prisma.bookings.create({
      data: {
        user_id: user3.id,
        venue_id: venue6.id,
        booking_start: daysFromNow(15),
        booking_end: daysFromNow(16),
        guests_count: 400,
        total_amount: 95000.0,
        created_at: daysAgo(5),
      },
    });

    const booking4 = await prisma.bookings.create({
      data: {
        user_id: user4.id,
        venue_id: venue7.id,
        booking_start: daysFromNow(30),
        booking_end: daysFromNow(31),
        guests_count: 200,
        total_amount: 70000.0,
        created_at: daysAgo(2),
      },
    });

    const booking5 = await prisma.bookings.create({
      data: {
        user_id: user5.id,
        venue_id: venue2.id,
        booking_start: daysAgo(15),
        booking_end: daysAgo(14),
        guests_count: 80,
        total_amount: 55000.0,
        created_at: daysAgo(30),
      },
    });

    const booking6 = await prisma.bookings.create({
      data: {
        user_id: user1.id,
        venue_id: venue4.id,
        booking_start: daysFromNow(7),
        booking_end: daysFromNow(8),
        guests_count: 100,
        total_amount: 38000.0,
        created_at: new Date(),
      },
    });

    console.log('✅  6 bookings created.\n');

    // ── 5. Payments ────────────────────────────────────────────────
    console.log('💳  Seeding payments…');

    await prisma.payments.createMany({
      data: [
        {
          booking_id: booking1.id,
          provider: 'razorpay',
          provider_payment_id: 'pay_RZP_001_abc123xyz',
          amount: 240000.0,
          status: 'PAID',
          paid_at: daysAgo(29),
        },
        {
          booking_id: booking2.id,
          provider: 'razorpay',
          provider_payment_id: 'pay_RZP_002_def456uvw',
          amount: 250000.0,
          status: 'PAID',
          paid_at: daysAgo(59),
        },
        {
          booking_id: booking3.id,
          provider: 'razorpay',
          provider_payment_id: 'pay_RZP_003_ghi789rst',
          amount: 95000.0,
          status: 'PAID',
          paid_at: daysAgo(4),
        },
        {
          booking_id: booking4.id,
          provider: 'stripe',
          provider_payment_id: 'pi_stripe_004_jkl012mno',
          amount: 70000.0,
          status: 'PAID',
          paid_at: daysAgo(1),
        },
        {
          booking_id: booking5.id,
          provider: 'razorpay',
          provider_payment_id: 'pay_RZP_005_pqr345stu',
          amount: 55000.0,
          status: 'REFUNDED',
          paid_at: daysAgo(14),
        },
        {
          booking_id: booking6.id,
          provider: 'razorpay',
          provider_payment_id: null,
          amount: 38000.0,
          status: 'PENDING',
          paid_at: null,
        },
      ],
    });

    console.log('✅  6 payment records created.\n');

    // ── Summary ────────────────────────────────────────────────────
    console.log('─'.repeat(50));
    console.log('🎉  Seed complete! Summary:');
    console.log(`    • ${AMENITIES.length} amenities available (from constants)`);
    console.log(`    • 9 users`);
    console.log(`        - admin@bmv.com          (password123)`);
    console.log(`        - owner@bmv.com          (password123)`);
    console.log(`        - priya.patel@bmv.com    (password123)`);
    console.log(`        - amit.verma@bmv.com     (password123)`);
    console.log(`        - user@bmv.com           (password123)`);
    console.log(`        - sneha.gupta@bmv.com    (password123)`);
    console.log(`        - aryan.mehta@bmv.com    (password123)`);
    console.log(`        - deepika.nair@bmv.com   (password123)`);
    console.log(`        - vikram.singh@bmv.com   (password123)`);
    console.log(`    • 8 venues (5 approved, 1 pending, 1 rejected)`);
    console.log(`    • ${imageInserts.length} venue images`);
    console.log(`    • 6 bookings`);
    console.log(`    • 6 payments (4 paid, 1 refunded, 1 pending)`);
    console.log('─'.repeat(50));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
