module.exports = {
   mongodbConnectionUrl: process.env.MONGODB_CONNECTION_URL,

   // Google OAuth — the Web client ID from Google Cloud Console.
   // Used to verify that an incoming Google ID token was issued for THIS app.
   googleClientId: process.env.GOOGLE_CLIENT_ID,

   jwtSecret: process.env.JWT_SECRET,
   // Token lifetime per role. Customers stay logged in longer for convenience;
   // venue owners get a shorter session since their account manages listings.
   jwtExpiresIn: {
      customer: "7d",
      venueOwner: "1d",
      admin: "2h"
   },

   // Comma-separated list of frontend origins allowed by CORS.
   // Defaults to the Vite dev server.
   corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
};
