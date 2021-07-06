const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');
const authController = require('../controllers/auth');
const authMiddleware = require('../middlerware/auth');
const userController = require('../controllers/user');
const categoryController = require('../controllers/category');
const productController = require('../controllers/product');
const contactController = require('../controllers/contact');
const cartController = require('../controllers/cart');

// Multer
const uploadMiddlerware = require('../middlerware/multer');

// Router Admin
router.get('/admin/login', authMiddleware.checkLogin, authController.viewLogin);
router.post('/admin/login', authMiddleware.checkLogin, authController.doLogin);
router.get('/admin/logout', authController.doLogout);

// Dashboard
router.get('/admin/dashboard', authMiddleware.checkAdmin, indexController.adminDashBoard);

// User
router.get('/admin/user', authMiddleware.checkAdmin, userController.viewUser);
router.get('/admin/user/add', authMiddleware.checkAdmin, userController.viewAddUser);
router.post('/admin/user/add', authMiddleware.checkAdmin, userController.newUsers);
router.get('/admin/user/edit/:id', authMiddleware.checkAdmin, userController.editUsers);
router.post('/admin/user/edit/:id', authMiddleware.checkAdmin, userController.updateUsers);
router.get('/admin/user/delete/:id', authMiddleware.checkAdmin, userController.deleteUsers);

// Category
router.get('/admin/category', authMiddleware.checkAdmin, categoryController.indexCategory);
router.get('/admin/category/add', authMiddleware.checkAdmin, categoryController.addCategory);
router.post('/admin/category/add', authMiddleware.checkAdmin, categoryController.newCategory);
router.get('/admin/category/edit/:id', authMiddleware.checkAdmin, categoryController.editCategory);
router.post('/admin/category/edit/:id', authMiddleware.checkAdmin, categoryController.updateCategory);
router.get('/admin/category/delete/:id', authMiddleware.checkAdmin, categoryController.deleteCategory);

// Product
router.get('/admin/product/', authMiddleware.checkAdmin, productController.indexProduct);
router.get('/admin/product/add', authMiddleware.checkAdmin, productController.addProduct);
router.post('/admin/product/add', uploadMiddlerware.array('image', 10), authMiddleware.checkAdmin, productController.newProduct);
router.get('/admin/product/edit/:id', authMiddleware.checkAdmin, productController.editProduct);
router.post('/admin/product/edit/:id', uploadMiddlerware.array('image', 10), authMiddleware.checkAdmin, productController.updateProduct);
router.get('/admin/product/delete/:id', authMiddleware.checkAdmin, productController.deleteProduct);

// Contact
router.get('/admin/contact', authMiddleware.checkAdmin, contactController.viewAdminContact);

router.get('/admin/invoice', authMiddleware.checkAdmin, cartController.viewInvoiceAdmin);

module.exports = router