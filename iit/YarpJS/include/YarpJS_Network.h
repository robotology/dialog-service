


#ifndef YARPJS_NETWORK_H
#define YARPJS_NETWORK_H


#include <nan.h>
#include <yarp/os/Network.h>
#include "YarpJS_Wrapper.h"


class YarpJS_Network: public YarpJS_Wrapper<yarp::os::Network> {
private:
    static void setJSMethods(v8::Local<v8::FunctionTemplate> &tpl)
    {
        Nan::SetPrototypeMethod(tpl, "init", Network_Init);
        Nan::SetPrototypeMethod(tpl, "fini", Fini);
        Nan::SetPrototypeMethod(tpl, "connect", Connect);
        Nan::SetPrototypeMethod(tpl, "disconnect", Disconnect);
        Nan::SetPrototypeMethod(tpl, "list", List);
    }

public:
    explicit YarpJS_Network(const Nan::FunctionCallbackInfo<v8::Value> &info)
    {
        this->setYarpObj(new yarp::os::Network());
    }

    ~YarpJS_Network()
    {}

    static NAN_METHOD(Network_Init);
    static NAN_METHOD(Fini);
    static NAN_METHOD(Connect);
    static NAN_METHOD(Disconnect);
    static NAN_METHOD(List);


    // NAN Stuff
    YARPJS_INIT(YarpJS_Network,"Network",YarpJS)
};






#endif


