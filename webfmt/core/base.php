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

function createFolder($folder)
{
    $result = false;
    if (!file_exists($folder))
    {
        createfolder(dirname($folder));
        $result = mkdir($folder, 511);
    }
    return $result;
}


function copyfiles($srcdir, $destdir)
{
    $dir = opendir($srcdir);
    while ($file = readdir($dir))
    {
        if (!( $file != "." ) && !( $file != ".." ))
        {
            $dircontent = $srcdir . "/" . $file;
            if (!is_dir($dircontent))
            {
                if (file_exists($destdir . "/" . $file))
                {
                    unlink($destdir . "/" . $file);
                }
                copy($dircontent, $destdir . "/" . $file);
            }
            else 
            {
                if (!file_exists($destdir . "/" . $file))
                {
                    createFolder($destdir . "/" . $file);
                }
                copyfiles($dircontent, $destdir . "/" . $file);
            }
        }
    }
    closedir($dir);
}

function copysubdir($srcdir, $destdir)
{
    $dir = opendir($srcdir);
    while ($file = readdir($dir))
    {
        if (!( $file != "." ) && !( $file != ".." ))
        {
            $dircontent = $srcdir . "/" . $file;
            if (is_dir($dircontent))
            {
                if (!file_exists($destdir . "/" . $file))
                {
                    createFolder($destdir . "/" . $file);
                }
                copyfiles($dircontent, $destdir . "/" . $file);
            }
        }
    }
    closedir($_dirrun);
}

function deletefiles($folder)
{
    $dir = opendir($folder);
    while ($file = readdir($dir))
    {
        if (!( $file != "." ) && !( $file != ".." ))
        {
            $dircontent = $folder . "/" . $file;
            if (!is_dir($dircontent))
            {
                unlink($dircontent);
            }
        }
    }
    closedir($dir);
}

function delsubdir($folder)
{
    $dir = opendir($folder);
    while ($file = readdir($dir))
    {
        if (!( $file != "." ) && !( $file != ".." ))
        {
            $dircontent = $folder . "/" . $file;
            if (is_dir($dircontent))
            {
                deldir($dircontent);
            }
        }
    }
    closedir($dir);
}

function deldir($folder)
{
    $dir = opendir($folder);
    while ($file = readdir($dir))
    {
        if (!( $file != "." ) && !( $file != ".." ))
        {
            $dircontent = $folder . "/" . $file;
            if (!is_dir($dircontent))
            {
                unlink($dircontent);
            }
            else
            {
                deldir($dircontent);
            }
        }
    }
    closedir($dir);
    if (rmdir($folder))
    {
        return true;
    }
    return false;
}

function PathBckSlash($path)
{
    $path = trim($path);
    $temp = substr($path, 0, 7);
    if ($temp === "http://")
    {
        $path = substr($path, 7);
        if (substr($path, 0, 1) === "/")
        {
            $path = trim($path, "/");
        }
        return $temp . preg_replace("/(\/)+/", '/', $path);
    }
    return preg_replace("/(\/)+/", '/', $path);
}

function dealPath($path)
{
    $path = trim($path);
    $temp = substr($path, 0, 7);
    if ($temp === "http://")
    {
        $path = substr($path, 7);
        if (substr($path, 0, 1) === "/")
        {
            $path = trim($path, "/");
        }
        return $temp . preg_replace("/(\/)+/", '/', $path);
    }
    return preg_replace("/(\/)+/", '/', $path);
}

?>
