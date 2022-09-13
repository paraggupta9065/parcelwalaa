const express = require("express");
const { getOrdersShops, getOrders } = require("../controller/orders");
const { isShop } = require("../middleware/isShop");
const { isLoggedIn } = require("../middleware/user");
const router = express.Router();
router.route("/get_orders").get(isLoggedIn, getOrders);
router.route("/get_orders/:id").get(isLoggedIn, isShop, getOrdersShops);
router.route("/get_orders_by_shop/:id").get(isLoggedIn, isShop, getOrdersShops);
module.exports = router;
