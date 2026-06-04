// Venue service
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db";
import { UserRole } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";

export const venueService = {
  async registerVenue(email: string, password: string) {
    const existingVenue = await prisma.user.findUnique({
      where: { email },
    });

    if (existingVenue) {
      throw new Error("Venue already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const venue = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: UserRole.VENUE_OWNER,
      },
    });

    const token = jwt.sign(
      {
        id: venue.id,
        email: venue.email,
        role: venue.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return {
      venue: {
        id: venue.id,
        email: venue.email,
        role: venue.role,
      },
      token,
    };
  },

  async loginVenue(email: string, password: string) {
    const venue = await prisma.user.findUnique({
      where: { email },
    });

    if (!venue || venue.role !== UserRole.VENUE_OWNER) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, venue.passwordHash!);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: venue.id,
        email: venue.email,
        role: venue.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return {
      venue: {
        id: venue.id,
        email: venue.email,
        role: venue.role,
      },
      token,
    };
  },
};