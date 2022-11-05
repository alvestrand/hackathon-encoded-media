// This file contains some basic functions to check that defined API
// functions can be called.

const bumpInStackButton = document.querySelector('button#bumpInStack');
console.log("Button is", bumpInStackButton);
bumpInStackButton.onclick = createBumpInStack;

function createBumpInStack() {
  const pc = new RTCPeerConnection();
  pc.addTransceiver('audio');
  const sender = pc.getSenders()[0];
  const frameSource = sender.divertFrames();
  sender.insertFrames(frameSource);
  pc.close();
}
