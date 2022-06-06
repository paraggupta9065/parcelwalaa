const express = require("express");
const { addProduct, updateProduct, deleteProduct, getProducts, searchProducts } = require("../controller/product");

const router = express.Router();

router.route("/add_product").post(addProduct);
router.route("/update_product/:id").put(updateProduct);
router.route("/delete_product/:id").put(deleteProduct);
router.route("/get_products").get(getProducts);
router.route("/search_products").get(searchProducts);

module.exports = router