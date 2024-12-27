const { where } = require('sequelize')
const models = require('../models')
const multer = require('multer')
const path = require('path')
const { validationResult } = require('express-validator')
const { getFileNameFromUrl, deleteFile } = require('../utils/fileUtils')

exports.removeCartItems = async(cartId, transaction) => {
    return await models.CartItem.destroy({
        where: {
            cart_id: cartId
        },
        transaction
    })
}

exports.updateCartStatus = async(cartId, isActive, transaction) => {
    await models.Cart.update(
        {is_active: isActive},
    {
        where: {id: cartId, is_active: !isActive},
        transaction
    }

)
}

exports.removeCartItem = async (req, res) => {

    try {
        const { cartItemId } = req.params
        const deleteditem = await models.CartItem.destroy({
            where: {
                id: cartItemId
            }
        })

        if(!deleteditem) {
            return res.status(500).json({ message: 'Cart item not found', success: false })
        }

        return res.status(200).json({success: true})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error, success: false })
    }
}

exports.loadCart = async (req, res) => {
    try {

        const cart = await models.Cart.findOne({
            where: {
                user_id: req.userId, //make sure to update this to req.userId
                is_active: true
            },
            attributes: ['id', 'user_id', 'is_active'],
            include: [{
                model: models.CartItem,
                as: 'cartItems',
                attributes: ['id', 'cart_id', 'product_id', 'quantity'],
                include: [{
                    model: models.Product,
                    as: 'product',
                    attributes: ['id', 'name', 'description', 'price', 'photo_url', 'user_id']
                }]
            }]
        })

        return res.status(200).json({ cart: cart, success: true })

    } catch (error) {
        return res.status(500).json({ message: error, success: false })
    }
}

exports.addCartItem = async (req, res) => {

    const { productId, quantity } = req.body

    console.log(productId, quantity)

    req.userId = req.userId //make sure to update this to req.userId

    try {

        let cart = await models.Cart.findOne({
            where: {
                user_id: req.userId,
                is_active: true
            }
        })

        if (!cart) {
            cart = await models.Cart.create({
                user_id: req.userId,
                is_active: true
            })
        }

        console.log(cart)

        const [cartItem, created] = await models.CartItem.findOrCreate({
            where: {
                cart_id: cart.id,
                product_id: productId
            },
            defaults: {
                quantity: quantity
            }
        })

        //console.log(cartItem)

        if (!created) {
            // already existed
            cartItem.quantity += quantity
            await cartItem.save()
        }

        const cartItemWithProduct = await models.CartItem.findOne({
            where: {
                id: cartItem.id
            },
            attributes: ['id', 'cart_id', 'product_id', 'quantity'],
            include: [{
                model: models.Product,
                as: 'product',
                attributes: ['id', 'name', 'description', 'price', 'photo_url', 'user_id']
            }]
        })

        return res.status(201).json({ message: 'Item added to cart', success: true, cartItem: cartItemWithProduct })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error', success: false })
    }
}