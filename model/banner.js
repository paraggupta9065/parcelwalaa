const mongoose = require("mongoose");

const BannerSchema = mongoose.Schema({
  image: {
    type: String,
    required: [true, "Please Send Image"],
  },
  openType: {
    type: String,
    enum: ["product", "categories", "shop"],
    required: [true, "Enter Open Type"],
  },
  product_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
  },
  placement: {
    type: String,
    enum: ["home", "shop", "footer", 'header'],
    required: [true, "Please enter placment id"],
  },
  isActive: {
    type: Boolean,
    required: [true, "Please enter is active value"],
  },

});

module.exports = mongoose.model("Banner", BannerSchema);
