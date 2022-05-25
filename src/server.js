import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListening = () => {
  console.log(`Listening on http://localhost:3000`);
};

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

//backend
wss.on("connection", (backSocket) => {
  console.log("Connected to browser ✅");
  backSocket.on("close", () => {
    console.log("Disconnedted to browser ❌");
  });
  backSocket.on("message", (message) => {
    console.log(message.toString("utf8"));
  });
  backSocket.send("Hello! from the server");
});

server.listen(3000, handleListening);
