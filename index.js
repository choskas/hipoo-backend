require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const app = express();
// Middlewares
app.use(helmet());
app.disable("x-powered-by");
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());

// Middlewares for DDoS and bruteforce attacks
const limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  delayMs: 0,
});

// Mongo db connection
const uri = process.env.MONGO_DATABASE
const client = new MongoClient(uri);
const connectDB = async () => {
  try {
  await mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  await client.connect();
  console.log('client and db conected !!')
} catch (error) {
  await  client.close()
  console.log(error)
}
}
connectDB()
app.use(limiter);

// Routes
app.use(require("./routes/index"));

// Static
app.use(express.static(path.join(__dirname, "public")));

// Listen server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
