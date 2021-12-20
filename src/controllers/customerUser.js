const bcrypt = require('bcrypt')
const { v4 : uuidv4 } = require('uuid')
const createError = require('http-errors')
const commonHelper = require('../helper/common.js')
const userQuery = require('../models/customerUser.js')

const userSignUp = async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt()
        const {username, email, password} = req.body
        const userId = uuidv4()
        const hashedPassword = await bcrypt.hash(password, salt)
        const userData = {
            id : userId,
            username : username,
            email : email,
            password : hashedPassword
        }
        const accountData = {
            id : uuidv4(),
            id_user : userId,
            account_number : Math.floor(Math.random() * (11000 - 10000)) + 10000
        }
        const profileData = {
            id_user : userId,
            first_name : 'First Name',
            last_name : 'Last Name'
        }
        const result = await userQuery.userSignUp(userData)
        const account = await userQuery.userAccountCreation(accountData)
        const profile = await userQuery.userProfileCreation(profileData)
        const results = {
            result : result,
            account : account,
            profile : profile
        }
        // res.json({
        //     results: result,
        //     accounts: account,
        //     profiles : profile
        // })
        commonHelper.response(res, results, 200, `New User is created with username : ${username}`)
    } catch (error) {
        console.log(error)
        const err = new createError.InternalServerError()
        next(err)
    }
}

const userLogin = async (req, res, next) => {
    try {
        const {email, password} = req.body
        const data = {
            email : email,
            password : password
        }
        const findUser = await userQuery.userLogin(data)
        const checkPassword = await bcrypt.compare(password, findUser[0].password)
        if (checkPassword) {
            // res.status(500).json({
            //     message: `Login is Successful! Welcome back ${findUser[0].username}`
            // })
            commonHelper.response(res, 'Login Completed', 200, `Login is Successful! Welcome back ${findUser[0].username}`)
        } else {
            // res.status().json({
            //     message: `Sorry, your username or password is wrong! Please try again.`
            // })
            commonHelper.response(res, `Login Failed`, 500, `Sorry, your username or password is wrong! Please try again.`)
        }
    } catch (error) {
        commonHelper.response(res, `Login Failed`, 500, `Sorry, your username or password is wrong! Please try again.`)
    }
}

const userUpdate = async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt()
        const {username, email, password} = req.body
        const userId = req.params.id
        const hashedPassword = await bcrypt.hash(password, salt)
        const userData = {
            username : username,
            email : email,
            password : hashedPassword,
            updated_at : new Date()
        }
        const result = await userQuery.userUpdate(userId, userData)
        commonHelper.response(res, result, 200, `User with ID : ${userId} is updated!`)
    } catch (error) {
        console.log(error)
        const err = new createError.InternalServerError()
        next(err)
    }
}

const createTransaction = async (req, res, next) => {
    try {
        const {from_account_id, to_account_id, amount} = req.body
        const transactionId = uuidv4()
        const transactionData = {
            id : transactionId,
            from_account_id : from_account_id,
            to_account_id : to_account_id,
            amount : amount
        }
        const result = await userQuery.createTransaction(transactionData)
        commonHelper.response(res, result, 200, `New Transaction is created under the ID : ${transactionId}`)
    } catch (error) {
        console.log(error)
        const err = new createError.InternalServerError()
        next(err)
    }
}

module.exports = {
    userSignUp,
    userLogin,
    userUpdate,
    createTransaction
}