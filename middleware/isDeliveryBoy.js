// Not completed yet
// Some task remaining

exports.isDeliveryBoy = async (req, res, next) => {
  const user = req.user

  if (!user) {
    return res.status(401).json({
      status: 'fail',
      msg: 'Unauthorised'
    })
  }

  if (user.role != 'deliveryBoy') {
    return res.status(400).json({
      status: 'fail',
      msg: 'Only Delivey boy has access to this route.'
    })
  }

  next()
}
