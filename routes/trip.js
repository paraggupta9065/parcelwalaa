const express = require("express");
const { startTrip } = require("../controller/orderTrackingController");

const router = express.Router();

router.route("/start_trip").post(startTrip);


module.exports = router;
