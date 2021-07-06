const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Invoice = require('../models/Invoice');

const adminDashBoard = async (req, res) => {
  try {
    const data = {
      user: await User.find(),
      products: await Product.find(),
      category: await Category.find(),
    }
    const invoice = await Invoice.find()
    const income = invoice.reduce((total, item) => {
      return total + item.totalMoney
    }, 0)
    res.render('admin/dashboard', {
      products: data.products.length,
      category: data.category.length,
      users: data.user.length,
      income: income
    })

  } catch (error) {
    console.error(error);
  }
}

// Client
const clientDashBoard = async (req, res) => {
  try {
    res.render('client/index', {
      hotToys: await FindProductWithCategory('Hot Toys'),
      hasbroPulse: await FindProductWithCategory('Hasbro Pulse'),
      banDai: await FindProductWithCategory('Bandai'),
      deLuxe: await FindProductWithCategory('Deluxe'),
      laTest: await FindProductWithCategory('Latest'),
      marVel: await FindProductWithCategory('Marvel')
    })
  } catch (error) {
    console.error(error);
  }
}

async function FindProductWithCategory(nameCategory) {
  const catId = await Category.findOne({name: nameCategory}).lean()
  if(catId) return await Product.find({cat_id: catId._id}).limit(4).lean()
}

const viewCategory = async (req, res) => {
  try {
    const pagination = {
      page: Number(req.query.page) || 1,
      perPage: 12,
    }
    const noPage = (pagination.perPage * pagination.page) - pagination.perPage
    const categoryId = req.params.id
    const categoryName = await Category.findById(categoryId)
    const products = await Product.find({
      cat_id: categoryId
    }).skip(noPage).limit(pagination.perPage).sort({
      "_id": -1
    })
    const countProducts = await Product.countDocuments({
      cat_id: categoryId
    })
    const fullUrl = `category/${req.params.categoryName}/${req.params.id}` 
    res.render('client/category', {
      categoryName: categoryName.name,
      products: products,
      current: pagination.page,
      pages: Math.ceil(countProducts / pagination.perPage),
      namePage: fullUrl
    })
  } catch (error) {
    console.error(error);
  }
}

const viewSearch = async (req, res) => {
  try {
    
    const keyword = req.query.keyword || ''
    if (!keyword) return res.redirect('/')
    const regex = new RegExp(escapeRegex(keyword), 'gi')
    const products = await Product.find({
      title: regex
    })
    res.render('client/search', {
      keyword: keyword,
      products: products,
    })
  } catch (error) {
    console.error(error);
  }
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}

module.exports = {
  adminDashBoard: adminDashBoard,
  clientDashBoard: clientDashBoard,
  viewCategory: viewCategory,
  viewSearch: viewSearch
}

