const express = require("express");
const { addProduct, updateProduct, deleteProduct, getProducts } = require("../controller/product");

const router = express.Router();

router.route("/add_product").post(addProduct);
router.route("/update_product/:id").put(updateProduct);
router.route("/delete_product/:id").put(deleteProduct);
router.route("/get_products").put(getProducts);

module.exports = router