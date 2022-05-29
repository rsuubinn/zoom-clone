const socket = io();
const welcome = document.getElementById("welcome");

function backendDone(msg) {
  console.log(`The backend says: ${msg}`);
}

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = welcome.querySelector("input");
  socket.emit("enter_room", input.value, backendDone);
  input.value = "";
};

welcome.addEventListener("submit", handleRoomSubmit);
