import path from "path";
import { fileURLToPath } from "url";
import swaggerJsdoc from "swagger-jsdoc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BookMyVenue API",
      version: "1.0.0",
      description:
        "REST API for BookMyVenue, a MERN-based venue booking platform. Supports customer, provider, and admin workflows with JWT cookie authentication, venue management, availability scheduling, bookings, and Razorpay payment integration.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],
    tags: [
      { name: "Auth", description: "Authentication and user profile" },
      { name: "Venues", description: "Venue listing and management" },
      { name: "Availability", description: "Venue availability slots" },
      { name: "Bookings", description: "Booking listings" },
      { name: "Payments", description: "Razorpay payment and order flow" },
      { name: "Admin", description: "Admin dashboard and management" },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description:
            "JWT access token stored in an HTTP-only cookie named `token`. Log in via POST /api/auth/login first, then authenticated requests send this cookie automatically.",
        },
      },
    },
  },
  // Scan documentation-only modules (not routes/controllers).
  // Forward slashes required so glob matching works on Windows.
  apis: [path.join(__dirname, "../../docs/**/*.docs.js").replace(/\\/g, "/")],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
