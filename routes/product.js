const express = require("express");
const {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  searchProducts,
  filterProducts,
  getProductByLocation,
  getProductByShop
} = require("../controller/product");
const { isLoggedIn } = require("../middleware/user");
const { isAdmin } = require("../middleware/isAdmin");
const { isShop } = require("../middleware/isShop");

const router = express.Router();

router.route("/add_product").post(isLoggedIn, isShop, addProduct);
router.route("/update_product").put(isLoggedIn, isShop, updateProduct);
router.route("/delete_product").delete(isLoggedIn, isShop, deleteProduct);
router.route("/get_products").get(isLoggedIn, getProducts);
router.route("/search_products").get(isLoggedIn, searchProducts);
router.route("/filter_products").get(isLoggedIn, filterProducts);
router.route("/get_product_by_location").post(getProductByLocation);
router.route("/get_product_by_shop").get(getProductByShop);


module.exports = router;
