require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const devAuthRoutes = require('./routes/devAuth');
const appRoutes = require('./routes/app');
const userAuthRoutes = require('./routes/userAuth');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/dev', devAuthRoutes);
app.use('/app', appRoutes);
app.use('/auth', userAuthRoutes);

// Health check
app.get('/health', (req, res) => res.send('OK'));

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/authenticator';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
