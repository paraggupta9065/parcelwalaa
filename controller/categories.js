const categoriesModel = require('../model/categories')
const categoriesStudentsModel = require('../model/categoriesStudents')
const cloudinary = require('cloudinary').v2

exports.addCategories = async (req, res) => {
  try {
    const categoriesData = req.body

    if (!categoriesData['name']) {
      return res.status(400).json({
        status: 'fail',
        msg: 'Please provide all the fields'
      })
    }
    const result = await cloudinary.uploader.upload(req.file.path)
    categoriesData['image'] = result['url']
    categoriesData['image_id'] = result['public_id']

    const categories = await categoriesModel.create(categoriesData)
    return res.status(201).json({
      status: 'sucess',
      categories: categories
    })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}

exports.addCategoriesStudents = async (req, res) => {
  try {
    const categoriesData = req.body

    if (!categoriesData['name']) {
      return res.status(400).json({
        status: 'fail',
        msg: 'Please provide all the fields'
      })
    }
    const result = await cloudinary.uploader.upload(req.file.path)
    categoriesData['image'] = result['url']
    categoriesData['image_id'] = result['public_id']

    const categories = await categoriesStudentsModel.create(categoriesData)
    return res.status(201).json({
      status: 'sucess',
      categories: categories
    })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}

exports.updateCategories = async (req, res) => {
  try {
    const id = req.params.id
    const categoriesData = req.body
    if (!id) {
      return res.status(400).json({
        status: 'fail',
        msg: 'Please provide Id'
      })
    }
    const categorie = await categoriesModel.findById(id)
    await cloudinary.uploader.destroy(categorie.image_id)
    const result = await cloudinary.uploader.upload(req.file.path)
    categoriesData['image'] = result['url']
    categoriesData['image_id'] = result['public_id']
    await categoriesModel.findByIdAndUpdate(id, categoriesData)
    const categories = await categoriesModel.findById(id)
    return res.status(200).json({
      status: 'sucess',
      categories: categories
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}

exports.updateCategorieStudents = async (req, res) => {
  try {
    const id = req.params.id
    const categoriesData = req.body
    if (!id) {
      return res.status(400).json({
        status: 'fail',
        msg: 'Please provide Id'
      })
    }
    const categorie = await categoriesStudentsModel.findById(id)
    await cloudinary.uploader.destroy(categorie.image_id)
    const result = await cloudinary.uploader.upload(req.file.path)
    categoriesData['image'] = result['url']
    categoriesData['image_id'] = result['public_id']
    await categoriesStudentsModel.findByIdAndUpdate(id, categoriesData)
    const categories = await categoriesStudentsModel.findById(id)
    return res.status(200).json({
      status: 'sucess',
      categories: categories
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}

exports.deleteCategoriesStudents = async (req, res) => {
  try {
    const id = req.params.id

    if (!id) {
      return res.status(400).json({
        status: 'fail',
        msg: 'Please provide Id'
      })
    }

    await categoriesStudentsModel.findByIdAndDelete(id)

    return res.status(200).json({
      status: 'sucess',
      msg: 'Deleted sucessfully'
    })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}

exports.deleteCategories = async (req, res) => {
  try {
    const id = req.params.id

    if (!id) {
      return res.status(400).json({
        status: 'fail',
        msg: 'Please provide Id'
      })
    }

    await categoriesModel.findByIdAndDelete(id)

    return res.status(200).json({
      status: 'sucess',
      msg: 'Deleted sucessfully'
    })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}

exports.getCategories = async (req, res) => {
  try {
    const categories = await categoriesModel.find().populate()

    return res.status(200).json({
      status: 'sucess',
      categories: categories
    })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}

exports.getCategorieStudent = async (req, res) => {
  try {
    const id = req.params.id
    const categorie = await categoriesStudentsModel.findById(id)
    if (!categorie) {
      return res.status(200).json({
        status: 'fail',
        msg: 'not found'
      })
    }

    return res.status(200).json({
      status: 'sucess',
      categorie: categorie
    })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}

exports.getCategoriesStudents = async (req, res) => {
  try {
    const categories = await categoriesStudentsModel.find().populate()

    return res.status(200).json({
      status: 'sucess',
      categories: categories
    })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}
exports.getCategoriesAdmin = async (req, res) => {
  try {
    const categories = await categoriesModel.find().populate()

    return res.status(200).json({
      status: 'sucess',
      categories: categories
    })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}

exports.getCategoriesStudentsAdmin = async (req, res) => {
  try {
    const categories = await categoriesStudentsModel.find().populate()

    return res.status(200).json({
      status: 'sucess',
      categories: categories
    })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}
