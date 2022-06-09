const mongoose = require("mongoose");

const CartModel = mongoose.Schema({
  inventoryTotalAmt: {
    type: Number,
    default: 0,
    required: [true, "Please provide inventory total amount"],
  },
  deliveryTotalAmt: {
    type: Number,
    default: 0,
    required: [true, "Please provide delivery total amount"],
  },
  couponCodeId: {
    type: String,
  },
  discountAmt: {
    type: Number,
    default: 0,
  },
  netAmt: {
    type: Number,
    default: 0,
    required: [true, "Please provide the total amount to be paid."],
  },
  pickupAddressId: {
    type: String,
    required: [true, "Please provide pickup address."],
  },
  deliveryAddressId: {
    type: String,
    required: [true, "Please provide delivery address."],
  },
  cartInventory: [
    {
      quantity: {
        type: Number,
        default: 0,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
  totalGst: {
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
