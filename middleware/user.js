const user = require("../model/user");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = async (req, res, next) => {
  const { token } = req.headers;
  try {
    if (!token) {
      return next(
        res.status(404).send({ status: "fail", msg: "Token not found." })
      );
    }
    let decoded;
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.id;
    const foundUser = await user.findById({ _id: id });
    req.user = foundUser;
  } catch (error) {
    return res.status(401).send({ status: "fail", msg: "Unauthorized" });
  }
  next();
};
