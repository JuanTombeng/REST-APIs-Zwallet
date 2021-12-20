const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 4000;

const commonHelper = require('./src/helper/common.js')
const adminRouter = require('./src/routes/adminUsers.js')
const customerRouter = require('./src/routes/customerUser.js')

app.use(express.json());
app.use(morgan('dev'))

app.use('/admin/users', adminRouter)
app.use('/users', customerRouter)

// app.use((req, res, next) => {
//     res.json({
//         message : `URL Not Found`
//     })
// })

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