const express = require('express');
const route = express.Router()
const usersController = require('../controllers/users.js')
const validator = require('../middleware/common')

route.get('/', usersController.getUsers)
// route.get('/:id', usersController.userDetails)
route.post('/signup', validator.userInputValidation, usersController.signup)
route.post('/login', usersController.login)
route.get('/:id', usersController.getUserById)
route.put('/update/:id', validator.userInputValidation, usersController.updateUser)
route.delete('/delete/:id', usersController.deleteUser)

module.exports = route