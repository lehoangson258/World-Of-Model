const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    match: /.+\@.+\..+/,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  bankName: {
    type: String,
    uppercase: true
  },
  bankNumber: {
    type: String,
  },
  address: {
    details: String,
    company: String,
    city: String,
    district: String,
    ward: String,
  },
  role: {
    type: String,
    default: 'MEMBER',
    enum: ['SUPER_ADMIN', 'ADMIN', 'MEMBER']
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('User', UserSchema)