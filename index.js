const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');

const config = require('./config/key');

const { User } = require('./models/User');

//application/x-www-form-urlencoded 데이터 분석하도록
app.use(bodyParser.urlencoded({extended: true}));
// application-json 데이터 분석하도록
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log(`MongoDB Connected...`))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/register', (req, res) => {
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

app.listen(port, () => console.log(`App listening on port ${port}!`))