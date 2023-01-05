const express = require("express");
const {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  searchProducts,
  filterProducts,
  getProductByLocation,
  getProductByShop,
  getProduct,
  getSearchProduct
} = require("../controller/product");
const { isLoggedIn } = require("../middleware/user");
const { isAdmin } = require("../middleware/isAdmin");
const { isShop } = require("../middleware/isShop");
const router = express.Router();

//file upload
const multerMod = require("../middleware/multerMod");

//end

router.route("/add_product").post(isLoggedIn, isShop, addProduct);
router.route("/update_product").post(isLoggedIn, isShop, updateProduct);
router.route("/delete_product/:id").delete(isLoggedIn, isShop, deleteProduct);
router.route("/get_product/:id").get(isLoggedIn, isShop, getProduct);
router.route("/get_products").get(isLoggedIn, getProducts);
router.route("/search_products").get(isLoggedIn, searchProducts);
router.route("/filter_products").post(isLoggedIn, filterProducts);
router.route("/get_product_by_location").post(getProductByLocation);
router.route("/get_product_by_shop/:shop_id").get(getProductByShop);
router.route("/get_product_search/:key").get(getSearchProduct);


module.exports = router;
