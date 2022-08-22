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
    muted = true;
    muteBtn.innerText = "음소거 해제";
  } else {
    muted = false;
    muteBtn.innerText = "음소거";
  }
}
function handleCameraClick() {
  if (cameraOff) {
    cameraOff = false;
    cameraBtn.innerText = "카메라 끄기";
  } else {
    cameraOff = true;
    cameraBtn.innerText = "카메라 켜기";
  }
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
