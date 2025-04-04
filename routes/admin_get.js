const express = require('express')
const { sendOtp, verifyOtp, setToken } = require('../controller/auth')
const { getBannersAdmin } = require('../controller/banner')
const {
  getCategoriesAdmin,
  getCategoriesStudentsAdmin
} = require('../controller/categories')
const { getCouponsAdmin } = require('../controller/coupon')
const {
  getOrdersAdmin,
  getPreviousOrdersAdmin
} = require('../controller/orders')
const { getProductsAdmin } = require('../controller/product')
const { getShop, getShopsAdmin } = require('../controller/shop')
const { isLoggedIn } = require('../middleware/user')
const { isAdmin } = require('../middleware/isAdmin')
const router = express.Router()

router.route('/get_shops').get(isLoggedIn, isAdmin, getShopsAdmin)
router.route('/get_categories').get(isLoggedIn, isAdmin, getCategoriesAdmin)
router.route('/get_products').get(isLoggedIn, isAdmin, getProductsAdmin)
router.route('/get_banners').get(isLoggedIn, isAdmin, getBannersAdmin)
router.route('/get_coupons').get(isLoggedIn, isAdmin, getCouponsAdmin)
router.route('/get_orders').post(isLoggedIn, isAdmin, getOrdersAdmin)
router
  .route('/get_previous_orders')
  .get(isLoggedIn, isAdmin, getPreviousOrdersAdmin)
router
  .route('/get_categories_students')
  .get(isLoggedIn, isAdmin, getCategoriesStudentsAdmin)

module.exports = router
