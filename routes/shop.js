const express = require("express");
const { addShops, updateShops, deleteShops } = require("../controller/shop");
const { isLoggedIn } = require("../middleware/user");
const router = express.Router();

router.route("/add_shop").post(isLoggedIn, addShops);
router.route("/update_shop").put(isLoggedIn, updateShops);
router.route("/delete_shop").delete(isLoggedIn, deleteShops);

module.exports = router;
