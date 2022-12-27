const express = require("express");
const {
  addAddress,
  updateAddress,
  removeAddress,
  getCustumerAddress,
} = require("../controller/address");
const { isLoggedIn } = require("../middleware/user");
const Address = require("../model/address");
const router = express.Router();

router.route("/add_address").post(isLoggedIn, addAddress);
router.route("/update_address").put(isLoggedIn, updateAddress);
router.route("/remove_address/:id").get(isLoggedIn, removeAddress);
router.route("/get_address").get(isLoggedIn, getCustumerAddress);

module.exports = router;
