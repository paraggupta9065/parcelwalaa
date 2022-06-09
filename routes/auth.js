const express = require("express");
const { sendOtp, verifyOtp } = require("../controller/auth");
const { isUser } = require("../middleware/isUser");
const router = express.Router();


router.route('/send_otp').post(sendOtp);
router.route('/verify_otp').post(verifyOtp);


module.exports = router;
