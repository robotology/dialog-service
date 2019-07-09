
/* 
Main module called by the Native Abstractions for Node.js (NAN) Library. 
It registers modules created for yarp.js (mainly bindings for yarp objects
e.g. Ports, Network etc.)

Just add the header calling to the corresponding class implementing the 
binding and perform a "init" call from within the NAN_MODULE_INIT (see 
below for previous classes).
*/




#include "YarpJS.h"

#include "YarpJS_Network.h"

#include "YarpJS_Bottle.h"
#include "YarpJS_Image.h"
#include "YarpJS_Sound.h"

#include "YarpJS_RPCPort.h"

#include "YarpJS_BufferedPort_Bottle.h"
#include "YarpJS_BufferedPort_Image.h"
#include "YarpJS_BufferedPort_Sound.h"





NAN_MODULE_INIT(InitAll) {
    YarpJS::Init(target);

    YarpJS_Network::Init(target);

    YarpJS_Bottle::Init(target);
    YarpJS_Image::Init(target);
    YarpJS_Sound::Init(target);

    YarpJS_RPCPort::Init(target);

    YarpJS_BufferedPort_Bottle::Init(target);
    YarpJS_BufferedPort_Image::Init(target);
    YarpJS_BufferedPort_Sound::Init(target);


}

NODE_MODULE(yarp, InitAll)
