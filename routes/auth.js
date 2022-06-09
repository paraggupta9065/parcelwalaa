const express = require("express");
const { sendOtp, verifyOtp } = require("../controller/auth");
const { isLoggedIn } = require("../middleware/user");
const router = express.Router();

router.route("/send_otp").post(sendOtp);
router.route("/verify_otp").post(verifyOtp);

module.exports = router;
