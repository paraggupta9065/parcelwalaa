const express = require('express')
const {
  sendOtp,
  verifyOtp,
  setToken,
  removeToken
} = require('../controller/auth')
const { isLoggedIn } = require('../middleware/user')
const router = express.Router()
const errorHandler = require('../middleware/errorHandler')

router.route('/send_otp').post(sendOtp)
router.route('/verify_otp').post(errorHandler, verifyOtp)
router.route('/set_token').post(isLoggedIn, setToken)

module.exports = router
