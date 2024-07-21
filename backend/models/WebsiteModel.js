const mongoose = require('mongoose');

const websiteSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
}, {
  timestamps: true 
});

module.exports = mongoose.model('Website', websiteSchema);
