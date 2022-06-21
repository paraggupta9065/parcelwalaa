const express = require("express");
const {
  addAddress,
  updateAddress,
  deleteAddress,
} = require("../controller/address");
const { isLoggedIn } = require("../middleware/user");
const Address = require("../model/address");
const router = express.Router();

router.route("/add_adress").post(isLoggedIn, addAddress);
router.route("/update_adress").put(isLoggedIn, updateAddress);
router.route("/delete_adress").delete(isLoggedIn, deleteAddress);

module.exports = router;
