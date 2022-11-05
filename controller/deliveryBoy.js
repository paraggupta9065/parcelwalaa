const deliveryBoyModel = require("../model/deliveryBoy");
const driverLocationModel = require("../model/driverLocation");
const otpModel = require("../model/otp");
const userModel = require("../model/user");
const orderModel = require("../model/order");


// create a delivery boy
exports.addDeliveryBoy = async (req, res) => {

  try {
    const image = "asad";
    const driving_license_image = "adf";
    const { number, name, otpCode } = req.body;

    //Verify Otp
    if (!number) {
      return res.status(404).send({ status: "fail", msg: "Number not found" });
    }
    const otpFound = await otpModel.findOne({ number: number });

    if (!otpFound) {
      return res.status(400).send({ status: "fail", msg: "Otp Not Sended Yet" });
    }
    if (otpFound.otpExpiry < Date.now) {
      return res.status(400).send({ status: "fail", msg: "Otp expired" });
    }
    const isVerified = await otpFound.isValidatedOtp(otpCode);
    if (!isVerified) {
      return res.status(400).send({ status: "fail", msg: "Incorrect Otp" });
    }
    //Otp Verified
    //Creating User
    const userCreated = await userModel.create({
      name: name,
      number: number,
      role: "deliveryBoy",
    });
    //User Created 
    const deliveryBoyData = req.body;

    deliveryBoyData["image"] = image;
    deliveryBoyData["driving_license_image"] = driving_license_image;
    deliveryBoyData["user_id"] = userCreated._id;

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
    const token = await userCreated.getJwtToken();
    return res.status(201).send({
      status: "sucess",
      token,
      msg: "Delivery boy created sucessfully",
      driver: deliveryBoy,
    });
  } catch (error) {
    console.log(error)
    return res.status(400).send({
      status: "fail",
      msg: "Something Went Wrong",
      error,
    });
  }
};


//get delivery boy
exports.getDeliveryBoy = async (req, res) => {
  const deliveryBoys = await deliveryBoyModel.find({ isActive: { $ne: false }, isOnline: { $ne: false } });
  return res.status(200).send({
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
  return res.status(200).send({
    status: "sucess",
    msg: "delivery boy updated successfully",
    deliveryBoy: deliveryBoy,
  });
};
exports.deliveryBoyStatus = async (req, res) => {
  const number = req.user.number;


  const deliveryBoy = await deliveryBoyModel.findOne({ number: number });
  return res.status(200).send({
    status: "sucess",
    msg: "delivery boy found",
    isOnline: deliveryBoy.isOnline,
  });
};

exports.deliveryBoyAdminStatusUpdate = async (req, res) => {
  const { isActive, number } = req.body;

  await deliveryBoyModel.findOneAndUpdate(
    { number: number },
    { isActive: isActive }
  );
  const deliveryBoy = await deliveryBoyModel.findOne({ number: number });
  return res.status(200).send({
    status: "sucess",
    msg: "delivery boy updated successfully",
    deliveryBoy: deliveryBoy,
  });
};


exports.isVerified = async (req, res) => {
  const id = req.user._id;

  const driver = await deliveryBoyModel.findOne({ "user_id": id });
  if (!driver) {
    res
      .status(404)
      .send({ status: "fail", msg: "You are not a driver", });
  }
  res
    .status(200)
    .send({ status: "sucess", msg: "Verification status", isVerified: driver.isVerified });
};
exports.verifyDriver = async (req, res) => {
  const id = req.params.id;
  const driver = await deliveryBoyModel.findByIdAndUpdate(id, { isVerified: true });
  if (!driver) {
    res
      .status(404)
      .send({ status: "fail", msg: "You are not a driver", });
  }
  res
    .status(200)
    .send({ status: "sucess", msg: "driver Verified", });
};
exports.getUnverifiedDriver = async (req, res) => {

  const drivers = await deliveryBoyModel.find({ isVerified: false });
  if (!drivers) {
    res
      .status(404)
      .send({ status: "fail", msg: "All driver Are Verified", });
  }
  res
    .status(200)
    .send({ status: "sucess", msg: "driver Fecthed", drivers });
};


exports.setLocation = async (req, res) => {

  const data = req.body;
  data["user_id"] = req.user._id;


  const isExist = await driverLocationModel.findOne({ 'user_id': req.user._id });

  if (!isExist) {
    let map = {};
    map['user_id'] = req.user._id;
    map['locations'] = [{ "lat": data['lat'], "long": data['long'] }];
    await driverLocationModel.create(map);
  } else {
    let map = isExist;
    let locations = map['locations'];
    locations.push({ "lat": data['lat'], "long": data['long'] });
    map['locations'] = locations;
    await driverLocationModel.findOneAndUpdate({ 'user_id': req.user._id }, { 'locations': locations });
  }
  return res
    .status(200)
    .send({ status: "sucess", msg: "driver location set" });
};


exports.getAsssignedOrder = async (req, res) => {
  const driver = await deliveryBoyModel.findOne({ "user_id": req.user._id });
  console.log(driver._id)
  if (!driver) {
    return res.status(404).send({
      status: "fail",
      msg: "Driver not found"
    });
  }

  const order = await orderModel.findOne({ driver: driver._id });
  console.log(order)

  if (!order) {
    return res.status(200).send({
      status: "sucess",
      msg: "No order assigned"
    });
  }
  return res.status(200).send({
    status: "sucess",
    msg: "Order and driver send",
    driver,
    order,
  });
};

