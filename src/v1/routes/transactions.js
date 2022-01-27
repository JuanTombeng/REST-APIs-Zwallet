const express = require('express');
const route = express.Router()
const transactionContoller = require('../controllers/transactions.js')
const validator = require('../middleware/common')

route.get('/', transactionContoller.getTransactions)
route.get('/history/:id', transactionContoller.getTransactionsHistory)
route.post('/', validator.transactionInputValidation, transactionContoller.createTransaction)
route.post('/:id', transactionContoller.getTransactionDetails)
route.put('/update/:id', transactionContoller.updateTransaction)

module.exports = route