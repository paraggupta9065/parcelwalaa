const deliveryBoyModel = require('../model/deliveryBoy')
const otpModel = require('../model/otp')
const userModel = require('../model/user')
const orderModel = require('../model/order')
const deliveryBoyEarning = require('../model/deliveryBoyEarning')

// create a delivery boy
exports.addDeliveryBoy = async (req, res) => {
  try {
    const image = 'asad'
    const driving_license_image = 'adf'
    const { number, name, otpCode } = req.body

    //Verify Otp
    if (!number) {
      return res.status(404).json({ status: 'fail', msg: 'Number not found' })
    }
    const otpFound = await otpModel.findOne({ number: number })

    if (!otpFound) {
      return res.status(400).json({ status: 'fail', msg: 'Otp Not Sended Yet' })
    }
    if (otpFound.otpExpiry < Date.now) {
      return res.status(400).json({ status: 'fail', msg: 'Otp expired' })
    }
    const isVerified = await otpFound.isValidatedOtp(otpCode)

    // const isVerified = otpFound['otp'] == otpCode;

    if (!isVerified) {
      const isVerifiedPlain = otpFound.otp == otpCode
      if (!isVerifiedPlain) {
        return res.status(400).json({ status: 'fail', msg: 'Incorrect Otp' })
      }
    }
    //Otp Verified
    //Creating User
    const userCreated = await userModel.create({
      name: name,
      number: number,
      role: 'deliveryBoy'
    })
    //User Created
    const deliveryBoyData = req.body

    deliveryBoyData['image'] = image
    deliveryBoyData['driving_license_image'] = driving_license_image
    deliveryBoyData['user_id'] = userCreated._id

    if (
      !image ||
      !driving_license_image ||
      !deliveryBoyData['name'] ||
      !deliveryBoyData['number'] ||
      !deliveryBoyData['aadhar'] ||
      !deliveryBoyData['pan'] ||
      !deliveryBoyData['upi'] ||
      !deliveryBoyData['bike_number']
    ) {
      return res.status(400).json({ status: 'fail', msg: 'Incomplete Data.' })
    }

    const deliveryBoy = await deliveryBoyModel.create(deliveryBoyData)
    const token = await userCreated.getJwtToken()
    return res.status(201).json({
      status: 'sucess',
      token,
      msg: 'Delivery boy created sucessfully',
      driver: deliveryBoy
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      status: 'fail',
      msg: 'Something Went Wrong',
      error
    })
  }
}

//get delivery boy
exports.getDeliveryBoy = async (req, res) => {
  const deliveryBoys = await deliveryBoyModel.find({
    isActive: { $ne: false },
    isOnline: { $ne: false }
  })
  return res.status(200).json({
    status: 'sucess',
    msg: 'delivery boy fetched successfully',

    deliveryBoys
  })
}

// update delivery boy details
exports.updateDeliveryBoy = async (req, res) => {
  const number = req.body.number

  let deliveryBoy = await deliveryBoyModel.findOne({ number: number })

  if (!deliveryBoy) {
    return res
      .status(404)
      .json({ status: 'fail', msg: 'Delivery boy not found.' })
  }

  deliveryBoy = await deliveryBoyModel.findByIdAndUpdate(
    deliveryBoy.id,
    req.body,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false
    }
  )

  const updated = await deliveryBoyModel.findById(deliveryBoy._id)

  return res.status(200).json({
    status: 'sucess',
    msg: 'Updated Sucessfully',
    deliveryBoy: updated
  })
}

// delete a delivery boy
exports.deleteDeliveryBoy = async (req, res) => {
  const number = req.body.number
  const deliveryBoy = await deliveryBoyModel.findOneAndDelete({
    number: number
  })

  if (!deliveryBoy) {
    return res
      .status(404)
      .json({ status: 'fail', msg: 'Delivery Boy not found.' })
  }

  res
    .status(200)
    .json({ status: 'sucess', msg: 'Delivery Boy deleted successfully' })
}

exports.deliveryBoyStatusUpdate = async (req, res) => {
  const { isOnline, number } = req.body

  await deliveryBoyModel.findOneAndUpdate(
    { number: number },
    { isOnline: isOnline }
  )
  const deliveryBoy = await deliveryBoyModel.findOne({ number: number })
  return res.status(200).json({
    status: 'sucess',
    msg: 'delivery boy updated successfully',
    deliveryBoy: deliveryBoy
  })
}
exports.deliveryBoyStatus = async (req, res) => {
  const number = req.user.number

  const deliveryBoy = await deliveryBoyModel.findOne({ number: number })

  return res.status(200).json({
    status: 'sucess',
    msg: 'delivery boy found',
    isOnline: deliveryBoy.isOnline
  })
}

exports.deliveryBoyAdminStatusUpdate = async (req, res) => {
  const { isActive, number } = req.body

  await deliveryBoyModel.findOneAndUpdate(
    { number: number },
    { isActive: isActive }
  )
  const deliveryBoy = await deliveryBoyModel.findOne({ number: number })
  return res.status(200).json({
    status: 'sucess',
    msg: 'delivery boy updated successfully',
    deliveryBoy: deliveryBoy
  })
}

exports.isVerified = async (req, res) => {
  const id = req.user._id

  const driver = await deliveryBoyModel.findOne({ user_id: id })
  if (!driver) {
    res.status(404).json({ status: 'fail', msg: 'You are not a driver' })
  }
  res.status(200).json({
    status: 'sucess',
    msg: 'Verification status',
    isVerified: driver.isVerified
  })
}
exports.verifyDriver = async (req, res) => {
  const id = req.params.id
  const driver = await deliveryBoyModel.findByIdAndUpdate(id, {
    isVerified: true
  })
  if (!driver) {
    res.status(404).json({ status: 'fail', msg: 'You are not a driver' })
  }
  res.status(200).json({ status: 'sucess', msg: 'driver Verified' })
}
exports.getUnverifiedDriver = async (req, res) => {
  const drivers = await deliveryBoyModel.find({ isVerified: false })
  if (!drivers) {
    res.status(404).json({ status: 'fail', msg: 'All driver Are Verified' })
  }
  res.status(200).json({ status: 'sucess', msg: 'driver Fecthed', drivers })
}

exports.getAsssignedOrder = async (req, res) => {
  const driver = await deliveryBoyModel.findOne({ user_id: req.user._id })
  if (!driver) {
    return res.status(404).json({
      status: 'fail',
      msg: 'Driver not found'
    })
  }

  const order = await orderModel.findOne({ driver_id: driver._id })

  if (!order) {
    return res.status(200).json({
      status: 'sucess',
      msg: 'No order assigned'
    })
  }
  return res.status(200).json({
    status: 'sucess',
    msg: 'Order and driver send',
    driver,
    order
  })
}

exports.setLocation = async (req, res) => {
  const id = req.user._id

  const driver = await deliveryBoyModel.findOneAndUpdate(
    { user_id: id },
    req.body
  )
  if (!driver) {
    res.status(404).json({ status: 'fail', msg: 'All driver Are Verified' })
  }
  res.status(200).json({ status: 'sucess', msg: 'driver Fecthed', driver })
}

exports.getDriverEarning = async (req, res) => {
  const id = req.user._id

  const driverEarnings = await deliveryBoyEarning.find({ user_id: id })
  const driverEarning = await deliveryBoyEarning.aggregate([
    {
      $group: {
        _id: '$user_id',

        earning: { $sum: '$earning' }
      }
    }
  ])

  if (driverEarnings.length == 0) {
    return res.status(404).json({ status: 'fail', msg: 'No Earning Found' })
  }
  return res.status(200).json({
    status: 'sucess',
    msg: 'driver Fecthed',
    driverEarnings,
    driverEarning
  })
}
