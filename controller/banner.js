const Banner = require("../model/banner");

exports.addBanner = async (req, res) => {
  const image = "hi";
  const bannerData = ({ categoryId, openType, isActive, shopId } = req.body);
  bannerData["image"] = image;

  if (!openType || !isActive || !shopId) {
    return res.status(400).send({
      status: "fail",
      msg: "Please provide all the fields",
    });
  }

  const banner = await Banner.create(bannerData);

  return res.status(201).send({
    status: "sucess",
    banner,
  });
};

exports.deleteBanner = async (req, res) => {
  const id = req.params.id;
  await Banner.findByIdAndDelete(id);

  return res.status(200).send({
    status: "sucess",
    msg: "Banner deleted",
  });
};

exports.updateBanner = async (req, res) => {
  const id = req.params.id;
  const image = "hi";
  const bannerData = ({ categoryId, openType, isActive, shop } = req.body);
  bannerData["image"] = image;

  if (!openType || !isActive || !shop) {
    return res.status(400).send({
      status: "fail",
      msg: "Please provide all the fields",
    });
  }

  await Banner.findOneAndUpdate(id, bannerData);
  const banner = await Banner.findById(id);

  return res.status(200).send({
    status: "sucess",
    msg: "banner Updated",
    banner,
  });
};

exports.getAllBanner = async (req, res) => {
  const banner = await Banner.find();

  return res.status(200).send({
    status: "sucess",
    msg: "All Banner Fetched",
    banners: banner,
  });
};

exports.getBannerById = async (req, res) => {
  const id = req.params.id;
  const banner = await Banner.findById(id);

  return res.status(200).send({
    status: "sucess",
    msg: "Banner Fetched",
    banner: banner,
  });
};
