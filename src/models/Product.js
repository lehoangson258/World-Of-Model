const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
  image: {
    type: [String],
    required: true 
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
  },
  cat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'PENDING',
    enum: ['ACTIVE', 'PENDING', 'INACTIVE']
  },
}, {
  timestamps: true
})

module.exports = mongoose.model('Product', ProductSchema)