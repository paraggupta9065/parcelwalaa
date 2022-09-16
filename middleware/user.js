const user = require("../model/user");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = async (req, res, next) => {
  const { token } = req.headers;
  console.log(token)
  try {
    if (!token) {
      return res.status(404).send({ status: "fail", msg: "Token not found." });
    }
    let decoded;
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.id;
    req.user = await user.findById({ _id: id });
  } catch (error) {
    return res.status(401).send({ status: "logout", msg: "Unauthorized", });
  }
  return next();
};
