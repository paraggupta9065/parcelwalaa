const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name"],
        maxLength: [40, 'Name Should Be Less Than 40 Char'],
    },
    number: {
        type: Number,
        required: [true, "Please enter number"],

        unique: true,
    },

    role: {
        type: String,
        default: 'user',

    },
    createdAt: {
        type: Date,
        default: Date.now,
    }

});


userSchema.methods.getJwtToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY }
    );
}



module.exports = mongoose.model('User', userSchema);