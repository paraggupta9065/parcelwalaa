const express = require('express');
const { sendOtp, verifyOtp } = require('./controller/auth');
const connectToDb = require('./utils/connectToDb');
const app = express();
const authRoute = require('./routes/auth');
const shopRoute = require('./routes/shop');

const delivery_boyRoute = require("./routes/delivery_boy")
const productRoute = require("./routes/product")

const { addShops } = require('./controller/shop');

require('dotenv').config();

connectToDb();
app.use(express.json())
app.use((err, req, res, next) => {
    res.status(500).send({
        "message": err.message,
    });
});
app.get("/", (req, res) => res.send("hi"));

app.use('/auth', authRoute);
app.use('/shop', shopRoute);
app.use("/delivery_boy", delivery_boyRoute);
app.use("/product", productRoute);

module.exports = app;