const app = require("express")();
const fs = require("fs");
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { serveClient: false });
const logger = require("./utils/logger");

const port = 4025;
var users = {};

io.on("connection", (socket) => {
    const sckId = socket.id;
    var curUser = "";
    socket.on("chat message", (data) => {
        io.emit("chat message", data);
    });
    socket.on("user join", (user) => {
        console.log(user + " join");
        logger.info(`user ${user} joined`);
        users[sckId] = user;
        curUser = user;
    });
    socket.on("disconnect", () => {
        console.log(curUser + " disconnect");
        logger.info(`user ${curUser} disconnected`);
        delete users[sckId];
        socket.broadcast.emit("chat message", {
            system: true,
            user: "System",
            content: `<p>User <span class="user">${curUser}</span> disconnected.</p>`,
        });
    });
});

server.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
});
