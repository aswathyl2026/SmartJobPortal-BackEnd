const express = require('express')
const cors = require('cors')
const path = require('path')

require('dotenv').config()
require('./config/db')

const routes = require('./routes/allRoutes')

const server = express()

server.use(cors())

server.use(express.json())

// uploads folder public
server.use('/uploads', express.static(path.join(__dirname, 'uploads')))

server.use(routes)

const PORT = process.env.PORT

server.listen(PORT, () => {
    console.log(`Server started at ${PORT}`)
})

// application specific middleware
server.use((err, req, res, next) => {
    res.status(500).json(err.message)
})

server.get('/', (req, res) => {
    res.status(200).send(`<h1>Server started</h1>`)
})