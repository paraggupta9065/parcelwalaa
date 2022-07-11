const mongoose = require("mongoose");

const CategoriesSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Provide the name of category"],
    unique: true,
  },
  image: {
    type: String,
    required: [true, "Provide the image of category"],
  },
  subCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
  }],
});

module.exports = mongoose.model("Categories", CategoriesSchema);
