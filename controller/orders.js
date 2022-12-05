
const shopModel = require("../model/shop");
const admin = require("firebase-admin");
const ordersModel = require("../model/order");
const previousOrderModel = require("../model/previousOrder");
const { getDistance } = require("geolib");
const deliveryBoyModel = require("../model/deliveryBoy");
const userModel = require("../model/user");
const { use } = require("../routes/coupon");
const { json } = require("express");



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
    let orders = await ordersModel.findById(id);
    const user = await userModel.findById(orders.user_id);
    await ordersModel.findByIdAndUpdate(orders._id, { status });
    console.log(status)
    if (!orders) {
        return res.status(200).send({
            status: "failed",
            msg: "order not found",
        });
    }
    // message to customer
    if (user.tokens) {
        user.tokens.forEach(async (element) => {


            try {
                const messageCustomer = {
                    notification: {
                        title: `Your Order Is ${status}`,
                        body: `Order ${status}`,
                    },
                    data: {
                        "status": status,
                        "id": String(orders._id),

                    },
                    token: element.token,

                };
                await admin
                    .messaging().send(messageCustomer);
            } catch (error) {
                console.log(error);
            }
        });

    }
    if (status == "cancelled" || status == "delivered") {
        orders["status"] = status;
        if (orders['driver_id'] != null) {
            await deliveryBoyModel.findByIdAndUpdate(orders['driver_id'], { 'isAvailable': true })
        }

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
            if ((user.tokens)) {
                user.tokens.forEach(async (element) => {
                    try {
                        const messageCustomer = {
                            notification: {
                                title: `Your Order ${status}`,
                                body: `Your Order ${status} Is Ready For Pickup`,
                            },
                            data: {
                            },
                            token: element.token,

                        };
                        const customerResp = await admin
                            .messaging().send(messageCustomer);
                    } catch (error) {
                        console.log(error);
                    }
                })
            }
            return res.status(200).send({
                status: "sucess",
                msg: "Status Updated",
                customerResp,

            });
        }
        const shop = await shopModel.findById(orders.order_inventory[0].shop_id._id);
        const shopLat = shop.lat;
        const shopLong = shop.long;
        const drivers = await deliveryBoyModel.find({ pincode: shop.pincode, isActive: true, isOnline: true, isAvailable: true });


        if (drivers.length == 0) {
            return res.status(404).send({
                status: "fail",
                msg: "No driver nearby found",
            });
        }
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
        await ordersModel.findOneAndUpdate({ "_id": id }, { driver_id: driver._id }).catch((err) => console.log(err));

        const userDriver = await userModel.findOne({ _id: driver.user_id });
        if ((userDriver.tokens)) {
            userDriver.tokens.forEach(async (element) => {
                try {
                    const messageDriver = {
                        notification: {
                            title: `Your Order Is ${status}`,
                            body: `Order ${status}`,
                        },
                        data: {
                            "status": status,
                            "order": String(orders._id),
                            "type": "order",
                        },
                        token: element.token,

                    };
                    await admin
                        .messaging().send(messageDriver);
                } catch (error) {
                    console.log(error);
                }
            })
        }


        return res.status(200).send({
            status: "sucess",
        });
    } else if (status == "assignedAccepted") {
        const userDriver = await deliveryBoyModel.findOne({ user_id: req.user._id });
        await deliveryBoyModel.findOneAndUpdate({ "_id": userDriver._id }, { isAvailable: false }).catch((err) => console.log(err));
        if ((user.tokens)) {
            user.tokens.forEach(async (element) => {
                try {
                    const messageCustomer = {
                        notification: {
                            title: `Your Order Is ${status}`,
                            body: `Order ${status}`,
                        },
                        data: {
                            "status": status,
                            "driver": String(userDriver),
                        },
                        token: element.token,

                    };
                    const customerResp = await admin
                        .messaging().send(messageCustomer);
                } catch (error) {
                    console.log(error);
                }
            })
        }
        return res.status(200).send({
            status: "sucess",
            msg: "Status Updated",
            customerResp,
        });
    }
    else if (status == "pickedUp" || status == "arrivedCustumer") {

        if (status == "pickedUp") {


            if ((user.tokens)) {
                user.tokens.forEach(async (element) => {

                    try {
                        const messageCustomer = {
                            notification: {
                                title: `Your Order Is At Your Door Step`,
                                body: `Delivery Boy At Your Door Step`,
                            },
                            data: {
                                "status": status,
                            },
                            token: element.token,

                        };
                        const customerResp = await admin
                            .messaging().send(messageCustomer);
                    } catch (error) {
                        console.log(error);
                    }
                })
            }

        } else if (status == "arrivedCustumer") {
            if ((user.tokens)) {
                user.tokens.forEach(async (element) => {

                    try {
                        const messageCustomer = {
                            notification: {
                                title: `Your Order Is At Your Door Step`,
                                body: `Delivery Boy At Your Door Step`,
                            },
                            data: {
                                "status": status,
                            },
                            token: element.token,

                        };
                        const customerResp = await admin
                            .messaging().send(messageCustomer);
                    } catch (error) {
                        console.log(error);
                    }
                })
            }



        }

        return res.status(200).send({
            status: "sucess",
            msg: "Status Updated",

        });
    }
    else if (status == "accepted") {
        return res.status(200).send({
            status: "sucess",
            msg: "Status Updated"
        });

    }
    return res.status(200).send({
        status: "fail",
        msg: "message token not found"
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
