const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const path = require('path')
const { validateApiKey } = require('./middleware')
const dotenv = require('dotenv').config()
const cors = require('cors')
const route_v1 = require('./route/v1')
const route_public = require('./route/public')

const app = express()

app.use(cors())

app.use(cookieParser())

// app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    if(req.method !== 'GET') {
        return bodyParser.json()(req, res, next)
    }

    next()
})

app.use(express.urlencoded({ extended: true }))

const port = process.env.PORT || 8080

app.use('/home', validateApiKey, route_v1)
app.use('/home/public', route_public)

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Unknown Method'
    })
})

app.listen(port, () => {
    console.log(`Server is listening in port ${port}`)
})