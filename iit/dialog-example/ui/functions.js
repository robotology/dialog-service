

    var u32ToArray = function(i) {
        return [i&0xFF, (i>>8)&0xFF, (i>>16)&0xFF, (i>>24)&0xFF];
    };

    var u16ToArray = function(i) {
        return [i&0xFF, (i>>8)&0xFF];
    };

    var split16bitArray = function(data) {
        var r = [];
        var j = 0;
        var len = data.length;
        for (var i=0; i<len; i++) {
            r[j++] = data[i] & 0xFF;
            r[j++] = (data[i]>>8) & 0xFF;
        }
        return r;
    };


    function getData(buffer, sampleRate, bitsPerSample = 16) {
        var data = buffer;
        var sampleRate = sampleRate;

        var header = {                            // OFFS SIZE NOTES
            chunkId      : [0x52,0x49,0x46,0x46], // 0    4    "RIFF" = 0x52494646
            chunkSize    : 0,                     // 4    4    36+SubChunk2Size = 4+(8+SubChunk1Size)+(8+SubChunk2Size)
            format       : [0x57,0x41,0x56,0x45], // 8    4    "WAVE" = 0x57415645
            subChunk1Id  : [0x66,0x6d,0x74,0x20], // 12   4    "fmt " = 0x666d7420
            subChunk1Size: 16,                    // 16   4    16 for PCM
            audioFormat  : 1,                     // 20   2    PCM = 1
            numChannels  : 1,                     // 22   2    Mono = 1, Stereo = 2...
            sampleRate   : sampleRate,            // 24   4    8000, 44100...
            byteRate     : 0,                     // 28   4    SampleRate*NumChannels*BitsPerSample/8
            blockAlign   : 0,                     // 32   2    NumChannels*BitsPerSample/8
            bitsPerSample: bitsPerSample,         // 34   2    8 bits = 8, 16 bits = 16
            subChunk2Id  : [0x64,0x61,0x74,0x61], // 36   4    "data" = 0x64617461
            subChunk2Size: 0                      // 40   4    data size = NumSamples*NumChannels*BitsPerSample/8
        };

        header.blockAlign = (header.numChannels * header.bitsPerSample)/8;
        header.byteRate = header.blockAlign * header.sampleRate;
        header.subChunk2Size = data.byteLength;
        header.chunkSize = 36 + header.subChunk2Size;

        var headernew = new Uint8Array(44);
        headernew.set(header.chunkId, 0);
        headernew.set(u32ToArray(header.chunkSize), 4);
        headernew.set(header.format, 8);
        headernew.set(header.subChunk1Id, 12);
        headernew.set(u32ToArray(header.subChunk1Size), 16);
        headernew.set(u16ToArray(header.audioFormat), 20);
        headernew.set(u16ToArray(header.numChannels), 22);
        headernew.set(u32ToArray(header.sampleRate), 24);
        headernew.set(u32ToArray(header.byteRate), 28);
        headernew.set(u16ToArray(header.blockAlign), 32);
        headernew.set(u16ToArray(header.bitsPerSample), 34);
        headernew.set(header.subChunk2Id, 36);
        headernew.set(u32ToArray(header.subChunk2Size), 40);
        return [].concat(
            headernew,
            data
        );
    }


    function getMIMEType() {
        return "audio/wav";
    }
    var Base64 = {

        chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encLookup: [],

        init: function() {
            for (var i = 0; i < 4096; i++) {
                this.encLookup[i] = this.chars[i >> 6] + this.chars[i & 0x3F];
            }
        },

        encode: function(src) {
            var len = src.length;
            var dst = '';
            var i = 0;
            var n;
            while (len > 2) {
                n = (src[i] << 16) | (src[i + 1] << 8) | src[i + 2];
                dst += this.encLookup[n >> 12] + this.encLookup[n & 0xFFF];
                len -= 3;
                i += 3;
            }
            if (len > 0) {
                var n1 = (src[i] & 0xFC) >> 2;
                var n2 = (src[i] & 0x03) << 4;
                if (len > 1) n2 |= (src[++i] & 0xF0) >> 4;
                dst += this.chars[n1];
                dst += this.chars[n2];
                if (len == 2) {
                    var n3 = (src[i++] & 0x0F) << 2;
                    n3 |= (src[i] & 0xC0) >> 6;
                    dst += this.chars[n3];
                }
                if (len == 1) dst += '=';
                dst += '=';
            }
            return dst;
        }
    };
    Base64.init();

    /**
     * @param {number[]} data - list of bytes to encode
     * @param {string} type - MIME-type of the data
     * @return {string}
     */
    function getDataURI(data, type) {
        return 'data:' + type + ';base64,' + Base64.encode(data);
    }

    // Function to download data to a file
    function download(data)
    {
        var a = document.createElement("a");
        document.body.appendChild(a);
        var blob = new Blob(data, {type: "octet/stream"}),
        url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'audio.wav';
        a.click();
        window.URL.revokeObjectURL(url);


        //var file = IO.newFile("Home", "../../../Downloads/audio.wav");
        //var destination = IO.newFile("Temporary", "../workspace/yarp.js/car-dashboard");
        //file.moveTo(destination, "../workspace/yarp.js/car-dashboard");
    }
