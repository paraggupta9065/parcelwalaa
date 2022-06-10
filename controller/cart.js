// need to go through logic of removeCart and updateCart again

const cart = require("../model/cart");
const Cart = require("../model/cart");
const CartInventory = require("../model/cartInventory");

exports.addToCart = async (req, res) => {
  const {
    inventoryTotalAmt,
    deliveryTotalAmt,
    couponCodeId,
    discountAmt,
    netAmt,
    pickupAddressId,
    deliveryAddressId,
    cartInventory,
    totalGst,
  } = req.body;

  if (
    !inventoryTotalAmt ||
    !deliveryTotalAmt ||
    !couponCodeId ||
    !discountAmt ||
    !netAmt ||
    !pickupAddressId ||
    !deliveryAddressId ||
    !cartInventory ||
    !totalGst
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
  const user = req.user;
  const cart = await Cart.findOne({ user: user._id });

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
    msg: "Item deleted sucessfully.",
  });
};

exports.updateCart = async (req, res) => {
  const cartData = req.body;
  const id = req.user._id;

  let cart = await Cart.findOneAndUpdate(id, cartData);

  cart = await Cart.findById(id);

  res.status(200).send({
    status: "sucess",
    cart,
  });
};
