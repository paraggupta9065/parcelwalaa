const express = require("express");
const { initPayment, successPayment ,sendNotification} = require("../controller/payment");
const { isLoggedIn } = require("../middleware/user");
const router = express.Router();

router.route('/init_payment').get(isLoggedIn, initPayment);
router.route('/sucess_payment').post(isLoggedIn, successPayment);

module.exports = router;