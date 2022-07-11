const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
    maxLength: [40, "Name Should Be Less Than 40 Char"],
  },
  number: {
    type: Number,
    required: [true, "Please enter number"],
    unique: true,
  },
  role: {
    type: String,
    enum: ["deliveryBoy", "user", "admin", "shop"],
    default: "user",
  },
  fmc_token: {
    type: String,
    default: "null",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

module.exports = mongoose.model("User", UserSchema);
