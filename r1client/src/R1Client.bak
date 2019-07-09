
/////////////////////////////////////////////////////
///////////// R1 CLIENT FOR W4R1 ////////////////////
/////////////////////////////////////////////////////

/*
 * Copyright: (C) 2010 RobotCub Consortium
 * Authors: Paul Fitzpatrick, Francesco Nori
 * CopyPolicy: Released under the terms of the LGPLv2.1 or later, see LGPL.TXT
 */

#include <stdio.h>
#include <yarp/dev/PolyDriver.h>
#include <yarp/dev/AudioGrabberInterfaces.h>
//#include <yarp/os/Property.h>
#include <yarp/os/Network.h>
#include <yarp/os/Port.h>
//#include <yarp/os/Time.h>
//#include <yarp/os/TypedReaderCallback.h>
//#include <yarp/sig/SoundFile.h>
//#include <string>
#include <iostream>
//#include <fstream>

///w4r1/sound.o
//using namespace std;
using namespace yarp::os;
using namespace yarp::sig;
using namespace yarp::dev;
#include <yarp/os/LogStream.h>


// The function we want to execute on the new thread.


/*void* SoundThread(void* port) {

	BufferPort<Sound>* soundPortIn =(BufferPort<Sound>*)port;
	//   long tid;
 	//  tid = (long)port;
	printf("Sound Reader Started.");
 	//  cout << "Sound Thread started";
	//

	//while(true){
	//printf("Sound Reader Started.");
	//}
			Sound *s_speech_out;
			while(true)
			{
					//printf("L");
           			s_speech_out = soundPortIn->read();
            		if (s_speech_out!=NULL)
					{
							printf("SOUND RECEIVED");
               			// put_receiver->renderSound(*s_speech_out);
  					}
			}

			//
 		//  pthread_exit(NULL);
}*/

//#include </home/gdangelo/workspace/yarp/example/portaudio/onread.h>
#include <thread>

int main(int argc, char *argv[]) {

	printf("STARTING R1 Client for W4R1");
	//cout << "STATIG R1";


	// Open the network
    Network yarp;

    // Open ports
    Port cmdPortOut;
    cmdPortOut.open("/r1/cmd.o");
    Port cmdPortIn;
    cmdPortIn.open("/r1/cmd.i");

    Port soundPortOut;
    soundPortOut.open("/r1/sound.o");



    // Ports connection
    std::thread th([]()
    {
		BufferedPort<Sound> soundPortIn;
		soundPortIn.open("/r1/sound.i");

        if(!Network::connect("/w4r1/sound.o","/r1/sound.i"))
        {
            return 0;
        }
		while(true)
		{
				//printf("L");
				auto s_speech_out = soundPortIn.read();
				if (s_speech_out)
				{
                        yDebug() << "SOUND RECEIVED";
				}
		}
    });
	Network::connect("/r1/cmd.o","/w4r1/cmd.i");
    //Network::connect("/r1/sound.o","/w4r1/sound.i","tcp");
    //Network::connect("/w4r1/sound.o","/r1/sound.i");
    //Network::connect("/w4r1/cmd.o","/r1/cmd.i");





/*

    //SENDER Get speech and send.
    // Set parameters
    Property conf_sender;
    int rec_seconds = 1;
    int channels=1;
    int rate= 2048;

    // Get a portaudio read device.
    conf_sender.put("device","portaudio");
    conf_sender.put("read", "");
    conf_sender.put("samples", rate*rec_seconds);
    conf_sender.put("rate", rate);
    conf_sender.put("channels", channels);
    PolyDriver poly_sender(conf_sender);
    IAudioGrabberSound *get_sender;

    poly_sender.view(get_sender);
    if (get_sender==NULL)
    {
        printf("cannot open interface\n");
        return 1;
    }


    //RECEIVER Get an audio write device.
    Property conf_receiver;
    conf_receiver.put("device","portaudio");
    conf_receiver.put("samples", "4096");
    conf_receiver.put("write", "1");
    PolyDriver poly_receiver(conf_receiver);
    IAudioRender *put_receiver;

    // Make sure we can write sound
    poly_receiver.view(put_receiver);
    if (put_receiver==NULL)
    {
        printf("cannot open interface\n");
        return 1;
    }

    //Grab and send
    Sound s_speech_in;
    double tTOT=0;
    //Receive and render
    Sound *s_speech_out;

*/




	//SOUND THREAD
	//pthread_t soundThread;
	void* status;
	printf("STARTING SOUND LISTENER");

//cout << "STATIG LISTENER";
	//pthread_create(&soundThread, NULL, SoundThread, (void *)&soundPortIn);
/*  */  	//pthread_join (*soundThread, &status);
	//

/*
    		Sound *s_speech_out;
           s_speech_out = soundPortIn.read(false);
            if (s_speech_out!=NULL){
		printf("SOUND RECEIVED");
               // put_receiver->renderSound(*s_speech_out);
  		}
*/



	Bottle msg;
    msg.addString("{ \"status\":\"conv_start\" }");
	cmdPortOut.write(msg);


   //	pthread_join (*soundThread, &status);

    while(true)
    {
        yarp::os::Time::delay(0.1);
    }
    /*while(true)
    {

printf(">>>");
        Bottle cmd;
        cmdPortIn.read(cmd);
//if(cmd)
printf("RECEIVED CMD");
//        std::string cmd_input = cmd.get(0).asString();

//        std::cout << "CMD IN: "<< cmd_input << std::endl;
 /*
	//SENDER
        if(cmd_input =="record")
        {
            get_sender->startRecording();

            double t1=yarp::os::Time::now();
            get_sender->getSound(s_speech_in);
            double t2=yarp::os::Time::now();
            tTOT = tTOT+(t2-t1);

            soundPortOut.write(s_speech_in);
            std::cout << "Uint8(0) " << (int) s_speech_in.getRawData()[0] << std::endl;

            std::cout << "Sending Speech Sound"<< std::endl;
            std::cout << "getChannel " << (int) s_speech_in.getChannels() << std::endl;

        }
        else if (cmd_input ==" stop recording")
        {
            Bottle msg_stop_record;
            msg_stop_record.addString("stop recording");
            cmdPortOut.write(msg_stop_record);

            get_sender->stopRecording();
        }


        //RECEIVER
        if(cmd_input =="speech")
        {
            //s_speech_out = soundPortIn.read(false);
            //if (s_speech_out!=NULL)
            //{
                put_receiver->renderSound(*s_speech_out);
            //}
        }
        else if (cmd_input =="stop_speaking") //aggiungere lo stop speaking
        {
            Bottle msg_speech;
            msg_speech.addString("stop speech");
            cmdPortOut.write(msg_speech);
        }
        yarp::os::Time::delay(0.01);
*/
    th.join();
    return 0;
}
