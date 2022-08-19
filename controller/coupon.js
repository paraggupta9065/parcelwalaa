const couponModel = require("../model/coupon");
const shopModel = require("../model/shop");
const cartModel = require("../model/cart");


exports.addCoupon = async (req, res) => {
  const number = req.body.number;

  const shop = await shopModel.findOne({ number });

  if (!shop) {
    return res.status(404).send({
      status: "Fail",
      msg: "Not found",
    });
  }

  const couponData = req.body;
  // mm/dd/yyy
  if (
    !couponData["coupon_code"] ||
    !couponData["description"] ||
    !couponData["percentage_discount"] ||
    !couponData["valid_from"] ||
    !couponData["valid_to"] ||
    !couponData["max_discount"] ||
    !couponData["min_cart_value"] ||
    !couponData["max_no_times"] ||
    !couponData["max_no_of_times_per_user"] ||
    !couponData["is_active"]
  ) {
    return res.status(400).send({
      status: "Fail",
      msg: "Please provide all the feilds",
    });
  }

  couponData["shop_id"] = shop._id;

  const coupon = await couponModel.create(couponData);

  return res.status(201).send({
    status: "sucess",
    msg: "Created sucessfully",
    coupon,
  });
};

exports.updateCoupon = async (req, res) => {
  const number = req.body.number;

  const shop = await shopModel.findOne({ number });

  if (!shop) {
    return res.status(404).send({
      status: "Fail",
      msg: "Not found",
    });
  }

  const coupon = await couponModel.findOne({ shop_id: shop._id });

  if (!coupon) {
    return res.status(404).send({
      status: "Fail",
      msg: "Coupon not found",
    });
  }

  const {
    coupon_code,
    description,
    percentage_discount,
    valid_from,
    valid_to,
    max_discount,
    min_cart_value,
    max_no_times,
    max_no_of_times_per_user,
    is_active,
    shop_id,
    categories,
    products,
    restaurants,
  } = req.body;

  const newCouponData = {
    coupon_code,
    description,
    percentage_discount,
    valid_from,
    valid_to,
    max_discount,
    min_cart_value,
    max_no_times,
    max_no_of_times_per_user,
    is_active,
    shop_id,
    categories,
    products,
    restaurants,
  };

  await couponModel.findByIdAndUpdate(coupon._id, newCouponData);

  const newCoupon = await couponModel.findById(coupon._id);

  return res.status(200).send({
    status: "sucess",
    msg: "Updated sucessfully",
    newCoupon,
  });
};

exports.deleteCoupon = async (req, res) => {
  const number = req.body.number;

  const shop = await shopModel.findOne({ number });

  if (!shop) {
    return res.status(404).send({
      status: "Fail",
      msg: "Not found",
    });
  }

  await couponModel.findOneAndDelete({ shop_id: shop._id });

  return res.status(200).send({
    status: "sucess",
    msg: "Updated sucessfully",
  });
};

exports.getCoupons = async (req, res) => {
  const { id } = req.body;

  const shop = await shopModel.findById(id);

  if (!shop) {
    return res.status(404).send({
      status: "Fail",
      msg: "Not found",
    });
  }

  const coupons = await couponModel.find({ shop_id: shop._id });

  return res.status(200).send({
    status: "sucess",
    msg: "Fetched all coupons of a shop",
    coupons,
  });
};


exports.applyCoupon = async (req, res) => {
  const { couponId } = req.body;
  let cart = await cartModel.findOne({ user: req.user._id });
  await cartModel.findByIdAndUpdate(cart._id, {
    "coupon_code_id": couponId,
  })






  return res.status(200).send({
    status: "sucess",
    msg: "coupon applyed",
  });
};





