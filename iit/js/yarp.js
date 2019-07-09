


var yarp = (function yarp(){

    var socket = undefined;
    var _internal_port_manager = [];

    var initFunction = undefined;
    var yarpInitialized = false;

    function onInit(cb) {
        initFunction = cb;

        if(yarpInitialized)
            initFunction();
    }

    // initialize yarp witht the io socket
    function init(_socket) {

        socket = _socket;
      
        socket.on('yarp active ports', function(msg){
            _internal_port_manager = msg;
        });

        if(initFunction != undefined)
            initFunction();

        yarpInitialized = true;
    }



    var Network = {};

    Network.connect = function _connect(port_src,port_dst) {
        socket.emit('yarp connect',{port_src:port_src,port_dst:port_dst});
    }

    Network.disconnect = function _disconnect(port_src,port_dst) {
        socket.emit('yarp disconnect',{port_src:port_src,port_dst:port_dst});
    }





    // ------------ Ports 
    function Port(_port_type) {

        if( _port_type == undefined)
            _port_type = 'bottle';

        var port_type = _port_type;

        var port_name = undefined;
        var callback = Array();
        var callback_reply = Array();

        var open = function open(_port_name) {

            if(port_name != undefined || _internal_port_manager[_port_name] != undefined)
               return false;

            port_name = _port_name;
            socket.emit('yarp open port',{port_name:port_name,port_type:port_type});

            _internal_port_manager[port_name] = this;

            for(var i=0; i<callback.length; i++)
                _internal_port_manager[port_name].onRead(callback[i]);     

            for(var i=0; i<callback_reply.length; i++)
                _internal_port_manager[port_name].onReplyFromWrite(callback_reply[i]);            

            return true;
        }


        var close = function close(locally) {

            if(locally == undefined)
                locally = false;

            if(port_name)
            {
                socket.removeAllListeners('yarp ' + port_name + ' message');
                socket.removeAllListeners('yarp ' + port_name + ' reply');

                socket.emit('yarp close port',{port_name:port_name,locally:locally});
                port_name = undefined;
            }
        }

        var write = function write(message) {
            if(port_name)
                socket.emit('yarp ' + port_name + ' message', message);
        }

        var onRead = function onRead(cb,keepPreviousCBs) {

            if(!keepPreviousCBs)
            {
                for(var i=0; i<callback.length; i++)
                    socket.removeListener('yarp ' + port_name + ' message', callback[i]);

                callback = Array();
            }

            var tmpCb = function(msg){cb(msg);}
            callback.push(cb);
            socket.on('yarp ' + port_name + ' message', tmpCb);
            
        }

        var reply = function reply(message) {
            if(port_name)
                socket.emit('yarp ' + port_name + ' reply', message);
        }

        var Port = {
            open: open,
            close: close,
            write: write,
            onRead: onRead,
            reply: reply
        }

        if (port_type == 'rpc')
        {
            Port.onReplyFromWrite = function onReplyFromWrite(cb,keepPreviousCBs) {

                if(!keepPreviousCBs)
                {
                    for(var i=0; i<callback_reply.length; i++)
                        socket.removeListener('yarp ' + port_name + ' reply', callback_reply[i]);

                    callback_reply = Array();
                }

                var tmpCb = function(msg){cb(msg);};
                callback_reply.push(tmpCb);
                socket.on('yarp ' + port_name + ' reply', tmpCb);
            }

        }

        return Port;
    }


    var PortHandler = {

        openPort: function openPort(port_name,port_type) {
          if(_internal_port_manager[port_name] == undefined)
          {
            var p = new Port(port_type);
            if(!p.open(port_name))
              return undefined;
          }
          
          return _internal_port_manager[port_name];

        },

        getPort: function getPort(port_name) {
          return _internal_port_manager[port_name];
        }
    };



    // -----


    // ----- Speech Recognition Wrapper
    var SpeechRecognition;

    try {
        SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    }
    catch(err) {
        SpeechRecognition = undefined;
    }

    if(SpeechRecognition != undefined)
    {
        var Recognizer = new SpeechRecognition();
        var _Recognizer_autorestart = false;
        var _Recognizer_done = true;
        var _Recognizer_isrunning = false;

        Recognizer.enableAutorestart = function enableAutorestart(){_Recognizer_autorestart=true;}
        Recognizer.disableAutorestart = function disableAutorestart(){_Recognizer_autorestart=false;}


        Recognizer._stop = Recognizer.stop;
        Recognizer.stop = function() {
            _Recognizer_isrunning = false;
            _Recognizer_done = true;
            Recognizer._stop();
        }


        Recognizer._start = Recognizer.start;
        Recognizer.start = function() {

            _Recognizer_isrunning = true;
            _Recognizer_done = false;
            _Recognizer_start();

        }


        Recognizer.setLang = function setLang(lang) {
            Recognizer.lang = lang;

            if(_Recognizer_isrunning)
            {
                Recognizer.stop();
                Recognizer.start();
            }
        }

        function _Recognizer_start (){

            if(!_Recognizer_isrunning)
                return;


            if(_Recognizer_done && !_Recognizer_autorestart)
                return;

            setTimeout(function(){ _Recognizer_start() }, 300);
            try
            {
                Recognizer._start();     
            }
            catch(e)
            {
            }
        } 

        Recognizer.onerror = function(e){
            console.log('qui!');
            console.log(e);
            console.log(e.toString());
        }


        // Recognizer.onerror = function(event)
        // {
        //     console.log(event);
        // }

        Recognizer.setLang('en');
        
        Recognizer.onresult = function(event) {
            if (event.results.length > 0) {
                result = event.results[event.results.length-1];
                if(result.isFinal) {
                  
                    var speechEvent = new CustomEvent('yarp speech finished',{'detail':result});

                    Recognizer.dispatchEvent(speechEvent);

                    _Recognizer_done = true;
                }
            }  
        };

        // -----

        // ----- Speech Synthesis Wrapper

        var Synthetizer = {};
        Synthetizer = new SpeechSynthesisUtterance('');
        
        Synthetizer.speak = function(_text) {
            Synthetizer.text = _text;
            window.speechSynthesis.speak(Synthetizer);
        }

        Synthetizer.setLang = function(_lang) { Synthetizer.lang = _lang;}

    }
    else
    {
        Synthetizer = undefined;
        Recognizer = undefined;
    }   


    // ----- Image Display Utilities


    function getImageSrc(compression_type,image_buffer)
    {
        return 'data:image/'+compression_type+';base64,' + base64ArrayBuffer(image_buffer);
    }


    function base64ArrayBuffer(arrayBuffer) 
    {
        var base64    = ''
        var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

        var bytes         = new Uint8Array(arrayBuffer)
        var byteLength    = bytes.byteLength
        var byteRemainder = byteLength % 3
        var mainLength    = byteLength - byteRemainder

        var a, b, c, d
        var chunk

        // Main loop deals with bytes in chunks of 3
        for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
        d = chunk & 63               // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
        }

        // Deal with the remaining bytes and padding
        if (byteRemainder == 1) {
        chunk = bytes[mainLength]

        a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3)   << 4 // 3   = 2^2 - 1

        base64 += encodings[a] + encodings[b] + '=='
        } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

        a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

        base64 += encodings[a] + encodings[b] + encodings[c] + '='
        }

        return base64
    }


    // -----


    var yarp = {
        init: init,
        onInit: onInit,
        Network: Network,
        Port: Port,
        PortHandler: PortHandler,
        Recognizer: Recognizer,
        Synthetizer: Synthetizer,
        getImageSrc: getImageSrc
    };

    return yarp;


})();




