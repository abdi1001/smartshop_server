const { where } = require('sequelize')
const models = require('../models')
const multer = require('multer')
const path = require('path')
const { validationResult } = require('express-validator')
const { getFileNameFromUrl, deleteFile } = require('../utils/fileUtils')
const stripe = require('stripe')('sk_test_51KBoqyHNfeAI3V6vZX1iu091gxwkVXhkJLwr7RwZTEEJPYQQSS2elMQtsGUvZFWWaQqXjuFWeqirexaj9KTGx1r800VQcJcRxX')

exports.createPaymentIntent = async(req, res) => {

    const {  totalAmount } = req.body

    //ensure total amount is a valid number
    if (typeof totalAmount !== "number" || isNaN(totalAmount)) {
        return res.status(400).json({error: 'Invalid amount'})
    }

    //convert dollars into cents
    const totalAmountInCents = Math.round(totalAmount * 100)

    // use an existing customer ID if this is a returning customer
    const customer = await stripe.customers.create()

    const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id},
        {apiVersion: '2017-06-05'}
    )

    // create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmountInCents,
        currency: 'usd',
        customer: customer.id,
        automatic_payment_methods: {
            enabled: true
        }
    })

    res.json({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey: 'pk_test_51KBoqyHNfeAI3V6vNC1d7uIdfwfcJY4Ddpaj6ifcGcWDBiYKj2EJ1pYn6gHcSVbtRXIZJxwvr4KNzYyJIcA89NPa00ijsycmBd'
    })
}