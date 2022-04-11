const express = require('express')
const route = express.Router()
const userController = require('../controller/users')
const validator = require('../middleware/validation')
const authenticator = require('../middleware/authentication')
const {upload} = require('../middleware/uploader')

// const {hitCacheUserEmail, clearRedisUser, hitCacheUserListByList} = require('../middleware/redis')

// route.post('/signup', validator.userInputValidation, clearRedisUser, userController.signup)
// route.post('/login', clearRedisUser, userController.login)
// route.post('/profile-picture', authenticator.userTokenVerification, upload.single('profile_picture'), clearRedisUser, userController.uploadProfilePicture)
// route.post('/reset-user-password', userController.resetUserPasswordEmailForm)
// route.post('/email-verification/', authenticator.emailTokenVerification)
// route.post('/email-reset-password-verification/', validator.resetPasswordValidation, authenticator.resetPasswordEmailTokenVerification, userController.resetUserPassword)
// route.get('/details', authenticator.userTokenVerification, hitCacheUserEmail, userController.getUserDetails)
// route.put('/update', authenticator.userTokenVerification, clearRedisUser, userController.updateUserDetails)
// route.delete('/delete', authenticator.isAdmin, clearRedisUser, userController.deleteUser)

route.post('/signup', validator.userInputValidation, userController.signup)
route.post('/login', userController.login)
route.post('/profile-picture', authenticator.userTokenVerification, upload.single('profile_picture'), userController.uploadProfilePicture)
route.post('/reset-user-password', userController.resetUserPasswordEmailForm)
route.post('/email-verification/:token', authenticator.emailTokenVerification)
route.post('/email-reset-password-verification/', validator.resetPasswordValidation, authenticator.resetPasswordEmailTokenVerification, userController.resetUserPassword)
route.get('/details', authenticator.userTokenVerification, userController.getUserDetails)
route.put('/update', authenticator.userTokenVerification, userController.updateUserDetails)
route.delete('/delete', authenticator.isAdmin, userController.deleteUser)
route.put('/new-phone', authenticator.userTokenVerification, userController.updateUserPhoneNumber)
route.put('/new-password', authenticator.userTokenVerification, userController.changeUserPassword)
route.put('/new-pin', authenticator.userTokenVerification, userController.changeUserPin)


module.exports = route