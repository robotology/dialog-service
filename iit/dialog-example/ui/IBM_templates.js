//Transcribe and Play user-provided File
    var stream;
    document.querySelector('#button').onclick = function () {

      fetch('/api/speech-to-text/token').then(function(response) {
        return response.text();
      }).then(function (token) {

        stream = WatsonSpeech.SpeechToText.recognizeFile({
          token: token,
          file: document.querySelector('#audiofile').files[0],
          play: true, // play the audio out loud
          outputElement: '#output' // CSS selector or DOM Element (optional)
        });

        stream.on('error', function(err) {
            console.log(err);
        });

      }).catch(function(error) {
          console.log(error);
      });
    };

    document.querySelector('#stop').onclick = function() {
        if (stream) {
            stream.stop();
        }
    };

//Transcribe File via URL
        var button = document.querySelector('#buttonPlay');
        button.disabled = true;

        // preload the token for mobile Safari compatibility
        var token;
        fetch('/api/speech-to-text/token')
          .then(function(response) {
            return response.text();
          }).then(function(t) {
              token = t;
              button.disabled = false;
          });

        button.onclick = function () {
          WatsonSpeech.SpeechToText.recognizeFile({
            token: token,
            file: 'audio.wav',
            outputElement: '#outputPlay',
            play: true
          })
            .on('error', function(err) {
              console.log(err);
            });
        }

//Basic Text to Speech Example
        document.querySelector('#buttonTTS').onclick = function () {

          fetch('/api/text-to-speech/token')
            .then(function(response) {
              return response.text();
            }).then(function (token) {

              WatsonSpeech.TextToSpeech.synthesize({
                text: document.querySelector('#textTTS').value,
                token: token
              }).on('error', function(err) {
                console.log('audio error: ', err);
              });
            });
        };
