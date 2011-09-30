/******************************************************************************
 * $preview: $
 *
 * $Author:  $
 * 		Berlin Qin
 *
 * $History: preview.js $
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

//清除不能预览的文件
function getprehtml(urls)
{
    var result=[];
    if(urls&&urls.length>0)
    {
        var i=0;
        for(i=0;i<urls.length;i++)
        {
            var ext=fbis.getfileext(urls[i]);
            switch(ext)
            {
                case "jpg":
                case "png":
                case "ico":
                case "bmp":
                case "jpeg":
                case "gif":
                case "tif":
                case "eps":
                {
                    result.push("<img id='previewObj' src='"+urls[i]+"'  alt='' onload='javascript:CPreview.prototype.onload();' >");
                }
                break;
                case "swf":
                {
                    var str='<object  id="previewObj"  CLASSID="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" CODEBASE="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=5,0,0,0" width="480" height="360" \
                             onkeydown="javascript:CPreview.prototype.keydown();" \
                             >\n \
                             <param name=quality value=high>\n \
                             <param name="src"  value="'+urls[i]+'">\n \
                             <embed quality=high pluginspage="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash" width="400" height="300" src="'+urls[i]+'">\n \
                             </embed>\n \
                             </object>\n';
                    result.push(str);
                }
                break;
            }
        }
    }
    return result;
}

function CPreview(url)
{
    this.urls=[];
    if(url&&fbis.IsArray(url))
    {
        this.urls=getprehtml(url);
        this.count=this.urls.length;
        this.index=0;
        if(this.count>0)
        {
            this.loading=new CLoading("",400, 400,"images/loading.gif");
            this.preview=fbis.getobj("fbispreview");
            this.overlay=fbis.getobj("fbispreviewoverlay");
            if(!this.preview)
            {
                //创建容器
                this.overlay=fbis.createElement("div", {
                    "id":"fbispreviewoverlay"
                });
                if(this.overlay)
                {
                    document.body.appendChild(this.overlay);
                }
                var preview=fbis.createElement("div", {
                    "id":"fbispreview",
                    "tabindex":"0"
                });
                if(preview)
                {
                    this.preview=preview;
                    fbis.addEvent(this.preview,"keydown",CPreview.prototype.keydown);
                    var div=fbis.createElement("div",{
                        "id":"OutImageContainer"
                    });
                    if(div)
                    {
                        this.OutImageContainer=div;
                        this.preview.appendChild(div);
                        div=fbis.createElement("div",{
                            "id":"ImageContainer"
                        });
                        if(div)
                        {
                            this.ImageContainer=div;
                            this.OutImageContainer.appendChild(div);
                            div=fbis.createElement("div",{
                                "id":"prevObj"
                            });
                            if(div)
                            {
                                this.previewObj=div;
                                this.ImageContainer.appendChild(div);
                            }
                            div=fbis.createElement("div",{
                                "id":"previewhovernav"
                            });
                            if(div)
                            {
                                this.hoverNav=div;
                                this.hoverNav.self=this;
                                var a=fbis.createElement("a",{
                                    "id":"prevLink",
                                    "href":"#"
                                });
                                if(a)
                                {
                                    this.prevLink=a;
                                    this.hoverNav.appendChild(a);
                                    fbis.addEvent(a,"click",CPreview.prototype.prev);
                                }
                                a=fbis.createElement("a",{
                                    "id":"nextLink",
                                    "href":"#"
                                });
                                if(a)
                                {
                                    //a.innerHTML='<img src="images/nextlabel.gif" alt="next" title="next">';
                                    this.nextLink=a;
                                    this.hoverNav.appendChild(a);
                                    fbis.addEvent(a,"click",CPreview.prototype.next);
                                    
                                }
                                this.ImageContainer.appendChild(div);
                            }
                            
                        }
                        div=fbis.createElement("div",{
                            "id":"imagedatacontainer"
                        });
                        if(div)
                        {
                            this.ImageDataContainer=div;
                            this.preview.appendChild(div);
                            div=fbis.createElement("div", {
                                "id":"imageData"
                            });
                            if(div)
                            {
                                this.imageData=div;
                                this.ImageDataContainer.appendChild(div);
                                div=fbis.createElement("div",{
                                    "id":"previewDetails"
                                });
                                if(div)
                                {
                                    this.imageDetails=div;
                                    this.imageData.appendChild(div);
                                    div=fbis.createElement("span",{
                                        "id":"previewcaption"
                                    });
                                    if(div)
                                    {
                                        this.caption=div;
                                        this.imageDetails.appendChild(div);
                                    }
                                    div=fbis.createElement("span",{
                                        "id":"previewNumber"
                                    });
                                    if(div)
                                    {
                                        this.number=div;
                                        this.imageDetails.appendChild(div);
                                    }

                                }
                                div=fbis.createElement("div",{
                                    "id":"previewfoot"
                                });
                                if(div)
                                {
                                    div.innerHTML='<a id="bottomNavClose" href="javascript:CPreview.prototype.close();">\n\
                                <img src="images/closelabel.gif">\n\
                                </a>\n ';
                                    
                                    this.btnclose=div;
                                    this.imageData.appendChild(div);
                                }
                            }
                        }
                    
                    }
                }
                document.body.appendChild(this.preview);
                fbis.addEvent(window,"keydown",CPreview.prototype.keydown);
                fbis.addEvent(window,"beforeunload", function()
                {
                    fbis.removeEvent(window,"keydown",CPreview.prototype.keydown);
                });
                this.preview.self=this;
            }
            else
            {
                this.previewObj=this.preview.self.previewObj;
                this.prevLink=this.preview.self.prevLink;
                this.nextLink=this.preview.self.nextLink;
                this.hoverNav=this.preview.self.hoverNav;
                this.caption=this.preview.self.caption;
                this.number=this.preview.self.number;
            }
            this.prevLink.self=this;
            this.nextLink.self=this;
            this.overlay.style.display="block";
            this.previewObj.innerHTML="";
            this.previewObj.innerHTML=this.urls[0];
            this.previewObj.self=this;
            this.index=0;
            this.isloading=true;
            this.preview.self=this;
            this.preview.style.display="block";
            var winsize=fbis.getWindowSize();
            var left=0,top=0;
            if(this.preview.offsetWidth>0&&this.preview.offsetWidth<winsize.width)
            {
                left=(winsize.width-this.preview.offsetWidth)/2;
            }
            if(this.preview.offsetHeight>0&&this.preview.offsetHeight<winsize.height)
            {
                top=(winsize.height-this.preview.offsetHeight-66)/2;
            }
            this.preview.style.left=left+"px";
            this.preview.style.top=top+"px";
            this.preview.focus();
            this.number.innerHTML="Preview "+(this.index+1)+" of "+this.count;
            this.prevLink.style.display=(this.index>=1?"block":"none");
            this.nextLink.style.display=(this.index<this.count-1?"block":"none");
        }
    }
}
CPreview.prototype.close=function()
{
    var overlay=fbis.getobj("fbispreviewoverlay");
    if(overlay)
    {
        overlay.style.display="none";
    }
    var preview=fbis.getobj("fbispreview");
    if(preview)
    {
        preview.style.display="none";
        if(preview.self&&preview.self.loading)
        {
            preview.self.loading.hide(preview.self.loading);
            delete preview.self.loading;
            preview.self.loading=null;
            fbis.removeChild(preview.self.previewObj);
            preview.self.previewObj.innerHTML="";
        }
    }
}
CPreview.prototype.prev=function()
{
    var preview=fbis.getobj("fbispreview");
    if(preview)
    {
        var self=preview.self;
        if(self)
        {
            if(self.index>0)
            {
                if(!self.isloading)
                {
                    self.loading=new CLoading("",400, 400,"images/loading.gif");
                    self.isloading=true;
                }
                fbis.removeChild(self.previewObj);
                self.previewObj.innerHTML="";
                self.index=self.index-1;
                self.previewObj.innerHTML=self.urls[self.index];
                self.number.innerHTML="Preview "+(self.index+1)+" of "+self.count;
            }
            self.prevLink.style.display=(self.index>=1?"block":"none");
            self.nextLink.style.display=(self.index<self.count-1?"block":"none");
        }
    }
}
CPreview.prototype.next=function()
{
    var preview=fbis.getobj("fbispreview");
    if(preview)
    {
        var self=preview.self;
        if(self)
        {
            if(self.index<self.count-1)
            {
                if(!self.isloading)
                {
                    self.loading=new CLoading("",400, 400,"images/loading.gif");
                    self.isloading=true;
                }
                fbis.removeChild(self.previewObj);
                self.previewObj.innerHTML="";
                self.index=self.index+1;
                self.previewObj.innerHTML=self.urls[self.index];
                self.number.innerHTML="Preview "+(self.index+1)+" of "+self.count;
            }
            self.prevLink.style.display=(self.index>=1?"block":"none");
            self.nextLink.style.display=(self.index<self.count-1?"block":"none");
        }
    }
}

CPreview.prototype.keydown=function(evt)
{
    evt=evt||window.event;
    switch(evt.keyCode)
    {
        case 27:
        {
            CPreview.prototype.close();
        }
        break;
        case 39:
        case 13:
        {
            CPreview.prototype.next(evt);
        }
        break;
        case 37:
        {
            CPreview.prototype.prev(evt);
        }
        break;
    }
    evt.keyCode=0;
    evt.cancelBubble = true;
    evt.returnValue=false;
    return false;
}
CPreview.prototype.onload=function()
{
    //获取element的父div
    try
    {
        var preview=fbis.getobj("fbispreview");
        if(preview)
        {
            var self=preview.self;
            if(self)
            {
                var obj=fbis.getobj("previewObj");
                var left=0;
                var top=0;
                if(obj)
                {
                    var winsize=fbis.getWindowSize();
                    if(obj.offsetWidth>0&&obj.offsetWidth<winsize.width)
                    {
                        left=(winsize.width-obj.offsetWidth)/2;
                    }
                    if(obj.offsetHeight>0&&obj.offsetHeight<winsize.height)
                    {
                        top=(winsize.height-obj.offsetHeight-66)/2;
                    }
                }
                //窗体居中计算
                self.preview.style.left=left+'px';
                self.preview.style.top  =top+ 'px';
                self.loading.hide(self.loading);
                delete self.loading;
                self.loading=null;
                self.isloading=false;
                
            }
        }
    }
    catch(e)
    {
    //alert(e);
    }
}

