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
  number: {
    type: Number,
    required: [true, "Please enter number"],
    unique: true,
  },

  fssai: {
    type: String,
    required: [true, "Please enter fssai"],
    unique: true,
  },
  admin_commission_rate: {
    type: Number,
    required: [true, "Please enter commission rate"],
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Shop", shopSchema);
