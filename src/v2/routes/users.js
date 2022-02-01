const express = require('express')
const route = express.Router()
const userController = require('../controller/users')
const validator = require('../middleware/validation')
const authenticator = require('../middleware/authentication')
const {upload} = require('../middleware/uploader')
const {hitCacheUserEmail, clearRedisUser, hitCacheUserListByList} = require('../middleware/redis')

route.post('/signup', validator.userInputValidation, clearRedisUser, userController.signup)
route.post('/login', clearRedisUser, userController.login)
route.post('/profile-picture', authenticator.userTokenVerification, upload.single('profile_picture'), clearRedisUser, userController.uploadProfilePicture)
route.post('/reset-user-password', userController.resetUserPasswordEmailForm)
route.get('/email-verification/:token', authenticator.emailTokenVerification)
route.get('/email-reset-password-verification/:token', authenticator.resetPasswordEmailTokenVerification, userController.resetUserPassword)
route.get('/details', authenticator.userTokenVerification, hitCacheUserEmail, userController.getUserDetails)
route.put('/update', authenticator.userTokenVerification, clearRedisUser, userController.updateUserDetails)
route.delete('/delete', authenticator.isAdmin, clearRedisUser, userController.deleteUser)

module.exports = route