// Not completed yet
// Some task remaining

exports.isUser = async (req, res, next) => {
  const user = req.user

  if (!user) {
    return res.status(401).json({
      status: 'fail',
      msg: 'Unauthorised'
    })
  }

  if (user.role !== 'user') {
    return res.status(400).json({
      status: 'fail',
      msg: 'Only user has access to this route.'
    })
  }

  next()
}
