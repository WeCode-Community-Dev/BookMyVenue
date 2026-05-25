import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@bookmyvenue.com" },
    update: {},
    create: {
      email: "admin@bookmyvenue.com",
      password: adminPassword,
      firstName: "Admin",
      lastName: "User",
      role: UserRole.ADMIN,
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create venue owner
  const ownerPassword = await bcrypt.hash("owner123", 12);
  const owner = await prisma.user.upsert({
    where: { email: "owner@bookmyvenue.com" },
    update: {},
    create: {
      email: "owner@bookmyvenue.com",
      password: ownerPassword,
      firstName: "Venue",
      lastName: "Owner",
      role: UserRole.VENUE_OWNER,
    },
  });
  console.log("✅ Venue owner created:", owner.email);

  // Create sample venues
  const venues = [
    {
      name: "Grand Ballroom",
      description: "Elegant ballroom perfect for weddings and corporate events",
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      capacity: 500,
      pricePerHour: 500,
      amenities: ["WiFi", "Parking", "Catering", "Sound System", "Stage"],
      images: [],
      ownerId: owner.id,
    },
    {
      name: "Rooftop Garden",
      description: "Beautiful outdoor space with stunning city views",
      address: "456 Sky Avenue",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      capacity: 150,
      pricePerHour: 300,
      amenities: ["WiFi", "Bar", "Outdoor Lighting", "Heating"],
      images: [],
      ownerId: owner.id,
    },
    {
      name: "Conference Center",
      description: "Modern conference facilities with latest technology",
      address: "789 Business Park",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      capacity: 200,
      pricePerHour: 200,
      amenities: ["WiFi", "Projector", "Video Conferencing", "Whiteboard"],
      images: [],
      ownerId: owner.id,
    },
  ];

  for (const venue of venues) {
    await prisma.venue.create({ data: venue });
    console.log("✅ Venue created:", venue.name);
  }

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
