const connection = require('../config/dbConfig')

const createAccount = (data) => {
    return new Promise ((resolve, reject) => {
        const sql = `INSERT INTO accounts SET ?`
        connection.query(sql, data, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const topUpAccountBalance = (data, userId) => {
    return new Promise ((resolve, reject) => {
        const sql = `UPDATE accounts SET ? WHERE id_user = ?`
        connection.query(sql, [data, userId], (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const addTopUpHistory = (data) => {
    return new Promise ((resolve, reject) => {
        const sql = `INSERT INTO top_up_history SET ?`
        connection.query(sql, data, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const getAccountDetail = (userId) => {
    return new Promise ((resolve, reject) => {
        const sql = `SELECT balance, income FROM accounts WHERE id_user = ?`
        connection.query(sql, userId, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}


module.exports = {
    createAccount,
    topUpAccountBalance,
    addTopUpHistory,
    getAccountDetail
}