const mongoose = require("mongoose")

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
        maxLength: [40, 'Name Should Be Less Than 40 Char'],
    },
    date_created: {
        type: Date,
        default: Date.now,
    },
    type: {
        type: String,
        enum: ["food", "grocery"],
        required: [true, "Please enter product type"],
    },
    status: {
        type: Number,
        enum: [0, 1],
        required: [true, "Please enter product status"],

    },
    featured: {
        type: String,
    },
    description: {
        type: String,
        required: [true, "Please enter product description"],

    },
    veg_type: {
        type: String,
        enum: ["veg", "non-veg", "eggs"],
        required: [true, "Please enter product veg_type"],

    },
    price: {
        type: Number,
        required: [true, "Please enter product price"],
    },
    regular_price: {
        type: Number,
        required: [true, "Please enter product regular_price"],

    },
    weight: {
        type: Number,
        required: [true, "Please enter product weight"],

    },
    rating_count: {
        type: Number,
        default: 0,
    },
    reviews: [String],
    categories:[
        {
            name: {
                type: String,
                required: [true, "Provide the name of category"],
            },
            image: {
                type: String,
                required: [true, "Provide the image of category"]
            },
            subCategories: [""],
        }
    ],
    tags: [String],
    images: {
        type: String,
        required: true,
    },
    variations: {
        type: String,
    },
    shop_id: {
        type: String,
        // ref: "Shop",
        // required: true,
    }
})

module.exports = mongoose.model("Product", ProductSchema)
