const express = require('express')
const { isLoggedIn } = require('../middleware/user')
const { isUser } = require('../middleware/isUser')
const {
  addToCart,
  updateQty,
  getCart,
  removeCart,
  updateCart
} = require('../controller/cart')

const router = express.Router()

router.route('/add_cart').post(isLoggedIn, isUser, addToCart)
router.route('/get_cart').get(isLoggedIn, isUser, getCart)
router.route('/remove_cart').delete(isLoggedIn, isUser, removeCart)
router.route('/update_cart').post(isLoggedIn, isUser, updateCart)
router.route('/update_qty').post(isLoggedIn, isUser, updateQty)

module.exports = router
