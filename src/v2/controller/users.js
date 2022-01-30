const bcrypt = require('bcrypt')
const { v4 : uuidv4 } = require('uuid')
const createError = require('http-errors')
const commonHelper = require('../helper/common')
const userQuery = require('../models/users')
const accountQuery = require('../models/accounts')
const client = require('../config/redis')

const signup = async (req, res, next) => {
    try {
        const {username, email, password, pin} = req.body
        const salt = await bcrypt.genSalt()
        const userId = uuidv4()
        const accountId = uuidv4()
        const hashedPassword = await bcrypt.hash(password, salt)
        const userData = {
            id : userId,
            username : username,
            email : email,
            password : hashedPassword,
            pin : pin
        }
        const accountData = {
            id : accountId,
            id_user : userId
        }
        const findEmail = await userQuery.findUserEmail(username, email)
        if (findEmail.length === 0) {
            const newUser = await userQuery.signup(userData)
            const newAccount = await accountQuery.createAccount(accountData)
            if (newUser.affectedRows > 0 && newAccount.affectedRows > 0) {
                const results = {
                    newUser : newUser,
                    newAccount : newAccount
                }
                const payload = {
                    username : username,
                    email : email
                }
                const token = commonHelper.generateToken(payload)
                results.token = token
                commonHelper.sendEmailVerification(email, token)
            }
        } else {
            return next(createError(403, 'Email is already existed. Please choose another email to signup.'))
        }
    } catch (error) {
        console.log(error)
        next(createError(500, new createError.InternalServerError()))
    }
}

const login = async (req, res, next) => {
    try {
        const {email, password} = req.body
        const data = {
            email : email,
            password : password
        }
        const findEmailUser = await userQuery.findUserEmailLogin(email)
        if (findEmailUser.length === 0) {
            commonHelper.response(res, `Login Failed`, 500, `Sorry, We cannot find your email! Please try again.`)
        } else if (findEmailUser[0].email === data.email) {
            const userLogin = await userQuery.login(data)
            if (userLogin[0].active === 1 && userLogin[0].role === 'user') {
                const checkPassword = await bcrypt.compare(data.password, userLogin[0].password)
                if (checkPassword) {
                    const payload = {
                        email : userLogin[0].email,
                        role : userLogin[0].role,
                        active : userLogin[0].active
                    }
                    const token = commonHelper.generateToken(payload)
                    userLogin[0].token = token
                    commonHelper.response(res, userLogin, 200, `Login is Successful! Welcome back ${userLogin[0].username}`)
                } else {
                    commonHelper.response(res, `Login Failed`, 500, `Sorry, your password is wrong! Please try again.`)
                }
            } else {
                commonHelper.response(res, `Login Failed`, 500, `Sorry, your accoutn is not yet activated.`)
            }
        }
    } catch (error) {
        console.log(error)
        commonHelper.response(res, `Login Failed`, 500, `Sorry, your username or password is wrong! Please try again.`)
    }
}

const resetUserPasswordEmailForm = async (req, res, next) => {
    try {
        const {email} = req.body
        const payload = {
            email : email
        }
        const token = commonHelper.generateToken(payload)
        commonHelper.sendEmailResetPasswordVerification(email, token)
    } catch (error) {
        console.log(error)
        next(createError(500, new createError.InternalServerError()))
    }
}

const resetUserPassword = async (req, res, next) => {
    try {
        const {email} = req.decoded
        const {password} = req.body
        const [user] = await userQuery.getStatusByEmail(email)
        if (user.active === 1 && user.role === 'user') {
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(password, salt)
            const result = await userQuery.resetUserPassword(hashedPassword, email, user.id)
            commonHelper.response(res, result, 200, `User ${email} reset password is completed`)
            res.redirect('http://localhost:3000/login')
        } else {
            commonHelper.response(res, `Login Failed`, 500, `Sorry, your accoutn is not yet activated.`)
        }
    } catch (error) {
        console.log(error)
        next(createError(500, new createError.InternalServerError()))
    }
}

const uploadProfilePicture = async (req, res, next) => {
    try {
        const { email, role, active} = req.decoded
        const fileName = req.file.filename
        const profile_picture = `${process.env.BASE_URL}/file/${fileName}`
        if (active === 1) {
            const result = await userQuery.uploadUserProfilePicture(email, role, profile_picture)
            commonHelper.response(res, result, 200, `User ${email}'s profile picture is updated.`, null)
        } else {
            next(createError(500, 'Your account is not yet active. Please verify your account first'))
        }
    } catch (error) {
        console.log(error)
        next(createError(500, new createError.InternalServerError()))
    }
}

const getUserDetails = async (req, res, next) => {
    try {
        const {email, role, active} = req.decoded
        if (active === 1) {
            const result = await userQuery.getUserDetails(email, role)
            await client.setEx(`user/:${email}`, 60 * 60, JSON.stringify(result))
            commonHelper.response(res, result, 200, `User ${email} details:`, null)
        }
    } catch (error) {
        console.log(error)
        next(createError(500, new createError.InternalServerError()))
    }
}


module.exports = {
    signup,
    login,
    resetUserPasswordEmailForm,
    resetUserPassword,
    uploadProfilePicture,
    getUserDetails
}