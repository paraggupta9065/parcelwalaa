const categoriesModel = require("../model/categories");
const cloudinary = require('cloudinary').v2;


exports.addCategories = async (req, res) => {
  const categoriesData = req.body;

  if (!categoriesData["name"]) {
    return res.status(400).send({
      status: "fail",
      msg: "Please provide all the fields",
    });
  }
  const result = await cloudinary.uploader.upload(req.file.path);
  categoriesData["image"] = result["url"];
  const categories = await categoriesModel.create(categoriesData);
  return res.status(201).send({
    status: "sucess",
    categories,
  });
};

exports.updateCategories = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send({
      status: "fail",
      msg: "Please provide Id",
    });
  }
  console.log(req.body)

  await categoriesModel.findByIdAndUpdate(id, req.body);

  const categories = await categoriesModel.findById(id);

  return res.status(200).send({
    status: "sucess",
    categories,
  });
};

exports.deleteCategories = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send({
      status: "fail",
      msg: "Please provide Id",
    });
  }

  await categoriesModel.findByIdAndDelete(id);

  return res.status(200).send({
    status: "sucess",
    msg: "Deleted sucessfully",
  });
};

exports.getCategories = async (req, res) => {
  const categories = await categoriesModel.find().populate();

  return res.status(200).send({
    status: "sucess",
    categories,
  });
};
