// Yarp-IBM requirements
var express = require('express'); // app server
var app = express();

var bodyParser = require('body-parser'); // parser for post requests
var watson = require('watson-developer-cloud'); // watson sdk

// Yarp requirements
var http = require('http').Server(app);
var io = require('socket.io')(http);
var yarp = require('../yarp');

// Yarp communication between service and browser
yarp.browserCommunicator(io);

// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder

app.use(express.static(__dirname + '/../node_modules'));
app.use(express.static(__dirname + '/../js'));
app.use(express.static(__dirname));

var port = process.env.PORT || process.env.VCAP_APP_PORT || 4000;
http.listen(port, function() {
  // eslint-disable-next-line
  console.log('Server running on port: %d', port);
});
