const Coupon = require("../model/coupon");
const Shop = require("../model/shop");

exports.addCoupon = async (req, res) => {
  const number = req.body.number;

  const shop = await Shop.findOne({ number });

  if (!shop) {
    res.status(404).send({
      status: "Fail",
      msg: "Not found",
    });
  }

  const couponData = req.body;

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
    !couponData["is_active"] ||
    !couponData["categories"] ||
    !couponData["products"] ||
    !couponData["restaurants"]
  ) {
    res.status(400).send({
      status: "Fail",
      msg: "Please provide all the feilds",
    });
  }

  couponData["shop_id"] = shop._id;

  const coupon = await Coupon.create(couponData);

  res.status(201).send({
    status: "Sucess",
    msg: "Created sucessfully",
    coupon,
  });
};

exports.updateCoupon = async (req, res) => {
  const number = req.body.number;

  const shop = await Shop.findOne({ number });

  if (!shop) {
    res.status(404).send({
      status: "Fail",
      msg: "Not found",
    });
  }

  const coupon = await Coupon.findOne({ shop_id: shop._id });

  if (!coupon) {
    res.status(404).send({
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

  await Coupon.findByIdAndUpdate(coupon._id, newCouponData);

  const newCoupon = await Coupon.findById(coupon._id);

  res.status(200).send({
    status: "Sucess",
    msg: "Updated sucessfully",
    newCoupon,
  });
};

exports.deleteCoupon = async (req, res) => {
  const number = req.body.number;

  const shop = await Shop.findOne({ number });

  if (!shop) {
    res.status(404).send({
      status: "Fail",
      msg: "Not found",
    });
  }

  await Coupon.findOneAndDelete({ shop_id: shop._id });

  res.status(200).send({
    status: "Sucess",
    msg: "Updated sucessfully",
  });
};

exports.getCoupons = async (req, res) => {
  const number = req.body.number;

  const shop = await Shop.findOne({ number });

  if (!shop) {
    res.status(404).send({
      status: "Fail",
      msg: "Not found",
    });
  }

  const coupons = await Coupon.find({ shop_id: shop._id });

  res.status(200).send({
    status: "Sucess",
    msg: "Fetched all coupons of a shop",
    coupons,
  });
};
