const express = require("express");
const { sendOtp, verifyOtp, isloggedin } = require("../controller/auth");
const router = express.Router();

router.route('/send_otp').post(sendOtp);
router.route('/verify_otp').post(verifyOtp);
router.route("/is_loggedin").get(isloggedin);

module.exports = router;