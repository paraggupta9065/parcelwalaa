const shopModel = require("../model/shop");
const jwt = require("jsonwebtoken");

exports.isShop = async (req, res, next) => {
    const id = req.user._id;
    const foundShop = await shopModel.findOne({ user_id: id });
    req.shop = foundShop;
    next();
};