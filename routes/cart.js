const express = require ('express')
const router = express.Router()
const { body, param } = require('express-validator')
const cartController = require('../controllers/cartController')
const authenticate = require('../middleware/authMiddleware')

router.post('/items', cartController.addCartItem)
router.get('/', cartController.loadCart)
router.delete('/item/:cartItemId', cartController.removeCartItem)

module.exports = router