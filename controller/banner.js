const bannerModel = require("../model/banner");




exports.addBanner = async (req, res) => {
  const bannerData = ({ openType, isActive } = req.body);
  bannerData["image"] = req.file.filename;

  if (!openType || !isActive) {
    return res.status(400).send({
      status: "fail",
      msg: "Please provide all the fields",
    });
  }

  const banner = await bannerModel.create(bannerData);

  return res.status(201).send({
    status: "sucess",
    banner,
  });
};

exports.deleteBanner = async (req, res) => {
  const id = req.params.id;
  await bannerModel.findByIdAndDelete(id);

  return res.status(200).send({
    status: "sucess",
    msg: "Banner deleted",
  });
};

exports.updateBanner = async (req, res) => {
  const id = req.params.id;
  const bannerData = req.body;
  await bannerModel.findOneAndUpdate(id, bannerData);
  const banner = await bannerModel.findById(id);

  return res.status(200).send({
    status: "sucess",
    msg: "banner Updated",
    banner,
  });
};

exports.getAllBanner = async (req, res) => {
  const banner = await bannerModel.find();

  return res.status(200).send({
    status: "sucess",
    msg: "All Banner Fetched",
    banners: banner,
  });
};

exports.getBannerById = async (req, res) => {
  const id = req.params.id;
  const banner = await bannerModel.findById(id);

  return res.status(200).send({
    status: "sucess",
    msg: "Banner Fetched",
    banner: banner,
  });
};
