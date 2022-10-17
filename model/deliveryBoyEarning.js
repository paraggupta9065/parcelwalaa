const mongoose = require("mongoose");

const deliveryBoyEarningSchema = mongoose.Schema({
    earning: {
        type: number,
        required: [true, "Please send earning"],
    },
    distanceCover: {
        type: number,
        required: [true, "Please send distance"],
    },
    date_created: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("DeliveryBoyEarning", deliveryBoyEarningSchema);
