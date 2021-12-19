const bcrypt = require('bcrypt')
const { v4 : uuidv4 } = require('uuid')
const userQuery = require('../models/adminUsers.js')

const getUsers = async (req, res, next) => {
    try {
        const search = req.query.name
        const sort = req.query.sort || 'desc'
        const order = req.query.order || 'created_at'
        const result = await userQuery.getAllUsers({
            search : search,
            sort : sort,
            order : order
        })
        res.json({
            results: result
        })
    } catch (error) {
        res.json({
            errorMessage : error
        })
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
        res.json({
            results: result
        })
    } catch (error) {
        new Error(error)
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
        res.json({
            results : result
        })
    } catch (error) {
        res.json({
            message : `Select another id`
        })
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const result = await userQuery.deleteUser(userId)
        res.json({
            results: result
        })
    } catch (error) {
        res.json({
            message : error
        })
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
        res.json({
            results: result
        })
    } catch (error) {
        res.json({
            message : error
        })
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
    getUsers,
    // searchUserByName,
    createUser,
    updateUser,
    deleteUser,
    getTransactions,
    updateTransaction
}