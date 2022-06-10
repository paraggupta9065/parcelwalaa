const mongoose = require("mongoose");

const AddressSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
  },
  line1: {
    type: String,
    required: [true, "Please provide Line1"],
  },
  landmark: {
    type: String,
    required: [true, "Please provide landmark"],
  },
  pincode: {
    type: Number,
    required: [true, "Please provide pincode"],
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user id"],
  },
  contact_no: {
    type: Number,
    required: [true, "Please provide contact number"],
  },
  state: {
    type: String,
    required: [true, "Please provide state"],
  },
  city: {
    type: String,
    required: [true, "Please provide city"],
  },
  delivery_note: {
    type: String,
  },
  type: {
    type: String,
    enum: ["home", "office", "friendOrFamily"],
    required: [
      true,
      "Please provide type of address(home, office, friendOrFamily)",
    ],
  },
});

module.exports = mongoose.model("Address", AddressSchema);
