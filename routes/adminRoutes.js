const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const RfqLead = require('../models/RfqLead');
const Reel = require('../models/Reel');
const HeroBanner = require('../models/HeroBanner');

// 1. GET ALL PRODUCTS (For Admin Table)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. ADD NEW PRODUCT (CMS)
router.post('/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct); // Ensure it returns the saved product object directly
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. UPDATE PRODUCT (Price, MOQ, Details Change)
router.put('/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. DELETE PRODUCT
router.delete('/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. VIEW ALL B2B WHOLESALE RFQ LEADS (Submitted from Popups)
router.get('/leads', async (req, res) => {
  try {
    const leads = await RfqLead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. SUBMIT RFQ LEAD (Public endpoint used by Frontend forms)
router.post('/rfq', async (req, res) => {
  try {
    const newLead = new RfqLead(req.body);
    await newLead.save();
    res.status(201).json({ message: "RFQ submitted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 7. GET ALL REELS (For Frontend Display)
router.get('/reels', async (req, res) => {
  try {
    const reels = await Reel.find().sort({ createdAt: -1 });
    res.json(reels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. ADD NEW REEL
router.post('/reels', async (req, res) => {
  try {
    const newReel = new Reel(req.body);
    const savedReel = await newReel.save();
    res.status(201).json(savedReel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 9. UPDATE REEL
router.put('/reels/:id', async (req, res) => {
  try {
    const updatedReel = await Reel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedReel) return res.status(404).json({ error: "Reel not found" });
    res.json(updatedReel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 10. DELETE REEL
router.delete('/reels/:id', async (req, res) => {
  try {
    const deletedReel = await Reel.findByIdAndDelete(req.params.id);
    if (!deletedReel) return res.status(404).json({ error: "Reel not found" });
    res.json({ message: "Reel deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11. GET ALL HERO BANNERS
router.get('/hero-banners', async (req, res) => {
  try {
    const banners = await HeroBanner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 12. GET ACTIVE HERO BANNERS (For Frontend)
router.get('/hero-banners/active', async (req, res) => {
  try {
    const banners = await HeroBanner.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 13. CREATE HERO BANNER
router.post('/hero-banners', async (req, res) => {
  try {
    const newBanner = new HeroBanner(req.body);
    const savedBanner = await newBanner.save();
    res.status(201).json(savedBanner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 14. UPDATE HERO BANNER
router.put('/hero-banners/:id', async (req, res) => {
  try {
    const updatedBanner = await HeroBanner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedBanner) return res.status(404).json({ error: "Banner not found" });
    res.json(updatedBanner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 15. DELETE HERO BANNER
router.delete('/hero-banners/:id', async (req, res) => {
  try {
    const deletedBanner = await HeroBanner.findByIdAndDelete(req.params.id);
    if (!deletedBanner) return res.status(404).json({ error: "Banner not found" });
    res.json({ message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;