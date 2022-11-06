// This file contains some basic functions to check that defined API
// functions can be called.

/* global EncodedFrameSource */

const passVideoButton = document.querySelector('button#passVideo');
const stopPassingVideoButton = document.querySelector('button#stopPassingVideo');

passVideoButton.onclick = passVideoThroughRelay;
stopPassingVideoButton.onclick = stopPassingVideo;
stopPassingVideoButton.disabled = true;


// Function to pass audio through a frame counter

let sourcePc = null;
let incomingRelayPc = null;
let outgoingRelayPc = null;
let sinkPc = null;
let frameCount = 0;

async function passVideoThroughRelay() {
  sourcePc = new RTCPeerConnection();
  incomingRelayPc = new RTCPeerConnection({
    encodedInsertableStreams: true,
  });
  outgoingRelayPc = new RTCPeerConnection({
    encodedInsertableStreams: true,
  });
  sinkPc = new RTCPeerConnection();

  const videoStream = await navigator.mediaDevices.getUserMedia({video: true});
  sourceVideo.srcObject = videoStream;
  sourcePc.addTrack(videoStream.getVideoTracks()[0]);
  incomingRelayPc.ontrack = async track => {
    const frameSource = incomingRelayPc.getReceivers()[0].divertFrames();
    outgoingRelayPc.addTransceiver('video');
    outgoingRelayPc.getSenders()[0].insertFrames(frameSource);
    await connectPc(outgoingRelayPc, sinkPc);
  }
  await connectPc(sourcePc, incomingRelayPc);
  sinkPc.ontrack = track => {
    destinationVideo.srcObject = new MediaStream([track]);
  }
  stopPassingVideoButton.disabled = false;
};

function stopPassingVideo() {
  sourcePc.close();
  incomingRelayPc.close();
  outgoingRelayPc.close();
  sinkPc.close();
  stopPassingVideoButton.disabled = true;
}
