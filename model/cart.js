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
  pickup_address_id: {
    type: String,
    required: [true, "Please provide pickup address."],
  },
  delivery_address_id: {
    type: String,
    required: [true, "Please provide delivery address."],
  },
  cart_inventory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CartInventory",
    },
  ],
  total_gst: {
    type: Number,
    required: [true, "Please provide total GST."],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Cart", CartModel);
