/**
 * 截取字符串
 * @param oldString 传入字符串
 * @param num       保留的长度
 * @param addString 加入后缀字符
 * @returns {string}    返回新的字符串
 */
function subStringUtil(oldString, num, addString) {
  var newString = "";
  if (oldString == null || oldString == "") {
    return oldString;
  }
  if (oldString.length > num) {
    newString = oldString.substring(0, num - 1);
    newString += addString;
  } else {
    newString = oldString;
  }
  return newString;
}

/**
 * 截取字符串
 * @param str
 * @param len
 * @param replaceSymbol
 * @returns {*}
 */
function cutString(str, len, replaceSymbol) {
  if (!str || !len) {
    return '';
  }
  var a = 0;
  var temp = '';
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) {
      a += 2;
    } else {
      a++;
    }
    if (a > len) {
      return temp + replaceSymbol;
    }
    temp += str.charAt(i);
  }
  return str;
}


/**
 * 获取url参数
 * @param name
 * @returns {*}
 */
function getParam(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).replace(new RegExp(/(amp;)/g), '').match(reg);
  if (r != null) {
    return r[2];
  }
  return null;
}


/**
 * 获取字符串字符长度
 * @param str
 * @returns {number}
 */
function getStrLength(str) {
  var num = 0;
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) {
      num += 2;
    } else {
      num++;
    }
  }
  return num;
}


/**
 * 通过assetId获取播放参数
 * @param str
 * @returns {string}
 */
function toHexStr(str) {
  var hexstr = "";
  var byteCount = 0;
  for (var i = 0; i < str.length; i++) {
    byteCount = str.charCodeAt(i);
    if (byteCount.length == 1) {
      byteCount = "0" + byteCount;
    }
    byteCount = byteCount.toString(16).toUpperCase();
    hexstr += byteCount;
  }
  return hexstr;
}

/**
 * 格式化日期
 * @param timeStr
 * @returns {string}
 */
function fmtTime(timeStr) {
  var tt = parseInt(timeStr) / 1000;
  var hh = Math.floor(tt / 3600);
  hh = hh < 10 ? "0" + hh : "" + hh;
  var mm = Math.floor(tt % 3600 / 60);
  mm = mm < 10 ? "0" + mm : "" + mm;
  var ss = Math.ceil(tt % 3600 % 60);
  //var ss =tt % 3600 % 60;
  ss = ss < 10 ? "0" + ss : "" + ss;
  return hh + ":" + mm + ":" + ss;
}


/**
 * 给数字补齐3位数
 * @param num
 * @returns {string}
 */
function addZero(num) {
  var str = num + "";
  return str.length >= 2 ? str : str.length == 1 ? ("0" + str) : "00";
}


/**
 * 秒转换为hh:mm:ss格式
 * @param sec
 * @returns {string}
 */
function secToTimeStr(sec) {
  var hours_rec = parseInt(sec / 3600);
  if (hours_rec >= 24) {
    hours_rec = hours_rec - 24;
  }
  var minus_rec = parseInt((sec % 3600) / 60);
  var sec_rec = parseInt(sec % 60);
  var result = addZero(hours_rec) + ":" + addZero(minus_rec) + ":" + addZero(sec_rec);
  return result;
}


/**
 * 获取cookie
 * @param k
 * @returns {string}
 */
function getCookie(k) {
  if (document.cookie.length > 0) {
    var c_start = document.cookie.indexOf(k + "=");
    if (c_start != -1) {
      c_start = c_start + k.length + 1;
      var c_end = document.cookie.indexOf(";", c_start);
      if (c_end == -1) {
        c_end = document.cookie.length;
      }
      return decodeURI(document.cookie.substring(c_start, c_end));
    }
  }
  return "";
}

/**
 * 设置cookie
 * @param k
 * @param v
 * @param expire
 */
function setCookie(k, v, expire) {
  if (expire == null || expire == "") {
    expire = 1;
  }
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expire);
  //要设置path，否则路径覆盖不到就取不到
  document.cookie = k + "=" + v + ";expires=" + exdate.toUTCString() + ";path=/";
}

/**
 * 删除cookie
 * @param name
 * @constructor
 */
function deleteCookie(name) {
  var exp = new Date();
  exp.setDate(exp.getDate() - 1);
  var val = getCookie(name);
  document.cookie = name + "=" + val + ";expires=" + exp.toUTCString() + ";path=/";
}

/**
 * 删除cookie 2
 * @param name
 * @constructor
 */
function deleteCookie2(name) {
  setCookie(name, "", -1);
}

var THEATERIP='http://172.20.224.223:6555';
/**通过代理请求数据
 * @param url 请求路径  
 * @param json 请求参数
 */
function convertJson(url, json) {
	url += "?";
	for (var x in json) {
		url += (x + "=" + json[x] + "_COSHIP_"); 
	}
	var end = -1;
	if ((end = url.lastIndexOf("_COSHIP_")) > -1) {
		url = url.substring(0, end);
	}
	return "getData.do?url=" + THEATERIP + url;
}

/**通过代理请求数据
 * @param url 请求路径  
 * @param json 请求参数
 */
function convertJsonByIp(ip, url, json) {
	url += "?";
	for (var x in json) {
		url += (x + "=" + json[x] + "_COSHIP_"); 
	}
	var end = -1;
	if ((end = url.lastIndexOf("_COSHIP_")) > -1) {
		url = url.substring(0, end);
	}
	return "getData.do?url=" + ip + url;
}

function hasClass(obj,className) {
	return obj.className.indexOf(className)> -1 ? true : false;
}

function addClass(obj,className) {
    if (hasClass(obj,className)) return;
    if (obj.classList) {
        obj.classList.add(className);
    } else {
    	if(obj.className){
		   var newClass = obj.className.replace(/(^\s*)/g,"")+" "+className;
		   obj.className = newClass;
		}else{
		   obj.className = className;
		}
    }
}

function removeClass(obj,className) {
    if (hasClass(obj,className)) {
    	var newClass = obj.className.replace(className ,"");
    	obj.className = newClass.replace(/(^\s*)/g,"");
    }
}

function trim(_str) {
	return _str.replace(/(^\s*)|(\s*$)/g, "");
}