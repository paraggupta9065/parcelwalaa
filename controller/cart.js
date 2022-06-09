// some task remaining

const Cart = require("../model/cart");

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

};

exports.updateCart = async (req, res) => {
  const cart = req;
};
