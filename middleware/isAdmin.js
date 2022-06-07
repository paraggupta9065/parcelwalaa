exports.isAdmin = async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(401).send({
      status: "fail",
      msg: "Unauthorised",
    });
  }

  if (user.role !== "admin") {
    return res.status(400).send({
      status: "fail",
      msg: "Only admin has access to this route.",
    });
  }

  next();
};
