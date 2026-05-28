const express = require('express');
const router = express.Router();
const Developer = require('../models/Developer');
const { generateToken } = require('../utils/auth');

router.post('app/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const existing = await Developer.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Developer already exists' });
    }

    const dev = await Developer.create({ email, password, name });
    const token = generateToken({ id: dev._id, role: 'developer' });

    res.status(201).json({
      token,
      developer: { id: dev._id, email: dev.email, name: dev.name }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('app/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const dev = await Developer.findOne({ email });
    if (!dev) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await dev.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ id: dev._id, role: 'developer' });
    res.json({
      token,
      developer: { id: dev._id, email: dev.email, name: dev.name }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
