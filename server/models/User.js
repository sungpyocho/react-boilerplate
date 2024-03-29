const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const saltRounds = 10; // 해시 암호화를 할 때 필요한 salt의 길이

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, // 빈칸을 없애주는 역할
    unique: 1,
  },
  password: {
    type: String,
    minlength: 8,
  },
  role: {
    type: Number, // 1: 관리자, 0: 일반회원
    default: 0,
  },
  image: String,
  token: {
    type: String, // 유효성 검증
  },
  tokenExp: {
    type: Number,
  },
  resetPwdToken: {
    type: String,
  },
  resetPwdExp: {
    type: Number,
  },
});

// pre()를 처리하고 index.js의 save()를 실행함. next() -> save()
userSchema.pre("save", function (next) {
  let user = this; // userSchema 가져오기

  // 비밀번호가 변경될때만(isModified) 비밀번호를 해시 암호화!
  if (user.isModified("password")) {
    // 해시 암호화
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, (err, encrypted) => {
        if (err) return next(err);
        user.password = encrypted;
        next();
      });
    });
  } else {
    next();
  }
});

// comparePassword라는 사용자 지정 메소드
userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword == 해시된 비밀번호 ?
  // cb는 콜백함수
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  // jsonwebtoken을 이용해서 token을 생성
  let user = this;
  let token = jwt.sign(user._id.toHexString(), "secret-Token");
  let halfHour = moment().add(30, "minutes").valueOf();

  user.tokenExp = halfHour;
  user.token = token;
  user.save((err, user) => {
    if (err) return cb(err);
    cb(null, user);
  });
};

// static method는 User 모델에서 바로 쓸 수 있는 메소드
userSchema.statics.findByToken = function (token, cb) {
  let user = this;

  // 토큰을 복호화한다.
  jwt.verify(token, "secret-Token", (err, decodedToken) => {
    // 유저 아이디를 이용해서 유저를 찾은 다음에
    // 클라이언트에서 가져온 토큰과 DB에 저장된 토큰이 일치하는지 확인
    user.findOne({ _id: decodedToken, token: token }, (err, user) => {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

// Schema를 model로 감싸야 한다.
const User = mongoose.model("User", userSchema);

module.exports = { User };
