const express = require("express");
const { addShops, updateShops, deleteShops, getShops, storeAdminStatusUpdate, storeStatusUpdate, getStoresByPincode, isVerified, getUnverifiedShop, verifyShop, getShop, getOrdersReport } = require("../controller/shop");
const { isAdmin } = require("../middleware/isAdmin");
const { isShop } = require("../middleware/isShop");
const { isLoggedIn } = require("../middleware/user");
const router = express.Router();

//file upload
const multer = require('multer')
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    },
});

const upload = multer({ dest: 'uploads/', storage: multerStorage, })
//end

router.route("/add_shop").post(upload.single("image"), addShops);
router.route("/update_shop").put(isLoggedIn, isAdmin, updateShops);
router.route("/delete_shop").delete(isLoggedIn, isAdmin, deleteShops);
router.route("/get_shops").get(isLoggedIn, isAdmin, getShops);
router.route("/get_shop/:id").get(isLoggedIn, getShop);
router.route("/get_unverified_shops").get(isLoggedIn, isAdmin, getUnverifiedShop);
router.route("/store_status_update").post(isLoggedIn, storeStatusUpdate);
router.route("/store_admin_status_update").post(isLoggedIn, isAdmin, storeAdminStatusUpdate);
router.route("/get_stores_by_pincode").post(getStoresByPincode);
router.route("/verify_shop/:shop_id").get(isLoggedIn, isShop, verifyShop);
router.route("/is_verified").get(isLoggedIn, isShop, isVerified);
router.route("/get_orders_report").post(isLoggedIn, getOrdersReport);

module.exports = router;
