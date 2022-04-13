const bcrypt = require('bcrypt')
const { v4 : uuidv4 } = require('uuid')
const createError = require('http-errors')
const commonHelper = require('../helper/common')
const userQuery = require('../models/users')
const accountQuery = require('../models/accounts')
// const client = require('../config/redis')

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
                console.log(token)
                commonHelper.response(res, `Pending`, 200, `Please check your email, a verification email has been send to verfity your email`)
                commonHelper.sendEmailVerification(email, token)
            }
        } else {
            commonHelper.response(res, 'Failed', 409, null, `Email is already taken. Please choose another email to signup.`)
        }
    } catch (error) {
        console.log(error)
        next({ status: 500, message: `${error.message}`})
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
            next({ status: 404, message: `Sorry, We cannot find your email! Please try again.`})
        } else if (findEmailUser[0].email === data.email) {
            const userLogin = await userQuery.login(data)
            if (userLogin[0].active === 1) {
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
                    next({ status: 401, message: `Sorry, your password is wrong! Please try again.`})
                }
            } else {
                next({ status: 403, message: `Sorry, your account is not yet activated.`})
            }
        }
    } catch (err) {
        console.log(err)
        next({ status: 500, message: `${error.message}`})
    }
}

const resetUserPasswordEmailForm = async (req, res, next) => {
    try {
        const {email} = req.body
        const payload = {
            email : email
        }
        const token = commonHelper.generateToken(payload)
        commonHelper.response(res, `Pending`, 200, `Please check your email, a verification email has been send to reset your password`)
        commonHelper.sendEmailResetPasswordVerification(email, token)
    } catch (error) {
        console.log(error)
        next({ status: 500, message: `${error.message}`})
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
            res.redirect('https://zwallet-app.vercel.app/auth/login')
        } else {
            commonHelper.response(res, `Login Failed`, 500, `Sorry, your accoutn is not yet activated.`)
        }
    } catch (error) {
        console.log(error)
        next({ status: 500, message: `${error.message}`})
    }
}

const uploadProfilePicture = async (req, res, next) => {
    try {
        const { email, role, active} = req.decoded
        const picture = req.file.filename
        console.log(picture)
        const profile_picture = `${process.env.BASE_URL}/file/${picture}`
        if (active === 1) {
            const result = await userQuery.uploadUserProfilePicture(email, role, profile_picture)
            commonHelper.response(res, result, 200, `User ${email}'s profile picture is updated.`, null)
        } else {
            next({ status: 403, message: `Your account is not yet active. Please verify your account first.`})
        }
    } catch (error) {
        console.log(error)
        next({ status: 500, message: `${error.message}`})
    }
}

const getUserDetails = async (req, res, next) => {
    try {
        const {email, role, active} = req.decoded
        if (active === 1) {
            const result = await userQuery.getUserDetails(email, role)
            // await client.setEx(`user/${email}`, 60 * 60, JSON.stringify(result))
            commonHelper.response(res, result, 200, `User ${email} details:`, null)
        } else {
            next(createError(500, 'Your account is not yet active. Please verify your account first'))
        }
    } catch (error) {
        console.log(error)
        next({ status: 500, message: `${error.message}`})
    }
}

const getUserDetailsByPhone = async (req, res, next) => {
    try {
        const {email, role, active} = req.decoded
        const phone_number = req.params.phone_number
        if (active == 1 && role == 'user') {
            const result = await userQuery.getUserIdByPhoneNumber(phone_number)
            commonHelper.response(res, result, 200, `User with phone number ${phone_number}`)
        } else {
            next({ status: 400, message: `Your account is not yet active. Please verify your account first`})
        }
    } catch (error) {
        console.log(error)
        next({ status: 500, message: `${error.message}`})
    }
}

const updateUserDetails = async (req, res, next) => {
    try {
        const {email, role, active} = req.decoded
        const {first_name, last_name, phone_number} = req.body
        const userData = {
            first_name : first_name,
            last_name : last_name,
            phone_number : phone_number
        }
        if (active === 1) {
            const result = await userQuery.updateUserDetail(userData, email, active, role)
            // await client.setEx(`user/${email}`, 60 * 60, JSON.stringify(result))
            commonHelper.response(res, result, 200, `User ${email} is updated`, null)
        } else {
            next(createError(500, 'Your account is not yet active. Please verify your account first'))
        }
    } catch (error) {
        console.log(error)
        next({ status: 500, message: `${error.message}`})
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const {role, active} = req.decoded
        const {id} = req.body
        if (active === 1 && role === 'admin') {
            const result = await userQuery.deleteUser(id)
            commonHelper.response(res, result, 200, `User ${id} is deleted`, null)
        } else {
            res.redirect('https://zwallet-app.vercel.app/auth/login')
            return next(createError(400, 'You are not authorized to continue'))
        }
    } catch (error) {
        console.log(error)
        next({ status: 500, message: `${error.message}`})
    }
}

const changeUserPassword = async (req, res, next) => {
    try {
        const {email, role, active} = req.decoded
        const {current_password, new_password, confirm_password} = req.body
        if (active === 1) {
            const [user] = await userQuery.getUserPassword(email, active, role)
            const checkPassword = await bcrypt.compare(current_password, user.password)
            if (checkPassword) {
                if (new_password === confirm_password) {
                    const salt = await bcrypt.genSalt()
                    const hashedNewPassword = await bcrypt.hash(new_password, salt)
                    const result = await userQuery.changeUserPassword(hashedNewPassword, email, active, role)
                    console.log(result)
                    if (result.affectedRows > 0) {
                        commonHelper.response(res, result, 200, `User ${email} password is updated`, null)  
                    }
                }
            } else {
                commonHelper.response(res, result, 400, ``, null)  
                next({ status: 401, message: `Your current password is incorrect.`})
            }
        } else {
            next({ status: 403, message: `Sorry, your account is not yet activated.`})
        }
    } catch (error) {
        console.log(error)
        next({ status: 500, message: `${error.message}`})
    }
}

const changeUserPin = async (req, res, next) => {
    try {
        const {email, role, active} = req.decoded
        const {current_pin, new_pin} = req.body
        if (active === 1) {
            const [user] = await userQuery.getUserDetails(email, role)
            if (current_pin === user.pin) {
                const result = await userQuery.changeUserPin(new_pin, email, active, role)
                if (result.affectedRows > 0) {
                    commonHelper.response(res, result, 200, `User ${email}'s PIN is updated.`, null)  
                }
            } else {
                next({ status: 400, message: `Sorry, Your current PIN is incorrect.`})
            }
        } else {
            next({ status: 403, message: `Sorry, your account is not yet activated.`})
        }
    } catch (error) {
        console.log(error)
        next({ status: 500, message: `${error.message}`})
    }
}

const updateUserPhoneNumber = async (req, res, next) => {
    try {
        const {email, role, active} = req.decoded
        const {new_phone_number} = req.body
        if (active === 1) {
            const result = await userQuery.updateUserPhoneNumber(new_phone_number, email, active, role)
            if (result.affectedRows > 0) {
                commonHelper.response(res, result, 200, `User ${email}'s Phone Number is updated.`, null)  
            }
        } else {
            next({ status: 403, message: `Sorry, your account is not yet activated.`})
        }
    } catch (error) {
        console.log(error)
        next({ status: 500, message: `${error.message}`})
    }
}


module.exports = {
    signup,
    login,
    resetUserPasswordEmailForm,
    resetUserPassword,
    uploadProfilePicture,
    getUserDetails,
    getUserDetailsByPhone,
    updateUserDetails,
    deleteUser,
    changeUserPassword,
    changeUserPin,
    updateUserPhoneNumber
}