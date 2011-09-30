<?php

/* * ****************************************************************************
 * $base: $
 *
 * $Author:  $
 * 		Berlin Qin
 *
 * $History: base.js $
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
include_once ('../config.php');
include_once ('base.php');
$result = array(
    'error' => -1  //请先登录!
);
$fun = $config["IsLogin"];
$blogin = true;
if ($fun)
{
    $blogin = $fun();
}
if ($blogin)
{
    $filename = "";
    $error = 0;
    try
    {
        if (isset($_GET["filename"]))
        {
            $filename = $_GET["filename"];
        }
        else if (isset($_POST['filename']))
        {
            $filename = $_GET["filename"];
        }
        else
        {
            $result = array(
                'error' => -2  // 'No file was download...'
            );
        }
        if ($filename)
        {
            $filename = trim($filename, '\'');
            $filename = dealPath($_SERVER['DOCUMENT_ROOT'] . "/" . $filename);
            if (file_exists($filename))
            {
                if (ini_get('zlib.output_compression'))
                {
                    ini_set('zlib.output_compression', 'Off');
                }
                header('Content-Description: File Transfer');
                header('Content-Type: application/octet-stream');
                header('Content-Disposition: attachment; filename=' . basename($filename));
                header('Content-Transfer-Encoding: binary');
                header('Expires: 0');
                header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
                header('Pragma: public');
                header('Content-Length: ' . filesize($filename));
                ob_clean();
                flush();
                readfile($filename);
                exit();
            }
            else
            {
                $result = array(
                'error' => -3);
            }
            exit();
        }
        else
        {
            $result = array(
                'error' => -2);
        }
    }
    catch (Exception $e) //异常处理
    {
        $result = array(
            'error' => -5, "exception" => $e->getMessage()
        );
    }
}
else
{
    $result = array(
        'error' => -1  // '请先登录管理系统'
    );
}
echo json_encode($result);
?>