const express = require("express");
const { addDriver, updateDriver, deleteDriver } = require("../controller/delivery_boy");
const router = express.Router();

router.route("/add_driver").post(addDriver);
router.route("/update_driver/:id").post(updateDriver);
router.route("/delete_driver/:id").post(deleteDriver);

module.exports = router;