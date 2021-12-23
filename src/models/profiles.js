const connection = require('../config/dbConfig.js')

// user profile creation after new user sign up
const createProfile = (data) => {
    return new Promise ((resolve, reject) => {
        const sql = `INSERT INTO profiles SET ?`
        connection.query(sql, data, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

module.exports = {
    createProfile
}