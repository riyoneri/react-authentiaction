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
        body('password', 'Provide a message')
        .notEmpty()
    ],
        authControllers.postChangePassword)

module.exports = router