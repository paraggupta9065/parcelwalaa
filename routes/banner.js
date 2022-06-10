const express = require("express");
const { addBanner, deleteBanner, updateBanner, getAllBanner, getBannerById } = require("../controller/banner");
const { isLoggedIn } = require("../middleware/user");

const router = express.Router();

router.route("/add_banner").post(isLoggedIn, addBanner);
router.route("/delete_banner/:id").delete(isLoggedIn, deleteBanner);
router.route("/update_banner/:id").put(isLoggedIn, updateBanner);
router.route("/get_all_banner").get(isLoggedIn, getAllBanner);
router.route("/get_banner/:id").get(isLoggedIn, getBannerById);

module.exports = router;