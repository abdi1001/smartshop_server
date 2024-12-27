const { where } = require('sequelize')
const models = require('../models')
const multer = require('multer')
const path = require('path')
const { validationResult } = require('express-validator')
const { getFileNameFromUrl, deleteFile } = require('../utils/fileUtils')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const uploadImage = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
        const mimeType = fileTypes.test(file.mimetype)

        if (mimeType && extname) {
            return cb(null, true)
        } else {
            cb(new Error('Only 5MB images are allowed'))
        }
    }
}).single('image')

exports.upload = async (req, res) => {
    console.log(req.file)
    uploadImage(req, res, (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message })
        }

        if (!req.file) {
            console.log("no file")
            return res.status(500).json({ success: false, message: 'No file uploaded' })
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`
        const filePath = `/api/uploads/${req.file.filename}`
        const downloadUrl = `${baseUrl}${filePath}`

        console.log(req.downloadUrl)

        return res.json({ message: 'file uploaded successfully', downloadUrl: downloadUrl, success: true })
    })
}


exports.getAllProducts = async (req, res) => {
    const products = await models.Product.findAll({})
    res.json(products)
}

exports.getMyProducts = async (req, res) => {

    try {
        const userId = req.params.userId
        const products = await models.Product.findAll({
            where: {
                user_id: userId
            }
        })

        res.json(products)
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }

}

exports.create = async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const msg = errors.array().map(error => error.msg).join(' ')
        return res.status(422).json({ success: false, message: msg })
    }

    const { name, description, price, photo_url, user_id } = req.body

    console.log(req.body)

    try {
        const newProduct = await models.Product.create({
            name,
            description,
            price,
            photo_url,
            user_id
        })

        return res.status(201).json({ success: true, product: newProduct })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }

}

exports.deleteProduct = async (req, res) => {


    console.log(req.params.productId)
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const msg = errors.array().map(error => error.msg).join(' ')
        return res.status(422).json({ success: false, message: msg })
    }

    const productId = req.params.productId

    try {
        const product = await models.Product.findByPk(productId)

        console.log("product ", product)

        if (!product) {
            return res.status(500).json({ success: false, message: 'product not found' })
        }

        const fileName = getFileNameFromUrl(product.photo_url)

        console.log(fileName)

        const result = await models.Product.destroy({
            where: {
                id: productId
            }
        })

        if (result == 0) {
            return res.status(404).json({ success: false, message: 'Product not found' })
        }

        await deleteFile(fileName)

        return res.status(200).json({ message: `product with ID ${productId} deleted successfully`, success: true })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error deleting product' })
    }

}

exports.updateProduct = async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const msg = errors.array().map(error => error.msg).join(' ')
        return res.status(422).json({ success: false, message: msg })
    }

    try {
        const { name, description, price, photo_url, user_id } = req.body

        const { productId } = req.params

        const product = await models.Product.findOne({
            where: {
                id: productId,
                user_id: user_id
            }
        })

        if (!product) {
            return res.status(404).json({ success: false, message: 'product not found' })
        }

        await product.update({
            name,
            description,
            price,
            photo_url
        })

        return res.status(200).json({ success: true, message: 'product updated successfully', product })


    } catch (error) {
        return res.status(500).json({ success: false, message: 'error updating product' })
    }

}