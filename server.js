const express = require('express');
const morgan = require('morgan');
require('dotenv').config()
const app = express();
const PORT = process.env.PORT || 4000;

const commonHelper = require('./src/helper/common.js')
const userRouter = require('./src/routes/users.js')
const accountRouter = require('./src/routes/accounts.js')
const transactionRouter = require('./src/routes/transactions.js')
const cors = require('cors')

app.use(express.json());
app.use(morgan('dev'))
app.use(cors())
app.use('/users', userRouter)
app.use('/accounts', accountRouter)
app.use('/transactions', transactionRouter)

// URL not Found handler
app.use(commonHelper.handleURLNotFound)

// Error handling
app.use((err, req, res, next)=>{
    const statusCode = err.status || 500
    const message = err.message || 'Internal Server Error'
    res.status(statusCode)
    res.json({
        status: statusCode,
        message: message
    })
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})