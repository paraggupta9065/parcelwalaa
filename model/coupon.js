// don't know what will be the restaurants field

const mongoose = require("mongoose");

const CouponSchema = mongoose.Schema({
  coupon_code: {
    type: String,
    required: [true, "Please provide coupon code"],
  },
  description: {
    type: String,
    required: [true, "Please provide description"],
  },
  percentage_discount: {
    type: Number,
    required: [true, "Please provide percentage discount"],
  },
  valid_from: {
    type: Date,
    required: [true, "Please provide valid from."],
  },
  valid_to: {
    type: Date,
    required: [true, "Please provide valid to."],
  },
  max_discount: {
    type: Number,
    required: [true, "Please provide max discount"],
  },
  min_cart_value: {
    type: Number,
    required: [true, "Please provide min cart value"],
  },
  max_no_times: {
    type: Number,
    default: 1,
    required: [true, "Please provide max number of times."],
  },
  max_no_of_times_per_user: {
    type: Number,
    default: 1,
    required: [true, "Please provide max number of times per user."],
  },
  is_active: {
    type: Boolean,
    required: [true, "Please provide if coupon is active or not."],
  },
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: [true, "Please provide shop id"],
  },
  added_on: {
    type: Date,
    default: Date.now,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      required: [
        true,
        "Please provide the categories applicable for this coupon",
      ],
    },
  ],
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [
        true,
        "Please provide the products applicable for this coupon",
      ],
    },
  ],
  restaurants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: [
        true,
        "Please provide the restaurants applicable for this coupon",
      ],
    },
  ],
});

module.exports = mongoose.model("Coupon", CouponSchema);
