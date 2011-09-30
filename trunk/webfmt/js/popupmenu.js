/******************************************************************************
 * $popupmenu: $
 *
 * $Author:  $
 * 		Berlin Qin
 *
 * $History: popumenu.js $
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

function CPopMenu()
{
    this.items= []; 
    this.width  = 0;
    this.height = 0;
    this.id="";
    this.rightarrow="../images/menu_parent.gif";
    this.cssname={
        menuClassName  :"popmenu",           
        menuTitle      :"menuItem",         
        onmouseClassName :"menuMouseover",     
        outmouseClassName:"menuMouseout",      
        separator:"menuSeparator"      
    };
}
CPopMenu.current = null;
CPopMenu.prototype.setsize=function(width, height)
{
    this.width  = width;
    this.height = height;
    if (this.element)
    {
        var self = this;
        with (this.element.style)
        {
            if (self.width)
                width  = self.width  + 'px';
            if (self.height)
                height = self.height + 'px';
            }
    }
}
CPopMenu.prototype.attach=function(element)
{
    var self = this;
    if (!element)
    {
        element = document;
    }
    else if (typeof element == 'string')
    {
        element = fbis.getobj(element);
    }
    this.target = element;
    this.target.oncontextmenu = function(e)
    {
        self.popup.call(self, e);
        return false;
    };
    var listener = function()
    {
        self.hide.call(self)
    };
    fbis.addEvent(document, 'click', listener, true);
}
CPopMenu.prototype.additem=function(parent,text,click,bseparator,url,img,radiobox,checkbox)
{
    var item=new CItem(url, text, click, img, bseparator, radiobox, checkbox);
    this.addItem(item, parent);
}
CPopMenu.prototype.addItem=function(Item,parent)
{
    if(Item)
    {
        if(!parent)
        {
            if(this.items.length>0)
            {
                Item.prev=this.items[this.items.length-1];
                this.items[this.items.length-1].next=Item;
            }
            this.items.push(Item);
        }
        if(parent&&parent.count>0)
        {
            parent.children[parent.count-1].next=Item;
            Item.prev=parent.children[parent.count-1];
            Item.parent=parent;
            Item.lev=parent.lev+1;
            Item.index=parent.count;
            parent.children[parent.count]=Item;
            parent.count++;
        }
    }
}
CPopMenu.prototype.getItems=function()
{
    return this.items;
}
CPopMenu.prototype.setpos=function(e)
{
    if (!this.element)
        return;
    if (!e)
        e = window.event;
    var x, y;
    if (window.opera)
    {
        x = e.clientX;
        y = e.clientY;
    }
    else if (document.all)
    {
        x = document.body.scrollLeft + event.clientX;
        y = document.body.scrollTop + event.clientY;
    }
    else if (document.layers || document.getElementById)
    {
        x = e.pageX;
        y = e.pageY;
    }
    this.element.style.top  = y + 'px';
    this.element.style.left = x + 'px';
}
CPopMenu.prototype.popup=function(e)
{
    if (CPopMenu.current && CPopMenu.current != this)
        return;
    CPopMenu.current = this;
    if (this.element)
    {
        this.setpos(e);
        this.element.style.display = 'block';
    }
    else
    {
        this.element = this.createMenu(this.items);
        this.setpos(e);
        document.body.appendChild(this.element);
    }
}
CPopMenu.prototype.hide=function()
{
    CPopMenu.current = null;
    if (this.element)
        this.element.style.display = 'none';
}
CPopMenu.prototype.createMenu=function(items)
{
    var self = this;
    var id="popumenu_"+fbis.getuniqid();
    var menu = fbis.createElement('div',{
        "id":id,
        "class":this.cssname.menuClassName
    });
    if(menu)
    {
        menu.self=this;
        this.id=id;
        if (self.width)
            menu.style.width  = self.width  + 'px';
        if (self.height)
            menu.style.height = self.height + 'px';
    }
    for (var i = 0; i < items.length; i++)
    {
        var item=null;
        if (items[i].bseparator)
        {
            item = this.createseparator();
        }
        else
        {
            item = this.createItem(items[i]);
        }
        menu.appendChild(item);
    }
    return menu;
}
CPopMenu.prototype.createItem= function(item)
{
    //var self = this;
    var id="popumenu_"+fbis.getuniqid();
    var elem = fbis.createElement('div',{
        "id":id,
        "class":this.cssname.menuTitle
    });
    if(elem)
    {
        elem.self=this;
        item.id=id;
        item.obj=elem;
        var html="";
        if(item.radiobox)
        {
            html=html+"<input name='"+id+"_radio' type='radio' />\r\n";
        }
        else if(item.checkbox)
        {
            html=html+"<input name='"+id+"_check' type='checkbox' />\r\n";
        }
        if(item.img)
        {
            html=html+"<img src='"+item.image+"' alt=''/>\r\n";
        }
        html=html+item.caption;
        elem.style.padding = '1px';
        if(item.count>0)
        {
            html=html+"<img src='"+this.rightarrow+"' alt='' />";
            var childmenu=this.createMenu(item);
            if(childmenu)
            {
                elem.childOjb=childmenu;
                fbis.addEvent(elem, 'mouseover', function(e)
                {
                    e=e||window.event;
                    var element=e.target||e.srcElement;
                    //element.style.background = '#B6BDD2';
                    var self=element.self;
                    if(self)
                    {
                        fbis.addElementCss(element,self.cssname.onmouseClassName);
                        if (self.childObj)
                        {
                            self.dropmenu(element, e, self.childObj);
                        }
                    }
                }, true);
                fbis.addEvent(elem, 'mouseout', function(e) 
                {
                    e=e||window.event;
                    var element=e.target||e.srcElement;
                    //element.style.background = '#FFFFFF';
                    var self=element.self;
                    if(self)
                    {
                        fbis.removeElementCss(element,self.cssname.onmouseClassName);
                        self.hidemenu(self.childOjb);
                    }
                }, true);
            }
        }
        else
        {
            var callback = item.onclick;
            fbis.addEvent(elem, 'click',callback, false);
            fbis.addEvent(elem, 'mouseover', function(e)
            {
                e=e||window.event;
                var element=e.target||e.srcElement;
                //element.style.background = '#FFFFFF';
                var self=element.self;
                fbis.addElementCss(element,self.cssname.onmouseClassName);
            }, true);
            fbis.addEvent(elem, 'mouseout', function(e) 
            {
                e=e||window.event;
                var element=e.target||e.srcElement;
                //element.style.background = '#FFFFFF';
                var self=element.self;
                fbis.removeElementCss(element,self.cssname.onmouseClassName);
            }, true);
        }
        
        elem.innerHTML=html;
    }
    return elem;
}
CPopMenu.prototype.createseparator= function()
{
    var sep = fbis.createElement('hr',{
        "class":this.cssname.separator
    });
    return sep;
}
CPopMenu.prototype.dropmenu=function(menu,self,submenu)
{
    if(menu&&submenu&&self)
    {
        var pos=fbis.offset(menu);
        submenu.x=pos.x,
        submenu.y=pos.y;
        submenu.style.left=submenu.x+submenu.offsetWidth+"px";
        submenu.style.top=submenu.y+"px";
        submenu.style.display="block";
    }
}
CPopMenu.prototype.hidemenu=function(menu)
{
    if(menu)
    {
        menu.style.display="none";
    }
}



