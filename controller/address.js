const addressModel = require("../model/address");

exports.addAddress = async (req, res) => {
  try {
    const id = req.user._id;

    let data = req.body;
    data['user_id'] = id;

    const address = await addressModel.create(data);

    return res.status(201).send({
      status: "sucess",
      address,
    });
  } catch (error) {
    return res.status(400).send({
      status: "fail",
      error,
      msg: "Something went wrong"

    });
  }
};

exports.updateAddress = async (req, res) => {
  try {

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
  } catch (error) {
    return res.status(400).send({
      status: "fail",
      error,
      msg: "Something went wrong"

    });
  }
};

exports.removeAddress = async (req, res) => {
  try {
    const id = req.params.id;

    await addressModel.findByIdAndDelete(id);

    return res.status(200).send({
      status: "sucess",
      msg: "Address deleted.",
    });
  } catch (error) {
    return res.status(400).send({
      status: "fail",
      msg: "Something went wrong",
      error
    });
  }
};


exports.getCustumerAddress = async (req, res) => {
  try {
    const id = req.user._id;
    const addressList = await addressModel.find({ user_id: id });


    return res.status(200).send({
      status: "sucess",
      msg: "Address fetched",
      addressList
    });
  } catch (error) {
    return res.status(400).send({
      status: "fail",
      error,
      msg: "Something went wrong"

    });
  }
};

