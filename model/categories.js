const mongoose = require("mongoose");

const CategoriesSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Provide the name of category"],
  },
  image: {
    type: String,
    required: [true, "Provide the image of category"],
  },
  subCategories: [mongoose.Schema.Types.ObjectId],
});

module.exports = mongoose.model("Categories", CategoriesSchema);
