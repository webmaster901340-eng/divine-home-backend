const mongoose = require('mongoose');

const rfqSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String },
  phone: { type: String, required: true },
  email: { type: String },
  quantity: { type: String, required: true },
  city: { type: String, required: true },
  instructions: { type: String },
  status: { type: String, default: 'Pending' } // Pending, Contacted, Converted
}, { timestamps: true });

module.exports = mongoose.model('RfqLead', rfqSchema);