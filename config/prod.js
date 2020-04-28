// 배포환경(AWS, Heroku...)에서 실행시
module.exports = {
    mongoURI: process.env.MONGO_URI
}