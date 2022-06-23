const express = require("express");
const {
  addAddress,
  updateAddress,
  removeAddress,
} = require("../controller/address");
const { isLoggedIn } = require("../middleware/user");
const Address = require("../model/address");
const router = express.Router();

router.route("/add_adress").post(isLoggedIn, addAddress);
router.route("/update_adress").put(isLoggedIn, updateAddress);
router.route("/remove_adress").delete(isLoggedIn, removeAddress);

module.exports = router;
