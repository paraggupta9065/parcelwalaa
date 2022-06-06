const express = require("express");
const { sendOtp, verifyOtp } = require("../controller/auth");
const { isloggedin } = require("../middleware/user");
const router = express.Router();

router.route("/send_otp").post(sendOtp);
router.route("/verify_otp").post(verifyOtp);
router.route("/is_loggedin").get(isloggedin);

module.exports = router;
