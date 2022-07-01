const cartModel = require("../model/cart");
const productModel = require("../model/product");
const shopModel = require("../model/shop");
const couponModel = require("../model/coupon");

// exports.addTocartModel = async (req, res) => {
//   const {
//     inventory_total_amt,
//     delivery_total_amt,
//     coupon_code_id,
//     discount_amt,
//     net_amt,
//     pickup_address_id,
//     delivery_address_id,
//     cart_inventory,
//     total_gst,
//   } = req.body;

//   if (
//     !inventory_total_amt ||
//     !delivery_total_amt ||
//     !coupon_code_id ||
//     !discount_amt ||
//     !net_amt ||
//     !pickup_address_id ||
//     !delivery_address_id ||
//     !cart_inventory ||
//     !total_gst
//   ) {
//      return res.status(400).send({
//       status: "fail",
//       msg: "Please provide all the fields",
//     });
//   }

//   const cart = await cartModel.create(cartData);

//    return res.status(201).send({
//     status: "sucess",
//     cart,
//   });
// };

exports.addToCart = async (req, res) => {
  const { productId, delivery_address_id, coupon_code_id } = req.body;
  let inventory_total_amt = 0;
  let delivery_total_amt = 0;
  let discount_amt = 0;
  let net_amt = 0;
  let cart_inventory = [];
  let total_gst = 0;
  let cart = await cartModel.findOne({ user: req.user._id });
  const product = await productModel.findById(productId);
  const shop_id = product.shop_id;

  const shop = await shopModel.findOne({ user_id: shop_id });

  if (!cart) {
    inventory_total_amt = product.price;
    delivery_total_amt = product.deliveryCharges;

    if (coupon_code_id != "na") {
      const coupon = await couponModel.findById(coupon_code_id);
      discount_amt = (product.price / 100) * coupon.percentage_discount;
    }

    total_gst = ((product.price - discount_amt) / 100) * 5;
    net_amt =
      inventory_total_amt + delivery_total_amt - discount_amt + total_gst;

    let newCart = {
      inventory_total_amt,
      delivery_total_amt,
      coupon_code_id,

      discount_amt,
      net_amt,
      shop_id,
      delivery_address_id,

      cart_inventory: [
        {
          quantity: 0,
          product: productId,
        },
      ],
      total_gst,
      user_id: user._id,
    };

    cart = await cartModel.create(newCart);

    return res.status(201).send({
      status: "sucess",
      cart,
    });
  }

  inventory_total_amt = inventory_total_amt + product.price;
  delivery_total_amt = delivery_total_amt + product.deliveryCharges;

  if (coupon_code_id != "na") {
    const coupon = await couponModel.findById(coupon_code_id);
    discount_amt = (product.price / 100) * coupon.percentage_discount;
  }

  total_gst = total_gst + ((product.price - discount_amt) / 100) * 5;
  net_amt =
    net_amt +
    (inventory_total_amt + delivery_total_amt - discount_amt + total_gst);
  cart_inventory.push({
    quantity: 0,
    product: productId,
  });

  let updateCart = {
    inventory_total_amt,
    delivery_total_amt,
    coupon_code_id,

    discount_amt,
    net_amt,
    shop_id,
    delivery_address_id,
    cart_inventory: cart_inventory,
    total_gst,
    user: user._id,
  };

  cart = await cartModel.findByIdAndUpdate(cart._id, updateCart);

  return res.status(200).send({
    status: "sucess",
    msg: "Added To Cart",
    cart,
  });
};

exports.getCart = async (req, res) => {
  const id = req.user._id;
  const cart = await cartModel.findOne({ user: id });

  if (!cart) {
    return res.status(404).send({
      status: "fail",
      msg: "cartModel not found",
    });
  }

  return res.status(200).send({
    status: "sucess",
    cart,
  });
};

exports.removeCart = async (req, res) => {
  const id = req.user._id;

  await cartModel.findOneAndDelete({ user: id });

  return res.status(200).send({
    status: "sucess",
    msg: "cartModel deleted.",
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

  await cartModel.findOneAndUpdate(id, cartData);
  const cart = await cartModel.findById(id);

  return res.status(200).send({
    status: "sucess",
    msg: "cartModel Updated",
    cart,
  });
};

exports.updateQty = async (req, res) => {
  const { productId, quantity } = req.body;
  const id = req.user._id;
  const cart = await cartModel.findOne({ user: id });

  if (!cart) {
    return res.status(404).send({
      status: "fail",
      msg: "Cart not found",
    });
  }

  let inventoryUpdate = [];
  inventoryUpdate = cart.cart_inventory;
  inventory_index = inventoryUpdate.findIndex(
    (cart_inventory_item) => cart_inventory_item.product == productId
  );

  inventoryUpdate[inventory_index] = {
    quantity: quantity,
    product: productId,
  };

  cartModel.findByIdAndUpdate(cart._id, { cart_inventory: inventoryUpdate });

  return res.status(201).send({
    status: "sucess",
    msg: "Product qty updated",
  });
};
