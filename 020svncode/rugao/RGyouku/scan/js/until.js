//var MAPIP = "172.21.12.17";
var MAPIP = "172.30.1.30";
var MAPPort = "554";
//var portalIP = "172.21.12.3";
var portalIP = "172.30.1.20";
var portalPort = "8080";

/** @description npvrServiceUrl npvr服务器IP，port*/
//var npvrServiceUrl = "h:ttp://172.21.11.86/iPG/T-nsp/";
/** @description videoUrl index页面中的直播流 */
//var videoUrl = "delivery://490000.6875.64QAM.1901.515.515";
/* @description 全局对象**/
var V, IEPG = V = IEPG || {};

/** @description epgUrl 业务模板存放路径，到1HD_blue的下层*/
var epgUrl = location.href.split("/RGyouku")[0];
var goUrl = location.href.split("/RGyouku")[0];  // such as:http://172.21.12.12:8080
var tipUrl = goUrl+"/RGyouku/";    // 弹框前缀路径
var epgVodUrl="../";

/* @description 影片无图片时默认图片    **/
var defaultPic = "/RGyouku/win8/images/show_pic.jpg";
var bigDefaultPic = "/RGyouku/win8/images/show_pic.jpg";
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
var cardId =getSmartCardId();

/** userId 为用户ID */
var userId = getUserId();
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

	"HOME":468,
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
    "RETURN_RG" : 340,

	"RED_T" : 82, //E600浏览器调试
	"YELLOW_T" : 89, //E600浏览器调试
	"BLUE_T" : 66, //E600浏览器调试
	"GREEN_T" : 71, //E600浏览器调试
	"STATIC" : 67,
	"VOICEUP" : 61,
	"VOICEDOWN" : 45,
    "LEFT_RG" : 3,
    "RIGHT_RG" : 4,
    "UP_RG" : 1,
    "DOWN_RG" : 2
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
    return "8120010225603379";
    var userId;
    try
    {
        userId = iPanel.getGlobalVar("userId");
        if(!userId) {
        	userId = 0;
        }
        if(userId==''){
            userId = 0;
		}

    }
    catch (e)
    {
        userId = 0;
    }
    return userId; //正式运行使用

}
function getSmartCardId(){
    return "8120010225603379";
    try {
    	if(CA.card.cardId==""){
    		return '0';
		}else{
            return CA.card.cardId;
		}
    } catch (e) {
        return '0';
    }
}//获取智能卡号

//检查智能卡插入、拔出消息
document.onsystemevent = function(e) {
	var code = e.which || e.keyCode;
	var keyType = e.type ? e.type : 1001;
	if(keyType == 1001) {
		switch(code) {
			case 40070://中山，卡插入
			case 11703://南海，卡插入
				break;
			case 40071://中山，卡被拔出
			case 11704://南海，卡被拔出
				showMsg(tipUrl + "iPG/T-nsp/tip/a_collect.htm", "认证失败，请检查机顶盒和智能卡！");
				break;
			case 10902:
			case 40201://播放的流文件到头
				break;
			case 10901:
			case 40200://播放的流文件到尾
				playNextNews();//播放下一个新闻
				break;
			default:
				break;
		}
	}
};


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
        document.cookie = escape(_sName) + "=" + escape(_sValue);
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

        var aCookie = document.cookie.split("; ");

        for(var i = 0; i < aCookie.length; i++) {

            var aCrumb = aCookie[i].split("=");

            if(escape(_sName) == aCrumb[0]) {
                result = unescape(aCrumb[1]);
                break;
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
		tul = getGlobalVar("PORTAL_ADDR");
	}
	var newUrl = tuArr.join(urlSplitChar);//移除最后一个url路径后，将所剩下的url再次用#分隔符拼接成一个新串保存到全局变量中
	setGlobalVar(urlPathGlobalName, newUrl);
	//允许全局数字键
    Utility.ioctlWrite("SEND_BROADCAST", "Broadcast:com.coship.logicnum.allow, Param:--ez&allow&true");
	
	console.log("========================lzbTest goback=======================");
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
		errorTextMsg = "系统繁忙，请稍候重试。";
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
			showMsg(tipUrl + "iPG/T-nsp/tip/a_collect.htm", errorMessage);
			break;
	}
}
function gotoPage() {

}
var nowTip="";
var tipFlag = false;
/** @description goToPortal 对业务的整体键值进行监听*/
//document.onkeyPress = globalEvent;
document.onkeydown = grabEvent;
var keycode;
function grabEvent(_e) {
	keycode = _e.keyCode || _e.which;
	if(tipFlag) {
		switch(keycode) {
            case KEY.HOME://主页
                goToPortal();
                break;
            case KEY.BACK:
            case KEY.RETURN:
            case KEY.RETURN_N:
            case KEY.RETURN_RG:
                doReturnKey();
                _e.preventDefault();
				break;
			case KEY.ENTER:
                _e.preventDefault();
                gotoPage();
                break;
		}
	} else if(mediaTipFlag) {//弹出集数选择框
		switch(keycode) {
			case KEY.ENTER:
			case KEY.ENTER_N:
				break;
			case KEY.BACK:
			case KEY.RETURN:
			case KEY.QUIT:
            case KEY.RETURN_RG:
				_e.preventDefault();
				closeTip();
				break;
			case KEY.LEFT:
			case KEY.LEFT_N:
            case KEY.LEFT_RG:
				_e.preventDefault();
				
				break;
			case KEY.RIGHT:
			case KEY.RIGHT_N:
            case KEY.RIGHT_RG:
				_e.preventDefault();
				
				break;
			case KEY.NEXT:
			case KEY.NEXT_N:
				
				break;
			case KEY.PREV:
			case KEY.PREV_N:
				
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
				doNumberKey(keycode,KEY.ZERO);
				break;
        	case KEY.HOME://主页
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
				turnNextPage();
				break;
			case KEY.PREV:
			case KEY.PREV_N:
				turnPrevPage();
				break;
			case KEY.ENTER:
			case KEY.ENTER_N:
				doConfirm();
				break;
			case KEY.PLAY:
			case KEY.PLAY1:
			case KEY.PLAY_N:
				doPlayKey();
				break;
			case KEY.BACK:
			case KEY.RETURN:
			case KEY.RETURN_N:
			case KEY.RETURN_RG:
				doReturnKey();
				_e.preventDefault();
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
				_e.preventDefault();
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

function moveLeft() {

}
function moveRight() {

}
function moveUp() {

}
function moveDown() {
	
}
function doConfirm(){

}

function closeTip() {

}
function gotoPlay(){
    var json = {
        "tryFlag" : 1,
        "providerId" : providerId,
        "resourceId" : assetId
    };
    Buy = new IEPG.BUY(json);
    IEPG.doPlay();
}
function turnNextPage() {
	
}
function turnPrevPage(){

}
function doPlayKey(){

}




/** @description doRedKey 数字键处理函数，页面重写此方法*/
function doNumberKey(){

 }

function doReturnKey() {
	setGlobalVar("isBack", "Y");//页面返回标示，Y如果是从其他页面返回到当前页则取保存的机顶盒变量
	clearGlobalVar();
	goReturnUrlPath();
}

/** @description doRedKey 红色键处理函数*/
function doRedKey() {//我的空间

}

function goToMyZone() {

}

/** @description doGreenKey 绿色键处理函数*/
function doGreenKey(){

}

/** @description doYellowKey 黄色键处理函数*/
function doYellowKey(){

}

/** @description doBlueKey 蓝色键处理函数*/
function doBlueKey() {//点播排行

}

function goToTop() {

}


function doPositionKey() {//搜索

}

function doPortalKey(){//按主页键清除全局变量，返回至portal页
    Utility.ioctlWrite("SEND_BROADCAST", "Broadcast:com.coship.logicnum.allow, Param:--ez&allow&true");
	goToPortal();
}

/** @description goToPortal 返回portal处理函数*/
function goToPortal() {//清除路径
	clearUrlPath();clearUrlTopPath();
	location.href = getGlobalVar("PORTAL_ADDR");
}

function clearGlobalVar() {

}









var imgurl = 'http://10.9.211.101:8081/portal/';
// var imgurl = 'http://10.9.216.15:8080/';
//******************************* 取url中的相关参数  **********************************************
//获取url中param参数的值  例子：var serviceCode = getQueryStr(location.href, "serviceCode");
function getQueryStr(_url, _param) {
	var rs = new RegExp("(^|)" + _param + "=([^\&]*)(\&|$)", "g").exec(_url), tmp;
	if( tmp = rs) {
		return tmp[2];
	}
	return "";
}
function getData(_APIUrl, _configs){

    var xmlHead = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>";
    var _data = xmlHead + _configs.data;

    var reqUrl = imgurl +_APIUrl + "?dataType=json";
    new ajaxUrl(reqUrl, _configs.callBack, _data);
};
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
        this.xmlHttp.open("POST", _url, true);
        this.xmlHttp.setRequestHeader("Content-type", "content-type:text/plain");
        this.xmlHttp.send(_data);
        this.xmlHttp.onreadystatechange = function() {
            if(xmlHttp.readyState == 4) {
                    if(xmlHttp.status == 200) {
                    callBackData(xmlHttp, _handler);
                } else {//超时间方法,传入空会自动弹出服务器忙的提示
                    //showMsg("", "系统忙,请稍候重试。");
                }
            }
        };
    };
    this.getData();
}
function callBackData(_xmlHttp, _handler){
    var resText = _xmlHttp.responseText;
    resText = eval("(" + resText + ")");
    _handler(resText);
}

