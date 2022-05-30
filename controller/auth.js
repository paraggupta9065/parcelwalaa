const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const otp = require("../model/otp");
const user = require("../model/user");

exports.sendOtp = async (req, res) => {
    const { number } = req.body;
    console.log(req.body)
    if (!number) {
        return res.status(404).send("number not found");
    }
    const otpCode = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    await otp.findOneAndDelete({ "number": number });
    await otp.create({ "otp": otpCode, "number": number, });
    res.send({
        "msg": "otp sended successfully",
        "number": number,
        "code": otpCode,
    });
}
exports.verifyOtp = async (req, res) => {
    const { number, otpCode } = req.body;
    if (!number) {
        return res.status(404).send({ "msg": "Number not found" });
    }
    const otpFound = await otp.findOne({ 'number': number });

    if (!otpFound) {
        return res.status(200).send({ "msg": "Otp Not Sended Yet" });
    }
    if (otpFound.otpExpiry < Date.now) {
        return res.status(200).send({ "msg": "otp expired" });
    }
    const isVerified = await otpFound.isValidatedOtp(otpCode);
    if (!isVerified) {
        return res.status(200).send({ "msg": "Incorrect Otp" });
    }
    const userFound = await user.findOne({ 'number': number });
    if (!userFound) {
        const { name, role } = req.body;
        if (!name && !role) {
            return res.status(404).send({ "msg": "Please send user info to create user" });
        }
        const userCreated = await user.create({ 'name': name, 'number': number, 'role': role });
        const token = await userCreated.getJwtToken();
        return res.status(201).send({ "msg": "User created succesfuly", "token": token });
    }
    const token = await userFound.getJwtToken();
    await otp.findOneAndDelete({ 'number': number });
    return res.status(200).send({ "msg": "Login succesfuly", "token": token });
}