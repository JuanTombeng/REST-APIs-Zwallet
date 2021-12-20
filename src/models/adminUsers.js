const connection = require('../config/dbConfig.js')

const getAllUsers = ({search, sort, order}) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT users.id, accounts.id AS id_accounts, users.email, profiles.first_name, profiles.last_name 
                FROM users INNER JOIN profiles ON users.id = profiles.id_user 
                INNER JOIN accounts ON users.id = accounts.id_user`
        if (search) {
            sql += ` WHERE profiles.first_name LIKE '%${search}%' ORDER BY users.${order} ${sort}`
        } else {
            sql += ` ORDER BY users.${order} ${sort}`
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

const createNewUser = (data) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO users SET ?`
        connection.query(sql, data, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const updateUser = (userId, data) => {
    return new Promise ((resolve, reject) => {
        const sql = `UPDATE users SET ? WHERE id = ?`
        connection.query(sql, [data, userId], (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const deleteUser = (userId) => {
    return new Promise ((resolve, reject) => {
        const sql = `DELETE FROM users WHERE id = ?`
        connection.query(sql, userId, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const getAllAccounts = ({sort, order}) => {
    return new Promise ((resolve, reject) => {
        let sql = `SELECT users.username, users.email, profiles.first_name, profiles.last_name, accounts.id as account_id, accounts.account_number, 
                accounts.balance FROM users INNER JOIN profiles ON users.id = profiles.id_user INNER JOIN accounts ON users.id = accounts.id_user`
        if (order) {
            sql += ` ORDER BY accounts.${order} ${sort}`
        }
        connection.query(sql, (error, result) => {
            if(!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const updateAccount = (accountId, accountData) => {
    return new Promise ((resolve, reject) => {
        let sql = `UPDATE accounts SET ? WHERE id = ?`
        connection.query(sql, [accountData, accountId], (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const getAllTransactions = ({sort, order}) => {
    return new Promise ((resolve, reject) => {
        let sql = `SELECT users.username, transactions.from_account_id, transactions.to_account_id, transactions.amount, transactions.created_at 
                FROM users INNER JOIN accounts ON users.id = accounts.id_user 
                INNER JOIN transactions ON accounts.id = transactions.from_account_id`
        if (order) {
            sql += ` ORDER BY ${order} ${sort}`
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
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getAllAccounts,
    updateAccount,
    getAllTransactions,
    updateTransaction
}