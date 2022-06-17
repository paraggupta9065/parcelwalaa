const { findOneAndDelete } = require("../model/address");
const Address = require("../model/address");

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

  const address = await Address.create(addressData);

  res.status(201).send({
    status: "sucess",
    address,
  });
};

exports.updateAddress = async (req, res) => {
  const id = req.user._id;

  let address = await Address.findOne({ user_id: id });

  if (!address) {
    res.status(404).send({
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

  const updatedAddress = await Address.findById(address._id);

  res.status(200).send({
    status: "sucess",
    address: updatedAddress,
  });
};

exports.deleteAddress = async (req, res) => {
  const id = req.user._id;
  const address = await findOneAndDelete({ user_id: id });

  res.status(200).send({
    status: "sucess",
    msg: "Address deleted.",
  });
};
