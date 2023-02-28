// Not completed yet
// Some task remaining

exports.isAdmin = async (req, res, next) => {
  const user = req.user

  if (!user) {
    return res.status(401).json({
      status: 'fail',
      msg: 'Unauthorised'
    })
  }

  if (user.role !== 'admin') {
    return res.status(400).json({
      status: 'fail',
      msg: 'Only admin has access to this route.'
    })
  }

  next()
}
