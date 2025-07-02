const express = require('express')
const app = express()

const port = 3000

app.listen(port, () => {
    console.log(`Start Server : ${port}`)
})

app.get('/', (req, res) => {
    res.send('simple express server')
})