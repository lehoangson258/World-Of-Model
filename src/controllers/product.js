const Product = require('../models/Product');
const Category = require('../models/Category');
const Cart = require('../models/Cart');

const indexProduct = async (req, res) => {
    try {
        const pagination = {
            page: Number(req.query.page) || 1,
            perPage: 10,
        }
        const noPage = (pagination.perPage * pagination.page) - pagination.perPage

        const products = await Product.find().populate({
            path: "cat_id"
        }).skip(noPage).limit(pagination.perPage).sort({
            "_id": -1
        })
        const countProducts = await Product.countDocuments()
        res.render('admin/product', {
            products: products,
            current: pagination.page,
            pages: Math.ceil(countProducts / pagination.perPage),

        })
    } catch (error) {
        console.log(error);
    }
}

const addProduct = async (req, res) => {
    const dataCategory = await Category.find()
    res.render('admin/add_product', {
        categories: dataCategory,
        error: null,
        message: null
    })
}

const newProduct = async (req, res) => {
    try {
        const product = {
            title: req.body.title,
            price: req.body.price,
            status: req.body.status,
            quantity: req.body.quantity,
            image: req.files,
            cat_id: req.body.cat_id,
            description: req.body.description,
        }
        const nameImage = product.image.map(file => {
            return file.originalname
        })
        const dataCategory = await Category.find().lean()

        const createProduct = new Product({
            title: product.title,
            price: product.price,
            quantity: product.quantity,
            status: product.status,
            image: nameImage,
            cat_id: product.cat_id,
            description: product.description
        })
        const saveProduct = await createProduct.save()
        res.render('admin/add_product', {
            message: "Add Success",
            error: null,
            categories: dataCategory
        })
    } catch (error) {
        res.render('admin/add_product', {
            error: error.message,
            message: null,
            categories: dataCategory
        })
    }
}

const editProduct = async (req, res) => {
    const product = await findIdProduct(req.params.id)
    const dataCategory = await Category.find()
    res.render('admin/edit_product', {
        categories: dataCategory,
        product: product,
        error: null,
        message: null
    })
}

const updateProduct = async (req, res) => {
    try {
        const product = {
            title: req.body.title,
            price: req.body.price,
            status: req.body.status,
            quantity: req.body.quantity,
            image: req.files,
            cat_id: req.body.cat_id,
            description: req.body.description,
        }
        const nameImage = product.image.map(file => {
            return file.originalname
        })
        const dataProduct = await findIdProduct(req.params.id)
        const dataCategory = await Category.find().lean()
        const updateProduct = await Product.findByIdAndUpdate({
            _id: req.params.id
        }, {
            title: product.title,
            price: product.price,
            quantity: product.quantity,
            status: product.status,
            image: nameImage,
            cat_id: product.cat_id,
            description: product.description
        })
        const updateData = await findIdProduct(req.params.id)
        res.render('admin/edit_product', {
            message: "Update thành công ",
            product: updateData,
            error: null,
            categories: dataCategory
        })
    } catch (error) {
        res.render('admin/edit_product', {
            error: error.message,
            message: null,
            product: dataProduct,
            categories: dataCategory
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.deleteOne({
            _id: req.params.id
        })
        res.redirect('/admin/product')
    } catch (error) {
        console.log(error);
    }
}

// Client 
const viewProduct = async (req, res) => {
    try {
        const pagination = {
            page: Number(req.query.page) || 1,
            perPage: 12,
        }
        const noPage = (pagination.perPage * pagination.page) - pagination.perPage

        const dataProducts = await Product.find().populate({
            path: "cat_id"
        }).skip(noPage).limit(pagination.perPage)
        const countProducts = await Product.countDocuments()
        res.render('client/products', {
            products: dataProducts,
            current: pagination.page,
            pages: Math.ceil(countProducts / pagination.perPage),
        })
    } catch (error) {
        console.error(error);
    }
}

const viewProductDetails = async (req, res) => {
    try {
        const productId = req.params.id
        const dataProduct = await Product.findById({
            _id: productId
        }).populate({path: 'cat_id'}).lean()
        const limitProduct = await Product.find().limit(4)
        res.render('client/product-details', {
            product: dataProduct,
            related: limitProduct
        })
    } catch (error) {
        console.error(error);
    }
}

const doProductDetails = async (req, res) => {
    try {
        const guestId = req.session.guestId
        const productId = req.params.id
        const pushToCart = await Cart.findOneAndUpdate({
            user_id: guestId
        }, {
            $push: {
                bag: [{
                    pro_id: productId
                }]
            }
        })
        res.redirect(`/products/details/${productId}`)
    } catch (error) {
        console.error(error);
    }
}

const findIdProduct = async (idProduct) => {
    const productId = await Product.findOne({
        _id: idProduct
    })
    return productId
}
module.exports = {
    indexProduct: indexProduct,
    addProduct: addProduct,
    newProduct: newProduct,
    editProduct: editProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    viewProduct: viewProduct,
    viewProductDetails: viewProductDetails,
    doProductDetails: doProductDetails
}