const couponModel = require('../model/coupon')
const shopModel = require('../model/shop')
const cartModel = require('../model/cart')

exports.addCoupon = async (req, res) => {
  const couponData = req.body
  // mm/dd/yyy
  if (
    !couponData['coupon_code'] ||
    !couponData['description'] ||
    !couponData['percentage_discount'] ||
    !couponData['valid_from'] ||
    !couponData['valid_to'] ||
    !couponData['max_discount'] ||
    !couponData['min_cart_value'] ||
    !couponData['max_no_times'] ||
    !couponData['max_no_of_times_per_user'] ||
    !couponData['is_active']
  ) {
    return res.status(400).json({
      status: 'Fail',
      msg: 'Please provide all the feilds'
    })
  }

  const coupon = await couponModel.create(couponData)

  return res.status(201).json({
    status: 'sucess',
    msg: 'Created sucessfully',
    coupon
  })
}

exports.updateCoupon = async (req, res) => {
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
    restaurants
  } = req.body
  if (!shop_id) {
    return res.status(404).json({
      status: 'Fail',
      msg: 'Not found'
    })
  }

  const coupon = await couponModel.findOne({ shop_id: shop_id })

  if (!coupon) {
    return res.status(404).json({
      status: 'Fail',
      msg: 'Coupon not found'
    })
  }

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
    restaurants
  }

  await couponModel.findByIdAndUpdate(coupon._id, newCouponData)

  const newCoupon = await couponModel.findById(coupon._id)

  return res.status(200).json({
    status: 'sucess',
    msg: 'Updated sucessfully',
    newCoupon
  })
}

exports.deleteCoupon = async (req, res) => {
  const id = req.params.id
  await couponModel.findByIdAndDelete(id)

  return res.status(200).json({
    status: 'sucess',
    msg: 'Deleted sucessfully'
  })
}

exports.getCoupons = async (req, res) => {
  const coupons = await couponModel.find()

  return res.status(200).json({
    status: 'sucess',
    msg: 'Fetched all coupons of a shop',
    coupons
  })
}

exports.getCouponsAdmin = async (req, res) => {
  const coupons = await couponModel.find()

  return res.status(200).json({
    status: 'sucess',
    msg: 'Fetched all coupons of a shop',
    coupons
  })
}

exports.applyCoupon = async (req, res) => {
  const { couponId } = req.body
  let cart = await cartModel.findOne({ user: req.user._id })
  await cartModel.findByIdAndUpdate(cart._id, {
    coupon_code_id: couponId
  })

  return res.status(200).json({
    status: 'sucess',
    msg: 'coupon applyed'
  })
}
