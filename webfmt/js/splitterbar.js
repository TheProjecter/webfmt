

/******************************************************************************
 * $splitterbar: $
 *
 * $Author:  $
 * 		Berlin Qin
 *
 * $History: splitterbar.js $
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
function CVSplitter(maindiv,leftdiv,rightdiv,params)
{
    this.mainid=maindiv;
    this.leftid=leftdiv;
    this.rightid=rightdiv;
    this.id="splitter"+fbis.getuniqid();
    this.onresize=null;
    this.width=10;
    this.config=params;
    var size=fbis.getWindowSize();
    this.maindiv = fbis.getobj(this.mainid)
    this.leftdiv = fbis.getobj(this.leftid);
    this.rightdiv = fbis.getobj(this.rightid);

    var leftItemWidth = this.leftdiv.offsetWidth - this.width;
    this.maindiv.style.width=size.width-20;
    this.maindiv.style.height=size.height-30;
    var rightwidth = (size.width-20 - leftItemWidth) - this.width;
    this.leftContainer = this.CreateResizeDiv(leftItemWidth, this.leftdiv);
    this.rightContainer = this.CreateResizeDiv(rightwidth, this.rightdiv);

    this.splitter = fbis.createElement("div",{
        "id":this.id,
        "class":this.config.splitterClass
    });
    this.splitter.style.cssFloat = "left";
    this.splitter.style.styleFloat = "left";
    this.splitter.style.height="100%";
    this.splitter.innerHTML = "";

    this.maindiv.innerHTML = "";
    this.maindiv.self=this;
    this.leftContainer.self=this;
    this.rightContainer.self=this;
    this.splitter.self=this;
    this.maindiv.appendChild(this.leftContainer);
    this.maindiv.appendChild(this.splitter);
    this.maindiv.appendChild(this.rightContainer);
    
    if (this.config.splitterBehaviour == "none")
    {
        var stateCookie = fbis.GetCookie("splitterstate" + this.mainid);
        fbis.DeleteCookie("splitterstate" + this.mainid);
        if (typeof(stateCookie) != "undefined") {
            if (stateCookie == "HIDE")
            {
                CVSplitter.Start(this.leftContainer,this.rightContainer,this.maindiv, this.splitter);
                fbis.SetCookie("splitterstate" + this.mainid, "HIDE", 1);
            }
        }
    }
    if(this.config.splitterBehaviour == "track")
    {
        this.splitter.style.cursor="e-resize";
        this.splitter.onmousedown = function (evt)
        {
            evt=evt||window.event;
            var element=evt.target||evt.srcElement;
            if(element&&element.self)
            {
                var self=element.self;
                CVSplitter.StartWithTracking(self.leftContainer, self.rightContainer,self.maindiv, self.splitter);
            }
            return false;
        }
    }
    else
    {
        this.splitter.style.cursor="hand";
        this.splitter.onmousedown = function (evt)
        {
            evt=evt||window.event;
            var element=evt.target||evt.srcElement;
            if(element&&element.self)
            {
                var self=element.self;
                CVSplitter.Start(self.leftContainer, self.rightContainer, self.maindiv,self.splitter);
            }
            return false;
        }
    }
    this.splitter.ondraggesture = function ()
    {
        return false;
    }
    this.splitter.ondrag = function ()
    {
        return false;
    }
    fbis.addEvent(window, "resize", function (evt)
    {
        evt=evt||window.event;
        var element=evt.target||evt.srcElement;
        if(element&&element.self)
        {
            var self=element.self;
            CVSplitter.Resize(self.maindiv, self.leftContainer,self.rightContainer,self);
        }
    });
    CVSplitter.self=this;
}
CVSplitter.vsplitterX = 0;
CVSplitter.vsplitterY = 0;
CVSplitter.vsplitterTimer;
CVSplitter.vsplitterTracking = false;
CVSplitter.prototype.CreateResizeDiv=function (width, child)
{
    var resizediv =fbis.createElement("div");
    if(resizediv)
    {
        resizediv.style.overflow = "hidden";
        resizediv.style.cssFloat = "left";
        resizediv.style.styleFloat = "left";
        resizediv.style.width = width + "px";
        //var size=fbis.getWindowSize();
        resizediv.style.height="100%";

        child.style.cssFloat = "none";
        child.style.styleFloat = "none";
        child.style.width = "auto";
        child.style.margin = "0";
        resizediv.oncontextmenu=function(evt)
        {
            evt=evt||window.event;
            evt.returnValue=false;
        }
        resizediv.appendChild(child);
    }
    return resizediv;
}
CVSplitter.Start=function (leftItem, rightItem, container, splitter)
{
    fbis.DeleteCookie("splitterstate" + container.id);
    if (leftItem.offsetWidth > 0)
    {
        leftItem.title = leftItem.offsetWidth;
        leftItem.style.width = 0;
        CVSplitter.Resize(container, leftItem, rightItem);
        fbis.SetCookie("splitterstate" + container.id, "HIDE", 1);
    }
    else
    {
        leftItem.style.width = leftItem.title + "px";
        CVSplitter.Resize(container, leftItem, rightItem);
        fbis.SetCookie("splitterstate" + container.id, leftItem.title, 1);
    }
    return false;
}
CVSplitter.StartWithTracking=function (leftItem, rightItem, container, splitter)
{
    if (!CVSplitter.vsplitterTracking)
    {
        CVSplitter.vsplitterTracking = true;
        document.getElementsByTagName("body")[0].style.cursor = "e-resize";
        CVSplitter.vsplitterTimer = window.setTimeout(function ()
        {
            CVSplitter.Track(container, splitter, leftItem, leftItem.offsetWidth, rightItem, rightItem.offsetWidth, CVSplitter.vsplitterX);
        }, 50);
    }
    return false;
}
CVSplitter.Track=function (container, splitter, leftItem, firstItemWidth, rightItem, secondItemWidth, originalPosition)
{
    if (CVSplitter.vsplitterTracking)
    {
        var size=fbis.getWindowSize();
        var movement =CVSplitter.vsplitterX - originalPosition;
        var leftItemWidth = firstItemWidth + movement;
        if (leftItemWidth < 0)
        {
            leftItemWidth = 0;
        }
        container.style.width=size.width-20;
        container.style.height=size.height-30;
        var remainingWidth = parseInt(container.style.width) - splitter.self.width;
        if (leftItemWidth > remainingWidth)
        {
            leftItemWidth = remainingWidth;
        }
        remainingWidth = remainingWidth - leftItemWidth;
        if (remainingWidth < 0)
        {
            remainingWidth = 0;
        }
        splitter.style.height="100%";
        leftItem.style.width = leftItemWidth + "px";
        rightItem.style.width = remainingWidth + "px";

        CVSplitter.vsplitterTimer = window.setTimeout(function ()
        {
            CVSplitter.Track(container, splitter, leftItem, firstItemWidth, rightItem, secondItemWidth, originalPosition);
        }, 50);
    }
}
CVSplitter.Stop=function(evt)
{
    if (CVSplitter.vsplitterTracking)
    {
        var self=CVSplitter.self;
        if(self)
        {
            CVSplitter.vsplitterTracking = false;
            document.getElementsByTagName("body")[0].style.cursor = "auto";
            window.clearTimeout(CVSplitter.vsplitterTimer);
            if(self&&self.config&&self.config.onresize)
            {
                try
                {
                    self.config.onresize();
                }
                catch(e)
                {}
            }
        }
    }
    return false;
}
CVSplitter.Resize= function (container, leftItem, rightItem,self)
{
    if(container)
    {
        var size=fbis.getWindowSize();
        container.style.width=size.width-20;
        container.style.height=size.height-30;
        var remainingWidth = container.offsetWidth - self.width;
        var leftWidth = leftItem.offsetWidth;
        if (leftWidth > remainingWidth)
        {
            leftWidth = remainingWidth;
        }
        var rightWidth = remainingWidth - leftWidth;

        leftItem.style.width = leftWidth + "px";
        rightItem.style.width = rightWidth + "px";
    }
}

document.body.onmousemove = function (e)
{
    e = e||window.event;
    if (e.pageX || e.pageY)
    {
        CVSplitter.vsplitterX = parseInt(e.pageX, 10);
        CVSplitter.vsplitterY = parseInt(e.pageY, 10);
    }
    else if (e.clientX || e.clientY)
    {
        CVSplitter.vsplitterX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        CVSplitter.vsplitterY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
}
document.body.onmouseup = CVSplitter.Stop;