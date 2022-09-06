const express = require("express");
const {
  addCoupon,
  updateCoupon,
  deleteCoupon,
  getCoupons,
  applyCoupon,
} = require("../controller/coupon");
const { isLoggedIn } = require("../middleware/user");

const router = express.Router();

router.route("/add_coupon").post(isLoggedIn, addCoupon);
router.route("/apply_coupon").post(isLoggedIn, applyCoupon);
router.route("/update_coupon").post(isLoggedIn, updateCoupon);
router.route("/delete_coupon/:id").get(isLoggedIn, deleteCoupon);
router.route("/get_coupons").get(isLoggedIn, getCoupons);

module.exports = router;
