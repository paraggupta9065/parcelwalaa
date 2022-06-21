const product = require("../model/product");
const productModel = require("../model/product");
const shopModel = require("../model/shop");

// create the product
exports.addProduct = async (req, res) => {
  const productData = req.body;

  const product = await productModel.create(productData);

  res.status(201).send({ status: "sucess", product });
};

// update product using req.params.id
exports.updateProduct = async (req, res) => {
  const product = await productModel.findById(req.params.id);

  if (!product) {
    return res.status(404).send({ status: "fail", msg: "Product not found" });
  }

  await productModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  const updatedProduct = await productModel.findById(req.params.id);

  res.status(200).send({
    status: "sucess",
    msg: "Updated sucessfully",
    product: updatedProduct,
  });
};

// delete product using req.params.id
exports.deleteProduct = async (req, res) => {
  const product = await productModel.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).send({ status: "fail", msg: "Product not found." });
  }

  res
    .status(200)
    .send({ status: "sucess", msg: "Product deleted sucessfully" });
};

exports.getProducts = async (req, res) => {
  const products = await productModel.find();

  res.status(200).send({ status: "sucess", products });
};

// search products using name
exports.searchProducts = async (req, res) => {
  const name = req.body.name;

  if (!name) {
    res.status(400).send({ status: "fail", msg: "Please provide the keyword" });
  }

  if (name.length < 3) {
    res.status(400).send({
      status: "fail",
      msg: "Please provide keyword of length 3 or more",
    });
  }

  const products = await productModel.find({
    name: { $regex: new RegExp(name), $options: "i" },
  });

  if (!products) {
    res.status(404).send({ status: "fail", msg: "No products found." });
  }

  res.status(200).send({ status: "sucess", products });
};

// filter products
exports.filterProducts = async (req, res) => {
  const body = req.body;

  const products = await productModel.find(body);

  if (!products) {
    res.status(404).send({ status: "fail", msg: "No products found." });
  }

  res.status(200).send({ status: "sucess", products });
};


// filter products
exports.getProductByLocation = async (req, res) => {
  const { pincode } = req.body;
  // const products = await productModel.find(body);
  const shops = await shopModel.find({ pincode });
  if (shops.length == 0) {
    res.status(404).send({ status: "fail", msg: "No shops found." });

  }
  res.status(200).send({ status: "sucess", msg: "shops fetched.", shops });
};
