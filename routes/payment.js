const express = require ('express')
const router = express.Router()
const { body, param } = require('express-validator')
const paymentController = require('../controllers/paymentController')
const authenticate = require('../middleware/authMiddleware')


router.post('/create-payment-intent',paymentController.createPaymentIntent)


module.exports = router