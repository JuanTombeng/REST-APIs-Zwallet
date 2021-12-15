const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 4000;

const usersRouter = require('./src/routes/users.js')

app.use(express.json());
app.use(morgan('dev'))

app.use('/users', usersRouter)

app.use((req, res, next) => {
    res.json({
        message : `URL Not Found`
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})