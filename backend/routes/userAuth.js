const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Application = require('../models/Application');
const RefreshToken = require('../models/RefreshToken');
const { generateToken, generateRefreshToken, REFRESH_EXPIRES_IN, verifyToken } = require('../utils/auth');
const { requireUserAuth } = require('../middleware/authMiddleware');

// Middleware to extract and validate clientId
const requireClientId = async (req, res, next) => {
  const clientId = req.headers['x-client-id'] || req.body.clientId;
  if (!clientId) return res.status(400).json({ error: 'clientId is required' });

  try {
    const app = await Application.findOne({ clientId });
    if (!app) return res.status(401).json({ error: 'Invalid clientId' });
    req.app = app;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

router.post('/signup', requireClientId, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const existing = await User.findOne({ email, appId: req.app._id });
    if (existing) return res.status(400).json({ error: 'User already exists in this app' });

    const user = await User.create({ email, password, appId: req.app._id });
    
    const token = generateToken({ id: user._id, role: 'user', appId: req.app._id });
    const refreshTokenStr = generateRefreshToken();

    await RefreshToken.create({
      token: refreshTokenStr,
      userId: user._id,
      appId: req.app._id,
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES_IN)
    });

    res.status(201).json({ token, refreshToken: refreshTokenStr, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', requireClientId, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, appId: req.app._id });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken({ id: user._id, role: 'user', appId: req.app._id });
    const refreshTokenStr = generateRefreshToken();

    await RefreshToken.create({
      token: refreshTokenStr,
      userId: user._id,
      appId: req.app._id,
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES_IN)
    });

    res.json({ token, refreshToken: refreshTokenStr, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'refreshToken is required' });

    const record = await RefreshToken.findOne({ token: refreshToken });
    if (!record) return res.status(401).json({ error: 'Invalid refresh token' });

    if (record.expiresAt < new Date()) {
      await RefreshToken.deleteOne({ _id: record._id });
      return res.status(401).json({ error: 'Refresh token expired' });
    }

    const user = await User.findById(record.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const token = generateToken({ id: user._id, role: 'user', appId: record.appId });
    // Rotate refresh token
    const newRefreshToken = generateRefreshToken();
    record.token = newRefreshToken;
    record.expiresAt = new Date(Date.now() + REFRESH_EXPIRES_IN);
    await record.save();

    res.json({ token, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', requireUserAuth, (req, res) => {
  res.json({ user: { id: req.user._id, email: req.user.email } });
});

router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
