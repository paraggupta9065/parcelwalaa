const express = require("express");
const { addCategories } = require("../controller/categories");
const { isAdmin } = require("../middleware/isAdmin");
const { isLoggedIn } = require("../middleware/user");

const router = express.Router();

router.route("/add_categories").post(isLoggedIn, isAdmin, addCategories);
router.route("/update_categories").put(isLoggedIn, isAdmin, addCategories);
router.route("/delete_categories").delete(isLoggedIn, isAdmin, addCategories);

module.exports = router;
