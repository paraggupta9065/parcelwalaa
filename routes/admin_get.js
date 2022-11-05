const express = require("express");
const { sendOtp, verifyOtp, setToken } = require("../controller/auth");
const { getBannersAdmin } = require("../controller/banner");
const { getCategoriesAdmin } = require("../controller/categories");
const { getCouponsAdmin } = require("../controller/coupon");
const { getOrdersAdmin } = require("../controller/orders");
const { getProductsAdmin } = require("../controller/product");
const { getShop } = require("../controller/shop");
const { isLoggedIn } = require("../middleware/user");
const { isAdmin } = require("../middleware/isAdmin");
const router = express.Router();

router.route("/get_shops").get(isLoggedIn, isAdmin, getShop);
router.route("/get_categories").get(isLoggedIn, isAdmin, getCategoriesAdmin);
router.route("/get_products").get(isLoggedIn, isAdmin, getProductsAdmin);
router.route("/get_banners").get(isLoggedIn, isAdmin, getBannersAdmin);
router.route("/get_coupons").get(isLoggedIn, isAdmin, getCouponsAdmin);
router.route("/get_orders").get(isLoggedIn, isAdmin, getOrdersAdmin);


module.exports = router;
