const nodemailer = require('nodemailer')
const orderModel = require('../model/order')

async function mailSenderHelper (email, order) {
  var emails = email.toString()

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

  var transporter = nodemailer.createTransport({
    service: 'hostinger',
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: 'order@vaininnovation.in',
      pass: 'Qwertyuiop123@'
    }
  })

  var mailOptions = {
    from: 'order@vaininnovation.in',
    to: emails,
    subject: 'New order',
    text: `Dear Vendor,

    We are writing to notify you of a new order that has been placed on our food delivery application. Please find below all the information regarding the order and the user:
    
    Order Details:
    
    Order Number: ${order._id}
    Order Date: ${order.date_created}
    Delivery Address: ${order.delivery_address_id.line1}
    
    Order Items:
    ${orderitem}
    
    User Details:
    Name:${order.user_id.name}
    Phone Number: ${order.user_id.number}
    Item Total: ${order.inventory_total_amt}
    Delivery Charges: ${order.delivery_total_amt}
    Total: ${order.net_amt}
    
    Please ensure that the order is prepared and delivered to the user at the designated address in a timely manner. If you have any questions or concerns regarding this order, please do not hesitate to contact us.
    
    Thank you for your continued support and partnership.
    
    Best regards,
    
    Bingrr
    `
  }

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

module.exports = mailSenderHelper
