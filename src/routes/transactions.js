const express = require('express');
const route = express.Router()
const transactionContoller = require('../controllers/transactions.js')

route.get('/', transactionContoller.getTransactions)
route.post('/', transactionContoller.createTransaction)
route.put('/update/:id', transactionContoller.updateTransaction)

module.exports = route