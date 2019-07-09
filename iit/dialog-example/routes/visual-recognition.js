'use strict';


var yarp = require('../../yarp');
var ibm_text_to_speech_receiver = new yarp.Port('image');
ibm_text_to_speech_receiver.open('/ibmjs/img:i');

var fs = require('fs');

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

var visualRecognition = new VisualRecognitionV3({
    version: '2018-03-19'
    //iam_apikey: 'X5s3NbXqbI7JkFZyODU-DHzx102PXKrU_A56CWxs6rnm'
  });

var images_file = fs.createReadStream('./fruitbowl.jpg');
var classifier_ids = ["food"];

var params = {
  images_file: images_file,
  classifier_ids: classifier_ids
};

visualRecognition.classify(params, function(err, response) {
  if (err)
    console.log(err);
  else
    console.log(JSON.stringify(response, null, 2))
});
