
var synthesisModule = (function() {
  'use strict';

  var audio      = null; // Initialize audio to null
  var params     = {
      text: null,
      voice: 'en-US_MichaelVoice',
      autoPlay: true, // Automatically plays audio,
      token: null
  };
  var textTTS   = null;

  return {
    synthesis: synthesis,
    init: init
  };

  function init() {
    checkBrowsers();
  }

  function checkBrowsers() {
    // Check if browser supports speech
    if (!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia || navigator.msGetUserMedia)) {
      console.log('browser does not support speech');
    }
  }

  function synthesis() {
          fetch('/api/text-to-speech/token')
          .then(function(response) {

              return response.text();
          }).then(function (token) {
              textTTS  = document.querySelector('#textTTS').value;
              params.text = textTTS;
              params.token = token;
              audio = WatsonSpeech.TextToSpeech.synthesize(params);
          });
   return audio;
   }
})();

synthesisModule.init();
