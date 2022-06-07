const DeliveryBoyModel = require("../model/deliveryBoy");

// create a delivery boy
exports.addDeliveryBoy = async (req, res) => {
  const image = "asad";
  const driving_license_image = "adf";

  const deliveryBoyData = req.body;

  deliveryBoyData["image"] = image;
  deliveryBoyData["driving_license_image"] = driving_license_image;

  if (
    !image ||
    !driving_license_image ||
    !deliveryBoyData["name"] ||
    !deliveryBoyData["number"] ||
    !deliveryBoyData["aadhar"] ||
    !deliveryBoyData["pan"] ||
    !deliveryBoyData["upi"] ||
    !deliveryBoyData["bike_number"]
  ) {
    res.status(400).send({ status: "fail", msg: "Incomplete Data." });
  }

  const deliveryBoy = await DeliveryBoyModel.create(deliveryBoyData);

  res.status(201).send({
    status: "sucess",
    msg: "Delivery boy created sucessfully",
    deliveryBoy,
  });
};

// update delivery boy details
exports.updateDeliveryBoy = async (req, res) => {
  const number = req.body.number;

  let deliveryBoy = await DeliveryBoyModel.findOne({ number: number });

  if (!deliveryBoy) {
    return res
      .status(404)
      .send({ status: "fail", msg: "Delivery boy not found." });
  }

  deliveryBoy = await DeliveryBoyModel.findByIdAndUpdate(
    deliveryBoy.id,
    req.body,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  const updated = await DeliveryBoyModel.findById(deliveryBoy._id);

  res.status(200).send({
    status: "sucess",
    msg: "Updated Sucessfully",
    deliveryBoy: updated,
  });
};

// delete a delivery boy
exports.deleteDeliveryBoy = async (req, res) => {
  const number = req.body.number;
  const deliveryBoy = await DeliveryBoyModel.findOneAndDelete({
    number: number,
  });

  if (!deliveryBoy) {
    return res
      .status(404)
      .send({ status: "fail", msg: "Delivery Boy not found." });
  }

  res
    .status(200)
    .send({ status: "sucess", msg: "Delivery Boy deleted successfully" });
};
