const express = require("express");
const { addShops, updateShops, deleteShops } = require("../controller/shop");
const router = express.Router();

router.route('/add_shop').post(addShops);
router.route('/update_shop').put(updateShops);
router.route('/delete_shop').delete(deleteShops);

module.exports = router;