const connectToSocket = (app) => {
    const server = require('http').createServer(app);
    const io = require("socket.io")(server);
    io.on('connection', (socket) => {
        socket.join("driver");
        console.log("room joined");
    });
    const timerEventEmitter = app.get('emmiter');
    timerEventEmitter.on('trip_started', (trip) => {
        io.to("driver").emit("trip_started", trip);
    });
    return server;
}

module.exports = connectToSocket;