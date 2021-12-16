const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 4000;

const adminRouter = require('./src/routes/adminUsers.js')
const customerRouter = require('./src/routes/customerUser.js')

app.use(express.json());
app.use(morgan('dev'))

app.use('/admin/users', adminRouter)
app.use('/users', customerRouter)

app.use((req, res, next) => {
    res.json({
        message : `URL Not Found`
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})