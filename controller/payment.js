const cartModel = require('../model/cart')
const orderModel = require('../model/order')
const userModel = require('../model/user')
const shopModel = require('../model/shop')
const user = require('../model/user')
const admin = require('firebase-admin')
const { json } = require('express')
// const mailSenderHelper = require('../utils/mailSender')

exports.initPayment = async (req, res) => {
  try {
    const cart = await cartModel.findOne({ number: req.user.number })
    if (!cart) {
      return res.status(200).send({ status: 'fail', msg: 'Cart not found !' })
    }

    return res.status(200).send({
      status: 'sucess',
      cart,
      payment_response: { merchentKey: '8319905007@apl' }
    })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}

exports.sucessPayment = async (req, res) => {
  // try {
  const {
    order_note,
    transaction_id,
    amount_paid,
    payment_method_id,
    order_type
  } = req.body

  const cart = await cartModel.findOne({ user_id: req.user._id })
  if (!cart) {
    return res.status(200).send({ status: 'fail', msg: 'Cart not found !' })
  }
  let order = await orderModel.findOne({ user_id: cart.user_id })
  if (!order) {
    order = await orderModel.create({
      order_note,
      order_inventory: cart.cart_inventory,
      delivery_address_id: cart.delivery_address_id,
      order_type,
      coupon_code_id: cart.coupon_code_id,
      // total_gst: cart.total_gst,
      net_amt: cart.net_amt,
      discount_amt: cart.discount_amt,
      inventory_total_amt: cart.inventory_total_amt,
      delivery_total_amt: cart.delivery_total_amt,
      shop_id: cart.shop_id,
      user_id: req.user._id,
      transaction_id,
      amount_paid,
      payment_method_id
    })
  } else {
    order = await orderModel.findByIdAndUpdate(order._id, {
      order_note,
      order_inventory: cart.cart_inventory,
      delivery_address_id: cart.delivery_address_id,
      coupon_code_id: cart.coupon_code_id,
      // total_gst: cart.total_gst,
      net_amt: cart.net_amt,
      discount_amt: cart.discount_amt,
      inventory_total_amt: cart.inventory_total_amt,
      delivery_total_amt: cart.delivery_total_amt,
      shop_id: cart.shop_id,
      user_id: req.user._id,
      transaction_id,
      amount_paid,
      payment_method_id
    })
  }

  // await cartModel.findOneAndDelete({ user_id: req.user._id })
  // await mailSenderHelper('parcelwalaa@gmail.com', order)

  order = await orderModel
    .findOne({ user_id: cart.user_id })
    .populate('user_id')
    .populate({ path: 'order_inventory' })
  //send notification

  try {
    for (const index in order.order_inventory) {
      const element = order.order_inventory[index]

      const vendor = await userModel.findOne({
        number: element.shop_id.number
      })
      // message to vendor

      for (const token of vendor.tokens) {
        console.log(token)
        const message = {
          notification: {
            title: 'New Order Received',
            body: 'Order Received'
          },
          data: {
            order: order._id.toString()
          },
          token: token.token
        }
        const vendorResp = await admin.messaging().send(message)
      }
    }
  } catch (error) {
    console.log(error)
  }

  // message to vendor
  // message to customer

  const messageCustomer = {
    notification: {
      title: 'New Order Received',
      body: 'Order Received'
    },
    data: {
      order: JSON.stringify(order)
    },
    token: req.user.fmc_token
  }
  let customerPesp
  try {
    customerPesp = await admin.messaging().send(messageCustomer)
  } catch (error) {
    return res.status(200).send({
      status: 'sucess',
      order,
      msg: 'order created and Notification not send'
    })
  }

  //message to customer

  return res
    .status(200)
    .send({ status: 'sucess', order, msg: 'order created and cart deleted' })
  // } catch (error) {
  //   console.log(error)
  //   return res.status(404).send({
  //     status: 'fail',
  //     msg: error,
  //     msg: 'Something went wrong',
  //     error
  //   })
  // }
}

exports.deleteOrder = async (req, res) => {
  const orderId = req.params.id

  await orderModel.findByIdAndDelete(orderId)

  return res.status(200).send({
    status: 'sucess',
    msg: 'Order deleted sucessfully.'
  })
}

exports.failPayment = async (req, res) => {
  res
    .status(200)
    .send({ status: 'fail', order, msg: 'Payment Failed Cart Not Deleted' })
}

// const fetch = require("node-fetch");
// const postUrl = 'https://fcm.googleapis.com/fcm/send';

// //notification to vendor
// const vendorToken = String(vendor["fmc_token"]);
// const body = {
//   'to': vendorToken,
//   'priority': 'high',
//   'notification': {
//     'title': 'New Order Received',
//     'body': 'Order Received',
//     'mutable_content': true,
//     'sound': 'Tri-tone'
//   },
//   'data': {}
// }

// const headers = {
//   'content-type': 'application/json',
//   'Authorization':
//     `key=${process.env.fcm_token}`
// };

// const response = await fetch(postUrl, {
//   method: 'post',
//   body: JSON.stringify(body),
//   headers: headers,
// });
// const vendor_responese = await response.json();
//notification to custumer
// const body_custumer = {
//   "to": req.user.fmc_token,
//   "notification": {
//     "title": "New Order Received",
//     "body": "Order Received",
//     "mutable_content": true,
//     "sound": "Tri-tone"
//   },
//   "data": {
//     "url": "",
//     "dl": ""
//   }
// }
// console.log(body_custumer);

// const headers_custumer = {
//   'content-type': 'application/json',
//   'Authorization':
//     `key=${process.env.fcm_token}`
// };
// const response_custumer = await fetch(postUrl, {
//   method: 'post',
//   body: JSON.parse(body_custumer),
//   headers: headers_custumer,
// });
// const custumer_responese = await response_custumer.json();
// //send notification
