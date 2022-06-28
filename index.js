const server = require("./app");

const PORT = process.env.PORT || 5000;
const server = require('http').createServer(app);
const io = require("socket.io")(server);

server.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});
io.on('connection', (socket) => {
  console.log(socket.id)
});