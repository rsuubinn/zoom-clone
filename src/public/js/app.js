const socket = io();
const welcome = document.getElementById("welcome");

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = welcome.querySelector("input");
  socket.emit("enter_room", { payload: input.value }, () =>
    console.log("Server is done!")
  );
  input.value = "";
};

welcome.addEventListener("submit", handleRoomSubmit);
