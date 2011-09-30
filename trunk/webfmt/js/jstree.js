/******************************************************************************
 * $jstree: $
 *
 * $Author:  $
 * 		Berlin Qin
 *
 * $History: jstree.js $
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
function CTreeNode(link,text,img)
{
    this.caption=text;
    this.href=link;
    this.selfimg=(img?img:null);
    this.lev=0;
    this.index=0;
    this.count=0;
    this.allchild={};
    this.parent=null;
    this.prev=null;        
    this.next=null;        
}
CTreeNode.prototype.addChildNode=function(node)
{
    if(this.count>0)
    {
        this.allchild[this.count-1].next=node;
        node.prev=this.allchild[this.count-1];
    }
    node.parent=this;
    node.lev=this.lev+1;
    node.index=this.count;
    this.allchild[this.count]=node;
    this.count++;
}
CTreeNode.prototype.insertBefore=function(node,bnode)
{
    node.next=bnode;
    node.prev=(bnode.index>0?this.allchild[bnode.index-1]:null);
    bnode.prev=node;
    node.index=bnode.index;
    node.parent=this;
    node.lev=this.lev+1;
    //挪位
    for(var i=this.count;i>=bnode.index;i--)
    {
        this.allchild[i]=this.allchild[i-1];
    }
    this.allchild[bnode.index]=node;
    this.count++;
}
function CTree(div,name)
{
    try
    {
        this.view=fbis.getobj(div);
    }
    catch(e)
    {
        alert(e);
    }
    if(this.view)
    {
        this.treeImgfolder="images";
        this.images = {
            rootimg    :"base.gif",         
            leafimg    :"folder.gif",         
            expendimg  :"folderopen.gif",    
            collapseimg:"folder.gif",       
            line	   :"line.gif",        
            join	   :"join.gif",         
            joinBottom :"joinbottom.gif",    
            plus	   :"plus.gif",         
            plusBottom :"plusbottom.gif",    
            minus	   :"minus.gif",        
            minusBottom:"minusbottom.gif",  
            nlPlus	   :"nolines_plus.gif", 
            nlMinus	   :"nolines_minus.gif", 
            empty      :"empty.gif"          
        };
        this.treeroot=new CTreeNode("javascript:void(0)", name);
        this.treeroot.tree=this;
        this.rootnode=null;
        this.selectedNode=null;
        this.hascheck=false;

        this.checkItems={};
        this.tooltip="";
        this.bgimg="";
        this.allowEdit=true; 
        this.allowmsel=false; 
        this.cssname={
            captionClassName  :"caption",          
            selectedClassName :"nodeSelected",    
            nodeClassName     :"sTreeNode",        
            childrenClassName :"clip",             
            treeClass         :"stree"           
        };
        this.events={};
        this.regevts={};
        this.menu=null;
        this.className=this.cssname.treeClass;
        this.regevts["click"]=this.OnClick;
        this.view.tree=this;
        fbis.addEvent(this.view,"click",this.OnClick,false);
        fbis.addEvent(window,"beforeunload",this.OnBeforeUnload,false);
    }
}
CTree.prototype.Line=function(type)
{
    var rev="<img alt=\"\" onmousedown=\"return false;\" src=\""+this.treeImgfolder+"/"+this.images[type]+"\">\n";
    return rev;
}
CTree.prototype.Imgnode=function(type)
{
    var rev="<a href=\"javascript:void(0)\" onfocus=\"this.blur()\">";
    rev=rev+"<img atl=\"\"  src=\""+this.treeImgfolder+"/"+this.images[type]+"\"  ></a>\n";
    return rev;
}
CTree.prototype.labelNode=function(label,type,href,img)
{
    var rev="<img alt=\"\" src=\""+this.treeImgfolder+"/"+(img?img:this.images[type])+"\">\n";
    rev=rev+"<a  onfocus=\"this.blur()\" href=\""+href+"\" class=\""+this.cssname.captionClassName+"\">"+label+"</a>";
    return rev;
}
CTree.prototype.addnode=function(parent,newnode)
{
    if(newnode)
    {
        if(!parent)
        {
            parent=this.treeroot;
        }
        if(parent&&parent.count>0)
        {
            parent.allchild[parent.count-1].next=newnode;
            newnode.prev=parent.allchild[parent.count-1];
        }
        newnode.parent=parent;
        newnode.lev=parent.lev+1;
        newnode.index=parent.count;
        parent.allchild[parent.count]=newnode;
        parent.count++;
    }
}
CTree.prototype.addPopMenu=function(menu)
{
    if(menu)
    {
        this.menu=menu;
    }
}
CTree.prototype.arrayToNode=function(parent,array)
{
    if(fbis.IsArray(array))
    {
        for(var i=0;i<array.length;i++)
        {
            var node=new CTreeNode("javascript:void(0)", array[i].name,null);
            node.folder=array[i].dir;
            this.addnode(parent, node);
            if(fbis.IsArray(array[i].subfolder)&&(array[i].subfolder.length>0))
            {
                this.arrayToNode(node,array[i].subfolder);
            }
        }
    }
}
CTree.prototype.getdata=function()
{
    return this.treeroot;
}
CTree.prototype.makenode=function(node)
{
    var result={};
    if(node)
    {
        var id="tn"+node.lev+(node.parent?node.parent.index:0)+node.index;
        result[0]=fbis.createElement("div",{
            "class":this.cssname.nodeClassName,
            "id":id
        });
        if(result[0])
        {
            if(this.menu)
            {
                this.menu.attach(result[0]);
            }
            var nodehtml="";
            if(node!=this.treeroot)
            {
                var tempnode=node.parent;
                var fullimgs=new Array();
                while(tempnode!=this.treeroot)
                {
                    if(tempnode.next)
                    {
                        fullimgs.push(this.Line("line"));
                    }
                    else
                    {
                        fullimgs.push(this.Line("empty"));
                    }
                    tempnode=tempnode.parent;
                }
                fullimgs.reverse();
                nodehtml=nodehtml+fullimgs.join("\n");
                if(node.next)
                {
                    nodehtml=nodehtml+(node.count>0?this.Imgnode("minus"):this.Line("join"));
                }
                else
                {
                    nodehtml=nodehtml+(node.count>0?this.Imgnode("minusBottom"):this.Line("joinBottom"));
                }
            }
            var imgtype=(node==this.treeroot?"rootimg":(node.count>0?"expendimg":"leafimg"));
            nodehtml=nodehtml+this.labelNode(node.caption,imgtype,node.href,node.selfimg);
            result[0].innerHTML=nodehtml;
            result[0].data=node;
            result[0].enabled=true;
            result[0].bexpand=true;
            result[0].hasSelected=false;
            result[0].hasCheck=false;
            result[0].childrenObj=null;
            result[0].parentObj=null;
            result[0].tree=this;
            if(node.count>0)
            {
                result[1]=fbis.createElement("div",{
                    "class":this.cssname.childrenClassName,
                    "style":"display: block;"
                });
                if(result[1])
                {
                    if(this.menu)
                    {
                        this.menu.attach(result[1]);
                    }
                    result[0].childrenObj=result[1];
                    var cnode={};
                    for(var i=0;i<node.count;i++)
                    {
                        cnode=this.makenode(node.allchild[i]);
                        if(cnode[0])
                        {
                            result[1].appendChild(cnode[0]);
                            cnode[0].parentObj=result[0];
                        }
                        if(cnode[1])
                        {
                            result[1].appendChild(cnode[1]);
                        }
                    }
                }
            }
        }
    }
    return result;
}
CTree.prototype.show=function(imgfdlr,sstyle,treedata)
{
    if(imgfdlr)
    {
        this.images=imgfdlr;
    }
    if(sstyle)
    {
        this.cssname=sstyle;
    }
    if(treedata)
    {
        this.treeroot=treedata;
    }
    this.view.innerHTML="";
    this.rootnode=this.makenode(this.treeroot);
    if(this.rootnode)
    {
        if(this.rootnode[0])
        {
            this.view.appendChild(this.rootnode[0]);
        }
        if(this.rootnode[1])
        {
            this.view.appendChild(this.rootnode[1]);
        }
    }
    this.select(this.rootnode);
}
CTree.prototype.expands=function(node)
{
    var cnode=node.childrenObj;
    if(cnode)
    {
        cnode.style.display="block";  
        if(node!=this.rootnode)
        {
            var imgbutton=node.children[node.children.length-3].firstChild;
            if(imgbutton)
            {
                var type="minusBottom";
                if(node.data.next)
                {
                    type="minus";
                }
                imgbutton.src=this.treeImgfolder+"/"+this.images[type];
            }
            if((!node.selfimg)||(node.selfimg==""))
                node.children[node.children.length-2].src=this.treeImgfolder+"/"+this.images.expendimg;
        }
        var dnode=cnode.firstChild;
        while(dnode.childrenObj)
        {
            this.expands(dnode);
            dnode=dnode.nextSibling;
        }
    }
}
CTree.prototype.expandNode=function(node)
{
    if(node)
    {
        var cnode=node.childrenObj;
        if(cnode)
        {
            cnode.style.display="block";
            var imgbutton=node.children[node.children.length-3].firstChild;
            if(imgbutton)
            {
                var type="minusBottom";
                if(node.data.next)
                {
                    type="minus";
                }
                imgbutton.src=this.treeImgfolder+"/"+this.images[type];
            }
            if((!node.selfimg)||(node.selfimg==""))
                node.children[node.children.length-2].src=this.treeImgfolder+"/"+this.images.expendimg;
            node.bexpand=true;
        }
    }
}
CTree.prototype.collapseNode=function(node)
{
    if(node)
    {
        var cnode=node.childrenObj;
        if(cnode)
        {
            try
            {
                cnode.style.display="none";
                var imgbutton=node.children[node.children.length-3].firstChild;
                if(imgbutton)
                {
                    var type="plusBottom";
                    if(node.data.next)
                    {
                        type="plus";
                    }
                    imgbutton.src=this.treeImgfolder+"/"+this.images[type];
                }
                if((!node.selfimg)||(node.selfimg==""))
                    node.children[node.children.length-2].src=this.treeImgfolder+"/"+this.images.collapseimg;
                node.bexpand=false;
            }
            catch(e)
            {
            }
        }
    }
}
CTree.prototype.delNode=function(node)
{
    if(node&&(node!=this.rootnode)&&this.allowEdit)
    {
        var bdel=true;
        if(this.events["OnItemDeleteBefor"]&&typeof this.events["OnItemDeleteBefor"]=="function")
        {
            bdel=this.events["OnItemDeleteBefor"](this,node);
        }
        if(bdel)
        {
            if(node.data.prev)
            {
                node.data.prev.next=node.data.next;
            }
            if(node.data.next)
            {
                node.data.next=node.data.prev;
            }
            if(node.data.parent)
            {
                for(var i=node.data.index;i<node.data.parent.count-1;i++)
                {
                    node.data.parent.allchild[i+1].index--;
                    node.data.parent.allchild[i]=node.data.parent.allchild[i+1];
                }
                node.data.parent.allchild[node.data.parent.count-1]=undefined;
                node.data.parent.count--;
            }
            if(this.events["OnItemDeleteAfter"]&&typeof this.events["OnItemDeleteAfter"]=="function")
            {
                bdel=this.events["OnItemDeleteAfter"](this,node);
            }
            this.show();
        }
    }
}
CTree.prototype.select=function(node)
{
    if(node)
    {
        if(node.className==this.cssname.nodeClassName)
        {
            this.unselect();
            node.lastChild.className=this.cssname.selectedClassName;
            this.selectedNode=node;
        }
    }
}
CTree.prototype.unselect=function()
{
    if(this.selectedNode)
    {
        if(this.selectedNode!=this.rootnode)
        {
            if(this.selectedNode.lastChild)
            {
                this.selectedNode.lastChild.className=this.cssname.captionClassName;
            }
        }
        this.selectedNode=null;
    }
}
CTree.prototype.getSelected=function()
{
    return this.selectedNode;
}
CTree.prototype.getSelectedData=function()
{
    if(this.selectedNode)
    {
        return this.selectedNode.data;
    }
    return null;
}

CTree.prototype.atachEvent=function(evntype,eventfun)
{
    if(evntype&&typeof eventfun=="function")
    {
        this.events[evntype]=eventfun;
        switch(evntype)
        {
            case "OnDbClick":
            case "OnItemDbClick":
            case "OnItemBeforEdit":
            case "OnItemKeyPress":
            {
                if(!this.regevts["dbclick"])
                {
                    fbis.addEvent(this.view,"dbclick",this.OnDbClick,false);
                    this.regevts["dbclick"]=this.OnDbClick;
                }
            }
            break;
            case "OnMouseMove":
            case "OnItemMouseMove":
            {
                if(!this.regevts["mousemove"])
                {
                    fbis.addEvent(this.view,"mousemove",this.OnMouseMove,false);
                    this.regevts["mousemove"]=this.OnMouseMove;
                }
            }
            break;
            case "OnMouseOut":
            case "OnItemMouseOut":
            {
                if(!this.regevts["mouseout"])
                {
                    fbis.addEvent(this.view,"mouseout",this.OnMouseOut,false);
                    this.regevts["mouseout"]=this.OnMouseOut;
                }
            }
            break;
            case "OnMouseDown":
            case "OnItemMouseDown":
            {
                if(!this.regevts["mousedown"])
                {
                    fbis.addEvent(this.view,"mousedown",this.OnMouseDown,false);
                    this.regevts["mousedown"]=this.OnMouseDown;
                }
            }
            break;
            case "OnMouseUp":
            case "OnItemMouseUp":
            {
                if(!this.regevts["mouseup"])
                {
                    fbis.addEvent(this.view,"mouseup",this.OnMouseUp,false);
                    this.regevts["mouseup"]=this.OnMouseUp;
                }
            }
            break;
            case "OnMouseEnter":
            case "OnItemMouseEnter":
            {
                if(!this.regevts["mouseup"])
                {
                    fbis.addEvent(this.view,"mouseenter",this.OnMouseEnter,false);
                    this.regevts["mouseenter"]=this.OnMouseEnter;
                }
            }
            break;
            case "OnMouseLeave":
            case "OnItemMouseLeave":
            {
                if(!this.regevts["mouseleave"])
                {
                    fbis.addEvent(this.view,"mouseleave",this.OnMouseLeave,false);
                    this.regevts["mouseleave"]=this.OnMouseLeave;
                }
            }
            break;
            case "OnMouseOver":
            case "OnItemMouseOver":
            {
                if(!this.regevts["mouseover"])
                {
                    fbis.addEvent(this.view,"mouseover",this.OnMouseOver,false);
                    this.regevts["mouseover"]=this.OnMouseOver;
                }
            }
            break;
            case "OnKeyDown":
            case "OnItemKeyDown":
            {
                if(!this.regevts["keydown"])
                {
                    fbis.addEvent(this.view,"keydown",this.OnKeyDown,false);
                    this.regevts["keydown"]=this.OnKeyDown;
                }
            }
            break;
            case "OnKeyUp":
            case "OnItemKeyUp":
            {
                if(!this.regevts["keyup"])
                {
                    fbis.addEvent(this.view,"keyup",this.OnKeyDown,false);
                    this.regevts["keyup"]=this.OnKeyDown;
                }
            }
            break;
        }

    }
}
CTree.prototype.OnBeforeUnload=function()
{
    for(var evt in this.regevts)
    {
        fbis.removeEvent(this.view,evt,this.regevts[evt]);
    }
    fbis.removeEvent(window,"unload",this.OnBeforeUnload);
}
CTree.prototype.IsItem=function(oEvent,self)
{
    var id=fbis.getEventAttrVal(oEvent,"id");
    return id!=self.id;
}
CTree.prototype.OnClick=function(oEvent)
{
    try
    {
        oEvent=oEvent||window.event;
        var id=fbis.getEventAttrVal(oEvent||event,"id");
        if(id)
        {
            var obj=fbis.getobj(id);
            var element=oEvent.target||oEvent.srcElement;
            var self=obj.tree;       
            if(obj&&self.IsItem(oEvent||event,this))
            {
                if(this.isEditing)
                {
                //this.EndEdting();
                }
                if(element&&(element.tagName=="IMG"))
                {
                    if(obj.childrenObj)
                    {
                        if(obj.bexpand)
                        {
                            self.collapseNode(obj);
                        }
                        else
                        {
                            self.expandNode(obj);
                        }
                    }
                }
                if(element&&(element.tagName=="A"))
                {
                    var ballow=true;
                    if(self.events["OnItemSelected"]&&typeof self.events["OnItemSelected"]=="function")
                    {
                        ballow=self.events["OnItemSelected"](oEvent,obj);
                    }
                    if(ballow)
                    {
                        self.select(obj);
                    }
                }
                if(self.events["OnItemClick"]&&typeof self.events["OnItemClick"]=="function")
                {
                    self.events["OnItemClick"](oEvent,obj);
                }
            }
        }
    }
    catch(e)
    {
    }
}
CTree.prototype.OnDbClick=function(oEvent)
{
    try
    {
        var id=fbis.getEventAttrVal(oEvent||event,"id");
        if(id)
        {
            var obj=fbis.getobj(id);
            var self=this.self;
            if(obj&&self.IsItem(oEvent||event,this)) 
            {
                if(self.events["OnItemDbClick"]&&typeof self.events["OnItemDbClick"]=="function")
                {
                    self.events["OnItemDbClick"](oEvent,this.data,obj);
                }
            }
            if(self.events["OnDbClick"]&&typeof self.events["OnDbClick"]=="function")
            {
                self.events["OnDbClick"](oEvent,this);
            }
        }
    }
    catch(e)
    {
    }
}
CTree.prototype.MouseEvent=function(oEvent,Itemtype,selftype,src)
{
    try
    {
        var id=fbis.getEventAttrVal(oEvent||event,"id");
        if(id)
        {
            var obj=fbis.getobj(id);
            if(obj&&src.IsItem(oEvent||event,src))
            {
                if(this.self.events[Itemtype]&&typeof src.events[Itemtype]=="function")
                {
                    src.events[Itemtype](oEvent,src.data,obj);
                }
            }
            else
            {
                if(src.events[selftype]&&typeof src.events[selftype]=="function")
                {
                    src.events[selftype](oEvent,src);
                }
            }
        }
    }
    catch(e)
    {
    }

}
CTree.prototype.OnMouseMove=function(oEvent)
{
    this.MouseEvent(oEvent, "OnItemMouseMove","OnMouseMove", this);
}
CTree.prototype.OnMouseOut=function(oEvent)
{
    this.MouseEvent(oEvent, "OnItemMouseOut","OnMouseOut", this);
}
CTree.prototype.OnMouseDown=function(oEvent)
{
    this.MouseEvent(oEvent, "OnItemMouseDown","OnMouseDown", this);
}
CTree.prototype.OnMouseUp=function(oEvent)
{
    this.MouseEvent(oEvent, "OnItemMouseUp","OnMouseUp", this);
}
CTree.prototype.OnMouseEnter=function(oEvent)
{
    this.MouseEvent(oEvent, "OnItemMouseEnter","OnMouseEnter", this);
}
CTree.prototype.OnMouseLeave=function(oEvent)
{
    this.MouseEvent(oEvent, "OnItemMouseLeave","OnMouseLeave", this);
}
CTree.prototype.OnMouseOver=function(oEvent)
{
    this.MouseEvent(oEvent, "OnItemMouseOver","OnMouseOver", this);
}
//OnKeyDown
CTree.prototype.OnKeyDown=function(oEvent)
{
    this.MouseEvent(oEvent, "OnItemKeyDown","OnKeyDown", this);
}
CTree.prototype.OnKeyUp=function(oEvent)
{
    this.MouseEvent(oEvent, "OnItemKeyUp","OnKeyUp", this);
}
CTree.prototype.OnBeforeUnload=function()
{
    for(var evt in this.regevts)
    {
        fbis.removeEvent(this.view,evt,this.regevts[evt]);
    }
// fbis.removeEvent(window,"unload",this.OnBeforeUnload);
}
