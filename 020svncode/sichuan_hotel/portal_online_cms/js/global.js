/**
 * 
 * @fileOverview
 * @description 此文件包含页面地址及相关全局变量的申明，包含的主要函数有
 * $			作用替代document.getElementById
 * trim			去掉字符串的两边空格
 * getUserId	userId的获取
 * setGlobalVar	设置全局变量
 * getGlobalVar	获取设置的全局变量
 * showDateTime	日期，星期，时间
 * ajaxUrl		ajax请求
 * parseJSON	json数据的处理
 * globalEvent	键值的统一处理
 * @author 905112
 * @version 1.0
 */

/** @description npvrServiceUrl npvr服务器IP，port*/
var npvrServiceUrl = "http://172.20.101.13:8081";
/** @description videoUrl index页面中的直播流 */
var videoUrl = "deliver://443000000:6875:64:302";
/* @description 全局对象    **/
var V, IEPG = V = IEPG || {};
/** @description userId 为用户ID */
var userId = getUserId();
//var userId = "8270102734713951";
/** @description epgUrl 业务模板存放路径，到1HD_blue的下层*/
var epgUrl = location.href.substring(0, parseInt(location.href.lastIndexOf("/")) + 1);
var epgVodUrl = "../../";

var goUrl = location.href.split("/iPG")[0];  // such as:http://172.21.12.12:8080
var goToUrl = goUrl + "/iPG/template/1NHD_blue/";    // 弹框前缀路径

var defaultPic = "/iPG/jphk/images/show_pic.jpg";
var defaultNoPic = "/iPG/jphk/images/pm_pic.jpg";
/** @description json中的有效字符 */
var rvalidchars = /^[\],:{}\s]*$/;
/** @description "@"编译 */
var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
/** @description "]"编译 */
var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
/** @description ""编译 */
var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;

var mediaTipFlag = false;//剧集弹出框标识
var searchTipFlag = false;//搜索弹出框标识
var inputTip = 0;//当第一次输入为0，搜索时值变为"1";否则为"";
/** @description 键值定义 */
var KEY = {
    "key_0": 48,
    "key_1": 49,
    "key_2": 50,
    "key_3": 51,
    "key_4": 52,
    "key_5": 53,
    "key_6": 54,
    "key_7": 55,
    "key_8": 56,
    "key_9": 57,

    "LEFT": 37,
    "RIGHT": 39,
    "UP": 38,
    "DOWN": 40,
    "ENTER": 13,
    "PREV": 33,
    "NEXT": 34,
    "QUIT": 27,
    "RED": 403,
    "GREEN": 404,
    "YELLOW": 405,
    "BLUE": 406,
    "PLAY": 3864,
    "PLAY1": 3862,
    "SEARCH": 3880,
    "HOMEPAGE": 468,

    "UP_N": 87,		//N9101盒子键值
    "DOWN_N": 83,
    "LEFT_N": 65,
    "RIGHT_N": 68,
    "ENTER_N": 10,
    //"PREV_N": 306,
    //"NEXT_N": 307,
    "PREV_N": 120,
    "NEXT_N": 121,
    "QUIT_N": 72,
    "RED_N": 320,
    "GREEN_N": 321,
    "YELLOW_N": 322,
    "BLUE_N": 323,
    "PLAY_N": 39,

    "BACK": 8,
    "RETURN": 640,
    "QUIT_NJ": 114,
    "QUIT_SC": 27,

    "RED_T": 82,		//E600浏览器调试
    "YELLOW_T": 89,	//E600浏览器调试
    "BLUE_T": 66,		//E600浏览器调试
    "GREEN_T": 71,		//E600浏览器调试
    "STATIC": 67,
    "VOICEUP": 447,
    "VOICEDOWN": 448
};

/**
 * @description $ 代替document.getElementById
 * @param {string} _id 为页面DIV的id
 */
function $(_id) { return document.getElementById(_id); }

/**
 * @description trim 去掉字符串前后空格
 * @param {string} _str 需要处理的字符串
 */
function trim(_str) { return _str.replace(/(^\s*)|(\s*$)/g, ""); }

/**
 * @description getUserId 取AAA下发的userId，供页面请求数据用，此参数是请求数据的url必带字段
 */
function getUserId() {
    var userId;
    try {
        if (Utility.getSystemInfo) {		//深圳天威
            userId = Utility.getSystemInfo("UID");
        }
    } catch (e) {
        userId = 0;
    }
    return userId;  //正式运行使用
    //return "42825795737";//测试时使用ID
}
//*********** 逻辑操作时，检查CA和uerId  **************

function checkUser() {
    var userId = getUserId();
    if (userId == "" || userId == "0" || userId == undefined) {
        showMsg(epgUrl + "tip/a_errorTip.htm", "认证失败，请检查机顶盒和智能卡！");
        return false;
    }
    return true;
}

//检查智能卡插入、拔出消息
document.onsystemevent = function (e) {
    var code = e.which || e.keyCode;
    var keyType = e.type ? e.type : 1001;
    if (keyType == 1001) {
        switch (code) {
            case 40070: //中山，卡插入
            case 11703://南海，卡插入
                break;
            case 40071: //中山，卡被拔出
            case 11704://南海，卡被拔出
                showMsg(epgUrl + "tip/a_errorTip.htm", "认证失败，请检查机顶盒和智能卡！");
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
    var isSet = false;
    try {
        _sValue = _sValue + "";
        if (Utility.setEnv) {
            isSet = true;
            Utility.setEnv(_sName, _sValue);
        } else{
            isSet = true;
            SysSetting.setEnv(_sName, "" + encodeURIComponent(_sValue));//9101
        }
        if(!isSet){
            var storage = window.localStorage;
            storage.setItem(_sName,_sValue);
        }
    } catch (e) {
        document.cookie = escape(_sName) + "=" + escape(_sValue);
        if(!isSet){
            var storage = window.localStorage;
            storage.setItem(_sName,_sValue);
        }
    }
    /*
    try{
        var storage = window.localStorage;
        storage.setItem(_sName,_sValue);
    }catch(e){
        
    }
    */
}

/**
 * @description 读cookie，获取全局参数
 * @param {string} _sName 全局参数名称（对应setGlobalVar方法中的_sName）
 * @return {string} result 返回值（对应setGlobalVar方法中的_sValue）
 */

function getGlobalVar(_sName) {
    var isGet = false;
    var result = "";
    try {
        if (Utility.getEnv) {
            isGet = true;
            result = Utility.getEnv(_sName);
        } else{
            isGet = true;
            result = decodeURIComponent(SysSetting.getEnv(_sName));//9101
        }
        if(!isGet){
            var storage = window.localStorage;
            result = storage.getItem(_sName);
        }
        if (result == "undefined") {
            result = "";
        }
    } catch (e) {
        var aCookie = document.cookie.split("; ");
        for (var i = 0; i < aCookie.length; i++) {
            var aCrumb = aCookie[i].split("=");
            if (escape(_sName) == aCrumb[0]) {
                result = unescape(aCrumb[1]);
                break;
            }
        }
        if(!isGet){
            var storage = window.localStorage;
            result = storage.getItem(_sName);
        }
    }
    /*
    try{
        var storage = window.localStorage;
        result = storage.getItem(_sName);
    }catch(e){
        
    }
    */
    return result;
}

/**
 * @description showDateTime 用于页面中时间，日期的显示
 * @param {string} _objId 可以是2D页面中的时间对象，也可以是div中的id
 */

function showDateTime(_objId) {
    if (typeof (_objId) == "string") {
        $(_objId).innerHTML = setDateTime();
    } else {
        _objId.string = setDateTime();
        canvas.refresh();
    }
    window.setInterval(function () {
        showDateTime(_objId);
    }, 60000);
}

function setDateTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var week = "";
    var hour = date.getHours();
    var minute = date.getMinutes();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    switch (date.getDay()) {
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
    var date_time = year + "-" + month + "-" + day + "  " + week + " " + hour + ":" + minute;
    return date_time;
}

/**
 * @description GetXmlHttpObject ajax请求时状态判断
 * @param {function} _handler 回调函数
 */

var xmlHttp;
function GetXmlHttpObject(_handler) {
    var objXmlHttp = null;
    if (window.XMLHttpRequest) {
        objXmlHttp = new XMLHttpRequest();
    } else {
        if (window.ActiveXObject) {
            objXmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    objXmlHttp.onreadystatechange = function () {
        if (objXmlHttp.readyState == 4) {
            if (objXmlHttp.status == 200) {
                callBackData(xmlHttp, _handler);
            } else {
                //超时间方法,传入空会自动弹出服务器忙的提示
                showMsg("", "系统忙,请稍候重试。");
            }
        }
    };
    return objXmlHttp;
}

/**
 * @description ajaxUrl ajax请求函数，与服务器进行数据交互
 * @param {string} _callbackfun 回调函数
 */

function ajaxUrl(_url, _callbackfun) {
    xmlHttp = GetXmlHttpObject(_callbackfun);
    xmlHttp.open("GET", _url, true);
    xmlHttp.send(null);
}

/**
 * @description 此函数的作用是解析ajax返回的json，将数据变为json对象
 * @param {string} _data ajax返回xmlHttp.responseText
 */

function parseJSON(_data) {
    if (typeof _data !== "string" || !_data) {
        return null;
    }
    //data = trim( data );
    if (window.JSON && window.JSON.parse) {
        return window.JSON.parse(_data);
    } else if (rvalidchars.test(_data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, ""))) {
        return (new Function("return " + _data))();
    } else {
        return eval("(" + _data + ")");
    }
}

/**
 * @description callBackData 对ajax返回的数据进行统一的处理
 * @param {object} xmlHttp 为ajax返回xmlHttp对象
 * @param {function} _handler 当请求的数据成功返回时，为页面的回调函数
 */

function callBackData(_xmlHttp, _handler) {
    //alert(_xmlHttp.responseText);
    var resText = parseJSON(_xmlHttp.responseText);
    if (_xmlHttp.responseText.indexOf("errMessage") >= 0) {	//返回错误数据
        getErrorMsg(resText.errMessage[0]);
    } else {	//返回正常数据时
        _handler(resText);
    }
}

function getErrorMsg(errorMsg) {
    var errorTextMsg = errorMsg.message;
    if (errorTextMsg == "") {
        errorTextMsg = "系统繁忙，请稍候重试。";
    }
    var errorMessage = errorTextMsg + "。 【 " + errorMsg.errorCode + " 】";
    switch (errorMsg.errorCode) {
        case "12011086":   //栏目信息不存在
        case "122000020":  //参数不能为空  
        case "12200061":   //资源不存在或已经下架
        case "10000001":   //系统烦忙,请稍后。
        case "10000002":   //资源暂不可用！ 
        case "12200009":   //用户无效
        case "2001":       //用户信息不存在
        case "-1":         //无message信息
        case "2030":       //AAA返回资源不存在
            showMsg("", errorMessage);
            break;
        default:
            showMsg(epgUrl + "tip/a_errorTip.htm", errorMessage);
            break;
    }
}

function ajax(url, handler) {
    var xmlHttp;
    if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 200 || xmlHttp.status == 0) {
                handler(xmlHttp.responseText);
            } else {
                showMsg("", "系统忙,请稍候重试。");
            }
        }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

/** @description goToPortal 对业务的整体键值进行监听*/
//document.onkeyPress = globalEvent;
document.onkeydown = grabEvent;

var keycode;
var popBuyFlag;
function grabEvent(_e) {
    keycode = _e.keyCode || _e.which;
    document.getElementById('test').innerHTML = "keycode:"+keycode;
    alert("keycode:"+keycode);
    if (tipFlag) {
        //弹出框为搜索弹出框的条件
        if (searchTipFlag) {
            switch (keycode) {
                case KEY.UP:
                case KEY.UP_N:
                    moveUp1();
                    break;
                case KEY.DOWN:
                case KEY.DOWN_N:
                    moveDown1();
                    break;
                case KEY.LEFT:
                case KEY.LEFT_N:
                    moveLeft1();
                    break;
                case KEY.RIGHT:
                case KEY.RIGHT_N:
                    moveRight1();
                    break;
                case KEY.NEXT:
                	turnNextPage();
                case KEY.NEXT_N:
                    turnNextPage1();
                    break;
                case KEY.PREV:
                	turnPrevPage();
                case KEY.PREV_N:
                    turnPrevPage1();
                    break;
                case KEY.PLAY:
                case KEY.PLAY1:
                case KEY.PLAY_N:
                    doPlayKey1();
                    break;
                case KEY.ENTER:
                case KEY.ENTER_N:
                    doConfirm1();
                    break;
                case KEY.BACK:
                case KEY.RETURN:
                    _e.preventDefault();
                    if (($("search_Input").value).length != 0) {
                        if ($('search_result').style.display != "none") {
                            closeTip();
                        }
                        deleteValue();
                    } else {
                        searchKeyWord = "";
                        closeTip();
                    }
                    break;
                case KEY.QUIT:
                    _e.preventDefault();
                    ($("search_Input").value) = '';
                    searchKeyWord = "";
                    closeTip();
                    break;
            }
        } else if (popBuyFlag & resFlag) {
            switch (keycode) {
                case KEY.ONE:
                    _e.preventDefault();
                    Buy.singleFlag = "true";
                    Buy.doBuy(URL.VOD_buy, buy);
                    popBuyFlag = false;
                    resFlag = false;
                    break;
                case KEY.TWO:
                    _e.preventDefault();
                    Buy.singleFlag = "";
                    Buy.doBuy(URL.VOD_buy_pack, buy);
                    popBuyFlag = false;
                    resFlag = false;
                    break;
                case KEY.ENTER:
                case KEY.ENTER_N:
                    _e.preventDefault();
                    closeTip();
                    break;
                case KEY.BACK:
                case KEY.RETURN:
                case KEY.QUIT:
                    _e.preventDefault();
                    closeTip();
                    break;
            }
        } else {
            switch (keycode) {
                case KEY.BACK:
                case KEY.RETURN:
                case KEY.QUIT:
                    _e.preventDefault();
                    if (searchTipFlag) {//搜索弹出框按返回时的处理
                        if (($("search_Input").value).length != 0) {
                            if (keycode == KEY.QUIT) {
                                deleteAll();
                            } else {
                                deleteValue();
                            }
                        } else {
                            closeTip();
                        }
                    } else {//弹出框默认处理
                        closeTip();
                    }
                    break;
            }
        }
    } else if (mediaTipFlag) {//弹出集数选择框
        switch (keycode) {
            case KEY.ENTER:
            case KEY.ENTER_N:
                // $("episode").style.display = "none";//集数弹出框
                doConfirm();
                break;
            case KEY.BACK:
            case KEY.RETURN:
            case KEY.QUIT:
                _e.preventDefault();
                closeTip();
                break;
            case KEY.LEFT:
            case KEY.LEFT_N:
                moveLeft();
                break;
            case KEY.RIGHT:
            case KEY.RIGHT_N:
                moveRight();
                break;
            case KEY.UP:
            case KEY.UP_N:
                moveUp();
                break;
            case KEY.DOWN:
            case KEY.DOWN_N:
                moveDown();
                break;
            case KEY.NEXT:
            case KEY.NEXT_N:
                turnNextMediaPage();
                break;
            case KEY.PREV:
            case KEY.PREV_N:
                turnPrevMediaPage();
                break;
        }
    }
    else {
        switch (keycode) {
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
                _e.preventDefault();
                var num = keycode - 48;
                doNumberPress(_e, num);
                break;
            case KEY.UP:
            case KEY.UP_N:
                moveUp();
                break;
            case KEY.DOWN:
            case KEY.DOWN_N:
                moveDown();
                break;
            case KEY.LEFT:
            case KEY.LEFT_N:
                moveLeft();
                break;
            case KEY.RIGHT:
            case KEY.RIGHT_N:
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
                doGreenKey();
                break;
            //case KEY.QUIT_N:
            case KEY.QUIT:
                _e.preventDefault();
                doPortalKey();
                break;
            case KEY.SEARCH:
                _e.preventDefault();
                doPositionKey();
                break;
            case KEY.STATIC:
                if (videoObj != undefined) {
                    videoObj.resetStatic();
                }
                break;
            case KEY.VOICEUP:
                voiceUp();
                break;
            case KEY.VOICEDOWN:
                // if (videoObj != undefined) {
                //     if (!isDisplayVoice()) {
                //         voice.displayVoice(true);
                //     } else {
                //         doVoice(keycode, _e);
                //     }
                // }
                voiceDown();
                break;
            default:
                break;
        }
    }
}
//----------------------有输入框时默认方法,可在当前页面重写默认执行函数-------
function doInputOkPress(event, keyValue) {
    event.preventDefault();
    document.getElementById("inputOKButton").onclick();
}


function onSearchButton(id) {
    if (inputTip == "1") {
        $("searchValue").value = "";
        inputTip = "";
    }
    var value = "";
    if ($("searchValue").value != "") {
        value = $("searchValue").value + id;
    } else {
        //alert(1);
        value += id;
    }
    $("searchValue").value = value;
}

//---------------------- 按0-9数字键调用方法-------------------------------
function goToRec(recJson) {
    if (recJson.length != 0) {//推荐海报数据长度
        keycode = keycode - 49 >= -1 ? keycode - 49 : -2;
        if (keycode == -1) {
            keycode = 9;
        }
        if (recJson.length - 1 < keycode || keycode < 0) {//页面显示的推荐海报个数
            return;
        } else {
            if (recJson[keycode].columnMapId == undefined) {//我的点播
                location.href = "detail.htm?svstype=" + headerType + "&columnMapId=" + recJson[keycode].assetInfo.columnMapId;
            } else {
                location.href = "detail.htm?svstype=" + headerType + "&columnMapId=" + recJson[keycode].columnMapId;
            }
        }
    }
}

// /** @description doRedKey 数字键处理函数，页面重写此方法*/
// function doNumberKey(){
//
// }

function doReturnKey() {
    try{
        //var smartBox = isSmartBox();
        //if(smartBox){
        //    window.history.go(-1);
        //}else{
            setGlobalVar("isBack", "Y");//页面返回标示，Y如果是从其他页面返回到当前页则取保存的机顶盒变量
            setGlobalVar("tcFlag", "");
            //clearGlobalVar();
            goReturnUrlPath();
        //}
    }catch(e){
        setGlobalVar("isBack", "Y");//页面返回标示，Y如果是从其他页面返回到当前页则取保存的机顶盒变量
        setGlobalVar("tcFlag", "");
        //clearGlobalVar();
        goReturnUrlPath();
    }
}

/** @description doRedKey 红色键处理函数*/
function doRedKey() {//我的空间
    goToMyZone();
}

/** @description doGreenKey 绿色键处理函数*/
function doGreenKey() {
    //goToSearch();
}
// /** @description doYellowKey 黄色键处理函数*/
// function doYellowKey(){
// 	
// }

/** @description doPositionKey 定位键处理函数*/
function doPositionKey() {//搜索
    goToSearch();
}

/** @description doBlueKey 蓝色键处理函数*/
function doBlueKey() {//点播排行
    goToTop();
}

function doPortalKey() {//按主页键清除全局变量，返回至portal页
    //clearGlobalVar();//页面重写此方法
    goToPortal();
}
/** @description goToPortal 返回portal处理函数*/
function goToPortal() {//清除路径
    clearUrlPath();
    location.href = getGlobalVar("PORTAL_ADDR");
}

function goToMyZone() {
    saveUrlPath();
    window.location.href = goToUrl + "myZone.htm";
}

function goToTop() {
    saveUrlPath();
    window.location.href = goToUrl + "top.htm";
}

// /** @description clearGlobalVar 清除页面焦点，页面重载此方法*/
// function clearGlobalVar() {
// 
// }


//----------------------  路径缓存操作 start---------------------------------------------------------
var urlSplitChar = "#";//URL之间的分隔符，可配，但注意确保不会与URL参数重复
var urlPathGlobalName = "urlPathGlobalName";//全局变量名
/*
 * 在有页面跳转动作时调用 ，用来保存当前页面的URL，URL 之间以 urlSplitChar 号分隔，
 * 调用此方法之前页面需要保存其它的变量需要自己操作
 */
function saveUrlPath() {//保存访问路径
    var tempUrl = getGlobalVar(urlPathGlobalName) == undefined ? "" : getGlobalVar(urlPathGlobalName);//取全局变量
    tempUrl = tempUrl + urlSplitChar + location.href;//将已存在的路径和当前URL之间加上分隔符
    var arr = tempUrl.split(urlSplitChar);
    if (arr.length > 6) {
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
    if (!tul || tul == "") {
        tul = getGlobalVar("PORTAL_ADDR");
    }
    var newUrl = tuArr.join(urlSplitChar);//移除最后一个url路径后，将所剩下的url再次用#分隔符拼接成一个新串保存到全局变量中
    setGlobalVar(urlPathGlobalName, newUrl);
    location.href = tul;
}

function clearUrlPath() {//清除保存的所有路径
    setGlobalVar(urlPathGlobalName, "");
    setGlobalVar("menuFocus", "");
    setGlobalVar("areaFocus", "");
    setGlobalVar("listFocus", "");
}

function changeObjClass(id, className) {//改变对象样式
    $(id).className = className;
}

//----------------------  路径缓存操作 end----------------------------------------------------------
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
    if (typeof (_divId) != 'undefined' && typeof (_preTop) != 'undefined' && typeof (_top) != 'undefined' && typeof (_moveDir) != 'undefined') {
        this.focusId = _divId;
        this.preTop = _preTop;
        this.focusTop = _top;
        this.moveDir = _moveDir;
    }
    var moveStep = (this.focusTop - this.preTop) * _percent;
    if (Math.abs(moveStep) > 3) {
        this.preTop += moveStep;
        if (this.moveDir == "V") {
            $(this.focusId).style.top = this.preTop + "px";
        } else {
            $(this.focusId).style.left = this.preTop + "px";
        }
        clearTimeout(this.slideTimer);
        this.slideTimer = setTimeout(slide, 1);
    } else {
        if (moveDir == "V") {
            $(this.focusId).style.top = this.focusTop + "px";
        } else {
            $(this.focusId).style.left = this.focusTop + "px";
        }
    }
}
//****************时间秒转换为00：00：00格式**********************
function convertToShowTime(second) {
    if (isNaN(second) || second < 0) second = 0;
    var hh = parseInt(second / 3600);
    var mm = parseInt((second % 3600) / 60);
    var ss = (second % 3600) % 60;
    return addZero(hh) + ":" + addZero(mm) + ":" + addZero(ss);
}
function addZero(val) {
    if (val < 10) return "0" + val;
    return val;
}
/**
 * @description subText 汉字与字符都都在时截取长度
 * @param {string} _str 需要截取的字符串
 * @param {string} _subLength 页面上展示字符串的长度（汉字个数*2）
 * @param {number} _num 是否滚动（num等于0时字符截取，num等于1时数据进行滚动）
 */

IEPG.subText = function (_str, _subLength, _num, _width, _height) {
    var temp1 = _str.replace(/[^\x00-\xff]/g, "**");
    var temp2 = temp1.substring(0, _subLength);
    var x_length = temp2.split("\*").length - 1;
    var hanzi_num = x_length / 2;
    _subLength = _subLength - hanzi_num;
    var res = _str.substring(0, _subLength);
    var dis_width = "";
    var dis_height = "";
    if (_width == undefined || _width == "") dis_width = ""; else dis_width = "width='" + _width + "px'";
    if (_height == undefined || _height == "") dis_height = ""; else dis_height = "height='" + _height + "px'";
    if (_num === 0) {
        if (_subLength < _str.length) {
            res = res + "...";
        }
        return res;
    } else {
        if (_subLength < _str.length) {
            return "<marquee scrollAmount=4 behavior='alternate'  scrolldelay='100' " + dis_width + " " + dis_height + ">" + _str + "</marquee>";
        } else {
            return _str;
        }
    }
};

//******************************* 取url中的相关参数  **********************************************
//获取url中param参数的值  例子：var serviceCode = getQueryStr(location.href, "serviceCode");
function getQueryStr(url, param) {
    var rs = new RegExp("(^|)" + param + "=([^\&]*)(\&|$)", "gi").exec(url), tmp;
    if (tmp = rs) {
        return tmp[2];
    } else {
        return "";
    }
}

/*替换字符串中参数的值searchStr：查找的字符串，replaceVal：替换的变量值
 var backUrl=backUrl.replaceQueryStr(breakpointTime,"vod_ctrl_breakpoint");
 */
String.prototype.replaceQueryStr = function (replaceVal, searchStr) {
    var restr = searchStr + "=" + replaceVal;
    var rs = new RegExp("(^|)" + searchStr + "=([^\&]*)(\&|$)", "gi").exec(this), tmp;
    var val = null;
    if (tmp = rs)
        val = tmp[2];
    if (val == null) {
        if (this.lastIndexOf("&") == this.length - 1)
            return this + restr;
        else if (this.lastIndexOf("?") >= 0)
            return this + "&" + restr;
        return this + "?" + restr;
    }
    var shs = searchStr + "=" + val;
    if (this.lastIndexOf("?" + shs) >= 0)
        return this.replace("?" + shs, "?" + restr);
    return this.replace("&" + shs, "&" + restr);
};

//页面做分页处理时，pageLength：总数据长度，pageSize：页面可显示的数据长度
function getMaxPage(pageLength, pageSize) {//求最大页数
    if (pageLength == 0 || pageLength == undefined) {
        return 0;
    }
    if (pageLength % pageSize != 0) {
        return Math.ceil(pageLength / pageSize);
    } else {
        return pageLength / pageSize;
    }
}

function getMaxPageSize(pageLength, pageSize) {//求为最大页数时pagesize
    if (pageLength == 0 || pageLength == undefined) {
        return 0;
    }
    if (pageLength % pageSize != 0) {
        return pageLength % pageSize;
    } else {
        return pageSize;
    }
}

//******************************* 真焦点处理 *********************************
var inputsStates;// inputs 标签状态保存
//将页面上所有的标签都设为可用
function enabledAll() {
    //所有 input 标签
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
    }
    //其它
}
//将页面上所有的标签都设为不可用
function disabledAll() {
    //所有 input 标签
    var inputs = document.getElementsByTagName("input");
    inputsStates = new Array(inputs.length);
    for (var i = 0; i < inputs.length; i++) {
        inputsStates[i] = inputs[i].disabled;
        inputs[i].disabled = true;
    }
    //其它
}
//*************************** 消息弹出框 ***********************************
/**
 * @description subText 消息弹出框，显示提示信息,传入 空,弹出服务器忙的提示
 */
var tipDivId = "tip_visibility";//弹出框div的ID
var dsj_tipDivId = "dsj_tip_visibility";//剧集弹出框div的ID
var messInfoId = "tipWindow";//显示消息文字的div的ID
var dsj_messInfoId = "dsj_tip_window";//剧集显示消息文字的div的ID
var lastObj;//弹出窗口之前有焦点的对象
var tipFlag = false;//弹出框标识，true为有弹出框，默认为false；
var OKButtonId = "OKButton";
var resFlag = false;

function showMsg(url, msg) {
    if (!tipFlag)// 如果当前已经没有弹出窗口,则需要保存当前焦点对象和面页按键的有效状态
    {
        lastObj = document.activeElement;
        disabledAll();
    }
    var tipDiv = $(tipDivId);
    var tipWindow = $(messInfoId);
    if (url == "") {
        url = epgUrl + "tip/a_busyInfo.htm";
        if (msg == "") {
            msg = "系统忙，请稍后再试！";
        }
    }
    ajax(url, function (resText) {
        tipDiv.style.visibility = "visible";
        tipWindow.innerHTML = resText;
        tipFlag = true;
        if (resText.indexOf("box_search") >= 0) {//搜索提示框
            searchTipFlag = true;
            $('search_Input').focus();
            return;
        }
        $("message").innerHTML = msg;
        if ($(OKButtonId))//弹出窗口确定按钮Id必须为 OKButton ,OKButton为弹出窗口专用ID
        {
            $(OKButtonId).focus();
        }
        if (resText.indexOf("a_buyTip") >= 0) {
            resFlag = true;
            $(OKButtonId).onclick = function () {
                Buy.doBuy(URL.VOD_buy, buy);//提示购买时按确认键购买
            };
        } else if (resText.indexOf("a_buyOk") >= 0) {
            $(OKButtonId).onclick = function () {
                IEPG.pakgBookmarkcheck();
            };
        } else if (resText.indexOf("a_breakTimeTip") >= 0) {
            $(OKButtonId).onclick = function () {
                IEPG.doBookmarkPlay(getGlobalVar("timePosition"));//从断点处播放
                //IEPG.doPlay();
            };
            $("rePlayButton").onclick = function () {
                setGlobalVar("timePosition", "");
                IEPG.doPlay();//重新播放
            };
        }
    });
}

function closeTip()//关闭提示信息
{
    var tipDiv = $(tipDivId);
    var tipWindow = $(messInfoId);
    var dsj_tipDiv = $(dsj_tipDivId);
    var dsj_tipWindow = $(dsj_messInfoId);
    if (tipWindow || dsj_tipWindow) {
        tipDiv.style.visibility = "hidden";
        tipWindow.innerHTML = "";
        dsj_tipDiv.style.visibility = "hidden";
        dsj_tipWindow.innerHTML = "";
        //$("message").innerHTML = "";
    }
    $("episode").style.display = "none";//集数弹出框
    tipFlag = false;
    mediaTipFlag = false;
    searchTipFlag = false;
    searchType = "";
    enabledAll();
    lastObj.focus();
}

/**
 * @description subText 获取海报
 */
function getPoster(posterJson, width, height) {
    if (posterJson == undefined) {
        return defaultPic;
    }
    for (var i = 0; i < posterJson.length; i++) {
        if (posterJson[i].width >= width && posterJson[i].height >= height) {
            return "/" + posterJson[i].displayUrl;
        }
    }
    if (posterJson.length != 0) {
        return "/" + posterJson[0].displayUrl;
    } else {
        return defaultPic;
    }
}

/**
 * @description  在列表直接按播放键响应函数
 */
IEPG.onPlayAction = function (dataArr, focusIndex) {
    if (dataArr.length > 0) {
        saveGlobalVar();
        if (dataArr[focusIndex].recordType == "pakg") {
            saveUrlPath();
            window.location.href = "detail.htm?columnMapId=" + dataArr[focusIndex].columnMapId;
        } else {
            var pmJson = {
                "chargeModel": dataArr[focusIndex].chargeModel,
                "goodsId": dataArr[focusIndex].goodsId,
                "columnMapId": dataArr[focusIndex].columnMapId,
                "resourceId": dataArr[focusIndex].resourceId,
                "assetName": dataArr[focusIndex].assetName,
                "recordType": dataArr[focusIndex].recordType,
                "buyPlayType": "1"
            };
            Buy = new IEPG.BUY(pmJson);
            Buy.doBuy(URL.VOD_checkBuy, checkBuy);
        }
    }
};
/**
 * @description  子集列表按播放键、确定键直接播放，
 */
IEPG.doPlayAction = function (playJson) {
    var pmJson = {
        "chargeModel": playJson.chargeModel,
        "goodsId": playJson.goodsId,
        "columnMapId": playJson.columnMapId,
        "resourceId": playJson.resourceId,
        "assetName": playJson.assetName,
        "recordType": playJson.recordType,
        "allPrice": playJson.allPrice,
        "allDiscountedPrice": playJson.allDiscountedPrice,
        "buyPlayType": "1"
    };
    Buy = new IEPG.BUY(pmJson);
    Buy.doBuy(URL.VOD_checkBuy, checkBuy);
};

/**
 * @description  剧集子集列表按确定键直接播放，无记忆播放点。
 */
IEPG.doMediaPlayAction = function (playJson) {
    var pmJson = {
        "chargeModel": playJson.chargeModel,
        "goodsId": playJson.goodsId,
        "columnMapId": playJson.columnMapId,
        "resourceId": playJson.resourceId,
        "assetName": playJson.assetName,
        "recordType": playJson.recordType,
        "allPrice": playJson.allPrice,
        "allDiscountedPrice": playJson.allDiscountedPrice,
        "buyPlayType": playJson.buyPlayType,
        "mediaFocus": playJson.mediaFocus
    };
    Buy = new IEPG.BUY(pmJson);
    if (pmJson.chargeModel != 1) {
        Buy.doBuy(URL.VOD_checkBuy, checkBuyPop);
    } else {
        Buy.doBuy(URL.VOD_checkBuy, checkBuy);
    }
};

/**
 * @description MediaPlayer 页面显示直播视频流
 * @param {object} _config 视频对象包含url，静音div的id，是否全屏标识，视频的区域x,Y,W,H
 * @param {string} videoUrl 直播视频url
 * @param {number} x,y,w,h 视频的区域x值（left）,y值 (top),宽(width),高(height)
 * @param {string} IsFullScreen 是否全屏播放，0为不全屏，1为全屏展示忽略x,y,w,h的值。
 * @param {function} initVoice 页面上次处理静音图片的展示函数
 * @param {string} muteMode 盒子接口，用来获取当前播放器是否为静音状态,1为静音，0为非静音
 *
 var videoConfig = {
	 videoUrl:"delivery://339000.6875.64QAM.101.80.80"，
	 area:{x:"",y:"",w:"",h:""}，
	 IsFullScreen:0,
	 init:initVoice
 }
 */

IEPG.MediaPlayer = function (_config) {
    var mp = null, muteMode = null;
    this.videoUrl = _config.videoUrl || "";
    this.X = _config.area.x || 0;
    this.Y = _config.area.y || 0;
    this.W = _config.area.w || 1280;
    this.H = _config.area.h || 720;
    this.IsFullScreen = _config.IsFullScreen || 0;
    this.init = _config.init || this._blank;
};

IEPG.MediaPlayer.prototype = {
    openVideo: function () {		//8606盒子用此方法
        try {
            mp = new MediaPlayer();
            this._initStatic();
            if (this.videoUrl != "") {
                mp.setSingleMedia(this.videoUrl);
                mp.setVideoDisplayArea(this.X, this.Y, this.W, this.H);
                mp.setVideoDisplayMode(0);
                mp.refreshVideoDisplay();
                mp.playFromStart();
            }
        } catch (err) {
        }
    },
    openNewVideo: function () {		//9101的盒子用此方法
        try {
            mp = new MediaPlayer();
            this._initStatic();
            mp.createPlayerInstance("video", 2);
            mp.position = this.IsFullScreen + "," + this.X + "," + this.Y + "," + this.W + "," + this.H;
            mp.source = this.videoUrl;
            mp.play();
            mp.refresh();
        } catch (err) {
        }
    },
    closeVideo: function () {
        try {
            if (mp != null) {
                if (mp.releasePlayerInstance) {
                    mp.releasePlayerInstance();
                    mp.pause(0);
                } else {
                    mp.stop();
                    mp.setVideoDisplayMode(1);
                    mp.refreshVideoDisplay();
                }
            }
        } catch (err) {
        }
    },
    _initStatic: function () {
        try {
            muteMode = mp.getMute();
        } catch (err) {
            muteMode = 0;
        }
        this.init(muteMode);
    },
    resetStatic: function () {
        muteMode = mp.getMute();
        if (muteMode == 1) {
            muteMode = 0;
            mp.audioUnmute();	//将当前播放实例解除静音状态
        } else {
            muteMode = 1;
            mp.audioMute();		//将某个播放实例设置为静音
        }
        this._initStatic();
    },
    _blank: function () { }
};



//***************************     搜索 开始             *************************
/** @description 搜索*/
var searchType = ""; //默认先搜索vod
function goToSearch() {
    //if(epgUrl.indexOf("1")>=0){

    //showMsg(epgUrl + "tip/search_tip.htm", "");
    //}else{
    window.location.href = goToUrl + "search.htm";
    //}
}

function deleteValue() {
    $("search_Input").value = ($("search_Input").value).substring(0, ($("search_Input").value).length - 1);
}

function deleteAll() {
    $('search_Input').value = '';
}

var listObj1, listData1, delayTime1, VOD_getAssetListByKeyword;
var curPage1 = 1, listFocus1 = 0;
var searchKeyWord;
var BTV_getProgramListByKeyword;
function doSearch() {
    searchKeyWord = $('search_Input').value;
    if (searchKeyWord == "" || searchKeyWord == "请输入关键字进行搜索") {
        $('search_Input').value = "请输入关键字进行搜索";
    } else {

        $('box_search').style.display = "none";
        $('search_result').style.display = "block";
        var config = {
            "pageSize": 4,
            "iterator": showList1,
            "focusId": "s_list_focus",
            "focusTop": 126,
            "focusStep": 50,
            "updateData": getListData1,
            "onFocus": onListFocus1,
            "onBlur": onListBlur1,
            "isTurnPage": "",
            "isLoop": true
        };
        VOD_getAssetListByKeyword = {
            "param": {
                "keyword": searchKeyWord,
                "searchType": "2",
                "siteId": "2",//1高清，2标清
                "columnId": "",
                "limit": 4,
                "page": curPage1
            },
            "callBack": searchAsset
        };

        IEPG.getData(URL.VOD_getAssetListByKeyword, VOD_getAssetListByKeyword);
        listObj1 = new IEPG.AjaxList(config);
        searchType = "btv";
    }
}

function onListFocus1(_focusIndex) {
    if (listData1.length > 0) {
        listFocus1 = _focusIndex;
        /*$('s_list_num').innerHTML=_focusIndex+1+'、';
        if(searchType=="vod"){
            $('s_list_title').innerHTML=IEPG.subText(listData1[_focusIndex].programName, 28, 0);
        }else{
            $('s_list_title').innerHTML=IEPG.subText(listData1[_focusIndex].assetName, 28, 0);
        }*/
    }
}
function onListBlur1(_focusIndex) {

}

function doPlayKey1() {

    if (listData1.length > 0) {
        if (searchType == "btv") {
            closeTip();
            IEPG.onPlayAction(listData1, listFocus1);
        } else {
            var btvPlay = new IEPG.BTVPlay(listData1[listFocus1]);
            btvPlay.doBTVPlay();
        }
    }
}
function moveUp1() {
    listObj1.up();
}
function moveDown1() {
    listObj1.down();
}
function moveLeft1() {
    curPage1 = 1;
    listFocus1 = 0;
    if (searchType == "vod") {
        $('result_btv').className = "search_btn_blur";
        $('result_vod').className = "search_btn_focus";
        var config = {
            "pageSize": 4,
            "iterator": showList1,
            "focusId": "s_list_focus",
            "focusTop": 126,
            "focusStep": 53,
            "updateData": getListData1,
            "onFocus": onListFocus1,
            "onBlur": onListBlur1,
            "isTurnPage": "",
            "isLoop": true
        };
        VOD_getAssetListByKeyword = {
            "param": {
                "keyword": searchKeyWord,
                "searchType": "2",
                "siteId": "2",//1高清，2标清
                "columnId": "",
                "limit": 4,
                "page": curPage1
            },
            "callBack": searchAsset
        };

        IEPG.getData(URL.VOD_getAssetListByKeyword, VOD_getAssetListByKeyword);
        listObj1 = null;
        listObj1 = new IEPG.AjaxList(config);
        searchType = "btv";
    }
}
function moveRight1() {
    curPage1 = 1;
    listFocus1 = 0;
    if (searchType == "btv") {
        $('result_vod').className = "search_btn_blur";
        $('result_btv').className = "search_btn_focus";
        var config = {
            "pageSize": 4,
            "iterator": showList1,
            "focusId": "s_list_focus",
            "focusTop": 126,
            "focusStep": 50,
            "updateData": getListData1,
            "onFocus": onListFocus1,
            "onBlur": onListBlur1,
            "isTurnPage": "",
            "isLoop": true
        };
        BTV_getProgramListByKeyword = {
            "param": {
                "keyword": searchKeyWord,
                "searchType": 4,
                "limit": 4,
                "page": curPage1
            },
            "callBack": searchBTVProgram
        };
        IEPG.getData(URL.BTV_getProgramListByKeyword, BTV_getProgramListByKeyword);
        listObj1 = null;
        listObj1 = new IEPG.AjaxList(config);
        searchType = "vod";
    }
}
function turnPrevPage1() {
    listObj1.pageUp();
}
function turnNextPage1() {
    listObj1.pageDown();
}

function turnPrevPage() {
    
}
function turnNextPage() {
    
}



function doConfirm1() {

    if (searchType == "btv") {
        closeTip();
        var svstype = getGlobalVar('headerType');
        if (!svstype) {
            svstype = "";
        }
        window.location.href = "detail.htm?svstype=" + svstype + "&columnMapId=" + listData1[listFocus1].columnMapId + "&flag=search";
    } else if (searchType == "vod") {
        closeTip();
        var btvPlay = new IEPG.BTVPlay(listData1[listFocus1]);
        btvPlay.doBTVPlay();
    } else {

    }
}

function searchAsset(_dataJson) {
    listData1 = _dataJson.assetList;
    curPage1 = _dataJson.pageInfo.curPage;
    listObj1.initData(listData1, curPage1, _dataJson.pageInfo.totalPage, listFocus1);
    listObj1.setPageInfo("s_pageInfo");
    if (listData1.length > 0) {
        $('no_data').style.display = "none";
        $('s_list_focus').className = 'box_list_focus';
        listObj1.showFocus();
    } else {
        $('s_list_focus').className = 'box_list_focus';
        listObj1.hideFocus();
        $("no_data").style.display = "block";
        $("no_data").innerHTML = "没有搜索到与“" + searchKeyWord + "”相关的数据";
    }
}

function showList1(_dataItem, _dataIndex, _focusIndex) {
    if (_dataItem) {
        $("s_num_" + _focusIndex).innerHTML = _focusIndex + 1 + '、';
        if (searchType == "btv") {
            $("s_listName_" + _focusIndex).innerHTML = IEPG.subText(_dataItem.assetName, 28, 0);
        } else {
            $("s_listName_" + _focusIndex).innerHTML = IEPG.subText(_dataItem.programName, 28, 0);
        }
    } else {
        $("s_num_" + _focusIndex).innerHTML = "";
        $("s_listName_" + _focusIndex).innerHTML = "";
    }
}
function getListData1(_curPage) {
    clearTimeout(delayTime1);
    if (searchType == "btv") {
        VOD_getAssetListByKeyword.param.page = _curPage;
        delayTime1 = setTimeout(function () {
            IEPG.getData(URL.VOD_getAssetListByKeyword, VOD_getAssetListByKeyword);
        }, 200);
    } else {
        BTV_getProgramListByKeyword.param.page = _curPage;
        delayTime1 = setTimeout(function () {
            IEPG.getData(URL.BTV_getProgramListByKeyword, BTV_getProgramListByKeyword);
        }, 200);
    }

}
function searchBTVProgram(_dataJson) {
    listData1 = _dataJson.programList;
    curPage1 = _dataJson.pageInfo.curPage;
    listObj1.initData(listData1, curPage1, _dataJson.pageInfo.totalPage, listFocus1);
    listObj1.setPageInfo("s_pageInfo");
    if (listData1.length > 0) {
        $('no_data').style.display = "none";
        $('s_list_focus').className = 'box_list_focus';
        listObj1.showFocus();
    } else {
        $('s_list_focus').className = 'box_list_focus';
        listObj1.hideFocus();
        $("no_data").style.display = "block";
        $("no_data").innerHTML = "没有搜索到与“" + searchKeyWord + "”相关的数据";
    }
}
//***************************     搜索 结束             *************************

/*
 * @description debug函数为页码打印方式，可以替代alert对页面效果的影响。一个htm只能有一个Debug函数。
 * @param {object} _configs 可以为Array或者为json对象。
 */
function debug(_configs) {
    var paramArr = [], debugType = "0", arrLength;
    if (typeof _configs != "object") {
        return;
    }
    arrLength = _configs.length;
    if (arrLength == undefined) {
        var i = 0;
        for (var key in _configs) {
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
    for (var i = 0; i < arrLength; i++) {
        var testDiv = document.createElement("div");
        testDiv.setAttribute("id", "MSG_" + i);
        if (i % 2 == 0) {        //偶数样式
            testDiv.setAttribute("style", "background:#A9A9A9;");
        }
        if (debugType == "0") {  //为数组
            testDiv.innerHTML = "No." + i + " ==== " + _configs[i];
        } else {                //为json对象
            var arr = paramArr[i].split("=");
            testDiv.innerHTML = arr[0] + " ==== " + arr[1];
        }
        obj.appendChild(testDiv);
    }
}


//=================================

/**
 * @fileOverview List控件
 * @author 905576 ，905112
 * @version 1.00
 *
 */

/**
 * @description 带有数据显示、上下移动、上下翻页、焦点控制、滑动功能的List控件,支持分页取数据显示
 * @constructor List
 * @param {Number}
    *            pageSize 页能够显示的最大行数 ,默认为7
 * @param {Function}
    *            iterator 遍历显示每行数据的函数，默认为空函数
 * @param {Function}
    *            onFocus 焦点移动时调用的函数
 * @param {Function}
    *            onBlur 焦点移动时调用的函数
 * @param {Function}
    *            onNoData 没有数据时处理方式
 * @param {String}
    *            focusId 焦点条的ID
 * @param {Number}
    *            focusTop 焦点条处于第一行时的top值
 * @param {Number}
    *            focusStep 焦点每移动一行的步长
 * @param {Number}
    *            isLoop 列表循环翻页标志 true：循环翻页， false：不循环，默认为false【第一条记录和最后一条记录之间循环】
 * @param {String}
    *            isTurnPage 列表翻页标志，默认为""，则表示不是翻页取数据
 * @param {String}
    *            moveDir 焦点移动的方向，"H"为横向，"V"为纵向，默认为"V"
 * @param {Number}
    *            percent 滑动系数  默认0.7
 * @param {Function}
    *            updateData 更新翻页数据，默认为空函数
 * @param {String}
    *            currPage 当前页
 * @param {String}
    *            totalPage 总页数
 * @param {isDetailList}
    *            isDetailList  是否是连续剧子集列表，默认为false
 */

// var listJson = {   //必填参数如下，如有需要加入其他参数
// "pageSize" : pageSize,
// "iterator" : iterator,
// "focusId" : focusId,
// "focusStep" : focusStep,
//"updateData" : updateData
// }

IEPG.AjaxList = function (_listJson) {
    this.pageSize = _listJson.pageSize || 7;
    this.iterator = _listJson.iterator || this._blank;
    this.onFocus = _listJson.onFocus || this._blank;
    this.onBlur = _listJson.onBlur || this._blank;
    this.focusId = _listJson.focusId;
    this.currIndex = _listJson.currIndex || 0;
    this.focusTop = _listJson.focusTop;
    this.focusStep = _listJson.focusStep;
    this.isLoop = _listJson.isLoop || false;
    this.moveFlag = Boolean(typeof (this.focusId) != 'undefined' && typeof (this.focusTop) != 'undefined' && typeof (this.focusStep) != 'undefined');
    this.isTurnPage = _listJson.isTurnPage || "";
    this.updateData = _listJson.updateData || this._blank;
    this.moveDir = _listJson.moveDir || "V";
    this.percent = _listJson.percent || 0.7;
    this.isDetailList = _listJson.isDetailList || false;
    this.up = function () {
        this._upDown(-1);
    };
    this.down = function () {
        this._upDown(1);
    };
    this.currPage = null;
    this.totalPage = null;
};

IEPG.AjaxList.prototype = {
    /**
     * @description 获取每页数据，服务器端做分页处理，每次翻页请求一次数据;
     * 			判断是否是取翻页数据，翻页后改变光标焦点
     * @param {Object} _data 获取的节目列表数据
     * @param {Number} _curPage 当前页码
     * @param {Number} _totalPage 总页数
     * @param {Number} _index 当前焦点所处下标
     * @return null
     */
    initData: function (_data, _curPage, _totalPage, _index) {
        this.data = _data;
        this.currPage = _curPage;
        this.totalPage = _totalPage;
        this.length = _data.length;
        this._showAjaxList();
        if (typeof (this.isTurnPage) != 'undefined' && this.isTurnPage != "") {
            if (this.isTurnPage == 1) {	//翻页取数据后，光标焦点值改变
                this.currIndex = 0;
            } else if (this.isTurnPage == -1) {
                this.currIndex = this.length - 1;
            }
            if (this.moveFlag) {			//光标滑动
                slide(this.focusId, this.focusTop + (this.focusIndex * this.focusStep), this.focusTop + (this.currIndex * this.focusStep), this.moveDir, this.percent);
            }
            this.isTurnPage = "";
        } else {
            this.currIndex = _index;//初始化数据时，光标焦点默认页面保存的焦点值
            if (this.moveFlag) {	//光标滑动
                var initTop = this.focusTop + (this.currIndex * this.focusStep);
                $(this.focusId).style.top = initTop + "px";
            }
        }
        this._setFocus();
    },
    /**
     * @description 显示列表数据
     * @return null
     */
    _showAjaxList: function () {
        for (i = 0; i < this.pageSize; i++) {
            this.iterator(i < this.length ? this.data[i] : null, i, i);
        }
        this.isTurn = true;
    },
    /**
     * @description 向上移动一行焦点
     * @return null
     */
    _upDown: function (type) {
        if (this.length == 0 || !this.isTurn) {   //加入this.isTurn判断解决在移动快速翻页时，数据还没刷新，但按键继续响应，会出现双焦点。
            return;
        }
        var oldFocusIndex = this.currIndex;
        this._setBlur();
        this.currIndex += type;
        if (this.totalPage > 1) {
            if (this.currIndex < 0) {	//非循环翻页且光标在第一条记录上时，上移后光标不变；否则循环翻页
                if ((!this.isLoop && this.currPage == 1) || this.isDetailList) {
                    this.currIndex = 0;
                } else {
                    this._changePage(type);
                    return;
                }
            }
            if (this.currIndex > this.length - 1) {	//非循环翻页且光标在最后一条记录上时，下移后光标不变；否则循环翻页
                if (!this.isLoop && this.currPage == this.totalPage) {
                    this.currIndex = this.length - 1;
                } else {
                    this._changePage(type);
                    return;
                }
            }
        } else {
            if (this.currIndex < 0) {
                if (this.isLoop) {	//列表焦点光标循环循环
                    this.currIndex = this.length - 1;
                } else {
                    this.currIndex = 0;
                    return;
                }
            }
            if (this.currIndex > this.length - 1) {
                if (this.isLoop) {	//列表焦点光标循环循环
                    this.currIndex = 0;
                } else {
                    this.currIndex = this.length - 1;
                    return;
                }
            }
        }
        var newFocusIndex = this.currIndex;
        if (this.moveFlag) {
            slide(this.focusId, this.focusTop + (oldFocusIndex * this.focusStep), this.focusTop + (newFocusIndex * this.focusStep), this.moveDir, this.percent);
        }
        this._setFocus();
    },
    /**
     * @description 翻页
     * @param {Number} _offset -1:翻上页 1:翻下页
     * @return null
     */
    _changePage: function (_offset) {
        if (!this.isTurn) {
            return;
        }
        this.isTurnPage = _offset;//翻页标志
        this.currPage += _offset;
        if (this.currPage > this.totalPage) {
            this.currPage = 1;
        }
        if (this.currPage < 1) {
            this.currPage = this.totalPage;
        }
        this._setBlur();
        this._update();
    },
    /**
     * @description 向上翻页
     * @return null
     */
    pageUp: function () {
        if (this.totalPage < 2) {
            return;
        }
        if ((!this.isLoop || typeof (this.isLoop) == 'undefined') && (this.currPage == 1)) {
            return;
        }
        this._changePage(-1);
    },
    /**
     * @description 向下翻页
     * @return null
     */
    pageDown: function () {
        if (this.totalPage < 2) {
            return;
        }
        if ((!this.isLoop || typeof (this.isLoop) == 'undefined') && (this.currPage == this.totalPage)) {
            return;
        }
        this._changePage(1);
    },
    /**
     * @description 没数据时，隐藏焦点
     * @return null
     */
    hideFocus: function () {
        if (this.moveFlag) {
            $(this.focusId).style.display = "none";
        }
    },
    /**
     * @description 有数据时，显示焦点
     * @return null
     */
    showFocus: function () {
        if (this.moveFlag) {
            $(this.focusId).style.display = "block";
        }
    },
    /**
     * @description 获焦后关联处理
     * @return null
     */
    _setFocus: function () {
        this.onFocus(this.currIndex);
    },
    /**
     * @description 失焦后关联处理
     * @return null
     */
    _setBlur: function () {
        this.onBlur(this.currIndex);
    },
    /**
     * @description 翻页后更新数据
     * @return null
     */
    _update: function () {
        this.isTurn = false;
        this.updateData(this.currPage);
    },
    /**
     * @description 设置页码
     * @param {string} _pageId 页码id
     * @return null
     */
    setPageInfo: function (_pageId) {
        if (this.totalPage <= 0) {
            this.currPage = 0;
            this.totalPage = 0;
        }
        $(_pageId).innerHTML = "第" + this.currPage + "/" + this.totalPage + "页";
    },
    /**
     * @description 空函数
     * @return null
     */
    _blank: function () {
    }
};


//----------------------  路径缓存操作---------------------------------------------------------
/*
 * 在有页面跳转动作时调用 ，用来保存当前页面的URL，URL 之间以 urlSplitChar 号分隔，
 * 调用此方法之前页面需要保存其它的变量需要自己操作
 */
var urlSplitChar1 = "#";//URL之间的分隔符，可配，但注意确保不会与URL参数重复
var globalPath = {
    setUrl: function () {
        var tempUrl = getGlobalVar("GLOBALURLPATH") == undefined ? "" : getGlobalVar("GLOBALURLPATH");//取全局变量
        tempUrl = tempUrl + urlSplitChar1 + location.href;//将已存在的路径和当前URL之间加上分隔符
        var arr = tempUrl.split(urlSplitChar1);
        if (arr.length > 6) {
            var removeLength = arr.length - 6;
            var newArr = arr.slice(removeLength);//从指定位置开始复制数组，一直到最后
            tempUrl = arr[1] + urlSplitChar1 + newArr.join(urlSplitChar1);//保留原来数组中第一个路径（portal进入的路径）
        }
        setGlobalVar("GLOBALURLPATH", tempUrl);
    },
    getUrl: function () {//返回上一路径
        var tempUrl = getGlobalVar("GLOBALURLPATH");
        var tuArr = tempUrl.split(urlSplitChar1);
        var tl = tuArr.length;
        var tul = tuArr.pop();
        if (!tul || tul == "") {
            tul = getGlobalVar("PORTAL_ADDR");
        }
        var newUrl = tuArr.join(urlSplitChar1);
        setGlobalVar("GLOBALURLPATH", newUrl);
        location.href = tul;
    },
    cleanUrl: function () {
        setGlobalVar("GLOBALURLPATH", "");
    }
};


//
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
function addClassCallBack(obj,className,callback){
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
    if(typeof(callback) == "function"){
    	setTimeout(callback,500);
    }
}

//ajax封装
function ajax(obj) {
    if(!obj.url)
        return;
    var xmlhttp=new XMLHttpRequest()||new ActiveXObject('Microsoft.XMLHTTP');    //这里扩展兼容性
    var type=(obj.type||'POST').toUpperCase();
    xmlhttp.onreadystatechange=function(){    //这里扩展ajax回调事件
        if (xmlhttp.readyState == 4&&xmlhttp.status == 200&&!!obj.success)
            obj.success(xmlhttp.responseText);
        if(xmlhttp.readyState == 4&&xmlhttp.status != 200&&!!obj.error)
            obj.error();
    };
    if(type=='POST'){
        xmlhttp.open(type, obj.url, obj.async||true);
        xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        xmlhttp.send(_params(obj.data||null));
    }
    else if(type=='GET'){
        xmlhttp.open(type, obj.url+ (obj.data?( '?'+_params(obj.data||null)):''), obj.async||true);
        xmlhttp.send(null);
    }
}
//_params函数解析发送的data数据，对其进行URL编码并返回
function _params(data,key) {
    var params = '';
    key=key||'';
    var type={'string':true,'number':true,'boolean':true};
    if(type[typeof(data)])
        params = data;
    else
        for(var i in data) {
            if(type[typeof(data[i])])
                params += "&" + key + (!key?i:('['+i+']')) + "=" +data[i];
            else
                params+=_params(data[i],key+(!key?i:('['+i+']')));
        }
    return !key?encodeURI(params).replace(/%5B/g,'[').replace(/%5D/g,']'):params;
}
