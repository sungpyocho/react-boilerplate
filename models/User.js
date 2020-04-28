const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // 빈칸을 없애주는 역할
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    role : {
        type: Number, // 1: 관리자, 0: 일반회원
        default: 0
    },
    image: String,
    token: {
        type: String // 유효성 검증
    },
    tokenExp: {
        type: Number
    }
})

// Schema를 model로 감싸야 한다.
const User = mongoose.model('User', userSchema);

module.exports = { User }

