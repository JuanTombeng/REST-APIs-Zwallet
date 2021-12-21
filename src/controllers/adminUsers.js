const bcrypt = require('bcrypt')
const createError = require('http-errors')
const commonHelper = require('../helper/common.js')
const userQuery = require('../models/adminUsers.js')

const getUsers = async (req, res, next) => {
    try {
        const search = req.query.name
        const sort = req.query.sort || 'desc'
        const order = req.query.order || 'created_at'
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 2
        const offset = (page - 1) * limit
        const result = await userQuery.getAllUsers({
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

const createUser = async (req, res, next) => {
    try {
        const {username, email, password} = req.body
        const data = {
            username : username,
            email : email,
            password : password
        }
        const result = await userQuery.createNewUser(data)
        commonHelper.response(res, result, 200, `New User is created with username : ${username}`)
    } catch (error) {
        console.log(error)
        const err = new createError.InternalServerError()
        next(err)
    }
}

const updateUser = async (req, res, next) => {
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

const getAccounts = async (req, res, next) => {
    try {
        const order = req.query.order || 'created_at'
        const sort = req.query.sort || 'desc'
        const result = await userQuery.getAllAccounts({
            order : order,
            sort : sort
        })
        commonHelper.response(res, result, 200)
    } catch (error) {
        console.log(error)
        const err = new createError.InternalServerError()
        next(err)
    }
}

const updateAccount = async (req, res, next) => {
    try {
        const accountId = req.params.id
        const {account_number, balance} = req.body
        const accountData = {
            account_number : account_number,
            balance : balance,
            updated_at : new Date()
        }
        const result = await userQuery.updateAccount(accountId, accountData)
        commonHelper.response(res, result, 200, `Account with ID:${accountId} is updated!`)
    } catch (error) {
        console.log(error)
        const err = new createError.InternalServerError()
        next(err)
    }
}

const getTransactions = async (req, res, next) => {
    try {
        const order = req.query.order || 'created_at'
        const sort = req.query.sort || 'desc'
        const result = await userQuery.getAllTransactions({
            order : order,
            sort : sort
        })
        commonHelper.response(res, result, 200)
    } catch (error) {
        console.log(error)
        const err = new createError.InternalServerError()
        next(err)
    }
}

const updateTransaction = async (req, res, next) => {
    try {
        const transactionId = req.params.id
        const {from_account_id, to_account_id, amount} = req.body
        const transactionData = {
            from_account_id : from_account_id,
            to_account_id : to_account_id,
            amount : amount,
            updated_at : new Date()
        }
        const result = await userQuery.updateTransaction(transactionId, transactionData)
        commonHelper.response(res, result, 200, `Transaction with ID : ${transactionId} is updated!`)
    } catch (error) {
        console.log(error)
        const err = new createError.InternalServerError()
        next(err)
    }
}


module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getAccounts,
    updateAccount,
    getTransactions,
    updateTransaction
}