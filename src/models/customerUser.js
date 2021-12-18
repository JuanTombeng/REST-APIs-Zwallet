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
const userAccountCreation = (data) => {
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

// // user contact holder creation after new user sign up
// const userContactHolder = (userId) => {
//     return new Promise ((resolve, reject) => {
//         const sql = `INSERT INTO contact_holder SET ?`
//         connection.query(sql, userId, (error, result) => {
//             if (!error) {
//                 resolve(result)
//             } else {
//                 reject(error)
//             }
//         })
//     })
// }

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
    userAccountCreation,
    userContactHolder,
    userLogin
}