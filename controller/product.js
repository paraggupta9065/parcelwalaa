const productModel = require("../model/product");
const shopModel = require("../model/shop");
const cloudinary = require('cloudinary').v2;


// create the product
exports.addProduct = async (req, res) => {
  const number = req.user.number;

  const shop = await shopModel.findOne({ number });

  const {
    name,
    type,
    description,
    veg_type,
    price,
    regular_price,
    weight,
    // categories,
    tags,
  } = req.body;
  // const images = req.file.filename;
  const result = await cloudinary.uploader.upload(req.file.path);
  const images = result["url"];


  if (
    !name ||
    !type ||
    !description ||
    !veg_type ||
    !price ||
    !regular_price ||
    !weight
  ) {
    return res.status(400).send({
      status: "fail",
      msg: "Please provide all feilds",
    });
  }

  const productData = {
    name,
    type,
    description,
    veg_type,
    price,
    regular_price,
    weight,
    categories: [{ "hisir": "byesir" },],
    tags: [],
    images,
    variations: "",
    shop_id: shop._id,
    pincode: shop.pincode,
  };

  const product = await productModel.create(productData);

  return res.status(201).send({ status: "sucess", product });
};

// update product
exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  await productModel.findOneAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  const updatedProduct = await productModel.findOne({ shop_id: req.shop._id });

  return res.status(200).send({
    status: "sucess",
    msg: "Updated sucessfully",
    product: updatedProduct,
  });
};

// delete product using req.params.id
exports.deleteProduct = async (req, res) => {
  const id = req.params.id;

  const product = await productModel.findByIdAndDelete(id);

  if (!product) {
    return res
      .status(404)
      .send({ status: "fail", msg: "product not found." });
  }

  res
    .status(200)
    .send({ status: "sucess", msg: "product deleted sucessfully" });
};

exports.getProducts = async (req, res) => {
  const products = await productModel.find();
  return res.status(200).send({ status: "sucess", products });
};

// search products using name
exports.searchProducts = async (req, res) => {
  const name = req.body.name;

  if (!name) {
    return res.status(400).send({ status: "fail", msg: "Please provide the keyword" });
  }

  if (name.length < 3) {
    return res.status(400).send({
      status: "fail",
      msg: "Please provide keyword of length 3 or more",
    });
  }

  const products = await productModel.find({
    name: { $regex: new RegExp(name), $options: "i" },
  });

  if (!products) {
    return res.status(404).send({ status: "fail", msg: "No products found." });
  }

  return res.status(200).send({ status: "sucess", products });
};

// filter products
exports.filterProducts = async (req, res) => {
  const body = req.body;

  const products = await productModel.find(body);

  if (!products) {
    return res.status(404).send({ status: "fail", msg: "No products found." });
  }

  return res.status(200).send({ status: "sucess", products });
};

// get product by products
exports.getProductByLocation = async (req, res) => {
  const { pincode } = req.body;

  // const products = await productModel.find(body);

  const products = await productModel.find({ pincode }).populate("shop_id");
  if (products.length == 0) {
    return res.status(404).send({ status: "fail", msg: "No product found." });
  }
  return res.status(200).send({ status: "sucess", msg: "products fetched.", products });
};

exports.getProductByShop = async (req, res) => {
  const { shop_id } = req.params;
  if (!shop_id) {
    return res.status(404).send({ status: "fail", msg: "No Shop Found." });
  }
  const products = await productModel.find({ shop_id });
  if (products.length == 0) {
    return res.status(404).send({ status: "fail", msg: "No Product Found." });
  }



  return res.status(200).send({ status: "sucess", msg: "shops product fetched.", products });
};

exports.getProduct = async (req, res) => {
  const { id } = req.params;

  const product = await productModel.findById(id);
  if (!product) {
    return res.status(404).send({ status: "fail", msg: "No Product Found." });
  }



  return res.status(200).send({ status: "sucess", msg: "shops fetched.", product });
};

exports.getSearchProduct = async (req, res) => {
  const { key } = req.params;
  if (!key || key.length < 5) {
    return res.status(404).send({ status: "fail", msg: "Minimum 5 words required" });
  }

  const product = await productModel.find({ name: { "$regex": key, "$options": "i" } });
  if (product.length == 0) {
    return res.status(404).send({ status: "fail", msg: "No Product Found." });
  }

  return res.status(200).send({ status: "sucess", msg: "product fetched.", product });
};