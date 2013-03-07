function object(o){
	function F(){};
	F.prototype = o;
	return new F();
}
//继承函数，第一个参数为子类，第二个参数为超类
function inherit(a,b){
	var prototype = object(b.prototype);
	prototype.constructor = a;
	a.prototype = prototype;
}
function Fun(){};
Fun.prototype = {
	//判断是否为移动客户端
	mobile: function () {
		var sUserAgent= navigator.userAgent.toLowerCase(); 
	    var bIsIpad= sUserAgent.match(/ipad/i) == "ipad"
	    var bIsIphoneOs= sUserAgent.match(/iphone os/i) == "iphone os" 
	    var bIsMidp= sUserAgent.match(/midp/i) == "midp"
	    var bIsUc7= sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4" 
	    var bIsUc= sUserAgent.match(/ucweb/i) == "ucweb"
	    var bIsAndroid= sUserAgent.match(/android/i) == "android"
	    var bIsCE= sUserAgent.match(/windows ce/i) == "windows ce"
	    var bIsWM= sUserAgent.match(/windows mobile/i) == "windows mobile"
	    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) { 
	    	return 'mobile'
	    } else { 
		    return 'pc'
	    } 
	}
	//判断是否支持css3
	,css3: function () {
		var element = document.createElement('div');
		if('opacity' in element.style){
		    return true;
		}else{
		    return false;
		}
	}
	//操作cookie
	,cookie: {
		//获取所有cookie
		getall: function () {
			var arr = document.cookie.split('; ')
			return arr
		}
		//获取制定名称的cookie值
		,get: function (name) {
			var arr = this.getall()
			for (var i = 0; i < arr.length; i++) {
				var c = arr[i].split('=')
				if(name == c[0]) return unescape(c[1])
			}
		}
		//添加cookie，hours为保持时间，不填或者填0则为关闭浏览器为止
		,add: function (name,value,hours) {
			var c = name + '=' + escape(value)
			if(hours||hours==0){
				var date = new Date()
				var ms = hours*3600*1000
				date.setTime(date.getTime() + ms)
				c += '; expires=' + date.toGMTString()
			}
			document.cookie = c
		}
		//删除cookie
		,del: function (name) {
			if(this.get(name) != null){
				document.cookie = name + '=; expires=' + (new Date(0)).toGMTString()
			}
		}
	}
	//定时器，传递参数fn函数，必须返回0或1，返回1继续定时执行，返回0结束
	,interval: function (fn,time){
		setTimeout(function(){
			var p = fn()
			if(p == 1) setTimeout(arguments.callee, time)
		}, time)
	}
	//div上下左右定时滑动，div为框体，dir为移动的方向,"n"为向上,"s"为向下，"e"为左，"w"为右，stop为top停止负高度，speed为速度(取数字1、2、3等，越大越快),fn为后续操作函数
	,updown: function (div,dir,stop,speed,fn){
		var fn = fn||function(){}
		if(dir == 'n' || dir == 's') var num = parseInt(div.css('top'))||0
		else if(dir == 'e' || dir == 'w') var num = parseInt(div.css('left'))||0
		if('mobile' == this.mobile()){
			div.css('top',stop+'px')
			fn()
		}
		else{
			var fnt = function(){
				if(dir == 'n' || dir == 'e' ){
					if(num <= stop){
						div.css('top',stop+'px')
						fn()
						return 0
					} 
					num -= 15*speed
				}
				else if(dir == 's' || dir == 'w'){
					if(num >= stop){
						div.css('top',stop+'px')
						fn()
						return 0
					} 
					num += 15*speed
				}
				div.css('top',num+'px')
				return 1
			}

			this.interval(fnt,15)
		}
		
	}
	//滚轴上下滚动，dir为移动的方向，"+"为向下滚动，"-"为向上滚动，Y为停止位置，speed为速度(取数字1、2、3等，越大越快)
	,scrolly: function (dir,Y,speed){
		if('mobile' == this.mobile()){
			window.scrollTo(0,Y)
		}
		else{
			var s = window.scrollY || document.body.parentNode.scrollTop 
			var fn = function(){
				if(dir == '+'){
					if(s >= Y) return 0
					s += 15*speed
				}
				else if(dir == '-'){
					if(s <= Y) return 0
					s -= 15*speed
				}
				window.scrollTo(0,s)
				return 1
			}
			this.interval(fn,15)
		}
		
	}
	//惰性载入判断使用透明效果的方式
	,opacity: function (div,f) {
		if(this.css3() == false && navigator.appName.indexOf("Microsoft") != -1){
			//IE
			this.opacity = function (div,f) {
				div.css('filter','alpha(opacity='+f*100+')')
			}	
		}
		else if(this.css3() == true){
			//其他支持css3的浏览器
			this.opacity = function (div,f) {
				div.css('opacity',f)
			}
		}
	}
	//淡出,传入div必须为数组，允许多个框架依次执行淡出效果
	,fadeout: function (div) {
		that = this
		var f = 0, i = 0
		div[i].css('display','block')
		fn = function(){
			if(f == 1) return 0
			f += 0.05
			that.opacity(div[i],f)
			if(f >= 1){
				if(i >= div.length-1) return 0 
				else if(i < div.length-1) {
					i++
					div[i].css('display','none')
				}
			}
			return 1
		}
		this.interval(fn,50)

	}
	//淡入,传入div必须为数组，允许多个框架依次执行淡入效果
	,fadein: function (div) {
		that = this
		var f = 1, i = 0
		fn = function(){
			f -= 0.05
			that.opacity(div[i],f)
			if(f <= 0){
				if(i >= div.length-1) {
					div[i].css('display','none')		
					return 0 
				}
				else if(i < div.length-1) {
					div[i].css('display','none')
					i++
				}
			}
			return 1
		}
		this.interval(fn,50)
	}
	//淡出淡入,传入div必须为数组，允许多个框架依次执行淡出淡入效果
	,fade: function (div) {
		that = this
		var f = 0, b = 0 , i = 0
		div[i].css('display','inline')
		fn = function(){		
			if(b == 0){
				f += 0.05
			}
			else if(b == 1){
				f -= 0.05
			}
			that.opacity(div[i],f)
			if(f <= 0 && b == 1){
				if(i >= div.length-1) {
					div[i].css('display','none')		
					return 0 
				}
				else if(i < div.length-1) {
					div[i].css('display','none')
					i++
					div[i].css('display','inline')
					b = 0
				}
			}
			else if(f >= 1 && b == 0) b = 1		
			return 1
		}
		this.interval(fn,50)
	}
	//发送数据合并为一个字符串
	,sendarg: function (e) {
		var r = ''
		for (var i = 0; i < e.length; i++) {
			r +=  '&'+e[i]
		}
		return r
	}
	//获取url中指定参数，es为正则表达式
	,getarg: function (es) {
		var str=window.location.href
		es.exec(str)
		r=RegExp.rightContext
		r=r.split('&')[0]||r.split('#')[0]
		return r
	}
	//获取url中指定参数的值中为数字的部分，es为正则表达式
	,getint: function (es) {
		var n = this.getarg(es)
		var z = /^\d+$/
		if(!z.test(n)){
			n = 0
		}
		else{
			n = parseInt(n)
		}
		return n
	}
	//获取当前页面文件名称
	,getname: function () {
		var reg = /\/([^/]+).html/
		var r = window.location.href.match(reg)
		if (r!=null) return unescape(r[1])
		return null
	}
	//特殊字符过滤
	,encode: function (s) {
		var REGX_HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g
      		return (typeof s != "string") ? s :s.replace(REGX_HTML_ENCODE,
	                    function($0){
	                        var c = $0.charCodeAt(0), r = "&#"
	                        r += c
	                        r += ";"
	                        return r
	                    })
 	}
 	//检测是否登录，然后传入不同的值给参数fun
 	,logcheck: function (url,m,c,fun) {
		$.getJSON(url+'m=lc&c='+c,function(json){
			if('Not Logged' != json){
				var logged = true
				fun(url,m,c,logged,json)
			}
			else{
				var logged = false
				fun(url,m,c,logged,json)
			}
		})
	}
}

