const express = require("express");
const {
  addCategories,
  updateCategories,
  deleteCategories,
  getCategories,
  addCategoriesStudents,
  updateCategorieStudents,
  deleteCategoriesStudents,
  getCategoriesStudents,
  getCategorieStudent,
} = require("../controller/categories");
const { isAdmin } = require("../middleware/isAdmin");
const { isLoggedIn } = require("../middleware/user");

const router = express.Router();
//file upload
const multerMod = require("../middleware/multerMod");
const { getShopByCategories } = require("../controller/shop");
//end

router.route("/add_categories").post(multerMod.single('image'), addCategories);
router.route("/update_categories/:id").post(multerMod.single('image'), updateCategories);
router.route("/delete_categories/:id").get(deleteCategories);
router.route("/get_categories/").get(getCategories);
router.route("/add_categories_students").post(multerMod.single('image'), addCategoriesStudents);
router.route("/update_categorie_students/:id").post(multerMod.single('image'), updateCategorieStudents);
router.route("/delete_categories_students/:id").get(deleteCategoriesStudents);
router.route("/get_categories_students").get(getCategoriesStudents);
router.route("/get_shop_by_categories").post(getShopByCategories);
router.route("/get_categories_students/:id").get(getCategorieStudent);


module.exports = router;
