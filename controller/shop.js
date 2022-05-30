const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const otp = require("../model/otp");
const shopModel = require("../model/shop");
const userModel = require("../model/user");

exports.addShops = async (req, res) => {
    const image = "adf";
    const banner = "dfsdf";
    // const { number, store_name, email, address_line1, city, state, fssai } = req.body;
    const shopData = req.body;
    const jwtToken = shopData["token"];

    const token = await jsonwebtoken.verify(jwtToken, process.env.JWT_SECRET);
    console.log(token);
    const user = await userModel.findById(token.id);
    if (!user) {
        res.send({ "msg": "No user found related to token" });
    }
    shopData['user_id'] = token.id;
    shopData['image'] = image;
    shopData['banner'] = banner;
    const shop = await shopModel.create(shopData);
    res.send({ "msg": "shop added successfully", shop: shop });
}

exports.updateShops = async (req, res) => {
    const shopData = req.body;
    await shopModel.findOneAndUpdate({ 'number': shopData['number'] }, shopData);
    const shop = await shopModel.findOne({ 'number': shopData['number'] });
    res.send({ "msg": "shop updated successfully", shop: shop });
}

exports.deleteShops = async (req, res) => {
    const { number } = req.body;
    await shopModel.findOneAndDelete({ 'number': number });
    await userModel.findOneAndDelete({ 'number': number });
    res.send({ "msg": "shop deleted successfully" });
}
