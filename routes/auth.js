const express = require("express");
const { sendOtp, verifyOtp, setToken } = require("../controller/auth");
const router = express.Router();

router.route("/send_otp").post(sendOtp);
router.route("/verify_otp").post(verifyOtp);
router.route("/set_token/:token").post(setToken);

module.exports = router;
