const categoriesModel = require("../model/categories");

exports.addCategories = async (req, res) => {
  const categoriesData = req.body;

  if (!categoriesData["name"] || !categoriesData["image"]) {
    res.status(400).send({
      status: "fail",
      msg: "Please provide all the fields",
    });
  }

  const categories = await categoriesModel.create(categoriesData);

  res.status(201).send({
    status: "sucess",
    categories,
  });
};

exports.updateCategories = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).send({
      status: "fail",
      msg: "Please provide Id",
    });
  }

  const categoriesData = req.body;

  await categoriesModel.findByIdAndUpdate(id, categoriesData);

  const categories = await categoriesModel.findById(id);

  res.status(200).send({
    status: "sucess",
    categories,
  });
};

exports.deleteCategories = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).send({
      status: "fail",
      msg: "Please provide Id",
    });
  }

  await categoriesModel.findByIdAndDelete(id);

  res.status(200).send({
    status: "sucess",
    msg: "Deleted sucessfully",
  });
};

exports.getCategories = async (req, res) => {
  const categories = await categoriesModel.find();

  res.status(200).send({
    status: "sucess",
    categories,
  });
};
