/******************************************************************************
 * $webfmt: $
 *
 * $Author:  $
 * 		Berlin Qin
 *
 * $History: webfmt.js $
 *      Berlin Qin    2011/5/15         created
 * $contacted
 *      webfmt@gmail.com
 *      www.webfmt.com
 *
 * *************************************************************************** */
/* ===========================================================================
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
 * *************************************************************************** */
var scripts=document.getElementsByTagName("script");
//查找
var selfpath="";
for(var i=0;i<scripts.length;i++)
{
    if(scripts[i].src)
    {
        var sarray=scripts[i].src.split("/");
        var jsf=sarray.pop();
        if(jsf=="webfmt.js")
        {
            selfpath=sarray.join("/");
            break;
        }
    }
}
if(selfpath!="")
{
    selfpath=selfpath+"/";
}
document.write('<script src="'+selfpath+'js/html.js"  type="text/javascript"></script>');
document.write('<script src="'+selfpath+'js/base64.js"  type="text/javascript"></script>');
document.write('<script src="'+selfpath+'js/urlencode.js"  type="text/javascript"></script>');
document.write('<script src="'+selfpath+'js/json2.js"  type="text/javascript"></script>');
function CWebFmt(){}
CWebFmt.show=function(param,height,width,IsPop)
{
    var url=selfpath+"webfmt.php";
    param=param||{};
    if(typeof param.lang=="undefined")
    {
        //获取浏览器语言
        var lang=(navigator.language || navigator.browserLanguage).toLowerCase();
        param.lang=lang;
    }
    var p = urlEncode(base64encode(JSON.stringify(param)));
    url=url+"?params="+p;
    if(IsPop)
    {
        //var size=fbis.getWindowSize();
        var left=(window.screen.width -width)/2;
        var top=(window.screen.height -height)/2;
        window.open (url,"newwindow","height="+height+",width="+width+"px,top="+top+"px,left="+left+",toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no, status=no");
    }
    else
    {
        window.location.href=url;
    }
}
CWebFmt.getUrl=function(param)
{
    var url=selfpath+"webfmt.php";
    param=param||{};
    if((!(param.lang))||(!(param.lang=="zh-cn"||param.lang=="en")))
    {
        //获取浏览器语言
        var lang=(navigator.language || navigator.browserLanguage).toLowerCase();
        if(lang=="zh-cn")
        {
            param.lang='zh-cn';
        }
        else
        {
            param.lang='en';
        }
    }
    var p = urlEncode(base64encode(JSON.stringify(param)));
    url=url+"?params="+p;
    return url;
}

