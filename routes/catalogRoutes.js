const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Series = require('../models/Series');
const DesignName = require('../models/DesignName');

// ==========================================
// CATEGORY ROUTES
// ==========================================

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Add new category
router.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Category already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create category' });
    }
  }
});

// Delete category
router.delete('/categories/:id', async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// ==========================================
// SERIES ROUTES
// ==========================================

// Get all series
router.get('/series', async (req, res) => {
  try {
    const series = await Series.find({ isActive: true }).sort({ name: 1 });
    res.json(series);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch series' });
  }
});

// Add new series
router.post('/series', async (req, res) => {
  try {
    const { name } = req.body;
    const series = await Series.create({ name });
    res.status(201).json(series);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Series already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create series' });
    }
  }
});

// Delete series
router.delete('/series/:id', async (req, res) => {
  try {
    await Series.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Series deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete series' });
  }
});

// ==========================================
// DESIGN NAME ROUTES
// ==========================================

// Get all design names
router.get('/design-names', async (req, res) => {
  try {
    const designs = await DesignName.find({ isActive: true }).sort({ name: 1 });
    res.json(designs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch design names' });
  }
});

// Add new design name
router.post('/design-names', async (req, res) => {
  try {
    const { name } = req.body;
    const design = await DesignName.create({ name });
    res.status(201).json(design);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Design name already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create design name' });
    }
  }
});

// Delete design name
router.delete('/design-names/:id', async (req, res) => {
  try {
    await DesignName.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Design name deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete design name' });
  }
});

module.exports = router;
