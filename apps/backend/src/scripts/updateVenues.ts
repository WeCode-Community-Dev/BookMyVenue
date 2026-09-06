import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const realisticVenues = [
  {
    name: 'Grand Hyatt Waterfront Palace',
    description: 'A luxurious waterfront hotel and convention palace overlooking the serene backwaters, ideal for grand weddings, luxury receptions, and corporate galas.',
    city: 'Kochi',
    addressLine: 'Bolgatty Island, Mulavukad',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    name: 'The Leela Kovalam Beach Resort',
    description: 'Perched on a cliff-top offering panoramic views of the Arabian Sea with private beach access and state-of-the-art banquet amenities.',
    city: 'Thiruvananthapuram',
    addressLine: 'Kovalam Beach Road, Eve’s Beach',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    name: 'Taj Malabar Resort & Heritage Spa',
    description: 'Heritage colonial architecture blending modern elegance with lush emerald lawns, premium ballrooms, and tranquil harbor views.',
    city: 'Kochi',
    addressLine: 'Willingdon Island, Malabar Road',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    name: 'Gokulam Park Grand Ballroom & Convention Centre',
    description: 'Spacious pillarless grand ballroom with world-class acoustic systems, luxury chandeliers, and lavish dining setups for 1000+ guests.',
    city: 'Kochi',
    addressLine: 'Kaloor - Kadavanthra Rd, Jawahar Nagar',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    name: 'Kumarakom Lake Luxury Resort',
    description: 'Traditional Kerala illam style luxury villas, infinity lakeside lawns, and heritage banquet halls surrounded by emerald greenery.',
    city: 'Kottayam',
    addressLine: 'Kumarakom North Post, Backwaters',
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    name: 'Bolgatty Island Heritage Palace & Lawn',
    description: 'Historic Dutch palace on an island sanctuary featuring massive outdoor green lawns for sunset weddings and mega festivals.',
    city: 'Kochi',
    addressLine: 'Mulavukad Island, Marine Drive Extension',
    images: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    name: 'Skyline Cloud9 Rooftop Lounge & Cafe',
    description: 'Panoramic skyline views with ambient mood lighting, gourmet live stations, and modern lounge seating for birthdays and social celebrations.',
    city: 'Kochi',
    addressLine: 'MG Road, Shenoys, Central Kochi',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    name: 'The Raviz Kadavu Riverside Auditorium',
    description: 'Charming riverfront amphitheater and contemporary convention hall amidst 9 acres of coconut groves with world-class hospitality.',
    city: 'Calicut',
    addressLine: 'NH 17, Calicut Bypass Road, Pantheerankavu',
    images: [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    name: 'Emerald Whispering Palms Botanical Lawns',
    description: 'Lush expansive manicured open lawns under starlit skies with fairy light canopy setups and tranquil fountain courtyards.',
    city: 'Kochi',
    addressLine: 'Seaport - Airport Rd, Kakkanad',
    images: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    name: 'Ramada Resort & Lakeside Convention',
    description: 'Exquisite 5-star lakeside retreat with floating banquet gazebos, tropical poolside event decks, and luxury suite accommodations.',
    city: 'Kochi',
    addressLine: 'PV Sreedharan Rd, Kumbalam',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
    ]
  }
];

async function main() {
  console.log('Fetching existing venues from database...');
  const venues = await prisma.venue.findMany({
    include: {
      images: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  console.log(`Found ${venues.length} venues in DB.`);

  for (let i = 0; i < venues.length; i++) {
    const venue = venues[i];
    const realistic = realisticVenues[i % realisticVenues.length];
    const indexSuffix = venues.length > realisticVenues.length ? ` (${Math.floor(i / realisticVenues.length) + 1})` : '';
    const newName = `${realistic.name}${indexSuffix}`;

    console.log(`Updating venue "${venue.name}" (ID: ${venue.id}) -> "${newName}"`);

    await prisma.venue.update({
      where: { id: venue.id },
      data: {
        name: newName,
        description: realistic.description,
        city: realistic.city,
        addressLine: realistic.addressLine
      }
    });

    // Delete old images and add new realistic venue images
    await prisma.venueImage.deleteMany({
      where: { venueId: venue.id }
    });

    for (let j = 0; j < realistic.images.length; j++) {
      await prisma.venueImage.create({
        data: {
          venueId: venue.id,
          url: realistic.images[j],
          isPrimary: j === 0,
          sortOrder: j
        }
      });
    }
  }

  console.log('All venues have been successfully updated with realistic names and real venue images!');
}

main()
  .catch((e) => {
    console.error('Error updating venues:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
