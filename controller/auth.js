const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const otpModel = require("../model/otp");
const userModel = require("../model/user");
const jwt = require("jsonwebtoken");
const shopModel = require("../model/shop");
const deliveryBoyModel = require("../model/deliveryBoy");

exports.sendOtp = async (req, res) => {
  try {
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
    console.log(otpCode);

    const otp = await otpModel.findOne({ number: number });
    if (!otp) {
      await otpModel.create({ otp: otpCode, number: number });
    } else {
      await otpModel.findOneAndUpdate({ number: number }, { otp: otpCode, number: number });
    }
    console.log('every thing done');
    return res.status(200).send({
      msg: "otp sended successfully",
      status: "sucess",
      number: number,
      code: otpCode,
    });
  } catch (error) {
    return res.status(400).send({
      status: "fail",
      error,
      msg: "Something went wrong"
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
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

    // const isVerified = otpFound['otp'] == otpCode;
    console.log(otpFound['otp'])

    if (!isVerified) {
      const isVerifiedPlain = otpFound.otp == otpCode;
      if (!isVerifiedPlain) {
        return res.status(400).send({ status: "fail", msg: "Incorrect Otp" });
      }
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

    if (userFound.role == "shop") {
      const shop = await shopModel.findOne({ user_id: userFound._id })

      return res
        .status(200)
        .send({
          status: "sucess",
          role: userFound.role,
          shop: shop,
          msg: "Login succesfuly",
          token: token,
        });

    }
    if (userFound.role == "deliveryBoy") {
      const driver = await deliveryBoyModel.findOne({ user_id: userFound._id });



      return res
        .status(200)
        .send({
          status: "sucess",
          role: userFound.role,
          driver,
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
        user: userFound,

      });
  } catch (error) {
    return res
      .status(400)
      .send({
        status: "fail",
        error,
        msg: "Something went wrong"
      });
  }
};


exports.setToken = async (req, res) => {
  try {
    const fmc_token = req.body.fmc_token;
    const device_id = req.body.device_id;
    const user_id = req.user._id;
    const deviceExist = await userModel.findOne({ _id: user_id, 'tokens.deviceId': device_id });
    if (!deviceExist) {
      await userModel.findOneAndUpdate({ _id: user_id, }, { $push: { tokens: { deviceId: device_id, token: fmc_token } } });
    }
    await userModel.findOneAndUpdate({ _id: user_id, 'tokens.deviceId': device_id, }, { $set: { 'tokens.$': { deviceId: device_id, token: fmc_token } } });

    return res.status(200).send({
      status: "sucess",
      msg: "Token set succesfuly",
    });
  } catch (error) {
    return res.status(400).send({
      status: "fail",
      error,
      msg: "Something went wrong"

    });
  }

};
