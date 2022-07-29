const deliveryBoyModel = require("../model/deliveryBoy");

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
    return res.status(400).send({ status: "fail", msg: "Incomplete Data." });
  }

  const deliveryBoy = await deliveryBoyModel.create(deliveryBoyData);

  return res.status(201).send({
    status: "sucess",
    msg: "Delivery boy created sucessfully",
    deliveryBoy,
  });
};

//get delivery boy
exports.getDeliveryBoy = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const deliveryBoys = await deliveryBoyModel
    .find()
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  res.status(200).send({
    status: "sucess",
    msg: "delivery boy fetched successfully",
    deliveryBoys,
  });
};

// update delivery boy details
exports.updateDeliveryBoy = async (req, res) => {
  const number = req.body.number;

  let deliveryBoy = await deliveryBoyModel.findOne({ number: number });

  if (!deliveryBoy) {
    return res
      .status(404)
      .send({ status: "fail", msg: "Delivery boy not found." });
  }

  deliveryBoy = await deliveryBoyModel.findByIdAndUpdate(
    deliveryBoy.id,
    req.body,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  const updated = await deliveryBoyModel.findById(deliveryBoy._id);

  return res.status(200).send({
    status: "sucess",
    msg: "Updated Sucessfully",
    deliveryBoy: updated,
  });
};

// delete a delivery boy
exports.deleteDeliveryBoy = async (req, res) => {
  const number = req.body.number;
  const deliveryBoy = await deliveryBoyModel.findOneAndDelete({
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

exports.deliveryBoyStatusUpdate = async (req, res) => {
  const { isOnline, number } = req.body;

  await deliveryBoyModel.findOneAndUpdate(
    { number: number },
    { isOnline: isOnline }
  );
  const deliveryBoy = await deliveryBoyModel.findOne({ number: number });
  res.status(200).send({
    status: "sucess",
    msg: "delivery boy updated successfully",
    deliveryBoy: deliveryBoy,
  });
};

exports.deliveryBoyAdminStatusUpdate = async (req, res) => {
  const { isActive, number } = req.body;

  await deliveryBoyModel.findOneAndUpdate(
    { number: number },
    { isActive: isActive }
  );
  const deliveryBoy = await deliveryBoyModel.findOne({ number: number });
  res.status(200).send({
    status: "sucess",
    msg: "delivery boy updated successfully",
    deliveryBoy: deliveryBoy,
  });
};
