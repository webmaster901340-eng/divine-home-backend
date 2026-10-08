const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products / filter by category, series, designName
router.get('/', async (req, res) => {
  try {
    const { category, series, designName } = req.query;
    let query = {};
    if (category && category !== 'All Categories') {
      query.category = category;
    }
    if (series && series !== 'All Series') {
      query.series = series;
    }
    if (designName && designName !== 'All Designs') {
      query.designName = designName;
    }
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get bestseller products
router.get('/bestsellers/all', async (req, res) => {
  try {
    const products = await Product.find({ isBestseller: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single product by ID (Quick view & Details page)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed sample products (टेस्टिंग के लिए प्रोडक्ट्स डालने के लिए)
router.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const sampleProducts = [
      {
        title: "Royal Moroccan Hammered Brass Vanity Tray",
        sku: "TR-0101",
        category: "Artisan Trays & Platters",
        badge: "BESTSELLER",
        wholesalePrice: 850,
        mrp: 2499,
        moq: "30 pcs",
        images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800"],
        description: "Mirror finishes, hand-hammered brass borders, and organic resin trays crafted for upscale home styling.",
        specifications: {
          material: "Hand-hammered Brass & Resin",
          finish: "Polished Antique Gold",
          dimensions: "32cm x 20cm",
          weight: "750g",
          packaging: "Individual bubble armor with 5-ply export carton"
        },
        isBestseller: true
      },
      {
        title: "Nordic Matte Speckled 4-Piece Ceramic Dinner Set",
        sku: "CW-0201",
        category: "Ceramics & Tableware",
        badge: "BESTSELLER",
        wholesalePrice: 680,
        mrp: 1899,
        moq: "40 sets",
        images: ["https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&q=80&w=800"],
        description: "1260°C vitrified dinner plates, noodle bowls, and barista mugs engineered for durability.",
        specifications: {
          material: "Vitrified Stoneware",
          finish: "Matte Speckled Glaze",
          dimensions: "Standard Dinner Tier",
          weight: "1.2 kg",
          packaging: "Custom molded EPS cavity protection"
        },
        isBestseller: true
      }
    ];
    await Product.insertMany(sampleProducts);
    res.json({ message: "Sample products seeded successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;