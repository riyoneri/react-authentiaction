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

            const tokenExpirationTime = 3600
            const token = jwt.sign({
                email: user.email,
                userId: user._id.toString()
            }, process.env.JWT_SECRET, {
                expiresIn: tokenExpirationTime
            })

            res.status(200).json({
                tokenData: {
                    token: token,
                    expirationTime: tokenExpirationTime * 1000
                },
                userId: user._id.toString()
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })
}

exports.postChangePassword = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const error = new Error(errors.array({ onlyFirstError: true })[0].msg)
        error.statusCode = 422;
        throw error
    }
    User.findOneAndUpdate({ _id: req.userId }, { password: req.body.password })
        .then(user => {
            if (!user) {
                const error = new Error('Invalid user')
                error.statusCode = 404
                throw error
            }
            res.status(202).json({ message: 'Password Updated successfully' })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })
}