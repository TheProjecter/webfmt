/******************************************************************************
 * $urlencode: $
 *
 * $Author:  $
 * 		Berlin Qin
 *
 * $History: urlencode.js $
 *      Berlin Qin    2011/5/15         created
 * $contacted
 *      webfmt@gmail.com
 *      www.webfmt.com
 *
 *****************************************************************************/
/*===========================================================================
 * license
 *
 * 1、Open Source Licenses
 * webfmt is distributed under the GPL, LGPL and MPL open source licenses.
 * This triple copyleft licensing model avoids incompatibility with other open source licenses.
 * These Open Source licenses are specially indicated for:
 *   Integrating webfmt into Open Source software;
 *   Personal and educational use of webfmt;
 *   Integrating webfmt in commercial software,
 *  taking care of satisfying the Open Source licenses terms,
 *   while not able or interested on supporting webfmt and its development.
 *
 * 2、Commercial License – fbis source Closed Distribution License - CDL
 * For many companies and products, Open Source licenses are not an option.
 * This is why the fbis source Closed Distribution License (CDL) has been introduced.
 * It is a non-copyleft license which gives companies complete freedom
 * when integrating webfmt into their products and web sites.
 * This license offers a very flexible way to integrate webfmt in your commercial application.
 * These are the main advantages it offers over an Open Source license:
 *     Modifications and enhancements doesn't need to be released under an Open Source license;
 *     There is no need to distribute any Open Source license terms alongside with your product
 * and no reference to it have to be done;
 *     No references to webfmt have to be done in any file distributed with your product;
 *     The source code of webfmt doesn’t have to be distributed alongside with your product;
 *     You can remove any file from webfmt when integrating it with your product.
 * The CDL is a lifetime license valid for all releases of webfmt published during
 * and before the year following its purchase.
 * It's valid for webfmt releases also. It includes 1 year of personal e-mail support.
 *
*****************************************************************************/
function utf8to16(str)
{
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = str.length;
    i = 0;
    while(i < len)
    {
        c = str.charCodeAt(i++);
        switch(c >> 4)
        {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                out += str.charAt(i-1);
                break;
            case 12: case 13:
                char2 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }
    return out;
}
function utf16to8(str)
{
    var out, i, len, c;

    out = "";
    len = str.length;
    for(i = 0; i < len; i++)
    {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F))
        {
            out += str.charAt(i);
        }
        else if (c > 0x07FF)
        {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        }
        else
        {
            out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        }
    }
    return out;
}
function urlDecode(str)
{
    var output = str;
    var binVal, thisString;
    var myregexp = /(%[^%]{2})/;
    while((match = myregexp.exec(output)) != null
        && match.length > 1
        && match[1] != '')
        {
        binVal = parseInt(match[1].substr(1),16);
        thisString = String.fromCharCode(binVal);
        output = output.replace(match[1], thisString);
    }
    return utf8to16(output);
}
function urlEncode(str)
{
    var output = '';
    var x = 0;

    str = utf16to8(str.toString());
    var regex = /(^[a-zA-Z0-9-_.]*)/;
    while (x < str.length)
    {
        var match = regex.exec(str.substr(x));
        if (match != null && match.length > 1 && match[1] != '')
        {
            output += match[1];
            x += match[1].length;
        }
        else
        {
            if (str[x] == ' ')
                output += '+';
            else
            {
                var charCode = str.charCodeAt(x);
                var hexVal = charCode.toString(16);
                output += '%' + ( hexVal.length < 2 ? '0' : '' ) + hexVal.toUpperCase();
            }
            x++;
        }
    }

    

    return output;

}
function ntos(n)
{
    n=n.toString(16);
    if (n.length == 1) n="0"+n;
    n="%"+n;
    return unescape(n);
}

function pad(str, len, pad)
{
    var result = str;
    for (var i=str.length; i<len; i++)
    {
        result = pad + result;
    }
    return result;
}
function encodeHex(str)
{
    var result = "";
    for (var i=0; i<str.length; i++)
    {
        result += pad(toHex(str.charCodeAt(i)&0xff),2,'0');
    }
    return result;
}

var hexv = {
    "00":0,
    "01":1,
    "02":2,
    "03":3,
    "04":4,
    "05":5,
    "06":6,
    "07":7,
    "08":8,
    "09":9,
    "0A":10,
    "0B":11,
    "0C":12,
    "0D":13,
    "0E":14,
    "0F":15,
    "10":16,
    "11":17,
    "12":18,
    "13":19,
    "14":20,
    "15":21,
    "16":22,
    "17":23,
    "18":24,
    "19":25,
    "1A":26,
    "1B":27,
    "1C":28,
    "1D":29,
    "1E":30,
    "1F":31,
    "20":32,
    "21":33,
    "22":34,
    "23":35,
    "24":36,
    "25":37,
    "26":38,
    "27":39,
    "28":40,
    "29":41,
    "2A":42,
    "2B":43,
    "2C":44,
    "2D":45,
    "2E":46,
    "2F":47,
    "30":48,
    "31":49,
    "32":50,
    "33":51,
    "34":52,
    "35":53,
    "36":54,
    "37":55,
    "38":56,
    "39":57,
    "3A":58,
    "3B":59,
    "3C":60,
    "3D":61,
    "3E":62,
    "3F":63,
    "40":64,
    "41":65,
    "42":66,
    "43":67,
    "44":68,
    "45":69,
    "46":70,
    "47":71,
    "48":72,
    "49":73,
    "4A":74,
    "4B":75,
    "4C":76,
    "4D":77,
    "4E":78,
    "4F":79,
    "50":80,
    "51":81,
    "52":82,
    "53":83,
    "54":84,
    "55":85,
    "56":86,
    "57":87,
    "58":88,
    "59":89,
    "5A":90,
    "5B":91,
    "5C":92,
    "5D":93,
    "5E":94,
    "5F":95,
    "60":96,
    "61":97,
    "62":98,
    "63":99,
    "64":100,
    "65":101,
    "66":102,
    "67":103,
    "68":104,
    "69":105,
    "6A":106,
    "6B":107,
    "6C":108,
    "6D":109,
    "6E":110,
    "6F":111,
    "70":112,
    "71":113,
    "72":114,
    "73":115,
    "74":116,
    "75":117,
    "76":118,
    "77":119,
    "78":120,
    "79":121,
    "7A":122,
    "7B":123,
    "7C":124,
    "7D":125,
    "7E":126,
    "7F":127,
    "80":128,
    "81":129,
    "82":130,
    "83":131,
    "84":132,
    "85":133,
    "86":134,
    "87":135,
    "88":136,
    "89":137,
    "8A":138,
    "8B":139,
    "8C":140,
    "8D":141,
    "8E":142,
    "8F":143,
    "90":144,
    "91":145,
    "92":146,
    "93":147,
    "94":148,
    "95":149,
    "96":150,
    "97":151,
    "98":152,
    "99":153,
    "9A":154,
    "9B":155,
    "9C":156,
    "9D":157,
    "9E":158,
    "9F":159,
    "A0":160,
    "A1":161,
    "A2":162,
    "A3":163,
    "A4":164,
    "A5":165,
    "A6":166,
    "A7":167,
    "A8":168,
    "A9":169,
    "AA":170,
    "AB":171,
    "AC":172,
    "AD":173,
    "AE":174,
    "AF":175,
    "B0":176,
    "B1":177,
    "B2":178,
    "B3":179,
    "B4":180,
    "B5":181,
    "B6":182,
    "B7":183,
    "B8":184,
    "B9":185,
    "BA":186,
    "BB":187,
    "BC":188,
    "BD":189,
    "BE":190,
    "BF":191,
    "C0":192,
    "C1":193,
    "C2":194,
    "C3":195,
    "C4":196,
    "C5":197,
    "C6":198,
    "C7":199,
    "C8":200,
    "C9":201,
    "CA":202,
    "CB":203,
    "CC":204,
    "CD":205,
    "CE":206,
    "CF":207,
    "D0":208,
    "D1":209,
    "D2":210,
    "D3":211,
    "D4":212,
    "D5":213,
    "D6":214,
    "D7":215,
    "D8":216,
    "D9":217,
    "DA":218,
    "DB":219,
    "DC":220,
    "DD":221,
    "DE":222,
    "DF":223,
    "E0":224,
    "E1":225,
    "E2":226,
    "E3":227,
    "E4":228,
    "E5":229,
    "E6":230,
    "E7":231,
    "E8":232,
    "E9":233,
    "EA":234,
    "EB":235,
    "EC":236,
    "ED":237,
    "EE":238,
    "EF":239,
    "F0":240,
    "F1":241,
    "F2":242,
    "F3":243,
    "F4":244,
    "F5":245,
    "F6":246,
    "F7":247,
    "F8":248,
    "F9":249,
    "FA":250,
    "FB":251,
    "FC":252,
    "FD":253,
    "FE":254,
    "FF":255
};

function decodeHex(str)
{
    str = str.toUpperCase().replace(new RegExp("s/[^0-9A-Z]//g"));
    var result = "";
    var nextchar = "";
    for (var i=0; i<str.length; i++)
    {
        nextchar += str.charAt(i);
        if (nextchar.length == 2)
        {
            result += ntos(hexv[nextchar]);
            nextchar = "";
        }
    }
    return result;
}
