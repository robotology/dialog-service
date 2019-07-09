
var yarp = require('../../yarp');
var ibm_text_to_speech_receiver = new yarp.Port('bottle');
ibm_text_to_speech_receiver.open('/ibmjs/text_to_speech:i');

var ibm_audio_play_sender = new yarp.Port('bottle');
ibm_audio_play_sender.open('/ibmjs/audio_play:o');


const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var fs = require('fs');

const textToSpeech = new TextToSpeechV1({

    username: process.env.TEXT_TO_SPEECH_USERNAME || 'bb04049c-7fc1-42a0-9d4f-c656f9c6bfb7',
    password: process.env.TEXT_TO_SPEECH_PASSWORD || '5M6WuwsfmHme',
    url: TextToSpeechV1.URL

});

// Inform user that TTS is not configured properly or at all
if (!(process.env.TEXT_TO_SPEECH_USERNAME && process.env.TEXT_TO_SPEECH_PASSWORD)) {
  // eslint-disable-next-line
  console.warn('WARNING: The app has not been configured with a TEXT_TO_SPEECH_USERNAME and/or ' +
    'a TEXT_TO_SPEECH_PASSWORD environment variable. If you wish to have text to speech ' +
    'in your working application, please refer to the https://github.com/watson-developer-cloud/car-dashboard ' +
    'README documentation on how to set these variables.');
}

var synthesizeParams = {
  text: '',
  accept: 'audio/wav',
  voice: 'en-US_AllisonVoice'
};


ibm_text_to_speech_receiver.onRead(function(msg){
    synthesisFile(msg.toString());
});

function synthesisFile(text) {
    synthesizeParams.text = text;
    // Pipe the synthesized text to a file.
    textToSpeech.synthesize(synthesizeParams).on('error', function(error) {
        console.log(error);
    }).pipe(fs.createWriteStream('Response_TTS.wav'));
    console.log('time TTS: ',time());

    ibm_audio_play_sender.write('true');
};

function time() {
    var d = new Date();
    var n = d.getTime();
    return n
}



/*
const getFileExtension = (acceptQuery) => {
  const accept = acceptQuery || '';
  switch (accept) {
    case 'audio/ogg;codecs=opus':
    case 'audio/ogg;codecs=vorbis':
      return 'ogg';
    case 'audio/wav':
      return 'wav';
    case 'audio/mpeg':
      return 'mpeg';
    case 'audio/webm':
      return 'webm';
    case 'audio/flac':
      return 'flac';
    default:
      return 'mp3';
  }
};

module.exports = function initTextToSpeechFileSynt(app) {
    app.get('/api/synthesize', (req, res, next) => {
        const transcript = authorizationService.synthesize(req.query);
        transcript.on('response', (response) => {
            if (req.query.download) {
                response.headers['content-disposition'] = `attachment; filename=transcript.${getFileExtension(req.query.accept)}`;
            }
        });
        transcript.on('error', next);
        transcript.pipe(res);
    });
};
module.exports = function initTextToSpeechFileVoices(app) {
    // Return the list of voices
    app.get('/api/voices', (req, res, next) => {
        authorizationService.voices(null, (error, voices) => {
            if (error) {
                return next(error);
            }
            return res.json(voices);
        });
    });
};
*/
