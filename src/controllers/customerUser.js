const bcrypt = require('bcrypt')
const { v4 : uuidv4 } = require('uuid')
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
        res.json({
            results: result,
            accounts: account,
            profiles : profile
        })
    } catch (error) {
        res.json({
            errorMessage : error
        })
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
            res.json({
                message: `Login is Successful! Welcome back ${findUser[0].username}`
            })
        } else {
            res.json({
                message: `Sorry, your username or password is wrong! Please try again.`
            })
        }
    } catch (error) {
        res.json({
            message : `Sorry, your username or password is wrong! Please try again.`
        })
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
        res.json({
            results : result
        })
    } catch (error) {
        res.json({
            message : error
        })
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
        res.json({
            results : result
        })
    } catch (error) {
        res.json({
            message : error
        })
    }
}

module.exports = {
    userSignUp,
    userLogin,
    userUpdate,
    createTransaction
}