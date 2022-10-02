// don't know what would be order_inventory
// and payment_method_id

const mongoose = require("mongoose");

const PreviousOrderSchema = mongoose.Schema({
    order_note: {
        type: String,
    },
    order_inventory: [
        {
            quantity: {
                type: Number,
                default: 0,
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
        },
    ],
    shop_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: [true, "Please provide shop id"],
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide user id"],
    },
    transaction_id: {
        type: String,
        required: [true, "Please provide transaction id"],
    },
    amount_paid: {
        type: Number,
        required: [true, "Please provide amount paid"],
    },
    date_created: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["cancelled", "delivered"],
        default: "delivered",
    },
});

module.exports = mongoose.model("PreviousOrder", PreviousOrderSchema);
