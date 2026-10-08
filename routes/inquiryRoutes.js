const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');

// Submit dealer RFQ form
router.post('/', async (req, res) => {
  try {
    const newInquiry = new Inquiry(req.body);
    await newInquiry.save();
    res.status(201).json({ message: 'Inquiry submitted successfully', inquiry: newInquiry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;