const tripModel = require("../model/trip");

exports.startTrip = async (req, res) => {
    const {
        delivery_boy_id,
        lat,
        long,
        order_id,

    } = req.body;

    const trip = await tripModel.create({ delivery_boy_id, order_id, locations: { lat, long } });
    res.status(201).send({
        status: "sucess",
        trip,
    });
    const io = new Server();

    io.attachApp(app);
    io.on("connection", (socket) => {
        console.log(socket.id);
    });





}