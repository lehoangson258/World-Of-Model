const mongoose = require('mongoose');
const CartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  bag: [{
    pro_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    amount: {
      type: Number,
      default: 1
    }
  }]
}, {
  timestamps: true
})

module.exports = mongoose.model('Cart', CartSchema)