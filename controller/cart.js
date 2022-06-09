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
  const cartInventoryId = req.body.cartInventoryId;

  const cart = await Cart.findById(req.user._id);

  if (!cart) {
    res.status(404).send({
      status: "fail",
      msg: "You don't have a cart",
    });
  }

  await Cart.updateOne(
    { user: req.user._id },
    { $pull: { cartInventory: { _id: cartInventoryId } } },
    { safe: true, multi: true }
  );

  res.status(200).send({
    status: "sucess",
    msg: "Item deleted sucessfully.",
  });
};

exports.updateCart = async (req, res) => {
  const cartInventoryId = req.body.cartInventoryId;

  let cart = await Cart.findById(req.user._id);

  if (!cart) {
    res.status(404).send({
      status: "fail",
      msg: "You don't have a cart",
    });
  }

  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $push: { cartInventory: cartInventoryId } }
  );

  cart = await Cart.findById(req.user._id);

  res.status(200).send({
    status: "sucess",
    cart,
  });
};
