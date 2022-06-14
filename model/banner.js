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
  productIds: [
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
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: [true, "Please enter shop id"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Banner", BannerSchema);
