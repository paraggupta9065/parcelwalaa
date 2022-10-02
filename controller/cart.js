const cartModel = require("../model/cart");
const productModel = require("../model/product");
const shopModel = require("../model/shop");
const couponModel = require("../model/coupon");

exports.addToCart = async (req, res) => {
  try {
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

    const shop = await shopModel.findById(shop_id);

    if (!cart) {
      inventory_total_amt = product.price;

      delivery_total_amt = shop.delivery_charges;

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
            quantity: 1,
            product: productId,
          },
        ],
        total_gst,
        user_id: req.user._id,
      };

      cart = await cartModel.create(newCart);

      return res.status(201).send({
        status: "sucess",
        cart,
      });
    }

    inventory_total_amt = cart.inventory_total_amt + product.price;
    delivery_total_amt = delivery_total_amt + shop.delivery_charges;

    if (coupon_code_id != "na") {
      const coupon = await couponModel.findById(coupon_code_id);
      discount_amt = (product.price / 100) * coupon.percentage_discount;
    }

    total_gst = total_gst + ((product.price - discount_amt) / 100) * 5;
    net_amt =
      net_amt +
      (inventory_total_amt + delivery_total_amt - discount_amt + total_gst);
    cart_inventory.push({
      quantity: 1,
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
      user: req.user._id,
    };

    cart = await cartModel.findByIdAndUpdate(cart._id, updateCart);

    return res.status(200).send({
      status: "sucess",
      msg: "Added To Cart",
      cart,
    });

  } catch (error) {
    return res.status(400).send({
      status: "fail",
      error,


      msg: "Something went wrong"

    });
  }
};

exports.getCart = async (req, res) => {
  try {
    let cart = await cartModel.findOne({ user_id: req.user._id });
    if (!cart) {
      return res.status(404).send({
        status: "fail",
        msg: "Cart not found",
      });
    }
    let cartInventory = [];
    cartInventory = cart.cart_inventory;
    let products = [];
    for (let element in cartInventory) {

      const product = await productModel.findById(cartInventory[element]['product']);

      products.push(product);
    }
    return res.status(200).send({
      status: "sucess",
      cart,
      products

    });
  } catch (error) {
    return res.status(400).send({
      status: "fail",
      error,
      msg: "Something went wrong"
    });
  }
};

exports.removeCart = async (req, res) => {
  try {
    const id = req.user._id;

    await cartModel.findOneAndDelete({ user: id });

    return res.status(200).send({
      status: "sucess",
      msg: "cartModel deleted.",
    });
  } catch (error) {
    return res.status(400).send({
      status: "fail",
      error,

      msg: "Something went wrong"

    });
  }
};

exports.updateCart = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(200).send({
      status: "sucess",
      error,


      msg: "Something went wrong"

    });
  }
};

exports.updateQty = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const id = req.user._id;
    const cart = await cartModel.findOne({ user: id });

    if (quantity < 1) {
      return res.status(201).send({
        status: "fail",
        msg: "Qty should be more then 1",
      });

    }

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

    await cartModel.findByIdAndUpdate(cart._id, { cart_inventory: inventoryUpdate });

    return res.status(201).send({
      status: "sucess",
      msg: "Product qty updated",
    });
  } catch (error) {

    return res.status(400).send({
      status: "fail",
      error,

      msg: "Something went wrong"

    });
  }
};
