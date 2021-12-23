const bcrypt = require('bcrypt')
const { v4 : uuidv4 } = require('uuid')
const createError = require('http-errors')
const commonHelper = require('../helper/common.js')
const transactionQuery = require('../models/transactions.js')


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
        const result = await transactionQuery.createTransaction(transactionData)
        commonHelper.response(res, result, 200, `New Transaction is created under the ID : ${transactionId}`)
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
        const result = await transactionQuery.getTransactions({
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
        const result = await transactionQuery.updateTransaction(transactionId, transactionData)
        commonHelper.response(res, result, 200, `Transaction with ID : ${transactionId} is updated!`)
    } catch (error) {
        console.log(error)
        const err = new createError.InternalServerError()
        next(err)
    }
}


module.exports = {
    createTransaction,
    getTransactions,
    updateTransaction
}