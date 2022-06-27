const express = require("express");
const {
  addCoupon,
  updateCoupon,
  deleteCoupon,
  getCoupons,
} = require("../controller/coupon");
const { isLoggedIn } = require("../middleware/user");

const router = express.Router();

router.route("/add_coupon").post(isLoggedIn, addCoupon);
router.route("/update_coupon").put(isLoggedIn, updateCoupon);
router.route("/delete_coupon").delete(isLoggedIn, deleteCoupon);
router.route("/get_coupons").get(isLoggedIn, getCoupons);

module.exports = router;
