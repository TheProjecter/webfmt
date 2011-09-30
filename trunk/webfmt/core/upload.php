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
require_once("base.php");

class CXmlHttpUpload
{

    function save($path, $file="")
    {
        $result = array('error' => 0);
        try
        {
            $input = fopen("php://input", "r");
            $temp = tmpfile();
            $realSize = stream_copy_to_stream($input, $temp);
            fclose($input);
            if ($realSize !== $this->getSize())
            {
                $result = array('error' => -2);
            }
            else
            {
                $target = fopen($path, "w");
                fseek($temp, 0, SEEK_SET);
                stream_copy_to_stream($temp, $target);
                fclose($target);
            }
        }
        catch (Exception $e)
        {
            $result = array('error' => -5, "exception" => $e->getMessage());
        }
        return $result;
    }

    function getName($file="")
    {
        return $_GET['upfile'];
    }

    function getSize($file="")
    {
        if (isset($_SERVER["CONTENT_LENGTH"]))
        {
            return (int) $_SERVER["CONTENT_LENGTH"];
        }
        return 0;
    }

}

class CFormUpload
{

    public function save($path, $file)
    {
        $result = array('error' => 0);
        $error = $_FILES[$file]["error"];
        switch ($error)
        {
            case 0: {
                    if (empty($_FILES[$file]['tmp_name']) || $_FILES['upload']['tmp_name'] == 'none')
                    {
                        $result = array(
                            'error' => -2
                        );
                    }
                    else
                    {
                        if (move_uploaded_file($_FILES[$file]['tmp_name'], $path))
                        {
                            $result = array('error' => 0);
                        }
                        else
                        {
                            $result = array('error' => -6);
                        }
                    }
                }
                break;
            case '1':
                //                $msg = "\"errormsg\":\"The uploaded file exceeds the upload_max_filesize directive in php.ini\"";
                //                $error=-4;
                $result = array(
                    'error' => -7 // 'The uploaded file exceeds the upload_max_filesize directive in php.ini'
                );
                break;
            case '2':
                //                $msg = '\"errormsg\":\"The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form\"';
                //                $error=-5;
                $result = array(
                    'error' => 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form'
                );
                break;
            case '3':
                //                $msg = '\"errormsg\":\"The uploaded file was only partially uploaded\"';
                //                $error = -6;
                $result = array(
                    'error' => 'The uploaded file was only partially uploaded'
                );
                break;
            case '4':
                //                $msg = '\"errormsg\":\"No file was uploaded\"';
                //                $error =-7;
                $result = array(
                    'error' => 'No file was uploaded'
                );
                break;
            case '6':
                //                $msg = '\"errormsg\":\"Missing a temporary folder\"';
                //                $error =-8;
                $result = array(
                    'error' => 'Missing a temporary folder'
                );
                break;
            case '7':
                //                $msg = '\"errormsg\":\"Failed to write file to disk\"';
                //                $error =-9;
                $result = array(
                    'error' => 'Failed to write file to disk'
                );
                break;
            case '8':
                //                $msg = '\"errormsg\":\"File upload stopped by extension\"';
                //                $error=-10;
                $result = array(
                    'error' => 'File upload stopped by extension'
                );
                break;
            case '999':
            default:
                //                $msg = '\"errormsg\":\"No error code avaiable\"';
                //                $error = -900;
                $result = array(
                    'error' => 'No error code avaiable'
                );
                break;
        }
        return $result;
    }

    public function getName($file)
    {
        return $_FILES[$file]['name'];
    }

    public function getSize($file)
    {
        return $_FILES[$file]['size'];
    }

}

$result = array(
    'error' => -1
);
$fun = $config["IsLogin"];
$blogin = true;
if ($fun)
{
    $blogin = $fun();
}
if ($blogin)
{
    $dir = $basefolder;
    $file = "";
    $uploader = null;
    $error = 0;
    try
    {
        if (isset($_GET['folder']))
        {
            $dir = $_GET['folder'];
        }
        else
        {
            if (isset($_POST['folder']))
            {
                $dir = $_POST['folder'];
            }
        }
        if (isset($_GET["upformfile"]))
        {
            $file = $_GET["upformfile"];
            $uploader = new CFormUpload();
        }
        else if (isset($_GET['upfile']))
        {
            $uploader = new CXmlhttpUpload();
        }
        else
        {
            $uploader = null;
            $result = array(
                'error' => -2  // 'No file was uploaded...'
            );
        }
        if ($uploader)
        {
            $file_path = pathinfo($uploader->getName($file));
            $filesize = $uploader->getSize($file);
            if ($filesize > 0)
            {
                if ($filesize <= $config["maxsize"])
                {
                    $filename = substr($file_path["basename"], 0, strrpos($file_path["basename"], "."));
                    $ext = strtolower($file_path["extension"]);
                    if (in_array($ext, $config["allowfiletype"]))
                    {
                        if ($config["autorename"])
                        {
                            if ($config["filenamefun"])
                            {
                                $fun = $config["filenamefun"];
                                $newfile = $fun($ext);
                            }
                            else
                            {
                                $newfile = date("Ymd") . uniqid() . "." . $file_path["extension"];
                            }
                        }
                        else
                        {
                            $newfile = $file_path["basename"];
                        }
                        //$newfile = base64_encode($filename) . "." . $file_path["extension"];
                        //echo $newfile;

                        $target_path = dealPath($_SERVER['DOCUMENT_ROOT'] . $dir . "/" . $newfile);
                        if (!file_exists($target_path))
                        {
                            $allowsave = true;
                            if ($config["beforesave"])
                            {
                                $fun = $config["beforesave"];
                                $allowsave = $fun($file_path["basename"], $ext);
                            }
                            if ($allowsave)
                            {
                                $result = $uploader->save($target_path, $file);
                                if($config["aftersave"])
                                {
                                    $fun=$config["aftersave"];
                                    $fun($target_path,$newfile,$ext);
                                }
                            }
                            else
                            {
                                $result = array('error' => -9);
                            }
                        }
                        else
                        {
                            $result = array('error' => -3);
                        }
                    }
                    else
                    {
                        $result = array('error' => -4);
                    }
                }
                else
                {
                    $result = array('error' => -8);
                }
            }
            else
            {
                $result = array('error' => -2);
            }
        }
    }
    catch (Exception $e)
    {
        $result = array(
            'error' => -5, "exception" => $e->getMessage()
        );
    }
}
else
{
    $result = array(
        'error' => -1
    );
}
echo json_encode($result);
?>
