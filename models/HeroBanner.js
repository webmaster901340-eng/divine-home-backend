const mongoose = require('mongoose');

const heroBannerSchema = new mongoose.Schema({
  title: { type: String, default: 'Luxury Handcrafted Home Décor & Artisan Trays' },
  subtitle: { type: String, default: 'Curated collections of handcrafted brass trays, ceramics, and luxury interior accents for dealers, distributors, and retailers across India.' },
  image: { type: String, required: true },
  ctaButton1: { type: String, default: 'EXPLORE WHOLESALE CATALOG' },
  ctaButton2: { type: String, default: 'REQUEST TRADE RFQ' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('HeroBanner', heroBannerSchema);
