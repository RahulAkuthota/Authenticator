const { verifyToken } = require('../utils/auth');
const Developer = require('../models/Developer');
const User = require('../models/User');

const requireDevAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (decoded.role !== 'developer') {
      return res.status(403).json({ error: 'Forbidden: Requires developer role' });
    }

    const dev = await Developer.findById(decoded.id);
    if (!dev) {
      return res.status(401).json({ error: 'Unauthorized: Developer not found' });
    }

    req.developer = dev;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

const requireUserAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (decoded.role !== 'user') {
      return res.status(403).json({ error: 'Forbidden: Requires user role' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    // Optional: verify that the user belongs to the clientId provided in headers or body if strict
    // But since the token contains appId, we can rely on that.

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

module.exports = { requireDevAuth, requireUserAuth };
