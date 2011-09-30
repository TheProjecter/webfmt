<?php
/******************************************************************************
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
require_once("base.php");
if(isset($_GET["params"]))
{
    $params = urldecode($_GET["params"]);
    if($params)
    {
        $params = (array) json_decode($params);
        try
        {
            $image = dealPath($_SERVER['DOCUMENT_ROOT'] . $params["url"]);
            $thumb_width = $params["width"];
            $thumb_height = $params["height"];
            $info = array();
            $info['size'] = filesize($image);
            $imageinfo = getimagesize($image);
            if($imageinfo)
            {
                $info['width'] = $imageinfo[0];
                $info['height'] = $imageinfo[1];
            }
            $info['width_height'] = $imageinfo[3];
            $info['mime'] = $imageinfo['mime'];
            unset($imageinfo);
            $imageinfo = pathinfo($image);
            $info['path'] = $imageinfo['dirname'] . '/';
            $info['type'] = strtolower($imageinfo['extension']);
            $info['name'] = $imageinfo['filename'];
            unset($imageinfo, $name);
            $scale = min(1, min($thumb_width/$info['width'], $thumb_height/$info['height']));
            $thumb_width = intval($info['width']*$scale);
            $thumb_height = intval($info['height']*$scale);
            $createfunc = 'imagecreatefrom' . ($info['type']=='jpg' ? 'jpeg' : $info['type']);
            if($info['size']>0&&isset ($info['width'])&&isset ($info['height'])&&$info['height']>0&&$info['width']>0)
            {
                $im = $createfunc($image);
                $thumb_im = $info['type']!='gif'&&function_exists('imagecreatetruecolor') ? imagecreatetruecolor($thumb_width, $thumb_height) : imagecreate($thumb_width, $thumb_height);
                imagecopyresampled($thumb_im, $im, 0, 0, 0, 0, $thumb_width, $thumb_height, $info['width'], $info['height']);
                if($info['type']=='gif'||$info['type']=='png')
                {
                    $bgcolor = imagecolorallocate($thumb_im, 0, 255, 0);
                    imagecolortransparent($thumb_im, $bgcolor);
                }
                $imagefunc = 'image' . ($info['type']=='jpg' ? 'jpeg' : $info['type']);
                $thumbname = 'thumb_' . $info['name'] . '.' . $info['type'];
                header("Content-type: image/" . $info['type']);
                $imagefunc($thumb_im);
                imagedestroy($im);
                imagedestroy($thumb_im);
            }
        }
        catch(Exception $e)
        {
            echo $e->getMessage();
        }
    }
}



?>
