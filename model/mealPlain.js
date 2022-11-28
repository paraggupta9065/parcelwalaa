const mongoose = require("mongoose");

const mealPlainSchema = mongoose.Schema({
    images: {
        type: String,
        required: true,
    },
    shop_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true,
    },
    name: {
        type: String,
        required: [true, "Please send name of food plain"],
    },
    description: {
        type: String,
        required: [true, "Please send description of food"],
    },
    time: {
        type: String,
        required: [true, "Please send time of food"],
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"],
    },
    regular_price: {
        type: Number,
        required: [true, "Please enter product regular_price"],
    },
    date_created: {
        type: Date,
        default: Date.now,
    },
});

mealPlainSchema.plugin(require('mongoose-autopopulate'));


module.exports = mongoose.model("canteen", mealPlainSchema);
