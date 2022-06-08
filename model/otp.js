const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const otpSchema = mongoose.Schema({
    number: String,
    otp: String,
    otpExpiry: { type: Date, default: Date.now },
});
//otp encrypt
otpSchema.pre('save', async function (next) {
    this.otp = await bcrypt.hash(this.otp, 1);
});
otpSchema.methods.isValidatedOtp = async function (userSendedOtp) {
    return await bcrypt.compare(userSendedOtp, this.otp);
}


module.exports = mongoose.model('otp', otpSchema);