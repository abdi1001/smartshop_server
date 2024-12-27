const express = require ('express')
const router = express.Router()
const productController = require('../controllers/productController')
const authenticate = require('../middleware/authMiddleware')
const { deleteProductValidator, productValidator, updateProductValidator } = require('../validators/validators')


router.get('/', productController.getAllProducts)
router.get('/user/:userId',authenticate, productController.getMyProducts)
router.post('/',authenticate, productValidator,productController.create)
router.post('/upload',authenticate, productController.upload)
router.delete('/:productId',authenticate, deleteProductValidator, productController.deleteProduct)
router.put('/:productId',authenticate, updateProductValidator, productController.updateProduct)
module.exports = router