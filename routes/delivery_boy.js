const express = require("express");

const { adddelivery_boy, updatedelivery_boy, deletedelivery_boy } = require("../controller/delivery_boy");
const router = express.Router();

router.route("/add_delivery_boy").post(adddelivery_boy);
router.route("/update_delivery_boy/:id").put(updatedelivery_boy);
router.route("/delete_delivery_boy/:id").delete(deletedelivery_boy);


module.exports = router;