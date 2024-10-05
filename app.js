const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const morgan = require('morgan')
// const maria = require('./database/mariadb')

dotenv.config()

const app = express()

app.set('port', process.env.NODE_PORT || 3010)

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

morgan('dev')

app.use('/test', require('./api/test'))

app.use('/api', require('./api'))

/******* Error *******/
app.use((err, req, res, next) => {
    let error = {
        message: err.message,
        error: err,
        status: err.status || 500
    }

    res.status(error.status).json(error)
})

app.listen(app.get('port'), () => {
    console.log(`${app.get('port')}번 포트에서 대기 중....`)
})