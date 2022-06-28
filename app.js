const express = require("express");
const connectToDb = require("./utils/connectToDb");

// socket
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("New WebSocket connection");
});

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

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const { initPayment } = require("./controller/payment");
const swaggerJsDoc = YAML.load("./swagger.yaml");


require("dotenv").config();
connectToDb();
app.use(express.json());
app.use((err, req, res, next) => {
  res.status(500).send({
    message: err.message,
  });
});
app.get("/", (req, res) =>
  res.send({ status: "sucess", msg: "Server Up And Running" })
);


app.use(express.urlencoded({ extended: true }));
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

app.use("/api_docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));

// exporting server
module.exports = server;
