const express = require("express");
const { addBanner, deleteBanner, updateBanner, getAllBanner, getBannerById, getBannerByPlacement } = require("../controller/banner");
const { isLoggedIn } = require("../middleware/user");
const { isAdmin } = require("../middleware/isAdmin");

const router = express.Router();
//file upload
const multerMod = require("../middleware/multerMod");

//end
router.route("/add_banner").post(multerMod.single("image"), addBanner);
router.route("/delete_banner/:id").delete(isLoggedIn, isAdmin, deleteBanner);
router.route("/update_banner/:id").put(isLoggedIn, isAdmin, updateBanner);
router.route("/get_all_banner").get(isLoggedIn, getAllBanner);
router.route("/get_banner/:id").get(isLoggedIn, getBannerById);
router.route("/get_banner_by_placement/:placement").post(isLoggedIn, getBannerByPlacement);

module.exports = router;