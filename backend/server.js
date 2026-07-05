import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import venueRoutes from './routes/venues.js';
import bookingRoutes from './routes/bookings.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/upload.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing (CORS) for external frontend clients
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Global Middlewares
app.use(express.json()); // Parse incoming JSON request payloads
app.use('/uploads', express.static('uploads')); // Serve uploaded venue photos statically

// API Route Mappings
app.use('/api/auth', authRoutes);         // Sign up, login, token generations
app.use('/api/venues', venueRoutes);       // Get venues, create, update, delete
app.use('/api/bookings', bookingRoutes);   // Core bookings & availability
app.use('/api/admin', adminRoutes);       // Admin metrics & status actions
app.use('/api/upload', uploadRoutes);       // Image uploading to static storage

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'BookMyVenue API Gateway is running smoothly',
    timestamp: new Date()
  });
});

// 404 Route Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled internal error:', err.stack);
  res.status(500).json({ message: 'Internal server error occurred' });
});

// Initialize Express Server Listening Port
app.listen(PORT, () => {
  console.log(`BookMyVenue backend server listening on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
});

