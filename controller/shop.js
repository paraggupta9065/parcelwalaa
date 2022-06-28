const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const otp = require("../model/otp");
const shopModel = require("../model/shop");
const userModel = require("../model/user");

exports.addShops = async (req, res) => {
  const image = "adf";
  const banner = "dfsdf";
  // const { number, store_name, email, address_line1, admin_commission_rate,city, state, fssai ,deliveryCharges} = req.body;
  const shopData = req.body;
  const jwtToken = req.headers.token;

  const token = await jsonwebtoken.verify(jwtToken, process.env.JWT_SECRET);
  const user = await userModel.findById(token.id);
  if (!user) {
    res
      .status(404)
      .send({ status: "fail", msg: "No user found related to token" });
  }
  shopData["user_id"] = token.id;
  shopData["image"] = image;
  shopData["banner"] = banner;
  const shop = await shopModel.create(shopData);
  res
    .status(201)
    .send({ status: "sucess", msg: "shop added successfully", shop: shop });
};

exports.updateShops = async (req, res) => {
  const shopData = req.body;
  await shopModel.findOneAndUpdate({ number: shopData["number"] }, shopData);
  const shop = await shopModel.findOne({ number: shopData["number"] });
  res
    .status(200)
    .send({ status: "sucess", msg: "shop updated successfully", shop: shop });
};

exports.deleteShops = async (req, res) => {
  const { number } = req.body;
  await shopModel.findOneAndDelete({ number: number });
  await userModel.findOneAndDelete({ number: number });
  res.status(200).send({ status: "sucess", msg: "shop deleted successfully" });
};

exports.getShops = async (req, res) => {
  const shops = await shopModel.find();

  res.status(200).send({ status: "sucess", msg: "shop successfully", shops });
};

exports.storeStatusUpdate = async (req, res) => {
  const { isOnline, number } = req.body;
  await shopModel.findOneAndUpdate({ number: number }, { isOnline: isOnline });

  const shop = await shopModel.findOne({ number: number });

  res
    .status(200)
    .send({ status: "sucess", msg: "shop updated successfully", shop: shop });
};

exports.storeAdminStatusUpdate = async (req, res) => {
  const { isActive, number } = req.body;
  await shopModel.findOneAndUpdate({ number: number }, { isActive: isActive });

  const shop = await shopModel.findOne({ number: number });

  res
    .status(200)
    .send({ status: "sucess", msg: "shop updated successfully", shop: shop });
};
exports.getStoresByPincode = async (req, res) => {
  const { pincode } = req.body;
  if (!pincode) {
    res
      .status(404)
      .send({ status: "fail", msg: "pincode not found" });
  }
  const shops = await shopModel.find({ "pincode": pincode });
  if (shops.length == 0) {
    res
      .status(404)
      .send({ status: "fail", msg: "no shops found" });
  }
  res
    .status(200)
    .send({ status: "sucess", msg: "shop fetched successfully", shops });
};
