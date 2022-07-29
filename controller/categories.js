const categoriesModel = require("../model/categories");

exports.addCategories = async (req, res) => {
  const categoriesData = req.body;
  categoriesData["image"] = req.file.filename;
  if (!categoriesData["name"]) {
    res.status(400).send({
      status: "fail",
      msg: "Please provide all the fields",
    });
  }

  const categories = await categoriesModel.create(categoriesData);
  console.log(categories);

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

  const oldCategory = await categoriesModel.findById(id);

  const categoriesData = req.body;

  categoriesData["subCategories"] &&
    categoriesData["subCategories"].map((data) => {
      oldCategory["subCategories"].push(data);
    });

  categoriesData["subCategories"] = oldCategory["subCategories"];

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
  const { page = 1, limit = 10 } = req.query;

  const categories = await categoriesModel
    .find()
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  res.status(200).send({
    status: "sucess",
    categories,
  });
};
