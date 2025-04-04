const nodemailer = require('nodemailer')
const orderModel = require('../model/order')

async function mailSenderHelper (email, order) {
  var emails = email
  // var emails = email.toString()

  var orderitem = []

  order.order_inventory.forEach(inventory => {
    emails = emails + `, ${inventory.shop_id.email}`

    console.log(emails)
    var invStr = `
    Prdouct Name: ${inventory.product.name},
    Product Qty: ${inventory.quantity},
    Product Vendor: ${inventory.shop_id.store_name},
    Product Vendor Number: ${inventory.shop_id.number},
    `

    orderitem.push(invStr)
  })

  // var transporter = nodemailer.createTransport({
  //   service: 'hostinger',
  //   host: 'smtp.hostinger.com',
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     user: 'order@vaininnovation.in',
  //     pass: 'Qwertyuiop123@'
  //   }
  // })

  var transporter = nodemailer.createTransport({
    host: 'email-smtp.ap-south-1.amazonaws.com',
    port: 587,

    auth: {
      user: 'AKIAWOJB5VH7FX7HSS7C',
      pass: 'BJ4krw66SzWHc6w9fZ73dMUvmxlUWBXv0GvivOSDyLey'
    },
    tls: {
      ciphers: 'SSLv3'
    }
  })

  var mailOptions = {
    from: 'care.brainvibe.in',
    to: emails,
    subject: 'New order',
    text: `Dear Vendor,

    We are writing to notify you of a new order that has been placed on our food delivery application. Please find below all the information regarding the order and the user:
    
    Order Details:
    
    Order Number: ${order._id}
    Order Date: ${order.date_created}
    Delivery Address: Kanopy ${order.point}
    Order Type:  ${order.order_type}
    
    
    Order Items:
    ${orderitem}
    
    User Details:
    Name:${order.user_id.name}
    Phone Number: ${order.user_id.number}
    Item Total: ${order.inventory_total_amt}
    Delivery Charges: ${order.delivery_total_amt}
    Delivery Charges: ${order.delivery_total_amt}
    Total: ${order.net_amt}
    
    Please ensure that the order is prepared and delivered to the user at the designated address in a timely manner. If you have any questions or concerns regarding this order, please do not hesitate to contact us.
    
    Thank you for your continued support and partnership.
    
    Best regards,
    
    Bingrr
    `
  }

  try {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = mailSenderHelper
