
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
void* (void* args)   {

}

int main(int argc, char* argv[]) {

    yDebug() << "*** STARTING R1 Client for W4R1. ***";

    // Open the network
    Network yarp;


    return 0;
}
