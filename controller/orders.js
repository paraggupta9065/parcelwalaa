
const shopModel = require("../model/shop");
const admin = require("firebase-admin");
const ordersModel = require("../model/order");
const previousOrderModel = require("../model/previousOrder");
const { getDistance } = require("geolib");
const deliveryBoyModel = require("../model/deliveryBoy");
const userModel = require("../model/user");
const driverLocationModel = require("../model/driverLocation");



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
exports.getOrder = async (req, res) => {
    const id = req.params.id;
    const orders = await ordersModel.findById(id).populate("delivery_address_id").populate("user_id").populate("shop_id");
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
    try {
        const id = req.params.id;
        const status = req.body.status;

        let orders = await ordersModel.findById(id).populate("user_id").populate('shop_id');
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
            if (user.fmc_token) {
                const messageCustomer = {
                    notification: {
                        title: `Your Order Is ${status}`,
                        body: `Order ${status}`,
                    },
                    data: {
                        "status": status,
                        "order": JSON.stringify(orders),

                    },
                    token: user.fmc_token,

                };
                const customerResp = await admin
                    .messaging().send(messageCustomer);

            }
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
            });
            await ordersModel.findByIdAndDelete(orders._id);


            return res.status(200).send({
                status: "sucess",
                msg: "Order history created and order deleted",

            });
        } else if (status == "prepared") {
            const shop = await shopModel.findById(orders.shop_id);
            const shopLat = shop.lat;
            const shopLong = shop.long;
            const drivers = await deliveryBoyModel.find({ pincode: shop.pincode });
            let driverLocation = await driverLocationModel.findOne({ user_id: drivers[0].user_id });
            let locations = [];
            locations = driverLocation.locations;
            let driverLat = locations[locations.length - 1]['lat'];
            let driverLong = locations[locations.length - 1]['long'];
            let nearestDriver = drivers[0].user_id;
            let shortestDistance = getDistance(
                { latitude: String(shopLat), longitude: String(shopLong) },
                { latitude: String(driverLat), longitude: String(driverLong) }
            );
            drivers.forEach(async (driver) => {
                driverLocation = await driverLocationModel.findOne({ user_id: driver.user_id });
                locations = [];
                locations = driverLocation.locations;
                driverLat = locations[locations.length - 1]['lat'];
                driverLong = locations[locations.length - 1]['long'];
                const distance = getDistance(
                    { latitude: String(shopLat), longitude: String(shopLong) },
                    { latitude: String(driverLat), longitude: String(driverLong) }
                );
                if (shortestDistance > distance) {
                    shortestDistance = distance;
                    nearestDriver = driver.user_id;
                    await ordersModel.findByIdAndUpdate(id, { "driver": driver._id });

                }
            });

            const userDriver = await userModel.findById(nearestDriver);

            if ((userDriver.fmc_token)) {
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
                    token: userDriver.fmc_token,

                };

                const driverResp = await admin
                    .messaging().send(messageDriver);
                return res.status(200).send({
                    status: "sucess",
                    driverResp,
                });
            }
        } else if (status == "assignedAccepted") {
            const userDriver = await userModel.findById(nearestDriver);
            if (user.fmc_token) {
                const messageCustomer = {
                    notification: {
                        title: `Your Order Is ${status}`,
                        body: `Order ${status}`,
                    },
                    data: {
                        "status": status,
                        "driver": JsonWebTokenError.stringify(userDriver),

                    },
                    token: user.fmc_token,

                };
                const customerResp = await admin
                    .messaging().send(messageCustomer);

            }
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

    } catch (error) {
        return res.status(200).send({
            status: "fail",
            error,
            msg: "Something went wrong"

        });
    }
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
