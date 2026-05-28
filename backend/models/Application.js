const mongoose = require('mongoose');
const crypto = require('crypto');

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  developerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Developer',
    required: true,
  },
  clientId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  clientSecret: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Ensure one developer can't have duplicate app names (optional, but good for UX)
applicationSchema.index({ developerId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
