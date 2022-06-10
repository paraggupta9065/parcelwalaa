const express = require("express");
const { sendOtp, verifyOtp } = require("./controller/auth");
const connectToDb = require("./utils/connectToDb");
const app = express();
const authRoute = require("./routes/auth");
const shopRoute = require("./routes/shop");
const homeRoute = require("./routes/home");
const bannerRoute = require("./routes/banner");

const deliveryBoyRoute = require("./routes/deliveryBoy");
const productRoute = require("./routes/product");
require("dotenv").config();
connectToDb();
app.use(express.json());
app.use((err, req, res, next) => {
  res.status(500).send({
    message: err.message,
  });
});
app.get("/", (req, res) => res.send({ status: "sucess", msg: "Server Up And Running" }));
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRoute);
app.use("/shop", shopRoute);
app.use("/shop", bannerRoute);
app.use('/home', homeRoute)
app.use("/delivery_boy", deliveryBoyRoute);
app.use("/product", productRoute);

module.exports = app;
