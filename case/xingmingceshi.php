
<html lang="en-US"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<?php
//或得utf8格式网页内容
$url="http://www.1518.com/s?st=2&word=%D0%EC%D1%EF&FrontType=1&submit1";
@$content=file_get_contents($url);
$content=iconv("gbk","utf-8",$content);
$start=strpos($content,"Logo End");
$content=substr($content,$start);
$end=strpos($content,"isCH");
$content=substr($content,0,$end);
//格字 简略内容
  preg_match_all('<li\>(.+).+span\>(.+)\<.+span.+li>',$content,$info);
 //var_dump($info);
  echo "<br>";
  //测试结果 12点内容
  preg_match_all('* (.+).+<br*',$content,$info1);
  for($i=1;$i<13;$i++)
{
    
  //echo strip_tags($info1[0][$i]);
  echo "<br>";
  
}
//格 字的详细内容
  preg_match_all('<li\>(.+)\</li>',$content,$info2);
  for($i=5;$i<10;$i++)
{
    
    $tmp=$content;
    $start=strpos($tmp,$info2[1][$i]);
    $tmp=substr($tmp,$start);

    if($i == 9)
    $end=strpos($tmp,"function");
    else
    $end=strpos($tmp,$info2[1][$i+1]);

    $tmp=substr($tmp,0,$end);
   //echo strip_tags($tmp);
    echo "<br>";
}
//得分
  preg_match_all('*name_num.+>(.+)<*',$content,$score);
  //print_r( $score);
  //繁体字
    $tmp=$content;
    $start=strpos($tmp,"name_txt");
    $tmp=substr($tmp,$start);
    $end=strpos($tmp,"name_num");
    $tmp=substr($tmp,0,$end);
    $tmp=str_replace("name_txt\">","",$tmp);
   //$tmp=str_replace("function", "", $tmp);
    echo strip_tags($tmp);
    echo "<br>";
    //12点内容下，对什么的影响的匹配
    $tmp=$content;
    $start=strpos($tmp,"基础运");
    $tmp=substr($tmp,$start);
    $end=strpos($tmp,"ctitle");
    $tmp=substr($tmp,0,$end);
   // echo strip_tags($tmp);
?>
