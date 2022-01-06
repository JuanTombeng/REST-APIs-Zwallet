const bcrypt = require('bcrypt')
const { v4 : uuidv4 } = require('uuid')
const createError = require('http-errors')
const commonHelper = require('../helper/common.js')
const userQuery = require('../models/users.js')
const accountQuery = require('../models/accounts.js')
const profileQuery = require('../models/profiles.js')

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
            pin : pin
        }
        const accountData = {
            id : uuidv4(),
            id_user : userId,
            account_number : Math.floor(Math.random() * (11000 - 10000)) + 10000
        }
        const profileData = {
            id_user : userId,
            first_name : 'First Name',
            last_name : 'Last Name',
            phone_number : 123123,
        }
        console.log(userData)
        const user = await userQuery.signup(userData)
        if (user.affectedRows > 0) {
            const account = await accountQuery.createAccount(accountData)
            const profile = await profileQuery.createProfile(profileData)
            const results = {
                user : user,
                account : account,
                profile : profile
            }
            commonHelper.response(res, results, 200, `New User is created with username : ${username}`)
        }
    } catch (error) {
        console.log(error)
        const err = new createError.InternalServerError()
        next(err)
    }
}

const login = async (req, res, next) => {
    try {
        const {email, password} = req.body
        const data = {
            email : email,
            password : password
        }
        const findUser = await userQuery.login(data)
        const checkPassword = await bcrypt.compare(password, findUser[0].password)
        if (checkPassword) {
            commonHelper.response(res, 'Login Completed', 200, `Login is Successful! Welcome back ${findUser[0].username}`)
        } else {
            commonHelper.response(res, `Login Failed`, 500, `Sorry, your username or password is wrong! Please try again.`)
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

const getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id
        const result = await userQuery.getUserById(userId)
        commonHelper.response(res, result, 200, `List of all users`, null)
    } catch (error) {
        console.log(error)
        const err = new createError.InternalServerError()
        next(err)
    }
}

const updateUser = async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt()
        const {username, email, password, pin} = req.body
        const userId = req.params.id
        const hashedPassword = await bcrypt.hash(password, salt)
        const userData = {
            id : userId,
            username : username,
            email : email,
            password : hashedPassword,
            pin : pin
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
    getUserById,
    updateUser,
    deleteUser
}