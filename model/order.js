// don't know what would be order_inventory
// and payment_method_id

const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  order_note: {
    type: String,
  },
  order_inventory: {
    
  },
  pickup_address_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: [true, "Please provide pickup address"],
  },
  delivery_address_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: [true, "Please provide delivery address"],
  },
  coupon_code_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  total_gst: {
    type: Number,
    required: [true, "Please provide total gst"],
  },
  net_amt: {
    type: Number,
    required: [true, "Please provide net amount"],
  },
  discount_amt: {
    type: Number,
    required: [true, "Please provide discount amount"],
  },
  inventory_total_amt: {
    type: Number,
    required: [true, "Please provide inventory total amount"],
  },
  delivery_total_amt: {
    type: Number,
    required: [true, "Please provide delivery total amount"],
  },
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: [true, "Please provide shop id"],
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user id"],
  },
  transaction_id: {
    type: String,
    required: [true, "Please provide transaction id"],
  },
  amount_paid: {
    type: Number,
    required: [true, "Please provide amount paid"],
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
  payment_method_id: {
    type: String,
    required: [true, "Please provide payment method id"],
  },
});

module.exports = mongoose.model("Order", OrderSchema);
