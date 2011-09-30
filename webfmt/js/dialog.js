/******************************************************************************
 * $dialog: $
 *
 * $Author:  $
 * 		Berlin Qin
 *
 * $History: dialog.js $
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
function CMessageBox(title,message,button,onok,oncancel)
{
    this.dialog=null;
    this.shade=null;
    this.oncancel=oncancel;
    this.onok=onok;
    var uid=fbis.getuniqid();
    this.shade = fbis.createElement('div',{
        'id':('dialogshade'+uid),
        'class':'dialogshade'
    },"");
    this.dialog = fbis.createElement('div',{
        "id":("fbisdialog"+uid),
        'class':'fbisdialog'
    },"");
    var html='<div  class="dialogfrm" >\n \
    <div class="dialogtitle" >\n \
    <div style="float:right;cursor:pointer;">\n \
    <a href="javascript:void(0)" onclick="javascript:CMessageBox.prototype.close(false,\'fbisdialog'+uid+'\')" onfocus="javascript:this.blur()" >\n \
    <img src="images/close.gif" _alt="'
    +fbis.lang[fbis.language]["button"]["close"]+'" >\n\
    </a>\n\
    </div>'+title+'</div>\n  \
    <div class="dialogbody" >';
    if(message)
    {
        var obj=fbis.getobj(message);
        if(obj)
        {
            html=html+'<p stryle="white-space:normal;">'+obj.innerHTML+'</p>';
        }
        else
        {
            html=html+'<p stryle="white-space:normal;">'+message+'</p>';
        }
    }
    html=html+'<div style="width:90%;margin-left:auto; margin-right:auto;text-align:right;" class="dialogbutton">\n';
    if(button=="ok|cancel") 
    {
        html=html+'<input type="button" value="'
        +fbis.lang[fbis.language]["button"]["ok"]
        +'" onclick="CMessageBox.prototype.close(true,\'fbisdialog'+uid+'\');">'
        +'<input type="button" value="'
        +fbis.lang[fbis.language]["button"]["cancel"]
        +'" onclick="CMessageBox.prototype.close(false,\'fbisdialog'+uid+'\')">';
    }
    else
    {
        html=html+'<div class="dialogbutton">\n      \
           <input type="button" value="'
        +fbis.lang[fbis.language]["button"]["ok"]
        +'" onclick="CMessageBox.prototype.close(true,\'fbisdialog'+uid+'\');">';
    }
    html=html+'</div>\n</div>\n';
    document.body.zIndex=0;
    document.body.appendChild(this.shade);
    document.body.appendChild(this.dialog);
    this.dialog.innerHTML =html;
    this.dialog.self=this;
    this.shade.style.display = 'block';
    this.dialog.style.display = 'block';
}
CMessageBox.prototype.close=function(param,id)
{
    var dialog=fbis.getobj(id);
    if(dialog)
    {
        var self=dialog.self;
        self.shade.style.display="none";
        //self.fadefun(CMessageBox.prototype.op_high, -20);
        // hide dialog box
        dialog.style.display = 'none';
        // show dropdown menu, iframe & flash
        //self.visibility('visible');
        if(param)
        {
            if(self.onok&&typeof self.onok=="function")
            {
                self.onok();
            }
        }
        else
        {
            if(self.oncancel&&typeof self.oncancel=="function")
            {
                self.oncancel();
            }
        }
        self.oncancel=null;
        self.onok=null;
        //fbis.removeEvent(window, 'resize', self.positionfun);
        //fbis.removeEvent(window, 'scroll', self.positionfun);
        self.shade.innerHTML="";
        dialog.innerHTML="";
        fbis.remove(self.shade);
        fbis.remove(dialog);
    }
}
   

//onok 点击确定执行代码,oncancel是点击取消执行代码,这是因为js无法等待事件发生的缘故，被迫
//使用这种传入处理函数的方式
function MessageBox(title,message,button,onok,oncancel)
{
    var box=new CMessageBox(title,message,button,onok,oncancel);
}