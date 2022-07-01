const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const otpModel = require("../model/otp");
const userModel = require("../model/user");
const jwt = require("jsonwebtoken");
const shopModel = require("../model/shop");

exports.sendOtp = async (req, res) => {
  const { number } = req.body;
  if (!number) {
    return res.status(404).send({
      msg: "Number not found",
      status: "fail",
    });
  }
  const otpCode = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  await otpModel.findOneAndDelete({ number: number });
  await otpModel.create({ otp: otpCode, number: number });
  res.status(200).send({
    msg: "otp sended successfully",
    status: "sucess",
    number: number,
    code: otpCode,
  });
};

exports.verifyOtp = async (req, res) => {
  const { number, otpCode } = req.body;
  if (!number) {
    return res.status(404).send({ status: "fail", msg: "Number not found" });
  }
  const otpFound = await otpModel.findOne({ number: number });

  if (!otpFound) {
    return res.status(400).send({ status: "fail", msg: "Otp Not Sended Yet" });
  }
  if (otpFound.otpExpiry < Date.now) {
    return res.status(400).send({ status: "fail", msg: "otp expired" });
  }
  const isVerified = await otpFound.isValidatedOtp(otpCode);
  if (!isVerified) {
    return res.status(400).send({ status: "fail", msg: "Incorrect Otp" });
  }
  const userFound = await userModel.findOne({ number: number });
  if (!userFound) {
    const { name, role } = req.body;
    if (!name && !role) {
      return res
        .status(404)
        .send({ status: "fail", msg: "Please user not found create user" });
    }
    const userCreated = await userModel.create({
      name: name,
      number: number,
      role: role,
    });
    const token = await userCreated.getJwtToken();
    return res
      .status(201)
      .send({ status: "sucess", msg: "User created succesfuly", token: token });
  }
  const token = await userFound.getJwtToken();
  await otpModel.findOneAndDelete({ number: number });
  const shop = shopModel.findOne({ user_id: userFound._id })

  if (userFound.role == "shop") {
    return res
      .status(200)
      .send({
        status: "sucess",
        role: userFound.role,
        msg: "Login succesfuly",
        token: token,
      });
  }
  return res
    .status(200)
    .send({
      status: "sucess",
      role: userFound.role,
      msg: "Login succesfuly",
      token: token,
    });
};
