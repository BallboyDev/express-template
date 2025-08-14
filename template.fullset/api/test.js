const router = require('express').Router()
const db = require('../database/mariadb')
const fs = require('fs')

router.get('/', async (req, res) => {
    try {

        fs.createWriteStream(`${process.env.PWD}/upload/ballboy.txt`)

        res.status(200).json({
            result: 'test api result'
        })
    } catch (ex) {
        console.log('ballboy exception >>> ', ex)
    }

})

module.exports = router