const categoriesModel = require("../model/categories");
const categoriesStudentsModel = require("../model/categoriesStudents");
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
  categoriesData["image_id"] = result["public_id"];

  const categories = await categoriesModel.create(categoriesData);
  return res.status(201).send({
    status: "sucess",
    categories,
  });
};


exports.addCategoriesStudents = async (req, res) => {
  const categoriesData = req.body;

  if (!categoriesData["name"]) {
    return res.status(400).send({
      status: "fail",
      msg: "Please provide all the fields",
    });
  }
  const result = await cloudinary.uploader.upload(req.file.path);
  categoriesData["image"] = result["url"];
  categoriesData["image_id"] = result["public_id"];

  const categories = await categoriesStudentsModel.create(categoriesData);
  return res.status(201).send({
    status: "sucess",
    categories,
  });
};

exports.updateCategories = async (req, res) => {
  try {
    const id = req.params.id;
    const categoriesData = req.body;
    if (!id) {
      return res.status(400).send({
        status: "fail",
        msg: "Please provide Id",
      });
    }
    const categorie = await categoriesModel.findById(id);
    await cloudinary.uploader.destroy(categorie.image_id);
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log(result)
    categoriesData["image"] = result["url"];
    categoriesData["image_id"] = result["public_id"];
    await categoriesModel.findByIdAndUpdate(id, categoriesData);
    const categories = await categoriesModel.findById(id);
    return res.status(200).send({
      status: "sucess",
      categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      status: "fail",
      error,
      msg: "Something went wrong"
    });
  }
};



exports.updateCategorieStudents = async (req, res) => {
  try {
    const id = req.params.id;
    const categoriesData = req.body;
    if (!id) {
      return res.status(400).send({
        status: "fail",
        msg: "Please provide Id",
      });
    }
    const categorie = await categoriesStudentsModel.findById(id);
    await cloudinary.uploader.destroy(categorie.image_id);
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log(result)
    categoriesData["image"] = result["url"];
    categoriesData["image_id"] = result["public_id"];
    await categoriesStudentsModel.findByIdAndUpdate(id, categoriesData);
    const categories = await categoriesStudentsModel.findById(id);
    return res.status(200).send({
      status: "sucess",
      categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      status: "fail",
      error,
      msg: "Something went wrong"
    });
  }
};


exports.deleteCategoriesStudents = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send({
      status: "fail",
      msg: "Please provide Id",
    });
  }

  await categoriesStudentsModel.findByIdAndDelete(id);

  return res.status(200).send({
    status: "sucess",
    msg: "Deleted sucessfully",
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

exports.getCategorieStudent = async (req, res) => {
  const id = req.params.id;
  const categorie = await categoriesStudentsModel.findById(id);
  if (!categorie) {
    return res.status(200).send({
      status: "fail",
      msg: "not found",
    });
  }

  return res.status(200).send({
    status: "sucess",
    categorie,
  });

};


exports.getCategoriesStudents = async (req, res) => {
  const categories = await categoriesStudentsModel.find().populate();

  return res.status(200).send({
    status: "sucess",
    categories,
  });
};
exports.getCategoriesAdmin = async (req, res) => {
  const categories = await categoriesModel.find().populate();

  return res.status(200).send({
    status: "sucess",
    categories,
  });
};


exports.getCategoriesStudentsAdmin = async (req, res) => {
  const categories = await categoriesStudentsModel.find().populate();

  return res.status(200).send({
    status: "sucess",
    categories,
  });
};