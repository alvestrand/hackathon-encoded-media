The API we seek to emulate here consists of 3 parts:

*   A create function for encoded RTCVideoFrame / RTCAudioData.
    Because current emulations require a stateful object, we create an object of class EncodedVideoContext that has a "createFrame" method.
    
*   A pair of interfaces called EncodedFrameSource and EncodedFrameSink. Each contains a Stream object (Readable vs Writable stream) and a series
    of event handlers that correspond with a function call on the other side; if the function call of the same name is set as the handler from the
    other side, this is a "passthrough" for that particular event.
    
*   A pair of functions on RTPSender and RTPReceiver called DivertFrames and InsertFrames - DivertFrames gives an EncodedFrameSource; InsertFrames
    takes an EncodedFrameSource argument. sender.InsertFrames(sender.DivertFrames) is intended to be a null operation.
    
    
In WebIDL, this would be expressed as:
```
interface EncodedVideoContext {
constructor(integer width, integer height);
createFrame();
};

partial interface RTCRtpSender {
   EncodedFrameSource DivertFrames();
   void insertFrames(EncodedFrameSource);
};

partial interface RTCRtpReceiver {
   EncodedFrameSource DivertFrames();
   void insertFrames(EncodedFrameSource);
};

interface EncodedFrameSource {
   ReadableStream source;
   void requestKeyframe();
   void requestBandwidth(BandwidthEvent);
   void requestResolution(ResolutionEvent);
}

interface EncodedFrameSink {
   WritableStream sink;
   attribute onrequestkeyframe;
   attribute onrequestbandwidth;
   attribute onrequestresolution;
}
```
