const shopModel = require("../model/shop");
const ordersModel = require("../model/order");

exports.getOrdersShops = async (req, res) => {
  const id = req.params.id;
  const { page = 1, limit = 10 } = req.query;

  const orders = await ordersModel
    .find({ shop_id: id })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  if (orders.length == 0) {
    return res.status(404).send({
      status: "fail",
      msg: "Order Not Found",
    });
  }

  return res.status(200).send({
    status: "sucess",
    orders,
  });
};

exports.getOrders = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const orders = await ordersModel
    .find()
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  if (orders.length == 0) {
    return res.status(404).send({
      status: "fail",
      msg: "Order Not Found",
    });
  }

  return res.status(200).send({
    status: "sucess",
    orders,
  });
};

// exports.removeCart = async (req, res) => {
//     const id = req.user._id;

//     await cartModel.findOneAndDelete({ user: id });

//      return res.status(200).send({
//         status: "sucess",
//         msg: "cartModel deleted.",
//     });
// };
