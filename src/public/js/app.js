const socket = io();
const form = document.getElementById("welcome");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function showRoom() {
  form.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `채널: ${roomName}`;
}

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
};

welcome.addEventListener("submit", handleRoomSubmit);
