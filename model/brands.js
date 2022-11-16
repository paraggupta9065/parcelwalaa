const mongoose = require("mongoose");

const brandSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide the name of tags"],

    },
    categories_students: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
    },
    date_created: {
        type: Date,
        default: Date.now,
    },

});

module.exports = mongoose.model("brand", brandSchema);
