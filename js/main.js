function Blog(){
	this.url = 'http://2.lucienfeel.sinaapp.com/';
	this.url +='?';
	this.logged
	this.m = '';
	this.c = '?';
	this.arg = new Array(); 
}
inherit(Blog,Fun);
var BL = Blog.prototype;

	BL.webshow = function () {
		this.m = 'w'
		$.getJSON(this.url+'m='+this.m+'&c='+this.c,function(json){
			$('title').html(json['name'])
			$('#nav').children('.navleft').children('ul').children('li').children('a').html(json['title'])
		  	$('#slide').children('.top').html('<h5>Welcome to</h5><h2>'+json['title']+'</h2>')
		  	$('#slide').children('.bottom').html('<h3>'+json['contents']+'</h3>')
		  })
	}
	BL.info = function () {
		this.m = 'if'
		this.arg[0] = 'f=1'
		var Arg = this.sendarg(this.arg)
		$.getJSON(this.url+'m='+this.m+Arg+'&c='+this.c,function(json){
		  if(json){
		  	$('#info_about').html(json["about"]);
		  	$('#info_ambition').html(json["ambition"]);
			$('#info_work').html(json["work"]);
			$('#info_contact').html(json["contact"]);
		  }
	  	})
	  	$('.carousel').carousel({
		  interval: 4000
		})
	}
	BL.article_list = function (p,cgg) {
		var load = '<div class="article_content"><div class="loading"></div></div>'
		$("#article_list").html(load)
		this.m = 'al'
		var p = p||this.getint(/p=/)||0, cg = cgg||this.getint(/cg=/)||0
		this.arg[0] = 'p='+p
		this.arg[1] = 'cg='+cg
		var Arg = this.sendarg(this.arg)
		function listshow(url,m,c,logged){
			var plus = '', items = ''
			function rewrite(json){
				if(!json){
			      	items +='<div class="article_content"><h3>抱歉，此目录内暂时没有文章</h3></div>'
			      }else{
			      	var i = 0
				      while(json[i]){
				      	if(logged == true){
					          plus = '<div class="butt"><a class="btn" href="http://lucienthink.sinaapp.com/wp-admin/post.php?action=edit&post='+json[i]["id"]+'">Edit</a></div>'
				        	}
						items += '<div class="article_content"><h3><a href="article.html?i='+json[i]["id"]+'">'+ json[i]["title"] + '</a></h3><div class="time"><span>PubTime:'+json[i]["pubtime"]+'</span>'+plus+'</div><hr><div class="well well-large"><p>'+ json[i]["content"] + '<p><dfn></dfn></p></div><a href="article.html?i='+json[i]["id"]+'">Read more</a></div>'
				      		i++
					  }
			      }
			     // console.log(items)
			      $("#article_list").html(items)
			}
			$.getJSON(url+'m='+m+Arg+'&c='+c,function(json){
			    rewrite(json)
			})
		}
		this.logcheck(this.url,this.m,this.c,listshow)
		this.scrolly('-',$('#article')[0].offsetTop,8)
	}
	BL.category_show = function () {
		this.m = 'ac'
		$.getJSON(this.url+'m='+this.m+'&c='+this.c,function(json){
			var items='', i = 0, num = 0
			while(json[i]){
				num +=  parseInt(json[i]['num'])
				items += '<li><i class="icon-chevron-right"></i><a class="category" href="#cg='+(i+1)+'" onclick="b.article_list(0,'+(i+1)+');b.page(0);">'+json[i]['name']+'('+json[i]['num']+')</a><li>'
				i++
			}
			items += '<li><i class="icon-chevron-right"></i><a class="category" href="#cg=0" onclick="b.article_list(0,0);b.page(0);">所有文章('+num+')</a><li>'
			$('#category').html(items)
		})
	}
	BL.page = function (p) {
		this.m = 'na'
    	var right = p || this.getint(/p=/), cg = this.getint(/cg=/)
		$.getJSON(this.url+'m='+this.m+'&cg='+cg+'&c='+this.c,function(json){
		    var num = Math.ceil(json['num']/10)
		    if(right != 0){
		      var prev = right-1
		      ,next = right+1
		    }else{
		      var next = 1
		    }
		    var last = num-1 , items2 = ''
		    items2 += '<div class="btn-group">' 
		    if(right && right != 0){
		      items2 += '<a class="btn" href="#p=0&cg='+cg+'" onclick="b.article_list(0,'+cg+');b.page(0);">First</a><a class="btn" href="#p='+prev+'&cg='+cg+'" onclick="b.article_list('+prev+','+cg+');b.page('+prev+');">Prev</a>'
		    }
		    for(var i = 0; i < num; i++){
		      var j = i+1
		      if(i == 3 && num > 4){
		        items2 += '<a class="btn btn-link" disabled><b>... ...</b></a>'
		      }
		      else if(i > 3 && i < (num-3)){
		        continue
		      }
		      else if(i == right){
		        items2 += '<a class="btn disabled">'+j+'</a>'
		      }
		      else{
		        items2 += '<a class="btn" href="#p='+i+'&cg='+cg+'" onclick="b.article_list('+i+','+cg+');b.page('+i+');">'+j+'</a>'
		      }
		    }
		    if(right != last){
		      items2 += '<a class="btn" href="#p='+next+'&cg='+cg+'" onclick="b.article_list('+next+','+cg+');b.page('+next+');">Next</a><a class="btn" href="#p='+last+'&cg='+cg+'" onclick="b.article_list('+last+','+cg+');b.page('+last+');">Last</a>'
		    }
		    items2 += '</div>'
		    $('#article_list').next('.page').html(items2)
		  })
	}
	BL.recent = function () {
		this.m = 'ar'
		$.getJSON(this.url+'m='+this.m+'&c='+this.c,function(json){
			var items='', i = 0
			while(json[i]){
				items += '<li><i class="icon-arrow-right"></i><a class="category" href="article.html?i='+json[i]['id']+'">'+json[i]['title']+'</a><li>'
				i++
			}
			$('#recent').html(items)
		})
	}
	BL.article_arc = function () {
		var load = '<div class="article_content"><div class="loading"></div></div>'
		$("#article_list").html(load)
		this.m = 'ai'
		this.arg[0] = 'i='+this.getint(/i=/)
		var Arg = this.sendarg(this.arg)
		function arcshow(url,m,c,logged){
			$.getJSON(url+'m='+m+Arg+'&c='+c,function(json){
		  	  var plus = ''
		      var items
		      if(json){
		  		if(logged == true){
		          plus = '<a class="btn" href="http://lucienthink.sinaapp.com/wp-admin/post.php?action=edit&post='+json["id"]+'">edit</a>'
		        }
			    items = '<div class="article_content"><h3>'+ json["title"] + '</h3><div class="time"><span>PubTime:'+json["pubtime"]+'</span><span>Last Edit Time:'+json["edittime"]+'</span>'+plus+'</div><hr><div class="well well-large"><p>'+ json["content"] + '</p></div></div>'	      
		      }
			  $("#article_arc").html(items)
		  })
		}
		this.logcheck(this.url,this.m,this.c,arcshow)		
	}

var b = new Blog();
//b.webshow();
var name = b.getname();
$(document).ready(function(){
	switch(name){
		case 'index':
			b.info();
			b.article_list();
			b.page();
			b.category_show();
			b.recent();
			break;
		case 'article':
			b.article_arc();
			b.recent();
			break;
  		default:
  			location.href = "index.html";
	}
})