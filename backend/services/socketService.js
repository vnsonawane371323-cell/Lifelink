// ============================================================
//  Socket Service — LifeLink
//  Manages Socket.io server, JWT auth, and room-based routing
// ============================================================

const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io = null;

// Map of userId → Set<socketId> (a user can have multiple tabs/devices)
const userSockets = new Map();

// ----------------------------------------------------------------
//  Initialisation
// ----------------------------------------------------------------

/**
 * Attach Socket.io to an HTTP server with JWT authentication.
 * @param {http.Server} httpServer
 * @returns {Server} The Socket.io instance
 */
function init(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
  });

  // ---- JWT auth middleware for every socket connection ----
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.query?.token;

      if (!token) {
        return next(new Error('Authentication error — no token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('Authentication error — user not found'));
      }

      // Attach user info to the socket for later use
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error — invalid token'));
    }
  });

  // ---- Connection handler ----
  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    const role = socket.user.role;

    console.log(`🔌 Socket connected: ${socket.user.name} (${role}) [${socket.id}]`);

    // Track socket → user mapping
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId).add(socket.id);

    // Join a personal room so we can target individual users
    socket.join(`user:${userId}`);

    // Join a role-based room (donor / hospital / admin / society)
    socket.join(`role:${role}`);

    // Acknowledge successful connection
    socket.emit('connected', {
      message: 'Connected to LifeLink real-time service',
      userId,
      role,
    });

    // ---- Disconnect handler ----
    socket.on('disconnect', (reason) => {
      console.log(`🔌 Socket disconnected: ${socket.user.name} [${socket.id}] — ${reason}`);

      const sockets = userSockets.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSockets.delete(userId);
        }
      }
    });
  });

  console.log('⚡ Socket.io real-time service initialised');
  return io;
}

// Alias to match initSocket naming used by some modules
const initSocket = (httpServer) => init(httpServer);

// ----------------------------------------------------------------
//  Public helpers — used by controllers
// ----------------------------------------------------------------

/**
 * Get the Socket.io server instance.
 * @returns {Server|null}
 */
function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}

/**
 * Emit an event to specific users by their MongoDB user IDs.
 * @param {string[]} userIds   Array of User _id strings
 * @param {string}   event     Event name
 * @param {object}   payload   Data to send
 */
function emitToUsers(userIds, event, payload) {
  if (!io) {
    console.warn('⚠️  Socket.io not initialised — cannot emit event');
    return;
  }

  for (const uid of userIds) {
    io.to(`user:${uid}`).emit(event, payload);
  }
}

/**
 * Emit an event to every socket in a role room.
 * @param {string} role     e.g. 'donor', 'hospital', 'admin'
 * @param {string} event    Event name
 * @param {object} payload  Data to send
 */
function emitToRole(role, event, payload) {
  if (!io) {
    console.warn('⚠️  Socket.io not initialised — cannot emit event');
    return;
  }

  io.to(`role:${role}`).emit(event, payload);
}

/**
 * Get info on currently connected sockets.
 * @returns {{ totalConnections: number, uniqueUsers: number }}
 */
function getStats() {
  return {
    totalConnections: io ? io.engine.clientsCount : 0,
    uniqueUsers: userSockets.size,
  };
}

// ----------------------------------------------------------------
//  Export
// ----------------------------------------------------------------

module.exports = {
  init,
  initSocket,
  getIO,
  emitToUsers,
  emitToRole,
  getStats,
};