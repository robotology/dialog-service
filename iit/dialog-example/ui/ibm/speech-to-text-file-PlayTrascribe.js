

var STTfilePlayModule = (function() {
  'use strict';
  var params     = {
      token: null,
      file: 'giulia.wav',
      outputElement: '#outputPlay',
      play: true
  };

  return {
    PlayTranscribe: PlayTranscribe,
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


  function PlayTranscribe() {
      // preload the token for mobile Safari compatibility
      fetch('/api/speech-to-text/token')
        .then(function(response) {
          return response.text();
      }).then(function(token) {
            params.token = token;
            WatsonSpeech.SpeechToText.recognizeFile(params)
            .on('error', function(err) {
                console.log(err);
              });
        });
  }
})();

STTfilePlayModule.init(); // Runs Speech to Text Module
