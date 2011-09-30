
/******************************************************************************
 * $html: $
 *
 * $Author:  $
 * 		Berlin Qin
 *
 * $History: html.js $
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

function fbis(){};
fbis.getOs=function()
{
    var os = "";
    var agent=navigator.userAgent;
    if(agent.indexOf("MSIE")>=0)
    {
        os="MSIE";
    }
    else  if(agent.indexOf("Firefox")>=0)
    {
        os="Firefox";
    }
    else  if(agent.indexOf("Safari")>=0)
    {
        os="Safari";
    }
    else if(agent.indexOf("Camino")>=0)
    {
        os="Camino";
    }
    else if(agent.indexOf("Gecko/")>=0)
    {
        os="Gecko";
    }
    else if(agent.indexOf("Opera/")>=0)
    {
        os="Opera";
    }
    return os;
}

fbis.getOsVer=function()
{
    var userAgent = navigator.userAgent.toLowerCase();
    var result=0;
    var v=null;
    if(v=userAgent.match("/msie ([\d.]+)/"))
    {
        result=v[1];
    }
    else if(v=userAgent.match("/firefox\/([\d.]+)/"))
    {
        result=v[1];
    }
    else if(v=userAgent.match("/chrome\/([\d.]+)/"))
    {
        result=v[1];
    }
    else if(v=userAgent.match("/opera.([\d.]+)/"))
    {
        result=v[1];
    }
    else if(v=userAgent.match("/version\/([\d.]+).*safari/"))
    {
        result=v[1];
    }
    return result;
}

fbis.gethtmlparams=function(url)
{
    //var json=null;
    var params=null;
    if(url.lastIndexOf("?")!=-1)
    {
        try
        {
            params= url.substring(url.lastIndexOf("=")+1,url.length);
            params=decodeHex(params);
        //json=JSON.parse(params);
        }
        catch(e)
        {
        }
    }
    return params;
}

fbis.getobj=function(id)
{
    var obj=null;
    if(document.layers) //NN4+
    {
        obj=document.layers[id];
    }
    else if(document.getElementById)
    {
        obj=document.getElementById(id);
    }
    else if(document.all)// IE 4
    {
        obj=document.all[id];
    }
    return obj;
}

fbis.getobjobj=function(obj,id)
{
    var result=null;
    if(obj&&obj.document)
    {
        if(obj.document.layers) //NN4+
        {
            result=obj.document.layers[id];
        }
        else if(obj.document.getElementById)
        {
            result=obj.document.getElementById(id);
        }
        else if(obj.document.all)// IE 4
        {
            result=obj.document.all[id];
        }
    } 
    return result;
}

fbis.gettypeobj=function(obj,type)
{
    var rev=null;
    if(obj&&type)
    {
        var children=(obj.childNodes?obj.childNodes:obj.children);
        for(var i=0;i<children.length;i++)
        {
            if(children[i].tagName==type.toUpperCase())
            {
                return children[i];
            }
            else
            {
                rev=CHtml.gettypeobj(children[i], type);
                if(rev)
                {
                    break;
                }
            }
        }
    }
    return rev;
}

fbis.getparent=function(node)
{
    return (node.parentNode?node.parentNode:node.parentElement);
}

fbis.IsArray=function(obj)
{
    if (obj)
    {
        return (typeof obj == 'object' && typeof obj.splice == 'function' && typeof obj.length == 'number');
    }
    return false;
}

fbis.showdiv=function(obj,bshow)
{
    if(document.layers) 
    {
        obj.visibility = (bshow? "show" : "hide");
    }
    else if(document.getElementById)
    {
        obj.style.display = (bshow? "block" : "none");
    }
    else if(document.all)// IE 4
    {
        obj.style.visibility = (bshow? "visible" : "hidden");
    }
}

fbis.addEvent=function(elm, evType, fn, useCapture)
{
    if (elm.addEventListener)
    {
        elm.addEventListener(evType, fn, useCapture);//DOM2.0
        return true;
    }
    else if (elm.attachEvent)
    {
        var r = elm.attachEvent('on' + evType, fn);//IE5+
        return r;
    }
    else
    {
        elm['on' + evType] = fn;//DOM 0
    }
    return false;
}

fbis.removeEvent=function( obj, type, fn )
{
    if(obj&&type&&fn)
    {
        if(obj.removeEventListener)
        {
            obj.removeEventListener( type, fn, false );
        }
        else if (obj.detachEvent)
        {
            //obj.detachEvent( 'on'+type, obj[type+fn] );
            obj.detachEvent( 'on'+type, fn );
            obj[type+fn] = null;
        }
        else
        {
            obj['on'+type] = null;//DOM 0
        }
    }
}

fbis.createElement=function(element,attrs,htmlstr)
{
    attrs=attrs||{};
    var obj=document.createElement(element);
    for(var e in attrs)
        obj.setAttribute(e,attrs[e]);
    if(obj.style)
        obj.style.cssText=attrs.style;
    if(attrs["class"])
        obj.className=attrs["class"];
    if(htmlstr)
        obj.innerHTML=htmlstr;
    return obj;
}
fbis.getValue=function(id)
{
    var element=getobj(id);
    if(!element)
        return"";
    return (typeof element.value!="undefined")?element.innerHTML:element.value;
}

fbis.remove=function(element)
{
    if(fbis.IsArray(element))
    {
        for(var i=0;i<element.length;i++)
            fbis.remove(element[i]);
    }
    else if(element)
    {
        try
        {
            element.removeAttribute('style');
            element.removeAttribute('innerHTML');
            element.removeAttribute('onmousedown');
        }
        catch(e)
        {
        }
        var len = element.childNodes.length;
        for(var i = 0; i < len; i++)
        {
            if(element.childNodes[i])
            {
                fbis.remove(element.childNodes[i]);
            }
        }
        try
        {
            element.removeAttribute('id');
            element.removeAttribute('name');
        }
        catch(e)
        {
            
        }
        if(element.parentNode)
        {
            element.parentNode.removeChild(element);
        }
    }
}

fbis.removeChild=function(element)
{
    if(element)
    {
        var len = element.childNodes.length;
        for(var i = 0; i < len; i++)
        {
            if(element.childNodes[i])
            {
                fbis.remove(element.childNodes[i]);
            }
        }
    }
}

fbis.insertBefore=function(newnode,node,parent)
{
    if(newnode)
        node?getparent(node).insertBefore(newnode,node):parent.appendChild(newnode);
}

fbis.getEventAttrVal=function(oEvent,attr)
{
    oEvent=oEvent||event;

    for(var element=oEvent.target||oEvent.srcElement;element;)
    {
        if(element.getAttribute)
        {
            var value=element.getAttribute(attr);
            if(value)
                return value;
        }
        element=element.parentNode;
    }
    return null
}

fbis.getEventObj=function(oEvent,obj)
{
    oEvent=oEvent||event;
    for(var element=oEvent.target||oEvent.srcElement;element;)
    {
        if(element[obj])
        {
            return element[obj];
        }
        element=element.parentNode;
    }
    return null
}

fbis.findParentDiv=function(obj)
{
    while (obj)
    {
        if (obj.tagName.toUpperCase() == "DIV")
        {
            return obj;
        }
        obj = fbis.getparent(obj);
    }
    return null;
}

fbis.offset=function(element)
{
    if(element.getBoundingClientRect)
    {
        var rect=element.getBoundingClientRect();
        var sbody=document.body;
        var allElements=document.documentElement;
        var e=window.pageYOffset||allElements.scrollTop||sbody.scrollTop;
        var f=window.pageXOffset||allElements.scrollLeft||sbody.scrollLeft;
        var g=allElements.clientTop||sbody.clientTop||0;
        var h=allElements.clientLeft||sbody.clientLeft||0;
        var i=rect.top+e-g;
        var j=rect.left+f-h;
        return{
            y:Math.round(i),
            x:Math.round(j)
        }
    }
    else
    {
        for(j=i=0;element;)
        {
            i+=parseInt(element.offsetTop,10);
            j+=parseInt(element.offsetLeft,10);
            element=element.offsetParent
        }
        return{
            y:i,
            x:j
        }
    }
}

fbis.pos=function(oEvent)
{
    oEvent=oEvent||event;
    if(oEvent.pageX||oEvent.pageY)
    {
        return{
            x:oEvent.pageX,
            y:oEvent.pageY
        };
    }
    var doc=document.compatMode!="BackCompat"?document.documentElement:document.body;
    return{
        x:oEvent.clientX+doc.scrollLeft-doc.clientLeft,
        y:oEvent.clientY+doc.scrollTop-doc.clientTop
    }
}

fbis.ElementIsCss=function(element,csclass)
{
    if(element&&element.className)
    {
        var needle=new RegExp("(^|\\s+)"+csclass+"($|\\s+)", "ig");
        return needle.test(element.className);
    }
    return false;
}
fbis.addElementCss=function(element,csclass)
{
    if(element&&element.className)
    {
        element.className+=" "+csclass;
    }
}
fbis.removeElementCss=function(element,csclass)
{
    if(element&&element.className)
    {
        element.className=element.className.replace(RegExp(csclass,"g"),"");
    }
}
fbis.doMouseEvent=function(id,e)
{
    var fireOnThis = this.getobj(id);
    if(fireOnThis)
    {
        if (document.createEvent)
        {
            var evObj = document.createEvent('MouseEvents')
            evObj.initEvent( e, true, false )
            fireOnThis.dispatchEvent(evObj)
        }
        else if (document.createEventObject)
        {
            fireOnThis.fireEvent('on'+e);
        }
    }
}
fbis.extend=function(obj,pobj)
{
    if(obj&&pobj)
    {
        for(var x in pobj)
        {
            obj[x]=pobj[x];
        }
    }
    return obj;
}
fbis.bind=function(target,source)
{
    return function()
    {
        return target.apply(source,arguments)
    }
}
fbis.getfileext=function(fname)
{
    var rev="";
    if(typeof fname=="string")
    {
        var array=fname.split(".");
        rev=(array.pop()).toLowerCase();
    }
    return rev;
}
fbis.filebasename=function(fname)
{
    var rev="";
    if(typeof fname=="string")
    {
        var array=fname.split(".");
        array.pop();
        rev=array.join(".");
    }
    return rev;
}
fbis.showpagebar=function(pbid,totle,cur,pcount,tbid,iftype)
{
    var pbar=getobj(pbid);
    if(pbar)
    {
        if(totle>pcount)
        {
            var npage=Math.floor(totle/pcount);
            var mod=totle%pcount;
            if(mod>0)
            {
                npage++;
            }
            if(npage>1)
            {
                var str="<a id='1' class='button' href='javascript:void(0)' onclick='javascript:gotopage(1,"+tbid+","+iftype+");'>第一页</a>";
                for(var i=1;i<npage;i++)
                {
                    str=str+"<a id='"+i+"' class='button' href='javascript:void(0)' onclick='javascript:gotopage("+i+","+tbid+","+iftype+");'>"+i+"</a>";
                }
                pbar.innerHTML=str;
                showdiv(pbar, 1);
            }
            else
            {
                showdiv(pbar, 0);
            }
        }
    }
}
fbis.SetCookie= function (name, value, daysToSurvive)
{
    var expires = new Date();
    expires.setTime(expires.getTime() + (daysToSurvive*24*60*60*1000));

    var value = escape(value) + "; path=/; expires=" + expires.toUTCString();
    document.cookie = name + "=" + value;
}
fbis.GetCookie=function(name)
{
    var i, x, y;
    var cookies = document.cookie.split(";");
    for (i = 0; i < cookies.length; i++)
    {
        x = cookies[i].substr(0,cookies[i].indexOf("="));
        x = x.replace(/^\s+|\s+$/g,"");
        if (x == name)
        {
            y = cookies[i].substr(cookies[i].indexOf("=") + 1);
            return unescape(y);
        }
    }
    return "";
}
fbis.DeleteCookie=function (name)
{
    document.cookie = name + '=; path=/; expires=Thu, 01-Jan-70 00:00:01 GMT;';
}
function inclue(jsfile)
{
    if(jsfile)
    {
        document.write('<script src="'+jsfile+ '"  type="text/javascript"></script>');
    }
}
fbis.uniqid=0;
fbis.getuniqid=function()
{
    if(fbis.uniqid==4096)
    {
        fbis.uniqid=0;
    }
    return (fbis.uniqid++);
}
fbis.getWindowSize=function()
{
    var window_width, window_height, scrollX, scrollY;
    if (typeof(window.innerWidth) === 'number')
    {
        window_width  = window.innerWidth;
        window_height = window.innerHeight;
        scrollX = window.pageXOffset;
        scrollY = window.pageYOffset;
    }
    // IE 6 standards compliant mode
    else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight))
    {
        window_width  = document.documentElement.clientWidth;
        window_height = document.documentElement.clientHeight;
        scrollX = document.documentElement.scrollLeft;
        scrollY = document.documentElement.scrollTop;
    }
    else if (document.body && (document.body.clientWidth || document.body.clientHeight))
    {
        window_width  = document.body.clientWidth;
        window_height = document.body.clientHeight;
        scrollX = document.body.scrollLeft;
        scrollY = document.body.scrollTop;
    }
    return {
        "width":window_width,
        "height":window_height,
        "scrollx":scrollX,
        "scrolly":scrollY
    }
}
fbis.getObjSize=function(id)
{
    var width=0,height=0,top=0,left=0;

    if(id)
    {
        var obj=fbis.getobj(id);
        if(obj)
        {
            width=obj.offsetWidth;
            height=obj.offsetHeight;
            top=obj.offsetTop;
            left=obj.offsetLeft;
        }
    }
    return {
        "width":width,
        "height":height,
        "top":top,
        "left":left
    };
}

fbis.formatSize=function(bytes)
{
    var i = -1;
    do {
        bytes = bytes / 1024;
        i++;
    } while (bytes > 99);

    return Math.max(bytes, 0.1).toFixed(1) + ['kB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];
}
function CItem(url,text,click,img,bseparator,radiobox,checkbox)
{
    this.caption=text;
    this.href=url;
    this.radiobox=radiobox;
    this.checkbox=checkbox;
    this.selfimg=(img?img:null);
    this.onclick=click;
    this.lev=0;
    this.index=0;
    this.count=0;
    this.bseparator=(bseparator?bseparator:false);  
    this.children=[];
    this.parent=null;
    this.prev=null;        
    this.next=null;        
}
CItem.prototype.addChild=function(Item)
{
    if(this.count>0)
    {
        this.children[this.count-1].next=Item;
        Item.prev=this.children[this.count-1];
    }
    Item.parent=this;
    Item.lev=this.lev+1;
    Item.index=this.count;
    this.children[this.count]=Item;
    this.count++;
}
CItem.prototype.insertBefore=function(node,bnode)
{
    node.next=bnode;
    node.prev=(bnode.index>0?this.children[bnode.index-1]:null);
    bnode.prev=node;
    node.index=bnode.index;
    node.parent=this;
    node.lev=this.lev+1;
    for(var i=this.count;i>=bnode.index;i--)
    {
        this.children[i]=this.children[i-1];
    }
    this.children[bnode.index]=node;
    this.count++;
}
function norightclick(e)
{
    if (window.Event)
    {
        if (e.which == 2 || e.which == 3)
            return false;
    }
    else  if (event.button == 2 || event.button == 3)
    {
        event.cancelBubble = true
        event.returnValue = false;
    }
    return false;
}