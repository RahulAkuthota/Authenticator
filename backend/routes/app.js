const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { requireDevAuth } = require('../middleware/authMiddleware');
const crypto = require('crypto');

router.use(requireDevAuth);

router.post('app/create', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Application name is required' });

    const clientId = `auth_${crypto.randomBytes(16).toString('hex')}`;
    const clientSecret = `sk_${crypto.randomBytes(32).toString('hex')}`;

    const app = await Application.create({
      name,
      developerId: req.developer._id,
      clientId,
      clientSecret // In production, we'd hash this or only return it once.
    });

    res.status(201).json({ app });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Application with this name already exists for your account' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('app/list', async (req, res) => {
  try {
    const apps = await Application.find({ developerId: req.developer._id }).sort({ createdAt: -1 });
    res.json({ apps });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
