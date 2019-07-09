
/*////////////////////////////////////////////////////
/////////////YARP R1 SIMULATOR////////////////////////
////////////////////////////////////////////////////*/

/*
 * Copyright: (C) 2010 RobotCub Consortium
 * Authors: Paul Fitzpatrick, Francesco Nori
 * CopyPolicy: Released under the terms of the LGPLv2.1 or later, see LGPL.TXT
 */
#include <stdio.h>
#include <yarp/dev/PolyDriver.h>
#include <yarp/dev/AudioGrabberInterfaces.h>
#include <yarp/os/Property.h>
#include <yarp/os/Network.h>
#include <yarp/os/Port.h>
#include <yarp/os/Time.h>
#include <yarp/os/TypedReaderCallback.h>
#include <yarp/sig/SoundFile.h>
#include <string>
#include <iostream>
#include <fstream>

//#include </home/gdangelo/workspace/yarp/example/portaudio/onread.h>

using namespace yarp::os;
using namespace yarp::sig;
using namespace yarp::dev;

int main(int argc, char *argv[]) {

    // Open the network
    Network yarp;

    // Open ports
    Port cmdPortOut;
    cmdPortOut.open("/r1/cmd.o");
    Port cmdPortIn;
    cmdPortIn.open("/r1/cmd.i");

    Port soundPortOut;
    soundPortOut.open("/r1/sound.o");
    Port soundPortIn;
    soundPortIn.open("/r1/sound.i");

    // Ports connection
    Network::connect("/r1/cmd.o","/w4r1/cmd.i");
    Network::connect("/r1/sound.o","/w4r1/sound.i","tcp");
    Network::connect("/w4r1/sound.o","/r1/sound.i");


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



    while(true)
    {
        Bottle cmd;
        cmdPortIn.read(cmd);

        std::string cmd_input = cmd.get(0).asString();

        //SENDER
        if(cmd_input == "record")
        {
                start_recording();
        }
        else if (cmd_input == "stop_recording")
        {
                stop_recording();
        }


        //RECEIVER
        if(cmd_input == "speech")
        {
            //s_speech_out = soundPortIn.read(false);
            //if (s_speech_out!=NULL)
            //{
                    speech();
            //}
        }
        else if (cmd_input == "stop_speaking") //aggiungere lo stop speaking
        {
                    stop_speaking();
        }
        yarp::os::Time::delay(0.01);
    }
    return 0;
}

void start_recording()
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

void stop_recording()
{
    Bottle msg_stop_record;
    msg_stop_record.addString("stop_recording");
    cmdPortOut.write(msg_stop_record);

    get_sender->stopRecording();
}


void speech()
{
    put_receiver->renderSound(*s_speech_out);
}

void stop_speaking()
{
    Bottle msg_speech;
    msg_speech.addString("stop_speaking");
    cmdPortOut.write(msg_speech);
}
