var playTvObj = {};
playTvObj.playService = {};	

// 增强电视按键事件注册
/*var ETVEventListener = null;
var ETVKeys = [];
		
function addETVEventListener(handler, keys) {
	ETVEventListener = handler;
	ETVKeys = keys;
}
		
function removeETVEventListener() {
	ETVEventListener = null;
	ETVKeys = [];	
}
*/
var Ajax =function(){
	function request(url,opt){
		function fn(){}
		opt = opt || {};
		var async   = opt.async !== false,
			method  = opt.method 	|| 'GET',
			type    = opt.type 		|| 'text',
			encode  = opt.encode 	|| 'UTF-8',
			timeout = opt.timeout 	|| 3000,
			data    = opt.data 		|| null,
			success = opt.success 	|| fn,
			failure = opt.failure 	|| fn;
			method  = method.toUpperCase();
		
		var contentType = "application/x-www-form-urlencoded;charset=" + encode;
		if(data && data[0] == "{" && data[data.length-1] == "}"){
			contentType = "application/json";
			//data = _serialize(data);
		}
		if(method == 'GET' && data){
            url += (url.indexOf('?') == -1 ? '?' : '&') + data;
			data = null;
        }	
		var xhr = function(){
			try{
				return new XMLHttpRequest();
			}catch(e){
				try{
					return new ActiveXObject('Msxml2.XMLHTTP');
				}catch(e){
					try{
						return new ActiveXObject('Microsoft.XMLHTTP');
					}catch(e){
						failure(null,'create xhr failed',e);
					}
				}
			}
		}();
		if(!xhr){return;}
		var isTimeout = false, timer;
		if(async && timeout>0){
			timer = setTimeout(function(){
				xhr.abort();
				isTimeout = true;
			},timeout);
		}
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4 && !isTimeout){
				_onStateChange(xhr, type, success, failure);
				clearTimeout(timer);
			}else{}
		};
		
		xhr.open(method,url,async);
		if(method == 'POST'){
			xhr.setRequestHeader('Content-type', contentType);
		}
		xhr.send(data);
		return xhr;	
	}
	function _serialize(obj){
		var a = [];
		for(var k in obj){
			var val = obj[k];
			if(val.constructor == Array){
				for(var i=0,len=val.length;i<len;i++){
					a.push(k + '=' + encodeURIComponent(val[i]));
				}				
			}else{
				a.push(k + '=' + encodeURIComponent(val));
			}				
		}
		return a.join('&');
	}
	function strToJson(str){
	   	var json = eval('(' + str + ')');  
    	return json;  
   }
	function _onStateChange(xhr,type,success,failure){
		
		var s = xhr.status, result;
		
		if(s>= 200 && s < 300){
            switch(type){
                case 'text':
                    result = xhr.responseText;
                    break;
                case 'json':
                	// http://snandy.javaeye.com/blog/615216
                    result = function(str){
						try{
							//return JSON.parse(str);
							return strToJson(str);
						}catch(e){
							try{
								return (new Function('return ' + str))();
							}catch(e){
								failure(xhr,'parse json error',e);
							}
						}
                    }(xhr.responseText);
                    break;
                case 'xml':
                    result = xhr.responseXML;
                    break;
            }
            
			// text, 返回空字符时执行success
			// json, 返回空对象{}时执行suceess，但解析json失败，函数没有返回值时默认返回undefined
			typeof result !== 'undefined' && success(result);
			
			//请求超时，调用abort后xhr.status为0，但不知为0时是否还有其它的情况	
		}else if(s===0){
			failure(xhr,'request timeout');
		}else{
			failure(xhr,xhr.status);
		}
		xhr = null;
	}
	return (function(){
		var Ajax = {request:request}, types = ['text','json','xml'];
		for(var i=0,len=types.length;i<len;i++){
			Ajax[types[i]] = function(i){
				return function(url,opt){
					opt = opt || {};
					opt.type = types[i];
					return request(url,opt);
				}
			}(i);
		}
		return Ajax;
	})();
}();