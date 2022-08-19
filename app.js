const express = require("express");
const connectToDb = require("./utils/connectToDb");
const app = express();

// Routes
const authRoute = require("./routes/auth");
const shopRoute = require("./routes/shop");
const homeRoute = require("./routes/home");
const bannerRoute = require("./routes/banner");
const deliveryBoyRoute = require("./routes/deliveryBoy");
const productRoute = require("./routes/product");
const paymentRoute = require("./routes/payment");
const cartRoute = require("./routes/cart");
const addressRoute = require("./routes/address");
const couponRoute = require("./routes/coupon");
const tripRoute = require("./routes/trip");
const ordersRoute = require("./routes/orders");
const categoriesRoute = require("./routes/categories");
const admin = require("firebase-admin");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJsDoc = YAML.load("./swagger.yaml");
require("dotenv").config();
const { EventEmitter } = require("events");
const userModel = require("./model/user");
const timerEventEmitter = new EventEmitter();


//init start
connectToDb();
//init end

app.get("/", (req, res) => {
  const timerEventEmitter = req.app.get('emmiter');
  timerEventEmitter.emit('order_recived', "ghgh");
  res.send({ status: "sucess", msg: "Server Up And Running" })
});

var serviceAccount = require("./parcelwalaa-47f46-firebase-adminsdk-byjcf-613f1c6e19.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// PUSH NOTIFICATION
const notification_options = {
  priority: "high",
  timeToLive: 60 * 60 * 24,
};

app.get("/notification", async (req, res) => {
  // const registrationToken = req.body.registrationToken;
  // const message = req.body.message;
  // const options = notification_options;
  // .sendToDevice(registrationToken, message, options)


  const user = await userModel.findOne({ number: 9179175597 });
  const message = {
    notification: {
      title: '$FooCorp up 1.43% on the day',
      body: '$FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.'
    },
    token: user.fmc_token,

  };
  admin
    .messaging().send(message)
    .then((response) => {
      res.status(200).send({
        status: "sucess",
        msg: "Notification send sucessfully",
      });
    })
    .catch((error) => {
      res.status(400).send({
        status: "fail",
        message: error,
      });
    });
});


app.set("emmiter", timerEventEmitter);
//middleware use
app.use(express.json());
app.use((err, req, res, next) => {
  res.status(500).send({
    message: err.message,
  });
});
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRoute);
app.use("/shop", shopRoute);
app.use("/banner", bannerRoute);
app.use("/home", homeRoute);
app.use("/delivery_boy", deliveryBoyRoute);
app.use("/product", productRoute);
app.use("/payment", paymentRoute);
app.use("/cart", cartRoute);
app.use("/address", addressRoute);
app.use("/coupon", couponRoute);
app.use("/trip", tripRoute);
app.use("/orders", ordersRoute);
app.use("/categories", categoriesRoute);
app.use("/api_docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));
app.use("/uploads", express.static("uploads"));
//middleware use
const fs = require('fs')
const stream = require('stream')
app.get("/file/:image", (req, res) => {

  // res.sendFile('image-1657089228800.png', { root: __dirname + "/uploads" });
  // const r = fs.createReadStream(__dirname + '/uploads/' + 'image-1657089228800.png') // or any other way to get a readable stream
  // const ps = new stream.PassThrough() // <---- this makes a trick with stream error handling
  // stream.pipeline(
  //   r,
  //   ps, // <---- this makes a trick with stream error handling
  //   (err) => {
  //     if (err) {
  //       console.log(err) // No such file or any other kind of error
  //       return res.sendStatus(400);
  //     }
  //   })
  // ps.pipe(res)

  //read the image using fs and send the image content back in the response
  const image = req.params.image;
  fs.readFile(__dirname + '/uploads/' + image, function (err, content) {
    if (err) {
      res.writeHead(400, { 'Content-type': 'text/html' })
      console.log(err);
      res.end("No such image");
    } else {
      //specify the content type in the response will be an image
      res.writeHead(200, { 'Content-type': 'image/jpg' });
      res.end(content);
    }
  });
}
);


// exporting server
module.exports = app;
