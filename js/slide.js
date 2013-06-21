function Slide(){}
inherit(Slide,Fun);
var S = Slide.prototype;
//欢迎页面上拉
S.pageUp = function () {
	fn = function(){
		$('#slide').css('display','none')
	}
	this.updown($('#slide'),'n',0-document.documentElement.clientHeight,3,fn)

}
//欢迎页面下拉
S.pagedown = function () {
	$('#slide').css('display','block')
	this.updown($('#slide'),'s',0,3)
	
}
//滚轴转到关于我
S.tome = function () {
	this.scrolly('-',0,3)
}
//滚轴转到文章列表
S.toarticle = function () {
	var s = $('#article')[0].offsetTop, w = window.scrollY || document.body.parentNode.scrollTop 
	if(w < s) this.scrolly('+',s,3)
	else if(w > s) this.scrolly('-',s,3)
}
//开场动画
S.cartoon = function () {
	var ct = $('#cartoon'), ch = [], ctt = [], that = this
	for (var i = 0; i < ct.children().length; i++) {
		ch[i] = ct.children('div:eq('+i+')')
	}
	ct.css('display','block')
	this.opacity(ct,1)
	this.fade(ch)
	ctt[0] = ct
	setTimeout(function(){
		that.fadein(ctt)
	},6000)
}
//绑定事件
S.eventBind = function () {
	var that = this
	
	//检测浏览器版本是否过老，显示提示
	if(this.css3() == false){
		var inner = '<div class="no-css3"><h5>检测到您的浏览器版本过低，若想得到更好的效果，请跟换chrome、firefox、或者IE9以上版本的浏览器，或者进入本博客的老版本，<a href="http://2.lucienfeel.sinaapp.com">点此进入</a></h5></div>'
		$('#slide').append(inner)
	}
	//绑定轮回求按钮
	var mid = $('#slide').children('.middle'), dot = $('#dot')
	dot.children('.dot_main').bind('click',function(){
		var ct = dot.children('.dot_fade'), ctt = []
		ctt[0] = ct
		if(!ct.css('display')||ct.css('display') == 'none'){
			ct.css('display','block')
			that.fadeout(ctt)
		}
		else if(ct.css('display')||ct.css('display') != 'none'){		
			that.opacity(ct,0)
			ct.css('display','none')
		}
	})
	dot.children('.dot_fade').children('.dot_home').bind('click',function(){
		that.pagedown()
	})
	//绑定slide页面按钮
	var name = this.getname()
	$('#slide').children('.right').children('.circle').bind('click',function(){
		that.cartoon()
	});
	mid.children().bind('click',function(){
		that.pageUp()
	});
	switch(name){
		case 'index':
			//跳转地址栏指示目标位置
			if(slide.getint(/article=/)){
				window.scrollTo(0,$('#article')[0].offsetTop-300)
			}
			if(slide.getint(/about=/)){
				window.scrollTo(0,0)
			}
			mid.children('.mid_right').bind('click',function(){
				that.toarticle()
			});
			mid.children('.mid_left').bind('click',function(){
				that.tome()
			});
			bottom_bind = function(num){
				mid.children('.mid_bottom_'+num).bind('click',function(){
					b.article_list(0,num)
					b.page(0)
					that.toarticle()
					location.href = '#cg='+num
				});
			};
			for (var i = 1; i <= 4; i++) {
				bottom_bind(i)
			};
			dot.children('.dot_fade').children('.dot_me').bind('click',function(){
				that.tome()
			});
			dot.children('.dot_fade').children('.dot_article').bind('click',function(){
				that.toarticle()
			});
			break;
		case 'article':
			mid.children('.mid_right').bind('click',function(){
				location.href = 'index.html#article=1'
			});
			mid.children('.mid_left').bind('click',function(){
				location.href = 'index.html#about=1'
			});
			bottom_bind = function(num){
				mid.children('.mid_bottom_'+num).bind('click',function(){
					location.href = 'index.html#article=1&cg='+num
				});
			};
			for (var i = 1; i <= 4; i++) {
				bottom_bind(i)
			};
			dot.children('.dot_fade').children('.dot_me').bind('click',function(){
				location.href = 'index.html#about=1'
			});
			dot.children('.dot_fade').children('.dot_article').bind('click',function(){
				location.href = 'index.html#article=1'
			});
			break;
		default:
  			location.href = "index.html";
	}
}

var slide = new Slide();
if(!slide.cookie.get('cartoon')){
		slide.cartoon();
		setTimeout(function(){
			slide.cookie.add('cartoon',1,24);
		},8000);
}
if(slide.cookie.get('slide') || slide.getname() != 'index'){
	slide.pageUp();
}else{
	setTimeout(function(){
		slide.cookie.add('slide',1,0.2);
	},8000);
}
$(document).ready(function(){
	slide.eventBind();
})