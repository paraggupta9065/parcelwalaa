const express = require("express");
const {
  addCategories,
  updateCategories,
  deleteCategories,
  getCategories,
} = require("../controller/categories");
const { isAdmin } = require("../middleware/isAdmin");
const { isLoggedIn } = require("../middleware/user");

const router = express.Router();
//file upload
const multerMod = require("../middleware/multerMod");
//end

router.route("/add_categories").post(multerMod.single('image'), addCategories);
router.route("/update_categories/:id").put(updateCategories);
router.route("/delete_categories/:id").delete(deleteCategories);
router.route("/get_categories/").get(getCategories);

module.exports = router;
