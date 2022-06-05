const express = require("express");
const { addShops, updateShops, deleteShops } = require("../controller/shop");
const router = express.Router();

router.route('/add_shop').post(addShops);
router.route('/update_shop').post(updateShops);
router.route('/delete_shop').post(deleteShops);

module.exports = router;