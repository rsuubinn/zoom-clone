const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");
const call = document.getElementById("call");
const messages = document.getElementById("messages");
const screenBtn = document.getElementById("screen");

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;
let myDataChannel;

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.id = "camera";
      option.innerText = camera.label;
      if (currentCamera.label === option.label) {
        option.selected = true;
      }
      cameraSelect.appendChild(option);
    });
  } catch (error) {
    console.log(error);
  }
}

async function getMedia(deviceId, id) {
  const initialConstraint = {
    audio: false,
    video: { facingMode: "user" },
  };
  const newConstraint = {
    audio: false,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      id === "camera" ? newConstraint : initialConstraint
    );
    if (id === "screen") {
      myStream = await navigator.mediaDevices.getDisplayMedia({
        cursor: true,
        audio: true,
        video: true,
      });
    }
    myFace.srcObject = myStream;

    if (!deviceId) {
      await getCameras();
      await getScreens();
    }
  } catch (error) {
    console.log(error);
  }
}

function handleMuteClick() {
  myStream.getAudioTracks().forEach((track) => {
    track.enabled = !track.enabled;
  });
  if (!muted) {
    muted = true;
    muteBtn.innerText = "음소거 해제";
  } else {
    muted = false;
    muteBtn.innerText = "음소거";
  }
}
function handleCameraClick() {
  myStream.getVideoTracks().forEach((track) => {
    track.enabled = !track.enabled;
  });
  if (cameraOff) {
    cameraOff = false;
    cameraBtn.innerText = "카메라 끄기";
  } else {
    cameraOff = true;
    cameraBtn.innerText = "카메라 켜기";
  }
}

async function handleCameraChange() {
  try {
    const id = cameraSelect.options[cameraSelect.selectedIndex].id;
    await getMedia(cameraSelect.value, id);
    if (myPeerConnection) {
      const videoTrack = myStream.getVideoTracks()[0];
      const videoSender = myPeerConnection
        .getSenders()
        .find((sender) => sender.track.kind === "video");
      videoSender.replaceTrack(videoTrack);
    }
  } catch (error) {
    console.log(error);
  }
}

async function getScreens() {
  const screen = await navigator.mediaDevices.getUserMedia({
    video: { mediaSource: "screen" },
  });
  const screenId = screen.id;
  const option = document.createElement("option");
  option.value = screenId;
  option.id = "screen";
  option.innerText = "화면 공유";
  cameraSelect.appendChild(option);
}
muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
cameraSelect.addEventListener("input", handleCameraChange);

// Welcome Form

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

async function initCall() {
  call.hidden = false;
  welcome.hidden = true;
  await getMedia();
  makeConnection();
}

async function handleWelcomeSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  const li = document.createElement("li");
  await initCall();
  socket.emit("join_room", input.value);
  roomName = input.value;
  li.innerText = input.value;
  roomList.append(li);
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// Chat Form

const chat = document.getElementById("chat");
const chatForm = chat.querySelector("form");
const chatLists = chat.querySelector("ul");

function handleChatSubmit(event) {
  event.preventDefault();
  const input = chatForm.querySelector("input");
  const message = input.value;
  myDataChannel.send(message);
}

function handleMessage(message) {
  const li = document.createElement("li");
  li.innerText = message;
  chatLists.append(li);
}

chatForm.addEventListener("submit", handleChatSubmit);

// Exit

const exitBtn = call.querySelector("#exit");

function handleExitBtn() {
  socket.emit("exit");
}

exitBtn.addEventListener("click", handleExitBtn);

// Socket

socket.on("update_rooms", (rooms) => {
  const roomList = welcome.querySelector("#rooms ul");
  roomList.innerText = "";
  if (rooms.length === 0) {
    const li = document.createElement("li");
    li.innerText = "방이 존재하지 않습니다.";
    roomList.append(li);
  } else {
    console.log(rooms);
    rooms.forEach((room) => {
      console.log(room);
      const button = document.createElement("button");
      button.innerText = `${room}`;
      roomList.append(button);
    });
  }
});
socket.on("welcome", async () => {
  myDataChannel = await myPeerConnection.createDataChannel("chat");
  myDataChannel.addEventListener("message", (event) => {
    handleMessage(event.data);
  });
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  console.log("Sent the offer");
  socket.emit("offer", offer, roomName);
  const li = document.createElement("li");
  li.innerText = input.value;
  chatLists.append(li);
});

socket.on("offer", async (offer) => {
  myPeerConnection.addEventListener("datachannel", (event) => {
    myDataChannel = event.channel;
    myDataChannel.addEventListener("message", (event) => {
      handleMessage(event.data);
    });
  });
  console.log("Received the offer");
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomName);
  console.log("Sent the answer");
});

socket.on("answer", (answer) => {
  console.log("Received the answer");
  myPeerConnection.setRemoteDescription(answer);
});

socket.on("ice", (ice) => {
  console.log("Received candidate");
  myPeerConnection.addIceCandidate(ice);
});

socket.on("room_change", (rooms) => {});

//WebRTC

function makeConnection() {
  myPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ],
      },
    ],
  });
  myPeerConnection.addEventListener("icecandidate", handleIce);
  myPeerConnection.addEventListener("addstream", handleAddStream);
  myStream.getTracks().forEach((track) => {
    myPeerConnection.addTrack(track, myStream);
  });
}

function handleIce(data) {
  console.log("Sent candidate");
  socket.emit("ice", data.candidate, roomName);
}

function handleAddStream(data) {
  const peerFace = document.getElementById("peerFace");
  peerFace.srcObject = data.stream;
}
