<?php

error_reporting(0);
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
include_once ("../config.php");
include_once ("base.php");

function getdirfiles($dir, $exts)
{
    $path = $_SERVER['DOCUMENT_ROOT'];
    $path = PathBckSlash($path);
    $result = array();
    if(is_dir($path . $dir))
    {
        $dp = dir($path . $dir);
        while(($file = $dp->read())!==false)
        {
            if($file!='.'&&$file!='..')
            {
                if(!is_dir($path . $dir . "/" . $file))
                {
                    if(in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), $exts))//过滤
                    {
                        $fpropert = lstat($path . $dir . "/" . $file);
                        if($fpropert)
                        {
                            $result[] = array("fname" => $file,
                                "url" => $dir . "/" . $file, "ctime" => date("Y-m-d H:i:s", $fpropert[10]), "size" => round($fpropert[7]/1024) . "k");
                        }
                    }
                }
            }
        }
        $dp->close();
    }
    return $result;
}

function getdirs($dir)
{
    $result = array();
    $path = $_SERVER['DOCUMENT_ROOT'];
    $path = PathBckSlash($path, "/") . $dir;
    if(is_dir($path))
    {
        $dp = dir($path);
        while(($file = $dp->read())!==false)
        {
            if($file!='.'&&$file!='..')
            {
                clearstatcache();
                if(is_dir($path . "/" . $file))
                {
                    //$folder= array("name" => $dir . "/" . $file);
                    $subfolders = getdirs($dir . "/" . $file);
                    $result[] = array("name" => $file, "dir" => $dir . "/" . $file, "isfldr" => true,
                        "subfolder" => $subfolders);
                }
            }
        }
        $dp->close();
    }
    return $result;
}

function delfile($file, $bfdel, $afdel, $path)
{
    $allow = true;
    $result = false;
    try
    {
        if($bfdel) 
        {
            $allow = $bfdel($file);  
        }
        if($allow)
        {
            $result = unlink($path . $file->url);
            if($afdel)
            {
                $afdel($file);
            }
        }
    }
    catch(Exception $e)
    {

    }
    return $result;
}

function delfiles($files)
{
    $result = array("error" => -2);    
    $path = $_SERVER['DOCUMENT_ROOT'];
    $path = trim($path, "/");
    $reffiles = array();
    $befordelfun = $config["beforedelfile"];
    $afterdelfun = $config["afterdelfile"];
    if(is_array($files))
    {

        for($i = 0;
            $i<count($files);
            $i++)
        {
            if(!delfile($files[$i], $befordelfun, $afterdelfun, $path))
            {
                $reffiles[] = $files[$i]->fname;
            }
        }
    }
    else
    {
        if(!delfile($files, $befordelfun, $afterdelfun, $path))
        {
            $reffiles[] = $files->fname;
        }
    }
    if(count($reffiles)>0)
    {
        $result = array("error" => -3, "nrfiles" => $reffiles);
    }
    else
    {
        $result = array("error" => 0);
    }
    return $result;
}

$result = array("error" => -1); 
$fun = $config["IsLogin"];
$blogin=true;
if($fun)
{
    $blogin=$fun();
}
if($blogin)
{
    $params = array();
    if(isset($_POST["params"]))
    {
        $params = $_POST["params"];
        if($params)
        {
            //$params = base64_decode($params);
            $params = (array) json_decode($params);
            switch($params["ack"])
            {
                case "getfolder":
                    {
                        $dir = $config["basedir"];
                        if($params["folder"])
                        {
                            $dir = $params["folder"];
                        }
                        $dirs = getdirs($dir);
                        $result = array("error" => 0, "dirs" => $dirs);
                    }
                    break;
                case "getfiles":
                    {
                        $dir = $config["basedir"];
                        if($params["folder"])
                        {
                            $dir = $params["folder"];
                        }
                        $exts = $config["allowfiletype"];
                        if($params["ftype"])
                        {
                            $exts = $params["ftype"];
                        }
                        $files = getdirfiles($dir, $exts);
                        $result = array("error" => 0, "files" => $files);
                    }
                    break;
                case "delfiles":
                    {
                        if($params["files"])
                        {
                            $result = delfiles($params["files"]);
                        }
                    }
                    break;
                case "mkdir": 
                    {
                        if($params["name"]&&$params["pdir"])
                        {
                            $path = $_SERVER['DOCUMENT_ROOT'];
                            $path = trim($path, "/");
                            if(!file_exists($path . $params["pdir"] . "/" . $params["name"]))
                            {
                                $rev = createFolder($path . $params["pdir"] . "/" . $params["name"]);
                                if($rev)
                                {
                                    $result = array("error" => 0);
                                }
                            }
                            else
                            {
                                $result = array("error" => -9);
                            }
                        }
                        else
                        {
                            $result = array("error" => -101); 
                        }
                    }
                    break;
                case "deldir":
                    {
                        if($params["folder"])
                        {
                            $bfdeldirfun = $config["beforedeldir"];
                            $afdeldirfun = $config["afterdeldir"];
                            $ballow = true;
                            if($bfdeldirfun)
                            {
                                $ballow = $bfdeldirfun($params["folder"]);
                            }
                            if($ballow)
                            {
                                $path = $_SERVER['DOCUMENT_ROOT'];
                                $path = trim($path, "/");
                                $rev = rmdir($path . $params["folder"]);
                                if($rev)
                                {
                                    if($afdeldirfun)
                                    {
                                        $afdeldirfun($params["folder"]);
                                    }
                                    $result = array("error" => 0);
                                }
                                else
                                {
                                    $result = array("error" => -5);
                                }
                            }
                            else
                            {
                                $result = array("error" => -6);
                            }
                        }
                    }
                    break;
                case "renamedir":
                    {
                        if($params["folder"]&&$params["newname"])
                        {
                            $afrenamefun = $config["afterrenamedir"];
                            $bfrenamefun = $config["beforerenamedir"];
                            $ballow = true;
                            if($bfrenamefun)
                            {
                                $ballow = $bfrenamefun($params["folder"], $params["newname"]);
                            }
                            if($ballow)
                            {
                                $path = $_SERVER['DOCUMENT_ROOT'];
                                $path = trim($path, "/");
                                $rev = rename($path . $params["folder"], $path . dirname($params["folder"]) . "/" . $params["newname"]);
                                if($rev)
                                {
                                    $result = array("error" => 0);
                                    if($afrenamefun)
                                    {
                                        $afrenamefun($params["folder"], $params["newname"]);
                                    }
                                }
                                else
                                {
                                    $result = array("error" => -7);
                                }
                            }
                            else
                            {
                                $result = array("error" => -8);
                            }
                        }
                    }
                    break;
                case "renamefile":
                    {
                        if($params["file"]&&$params["newname"])
                        {
                            $bfrenameffun = $config["beforerenamefile"];
                            $afrenameffun = $config["afterrenamefile"];
                            $ballow = true;
                            if($bfrenameffun)
                            {
                                $ballow = $bfrenameffun($params["file"], $params["newname"]);
                            }
                            if($ballow)
                            {
                                $path = $_SERVER['DOCUMENT_ROOT'];
                                $path = trim($path, "/");
                                $rev = rename($path . $params["file"], $webdir . dirname($params["file"]) . "/" . $params["newname"]);
                                if($rev)
                                {
                                    $result = array("error" => 0);
                                    if($afrenameffun)
                                    {
                                        $afrenameffun($params["file"], $params["newname"]);
                                    }
                                }
                                else
                                {
                                    $result = array("error" => -9);
                                }
                            }
                            else
                            {
                                $result = array("error" => -10);
                            }
                        }
                    }
                    break;
            }
        }
        else
        {
            array("error" => -2);
        }
    }
    else
    {
       array("error" => -3);
    }
}
echo json_encode($result);
?>


