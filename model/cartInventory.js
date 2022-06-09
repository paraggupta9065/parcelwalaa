const mongoose = require("mongoose");

const CartInventory = mongoose.Schema({
  quantity: {
    type: Number,
    default: 0,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

module.exports = mongoose.model("CartInventory", CartInventory);
