const Cart = require("../model/cart");

exports.addToCart = async (req, res) => {
  const {
    inventory_total_amt,
    delivery_total_amt,
    coupon_code_id,
    discount_amt,
    net_amt,
    pickup_address_id,
    delivery_address_id,
    cart_inventory,
    total_gst,
  } = req.body;

  if (
    !inventory_total_amt ||
    !delivery_total_amt ||
    !coupon_code_id ||
    !discount_amt ||
    !net_amt ||
    !pickup_address_id ||
    !delivery_address_id ||
    !cart_inventory ||
    !total_gst
  ) {
    res.status(400).send({
      status: "fail",
      msg: "Please provide all the fields",
    });
  }

  const cart = await Cart.create(cartData);

  res.status(201).send({
    status: "sucess",
    cart,
  });
};

exports.getCart = async (req, res) => {
  const id = req.user._id;
  const cart = await Cart.findOne({ user: id });

  if (!cart) {
    res.status(404).send({
      status: "fail",
      msg: "Cart not found",
    });
  }

  res.status(200).send({
    status: "sucess",
    cart,
  });
};

exports.removeCart = async (req, res) => {
  const id = req.user._id;

  await Cart.findOneAndDelete({ user: id });

  res.status(200).send({ 
    status: "sucess",
    msg: "Cart deleted.",
  });
};

exports.updateCart = async (req, res) => {
  const cartData = req.body;
  const id = req.user._id;

  if (
    !cartData["inventory_total_amt"] ||
    !cartData["delivery_total_amt"] ||
    !cartData["discount_amt"] ||
    !cartData["net_amt"] ||
    !cartData["pickup_address_id"] ||
    !cartData["delivery_address_id"] ||
    !cartData["cart_inventory"] ||
    !cartData["total_gst"]
  ) {
    return res.status(400).send({
      status: "fail",
      msg: "Please provide all the fields",
    });
  }

  await Cart.findOneAndUpdate(id, cartData);
  const cart = await Cart.findById(id);

  return res.status(200).send({
    status: "sucess",
    msg: "Cart Updated",
    cart,
  });
};
