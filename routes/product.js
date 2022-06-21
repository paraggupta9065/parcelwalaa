const express = require("express");
const {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  searchProducts,
  filterProducts,
  getProductByLocation,
} = require("../controller/product");
const { isLoggedIn } = require("../middleware/user");
const { isAdmin } = require("../middleware/isAdmin");

const router = express.Router();

router.route("/add_product").post(isLoggedIn, isAdmin, addProduct);
router.route("/update_product").put(isLoggedIn, isAdmin, updateProduct);
router.route("/delete_product").delete(isLoggedIn, isAdmin, deleteProduct);
router.route("/get_products").get(isLoggedIn, getProducts);
router.route("/search_products").get(isLoggedIn, searchProducts);
router.route("/filter_products").get(isLoggedIn, filterProducts);
router.route("/get_product_by_location").get(getProductByLocation);

module.exports = router;
