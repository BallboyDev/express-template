const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const dotenv = require('dotenv')
const path = require('path')

// 운영 환경별 설정 파일 설정
dotenv.config()
const app = express()
app.set('port', process.env.PORT || 3000)

// 요청과 응답에 대한 정보 콘솔 기록
app.use(morgan('dev')) // dev, combined, common, short, tiny...

// 정적인 파일들을 제공하는 라우터 역할
// 요청 경로에 해당하는 파일이 없으면 자동적으로 next를 호출
app.use('/', express.static(path.join(__dirname, 'public')))

// 요청 본문의 데이터를 해석하여 req.body객체로 제작
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    },
    name: 'session-cookie'
}))

// 파일 업로드 파트
const multer = require('multer')
const fs = require('fs')
try {
    fs.readdirSync('uploads')
} catch (ex) {
    console.log('uploads 폴더가 없어 uploads 폴더를 생성합니다.')
    fs.mkdirSync('uploads')
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/')
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname)
            done(null, path, basename(file.originalname, ext) + Date.now() + ext)
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
})


app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/multipart.html'))
})

app.post('/upload',
    upload.fields([{ name: 'image1' }, { name: 'image2' }]),
    (req, res) => {
        console.log(req, files, req.body)
        res.send('ok')
    }
)

app.use((req, res, next) => {
    console.log('모든 요청에 다 실행됩니다.')
    next()
})

app.get('/', (req, res) => {
    // 문자열 반환
    res.send('Hello, Express');

    // html 파일 반환
    // res.sendFile(path.join(__dirname, '/index.html'))


})

app.get('/error', (req, res, next) => {
    console.log('GET /error 요청에서만 실행됩니다.')
    next();
}, (req, res) => {
    throw new Error('에러는 에러 처리 미들웨어러 갑니다.')
})

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message)
})

app.listen(app.get('port'), () => {
    console.log(`${app.get('port')}번 포트에서 대기 중....`)
})

/** 미들웨어 정리 */
/**
 * app.use(middleware) // 모든 요청에서 미들웨어 실행
 * app.use('/abc', middleware) // abc로 시작하는 요청에서 미들웨어 실행
 * app.post('/abc', middleware) // abc로 시작하는 POST 요청에서 미들웨어 실행
 */