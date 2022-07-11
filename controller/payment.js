const cartModel = require("../model/cart");
const orderModel = require("../model/order");
const request = require('request');

exports.initPayment = async (req, res) => {


  const cart = await cartModel.findOne({ 'number': req.user.number });
  if (!cart) {
    return res.status(200).send({ status: "fail", msg: "Cart not found !" });
  }

  return res.status(200).send({ status: "sucess", cart, payment_response: { merchentKey: "8319905007@apl", } });

};


exports.sucessPayment = async (req, res) => {
  const { order_note, transaction_id, amount_paid, payment_method_id } =
    req.body;

  const cart = await cartModel.findOne({ number: req.user.number });
  if (!cart) {
    return res.status(200).send({ status: "fail", msg: "Cart not found !" });
  }

  const order = await orderModel.create({
    order_note,
    order_inventory: cart.cart_inventory,
    pickup_address_id: delivery_address_id,
    delivery_address_id: delivery_address_id,
    coupon_code_id: cart.coupon_code_id,
    total_gst: cart.total_gst,
    net_amt: cart.net_amt,
    discount_amt: cart.discount_amt,
    inventory_total_amt: cart.inventory_total_amt,
    delivery_total_amt: cart.delivery_total_amt,
    shop_id,
    user_id,
    transaction_id,
    amount_paid,
    payment_method_id,
  });


  const timerEventEmitter = req.app.get('emmiter');
  timerEventEmitter.emit('order_recived', order._id);
  //send notification


  request.post(
    'https://fcm.googleapis.com/fcm/send',
    { json: { key: 'value' } },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
    }
  );
  //send notification







  res
    .status(200)
    .send({ status: "sucess", order, msg: "order created and cart deleted" });
};

exports.deleteOrder = async (req, res) => {
  const orderId = req.params.id;

  await orderModel.findByIdAndDelete(orderId);

  return res.status(200).send({
    status: "sucess",
    msg: "Order deleted sucessfully.",
  });
};

exports.failPayment = async (req, res) => {
  res
    .status(200)
    .send({ status: "fail", order, msg: "Payment Failed Cart Not Deleted" });
};
