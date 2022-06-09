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
const { isAdmin } = require("../middleware/isAdmin");

const router = express.Router();

router.route("/add_product").post(isLoggedIn, isAdmin, addProduct);
router.route("/update_product").put(isLoggedIn, isAdmin, updateProduct);
router.route("/delete_product").delete(isLoggedIn, isAdmin, deleteProduct);
router.route("/get_products").get(getProducts);
router.route("/search_products").get(searchProducts);
router.route("/filter_products").get(filterProducts);

module.exports = router;
