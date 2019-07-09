/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
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

'use strict';

var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');

var speechToText = new SpeechToTextV1({
  username: 'INSERT YOUR USERNAME FOR THE SERVICE HERE',
  password: 'INSERT YOUR PASSWORD FOR THE SERVICE HERE',
  url: 'https://stream.watsonplatform.net/speech-to-text/api/'
});

var params = {
// content_type: 'audio/wav'
  content_type: 'audio/mp3'
};

// create the stream
var recognizeStream = speechToText.createRecognizeStream(params);

// pipe in some audio
//fs.createReadStream(__dirname + '/resources/speech.wav').pipe(recognizeStream);
fs.createReadStream(__dirname + '/resources/HowAreYou.mp3').pipe(recognizeStream);

// and pipe out the transcription
recognizeStream.pipe(fs.createWriteStream('transcription.txt'));

// listen for 'data' events for just the final text
// listen for 'results' events to get the raw JSON with interim results, timings, etc.

recognizeStream.setEncoding('utf8'); // to get strings instead of Buffers from `data` events

['data', 'results', 'speaker_labels', 'error', 'close'].forEach(function(
  eventName
) {
  recognizeStream.on(
    eventName,
    console.log.bind(console, eventName + ' event: ')
  );
  });
