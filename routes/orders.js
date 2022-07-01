const express = require("express");
const { getOrdersShops } = require("../controller/orders");
const { isShop } = require("../middleware/isShop");
const { isLoggedIn } = require("../middleware/user");
const router = express.Router();
router.route("/get_orders").get(isLoggedIn, isShop, getOrdersShops);
module.exports = router;
