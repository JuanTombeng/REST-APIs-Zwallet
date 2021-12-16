const connection = require('../config/dbConfig.js')

const getAllUsers = () => {
    return new Promise ((resolve, reject) => {
        const sql = `SELECT * FROM users`
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

const updateUser = (data, userId) => {
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

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}