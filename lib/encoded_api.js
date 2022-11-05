// This is the Javascript shim for putting the new-style encoded-api onto RTPSender and RTPReceiver.
// Most methods will log "I have been called" and do nothing.

class EncodedFrameSource {

};

class EncodedFrameSink {

};

RTCRtpSender.prototype.divertFrames = function() {
  console.log('DivertFrames called');
  return new EncodedFrameSource;
}
RTCRtpSender.prototype.insertFrames = function() {
  console.log('InsertFrames called');
}

console.log('Shim loaded');
