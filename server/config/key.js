// dev(로컬), prod(배포) 환경 나눠주기
if (process.env.NODE_ENV === "production") {
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}