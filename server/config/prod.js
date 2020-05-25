// 배포환경(AWS, Heroku...)에서 실행시
module.exports = {
  mongoURI: process.env.MONGO_URI,
  emailAddress: process.env.EMAIL_ADDRESS,
  emailPassword: process.env.EMAIL_PASSWORD,
};
