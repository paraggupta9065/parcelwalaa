const shopModel = require('../model/shop')
const admin = require('firebase-admin')
const ordersModel = require('../model/order')
const previousOrderModel = require('../model/previousOrder')
const { getDistance } = require('geolib')
const deliveryBoyModel = require('../model/deliveryBoy')
const userModel = require('../model/user')
const { use } = require('../routes/coupon')
const { json } = require('express')
const distance = require('google-distance-matrix')
const deliveryBoyEarning = require('../model/deliveryBoyEarning')

exports.getOrdersShops = async (req, res) => {
  try {
    const id = req.params.id

    const order_type = req.body.order_type
    console.log(order_type)

    const orders = await ordersModel.find({
      'order_inventory.shop_id': id,
      order_type
    })
    if (orders.length == 0) {
      return res.status(404).json({
        status: 'fail',
        msg: 'Order Not Found'
      })
    }
    return res.status(200).json({
      status: 'sucess',
      orders
    })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}
exports.getOrder = async (req, res) => {
  try {
    const id = req.params.id
    const orders = await ordersModel.findById(id).populate('user_id')

    // .populate('delivery_address_id')
    if (!orders) {
      return res.status(404).json({
        status: 'fail',
        msg: 'Order Not Found'
      })
    }
    return res.status(200).json({
      status: 'sucess',
      orders
    })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}

exports.getOrders = async (req, res) => {
  try {
    const order_type = req.body.order_type
    console.log(order_type)
    const orders = await ordersModel.find({ order_type })
    if (orders.length == 0) {
      return res.status(404).json({
        status: 'fail',
        msg: 'Order Not Found'
      })
    }

    return res.status(200).json({
      status: 'sucess',
      orders
    })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}

exports.getOrdersAdmin = async (req, res) => {
  try {
    const order_type = req.body.order_type
    console.log(order_type)
    const orders = await ordersModel.find({ order_type })
    if (orders.length == 0) {
      return res.status(404).json({
        status: 'fail',
        msg: 'Order Not Found'
      })
    }

    return res.status(200).json({
      status: 'sucess',
      orders
    })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}
exports.getOrderByCustomer = async (req, res) => {
  try {
    const id = req.user._id
    const order = await ordersModel.findOne({ user_id: id })

    if (!order) {
      return res.status(404).json({
        status: 'notFound',
        msg: 'Order Not Found'
      })
    }

    // if (order.status == 'prepared' || order.status == 'assigned' || order.status == 'delivered') {
    //     const driver = await deliveryBoyModel
    //     return res.status(404).json({
    //         status: "notFound",
    //         msg: "Order Not Found",
    //     });
    // }
    return res.status(200).json({
      status: 'sucess',
      order
    })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}

exports.updateStatus = async (req, res) => {
  // try {
  const id = req.params.id
  const status = req.body.status
  let orders = await ordersModel.findById(id)
  const user = await userModel.findById(orders.user_id)
  await ordersModel.findByIdAndUpdate(orders._id, { status })

  if (!orders) {
    return res.status(200).json({
      status: 'failed',
      msg: 'order not found'
    })
  }

  const timerEventEmitter = req.app.get('emmiter')
  timerEventEmitter.emit('customer_update', {
    id: user._id.toString(),
    status
  })
  // message to customer
  // if (user.tokens) {
  //   user.tokens.forEach(async element => {
  //     try {
  //       const messageCustomer = {
  //         notification: {
  //           title: `Your Order Is ${status}`,
  //           body: `Order ${status}`
  //         },
  //         data: {
  //           status: status,
  //           id: String(orders._id)
  //         },
  //         token: element.token
  //       }
  //       await admin.messaging().json(messageCustomer)
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   })
  // }
  if (status == 'cancelled' || status == 'delivered') {
    orders['status'] = status
    console.log(status)
    // if (status != 'cancelled' && orders.driver_id != null) {
    //   await deliveryBoyModel.findByIdAndUpdate(orders['driver_id'], {
    //     isAvailable: true
    //   })
    // }

    // const earning = (orders['distance'] / 1000) * orders.driver_id.perKm

    // console.log(earning)
    // await deliveryBoyEarning.create({
    //   distanceCover: orders.distance,
    //   user_id: orders.driver_id.user_id,
    //   earning: earning
    // })

    await previousOrderModel.create({
      order_note: orders.order_note,
      order_inventory: orders.order_inventory,
      shop_id: orders.shop_id,
      user_id: orders.user_id,
      transaction_id: orders.transaction_id,
      amount_paid: orders.amount_paid,
      status: status
      // delivery_address_id: orders.delivery_address_id
    })
    await ordersModel.findByIdAndDelete(orders._id)
    await deliveryBoyModel.findByIdAndUpdate(orders['driver_id'], {
      isAvailable: true
    })

    return res.status(200).json({
      status: 'sucess',
      msg: 'Order history created and order deleted'
    })
  } else if (status == 'prepared') {
    if (orders.order_type == 'takeaway') {
      // if (user.tokens) {
      //   user.tokens.forEach(async element => {
      //     try {
      //       const messageCustomer = {
      //         notification: {
      //           title: `Your Order ${status}`,
      //           body: `Your Order ${status} Is Ready For Pickup`
      //         },
      //         data: {},
      //         token: element.token
      //       }
      //       const customerResp = await admin.messaging().json(messageCustomer)
      //     } catch (error) {
      //       console.log(error)
      //     }
      //   })
      // }
      return res.status(200).json({
        status: 'sucess',
        msg: 'Status Updated',
        customerResp
      })
    }
    const shop = await shopModel.findById(orders.order_inventory[0].shop_id._id)
    const shopLat = shop.lat
    const shopLong = shop.long
    // const drivers = await deliveryBoyModel.find({
    //   pincode: shop.pincode,
    //   isActive: true,
    //   isOnline: true,
    //   isAvailable: true
    // })

    // if (drivers.length == 0) {
    //   return res.status(404).json({
    //     status: 'fail',
    //     msg: 'No driver nearby found'
    //   })
    // }
    // let driverLat = drivers[0].lat
    // let driverLong = drivers[0].long
    // let nearestDriver = drivers[0].user_id
    // let driver = drivers[0]
    // let shortestDistance = getDistance(
    //   { latitude: String(shopLat), longitude: String(shopLong) },
    //   { latitude: String(driverLat), longitude: String(driverLong) }
    // )
    // if (!drivers) {
    //   return res.status(404).json({
    //     status: 'fail',
    //     msg: 'No driver nearby found'
    //   })
    // }
    // drivers.forEach(async driverEle => {
    //   driverLat = driverEle.lat
    //   driverLong = driverEle.long
    //   const distance = getDistance(
    //     { latitude: String(shopLat), longitude: String(shopLong) },
    //     { latitude: String(driverLat), longitude: String(driverLong) }
    //   )
    //   if (shortestDistance > distance) {
    //     shortestDistance = distance
    //     nearestDriver = driverEle.user_id
    //     driver = driverEle
    //   }
    // })

    // //distance calculation
    // let distanceCal = 0

    // var origins = [`${driver.lat},${driver.long}`]
    // var destinations = []

    // orders.order_inventory.forEach(element => {
    //   const latShop = element.shop_id.lat
    //   const longShop = element.shop_id.long
    //   destinations.push(`${latShop},${longShop}`)
    // })

    // destinations.push(
    //   `${orders.delivery_address_id.lat},${orders.delivery_address_id.long}`
    // )

    // distance.key('AIzaSyBlUJ62u91twMqphn4XG7PC__h6CkpvTZs')

    // let distanceResponse
    // console.log(origins)
    // console.log(destinations)

    // distance.matrix(origins, destinations, function (err, distances) {
    //   if (!err)
    //     // console.log(distances['rows'][0]['elements']);
    //     distanceResponse = distances['rows'][0]['elements']
    // })
    // await sleep(1000)
    // distanceResponse.forEach(element => {
    //   console.log(element)
    //   distanceCal += element['distance']['value']
    // })
    // await ordersModel
    //   .findOneAndUpdate(
    //     { _id: id },
    //     { driver_id: driver._id, distance: distanceCal }
    //   )
    //   .catch(err => console.log(err))
    // const userDriver = await userModel.findOne({ _id: driver.user_id })
    // if (userDriver.tokens) {
    //   userDriver.tokens.forEach(async element => {
    //     try {
    //       console.log(element.token)
    //       const messageDriver = {
    //         notification: {
    //           title: `Your Order Is ${status}`,
    //           body: `Order ${status}`
    //         },
    //         data: {
    //           status: status,
    //           order: String(orders._id),
    //           type: 'order'
    //         },
    //         token: element.token
    //       }
    //       await admin.messaging().json(messageDriver)
    //     } catch (error) {
    //       console.log(error)
    //     }
    //   })
    // }

    return res.status(200).json({
      status: 'sucess'
    })
  } else if (status == 'assignedAccepted') {
    const userDriver = await deliveryBoyModel.findOne({
      user_id: req.user._id
    })
    await deliveryBoyModel
      .findOneAndUpdate({ _id: userDriver._id }, { isAvailable: false })
      .catch(err => console.log(err))
    // if (user.tokens) {
    //   user.tokens.forEach(async element => {
    //     try {
    //       const messageCustomer = {
    //         notification: {
    //           title: `Your Order Is ${status}`,
    //           body: `Order ${status}`
    //         },
    //         data: {
    //           status: status,
    //           driver: String(userDriver)
    //         },
    //         token: element.token
    //       }
    //       await admin.messaging().json(messageCustomer)
    //     } catch (error) {
    //       console.log(error)
    //     }
    //   })
    // }
    return res.status(200).json({
      status: 'sucess',
      msg: 'Status Updated'
    })
  } else if (status == 'pickedUp' || status == 'arrivedCustumer') {
    if (status == 'pickedUp') {
      // if (user.tokens) {
      //   user.tokens.forEach(async element => {
      //     try {
      //       const messageCustomer = {
      //         notification: {
      //           title: `Your Order Is At Your Door Step`,
      //           body: `Delivery Boy At Your Door Step`
      //         },
      //         data: {
      //           status: status
      //         },
      //         token: element.token
      //       }
      //       const customerResp = await admin.messaging().json(messageCustomer)
      //     } catch (error) {
      //       console.log(error)
      //     }
      //   })
      // }
    } else if (status == 'arrivedCustumer') {
      // if (user.tokens) {
      //   user.tokens.forEach(async element => {
      //     try {
      //       const messageCustomer = {
      //         notification: {
      //           title: `Your Order Is At Your Door Step`,
      //           body: `Delivery Boy At Your Door Step`
      //         },
      //         data: {
      //           status: status
      //         },
      //         token: element.token
      //       }
      //       const customerResp = await admin.messaging().json(messageCustomer)
      //     } catch (error) {
      //       console.log(error)
      //     }
      //   })
      // }
    }

    return res.status(200).json({
      status: 'sucess',
      msg: 'Status Updated'
    })
  } else if (status == 'accepted') {
    return res.status(200).json({
      status: 'sucess',
      msg: 'Status Updated'
    })
  } else if (status == 'recived') {
    return res.status(200).json({
      status: 'sucess',
      msg: 'Status Updated'
    })
  }
  return res.status(200).json({
    status: 'fail',
    msg: 'message token not found'
  })

  // message to customer
  // } catch (error) {
  //   return res.status(200).json({
  //     status: 'fail',
  //     error,
  //     msg: 'Something went wrong'
  //   })
  // }
}

exports.getPreviousOrders = async (req, res) => {
  const id = req.user._id

  const orders = await previousOrderModel.find({ user_id: id })
  if (orders.length == 0) {
    return res.status(404).json({
      status: 'fail',
      msg: 'Order Not Found'
    })
  }
  return res.status(200).json({
    status: 'sucess',
    orders
  })
}

// exports.removeCart = async (req, res) => {
//     const id = req.user._id;
//     await cartModel.findOneAndDelete({ user: id });
//      return res.status(200).json({
//         status: "sucess",
//         msg: "cartModel deleted.",
//     });
// };
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
