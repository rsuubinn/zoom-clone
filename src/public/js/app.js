const socket = io();

const welcome = document.getElementById("welcome");
const room = document.getElementById("room");
const form = welcome.querySelector("form");

room.hidden = true;

let roomName;
let nickName;

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `방이름 : ${roomName}`;
  const form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit);
}

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("input");
  const value = input.value;
  socket.emit("new_message", roomName, input.value, () => {
    addMessage(`나 : ${value}`);
  });
  input.value = "";
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const nickNameinput = form.querySelector("#nickname");
  const roomNameInput = form.querySelector("#roomname");
  socket.emit("enter_room", roomNameInput.value, nickNameinput.value, showRoom);
  roomName = roomNameInput.value;
  nickName = nickNameinput.value;
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (nickname) => {
  addMessage(`${nickname}(이)가 입장했습니다.`);
});

socket.on("bye", (nickname) => {
  addMessage(`${nickname}(이)가 퇴장했습니다.`);
});

socket.on("new_message", (message) => {
  addMessage(message);
});
