// ============================================================
//  Auth & Role Middleware — LifeLink
//  Protects routes and enforces role-based access
// ============================================================

const jwt = require('jsonwebtoken');

// ----------------------------------------------------------------
//  authMiddleware — Verify JWT and attach decoded token payload
// ----------------------------------------------------------------
const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Accept token from Authorization: Bearer <token>
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Keep both id and _id for compatibility across controllers.
    req.user = {
      ...decoded,
      _id: decoded.id,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access',
    });
  }
};

// Backward-compatible alias used by existing routes.
const protect = authMiddleware;

// ----------------------------------------------------------------
//  authorize — Restrict access to specific roles
//  Usage:  router.get('/admin', protect, authorize('admin'), handler)
// ----------------------------------------------------------------
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied — requires one of: ${roles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = { authMiddleware, protect, authorize };
