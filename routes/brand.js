const express = require("express");
const { addBrand, deleteBrand, updateBrand, getBrand, getAllBrand } = require("../controller/brand");
const { update } = require("../model/order");
const router = express.Router();
const { isShop } = require("../middleware/isShop");
const { isLoggedIn } = require("../middleware/user");


router.route("/add_brand").post(addBrand);
router.route("/delete_brand/:id").get(deleteBrand);
router.route("/update_brand/:id").post(updateBrand);
router.route("/get_brands/:id").get(getBrand);
router.route("/get_all_brands").get(getAllBrand);


module.exports = router;
