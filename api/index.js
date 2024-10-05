const router = require('express').Router()

router.use('/tree', require('./tree/treeController'))
router.use('/file', require('./file/fileController'))

module.exports = router