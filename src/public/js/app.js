const socket = io();

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");

function handleSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", { payload: input.value });
  input.value = "";
}

form.addEventListener("submit", handleSubmit);
