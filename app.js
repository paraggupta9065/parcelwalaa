const express = require('express');
const { sendOtp, verifyOtp } = require('./controller/auth');
const connectToDb = require('./utils/connectToDb');
const app = express();
const authRoute = require('./routes/auth');
const shopRoute = require('./routes/shop');
const driverRoute = require("./routes/driver")
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
app.use("/driver", driverRoute);

module.exports = app;