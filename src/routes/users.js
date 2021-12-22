const express = require('express');
const route = express.Router()
const usersController = require('../controllers/users.js')

route.get('/', usersController.getUsers)
// route.get('/:id', usersController.userDetails)
route.post('/signup', usersController.signup)
route.post('/login', usersController.login)
route.put('/update/:id', usersController.updateUser)
route.delete('/delete/:id', usersController.deleteUser)

module.exports = route