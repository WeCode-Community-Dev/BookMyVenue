import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  PrismaClient,
  Role,
  VenueAmenity,
  VenueCategory,
  VenueStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  log: ['error'],
});

const OWNER_COUNT = 15;
const TOTAL_USER_COUNT = 25;
const VENUE_COUNT = 20;
const DEFAULT_PASSWORD = 'DemoPass123!';

async function main() {
  await prisma.venueDocument.deleteMany({
    where: { venue: { owner: { email: { endsWith: '@demo.local' } } } },
  });
  await prisma.venue.deleteMany({
    where: { owner: { email: { endsWith: '@demo.local' } } },
  });
  await prisma.profile.deleteMany({
    where: { user: { email: { endsWith: '@demo.local' } } },
  });
  await prisma.user.deleteMany({
    where: { email: { endsWith: '@demo.local' } },
  });

  const owners: Array<{ email: string; name: string; city: string }> = [];
  const regularUsers: Array<{ email: string; name: string; city: string }> = [];

  for (let index = 1; index <= OWNER_COUNT; index += 1) {
    owners.push({
      email: `venueowner${index.toString().padStart(2, '0')}@demo.local`,
      name: `Venue Owner ${index}`,
      city: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai'][
        (index - 1) % 5
      ],
    });
  }

  for (let index = 1; index <= TOTAL_USER_COUNT - OWNER_COUNT; index += 1) {
    regularUsers.push({
      email: `user${index.toString().padStart(2, '0')}@demo.local`,
      name: `Guest User ${index}`,
      city: ['Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'][
        (index - 1) % 5
      ],
    });
  }

  const allUsers = [
    ...owners.map((owner) => ({ ...owner, role: Role.VENUE_OWNER })),
    ...regularUsers.map((user) => ({ ...user, role: Role.USER })),
  ];

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  const createdUsers = [] as Array<{ id: string; role: Role }>;

  for (const user of allUsers) {
    const createdUser = await prisma.user.create({
      data: {
        email: user.email,
        passwordHash: hashedPassword,
        role: user.role,
        isEmailVerified: true,
        profile: {
          create: {
            name: user.name,
            city: user.city,
            address: `${user.city} Demo Street ${Math.floor(Math.random() * 100) + 1}`,
            country: 'India',
          },
        },
      },
    });

    createdUsers.push({ id: createdUser.id, role: createdUser.role });
  }

  const venueOwners = createdUsers.filter(
    (user) => user.role === Role.VENUE_OWNER,
  );
  const venueNames = [
    'Grand Aura Hall',
    'Silverline Banquet',
    'Royal Terrace',
    'Ocean View Event Space',
    'Bloom Garden Venue',
    'Citylight Convention Hall',
    'Maple Leaf Banquets',
    'Sunset Palace',
    'The Plaza Hall',
    'Evergreen Resort',
    'Luxe Event Center',
    'Harbor Lane Venue',
    'The Meadow House',
    'Golden Peak Banquet',
    'Velvet Court',
    'Noble Gardens',
    'Skyline Events',
    'White Orchid Hall',
    'Crown Plaza Venue',
    'The Heritage Deck',
  ];

  const cities = [
    'Mumbai',
    'Delhi',
    'Bengaluru',
    'Hyderabad',
    'Chennai',
    'Pune',
    'Kolkata',
  ];
  const addresses = [
    '12 Marina Road',
    '45 Connaught Place',
    '88 Brigade Road',
    '3 Jubilee Hills',
    '71 Anna Salai',
    '19 FC Road',
    '95 Park Street',
  ];

  for (let index = 0; index < VENUE_COUNT; index += 1) {
    const owner = venueOwners[index % venueOwners.length];
    const categoryPool = [
      [VenueCategory.WEDDING, VenueCategory.PARTY],
      [VenueCategory.BIRTHDAY, VenueCategory.CONFERENCE],
      [VenueCategory.AUDITORIUM, VenueCategory.MEETING],
      [VenueCategory.RESORT, VenueCategory.SPORTS],
    ];
    const amenityPool = [
      [VenueAmenity.WIFI, VenueAmenity.PARKING],
      [VenueAmenity.AIR_CONDITIONING, VenueAmenity.CATERING],
      [VenueAmenity.SOUND_SYSTEM, VenueAmenity.PROJECTOR],
      [VenueAmenity.RESTROOM, VenueAmenity.GENERATOR],
    ];

    await prisma.venue.create({
      data: {
        name: venueNames[index],
        description: `Demo venue for ${owner.id.slice(0, 8)} events and celebrations.`,
        city: cities[index % cities.length],
        address: `${addresses[index % addresses.length]} ${index + 1}`,
        capacity: [50, 100, 150, 200, 250, 300, 400][index % 7],
        price: 5000 + index * 700,
        categories: categoryPool[index % categoryPool.length],
        amenities: amenityPool[index % amenityPool.length],
        status: VenueStatus.APPROVED,
        ownerId: owner.id,
      },
    });
  }

  console.log(
    `Seeded ${allUsers.length} demo users and ${VENUE_COUNT} demo venues.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
