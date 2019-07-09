
/////////////////////////////////////////////////////
///////////// R1 CLIENT FOR W4R1 ////////////////////
/////////////////////////////////////////////////////

/*
 * Copyright: (C) 2010 RobotCub Consortium & IBM Italia S.p.a
 * Authors: Giulia D'Angelo, Alessandro Faraotti
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
const char* ACTION_PARAMS = "action_params";
const char* NOTIFY_LISTEN = "listen";
const char* NOTIFY_SILENCE = "silence";

const char *SENDER_DEVICE = "";


struct r1_struct {
	bool listen;
	bool speaking;
};

struct w4r1_t_parameter{
char* name;
char* value;
w4r1_t_parameter* next;
};

/********** THREADS **********/

//SOUND SENDER THREAD
void* SoundSenderThread(void* args)
{
	if (SENDER_DEVICE == "external")
	{
		NetworkBase::connect("/audioRecorderWrapper/audio:o", "/w4r1/sound.i");
		while (true)
		{
			yarp::os::Time::delay(1.0);
		}
		int dummy =0;
		return &dummy;
	}
	
    sleep(3); //sleeps a bit (do not remove)
    yDebug() << "SENDER THREAD";
    r1_struct* r1Context = (r1_struct*)args;
 	
    Port soundPortOut;
    soundPortOut.open("/r1/sound.o");

    // Set parameters
    Property conf;
    int channels = 1;
    int rate = 16000;
    int samples = 16000;

    // Get a portaudio read device.
    conf.put("device",SENDER_DEVICE);
    conf.put("read", "1");
    conf.put("samples", 16000);
    conf.put("rate", 16000);
    conf.put("channels", 1); //total number of channels to broadcast
    conf.put("channel", 0);  //channel to be selected
    PolyDriver poly;
    poly.open(conf);
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
        get->getSound(s,0,16000,2);

	if(r1Context->listen && !(r1Context->speaking)){
		yDebug()<<"Sending audio";        	
		soundPortOut.write(s);
		}
        n++;
        double t2=yarp::os::Time::now();
        tTOT = tTOT+(t2-t1);
//        std::cerr << "tTOT: " << tTOT << std::endl;
    }

    get->stopRecording();  //stops recording.
}


//SOUND RECEIVER THREAD
void* SoundReceiverThread(void* args)   {
	yDebug() << "RECEIVER THREAD";
	r1_struct* r1Context = (r1_struct*)args;
	double last_time = yarp::os::Time::now();

   /*int rate = config.rate;
     int samples = config.samples;
     int channels = config.channels;
     bool wantRead = config.wantRead;
     bool wantWrite = config.wantWrite;
     int deviceNumber = config.deviceNumber;
    */
    
    //RECEIVER Get an audio write device.
    Property conf_receiver;
    conf_receiver.put("device","portaudioPlayer");
    conf_receiver.put("samples", 1600000 );
    conf_receiver.put("rate", 16000);
    conf_receiver.put("write", 1);
    conf_receiver.put("channels",1);
    PolyDriver poly_receiver(conf_receiver);
    IAudioRender *put_receiver;

    // Make sure we can write soundinit_receiver()
    poly_receiver.view(put_receiver);

	BufferedPort<Sound> soundPortIn;
	soundPortIn.setStrict();
	soundPortIn.open("/r1/sound.i");

    Port mouthPort;
    mouthPort.open("/r1/mouth:o");
    if(!Network::connect("/r1/mouth:o","/faceExpressionImage/rpc"))
    {
		yError() << "Failed connection";
            return 0;
    }
    
    if(!Network::connect("/w4r1/sound.o","/r1/sound.i"))
    {
		yError() << "Failed connection";
            return 0;
    }

	yarp::dev::AudioBufferSize bufsize; 
    while(true)
    {
	   int pr=	soundPortIn.getPendingReads();
	   if (soundPortIn.getPendingReads()>0)
	   {
		   yDebug() << "Pending reads in buffer" <<pr;
			yDebug()<< "spaking";
			r1Context->speaking =true;
			Bottle b;
			b.addString("tstart");
			mouthPort.write(b);
	   }
	   else {
           /*
			////TODO MOVE FOLLOWING BLOCK WITHIN PENDING PLAYBACK BUFFER CHECK
			if(r1Context->listen && r1Context->speaking){
				r1Context->speaking =false;
				yDebug() << "End speaking";
			}
			///
*/
		}
	   Sound* s_speech_out = soundPortIn.read(false);
	   
	   if (s_speech_out)
       {   
		   yDebug() << "received sound of "<< s_speech_out->getSamples() ;
           put_receiver->renderSound(*s_speech_out);
	   }
	   yarp::os::Time::delay(0.05);
	   #if 1
            put_receiver->getPlaybackAudioBufferCurrentSize(bufsize);
            if (yarp::os::Time::now() - last_time >2.0)
            {
				last_time= yarp::os::Time::now();
				yDebug() << "playback buffer size" <<  bufsize.getSamples();
			}
		 //  yDebug() << "buffer->" << bufsize.getSamples();
           if (bufsize.getSamples()==0)
			{
        ////TODO MOVE FOLLOWING BLOCK WITHIN PENDING PLAYBACK BUFFER CHECK
                if(r1Context->listen && r1Context->speaking)
                {
                    r1Context->speaking =false;
                    yDebug() << "End speaking";
                    Bottle b;
                    b.addString("tstop");
                    mouthPort.write(b);
                }
                else
                {
				//	yDebug()<< "Buffer empty, but not end speaking";
				}
            }
	   #endif
    }
}



//BEHAVIOUR RESULT RECEIVER THREAD
void* BehaviourReceiverThread(void* args)   {
	Port behaviourPortIn;
    	behaviourPortIn.open("/r1/behaviour.i");
	sleep(0.5);

	Port cmdPortOut;
    	cmdPortOut.open("/r1/cmdbehaviour.o");
   
	Network::connect("/behaviour/actions.o","/r1/behaviour.i");
    	Network::connect("/r1/cmdbehaviour.o","/w4r1/cmd.i");

	//LOOP
	//MAIN LOOP holding several conversations
  	
    	while(true)
        {
        	yarp::os::Time::delay(0.1);
			Bottle bb;
			behaviourPortIn.read(bb);

		//changed Giulia
        	std::string bb_input = bb.get(0).asString();
		const char* string_input = bb_input.c_str();

        	std::cout << "behaviour recevied: "<< string_input << std::endl;
		
		if(
			strcmp((const char*)string_input ,"error")==0
			){
			
			Bottle msg;
    			msg.addString("{ \"status\":\"action_completed\",\"action_status\":\"error\" }");
			cmdPortOut.write(msg);
		}
		else {
			Bottle msg;
    			msg.addString("{ \"status\":\"action_completed\",\"action_status\":\"done\" }");
			cmdPortOut.write(msg);
		}
    	
	}//END MAIN LOOP

}

//END TRHEADS
/*******************************************************************************************************/



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

void startMic(r1_struct* r1Context){
	yDebug() << "start mic"; 
	r1Context->listen = true;
}

void stopMic(r1_struct* r1Context){
	yDebug() << "stop mic";
	r1Context->listen = false;
}



int processCommand(const char* command,char** answer,Port* behaviourPortOut,r1_struct* r1Context){
	int  out = 0;


	char * c = unescape(command,'"');
	yDebug() << "Processing cmd" << command << "=>" << c;
	Document document;
	document.Parse(c);
	//yDebug() << "is ok:" << document.IsObject();

	if(document.HasMember(NOTIFY)){
		const char* notify = document[NOTIFY].GetString();
		yDebug() << NOTIFY << notify;
		if(strcmp(notify, NOTIFY_LISTEN)==0){
			startMic(r1Context);
		} else
		if(strcmp(notify, NOTIFY_SILENCE)==0){
			stopMic(r1Context);
		}
	}

	if(document.HasMember(ACTION)){
		yDebug() << "Action found";
		const char* action = document[ACTION].GetString();
		
		//yDebug() << ACTION << action;
		w4r1_t_parameter*  paramList = NULL;
		w4r1_t_parameter* p = NULL;
		 
		if(document.HasMember(ACTION_PARAMS))  {
			yDebug() << "PARAMS FOUND...";	//TODO READ PARAMETERS HERE
			auto& params = document[ACTION_PARAMS];
			if(params.IsObject()){
				yDebug() << "IS OJBECT OK";
				for(auto& par: params.GetObject()){
					if(par.value.IsString()){
						if(paramList == NULL){ paramList = new w4r1_t_parameter; p = paramList;}
						else { p->next= new w4r1_t_parameter;  p=p->next;}
						
						p->name = strdup(par.name.GetString());
						p->value = strdup(par.value.GetString());
						p->next = NULL;
						printf("PARAMETRO: %s : %s\n",p->name,p->value);
					}
				}
			}

			
		}
		
		/*
		for (auto& m : document.GetObject())
		    printf("Type of member %s is %s\n",
			m.name.GetString(), kTypeNames[m.value.GetType()]);
		*/

		//	yDebug() << "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII " << document.IsObject(ACTION_PARAMS);
		//{
		//	 rapidjson::Value& params = document[ACTION_PARAMS];
		//	out = executeAction(action,params,answer);
		//}else
		//	out = executeAction(action,answer);
	
		/////////////////
		yDebug() << "Performing action:" << action;
		Bottle bottle;
		bottle.addString(action);
		w4r1_t_parameter* pr =paramList;
		while(pr){

			yDebug() << "Adding parameter name:" << pr->name;
			bottle.addString(pr->name);		

			yDebug() << "Adding parameter value:" << pr->value;
			bottle.addString(pr->value);
			pr=pr->next;
		}
		behaviourPortOut->write(bottle);

		//
		yDebug()<<"clean param list";
		w4r1_t_parameter* pd = paramList;
		w4r1_t_parameter* pdd = pd;
		while(pd){

		pd = pdd->next;
		delete pdd->name;
		delete pdd->value;
		delete pdd;
		} 

		//*result = NULL;
			
		/////////////////

	}
	return out;
}


/* //sample code for mutex
   pthread_mutex_t mutex;
   pthread_mutex_lock(&mutex);
   flag=1;
   pthread_mutex_unlock (&mutex);
*/



/***********************************************************/
/*************** MAIN **************************************/
/***********************************************************/

int main(int argc, char* argv[]) {
	yDebug() << "*** STARTING R1 Client for W4R1. ***";

	//Init R1 Context
	r1_struct* r1Context = new r1_struct;
	r1Context -> listen = false;
	r1Context -> speaking = false;

   
	//Select input device according args.
    	if (argc > 1)
    	{
        	if(strcmp(argv[1],"PC")==0){ SENDER_DEVICE = "portaudioRecorder"; }
		    else if(strcmp(argv[1],"R1")==0){ SENDER_DEVICE = "r1face_mic"; }
		    else if(strcmp(argv[1],"EXT")==0){ SENDER_DEVICE = "external"; }
       		else { printf("Wrong argument %s, use either PC or R1",argv[1]); exit(-1);}    
    	}   
    	else SENDER_DEVICE = "r1face_mic"; //defaulting to R1 
    	printf("Using input device %s\n",SENDER_DEVICE);
    	//

	// Open the network
    	Network yarp;

	// Open ports
	Port cmdPortOut;
	cmdPortOut.open("/r1/cmd.o");
	Port cmdPortIn;
	cmdPortIn.open("/r1/cmd.i");

	Port behaviourPortOut;
	behaviourPortOut.open("/r1/behaviour.o");

	//Spleeps a bit to allow ports to start
	sleep(0.5);

	//Conncet to W4R1
    	Network::connect("/r1/cmd.o","/w4r1/cmd.i");
    	Network::connect("/w4r1/cmd.o","/r1/cmd.i");

	//Connect to onboard behaviour service
    	Network::connect("/r1/behaviour.o","/behaviour/actions.i");


	//BEHAVIOUR RECEIVER THREAD
	yDebug() << "Starting BehaviourReceiverThread";
	pthread_t behaviourReceiverThread;
	void* status_behaviour;
	pthread_create(&behaviourReceiverThread, NULL, BehaviourReceiverThread, NULL);

    	//SOUND THREAD SENDER
	
	yDebug() << "Starting Sound Recorder";
	pthread_t soundSenderThread;
	void* status_recorder;
	pthread_create(&soundSenderThread, NULL, SoundSenderThread, (void*)r1Context);

	//SOUND THREAD RECEIVER
	yDebug() << "Starting Sound Listener";
	pthread_t soundReceiverThread;
	void* status;
	pthread_create(&soundReceiverThread, NULL, SoundReceiverThread, (void*)r1Context);
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
			processCommand(cmd_input.c_str(),&answer,&behaviourPortOut,r1Context);
			/* if(answer){
				Bottle bottleAnswer;
    				bottleAnswer.addString(answer);
				cmdPortOut.write(bottleAnswer);
			} */
    		}
	}//END MAIN LOOP

	//Wait for threads to join
	pthread_join (soundSenderThread, &status_recorder);
    	pthread_join (soundReceiverThread, &status);
	pthread_join (behaviourReceiverThread,&status_behaviour);
	
	return 0;
} //END MAIN
