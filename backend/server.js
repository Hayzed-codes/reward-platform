require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/DBconnect");
const errorHandler = require("./middleware/errorMiddleware");
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");
const rewardRoute = require("./routes/rewardRoute");
const stripeRoute = require("./routes/stripeRoute");

const PORT = process.env.PORT || 3500;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS",
  })
);

let totalRevenue = 0;

app.get("/api/revenue", (req, res) => {
  res.json({ totalRevenue });
});

setInterval(() => {
  totalRevenue += Math.floor(Math.random() * 50); 
}, 10000);

app.get('/api/reach', (req, res) => {
  const totalReach = 5000; 
  res.json({ totalReach });
});

app.get('/api/media-value', (req, res) => {
  const totalValue = 12000; 
  res.json({ totalValue });
});


app.get("/", (req, res) => {
  res.send("We just starting");
});

app.use("/admin", adminRoute);
app.use("/user", userRoute);
app.use("/reward", rewardRoute);
app.use("/api", stripeRoute);

connectDB();

app.use(errorHandler);
mongoose.connection.once("open", () => {
  console.log("Database Connected");

  app.listen(PORT, () => console.log(`Server is 🏃‍♂️💨 on ${PORT}`));
});
