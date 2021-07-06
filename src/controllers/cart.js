const Cart = require('../models/Cart');
const moment = require('moment');
const Invoice = require('../models/Invoice');

// Client
const viewCart = async (req, res, next) => {
  const guestId = req.session.guestId
  const cartData = await Cart.findOne({user_id: guestId}).populate({path: 'bag', populate: {path: 'pro_id', model: 'Product'}})
  res.render('client/cart', {
    cart: cartData.bag
  })
}

const removeCart = async (req, res) => {
  try {
    const productId = req.params.id
    const guestId = req.session.guestId
    const removeBag = await Cart.findOneAndUpdate({user_id: guestId}, {
      $pull: {
        bag: {
          pro_id: productId
        }
      }, 
    }, {
      new: true,
    })
    res.redirect('/cart')
  } catch (error) {
    console.error(error);
  }
}

const doCartInvoice = async (req, res) => {
  try {
    const {
      totalMoney,
      amount,
    } = req.body
    const guestId = req.session.guestId
    if (!totalMoney) return res.redirect('/cart')
    const cartData = await Cart.findOne({
      user_id: guestId
    })
    const createInvoice = new Invoice({
      user_id: guestId,
      items: cartData.bag,
      totalItems: cartData.bag.length,
      totalMoney: totalMoney
    })
    const updateCart = await Cart.updateOne({
      user_id: guestId
    }, {
      $set: {
        bag: []
      }
    })
    if (createInvoice && updateCart) await createInvoice.save()
    req.session.invoiceId = createInvoice._id
    res.redirect('/cart/invoice')
  } catch (error) {
    console.error(error);
  }
}

const viewInvoice = async (req, res) => {
  try {
    const guestId = req.session.guestId
    const invoiceId = req.session.invoiceId
    const dataInvoice = await Invoice.findOne({
      _id: invoiceId,
      user_id: guestId
    }).populate({
      path: 'user_id'
    })
    res.render('client/invoice', {
      date: moment(dataInvoice.createdAt).format('L'),
      invoice: dataInvoice
    })
  } catch (error) {
    console.error(error);
  }
}

const viewInvoiceDetails = async (req, res) => {
  try {
    const guestId = req.session.guestId
    const dataInvoice = await Invoice.find({
      user_id: guestId
    }).populate({
      path: 'items',
      populate: {
        path: 'pro_id',
        model: 'Product'
      }
    }).sort({
      "_id": -1
    })
    
    res.render('client/order-details', {dataInvoice, moment})
  } catch (error) {
    console.error(error);
  }
}


// Admin
const viewInvoiceAdmin = async (req, res) => {
  try {
    const pagination = {
      page: Number(req.query.page) || 1,
      perPage: 10,
    }
    const noPage = (pagination.perPage * pagination.page) - pagination.perPage

    const invoices = await Invoice.find().populate({
      path: 'user_id',
    }).skip(noPage).limit(pagination.perPage).sort({
      "_id": -1
    })

    const countInvoice = await Invoice.countDocuments()
    res.render('admin/invoice', {
      invoices: invoices,
      current: pagination.page,
      pages: Math.ceil(countInvoice / pagination.perPage),
    })
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  viewCart: viewCart,
  viewInvoice: viewInvoice,
  removeCart: removeCart,
  doCartInvoice: doCartInvoice,
  viewInvoiceAdmin: viewInvoiceAdmin,
  viewInvoiceDetails: viewInvoiceDetails
}