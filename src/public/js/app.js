//frontend
const frontSocket = new WebSocket(`ws://${window.location.host}`);

frontSocket.addEventListener("open", () => {
  console.log("Connected to server ✅");
});

frontSocket.addEventListener("message", (message) => {
  console.log("New message: ", message.data);
});

frontSocket.addEventListener("close", () => {
  console.log("Disconnected to server ❌");
});

setTimeout(() => {
  frontSocket.send("hello from the browser");
}, 5000);
