const User = require('../models/user')

const express = require('express')
const { body } = require('express-validator')

const router = express.Router()
const authControllers = require('../controllers/auth')
const authProtector = require('../middlewares/auth')

router
    .post('/register', [
        body('email', 'Enter valid email')
            .notEmpty({ ignore_whitespace: true })
            .normalizeEmail({ all_lowercase: true })
            .isEmail()
            .trim()
            .custom(async (value, { req }) => {
                const user = await User.findOne({ email: value })
                if (user) {
                    throw new Error('Email address already in use, try another one')
                }
            }),
        body('password', 'Provide a password')
            .notEmpty({ ignore_whitespace: true })
    ],
        authControllers.postRegister)
    .post("/login", authControllers.postLogin)

    .post('/change-password', authProtector.isAuth, [
        body('password')
            .notEmpty()
            .withMessage('Provide a valid password please!')
            .custom(async (value, { req }) => {
                const user = await User.findOne({ _id: req.userId })
                if (!user) {
                    throw new Error('Not authenticated')
                }
                req.usree = user
            })
            .withMessage('Login first')
            .custom((value, { req }) => {
                if (req.usree && (value === req.usree.password)) {
                    throw new Error('New password can not be the same with new one')
                }
                return true
            })
            .withMessage('Use different password with previous one')
    ],
        authControllers.postChangePassword)

module.exports = router