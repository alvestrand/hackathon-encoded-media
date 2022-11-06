// This is the Javascript shim for putting the new-style encoded-api
// onto RTPSender and RTPReceiver.
// Most methods will log "I have been called" and do nothing.

function ensureStreamsPresent(sender_or_receiver) {
  if (!sender_or_receiver._streams) {
    sender_or_receiver._streams = sender_or_receiver.createEncodedStreams();
  }
}

class EncodedFrameSource {
  requestKeyframe() {
    console.log('requestKeyframe called');
  }
  requestBandwidth() {
    console.log('requestBandwidth called');
  }
  requestResolution() {
    console.log('requestResolution called');
  }
};

class EncodedFrameSourceFromSenderReceiver extends EncodedFrameSource {
  constructor(sender_or_receiver) {
    super();
    ensureStreamsPresent(sender_or_receiver);
    this.readable = sender_or_receiver._streams.readable;
  }
}

// eslint-disable-next-line no-unused-vars
class EncodedFrameSink {
  constructor() {
    this.sink = null;
    this.onrequestkeyframe = null;
    this.onrequestbandwidth = null;
    this.onrequestresolution = null;
  }
};

RTCRtpSender.prototype.divertFrames = function() {
  console.log('Sender DivertFrames called');
  return new EncodedFrameSourceFromSenderReceiver(this);
};

RTCRtpSender.prototype.insertFrames = function(source) {
  console.log('Sender InsertFrames called');
  ensureStreamsPresent(this);
  source.readable.pipeTo(this._streams.writable);
};

RTCRtpReceiver.prototype.divertFrames = function() {
  console.log('Receiver DivertFrames called');
  return new EncodedFrameSourceFromSenderReceiver(this);
};

RTCRtpReceiver.prototype.insertFrames = function(source) {
  console.log('Receiver InsertFrames called');
  ensureStreamsPresent(this);
  source.readable.pipeTo(this._streams.writable);
};

console.log('Shim loaded');
