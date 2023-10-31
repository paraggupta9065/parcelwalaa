const cartModel = require('../model/cart')
const orderModel = require('../model/order')
const userModel = require('../model/user')
const shopModel = require('../model/shop')
const admin = require('firebase-admin')
const { json } = require('express')
const {orderNotificationVendor}=require('../utils/notifications')
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

exports.successPayment = async (req, res) => {
  const session = await orderModel.startSession();
  try {

    session.startTransaction();
    const opts = { session };
  
    const {
      order_note,
      transaction_id,
      amount_paid,
      payment_method_id,
      order_type
    } = req.body

    const cart = await cartModel.findOne({ user_id: req.user._id })

    if (!cart) {
      return res.status(400).send({ status: 'fail', msg: 'Cart not found' })
    }

    const orderBody = {
      order_note,
      transaction_id,
      amount_paid,
      payment_method_id,
      order_type, 
      user_id: req.user._id ,
      order_inventory: cart.cart_inventory
    }

    let order = await orderModel.findOne({ user_id: req.user._id })

    if (!order) {
      order = await orderModel.create([orderBody],opts)
    } else {
      order = await orderModel.findByIdAndUpdate(order._id, orderBody, {
        new: true,session

      })
    }

    for (const index in order.order_inventory) {
      const element = order.order_inventory[index]
      const vendor = await userModel.findOne({ number: element.shop_id.number })

      if (vendor) {
        console.log("vendor")
      // await  orderNotificationVendor(vendor.number);

      
      }
    }
    console.log("user")
    await  orderNotificationVendor(req.user.number);


 



    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .send({ status: 'success', order, msg: 'Order created and cart deleted' })


  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .send({ status: 'fail', msg: 'Something went wrong', error: error })
  }
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




