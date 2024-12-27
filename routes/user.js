const express = require ('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { updateUserValidator } = require('../validators/validators')


router.put('/', updateUserValidator, userController.updateUserInfo)
router.get('/', userController.loadUserInfo)


module.exports = router