
var https = require('https');
var fs = require('fs');
var express = require('express');

var yarp = require('../yarp');


var options = {
    key: fs.readFileSync('./examples/https/conf/server.key'),
    cert: fs.readFileSync('./examples/https/conf/server.crt'),
    requestCert: false,
    rejectUnauthorized: false
};


var app = express();


app.use(express.static('node_modules'));
app.use(express.static('js'));
app.use(express.static('examples'));



app.get('/', function(req, res){
  res.sendFile('index.html',{ root : __dirname});
});


app.get('/yarp.js', function(req, res){
  res.sendfile('/yarp.js',{ root : __dirname});
});




var server = https.createServer(options, app).listen(3000, function(){
    console.log('listening on *:3000');
});

var io = require('socket.io')(server);


yarp.browserCommunicator(io);

module.exports = app;
