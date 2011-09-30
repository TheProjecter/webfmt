
/******************************************************************************
 * $ajaxbase: $
 *
 * $Author:  $
 * 		Berlin Qin
 *
 * $History: ajaxbase.js $
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
function createXMLHttpRequest()
{
    var request = false;
    if(window.XMLHttpRequest)
    {
        request = new XMLHttpRequest();
        if(request.overrideMimeType)
        {
            request.overrideMimeType('text/xml');
        }
    }
    else if(window.ActiveXObject)
    {
        var versions = ['Microsoft.XMLHTTP', 'MSXML.XMLHTTP', 'Microsoft.XMLHTTP',
        'Msxml2.XMLHTTP.7.0', 'Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.5.0',
        'Msxml2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP'];
        for(var i=0; i<versions.length; i++)
        {
            try
            {
                request = new ActiveXObject(versions[i]);
                if(request)
                {
                    return request;
                }
            }
            catch(e)
            {
                request=null;
            }
        }
    }
    return request;
}
CAjaxRequest.prototype.newRequest=function()
{
    if (!this.request)
    {
        this.request=createXMLHttpRequest();
    }
}
CAjaxRequest.prototype.destroyRequest=function()
{
    this.request=null;
}
CAjaxRequest.prototype.onSubmit=function()
{
    return true;
}
CAjaxRequest.prototype.onFinish=function(self,respons,status)
{
    }
CAjaxRequest.prototype.setheader=function(type,content)
{
    this.header_type.push(type);
    this.header_content.push(content);
}
CAjaxRequest.prototype.header=function()
{
    switch(this.readyState)
    {
        case 0:
        case 1:
        case 2:
        case 3:
        {
            }
            break;
        case 4:
        {
            //this.onFinish(this, respons, status)
            onFinish(this,request.responseText,request.status);
            destroyRequest();
        }
        break;
    }
}
CAjaxRequest.prototype.onTimeOut=function()
{
    if(this.request)
    {
        this.request.abort();
    }
    this.onFinish(this,{
        "error":-200,
        "errormsg":"timeout"
    },6000);
    this.destroyRequest();
    clearTimeout("this.onTimeOut");
}
CAjaxRequest.prototype.send=function()
{
    if(this.request)
    {
        if(this.onSubmit())
        {
            var self=this;
            this.request.onreadystatechange=function()
            {
                //alert(self.request.readyState);
                clearTimeout("this.onTimeOut");
                switch(self.request.readyState)
                {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    {
                        //self.onFinish(self,self.request.responseText,self.request.status);
                    }
                    break;
                    case 4:
                    {
                        //this.onFinish(this, respons, status)
                        if(self.request.responseText)
                            self.onFinish(self,self.request.responseText,self.request.status);
                        else
                            self.onFinish(self,{
                                "error":-300
                            },self.request.status);
                    }
                    break;
                }
            }
            this.request.open(this.method,this.action,true);
            for(i=0;i<this.header_type.length;i++)
            {
                this.request.setRequestHeader(this.header_type[i],this.header_content[i]);
            }
            this.request.setRequestHeader("Cache-Control", "no-cache");
            try
            {
                if(this.method.toUpperCase()=="POST")
                {
                    this.request.send(this.data);
                }
                else if(this.method.toUpperCase()=="GET")
                {
                    this.request.send(null);
                }
                setTimeout("this.onTimeOut",this.timeout);
                this.request.onreadystatechange=function()
                {
                    //alert(this.readyState);
                    switch(this.readyState)
                    {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        {
                            }
                            break;
                        case 4:
                        {
                            //this.onFinish(this, respons, status)
                            self.onFinish(self,self.request.responseText,self.request.status);
                            self.destroyRequest();
                        }
                        break;
                    }
                }
            }
            catch(e)
            {
                alert(e);
                self.onFinish(self,{
                    "error":-500,
                    "exception":e
                },-1);
                self.destroyRequest();
            //clearTimeout("this.onTimeOut");
            }
        }
    }
}
function CAjaxRequest()
{
    this.action=null;
    this.data={};
    this.timeout=10000;
    this.method="POST";
    this.type="json";
    this.request=createXMLHttpRequest();
    this.header_type=new Array();
    this.header_content=new Array();
}

