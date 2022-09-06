var arr = new Array();
var xmlHttp;
var smilData;
var url = purchaseServer + '/PlayListRequest?assetId=';
function getAdTimeSeg() {
	getObj();
	var startTime = 0;
	var endTime = 0;
	var video = smilData.smil.body.seq.video;
	if( video instanceof Array) {
		for(var i = 0; i < video.length; i++) {
			var each = video[i].attributes;
			var videoBegin = parseInt(parseStr(each.clip_begin), 10);
			var videoEnd = parseInt(parseStr(each.clip_end), 10);
			var videoTrickMode = each.trickModeDisable;
			//alert(each+"*"+videoBegin+"*"+videoEnd+"*"+videoTrickMode);
			startTime = endTime;
			endTime += (videoEnd - videoBegin);
			if(videoTrickMode != ' ' && typeof (videoTrickMode) != 'undefined') {
				//alert("push: " + startTime+"-"+endTime+"-"+videoTrickMode);
				arr.push(startTime + "-" + endTime + "-" + videoTrickMode);
			}
		}
	}
}

function getObj() {
	var assetId = getGlobalVar("playAssetID");
	//得到返回地址
	//获取播放器当前播放的影片contentId
	var reqUrl = url + assetId;
	//alert("reqUrl"+reqUrl);
	getXmlHttp();
	request(reqUrl);
	smilData = smilData.replace(/-/g, '_');
	smilData = smilData.replace(/@/g, '');
	//alert("smilData replace after:" +smilData);
	eval("smilData = " + smilData);
}

function isExistAdTime(currentTime, keycode) {
	//alert("currentTime: " + currentTime);
	var mode = covertKey(keycode);
	for(var i = 0; i < arr.length; i++) {
		var startTime = parseInt(arr[i].split("-")[0], 10);
		var endTime = parseInt(arr[i].split("-")[1], 10);
		var trickMode = arr[i].split("-")[2];
		//alert("trickMode: "+ trickMode);
		if(currentTime >= startTime && currentTime <= endTime) {
			if(trickMode.indexOf(mode) >= 0) {
				return true;
			} else {
				return false;
			}
		}
	}
	return false;
}

function covertKey(val) {
	//alert("current key: " + val);
	var str = '';
	if(val == 46) {
		str = 'F';
	} else if(val == 44) {
		str = 'R';
	} else if(val == 68 || val == 65) {
		str = 'D';
	} else if(val == 59) {
		str = 'P';
	}
	return str;
}

function parseStr(timeStr) {
	var timeArr = timeStr.split("=");
	return timeArr[1].substring(0, timeArr[1].trim().length - 1);
}

function getXmlHttp() {
	if(window.XMLHttpRequest) {
		xmlHttp = new XMLHttpRequest();
	} else {
		xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
}

function request(reqUrl) {
	xmlHttp.onreadystatechange = getPlayList;
	xmlHttp.open("GET", reqUrl, false);
	xmlHttp.send(null);
}

function getPlayList() {
	if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
		smilData = xmlHttp.responseText;
	}
}