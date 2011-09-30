
/******************************************************************************
 * $fbismenu: $
 *
 * $Author:  $
 * 		Berlin Qin
 *
 * $History: fbismenu.js $
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

function CMenu(div)
{
    this.id=div;
    this.showdelay=100;
    this.dropdownimg= '<img src="images/down.gif" border="0" />';
    this.reveal= [true, 5];
    this.iframediv=1;
    this.dropmenuobj=null;
    this.dropmenuitem=null;
    this.sbody=(document.compatMode=="CSS1Compat")? document.documentElement : document.body;
    this.iframedivadded=false;
    this.revealtimers= {};
    this.menuitems=fbis.getobj(div).getElementsByTagName("a");
    var self=this;
    for (var i=0; i<this.menuitems.length; i++)
    {
        if (this.menuitems[i].getAttribute("rel"))
        {
            var relvalue=this.menuitems[i].getAttribute("rel");
            var dropdownmenu=fbis.getobj(relvalue);
            dropdownmenu.self=this;
            fbis.addEvent(dropdownmenu, "mouseover", function()
            {
                self.clearhidemenu();
            }, false);
            fbis.addEvent(dropdownmenu,"mouseout",function(e){
                self.dynamichide(this, e)
            } );
            fbis.addEvent(dropdownmenu,"click",function(){
                self.delayhidemenu()
            }
            )
            try
            {
                this.menuitems[i].innerHTML=this.menuitems[i].innerHTML+" "+this.dropdownimg;
                this.menuitems[i].self=this;
            }
            catch(e)
            {
            }
            fbis.addEvent(this.menuitems[i], "mouseover", function(e)
            {
                e=e||window.event;
                var element=e.target||e.srcElement;
                var self=element.self;
                if(self)
                {
                    if (!self.isChild(this, e))
                    {
                        self.dropmenu(element, e, element.getAttribute("rel"));
                    }
                }
            }
            );
            fbis.addEvent(this.menuitems[i],"mouseout", function(e)
            {
                e=e||window.event;
                var element=e.target||e.srcElement;
                var self=element.self;
                if(self)
                {
                    self.dynamichide(element, e);
                }
            }
            );
            fbis.addEvent(this.menuitems[i],"click", function(e)
            {
                e=e||window.event;
                var element=e.target||e.srcElement;
                var self=element.self;
                if(self)
                {
                    self.delayhidemenu();
                }
            }
            );
        }
    }
    if (this.iframediv && document.all && !window.XDomainRequest && !this.iframedivadded)
    { 
        this.shimobject=fbis.getobj("iframeshim");
        if(!this.shimobject)
        {
            document.write('<IFRAME id="iframeshim" src="about:blank" frameBorder="0" scrolling="no" style="left:0; top:0; position:absolute; display:none;z-index:90; background: transparent;"></IFRAME>');
            this.shimobject=fbis.getobj("iframeshim");
            this.shimobject.style.filter='progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)'
            this.iframedivadded=true
        }
    }
    this.self=this;
}
CMenu.prototype.showmenu=function(dropmenu, e)
{
    if (this.reveal[0])
    {
        if (!dropmenu._trueheight || dropmenu._trueheight<10)
            dropmenu._trueheight=dropmenu.offsetHeight
        clearTimeout(this.revealtimers[dropmenu.id])
        dropmenu.style.height=dropmenu._curheight=0
        dropmenu.style.overflow="hidden"
        dropmenu.style.visibility="visible";
        var obj=this.self;
        this.revealtimers[dropmenu.id]=setInterval(
            function()
            {
                obj.revealmenu(dropmenu,obj)
            },10);
    }
    else
    {
        dropmenu.style.visibility="visible"
    }
    fbis.addElementCss(this.dropmenuitem, "selected");
}
CMenu.prototype.revealmenu=function(dropmenu,self)
{
    var curh=dropmenu._curheight;
    var maxh=dropmenu._trueheight;
    var steps=self.reveal[1];
    if (curh<maxh)
    {
        var newh=Math.min(curh, maxh)
        dropmenu.style.height=newh+"px"
        dropmenu._curheight= newh + Math.round((maxh-newh)/steps) + 1
    }
    else
    { 
        dropmenu.style.height="auto"
        dropmenu.style.overflow="hidden"
        clearInterval(self.revealtimers[dropmenu.id])
    }
}

CMenu.prototype.clearedge=function(obj, edge)
{
    var offset=0
    if (edge=="rightedge")
    {
        var windowedge=document.all && !window.opera? this.sbody.scrollLeft+this.sbody.clientWidth-15 : window.pageXOffset+window.innerWidth-15
        var dropmenuw=this.dropmenuobj.offsetWidth
        if (windowedge-this.dropmenuobj.x < dropmenuw)
        {
            offset=dropmenuW-obj.offsetWidth;
        }
    }
    else
    {
        var topedge=document.all && !window.opera? this.sbody.scrollTop : window.pageYOffset;
        var windowedge=document.all && !window.opera? this.sbody.scrollTop+this.sbody.clientHeight-15 : window.pageYOffset+window.innerHeight-18;
        var dropmenuh=this.dropmenuobj._trueheight;
        if (windowedge-this.dropmenuobj.y < dropmenuh)
        { 
            offset=dropmenuh+obj.offsetHeight;
            if ((this.dropmenuobj.y-topedge)<dropmenuh)
                offset=this.dropmenuobj.y+obj.offsetHeight-topedge;
        }
    }
    return offset;
}
CMenu.prototype.getOffset=function(obj,type)
{
    var offset=(type=="left")? obj.offsetLeft : obj.offsetTop;
    if(fbis.getOs()!="MSIE")
    {
        var parentEl=obj.offsetParent;
        while (parentEl!=null)
        {
            offset=(type=="left")? offset+parentEl.offsetLeft : offset+parentEl.offsetTop;
            parentEl=parentEl.offsetParent;
        }
    }
    return offset;
}
CMenu.prototype.dropmenu=function(obj, e, dropmenuID)
{
    if (this.dropmenuobj!=null) 
        this.hidemenu();
    this.clearhidemenu();
    this.dropmenuobj=fbis.getobj(dropmenuID);
    this.dropmenuitem=obj;
    this.showmenu(this.dropmenuobj, e)
    this.dropmenuobj.x=this.getOffset(obj, "left");
    this.dropmenuobj.y=this.getOffset(obj, "top");
    this.dropmenuobj.style.left=this.dropmenuobj.x-this.clearedge(obj, "rightedge")+"px"
    this.dropmenuobj.style.top=this.dropmenuobj.y-this.clearedge(obj, "bottomedge")+obj.offsetHeight+1+"px"
    this.positionshim();
}

CMenu.prototype.positionshim=function()
{
    if (this.iframeshimadded)
    {
        if (this.dropmenuobj.style.visibility=="visible")
        {
            this.shimobject.style.width=this.dropmenuobj.offsetWidth+"px"
            this.shimobject.style.height=this.dropmenuobj._trueheight+"px"
            this.shimobject.style.left=parseInt(this.dropmenuobj.style.left)+"px"
            this.shimobject.style.top=parseInt(this.dropmenuobj.style.top)+"px"
            this.shimobject.style.display="block"
        }
    }
}
CMenu.prototype.hideshim=function()
{
    if (this.iframeshimadded)
        this.shimobject.style.display='none';
}

CMenu.prototype.isChild=function(m, e)
{
    var e=window.event || e;
    var srcE=e.relatedTarget || ((e.type=="mouseover")? e.fromElement : e.toElement)
    while (srcE && srcE!=m)
    {
        try
        {
            srcE=srcE.parentNode;
        }
        catch(e)
        {
            srcE=m;
        }
    }
    if (srcE==m)
        return true;
    else
        return false;
}

CMenu.prototype.dynamichide=function(m, e)
{
    if (!this.isChild(m, e))
    {
        this.delayhidemenu()
    }
}

CMenu.prototype.delayhidemenu=function()
{
    var self=this.self;
    this.delayhide=setTimeout(function()
    {
        CMenu.prototype.hidemenu(self);
    }, this.showdelay)
}

CMenu.prototype.hidemenu=function(self)
{
    if(self)
    {
        fbis.removeElementCss(self.dropmenuitem, "selected");
        if(self.dropmenuobj)
        {
            self.dropmenuobj.style.visibility='hidden'
            self.dropmenuobj.style.left=self.dropmenuobj.style.top="-1000px";
        }
        self.hideshim();
    }
}

CMenu.prototype.clearhidemenu=function()
{
    if (this.delayhide!="undefined")
        clearTimeout(this.delayhide);
}
