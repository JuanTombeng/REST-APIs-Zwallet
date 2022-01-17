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

const currentOutcome = (user_id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT outcome FROM accounts WHERE id_user = ?`
        connection.query(sql, user_id, (error, result) => {
            if (!error) {
                resolve(result)
            } else (
                reject(error)
            )
        })
    })
}

const currentIncome = (user_id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT income FROM accounts WHERE id_user = ?`
        connection.query(sql, user_id, (error, result) => {
            if (!error) {
                resolve(result)
            } else (
                reject(error)
            )
        })
    })
}


const updateOutcome = (user_id, totalOutcome) => {
    return new Promise ((resolve, reject) => {
        const sql = `UPDATE accounts SET outcome = ? WHERE id_user = ?`
        connection.query(sql, [totalOutcome, user_id], (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const updateIncome = (user_id, totalIncome) => {
    return new Promise ((resolve, reject) => {
        const sql = `UPDATE accounts SET income = ? WHERE id_user = ?`
        connection.query(sql, [totalIncome, user_id], (error, result) => {
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
    console.log(userId)
    return new Promise ((resolve, reject) => {
        const sql = `SELECT transactions.id, transactions.from_user_id, transactions.to_user_id, IF(transactions.from_user_id = '${userId}', user1.first_name, user2.first_name) 
        AS first_name, IF(transactions.from_user_id = '${userId}', user1.profile_picture, user2.profile_picture) AS profile_picture, transactions.transaction_type, transactions.amount, 
        transactions.notes, transactions.status, transactions.created_at FROM transactions INNER JOIN users user1 ON (user1.id = transactions.to_user_id) INNER JOIN users user2 ON 
        (user2.id = transactions.from_user_id) WHERE (from_user_id = '${userId}' OR to_user_id = '${userId}') ORDER BY created_at`
        connection.query(sql, (error, result) => {
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
    currentIncome,
    currentOutcome,
    updateIncome,
    updateOutcome,
    getTransactions,
    getTransactionsHistory,
    countTransactions,
    updateTransaction
}
