// don't know what will be the restaurants field

const mongoose = require("mongoose");

const TripSchema = mongoose.Schema({
    delivery_boy_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryBoy",
        required: [true, "Please send Delivery boy id"],
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
        required: [true, "Please send order id"],
    },
    locations: [
        {
            lat: {
                type: mongoose.Types.Decimal128,
                required: [true, "Please send locations"],
            },
            long: {
                type: mongoose.Types.Decimal128,
                required: [true, "Please send locations"],
            },
        }
    ]

});

module.exports = mongoose.model("trip", TripSchema);
