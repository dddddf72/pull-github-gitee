var MOUI_EVENT_ID = {
	"heartBeat":"61001", //终端运行
	"accessAsset":"61002" //访问资源
}
var eType = "moui";
var tType = "0"; //中间件机顶盒

var eStatus = "3"; //心跳
var uc = null;

function getUC(){
	return trueCardId || userCode || stbNo || mac;
}

function heartBeat(){	
	return;
	if (isMenu == 0) {
		eStatus = "1"; //开机
	}
	terminalStatus();
	eStatus = "3";
	setInterval("terminalStatus()",dataReport.heartBeatInterval);
}

function terminalStatus(){
	var eStatus = "3"; //心跳
	if (isMenu == 0) {
		eStatus = "1"; //开机
	}

	var data = {
		"eType":eType,
		"eId":MOUI_EVENT_ID.heartBeat,
		"tId":mac,
		"uc":getUC(),
		"tType":tType,
		"eStatus":eStatus,
		"areaCode":areaCode,
		"tModel":stbNo,
		"appId":"",
		"appVersion":"",
		"cTime": ""+new Date().Format("yyyy-MM-dd HH:mm:ss"),
		"sn":stbNo
	}
	ajax({
        type:"POST",
        url: dataReport.dapInterface,
        async:true,
        data:JSON.stringify(data),
        contentType:"application/json;charset=utf-8",
        success: function (data)  {
            //document.getElementById('test').innerHTML += "心跳："+data;
        },
        error: function () {

        }
    });
}

function accessAsset(callback){
	callback();
	return;
	try{
		var layoutId = rollTabData.planId;
		var layoutName = "";
		var tabId = Tab.data[Tab.focusPos].tabId;
		var tabName = Tab.data[Tab.focusPos].tabName;
		var assetId = ScrollH._data[ScrollH.focusId].categoryResourceId;
		var assetName = ScrollH._data[ScrollH.focusId].assetName;
		var assetUrl = ScrollH._data[ScrollH.focusId].intent;
		var assetRemark = ScrollH._data[ScrollH.focusId].description;
		var channelId = "";
		if(ScrollH._data[ScrollH.focusId].option){
			channelId = ScrollH._data[ScrollH.focusId].option.channelId || "";
		}
		var data = {
			"eType":eType,
			"eId":MOUI_EVENT_ID.accessAsset,
			"tId":mac,
			"uc":getUC(),
			"areaCode":areaCode,
			"assetId":""+assetId,
			"assetName":assetName,
			"assetUrl":assetUrl,
			"assetRemark":assetRemark,
			"tabId":""+tabId,
			"tType":tType,
			"tabName":tabName,
			"layoutId":""+layoutId,
			"layoutName":layoutName,
			"appId":"",
			"appVersion":"",
			"cTime":""+new Date().Format("yyyy-MM-dd HH:mm:ss"),
			"sn":stbNo,
			"channelId":channelId
		}
		ajax({
	        type:"POST",
	        url: dataReport.dapInterface,
	        async:false,
	        data:JSON.stringify(data),
	        contentType:"application/json;charset=utf-8",
	        success: function (data)  {
	            //document.getElementById('test').innerHTML += "资源跳转："+data;
	            callback();
	        },
	        error: function () {
	        	callback();
	        }
	    });
	}catch(e){
		callback();
	}
	
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}