const express = require('express');
const route = express.Router()
const usersController = require('../controllers/users.js')
const validator = require('../middleware/common')

route.get('/', usersController.getUsers)
route.get('/:id', usersController.getUserDetails)
route.post('/signup', validator.userInputValidation, usersController.signup)
route.post('/login', usersController.login)
route.put('/update/:id', validator.userInputValidation, usersController.updateUser)
route.delete('/delete/:id', usersController.deleteUser)
route.get('/email-verification/:token', validator.emailTokenVerification)

module.exports = route