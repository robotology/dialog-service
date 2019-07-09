
/////////////////////////////////////////////////////
///////////// R1 CLIENT FOR W4R1 ////////////////////
/////////////////////////////////////////////////////

/*
 * Copyright: (C) 2010 RobotCub Consortium
 * Authors: Paul Fitzpatrick, Francesco Nori
 * CopyPolicy: Released under the terms of the LGPLv2.1 or later, see LGPL.TXT
 */

#include <unistd.h>
#include <stdio.h>
#include <iostream>
#include <string>
#include <fstream>
#include<pthread.h>
#include <thread>

#include <yarp/os/Port.h>
#include <yarp/os/Network.h>
#include <yarp/dev/AudioGrabberInterfaces.h>
#include <yarp/dev/PolyDriver.h>

#include <yarp/os/Property.h>
#include <yarp/os/Time.h>
#include <yarp/os/TypedReaderCallback.h>
#include <yarp/sig/SoundFile.h>

#include <yarp/os/LogStream.h>
#include "rapidjson/document.h"
using namespace rapidjson;
using namespace yarp::os;
using namespace yarp::sig;
using namespace yarp::dev;

const char* NOTIFY = "notify";
const char* ACTION = "action";
const char* ACTION_PARAMS = "acrion_params";
const char* NOTIFY_LISTEN = "listen";
const char* NOTIFY_SILENCE = "silence";

char * SENDER_DEVICE = "";

/*** THREADS ***/
void* SoundSenderThread(void* args)   {
    sleep(10);
    yDebug() << "Starting SENDER THREAD";
	Port soundPortOut;
    soundPortOut.open("/r1/sound.o");

    // Set parameters
    Property conf;
    int channels = 1;
    int rate = 16000;
    int samples = 16000;

    // Get a portaudio read device.
    conf.put("device",SENDER_DEVICE);
    conf.put("read", "");
    conf.put("samples", 44100);
    conf.put("rate", 44100);
    conf.put("channels", 1);
    PolyDriver poly(conf);
    IAudioGrabberSound *get;

    // Make sure we can read sound
    poly.view(get);
    Sound s;
   

    NetworkBase::connect("/r1/sound.o", "/w4r1/sound.i");
 get->startRecording(); //this is optional, the first get->getsound() will do this anyway.
    double tTOT=0;
    int n=0;

    while (true)
    {
        double t1=yarp::os::Time::now();
       // yarp::os::Time::delay(0.90);
        get->getSound(s);
        std::cout << "Primo bit: " << (int) s.getRawData()[0] << std::endl;
        std::cout << "Size Array: " << (int) s.getRawDataSize() << std::endl;
        std::cout << "n: " << n << std::endl;
        soundPortOut.write(s);
        n++;
        double t2=yarp::os::Time::now();
        tTOT = tTOT+(t2-t1);
        std::cout << "tTOT: " << tTOT << std::endl;
    }


    get->stopRecording();  //stops recording.
}


void* SoundReceiverThread(void* args)   {
 /*int rate = config.rate;
     int samples = config.samples;
     int channels = config.channels;
     bool wantRead = config.wantRead;
     bool wantWrite = config.wantWrite;
  int deviceNumber = config.deviceNumber;*/
	//RECEIVER Get an audio write device.
    Property conf_receiver;
    conf_receiver.put("device","portaudio");
   // conf_receiver.put("samples", "2048");
    conf_receiver.put("rate", "16000");
    conf_receiver.put("write", "1");
    conf_receiver.put("channels","1");
    PolyDriver poly_receiver(conf_receiver);
    IAudioRender *put_receiver;

    // Make sure we can write soundinit_receiver()
    poly_receiver.view(put_receiver);

	BufferedPort<Sound> soundPortIn;
soundPortIn.setStrict();
	soundPortIn.open("/r1/sound.i");


    if(!Network::connect("/w4r1/sound.o","/r1/sound.i"))
    {
            return 0;
    }

	while(true)
    {
		Sound* s_speech_out = soundPortIn.read();
		if (s_speech_out)
        {
            yDebug() << "SOUND RECEIVED: " << s_speech_out->getRawDataSize() << "=>" << s_speech_out->getRawData()[0] ;
			put_receiver->renderSound(*s_speech_out);
		}
	}
}

/** END TRHEADS **/
char* unescape(const char* s,char quote){ //remove each second occurence of quote
        char *unescapedS = new char[strlen(s)*sizeof(char)];
        int i, j;
        for(i = j = 0; i < (strlen(s)); i++)
		{
                unescapedS[j]=s[i];
                if(s[i] == quote)
				{
                        if(s[i+1]==quote) {i++; }
                }
                j++;
        }
		unescapedS[j]='\0';
        return unescapedS;
}

void startMic(){
	yDebug() << "start mic";
}
void stopMic(){
	yDebug() << "stop mic";
}


int executeAction(const char* action, rapidjson::Value& params, char** result){
	//switch action ...
	yDebug() << "Performing action" << action;
	*result = NULL;
	return 0;
}

int executeAction(const char* action, char** result){
	yDebug() << "Performing action (1)" << action;
	return 0;
}

int processCommand(const char* command,char** answer){
	char * c = unescape(command,'"');
	int  out = 0;
	yDebug() << "Processing cmd" << command << "=>" << c;
	Document document;
	document.Parse(c);

	//yDebug() << "is obk" << document.IsObject();
	if(document.HasMember(NOTIFY)){
		const char* notify = document[NOTIFY].GetString();
		yDebug() << NOTIFY << notify;
		if(strcmp(notify, NOTIFY_LISTEN)==0){
			startMic();
		} else
		if(strcmp(notify, NOTIFY_SILENCE)==0){
			stopMic();
		}
	}

	if(document.HasMember(ACTION)){
		const char* action = document[ACTION].GetString();
		 yDebug() << ACTION << action;
		//int status = -1;
		if(document.HasMember(ACTION_PARAMS)){
			 rapidjson::Value& params = document[ACTION_PARAMS];
			out = executeAction(action,params,answer);
		}else
			out = executeAction(action,answer);
	}
	return out;

}

/*
pthread_mutex_t mutex;
pthread_mutex_lock(&mutex);
flag=1;
pthread_mutex_unlock (&mutex);
*/

int main(int argc, char* argv[]) {
    
    if (argc > 1)
    {
        printf("ARGC %d",argc);
        
    //    if(strcmp(argv[0],"PC")==0)
    //    {
            SENDER_DEVICE = "portaudio";
    //    }
    }   
    else 
    {
        SENDER_DEVICE = "r1face_mic";
    }
    
    
    
	yDebug() << "*** STARTING R1 Client for W4R1. ***";

	// Open the network
    Network yarp;

    // Open ports
    Port cmdPortOut;
    cmdPortOut.open("/r1/cmd.o");
    Port cmdPortIn;
    cmdPortIn.open("/r1/cmd.i");

	sleep(0.5);

	Network::connect("/r1/cmd.o","/w4r1/cmd.i");
    Network::connect("/w4r1/cmd.o","/r1/cmd.i");
    //Network::connect("/r1/sound.o","/w4r1/sound.i","tcp");
    //Network::connect("/w4r1/sound.o","/r1/sound.i");

    //SOUND THREAD SENDER
	yDebug() << "Starting Sound Recorder";
	pthread_t soundSenderThread;
	void* status_recorder;
	pthread_create(&soundSenderThread, NULL, SoundSenderThread, NULL);


	//SOUND THREAD RECEIVER
	yDebug() << "Starting Sound Listener";
	pthread_t soundReceiverThread;
	void* status;
	pthread_create(&soundReceiverThread, NULL, SoundReceiverThread, NULL);
  	//pthread_join (soundReceiverThread, &status);

	//MAIN LOOP holding several conversations
    bool shutdown = false;
	yDebug() << "Entering main loop.";
	while(!shutdown)
    {
		//TODO wait here for converstation start
		//Send start convesation
		yDebug() << "New Conversation";
		Bottle msg;
    	msg.addString("{ \"status\":\"conv_start\" }");
		cmdPortOut.write(msg);
		//cmd handler (it could be another theread runnging)
    	while(true)
        {
        	yarp::os::Time::delay(0.1);
			Bottle cmd;
			cmdPortIn.read(cmd);
        	std::string cmd_input = cmd.get(0).asString();
        	std::cout << "CMD IN: "<< cmd_input << std::endl;
			char* answer = NULL;
			processCommand(cmd_input.c_str(),&answer);
			if(answer)
            {
				Bottle bottleAnswer;
    			bottleAnswer.addString(answer);
				cmdPortOut.write(bottleAnswer);
			}
    	}
	}//END MAIN LOOP
	pthread_join (soundSenderThread, &status_recorder);
    pthread_join (soundReceiverThread, &status);
	return 0;
}
