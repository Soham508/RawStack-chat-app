const express = require("express");
const http = require("http");
const path = require("path");

const app = express();
const PORT = process.env.PORT ? process.env.PORT : 3000;
const server = http.createServer(app);
const io = require("socket.io")(server);

//for serving static files at public from root dir
app.use(express.static(path.join(__dirname, "client")));

// route for the root URL
app.get("/", (req, res) => {
  try {
    res.status(200).sendFile(path.join(__dirname, "client", "index.html"));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

let connectedSockets = new Set();

io.on("connection", onConnection);

function onConnection(socket) {
  connectedSockets.add(socket.id);
  console.log(`joined ${socket.id} and ${connectedSockets.size} there`);

  io.emit("total-clients", connectedSockets.size);

  socket.on("disconnect", () => {
    connectedSockets.delete(socket.id);
    console.log(
      `disconnecteed and left ${connectedSockets.size > 1 ? "are" : "is"} ${
        connectedSockets.size
      }`
    );

    socket.emit("total-clients", connectedSockets.size);
  });

  socket.on("messageSent", (data) => {
    socket.broadcast.emit("messageReceived", data);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("feedback", data);
  });
}

server.listen(PORT, () => {
  console.log(`listing on ${PORT}`);
});
