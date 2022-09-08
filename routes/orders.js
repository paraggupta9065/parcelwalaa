const express = require("express");
const { getOrdersShops, getOrders } = require("../controller/orders");
const { isShop } = require("../middleware/isShop");
const { isLoggedIn } = require("../middleware/user");
const router = express.Router();
router.route("/get_orders").get(isLoggedIn, isShop, getOrders);
router.route("/get_orders/:id").get(isLoggedIn, getOrdersShops);
module.exports = router;
