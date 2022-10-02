const mongoose = require("mongoose");

const DriverLocationSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please send user_id"],
    },
    locations: [{
        time: {
            type: Date,
            default: Date.now,
        },
        lat: {
            type: String,
            required: [true, "Please enter lat "],
        },
        long: {
            type: String,
            required: [true, "Please enter long "],
        },
    },
    ],
});

module.exports = mongoose.model("DriverLocation", DriverLocationSchema);
