const express = require('express');
const morgan = require('morgan');
require('dotenv').config()
const app = express();
const http = require('http')
const PORT = process.env.PORT || 4000;
const commonHelper = require('./src/v2/helper/common')
const {errorHandling} = require('./src/v2/helper/errorHandling')
const cors = require('cors')

const server = http.createServer(app)
const {Server} = require('socket.io')
const io = new Server({
    cors : {
        origin : 'https://zwallet-app.vercel.app'
    }
})

const version1 = require('./src/v1/routes')
const version2 = require('./src/v2/routes')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'))
app.use(cors())
app.use('/v1', version1)
app.use('/v2', version2)
app.use('/file', express.static('./src/uploads'))

// URL not Found handler
app.use(commonHelper.handleURLNotFound)

// error handling
app.use(errorHandling);

// web socket
io.on('connection', (socket) => {
    console.log('a user connected')
    socket.on('disconnect', () => {
        console.log('a user disconnected')
    })
})

io.listen(server)

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})