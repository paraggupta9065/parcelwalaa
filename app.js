const express = require("express");
const connectToDb = require("./utils/connectToDb");
const app = express();

// Routes
const authRoute = require("./routes/auth");
const adminRoute = require("./routes/admin_get");
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
const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");



//init start
connectToDb();
//init end

app.get("/", (req, res) => {
  const timerEventEmitter = req.app.get('emmiter');
  timerEventEmitter.emit('order_recived', "ghgh");
  res.send({ status: "sucess", msg: "Server Up And Running" })
});

cloudinary.config({
  cloud_name: 'parcelwalaa',
  api_key: '831894749651799',
  api_secret: 'PuGyGmO4Jrmiulgne-KwTrYg9lU'
});

var serviceAccount = require("./parcelwalaa-47f46-firebase-adminsdk-byjcf-613f1c6e19.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});



app.set("emmiter", timerEventEmitter);
//middleware use
app.use(express.json());
app.use((err, req, res, next) => {
  return res.status(500).send({
    message: err.message,
  });
});
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRoute);
app.use("/admin", authRoute);
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
  try {
    const image = req.params.image;
    fs.readFile(__dirname + '/uploads/' + image, function (err, content) {
      if (err) {
        res.writeHead(400, { 'Content-type': 'text/html' })
        res.send("No such image");
      } else {
        //specify the content type in the response will be an image
        res.writeHead(200, { 'Content-type': 'image/jpg' });
        return res.end(content);
      }
    });
  } catch (error) {
    return res.status(400).send({
      status: "fail",
      error,
      msg: "Something went wrong"
    });

  }
}

);
const multerMod = require("./middleware/multerMod");

// app.post("/file", multerMod.single("image"), async (req, res) => {
//   try {
//     const result = await cloudinary.uploader.upload(req.file.path);
//     res.send(result)
//   } catch (error) {
//     return res.status(400).send({
//       status: "fail",
//       error
//     });

//   }
// }

// );


// exporting server
module.exports = app;
