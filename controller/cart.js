const cartModel = require('../model/cart')
const productModel = require('../model/product')
const shopModel = require('../model/shop')
const couponModel = require('../model/coupon')
const { default: mongoose } = require('mongoose')

exports.addToCart = async (req, res) => {
  // try {
  const { productId, delivery_address_id, coupon_code_id } = req.body
  let inventory_total_amt = 0
  let delivery_total_amt = 0
  let discount_amt = 0
  let net_amt = 0
  let gross_total = 0
  // let total_gst = 0
  let cart = await cartModel.findOne({ user_id: req.user._id })
  const product = await productModel.findById(productId)
  const shop_id = product.shop_id
  const shop = await shopModel.findById(shop_id)
  if (!cart) {
    delivery_total_amt = shop.delivery_charges
    inventory_total_amt = product.price
    gross_total = inventory_total_amt + delivery_total_amt

    // total_gst = ((inventory_total_amt - discount_amt) / 100) * 5
    net_amt = gross_total

    let newCart = {
      inventory_total_amt,
      delivery_total_amt,
      coupon_code_id,
      discount_amt,
      net_amt,
      gross_total,
      delivery_address_id,
      cart_inventory: [
        {
          quantity: 1,
          product: productId,
          shop_id
        }
      ],
      // total_gst,
      user_id: req.user._id
    }

    cart = await cartModel.create(newCart)

    return res.status(201).json({
      status: 'sucess',
      msg: 'Added To Cart',
      cart: cart
    })
  }
  // total_gst = cart.total_gst
  inventory_total_amt = cart.inventory_total_amt + product.price
  gross_total = gross_total + product.price

  net_amt = gross_total

  let updateCart = {
    inventory_total_amt,
    coupon_code_id: 'na',
    discount_amt: 0,
    net_amt,
    delivery_address_id,
    // total_gst,
    user: req.user._id,
    gross_total
  }
  const findedProduct = await cartModel.find({
    user_id: req.user._id,
    cart_inventory: {
      $elemMatch: {
        product: productId,
        shop_id
      }
    }
  })
  if (!findedProduct) {
    await cartModel.findOneAndUpdate(
      {
        _id: cart._id,
        'cart_inventory.product': productId
      },
      {
        $inc: {
          'cart_inventory.0.quantity': 1
        }
      }
    )
    await cartModel.findByIdAndUpdate(cart._id, updateCart)
  } else {
    await cartModel.findByIdAndUpdate(cart._id, updateCart)
    await cartModel.findByIdAndUpdate(cart._id, {
      $push: {
        cart_inventory: {
          quantity: 1,
          product: productId,
          shop_id
        }
      }
    })
  }

  cart = await cartModel.findById(cart._id)

  return res.status(200).json({
    status: 'sucess',
    msg: 'Added To Cart',
    cart: cart
  })
  // } catch (error) {
  //   return res.status(400).json({
  //     status: 'fail',
  //     error,

  //     msg: 'Something went wrong'
  //   })
  // }
}

exports.getCart = async (req, res) => {
  try {
    let cart = await cartModel.findOne({ user_id: req.user._id })
    if (!cart) {
      return res.status(404).json({
        status: 'fail',
        msg: 'Cart not found'
      })
    }
    let cartInventory = []
    cartInventory = cart.cart_inventory
    let products = []
    for (let element in cartInventory) {
      const product = await productModel.findById(
        cartInventory[element]['product']
      )

      products.push(product)
    }
    return res.status(200).json({
      status: 'sucess',
      cart: cart,
      products: products
    })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}

exports.removeCart = async (req, res) => {
  try {
    const id = req.user._id

    await cartModel.findOneAndDelete({ user: id })

    return res.status(200).json({
      status: 'sucess',
      msg: 'cartModel deleted.'
    })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,

      msg: 'Something went wrong'
    })
  }
}

exports.updateCart = async (req, res) => {
  try {
    const cartData = req.body
    const id = req.user._id

    await cartModel.findOneAndUpdate({ user_id: id }, cartData)

    return res.status(200).json({
      status: 'sucess',
      msg: 'cartModel Updated'
    })
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      status: 'fail',
      error: error,

      msg: 'Something went wrong'
    })
  }
}

exports.updateQty = async (req, res) => {
  try {
    const { productId, quantity } = req.body

    const id = req.user._id

    let cart = await cartModel.findOne({ user_id: id })
    if (!cart) {
      return res.status(404).json({
        status: 'fail',
        msg: 'Cart not found'
      })
    }
    const product = await productModel.findById(productId)

    let inventoryUpdate = Array()

    inventoryUpdate = cart.cart_inventory

    inventory_index = inventoryUpdate.findIndex(
      cart_inventory_item => cart_inventory_item.product._id == productId
    )

    let inventory_total_amt = cart.inventory_total_amt
    // let total_gst = cart.total_gst
    let net_amt = 0
    let gross_total = cart.gross_total
    let discount_amt = 0

    if (quantity == 0) {
      inventoryUpdate.splice(inventory_index)
      if (inventoryUpdate.length == 0) {
        await cartModel.findByIdAndDelete(cart._id)
        res.status(201).json({
          status: 'sucess',

          msg: 'Cart Deleted',
          code: 0
        })
      }
      inventory_total_amt = inventory_total_amt - product.price
      gross_total = gross_total - product.price
      // total_gst = total_gst - ((product.price - discount_amt) / 100) * 5

      net_amt = gross_total
      await cartModel.findByIdAndUpdate(cart._id, {
        cart_inventory: inventoryUpdate,
        inventory_total_amt,
        coupon_code_id: 'na',
        discount_amt: 0,
        // total_gst,
        net_amt,
        gross_total
      })
      return res.status(201).json({
        status: 'sucess',
        msg: 'Product qty updated'
      })
    }

    let oldQty = inventoryUpdate[inventory_index]['quantity']
    inventoryUpdate[inventory_index] = {
      quantity: quantity,
      product: productId,
      shop_id: product.shop_id
    }
    if (oldQty < quantity) {
      inventory_total_amt = inventory_total_amt + product.price
      gross_total = gross_total + product.price
      let percentage_discount = 0
      if (cart.coupon_code_id != 'na') {
        const coupon = await couponModel.findOne({
          coupon_code_id: cart.coupon_code_id
        })
        percentage_discount = coupon.percentage_discount
        let max_discount = coupon.percentage_discount
        discount_amt = percentage_discount * (gross_total / 100)
        console.log(discount_amt)

        if (discount_amt >= max_discount) {
          discount_amt = max_discount
        }
        console.log(discount_amt)
      }

      net_amt = gross_total - discount_amt
    } else if (oldQty > quantity) {
      inventory_total_amt = inventory_total_amt - product.price
      gross_total = gross_total - product.price

      let percentage_discount = 0

      if (cart.coupon_code_id != 'na') {
        const coupon = await couponModel.findOne({
          coupon_code_id: cart.coupon_code_id
        })
        percentage_discount = coupon.percentage_discount
        let max_discount = coupon.percentage_discount
        discount_amt = percentage_discount * (gross_total / 100)
        console.log(discount_amt)

        if (discount_amt >= max_discount) {
          discount_amt = max_discount
        }
        console.log(discount_amt)
      }

      // total_gst = total_gst - ((product.price - discount_amt) / 100) * 5
      net_amt = gross_total - discount_amt
    }
    if (inventoryUpdate.length == 0) {
      await cartModel.findByIdAndDelete(cart._id)
      return res.status(201).json({
        status: 'sucess',
        msg: 'cart  deleted'
      })
    }

    cart = await cartModel.findByIdAndUpdate(
      cart._id,
      {
        cart_inventory: inventoryUpdate,
        inventory_total_amt,
        net_amt,
        gross_total,
        discount_amt
      },
      { new: true }
    )

    return res.status(201).json({
      status: 'sucess',
      msg: 'Product qty updated',
      cart
    })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,

      msg: 'Something went wrong'
    })
  }
}
