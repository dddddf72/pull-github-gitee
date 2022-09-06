//按键返回值
var returnFalseFlag = false;			//事件截止
var returnTrueFlag = true;				//事件流向下一层

if(navigator.userAgent.toLowerCase().indexOf("ipanel") > -1 && navigator.userAgent.toLowerCase().indexOf("advanced") == -1){//iPanel 3.0
 	returnFalseFlag = 0;
	returnTrueFlag = 1;
}

/**
 * 按键键值和系统消息值的映射
 */
var Event = {
	mapping: function(__event){
		__event = __event || event;
		var keycode = __event.which || __event.keyCode;
		var p2 = __event.modifiers;
		var code = "";
		var name = "";
		var args = {};
		if(keycode < 58 && keycode > 47){//数字键
			args = {modifiers: __event.modifiers, value: (keycode - 48), type:returnFalseFlag};
			code = "KEY_NUMERIC";
			name = "数字";
		} else {
			var args = {modifiers: __event.modifiers, value: keycode, type:returnFalseFlag};
			switch(keycode){
				case 1://up
				case 38:
					code = "KEY_UP";
					break;
				case 2://down
				case 40:
					code = "KEY_DOWN";
					break;
				case 3://left
				case 37:
					code = "KEY_LEFT";
					break;
				case 4://right
				case 39:
					code = "KEY_RIGHT";
					break;
				case 13://enter
					code = "KEY_SELECT";
					break;
				case 339://exit
				case 27:
				case 114:
					code = "KEY_EXIT";
					args.type = returnTrueFlag;
					break;
				case 258:
				case 4106:
					code="KEY_STANDBY";
					args.type = returnTrueFlag;
					break;
				case 340://back
				case 640:
				case 8:
					code = "KEY_BACK";
					args.type = returnTrueFlag;
					break;
				case 372://page up
				case 33:
				case 120://同州的键值
					code = "KEY_PAGE_UP";
					break;
				case 373://page down
				case 34:
				case 121://前端页面的键值
					code = "KEY_PAGE_DOWN";
					break;
				case 512:
				case 4098:
					code = "KEY_HOMEPAGE";
					args.type = returnTrueFlag;
					break;
				case 513:
				case 4097:
					code = "KEY_MENU";
					args.type = returnFalseFlag;
					break;
				case 595://音量+
				case 4109:
				case 447://Coship
				case 90://数码
					code="KEY_VOLUME_UP";
					args.type = returnTrueFlag;
					break;
				case 596://音量-
				case 4110:
				case 448://Coship
				case 88://数码
					code="KEY_VOLUME_DOWN";
					args.type = returnTrueFlag;
					break;
				case 597://静音键
				case 4108:
				case 449://Coship
					code = "KEY_MUTE";
					args.type = returnTrueFlag;
					break;
				case 3862://同洲 播放键
					code = "KEY_PLAY";
					break;
				case 3864://同洲 暂停键
					code = "KEY_PAUSE";
					break;
				case 117://数码 显示键（播放/暂停）
					code = "KEY_SHOW";
					break;
				case 598:
				case 4104:
				case 407://Coship
					code = "KEY_AUDIO_MODE";
					args.type = returnTrueFlag;
					break;
				case 514:
				case 4192:
				case 458://吉视传媒的键值
					code = "KEY_EPG";
					args.type = returnTrueFlag;
					break;
				case 832://red
				case 2305:
					code = "KEY_RED";
					break;
				case 833://green
				case 2306://绿键
					code = "KEY_GREEN";
					break;
				case 834://yellow
				case 2307:
					code = "KEY_YELLOW";
					break;
				case 835://blue
				case 2308:
					code = "KEY_BLUE";
					break;
				case 1028:
				case 3874://coship
					code = "KEY_FORWARD";
					break;
				case 3783:
				case 1040://coship
				case 3873://同洲
					code = "KEY_BACKWARD";
					break;
				/*--------------------vod-------------*/
				case 5202://EIS_VOD_PREPAREPLAY_SUCCESS
					code = 'EIS_VOD_PREPAREPLAY_SUCCESS';
					break;
				case 5203:
					code = 'EIS_VOD_CONNECT_FAILED';
					break;
				case 5205:
					code = 'EIS_VOD_PLAY_SUCCESS';
					break;
				case 5206:
					code = 'EIS_VOD_PLAY_FAILED';
					break;
				case 5209:
					code = 'EIS_VOD_PROGRAM_BEGIN';
					break;
				case 5210:
					code = 'EIS_VOD_PROGRAM_END';
					break;
				case 5222:
					code = 'EIS_VOD_START_BUFF';
					break;
				case 5225:
					code = 'EIS_VOD_USER_EXCEPTION';
					break;
				case 5226:
					code = 'EIS_VOD_GET_PARAMETER_SUCCESS';
					args.type = returnTrueFlag;
					break;
				case 5227:
					code = 'EIS_VOD_GET_PARAMETER_FAILED';
					args.type = returnTrueFlag;
					break;
				/*----ca---*/
				case 5350:
					code = "CA_MESSAGE_OPEN";
					args.type = this.returnTrueFlag;
					break;
				case 5351:
					code = "CA_MESSAGE_CLOSE";
					args.type = this.returnTrueFlag;
					break;
				/*--------------------ntp-------------*/
				case 5512:
					code = 'EIS_IP_NETWORK_SET_NTP_SERVER_NOTIFY';
					args.type = returnTrueFlag;
					break;
				case 5510:
					code = 'EIS_IP_NETWORK_NTP_READY';
					args.type = returnTrueFlag;
					break;
				case 5511:
					code = 'EIS_IP_NETWORK_NTP_TIMEOUT';
					args.type = returnTrueFlag;
					break;
				/****光猫新加的消息***/
				case 5534:
					code = 'EIS_IP_NETWORK_UNO_READY';
					args.type = returnTrueFlag;
					break;
				case 5535:
					code = 'EIS_IP_NETWORK_UNO_FAILED';
					args.type = returnTrueFlag;
					break;
				/*****dvb的相关消息******/
				case 8306:
					code = 'EIS_DVB_CHANNEL_INFO_CHECK_SUCCESS';
					args.type = returnTrueFlag;
					break;
				case 8307:
					code = 'EIS_DVB_CHANNEL_INFO_CHECK_FAILED';
					args.type = returnTrueFlag;
					break;
				case 8304:
					code = 'EIS_DVB_CHANNEL_NOFOUND';
					break;
				case 8330:
					code = 'DVB_PROGRAM_READY_OPEN';
					args.type = this.returnTrueFlag;
					break;
				case 8335:
					code = 'EIS_DVB_ALARM_READY';
					args.type = returnTrueFlag;
					break;
				/*************媒体播放器路径************************/
				case 13001://媒体源路径有效
					code = 'MSG_MEDIA_URL_VALID';
					args.type = returnTrueFlag;
					break;
				case 13002://媒体源路径无效
					code = 'MSG_MEDIA_URL_INVALID';
					args.type = returnTrueFlag;
					break;
				case 13003://开始播放成功
					code = 'MSG_MEDIA_PLAY_SUCCESS';
					args.type = returnTrueFlag;
					break;
				case 13004://开始播放失败
					code = 'MSG_MEDIA_PLAY_FAILED';
					args.type = returnTrueFlag;
					break;
				case 13005://步长设置成功
					code = 'MSG_MEDIA_SETPACE_SUCCESS';
					args.type = returnTrueFlag;
					break;
				case 13006://步长设置失败
					code = 'MSG_MEDIA_SETPACE_FAILED';
					args.type = returnTrueFlag;
					break;
				case 13007://设置播放时间点成功
					code = 'MSG_MEDIA_SEEK_SUCCESS';
					args.type = returnTrueFlag;
					break;
				case 13008://设置播放时间点失败
					code = 'MSG_MEDIA_SEEK_FAILED';
					args.type = returnTrueFlag;
					break;
				case 13009://暂停播放成功
					code = 'MSG_MEDIA_PAUSE_SUCCESS';
					args.type = returnTrueFlag;
					break;
				case 13010://暂停播放失败
					code = 'MSG_MEDIA_PAUSE_FAILED';
					args.type = returnTrueFlag;
					break;
				case 13011://恢复播放成功
					code = 'MSG_MEDIA_RESUME_SUCCESS';
					args.type = returnTrueFlag;
					break;
				case 13012://恢复播放失败
					code = 'MSG_MEDIA_RESUME_FAILED';
					args.type = returnTrueFlag;
					break;
				case 13013://停止播放成功
					code = 'MSG_MEDIA_STOP_SUCCESS';
					args.type = returnTrueFlag;
					break;
				case 13014://停止播放失败
					code = 'MSG_MEDIA_STOP_FAILED';
					args.type = returnTrueFlag;
					break;
				case 13015://
					break;
				case 13016:
					break;
				case 18001:
					code = "MSG_EPG_SEARCH_SUCCESS";
					break;
				case 18002:
					code = "MSG_EPG_SEARCH_EXCEED_MAX_COUNT";
					break;
				case 18003:
					code = "MSG_EPG_SEARCH_REFRESH";
					break;
				case 18004:
					code = "MSG_EPG_SEARCH_TIMEOUT";
					break;
				default:
					code = keycode;
					args.type = returnTrueFlag;
					break;
			}
		}
		return {code: code, args: args,keycode:keycode,e:__event};
	}
};

function initPage(f) {
	f.$ = function(id) {
		 return f.document.getElementById(id);
	}
	if("undefined" == typeof(f.eventHandler)){
		f.eventHandler = function(){};
	}
	f.document.onirkeypress = function () {return (f.eventHandler(Event.mapping(f.event), 1));};
	f.document.onkeydown = function () {return (f.eventHandler(Event.mapping(f.event), 1));};
	f.document.onsystemevent = function () {return (f.eventHandler(Event.mapping(f.event), 2));};
}

//浏览器类型
function getBrowserType(){
	var _browserType = "";
	var userAgent = navigator.userAgent.toLowerCase();
	iDebug("getBrowserType userAgent="+userAgent);
	if(userAgent.indexOf('ipanel') != -1) {//iPanel
		_browserType = 'iPanel';
	}
	else if(userAgent.indexOf('coship') != -1) {//同洲
		_browserType = 'Coship';
	}
	else if(userAgent.indexOf('roc') != -1) {//数码
		_browserType = 'Roc';
	}
	else if(userAgent.indexOf('chrome') != -1) {
		_browserType = 'Chrome';
	}
	else if(userAgent.indexOf('firefox') != -1) {
		_browserType = 'Firefox';
	}
	else if(userAgent.indexOf('opera') != -1) {
		_browserType = 'Opera';
	}
	else if(userAgent.indexOf('safari') != -1) {
		_browserType = 'Safari';
	}
	else if(userAgent.indexOf('msie') != -1) {
		_browserType = 'IE';
	}
	else {
		_browserType = 'iPanel';
	}
	return _browserType;
}


//打印函数
function iDebug(str){
	if(navigator.appName.indexOf("iPanel") != -1){
		iPanel.debug(str);	//假如要看打印的时间，可以改：iPanel.debug(str, 2);
	}else if(navigator.appName.indexOf("Opera") != -1){
		opera.postError(str);
	}else if(navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1){
		console.log(str);
	}else {
		console.log(str);
	}
}


/* 常用的一些小方法封装 */
var smallUtil = {
	//补0
	addZero:function(_str,_max){
		_str = _str.toString();
		for(var i=_str.length;i<_max;i++){
			_str = "0"+_str;
		}
		return _str;
	},

	//给Date对象添加Format方法
	dateFormat:function (fmt,_date) {
		var weekdays = {
			chi: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
			eng: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
		};
		if("undefined" == typeof(_date)){
			var _dd = new Date();
		}else{
			var _dd = _date;
		}
		var o = {
			"y+": _dd.getFullYear(),
			"M+": _dd.getMonth() + 1,
			"d+": _dd.getDate(),
			"w":weekdays["chi"][_dd.getDay()],
			"h+": _dd.getHours(),
			"m+": _dd.getMinutes(),
			"s+": _dd.getSeconds()
		};
    	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (_dd.getFullYear() + "").substr(4 - RegExp.$1.length));
    	for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
   	 	return fmt;
	},

	/**
	* @func
	* @desc 获取url中的参数
	* @param {string} _key - [必选] 参数名
	* @param {string} _url - [可选] url路径
	* @return {string} - 如匹配到则返回参数值，否则返回null
	*/
	getParam: function(_key, _url) {
		_url = _url || window.location.href;
		if(new RegExp('.*\\b'+_key+'\\b(\\s*=([^&]+)).*', 'gi').test(_url)) {
			return RegExp.$2;
		}
		else {
			return null;
		}
	},

	/**
	 * @func
	 * @desc 返回字符串长度，为汉字长度，即如果字符串为汉字如'字符'，则返回2，如为'zf'，则返回1，英文2个字符等同一个汉字的长度
	 * @param {string} _str - [必选] 需检测长度的字符串
	 * @return {number} - 字符串的长度
	 */
	getStrChineseLength: function(_str) {
		var arr = _str.split('');
		var n = arr.length;
		var i = 0;
		for (i = n - 1; i >= 0; i--) {
			if (arr[i] != ' ' && arr[i] != '\t' && arr[i] != '\n') {
				break;
			}
			arr.pop();
		}
		n = i + 1;
		var c;
		var w = 0;
		for (i = 0; i < n; i++) {
			c = arr[i].charCodeAt(0);
			if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
				w++;
			} else {
				w += 2;
			}
		}
		var length = w % 2 == 0 ? (w / 2) : (parseInt(w / 2) + 1);
		return length;
	},

	getStrCharLength:function(str) {
		var len = 0;
		for (var i = 0; i < str.length; i++) {
		    if (str[i].match(/[^\x00-\xff]/ig) != null) //全角
				len += 2;
			else
				len += 1;
		  }
		  return len;
	},

	/**
	 * @func
	 * @desc 字符串截取指定长度，并根据需要添加后缀，如'...'
	 * @param {string} _str - [必选] 需截取长度的字符串
	 * @param {number} _len - [必选] 字符串的最大长度，为汉字字符串长度，字母、符号的情况则换算为汉字长度（一个汉字占2个字节）
	 * @param {string} _suffix - [可选] 截取后的字符串结尾填充的字符串，如'..'、'...'，不传则不填充，这里只考虑长度小于等于3的填充字符(不能为汉字)，或不传入的情况
	 * @return {string} - 返回截取的字符串，如果字符串长度在小于等于_len，则返回原有字符串，不做改变。
	 */
	getStrChineseLen: function(_str, _len, _suffix) {
		var arr = _str.split('');
		var n = arr.length;
		var i = 0;
		for (i = n - 1; i >= 0; i--) {
			if (arr[i] != ' ' && arr[i] != '\t' && arr[i] != '\n') {
				break;
			}
			arr.pop();
		}
		n = i + 1;
		_str = arr.join('');
		var c;
		var w = 0;
		var flag0 = 0; //上上个字符是否是双字节
		var flag1 = 0; //上个字符是否是双字节
		var flag2 = 0; //当前字符是否是双字节
		for (i = 0; i < n; i++) {
			c = arr[i].charCodeAt(0);
			flag0 = flag1;
			flag1 = flag2;
			if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
				w++;
				flag2 = 0;
			} else {
				w += 2;
				flag2 = 1;
			}
			if (parseInt((w + 1) / 2) > _len) {
				if ("undefined" == typeof(_suffix)) {
					return _str.substring(0, i);
				} else if (_suffix.length == 1) {
					return _str.substring(0, i - 1) + _suffix;
				} else if (_suffix.length == 2) {
					if (flag1 == 1) return _str.substring(0, i - 1) + _suffix;
					else return _str.substring(0, i - 2) + _suffix;
				} else {
					if (flag1 == 1) return _str.substring(0, i - 2) + _suffix;
					else {
						var num = flag0 == 1 ? 2 : 3;
						return _str.substring(0, i - num) + _suffix;
					}
				}
				break;
			}
		}
		return _str;
	},

	//按汉字个数截取字符串：
	//str:要处理的字符串  len要取的中文字数 __type：1表示直接返回原字符串，不取值返回空
	getChiDisplayString:function(str,len,__type,__addStr){
		var totalLength=0;
		var toMarqueeFlag = false;
		var position=0;
		for(var i=0;i<str.length;i++){
			var intCode=str.charCodeAt(i);
			if((intCode >= 0x0001 && intCode <= 0x007e) || (0xff60<=intCode && intCode<=0xff9f)){
				totalLength+=1;//非中文单个字符长度加1
			}else{
				totalLength+=2;//中文字符长度则加2
			}
			var tmpLength = totalLength % 2 == 0 ? (totalLength/2) : (parseInt(totalLength/2)+1) ;
			if(tmpLength > len){
				position = i;
				toMarqueeFlag = true;
				break;
			}
		}
		if(toMarqueeFlag){//超过了指定字数
			if("undefined" == typeof(__addStr)) __addStr = "";
			return str.substring(0,position)+__addStr;
		}
		if(__type == 1) return str;
		return "";
	},
	/**
	 * [addClass description]
	 * @fun
	 * @desc 给dom元素添加样式
	 * @DateTime 2017-02-21T11:36:12+0800
	 * @param    {[type]}                 _obj   [dom元素]
	 * @param    {[type]}                 _class [类名]
	 */
	addClass:function (_obj, _class) {
		if (!smallUtil.hasClass(_obj, _class)) _obj.className += " " + _class;
	},

	/**
	 * [removeClass description]
	 * @fun
	 * @desc 删除dom元素中的类名
	 * @DateTime 2017-02-21T11:38:34+0800
	 * @param    {[type]}                 _obj   [dom元素]
	 * @param    {[type]}                 _class [类名]
	 * @return   {[type]}                        [description]
	 */
	removeClass:function (_obj, _class) {
		if (smallUtil.hasClass(_obj, _class)) {
	        var reg = new RegExp('(\\s|^)' + _class + '(\\s|$)');
	        _obj.className = _obj.className.replace(reg, ' ');
	    }
	},

	/**
	 * [hasClass description]
	 * @fun
	 * @desc 判断dom元素是否已经包含此类名
	 * @DateTime 2017-02-21T11:37:06+0800
	 * @param    {[type]}                 _obj   [dom元素]
	 * @param    {[type]}                 _class [类名]
	 * @return   {Boolean}                       [description]
	 */
	hasClass:function (_obj, _class) {
		return _obj.className.match(new RegExp('(\\s|^)' + _class + '(\\s|$)'));
	},

	/**
	 * @func
	 * @desc 设置cookie
	 * @param {string} _key - [必选] 键名
	 * @param {string} _value - [必选] 键值
	 */
	setCookie: function(_key, _value) {
		var expdate = new Date();
		var argv = arguments;
		var argc = arguments.length;
		var expires = (argc > 2) ? argv[2] : 5 * 12 * 30 * 24 * 60 * 60;
		var path = (argc > 3) ? argv[3] : '/';
		var domain = (argc > 4) ? argv[4] : null;
		var secure = (argc > 5) ? argv[5] : false;
		if (expires != null) expdate.setTime(expdate.getTime() + (expires * 1000));
		document.cookie = _key + '=' + escape(_value) + ((expires == null) ? '' : ('; expires=' + expdate.toGMTString())) + ((path == null) ? '' : ('; path=' + path)) + ((domain == null) ? '' : ('; domain=' + domain)) + ((secure == true) ? '; secure' : '');
	},

	/**
	 * @func
	 * @desc 获取cookie
	 * @param {string} _key - [必选] 键名
	 * @return {string} this - 返回cookie解码后的值，不存在则返回空串
	 */
	getCookie: function(_key) {
		var url = document.cookie;
		if (new RegExp('.*\\b' + _key + '\\b(\\s*=([^&;]+)).*', 'gi').test(url)) {
			return unescape(RegExp.$2);
		} else {
			return '';
		}
	},

	/**
	 * @func
	 * @desc 删除cookie
	 * @param {string} _key - [必选] 键名
	 */
	delCookie: function(_key) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = this.getCookie(_key);
		document.cookie = _key + '=' + cval + '; expires=' + exp.toGMTString();
	},

	/**
	 * @func
	 * @desc 根据传入的秒数转换为字符串形式
	 * @param {number} _sec - [必选] 秒数
	 * @param {number} _flag - [可选] 传0返回hhmmss格式字符串，传其他或不传则返回hh:mm:ss格式字符串
	 * @return {string} - hhmmss或hh:mm:ss格式的字符串
	 */
	secondToStringTime: function(_sec, _flag) {
		var hour = Math.floor(_sec / 3600);
		var minute = Math.floor((_sec - hour * 3600) / 60);
		var second = _sec - hour * 3600 - minute * 60;
		hour = hour > 9 ? hour : '0' + hour;
		minute = minute > 9 ? minute : '0' + minute;
		second = second > 9 ? second : '0' + second;
		if (_flag == 0) return '' + hour + minute + second;
		else return hour + ':' + minute + ':' + second;
	},

	/**
	 * @func
	 * @desc 根据传入的字符串时间格式转换为秒数
	 * @param {string} _str - [必选] 格式为hh:mm:ss的时间字符串
	 * @return {number} - 秒数
	 */
	stringTimeToSecond: function(_str) {
		var strArr = _str.split(':');
		return parseInt(strArr[0], 10) * 3600 + parseInt(strArr[1], 10) * 60 + parseInt(strArr[2], 10);
	},

	/**
	 * @func
	 * @desc 根据传入的字符串日期和时间格式转换为毫秒的整数格式时间
	 * @param {string} _str - [必选] 格式为'yyyy-MM-dd hh:mm:ss'或'yyyy/MM/dd hh:mm:ss'的日期和时间字符串
	 * @return {long int} - 毫秒的时间格式
	 */
	stringDateTimeToMiliTime: function(_str) {
		var y = Math.floor(_str.substring(0, 4));
		var m = Math.floor(_str.substring(5, 7)) - 1;
		var d = Math.floor(_str.substring(8, 10));
		var t_h = Math.floor(_str.substring(11, 13));
		var t_m = Math.floor(_str.substring(14, 16));
		var t_s = Math.floor(_str.substring(17, 19));
		var my_date = new Date();
		my_date.setYear(y);
		my_date.setMonth(m);
		my_date.setDate(d);
		my_date.setHours(t_h);
		my_date.setMinutes(t_m);
		my_date.setSeconds(t_s);
		my_date.setMilliseconds(0);
		return my_date.getTime();
	},

    $: function(__id){
        return this.currWindow.document.getElementById(__id);
    }
};

if(typeof JSON == "undefined"){
	var JSON = {};
	JSON.stringify = function(){
		return "";
	};
}
