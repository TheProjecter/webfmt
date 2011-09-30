/******************************************************************************
 * $fbisupload: $
 *
 * $Author:  $
 * 		Berlin Qin
 *
 * $History: fbisupload.js $
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
var fbis=fbis||{};
function ajaxuploadfile(folder,file,action,afupload,parent)
{
    var name = file.fileName != null ? file.fileName : file.name;
    var size = file.fileSize != null ? file.fileSize : file.size;
    var ext=fbis.getfileext(name);
    var result=CUploader.prototype.IsAllowFile(ext, size);
    if(result==0)
    {
        //创建上传对象
        var ajax=new CAjaxRequest();
        //ajax.newRequest();         //创建一个上传对象
        ajax.action=action;
        ajax.file=file;
        ajax.dir=folder;
        ajax.afupload=afupload;
        //添加到上传列表
        return CUploader.prototype.addfile(ajax,parent);
    }
    else
    {
        var msg=fbis.lang[fbis.language]["errormsg"][result];
        alert(msg);
    }
}

function CUploader()
{
    
}
CUploader.prototype.maxsize=2*1024*1024;        
CUploader.prototype.filetype=[];                 
CUploader.prototype.loading="images/loading.gif";               
CUploader.prototype.setmaxsize=function(max)
{
    if(max)
    {
        CUploader.prototype.maxsize=max;
    }
}
CUploader.prototype.settype=function(allowtype)
{
    if(allowtype&&fbis.IsArray(allowtype))
    {
        CUploader.prototype.filetype=allowtype;
    }
}
CUploader.prototype.IsAllowFile=function(ext,size)
{
    var result=-1;
    if(ext&&size)
    {
        if(size<=CUploader.prototype.maxsize)
        {
            var ballow=false;
            for(var i=0;i<CUploader.prototype.filetype.length;i++)
            {
                if(ext==CUploader.prototype.filetype[i])
                {
                    ballow=true;
                    break;
                }
            }
            if(ballow)
            {
                result=0;
            }
            else 
            {
                result=-7;
            }
        }
        else
        {
            result=-8;
        }
    }
    return result;
}
CUploader.prototype.addfile=function(ajax,parent)
{
    var result=-1;
    var name ="";
    var size="";
    var ext="";
    var infowind=null;
    if(ajax&&ajax.file)
    {
        name = ajax.file.fileName != null ? ajax.file.fileName : ajax.file.name;
        size = ajax.file.fileSize != null ? ajax.file.fileSize : ajax.file.size;
        ext=fbis.getfileext(name);
        var id="uplist"+fbis.getuniqid();
        size=fbis.formatSize(size);
        infowind=CUploader.prototype.getinfowind(parent);
        if(infowind)
        {
            var html='<table  id="'+id+'" cellpadding="0" cellspacing="0" style="width:100%;height:100%;text-align:left">\n  \
                   <tr><td  valign="left">'+name+'</td>\n<td  valign="left">'
            +size+'</td><td><img src="'
            +CUploader.prototype.loading+'"  alt="'+
            +fbis.lang[fbis.language]["upload"]["progress"]+'" ></td>'
            +'<td  valign="left"><a href="javascript:void(0)" onfocus="javascript:this.blur()" onclick="javascript:CUploader.prototype.cancel('+id+');">'
            +fbis.lang[fbis.language]["upload"]["cancelupload"]+"</a></td>\n</tr></table>\n";
            infowind.innerHTML=infowind.innerHTML+html;
            CUploader.prototype.ajaxupload(ajax,id);
            CUploader.prototype.uploadfiles[id]=ajax;
        }
    }
}
CUploader.prototype.ajaxupload=function(ajax,id)
{
    if(ajax)
    {
        var name = ajax.file.fileName != null ? ajax.file.fileName : ajax.file.name;
        var size = fbis.formatSize(ajax.file.fileSize != null ? ajax.file.fileSize : ajax.file.size);
        ajax.onFinish=function(self, respons, status)
        {
            try
            {
                var result={
                    "error":-100
                };
                if(respons)
                {
                    try
                    {
                        result=JSON.parse(respons); 
                    }
                    catch(e)
                    {
                            
                    }
                }
                if(CUploader.prototype.uploadfiles[id])
                {
                    delete CUploader.prototype.uploadfiles[id];
                }
                var uprev="";
                var error="";
                if(result.error==0) 
                {
                    uprev=fbis.lang[fbis.language]["upload"]["success"];
                    if(ajax.afupload)
                    {
                        ajax.afupload();
                    }
                }
                else
                {
                    uprev=fbis.lang[fbis.language]["upload"]["fail"];
                    error=fbis.lang[fbis.language]["errormsg"][result.error];
                }
                //取显示的div
                var obj=fbis.getobj(id);
                if(obj)
                {
                    var html='<tr><td td valign="left" >'+name+'</td>\n<td valign="left">'
                    +size+'</td>\n<td valign="left">'+uprev+'</td></tr>\n';
                    obj.innerHTML=html;
                }
                delete ajax;
            }
            catch(e)
            {
            }
        }
        ajax.action= ajax.action+"?upfile="+name+"&folder="+ajax.dir;
        ajax.setheader("X-Requested-With", "XMLHttpRequest");
        ajax.setheader("X-File-Name", encodeURIComponent(name));
        ajax.setheader("Content-Type", "application/octet-stream");
        ajax.data=ajax.file;
        ajax.send();
    }
}
CUploader.getframeContent=function(frame)
{
    var response="";
    if(frame)
    {
        if (!frame.parentNode)
        {
            return "";
        }
        if (frame.contentDocument &&frame.contentDocument.body &&frame.contentDocument.body.innerHTML == "false")
        {
            return "";
        }
        var doc = frame.contentDocument ? frame.contentDocument: frame.contentWindow.document;
        if(doc)
        {
            response =doc.body.innerHTML;
        }
    }
    return response;
}
    
CUploader.prototype.getinfowind=function(parent)
{
    if(!CUploader.prototype.InfWindow)
    {
        if(CUploader.prototype.InfWindowId)
        {
            CUploader.prototype.InfWindow=fbis.getobj(CUploader.prototype.InfWindowId);
        }
        else
        {
            var Id="uploadlist0";
            var obj=fbis.createElement("div",{
                "id":Id,
                "class":"uploaderprogress"
            },"");
            if(obj)
            {
                obj.style.position="absolute";//浮起
                obj.style.width="600px";
                //obj.style.height="100px";
                document.body.appendChild(obj);
                //创建标题栏
                var html='<div class="title">\n<div style="float:right;">\n<a href="javascript:void(0)"'
                +' onclick="javascript:CUploader.prototype.hide()" onfocus="javascript:this.blur()" >\n'
                +'<img src="images/close.gif " _alt="'+fbis.lang[fbis.language]["upload"]["title"]+'">'
                +'</a>\n</div>\n</div>'
                +'<div><table class="dialogtable" cellpadding="0" cellspacing="0" style="width:100%;height:100%">\n  \
                      <tr><td width="10"></td><td valign="center" height="10" ></td><td width="10"></td></tr>  \
                      <tr><td width="10"></td><td valign="center" ><div class="upfilelist" id="upfilelists"></div>'
                +'</td><td width="10"></td></tr>\n \
                      <tr><td width="10"></td><td valign="center" height="10" ></td><td width="10"></td></tr> \
                    <tr><td width="10"></td><td valign="center" >      \
                    <input type="button" value="'
                +fbis.lang[fbis.language]["button"]["close"]+'" onclick="CUploader.prototype.hide();">\n  \
                     </td><td width="10"></td></tr>\n  \
                   <tr><td width="10"></td><td valign="center" height="10" ></td><td width="10"></td>\n \
                    </table></div>';
                obj.innerHTML=html;
                CUploader.prototype.InfWindowId=Id;
            }
            CUploader.prototype.InfWindow=obj;
        }
    }
    if(CUploader.prototype.InfWindow.style.display!="block")
    {
        CUploader.prototype.InfWindow.style.display="block";
        //显示位置计算
        var pos={};
        pos=fbis.getWindowSize();
        CUploader.prototype.InfWindow.style.left=parseInt((pos.width-CUploader.prototype.InfWindow.offsetWidth)/2)+"px";
        CUploader.prototype.InfWindow.style.top=parseInt((pos.height-CUploader.prototype.InfWindow.offsetHeight)/2)+"px";
            
    }
    return fbis.getobj("upfilelists");
}
CUploader.prototype.uploadfiles={};      //正在上传的文件
CUploader.prototype.InfWindowId=null;             //上传信息窗体id
CUploader.prototype.InfWindow=null;               //上传信息窗对象
CUploader.prototype.cancel=function(id)          //取消上传
{
    //移除上传进度
    if(id)
    {
        var name ="";
        var size ="";
        var ajax=CUploader.prototype.uploadfiles[id];
        if(ajax)
        {
            if(ajax.file)
            {
                name = ajax.ile.fileName != null ? ajax.file.fileName : ajax.file.name;
                size = fbis.formatSize(ajax.file.fileSize != null ? ajax.file.fileSize : ajax.file.size);
                ajax.request.abort();
            }
            else
            {
                name=ajax.name;
                ajax.setAttribute('src', 'javascript:false;');
                CUploader.destroyform(ajax);
            }
            delete CUploader.prototype.uploadfiles[id];
        }
        //添加上传结果显示,"取消上传"
        //取显示的div
        var uprev=fbis.lang[fbis.language]["upload"]["fail"];
        var obj=fbis.getobj(id);
        if(obj)
        {
            obj.innerHTML='<div style="float:left;">'+name+'</div>\n<div style="float:left;">'
            +size+'</div>\n<div style="float:left;">'+uprev+'</div>\n';
        }
    }
}
CUploader.prototype.hide=function()
{
    //CUploader.prototype.InfWindow.innerHTML="";
    var obj=fbis.getobj("upfilelists");
    if(obj)
    {
        obj.innerHTML="";
    }
    CUploader.prototype.uploadfiles={};
    CUploader.prototype.InfWindow.style.display="none";
}
    
//上传按钮
//同时支持拖拽文件进入
//id ,对象或对象id
function CUploadButton(id,action,getfolder,afupload)
{
  
    this.action=action;
    this.getdirfun=getfolder;
    if(getfolder)
    {
        this.folder=getfolder();
    }
    else
    {
        this.folder="/";
    }
    this.afupload=afupload;
    if(typeof id=="string")
    {
        this.id=id;
        this.btn=fbis.getobj(id);
    }
    else if(typeof id=="object"&&id.constructor==Object)
    {
        this.id=id.id;
        this.btn=id;
    }
    if(this.btn)
    {
        this.reset();
        this.btn.self=this;
        fbis.addEvent(this.btn,"mouseover", CUploadButton.prototype.mousemove, false);
        fbis.addEvent(this.btn,"drop", CUploadButton.prototype.Drop, false);
        fbis.addEvent(this.btn,"dragover", CUploadButton.prototype.DragOver, false);
    //this.button.self=this;
    }
}
CUploadButton.prototype.reset=function()
{
    if(this.inputfile)
    {
        this.inputfile.self=null;
        this.button.self=null;
        fbis.removeEvent(this.inputfile,"change",CUploadButton.prototype.onchange);
        fbis.removeEvent(this.button,"mouseout", CUploadButton.prototype.mouseout);
        fbis.remove(this.button);//删除整个div
    }
    var uid=fbis.getuniqid();
    this.button=fbis.createElement("div",{
        "id":("fbisuploadbutton"+uid),
        "name":("fbisuploadbutton"+uid)
    });
    if(this.button)
    {
        this.button.style.position = 'absolute';
        this.button.style.overflow = 'hidden';
        this.button.style.padding = 0;
        this.button.style.margin = 0;
        this.button.style.visiblity = 'hidden';
        this.button.style.width = '200px';
        this.button.style.height = '200px';
        this.button.style.display="none";
        this.button.style.zIndex=1200;
        //this.button.style.border="1px solid";
        //this.button.style.borderColor="red";
        this.button.innerHTML='<iframe name="fbisuploadframe'+uid+'" id="fbisuploadframe'+uid+'" src="about:blank" ></iframe>';
        this.frame=this.button.firstChild||this.button.childNodes[0];
        this.frame.style.display="none";
        //创建form
        this.form=fbis.createElement("form",{
            "name":("fbisuploadform"+uid),
            "id":("fbisuploadform"+uid)
        });
        this.form.method = 'post';
        this.form.enctype = 'multipart/form-data';
        this.form.encoding = 'multipart/form-data';

        this.inputfile=CUploadButton.prototype.creatinput(uid,this.button.style.width,this.button.style.height);
        if(this.inputfile)
        {
            var inputfolder = fbis.createElement("input");
            inputfolder.type = "hidden";
            inputfolder.name = "folder";
            inputfolder.value = this.folder;
            this.form.appendChild(inputfolder);

            //添加最大文件限制
            var input_ms = fbis.createElement('input');
            input_ms.type = 'hidden';
            input_ms.name = 'MAX_FILE_SIZE';
            input_ms.value = CUploader.prototype.maxsize;
            this.form.appendChild(input_ms);
            this.form.appendChild(this.inputfile);
            this.form.target= "fbisuploadframe"+uid;
            this.button.appendChild(this.form);
            this.button.self=this;
            this.frame.self=this;
            this.inputfile.self=this;
            fbis.addEvent(this.inputfile,"change",CUploadButton.prototype.onchange, false);
            document.body.appendChild(this.button);
        //fbis.addEvent(this.button,"mouseout", this.mouseout, false);  这会引起safri 不触发onchange
        }
    }
}
CUploadButton.prototype.creatinput=function(id,width,height)
{
    var inputfile=fbis.createElement("input", {
        "type":"file",
        "id":("fbis_file"+id),
        "name":("fbis_file"+id),
        "multiple":"multiple",
        "min":"1",
        "max":"9999"
    });
    if(inputfile)
    {
        inputfile.style.top = 0;
        inputfile.style.left = 0;
        inputfile.style.fontFamily="Arial";
        inputfile.style.fontSize=180;
        inputfile.size=10;
        inputfile.style.margin= 0;
        inputfile.style.padding=0;
        inputfile.style.opacity =0;
        inputfile.style.filter = 'alpha(opacity=0)';
        inputfile.style.cursor= "pointer";
        if(fbis.getOs()!="Opera")
        {
            inputfile.style.marginLeft = '-214'; // hide IE text field
        }
        inputfile.style.height=height;
        inputfile.style.width=width;
            
    }
    return inputfile;
}
CUploadButton.prototype.submitform=function(element,self,folder)
{
    var name=element.value;
    name=name.replace(/.*(\/|\\)/, "");
    var ext=fbis.getfileext(name);
    var error=CUploader.prototype.IsAllowFile(ext, 1);
    if(error==0)
    {
        self.form.action=self.action+"?upformfile="+element.id+"&folder="+folder;
        fbis.addEvent(self.frame,"load",CUploadButton.prototype.onFinish, false);
        self.loading=new CLoading(fbis.lang[fbis.language]["upload"]["uploading"],200,200,CUploader.prototype.loading);
        self.form.submit();
    }
    else
    {
        self.form.reset();
        var msg=fbis.lang[fbis.language]["errormsg"][error];
        MessageBox("",msg, "ok");
    }
}
CUploadButton.prototype.onchange=function (evt)
{
    evt=evt||window.event;
    var element=evt.target||evt.srcElement;
    var self=element.self;
    var folder=self.folder;
    if(self.getdirfun)
    {
        folder=self.getdirfun();
    }
    if(element.files)
    {
        if(fbis.getOs()!="Opera")
        {
            var files = null;
            files=element.files;
            for(var i=0;i<files.length;i++)
            {
                ajaxuploadfile(folder, files[i], self.action,self.afupload);
            }
            self.reset();
        }
        else
        {
            self.submitform(element, self,folder);
        }
    }
    else //form提交
    {
        self.submitform(element, self,folder);
    }
}
CUploadButton.prototype.onFinish=function(evt)
{
    try
    {
        evt=evt||window.event;
        var element=evt.target||evt.srcElement;
        var self=element.self;
        var result={
            "error":-100
        };
        var respons=CUploader.getframeContent(element)
        try
        {
            self.form.reset();
            if(respons&&respons!="")
            {
                result=JSON.parse(respons); //得到文件数据
            }
            fbis.removeEvent(element, "load",CUploadButton.prototype.onFinish);
            if(self.afupload)
            {
                try
                {
                    self.afupload();
                }
                catch(e)
                {
                }
            }
        }
        catch(e)
        {
        }
        var uprev="";
        var error="";
        if(result)
        {
            if(result.error==0) //上传成功
            {
                uprev=fbis.lang[fbis.language]["upload"]["success"];
                    
            }
            else
            {
                uprev=fbis.lang[fbis.language]["upload"]["fail"];
                error=fbis.lang[fbis.language]["errormsg"][result.error];
            }
        }
        try
        {
            if(self.loading)
            {
                self.loading.hide(self.loading);
                self.loading=null;
            }
            self.reset();
            MessageBox("", uprev, "ok");
        }
        catch(e)
        {
        }
    }
    catch(e)
    {
    }
}
CUploadButton.prototype.mousemove=function(evt)
{
    //覆盖input到该元素上面
    evt=evt||window.event;
    var element=evt.target||evt.srcElement;
    var self=element.self;
    var pos=fbis.offset(element);
    self.button.style.top=pos.y-1;
    self.button.style.left=pos.x-1;
    self.button.style.height=element.offsetHeight+"px";
    self.button.style.width=element.offsetWidth+"px";
    self.button.style.display="block";
//self.btn.focus();
}
CUploadButton.prototype.Drop=function(evt)
{
    evt=evt||window.event;
    if (evt.stopPropagation)
    {
        evt.stopPropagation();
    //evt.preventDefault();
    }
    else if (window.event)
    {
        window.event.cancelBubble = true;
    //event.returnValue = false;
    }
    var element=evt.target||evt.srcElement;
    var files ={};
    if(fbis.getOs()=="MSIE")
    {
    }
    else
    {
        files = evt.files||evt.dataTransfer.files;
    }
    var self=element.self;
    var folder=self.folder;
    if(files)
    {
        for(var i=0;i<files.length;i++)
        {
            ajaxuploadfile(folder, files[i], self.action);
        }
    }
}
CUploadButton.prototype.DragOver=function(evt)
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
CUploadButton.prototype.mouseout=function(evt)
{
    evt=evt||window.event;
    var element=evt.target||evt.srcElement;
    if(element&&element.self&&element.self.button)
    {
        if(fbis.getOs()!="Safari")
        {
            element.self.button.style.display="none";
        }
    }
}
    
   
