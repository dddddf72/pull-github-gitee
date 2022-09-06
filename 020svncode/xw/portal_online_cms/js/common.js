var epgUrl = "/iPG/T-nsp/";  //页面请求跳转URL前缀
var epgResUrl = "/iPG/T-nsp/res/default/";  //页面资源文件URL前缀
var picInfo = null;
var weatherInfo = null;
try{
    picInfo = Utility.getEnv("picSrc"); //天气预报
    weatherInfo = Utility.getEnv("weatherInfo");
}catch (e) {
    
}


//var portalIP = "172.30.11.71:8080";
//var portalPort = "8080";
//var portalIP = window.location.host;
//var portalIP = "172.30.0.50:8080";
var portalIP ='172.30.0.50:8080';
var portalSearchIP = '10.9.219.24:8080';
var portalId = "102";
var xmlHead = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>";
//var userId = "coship_test";
//var cardId = 9922000000148258;
var userId = getUserRelId();
var cardId = getSmartCardId();
var goUrl = location.href.split("/iPG")[0];
var defaultPic = "/iPG/T-nsp/res/default/images/show_pic.jpg";

var mapIP = "172.30.11.41";
var mapID = "554";

var searchColumnId = "MANU10000019007";
var collectColumnId = "MANU10000019009";

if(weatherInfo != null && weatherInfo.substr(0,5) == "00000")
{
	weatherInfo = decodeURI(weatherInfo);
	weatherInfo = weatherInfo.substring(5);
}

var npvrUrl="http://172.30.0.51:8081/npvr/";

//======================键值
var ZERO = 48;
var ONE = 49;
var TWO = 50;
var THREE = 51;
var FOUR = 52;
var FIVE = 53;
var SIX = 54;
var SEVEN = 55;
var EIGHT = 56;
var NINE = 57;
var KEY_NEXT = 34;
var KEY_PREV = 33;
var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
var KEY_UP = 38;
var KEY_ENTER = 13;
var KEY_BACK = 8;
var RETURN = 640;
var MENU = 468;//配合茁壮添加菜单键
var QUIT = 27;
var KEY_BLUE = 121;
var KEY_RED = 118;
var KEY_YELLOW = 120;
var KEY_GREEN = 119;
var MY_KEY_YELLOW = 405;

function $(_id){
	return document.getElementById(_id);
}

function getWeather(){
	if(picInfo=="undefined"){
		$("weatherPic").src="";
		weatherPic="";
	}else{
		$("weatherPic").src = picInfo;
		weatherPic=picInfo;
	}
	if(weatherInfo==""||weatherInfo.substring(0,9)=="undefined"){
		$("temperature").innerHTML = "";
		$("city").innerHTML="";
		weatherStr="";
	}else{
		$("temperature").innerHTML = weatherInfo;
		$("city").innerHTML="长春";
		weatherStr=weatherInfo;
	}
}

function getUserRelId()
{
    var userId;
    try 
    {
		userId = CITV.loginInfo.getValue("userId");
		if(userId == undefined){
			userId = CITV.loginInfo.userId;
			if(userId == null || userId == "" ){
				userId = 0;
			}
		}
    }
    catch (e) 
    {
        userId = 0;
    }
	return userId;  //正式运行使用
	//alert(userId);
 	//return 50008; //测试时使用ID
}

function getSmartCardId() {
    var smcId;
    var smartBox = isSmartBox();
    if (smartBox) {
        try {
            smcId = jsInterface.getSmartCard();

            if (smcId == null || smcId == "" || smcId == undefined) {
                smcId = "0000000000000000";
                return smcId;
            } else {
                //jsInterface.jsAlert("智能卡号："+smcId);
                return smcId;
            }
        } catch (e) {
            return "0000000000000000";
        }

    }else{
        try {

            smcId = CITV.loginInfo.getValue("smcId");
            if(smcId == undefined){
                smcId = CITV.loginInfo.smcId;
                if(smcId == null || smcId == "" ){
                    smcId = 0;
                }
            }
            return smcId;
        } catch (e) {
            return 0;
        }

	}

}

function getUserId(){
	return "50008";//9922000000148258;
}

function getPoster(imageList,width,height){
	var picUrl = defaultPic;
	var standard = 999999;
	if(imageList){
		for(var i = 0; i < imageList.length; i++){
			var imgUrl = imageList[i].posterUrl || imageList[i].displayUrl;
			getImgSize(imageList[i]);
			var distance = Math.sqrt((imageList[i].width - width)*(imageList[i].width - width) + (imageList[i].height - height)*(imageList[i].height - height));
			if(distance < standard){
				standard = distance;
				picUrl = goUrl+"/"+imgUrl;
			}
		}
	}
	return picUrl;
}

var buyOnlineSupport = true; //是否支持在线购买 fase 不支持, true 支持
try 
{
    Utility.setDrawFocusRing(0); //Coship.setDrawFocusRing(1);
}
catch (e) 
{
    if(typeof(Coship) != "undefined" && Coship != null){
        Coship.setDrawFocusRing(1);
    }
}

var tipFlag = false;
// 写 cookie
function setGlobalVar(sName, sValue)
{
    try{
       	sValue = sValue + "";
	    //Utility.setEnv(sName, escape(sValue));
		Utility.setEnv(sName, sValue);
    } 
    catch (e) 
    {
        document.cookie = escape(sName) + "=" + escape(sValue);
    }
}

// 读 cookie
function getGlobalVar(sName)
{
    var result = null;
    try 
    {
        //result = unescape(Utility.getEnv(sName));
		result = Utility.getEnv(sName);
		if(result == undefined)
			result = "";
    } 
    catch (e) 
    {
        var aCookie = document.cookie.split("; ");
        for (var i = 0; i < aCookie.length; i++) 
        {
            var aCrumb = aCookie[i].split("=");
            if (escape(sName) == aCrumb[0]) 
            {
                result = unescape(aCrumb[1]);
                break;
            }
        }
    }
    return result;
}

//----------------------  路径缓存操作 start---------------------------------------------------------
var urlSplitChar = "#"; //URL之间的分隔符，可配，但注意确保不会与URL参数重复
var urlPathGlobalName = "urlPathGlobalName"; //全局变量名
/*
 * 在有页面跳转动作时调用 ，用来保存当前页面的URL，URL 之间以 urlSplitChar 号分隔，
 * 调用此方法之前页面需要保存其它的变量需要自己操作
 */
function saveUrlPath()
{
    var tempUrl = getGlobalVar(urlPathGlobalName) == undefined ? "":getGlobalVar(urlPathGlobalName);//取全局变量
    tempUrl = tempUrl + urlSplitChar + location.href;//将已存在的路径和当前URL之间加上分隔符 
//    setReurnFlag("0");
    setGlobalVar(urlPathGlobalName, tempUrl);//保存 
}

function goReturnUrlPath()
{
    var tempUrl = getGlobalVar(urlPathGlobalName);//取全局变量
    var tuArr = tempUrl.split(urlSplitChar);
    var tl = tuArr.length;
    //tuArr.pop();
    var tul = tuArr.pop();
//    setReurnFlag("1");
    if (!tul || tul == "") 
    {
        tul = getGlobalVar("PORTAL_ADDR");
//      setReurnFlag("0");
    }
    var newUrl = tuArr.join(urlSplitChar);
    setGlobalVar(urlPathGlobalName, newUrl);
	Utility.setEnv("portal_Form",0);
    location.href = tul;
}

function clearUrlPath()
{
//    setReurnFlag("0");
    setGlobalVar(urlPathGlobalName, "");
}
// --------------------------------路径缓存操作 end -----------------------------------------------------------------

function get_time(){
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var week = "";
	var hour = date.getHours();
	var minute = date.getMinutes();
	if(month < 10) month = "0" + month;
	if(day < 10) day = "0" + day;	
	if(hour < 10) hour = "0" + hour;
	if(minute < 10) minute = "0" + minute;
	switch(date.getDay()){
		case 0: week = "星期日";break;
		case 1: week = "星期一";break;
		case 2: week = "星期二";break;
		case 3: week = "星期三";break;
		case 4: week = "星期四";break;
		case 5: week = "星期五";break;
		case 6: week = "星期六";break;
		}
	var day_ = year + "-" + month + "-" + day + "  "+ week ;
	var time_ = " " +hour + ":" + minute;
	//timeStr.string=year + "年 " + month + "月" + day + "日 " +" "+ week+" "+hour + ":" + minute;
	document.getElementById("time").innerHTML = day_+time_;
}

function showDateTime(){
	if(document.getElementById("time"))
	{
		get_time();
		setInterval(get_time,60000);	
	}
}

function goToSearch()
{
    //保存URL
	Utility.setEnv("portal_Form",0);
	setGlobalVar("textfield","");
	setGlobalVar("searchListFocus","");
	setGlobalVar("searchCurPage","");
    saveUrlPath();
	window.location.href=epgUrl+"search/search.htm";
}

function goToPortal()
{
    clearUrlPath(); //清除路径
    location.href = getGlobalVar("PORTAL_ADDR");
}

//我的空间
function goToMyZone()
{
    //保存URL
    saveUrlPath();
    window.location.href=epgUrl+"myzone/index.htm";
}

//收藏
//function onCollect(pmJson)
//{
//	var userId=getUserRelId();
//	if(userId==""){
//		location.href=epgUrl+"yytc/error_NoUserId.html";
//	}else{
//		var url = epgUrl + "Collect.do?userId=" + userId + "&catalogResourceId=" + pmJson.mainPmId + "&svstype=yytc&url=" + encodeURIComponent(location.href) + "&resourceId=" + pmJson.resourceId;
//		if(pmJson.isPack==1){//连续剧中要加入isPack=1
//    		url=url+"&isPack=1";
//		}
//		ajaxUrl(url,function(){
//			showInfo(xmlHttp.responseText); 
//		});
//	}
//}

function onCollect(pmJson){
    var columnId = "123";//栏目ID写死，保证folderAssetId的值不为空
    var custom = "VOD";
//    var userId = getUserRelId();
//    if (userId == "") {
//        location.href = epgUrl + "yytc/error_NoUserId.html";
//    }
//    else {
        ajaxXml({
            url: "http://" + portalIP + "/AddBookmark",
            method: "post",
            data: xmlHead + "<AddBookmark titleAssetId=\"" + pmJson.mainPmId + "\" custom=\"" + custom + "\" folderAssetId=\"" + columnId + "\" portalId=\"" + portalId + "\" client=\"" + cardId + "\" account=\"" + getUserRelId() + "\"/>",
            handler: function(xmlhttp){
                var resText = eval("(" + xmlhttp.responseText + ")");
                var bookmarkedId = resText.bookmarkedId;
                if (resText.code) {
                    //showMsg(tipUrl + "iPG/tip/a_collect.htm", "收藏已达到最大收藏记录数");
                    showInfo("收藏已达到最大收藏记录数");
                    return;
                }
                if (bookmarkedId == 0) {
                    var allsetName_char = pmJson.name.replace(/[^\x00-\xff]/g, "**");
                    var msg = '';
                    msg = "收藏节目(" + pmJson.name + ")成功！";
                    //showMsg(tipUrl + "iPG/tip/a_collect.htm", msg);\
                    showInfo(msg);
                }
                else {
                    var msg = resText.message;
                    showInfo(msg);
                }
            }
        });
//    }
}

var inputsStates ; // inputs 标签状态保存
var messInfoId = "tipWindow"; 
var lastObj; //弹出窗口之前有焦点的对象


//将页面上所有的标签都设为可用
function enabledAll()
{
	//所有 input 标签
	var inputs = document.getElementsByTagName("input");
	for(var i = 0; i < inputs.length; i++)
	{
		inputs[i].disabled = inputsStates[i];
	}
	//其它
}

//将页面上所有的标签都设为不可用
function disabledAll()
{
	//所有 input 标签
	var inputs = document.getElementsByTagName("input");
	inputsStates = new Array(inputs.length);
	for(var i = 0; i < inputs.length ; i++)
	{
		inputsStates[i] = inputs[i].disabled;
		inputs[i].disabled = true;
	}
	//其它
}

//显示提示信息,传入 空,弹出服务器忙的提示
function showInfo(msg)
{
    if(!tipFlag) // 如果当前已经没有弹出窗口,则需要保存当前焦点对象和面页按键的有效状态
	{
		lastObj = document.activeElement;
		disabledAll();
	}
	var obj = document.getElementById(messInfoId); 
	if(msg == "")
	{
		var url = epgUrl + "yytc/a_busyInfo.htm";
		ajaxUrl(url , function(x)
		{
			obj.style.display = "block";
			obj.innerHTML = x.responseText;
			if(document.getElementById("OKButton")) //弹出窗口确定按钮Id必须为 OKButton ,OKButton为弹出窗口专用ID
			{
				document.getElementById("OKButton").focus();	
			}
			tipFlag = true;
		}); 
	}
	else
	{	if(msg.indexOf("温馨提示")==-1){	//提示错误
				var url = epgUrl + "yytc/a_info.htm";
				ajaxUrl(url , function(x)
				{
					obj.style.display = "block";
					obj.innerHTML =x.responseText;
					//document.getElementById("message").innerHTML = msg;
					if(document.getElementById("message")){
  						 document.getElementById("message").innerHTML = msg;
					}
					if(document.getElementById("OKButton")) //弹出窗口确定按钮Id必须为 OKButton ,OKButton为弹出窗口专用ID
					{
						document.getElementById("OKButton").focus();	
					}
					tipFlag = true;
				});
		}else{				//收藏提示框
			obj.style.display = "block";
			obj.innerHTML =msg;
			if(document.getElementById("OKButton")) //弹出窗口确定按钮Id必须为 OKButton ,OKButton为弹出窗口专用ID
			{
				document.getElementById("OKButton").focus();	
			}
			tipFlag = true;
		}
	}
}

//关闭提示信息
function closeTip()
{
    var tipWindow = document.getElementById(messInfoId);
    if (tipWindow) 
    {
        tipWindow.style.display = "none";
        tipWindow.innerHTML = "";
		if(document.getElementById("message")){

   			document.getElementById("message").innerHTML = "";

		}
    }
    tipFlag = false;
	enabledAll();
	lastObj.focus();
}

//书签操作
//saveBookMark();
//保存书签

function saveBookMark()
{
	var breakPoint = getQueryStr(location.href,"vod_ctrl_breakpoint");
	if(breakPoint != undefined && breakPoint !="")
	{
		var pmId =getGlobalVar("BREAKPOINT_PMID"); //节目ID
		var subId = getGlobalVar("BREAKPOINT_SUBID"); // 获取子节目id，资源ID。若为连续剧，则为子资源包的ID
		setTimeout(function()
		{
            ajaxXml({
                url: "http://" + portalIP + "/AddSavedProgram",
                method: "post",
                data: xmlHead + "<AddSavedProgram  assetId=\"" + pmId + "\" resumePointDisplay=\"" + breakPoint + "\" folderAssetId=\"" + subId + "\" purchaseToken=\"" + 123 + "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + getUserRelId() +"\"/>",
                handler: function(xmlhttp){
					//这里加了书签后刷新页面。
                }
            });
		},1000);
	}
}

function checkBookMark(pmJson, playType){
	   var pmId =getGlobalVar("BREAKPOINT_PMID"); //节目ID
	  // alert(xmlHead + "<CheckSavedProgram assetId=\"" + pmId + "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + getUserRelId() +"\"/>");
	   ajaxXml({
                url: "http://" + portalIP + "/CheckSavedProgram",
                method: "post",
                data: xmlHead + "<CheckSavedProgram assetId=\"" + pmJson.mainPmId + "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + getUserRelId() +"\"/>",
                handler: function(xmlhttp){
					//这里加了书签后刷新页面。
		 var resText = eval("(" + xmlhttp.responseText + ")");
                var bookmarkFlag = resText.bookmarkFlag;
				//alert(bookmarkFlag);
				//alert(bookmarkFlag == 'false'); // true
				//alert(bookmarkFlag == 'true'); // false
				var breakTime=resText.timePosition;
				//alert(breakTime);
	if(bookmarkFlag == 'true') {
		//alert("点播");	alert("续看");
        var url = epgUrl + "yytc/a_breakTime.htm";
		//alert(url);
        ajax(url, function(resText){
            showInfo(resText);
            if (resText.indexOf("breakTime") != -1) {
                document.getElementById('OKButton').onclick = function(){
                    setGlobalVar("breakTime",breakTime);
                    doPlay(pmJson, 1,breakTime);
                };
                document.getElementById('cancle').onclick = function(){
                    setGlobalVar("breakTime", "0");
                    doPlay(pmJson, 0,breakTime);
                };
            }
        });
   
    }
    else {
		setGlobalVar("breakTime", "0");
        doPlay(pmJson, 0,breakTime);
    }
             }
       });
/*function xukan(){
	  alert("续看");
        var url = epgUrl + "yytc/a_breakTime.htm";
		alert(url);
        ajax(url, function(resText){
            showInfo(resText);
            if (resText.indexOf("breakTime") != -1) {
                document.getElementById('OKButton').onclick = function(){
                    setGlobalVar("breakTime",breakTime);
                    doPlay(pmJson, 1,breakTime);
                };
                document.getElementById('cancle').onclick = function(){
                    setGlobalVar("breakTime", "0");
                    doPlay(pmJson, 0,breakTime);
                };
            }
        });
	}*/
   /* if (pmJson.breakTime == "" || pmJson.breakTime == 0) {
		//alert("点播");
        setGlobalVar("breakTime", "0");
        doPlay(pmJson, 0);
    }
    else {
		//alert("续看");
        var url = epgUrl + "yytc/a_breakTime.htm";
        ajax(url, function(resText){
            showInfo(resText);
            if (resText.indexOf("breakTime") != -1) {
                document.getElementById('OKButton').onclick = function(){
                    setGlobalVar("breakTime", pmJson.breakTime);
                    doPlay(pmJson, 1);
                };
                document.getElementById('cancle').onclick = function(){
                    setGlobalVar("breakTime", "0");
                    doPlay(pmJson, 0);
                };
            }
        });
    }*/
}

//function showBreakTimeInfo(pmJson,playType,breakTime){
//	if(breakTime ==undefined || breakTime =="")
//	{
//		setGlobalVar("breakTime","0");
//		doPlay(pmJson, playType);
//	}
//	else
//	{
//		var url = epgUrl + "yytc/a_breakTime.htm";
//		ajax(url,function(resText){ 
//			showInfo(resText);
//			if(resText.indexOf("breakTime") != -1)
//			{
//				document.getElementById('OKButton').onclick = function ()
//				{
//					setGlobalVar("breakTime",breakTime);
//					doPlay(pmJson, playType);
//				};
//				document.getElementById('cancle').onclick = function ()
//				{
//					setGlobalVar("breakTime","0");
//					doPlay(pmJson, playType);
//				};
//			}
//		});	
//	}
//}


//==================================================新接口鉴权开始

var productJson = {
    "monthPrice": 0,
    "monthPriceTime": "",
    "monthPriceUnit": "",
    "MutiPrice": "",
    "MutiPriceTime": "",
    "MutiPriceUnit": "",
    "singlePrice": "",
    "singlePriceTime": "",
    "singlePriceUnit": "",
    "comeFrom": "",
    "implNum": "",
};

//检查是否购买
var checkBuyDelay;
function checkBuy(pmJson, playType){
    var head = "";
    if (pmJson.isPack == 1) {	//资源包鉴权
	  ///head = xmlHead + "<ValidatePlayEligibility productId=\"" + pmJson.productId + "\" serviceId =\"" + pmJson.goodsId + "\" assetId=\"" + pmJson.mainPmId + "\" portalId=\"" + portalId + "\" client=\"" + cardId + "\" account=\"" + userId + "\"/>";
        head = xmlHead + "<ValidatePlayEligibility productId=\"" + pmJson.productId + "\" assetId=\"" + pmJson.mainPmId + "\" portalId=\"" + portalId + "\" client=\"" + cardId + "\" account=\"" + getUserRelId() + "\"/>";
    }
    else {
        head = xmlHead + "<ValidatePlayEligibility  assetId=\"" + pmJson.mainPmId + "\" portalId=\"" + portalId + "\" client=\"" + cardId + "\" account=\"" + getUserRelId() + "\"/>";
    }
	//alert( xmlHead + "<ValidatePlayEligibility  assetId=\"" + pmJson.mainPmId + "\" portalId=\"" + portalId + "\"  account=\"" + getUserRelId() + "\" client=\"" + cardId + "\"/>");
    ajaxXml({
        url: "http://" + portalIP + "/ValidatePlayEligibility",
        method: "post",
        data: head,
        handler: function(xmlhttp){
            var resText = eval("(" + xmlhttp.responseText + ")");
            //alert(xmlhttp.responseText);
            
            if (resText.code) {
                var messageUrl = epgUrl + "yytc/a_info.htm";
                ajaxUrl(messageUrl, function(){
                   // alert(resText.message);
                    showInfo(resText.message);
                });
            }
            
            
            if (resText.orderFlag != "N") //已购买,执行播放
            {
                if(getGlobalVar("isGotopaly")!=1){
					checkBookMark(pmJson, playType);
				}else{
					doPlay(pmJson,0,0);
				}
            }
            else //未购买,执行购买
            {
                if (buyOnlineSupport)//支持在线购买
                {
                    if (pmJson.saleType == 1) {
                        showInfo("您好!你尚未订购此节目包，请到当地营业厅开通办理，详情咨询96633.");
                    }
                    else {
                        doBuy(pmJson, playType);
                    }
                }
                else {
                    //暂时未实现购买功能,直接弹出营业营购买
                    var messageUrl = epgUrl + "yytc/a_info.htm";
                    ajaxUrl(messageUrl, function(){
                        showInfo(xmlHttp.responseText);
                    });
                }
            }
        }
    });
}

//购买
function doBuy(pmJson, playType){
	var url = "";
    if (pmJson.saleType == 1 || pmJson.pkgChargeMode == 1) {
        //alert("购买");
        if (buyOnlineSupport) { //是否支持套餐在线购买
            productJson.comeFrom = "MONTH";
            if (pmJson.pkgChargeMode == 6) {
                productJson.implNum = 3;
            }
            else {
                productJson.implNum = 2;
            }
        }
        else {
            var messageUrl = epgUrl + "yytc/a_info.htm";
            ajaxUrl(messageUrl, function(){
                showInfo(xmlHttp.responseText);
            });
        }
    }
    else {
//        if (pmJson.saleType == 6) { 	//电视剧子集按次点播
//            productJson.comeFrom = "TELE";
//            productJson.implNum = 2;
//			
//        }
//        else {
            if (pmJson.saleType == 5 || pmJson.saleType == 6) { // 单片按次
                productJson.comeFrom = "VOD";
                productJson.implNum = 1;
                if (pmJson.saleType == 6) {
                    productJson.comeFrom = "TELE";
                    productJson.implNum = 2;
                }
				//alert(xmlHead + "<GetUpsellOffer serviceId=\"" + pmJson.goodsId + "\" portalId=\"" + portalId + "\" client=\"" + cardId + "\" account=\"" + getUserRelId() + "\"/>");
                ajaxXml({
                    url: "http://" + portalIP + "/GetUpsellOffer",
                    method: "post",
                    data: xmlHead + "<GetUpsellOffer serviceId=\"" + pmJson.goodsId + "\" portalId=\"" + portalId + "\" client=\"" + cardId + "\" account=\"" + getUserRelId() + "\"/>",
                    handler: function(xmlhttp){
                        var result = eval("(" + xmlhttp.responseText + ")");
						//alert(xmlhttp.responseText);
                        var price = result.displayPrice;
                        var priceTime = result.chargeTerm;//24
                        var chargeTermUnit = result.chargeTermUnit;//分钟 小时var priceUnit
                        var priceUnit = "";
                        switch (chargeTermUnit + "") {
                            case "0":
                                priceUnit = "分钟";
                                break;
                            case "1":
                                priceUnit = "小时";
                                break;
                            case "2":
                                priceUnit = "天";
                                break;
                            case "3":
                                priceUnit = "月";
                                break;
                            case "4":
                                priceUnit = "年";
                                break;
                            case "5":
                                priceUnit = "免费";
                                break;
                            case "6":
                                priceUnit = "部";
                                break;
                            case "7":
                                priceUnit = "次";
                                break;
                            case "8":
                                priceUnit = "秒";
                                break;
                            case "9":
                                priceUnit = "兆";
                                break;
                        }
                        productJson.singlePrice = price;
                        productJson.singlePriceTime = priceTime;
                        productJson.singlePriceUnit = priceUnit;
                        if (productJson.comeFrom == "VOD") {
                            //showPopupMessage(pmJson,"VOD",playType);
							if(isAnciSel=="1"){
								//isStop = false;
								//var url= "http://" + portalIP + "/iPG/T-nsp3/detail/showSel.html";
								/*if(getBrowserVersion()==0){//此部分为为茁壮方面的版本判断
									//alert(222);
									iPanel.overlayFrame.location.href ="http://172.30.11.71:8080/iPG/T-nsp3/detail/a_showSel.html?mainPmId="+pmJson.mainPmId+"&tmpPrice="+price+"&productId="+pmJson.productId+"&goodsId="+pmJson.goodsId;
								}else{
									 location.href = "http://" + portalIP + "/iPG/T-nsp3/detail/showSel.html";
								}*/
								showSelect(pmJson);
							}else showPopupMessage(pmJson,"VOD",playType);
                        }
                        else 
                            if (productJson.comeFrom == "TELE" || (productJson.comeFrom == "MONTH" && productJson.implNum == 3)) {
								showPopupMessage(pmJson,"TELE",playType);
                            }
                            else {
                            //		Buy.getMonthPrice();
                            }
                    }
                });
            }
//        }
    }
}

function showPopupMessage(pmJson, _flag, playType){
    productJson.implNum == "";
    productJson.comeFrom == "";
    if (_flag == "VOD" || _flag =="TELE") {
        var message = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您好！本节目点播价格为人民币" + productJson.singlePrice + "元，24小时之内可重复点播收看。是否播放?";
        var url = epgUrl + "yytc/a_buyTip.htm";
        ajaxUrl(url, function(){
            showInfo(xmlHttp.responseText);
            $("buyMessage").innerHTML = message;
            $("OKButton").onclick = function(){
                doBuyAction(pmJson, playType);
            };
        });
    }
    else 
        if (_flag == "TELE") {
        
        }
        else 
            if (_flag == "MONTH") {
                if (productJson.implNum == 2) {
                }
                else 
                    if (productJson.implNum == 3) {
                    }
            }
}

//function checkBuy(pmJson, playType)
//{
//	clearTimeout(checkBuyDelay);
//    var checkBuyUrl = "";
//    var pakgGoodsId = getGlobalVar("pakgGoodId");
//    pmJson.saleType = pmJson.saleType + "";
//	setGlobalVar("pakgGoodId","");
//	if(pakgGoodsId != ""){
//		pmJson.goodsId = pakgGoodsId;
//	}
//    switch (pmJson.saleType)
//    {
//      	case "2": // 套餐
//			checkBuyUrl = epgUrl + "CheckBuy.do?userId=" + getUserRelId() + "&svstype=yytc&goodsId=" + pmJson.goodsId+"&r=" + Math.random();
//            break;
//        case "1": // 单片 or 电视剧子集
//            checkBuyUrl = epgUrl + "CheckBuy.do?userId=" + getUserRelId() + "&svstype=yytc&catalogResourceId=" + pmJson.mainPmId + "&productId=" + pmJson.productId + "&goodsId=" + pmJson.goodsId + "&resourceId=" + pmJson.resourceId+"&r=" + Math.random();
//            break;
//    }
//    //检查是否购买
//    checkBuyDelay = setTimeout(function(){
//		ajaxUrl(checkBuyUrl, function(){
//			var resText = xmlHttp.responseText;
//			if (resText.indexOf("true")== 0) //已购买,执行播放
//			{
//				checkBookMark(pmJson,playType);
//			}
//			else //未购买,执行购买
//			 {
//
//				if (buyOnlineSupport)//支持在线购买
//				{
//					if(pmJson.saleType == 2){
//						showInfo("您好!你尚未订购此节目包，请到当地营业厅开通办理，详情咨询96633.");
//					}else{
//						doBuy(pmJson, playType);
//					}
//				}
//				else 
//				{
//					//暂时未实现购买功能,直接弹出营业营购买  
//					var messageUrl = epgUrl + "yytc/a_info.htm";
//					ajaxUrl(messageUrl, function()
//					{
//						showInfo(xmlHttp.responseText);
//					});
//				}
//			}
//    });},200);
//}

//function doBuy(pmJson, playType)
//{
//    var buyUrl;
//	if (pmJson.saleType == "1")// 
//    {
//      	if(pmJson.isPack + "" == "1") // 是电视剧资源包特有的属性
//		{
//			//doPopBuyInfo(pmJson, playType);
//			return;			
//		}
//		else
//		{
//	    	buyUrl = epgUrl + 'BuyTip.do?userId=' + getUserRelId() + '&goodsId=' + pmJson.goodsId + '&price=' + pmJson.price + '&svstype=yytc' + '&mainPmId=' + pmJson.mainPmId;			
//		}
//    }
//	// else //套餐
//    // {
//        // buyUrl = epgUrl + 'BuyTip.do?userId=' + getUserRelId() + '&goodsId=' + pmJson.goodsId + '&price=' + pmJson.price + '&svstype=yytcPack' + '&pmId=' + pmJson.resourceId;
//	// }
//    //执行请求
//    ajaxUrl(buyUrl, function()
//    {
//        var content = xmlHttp.responseText;
//        if (content.indexOf("buyPackTip") >= 0 || content.indexOf("buyTip") >= 0) 
//        {
//            showInfo(xmlHttp.responseText); 
//            buyUrl = "";
//			if (pmJson.saleType == "1")// 
//            {
//                //mainPmId 整部, pmId 当前集或电影, 不传mainPmId 只传 pmId  表示购买单集或电影,暂时未实现整部购买
//                buyUrl = epgUrl + "Buy.do?userId=" + getUserRelId() + "&goodsId=" + pmJson.goodsId + "&resourceId=" + pmJson.resourceId + "&svstype=yytc";
//            }
////			else  if (pmJson.saleType == "2") //套餐
////            {
////                buyUrl = epgUrl + "Buy.do?userId=" + getUserRelId() + "&goodsId=" + pmJson.goodsId + "&svstype=yytc";
////            }
//            //给当前请求回来的页面确定按键添加事件,购买  
//            document.getElementById("OKButton").onclick = function()
//            {
//                doBuyAction(pmJson,playType,buyUrl);
//            };
//        }
//    });
//}

//function doPopBuyInfo(pmJson, playType)
//{
//	var tempStr = "您好！你选择的影片还未定购，购买本集 " +pmJson.price + " 元，购买本部 " +pmJson.mainPrice + " 元。 请选择购买方式：<br/><br/>";
//				+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type ='button' value='购买本集' class='dialog_btn' id='buyOne'  >"
//				+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type ='button' value='购买本部' class='dialog_btn' id='buyAll'>";
//		
//	var url = epgUrl + "yytc/a_message.htm";
//    ajaxUrl(url, function(x)
//    { 
//		var arr = x.responseText.split("messageInfo");
//        var txt = arr[0] + tempStr + arr[1];  
//		showInfo(txt);		
//		document.getElementById('buyOne').onclick = function ()
//		{
//			doBuyAction(pmJson,playType,epgUrl + "Buy.do?userId=" + getUserRelId() + "&goodsId=" + pmJson.goodsId + "&resourceId=" + pmJson.resourceId + "&svstype=yytc");
//		};
//		document.getElementById('buyAll').onclick = function ()
//		{
//			doBuyAction(pmJson,playType,epgUrl + "Buy.do?userId=" + getUserRelId() + "&goodsId=" + pmJson.mainGoodsId + "&resourceId=" + pmJson.mainPmId + "&svstype=yytc");
//		};
//		document.getElementById('buyOne').focus(); 
//    });	
//}

//购买操作
function doBuyAction(pmJson, playType){
    var dataUrl;
	//alert(pmJson.saleType);
    if (pmJson.saleType == 1) { // 包月
        buyMode = 1;
        dataUrl = "<Purchase  serviceId=\"" + pmJson.goodsId + "\" portalId=\"" + portalId + "\"  buyMode=\"" + buyMode + "\" client=\"" + cardId + "\" account=\"" + getUserRelId() + "\"/>";
    }
    else
        if (pmJson.saleType == 5) { //  单片单次
            buyMode = 2;
            dataUrl = "<Purchase providerId=\"" + pmJson.productId + "\" portalId=\"" + portalId + "\" assetId=\"" + pmJson.mainPmId + "\" buyMode=\"" + buyMode + "\" serviceId=\"\" client=\"" + cardId + "\" account=\"" + getUserRelId() + "\"/>";
			//alert("<Purchase providerId=\"" + pmJson.productId + "\" portalId=\"" + portalId + "\" assetId=\"" + pmJson.mainPmId + "\" buyMode=\"" + buyMode + "\" serviceId=\"" + pmJson.goodsId + "\" client=\"" + cardId + "\" account=\"" + getUserRelId() + "\"/>");
        }
        else 
            if (pmJson.saleType == 6) { //整包单次     folderAssetId为电视剧的assectId
                buyMode = 3;
                dataUrl = "<Purchase serviceId =\"\" providerId=\"" + pmJson.productId + "\" folderAssetId=\"" + pmJson.mainPmId + "\" portalId=\"" + portalId + "\" buyMode=\"" + buyMode + "\" client=\"" + cardId + "\" account=\"" + getUserRelId() + "\"/>";
            }
	//alert("购买！");
	//alert(dataUrl);
    ajaxXml({
        url: "http://" + portalIP + "/Purchase",
        method: "post",
        data: xmlHead + dataUrl,
        handler: function(xmlhttp){
			var result = eval("(" + xmlhttp.responseText + ")");
			//alert(result.disableTime);
		if(result.code == "0") {
            var url = epgUrl + "yytc/a_buyok.htm";
            ajaxUrl(url, function(){
		showInfo(xmlHttp.responseText);
            	$("buyOkMessage").innerHTML = "订购成功，欣赏有效期至"+result.disableTime;
                //showInfo(xmlHttp.responseText);    
                $("OKButton").onclick = function(){
					//这里获取RTSP串
					closeTip();
					doPlay(pmJson,playType,0);
				}
            });
	    } else {
	        var errorMsg = result.message + "。 【 " + result.code + " 】";
	        //showMsg(tipUrl + "iPG/tip/a_errorTip.htm", errorMsg);
			showInfo(errorMsg);
	    }
		}
    });
}

function doPlay(pmJson, playType,breakTime) //获取点播RTSP串
{
   // alert("获取点播串");
    checkCA(1);
    var url = "";
    var head = "";
    if (playType == 1) { //续看
        head = "/SelectionResume";
        url = "<SelectionResume titleAssetId=\"" + pmJson.mainPmId + "\" fromStart=\"N\" portalId=\"" + portalId + "\" client=\"" + cardId + "\" account=\"" + getUserRelId() + "\"/>";
    }
    else { //正常播放
        head = "/SelectionStart"; //folderAssetId
        url = "<SelectionStart folderAssetId=\"" + pmJson.mainPmId + "\" titleAssetId=\"" + pmJson.mainPmId + "\" serviceId=\"\" portalId=\"" + portalId + "\" client=\"" + cardId + "\" account=\"" + getUserRelId() + "\"/>"
    }
    //alert(xmlHead + url);
    ajaxXmlP({
        url: "http://" + portalIP + head,
        method: "post",
        data: xmlHead + url,
        handler: function(xmlhttp){
            var result = eval("(" + xmlhttp.responseText + ")");
           // alert("获取串返回：：：" + xmlhttp.responseText);
            if (result.code) {
                showInfo(result.message);
                return;
            }
            purchaseToken = result.purchaseToken;
           // alert("purchaseToken:::" + purchaseToken);
             rtspUrl = result.rtsp+pmJson.resourceId;
			//alert("点播串返回：：："+rtspUrl);
            setGlobalVar("vod_play_type", "0");
            setGlobalVar("purchaseToken", purchaseToken);
            var backUrl = location.href;
            var index = backUrl.indexOf('&vod_ctrl_breakpoint');
            if (playType == 1) {
				rtspUrl = rtspUrl.replaceQueryStr(breakTime,"startTime");
				var endTime = "endTime=";
				rtspUrl = rtspUrl.replace("endTime=300",endTime);
				//alert(rtspUrl);
				//rtspUrl = rtspUrl.replaceQueryStr("0","endTime");
            }
            if (index > 0) {
                backUrl = backUrl.substring(0, index);
            }
			Utility.setEnv("portal_Form",0);
			setGlobalVar("BREAKPOINT_PMID", pmJson.mainPmId); // 保存节目id
			setGlobalVar("BREAKPOINT_SUBID", pmJson.resourceId); //保存节目栏目ID
			setGlobalVar("vod_ctrl_rtsp", encodeURIComponent(rtspUrl));
			setGlobalVar("displayName", pmJson.name);
            setGlobalVar("vod_ctrl_backurl", backUrl);
            setGlobalVar("isBack", "Y");
            var goUrl = "vodctrl/vodplay.html";
            location.href = goUrl;
        }
    });
    //
    //	checkCA(1);
    //	var url;
    //	setGlobalVar("BREAKPOINT_PMID", pmJson.resourceId); // 保存节目id
    //	setGlobalVar("BREAKPOINT_SUBID", pmJson.resourceId);
    //	setGlobalVar("displayName",pmJson.name);
    //	Utility.setEnv("portal_Form",0);
    //	var pmId = pmJson.resourceId;
    //	var mainPmId = pmJson.mainPmId;
    //	if (pmId + "" == mainPmId + "") 
    //    {
    //        pmId = "0";
    //    }
    //    var mpiPara = (mainPmId == "" ) ? "" : "&mainPmId=" + mainPmId;
    //    var url = epgUrl + "Play.do?userId=" + getUserRelId() + "&pmId=" + pmId + "&noAuth=N&svstype=yytc" + mpiPara;
    //	if(playType == "1")
    //	{
    //		var breakTime = getGlobalVar("breakTime") =="" || getGlobalVar("breakTime") == "undefined"?"0":getGlobalVar("breakTime");
    //		url = url + "&beginTime="+breakTime;
    //	}
    //	setGlobalVar("vod_play_url", url);
    //    ajaxUrl(url,ajaxCallBack);
}

function ajaxXmlP(param) {
    var url = param.url+"?dataType=json";
    var method = param.method;
    var data = param.data;
    var handler = param.handler;
    var xmlHttp = CreateXMLHttp(method);
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) { // 已收到响应
            if (xmlHttp.status == 200) { // 请求成功
                handler(xmlHttp);
            }else{
            }
        }
    };
    xmlHttp.open(method, url, true);
    if (method.toLowerCase() == "post") {
        xmlHttp.setRequestHeader("Content-Type","application/xml");
        xmlHttp.send(data);
    } else {
        xmlHttp.send(null);
    }
}

//购买操作
//function doBuyAction(pmJson,playType,buyUrl)
//{
//	ajaxUrl(buyUrl, function()
//    {
//        showInfo(xmlHttp.responseText);
//        if (xmlHttp.responseText.indexOf("buyOk")!=-1) // buyOk 是购买成功跳转页中的标识
//        {
//            //给当前请求回来的页面确定按键添加事件,播放
//            document.getElementById("OKButton").onclick = function()
//            {
//				setGlobalVar("breakTime","0");
//                doPlay(pmJson, playType);
//            };
//        }
//    });
//}

/*pmJson 影片JSON{mainPmId:'',resourceId:'',goodsId:'',productId'',saleType:'',isPack:'',name:'',price:'',breakTime:'',noAuth:'Y',time:''}*/
//playType 播放类型 0 正常, 1 续播
function onPlayAction(pmJson, playType) //播放请求,需要作鉴权,购买等一系列操作
{
    checkCA(1); //后续要放开
    if (playType == undefined || playType == "") //默认 直接播放
    {
        playType = "0";
    }
    var pakgSaleType = getGlobalVar("pakgSaleType");
    if (pakgSaleType == 2) {
        pmJson.saleType = pakgSaleType;
    }
    setGlobalVar("pakgSaleType", "");
    if (pmJson.saleType == 3) // saleType :99 为免费类型 , 
    {
        //checkBookMark(pmJson, playType);//免费直接执行播放
		if(getGlobalVar("isGotopaly")!=1){
			checkBookMark(pmJson, playType);
		}else{
			doPlay(pmJson,0,0);
		}
    }
    else {
        checkBuy(pmJson, playType);//检查是否购买,如果已购买,则执行播放,如果未购买,则执行购买操作
    }
}

function doTvPlay(pmJson){
    ajaxXml({
        url: "http://" + portalIP + "/ChannelSelectionStart",
        method: "post",
        data: xmlHead + "<ChannelSelectionStart portalId=\"" + portalId + "\" client=\"" + cardId + "\" account=\"" + getUserRelId() + "\" channelId=\"" + pmJson.channelId + "\" assetId=\"" + pmJson.resourceId + "\"/>",
        handler: function(xmlhttp){
           // alert(xmlhttp.responseText);
            var temp = eval("(" + xmlhttp.responseText + ")")
            rtspUrl = temp.rtsp;
            if (temp.code) {
                showInfo(temp.message);
            }
            else {
                if (rtspUrl != "") {
                    setGlobalVar("vod_play_type", "0");
                    setGlobalVar("vodplaytype", "timeshift");
                    setGlobalVar("vod_ctrl_rtsp", encodeURIComponent(rtspUrl));
                    setGlobalVar("displayName", pmJson.name);
                    setGlobalVar("vod_ctrl_backurl", location.href);
                    location.href = epgUrl + "vodctrl/vodplay.htm";
                }
                else {
                    showInfo("系统繁忙！请稍后重试");
                }
            }
        }
    });
}

//回看播放
//function doTvPlay(pmJson)
//{
//	var url;
//	if(pmJson.noAuth == undefined || pmJson.noAuth == "")
//	{
//		pmJson.onAuth = "N";
//	}
//	url = epgUrl + "VodPlay.do?userId=" + getUserRelId() + "&noAuth=" + pmJson.noAuth + "&pmId=" + pmJson.resourceId + "&channelId=" + pmJson.channelId + "&svstype=play&serviceCode=BTV";
//    var tfn = function(obj)
//    {
//	    ajaxUrl(url, function(x)
//        {
//            var content = x.responseText;
//            if (content.indexOf("^_^") >= 0)//获取rtsp串成功 
//            {
//				var str = content.split(";"); 
//				setGlobalVar("vod_play_type", "0");
//				setGlobalVar("vodplaytype","timeshift");
//				setGlobalVar("vod_ctrl_rtsp", encodeURIComponent(str[0].substring(3)));
//				setGlobalVar("displayName", pmJson.name);
//				setGlobalVar("vod_ctrl_backurl", location.href);
//				location.href = epgUrl + "vodctrl/vodplay.htm";
//            }
//            else //获取失败，将内容显示在对话框中显示出来 
//            {
//				showInfo(content);
//            }
//        });
//    }(this);
//}

/* 点播播放  pmJson 影片JSON{mainPmId:'',resourceId:'',goodsId:'',productId'',saleType:'',isPack:'',name:'',price:'',breakTime:'',noAuth:'Y',time:''}*/
//playType 播放类型 0 正常, 1 续播
//function doPlay(pmJson,playType)
//{
//	checkCA(1);
//	var url;
//	setGlobalVar("BREAKPOINT_PMID", pmJson.mainPmId); // 保存节目id
//	setGlobalVar("BREAKPOINT_SUBID", pmJson.resourceId);
//	setGlobalVar("displayName",pmJson.name);
//	Utility.setEnv("portal_Form",0);
//	var pmId = pmJson.resourceId;
//	var mainPmId = pmJson.mainPmId;
//	if (pmId + "" == mainPmId + "") 
//    {
//        pmId = "0";
//    }
//    var mpiPara = (mainPmId == "" ) ? "" : "&mainPmId=" + mainPmId;
//    var url = epgUrl + "Play.do?userId=" + getUserRelId() + "&pmId=" + pmId + "&noAuth=N&svstype=yytc" + mpiPara;
//	if(playType == "1")
//	{
//		var breakTime = getGlobalVar("breakTime") =="" || getGlobalVar("breakTime") == "undefined"?"0":getGlobalVar("breakTime");
//		url = url + "&beginTime="+breakTime;
//	}
//	setGlobalVar("vod_play_url", url);
//    ajaxUrl(url,ajaxCallBack);
//}

//-------------------------------------ajax请求-----------------------------
var xmlHttp;
function ajaxUrl(url, callbackfun)
{
    xmlHttp = GetXmlHttpObject(eval(callbackfun));
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

function GetXmlHttpObject(handler)
{
    var objXmlHttp = null ;
		if (window.XMLHttpRequest) {
		objXmlHttp = new XMLHttpRequest();
	} else {
		if (window.ActiveXObject) {
			objXmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	objXmlHttp.onreadystatechange = function () {
		if (objXmlHttp.readyState == 4) {
			if (objXmlHttp.status == 200) 
			{
				handler(xmlHttp);
			}else
			{
				showInfo(""); //超时间方法,传入空会自动弹出服务器忙的提示
			}
		}
	};
	return objXmlHttp; 
}

function ajax(url, handler) {//ajax请求
    var xmlHttp;
    if (window.XMLHttpRequest) xmlHttp = new XMLHttpRequest();
    else if (window.ActiveXObject) xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4) {// 已收到响应
            if (xmlHttp.status == 200 || xmlHttp.status == 0) {// 请求成功
                handler(xmlHttp.responseText);
            } else {
                showInfo("");
            }
        }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

//ajax 返回参数处理函数,这个方法不可重载,如需要重载,可以在当前页面重新定义 doAjaxCallBack 函数
function ajaxCallBack()
{
    var resText = xmlHttp.responseText;
    if (resText.indexOf("^_^") == 0) //播放操作
    {
        var str = resText.split(";");
        setGlobalVar("vod_play_type", "0");
       // setGlobalVar("displayName", encodeURIComponent(str[1].substring(str[1].indexOf("=") + 1)));
        setGlobalVar("vod_ctrl_rtsp", encodeURIComponent(str[0].substring(3)));
        var backUrl = location.href;
        var index = backUrl.indexOf('&vod_ctrl_breakpoint');
        if (index > 0)
        {
            backUrl = backUrl.substring(0, index);
        }
        setGlobalVar("vod_ctrl_backurl", backUrl);
        setGlobalVar("isBack", "Y"); 
        location.href = epgUrl + "vodctrl/vodplay.htm";
    }
	else if(resText.indexOf("playErrorInfo") != -1)
	{
		showInfo(resText);
	}
    else 
    {
        //调用默认返回值处理函数
		doAjaxCallBack(resText);
    }
}

function ajaxCallBackPm()//用于主页获取图片
{
    var resText = xmlHttp.responseText;
        //调用默认返回值处理函数
		doAjaxCallBackPm(resText);
} 

function subText(str,sub_length,num){		//汉字与字符都都在时截取长度
	var temp1 = str.replace(/[^\x00-\xff]/g,"**");
	var temp2 = temp1.substring(0,sub_length);   
	var x_length = temp2.split("\*").length - 1 ;
	var hanzi_num = x_length /2 ;
	sub_length = sub_length - hanzi_num ;//实际需要sub的长度是总长度-汉字长度  
	var res = str.substring(0,sub_length); 
	if(num==0){
		if(sub_length < str.length ) res = res+"...";
			return res;
	}else{
		if(sub_length < str.length ){
			return "<marquee scrollLeft='1' behavior='scroll' direction='left' scrollamount='6' scrolldelay='200'>"+str+"</marquee>";
		}else{
			return str;   
		}
	}
}

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

function dateFormat(date){
	var dataArr=date.split(".");
	var dateStr="";
	for(i=0;i<dataArr.length;i++){
		dateStr+=dataArr[i];
	}
	dateStr+="000000";
	return dateStr;
}

//参数格式：{url: "", method: "get", data: "", handler: fun}
function ajaxXml(param) {
	var url = param.url;
	var method = param.method;
	var data = param.data;
	var handler = param.handler;
	var xmlHttp = CreateXMLHttp(method);
	xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) { // 已收到响应
            if (xmlHttp.status == 200) { // 请求成功
                handler(xmlHttp);
            }else{
			}
        }
    };
	xmlHttp.open(method, url, true);
	if (method.toLowerCase() == "post") {
		xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xmlHttp.send(data);
	} else {
		xmlHttp.send(null);
	}
}
//ajax区分同步异步
function ajaxXmlSync(param) {
	var url = param.url;
	var method = param.method;
	var data = param.data;
	var handler = param.handler;
	var isAsync = param.isAsync;
	var xmlHttp = CreateXMLHttp(method);
	xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) { // 已收到响应
            if (xmlHttp.status == 200) { // 请求成功
                handler(xmlHttp);
            }else{
			}
        }
    };
	xmlHttp.open(method, url, isAsync);
	if (method.toLowerCase() == "post") {
		xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xmlHttp.send(data);
	} else {
		xmlHttp.send(null);
	}
}
//创建XMLHttpRequest对象
function CreateXMLHttp(method){
    if (window.XMLHttpRequest) {
        XMLHttp = new XMLHttpRequest();
        if (XMLHttp.overrideMimeType && method.toLowerCase() == "post") {
            XMLHttp.overrideMimeType('text/xml');
        }
    }
    else 
        if (window.ActiveXObject) {
            var ActiveXObj = ['Microsoft.XMLHTTP', 'MSXML.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.7.0', 'Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.5.0', 'Msxml2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP'];
            for (var i = 0; i < ActiveXObj.length; i++) {
                try {
                    XMLHttp = new ActiveXObject(ActiveXObj[i]);
                    if (XMLHttp) {
                        return XMLHttp;
                    }
                } 
                catch (e) {
                }
            }
        }
    return XMLHttp;
}

function substringText(str,sub_length,targerElementName,num,scrollElementwidth)//hxf add
{
	var timeFlag = 0;
	var txtSpan1 = "";
	var txtSpan2 = "";
	var windowDiv  = "";
	var topDiv =  "";
	var fontSize = 24; //当前元素限定字体的大小
	var textLength = 0;
	var speed = 30; // 滚动的速度

	function doWithString(str,sub_length,targerElementName,num)
	{		//汉字与字符都都在时截取长度
		var temp1 = str.replace(/[^\x00-\xff]/g,"**");
		var temp2 = temp1.substring(0,sub_length);   
		var x_length = temp2.split("\*").length - 1 ;
		var hanzi_num = x_length /2 ;
		sub_length = sub_length - hanzi_num ;//实际需要sub的长度是总长度-汉字长度  
		var res = str.substring(0,sub_length); 
		if(num==0)
		{
			if(sub_length < str.length ) 
			{
				res = res+"...";
				createNormalDiv(targerElementName,res);   
			}else
			{
				createNormalDiv(targerElementName,str);   
			}
		}else
		{
			if(sub_length < str.length )
			{
				createScrollDiv(targerElementName,str);
			}else
			{
				createNormalDiv(targerElementName,str);   
			}
		}
	}
	function createNormalDiv(targerElementName,text)
	{
		topDiv = document.getElementById(targerElementName);
		var childNodes = topDiv.getElementsByTagName("div");
		if(childNodes.length > 0)
		{
			for(var i=0; i<childNodes.length; i++)
			{
				topDiv.removeChild(childNodes[i]);
			}
		}
		windowDiv = document.createElement("div");
		if( num == 0 )
		{
		windowDiv.style.fontSize="22px";
		}else
		{
		windowDiv.style.fontSize="24px";
		}
		windowDiv.innerHTML = text;
		topDiv.appendChild(windowDiv);
	}
	function createScrollDiv(divName,text)
	{
		initElement(divName,text);
		window.setInterval(Marquee,speed);
	}
	function initElement(divName,text)
	{
		textLength = text.replace(/[^\x00-\xff]/g,"**").length;
		topDiv = document.getElementById(divName);
		var childNodes = topDiv.getElementsByTagName("div");
		if(childNodes.length > 0)
		{
			for(var i=0; i<childNodes.length; i++)
			{
				topDiv.removeChild(childNodes[i]);
			}
		}
		windowDiv = document.createElement("div");
		txtSpan1 = document.createElement("span");
		txtSpan2 = document.createElement("span");

		windowDiv.appendChild(txtSpan1);
		windowDiv.appendChild(txtSpan2);
		topDiv.appendChild(windowDiv);
		
		windowDiv.style.position = "absolute";
		//windowDiv.style.width = topDiv.offsetWidth + "px"; //hxf del
		//hxf add start
		if(scrollElementwidth){
			windowDiv.style.width = scrollElementwidth + "px";
		} else {
			windowDiv.style.width = topDiv.offsetWidth + "px";
		}
		//hxf add end
		windowDiv.style.height = topDiv.offsetHeight + "px";
		windowDiv.style.overflow = "hidden";
		
		txtSpan1.innerHTML = text;
		txtSpan1.style.float = "left";
		txtSpan1.style.textAlign="left";
		txtSpan1.style.width = fontSize*textLength/2  + windowDiv.offsetWidth + "px";
		txtSpan1.style.display = "block";
		txtSpan1.style.wordWrap = "normal";
		txtSpan1.style.overflow = "hidden";
		
		txtSpan2.innerHTML = text;
		txtSpan2.style.position = "absolute";
		txtSpan2.style.textAlign="left";
		txtSpan2.style.left = windowDiv.offsetWidth + "px";
		txtSpan2.style.width = fontSize*textLength/2  + windowDiv.offsetWidth + "px";
		txtSpan2.style.display = "none";
	}
	function Marquee()
	{
		if(timeFlag == 0)
		{
			if(txtSpan1.offsetWidth - windowDiv.offsetWidth - windowDiv.scrollLeft<=0)
			{
				txtSpan1.style.display = "none";
				txtSpan2.style.display = "block";
				windowDiv.scrollLeft = 0;
				timeFlag = 1;
			}else
			{
				windowDiv.scrollLeft++;
			}
		}else
		{
			if(txtSpan2.offsetWidth - windowDiv.scrollLeft<=0)
			{
				windowDiv.scrollLeft = 0;
			}else
			{
				windowDiv.scrollLeft++;
			}
		}
	}
	doWithString(str,sub_length,targerElementName,num);
}

function getQueryStr(url, param)
{
    var rs = new RegExp("(^|)" + param + "=([^\&]*)(\&|$)", "gi").exec(url), tmp;
    if (tmp = rs) 
        return tmp[2];
    return "";
}

String.prototype.replaceQueryStr = function(replaceVal, searchStr)
{
    var restr = searchStr + "=" + replaceVal;
    var rs = new RegExp("(^|)" + searchStr + "=([^\&]*)(\&|$)", "gi").exec(this), tmp;
    var val = null;
    if (tmp = rs) 
        val = tmp[2];
    if (val == null) 
    {
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
 
var serviceCode = getQueryStr(location.href, "serviceCode");
var svstype = getQueryStr(location.href, "svstype");


function checkCA(flag) {
    if(flag == "" || flag == undefined){
        return;
    }
    var userId;
    var CANumber = CA.serialNumber;
    userId = CITV.loginInfo.getValue("userId");
    if(userId == undefined) {
        userId = CITV.loginInfo.userId;
    }
    if(CANumber == "" || CANumber == undefined || userId == "" || userId == undefined) {
        if(flag == 1){
            location.href = epgUrl + "yytc/error_NoUserId.html";
        }
        return;
    }
}

//页面做分页处理时，最大页码和最大页的size
function getMaxPage(pagelength,pageSize){//求最大页数
	if(pagelength == 0 || pagelength == undefined) return 0;
	if(pagelength % pageSize != 0) return Math.ceil(pagelength / pageSize);
	else return pagelength / pageSize;
}

function getMaxPageSize(pagelength,pageSize){//求为最大页数时pagesize
	if(pagelength == 0 || pagelength == undefined) return 0;
	if(pagelength % pageSize != 0)return pagelength % pageSize;
	else return pageSize;
}

//**************************推荐位海报*********************************************
/*function showRec(recSize,num){   //recSize为显示海报的个数，num为截取的字符
	for (var i = 0; i < recSize; i++) {
		if (i < recJson.pmList.length) {
			if(recJson.pmList[i].picsrc.length == 0){
				$("pic_" + i).src = epgResUrl+"images/show_pic.jpg";
			}else if(recJson.pmList[i].picsrc.length == 1){
				$("pic_"+i).src = recJson.pmList[i].picsrc[0].src;
			}else{
				$("pic_"+i).src =getPosters(recJson.pmList[i]);
			}
			$("resText_"+i).innerHTML=subText(recJson.pmList[i].name,num,0);
		}else{
			$("pic_"+i).src = epgResUrl+"images/show_pic.jpg";
			$("resText_"+i).innerHTML="";
		}
	}
}*/

//以下部分需要注意：此处修改仅为了测试需要，读取商用服务器海报图片，从测试转为商用后需要将其移除。2011.12.16 lizhe
function showRec(recSize,num){
	for (var i = 0; i < recSize; i++) {
		if (i < recJson.pmList.length) {
			if(recJson.pmList[i].picsrc.length == 0){
				$("pic_" + i).src = epgResUrl+"images/show_pic.jpg";
			}else if(recJson.pmList[i].picsrc.length == 1){
                $("pic_" + i).src = goUrl + "/" + recJson.pmList[i].picsrc[0].src;
				//alert("http://172.30.11.72:8080/" + recJson.pmList[i].picsrc[0].src);
			}else{
				$("pic_"+i).src = "http://172.30.11.72:8080/" + getPosters(recJson.pmList[i]);
			}
			substringText(recJson.pmList[i].name, num, "resText_" + i, 0);
			//$("resText_"+i).innerHTML=subText(recJson.pmList[i].name,num,0);
		}else{
			$("pic_"+i).src = epgResUrl+"images/show_pic.jpg";
			$("resText_"+i).innerHTML="";
		}
	}
}

function getPosters(obj){
	if(parseInt(obj.picsrc[0].width) > parseInt(obj.picsrc[1].width)){
		return obj.picsrc[0].src;
	}else{
		return obj.picsrc[1].src;
	}
}

var MoveRec = function(_config){
    this.data = _config.data || "";
    this.size = _config.size || 2;
    this.length = this.data.length;
    this.focusId = _config.focusId || "";
    this.focusIndex = _config.focusIndex || 0;
    this.onFocus = _config.onFocus || this._blank;
    this.onBlur = _config.onBlur || this._blank;
    this.focusCssName = _config.cssName || "";
    this.blurCssName = _config.blurName || "";
    this.num = _config.num || 8;
    this.numPic = _config.numPic || ""
    this.showSize = this.size > this.length ? this.length : this.size;
};

MoveRec.prototype = {
    move : function(offset){
        if(this.length == 0) {
            return;
        }
        this.setBlur();
        this.focusIndex += offset;
        if(this.focusIndex > this.showSize - 1) {
            this.focusIndex = this.showSize - 1;
        } else if(this.focusIndex < 0) {
            this.focusIndex = 0;
        }
        this.setFocus();
    },
    setBlur : function() {
        this.onBlur(this.focusIndex);
        if(this.focusId && this.focusCssName) {
            $(this.focusId + this.focusIndex).className = this.blurCssName;
        }               
    },
    setFocus : function() {
        this.onFocus(this.focusIndex);
        if(this.focusId && this.focusCssName) {
            $(this.focusId + this.focusIndex).className = this.focusCssName;
        }
    }, 
    _blank : function(){}
};

function recomdBlur(focusIndex){
    substringText(recJson.pmList[focusIndex].name, recObj.num, "resText_" + focusIndex, 0);
    $("resText_" + focusIndex).className = "";
    $("num_" + focusIndex).src = epgResUrl + "images/" + recObj.numPic + (focusIndex + 1) + ".png";
}

function recomdFocus(focusIndex){
    substringText(recJson.pmList[focusIndex].name, recObj.num, "resText_" + focusIndex, 1);
    $("resText_" + focusIndex).className = "resfocus";
    $("num_" + focusIndex).src = epgResUrl + "images/focus_" + recObj.numPic + (focusIndex + 1) + ".png";
}

function changePage(cateId,pageSize,curPage,type) //翻页
{
	var listUrl = epgUrl + "MoviePm.do?userId="+ getUserId() + "&svstype=pmlist&cateId=" + cateId + "&pageSize=" + pageSize + "&curPage=" + curPage + "&toPage=" + type;
	ajaxUrl(listUrl,ajaxCallBack);
	if(type == "prev"){
		curPage --;
	}else{
		curPage ++;
	}
}

//*****************************进入列表页************************************
function goToList(type,cateId,hasChild)     //通过cateId进入列表页面
{
	saveUrlPath();
	var listUrl = epgUrl + "MoviePm.do?userId=" + getUserId() + "&svstype="+ type + "&cateId="+cateId;
	if(hasChild == 1) listUrl = listUrl + "&subCateId=0";   //带子栏目
	location.href = listUrl;
}

//*****************************进入详情**************************************
function goToDetail(pmJson,flag)
{
	saveUrlPath();//保存URL
	var tempIsPack = pmJson.isPackage + "";
	switch (tempIsPack)
	{
	   case "1":   //进入连续剧详情
			setGlobalVar("jc_detailCate",$("titleDiv").innerHTML);     //电视剧场栏目
//			if(flag){   //从播放按钮进入
				//location.href = epgUrl + "MovieDetail.do?userId=" + getUserId() + "&svstype=dsjc_detail&pmId=" + pmJson.mainPmId;
				location.href = "/iPG/T-nsp/yyjc/jc_detail.htm?providerId="+pmJson.providerId+"&titleAssetId=" + pmJson.mainPmId +"&folderAssetId="+pmJson.folderAssetId;
//			}else{     //从详情按钮进入
//				location.href = epgUrl + "MovieDetail.do?userId=" + getUserId() + "&svstype=dsjc_des_detail&pmId=" + pmJson.mainPmId;
//			}
		   break;
	   case "0":  //进入单片详情
			setGlobalVar("yy_detailCate",$("titleDiv").innerHTML);    //影院栏目
			//location.href = epgUrl + "MovieDetail.do?userId=" + getUserId() + "&svstype=jtyy_detail&pmId=" + pmJson.mainPmId;
			location.href = "/iPG/T-nsp/yyjc/yy_detail.htm??providerId="+pmJson.providerId+"&titleAssetId=" + pmJson.mainPmId+"&folderAssetId="+pmJson.folderAssetId;
		   break;
	}
}
function goToDetailYY(pmJson,flag)
{
	saveUrlPath();//保存URL
	var tempIsPack = pmJson.isPackage + "";
	switch (tempIsPack)
	{
	   case "1":   //进入连续剧详情
			setGlobalVar("jc_detailCate",$("titleDiv").innerHTML);     //电视剧场栏目
//			if(flag){   //从播放按钮进入
				//location.href = epgUrl + "MovieDetail.do?userId=" + getUserId() + "&svstype=dsjc_detail&pmId=" + pmJson.mainPmId;
				location.href = "/iPG/T-nsp/yyjc/jc_detail.htm?providerId="+pmJson.providerId+"&titleAssetId=" + pmJson.assetId +"&folderAssetId="+pmJson.folderAssetId;
//			}else{     //从详情按钮进入
//				location.href = epgUrl + "MovieDetail.do?userId=" + getUserId() + "&svstype=dsjc_des_detail&pmId=" + pmJson.mainPmId;
//			}
		   break;
	   case "0":  //进入单片详情
			setGlobalVar("yy_detailCate",$("titleDiv").innerHTML);    //影院栏目
			//location.href = epgUrl + "MovieDetail.do?userId=" + getUserId() + "&svstype=jtyy_detail&pmId=" + pmJson.mainPmId;
			location.href = "/iPG/T-nsp/yyjc/yy_detail.htm??providerId="+pmJson.providerId+"&titleAssetId=" + pmJson.assetId +"&folderAssetId="+pmJson.folderAssetId;
		   break;
	}
}

//传入一级栏目ID
function goToDetailYY(pmJson,flag,firstColumnId)
{
	saveUrlPath();//保存URL
	var tempIsPack = pmJson.isPackage + "";
	switch (tempIsPack)
	{
	   case "1":   //进入连续剧详情
			setGlobalVar("jc_detailCate",$("titleDiv").innerHTML);     //电视剧场栏目
				location.href = "/iPG/T-nsp/yyjc/jc_detail.htm?providerId="+pmJson.providerId+"&titleAssetId=" + pmJson.assetId +"&folderAssetId="+pmJson.folderAssetId+"&firstColumnId="+firstColumnId;
		   break;
	   case "0":  //进入单片详情
			setGlobalVar("yy_detailCate",$("titleDiv").innerHTML);    //影院栏目
			location.href = "/iPG/T-nsp/yyjc/yy_detail.htm??providerId="+pmJson.providerId+"&titleAssetId=" + pmJson.assetId +"&folderAssetId="+pmJson.folderAssetId+"&firstColumnId="+firstColumnId;
		   break;
	}
}

function goToDetailMFnew(pmJson,flag,firstColumnId)
{
	saveUrlPath();//保存URL
	var tempIsPack = pmJson.isPackage + "";
	switch (tempIsPack)
	{
	   case "1":   //进入连续剧详情
			setGlobalVar("jc_detailCate",$("titleDiv").innerHTML);     //电视剧场栏目
			var tmpTitleFull = pmJson.titleFull;
			if(tmpTitleFull.indexOf("体验版")>=0){
				location.href = "/iPG/T-nsp/yyjc/mf_detail.htm?providerId="+pmJson.providerId+"&titleAssetId=" + pmJson.assetId +"&folderAssetId="+pmJson.folderAssetId+"&firstColumnId="+firstColumnId;
			}else{
				location.href = "/iPG/T-nsp/yyjc/mf_jdetail.htm?providerId="+pmJson.providerId+"&titleAssetId=" + pmJson.assetId +"&folderAssetId="+pmJson.folderAssetId+"&firstColumnId="+firstColumnId;
			}
			
				//location.href = "/iPG/T-nsp/yyjc/mf_detail.htm?providerId="+pmJson.providerId+"&titleAssetId=" + pmJson.assetId +"&folderAssetId="+pmJson.folderAssetId;
		   break;
	   case "0":  //进入单片详情
			setGlobalVar("yy_detailCate",$("titleDiv").innerHTML);    //影院栏目
			location.href = "/iPG/T-nsp/yyjc/yy_detail.htm??providerId="+pmJson.providerId+"&titleAssetId=" + pmJson.assetId +"&folderAssetId="+pmJson.folderAssetId+"&firstColumnId="+firstColumnId;
		   break;
	}
}

//*******************************获取列表数据***********************************
//获取连续剧子集时传pmJson，splitFlag，当splitFlag为false时，pageSize,curPage传具体值，否则传空。
//获取单片节目时，传cateId，splitFlag，当splitFlag为false时，pageSize,curPage传具体值，否则传空。
function getServerData(mainPmId,cateId,splitFlag,pageSize,curPage)    //页面获取初始数据
{
	if(location.href.indexOf("MovieDetail.do") != -1)
	{
		var url = epgUrl + "PmChoose.do?userId=" + getUserId() + "&pmId =" + mainPmId + "&svstype=dsjc_detail";    //连续剧子集
	}
	else
	{
		var url = epgUrl + "MoviePm.do?userId=" + getUserId() + "&cateId=" + cateId + "&svstype=pmlist";    //单片节目
	}
	if(splitFlag)   //判断是否由页面分页处理
	{ 
		url = url + "&pageSize=999";
	}
	else
	{
		url = url + "&curPage="+curPage+"&pageSize="+pageSize;
	}
	ajaxUrl(url,ajaxCallBack);
}

//**********************************对业务的整体键值进行监听********************************
document.onkeydown = globalEvent;
function globalEvent(e){
	var keycode = e.keyCode || e.which;
	checkCA();
	if(tipFlag) return; //判断是否有弹出框，有弹出框时不往下执行。
	switch(keycode){
		case ONE:
		case TWO:
		case THREE:
		case FOUR:
		case FIVE:
		case SIX:
		case SEVEN:
		case EIGHT:
		case NINE:
		case ZERO:
			if(keycode == ZERO) keycode = 9;
			else keycode = keycode - 49 > 0?keycode - 49 : 0;
			if(keycode <= recSize - 1) doNumber(keycode);
			break;
		case KEY_UP:
			moveUp();
			break;
		case KEY_DOWN:
			moveDown();
			break;
		case KEY_LEFT:
			moveLeft();
			break;
		case KEY_RIGHT:
			moveRight();
			break;
		case KEY_NEXT:
			turnNextPage();
			return 0;
			break;
		case KEY_PREV:
			turnPrevPage();
			break;
		case KEY_ENTER:
			doConfirm();
			break;
		case KEY_BACK:
		case RETURN:
		case QUIT:
			e.preventDefault();
			clearGlobalVar();
			goReturnUrlPath();
			break;
		case MENU:
			clearGlobalVar();
		case KEY_RED:
			doRedKey();
			break;
		case KEY_YELLOW:
		case MY_KEY_YELLOW:
			doYellowKey();
			break;
		case KEY_BLUE:
			doBlueKey();
			break;
		case KEY_GREEN:
			doGreenKey();
			break;
		default:
			break;	
	}
}

function doRedKey(){
	clearGlobalVar();
	goToPortal();
}
function doGreenKey(){			
	clearGlobalVar();
	goReturnUrlPath();
}

function doYellowKey(){goToSearch();}
function doBlueKey(){goToMyZone();}

function getBrowserVersion(){
	var version=SysInfo.browserVersion;
	if(version=="iPanel3.0")
		return 0;//0为iPanel浏览器
	else
		return 1;//1为同洲浏览器
}

//根据一级栏目ID查找猜你喜欢栏目ID
function getAssoColumnId(firstColumnId){
	var assoColumnId = "";
	switch(firstColumnId){
		case "MANU201" : 
		case "MANU1000078142" :
			assoColumnId = "MANU10000015479";
			break;
		case "MANU41054" : 
			assoColumnId = "MANU10000015480";
			break;
		case "MANU10000015370" : 
			assoColumnId = "MANU10000015481";
			break;
		case "MANU1000021229" : 
			assoColumnId = "MANU10000017519";
			break;
		case "MANU1000024872":
			assoColumnId = "MANU10000020447";
			break;
		case "MANU1000024874":
			assoColumnId = "MANU10000020448";
			break;
	}
	return assoColumnId;
}


/*
 * 校验是否智能盒子
 * 注意jsInterface为activity里放入的js对象
 */
function isSmartBox(){
    var to = typeof (jsInterface);
    if(to == undefined || to == "undefined"){
        return false;
    }else{
        return true;
    }
}
