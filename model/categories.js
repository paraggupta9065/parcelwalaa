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
  image_id: {
    type: String,
    required: [true, "Please Send image_id"],
  },

});

module.exports = mongoose.model("Categories", CategoriesSchema);
