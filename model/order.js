// don't know what would be order_inventory
// and payment_method_id

const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  order_note: {
    type: String,
  },
  order_inventory: [
    {
      quantity: {
        type: Number,
        default: 0,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        autopopulate: true,
        required: true,
      },
    },
  ],
  pickup_address_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  delivery_address_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    autopopulate: true,

    required: [true, "Please provide delivery address"],
  },
  coupon_code_id: {
    type: String,
    default: "na",
  },
  total_gst: {
    type: Number,
    default: 0,
    required: [true, "Please provide total gst"],
  },
  net_amt: {
    type: Number,
    default: 0,
    required: [true, "Please provide net amount"],
  },
  discount_amt: {
    type: Number,
    default: 0,
    required: [true, "Please provide discount amount"],
  },
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
  order_type: {
    type: String,
    enum: ["takeaway", "delivery"],
    required: [true, "Please enter product type"],
  },
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    autopopulate: true,

    required: [true, "Please provide shop id"],
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    autopopulate: true,

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

  status: {
    type: String,
    enum: ["recived", "accepted", "prepared", "assigned", "assignedAccepted", "arrivedShop", "arrivedCustumer", "cancelled", "delivered"],
    default: "recived",
  },

});

OrderSchema.plugin(require('mongoose-autopopulate'));


module.exports = mongoose.model("Order", OrderSchema);
