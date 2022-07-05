const connectToSocket = (app) => {
    const server = require('http').createServer(app);
    const io = require("socket.io")(server);
    io.on('connection', (socket) => {

        socket.on("shop_join", (shop_id) => {
            socket.join(shop_id);
            console.log(`Shop with id ${shop_id} joined`)

        })
    });
    const timerEventEmitter = app.get('emmiter');

    timerEventEmitter.on('order_recived', (id) => {
        io.to(id).emit("order_recived", id);
    });

    return server;
}

module.exports = connectToSocket;