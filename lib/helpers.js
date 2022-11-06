// This file contains helpers that make it easier to write samples.
// The functions don't really know abou the encoded-transform APIs.

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
