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
// const uploadFile = require("./routes/uploadFile");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJsDoc = YAML.load("./swagger.yaml");
require("dotenv").config();
const { EventEmitter } = require("events");
const timerEventEmitter = new EventEmitter();

connectToDb();
app.get("/", (req, res) =>
  res.send({ status: "sucess", msg: "Server Up And Running" })
);
app.use(express.json());
app.use((err, req, res, next) => {
  res.status(500).send({
    message: err.message,
  });
});
app.use(express.urlencoded({ extended: true }));

// UPLOAD FILE
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://fir-e5626.appspot.com",
});
const bucket = admin.storage().bucket();

const saltedMd5 = require("salted-md5");
const path = require("path");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("file"), async (req, res) => {
  const name = saltedMd5(req.file.originalname, "SUPER-S@LT!");
  const fileName = name + path.extname(req.file.originalname);
  await bucket.file(fileName).createWriteStream().end(req.file.buffer);

  const file = bucket.file(fileName);
  return file
    .getSignedUrl({
      action: "read",
      expires: "03-09-2491",
    })
    .then((signedUrl) => {
      res.status(200).send({
        status: "sucess",
        msg: "File uploaded sucessfully",
        signedUrl,
      });
    });
});

app.set("emmiter", timerEventEmitter);
app.use("/auth", authRoute);
app.use("/shop", shopRoute);
app.use("/shop", bannerRoute);
app.use("/home", homeRoute);
app.use("/delivery_boy", deliveryBoyRoute);
app.use("/product", productRoute);
app.use("/payment", paymentRoute);
app.use("/cart", cartRoute);
app.use("/address", addressRoute);
app.use("/coupon", couponRoute);
app.use("/trip", tripRoute);
app.use("/api_docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));
// app.use("/file", uploadFile);

// exporting server
module.exports = app;
