﻿String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};
function jsonParse(text) {
    try {
        return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(text.replace(/"(\\.|[^"\\])*"/g, ''))) && eval('(' + text + ')');
    } catch (e) {
        return false;
    }
}

var isIPanel = typeof (iPanel) != "undefined" ? true : false;
//茁壮要求修改,兼容时应去掉＝＝＝＝＝＝＝＝＝＝＝＝＝
//try {
//	Utility.setDrawFocusRing(0);
//	//Coship.setDrawFocusRing(1);
//} catch (e) {
//	Coship.setDrawFocusRing(1);
//}
//＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
var portalId = 102;
var userId = getUserId();
//The following key-values are from the document of GCABLE-20 11-001-110415
// Modified bu zhangchangf 2011-05-02
var KEY_VOICEUP = 595;
var KEY_VOICEDOWN = 596;
var KEY_RETURN = 340;
var KEY_PLAY = 39;
var KEY_INFORMATION = 73;
var KEY_PAUSE = 1026;
var KEY_STOP = 47;
var KEY_FAST_REWIND = 372;
var KEY_FAST_FORWARD = 373;
var KEY_HOMEPAGE = 72;
var KEY_PAGEUP = 306;
var KEY_PAGEDOWN = 307;
var KEY_FORWARD = 4;
var KEY_REWIND = 3;
var KEY_ENTER = 13;
var KEY_QUIT = 339;
var KEY_EXIT = 513;
var KEY_RED = 320;
var KEY_GREEN = 321;
var KEY_YELLOW = 322;
var KEY_BLUE = 323;
var KEY_POSITION = 833;
var KEY_TRACK = 86;
var KEY_MUTE = 597;
var KEY_LANGUAGE = 35;
var KEY_SCREENDISPLAY = 42;
var KEY_PANGE_FORWARD = 1028;
var KEY_PAGE_REWIND = 1040;
var KEY_PLAY_MIN = 1024;

var KEY_FAST_REWIND_N = 37;
var KEY_FAST_FORWARD_N = 39;

var KEY_FAST_REWIND_RG = 37;
var KEY_FAST_FORWARD_RG = 39;

var KEY_PAUSE_N = 38;
var KEY_POSITION_N = 40;

var KEY_PAUSE_RG = 1;
var KEY_POSITION_RG = 2;

var KEY_ZERO = 48;
var KEY_ONE = 49;
var KEY_TWO = 50;
var KEY_THREE = 51;
var KEY_FOUR = 52;
var KEY_FIVE = 53;
var KEY_SIX = 54;
var KEY_SEVER = 55;
var KEY_EIGHT = 56;
var KEY_NINE = 57;

var KEY_QUIT_RG = 114;



var MAPIP = "172.30.1.30";
//var MAPIP = "10.9.219.3";
var MAPPort = "554";
var portalIP = "172.30.1.20";
//var portalIP = "10.9.217.8";
var portalPort = "8080";

var prefix = "";
var LocString = String(window.document.location.href);
var ListJson;
var vodEpgUrl = "/iPG/T-nsp/";
var IEPG ={};
function getUserId() {//获取userId

    var userId;
    userId = getGlobalVar('userId');
    if(userId == ""){
        userId = "0";
    }
    return userId;
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
function setSmartCardId() {
    try {
        setGlobalVar("currentSmartCardId", getSmartCardId());
    } catch (e) {
    }
}

function $(id) {
    return document.getElementById(id);
}

function getQueryStr(qs, allStr) {
    var rs = new RegExp("(^|)" + qs + "=([^\&]*)(\&|$)", "gi").exec(allStr), tmp;
    if( tmp = rs)
        return tmp[2];
    return "";
}

/*function getMaxPauseTime() {
 var time = Utility.getSystemInfo("SaServiceInfo.VOD_MAX_PAUSE_TIME");
 if (time != "") return parseInt(time, 10);
 return 300;
 }*/
String.prototype.replaceQueryStr = function(replaceVal, searchStr) {
    var restr = searchStr + "=" + replaceVal;
    var rs = new RegExp("(^|)" + searchStr + "=([^\&]*)(\&|$)", "gi").exec(this), tmp;
    var val = null;
    if( tmp = rs)
        val = tmp[2];
    if(val == null) {
        if(this.lastIndexOf("&") == this.length - 1)
            return this + restr;
        else if(this.lastIndexOf("?") >= 0)
            return this + "&" + restr;
        return this + "?" + restr;
    }
    var shs = searchStr + "=" + val;
    if(this.lastIndexOf("?" + shs) >= 0)
        return this.replace("?" + shs, "?" + restr);
    return this.replace("&" + shs, "&" + restr);
};
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

function addZero(val) {
    if(val < 10)
        return "0" + val;
    return val;
}

function removeZero(val) {
    if(val.length > 1 && val.indexOf("0") == 0)
        return parseInt(val.substr(1), 10);
    return parseInt(val, 10);
}

function getDateStr(seconds) {
    if(isNaN(seconds))
        seconds = 0;
    var time = new Date(seconds * 1000);
    return (time.getYear() + getExactYearDis()) + addZero((time.getMonth() + 1)) + addZero(time.getDate()) + addZero(time.getHours()) + addZero(time.getMinutes()) + addZero(time.getSeconds());
}

function convertToDate(val) {//val: yymmddhhmmss
    var darr = new Array(6);
    var index = 4;
    for(var i = 0; i < 6; i++) {
        darr[i] = parseInt(removeZero(val.substr(0, index)), 10);
        val = val.substr(index);
        index = 2;
    }
    return darr;
}

function convertToShowTime(second) {
    if(isNaN(second) || second < 0)
        second = 0;
    var hh = parseInt(second / 3600);
    var mm = parseInt((second % 3600) / 60);//must be round
    var ss = (second % 3600) % 60;
    return addZero(hh) + ":" + addZero(mm) + ":" + addZero(ss);
}

function getIntValue(val) {
    if(val != null && val != "" && !isNaN(val))
        return parseInt(val, 10);
    return 0;
}

function getStatusImgSrc(status) {
    var src = "";
    switch(status) {
        case 0:
            //play
            src = prefix + "images/button_q.png";
            break;
        case 1:
            //pause
            src = prefix + "images/button_s.png";
            break;
        case 3:
            //fast forward
            src = prefix + "images/button_g.png";
            //button_qb.png";
            break;
        case 4:
            //fast rewind
            src = prefix + "images/button_b.png";
            //button_go.png";
            break;
        case 5:
            //forward
            //src = prefix + "images/button_q.png";//button_g.png";
            break;
        case 6:
            //rewind
            //src = prefix + "images/button_q.png";//button_b.png";
            break;
    }
    return src;
}

function getTrackStr(val) {
    var str = "";
    switch(val.toUpperCase()) {
        case "LEFT":
            str = "左声道";
            break;
        case "RIGHT":
            str = "右声道";
            break;
        case "STEREO":
            str = "立体声";
            break;
    }
    return decodeURIComponent(str);
}

function getMatchModeStr(val) {
    var str = "";
    switch (val) {
        case 0://PanScan
            str = "%E8%87%AA%E9%80%82%E5%BA%94";
            break;
        case 1://LetterBox
            str = "%E5%8F%98%E7%84%A6";
            break;
        //case 2: //ComBined
        // str = "ComBined";
        //break;
        case 2:
            //Ignore
            str = "%E5%85%A8%E5%B1%8F";
            break;
    }
    return decodeURIComponent(str);
}

function getExactYearDis() {
    return 1900;
}

function getDateObj() {
    return new Date();
}

var xmlHttp;
var xmlHead = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>";
IEPG.getData = function(_APIUrl, _configs){
    var paramUrl, dataUrl;
    var _data = xmlHead + _configs.data;
    var reqUrl = _APIUrl + "?dataType=json";
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
//		_url = "http://" + portalIP + ":" + portalPort + _url;
        this.xmlHttp.open("POST", _url, true);
        this.xmlHttp.setRequestHeader("Content-type", "content-type:text/plain");
        this.xmlHttp.send(_data);
        this.xmlHttp.onreadystatechange = function() {
            if(xmlHttp.readyState == 4) {
                if(xmlHttp.status == 200) {
                    callBackData3(xmlHttp, _handler);
                } else {//��ʱ�䷽��,����ջ��Զ�����������æ����ʾ
                    //showMsg("", "ϵͳæ,���Ժ����ԡ�");
                }
            }
        };
    };
    this.getData();
}
function callBackData3(_xmlHttp, _handler){
    var resText = _xmlHttp.responseText;
    resText = eval("(" + resText + ")");
    _handler(resText);
}
function GetXmlHttpObject(handler) {
    var objXmlHttp = null;
    if(window.XMLHttpRequest) {
        objXmlHttp = new XMLHttpRequest();
    } else {
        if(window.ActiveXObject) {
            objXmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    objXmlHttp.onreadystatechange = function() {
        if(objXmlHttp.readyState == 4) {
            if(objXmlHttp.status == 200) {
                handler(xmlHttp);
            } else {
                showInfo("");//超时间方法,传入空会自动弹出服务器忙的提示
            }
        }
    };
    return objXmlHttp;
}
document.onsystemevent = function(e) {
    var code = e.which || e.keyCode;
    var keyType = e.type ? e.type : 1001;
    if(code == 5301){
        cardBachu();
    }else if(code == 5372){
        var nev = {
            "data":'<NavCheck deviceId="'+getSmartCardId()+'" client="'+getSmartCardId()+'"/>',
            "callBack" :function (_dataJson) {
                var userId=_dataJson.account;
                setGlobalVar('userId',userId);
            }
        };
        IEPG.getData("/NavCheck",nev);
        showMsg(tipUrl + "T-nsp/tip/a_collect.htm", "卡已插入");
    }
};
function cardBachu() {
    setGlobalVar('userId','');
}


function debug(str) {
    if(typeof iPanel != "undefined" && iPanel.debug) {
        iPanel.debug(str);
    } else if(typeof Utility != "undefined" && Utility.println) {
        Utility.println(str);
    } else {
        console.log(str);
    }
}
