
<html lang="en-US"><head><meta http-equiv="Content-Type" content="text/html; charset=GBK">
<?php
        $contents = file_get_contents("http://appdev.sysu.edu.cn/~mad/10389233/interface_xuyang.php?name=".mb_convert_encoding($_GET['name'],"gbk","utf-8")."&type=1");
        $conten=explode("$",$contents);
	echo mb_convert_encoding("命格系数：","gbk","utf-8");
        foreach($conten as $abc){echo $abc."<br/>";}
?>
</html>
