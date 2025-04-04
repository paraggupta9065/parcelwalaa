const express = require("express");
const { addShops, updateShops, deleteShops, getShops, storeAdminStatusUpdate, storeStatusUpdate, getStoresByPincode, isVerified, getUnverifiedShop, verifyShop, getShop, getOrdersReport, setCategories, getCategories, updateShopsById, } = require("../controller/shop");
const { isAdmin } = require("../middleware/isAdmin");
const { isShop } = require("../middleware/isShop");
const { isLoggedIn } = require("../middleware/user");
const router = express.Router();


//file upload
const multerMod = require("../middleware/multerMod");
//end

router.route("/add_shop").post(multerMod.single("image"), addShops);
router.route("/update_shop").post(isLoggedIn, isAdmin, updateShops);
router.route("/update_shop/:id").post(isLoggedIn, isAdmin, updateShopsById);
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
router.route("/set_categories").post(isLoggedIn, setCategories);
router.route("/get_categories").get(isLoggedIn, getCategories);

module.exports = router;
