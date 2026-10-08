const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  title: String,
  url: String,
  videoUrl: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reel', reelSchema);
