const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlerware/auth');
const indexController = require('../controllers/index');
const authController = require('../controllers/auth');
const contactController = require('../controllers/contact');
const userController = require('../controllers/user');
const productController = require('../controllers/product');
const cartController = require('../controllers/cart');

// Router Client
// Login & Register & Logout & Forgot Password
router.get('/account', authMiddleware.checkLoginClient, authController.viewLoginClient);
router.post('/register', authMiddleware.checkLoginClient, authController.registerClient);
router.post('/login', authMiddleware.checkLoginClient, authController.loginClient);
router.get('/account/details/logout', authController.logoutClient);
router.get('/account/forgot-password', authMiddleware.checkLoginClient, authController.viewChangePass);
router.post('/account/forgot-password', authController.doForgotPass);

// Dashboard
router.get('/', indexController.clientDashBoard);

// Products
router.get('/products', productController.viewProduct);
router.get('/products/details/:id', productController.viewProductDetails);
router.get('/products/details/:id/add-cart', authMiddleware.checkAccount, productController.doProductDetails);

// Contact
router.get('/contact', contactController.viewContact);
router.post('/contact', contactController.doContact);

// Account-details
router.get('/account/details', authMiddleware.checkAccount, userController.viewAccountDetails);
router.post('/account/details', authMiddleware.checkAccount, userController.doAccountDetails);
router.get('/account/details/change-password', authMiddleware.checkAccount, authController.viewChangePass);
router.post('/account/details/change-password', authMiddleware.checkAccount, authController.doChangePass);
router.get('/account/details/address', authMiddleware.checkAccount, userController.viewAddress);
router.post('/account/details/address', authMiddleware.checkAccount, userController.doAddress);
router.get('/account/details/invoice', authMiddleware.checkAccount, cartController.viewInvoiceDetails);

// Cart
router.get('/cart', authMiddleware.checkAccount, cartController.viewCart);
router.get('/cart/remove/:id', authMiddleware.checkAccount, cartController.removeCart);
router.post('/cart/invoice', authMiddleware.checkAccount, cartController.doCartInvoice);

// Invoice
router.get('/cart/invoice', cartController.viewInvoice);

// Category
router.get('/category/:categoryName/:id', indexController.viewCategory);

// Search 
router.get('/search?:keyword', indexController.viewSearch);

module.exports = router