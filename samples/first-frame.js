// This file contains some basic functions to check that defined API
// functions can be called.

/* global EncodedFrameSource */

const bumpInStackButton = document.querySelector('button#bumpInStack');
const passAudioButton = document.querySelector('button#passAudio');
const stopPassingAudioButton = document.querySelector('button#stopPassingAudio');
const audioCounterDiv = document.querySelector('div#passAudioCounter');

bumpInStackButton.onclick = createBumpInStack;
passAudioButton.onclick = passAudioThroughFrameCounter;
stopPassingAudioButton.onclick = stopPassingAudio;
stopPassingAudioButton.disabled = true;

function createBumpInStack() {
  const pc = new RTCPeerConnection({
    encodedInsertableStreams: true, // TODO: Hide this somehow.
  });
  pc.addTransceiver('audio');
  const sender = pc.getSenders()[0];
  const frameSource = sender.divertFrames();
  sender.insertFrames(frameSource);
  pc.close();
}

async function connectPc(pc1, pc2) {
  pc1.onicecandidate = async function(event) {
    if (event.candidate) {
      await pc2.addIceCandidate(new RTCIceCandidate(event.candidate));
    }
  };
  pc2.onicecandidate = async function(event) {
    if (event.candidate) {
      await pc1.addIceCandidate(new RTCIceCandidate(event.candidate));
    }
  };
  await pc1.setLocalDescription();
  await pc2.setRemoteDescription(pc1.localDescription);
  await pc2.setLocalDescription(pc2.createAnswer());
  await pc1.setRemoteDescription(pc2.localDescription);
}

// Function to pass audio through a frame counter

let audioPassingPc = null;
let sinkPc = null;
let frameCount = 0;

async function passAudioThroughFrameCounter() {
  audioPassingPc = new RTCPeerConnection({
    encodedInsertableStreams: true, // TODO: Hide this somehow.
  });
  sinkPc = new RTCPeerConnection();
  const audioStream = await navigator.mediaDevices.getUserMedia({audio: true});
  audioPassingPc.addTrack(audioStream.getAudioTracks()[0]);
  await connectPc(audioPassingPc, sinkPc);
  const frameSource = audioPassingPc.getSenders()[0].divertFrames();

  // This class definition defines the work done.
  // Constructor is called with an EncodedFramesource as input.
  class CountingFrameSource extends EncodedFrameSource {
    constructor(firstSource) {
      super();
      const frameCounter = new TransformStream({
        transform: (frame, controller) => {
          console.log('frame');
          frameCount += 1;
          audioCounterDiv.innerText = frameCount;
          controller.enqueue(frame);
        }
      });
      this.readable = frameSource.readable.pipeThrough(frameCounter);
    }
  };

  const outgoingFrameSource = new CountingFrameSource(frameSource);
  audioPassingPc.getSenders()[0].insertFrames(outgoingFrameSource);
  stopPassingAudioButton.disabled = false;
};

function stopPassingAudio() {
  audioPassingPc.close();
  sinkPc.close();
  stopPassingAudioButton.disabled = true;
}
