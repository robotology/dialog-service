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

var yarp = require('../../yarp');
var ibm_text_port_receiver = new yarp.Port('bottle');
ibm_text_port_receiver.open('/ibmjs/text:i');

var ibm_text_port_sender = new yarp.Port('bottle');
ibm_text_port_sender.open('/ibmjs/text:o');

var ibm_R1_img_request= new yarp.Port('bottle');
ibm_R1_img_request.open('/ibmjs/ibm_R1_img_request:o');



//CONNECTION WITH CONVERSATION
yarp.Network.connect('/ibmjs/text:o', '/ibmjs/text_to_speech:i');

var AssistantV1 = require('watson-developer-cloud/assistant/v1');

// Set up Assistant service wrapper.
//var conversation = new AssistantV1({
//  username: '889ac465-58a9-4a37-8731-5c3e2954f822', // replace with service username
//  password: 'YRWSxUmWmp2o', // replace with service password
//  version: '2018-02-16'
//});
//var b = Yarp.Bottle();

const conversation = new AssistantV1({
  username: process.env.ASSISTANT_USERNAME || '889ac465-58a9-4a37-8731-5c3e2954f822',
  password: process.env.ASSISTANT_PASSWORD || 'YRWSxUmWmp2o',
  version: '2018-02-16'
});

var workspace_id = '17c67878-e1ed-4206-a42e-0098751b47f0'; // replace with workspace ID
var response_=null;
var user_input=null;
var flag='flag';

// Start conversation with empty message.
conversation.message({
    workspace_id: process.env.WORKSPACE_ID || '17c67878-e1ed-4206-a42e-0098751b47f0'
}, processResponse);

// Message from user
ibm_text_port_receiver.onRead(function(msg){
    var user_input=msg.toString();
    console.log('Message from Yarp: ',msg.toString());

    conversation.message({
      workspace_id: workspace_id,
      input: { text: user_input },
      // Send back the context to maintain state.
      context : response_.context,
    }, processResponse)

});


// Process the service response.
function processResponse(err, response) {
  if (err) {
    console.error(err); // something went wrong
    return;
  }

  var endConversation = false;
  response_=response;
  // Check for action flags.
  if (response.output.action === 'display_time') {
    // User asked what time it is, so we output the local system time.
    console.log('The current time is ' + new Date().toLocaleTimeString() + '.');
  } else if (response.output.action === 'end_conversation') {
    // User said goodbye, so we're done.
    console.log(response.output.text[0]);
    endConversation = true;
    response_=null;
  } else {
    // Display the output from dialog, if any.
    if (response.output.text.length != 0) {
        console.log(response.output.text[0]);

        ibm_text_port_sender.write(response.output.text[0]);

        if(response.output.text[0]=='Perfect, your prescription is valid!. Please go to the waiting room, we will call you. Do you still need my help ?')
        {console.log('Giulia');}
        //{ibm_R1_img_request.write('Request image');}
    }
  }
}



/*
 * Updates the response text using the intent confidence
 * @param  {Object} input The request to the Conversation service
 * @param  {Object} response The response from the Conversation service
 * @return {Object}          The response with the updated message
 */

/*

module.exports = function(app) {

  app.post('/api/message', (req, res, next) => {
        console.log('qui');
    const workspace = process.env.WORKSPACE_ID || '<workspace-id>';
    if (!workspace || workspace === '<workspace-id>') {
      return res.json({
        output: {
          text: 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' +
            '<a href="https://github.com/watson-developer-cloud/conversation-simple">README</a> ' +
            'documentation on how to set this variable. <br>' +
            'Once a workspace has been defined the intents may be imported from ' +
            '<a href="https://github.com/watson-developer-cloud/conversation-simple/blob/master/training/car_workspace.json">here</a> ' +
            'in order to get a working application.'
        }
      });
    }
    const payload = {
      workspace_id: workspace,
      context: req.body.context || {},
      input: user_input || {}
      //input: req.body.input || {}
    };

    console.log(payload);

    // Send the input to the conversation service
    conversation.message(payload, (error, data) => {
      if (error) {
        return next(error);
      }
      console.log('response', res.json(updateMessage(payload, data)));
      return res.json(updateMessage(payload, data));
    });
  });
};


const updateMessage = (input, response) => {
  var responseText = null;
  if (!response.output) {
    response.output = {};
  } else {
    return response;
  }
  if (response.intents && response.intents[0]) {
    var intent = response.intents[0];
    // Depending on the confidence of the response the app can return different messages.
    // The confidence will vary depending on how well the system is trained. The service will always try to assign
    // a class/intent to the input. If the confidence is low, then it suggests the service is unsure of the
    // user's intent . In these cases it is usually best to return a disambiguation message
    // ('I did not understand your intent, please rephrase your question', etc..)
    if (intent.confidence >= 0.75) {
      responseText = 'I understood your intent was ' + intent.intent;
    } else if (intent.confidence >= 0.5) {
      responseText = 'I think your intent was ' + intent.intent;
    } else {
      responseText = 'I did not understand your intent';
    }
  }
  response.output.text = responseText;
  console.log('response text: ',responseText);
  return response;
};
*/
