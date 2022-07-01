
const shopModel = require("../model/shop");
const ordersModel = require("../model/order");

exports.getOrdersShops = async (req, res) => {
    const id = req.shop._id;

    const orders = await ordersModel.find({ shop_id: id });
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

//     res.status(200).send({
//         status: "sucess",
//         msg: "cartModel deleted.",
//     });
// };
