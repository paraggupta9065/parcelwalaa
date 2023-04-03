const deliveryBoy = require('../model/deliveryBoy')

const connectToSocket = app => {
  const server = require('http').createServer(app)
  const io = require('socket.io')(server)

  io.on('connection', socket => {
    socket.on('shop_join', shop_id => {
      socket.join(shop_id)
      console.log(`Shop with id ${shop_id} joined`)
    })

    socket.on('driver_join', driver_join => {
      socket.join(driver_join)

      console.log(`Driver with id ${driver_join} joined`)
    })

    socket.on('customer_join', customer_join => {
      socket.join(customer_join)

      console.log(`Customer with id ${customer_join} joined`)
    })

    socket.on('location', data => {
      deliveryBoy.findByIdAndUpdate(data['id'], {
        lat: data['lat'],
        long: data['long']
      })
    })
  })

  let timerEventEmitter = app.get('emmiter')

  timerEventEmitter.on('order_recived', data => {
    io.to(data['driver_id']).emit('order_recived', data)
  })
  timerEventEmitter.on('customer_update', data => {
    io.to(data['id']).emit('customer_update', data['status'])
  })

  return server
}

module.exports = connectToSocket
