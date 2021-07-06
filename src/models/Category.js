const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
  },
  status: {
    type: String,
    default: 'PENDING',
    enum: ['ACTIVE', 'PENDING', 'INACTIVE']
  },
}, {
  timestamps: true
})

module.exports = mongoose.model('Category', CategorySchema)