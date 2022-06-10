const express = require("express");
const { homeLayout } = require("../controller/home");
const { isLoggedIn } = require("../middleware/user");
const router = express.Router();
router.route("/home_layout").get(isLoggedIn, homeLayout);
module.exports = router;
