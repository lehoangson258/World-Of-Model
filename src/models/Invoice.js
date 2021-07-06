const mongoose = require('mongoose');
const InvoiceSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [{
    pro_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    amount: {
      type: Number,
    }
  }],
  totalItems: {
    type: Number,
  },
  totalMoney: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Invoice', InvoiceSchema)