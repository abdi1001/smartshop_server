const { where } = require('sequelize')
const models = require('../models')
const multer = require('multer')
const path = require('path')
const { validationResult } = require('express-validator')
const { getFileNameFromUrl, deleteFile } = require('../utils/fileUtils')
const cartController = require('./cartController')

exports.createOrder = async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const msg = errors.array().map(error => error.msg).join(' ')
        return res.status(422).json({ success: false, message: msg })
    }


    const userId = req.userId

    const { total, order_items } = req.body

    const transaction = await models.Order.sequelize.transaction()


    try {

        const newOrder = await models.Order.create({
            user_id: userId,
            total: total
        }, {transaction})

        const orderItemsData = order_items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            order_id: newOrder.id
        }))

        await models.OrderItem.bulkCreate(orderItemsData, {transaction})

        const cart = await models.Cart.findOne({
            where: {
                user_id: userId,
                is_active: true
            },
            attributes: ['id']
        })

        //update cart status to make it inactive
        await cartController.updateCartStatus(cart.id, false, transaction)

        // clear cart items from cart items table

        await cartController.removeCartItems(cart.id, transaction)

        // commit the transaction
        await transaction.commit()



        return res.status(201).json({success: true})
        
    } catch (error) {
        console.log(error)
        transaction.rollback()
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }


}