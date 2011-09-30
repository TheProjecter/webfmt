/******************************************************************************
 * $loading: $
 *
 * $Author:  $
 * 		Berlin Qin
 *
 * $History: loading.js $
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

function CLoading(msg,width,height,img)
{
    this.message=msg;
    this.width=width;
    this.height=height
    this.loadstyle=img;
    if(CLoading.prototype.windid==1024)
    {
        CLoading.prototype.windid=0;
    }
    this.id="loading"+CLoading.prototype.windid++;
    this.wind=fbis.createElement("div",{
        "id":(this.id),
        "class":"fbisloading"
    });
    if(this.wind)
    {
        //this.wind.style.width=this.width;
        //this.wind.style.height=this.height;
        this.wind.style.position="absolute";
        var html="<div style=\"position: static !important; position: relative; top: 50%; width:"+this.width+" \">\n  \
              <div align=\"center\" style=\"position: relative; top: -50%;border:4px solid transparent;width:"
        +this.width+"\">"
        +this.message+
        "<img src=\""+this.loadstyle+"\"  alt=\"loding\"> \n\
            </div>\n</div>";
        this.wind.innerHTML=html;
        this.wind.style.display="block";
        document.body.appendChild(this.wind);
        //窗体居中计算
        var winsize=fbis.getWindowSize();
        this.wind.style.left =((winsize.width-this.wind.offsetWidth )  / 2) + 'px';
        this.wind.style.top  = ((winsize.height -this.wind.offsetHeight) / 2) + 'px';
    }
}
    CLoading.prototype.windid=0;   
CLoading.prototype.hide=function(self)
{
    try
    {
        if(self.wind)
        {
            self.wind.style.display="none";
            //fbis.removeChild(self.wind);
            self.wind.innerHTML="";
            self.wind.outerHTML="";
            fbis.remove(self.wind);
            delete self.wind;
            self.wind=null;
        }
    }
    catch(e)
    {
        alert(e);
    }
}

