const express = require('express')
const route = express.Router()
const transactionController = require('../controller/transactions')
const topUpController = require('../controller/accounts')
const authenticator = require('../middleware/authentication')

route.post('/create', authenticator.userTokenVerification, transactionController.createTransaction)
route.post('/topup', authenticator.userTokenVerification, topUpController.topUpAccountBalance)
route.get('/transaction-history', authenticator.userTokenVerification, transactionController.getTransactionsHistory)
route.put('/update:id', authenticator.isAdmin, transactionController.updateTransaction)

module.exports = route