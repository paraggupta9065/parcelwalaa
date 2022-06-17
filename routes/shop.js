const express = require("express");
const { addShops, updateShops, deleteShops, getShops, storeAdminStatusUpdate, storeStatusUpdate } = require("../controller/shop");
const { isAdmin } = require("../middleware/isAdmin");
const { isLoggedIn } = require("../middleware/user");
const router = express.Router();

router.route("/add_shop").post(isLoggedIn, isAdmin, addShops);
router.route("/update_shop").put(isLoggedIn, isAdmin, updateShops);
router.route("/delete_shop").delete(isLoggedIn, isAdmin, deleteShops);
router.route("/get_shops").get(isLoggedIn, isAdmin, getShops);
router.route("/store_status_update").post(isLoggedIn, storeStatusUpdate);
router.route("/store_admin_status_update").post(isLoggedIn, isAdmin, storeAdminStatusUpdate);

module.exports = router;
