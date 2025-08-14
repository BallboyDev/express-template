const router = require('express').Router()
const service = require('./treeService')

// 트리 구조 읽어오기
router.get('/', (req, res) => {

    service.readTreeStructure()

    res.status(200).send('ballboy tree')
})

module.exports = router