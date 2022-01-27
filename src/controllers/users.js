const bcrypt = require('bcrypt')
const { v4 : uuidv4 } = require('uuid')
const createError = require('http-errors')
const commonHelper = require('../helper/common.js')
const userQuery = require('../models/users.js')
const accountQuery = require('../models/accounts.js')

const signup = async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt()
        const {username, email, password, pin} = req.body
        const userId = uuidv4()
        const hashedPassword = await bcrypt.hash(password, salt)
        const userData = {
            id : userId,
            username : username,
            email : email,
            password : hashedPassword,
            pin : pin,
            first_name : 'First Name',
            last_name : 'Last Name',
            phone_number : 082111111111,
            profile_picture : null
        }
        const accountData = {
            id : uuidv4(),
            id_user : userId
        }
        const findEmail = await userQuery.findUserEmail(username, email)
        if (findEmail.length === 0) {
            const newUser = await userQuery.signup(userData)
            const newAccount = await accountQuery.createAccount(accountData)
            if (newUser.affectedRows > 0) {
                const results = {
                    newUser : newUser,
                    account : newAccount,
                }
                
                const payload = {
                    username : username,
                    email : email
                }
                const token = commonHelper.generateToken(payload);
                results.token = token
                commonHelper.sendEmailVerification(email, token)
            }
        } else {
            return next(createError(403, `Email is already existed. Please choose another email to signup.`))
        }
    } catch (error) {
        console.log(error)
        next(createError(500, new createError.InternalServerError()));
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
        } else if (findEmailUser[0].email === email) {
            const findUser = await userQuery.login(data)
            if (findUser[0].active === 1 && findUser[0].role === `user`) {
                const checkPassword = await bcrypt.compare(password, findUser[0].password)
                if (checkPassword) {
                    const payload = {
                        email : findUser[0].email,
                        role : findUser[0].role
                    }
                    const token = commonHelper.generateToken(payload)
                    findUser[0].token = token
                    commonHelper.response(res, findUser, 200, `Login is Successful! Welcome back ${findUser[0].username}`)
                } else {
                    commonHelper.response(res, `Login Failed`, 500, `Sorry, your password is wrong! Please try again.`)
                }
            }
        }
    } catch (error) {
        commonHelper.response(res, `Login Failed`, 500, `Sorry, your username or password is wrong! Please try again.`)
    }
}


const getUsers = async (req, res, next) => {
    try {
        const search = req.query.name
        const sort = req.query.sort || 'desc'
        const order = req.query.order || 'created_at'
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 2
        const offset = (page - 1) * limit
        const result = await userQuery.getUsers({
            search : search,
            sort : sort,
            order : order,
            offset : offset,
            limit : limit
        })
        const resultCount = await userQuery.countUsers()
        const {total} = resultCount[0]
        commonHelper.response(res, result, 200, `List of all users`, null, {
            curretPage : page,
            limit : limit,
            totalData : total,
            totalPage : Math.ceil(total / limit)
        })
    } catch (error) {
        console.log(error)
        const err = new createError.InternalServerError()
        next(err)
    }
}

const getUserDetails = async (req, res, next) => {
    try {
        const userId = req.params.id
        const result = await userQuery.getUserDetails(userId)
        commonHelper.response(res, result, 200, `User detail:`, null)
    } catch (error) {
        console.log(error)
        const err = new createError.InternalServerError()
        next(err)
    }
}

const updateUser = async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt()
        const {username, email, password, pin, first_name, last_name, phone_number} = req.body
        const userId = req.params.id
        const hashedPassword = await bcrypt.hash(password, salt)
        const userData = {
            id : userId,
            username : username,
            email : email,
            password : hashedPassword,
            pin : pin,
            first_name : first_name,
            last_name : last_name,
            phone_number : phone_number
        }
        const result = await userQuery.updateUser(userId, userData)
        commonHelper.response(res, result, 200, `User with ID : ${userId} is updated!`)
    } catch (error) {
        console.log(error)
        const err = new createError.InternalServerError()
        next(err)
    }
}


const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const result = await userQuery.deleteUser(userId)
        commonHelper.response(res, result, 200, `User with ID : ${userId} is deleted!`)
    } catch (error) {
        console.log(error)
        const err = new createError.InternalServerError()
        next(err)
    }
}

module.exports = {
    signup,
    login,
    getUsers,
    getUserDetails,
    updateUser,
    deleteUser
}