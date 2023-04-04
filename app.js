const express = require('express')
const connectToDb = require('./utils/connectToDb')
const connectToSocket = require('./utils/socket')
const app = express()

// Routes
const authRoute = require('./routes/auth')
const adminRoute = require('./routes/admin_get')
const shopRoute = require('./routes/shop')
const homeRoute = require('./routes/home')
const bannerRoute = require('./routes/banner')
const deliveryBoyRoute = require('./routes/deliveryBoy')
const productRoute = require('./routes/product')
const paymentRoute = require('./routes/payment')
const cartRoute = require('./routes/cart')
const addressRoute = require('./routes/address')
const couponRoute = require('./routes/coupon')
const tripRoute = require('./routes/trip')
const ordersRoute = require('./routes/orders')
const categoriesRoute = require('./routes/categories')
const brandRoute = require('./routes/brand')
const admin = require('firebase-admin')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
// const swaggerJsDoc = YAML.load("./swagger.yaml");
require('dotenv').config()
const { EventEmitter } = require('events')
const userModel = require('./model/user')
const timerEventEmitter = new EventEmitter()
const cloudinary = require('cloudinary')
const mailSenderHelper = require('./utils/mailSender')
const errorHandler = require('./middleware/errorHandler')

//init start
connectToDb()

//init end

app.get('/', async (req, res) => {
  let order = await orderModel.findOne()

  await mailSenderHelper('paraggupta9063@gmail.com', order)
  return res.json({
    status: 'sucess',
    msg: 'Server Up And Running',
    version: 1.4
  })
})

app.get('/payment_key', async (req, res) => {
  return res.json({
    status: 'sucess',
    msg: 'Server Up And Running',
    key: 'rzp_live_pH3yLTdFIM1PTi'
  })
})

cloudinary.config({
  cloud_name: 'parcelwalaa',
  api_key: '831894749651799',
  api_secret: 'PuGyGmO4Jrmiulgne-KwTrYg9lU'
})

var serviceAccount = require('./parcelwalaa-47f46-firebase-adminsdk-byjcf-613f1c6e19.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

app.set('emmiter', timerEventEmitter)
//middleware use
app.use(express.static(__dirname + '/public'))

app.use('/uploads', express.static('uploads'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//routes
app.use('/auth', authRoute)
app.use('/admin', adminRoute)
app.use('/shop', shopRoute)
app.use('/banner', bannerRoute)
app.use('/home', homeRoute)
app.use('/delivery_boy', deliveryBoyRoute)
app.use('/product', productRoute)
app.use('/payment', paymentRoute)
app.use('/cart', cartRoute)
app.use('/address', addressRoute)
app.use('/coupon', couponRoute)
app.use('/trip', tripRoute)
app.use('/orders', ordersRoute)
app.use('/categories', categoriesRoute)
app.use('/brands', brandRoute)
// app.use("/api_docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));
app.use('/uploads', express.static('uploads'))
//middleware use
const orderModel = require('./model/order')
const { errhandler } = require('./middleware/errorHandler')

// const multerMod = require("./middleware/multerMod");

// app.post("/file", multerMod.single("image"), async (req, res) => {
//   try {
//     const result = await cloudinary.uploader.upload(req.file.path);
//     res.json(result)
//   } catch (error) {
//     return res.status(400).json({
//       status: "fail",
//       error
//     });

//   }
// }

// );

// exporting server
module.exports = app
