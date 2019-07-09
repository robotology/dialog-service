


#ifndef YARP_JS_SOUND_H
#define YARP_JS_SOUND_H


#include <nan.h>
#include <string>

#include "YarpJS_Wrapper.h"
#include <yarp/sig/Sound.h>


class YarpJS_Sound: public YarpJS_Wrapper<yarp::sig::Sound>
{
private:
    static void setJSMethods(v8::Local<v8::FunctionTemplate> &tpl)
    {
        Nan::SetPrototypeMethod(tpl, "toBinary", ToBinary);
        Nan::SetPrototypeMethod(tpl, "fromBinary", FromBinary);
        Nan::SetPrototypeMethod(tpl, "getObjType", GetObjType);
        Nan::SetPrototypeMethod(tpl, "copy", Copy);
    }

public:

    explicit YarpJS_Sound(const Nan::FunctionCallbackInfo<v8::Value> &info)
    {
        this->setYarpObj(new yarp::sig::Sound());
    }


    explicit YarpJS_Sound(yarp::sig::Sound &sound)
    {
        this->setYarpObj(new yarp::sig::Sound(sound));
    }


    ~YarpJS_Sound()
    {}

    static NAN_METHOD(ToBinary);
    static NAN_METHOD(FromBinary);
    static NAN_METHOD(GetObjType);
    static NAN_METHOD(Copy);

    // NAN Stuff
    YARPJS_INIT(YarpJS_Sound,"Sound",YarpJS)
    
};






#endif


