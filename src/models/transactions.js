const connection = require('../config/dbConfig.js')

const createTransaction = (data) => {
    return new Promise ((resolve, reject) => {
        const sql = `INSERT INTO transactions SET ?`
        connection.query(sql, data, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const checkBalance = (id_user) => {
    return new Promise ((resolve, reject) => {
        const sql = `SELECT balance FROM accounts WHERE id_user = ?`
        connection.query(sql, id_user, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const updateBalance = (user_id, balance) => {
    return new Promise ((resolve, reject) => {
        const sql = `UPDATE accounts SET balance = ? WHERE id_user = ?`
        connection.query(sql, [balance, user_id], (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const getTransactions = ({sort, order, limit, offset}) => {
    return new Promise ((resolve, reject) => {
        let sql = `SELECT users.first_name, users.last_name, transactions.from_user_id, transactions.to_user_id, transactions.amount,
        transactions.transaction_type,  transactions.status, transactions.created_at 
        FROM users INNER JOIN transactions ON users.id = transactions.to_user_id`
        if (order) {
            sql += ` ORDER BY ${order} ${sort} LIMIT ${limit} OFFSET ${offset}`
        }
        connection.query(sql, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

//get transactions history by sender ID
const getTransactionsHistory = (userId) => {
    return new Promise ((resolve, reject) => {
        const sql = `SELECT users.first_name, users.last_name, transactions.from_user_id, transactions.to_user_id, transactions.amount,
        transactions.transaction_type,  transactions.status, transactions.created_at 
        FROM users INNER JOIN transactions ON users.id = transactions.to_user_id WHERE transactions.from_user_id = ? 
        OR transactions.to_user_id = ?`
        connection.query(sql, [userId, userId], (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const countTransactions = () => {
    return new Promise ((resolve, reject) => {
        const sql = `SELECT COUNT(*) AS total FROM transactions`
        connection.query(sql, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const updateTransaction = (transactionId, data) => {
    return new Promise ((resolve, reject) => {
        const sql = `UPDATE transactions SET ? WHERE id = ?`
        connection.query(sql, [data, transactionId], (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

module.exports = {
    createTransaction,
    checkBalance,
    updateBalance,
    getTransactions,
    getTransactionsHistory,
    countTransactions,
    updateTransaction
}
