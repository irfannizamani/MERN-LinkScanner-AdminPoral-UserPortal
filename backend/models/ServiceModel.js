const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  url: {
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

module.exports = mongoose.model('Service', serviceSchema);
