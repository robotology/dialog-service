var yarp = require('../yarp');
var ibm_img_receiver= new yarp.Port('image');
ibm_img_receiver.open('/ibmjs/img:i');

var ibm_visual_text_sender= new yarp.Port('bottle');
ibm_visual_text_sender.open('/ibmjs/visual_text_sender:o');

//CONNECTION WITH CONVERSATION
yarp.Network.connect("/ibmjs/visual_text_sender:o","/ibmjs/text:i");

var fs=require('fs');
var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

var visualRecognition = new VisualRecognitionV3({
    version: '2018-03-19',
    iam_apikey: 'X5s3NbXqbI7JkFZyODU-DHzx102PXKrU_A56CWxs6rnm'
  });


var bmp = require("bmp-js");
var rcvd = false;


//Use default classifier
var image_file = fs.createReadStream('./Red_Img_Ticket.bmp');

print_media=false;
cardiograph=false;

//code without sending image through port

var params = {
  images_file: image_file,
  //classifier_ids: classifier_ids
};


visualRecognition.classify(params, function(err, response) {
  if (err)
    console.log(err);
  else
    //console.log(JSON.stringify(response, null, 2))
    console.log(response.images[0].classifiers[0].classes);

    for(var j = 0; j < response.images[0].classifiers[0].classes.length; j++ )
    {
        if (response.images[0].classifiers[0].classes[j].class='print media')
        {
            print_media=true;
        }

        if (response.images[0].classifiers[0].classes[j].class='cardiograph')
        {
            cardiograph=true;
        }
    }

    if(print_media==true && cardiograph==true)
    {ibm_visual_text_sender.write('prescription');};
});


//code sending image through port
//ibm_img_receiver.onRead(function(msg)
//{
//    if (!rcvd)
//    {
//        console.log(msg);
//        console.log(msg.toSend());
//
//        const img_file=fs.createWriteStream('image.bmp');
//        var buffer = msg.toSend().buffer;
//        img_file.write(buffer);
//
//        rcvd = true;
//
//        var img = fs.createReadStream('./image.bmp');
//        var params = {
//          images_file: img,
//          //classifier_ids: classifier_ids
//        };
//
//        visualRecognition.classify(params, function(err, response) {
//          if (err)
//            console.log(err);
//          else
//            console.log(JSON.stringify(response, null, 2))
//        });
//    }
//});



//classifiers
//Create classifiers
//var params_classifier = {
//  name: 'medical ticket',
//  Red_Img_Ticket_positive_examples: fs.createReadStream('./Red_Img_Ticket.bmp'),
//  White_Img_Ticket_positive_examples: fs.createReadStream('./White_Img_Ticket.bmp') //they were using a zip folder
//};
//
//visualRecognition.createClassifier(params_classifier,
//  function (err, response_classifier) {
//    if (err)
//      console.log(err);
//    else
//      console.log(JSON.stringify(response_classifier, null, 2))
//  });
