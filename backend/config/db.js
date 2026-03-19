const mongoose = require('mongoose');
const dns = require('dns');

// Use Google public DNS so SRV lookups succeed on restricted networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

/**
 * Connect to MongoDB.
 *
 * Reads MONGO_URI from environment variables, establishes a connection,
 * and terminates the process if the connection fails — a deliberate
 * choice for a medical-grade application where running without a
 * database is never acceptable.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅  MongoDB Connected Successfully — host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌  MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
