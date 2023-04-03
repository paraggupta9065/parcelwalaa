const cloudinary = require('cloudinary').v2
const brandModel = require('../model/brands')

exports.addBrand = async (req, res) => {
  try {
    const brand = await brandModel.create(req.body)
    return res
      .status(200)
      .json({ status: 'sucess', msg: 'brand created', brand })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}

exports.getBrand = async (req, res) => {
  try {
    const id = req.params.id
    const brands = await brandModel.find({ categories_students: id })

    return res
      .status(200)
      .json({ status: 'sucess', msg: 'brands fetched', brands })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}

exports.getAllBrand = async (req, res) => {
  try {
    const brands = await brandModel.find()
    return res
      .status(200)
      .json({ status: 'sucess', msg: 'brands fetched', brands })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}

exports.deleteBrand = async (req, res) => {
  try {
    const brand_id = req.params.id
    await cloudinary.uploader.destroy(
      await brandModel.findById(brand_id).image_id
    )
    await brandModel.findByIdAndDelete(brand_id)

    return res.status(200).json({ status: 'sucess', msg: 'brands deleted' })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}

exports.updateBrand = async (req, res) => {
  try {
    const brand_id = req.params.id
    await brandModel.findByIdAndUpdate(brand_id, req.body)
    const brands = await brandModel.findById(brand_id)
    return res
      .status(200)
      .json({ status: 'sucess', msg: 'brands updated', brands })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}
