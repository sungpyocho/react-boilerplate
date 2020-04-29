const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require('./models/User');

//application/x-www-form-urlencoded 데이터 분석하도록
app.use(bodyParser.urlencoded({extended: true}));

// application-json 데이터 분석하도록
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log(`MongoDB Connected...`))
  .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World!'));

app.get('/api/hello', (req, res) => {
    res.send('안녕하세요!!');
})

app.post('/api/users/register', (req, res) => {
    // 회원가입 할 때 필요한 정보를 client에서 가져오면 database에 넣어준다.
    const user = new User(req.body) // bodyParser가 있어서 req.body가 가능.

    user.save((err, userInfo) => {
        // 실패 또는 성공시, 유저에게 json 형식으로 내용 전달
        if (err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login', (req, res) => {
    // 요청된 이메일을 데이터베이스에서 찾기
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "해당 이메일을 가진 유저가 없습니다."
            })
        }
        // 요청한 이메일이 DB에 있다면, 비밀번호가 동일한지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "올바른 비밀번호를 입력하세요."});
        
            // 비밀번호까지 같다면 Token을 생성하기
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지, 세션?
                // 여기에서는 쿠키를 사용한다.
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id })

            })
        })
    })    
})

// auth는 미들웨어. 리퀘스트를 받은 후, 콜백함수를 넘겨주기 전에 하는 것.
app.get('/api/users/auth', auth, (req, res) => {
    // 여기까지 미들웨어를 통과했다는 것 = 인증 성공
    // 해당하는 유저의 정보를 선별해서 프론트엔드로 보내준다.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false: true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image
    })

})

// 로그아웃. auth 미들웨어를 넣어준 것은 로그아웃 전 로그인 상태이기 때문
app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id},
        { token: "" }
        , (err, user ) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).send({
                success: true
            });
        })
})

const port = 5000;
app.listen(port, () => console.log(`App listening on port ${port}!`))