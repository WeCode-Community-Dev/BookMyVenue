require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/database");
const { corsOrigin } = require("./config/config");
const venueRoutes = require("./routes/venue");
const venueOwnerRoutes = require("./routes/venueOwner");
const categoryRoutes = require("./routes/category");
const amenityRoutes = require("./routes/amenity");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const PORT = process.env.PORT || 8000;

const app = express();

// Allow the frontend origin(s) to call the API from the browser.
app.use(cors({ origin: corsOrigin.split(",").map((o) => o.trim()) }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/venueOwner", venueOwnerRoutes);
app.use("/api/venueCategories", categoryRoutes);
app.use("/api/amenities", amenityRoutes);
app.use("/api/admin", adminRoutes);

connectDB()
   .then(() => {
      console.log("Connected to database successfully!");
      app.listen(PORT, () => {
         console.log(`Server started and listening on port ${PORT}`);
      });
   })
   .catch((err) => {
      console.log("Database connection failed: " + err.message);
   });