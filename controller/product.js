const product = require("../model/product");
const Product = require("../model/product");
const Shop = require("../model/shop");

// create the product
exports.addProduct = async (req, res) => {
  const number = req.user.number;

  const shop = await Shop.findOne({ number });

  const {
    name,
    type,
    status,
    featured,
    description,
    veg_type,
    price,
    regular_price,
    weight,
    rating_count,
    reviews,
    categories,
    tags,
    images,
    variations,
  } = req.body;

  if (
    !name ||
    !type ||
    !status ||
    !featured ||
    !description ||
    !veg_type ||
    !price ||
    !regular_price ||
    !weight ||
    !rating_count ||
    !reviews ||
    !categories ||
    !tags ||
    !images ||
    !variations
  ) {
    res.status(400).send({
      status: "fail",
      msg: "Please provide all feilds",
    });
  }

  const productData = {
    name,
    type,
    status,
    featured,
    description,
    veg_type,
    price,
    regular_price,
    weight,
    rating_count,
    reviews,
    categories,
    tags,
    images,
    variations,
    shop_id: shop._id,
  };

  const product = await Product.create(productData);

  res.status(201).send({ status: "sucess", product });
};

// update product
exports.updateProduct = async (req, res) => {
  const number = req.body.number;

  const shop = await Shop.findOne({ number });

  if (!shop) {
    res.status(404).send({
      status: "Fail",
      msg: "Not found",
    });
  }

  const product = await Product.findOne({ shop_id: shop._id });

  if (!product) {
    return res.status(404).send({ status: "fail", msg: "Product not found" });
  }

  await Product.findOneAndUpdate(shop._id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  const updatedProduct = await Product.findOne({ shop_id: shop._id });

  res.status(200).send({
    status: "sucess",
    msg: "Updated sucessfully",
    product: updatedProduct,
  });
};

// delete product using req.params.id
exports.deleteProduct = async (req, res) => {
  const number = req.body.number;

  const shop = await Shop.findOne({ number });

  if (!shop) {
    res.status(404).send({
      status: "Fail",
      msg: "Not found",
    });
  }
  const product = await Product.findOneAndDelete({ shop_id: shop._id });

  if (!product) {
    return res.status(404).send({ status: "fail", msg: "Product not found." });
  }

  res
    .status(200)
    .send({ status: "sucess", msg: "Product deleted sucessfully" });
};

exports.getProducts = async (req, res) => {
  const products = await Product.find();

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

  const products = await Product.find({
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

  const products = await Product.find(body);

  if (!products) {
    res.status(404).send({ status: "fail", msg: "No products found." });
  }

  res.status(200).send({ status: "sucess", products });
};

// filter products
exports.getProductByLocation = async (req, res) => {
  const { pincode } = req.body;
  // const products = await Product.find(body);
  const shops = await Shop.find({ pincode });
  if (shops.length == 0) {
    res.status(404).send({ status: "fail", msg: "No shops found." });
  }
  res.status(200).send({ status: "sucess", msg: "shops fetched.", shops });
};
