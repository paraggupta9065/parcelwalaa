
const shopModel = require("../model/shop");
const admin = require("firebase-admin");
const ordersModel = require("../model/order");
const previousOrderModel = require("../model/previousOrder");
const { getDistance } = require("geolib");
const deliveryBoyModel = require("../model/deliveryBoy");
const userModel = require("../model/user");
const { use } = require("../routes/coupon");



exports.getOrdersShops = async (req, res) => {
    const id = req.params.id;

    const orders = await ordersModel.find({ "order_inventory.shop_id": id });
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
exports.getOrder = async (req, res) => {
    const id = req.params.id;
    const orders = await ordersModel.findById(id).populate("delivery_address_id").populate("user_id");
    if (!orders) {
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


exports.getOrdersAdmin = async (req, res) => {

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
exports.getOrderByCustomer = async (req, res) => {
    const id = req.user._id;
    const order = await ordersModel.findOne({ user_id: id });

    if (!order) {
        return res.status(404).send({
            status: "notFound",
            msg: "Order Not Found",
        });
    }

    // if (order.status == 'prepared' || order.status == 'assigned' || order.status == 'delivered') {
    //     const driver = await deliveryBoyModel
    //     return res.status(404).send({
    //         status: "notFound",
    //         msg: "Order Not Found",
    //     });
    // }
    return res.status(200).send({
        status: "sucess",
        order,
    });
};

exports.updateStatus = async (req, res) => {
    // try {
    const id = req.params.id;
    const status = req.body.status;

    let orders = await ordersModel.findById(id).populate("user_id");
    const user = await userModel.findById(orders.user_id);
    await ordersModel.findByIdAndUpdate(orders._id, { status });



    if (!orders) {
        return res.status(200).send({
            status: "failed",
            msg: "order not found",
        });
    }

    // message to customer
    try {
        const messageCustomer = {
            notification: {
                title: `Your Order Is ${status}`,
                body: `Order ${status}`,
            },
            data: {
                "status": status,
                "order": String(orders),

            },
            topic: user._id.toString(),

        };
        const customerResp = await admin
            .messaging().send(messageCustomer);
    } catch (error) {
        console.log(error);
    }
    if (status == "cancelled" || status == "delivered") {
        orders["status"] = status;

        const previousOrder = await previousOrderModel.create({
            "order_note": orders.order_note,
            "order_inventory": orders.order_inventory,
            "shop_id": orders.shop_id,
            "user_id": orders.user_id,
            "transaction_id": orders.transaction_id,
            "amount_paid": orders.amount_paid,
            "status": status,
            'delivery_address_id': orders.delivery_address_id,
        });
        await ordersModel.findByIdAndDelete(orders._id);


        return res.status(200).send({
            status: "sucess",
            msg: "Order history created and order deleted",

        });
    } else if (status == "prepared") {
        if (orders.order_type == 'takeaway') {
            const messageCustomer = {
                notification: {
                    title: `Your Order ${status}`,
                    body: `Your Order ${status} Is Ready For Pickup`,
                },
                data: {
                },
                topic: user._id.toString(),

            };
            const customerResp = await admin
                .messaging().send(messageCustomer);
            return res.status(200).send({
                status: "sucess",
                msg: "Status Updated",
                customerResp,

            });
        }
        const shop = await shopModel.findById(orders.order_inventory[0].shop_id._id);
        const shopLat = shop.lat;
        const shopLong = shop.long;
        const drivers = await deliveryBoyModel.find({ pincode: shop.pincode, isActive: true, isOnline: true });

        let driverLat = drivers[0].lat;
        let driverLong = drivers[0].long;
        let nearestDriver = drivers[0].user_id;
        let driver = drivers[0];
        let shortestDistance = getDistance(
            { latitude: String(shopLat), longitude: String(shopLong) },
            { latitude: String(driverLat), longitude: String(driverLong) }
        );
        if (!drivers) {
            return res.status(404).send({
                status: "fail",
                msg: "No driver nearby found",

            });
        }


        drivers.forEach(async (driverEle) => {
            driverLat = driverEle.lat;
            driverLong = driverEle.long;


            const distance = getDistance(
                { latitude: String(shopLat), longitude: String(shopLong) },
                { latitude: String(driverLat), longitude: String(driverLong) }
            );
            if (shortestDistance > distance) {
                shortestDistance = distance;
                nearestDriver = driverEle.user_id;
                driver = driverEle;
            }

        });
        await ordersModel.findOneAndUpdate({ "_id": id }, { driver_id: driver._id, "order_note": "updated" }).catch((err) => console.log(err));
        const messageDriver = {
            notification: {
                title: `Your Order Is ${status}`,
                body: `Order ${status}`,
            },
            data: {
                "status": status,
                "id": String(orders._id),
                "type": "order",
            },
            topic: driver._id.toString(),

        };

        const driverResp = await admin
            .messaging().send(messageDriver);
        return res.status(200).send({
            status: "sucess",
            driverResp,
        });
    } else if (status == "assignedAccepted") {
        const userDriver = await deliveryBoyModel.findOne({ user_id: req.user._id });
        const messageCustomer = {
            notification: {
                title: `Your Order Is ${status}`,
                body: `Order ${status}`,
            },
            data: {
                "status": status,
                "driver": String(userDriver),


            },
            topic: user._id.toString(),

        };
        const customerResp = await admin
            .messaging().send(messageCustomer);
        return res.status(200).send({
            status: "sucess",
            msg: "Status Updated",

        });
    }
    else if (status == "accepted") {

        return res.status(200).send({
            status: "sucess",
            msg: "Status Updated",

        });

    }

    return res.status(200).send({
        status: "fail",
        msg: "message token not found",

    });

    // message to customer

    // } catch (error) {
    //     return res.status(200).send({
    //         status: "fail",
    //         error,
    //         msg: "Something went wrong"

    //     });
    // }
};

exports.getPreviousOrders = async (req, res) => {
    const id = req.user._id;

    const orders = await previousOrderModel.find({ user_id: id });
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
