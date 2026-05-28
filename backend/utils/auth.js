const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';
const JWT_EXPIRES_IN = '1h'; // Short lived access token
const REFRESH_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000; // 7 days

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function generateRefreshToken() {
  return require('crypto').randomBytes(40).toString('hex');
}

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  REFRESH_EXPIRES_IN,
  generateToken,
  verifyToken,
  generateRefreshToken,
};
