// ============================================================
//  JWT Utility — LifeLink
//  Centralised token generation
// ============================================================

const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT containing the user's id and role.
 *
 * @param {string} id   - Mongo _id of the user
 * @param {string} role - User role (donor | hospital | society | admin)
 * @returns {string}      Signed JWT valid for 7 days
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

module.exports = generateToken;
