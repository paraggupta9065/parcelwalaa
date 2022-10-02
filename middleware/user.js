const user = require("../model/user");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = async (req, res, next) => {
  const { token } = req.headers;
  try {
    if (!token) {
      return res.status(404).send({ status: "fail", msg: "Token not found." });
    }
    let decoded;
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.id;
    const findUser = await user.findById({ _id: id });
    if (!findUser) {
      return res.status(404).send({ status: "logout", msg: "user not found." });
    }
    req.user = findUser;
  } catch (error) {
    return res.status(401).send({ status: "logout", msg: "Unauthorized", });
  }
  return next();
};
