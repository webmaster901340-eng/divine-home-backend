const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  series: { type: String, default: 'Ellite Series' }, // नई फील्ड: जैसे Ellite Series, Leather Classic, Mangowood
  designName: { type: String, default: '' }, // नई फील्ड: जैसे Elegant Vector, Lotus Glow, Peachy Bloom
  designNo: { type: String, default: '' }, // नई फील्ड: जैसे 5001, 3009, 1110
  wholesalePrice: { type: Number, required: true }, 
  mrp: { type: Number, required: true },
  moq: { type: String, required: true, default: '30 pcs' }, 
  rating: { type: Number, default: 5 },
  reviewsCount: { type: Number, default: 46 },
  description: { 
    type: String, 
    required: false, 
    default: 'Handcrafted with premium finish for luxury hotel suites, high-end home decor boutiques, and institutional gifting curators.' 
  },
  images: [{ type: String }], // Array of image URLs / High-Res images
  badge: { type: String, default: 'BESTSELLER' },
  specs: {
    material: { type: String, default: '' },
    finish: { type: String, default: '' },
    dimensions: { type: String, default: '' }, // e.g., "18x12 inches"
    weight: { type: String, default: '' },
    packaging: { type: String, default: '' },
    moqUnit: { type: String, default: '' }
  },
  isBestseller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);