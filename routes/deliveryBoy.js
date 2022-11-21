const express = require("express");
const {
  addDeliveryBoy,
  updateDeliveryBoy,
  deleteDeliveryBoy,
  getDeliveryBoy,
  deliveryBoyStatusUpdate,
  deliveryBoyAdminStatusUpdate,
  verifyDriver,
  isVerified,
  getUnverifiedDriver,
  deliveryBoyStatus,

  getAsssignedOrder,
  setLocation,
} = require("../controller/deliveryBoy");
const { isLoggedIn } = require("../middleware/user");
const { isAdmin } = require("../middleware/isAdmin");
const { isDeliveryBoy } = require("../middleware/isDeliveryBoy");
const router = express.Router();
router.route("/add_delivery_boy").post(addDeliveryBoy);
router
  .route("/update_delivery_boy")
  .put(isLoggedIn, isDeliveryBoy, updateDeliveryBoy);
router
  .route("/delete_delivery_boy")
  .delete(isLoggedIn, isAdmin, deleteDeliveryBoy);
router.route("/get_delivery_boy").get(isLoggedIn, isAdmin, getDeliveryBoy);
router
  .route("/get_delivery_boy_status_update")
  .post(isLoggedIn, isDeliveryBoy, deliveryBoyStatusUpdate);
router
  .route("/delivery_boy_status")
  .get(isLoggedIn, isDeliveryBoy, deliveryBoyStatus);
router
  .route("/delivery_boy_admin_status_update")
  .post(isLoggedIn, isAdmin, deliveryBoyAdminStatusUpdate);
router.route("/verify_driver/:id").get(isLoggedIn, isAdmin, verifyDriver);
router.route("/is_verified").get(isLoggedIn, isVerified);
router.route("/get_unverified_driver").get(isLoggedIn, isAdmin, getUnverifiedDriver);
router.route("/get_asssigned_order").get(isLoggedIn, isDeliveryBoy, getAsssignedOrder);
router.route("/set_location").post(isLoggedIn, isDeliveryBoy, setLocation);

module.exports = router;
