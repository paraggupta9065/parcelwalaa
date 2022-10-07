const express = require("express");
const { getOrdersShops, getOrders, updateStatus, getOrderByCustomer, getPreviousOrders } = require("../controller/orders");
const { isShop } = require("../middleware/isShop");
const { isLoggedIn } = require("../middleware/user");
const router = express.Router();
router.route("/get_orders").get(isLoggedIn, getOrders);
router.route("/get_orders/:id").get(isLoggedIn, isShop, getOrdersShops);
router.route("/get_orders_by_shop/:id").get(isLoggedIn, isShop, getOrdersShops);
router.route("/update_status/:id").post(isLoggedIn, isShop, updateStatus);
router.route("/get_order_by_customer").get(isLoggedIn, getOrderByCustomer);
router.route("/get_previous_orders").get(isLoggedIn, getPreviousOrders);

module.exports = router;
