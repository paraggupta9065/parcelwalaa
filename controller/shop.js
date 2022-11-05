const orderModel = require("../model/order");
const otpModel = require("../model/otp");
const shopModel = require("../model/shop");
const userModel = require("../model/user");
const cloudinary = require('cloudinary').v2;
const categoriesModel = require("../model/categories");


exports.addShops = async (req, res) => {
  // try {

  // const { otpCode,number, store_name, email, address_line1, admin_commission_rate,city,pincode, state, fssai ,deliveryCharges} = req.body;
  const shopData = req.body;
  const { number, store_name, otpCode } = shopData;
  //Verify Otp
  if (!number) {
    return res.status(404).send({ status: "fail", msg: "Number not found" });
  }
  const otpFound = await otpModel.findOne({ number: number });

  if (!otpFound) {
    return res.status(400).send({ status: "fail", msg: "Otp Not Sended Yet" });
  }
  if (otpFound.otpExpiry < Date.now) {
    return res.status(400).send({ status: "fail", msg: "Otp expired" });
  }
  const isVerified = await otpFound.isValidatedOtp(otpCode);


  if (!isVerified) {
    return res.status(400).send({ status: "fail", msg: "Incorrect Otp" });
  }
  //Otp Verified
  //Creating User

  if (!store_name) {
    return res
      .status(404)
      .send({ status: "fail", msg: "Please send shop info to create shop" });
  }
  const result = await cloudinary.uploader.upload(req.file.path);
  const image = result["url"];
  const banner = "dfsdf";
  const userCreated = await userModel.create({
    name: store_name,
    number: number,
    role: "shop",
  });
  //User Created
  //Creating Shop
  shopData["user_id"] = userCreated._id;
  shopData["image"] = image;
  shopData["banner"] = banner;
  const shop = await shopModel.create(shopData);
  const token = await userCreated.getJwtToken();
  res
    .status(201)
    .send({ status: "sucess", msg: "shop added successfully", shop: shop, user: userCreated, token });
  // } catch (error) {
  //   return res.status(400).send({
  //     status: "fail",
  //     error,
  //     msg: "Something went wrong"

  //   });
  // }
};


exports.updateShops = async (req, res) => {
  const shopData = req.body;
  await shopModel.findOneAndUpdate({ number: shopData["number"] }, shopData);
  const shop = await shopModel.findOne({ number: shopData["number"] });
  res
    .status(200)
    .send({ status: "sucess", msg: "shop updated successfully", shop: shop });
};

exports.updateShopsById = async (req, res) => {
  const shopData = req.body;
  await shopModel.findOneAndUpdate({ '_id': req.params.id }, shopData);
  const shop = await shopModel.findOne({ number: shopData["number"] });
  res
    .status(200)
    .send({ status: "sucess", msg: "shop updated successfully", shop: shop });
};

exports.deleteShops = async (req, res) => {
  const { number } = req.body;
  await shopModel.findOneAndDelete({ number: number });
  await userModel.findOneAndDelete({ number: number });
  return res.status(200).send({ status: "sucess", msg: "shop deleted successfully" });
};

exports.getShops = async (req, res) => {
  const shops = await shopModel.find({ isActive: { $ne: false }, isOnline: { $ne: false } });

  return res.status(200).send({ status: "sucess", msg: "shop successfully", shops });
};

exports.getShopsAdmin = async (req, res) => {
  const shops = await shopModel.find();

  return res.status(200).send({ status: "sucess", msg: "shop successfully", shops });
};

exports.getShop = async (req, res) => {
  const id = req.params.id;
  const shop = await shopModel.findOne({ '_id': id },);
  if (!shop) {
    return res.status(404).send({ status: "fail", msg: "Not found" });
  }

  return res.status(200).send({ status: "sucess", msg: "shop successfully", shop });
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
exports.isVerified = async (req, res) => {
  try {
    const id = req.user._id;

    const shop = await shopModel.findOne({ "user_id": id });
    if (!shop) {
      res
        .status(404)
        .send({ status: "fail", msg: "You are not a vendor", });
    }
    res
      .status(200)
      .send({ status: "sucess", msg: "Verification status", isVerified: shop.isVerified });
  } catch (error) {
    res
      .status(400)
      .send({
        status: "fail", error,
        msg: "Something went wrong"


      });
  }
};
exports.verifyShop = async (req, res) => {
  const id = req.params.shop_id;
  const shop = await shopModel.findByIdAndUpdate(id, { isVerified: true });
  if (!shop) {
    res
      .status(404)
      .send({ status: "fail", msg: "You are not a vendor", });
  }
  res
    .status(200)
    .send({ status: "sucess", msg: "Shop Verified", });
};
exports.getUnverifiedShop = async (req, res) => {

  const shops = await shopModel.find({ isVerified: false });
  if (!shops) {
    res
      .status(404)
      .send({ status: "fail", msg: "All Shop Are Verified", });
  }
  res
    .status(200)
    .send({ status: "sucess", msg: "Shop Fecthed", shops });
};


exports.getOrdersReport = async (req, res) => {
  const { start_date, end_date } = req.body;// yyyy/mm/dd

  const parsed_start_date = Date(start_date);
  const parsed_end_date = Date(end_date);

  const shops = await shopModel.findOne({ number: req.user.number });
  const orders = await orderModel.find(
    {
      "shop_id": shops._id,
      $and: [
        { From: { $gte: parsed_start_date } },
        { To: { $lte: parsed_end_date } },
      ],
    }
  );
  res
    .status(200)
    .send({ status: "sucess", msg: "Order Fetched", orders });
};

exports.setCategories = async (req, res) => {
  const number = req.user.number;
  const shop = await shopModel.findOne({ number });
  if (!shop) {
    res
      .status(404)
      .send({ status: "fail", msg: "Shop not found" });
  }
  await shopModel.findOneAndUpdate({ number }, { categories: req.body.categories });



  res
    .status(200)
    .send({ status: "sucess", msg: "Categories updated" });
};
exports.getCategories = async (req, res) => {
  const number = req.user.number;
  const categories = await categoriesModel.find().populate();
  const shop = await shopModel.findOne({ number });
  if (!shop) {
    res
      .status(404)
      .send({ status: "fail", msg: "Shop not found" });
  }
  res
    .status(200)
    .send({ status: "sucess", msg: "Order Fetched", "shopCategories": shop.categories, categories });
};
exports.getShopByCategories = async (req, res) => {
  const categoryId = req.body.category_id;

  const shops = shopModel.find({});
};
