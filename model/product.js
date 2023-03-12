const mongoose = require('mongoose')
const cartModel = require('../model/cart')

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    maxLength: [40, 'Name Should Be Less Than 40 Char']
  },
  date_created: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['food', 'grocery'],
    required: [true, 'Please enter product type']
  },
  status: {
    type: Boolean,
    required: [true, 'Please enter product status'],
    default: true
  },
  featured: {
    type: Boolean,
    required: [true, 'Please enter featured status'],
    default: false
  },

  description: {
    type: String,
    required: [true, 'Please enter product description']
  },
  veg_type: {
    type: String,
    enum: ['veg', 'non-veg', 'eggs'],
    required: [true, 'Please enter product veg_type']
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price']
  },
  regular_price: {
    type: Number,
    required: [true, 'Please enter product regular_price']
  },
  weight: {
    type: Number,
    required: [true, 'Please enter product weight']
  },
  rating_count: {
    type: Number,
    default: 0
  },
  reviews: [String],
  categories: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categories'
  },
  categoriesStudents: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CategoriesStudents'
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'brand'
  },
  images: {
    type: String,
    required: true
  },

  image_id: {
    type: String,
    required: [true, 'Please Send image_id']
  },
  variations: {
    type: String
  },
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  pincode: Number,
  in_cart: {
    type: Boolean,
    required: [true, 'Please enter product status'],
    default: false
  }
})

module.exports = mongoose.model('Product', ProductSchema)
