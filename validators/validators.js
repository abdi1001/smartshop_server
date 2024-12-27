const { body, param } = require('express-validator')


const productValidator = [
    body('name', 'name cannot be empty.').not().isEmpty(),
    body('description', 'description cannot be empty.').not().isEmpty(),
    body('price', 'price cannot be empty.').not().isEmpty(),
    body('photo_url').notEmpty().withMessage('photoUrl cannot be empty.')
]

const deleteProductValidator = [
    param('productId')
        .notEmpty().withMessage('Product Id is required.')
        .isNumeric().withMessage('product Id must be a number.')
]

const updateProductValidator = [
    param('productId')
        .notEmpty().withMessage('Product Id is required.')
        .isNumeric().withMessage('product Id must be a number.'),
    body('name', 'name cannot be empty.').not().isEmpty(),
    body('description', 'description cannot be empty.').not().isEmpty(),
    body('price', 'price cannot be empty.').not().isEmpty(),
    body('photo_url').notEmpty().withMessage('photoUrl cannot be empty.'),
    body('user_id', 'user Id cannot be empty.')
        .notEmpty().withMessage('user Id  is required.')
        .isNumeric().withMessage('user Id  must be a number.')
]

const updateUserValidator = [
    body('first_name', 'first name cannot be empty.').notEmpty(),
    body('last_name', 'last name cannot be empty.').notEmpty(),
    body('street', 'street cannot be empty.').notEmpty(),
    body('city', 'city cannot be empty.').notEmpty(),
    body('state', 'state cannot be empty.').notEmpty(),
    body('zip_code', 'zip code cannot be empty.').notEmpty(),
    body('country', 'country cannot be empty.').notEmpty()
]


const validateCreateOrder = [
    body('total').isFloat({ gt: 0 }).withMessage('total must be greater than 0'),
    body('order_items').isArray({ min: 1 }).withMessage('order items must be non-empty array'),
    body('order_items.*.product_id').isInt({ gt: 0 }).withMessage('Each order item must have a valid product id'),
    body('order_items.*.quantity').isInt({ gt: 0 }).withMessage('Each order item must have a valid quantity greater than 0'),
    body('order_items').custom((items) => {
        if (!Array.isArray(items) || items.length === 0) {
            throw new Error('Order_items must be a non-empty array')
        }
        items.forEach(item => {
            if (!item.product_id || !item.quantity) {
                throw new Error('Each order item must have a product_id and quantity')
            }
        })
        return true
    })
]

const registerValidator = [
    body('username', 'username cannot be empty').not().isEmpty(),
    body('password', 'password cannot be empty').not().isEmpty()
]

const loginValidator = [
    body('username', 'username cannot be empty').not().isEmpty(),
    body('password', 'password cannot be empty').not().isEmpty()
]

module.exports = {
    productValidator, deleteProductValidator, 
    updateProductValidator, updateUserValidator, 
    validateCreateOrder,
    registerValidator, loginValidator
}