function Manage(){
	this.url = 'http://1.lucienfeel.sinaapp.com/';
	this.url +='?';
	this.logged
	this.m = '';
	this.c = '?';
	this.arg = new Array(); 
}
inherit(Manage,Fun);
var M = Manage.prototype;
	M.webshow = function () {
		this.m = 'w'
		$.getJSON(this.url+'m='+this.m+'&c='+this.c,function(json){
			$('title').html(json['name'])
			$('#nav').children('.navleft').children('ul').children('li').children('a').html(json['title'])
		  	$('#slide').children('.top').html('<h5>Welcome to</h5><h2>'+json['title']+'</h2>')
		  	$('#slide').children('.bottom').html('<h3>'+json['contents']+'</h3>')
		  })
	}
	M.edit = function (text) {	
		$("#sub").attr({"disabled":"disabled"})
		var iframe = document.createElement('iframe')
		iframe.style.display = 'none'
		iframe.id = "submitframe"
		document.body.appendChild(iframe)
		var cw = $('#submitframe').contents()
		cw.find('body').append(text)
		cw.find('form[name="submitform"]').submit()			
		var rem = function(){
			document.body.removeChild(iframe)
			$("#sub").removeAttr("disabled")
		}
		setTimeout(rem,1500)
	}
	M.sign = function () {
		that = this
		function signshow(url,m,c,logged,json){
			if(true == logged){
				if(that.getname() == 'index'){
					location.href = 'manage.html'
				}else{
					$('#nav').children('.navright').children('ul').html('<li><span>'+json+'</span></li><li><a id="logout" href="#">退出</a> </li>')
				}
			}
			else{
				if(that.getname() != 'index'){
					location.href = 'index.html'
				}
			}
		}
		this.logcheck(this.url,this.m,this.c,signshow)
	}
	M.login = function () {
		this.m = 'l'
		$("#login").removeAttr("disabled")
		var text = '<form name="submitform" action="'+this.url+'m='+this.m+'&c='+this.c+'" method="post"><input name="un" value="'+$("#username").val()+'"><input name="pw" value="'+hex_md5($('#password').val())+'"></form>' 
		this.edit(text)
		var rem = function(){
			location.href = "manage.html"
		}
		setTimeout(rem,500)
	}
	M.logout = function () {
		this.m = 'lo'
		$.getJSON(this.url+'m='+this.m+'&c='+this.c,function(json){
		  	location.href = "index.html"
		  })
	}
	M.article_edit = function () {
		this.m = 'ai'
		var i = this.getint(/i=/)
		this.arg[0] = 'i='+	i	
		var Arg = this.sendarg(this.arg)
		var edit = this.edit
		var encode = this.encode
		function editshow(url,m,c,logged,json){
			if(logged != true){
				$('#myModal_log').modal('show'); 
			}
			else{
				var category
				$.getJSON(url+'m=ac&c='+c,function(jsonn){
			  		if(jsonn) {
			  			category = jsonn
			  		}
					$.getJSON(url+'m='+m+Arg+'&c='+c,function(json){
				      var items
				      var items2
				      if(json){
					    items = '<div class="input-prepend"><span class="add-on">标题：</span><input class="span4"  type="text" name="title" id="title" value="'
					    if(json["title"]){
					    	items += json["title"]
					    }
					    items += '"></div><hr><textarea name="editor" style="width:100%;height:400px;visibility:hidden;">'
					    if(json["contents"]){
					    	items += json["contents"]
					    }
					    items += '</textarea>'
					    
					     $("#article_edit").html(items)
					     items2 = '<blockquote>'
					     if(json['pubtime']){
					     	items2 +='<dl><dt>Pubtime:</dt><dd>'+json['pubtime']+'</dd></dl>' 
					     }
					     if(json['edittime']){
					     	items2 +='<dl><dt>Last edit time:</dt><dd>'+json['edittime']+'</dd></dl>'
					     }
					     items2 +='<dl><dt>Category:</dt><dd><select name="category" id="category" class="span2">'
					     for (var i = 0; i < category.length ; i++) {					     	
				     		if(json['category'] && json['category'] == category[i]['id']){
					     		items2 +='<option selected="selected" value="'+category[i]['id']+'">'+category[i]['name']+	'</option>'
					     	}						     					     	
					     	else if(!json['category'] &&  (category.length-1) == i){
					     		items2 +='<option selected="selected" value="'+category[i]['id']+'">'+category[i]['name']+	'</option>'
					     	}
					     	else{
						     	items2 +='<option value="'+category[i]['id']+'">'+category[i]['name']+'</option>'
						}					     	
					     }
					     items2 +='</select></dd></dl></blockquote>'
					     $("#ext").html(items2)
					      KindEditor.ready(function(K) {
					        editor = K.create('textarea[name="editor"]', {
					          allowFileManager : true
					        })
					      })
				      	}
			  		})
				})
			  	$("#sub").bind('click',function(){
			  		var contents = encode(editor.html())
					var text = '<form name="submitform" action="'+url+'m=ea&i='+i+'" method="post"><input name="title" value="'+$("#title").val()+'"><input name="category" value="'+$("#category").val()+'"><input name="contents" value="'+contents+'"></form>'
					edit(text)
				})
			  	
			}
			
			$('#sure_log').bind('click',function(){
			    $('#myModal').modal('hide')
			    location.href = "index.html"
			})
			$('#back').bind('click',function(){
			    $('#myModal').modal('hide')
			    history.go(-1)
			})
		}
	  	this.logcheck(this.url,this.m,this.c,editshow)			
	}
	M.info = function () {
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
	}
	M.info_edit = function () {
		this.info()
		this.m = 'ef'
		var edit = this.edit
		var encode = this.encode
		function editshow(url,m,c,logged,json){
			if(logged != true){
				$('#myModal_log').modal('show'); 
			}
			else{
				var editor = Array()
				KindEditor.ready(function(K) {
						        editor[0] = K.create('textarea[name="info_about"]', {
						          allowFileManager : true
						        })
						      })
				KindEditor.ready(function(K) {
						        editor[1] = K.create('textarea[name="info_ambition"]', {
						          allowFileManager : true
						        })
						      })
				KindEditor.ready(function(K) {
						        editor[2] = K.create('textarea[name="info_work"]', {
						          allowFileManager : true
						        })
						      })
				KindEditor.ready(function(K) {
						        editor[3] = K.create('textarea[name="info_contact"]', {
						          allowFileManager : true
						        })
						      })			
				$("#sub").bind('click',function(){
					var about = encode(editor[0].html())
					var ambition = encode(editor[1].html())
					var work = encode(editor[2].html())
					var contact = encode(editor[3].html())
					var text = '<form name="submitform" action="'+url+'m='+m+'&f=1" method="post"><input name="info_about" value="'+about+'"><input name="info_ambition" value="'+ambition+'"><input name="info_work" value="'+work+'"><input name="info_contact" value="'+contact+'"></form>'
					edit(text)
				})
			}
			$('#sure_log').bind('click',function(){
			    $('#myModal').modal('hide')
			    location.href = "index.html"
			})
			$('#back').bind('click',function(){
			    $('#myModal').modal('hide')
			    history.go(-1)
			})
		}
		this.logcheck(this.url,this.m,this.c,editshow)
	}
	M.article_manage = function (p,cg) {
		var load = '<div class="article_content"><div class="loading"></div></div>'
		$("#article_manage").html(load)
		this.m = 'al'
		var p = p||this.getint(/p=/)||0, cg = cg||this.getint(/cg=/)||0
		this.arg[0] = 'p='+p
		this.arg[1] = 'cg='+cg
		var Arg = this.sendarg(this.arg)		
		function manageshow(url,m,c,logged,json){
			if(logged != true){
		        	$('#myModal_log').modal('show'); 
		      	}
			else{
				$.getJSON(url+'m='+m+Arg+'&c='+c,function(json){
					var plus = ''
					var items = ''
					var i = 0
					if(json == 0){
				      	items +='<div class="article_content"><h3>抱歉，此目录内暂时没有文章</h3></div>'
				    }else{		
				      	while(json[i]){
					      	plus = '<div class="btn-group butt"><a class="btn" href="article_edit.html?i='+json[i]["id"]+'">Edit</a><a class="btn" href="../article.html?i='+json[i]["id"]+'">View</a><button class="btn del" id="'+json[i]["id"]+'">Delete</button></div>'
						    items += '<div><h3><a href="article_edit.html?i='+json[i]["id"]+'">'+ json[i]["title"] + '</a></h2><div><span>PubTime:'+json[i]["pubtime"]+' </span>'+plus+'</div><hr></div>'
					    	i++
				      	}
				    }
		      		$("#article_manage").html(items)		  
		  		})
			}
			$('#sure_log').bind('click',function(){
			    $('#myModal').modal('hide')
			    location.href = "index.html"
			})
			$('#back').bind('click',function(){
			    $('#myModal').modal('hide')
			    history.go(-1)
			})
		}
		this.logcheck(this.url,this.m,this.c,manageshow)		
	}
	M.page = function (p) {
		this.m = 'na'
    	var right = p || this.getint(/p=/), cg = this.getint(/cg=/)
		$.getJSON(this.url+'m='+this.m+'&cg='+cg+'&c='+this.c,function(json){
		    var num = Math.ceil(json['num']/10)
		    if(right != 0){
		      var prev = right-1
		      var next = right+1
		    }else{
		      var next = 1
		    }
		    var last = num-1
		    var items2 = ''
		    items2 += '<div class="btn-group">' 
		    if(right && right != 0){
		      items2 += '<a class="btn" href="#p=0&cg='+cg+'" onclick="b.article_manage(0,'+cg+');b.page(0);">First</a><a class="btn" href="#p='+prev+'&cg='+cg+'" onclick="b.article_manage('+prev+','+cg+');b.page('+prev+');">Prev</a>'
		    }
		    for(var i = 0; i < num; i++){
		      var j = i+1
		      if(i == 3){
		        items2 += '<a class="btn btn-link" disabled><b>... ...</b></a>'
		      }
		      else if(i > 3 && i < (num-3)){
		        continue
		      }
		      else if(i == right){
		        items2 += '<a class="btn disabled">'+j+'</a>'
		      }
		      else{
		        items2 += '<a class="btn" href="#p='+i+'&cg='+cg+'" onclick="b.article_manage('+i+','+cg+');b.page('+i+');">'+j+'</a>'
		      }
		    }
		    if(right != last){
		      items2 += '<a class="btn" href="#p='+next+'&cg='+cg+'" onclick="b.article_manage('+next+','+cg+');b.page('+next+');">Next</a><a class="btn" href="#p='+last+'&cg='+cg+'" onclick="b.article_manage('+last+','+cg+');b.page('+last+');">Last</a>'
		    }
		    items2 += '</div>'
		    $('#article_manage').next('.page').html(items2)
		  })
	}
	M.category_show = function () {
		this.m = 'ac'
		$.getJSON(this.url+'m='+this.m+'&c='+this.c,function(json){
			var items='', i = 0, num = 0
			while(json[i]){
				num +=  parseInt(json[i]['num'])
				items += '<li><i class="icon-chevron-right"></i><a class="category" href="#cg='+json[i]['id']+'" onclick="b.article_manage(0,'+json[i]['id']+');b.page(0);">'+json[i]['name']+'('+json[i]['num']+')</a><li>'
				i++
			}
			items += '<li><i class="icon-chevron-right"></i><a class="category" href="#cg=0" onclick="b.article_manage(0,0);b.page(0);">所有文章('+num+')</a><li>'
			$('#category').html(items)
		})
	}
	M.article_delete = function () {
		var pid
		var url = this.url
		var c = this.c
		$(".del").bind('click',function(){
			pid = this.id
			$('#myModal').modal('show')  
		})
		$('#sure').bind('click',function(){
			this.m = 'da'
			var Arg = '&i='+pid
			$('#myModal').modal('hide')
			$.getJSON(url+'m='+this.m+Arg+'&c='+c,function(json){
			  $(".del").filter("#"+pid).parent().parent().parent().remove()
			})
		})
	}
	M.article_new = function () {
		var url = this.url
		var c = this.c
		$('#new').bind('click',function(){
			var m = 'ia'
			$.getJSON(url+'m='+m+'&c='+c,function(json){
				location.href = "article_edit.html?i="+json['id']
			})
		});
	}
	M.category_edit_show = function () {
		this.m = 'ac'
		function categoryeditshow(url,m,c,logged,z){
			if(logged != true){
		        	$('#myModal_log').modal('show'); 
		      	}
			else{
				$.getJSON(url+'m='+m+'&c='+c,function(json){
					var items = ''
					for (var i = json.length - 1; i >= 0; i--) {									
						plus = '<div class=" span2 btn-group butt"><a id="'+json[i]['id']+'" class="save btn">Save</a><a class="del btn" id="'+json[i]["id"]+'">Delete</a></div>'
			    			items += '<div class="control-group"><label class="control-label">'+ (json.length-i) +'</label><div class="span2"><input class="span2"  type="text" name="category" id="'+json[i]['id']+'" value="'+json[i]['name']+'"></div>'+plus+'</div>'				    					
					}
					$('#category_edit').html(items)
				})
			}
			$('#sure_log').bind('click',function(){
			    $('#myModal').modal('hide')
			    location.href = "index.html"
			})
			$('#back').bind('click',function(){
			    $('#myModal').modal('hide')
			    history.go(-1)
			})
		}
		this.logcheck(this.url,this.m,this.c,categoryeditshow)

	}
	M.category_edit = function () {
		var url = this.url
		var c = this.c
		var edit = this.edit
		function edit_bind(){
			$(".save").bind('click',function(){
				$(".save").attr({"disabled":"disabled"})
				var m = 'ec'
				var id = this.id
				var name = $('#'+id).val()
				var text = '<form name="submitform" action="'+url+'m='+m+'" method="post"><input name="id" value="'+id+'"><input name="name" value="'+name+'"></form>'
				edit(text)
				var tem = function(){
					$(".save").removeAttr("disabled")
				}
				setTimeout(tem,1500)
			})
			$('.del').bind('click',function(){
				$(".del").attr({"disabled":"disabled"})
				var m = 'dc'
				var id = this.id
				$.getJSON(url+'m='+m+'&id='+id+'&c='+c,function(json){
					if('success' == json){
						$('#'+id).parent().parent().remove()
					}
				})
				var tem = function(){
					$(".del").removeAttr("disabled")
				}
				setTimeout(tem,1500)
			})
		}
		$("#new_category").bind('click',function(){
			var id = parseInt($('.save:last').attr('id'))+1
			var num = parseInt($('label:last').html())+1
			var plus = '<div class=" span2 btn-group butt"><button id="'+id+'" class="btn save">save</button><button class="btn del" id="'+id+'">delete</button></div>'
			var items = '<div class="control-group"><label class="control-label">'+num+'</label><div class="span2"><input class="span2"  type="text" name="category" id="'+id+'" value=""></div>'+plus+'</div>'
			$('#category_edit').append(items)
			edit_bind()
		})
		edit_bind()
	}
	M.webset = function() {
		this.m = 'w'
		var edit = this.edit
		function setshow(url,m,c,logged,json){
			if(logged != true){
				$('#myModal_log').modal('show'); 
			}
			else{
				$.getJSON(url+'m='+m+'&c='+c,function(json){
			      var items
			      if(json){
				    items = '<div class="control-group"><label class="control-label" for="name">Web Name:</label><div class="controls"><input class="span4"  type="text" name="name" id="name" value="'
				    if(json["name"]){
				    	items += json["name"]
				    }
				    items += '"></div></div><div class="control-group"><label class="control-label" for="title">Web Title:</label><div class="controls"><input class="span4"  type="text" name="title" id="title" value="'
				    if(json["title"]){
				    	items += json["title"]
				    }
				    items += '"></div></div><div class="control-group"><label class="control-label" for="contents">Describe:</label><div class="controls"><textarea name="contents" id="contents" class="span5" rows=4 >'
				    if(json["contents"]){
				    	items += json["contents"]
				    }
				    items += '</textarea></div></div>'
				    $("#webset").html(items)
			      }	     
			  	})			  	
			  	$("#sub").bind('click',function(){
					var text = '<form name="submitform" action="'+url+'m=ws" method="post"><input name="name" value="'+$("#name").val()+'"><input name="title" value="'+$("#title").val()+'"><input name="contents" value="'+$("#contents").val()+'"></form>'
					edit(text)
				})
			  	
			}
			
			$('#sure_log').bind('click',function(){
			    $('#myModal').modal('hide')
			    location.href = "index.html"
			})
			$('#back').bind('click',function(){
			    $('#myModal').modal('hide')
			    history.go(-1)
			})
		}
	  	this.logcheck(this.url,this.m,this.c,setshow)
	}
	M.account = function () {
		this.m = 'c'
		var edit = this.edit
		function accountshow(url,m,c,logged,json){
			if(logged != true){
				$('#myModal_log').modal('show'); 
			}
			else{	
				$.getJSON(url+'m='+m+'&c='+c,function(json){
			      var items
			      if(json){
				    items = '<div class="control-group"><label class="control-label">Username:</label><div class="controls"><span class="inline">'
				    if(json["username"]){
				    	items += json["username"]
				    }
				    items += '</span></div></div><div class="control-group"><label class="control-label">Nickname:</label><div class="controls"><input type="text" name="nickname" id="nickname" value="'
				    if(json["nickname"]){
				    	items += json["nickname"]
				    }
				    items += '"><span class="help-inline"></span></div></div><div class="control-group"><label class="control-label">Standard article number:</label><div class="controls"><span class="inline">'
				   	if(json["num"]){
				    	items += json["num"]
				    }
				   	items += '</span></div></div><div class="control-group"><label class="control-label">Last logged time:</label><div class="controls"><span class="inline">'
				   	if(json["lasttime"]){
				    	items += json["lasttime"]
				    }
				    items += '</span></div></div><div class="control-group"><label class="control-label">Last logged ip:</label><div class="controls"><span class="inline">'
				   	if(json["lastip"]){
				    	items += json["lastip"]
				    }
				    items += '</span></div></div><div class="control-group"><label class="control-label">This logged ip:</label><div class="controls"><span class="inline">'
				   	if(json["thisip"]){
				    	items += json["thisip"]
				    }
				    items += '</span></div></div>'
				    $("#account").html(items)
			      }	     
			  	})			  	
			  	$("#sub").bind('click',function(){
			  		var pa = /^[a-zA-Z0-9]{1}([a-zA-Z0-9]|[._]){4,19}$/
		  			if(!pa.exec($("#nickname").val())){
		  				$('.help-inline').html('You can only enter a 5-20 start with a letter, with the numbers, "_", "." String!')
		  				$('.help-inline').parent().parent().removeClass().addClass("control-group warning")
		  				return 0
		  			}
					var text = '<form name="submitform" action="'+url+'m=ce" method="post"><input name="nickname" value="'+$("#nickname").val()+'"></form>'
					edit(text)
					$('.help-inline').html('')
		  			$('.help-inline').parent().parent().removeClass().addClass("control-group")
				})
			  	
			}
			
			$('#sure_log').bind('click',function(){
			    $('#myModal').modal('hide')
			    location.href = "index.html"
			})
			$('#back').bind('click',function(){
			    $('#myModal').modal('hide')
			    history.go(-1)
			})
		}
	  	this.logcheck(this.url,this.m,this.c,accountshow)
	}
	M.password = function () {
		this.m = 'p'
		var edit = this.edit
		function accountshow(url,m,c,logged,json){
			if(logged != true){
				$('#myModal_log').modal('show'); 
			}
			else{	
				var items			     				    
			    items = '<div class="control-group"><div class="control-group"><label class="control-label">Old Password:</label><div class="controls"><input type="password" name="oldpasswd" id="oldpasswd">'
			    items += '</div></div><div class="control-group"><label class="control-label">New Password:</label><div class="controls"><input type="password" name="newpasswd" id="newpasswd">'
			   	items += '</div></div><div class="control-group"><label class="control-label">Confirm Password:</label><div class="controls"><input type="password" name="confirm" id="confirm"><span class="help-inline"><span>'
				items += '</div></div><div class="control-group"><div class="controls"><span class="inline"></span></div></div>'
				$("#password").html(items)			  	
			  	$("#sub").bind('click',function(){
			  		var oldpasswd = $('#oldpasswd').val()
			  		var newpasswd = $('#newpasswd').val()
			  		var confirm = $('#confirm').val()
			  		if(newpasswd != confirm){
			  			$('.help-inline').html('Wrong!')
			  			$('.help-inline').parent().parent().removeClass().addClass("control-group warning")
			  		}else{
			  			var pa = /^[a-zA-Z0-9]{1}([a-zA-Z0-9]|[\!\@\#\$\%\^\*\-]){4,19}$/
			  			if(!pa.exec(newpasswd)){
			  				$('.help-inline').html('You can only enter a 5-20 start with a letter, with the numbers, "_", "." String!')
			  				$('.help-inline').parent().parent().removeClass().addClass("control-group warning")
			  				$('.help-inline').parent().parent().prev().removeClass().addClass("control-group warning")
			  				return 0
			  			}
			  			$('.help-inline').html('')
			  			$('.help-inline').parent().parent().removeClass().addClass("control-group")
			  			$('.help-inline').parent().parent().prev().removeClass().addClass("control-group")
			  			var text = '<form name="submitform" action="'+url+'m='+m+'" method="post"><input name="oldpasswd" value="'+hex_md5(oldpasswd)+'"><input name="newpasswd" value="'+hex_md5(newpasswd)+'"></form>'
						edit(text)
						var ch = function check(){
							$.getJSON(url+'m=pc&c='+c,function(data){
								if('true' == data){
									$('.inline').html('Success!')
								}
								else{
									$('.inline').html('The old password id not right!')
								}
							})
						}
						setTimeout(ch,1500)
			  		}					
				})			  	
			}			
			$('#sure_log').bind('click',function(){
			    $('#myModal').modal('hide')
			    location.href = "index.html"
			})
			$('#back').bind('click',function(){
			    $('#myModal').modal('hide')
			    history.go(-1)
			})
		}
	  	this.logcheck(this.url,this.m,this.c,accountshow)
	}

var b = new Manage();
b.webshow();
b.sign();
var name = b.getname();
$(document).ready(function(){
	switch(name){
		case 'index':

			break;
		case 'info_edit':
			b.info_edit();
			b.article_new();
			break;
		case 'article_edit':
			b.article_new();
			b.article_edit();
			break;
		case 'article_manage':
			b.article_manage();
  			b.page();
  			b.category_show();
  			b.article_new();
  			break;
  		case 'category_edit':
  			b.category_edit_show();
  			b.article_new();
  		case 'manage':
  			b.article_new();
  			break;
  		case 'webset':
  			b.webset();
  			b.article_new();
  			break;
  		case 'account':
  			b.account();
  			b.article_new();
  			break;
  		case 'passwd':
  			b.password();
  			b.article_new();
  			break;
  		default:
  			location.href = "index.html";
	}
})
window.onload = function(){
	switch(name){
		case 'article_manage':
			b.article_delete();
			break;
		case 'category_edit':
			b.category_edit();
			break;
	}
	$('#login').bind('click',function(){
		b.login();
	});
	$('#password').bind('keyup',function(event){
		if(event.keyCode == 13){
			b.login();
		}
	});
	$('#logout').bind('click',function(){
		b.logout();
	});
}