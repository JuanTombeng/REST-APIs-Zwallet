const connection = require('../config/dbConfig.js')

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

const getAccounts = ({sort, order, limit, offset}) => {
    return new Promise ((resolve, reject) => {
        let sql = `SELECT users.username, users.email, profiles.first_name, profiles.last_name, accounts.id as account_id, accounts.account_number, 
                accounts.balance FROM users INNER JOIN profiles ON users.id = profiles.id_user INNER JOIN accounts ON users.id = accounts.id_user`
        if (order) {
            sql += ` ORDER BY accounts.${order} ${sort} LIMIT ${limit} OFFSET ${offset}`
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

const countAccounts = () => {
    return new Promise ((resolve, reject) => {
        const sql = `SELECT COUNT(*) AS total FROM accounts`
        connection.query(sql, (error, result) => {
            if (!error) {
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

module.exports = {
    createAccount,
    countAccounts,
    getAccounts,
    updateAccount
}