const mongoose = require("mongoose");

const driverSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please send name"],
    },
    image: {
        type: String,
        required: [true, "Please send image"],
    },
    number: {
        type: String,
        required: [true, "Please send number"],
        unique: true,
    },
    aadhar: {
        type: String,
        required: [true, "Please send aadhar"],
        maxLength: 12,
        minLength: 12,
        unique: [true, "Aadhar already exists"],
    },
    pan: {
        type: String,
        required: [true, "Please send pan"],
        unique: [true, "Pan already exists"],
    },
    upi: {
        type: String,
        required: [true, "Please send upi"],
        unique: [true, "Upi already exists"],
    },
    bike_number: {
        type: String,
        required: [true, "Please send bike number"],
        unique: [true, "Bike number already exists"],
    },
    driving_license_image: {
        type: String,
        required: [true, "Please send driving license image"],
    }
})

module.exports = mongoose.model("driver", driverSchema);