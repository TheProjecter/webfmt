
<?php
/******************************************************************************
 * $config: $
 *
 * $Author:  $
 * 		Berlin Qin
 *
 * $History: config.php $
 *      Berlin Qin    2004/8/15         created
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
session_start();
$config = array(
    //限定的最基本路径,起安全作用
    "basedir" => "/upfile",
    //最大允许上传文件大小
    "maxsize" => 2*1024*1024,
    //允许上传文件类型,根据需要自行配置
    "allowfiletype" => array("jpg", "png", "ico", "bmp", "jpeg", "gif", "tif",
        "fla", "swf",
        "zip", "7z", "rar", "tar", "gz",
        "doc", "docx", "rtf", "xls", "xlsx", "cvs", "rtx", "txt", "ppt", "pptx",
        "pdf", "xml"
    ),
    //登录函数判断 函数原型 bool IsLogin();返回true表示登录，false表示未登录
    "IsLogin" => null,
    //是否对上传文件自动重命名
    "autorename" => true,
    //自定义的重命名函数, 声明: function fun($ext) 返回新的文件名,传入参数是文件扩展名
    "filenamefun" => null,
    //插件函数
    //文件保存前处理,原型 bool function beforeSave($filename) 返回true表示允许保存，否则不允许保存
    "beforesave" => null,
    //文件保存后处理    函数原型 function afterSave($filename)
    "aftersave" => null,
    //删除文件前处理 函数原型  function beforedel($fileobj)   返回true表示允许保存，否则不允许保存,fileobj对象fname 文件名 url
    "beforedelfile" => null,
    //删除文件后处理 函数原型 function afterdel($fileobj)
    "afterdelfile" => null,
    //重命名文件前处理 函数原型 function beforerename($oldname,$newname),返回false禁止从命名
    "beforerenamefile" => null,
    //重命名文件前处理 函数原型 function afterrename($oldname,$newname)
    "afterrenamefile" => null,
    //删除文件夹前处理
    "beforedeldir" => null,
    //删除文件夹后处理
    "afterdeldir" => null,
    //重命名文件夹前处理
    "beforerenamedir" => null,
    //重命名文件夹后处理
    "afterrenamedir" => null
);

function setfbisfcfg($key, $value)
{
    if($key&&$value)
    {
        $config[$key] = $value;
    }
}

function islogin()
{
//        if ($_SESSION['login'] != "ok")
//        {
//            session_unset();
//            session_destroy();
//            return false;
//            //header("Location: ../../Admin_Login.php");
//            //exit( );
//        }
    return true;
}

?>