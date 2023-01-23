const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
require('dotenv').config()

const app = express()

// ENV DATAS
const DATABASE_URL = process.env.LOCAL_URL
const PORT = process.env.PORT


const authRoutes = require('./routes/auth')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

app.use('/auth', authRoutes)

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;

    console.log(message)
    res.status(status).json({ message })
})

// DATABASE CONNECTION
mongoose.set("strictQuery", false)
mongoose
    .connect(DATABASE_URL)
    .then(() => {
        app.listen(PORT, () => console.log('Listening'))
    })
    .catch(err => {
        console.log(err)
        process.exit(1)
    })
