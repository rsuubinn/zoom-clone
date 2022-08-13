const socket = new WebSocket(`ws://${window.location.host}`);
const messageForm = document.querySelector("form");
const messageList = document.querySelector("ul");

socket.addEventListener("open", () => {
  console.log("Connected to Server ");
});

socket.addEventListener("message", (message) => {
  console.log("I got message: ", message.data);
});

socket.addEventListener("close", () => {
  console.log("Disconnected to Server");
});

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(input.value);
}

messageForm.addEventListener("submit", handleSubmit);
