const mongoose = require("mongoose");

const shopSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please send user_id"],
  },
  image: {
    type: String,
    required: [true, "Please send image"],
  },
  banner: {
    type: String,
    required: [true, "Please send banner"],
  },

  lat: {
    type: String,
    // required: [true, "Please send lat"],
  }, long: {
    type: String,
    // required: [true, "Please send long"],
  },
  number: {
    type: Number,
    required: [true, "Please enter number"],
  },
  fssai: {
    type: String,
    required: [true, "Please enter fssai"],
    unique: true,
  },
  admin_commission_rate: {
    type: Number,
    required: [true, "Please enter commission rate"],
    default: 18,
  },
  store_name: {
    type: String,
    required: [true, "Please enter store name"],
    unique: [true, "store name already taken"],
  },
  email: {
    type: String,
    required: [true, "Please enter email "],
    unique: [true, "email already taken"],
  },
  address_line1: String,
  city: String,
  state: String,
  pincode: {
    type: Number,
    required: [true, "Please enter pincode "],
  },

  delivery_charges: {
    type: Number,
    required: [true, "Please enter delivery charges "],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  takeaway: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  }, isOnline: {
    type: Boolean,
    default: true,
  },
  isPrefered: {
    type: Boolean,
    default: false,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      autopopulate: true,

    },
  ],


});

shopSchema.plugin(require('mongoose-autopopulate'));


module.exports = mongoose.model("Shop", shopSchema);
