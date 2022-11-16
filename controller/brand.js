const cloudinary = require('cloudinary').v2;
const brandModel = require("../model/brands");


exports.addBrand = async (req, res) => {
    const brand = await brandModel.create(req.body);
    return res
        .status(200)
        .send({ status: "sucess", msg: "brand created", brand });
};


exports.getBrand = async (req, res) => {
    const id = req.params.id;
    const brands = await brandModel.find({ 'categories_students': id });

    return res
        .status(200)
        .send({ status: "sucess", msg: "brands fetched", brands });
};


exports.getAllBrand = async (req, res) => {
    const brands = await brandModel.find();
    return res
        .status(200)
        .send({ status: "sucess", msg: "brands fetched", brands });
};

exports.deleteBrand = async (req, res) => {
    const brand_id = req.params.id;
    await brandModel.findByIdAndDelete(brand_id);
    return res
        .status(200)
        .send({ status: "sucess", msg: "brands deleted" });
};


exports.updateBrand = async (req, res) => {
    const brand_id = req.params.id;
    await brandModel.findByIdAndUpdate(brand_id, req.body);
    const brands = await brandModel.findById(brand_id);
    return res
        .status(200)
        .send({ status: "sucess", msg: "brands updated", brands });
};

