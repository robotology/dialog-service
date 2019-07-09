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

const express = require('express');   //basic routing methods
const app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var yarp = require('../yarp');

// Yarp communication between service and browser
yarp.browserCommunicator(io);

// Bootstrap application settings
app.use(express.static('./ui')); // load UI from public folder

app.use(express.static(__dirname + '/../node_modules'));
app.use(express.static(__dirname + '/../js'));
app.use(express.static(__dirname));


//require('./routes/speech-to-text')(app);

require('./routes/speech-to-text-file');
//require('./routes/speech-to-text-file')(app);

//require('./routes/text-to-speech');
//require('./routes/text-to-speech')(app);

require('./routes/text-to-speech-file');

//require('./routes/visual-recognition');

// Configure the Watson services
require('./routes/conversation');
//require('./routes/conversation')(app);


// Bootstrap application settings
require('./config/express')(app);
// error-handler settings
require('./config/error-handler')(app);


var port = process.env.PORT || process.env.VCAP_APP_PORT || 5000;

http.listen(port, function() {
  // eslint-disable-next-line
  console.log('Server running on port: %d', port);
});


module.exports = app;
