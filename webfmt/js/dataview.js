/******************************************************************************
 * $dataview: $
 *
 * $Author:  $
 * 		Berlin Qin
 *
 * $History: dataview.js $
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

CDataView.name="CDataView";
CDataView.version="0.0.1";
CDataView.author="berlin.Qin";
CDataView.contact="kingbirdhead@gmail.com";
CDataView.website="www.snsbcms.com";
CDataView.lastmodify="2011-04-10";
//CDataView.prototype.ItemTemplate="";       //显示模板
//CDataView.prototype.ItemEditTemplate="";   //编辑模板
//CDataView.prototype.loadTemplate="";       //数据加载模板
CDataView.defaultDType={
    "name"   : "default",
    "class"  :"dhx_dataview_ficon_item",
    "width"  :100,           //显示宽度
    "height" : 100,          //显示高度
    "margin" : 1,
    "padding": 0,
    "selcss":"dhx_dataview_ficon_item_selected",
    "show":function(dobj)
    {
        var rev="<div align=\"center\">\n<img onmousedown='return false;' border='0' src='images/icons/32/doc.gif' >\n";
        rev=rev+"<div class=\"dhx_item_text\">";
        if(dobj)
        {
            rev=rev+(typeof dobj.value!="undefined"?dobj.value:dobj.text);
        }
        rev=rev+"</div>\n</div>\n";
        return rev;
    },
    "edit":function(dobj)
    {
        var rev="<div style='padding:10px; white-space:nowrap; overflow:hidden;'>\n ";
        rev=rev+"<textarea style='width:100%; height:100%;' >"
        if(dobj)
        {
            rev=rev+(typeof dobj.value!="undefined"?dobj.value:dobj.text);
        }
        rev=rev+"</textarea>\n</div>\n";
        return rev;
    }
};

CDataView.prototype.AddDisptypes=function(name,dispObj)
{
    this.allDisptypes[name]=dispObj;
}
CDataView.prototype.AddPopMenu=function(menu)
{
    if(menu)
    {
        this.menu=menu;
    }
}
/////////////////////////////////////////////////
//添加一个节点
//为view填充数据,Item对象数组或单个数据
CDataView.prototype.AddItem=function(Item)
{
    if(Item)
    {
        if(fbis.IsArray(Item))
        {
            this.Items.data=this.Items.data.concat(Item);
        }
        else
        {
            this.Items.data.push(Item);
        }
        this.show();
    }
}
//删除一个节点或多个节点,index可以是单个值，也可以是数组
CDataView.prototype.RemoveItem=function(index)
{
    if(typeof index!="undefined")
    {
        if(fbis.IsArray(index))
        {
            for(var i=0;i<index.length;i++)
            {
                this.Items.data.splice(index[i],1);
            }
        }
        else
        {
            this.Items.data.splice(index,1);
        }
        this.show();
    }
}
////插入一个节点或多个,item可是单个值，也可以是数组
CDataView.prototype.Insert=function(index,item)
{
    this.Items.data.splice(index,0,item);
    this.show();
}
//清空视图
CDataView.prototype.clear=function()
{
    this.Items.data=[];
    this.Items.allNodes=[];
    this.view.innerHTML="";
}

//查找一个对象
CDataView.prototype.find=function(item,comp)
{
    }
//输出所有对象
CDataView.prototype.echo=function(print)
{
    if(typeof print=="function")
    {
        for(var i=0;i<count;i++)
        {
            print(this.Items.allNodes[i].toString());
        }
    }
}
CDataView.prototype.get=function(index)
{
    return this.Items.data[index];
}
//ortby 若a小于 b，在排序后的数组中 a 应该出现在 b 之前，则返回一个小于 0 的值,等于返回0，大于返回1
CDataView.prototype.sort=function(sortby)
{
    if(sortby&&typeof sortby=="function")
    {
        this.Items.data.sort(sortby);
        this.Items.allNodes.sort(sortby);
    }
}
CDataView.prototype.getcount=function()
{
    return this.Items.data.length;
}
//刷新数据
CDataView.prototype.show=function(dtype)
{
    var icount=this.getcount();
    if(icount>0)
    {
        if(dtype)
        {
            this.dstype=dtype;
        }
        else
        {
            dtype=this.dstype;
        }
        //根据item生成html代码
        //获取div宽度
        var dw=this.view.offsetWidth;
        //获取item的宽度
        var iw=this.allDisptypes[dtype].width;
        //计算需要的layout
        //if(iw>0)
        {
            this.view.innerHTML="";
            this.Items.allNodes.splice(0);
            var nlayout=1;
            if(iw!="100%")
            {
                nlayout=parseInt(dw/parseInt(iw));
            }
            var htmlstr="";
            var height=this.allDisptypes[dtype].height;
            var icss=this.allDisptypes[dtype]["class"];
            var layarr={
                "style":"height:"+height+";width:100%;overflow:hidden;"
            };
            var itemattr={
                "class":this.ItemClass+" "+icss,
                "style":"width:"+iw+";height:"+(parseInt(height)-2)+"px;"
            //+height+"; padding: 0px; margin: 1px; float: left;overflow:hidden;"
            };
            //生成items
            for(var i=0;i<icount;i=i+nlayout)
            {
                //htmlstr=htmlstr+"<div style=\"height:"+height+"px; width: 100%; overflow: hidden;\">\n";
                var lay=fbis.createElement("div",layarr);
                if(lay)
                {
                    for(var j=0;j<nlayout;j++)
                    {
                        //htmlstr=htmlstr+"<div class=\""+this.ItemClass+" "+icss+"\" style=\"width: "+iw+"px; height: "
                        //+height+"px; padding: 0px; margin: 1px; float: left; \" id=\"Item_"
                        // +(i+j)+"\">";
                        if(i+j>=icount)
                        {
                            break;
                        }
                        //控制居中position: absolute;position: static !important;
                        htmlstr="<div style=\" position: static !important;#position:absolute;#top: 50%; width:"+iw+" \">\n \
                            <div align=\"center\" style=\"#position: relative;#top: -50%;border:2px solid transparent;width:"+iw+"\">\n";
                        htmlstr=htmlstr+this.allDisptypes[dtype].show(this.Items.data[i+j])+"</div>\n</div>\n";
                        itemattr["id"]=this.id+"_Item_"+(i+j);
                        var item=fbis.createElement("div",itemattr,htmlstr);
                        if(item)
                        {
                            if(this.menu)
                            {
                                this.menu.attach(item);
                            }
                            item.cindex=i+j;
                            item.isEditing=false;
                            item.hasSelected=false;
                            item.self=this;
                            //CHtml.extend(item,this.Items.data[i+j])
                            //CHtml.addEvent(item,"click",CDataView.onclick);
                            lay.appendChild(item);
                            this.Items.allNodes.push(item);
                        }
                    //htmlstr=htmlstr+"</div>\n";
                    }
                    this.view.appendChild(lay);
                    if(i+j>=icount)
                    {
                        break;
                    }
                }
            //htmlstr=htmlstr+"</div>\n";
            }
        //this.Ob.innerHTML=htmlstr;
        }
    }
}
CDataView.prototype.atachEvent=function(evntype,eventfun)
{
    if(evntype&&typeof eventfun=="function")
    {
        this.events[evntype]=eventfun;
        switch(evntype)
        {
            case "OnClick":
            case "OnItemClick":
            case "OnItemSelected":
            case "OnItemAfterEdit":
            {
                if(!this.regevts["click"])
                {
                    fbis.addEvent(this.view,"click",this.OnClick,false);
                    this.regevts["click"]=this.OnClick;
                }
            }
            break;
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
//选择
CDataView.prototype.getselcount=function()
{
    return this.selects.length;
}
CDataView.prototype.getselectObj=function()
{
    var result=new Array();
    for(var i=0;i<this.selects.length;i++)
    {
        result.push(this.Items.data[this.selects[i]]);
    }
    return result;
}
CDataView.prototype.getselectElv=function()
{
    var result=new Array();
    for(var i=0;i<this.selects.length;i++)
    {
        result.push(this.Items.allNodes[this.selects[i]]);
    }
    return result;
}
CDataView.prototype.select=function(indexs)
{
    var sels=new Array(),i=0;
    if(typeof indexs!="undefined")
    {
        if(fbis.IsArray(indexs))
        {
            //this.selects.splice(0);
            for(i=0;i<indexs.length;i++)
            {
                this.selects.push(indexs[i]);
            }
            sels.concat(indexs);
        }
        else
        {
            sels.push(indexs);
            this.selects.push(indexs);
        }
    }
    else if(this.selmod=="multiselect")
    {
        this.selects=[];
        for(i=0;i<this.Items.allNodes.length;i++)
        {
            sels.push(i);
            this.selects.push(i);
        }
    }
    for(i=0;i<sels.length;i++)
    {
        var obj=this.Items.allNodes[sels[i]];
        obj.hasSelected=true;
        fbis.removeElementCss(obj,this.allDisptypes[this.dstype]["class"] );
        fbis.addElementCss(obj,this.allDisptypes[this.dstype].selcss );
    }
    return sels.length;
}
CDataView.prototype.unselect=function(indexs)
{
    var sels=new Array(),i=0;
    if(typeof indexs!="undefined")
    {
        if(fbis.IsArray(indexs))
        {
            sels=indexs;
        }
        else
        {
            sels.push(indexs);
        }
        for(var j=0;j<this.selects.length;j++)
        {
            for(i=0;i<sels.length;i++)
            {
                if(this.selects[j]==sels[i])
                {
                    this.selects.splice(j,1);
                }
            }
        }
    }
    else
    {
        for(i=0;i<this.selects.length;i++)
        {
            sels.push(this.selects[i]);
        }
        this.selects=[];
    }
    for(i=0;i<sels.length;i++)
    {
        var obj=this.Items.allNodes[sels[i]];
        obj.hasSelected=false;
        fbis.removeElementCss(obj,this.allDisptypes[this.dstype].selcss);
        fbis.addElementCss(obj,this.allDisptypes[this.dstype]["class"] );
    }
    return sels.length;
}

//判断事件发生的对象是不是item
CDataView.prototype.IsItem=function(oEvent,self)
{
    var id=fbis.getEventAttrVal(oEvent,"id");
    return id!=self.id;
}
CDataView.prototype.OnClick=function(oEvent)
{
    try
    {
        var element=oEvent.target||oEvent.srcElement;
        //var self=element.self;
        var id=fbis.getEventAttrVal(oEvent||event,"id");
        //alert("click id:"+id+" this:"+this.id);
        if(id)
        {
            var obj=fbis.getobj(id);
            var self=obj.self;
            if(obj&&CDataView.prototype.IsItem(oEvent||event,self)) //在item上点击
            {
                if(self.isEditing)
                {
                //取消编辑状态
                //this.EndEdting();
                }
                if(obj.hasSelected)
                {
                    //取消选择状态
                    if(self.selects.length==1||oEvent.ctrlKey)
                    {
                        self.unselect(obj.cindex);
                    }
                    //else
                    {
                        self.unselect();
                        self.select(obj.cindex);
                    }
                }
                else
                {
                    //判断是否有选择项？
                    var ballow=true;
                    //var self=this.self;
                    //var sthis=this;
                    if( (self.selects.length<1)||(self.selmod=="multiselect"&&oEvent.ctrlKey))
                    {
                        if(self.events["OnItemSelected"]&&typeof self.events["OnItemSelected"]=="function")
                        {
                            ballow=self.events["OnItemSelected"](oEvent,self.Items.data[obj.cindex],obj);
                        }
                        if(ballow)
                        {
                            self.select(obj.cindex);
                        }
                    }
                    else
                    {
                        if(self.events["OnItemSelected"]&&typeof self.events["OnItemSelected"]=="function")
                        {
                            ballow=self.events["OnItemSelected"](oEvent,self.Items.data[obj.cindex],obj);
                        }
                        if(ballow)
                        {
                            self.unselect();
                            self.select(obj.cindex);
                        }
                    }
                }
                //向下传递onitemclick事件
                if(self.events["OnItemClick"]&&typeof self.events["OnItemClick"]=="function")
                {
                    self.events["OnItemClick"](oEvent,self.Items.data[obj.cindex],obj);
                }
            }
            else
            {
                self.unselect();
                //传递控件onclick事件
                if(self.events["OnClick"]&&typeof self.events["OnClick"]=="function")
                {
                    self.events["OnClick"](oEvent,self);
                }
            }
        }
    }
    catch(e)
    {
    }
}
CDataView.prototype.OnDbClick=function(oEvent)
{
    try
    {
        var id=fbis.getEventAttrVal(oEvent||event,"id");
        if(id)
        {
            var obj=fbis.getobj(id);
            var self=obj.self;
            if(obj&&self.IsItem(oEvent||event,self)) //在item上点击
            {
                if(obj.isEding)
                {
                    return;
                }
                if(this.self.allowEdit)
                {
                //设为编辑状态
                }
                else
                {
                    if(self.events["OnItemDbClick"]&&typeof self.events["OnItemDbClick"]=="function")
                    {
                        self.events["OnItemDbClick"](oEvent,self.Items.data[obj.cindex],obj);
                    }
                }
            }
            if(self.events["OnDbClick"]&&typeof self.events["OnDbClick"]=="function")
            {
                self.events["OnDbClick"](oEvent,self);
            }
        }
    }
    catch(e)
    {
    }
}
CDataView.prototype.MouseEvent=function(oEvent,Itemtype,selftype,src)
{
    try
    {
        var id=fbis.getEventAttrVal(oEvent||event,"id");
        if(id)
        {
            var obj=fbis.getobj(id);
            if(obj&&src.IsItem(oEvent||event,src))
            {
                if(src.events[Itemtype]&&typeof src.events[Itemtype]=="function")
                {
                    src.events[Itemtype](oEvent,src.Items.data[obj.cindex],obj);
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
CDataView.prototype.OnMouseMove=function(oEvent)
{
    this.MouseEvent(oEvent, "OnItemMouseMove","OnMouseMove", this.self);
}
CDataView.prototype.OnMouseOut=function(oEvent)
{
    this.MouseEvent(oEvent, "OnItemMouseOut","OnMouseOut", this.self);
}
CDataView.prototype.OnMouseDown=function(oEvent)
{
    this.MouseEvent(oEvent, "OnItemMouseDown","OnMouseDown", this.self);
}
CDataView.prototype.OnMouseUp=function(oEvent)
{
    this.MouseEvent(oEvent, "OnItemMouseUp","OnMouseUp", this.self);
}
CDataView.prototype.OnMouseEnter=function(oEvent)
{
    this.MouseEvent(oEvent, "OnItemMouseEnter","OnMouseEnter", this.self);
}
CDataView.prototype.OnMouseLeave=function(oEvent)
{
    this.MouseEvent(oEvent, "OnItemMouseLeave","OnMouseLeave", this.self);
}
CDataView.prototype.OnMouseOver=function(oEvent)
{
    this.MouseEvent(oEvent, "OnItemMouseOver","OnMouseOver", this.self);
}
//OnKeyDown
CDataView.prototype.OnKeyDown=function(oEvent)
{
    this.MouseEvent(oEvent, "OnItemKeyDown","OnKeyDown",this.self);
}
CDataView.prototype.OnKeyUp=function(oEvent)
{
    this.MouseEvent(oEvent, "OnItemKeyUp","OnKeyUp", this.self);
}
CDataView.prototype.OnBeforeUnload=function()
{
    //卸载事件销毁数据
    for(var evt in this.regevts)
    {
        fbis.removeEvent(this.view,evt,this.regevts[evt]);
    }
    fbis.removeEvent(window,"unload",this.OnBeforeUnload);
}
//事件定义
//OnItemClick       在item单击
//OnItemDbClick     在item双击击
//OnItemKeyPress    编辑item的输入事件
//OnItemAfterEdit   编辑item后
//OnItemBeforEdit   编辑item前
//OnItemKeydown     鼠标按下
//OnItemKeyup       按键弹起
//OnItemSelected    选中前触发,不允许选中需要返回false
//OnItemMouseMove   用户将鼠标划过对象时触发
//OnItemMouseOut    用户将鼠标指针移出对象边界时触发
//OnItemMouseDown   鼠标按下
//OnItemMouseUp     鼠标弹起
//OnItemMouseEnter  鼠标进入对象
//OnItemMouseLeave  鼠标离开对象
//OnItemMouseOver   鼠标指针移动到对象内时触发

//OnClick           鼠标单击
//OnDbClick         鼠标双击
//OnMouseMove       用户将鼠标划过对象时触发
//OnMouseOut        用户将鼠标指针移出对象边界时触发
//OnResizeEnd       控件大小调整结束
//OnMouseDown       鼠标按下
//OnMouseUp         鼠标弹起
//OnMouseEnter      鼠标进入对象
//OnMouseLeave      鼠标离开对象
//OnMouseOver       鼠标指针移动到对象内时触发
//OnKeyDown         鼠标按下
//OnKeyUp           按键弹起
function CDataView(div,itemclass)//类定义
{
    this.id=div;
    this.view=fbis.getobj(div);
    this.dstype="default";//icon,list,image,detail,默认的方式,可扩展
    this.ItemClass=itemclass;
    this.allDisptypes={
        "default":CDataView.defaultDType
    };
    this.Items={
        data:new Array(),//Item数组
        allNodes:new Array()
    };
    this.selects=new Array();
    this.selmod="multiselect";       //单选或多选 sigle
    this.allowEdit=false;            //默认不允许编辑
    this.drag=false;                 //默认不与许拖动
    this.menu=null;
    
    this.events={
    };
    this.regevts={};
    this.view.self=this;
    fbis.addEvent(this.view,"click",this.OnClick,false);
    this.regevts["click"]=this.OnClick;
    fbis.addEvent(window,"beforeunload",this.OnBeforeUnload,false);
    
//将类的方法及属性绑定到div控件上
//CHtml.extend(this.view,this);
}
