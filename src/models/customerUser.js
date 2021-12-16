const { reject } = require('bcrypt/promises')
const connection = require('../config/dbConfig.js')

const userSignUp = (data) => {
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

// user account creation after new user sign up
const userAccountCreation = () => {
    return new Promise ((resolve, reject) => {
        const sql = `INSERT INTO accounts SET ?`
    })
}

const userLogin = (data) => {
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

module.exports = {
    userSignUp,
    userLogin
}