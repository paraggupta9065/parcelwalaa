const express = require("express");
const { addShops, updateShops, deleteShops, getShops } = require("../controller/shop");
const { isAdmin } = require("../middleware/isAdmin");
const { isLoggedIn } = require("../middleware/user");
const router = express.Router();

router.route("/add_shop").post(isLoggedIn, isAdmin, addShops);
router.route("/update_shop").put(isLoggedIn, isAdmin, updateShops);
router.route("/delete_shop").delete(isLoggedIn, isAdmin, deleteShops);
router.route("/get_shops").get(isLoggedIn, isAdmin, getShops);

module.exports = router;
