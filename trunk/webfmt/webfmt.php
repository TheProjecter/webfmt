
<?php
/* * ****************************************************************************
 * $webfmt: $
 *
 * $Author:  $
 * 		Berlin Qin
 *
 * $History: webfmt.php $
 *      Berlin Qin    2011/5/15         created
 * $contacted
 *      webfmt@gmail.com
 *      www.webfmt.com
 *
 * *************************************************************************** */
/* ===========================================================================
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
 * *************************************************************************** */
error_reporting(0);
require_once ("config.php");
//调用需要传递一个对象参数过啦,json格式
//路经
$params = array();
if (isset($_GET["params"]))
{
    $params = urldecode($_GET["params"]);
    if ($params)
    {
        $params = base64_decode($params);
        $params = (array) json_decode($params);
        if (!isset($params["basedir"]))
        {
            $params["basedir"] = $config["basedir"];
        }
        if (!isset($params["ftype"]))
        {
            $params["ftype"] = $config["allowfiletype"];
        }
        if (!isset($params["selmod"]))
        {
            $params["selmod"] = "single";
        }
        if (!isset($params["showok"]))
        {
            $params["showok"] = "false";
        }
        if (!isset($params["maxszie"]))
        {
            $params["maxszie"] = $config["maxsize"];
        }
        if (!isset($params["filesid"]))
        {
            $params["filesid"] = null;
        }
        if (!isset($params["folderid"]))
        {
            $params["folderid"] = null;
        }
        //返回值处理函数
        if (!isset($params["ReturnFunc"]))
        {
            $params["ReturnFunc"] = null;
        }
        if (!isset($params["lang"]))
        {
            $params["lang"] = "en";
        }
    }
}
else
{
    $params = array("basedir" => $config["basedir"], "selmod" => "multiselect",
        "ftype" => $config["allowfiletype"], "filesid" => "null",
        "maxszie" => $config["maxsize"], "showok" => "false", "lang" => "en");
}
if (stristr($params["basedir"], $config["basefolder"]) === FALSE)
{
    $param["basedir"] = $config["basefolder"];
}
if (!file_exists(dirname(__FILE__) . "/lang/" . $params["lang"] . ".js"))
{
    $params["lang"] = "en";
}
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script src="js/html.js" type="text/javascript"></script>
        <link rel="STYLESHEET" type="text/css" href="style/filemanage.css" />
        <link rel="STYLESHEET" type="text/css" href="style/menu.css" />
        <link rel="STYLESHEET" type="text/css" href="style/dialog.css" />
        <?php
        echo '<script src="lang/' . $params["lang"] . '.js" type="text/javascript"></script>';
        ?>
        <script  type="text/javascript">
            var fbis=fbis||{};
            fbis.language="<?php echo $params["lang"];?>";
        </script>
        <script src="js/dataview.js" type="text/javascript"></script>
        <script src="js/jstree.js" type="text/javascript"></script>
        <script src="js/urlencode.js" type="text/javascript"></script>
        <script src="js/jexplor.js" type="text/javascript"></script>
        <script src="js/ajaxbase.js" type="text/javascript"></script>
        <script src="js/json2.js" type="text/javascript"></script>
        <script src="js/fbisupload.js"   type="text/javascript"></script>
        <script src="js/loading.js"   type="text/javascript"></script>
        <script src="js/dialog.js"   type="text/javascript"></script>
        <script src="js/fbismenu.js"   type="text/javascript"></script>
        <script src="js/popupmenu.js"   type="text/javascript"></script>
        <script src="js/preview.js"   type="text/javascript"></script>
        <title>Powerful and easy to use Ajax file manager for web browsers.Develop by Berlin.Qin</title>
    </head>
    <body>
        <script src="js/splitterbar.js" type="text/javascript"></script>
        <script type="text/javascript">
            document.oncontextmenu=norightclick;
            document.writeln('<div id="container" >');
            document.writeln('<div id="foldertree" class="left_panel">');
            document.writeln('<div class="menustyle" id="foldertoolbar">');
            document.writeln('<ul>');
            document.writeln('<li><a  href="javascript:refreshFolder()">'+fbis.lang[fbis.language]["refresh"]+'</a></li>');
            document.writeln('<li><a  href="javascript:createFolder()">'+fbis.lang[fbis.language]["createfolder"]+'</a></li>');
            document.writeln('<li><a  href="javascript:renameFolder()">'+fbis.lang[fbis.language]["renamefolder"]+'</a></li>');
            document.writeln('<li><a  href="javascript:DelFolder()">'+fbis.lang[fbis.language]["delfolder"]+'</a></li>');
            document.writeln('</ul>');
            document.writeln('</div>');
            document.writeln('<div id="ftree" class="stree"></div>');
            document.writeln('</div>')
            document.writeln('<div id="fileexplor" class="content_panel">');
            document.writeln('<div id="toolbar">');
            document.writeln('<div id="mainmenu" class="menustyle">');
            document.writeln('<ul>');
            document.writeln('<li><a href="javascript:refreshFiles()">'+fbis.lang[fbis.language]["refresh"]+'</a></li>');
            document.writeln('<li><a href="javascript:void(0)" id="uploader" >'+fbis.lang[fbis.language]["button"]["upload"]+'</a></li>');
            document.writeln('<li><a href="javascript:DelFiles()">'+fbis.lang[fbis.language]["delfile"]+'</a></li>');
            document.writeln('<li><a href="javascript:SelectAll()">'+fbis.lang[fbis.language]["selectall"]+'</a></li>');
            document.writeln('<li><a href="javascript:unSelectAll()">'+fbis.lang[fbis.language]["unselect"]+'</a></li>');
            document.writeln('<li><a  href="javascript:void(0)"  rel="viewmenu">'+fbis.lang[fbis.language]["view"]+'</a><li>');
            document.writeln('<li><a  href="http://www.webfmt.com/" target="view_window">'+fbis.lang[fbis.language]["help"]+'</a><li>');
            document.writeln('<li><a  href="http://www.webfmt.com/" target="view_window">'+fbis.lang[fbis.language]["about"]+'</a><li>');
            document.writeln('<!--');
            document.writeln('<li><a  href="javascript:void(0)"  rel="displaycols">显示</a><li>');
            document.writeln('<li><a  href="javascript:void(0)"  rel="sortmenu">排序</a><li>');
            document.writeln('-->');
            document.writeln('</ul>');
            document.writeln('</div>');
            document.writeln('<div id="viewmenu"  class="dropmenudiv">');
            document.writeln('<div  onclick="javascript:ShowStyle(this,\'default\')">');
            document.writeln('<a   href="javascript:void(0)"><input name="display" type="radio" checked="checked">'+fbis.lang[fbis.language]["zoomimage"]+'</a>');
            document.writeln('</div>');
            document.writeln('<div onclick="javascript:ShowStyle(this,\'icon\')">');
            document.writeln('<a href="javascript:void(0)"><input name="display"  type="radio" >'+fbis.lang[fbis.language]["smallicon"]+'</a>');
            document.writeln('</div>');
            document.writeln('</div>');
            document.writeln('<!--');
            document.writeln('<div id="displaycols"  class="dropmenudiv">');
            document.writeln('<a  onclick="javascript:void(0)" href="javascript:void(0)">扩展名</a>');
            document.writeln('<a onclick="javascript:void(0)"   href="javascript:void(0)">日期</a>');
            document.writeln('<a onclick="javascript:void(0)"  href="javascript:void(0)">大小</a>');
            document.writeln('</div>');
            document.writeln('<div id="sortmenu"  class="dropmenudiv">');
            document.writeln('<a onclick="javascript:void(0)"  href="javascript:void(0)">文件名</a>');
            document.writeln('<a onclick="javascript:void(0)"   href="javascript:void(0)">日期</a>');
            document.writeln('<a onclick="javascript:void(0)"  href="javascript:void(0)">大小</a>');
            document.writeln('</div>');
            document.writeln('-->');
            document.writeln('</div>');
            document.writeln('<div  id="wfhelper" class="fileview"></div>')
            document.writeln('</div>');

            document.writeln('</div>');
            document.writeln('<div oncontextmenu="return false;" id="okbutton" class="statusbar" align="center">');
            document.writeln('<input id="ok" type="button" onclick="javascript:OnOk()" value="'+fbis.lang[fbis.language]["button"]["ok"]+'">');
            document.writeln('<input id="cancel" type="button" onclick="javascript:window.close()" value="'+fbis.lang[fbis.language]["button"]["cancel"]+'">')
            document.writeln('</div>');
        </script>
    </body>

    <script type="text/javascript">
        try
        {
            var basedir="<?php echo $params["basedir"] ?>";
            var fexts=<?php echo json_encode($params["ftype"]) ?>;
            var revid="<?php echo $params["filesid"] ?>";            //接收返回选择的文件的元素id
            var folderid="<?php echo $params["folderid"] ?>";         //接收返回文件夹的元素id
            var selmod="<?php echo $params["selmod"] ?>";//多选单选
            var ReturnFunc ="<?php echo $params["ReturnFunc"] ?>";
            //menudropdown.start("mainmenu","foldertoolbar");
            var fmenu=new CMenu("foldertoolbar");
            var mainmenu=new CMenu("mainmenu");
            var splitter=new CVSplitter("container","foldertree","fileexplor",
            {"splitterClass":"vsplitter",
                "splitterBehaviour":"track",
                "onresize":fileviewresize});

            var folder=new CTree("ftree",fbis.lang[fbis.language]["server"]);
            folder.treeroot.folder=basedir;
            folder.atachEvent("OnItemClick",refreshFiles);
            var fdrpopmenu=new CPopMenu();
            fdrpopmenu.additem(null,fbis.lang[fbis.language]["refresh"],refreshFolder);
            fdrpopmenu.additem(null,null,null,true);
            fdrpopmenu.additem(null,fbis.lang[fbis.language]["createfolder"],createFolder);
            fdrpopmenu.additem(null,fbis.lang[fbis.language]["renamefolder"],renameFolder);
            fdrpopmenu.additem(null,fbis.lang[fbis.language]["delfolder"],DelFolder);
            folder.addPopMenu(fdrpopmenu);

            CUploader.prototype.maxsize= <?php echo $params["maxszie"] ?> ;
            CUploader.prototype.filetype=fexts;
            var uploader=new CUploadButton("uploader","core/upload.php", getfolder,refreshFiles);
            var popmenu=new CPopMenu();
            popmenu.additem(null,fbis.lang[fbis.language]["refresh"],refreshFiles);
            popmenu.additem(null,null,null,true);
            // popmenu.additem(null,fbis.lang[fbis.language]["button"]["upload"]);
            popmenu.additem(null,fbis.lang[fbis.language]["delfile"],DelFiles);
            popmenu.additem(null,fbis.lang[fbis.language]["selectall"],SelectAll);
            popmenu.additem(null,fbis.lang[fbis.language]["unselect"],unSelectAll);
            popmenu.additem(null,null,null,true);
            popmenu.additem(null,fbis.lang[fbis.language]["preview"],preview);
            popmenu.additem(null,fbis.lang[fbis.language]["download"],DownloadFile);
            //        var items=popmenu.getItems();
            //        if(fbis.IsArray(items))
            //        {
            //            popmenu.createMenu(popmenu.items);
            //            var uploadmenu=items[1].id;
            //            if(uploadmenu)
            //            {
            //                var uploader1=new CUploadButton(uploadmenu,"core/upload.php", getfolder,refreshFiles);
            //            }
            //        }
            var fview=new CJexplor("wfhelper","fileview_item","core/upload.php",getfolder,refreshFiles,popmenu);
            fview.selmod=selmod;
            refreshFolder();
            refreshFiles();
        
            if(<?php echo $params["showok"] ?>)
            {
                var obj=fbis.getobj("okbutton");
                obj.style.display="block";
                var lobj=fbis.getobj("foldertree");
                lobj.style.height="80%";
                var robj=fbis.getobj("fileexplor");
                robj.style.height="80%";
            }
        }
        catch(e)
        {
            alert(e);
        }
        function getfolder()
        {
            var result=basedir;
            var selfdlr=folder.getSelectedData();
            if(selfdlr)
            {
                result=selfdlr.folder;
            }
            return result;
        }
        function SelectAll()
        {
            fview.select();
        }
        function unSelectAll()
        {
            fview.unselect();
        }
            
        function refreshFiles(evn,obj)
        {
            var dir=basedir;
            if(obj&&obj.data&&typeof obj.data.folder=="string")
            {
                dir=obj.data.folder;
            }
            else
            {
                var seldir=folder.getSelectedData();
                if(seldir)
                {
                    dir=seldir.folder;
                }
                else
                {
                    folder.select(folder.rootnode);
                }
            }
            var req={"ack":"getfiles","ftype":fexts,"folder":dir};
            fview.getfile(req,"core/core.php");
        }
        function DelFiles()
        {
            var selfiles=fview.getselectObj();
            if(selfiles.length>0)
            {
                if(confirm(fbis.lang[fbis.language]["delflq"]))
                {
                    var req={"ack":"delfiles","files":selfiles};
                    function OnFinish(obj,respons)
                    {
                        try
                        {
                            respons=JSON.parse(respons);
                            if(respons.error==0)
                            {
                                alert(fbis.lang[fbis.language]["delsuccess"]);
                                //fview.RemoveItem(fview.selects);
                                refreshFiles();
                            }
                            else//删除失败
                            {
                                alert(fbis.lang[fbis.language]["delfail"]);
                            }
                        }
                        catch(e)
                        {
                        }
                    }
                    fview.ExcuteRequest(req,"core/core.php",OnFinish);
                }
            }
        }
        function DownloadFile()
        {
            var selfiles=fview.getselectObj();
            if(selfiles.length>0)
            {
                var iframe=null;
                iframe = document.getElementById("fbisDownloader");
                if (iframe === null)
                {
                    iframe = document.createElement('iframe');
                    iframe.id = "fbisDownloader";
                    iframe.style.visibility = 'hidden';
                    document.body.appendChild(iframe);
                }
                iframe.src = "core/download.php?filename="+selfiles[0].url;
            }
        }
        function preview()
        {
            var urls=[];
            var data=fview.getselectObj();
            if(fbis.IsArray(data)&&data.length>0)
            {
                var urls=[];
                for(var i=0;i<data.length;i++)
                {
                    urls.push(data[i].url);
                }
            }
            var p=new CPreview(urls);
            
        }
        function refreshFolder()
        {
            var req={"ack":"getfolder","folder":basedir};
            fview.refreshFolder(req,"core/core.php",folder);
        }
        function createFolder()
        {
            var selfolder=folder.getSelectedData();
            var pdir=basedir;
            if(selfolder)
            {
                pdir=selfolder.folder;
            }
            var nname=prompt(fbis.lang[fbis.language]["inputnewfd"],"newfolder");
            if(nname)
            {
                var  req={"ack":"mkdir","name":nname,"pdir":pdir};
                function OnFinish(obj,respons)
                {
                    try
                    {
                        respons=JSON.parse(respons);
                        if(respons.error==0)
                        {
                            alert(fbis.lang[fbis.language]["createsuccess"]);
                            refreshFolder();
                        }
                        else//创建失败
                        {
                            alert(fbis.lang[fbis.language]["createfail"]);
                        }
                    }
                    catch(e)
                    {
                    }
                }
                fview.ExcuteRequest(req,"core/core.php",OnFinish);
            }

        }
        function DelFolder()
        {
            var selfolder=folder.getSelectedData();
            if(selfolder&&selfolder.folder)
            {
                if(confirm(fbis.lang[fbis.language]["delfdq"]))
                {
                    var req={"ack":"deldir","folder":selfolder.folder};
                    function OnFinish(obj,respons)
                    {
                        try
                        {
                            respons=JSON.parse(respons);
                            if(respons.error==0)
                            {
                                alert(fbis.lang[fbis.language]["delsuccess"]);
                                refreshFolder();
                            }
                            else//删除失败
                            {
                                alert(fbis.lang[fbis.language]["delfail"]);
                            }
                        }
                        catch(e)
                        {
                        }
                    }
                    fview.ExcuteRequest(req,"core/core.php",OnFinish);
                }
            }
        }
        function renameFile()
        {
            var selfiles=fview.getselectObj();
            if(selfiles.length>0)
            {
                var nname=prompt(fbis.lang[fbis.language]["inputnewfn"],selfiles[0].fname);
                if(nname)
                {
                    var req={"ack":"renamefile","file":selfiles[0].url,"newname":nname};
                    function OnFinish(obj,respons)
                    {
                        try
                        {
                            respons=JSON.parse(respons);
                            if(respons.error==0)
                            {
                                alert(fbis.lang[fbis.language]["modifysucc"]);
                                //fview.RemoveItem(fview.selects);
                                var selfolder=folder.getSelectedData()
                                req={"ftype":fexts,"folder":selfolder.dir};
                                fview.getfile(req,"core/core.php");
                            }
                            else//修改失败
                            {
                                alert(fbis.lang[fbis.language]["modifyfail"]);
                            }
                        }
                        catch(e)
                        {
                        }
                    }
                    fivew.ExcuteRequest(req,"core/core.php",OnFinish);
                }
            }
        }
        function renameFolder()
        {
            var sel=folder.getSelectedData();
            if(sel)
            {
                var nname=prompt(fbis.lang[fbis.language]["inputnewfd"],sel.caption);
                if(nname)
                {
                    var req={"ack":"renamedir","folder":sel.folder,"newname":nname};
                    function OnFinish(obj,respons)
                    {
                        try
                        {
                            respons=JSON.parse(respons);
                            if(respons.error==0)
                            {
                                alert(fbis.lang[fbis.language]["modifysucc"]);
                                refreshFolder();
                            }
                            else//删除失败
                            {
                                alert(fbis.lang[fbis.language]["modifyfail"]);
                            }
                        }
                        catch(e)
                        {
                        }
                    }
                    fview.ExcuteRequest(req,"core/core.php",OnFinish);
                }
            }
        }
        function ShowStyle(obj,type)
        {
            if(obj&&type)
            {
                if(fbis.getOs()=="MSIE")
                {
                    obj.firstChild.firstChild.checked=true;
                }
                else
                {
                    obj.firstElementChild.firstElementChild.checked=true;
                }
                fview.show(type);
            }
        }
        function getUrlParam(paramName)
        {
            var reParam = new RegExp('(?:[\?&]|&amp;)' + paramName + '=([^&]+)', 'i') ;
            var match = window.location.search.match(reParam) ;
            return (match && match.length > 1) ? match[1] : '' ;
        }
        function OnOk()
        {
            try
            {
                var data=fview.getselectObj();
                if(fbis.IsArray(data)&&data.length>0)
                {
                    var urls=[];
                    for(var i=0;i<data.length;i++)
                    {
                        urls.push(data[i].url);
                    }
                    var funcNum = getUrlParam('CKEditorFuncNum');
                    if(funcNum)
                    {
                        window.opener.CKEDITOR.tools.callFunction(funcNum,urls.join("|"));
                    }
                    if(ReturnFunc)
                    {
                        var selfolder=folder.getSelectedData();
                        var pdir=basedir;
                        if(selfolder)
                        {
                            pdir=selfolder.folder;
                        }
                        if(window.opener[ReturnFunc])
                        {
                            try
                            {
                                window.opener[ReturnFunc](urls.join("|"),pdir);
                            }
                            catch(e)
                            {
                            }
                        }
                    }
                    //返回选中的文件
                    if(revid)
                    {
                        var robj=fbis.getobjobj(window.opener, revid);
                        if(robj)
                        {
                            robj.value=urls.join("|");
                        }
                    }
                    //返回选中文件夹
                    if(folderid)
                    {
                        var robj=fbis.getobjobj(window.opener, folderid);
                        if(robj)
                        {
                            var selfolder=folder.getSelectedData();
                            var pdir=basedir;
                            if(selfolder)
                            {
                                pdir=selfolder.folder;
                            }
                            robj.value=pdir;
                        }
                    }
                }
            }
            catch(e)
            {
            }
            window.close();
        }
        function fileviewresize()
        {
            fview.show();
        }
    </script>
</html>
