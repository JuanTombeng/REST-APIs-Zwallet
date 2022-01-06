const connection = require('../config/dbConfig.js')

// Admin & Customer
const signup = (data) => {
    return new Promise ((resolve, reject) => {
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

// Admin & Customer
const login = (data) => {
    return new Promise ((resolve, reject) => {
        const findUserQuery = `SELECT * FROM users WHERE email = ?`
        connection.query(findUserQuery, data.email, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

// middleware -Admin
const getUsers = ({search, sort, order, limit, offset}) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT users.id, accounts.id AS id_accounts, users.email, users.pin, profiles.first_name, profiles.last_name,
                profiles.phone_number FROM users INNER JOIN profiles ON users.id = profiles.id_user 
                INNER JOIN accounts ON users.id = accounts.id_user`
        if (search) {
            sql += ` WHERE profiles.first_name LIKE '%${search}%' ORDER BY users.${order} ${sort} LIMIT ${limit} OFFSET ${offset}`
        } else {
            sql += ` ORDER BY users.${order} ${sort} LIMIT ${limit} OFFSET ${offset}`
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

const getUserDetails = (userId) => {
    return new Promise ((resolve, reject) => {
        const sql = `SELECT users.id, accounts.id AS id_accounts, accounts.balance, profiles.first_name, profiles.last_name,
        profiles.phone_number FROM users INNER JOIN profiles ON users.id = profiles.id_user 
        INNER JOIN accounts ON users.id = accounts.id_user WHERE users.id = ?`
        connection.query(sql, userId, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

// middleware -Admin
const countUsers = () => {
    return new Promise ((resolve, reject) => {
        const sql = `SELECT COUNT(*) AS total FROM users`
        connection.query(sql, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

// middleware -Admin and User
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

// middleware -Admin
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

module.exports = {
    signup,
    login,
    getUsers,
    getUserDetails,
    countUsers,
    updateUser,
    deleteUser
}


