const express = require("express");
const { addBanner, deleteBanner, updateBanner, getAllBanner, getBannerById } = require("../controller/banner");
const { isLoggedIn } = require("../middleware/user");
const { isAdmin } = require("../middleware/isAdmin");

const router = express.Router();
//file upload
const multer = require('multer')
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${file.fieldname}-${Date.now()}.${"png"}`);
    },
});

const upload = multer({ dest: 'uploads/', storage: multerStorage, })
//end
router.route("/add_banner").post(upload.single("image"), addBanner);
router.route("/delete_banner/:id").delete(isLoggedIn, isAdmin, deleteBanner);
router.route("/update_banner/:id").put(isLoggedIn, isAdmin, updateBanner);
router.route("/get_all_banner").get(isLoggedIn, getAllBanner);
router.route("/get_banner/:id").get(isLoggedIn, getBannerById);

module.exports = router;