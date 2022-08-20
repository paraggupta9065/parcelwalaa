const addressModel = require("../model/address");

exports.addAddress = async (req, res) => {
  const id = req.user._id;

  const {
    name,
    line1,
    landmark,
    pincode,
    contact_no,
    state,
    city,
    delivery_note,
    type,
  } = req.body;

  if (
    !name ||
    !line1 ||
    !landmark ||
    !pincode ||
    !contact_no ||
    !state ||
    !city ||
    !type
  ) {
    return res.status(400).send({
      status: "fail",
      msg: "Please provide all the fields",
    });
  }

  if (!delivery_note) {
    delivery_note = "";
  }

  const addressData = {
    name,
    line1,
    landmark,
    pincode,
    user_id: id,
    contact_no,
    state,
    city,
    delivery_note,
    type,
  };

  const address = await addressModel.create(addressData);

  return res.status(201).send({
    status: "sucess",
    address,
  });
};

exports.updateAddress = async (req, res) => {
  const id = req.user._id;

  let address = await addressModel.findOne({ user_id: id });

  if (!address) {
    return res.status(404).send({
      status: "fail",
      msg: "Address not found",
    });
  }

  const {
    name,
    line1,
    landmark,
    pincode,
    contact_no,
    state,
    city,
    delivery_note,
    type,
  } = req.body;

  if (
    !name ||
    !line1 ||
    !landmark ||
    !pincode ||
    !contact_no ||
    !state ||
    !city ||
    !delivery_note ||
    !type
  ) {
    return res.status(400).send({
      status: "fail",
      msg: "Please provide all the fields",
    });
  }

  if (!delivery_note) {
    delivery_note = "";
  }

  const addressData = {
    name,
    line1,
    landmark,
    pincode,
    user_id: id,
    contact_no,
    state,
    city,
    delivery_note,
    type,
  };

  address = await Address.findByIdAndUpdate(address._id, addressData);

  const updatedAddress = await addressModel.findById(address._id);

  return res.status(200).send({
    status: "sucess",
    address: updatedAddress,
  });
};

exports.removeAddress = async (req, res) => {
  const id = req.user._id;
  await addressModel.findOneAndDelete({ user_id: id });

  return res.status(200).send({
    status: "sucess",
    msg: "Address deleted.",
  });
};


exports.getCustumerAddress = async (req, res) => {
  const id = req.user._id;
  const addressList = await addressModel.find({ user_id: id });

  return res.status(200).send({
    status: "sucess",
    msg: "Address fetched",
    addressList
  });
};

