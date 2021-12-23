const express = require('express');
const route = express.Router()
const usersController = require('../controllers/users.js')
const validation = require('../middleware/common')

route.get('/', usersController.getUsers)
// route.get('/:id', usersController.userDetails)
route.post('/signup', validation.insertValidation, usersController.signup)
route.post('/login', usersController.login)
route.put('/update/:id', usersController.updateUser)
route.delete('/delete/:id', usersController.deleteUser)

module.exports = route