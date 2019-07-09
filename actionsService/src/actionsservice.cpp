
/////////////////////////////////////////////////////
///////////// R1 CLIENT FOR W4R1 ////////////////////
/////////////////////////////////////////////////////

/*
 * Copyright: (C) 2010 RobotCub Consortium
 * Authors: Giulia D'Angelo, Alessandro Faraotti
 * CopyPolicy: Released under the terms of the LGPLv2.1 or later, see LGPL.TXT
 */

#include <unistd.h>
#include <stdio.h>
#include <cstdlib>
#include <iostream>
#include <string>
#include <fstream>
#include <pthread.h>
#include <thread>

#include <yarp/os/Port.h>
#include <yarp/os/Network.h>
#include <yarp/dev/AudioGrabberInterfaces.h>
#include <yarp/dev/PolyDriver.h>

#include <yarp/os/Property.h>
#include <yarp/os/Time.h>
#include <yarp/os/TypedReaderCallback.h>
#include <yarp/sig/SoundFile.h>
#include <yarp/os/all.h>
#include <yarp/os/LogStream.h>

using namespace yarp::os;
using namespace yarp::sig;
using namespace yarp::dev;
using namespace std;


//CONSTANTS SHARED WITH R1 CLIENT
const char* DIRECTIONS ="directions";
const char* MOVE = "move";
const char* FACE_COLOR = "highlight";

const char* RESULT_DONE = "done";
const char* RESULT_ERROR = "error";

const char* PORT_ACTION_IN = "/behaviour/actions.i";
const char* PORT_ACTION_OUT = "/behaviour/actions.o";


/*****************************/
/*** R1 Specific Behaviour ***/
/*****************************/

const char* move(string place){
	yDebug() << "Moving to " << place;
	yarp::os::Time::delay(2.0);
    int i=0;
    yError() << "Not yer implemented";
    
    if(i==0) return RESULT_DONE;
    return RESULT_ERROR;
}

const char* provideDirections(string place){
	yDebug() << "Giving Directions to " << place;
	yarp::os::Time::delay(2.0);
    int i=0;
    if (place == "prelievi")          i=system("/home/r1-user/vodafone/pointLeft_left.sh");
   // else if (place == "segreteria")   i=system("/home/r1-user/vodafone/pointLeft_left.sh");
    else if (place == "ambulatorio")  i=system("/home/r1-user/vodafone/pointRight_right.sh");
    else {yError() << "invalid directions";return RESULT_ERROR;}
    yDebug() << "giving directions complete";
    if(i==0) return RESULT_DONE;
    return RESULT_ERROR;
}

const char* highlightPath(string color){
	yDebug() << "Highlighting path color "<< color;
	yarp::os::Time::delay(2.0);
    int i=0;
    if (color == "red" )         i=system("/home/r1-user/vodafone/red.sh");
    else if (color == "green" )  i=system("/home/r1-user/vodafone/green.sh");
    else if (color == "blue" )   i=system("/home/r1-user/vodafone/blue.sh");
    else {yError() << "invalid color";return RESULT_ERROR;}
        yDebug() << "highlight complete";
    if(i==0) return RESULT_DONE;
    return RESULT_ERROR;
	
}


/*****************************/



Bottle process(Bottle inMsg){
    /*
	char* action = NULL;
	char** params = NULL;


	std::string stra =  inMsg.get(0).asString();
	action = new char[stra.length() + 1];
	strcpy(action, stra.c_str());

	yDebug() << "Processing action: " <<  action;

	//pick paramteters
	size_t size = inMsg.size();

	yDebug() << "Parameters found: " <<  size;
	if(size>1) params = new char*[size-1];
	for(int i=1; i<size; i++){

		std::string str =  inMsg.get(i).asString();
		char *cstr = new char[str.length() + 1];
		strcpy(cstr, str.c_str());

		params[i-1] = cstr;
		yDebug() << params[i-1];
	}
    */
	std::string action =  inMsg.get(0).asString();
    if (action==DIRECTIONS)
    {
        string tmp = inMsg.get(1).asString(); //place
        std::string directions =  inMsg.get(2).asString();
        if (directions!="")
        {provideDirections(directions);}
        else
        {yError() << "invalid directions";}
    }
    else if (action==FACE_COLOR)
    {
        string tmp = inMsg.get(1).asString(); //color
        std::string highlight =  inMsg.get(2).asString();
        if (highlight!="")
        {highlightPath(highlight);}
        else
        {yError() << "invalid highlight";}
    }
    else if (action==MOVE)
    {
        yError() << "move action not yet implemented";
    }
    else
    {
        yError() << "invalid action" << action;
    }
    
    
	
	//IN THIS VERSION WILL BE USED
        //action 
	//params[1] (if not available a default value may be used or and error returned)
        //eg. action = directions; params[1] = bar;
	//eg. action = highlight; params[1] = red;
	//eg. action = move; params[1] = room_123


	yarp::os::Time::delay(2.0);
	const char* result = RESULT_DONE;  	
	Bottle bottle;
    	bottle.addString(result);
	return bottle;
}



int main(int argc, char* argv[]) {

    yDebug() << "*** Starting ACTION Service for R1 Client. ***";

    char name[30] = "/ctpservice/right_arm/rpc";

    // Open the network
    Network yarp;

    // Open rpc port arm movement
    RpcServer port;
    port.open(name);

    // Open Bottle ports 
    Port portOut;
    portOut.open(PORT_ACTION_OUT);



    // Open Bottle ports 
    Port portIn;
    portIn.open(PORT_ACTION_IN);

    while(true){
	//
	yarp::os::Time::delay(0.1);
	//
	Bottle inBottle,outBottle;
	portIn.read(inBottle); //showuld be blocking
	yDebug() << "received bottle:" << inBottle.toString();
	outBottle = process(inBottle);
	portOut.write(outBottle);
   }

    return 0;
}

