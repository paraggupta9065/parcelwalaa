// Not completed yet
// Some task remaining

exports.isDeliveryBoy = async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(401).send({
      status: "fail",
      msg: "Unauthorised",
    });
  }

  if (user.role !== "delivey boy") {
    return res.status(400).send({
      status: "fail",
      msg: "Only Delivey boy has access to this route.",
    });
  }

  next();
};
 