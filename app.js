require('dotenv').config()
require('express-async-errors')
const path = require('path')

//security packages
const cors = require('cors')
const xss = require('xss-clean')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

// express
const express = require('express')
const app = express()

//
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2

const notFound = require('./middleware/not-found')
const errorHandler = require('./middleware/error-handler')
const authenticationMiddleware = require('./middleware/authentication')
const connectDB = require('./db/connect')
const authRouter = require('./routes/auth')
const jobRouter = require('./routes/job')


app.set('trust proxy', 1)
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: 'Too many requests from this IP, please try again in an hour'
})


app.use(express.json())

app.use(express.urlencoded({ extended: false }))
app.use(fileUpload({ useTempFiles: true }))
app.use(express.static('./public'))
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})
// app.use(cors())
// app.use(helmet())
// app.use(xss())



app.get('/', (req, res) => {
    res.status(201).json('I just got here')
})
app.use('/api/v1', authRouter)
app.use('/api/v1/job', authenticationMiddleware, jobRouter)

app.use(notFound)
app.use(errorHandler)


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(5000, () => {
            console.log('Server is listening on port 5000')
        })
    } catch (error) {
        console.log(error)
    }

}
start()