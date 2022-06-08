const express = require("express");

const {
  addDeliveryBoy,
  updateDeliveryBoy,
  deleteDeliveryBoy,
} = require("../controller/deliveryBoy");
const { isLoggedIn } = require("../middleware/user");
const router = express.Router();

router.route("/add_delivery_boy").post(isLoggedIn, addDeliveryBoy);
router.route("/update_delivery_boy/:id").put(isLoggedIn, updateDeliveryBoy);
router.route("/delete_delivery_boy/:id").delete(isLoggedIn, deleteDeliveryBoy);

module.exports = router;
