const express = require('express');
const route = express.Router()
const usersController = require('../controllers/adminUsers.js')

route.get('/', usersController.getUsers)
route.post('/', usersController.createUser)
route.put('/update/:id', usersController.updateUser)
route.delete('/delete/:id', usersController.deleteUser)

route.get('/accounts', usersController.getAccounts)
route.put('/account/update/:id', usersController.updateAccount)

route.get('/transactions', usersController.getTransactions)
route.put('/transaction/update/:id', usersController.updateTransaction)
module.exports = route