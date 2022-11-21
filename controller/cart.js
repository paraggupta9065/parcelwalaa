const cartModel = require("../model/cart");
const productModel = require("../model/product");
const shopModel = require("../model/shop");
const couponModel = require("../model/coupon");
const { default: mongoose } = require("mongoose");
const { array } = require("../middleware/multerMod");

exports.addToCart = async (req, res) => {
  // try {

  const { productId, delivery_address_id, coupon_code_id } = req.body;
  console.log(req.body);
  let inventory_total_amt = 0;
  let delivery_total_amt = 0;
  let discount_amt = 0;
  let net_amt = 0;
  let total_gst = 0;
  let cart = await cartModel.findOne({ user_id: req.user._id });
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

      delivery_address_id,
      cart_inventory: [
        {
          quantity: 1,
          product: productId,
          shop_id,
        },
      ],
      total_gst,
      user_id: req.user._id,
    };

    cart = await cartModel.create(newCart);

    return res.status(201).send({
      status: "sucess",
      msg: "Added To Cart",
      cart,
    });
  }
  inventory_total_amt = cart['inventory_total_amt'] + product.price;

  delivery_total_amt = delivery_total_amt + shop.delivery_charges;
  if (coupon_code_id != "na") {
    const coupon = await couponModel.findById(coupon_code_id);
    discount_amt = (product.price / 100) * coupon.percentage_discount;
  }
  total_gst = total_gst + ((product.price - discount_amt) / 100) * 5;
  net_amt =
    net_amt +
    (inventory_total_amt + delivery_total_amt - discount_amt + total_gst);

  let updateCart = {
    inventory_total_amt,
    delivery_total_amt,
    coupon_code_id,
    discount_amt,
    net_amt,
    delivery_address_id,
    total_gst,
    user: req.user._id,
  };
  const findedProduct = await cartModel.find({
    "user_id": req.user._id,
    cart_inventory: {
      $elemMatch: {
        product: productId,
        shop_id,
      }
    }
  });
  console.log(findedProduct)
  if (!findedProduct) {
    await cartModel.findOneAndUpdate({
      "_id": cart._id,
      "cart_inventory.product": productId,
    },
      {
        '$inc': {
          'cart_inventory.0.quantity': 1
        }
      }
    );
    await cartModel.findByIdAndUpdate(cart._id, updateCart);
    console.log("1")

  } else {
    console.log("0")
    await cartModel.findByIdAndUpdate(cart._id, updateCart);
    await cartModel.findByIdAndUpdate(cart._id, {
      $push: {
        cart_inventory: {
          quantity: 1,
          product: productId,
          shop_id,
        },
      }
    });




  }





  cart = await cartModel.findById(cart._id);

  return res.status(200).send({
    status: "sucess",
    msg: "Added To Cart",
    cart,
  });

  // } catch (error) {
  //   return res.status(400).send({
  //     status: "fail",
  //     error,


  //     msg: "Something went wrong"

  //   });
  // }
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
function removeItemAll(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

exports.updateQty = async (req, res) => {
  // const { productId, quantity } = req.body;
  // const id = req.user._id;
  // let cart = await cartModel.findOne({ user_id: id });
  // console.log(productId)

  // await cartModel.findByIdAndUpdate({
  //   "user_id": id, "cart_inventory.product": mongoose.Types.ObjectId(productId)
  // },
  //   {
  //     '$set': {
  //       'cart_inventory.$.quantity': quantity,
  //     }
  //   }
  // );
  // cart = await cartModel.findOne({ user_id: id });
  //
  //
  //
  //
  //
  //end

  try {
    const { productId, quantity } = req.body;
    const id = req.user._id;
    const cart = await cartModel.findOne({ user_id: id });
    if (quantity < 1) {

      let inventoryUpdate = new Array;
      inventoryUpdate = cart.cart_inventory;
      inventoryUpdate.forEach((ele) => {
        if (ele.product == productId) {
          removeItemAll(inventoryUpdate, ele);
        }
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

    if (inventoryUpdate.length == 0) {
      await cartModel.findByIdAndDelete(cart._id);
    }
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
