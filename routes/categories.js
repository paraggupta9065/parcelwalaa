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

router.route("/add_categories").post(upload.single('image'), addCategories);
router.route("/update_categories/:id").put(updateCategories);
router.route("/delete_categories/:id").delete(deleteCategories);
router.route("/get_categories/").get(getCategories);

module.exports = router;
