/******************************************************************************
 * $jexplore: $
 *
 * $Author:  $
 * 		Berlin Qin
 *
 * $History: jexplore.js $
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
var fmimeimg={
    "ai":"ai.gif",
    "avi":"avi.gif",
    "bmp":"bmp.gif",
    "cs":"cs.gif",
    "dll":"dll.gif",
    "doc":"doc.gif",
    "docx":"docx.gif",
    "exe":"exe.gif",
    "fla":"fla.gif",
    "gif":"gif.gif",
    "jpg":"jpg.gif",
    "js":"js.gif",
    "mdb":"mdb.gif",
    "mp3":"mp3.gif",
    "ogg":"ogg.gif",
    "pdf":"pdf.gif",
    "ppt":"ppt.gif",
    "pptx":"pptx.gif",
    "rdp":"rdp.gif",
    "swf":"swf.gif",
    "swt":"swt.gif",
    "txt":"txt.gif",
    "vsd":"vsd.gif",
    "xls":"xls.gif",
    "xlsx":"xlsx.gif",
    "xml":"xml.gif",
    "zip":"zip.gif"
};
function getmimeimage(fname,size)
{
    var ext=fbis.getfileext(fname);
    ext=ext.toLowerCase();
    var result=fmimeimg[ext];
    if(result)
    {
        return size+"/"+result;
    }
    else
    {
        switch(ext)
        {
            case "rtf":
                result=size+"/doc.gif";
                break;
            case "cvs":
                result=size+"/xls.gif";
                break;
            case "7z":
            case "rar":
            case "tar":
            case "gz":
                result=size+"/zip.gif";
                break;
            case "ps":
            case "eps":
                result=size+"/pdf.gif";
                break;
            default:
                result=size+"/default.icon.gif";
        }
    }
    return result;
}
function DrawImage(imgid,iwidth,iheight)
{
    var image=new Image();
    image.src=imgid.src;
    if(image.width>0 && image.height>0)
    {
        if(image.width/image.height>= iwidth/iheight)
        {
            if(image.width>iwidth)
            {
                imgid.width=iwidth;
                imgid.height=(image.height*iwidth)/image.width;
            }
            else
            {
                imgid.width=image.width;
                imgid.height=image.height;
            }
        }
        else
        {
            if(image.height>iheight)
            {
                imgid.height=iheight;
                imgid.width=(image.width*iheight)/image.height;
            }
            else
            {
                imgid.width=image.width;
                imgid.height=image.height;
            }
        }
    }
} 
CJexplor.prototype.icon=function()
{
    var self=this;
    return {
        "name"   : "default",
        "width"  :  "100px",
        "height" : "100px",
        "margin" : 1,
        "padding": 0,
        "class":"",
        "selcss":"fileview_item_selected",
        icons_src_dir:"images/icons",
        "show":function(obj)
        {
            var rev="";
            if(obj)
            {
                rev="<img onmousedown='return false;' border='0' src='"+
                self.icons_src_dir + "/" +getmimeimage(obj.fname,"32")+"' >\n";
                rev=rev+"<div class=\"item_text\">";
                if(this.bshowext)
                {
                    rev=rev+obj.fname;
                }
                else 
                {
                    rev=rev+fbis.filebasename(obj.fname);
                }
                rev=rev+"</div>\n";
                if(self.bshowdate)
                {
                    rev=rev+"<div class=\"item_text\">"+obj.ctime+"</div>\n";
                }
                if(self.bshowsize)
                {
                    rev=rev+"<div class=\"item_text\">"+obj.size+"</div>\n";
                }
            }
            return rev;
        },
        "edit":function(obj)
        {
            var rev="";
            if(obj)
            {
                rev="<div align=\"center\">\n<img onmousedown='return false;' border='0' src='"+
                this.icons_src_dir + "/ico_" + (obj.fname.split(".")[1] || "fldr") + "_32.gif"+"' >\n";
                rev=rev+"<input class=\"item_editor\" value=\""+obj.fname+"\">";
                rev=rev+obj.fname;
                rev=rev+"</div>\n";
            }
            return rev;
        }
    };
}
CJexplor.prototype.Img=function()
{
    var self=this;
    return {
        "name"   : "default",
        "width"  : 140,           
        "height" : 140,          
        "margin" : 1,
        "padding": 0,
        "class":"",
        "selcss":"fileview_item_selected",
        "show":function(obj)
        {
            var rev="";
            if(obj)
            {
                rev="<img onmousedown='return false;' border='0' alt='' src='";
                var ext=fbis.getfileext(obj.fname);
                ext=ext.toLowerCase();
                switch(ext)
                {
                    case "jpg":
                    case "gif":
                    case "png":
                    case "jpeg":
                    {
                        var req={
                            "url":obj.url,
                            "width":70,
                            "height":70
                        };
                        rev=rev+"core/zoomImg.php?params="+urlEncode(JSON.stringify(req))+"'";
                    }
                    break;
                    default:
                        rev=rev+self.icons_src_dir + "/" +getmimeimage(obj.fname,"32")+"'";
                        break;
                }
                rev=rev+">\n";
                rev=rev+"<div class=\"item_text\">";
                if(self.bshowext)
                {
                    rev=rev+obj.fname;
                }
                else 
                {
                    rev=rev+fbis.filebasename(obj.fname);
                }
                rev=rev+"</div>\n";
                if(self.bshowdate)
                {
                    rev=rev+"<div class=\"item_text\">"+obj.ctime+"</div>\n";
                }
                if(self.bshowsize)
                {
                    rev=rev+"<div class=\"item_text\">"+obj.size+"</div>\n";
                }
            }
            return rev;
        },
        "edit":function(obj)
        {
            var rev="";
            if(obj)
            {
                rev="<div align=\"center\">\n<img onmousedown='return false;' border='0' src='"+
                this.icons_src_dir + "/ico_" + (obj.fname.split(".")[1] || "fldr") + "_32.gif"+"' >\n";
                rev=rev+"<input class=\"item_editor\" value=\""+obj.fname.split(".")[0]+"\">";
                rev=rev+obj.fname.split(".")[0];
                rev=rev+"</div>\n";
            }
            return rev;
        }
    };
}
CJexplor.prototype.ExcuteRequest=function(req,action,onfinish)
{
    var request=new CAjaxRequest();
    request.request=createXMLHttpRequest();
    request.onFinish=onfinish;
    request.method="POST";
    request.action=action;
    request.data="params="+JSON.stringify(req);
    request.setheader("Content-Type","application/x-www-form-urlencoded");
    request.send();
}

CJexplor.prototype.getfile=function(req,action)
{
    var request=new CAjaxRequest();
    request.request=createXMLHttpRequest();
    var self=this;
    var loading=new CLoading(fbis.lang[fbis.language]["loadfile"], 800, 600,"images/loading.gif");
    request.onFinish=function(obj,respons,state)
    {
        try
        {
            if(loading)
            {
                loading.hide(loading);
            }
        }
        catch(e)
        {
        }
        if(respons)
        {
            try
            {
                var value=JSON.parse(respons);
                if(value&&value.error==0)
                {
                    self.clear();
                    self.AddItem(value.files);
                }
            }
            catch(e)
            {
            }
        }
            
    }
    request.method="POST";
    request.action=action;
    request.data="params="+JSON.stringify(req);
    request.setheader("Content-Type","application/x-www-form-urlencoded");
    request.send();
}
CJexplor.prototype.refreshFolder=function (req,action,fltree)
{
    if(fltree)
    {
        var request=new CAjaxRequest();
        request.request=createXMLHttpRequest();
        request.onFinish=function(obj,respons,state)
        {
            if(respons)
            {
                try
                {
                    var value=JSON.parse(respons);
                    if(value)
                    {
                        if(value.error==0) 
                        {
                            fltree.treeroot.count=0;
                            fltree.arrayToNode(null, value.dirs);
                            fltree.show();
                        }
                    }
                }
                catch(e)
                {
                }
            }
        }
        request.method="POST";
        request.action=action;
        request.data="params="+JSON.stringify(req);
        request.setheader("Content-Type","application/x-www-form-urlencoded");
        request.send();
    }
}

function CJexplor(div,ItemClass,action,folderfun,afupload,popmenu)
{
    var view=new CDataView(div,ItemClass);
    if(view)
    {
        this.action=action;
        this.getdirfun=folderfun;
        this.afupload=afupload;

        view.AddPopMenu(popmenu);
        if(popmenu)
        {
            popmenu.attach(view.view);
        }
        view.AddDisptypes("default",this.Img());
        view.AddDisptypes("icon",this.icon());
        view.conns={};
        this.bshowext=1; 
        this.bshowdate=1; 
        this.bshowsize=1; 
        this.icons_src_dir="images/icons";
        fbis.extend(this, view);
        view.view.self=this;
      
        fbis.addEvent(view.view,"drop",ondrop , false);
        fbis.addEvent(view.view,"dragover",ondragover, false);
    }

    function ondrop(evt)
    {
        evt=evt||window.event;
        var element=evt.target||evt.srcElement;
        var files = evt.files||evt.dataTransfer.files;
        var self=fbis.getEventObj(evt,"self");
        if (evt.stopPropagation)
        {
            evt.stopPropagation();
            evt.preventDefault();
        }
        else if (window.event)
        {
            window.event.cancelBubble = true;
            event.returnValue = false;
        }
        var folder="/";
        if(self&&self.getdirfun)
        {
            folder=self.getdirfun();
        }
        if(files)
        {
            for(var i=0;i<files.length;i++)
            {
                ajaxuploadfile(folder, files[i],self.action,self.afupload);
            }
        }
    }
    function ondragover(evt)
    {
        evt=evt||window.event;
        if (evt.stopPropagation)
        {
            evt.stopPropagation();
            evt.preventDefault();
        }
        else if (window.event)
        {
            window.event.cancelBubble = true;
            event.returnValue = false;
        }
    }
}

