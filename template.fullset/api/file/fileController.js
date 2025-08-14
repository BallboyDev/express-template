const router = require('express').Router()
const fileService = require('./fileService')

/** 파일 업로드 */
router.post('/upload', (req, res) => {

})

/** FILE DB 새로 구축 */
router.get('/', async (req, res) => {
    console.log('ballboy buildTree')
    try {
        await fileService.renewalFileDb()
    } catch (ex) {
        console.log(ex)
    }

    res.status(200).json({
        result: 'testing...'
    })
})

/** 파일/폴더 생성 */
// curl -X POST localhost:3010/api/file/create -H "Content-Type: application/json" -d '{"path": "","name": "test","type": "file"}'
router.post('/create', async (req, res) => {
    const { path, name, type } = req.body

    try {
        // 파일 존재 유무 확인
        const existsItem = fileService.existsItem({ path, name })
        if (existsItem) {
            res.status(200).send('이미 파일이 존재 합니다.')
        }

        // 파일 생성
        const result = await fileService.createItem({ path, name, type })
        res.status(200).json({
            result: true
        })

    } catch (ex) {
        res.status(500).json({
            result: false
        })
    }
})

/** 파일/폴더 삭제 */
router.post('/delete', async (req, res) => {
    try {
        const { path, name } = req.body

        const result = fileService.deleteItem({ path, name })

        res.status(200).json({
            result: result
        })
    } catch (ex) {
        console.log(ex)
        res.status(500).json({
            err: ex
        })
    }

})
/** 파일/폴더 수정 */
/** 파일 읽어오기 */
/** 파일 내용 수정 */

module.exports = router

