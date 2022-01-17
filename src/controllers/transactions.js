const bcrypt = require('bcrypt')
const { v4 : uuidv4 } = require('uuid')
const createError = require('http-errors')
const commonHelper = require('../helper/common.js')
const transactionQuery = require('../models/transactions.js')


const createTransaction = async (req, res, next) => {
    try {
        const {from_user_id, to_user_id, amount, transaction_type, notes} = req.body
        const transactionId = uuidv4()
        let transactionData = {
            id : transactionId,
            from_user_id : from_user_id,
            to_user_id : to_user_id,
            amount : amount,
            transaction_type : transaction_type,
            notes : notes,
            status : 1
        }
        const senderCheckBalance = await transactionQuery.checkBalance(from_user_id)
        const senderCurrentOutcome = await transactionQuery.currentOutcome(from_user_id)
        const receiverCheckBalance = await transactionQuery.checkBalance(to_user_id)
        const receiverCurrentIncome = await transactionQuery.currentIncome(to_user_id)
        if (senderCheckBalance[0].balance > amount) {
            const senderRemainingBalance = senderCheckBalance[0].balance - amount
            const senderCurrentBalance = await transactionQuery.updateBalance(from_user_id, senderRemainingBalance)
            //
            const senderTotalOutcome = senderCurrentOutcome + amount
            const senderOutcomeUpdate = await transactionQuery.updateOutcome(from_user_id, senderTotalOutcome)
            //
            const receiverAddedBalance = receiverCheckBalance[0].balance + amount
            const receiverCurrentBalance = await transactionQuery.updateBalance(to_user_id, receiverAddedBalance)
            //
            const receiverTotalIncome = receiverCurrentIncome + amount
            const receiverIncomeUpdate = await transactionQuery.updateIncome(to_user_id, receiverTotalIncome)
            //
            const transfer = await transactionQuery.createTransaction(transactionData)
            const result = {
                senderBalance : senderCurrentBalance,
                receiverBalance : receiverCurrentBalance,
                transfer : transfer
            }
            commonHelper.response(res, result, 200, `New Transaction is created under the ID : ${transactionId}`)
        } else if (senderCheckBalance[0].balance < amount) {
            transactionData = {
                ...transactionData,
                status : 0
            }
            const transfer = await transactionQuery.createTransaction(transactionData)
            commonHelper.response(res, transfer, 422, `Transaction with ID : ${transactionId} is failed due to the shortage of balance`)
        } else {
            const err = new createError.InternalServerError()
            next(err)
        }
        
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
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 2
        const offset = (page - 1) * limit
        const result = await transactionQuery.getTransactions({
            order : order,
            sort : sort,
            offset : offset,
            limit : limit
        })
        const resultCount = await transactionQuery.countTransactions()
        const {total} = resultCount[0]
        commonHelper.response(res, result, 200, `List of all transactions`, null, {
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

//get transactions history by sender ID
const getTransactionsHistory = async (req, res, next) => {
    try {
        const userId = req.params.id
        console.log(userId)
        const result = await transactionQuery.getTransactionsHistory(userId)
        commonHelper.response(res, result, 200, `Transaction History of user : ${userId}.`)
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
    getTransactionsHistory,
    updateTransaction
}