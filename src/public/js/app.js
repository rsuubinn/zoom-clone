const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");

let myStream;
let muted = false;
let cameraOff = false;

async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    myFace.srcObject = myStream;
  } catch (error) {
    console.log(error);
  }
}

getMedia();

function handleMuteClick() {
  if (!muted) {
    muteBtn.innerText = "마이크 켜기";
    muted = true;
  } else {
    muteBtn.innerText = "마이크 끄기";
    muted = false;
  }
}
function handleCameraClick() {
  if (cameraOff) {
    cameraBtn.innerText = "카메라 끄기";
    cameraOff = false;
  } else {
    cameraBtn.innerText = "카메라 켜기";
    cameraOff = true;
  }
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
