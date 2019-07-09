

var STTfileModule = (function() {
  'use strict';
  var stream     = {
      token: null,
      file: null,
      play: true, // play the audio out loud
      outputElement: '#output' // CSS selector or DOM Element (optional)

  };

  return {
    STTfile: STTfile,
    STTfile_stop: STTfile_stop,
    init: init
  };

  function init() {
    checkBrowsers();
  }

  function checkBrowsers() {
    // Check if browser supports speech
    if (!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia || navigator.msGetUserMedia)) {
    }
  }


  function STTfile() {
      fetch('/api/speech-to-text/token')
      .then(function(response) {
        return response.text();
      }).then(function (token) {
        stream.file = document.querySelector('#audiofile').files[0]
        stream.token = token;
        stream = WatsonSpeech.SpeechToText.recognizeFile(stream);
        stream.on('error', function(err) {
            console.log(err);
        });

      }).catch(function(error) {
          console.log(error);
      });
  }

  function STTfile_stop() {
      if (stream) {
          stream.stop();
      }
  }

})();

STTfileModule.init(); // Runs Speech to Text Module
