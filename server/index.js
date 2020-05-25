const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log(`MongoDB Connected...`))
  .catch((err) => console.log(err));

// Middleware
// 1. application/x-www-form-urlencoded 데이터 분석
// 2. application-json 데이터 분석
// 3. cookie 분석
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Router
const userRouter = require("./routes/user");

app.use("/api/users", userRouter);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  // index.html for all page routes
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

// heroku로 돌리면 process.env.PORT를 사용
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server Running on port: ${port}`);
});
