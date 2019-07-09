/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const watson = require('watson-developer-cloud');
//const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');

const authorizationService = new watson.AuthorizationV1({
//const textToSpeech = new TextToSpeechV1({
  // If unspecified here, the TEXT_TO_SPEECH_USERNAME and
  // TEXT_TO_SPEECH_PASSWORD env properties will be checked
  // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
  // username: '<username>',
  // password: '<password>',

    username: process.env.TEXT_TO_SPEECH_USERNAME || 'bb04049c-7fc1-42a0-9d4f-c656f9c6bfb7',
    password: process.env.TEXT_TO_SPEECH_PASSWORD || '5M6WuwsfmHme',
    url: watson.TextToSpeechV1.URL

});

// Inform user that TTS is not configured properly or at all
if (!(process.env.TEXT_TO_SPEECH_USERNAME && process.env.TEXT_TO_SPEECH_PASSWORD)) {
  // eslint-disable-next-line
  console.warn('WARNING: The app has not been configured with a TEXT_TO_SPEECH_USERNAME and/or ' +
    'a TEXT_TO_SPEECH_PASSWORD environment variable. If you wish to have text to speech ' +
    'in your working application, please refer to the https://github.com/watson-developer-cloud/car-dashboard ' +
    'README documentation on how to set these variables.');
}


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
