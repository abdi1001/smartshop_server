const { where } = require('sequelize')
const models = require('../models')
const multer = require('multer')
const path = require('path')
const { validationResult } = require('express-validator')
const { getFileNameFromUrl, deleteFile } = require('../utils/fileUtils')

exports.loadUserInfo = async(req,res) => {

    try {
        const userId = req.userId

        const userInfo = await models.User.findByPk(userId, {
            attributes:['id', 'first_name', 'last_name', 'street', 'city', 'state', 'zip_code', 'country']
        })
    
        if(!userInfo) {
            return res.status(500).json({ success: false, message: 'user not found' })
        }
    
        return res.status(200).json({ success: true, message: 'successs', userInfo })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }

   
           
}

exports.updateUserInfo = async(req, res) => {

    try {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            const msg = errors.array().map(error => error.msg).join(' ')
            return res.status(422).json({ success: false, message: msg })
        }

        const userId = req.userId

        const{ first_name, last_name, street, city, state, zip_code, country } = req.body

        const userInfo = await models.User.findByPk(userId, {
            attributes:['id', 'first_name', 'last_name', 'street', 'city', 'state', 'zip_code', 'country']
        })

        if(!userInfo) {
            return res.status(500).json({ success: false, message: 'user not found' })
        }

        await userInfo.update({
            first_name,
            last_name,
            street,
            city,
            state,
            zip_code,
            country
        })
        return res.status(200).json({ success: true, message: 'successs', userInfo })
        
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }
}