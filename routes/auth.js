const express = require("express");
const { sendOtp, verifyOtp, setToken } = require("../controller/auth");
const { isLoggedIn } = require("../middleware/user");
const router = express.Router();

router.route("/send_otp").post(sendOtp);
router.route("/verify_otp").post(verifyOtp);
router.route("/set_token").post(isLoggedIn, setToken);

module.exports = router;
