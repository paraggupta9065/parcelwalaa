
const shopModel = require("../model/shop");
const ordersModel = require("../model/order");

exports.getOrdersShops = async (req, res) => {
    const id = req.params.id;

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

exports.getOrders = async (req, res) => {

    const orders = await ordersModel.find();
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

exports.updateStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.body.status;
    const orders = await ordersModel.findByIdAndUpdate(id, { "status": status })
    if (!orders) {
        return res.status(200).send({
            status: "failed",
            msg: "order not found",
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
