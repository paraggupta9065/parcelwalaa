const express = require("express");
const { addShops, updateShops, deleteShops } = require("../controller/shop");
const { isAdmin } = require("../middleware/isAdmin");
const { isLoggedIn } = require("../middleware/user");
const router = express.Router();

router.route("/add_shop").post(isLoggedIn, isAdmin, addShops);
router.route("/update_shop").put(isLoggedIn, isAdmin, updateShops);
router.route("/delete_shop").delete(isLoggedIn, isAdmin, deleteShops);

module.exports = router;
