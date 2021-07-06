const Category = require('../models/Category')

module.exports = async (req, res, next) => {
  res.locals.categories = await Category.find().limit(5)
  next()
}