const mongoose = require("mongoose");

const CartModel = mongoose.Schema({
  inventory_total_amt: {
    type: Number,
    default: 0,
    required: [true, "Please provide inventory total amount"],
  },
  delivery_total_amt: {
    type: Number,
    default: 0,
    required: [true, "Please provide delivery total amount"],
  },
  coupon_code_id: {
    type: String,
    default: "na",
  },
  discount_amt: {
    type: Number,
    default: 0,
  },
  net_amt: {
    type: Number,
    default: 0,
    required: [true, "Please provide the total amount to be paid."],
  },
  shop_id: {
    ref: "Shop",
    type: mongoose.Schema.Types.ObjectId,
    type: String,
    required: [true, "Please provide pickup address."],
  },
  pickup_address_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    // required: [true, "Please provide delivery address."],
  },
  delivery_address_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: [true, "Please provide delivery address."],
  },
  cart_inventory: [
    {
      quantity: {
        type: Number,
        default: 1,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
  total_gst: {
    type: Number,
    default: 0,
    required: [true, "Please provide total GST."],
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Cart", CartModel);
