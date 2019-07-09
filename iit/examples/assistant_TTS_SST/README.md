

# Speech Recognition and Synthesis


<p align='center'>
<img src="https://github.com/robotology/yarp.js/blob/master/images/example_browser_speech_recognition.png" width="60%">
</p>

This application uses the Google Speech Recognition and Synthesis APIs available for Google Chrome (not Firefox yet!) to:

1. receive text messages over the YARP network and convert them to speech.
2. recognize human speech from a device and send the transcript as a YARP Bottle on the YARP network. 

This is done by opening two YARP ports: `/yarpjs/speech/tts:i` and `/yarpjs/speech/rec:o` used respectively to read text in input an transform it into speech or stream out recognized human speech in textual form.

Below we describe how to use this demo application. Follow the instructions in [here](/examples) to setup the system. 

Go [here](#code-overview) for an overview of how to use yarp.js and implement this application yourself!

## Speech Synthesis

On the `examples` [demo webpage](/examples), go to the `Speech Recognition` demo: you can try out speech synthesis by simply filling the input box to the left of the button *Speak*. 

However, the cool thing is to send these messages from the YARP network! So, go on a shell on a machine where YARP is installed and open a port to write in the messages you want to speak aloud
```
$> yarp write ... /yarpjs/speech/tts:i
```
Now, every message you write in this terminal will be sent to your browser and synthesized to actual speech. Try it out!


## Speech Recognition

The YARP port `/yarpjs/speech/rec:o` opened by this application returns speech recognized using the Google Speech API as a single-string text in a YARP Bottle over the YARP Network. We can read from this as follows: go on a shell and run `yarp read ... /yarpjs/speech/rec:o`. Now we are ready for speech recognition:

Press the *Voice Recognition* button. You should receive a dialog asking for permission to use your microphone (unless you already set Chrome to have full permission to use your microphone and camera). You can then start speech recognition. Both English and Italian are available for this example:

On your shell you should be able to see the YARP Bottles rendered as strings containing the messages recognized by the Google Speech Recognition APIs.


<a name='code-overview'></a>
## Implementation

yarp.js provides a wrapper for the Google speech recognition and synthesis APIs to make it easier to use them within the YARP environmnent. Here we describe how to use it to replicate the above demo application. You can find the corresponding code in the file `examples/speech_recognition/index.html` (modulo some css additions to make the page more user-friendly).

### Setup

Before writing application specific code, we need to first setup the `yarp` javascript object in the browser. To do so, we will need to load the `socket.io` and `yarp.js` libraries (both served by the yarp.js server we run from [here](examples)) and then initialize the `yarp` object with the `io` websocket.
```html
<html>
  <head>
  
    <--! your head here --> 

    <script src="/socket.io/socket.io.js"></script>
    <script src="/yarp.js"></script>

  </head>
  
  <body>
    <--! your body here --> 
  </body>
  
  <script>
    var socket = io();
    yarp.init(socket);
    
    yarp.onInit( function () {
        <--! your code here -->
    });
    
  </script>

</html>
```
Mind the position where these instruction are. In particular we follow the practice of loading libraries within the head tag, while putting application-specific scripts after the body tag.

**Note.** All code related to opening and setting onRead callbacks for ports needs to be put within the initialization function `yarp.onInit`. This is needed because the yarp javascript object can start connecting with the yarp.js server only when the `io` object has been fully loaded. We plan to remove this requirement in the future. 

### Speech Synthesis

Within the `yarp.onInit` callback, open the two ports we will use for this application. 
```
var yarpSpeechRecPort = yarp.PortHandler.openPort('/yarpjs/speech/rec:o');
var yarpSpeakPort = yarp.PortHandler.openPort('/yarpjs/speech/tts:i');
```
To recognize human speech and then write the corresponding text onto the YARP network, we create a callback for the event `'yarp speech finished'`, which tells us that a complete sentence has been recognized by the Google APIs. The recognized speech is then written on the speech recognition port.
```js
yarp.Recognizer.addEventListener('yarp speech finished', function (e) {
  yarpSpeechRecPort.write(e.detail[0].transcript);
}, false);
```
To allow for the speech recognition system to be constantly active after it has been turned on, we add the command 
```js
yarp.Recognizer.enableAutorestart();
```
which restarts the speech recognizer everytime it has recognized a sentence (otherwise the default behavior would be to stop as soon as one sentence has been recognized).

For speech synthesis, we want to receive a message from the YARP network and transform it to speech. To do so we need to create a callback for the port receiving such message and then simply call the `yarp.Synthetizer` method `speak` with the corresponding text in input:
```js
yarpSpeakPort.onRead(function(msg){
  yarp.Synthetizer.speak(msg.content);
});
```
and that's it! We just added speech synthesis/recognition functionalities in our browser.


