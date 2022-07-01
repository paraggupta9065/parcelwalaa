const productModel = require("../model/product");
const shopModel = require("../model/shop");

// create the product
exports.addProduct = async (req, res) => {
  const number = req.user.number;

  const shop = await shopModel.findOne({ number });

  const {
    name,
    type,
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
    return res.status(400).send({
      status: "fail",
      msg: "Please provide all feilds",
    });
  }

  const productData = {
    name,
    type,
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
    pincode: shop.pincode,
  };

  const product = await productModel.create(productData);

  return res.status(201).send({ status: "sucess", product });
};

// update product
exports.updateProduct = async (req, res) => {
  const number = req.body.number;

  const shop = await shopModel.findOne({ number });

  if (!shop) {
    return res.status(404).send({
      status: "Fail",
      msg: "Not found",
    });
  }

  const product = await productModel.findOne({ shop_id: shop._id });

  if (!product) {
    return res
      .status(404)
      .send({ status: "fail", msg: "productModel not found" });
  }

  await productModel.findOneAndUpdate(shop._id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  const updatedProduct = await productModel.findOne({ shop_id: shop._id });

  return res.status(200).send({
    status: "sucess",
    msg: "Updated sucessfully",
    product: updatedProduct,
  });
};

// delete product using req.params.id
exports.deleteProduct = async (req, res) => {
  const number = req.body.number;

  const shop = await shopModel.findOne({ number });

  if (!shop) {
    return res.status(404).send({
      status: "Fail",
      msg: "Not found",
    });
  }
  const product = await productModel.findOneAndDelete({ shop_id: shop._id });

  if (!product) {
    return res
      .status(404)
      .send({ status: "fail", msg: "productModel not found." });
  }

  res
    .status(200)
    .send({ status: "sucess", msg: "productModel deleted sucessfully" });
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



  return res.status(200).send({ status: "sucess", msg: "shops fetched.", products });
};
