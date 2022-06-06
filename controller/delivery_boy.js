
const delivery_boyModel = require("../model/delivery_boy");
const mongoose = require("mongoose");

exports.adddelivery_boy = async (req, res) => {
  const image = "asad";
  const driving_license_image = "adf";

  const delivery_boyData = req.body;

  delivery_boyData["image"] = image;
  delivery_boyData["driving_license_image"] = driving_license_image;

  if (
    !image ||
    !driving_license_image ||
    !delivery_boyData["name"] ||
    !delivery_boyData["number"] ||
    !delivery_boyData["aadhar"] ||
    !delivery_boyData["pan"] ||
    !delivery_boyData["upi"] ||
    !delivery_boyData["bike_number"]
  ) {
    res.status(400).send({ msg: "Incomplete Data." });
  }

  const delivery_boy = await delivery_boyModel.create(delivery_boyData);

  res.status(201).send({
    msg: "delivery_boy created sucessfully",
    delivery_boy,
  });
};

exports.updatedelivery_boy = async (req, res) => {
  let delivery_boy = await delivery_boyModel.findById(req.params.id);

  if (!delivery_boy) {
    return res.status(404).send({ msg: "delivery_boy not found." });
  }

  delivery_boy = await delivery_boyModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  const updated = await delivery_boyModel.findById(delivery_boy._id);

  res.status(200).send({ msg: "Updated Sucessfully", delivery_boy: updated });
};

exports.deletedelivery_boy = async (req, res) => {
  const delivery_boy = await delivery_boyModel.findByIdAndDelete(req.params.id);

  if (!delivery_boy) {
    return res.status(404).send({ msg: "delivery_boy not found." });
  }

  res.status(200).send({ msg: "delivery_boy deleted successfully" });
};

