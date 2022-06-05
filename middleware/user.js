const user = require("../model/user");
const jwt = require("jsonwebtoken");

exports.isloggedin = async (req, res, next) => {
    const userToken = req.headers.authorization;
    if (!userToken) {
        return res.status(401).send({ "msg": "Unauthorized" });
    }
    const token = userToken.split(" ")[1];
    if (!token) {
        return res.status(404).send({ "msg": "Token not found." });
    }

    var decoded = undefined;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).send({ "msg": "Unauthorized" });
    }
    const id = decoded.id;
    const foundUser = await user.findById({ _id: id });
    req.user = foundUser;
    next();
}