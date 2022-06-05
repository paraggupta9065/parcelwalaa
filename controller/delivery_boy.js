const driverModel = require("../model/driver")
const mongoose = require("mongoose")

exports.addDriver = async (req, res) => {
    const image = "asad";
    const driving_license_image = "adf";

    const driverData = req.body;

    driverData["image"] = image;
    driverData["driving_license_image"] = driving_license_image;

    const sameNumber = await driverModel.findOne({ "number": driverData["number"] })
    if (sameNumber) {
        return res.status(400).send({ "msg": "Number already exists." })
    }
    const sameAadhar = await driverModel.findOne({ "aadhar": driverData["aadhar"] })
    if (sameAadhar) {
        return res.status(400).send({ "msg": "Aadhar already exists." })
    }
    const samePan = await driverModel.findOne({ "pan": driverData["pan"] })
    if (samePan) {
        return res.status(400).send({ "msg": "Pan already exists." })
    }
    const sameUpi = await driverModel.findOne({ "upi": driverData["upi"] })
    if (sameUpi) {
        return res.status(400).send({ "msg": "Upi already exists." })
    }
    const sameBikeNumber = await driverModel.findOne({ "bike_number": driverData["bike_number"] })
    if (sameBikeNumber) {
        return res.status(400).send({ "msg": "Bike Number already exists." })
    }









    const driver = await driverModel.create(driverData);

    res.status(201).send({
        msg: "Driver created sucessfully",
        driver,
    })
}
exports.updateDriver = async (req, res) => {
    let driver = await driverModel.findById(req.params.id);

    if (!driver) {
        return res.status(404).send({ "msg": "Driver not found." })
    }

    driver = await driverModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false });

    const newDriver = await driverModel.findById(driver._id);




    res.status(200).send({ "msg": "Updated Sucessfully", "delivery_boy": newDriver })
}
exports.deleteDriver = async (req, res) => {
    const driver = await driverModel.findByIdAndDelete(req.params.id);

    if (!driver) {
        return res.status(404).send({ "msg": "Driver not found." });
    }

    res.status(200).send({ "msg": "Driver deleted successfully" });
}
