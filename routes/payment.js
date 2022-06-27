const express = require("express");
const { initPayment } = require("../controller/payment");
const { isLoggedIn } = require("../middleware/user");
const router = express.Router();

router.route('/init_payment').get(isLoggedIn, initPayment);

module.exports = router;