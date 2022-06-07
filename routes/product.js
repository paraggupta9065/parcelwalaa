const express = require("express");
const {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  searchProducts,
  filterProducts,
} = require("../controller/product");
const { isLoggedIn } = require("../middleware/user");

const router = express.Router();

router.route("/add_product").post(isLoggedIn, addProduct);
router.route("/update_product").put(isLoggedIn, updateProduct);
router.route("/delete_product").delete(isLoggedIn, deleteProduct);
router.route("/get_products").get(getProducts);
router.route("/search_products").get(searchProducts);
router.route("/filter_products").get(filterProducts);

module.exports = router;
