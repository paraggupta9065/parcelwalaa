const express = require("express");
const {
  addDeliveryBoy,
  updateDeliveryBoy,
  deleteDeliveryBoy,
  getDeliveryBoy,
  deliveryBoyStatusUpdate,
  deliveryBoyAdminStatusUpdate,
} = require("../controller/deliveryBoy");
const { isLoggedIn } = require("../middleware/user");
const { isAdmin } = require("../middleware/isAdmin");
const { isDeliveryBoy } = require("../middleware/isDeliveryBoy");
const router = express.Router();

router.route("/add_delivery_boy").post(isLoggedIn, isAdmin, addDeliveryBoy);
router
  .route("/update_delivery_boy")
  .put(isLoggedIn, isDeliveryBoy, updateDeliveryBoy);
router
  .route("/delete_delivery_boy")
  .delete(isLoggedIn, isAdmin, deleteDeliveryBoy);
router.route("/get_delivery_boy").get(isLoggedIn, isAdmin, getDeliveryBoy);
router
  .route("/delivery_boy_status_update")
  .post(isLoggedIn, isDeliveryBoy, deliveryBoyStatusUpdate);
router
  .route("/delivery_boy_admin_status_update")
  .post(isLoggedIn, isAdmin, deliveryBoyAdminStatusUpdate);

module.exports = router;
