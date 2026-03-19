// ============================================================
//  LifeLink — Intelligent Emergency Blood Response Network
//  Express API Server
// ============================================================

const dotenv = require('dotenv');

// Load environment variables BEFORE anything else
dotenv.config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { initSocket } = require('./services/socketService');
const testRoute = require('./routes/testRoute');
const testEmailRoute = require('./routes/testEmailRoute');
const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');
const requestRoutes = require('./routes/requestRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const donationRoutes = require('./routes/donationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const societyRoutes = require('./routes/societyRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const inviteRoutes = require('./routes/inviteRoutes');
const bloodRequestRoutes = require('./routes/bloodRequestRoutes');
const { ensureStructuredDatasets } = require('./services/datasetSeeder');

// -------------------- App Initialisation --------------------

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;

// -------------------- Core Middleware -----------------------

// Parse incoming JSON payloads
app.use(express.json());

// Parse URL-encoded payloads (form data)
app.use(express.urlencoded({ extended: true }));

// Enable Cross-Origin Resource Sharing
app.use(cors());

// -------------------- Routes --------------------------------

/**
 * @route  GET /api/health
 * @desc   Quick health-check endpoint — confirms the API is live
 */
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'LifeLink API Running',
    timestamp: new Date().toISOString(),
  });
});

// Test route
app.use('/api/test', testRoute);
app.use('/api/test-email', testEmailRoute);

// Authentication routes
app.use('/api/auth', authRoutes);

// Donor management routes
app.use('/api/donor', donorRoutes);
// Alias path for map consumer endpoint
app.use('/api/donors', donorRoutes);

// Blood request management routes
app.use('/api/request', requestRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/blood-requests', bloodRequestRoutes);

// Notification management routes
app.use('/api/notifications', notificationRoutes);

// Donation tracking routes
app.use('/api/donation', donationRoutes);

// Admin analytics routes
app.use('/api/admin', adminRoutes);

// Blood demand prediction routes
app.use('/api/predictions', predictionRoutes);

// City-scoped structured datasets
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/societies', societyRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/invite', inviteRoutes);

// -------------------- Error Handling ------------------------

// Catch 404 — must come after all valid routes
app.use(notFound);

// Global error handler — must be the very last middleware
app.use(errorHandler);

// -------------------- Start Server --------------------------

/**
 * Connect to MongoDB first, then start listening.
 * If the DB connection fails, connectDB will call process.exit(1)
 * so the server never starts in a broken state.
 */
const startServer = async () => {
  await connectDB();
  try {
    await ensureStructuredDatasets();
  } catch (error) {
    console.warn('⚠️  Dataset seeding skipped due to startup data issue:', error.message);
  }

  // Initialise Socket.io on the shared HTTP server
  initSocket(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`🚀  LifeLink API server running on port ${PORT}`);
    console.log(`    Health check → http://localhost:${PORT}/api/health`);
  });
};

startServer();

module.exports = app;
