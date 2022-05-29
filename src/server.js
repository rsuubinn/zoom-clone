import http from "http";
import WebSocket from "ws";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket.on("enter_room", (roomName, done) => {
    console.log(roomName);
    setTimeout(() => {
      done("hello from the backend");
    }, 5000);
  });
});

// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// const sockets = [];

// //backend
// wss.on("connection", (backSocket) => {
//   sockets.push(backSocket);
//   backSocket["nickname"] = "Anonymous";
//   console.log("Connected to browser ✅");
//   backSocket.on("close", () => {
//     console.log("Disconnedted to browser ❌");
//   });
//   backSocket.on("message", (msg) => {
//     const message = JSON.parse(msg);
//     switch (message.type) {
//       case "new_message":
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${backSocket.nickname}: ${message.payload}`)
//         );
//         break;
//       case "nickname":
//         backSocket["nickname"] = message.payload;
//         break;
//     }
//   });
// });

const handleListening = () => {
  console.log(`Listening on http://localhost:3000`);
};
httpServer.listen(3000, handleListening);
