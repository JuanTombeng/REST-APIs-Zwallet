const express = require('express');
const route = express.Router()

const userRouter = require('./users')
const accountRouter = require('./accounts.js')
const transactionRouter = require('./transactions.js')

route.use('/users', userRouter)
route.use('/accounts', accountRouter)
route.use('/transactions', transactionRouter)

module.exports = route