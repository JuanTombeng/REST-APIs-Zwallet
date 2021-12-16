const express = require('express');
const route = express.Router()
const usersController = require('../controllers/adminUsers.js')

route.get('/', usersController.getUsers)
route.post('/', usersController.createUser)
route.put('/:id', usersController.updateUser)
route.delete('/:id', usersController.deleteUser)
module.exports = route