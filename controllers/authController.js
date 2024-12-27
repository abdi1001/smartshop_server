const models = require('../models')
const { Op, where } = require('sequelize')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')




exports.login = async(req,res) => {
    try {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            const msg = errors.array().map(error => error.msg).join(' and ')
            return res.status(422).json({ success: false, message: msg })
        }

        const { username, password } = req.body

        const existingUser = await models.User.findOne({
            where: {
                username: { [Op.iLike]: username }
            }
        })

        if (!existingUser) {
            return res.json({ success: false, message: 'Username or password is incorrect' })
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password)

        if(!isPasswordValid) {
            return res.json({ success: false, message: 'Username or password is incorrect' })
        }

        const token = jwt.sign({ userId: existingUser.id}, 'SECRETKEY', {expiresIn: '1h'})

        return res.status(200).json({success: true, userId: existingUser.id, username: existingUser.username, token})

    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}


exports.register = async (req, res) => {
    try {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            const msg = errors.array().map(error => error.msg).join(' and ')
            return res.status(422).json({ success: false, message: msg })
        }

        const { username, password } = req.body

        const existingUser = await models.User.findOne({
            where: {
                username: { [Op.iLike]: username }
            }
        })

        if (existingUser) {
            return res.json({ success: false, message: 'Username taken!' })
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        //create a new user
        const _ = models.User.create({
            username: username,
            password: hash
        })

        res.status(201).json({ success: true })

    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}