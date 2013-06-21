<?php
session_start();
header('Content-type: application/x-javascript'); 
$c = $_REQUEST['c'];
if ('score'==$_REQUEST['m']){
  $name = iconv('utf-8','gbk',$_REQUEST['name']);
  //或得utf8格式网页内容
  $url="http://www.1518.com/s?st=2&word=".$name."&FrontType=1&submit1";
  @$content=file_get_contents($url);
  $content=iconv("gbk","utf-8",$content);
  $start=strpos($content,"Logo End");
  $content=substr($content,$start);
  $end=strpos($content,"isCH");
  $content=substr($content,0,$end);
  //格字 简略内容
    preg_match_all('<li\>(.+).+span\>(.+)\<.+span.+li>',$content,$info);
    //测试结果 12点内容
    preg_match_all('* (.+).+<br*',$content,$info1);
    for($i=1;$i<13;$i++)
  {
      
    $_SESSION['result_12'][$i-1] = strip_tags($info1[0][$i]);
    
  }
  //格 字的详细内容
    preg_match_all('<li\>(.+)\</li>',$content,$info2);

    for($i=5;$i<10;$i++)
  {
      $tmp=$content;
      if($i == 5)
      $start=strpos($tmp,"name_tabs");
      else
      $start=strpos($tmp,$info2[1][$i]);
      $tmp=substr($tmp,$start);

      if($i == 9)
      $end=strpos($tmp,"function");
      else
      $end=strpos($tmp,$info2[1][$i+1]);

      $tmp=substr($tmp,0,$end);
      $arr = array('<div class="name_content" style="background:#F5F8FD;">','<div class="name_content" style="background:#F5F8FD;padding-top:8px;">','</div>');
      $arr1 = array('<ul id="name_title" style="background:#f5f5f5;">','</ul>','name_tabs" style="border-top:0px;">');
      $tmp = str_replace($arr, "<br>", $tmp);
      $tmp = str_replace($arr1, '', $tmp);
      $tmp = str_replace('li', 'h3', $tmp);
      $_SESSION['ge'][$i-5] = $tmp;
      
  }
//得分
  preg_match_all('*name_num.+>(.+)<*',$content,$score);
  $_SESSION['score'] = $score;
  //print_r( $score);
  //繁体字
    $tmp=$content;
    $start=strpos($tmp,"name_txt");
    $tmp=substr($tmp,$start);
    $end=strpos($tmp,"name_num");
    $tmp=substr($tmp,0,$end);
    preg_match_all('([^a-z_"<\n />=].+)',$tmp,$info3);
    for($i=0;$i<7;$i++) {
       $info3[0][$i] = str_replace('：', ' ：', $info3[0][$i]);
    }

    $_SESSION['zi'][0] = $info3[0][0].$info3[0][1].$info3[0][2].$info3[0][3];
    $_SESSION['zi'][1] = $info3[0][4].$info3[0][5].$info3[0][6];
     //echo $tmp;

    //12点内容下，对什么的影响的匹配
    $tmp=$content;
    $start=strpos($tmp,"基础运");
    $tmp=substr($tmp,$start);
    $end=strpos($tmp,"ctitle");
    $tmp=substr($tmp,0,$end);
    //echo strip_tags($tmp);
    $_SESSION['result_effect'] = $tmp;

    //输出
    $result['score'] = $_SESSION['score'];
    $result['zi'] = $_SESSION['zi'];
    $result = json_encode($result);
    echo $c."(".$result.")";
}
elseif ('ge' == $_REQUEST['m']) {
  $num = $_REQUEST['num'];
  $result['ge'] = $_SESSION['ge'][$num];
  $result = json_encode($result);
  echo $c."(".$result.")";
}
elseif ('result' == $_REQUEST['m']) {
  if('result_12' == $_REQUEST['branch']){
    $result['result_12'] = $_SESSION['result_12'];
    $result = json_encode($result);
    echo $c."(".$result.")";
  }
  elseif ('result_effect' == $_REQUEST['branch']) {
    $result['result_effect'] = $_SESSION['result_effect'];
    $result = json_encode($result);
    echo $c."(".$result.")";
  }
}


?>
