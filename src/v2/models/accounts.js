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


module.exports = {
    createAccount
}