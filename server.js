const express = require('express');
const morgan = require('morgan');
require('dotenv').config()
const app = express();
const PORT = process.env.PORT || 4000;
const commonHelper = require('./src/v1/helper/common')
const cors = require('cors')

const version1 = require('./src/v1/routes')
const version2 = require('./src/v2/routes')

app.use(express.json());
app.use(morgan('dev'))
app.use(cors())
app.use('/v1', version1)
app.use('/v2', version2)

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