const bannerModel = require("../model/banner");
const cloudinary = require('cloudinary').v2;




exports.addBanner = async (req, res) => {
  try {
    const bannerData = ({ openType, isActive } = req.body);


    if (!openType || !isActive) {
      return res.status(400).send({
        status: "fail",
        msg: "Please provide all the fields",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    console.log(result)
    bannerData["image"] = result["url"];
    bannerData["image_id"] = result["public_id"];
    const banner = await bannerModel.create(bannerData);

    return res.status(201).send({
      status: "sucess",
      banner,
    });
  } catch (error) {
    return res.status(400).send({
      status: "fail",
      error,
      "msg": "something went wrong"
    });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const id = req.params.id;
    await bannerModel.findByIdAndDelete(id);

    return res.status(200).send({
      status: "sucess",
      msg: "Banner deleted",
    });
  } catch (error) {
    return res.status(400).send({
      status: "fail",
      error,

      msg: "Something went wrong"

    });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const id = req.params.id;
    const bannerData = req.body;
    console.log(bannerData)
    await bannerModel.findOneAndUpdate({ '_id': id }, bannerData);
    const banner = await bannerModel.findById(id);


    return res.status(200).send({
      status: "sucess",
      msg: "banner Updated",
      banner,
    });
  } catch (error) {
    return res.status(400).send({
      status: "fail",
      error,

      msg: "Something went wrong"

    });
  }
};

exports.getAllBanner = async (req, res) => {
  try {
    const banner = await bannerModel.find({ isActive: { $ne: false } });

    return res.status(200).send({
      status: "sucess",
      msg: "All Banner Fetched",
      banners: banner,
    });
  } catch (error) {

    return res.status(400).send({
      status: "fail",
      error,

      msg: "Something went wrong"

    });
  }
};
exports.getBannersAdmin = async (req, res) => {
  try {
    const banner = await bannerModel.find();

    return res.status(200).send({
      status: "sucess",
      msg: "All Banner Fetched",
      banners: banner,
    });
  } catch (error) {

    return res.status(400).send({
      status: "fail",
      error,

      msg: "Something went wrong"

    });
  }
};

exports.getBannerById = async (req, res) => {
  try {
    const id = req.params.id;
    const banner = await bannerModel.findById(id);

    return res.status(200).send({
      status: "sucess",
      msg: "Banner Fetched",
      banner: banner,
    });
  } catch (error) {

    return res.status(400).send({
      status: "fail",
      error,

      msg: "Something went wrong"

    });
  }
};

exports.getBannerByPlacement = async (req, res) => {
  try {
    const placement = req.params.placement;
    const pincode = req.body.pincode;
    console.log(pincode)
    const banner = await bannerModel.find({
      placement,
      "pincode": pincode
    });


    return res.status(200).send({
      status: "sucess",
      msg: "All Banner Fetched",
      banners: banner,
    });
  } catch (error) {

    return res.status(400).send({
      status: "fail",
      error,
      msg: "Something went wrong"
    });
  }
};
