// try
// {
//     Utility.setDrawFocusRing(0); //Coship.setDrawFocusRing(1);
// }
// catch (e)
// {
//     Coship.setDrawFocusRing(1);
// }
// var MAPIP = "172.30.1.30";
var isIPanel = typeof (iPanel) != "undefined" ? true : false;
try {
    media.AV.close();
}catch (e) {

}
//var MAPIP = "10.9.219.3";
var MAPIP = "172.30.1.30";
var MAPPort = "554";
var portalIP = "172.30.1.20";
//var portalIP = "10.9.217.8";
var portalPort = "8080";
var V, IEPG = V = IEPG || {};
/** @description epgUrl 业务模板存放路径，到1HD_blue的下层*/
var epgUrl = location.href.split("/template")[0];
var goUrl = location.href.split("/RGyouku")[0];
var goUrl2 = goUrl + "/RGyouku/";
var tipUrl = goUrl+"/RGyouku/iPG/";
//var imgurl = 'http://10.9.211.102:8080/portal';
var imgurl = goUrl;
var epgVodUrl="../";
/* @description 影片无图片时默认图片    **/
var defaultPic = "/RGyouku/iPG/T-nsp/res/default/images/show_pic.jpg";
var bigDefaultPic = "/RGyouku/iPG/common/images/no_pic_b.jpg";
var skinImgUrl = "skin/images/";
/* @description 剧集弹出框标识    **/
var mediaTipFlag = false;
/* @description 搜索弹出框标识    **/
var searchTipFlag = false;
/* @description 购买弹出框标识    **/
var buyTip=false;
/* @description 试看结束购买弹出框标识    **/
var tryBuyTip=false;
/* @description 收藏成功弹出框标识，收藏成功按红色键进入我的收藏 **/
var collectFlag=false;
/* @description 评分弹出标志 **/
var gradeTipFlag=false;
/* XML请求数据头部 */
var xmlHead = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>";
/*XML请求数据必填参数*/
var portalId = 102;
/*XML请求数据必填参数  卡号*/
var cardId = getSmartCardId();
/** userId 为用户ID */
var userId = getUserId();
var stbNo = getStbNo();
var comeFromTip;
var isComeFrompkgChargeMode1 = false;
/** @description 键值定义 */
var KEY = {
	"ZERO" : 48,
	"ONE" : 49,
	"TWO" : 50,
	"THREE" : 51,
	"FOUR" : 52,
	"FIVE" : 53,
	"SIX" : 54,
	"SEVEN" : 55,
	"EIGHT" : 56,
	"NINE" : 57,

	"HOME":468,//菜单键
    "HOMEPAGE":3886,//互动键
	"LEFT" : 37,
	"RIGHT" : 39,
	"UP" : 38,
	"DOWN" : 40,
	"ENTER" : 13,
	"PREV" : 33,
	"NEXT" : 34,
	"QUIT" : 27,
	"RED" : 403,
	"GREEN" : 404,
	"YELLOW" : 405,
	"BLUE" : 406,
	"PLAY" : 3864,
	"PLAY1" : 3862,
	"SEARCH" : 3880,
	"SEARCH_N" : 4117,
	"SEARCH_G" : 84, //google搜索 T键值

	"UP_N" : 87, //N9101盒子键值
	"DOWN_N" : 83,
	"LEFT_N" : 65,
	"RIGHT_N" : 68,
	"ENTER_N" : 10,
	"PREV_N" : 306,
	"NEXT_N" : 222, //贵州222     广州307
	"QUIT_N" : 72,
	"RED_N" : 320,
	"GREEN_N" : 323,  //贵州 323      广州321
	"YELLOW_N" : 321, //贵州 321      广州322
	"BLUE_N" : 322,   //贵州 322      广州323
	"PLAY_N": 59,     //贵州59        广州39

	"BACK" : 8,
	"RETURN" : 640,
	"RETURN_N" : 69,
	"RED_T" : 82, //E600浏览器调试
	"YELLOW_T" : 89, //E600浏览器调试
	"BLUE_T" : 66, //E600浏览器调试
	"GREEN_T" : 71, //E600浏览器调试
	"STATIC" : 67,
	"VOICEUP" : 61,
	"VOICEDOWN" : 45,
    "RETURN_RG" : 340,
    "UP_RG" : 1, //N9101盒子键值
    "DOWN_RG" : 2,
    "LEFT_RG" : 3,
    "RIGHT_RG" : 4
};

function New(aClass, params) {
	function _new() {
		if(aClass.initializ) {
			aClass.initializ.call(this, params);
		}
	}
	_new.prototype = aClass;
	return new _new();
}

Object.extend = function(destination, source) {
	for(var property in source) {
		destination[property] = source[property];
	}
	return destination;
};

/**
 * @description $ 代替document.getElementById
 * @param {string} _id 为页面DIV的id
 */
var $ = function(_id) {
	return typeof _id == 'string' ? document.getElementById(_id) : _id;
};
var G = function(_object, _attribute) {
	if(_object==undefined || _object.getAttribute(_attribute)==null || _object.getAttribute(_attribute)==undefined){
		return "";
	}else{
		return _object.getAttribute(_attribute);
	}
};
var tags = function(_object, _tagname) {
	if(_object==undefined || _object.getElementsByTagName(_tagname)==null || _object.getElementsByTagName(_tagname)==undefined){
		return null;
	}else{
		return _object.getElementsByTagName(_tagname);
	}
};

var changeBg = function(id, url) {//改变背景图
	if(url.indexOf("url") >= 0) {
		$(id).style.background = url + " no-repeat";
	} else {
		$(id).style.background = "url(" + url + ") no-repeat";
	}
};

function changeObjClass(handler, className) {//改变对象样式
	if(handler){
	     handler.className = className;
	}
	//$(id).className = className;
}

function getGrade(_recomdLevel) {
	var curGrade = "";
	if(_recomdLevel == 0) {
		curGrade = 3;
	} else {
		curGrade = _recomdLevel;
	}
	return curGrade;
}

/**
 * @description trim 去掉字符串前后空格
 * @param {string} _str 需要处理的字符串
 */
function trim(_str) {
	return _str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * @description getUserId 取AAA下发的userId，供页面请求数据用，此参数是请求数据的url必带字段
 */
function getUserId() {//获取userId
	var userId;
    // try {
    //     userId = iPanel.getGlobalVar("userId");
    // } catch (e) {
    //     userId=0;
    // }
    // if(iPanel.getGlobalVar("userId")==""){
    //     return "0";
    // }
    /*userId = getGlobalVar('userId');
    if(userId == ""){
        userId = getSmartCardId();
    }
	return userId;*/
    return getSmartCardId();
}
function getSmartCardId(){
	var card = "0";
	try {
		if(isIPanel) {
			card = CA.card.cardId;
		} else {
			card = CA.serialNumber;
		}
	} catch (e) {

	}
    if(card ==""){
       card = "0";
    }
	return card;
}
//获取智能卡号
function getStbNo(){
	try {
        stbNo = hardware.STB.serialNumber;
        if(stbNo == ''){
            stbNo = '0';
		}
    }catch (e) {
        stbNo = '0';
    }
	return stbNo;
}

//*********** 逻辑操作时，检查CA和uerId  **************

function checkUser() {
	var userId = getUserId();
	if(userId == "" || userId == "0" || userId == undefined) {
        showMsg(tipUrl + "T-nsp/tip/a_collect.htm", "亲，检测不到卡号，请重新插卡或者现在拨打电话96296");
		return false;
	}
	return true;
}

//检查智能卡插入、拔出消息
document.onsystemevent = function(e) {
	var code = e.which || e.keyCode;
	var keyType = e.type ? e.type : 1001;

	// if(keyType == 'iptv'){
     //    $("actor").innerHTML = "主演1："+keyType+':'+code;
     //    // showMsg(tipUrl + "T-nsp/tip/a_collect.htm",'iptv'+code);
	// }if(keyType == 'dvb'){
     //    // showMsg(tipUrl + "T-nsp/tip/a_collect.htm",code);
     //    $("actor").innerHTML = "主演2："+keyType+':'+code;
	// }else{
     //    $("actor").innerHTML = "主演："+keyType+':'+code;
	// }
	if(code == 5301){
        cardBachu();
	}else if(code == 5372){
        var nev = {
            "data":'<NavCheck deviceId="'+cardId+'" client="'+cardId+'"/>',
            "callBack" :function (_dataJson) {
                userId=_dataJson.account;
                setGlobalVar('userId',userId);
            }
        };
        IEPG.getData("/NavCheck",nev);
        showMsg(tipUrl + "T-nsp/tip/a_collect.htm", "卡已插入");
	}
	// if(keyType == 1001) {
	// 	switch(code) {
	// 		case 40070://中山，卡插入
	// 		case 11703://南海，卡插入
	// 			break;
	// 		case 40071://中山，卡被拔出
	// 		case 11704://南海，卡被拔出
	// 			showMsg(tipUrl + "T-nsp/tip/a_collect.htm", "亲，没找到您的准确信息呦~请插入智能卡后重试。");
	// 			break;
	// 		case 10902:
	// 		case 40201://播放的流文件到头
	// 			break;
	// 		case 10901:
	// 		case 40200://播放的流文件到尾
	// 			playNextNews();//播放下一个新闻
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// }
};

function cardBachu() {
    userId = 0 ;
    setGlobalVar('userId','');
    showMsg(tipUrl + "T-nsp/tip/a_collect.htm", "卡已拔出");
}
/**
 * @description 写cookie，设置全局参数
 * @param {string} _sName 全局参数名称
 * @param {string} _sValue 全局参数名称对于的值
 */

function setGlobalVar(_sName, _sValue) {
	try {
		_sValue = _sValue + "";
		iPanel.setGlobalVar(_sName, _sValue);
	} catch(e) {
		try{
			Utility.setGlobalVar(_sName, _sValue);
		} catch(e) {
			document.cookie = escape(_sName) + "=" + escape(_sValue);
		}
	}
}
function getGlobalVar(_sName) {
	var result = "";
	try {
		result=iPanel.getGlobalVar(_sName);
		if(result == "undefined") {
			result = "";
		}
	} catch (e) {

		try {
			result = Utility.getGlobalVar(_sName);
		} catch (e) {
			var aCookie = document.cookie.split("; ");
			for(var i = 0; i < aCookie.length; i++) {
				var aCrumb = aCookie[i].split("=");
				if(escape(_sName) == aCrumb[0]) {
					result = unescape(aCrumb[1]);
					break;
				}
			}
		}
	}
	return result;
}


//----------------------  路径缓存操作 start---------------------------------------------------------//
var urlSplitChar = "#";//URL之间的分隔符，可配，但注意确保不会与URL参数重复
var urlPathGlobalName = "urlPathGlobalName";//全局变量名
/*
 * 在有页面跳转动作时调用 ，用来保存当前页面的URL，URL 之间以 urlSplitChar 号分隔，
 * 调用此方法之前页面需要保存其它的变量需要自己操作
 */
function saveUrlPath() {//保存访问路径
	var tempUrl = getGlobalVar(urlPathGlobalName) == undefined ? "" : getGlobalVar(urlPathGlobalName);//取全局变量
	var urlArr = tempUrl.split(urlSplitChar);
	if(urlArr[urlArr.length-1] == location.href){
		tempUrl = tempUrl
	}else{
		tempUrl = tempUrl + urlSplitChar + location.href;//将已存在的路径和当前URL之间加上分隔符
	}
	var arr = tempUrl.split(urlSplitChar);
	if(arr.length > 6) {
		var removeLength = arr.length - 6;
		var newArr = arr.slice(removeLength);//从指定位置开始复制数组，一直到最后
		tempUrl = arr[1] + urlSplitChar + newArr.join(urlSplitChar);//保留原来数组中第一个路径（portal进入的路径）
	}
	setGlobalVar(urlPathGlobalName, tempUrl);//保存
}

function goReturnUrlPath() {//返回上一路径
	var tempUrl = getGlobalVar(urlPathGlobalName);//取全局变量
	var tuArr = tempUrl.split(urlSplitChar);
	var tl = tuArr.length;
	var tul = tuArr.pop();//移除数组中的最后一个元素并返回该元素，这里取出的是最后保存的url路径
	if(!tul || tul == "") {
        setGlobalVar("isBack","");
		tul = getGlobalVar("PORTAL_ADDR");
	}
	var newUrl = tuArr.join(urlSplitChar);//移除最后一个url路径后，将所剩下的url再次用#分隔符拼接成一个新串保存到全局变量中
	setGlobalVar(urlPathGlobalName, newUrl);
    // setGlobalVar("mediaPage","");//清除当前页数
    // setGlobalVar("mediaId","");//清除集数记忆的下标
    // setGlobalVar("indexId","");//清除影片列表记忆的下标
    setGlobalVar("isBack","Y");
	// setGlobalVar("vod_dy_index_line_id","");
	// setGlobalVar("vod_dy_index_rlFlag","");
	// setGlobalVar("vod_dy_index_curPage","");
	// setGlobalVar("vod_dy_index_left_menu_flag","");
	location.href = tul;
}

function clearUrlPath() {//清除保存的所有路径
	setGlobalVar(urlPathGlobalName, "");
}


var urlTopPathGlobalName = "urlPathGlobalName";//全局变量名
function saveTopUrlPath(){
    var tempUrl = getGlobalVar(urlTopPathGlobalName) == undefined ? "":getGlobalVar(urlTopPathGlobalName);
    tempUrl = tempUrl + urlSplitChar + location.href;
    var arr = tempUrl.split(urlSplitChar);
    if(arr.length>6){
        var removeLength=arr.length-6;
        var newArr=arr.slice(removeLength);
        tempUrl = arr[1]+urlSplitChar+newArr.join(urlSplitChar);
    }
    setGlobalVar(urlTopPathGlobalName, tempUrl);
}

function goReturnTopUrlPath(){
    var tempUrl = getGlobalVar(urlTopPathGlobalName);
    var tuArr = tempUrl.split(urlSplitChar);
    var tl = tuArr.length;
    var tul = tuArr.pop();
    if (!tul || tul == "")
    {
        tul = getGlobalVar("PORTAL_ADDR");

    }
	//允许全局数字键
    Utility.ioctlWrite("SEND_BROADCAST", "Broadcast:com.coship.logicnum.allow, Param:--ez&allow&true");
    var newUrl = tuArr.join(urlSplitChar);
    setGlobalVar(urlTopPathGlobalName, newUrl);
    Utility.setEnv("portal_Form","");
    location.href = tul;
}

function clearUrlTopPath(){
    setGlobalVar(urlTopPathGlobalName, "");
}

function doReturnTopPress(){
    setGlobalVar("isBack","Y");
    clearGlobalVar();
    goReturnTopUrlPath();
}

/**
 * @description showTime 用于页面中时间，日期的显示
 * @param {string} _objId 可以是2D页面中的时间对象，也可以是div中的id
 */
var showTime = {
	init : function() {
		if($("time")) {
			this.getTime();
			setInterval(this.getTime, 60000);
		}
	},
	getTime : function() {
		var date = new Date();
		var hour = date.getHours();
		var minute = date.getMinutes();
		hour = hour < 10 ? "0" + hour : hour;
		minute = minute < 10 ? "0" + minute : minute;
		var time_ = hour + ":" + minute;
		if($("week")) {
			var week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
			var week_ = week[date.getDay()];
			$("week").innerHTML = week_;
		}
		if($("date")) {
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			month = month < 10 ? "0" + month : month;
			day = day < 10 ? day = "0" + day : day;
			var day_ = year + "." + month + "." + day;
			$("date").innerHTML = day_;
		}
		$("time").innerHTML = time_;
	}
};
//将日期格式2013.05.02转换成20130502000000  yyyyMMddhhmmss年月日时分秒
function dateFormat(date){
	var dataArr=date.split(".");
	var dateStr="";
	for(i=0;i<dataArr.length;i++){
		dateStr+=dataArr[i];
	}
	dateStr+="000000";
	return dateStr;
}

//将03:10:02格式的时间转换成秒
function formateDate(date){
	var dataArr=date.split(":");
	var hour = parseInt(dataArr[0],10);
	var minute = parseInt(dataArr[1],10);
	var second = parseInt(dataArr[2],10);
	return hour*3600+minute*60+second;
}

function ajaxUrl(_url, _handler, _data){
	this.xmlHttp = null;
	this.createXMLHttpRequest = function () {
		if(window.XMLHttpRequest) {
			this.xmlHttp = new XMLHttpRequest();
			if (this.xmlHttp.overrideMimeType) {
				this.xmlHttp.overrideMimeType('text/xml');
			}
		} else {
			if(window.ActiveXObject) {
				this.xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
		}
	};
	this.getData = function () {
		this.createXMLHttpRequest();
		var xmlHttp = this.xmlHttp;
//		_url = "http://" + portalIP + ":" + portalPort + _url;
		this.xmlHttp.open("POST", _url, true);
        this.xmlHttp.setRequestHeader("Content-type", "content-type:text/plain");
     	this.xmlHttp.send(_data);
		this.xmlHttp.onreadystatechange = function() {
			if(xmlHttp.readyState == 4) {
				if(xmlHttp.status == 200) {
					callBackData3(xmlHttp, _handler);
				} else {//超时间方法,传入空会自动弹出服务器忙的提示
					showMsg("", "系统忙,请稍候重试。");
				}
			}
		};
	};
	this.getData();
}


function ajax(param) {
	this.url = param.url || "";
    this.method = param.method || "get";
    this.handler = param.handler;
	this.xmlHttp = null;
	this.createXMLHttpRequest = function () {
		if (window.ActiveXObject) {
			this.xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}else {
			this.xmlHttp = new XMLHttpRequest();
		}
	}
	this.getData = function () {
		this.createXMLHttpRequest();
		var xmlhttp = this.xmlHttp;
		var handler = this.handler;
		var obj = new Object();
		this.xmlHttp.open(this.method, this.url, true);
		this.xmlHttp.send(null);
		this.xmlHttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200 || xmlhttp.status == 0) {
					callBackData2(xmlhttp,handler);
				}
			}
		}
	}
	this.getData();
}

function callBackData2(_xmlHttp, _handler){
    var resText = _xmlHttp.responseText;
	_handler(resText);
}
/**
 * @description 此函数的作用是解析ajax返回的json，将数据变为json对象
 * @param {string} _data ajax返回xmlHttp.responseText
 */

function parseJSON(_data) {
	if( typeof _data !== "string" || !_data) {
		return null;
	}
	//data = trim( data );
	if(_data.indexOf("a_") >= 0) {//此句的作用在于showMsg中的弹出提示框不是json格式
		return _data;
	}
	if(window.JSON && window.JSON.parse) {
		return window.JSON.parse(_data);
	} else {
		return eval("(" + _data + ")");
	}
}


/**
 * @description callBackData 对ajax返回的数据进行统一的处理
 * @param {object} xmlHttp 为ajax返回xmlHttp对象
 * @param {function} _handler 当请求的数据成功返回时，为页面的回调函数
 */

function callBackData3(_xmlHttp, _handler){
   var resText = _xmlHttp.responseText;
	resText = eval("(" + resText + ")");
	_handler(resText);
}

function getErrorMsg(errorMsg) {
	var errorTextMsg = errorMsg.message;
	if(errorTextMsg == "") {
		errorTextMsg = "网络繁忙，请稍候重试。";
	}
	var errorMessage = errorTextMsg + "。 【 " + errorMsg.errorCode + " 】";
	switch(errorMsg.errorCode) {
		case "12011086"://栏目信息不存在
		case "122000020"://参数不能为空
		case "12200061"://资源不存在或已经下架
		case "10000001"://系统烦忙,请稍后。
		case "10000002"://资源暂不可用！
		case "12200009"://用户无效
		case "2001"://用户信息不存在
		case "-1"://无message信息
		case "2030"://AAA返回资源不存在
			showMsg("", errorMessage);
			break;
		default:
			showMsg(tipUrl + "T-nsp/tip/a_collect.htm", errorMessage);
			break;
	}
}

var nowTip="";
/** @description goToPortal 对业务的整体键值进行监听*/
//document.onkeyPress = globalEvent;
document.onkeydown = grabEvent;
var keycode;
function grabEvent(_e) {
	keycode = _e.keyCode || _e.which;
	if(tipFlag) {
		switch(keycode) {
			case KEY.BACK:
			case KEY.RETURN:
			case KEY.QUIT:
            case KEY.RETURN_N:
            case KEY.RETURN_RG:
				_e.preventDefault();
				if(searchTipFlag) {//搜索弹出框按返回时的处理
					if(($("search_Input").value).length != 0) {
						deleteValue();
					} else {
						closeTip();
					}
				} else {//弹出框默认处理
					closeTip();
				}
				break;
            case KEY.NEXT:
            case KEY.NEXT_N:
                doPageDownPressWhenShow();
                break;
            case KEY.PREV:
            case KEY.PREV_N:
                doPageUpPressWhenShow();
                break;
		}
	} else if(mediaTipFlag) {//弹出集数选择框
		switch(keycode) {
			case KEY.ENTER:
			case KEY.ENTER_N:
				//doMediaConfirm();
				break;
			case KEY.BACK:
			case KEY.RETURN:
			case KEY.QUIT:
            case KEY.RETURN_N:
            case KEY.RETURN_RG:
				_e.preventDefault();
				closeTip();
				break;
			case KEY.LEFT:
			case KEY.LEFT_N:
            case KEY.LEFT_RG:
				_e.preventDefault();
				//moveMediaLeft();
				break;
			case KEY.RIGHT:
            case KEY.RIGHT_N:
            case KEY.RIGHT_RG:
				_e.preventDefault();
				//moveMediaRight();
				break;
			case KEY.NEXT:
			case KEY.NEXT_N:
                turnNextMoreMedia();
				break;
			case KEY.PREV:
			case KEY.PREV_N:
                trunPrevMoreMedia();
				break;
		}
	} else {
		switch(keycode) {
			case KEY.ONE:
			case KEY.TWO:
			case KEY.THREE:
			case KEY.FOUR:
			case KEY.FIVE:
			case KEY.SIX:
			case KEY.SEVEN:
			case KEY.EIGHT:
			case KEY.NINE:
			case KEY.ZERO:
                var num = keycode - 48;
                doNumberPress(_e, num);
				break;
        	case KEY.HOME://菜单键
            case KEY.HOMEPAGE://互动键
				goToPortal();
			break;
			case KEY.UP:
			case KEY.UP_N:
            case KEY.UP_RG:
                moveUp();
				break;
			case KEY.DOWN:
			case KEY.DOWN_N:
            case KEY.DOWN_RG:
                moveDown();
				break;
			case KEY.LEFT:
			case KEY.LEFT_N:
            case KEY.LEFT_RG:
                moveLeft();
				break;
			case KEY.RIGHT:
			case KEY.RIGHT_N:
            case KEY.RIGHT_RG:
                moveRight();
				break;
			case KEY.NEXT:
			case KEY.NEXT_N:
                doPageDownPress(_e, keycode);
				break;
			case KEY.PREV:
			case KEY.PREV_N:
                doPageUpPress(_e, keycode);
				break;
			case KEY.ENTER:
			case KEY.ENTER_N:
                doConfirm();
				break;
			case KEY.PLAY:
			case KEY.PLAY1:
			case KEY.PLAY_N:
                doPlayKeyPress(_e, keycode);
				break;
			case KEY.BACK:
			case KEY.RETURN:
			case KEY.RETURN_N:
			case KEY.RETURN_RG:
                _e.preventDefault();
				doReturnKey();

				break;
			case KEY.RED:
			case KEY.RED_N:
			case KEY.RED_T:
				doRedKey();
				break;
			case KEY.YELLOW:
			case KEY.YELLOW_N:
			case KEY.YELLOW_T:
				doYellowKey();
				break;
			case KEY.BLUE:
			case KEY.BLUE_N:
			case KEY.BLUE_T:
				doBlueKey();
				break;
			case KEY.GREEN:
			case KEY.GREEN_N:
			case KEY.GREEN_T:
				 _e.preventDefault();
				doGreenKey();
				break;
			case KEY.QUIT_N:
			case KEY.QUIT:
				//_e.preventDefault();
				doPortalKey();
				break;
			case KEY.SEARCH:
			    _e.preventDefault();
				doPositionKey();
				break;
			case KEY.STATIC:
				if(videoObj != undefined){
					videoObj.resetStatic();
				}
				break;
			case KEY.VOICEUP:
			case KEY.VOICEDOWN:
				if(videoObj != undefined){
					if(!isDisplayVoice()){
						voice.displayVoice(true);
					}else{
						doVoice(keycode, _e);
					}
				}
				break;
			default:
				break;
		}
	}
}




//***************************     搜索 开始             *************************
/** @description 搜索*/
function goToSearch() {
    window.location.href =goUrl2+ "/iPG/T-nsp/daital/daitalNew.htm";
}
function moveRight() {

}
function moveLeft() {

}
function moveUp() {

}
function moveDown() {

}
function doConfirm() {

}

function doPlayKeyPress(_e, keycode) {

}
function deleteValue() {
	$("search_Input").value = ($("search_Input").value).substring(0, ($("search_Input").value).length - 1);
}

function deleteAll() {
	$('search_Input').value = '';
}

function doSearch() {
	var keyWord = $('search_Input').value;
	if(keyWord == "") {
		$('search_Input').value = "请输入关键字进行搜索";
	} else {
		saveUrlPath();
		window.location.href = 'search_list.htm?keyWord=' + keyWord;
	}
}

function onSearchButton(id) {
	var value = "";
	if($("search_Input").value != "") {
		value = $("search_Input").value + id;
	} else {
		value += id;
	}
	$("search_Input").value = value;
}
//***************************     搜索 结束             *************************


//---------------------- 按0-9数字键调用方法-------------------------------
function goToRec(recJson) {
	if(recJson.length != 0) {//推荐海报数据长度
		keycode = keycode - 49 >= -1 ? keycode - 49 : -2;
        if(keycode == -1) {
            keycode = 9;
        }
		if(recJson.length - 1 < keycode || keycode < 0) {//页面显示的推荐海报个数
			return;
		} else {
            if(recJson[keycode].assetInfo.recordType=="pakg"){
                window.location.href =tipUrl+ "/T-nsp/dsjc/detail_dsjc.htm?userId=" + getUserId() + "&columnMapId=" + recJson[keycode].assetInfo.columnMapId+"&checkBookmark=Y&columnId="+recJson[keycode].assetInfo.columnId;
            }else{
                window.location.href = tipUrl+ "/T-nsp/jtyy/detail_jtyy.htm?userId=" + getUserId() + "&columnMapId=" + recJson[keycode].assetInfo.columnMapId+"&checkBookmark=Y&columnId="+recJson[keycode].assetInfo.columnId;
            }
		}
	}
}

/** @description doRedKey 数字键处理函数，页面重写此方法*/
function doNumberKey(){}

function doReturnKey() {
	setGlobalVar("isBack", "Y");//页面返回标示，Y如果是从其他页面返回到当前页则取保存的机顶盒变量
	clearGlobalVar();
	goReturnUrlPath();
    //doReturnTopPress();
}

/** @description doRedKey 红色键处理函数*/
function doRedKey() {//我的空间
    gotoZone('Favorite');
}
function gotoZone(name) {
    window.location.href = goUrl2 + "/iPG/T-nsp/myzone/"+name+".htm";
}
function goToMyZone() {
    saveUrlPath();
    window.location.href = goUrl2 + "/iPG/T-nsp/myzone/Favorite.htm";
    //window.location.href = goUrl + "/iPG/WS_test/nav_list.htm?folderAssetId=MANU0000090000087510";
}
function goToMySearch() {
    saveUrlPath();
    window.location.href = goUrl + '/RGyouku/'+'/iPG/T-nsp/daital/daitalNew.htm?folderColumnId='+getQueryStr(location.href, "folderColumnId") || ""+'columnId='+getQueryStr(location.href, "folderAssetId");
}

/** @description doGreenKey 绿色键处理函数*/
function doGreenKey(){
	goToSearch();
}

/** @description doYellowKey 黄色键处理函数*/
function doYellowKey(){
//    clearUrlPath();clearUrlTopPath();
//    location.href = Utility.getEnv("ROOT_PATH") + "help/user_docs.htm";
}

/** @description doBlueKey 蓝色键处理函数*/
function doBlueKey() {//点播排行
	goToTop();
}

/** @description doPositionKey 定位键处理函数*/
function doPositionKey() {//搜索
    goToSearch();
}

function doPortalKey(){//按主页键清除全局变量，返回至portal页
	//clearGlobalVar();//页面重写此方法
	//允许全局数字键
    //Utility.ioctlWrite("SEND_BROADCAST", "Broadcast:com.coship.logicnum.allow, Param:--ez&allow&true");
	goToPortal();
}

/** @description goToPortal 返回portal处理函数*/
function goToPortal() {//清除路径
	clearUrlPath();clearUrlTopPath();
    setGlobalVar("cateFocusGlobalName","");
    setGlobalVar("areaFocusGlobal","");
    setGlobalVar("cateFocusGlobal","");
    setGlobalVar("mediaPage","");//清除当前页数
    setGlobalVar("mediaId","");//清除集数记忆的下标
    setGlobalVar("indexId","");//清除影片列表记忆的下标
    setGlobalVar("isBack","");
    setGlobalVar("turnPage_curPage","");
    setGlobalVar("cate_Area","");
    setGlobalVar("cate_Id","");
    setGlobalVar("jtyygq_cate_Id","");
    setGlobalVar("jtyylist_cate_Id","");
    setGlobalVar("jtyysimple_cate_Id","");
    setGlobalVar("isBack","");
    setGlobalVar("detailBack","");
    setGlobalVar("turnPage_curPage","");
	setGlobalVar("vod_dy_index_line_id","");
	setGlobalVar("vod_dy_index_rlFlag","");
	setGlobalVar("vod_dy_index_curPage","");
	setGlobalVar("vod_dy_index_left_menu_flag","");
    location.href = getGlobalVar("PORTAL_ADDR");

}

function clearGlobalVar() {

}

var doEvent = {
	/** @description  红色键处理函数*/
	red : function() {
		goTo.myZone("collect_list.htm?type=0");
	},
	/** @description  绿色键处理函数*/
	green : function() {
		goTo.myZone("collect_list.htm?type=1");
	},
	/** @description  黄色键处理函数*/
	yellow : function() {
	},
	/** @descript
	 * ion  蓝色键处理函数*/
	blue : function() {
		goTo.top("top.htm");
	},
	/** @description  返回键处理函数*/
	back : function() {
		goTo.back();
	},
	/** @description  主页键处理函数*/
	home : function() {
		goTo.portal();
	},
	/** @description  定位键处理函数*/
	position : function() {
		goTo.search("search.htm");
	},
};

/** @description 页面静态跳转*/
var goTo = {
	/** @description  进入列表页*/
	list : function(_pageType, _columnId) {
		globalPath.setUrl();
		window.location.href = epgUrl + _pageType + "?columnId=" + _columnId;
	},
	/** @description  进入详情页_columnMapId 媒资ID，_recordType 电影电视剧，columnId栏目ID*/
	detail : function(_pageType, _columnMapId, _recordType) {
		globalPath.setUrl();
		window.location.href = epgUrl + _pageType + "?columnMapId=" + _columnMapId+"&columnId="+columnId+"&recordType="+_recordType;
	},
	/** @description  进入点播排行*/
	top : function(_pageType) {
		globalPath.setUrl();
		window.location.href = epgUrl + _pageType;
	},
	/** @description  进入我的空间*/
	myZone : function(_pageType) {
		globalPath.setUrl();
		window.location.href = epgUrl + _pageType;
	},
	/** @description  进入我的搜索*/
	search : function(_pageType) {
		globalPath.setUrl();
		window.location.href = epgUrl + _pageType;
	},
	/** @description  退出回到portal首页*/
	portal : function() {
		globalPath.cleanUrl();
		location.href = getGlobalVar("portalIndexUrl");
	},
	/** @description  返回上一目录*/
	back : function() {
		globalPath.getUrl();
		setGlobalVar("isBack", "Y");
	}
};

var doExecute = {
	/** @description  收藏节目VOD：点播(单片，默认值)  BTV：回看  nPVR：个人录像 VODPkg：媒资包*/
	collect : function(columnId, assetId, assetName,custom) {
		if(checkUser()){
			//columnId="123";//栏目ID写死，保证folderAssetId的值不为空
			var VOD_saveVodFavorites = {
				"data":"<AddBookmark titleAssetId=\"" + assetId +"\" custom=\"" + custom+"\" folderAssetId=\"" + columnId + "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
				"callBack" : function(_dataJson) {
					if(_dataJson.code){
						showMsg(tipUrl + "T-nsp/tip/a_collect.htm","收藏已达到最大收藏记录数");
						return;
					}
					var bookmarkedId = _dataJson.bookmarkedId;

					if(bookmarkedId==0){
						collectFlag=true;
						var allsetName_char=assetName.replace(/[^\x00-\xff]/g, "**");
						var    msg="收藏节目("+assetName+")成功！";
						showMsg(tipUrl + "T-nsp/tip/a_collect.htm", msg);

						//window.document.body.style.background = "url('images/details_jtyy_bg2.png')";
						 document.getElementById("infoBtns_dsjc_ysc").style.visibility="visible";
					}else{
						var msg=_dataJson.message;
						showMsg(tipUrl + "T-nsp/tip/a_collect.htm", "系统繁忙！");
					}
				}
			};
			IEPG.getData(URL.VOD_addSavedProgram, VOD_saveVodFavorites);
		}
	},
	/** @description  推荐节目*/
	recmd : function(assetId,providerId,recommandPoint) {//推荐

		if(checkUser()){
			var recommandURL="<RecommandProgram assetId=\"" + assetId + "\" providerId=\"" + providerId+ "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>";
			if(recommandPoint!=""&& recommandPoint!=undefined){
				recommandURL="<RecommandProgram assetId=\"" + assetId + "\" recommandPoint=\"" + recommandPoint+"\" providerId=\"" + providerId+ "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>";
			}
			var VOD_recommendAsset = {
				"data":recommandURL,
				"callBack" : function(_dataJson) {
					if(_dataJson.code){

						//处理提示信息
						var time = (_dataJson.message).substring( (_dataJson.message.indexOf(":")+1),(_dataJson.message.length));

						var  msg = "亲，再次点赞请等待"+time+"小时"

						showMsg(tipUrl + "T-nsp/tip/a_collect.htm",msg );
						return;
					}
					var result = _dataJson.recommandTimes;
					var recommandPoint = _dataJson.recommandPoint;
					if(result){
						setGlobalVar("recmdId",assetId);
						var msg = "推荐成功，感谢您的参与";
						showMsg(tipUrl + "T-nsp/tip/a_collect.htm", msg);
						$("recmdCount").innerHTML = parseInt((parseInt(playCountNum) + parseInt(parseInt(result)+11)));
					}else if(recommandPoint){

						gradeTipFlag=false;
						$("grade").src = skinImgUrl + "star_blue/star" + Math.ceil(recommandPoint) + ".png";
					}
				}
			};
			IEPG.getData(URL.VOD_recommendAsset, VOD_recommendAsset);
		}
	},
	/** @description  连续剧追剧*/
	playHis : function(_columnMapId) {
		var VOD_addTeleplayHis = {
			"param" : {
				"columnMapId" : _columnMapId
			},
			"callBack" : function(_dataJson) {
				if(_dataJson.errorCode == "200") {
					var msg = "本节目追剧成功，精彩敬请期待！";
					showMsg(tipUrl + "T-nsp/tip/a_collect.htm", msg);
				}
			}
		};
		IEPG.getData(URL.VOD_addTeleplayHis, VOD_addTeleplayHis);
	},

	/** @description 删除收藏*/
	deleteCollect : function(columnId, assetId, assetName,custom) {
		if(checkUser()){
			//columnId="123";//栏目ID写死，保证folderAssetId的值不为空
			var VOD_removeVodFavorites = {
				"data":"<DeleteBookmark titleAssetId=\"" + assetId +"\" custom=\"" + custom+"\" folderAssetId=\"" + columnId + "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
				"callBack" : function(_dataJson) {
					if(_dataJson.code == 0 ){

						//删除成功
						//window.document.body.style.background = "url(images/details_jtyy_bg.png)";
						 document.getElementById("infoBtns_dsjc_ysc").style.visibility="hidden";
					}else{
						var msg=_dataJson.message;
						showMsg(tipUrl + "T-nsp/tip/a_collect.htm", "系统繁忙！");
					}
				}
			};
			IEPG.getData(URL.VOD_removeVodFavorites, VOD_removeVodFavorites);
		}

	}


};

//****************时间秒转换为00：00：00格式**********************
function convertToShowTime(second) {
	if(isNaN(second) || second < 0)
		second = 0;
	var hh = parseInt(second / 3600);
	var mm = parseInt((second % 3600) / 60);
	var ss = (second % 3600) % 60;
	return addZero(hh) + ":" + addZero(mm) + ":" + addZero(ss);
}

function addZero(val) {
	if(val < 10){
		return "0" + val;
	}
	return val;
}

/**
 * @description subText 汉字与字符都都在时截取长度
 * @param {string} _str 需要截取的字符串
 * @param {string} _subLength 页面上展示字符串的长度（汉字个数*2）
 * @param {number} _num 是否滚动（num等于0时字符截取，num等于1时数据进行滚动）
 */

IEPG.subText = function(_str, _subLength, _num) {
	var temp1 = _str.replace(/[^\x00-\xff]/g, "**");
	var temp2 = temp1.substring(0, _subLength);
	var x_length = temp2.split("\*").length - 1;
	var hanzi_num = x_length / 2;
	_subLength = _subLength - hanzi_num;
	var res = _str.substring(0, _subLength);
	if(_num === 0) {
		if(_subLength < _str.length) {
			res = res + "...";
		}
		return res;
	} else {
		if(_subLength < _str.length) {
			return "<marquee scrollLeft='1' behavior='scroll' direction='left' scrollamount='6' scrolldelay='100' id='marqueeId' >" + _str + "</marquee>";
		}
		return _str;
	}
};
/**
 * @description subText 汉字与字符都都在时截取长度
 * @param {string} _str 需要截取的字符串
 * @param {string} _subLength 页面上展示字符串的长度（汉字个数*2）
 * @param {number} _num 是否滚动（num等于0时字符截取，num等于1时数据进行滚动）
 */

IEPG.subText = function(_str, _subLength, _num) {
    var temp1 = _str.replace(/[^\x00-\xff]/g, "**");
    var temp2 = temp1.substring(0, _subLength);
    var x_length = temp2.split("\*").length - 1;
    var hanzi_num = x_length / 2;
    _subLength = _subLength - hanzi_num;
    var res = _str.substring(0, _subLength);
    if(_num === 0) {
        if(_subLength < _str.length) {
            res = res + "...";
        }
        return res;
    } else {
        if(_subLength < _str.length) {
            return "<marquee scrollLeft='1' behavior='scroll' direction='left' scrollamount='6' scrolldelay='100' id='marqueeId' >" + _str + "</marquee>";
        }
        return _str;
    }
};

IEPG.subDetailText = function(_str, _subLength) {
    var temp1 = _str.replace(/[^\x00-\xff]/g, "**");
    var temp2 = temp1.substring(0, _subLength);
    var x_length = temp2.split("\*").length - 1;
    var hanzi_num = x_length / 2;
    _subLength = _subLength - hanzi_num;
    var res = _str.substring(0, _subLength);
    //if(_num === 0) {

        if(_subLength < _str.length)
       {
            res = res + "...";
            return res;
       }
       else
      {
          return "<span id='div1' style='height:95%; vertical-align:top'><marquee width='480' height='95%'   behavior='scroll' direction='up' scrollamount='2' scrolldelay='180' id='marqueeId' >" + _str + "</marquee></span>";
         // return _str;
      }
};

/*var MyMmar11;
IEPG.subText = function(_str, _subLength, _num) {
var temp1 = _str.replace(/[^\x00-\xff]/g, "**");
var temp2 = temp1.substring(0, _subLength);
var x_length = temp2.split("\*").length - 1;
var hanzi_num = x_length / 2;
_subLength = _subLength - hanzi_num;
var res = _str.substring(0, _subLength);
if(_num === 0) {
if(_subLength < _str.length) {
res = res;
}
return res;
} else {

//clearInterval(MyMmar);
if(_subLength < _str.length) {
MyMmar11=setInterval(marqpuee22,5);
return "<span id='div1' style='width:auto;height:auto;overflow:hidden;white-space:nowrap;display:block;'><span id='div4' style='float:left;display:block;'><span id='div2' style='float:left;'>" + _str + "&nbsp&nbsp</span><span id='div3' style='float:left;'></span></span></span>";
} else {
return _str;
}
}
};

function marqpuee22(){
var s1=document.getElementById("div1");
var s2=document.getElementById("div2");
var s3=document.getElementById("div3");
var s4=document.getElementById("div4");
s4.style.width=(s2.offsetWidth*2)+"px";
s3.innerHTML=s2.innerHTML;
if(s2.offsetWidth<=s1.scrollLeft){
s1.scrollLeft-=s2.offsetWidth;
}else{
s1.scrollLeft++;
}
}*/

//******************************* 取url中的相关参数  **********************************************
//获取url中param参数的值  例子：var serviceCode = getQueryStr(location.href, "serviceCode");
function getQueryStr(_url, _param) {
	var rs = new RegExp("(^|)" + _param + "=([^\&]*)(\&|$)", "g").exec(_url), tmp;
	if( tmp = rs) {
		return tmp[2];
	}
	return "";
}

/*替换字符串中参数的值searchStr：查找的字符串，replaceVal：替换的变量值
 var backUrl=backUrl.replaceQueryStr(breakpointTime,"vod_ctrl_breakpoint");
 */
String.prototype.replaceQueryStr = function(_replaceVal, _searchStr) {
	var restr = _searchStr + "=" + _replaceVal;
	var rs = new RegExp("(^|)" + _searchStr + "=([^\&]*)(\&|$)", "g").exec(this), tmp;
	var val = null;
	if( tmp = rs) {
		val = tmp[2];
	}
	if(val == null) {
		if(this.lastIndexOf("&") == this.length - 1) {
			return this + restr;
		} else if(this.lastIndexOf("?") >= 0) {
			return this + "&" + restr;
		}
		return this + "?" + restr;
	}
	var shs = _searchStr + "=" + val;
	if(this.lastIndexOf("?" + shs) >= 0) {
		return this.replace("?" + shs, "?" + restr);
	}
	return this.replace("&" + shs, "&" + restr);
};

//页面做分页处理时，pageLength：总数据长度，pageSize：页面可显示的数据长度
function getMaxPage(_pageLength, _pageSize) {//求最大页数
	if(_pageLength == 0 || _pageLength == undefined) {
		return 0;
	}
	if(_pageLength % _pageSize != 0) {
		return Math.ceil(_pageLength / _pageSize);
	}
	return _pageLength / _pageSize;
}

function getMaxPageSize(_pageLength, _pageSize) {//求为最大页数时pagesize
	if(_pageLength == 0 || _pageLength == undefined) {
		return 0;
	}
	if(_pageLength % _pageSize != 0) {
		return _pageLength % _pageSize;
	}
	return _pageSize;
}

//******************************* 真焦点处理 *********************************
// inputs 标签状态保存
var inputsStates;
//将页面上所有的标签都设为可用
function enabledAll() {//所有 input 标签
	var inputs = document.getElementsByTagName("input");
	for(var i = 0; i < inputs.length; i++) {
		inputs[i].disabled = false;
	}
    var buttons = document.getElementsByTagName("button");
    for(var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = false;
    }
}

//将页面上所有的标签都设为不可用
function disabledAll() {//所有 input 标签
	var inputs = document.getElementsByTagName("input");
	inputsStates = new Array(inputs.length);
	for(var i = 0; i < inputs.length; i++) {
		inputsStates[i] = inputs[i].disabled;
		inputs[i].disabled = true;
	}
    var buttons = document.getElementsByTagName("button");
    for(var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }

}

//*************************** 消息弹出框 ***********************************
/**
 * @description subText 消息弹出框，显示提示信息,传入 空,弹出服务器忙的提示
 */

//弹出框div的ID
var tipDivId = "tip_visibility";
//显示消息文字的div的ID
var messInfoId = "tip_window";
//弹出窗口之前有焦点的对象
var lastObj;
//弹出框标识，true为有弹出框，默认为false；
var tipFlag = false;
var OKButtonId = "OKButton";
var cancelButtonId = "cancle";
var timer;
function showMsg(url, msg) {
	clearTimeout(timer);
	if(!tipFlag){// 如果当前已经没有弹出窗口,则需要保存当前焦点对象和面页按键的有效状态
		lastObj = document.activeElement;
		disabledAll();
	}
	var tipDiv = $(tipDivId);
	if(tipDiv)tipDiv.style.display = "block";
	var tipWindow = $(messInfoId);
	if(url == "") {
		url = tipUrl + "T-nsp/tip/a_busyInfo.htm";
		if(msg == "") {
			msg = "系统忙，请稍后再试！";
		}
	}
	new ajax({
		"url" : url,
		"handler" : function(resText) {
			tipDiv.style.visibility = "visible";
			tipWindow.innerHTML = resText;
			tipFlag = true;
			if(resText.indexOf("a_searchTip") >= 0) {    //搜索提示框
				searchTipFlag = true;
				$('search_Input').focus();
				return;
			}
			$("message").innerHTML = msg;
			if($(OKButtonId)){   //弹出窗口确定按钮Id必须为 OKButton ,OKButton为弹出窗口专用ID
				$(OKButtonId).focus();
			}
            if($('OKButtonTry')){   //弹出窗口确定按钮Id必须为 OKButton ,OKButton为弹出窗口专用ID
                $('OKButtonTry').focus();
            }

			var name1 = document.getElementById("name").innerHTML;
			if(name1 != "" && name1 != null){
                document.getElementById("assetName").innerHTML = name1;
            }

			var price1 = document.getElementById("price1").innerHTML;
			if(price1 != "" && price1 != null){
                document.getElementById("price").innerHTML = price1;
            }

            var pr = document.getElementById("payRes").innerHTML;
            if(pr != "" && pr != null){
                document.getElementById("aMout1").innerHTML = pr;
            }

            var am = document.getElementById("aMout").innerHTML
            if(am != "" && am != null){
                document.getElementById("amounts").innerHTML = am+"元";
            }

			var now = am - price1;
			 if(now != "" && now != null && now >=0){
                document.getElementById("amounts2").innerHTML = now;
            }

            var a = document.getElementById("aMout1").innerHTML;

            document.getElementById("buyisok").innerHTML = (am-a)+"元";
			if(resText.indexOf("a_buyTip") >= 0) {
               	$(OKButtonId).onclick = function() {
                    dzxyTip();//按确认进入电子信息协议
				};
//				$(OKButtonId).onclick = function() {
//					Buy.doBuy();//提示购买时按确认键购买
//				};

			}else if(resText.indexOf("buyMessage") >= 0) {
                $(OKButtonId).onclick = function() {
                    buyWayTip();//按确认选择购买方式
                };
            }
            else if(resText.indexOf("a_buyWayTip") >= 0) {
                $(OKButtonId).onclick = function() {
                    Buy.doBuy();//提示购买时按确认键购买
                };
            }
            else if(resText.indexOf("a_buyPkgTip") >= 0) {
				$(OKButtonId).onclick = function() {
					Buy.doBuy();//提示购买时按确认键购买
				};
				$(cancelButtonId).onclick = function() {
					Buy.chargeMode = "6";
					Buy.doBuy();//提示购买时按确认键购买
				};
			} else if(resText.indexOf("a_buyTvplayTip") >= 0) {
				$("OKButton").onclick = function() {
					Buy.goodsId = mediaListJson[tempMedaiFocus].goodsId;
					IEPG.doPlay();
					//Buy.getPrice();//单集按次
				};
				$("OKButton1").onclick = function() {
					Buy.goodsId = detailJson.goodsId;
					IEPG.doPlay();
					//Buy.goodsId=detailJson.goodsId;//整部按次
					//Buy.getPrice();
				};
			} else if(resText.indexOf("a_buyPackTip") >= 0) {
				$("OKButton").onclick = function() {
					if(productJson.implNum == 3){
						Buy.goodsId = mediaListJson[tempMedaiFocus].goodsId;
						IEPG.doPlay();
					}else{
						Buy.goodsId = detailJson.goodsId;
						IEPG.doPlay();
					}
				};
				if(productJson.implNum == 3){
					$("OKButton2").onclick = function() {//包月购买
						Buy.goodsId = detailJson.goodsId;
						IEPG.doPlay();
					};
				}

				$("OKButton1").onclick = function() {//包月购买
					IEPG.getMonthPriceToken();
				}

			}else if(resText.indexOf("a_buyOk") >= 0) {
				$(OKButtonId).onclick = function() {
					IEPG.doPlay();//订购成功后按确认键直接播放
				};
			} else if(resText.indexOf("a_breakTimeTip") >= 0) {
				$(OKButtonId).onclick = function() {
					Buy.buyPlayType = "1";
					//IEPG.doBookmarkPlay(getGlobalVar("timePosition"));//从断点处播放
					IEPG.doPlay();

				};
				$("rePlayButton").onclick = function() {
					//setGlobalVar("timePosition", "");
					Buy.buyPlayType = "0";
					IEPG.doPlay();//重新播放
				};
			}
            else if(resText.indexOf("a_error_info") >= 0) {
                $(OKButtonId).onclick = function() {
                    closeErrorTip();
                };
                $("cancelButtonId").onclick = function() {
                    closeErrorTip();
                };
            }
		},
		"method":"post"
	});
//	timer=setTimeout(function(){
//				closeTip();
//	},8000);
}

function closeTip() {//关闭提示信息
	var tipDiv = $(tipDivId);
	var tipWindow = $(messInfoId);
	var tipPkgWindwo = $("tipWindow");
	if(tipWindow) {
		tipDiv.style.visibility = "hidden";
		tipWindow.innerHTML = "";
		//$("message").innerHTML = "";
	}
	if(tipPkgWindwo) {
		tipPkgWindwo.style.display = "none";
		tipPkgWindwo.innerHTML = "";
	}
	tipFlag = false;
	collectFlag=false;
	mediaTipFlag = false;
	searchTipFlag = false;
	gradeTipFlag=false;
	enabledAll();
	if(lastObj) {
		lastObj.focus();
	}
	return false;
}

function closeErrorTip() {//关闭提示信息
    var tipDiv = $(tipDivId);
    var tipWindow = $(messInfoId);
    var tipPkgWindwo = $("tipWindow");
    if(tipWindow) {
        tipDiv.style.visibility = "hidden";
        tipWindow.innerHTML = "";
        //$("message").innerHTML = "";
    }
    if(tipPkgWindwo) {
        tipPkgWindwo.style.display = "none";
        tipPkgWindwo.innerHTML = "";
    }
    tipFlag = false;
    collectFlag=false;
    mediaTipFlag = false;
    searchTipFlag = false;
    gradeTipFlag=false;
    clearUrlPath();
    enabledAll();
    if(lastObj) {
        lastObj.focus();
    }
    location.href = getGlobalVar("PORTAL_ADDR");
    return false;
}
/**
 * 获取海报，最新的方法
 */
function gPoster(imageList,width,height){
	var picUrl = defaultPic;
	var standard = 999999;
	if(imageList){
		for(var i = 0; i < imageList.length; i++){
			var imgUrl = imageList[i].posterUrl || imageList[i].displayUrl;
			getImgSize(imageList[i]);
			var distance = Math.sqrt((imageList[i].width - width)*(imageList[i].width - width) + (imageList[i].height - height)*(imageList[i].height - height));
			if(distance < standard){
				standard = distance;
				picUrl = goUrl+"/poster_root/"+imgUrl;
			}
		}

	}
	return picUrl;
}
var getPoster=gPoster;
function getImgSize(imgJson){
	if(imgJson.width==0&&imgJson.width==0){
		var url = imgJson.posterUrl || imgJson.displayUrl;
		var width = url.split("/")[1].split("x")[0];
		var height = url.split("/")[1].split("x")[1];
		imgJson.width = parseInt(width,10);
		imgJson.height = parseInt(height,10);
	}else{

	}
}
/*
 * @description debug函数为页码打印方式，可以替代alert对页面效果的影响。一个htm只能有一个Debug函数。
 * @param {object} _configs 可以为Array或者为json对象。
 */
function debug(_configs) {
	var paramArr = [], debugType = "0", arrLength;
	if( typeof _configs != "object") {
		return;
	}
	arrLength = _configs.length;
	if(arrLength == undefined) {
		var i = 0;
		for(var key in _configs) {
			paramArr[i] = key + "=" + _configs[key];
			i++;
		}
		arrLength = paramArr.length;
		debugType = "1";
	} else {
		arrLength = _configs.length;
	}
	var newDiv = document.createElement("div");
	newDiv.setAttribute("id", "DEBUG");
	newDiv.setAttribute("style", "background:#D6D6D6; width:auto; heigth:auto; position:absolute; left:50px; top:50px;")
	document.body.appendChild(newDiv);
	var obj = document.getElementById("DEBUG");
	for(var i = 0; i < arrLength; i++) {
		var testDiv = document.createElement("div");
		testDiv.setAttribute("id", "MSG_" + i);
		if(i % 2 == 0) {//偶数样式
			testDiv.setAttribute("style", "background:#A9A9A9;");
		}
		if(debugType == "0") {//为数组
			testDiv.innerHTML = "No." + i + " ==== " + _configs[i];
		} else {//为json对象
			var arr = paramArr[i].split("=");
			testDiv.innerHTML = arr[0] + " ==== " + arr[1];
		}
		obj.appendChild(testDiv);
	}
}

function clearMarquee() {//清除文字滚动循环，在失焦时调用
	if(marquee.obj == undefined)
		return;
	if(marquee.handle != undefined)
		clearInterval(marquee.handle);
	marquee.obj.style.position = marquee.oldPosition;
	marquee.obj.style.overflow = marquee.oldOverflow;
}

/**
 * conObj(contentObject):放置文字的组件对象
 * calObj(calculationObjcet):用于计算的组件对象，即文字过长的情况下，在该组件范围内进行滚动，该组件有显式定义的长宽
 * step：滚动步长，默认是文字宽度
 * delay：滚动频率
 * marqueeNum:文字长度上限(以半角字符为计数单位)，当文字长度超过这个范围，将进行滚动操作
 * content:文字内容，当conObj组件中存在该内容，该参数可以省略
 */
function marquee(conObj, calObj, step, delay, marqueeNum, content) {//文字过长时候的滚动操作
	if(marquee.handle != undefined)
		clearInterval(marquee.handle);
	var temp = (content != undefined && typeof content == "string") ? content : conObj.innerHTML;
	if(marqueeNum == undefined || getCharLength(temp) < marqueeNum) {
		conObj.innerHTML = temp;
		return;
	}
	var x = 0;
	marquee.obj = calObj;
	marquee.oldPosition = calObj.style.position;
	calObj.style.position = "relative";
	marquee.oldOverflow = calObj.style.overflow;
	calObj.style.overflow = "hidden";

	var w = calObj.offsetWidth;
	var h = calObj.offsetHeight;
	step = step ? step : parseInt(getCurrentStyle(calObj, "fontSize").replace("px", ""));
	var fragment = document.createDocumentFragment();
	for(var i = 0, ilen = w; i < ilen; i += step) {
		var rSpan = document.createElement("span");
		rSpan.style.display = "inline-block";
		rSpan.style.width = step + "px";
		fragment.appendChild(rSpan);
	}

	var lSpan = document.createElement("span");
	lSpan.style.display = "inline-block";
	lSpan.innerHTML = temp;

	var mainSpan = document.createElement("div");
	mainSpan.style.position = "absolute";
	mainSpan.style.height = h + "px";
	mainSpan.appendChild(lSpan);
	mainSpan.appendChild(fragment);
	mainSpan.style.left = "0px";

	conObj.innerHTML = "";
	conObj.appendChild(mainSpan);
	var finalW = mainSpan.offsetWidth;
	var oldW = finalW;
	marquee.handle = setInterval(function() {
		x -= step;
		mainSpan.style.left = x + "px";
		var newW = mainSpan.offsetWidth;
		if(newW <= oldW) {
			conObj.innerHTML = "<marquee scrollLeft='1' behavior='scroll' direction='left' scrollamount='" + step + "' scrolldelay='" + delay + "'>" + temp + "</marquee>";
			clearInterval(marquee.handle);
		} else {
			oldW += step;
		}
	}, delay);
}

//随机截取影片中的10分钟进行播放
function getRandomPlayTime(totalTime) {
	var preplayTime = Math.floor(totalTime * 0.1);
	var vNum = Math.random();
	var startTime = Math.floor(vNum * (totalTime - preplayTime));
	var endTime = startTime + preplayTime;
	return [startTime, Math.min(endTime, totalTime), preplayTime];
}


function getCharLength(str) {
	var temp1 = str.replace(/[^\x00-\xff]/g, "**");
	return temp1.split("\*").length - 1;
}

/**
 * @description 焦点滑动实现函数
 * @param {String}
 *            _divId 滑动的焦点层ID
 * @param {Number}
 *            _preTop 滑动前的top值
 * @param {Number}
 *            _top 滑动后的top值
 * @param {String}
 *            _moveDir 滑动方向，V纵向，H横向
 * @param {Number}
 * 			  _percent 滑动系数  默认0.7
 * @return null
 */
function slide(_divId, _preTop, _top, _moveDir, _percent) {
	if( typeof (_divId) != 'undefined' && typeof (_preTop) != 'undefined' && typeof (_top) != 'undefined' && typeof (_moveDir) != 'undefined') {
		this.focusId = _divId;
		this.preTop = _preTop;
		this.focusTop = _top;
		this.moveDir = _moveDir;
	}
	var moveStep = (this.focusTop - this.preTop) * _percent;
	if(Math.abs(moveStep) > 3) {
		this.preTop += moveStep;
		if(this.moveDir == "V") {
			$(this.focusId).style.top = this.preTop + "px";
		} else {
			$(this.focusId).style.left = this.preTop + "px";
		}
		clearTimeout(this.slideTimer);
		this.slideTimer = setTimeout(slide, 1);
	} else {
		if(moveDir == "V") {
			$(this.focusId).style.top = this.focusTop + "px";
		} else {
			$(this.focusId).style.left = this.focusTop + "px";
		}
	}
}

/**
 * @description 获取推荐值
 * @param {String}
 *            _divId 滑动的焦点层ID
 * @return null
 */
function getLevel(levelJson){
    if (levelJson == "") {
        levelJson = 0;
    }
    else
        if (levelJson > 5) {
            levelJson = 5;
        }
    return levelJson;
}

function get_time()
{
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var week = "";
    var hour = date.getHours();
    var minute = date.getMinutes();
    if (minute < 10)
        minute = "0" + minute;
    switch (date.getDay())
    {
        case 0:
            week = "星期天";
            break;
        case 1:
            week = "星期一";
            break;
        case 2:
            week = "星期二";
            break;
        case 3:
            week = "星期三";
            break;
        case 4:
            week = "星期四";
            break;
        case 5:
            week = "星期五";
            break;
        case 6:
            week = "星期六";
            break;
    }
    var day_ = year + "年 " + month + "月" + day + "日   " + week;
    var time_ = hour + ":" + minute;
    document.getElementById("day").innerHTML = day_;
    document.getElementById("now_time").innerHTML = time_;
}

function showDay()//显示时间
{
    if (document.getElementById("day"))
    {
        get_time();
        setInterval(get_time, 60000);
    }
}

function subStringValue(value, maxLength)
{
    if (value.length > maxLength)
    {
        value = value.substring(0, maxLength) + "...";
    }
    return value;
}

//产地JSON
var areaJson = [
    {
        value: '不分地区'
    },
    {
        value: '内地'
    },
    {
        value: '欧美'
    },
    {
        value: '日韩'
    },
    {
        value: '港台'
    }];

function setArea(json, areaIdPreFix, globalVarId, className)//json:地区Json,  areaIdPreFix:名称前缀,排列从0开始,如 cateId_0,globalVarId全局变量ID
{
    var areaFocusValue = getGlobalVar(globalVarId) == "" ? json[0].value : getGlobalVar(globalVarId);
    for (var i = 0; i < json.length; i++)
    {
        document.getElementById(areaIdPreFix + i).value = json[i].value;
        if (json[i].value == areaFocusValue)//焦点停留状态
        {
            document.getElementById(areaIdPreFix + i).className = className;
        }
    }
}


//设置页码信息和翻页操作,入参 pageJson
/*pageJson={pageId:{prev:'prev',next:'next',pageInfo:'pageInfo'},pageInfo:{pageSize :'9',curPage:'1',countPage:'3'}};
 */
function setPageInfo(pageJson)
{
    var pageIdJson = pageJson.pageId;
    var pageInfoJson = pageJson.pageInfo;
    var curPage = pageInfoJson.curPage == "0" ? 1 : parseInt(pageInfoJson.curPage);
    var countPage = parseInt(pageInfoJson.countPage);
    if (countPage == 0)
    {
        curPage = 0;
    }
    document.getElementById(pageIdJson.pageInfo).innerHTML = "第 " + curPage + "/" + countPage + " 页";

    if (countPage == 1)
    {
        document.getElementById(pageIdJson.prev).onclick = function()
        {
        };
        document.getElementById(pageIdJson.next).onclick = function()
        {
        };
        return;
    }
    document.getElementById(pageIdJson.prev).onclick = function()
    {
        if (curPage == 1)
        {
            turnPage(countPage);
        }
        else
        {
            turnPage(curPage - 1);
        }
    }
    document.getElementById(pageIdJson.next).onclick = function()
    {
        if (curPage == countPage)
        {
            turnPage(1);
        }
        else
        {
            turnPage(curPage + 1);
        }
    }
}

//显示影片名称
function showPmName(handler, name, maxlen, isMarquee)
{
    if(name){
    if (name.length > maxlen)
    {
        if (isMarquee)
        {
            handler.innerHTML = "<marquee scrollAmount=2  behavior='alternate' width='90%'>" + name + "</marquee>";
        }
        else
        {
            handler.innerHTML = name.substring(0, maxlen) + "...";
        }
    }
    else
    {
        handler.innerHTML = name;
    }
    }
}



//重新设置URL的地区参数
function resetAreaUrl(url, areaValue)
{
    if (areaValue == areaJson[0] || areaValue == "不分地区")
    {
        areaValue = "";
    }
    areaValue = encodeURI(areaValue);
    if (url.indexOf('origine') > 0)
    {
        url = url.replaceQueryStr(areaValue, "origine");
    }
    else
    {
        url = url + "&origine=" + areaValue;
    }
    return url;
}



//重新设置URL的栏目ID参数
function resetCateIdUrl(url, cateId)
{
    if (url.indexOf("cateId") > 0)
    {
        url = url.replaceQueryStr(cateId, "cateId");
    }
    else
    {
        url = url + "&cateId=" + cateId;
    }
    return url;
}

//通过名称设置样式,此方法用在有相同名称的标签
function setClassByName(name, className)
{
    var tags = document.getElementsByName(name);
    for (var i = 0; i < tags.length; i++)
    {
        changeObjClass(tags[i], className);
    }
}

function goToDetail(dataJson)
{
    if(dataJson)
    {
        saveUrlPath();

        if(dataJson.isPackage=="1"){
        	if(dataJson.folderAssetId=="MANU0000000000050478"){
                window.location.href =goUrl2+ "/iPG/T-nsp/zyxq/detail_zyxq.htm?userId=" + getUserId() + "&titleAssetId=" + dataJson.assetId+"&checkBookmark=Y&folderAssetId="+dataJson.folderAssetId+"&serviceId="+dataJson.serviceId+"&providerId="+dataJson.providerId+"&folderColumnId="+getGlobalVar('folderColumnId');
			}else{
                window.location.href =goUrl2+ "/iPG/T-nsp/dsjc/detail_dsjc.htm?userId=" + getUserId() + "&titleAssetId=" + dataJson.assetId+"&checkBookmark=Y&folderAssetId="+dataJson.folderAssetId+"&serviceId="+dataJson.serviceId+"&providerId="+dataJson.providerId+"&folderColumnId="+getGlobalVar('folderColumnId');
			}

        }else{
			window.location.href = goUrl2+ "/iPG/T-nsp/jtyy/detail_jtyy.htm?userId=" + getUserId() + "&titleAssetId=" + dataJson.assetId+"&checkBookmark=Y&folderAssetId="+dataJson.folderAssetId+"&serviceId="+dataJson.serviceId+"&providerId="+dataJson.providerId+"&folderColumnId="+getGlobalVar('folderColumnId');
        }
    }
}

function doNumberPress(event, keyValue)//默认数字键操作,keyValue 0 - 9  ,可在当前页面重写默认执行函数
{
    //   	alert(keyValue);
    var obj = document.getElementById("play_list_" + keyValue);
    if (obj)
    {
        obj.focus();
        obj.onclick();
    }
}

function showInfo(msg)
{
    if (!tipFlag)// 如果当前已经没有弹出窗口,则需要保存当前焦点对象和面页按键的有效状态
    {
        lastObj = document.activeElement;
        disabledAll();
    }
    var obj = document.getElementById("tipWindow");
    if (msg == "")
    {
        var url = epgUrl + "yytc/a_busyInfo.htm";
        ajaxUrl(url, function(x)
        {
            obj.innerHTML = x.responseText;
            obj.style.display = "block";

            if (document.getElementById("OKButton")) //弹出窗口确定按钮Id必须为 OKButton ,OKButton为弹出窗口专用ID
            {
                document.getElementById("OKButton").focus();
            }
            tipFlag = true;
        });
    }
    else
    {
        obj.innerHTML = msg;
        obj.style.display = "block";

        if (document.getElementById("OKButton")) //弹出窗口确定按钮Id必须为 OKButton ,OKButton为弹出窗口专用ID
        {
            document.getElementById("OKButton").focus();
        }

        var pr = document.getElementById("payRes").innerHTML;
        if(pr != "" && pr != null){
            document.getElementById("aMout1").innerHTML = pr;
        }

        var am = document.getElementById("aMout").innerHTML
        if(am != "" && am != null){
            document.getElementById("amounts").innerHTML = am+"元";
        }


        var a = document.getElementById("aMout1").innerHTML;

        document.getElementById("buyisok").innerHTML = (am-a)+"元";
        tipFlag = true;
    }


}
function dzxyTip(){
    if (!tipFlag)// 如果当前已经没有弹出窗口,则需要保存当前焦点对象和面页按键的有效状态
    {
        lastObj = document.activeElement;
        disabledAll();
    }
    var obj = document.getElementById(messInfoId);
    var url = "/iPG/T-nsp/tip/a_dzxyTip.htm";
    showMsg(url, function(x)
    {
        obj.innerHTML = x.responseText;
        obj.style.display = "block";

        if (document.getElementById("OKButton")) //弹出窗口确定按钮Id必须为 OKButton ,OKButton为弹出窗口专用ID
        {
            document.getElementById("OKButton").focus();
        }
        tipFlag = true;
    });
}
function buyWayTip(){
    if (!tipFlag)// 如果当前已经没有弹出窗口,则需要保存当前焦点对象和面页按键的有效状态
    {
        lastObj = document.activeElement;
        disabledAll();
    }
    var obj = document.getElementById(messInfoId);
    var url = "/iPG/T-nsp/tip/a_buyWayTip.htm";
    showMsg(url, function(x)
    {
        obj.innerHTML = x.responseText;
        obj.style.display = "block";
        if (document.getElementById("OKButton")) //弹出窗口确定按钮Id必须为 OKButton ,OKButton为弹出窗口专用ID
        {
            document.getElementById("OKButton").focus();
        }
        tipFlag = true;
    });
}


function goToPlayHistory()
{

   	setGlobalVar("columnId",columnId);saveUrlPath();saveTopUrlPath();
   	window.location.href = goUrl2 + "/iPG/T-nsp/myzone/PlayHistory.htm";
}

function goToBookMark()
{
    // setGlobalVar("columnId",columnId);saveUrlPath();saveTopUrlPath();
    // window.location.href = goUrl + "/iPG/T-nsp/myzone/BookMark.htm";
}

function goToFavorite()
{
    setGlobalVar("columnId",columnId);saveUrlPath();saveTopUrlPath();
    window.location.href = goUrl + "/iPG/T-nsp/myzone/Favorite.htm";
}

function goTobuyHistory()
{
    // setGlobalVar("columnId",columnId);saveUrlPath();saveTopUrlPath();
    // window.location.href = goUrl + "/iPG/T-nsp/myzone/buyHistory.htm";
}

function goToTop() {
    // setGlobalVar("columnId",columnId);saveUrlPath();saveTopUrlPath();
    // window.location.href = goUrl + "/iPG/T-nsp/top/top_index.htm";
}

function doPageDownPress(event, keyValue) //默认下一页按键,可在当前页面重写默认执行函数
{
    var obj = document.getElementById("next");
    if (obj)
    {
        obj.focus();
        obj.onclick();
    }
}

function doPageUpPress(event, keyValue) //默认上一页按键,可在当前页面重写默认执行函数
{
    var obj = document.getElementById("prev");
    if (obj)
    {
        obj.focus();
        obj.onclick();
    }
}

function tryPlay() {
    Buy.tryFlag = "1";
    IEPG.doPlay();
}


function get_time()
{
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var week = "";
    var hour = date.getHours();
    var minute = date.getMinutes();
    if (minute < 10)
        minute = "0" + minute;
    switch (date.getDay())
    {
        case 0:
            week = "星期天";
            break;
        case 1:
            week = "星期一";
            break;
        case 2:
            week = "星期二";
            break;
        case 3:
            week = "星期三";
            break;
        case 4:
            week = "星期四";
            break;
        case 5:
            week = "星期五";
            break;
        case 6:
            week = "星期六";
            break;
    }
    var day_ = year + "年 " + month + "月" + day + "日   " + week;
    var time_ = hour + ":" + minute;
    document.getElementById("day").innerHTML = day_;
    document.getElementById("now_time").innerHTML = time_;
}

function showDay()//显示时间
{
    if (document.getElementById("day"))
    {
        get_time();
        setInterval(get_time, 60000);
    }
}

function subStringValue(value, maxLength)
{
    if (value.length > maxLength)
    {
        value = value.substring(0, maxLength) + "...";
    }
    return value;
}

//产地JSON
var areaJson = [
    {
        value: '不分地区'
    },
    {
        value: '内地'
    },
    {
        value: '欧美'
    },
    {
        value: '日韩'
    },
    {
        value: '港台'
    }];

function setArea(json, areaIdPreFix, globalVarId, className)//json:地区Json,  areaIdPreFix:名称前缀,排列从0开始,如 cateId_0,globalVarId全局变量ID
{
    var areaFocusValue = getGlobalVar(globalVarId) == "" ? json[0].value : getGlobalVar(globalVarId);
    for (var i = 0; i < json.length; i++)
    {
        document.getElementById(areaIdPreFix + i).value = json[i].value;
        if (json[i].value == areaFocusValue)//焦点停留状态
        {
            document.getElementById(areaIdPreFix + i).className = className;
        }
    }
}


//设置页码信息和翻页操作,入参 pageJson
/*pageJson={pageId:{prev:'prev',next:'next',pageInfo:'pageInfo'},pageInfo:{pageSize :'9',curPage:'1',countPage:'3'}};
 */
function setPageInfo(pageJson)
{
    var pageIdJson = pageJson.pageId;
    var pageInfoJson = pageJson.pageInfo;
    var curPage = pageInfoJson.curPage == "0" ? 1 : parseInt(pageInfoJson.curPage);
    var countPage = parseInt(pageInfoJson.countPage);
    if (countPage == 0)
    {
        curPage = 0;
    }
    document.getElementById(pageIdJson.pageInfo).innerHTML = "第 " + curPage + "/" + countPage + " 页";

    if (countPage == 1)
    {
        document.getElementById(pageIdJson.prev).onclick = function()
        {
        };
        document.getElementById(pageIdJson.next).onclick = function()
        {
        };
        return;
    }
    document.getElementById(pageIdJson.prev).onclick = function()
    {
        if (curPage == 1)
        {
            turnPage(countPage);
        }
        else
        {
            turnPage(curPage - 1);
        }
    }
    document.getElementById(pageIdJson.next).onclick = function()
    {
        if (curPage == countPage)
        {
            turnPage(1);
        }
        else
        {
            turnPage(curPage + 1);
        }
    }
}

//显示影片名称
function showPmName(handler, name, maxlen, isMarquee)
{
    if(name){
        if (name.length > maxlen)
        {
            if (isMarquee)
            {
                handler.innerHTML = "<marquee scrollAmount=2  behavior='alternate' width='90%'>" + name + "</marquee>";
            }
            else
            {
                handler.innerHTML = name.substring(0, maxlen) + "...";
            }
        }
        else
        {
            handler.innerHTML = name;
        }
    }
}



//重新设置URL的地区参数
function resetAreaUrl(url, areaValue)
{
    if (areaValue == areaJson[0] || areaValue == "不分地区")
    {
        areaValue = "";
    }
    areaValue = encodeURI(areaValue);
    if (url.indexOf('origine') > 0)
    {
        url = url.replaceQueryStr(areaValue, "origine");
    }
    else
    {
        url = url + "&origine=" + areaValue;
    }
    return url;
}



//重新设置URL的栏目ID参数
function resetCateIdUrl(url, cateId)
{
    if (url.indexOf("cateId") > 0)
    {
        url = url.replaceQueryStr(cateId, "cateId");
    }
    else
    {
        url = url + "&cateId=" + cateId;
    }
    return url;
}

//通过名称设置样式,此方法用在有相同名称的标签
function setClassByName(name, className)
{
    var tags = document.getElementsByName(name);
    for (var i = 0; i < tags.length; i++)
    {
        changeObjClass(tags[i], className);
    }
}


function doNumberPress(event, keyValue)//默认数字键操作,keyValue 0 - 9  ,可在当前页面重写默认执行函数
{
    //   	alert(keyValue);
    var obj = document.getElementById("play_list_" + keyValue);
    if (obj)
    {
        obj.focus();
        obj.onclick();
    }
}

function showInfo(msg)
{
    if (!tipFlag)// 如果当前已经没有弹出窗口,则需要保存当前焦点对象和面页按键的有效状态
    {
        lastObj = document.activeElement;
        disabledAll();
    }
    var obj = document.getElementById("tipWindow");
    if (msg == "")
    {
        var url = epgUrl + "yytc/a_busyInfo.htm";
        ajaxUrl(url, function(x)
        {
            obj.innerHTML = x.responseText;
            obj.style.display = "block";

            if (document.getElementById("OKButton")) //弹出窗口确定按钮Id必须为 OKButton ,OKButton为弹出窗口专用ID
            {
                document.getElementById("OKButton").focus();
            }
            tipFlag = true;
        });
    }
    else
    {
        obj.innerHTML = msg;
        obj.style.display = "block";

        if (document.getElementById("OKButton")) //弹出窗口确定按钮Id必须为 OKButton ,OKButton为弹出窗口专用ID
        {
            document.getElementById("OKButton").focus();
        }

        var pr = document.getElementById("payRes").innerHTML;
        if(pr != "" && pr != null){
            document.getElementById("aMout1").innerHTML = pr;
        }

        var am = document.getElementById("aMout").innerHTML
        if(am != "" && am != null){
            document.getElementById("amounts").innerHTML = am+"元";
        }


        var a = document.getElementById("aMout1").innerHTML;

        document.getElementById("buyisok").innerHTML = (am-a)+"元";
        tipFlag = true;
    }


}
function dzxyTip(){
    if (!tipFlag)// 如果当前已经没有弹出窗口,则需要保存当前焦点对象和面页按键的有效状态
    {
        lastObj = document.activeElement;
        disabledAll();
    }
    var obj = document.getElementById(messInfoId);
    var url = "/iPG/T-nsp/tip/a_dzxyTip.htm";
    showMsg(url, function(x)
    {
        obj.innerHTML = x.responseText;
        obj.style.display = "block";

        if (document.getElementById("OKButton")) //弹出窗口确定按钮Id必须为 OKButton ,OKButton为弹出窗口专用ID
        {
            document.getElementById("OKButton").focus();
        }
        tipFlag = true;
    });
}
function buyWayTip(){
    if (!tipFlag)// 如果当前已经没有弹出窗口,则需要保存当前焦点对象和面页按键的有效状态
    {
        lastObj = document.activeElement;
        disabledAll();
    }
    var obj = document.getElementById(messInfoId);
    var url = "/iPG/T-nsp/tip/a_buyWayTip.htm";
    showMsg(url, function(x)
    {
        obj.innerHTML = x.responseText;
        obj.style.display = "block";
        if (document.getElementById("OKButton")) //弹出窗口确定按钮Id必须为 OKButton ,OKButton为弹出窗口专用ID
        {
            document.getElementById("OKButton").focus();
        }
        tipFlag = true;
    });
}
function addClassCheckNext(nId,className,callback){
    if(checkExistById(nId)){
        addClass(document.getElementById(nId),className);
    }else{
        return false;
    }
    if(typeof(callback) == "function"){
        callback();
    }
}
function checkExistById(eleId){
    if(eleId != null && eleId != "" && Object.prototype.toString.call(eleId) === "[object String]"){
        var eleObj = document.getElementById(eleId);
        if(eleObj != null){
            return true;
        }
    }
    return false;
}
function hasClass(obj, className) {
    return obj.className.indexOf(className) > -1 ? true : false;
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

