const express = require('express');
const route = express.Router()

const userRouter = require('./users')
const contactRouter = require('./contacts')
const transactionRouter = require('./transactions')

route.use('/users', userRouter)
route.use('/contacts', contactRouter)
route.use('/transactions', transactionRouter)

module.exports = route