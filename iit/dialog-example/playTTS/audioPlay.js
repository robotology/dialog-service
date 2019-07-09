var yarp = require('../../yarp');
var ibm_audio_play_receiver = new yarp.Port('bottle');
ibm_audio_play_receiver.open('/ibmjs/audio_play:i');


var player = require('play-sound')(opts = {})

ibm_audio_play_receiver.onRead(function(msg){

    setTimeout(function() {

    player.play('../Response_TTS.wav', function(err){
  	if (err) throw err
        })

    }, 1500);


});
