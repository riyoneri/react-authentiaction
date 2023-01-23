const User = require('../models/user')

const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.postRegister = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const error = new Error(errors.array({ onlyFirstError: true })[0].msg)
        error.statusCode = 422;
        throw error
    }

    const userData = new User({
        email: req.body.email,
        password: req.body.password
    })

    return userData.save()
        .then(() => {
            res.status(201).json({ message: 'User created successfully' })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })
}

exports.postLogin = (req, res, next) => {
    const enteredEmail = req.body.email
    const enteredPassword = req.body.password

    User.findOne({ email: enteredEmail })
        .then(user => {
            if (!user) {
                const error = new Error('User Not found')
                error.statusCode = 401;
                throw error
            }

            if (user.password !== enteredPassword) {
                const error = new Error('Incorrect email or password')
                error.statusCode = 401;
                throw error
            }

            const token = jwt.sign({
                email: user.email,
                userId: user._id.toString()
            }, process.env.JWT_SECRET, {
                expiresIn: "1h"
            })

            res.status(200).json({ token, userId: user._id.toString() })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })
}

exports.postChangePassword = (req, res, next) => {
    res.status(500).json({ message: "Madafakaaa" })
}