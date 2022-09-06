/**
 // * @author 904995
 */

/**
 * @description 页面在取数据时，涉及到所有URL前缀接口部分 。
 * @param {string}
 * URL.VOD_getRootContent为接口URL,注所有"键"都是以模块名称加"_"开头，如"VOD_"，以接口方法名结尾"getRootContent",取根栏目接口方法名
 * @param {string} "/column/columnAction!getRootContent.action" 根栏目数据请求接口
 * @return 共48个接口URL
 */
var isIPanel = typeof (iPanel) != "undefined" ? true : false;
var URL = {
    /**********   包月接口    **********/
    "VOD_getMonthOrder" : "/monthOrderAction",

    /**********   取根套餐栏目    **********/
    "VOD_getRootContent" : "/GetRootContents",

    /**********   取子栏目    **********/
    "VOD_getChildColumnList" : "/GetFolderContents",

    /**********   取栏目下的媒资列表    **********/
    "VOD_getAssetList" : "/GetFolderContents",

    /**********   取关联节目    **********/
    "VOD_getAssociatedAsset" : "/GetAssociatedFolderContents",

    /**********   获取影片详情    **********/
    "VOD_getAssetDetail" : "/GetItemData",

    /**********   获取点播排行信息（单片、电视剧、新闻等）    **********/
    "VOD_getPlayTop" : "/GetOnDemandRanking",

    /**********   vod搜索（站点全局搜索或指定栏目搜索）    **********/
    "VOD_getAssetListByKeyword" : "/SearchAction",

    /**********   对资源进行推荐（人气）或好评    **********/
    "VOD_recommendAsset" : "/RecommandProgram",

    /**********   检查购买    **********/
    "VOD_checkBuy" : "/ValidatePlayEligibility",

    /**********   购买    **********/
    "VOD_doBuy" : "/Purchase",

    /**********   获取播放时的Token    **********/
    "VOD_getToken" : "/SelectionStart",

    /**********   获取产品的价格、优惠信息    **********/
    "VOD_getPrice" : "/GetUpsellOffer",

    /**********   vod点播获取播放列表（试看 & 正看）    **********/
    "VOD_getPlaylist" : "/GetPlaylist",

    /**********   vod书签播放    **********/
    "VOD_bookmarkPlay" : "/SelectionResume",

    /**********   vod书签列表    **********/
    "VOD_getVodFavorites" : "/GetSavedPrograms",

    /**********   vod删除书签    **********/
    "VOD_removeBookmark" : "/DeleteSavedProgram",

    /**********   检查电视剧书签    **********/
    "VOD_checkBookmark" : "/CheckSavedProgram",

    /**********   vod保存书签    **********/
    "VOD_saveVodFavorites" : "/AddSavedProgram",

    /**********   vod增加收藏    **********/
    "VOD_addSavedProgram" : "/AddBookmark",

    /**********   vod获取收藏    **********/
    "VOD_getSavedProgram" : "/GetBookmarks",

    /**********   vod删除收藏    **********/
    "VOD_removeVodFavorites" : "/DeleteBookmark",


    /**********   vod点播记录查询    **********/
    "VOD_getHistorys" : "/GetHistorys",

    /**********   btv频道列表    **********/
    "BTV_getChannelList" : "/GetChannels",

    /**********   btv节目列表    **********/
    "BTV_getProgramList" :"/GetPrograms",

    /**********   btv关联节目    **********/
    "BTV_getAssociatedProgram" : "/GetAssociatedPrograms",

    /**********   btv节目播放    **********/
    "BTV_getTvPlayRtsp" : "/ChannelSelectionStart",

    /**********   NPVR录像清单列表数据 **********/
    "NPVR_recordList" : "/NpvrRecordListAction",

    /**********   npvr的录制功能    **********/
    "NPVR_saveRecord" : "/NpvrProgramAction",

    /**********   获取用户单次订购记录    **********/
    "VOD_getUserSubscriptions" : "/GetUserSubscriptions",

    /**********   获取用户账号余额    **********/
    "VOD_getUserBlance" : "/GetUserBalance"
};
/**
 * @description 业务中取数据的方法
 * @param {string} _APIUrl 为传入的API_URL接口对象值，例如URL.VOD_getRootContent为取根栏目接口
 * @param {string} _configs
 * 根据数据API接口需要，传入参数对象。VOD_getRootContent.param为参数，VOD_getRootContent.callBack为回调函数。比如
 *	var VOD_getRootContent =
 *	{
 *		"param" :
 *		{
 *			"columnCode" : "gqhddb",
 *			"siteId" : "1"
 *		},
 *		"callBack" : getRootColumn
 *	};
 */

IEPG.getMonthPriceToken = function(){
    var VOD_getMonthOrder = "";
    var commonNewtime = new Date();
    var commonNewStrTime = commonNewtime.getFullYear() + "-" + ((commonNewtime.getMonth()+1) < 10 ? ("0" + (commonNewtime.getMonth()+1)) : (commonNewtime.getMonth()+1)) + "-" + (commonNewtime.getDay() < 10 ? ("0" + commonNewtime.getDay()) : commonNewtime.getDay()) + "T" + (commonNewtime.getHours() < 10 ? ("0" + commonNewtime.getHours()) : commonNewtime.getHours()) + ":" + (commonNewtime.getMinutes() < 10 ? ("0" + commonNewtime.getMinutes()) : commonNewtime.getMinutes()) + ":" + (commonNewtime.getSeconds() < 10 ? ("0" + commonNewtime.getSeconds()) : commonNewtime.getSeconds());

    VOD_getMonthOrder = {  //获取产品价格
        "data":"<MonthOrder productCode=\"" + monthGoodsId + "\" portalId=\"" + portalId +"\" count=\"1\" reqTime=\"" + commonNewStrTime + "\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
        "callBack" : getMonthPriceTokenResult
    };
    IEPG.getData(URL.VOD_getMonthOrder, VOD_getMonthOrder);
}

function getMonthPriceTokenResult(_dataJson){
    if(tags(_dataJson,"MonthOrderResult").length > 0){
        Buy.goodsId = detailJson.goodsId;
        IEPG.doPlay();
    }else{
        var errorMsg = G(tags(_dataJson.message, "NavServerResponse")[0], "message");
        showMsg(tipUrl + "iPG/tip/a_errorTip.htm", errorMsg);
    }
}

IEPG.getData = function(_APIUrl, _configs){
    var paramUrl, dataUrl;
    var _data = xmlHead + _configs.data;
    //alert("paramUrl=" + paramUrl);
    var reqUrl = imgurl+_APIUrl + "?dataType=json";
    new ajaxUrl(reqUrl, _configs.callBack, _data);
};

/**
 * @description
 * 此函数作用是json对象中的"键"与"值"进行分离提取并用"&"相连，json格式为{key:value,key:value}，value为string或number类型
 * @param {string} _configs 根据数据API接口需要，传入参数对象,此时为VOD_getRootContent.param。比如
 *	var VOD_getRootContent =
 *	{
 *		"param" :
 *		{
 *			"columnCode" : "gqhddb",
 *			"siteId" : "1"
 *		},
 *		"callBack" : getRootColumn
 *	};
 */

IEPG.param = function(_configs) {
    var i = 0;
    var paramArr = [];
    for(var key in _configs) {
        paramArr[i] = encodeURIComponent(key) + "=" + encodeURIComponent(_configs[key]);//搜索输入框的汉字需要编码
        i++;
    }
    return paramArr.join("&");
};

/*
 *@description 购买及播放的对象定义（列表直接按播放键时不需在页面定义）
 */


var Buy;

/**
 * @description IEPG.BUY 涉及到购买检查，提示订购，订购，获取rtsp等功能，_pmJson 为传入的参数对象，包含如下参数。
 *
 * @param {string} recordType 	影片类型，节目类型VOD：点播(默认值)  BTV：回看  nPVR：个人录像  VODPkg：媒资包
 * @param {string} assetName 	影片名称
 * @param {string} chargeMode 	使用方式1:包月3:免费5:单片按次6:整包按次，默认为"0"
 * @param {string} goodsId 		商品ID（影片所关联的商品ID）
 * @param {string} columnMapId 	上架Id（连续剧资源包和单片必传参数）
 * @param {string} resourceId 	媒资的资源ID（连续剧子集必传参数，订购资源包时不能传）
 * @param {string} singleFlag 	订购连续剧子集标识，true为需要购买资源包单集，false为不需要购买，默认为false，
 * @param {string} isBuyOnline 	在线购买标识，true为支持在线订购，false为不支持在线订购，默认为true（注：目前版本不支持现在订购套餐（栏目））
 * @param {string} buyPlayType 	续播标识，"1"为支持续播，"0"不支持，默认为"0"
 * @param {string} rtspType 	rtsp串类型，"O"为OC1.0，"N"为NGOD，默认为"O"
 * @param {string} tryFlag 		播放类型，"0"为正常观看，"1"为试看，默认为"0"（零）
 *
 */

// var pmJson = {
// "chargeMode" : obj.chargeMode,(可选)
// "goodsId" : obj.goodsId,(套餐必填)
// "columnMapId" : obj.columnMapId,(单片和资源包必填)
// "resourceId" : obj.resourceId,（资源包子集必填）
// "singleFlag" : false,(可选)
//"isBuyOnline" : true,(可选)
//"buyPlayType" : "1",(可选)
// "rtspType" : "N",(可选)
// "tryFlag" : "0"(可选)
// }

var data_pmJson;

IEPG.BUY = function(_pmJson) {
    data_pmJson=_pmJson;
    this.recordType = _pmJson.recordType || "VOD";
    this.assetName = _pmJson.assetName || "";
    this.chargeMode = _pmJson.chargeMode || "0";
    this.providerId = _pmJson.providerId;
    this.columnId = _pmJson.columnId;
    this.goodsId = _pmJson.goodsId || "";
    this.columnMapId = _pmJson.columnMapId;
    this.resourceId = _pmJson.resourceId;
    this.singleFlag = _pmJson.singleFlag || false;
    this.isBuyOnline = _pmJson.isBuyOnline || false;
    this.buyPlayType = _pmJson.buyPlayType || "0";
    this.pkgChargeMode = _pmJson.pkgChargeMode || "0";
    this.rtspType = _pmJson.rtspType || "N";
    this.tryFlag = _pmJson.tryFlag || "0";
    this.director = _pmJson.director || "";
    this.actorsDisplay = _pmJson.actorsDisplay || "";
    this.summaryShort = _pmJson.summaryShort || "";
    this.resumePoint=_pmJson.resumePoint || "0";
    this.buyConfig = {};
    this.buyMode = 0;
    this.BuyOnline = true;
    this.isBuy="";
    this.endTime = _pmJson.endTime || "";
    this.startTime = _pmJson.startTime || "";
    this.chapter=_pmJson.chapter||0;
    this.count = _pmJson.count||1;
    this.isPackage = _pmJson.isPackage||0;
    this.showType = _pmJson.showType||0;     //资源展示形态： 3 为新闻拆条
    this.packageSingPlay = _pmJson.packageSingPlay || "0";   //电视剧子资源单独上架播放,主要作用于播放完后是否提示播放下一集,0:是,1:否
    this.playTime = _pmJson.playTime || "0";   //时长
    this.pakgId = _pmJson.pakgId;
};
/**
 * @description IEPG.BUY 公用扩展方法
 */

IEPG.BUY.prototype = {
    detailCheckBuy : function() {//进入详情页面进行鉴权，（试看结束后提示购买）
        var VOD_checkBuy = {
            "data":"<ValidatePlayEligibility assetId=\"" + this.resourceId + "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
            "callBack" : detailCheckBuy
        };
        IEPG.getData(URL.VOD_checkBuy, VOD_checkBuy);
    },
    checkBuy : function() {
        var VOD_checkBuy = {  //鉴权
            "data":"<ValidatePlayEligibility providerId=\""+ this.providerId+"\" serviceId=\"\" assetId=\"" + this.resourceId + "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
            "callBack" : checkBuy
        };
        IEPG.getData(URL.VOD_checkBuy, VOD_checkBuy);
    },
    getPrice:function(){
        var VOD_getPrice = "";

        VOD_getPrice = {  //获取产品价格
            "data":"<GetUpsellOffer serviceId=\"" + this.goodsId + "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
            "callBack" : getPrice
        };
        IEPG.getData(URL.VOD_getPrice, VOD_getPrice);


    },
    getTelePrice: function(){
        var VOD_getPrice = "";
        VOD_getPrice = {  //获取产品价格
            "data":"<GetUpsellOffer serviceId=\"" + this.goodsId + "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
            "callBack" : getTelePrice
        };
        IEPG.getData(URL.VOD_getPrice, VOD_getPrice);
    },
    getMonthPrice : function(){
        var VOD_getPrice = "";
        VOD_getPrice = {  //获取产品价格
            "data":"<GetUpsellOffer serviceId=\"" + currentColumnID + "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
            "callBack" : getMonthPrice
        };
        /*var commonNewtime = new Date();
        var commonNewStrTime = commonNewtime.getFullYear() + "-" + ((commonNewtime.getMonth()+1) < 10 ? ("0" + (commonNewtime.getMonth()+1)) : (commonNewtime.getMonth()+1)) + "-" + (commonNewtime.getDay() < 10 ? ("0" + commonNewtime.getDay()) : commonNewtime.getDay()) + "T" + (commonNewtime.getHours() < 10 ? ("0" + commonNewtime.getHours()) : commonNewtime.getHours()) + ":" + (commonNewtime.getMinutes() < 10 ? ("0" + commonNewtime.getMinutes()) : commonNewtime.getMinutes()) + ":" + (commonNewtime.getSeconds() < 10 ? ("0" + commonNewtime.getSeconds()) : commonNewtime.getSeconds());
        VOD_getPrice = {  //获取产品价格
                "data" : "<MonthOrder productCode=\"" + currentColumnID + "\"  portalId=\"" + portalId + "\" count=\"" + this.count + "\"  reqTime=\"" + commonNewStrTime + "\"  client=\"" + cardId + "\" account=\"" + userId + "\"/>",
                "callBack" : getMonthPrice
            };*/
        IEPG.getData(URL.VOD_getPrice, VOD_getPrice);
    },
    getUserBlance : function(){
        var VOD_getUserBlance = "";
        VOD_getUserBlance = {  //获取用户余额
            "data":"<GetUserBalance  portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"  UserAccountType=\"0\"/>",
            "callBack" : getAmount
        };
        IEPG.getData(URL.VOD_getUserBlance, VOD_getUserBlance);
    },

    doBuy:function(){
        var dataUrl;
        if(this.chargeMode == 1){  // 包月
            this.buyMode = 1;
            dataUrl = "<Purchase  serviceId=\"" + this.goodsId + "\" portalId=\"" + portalId  + "\"  buyMode=\"" + this.buyMode +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>";
        }else if(this.chargeMode == 5){   //  单片单次
            this.buyMode = 2;
            dataUrl = "<Purchase  portalId=\"" + portalId  + "\" assetId=\"" + this.resourceId  + "\"  providerId=\"" + this.providerId +"\"  buyMode=\"" + this.buyMode +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>";
        }else if(this.chargeMode == 6){  //整包单次
            this.buyMode = 3;
            dataUrl = "<Purchase  folderAssetId=\"" + this.columnMapId  + "\" portalId=\"" + portalId + "\" providerId=\"" + this.providerId +"\" buyMode=\"" + this.buyMode +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>";
        }

        var VOD_doBuy = {  //购买
            "data":dataUrl,
            "callBack" : buy
        };
        IEPG.getData(URL.VOD_doBuy, VOD_doBuy);
    }
};

/**
 * @description 检查是否购买的回调 函数
 */
function checkBuy(_dataJson) {

    var result=_dataJson;
    //var result=data_pmJson;
    var isBuy = result.orderFlag;
    Buy.isBuy=isBuy;
    //Buy.chargeMode = 3;
    if(isBuy != "Y" && (Buy.chargeMode != 3)){
        var errorMsg = "亲，您还没有购买此影片，是否试看";
        showMsg(tipUrl + "T-nsp/tip/a_tryPlay.htm", errorMsg);
        return;
    }
    //alert(_dataJson.length+"__result.orderFlag="+result.orderFlag+"__result.orderFlag="+result.orderFlag);
    //alert(_dataJson.length+"__result.orderFlag="+result.orderFlag+"__result.orderFlag="+result.orderFlag);
    //alert(_dataJson.rtsp+"___"+result.rtsp+"___"+data_pmJson.rtsp);
    if(isBuy == "Y" || Buy.chargeMode == 3) {// 购买或免费类型
        //if($("orderFlag")){$("orderFlag").innerHTML="已订购";}
        if(Buy.showType == "3"){
            IEPG.doNewsPlay();
        }else if(Buy.buyPlayType == "1") {//续播
            IEPG.doBookmarkPlay();
            //IEPG.doPlay();
        } else {
            IEPG.doPlay();
        }
    } else {
        if(Buy.BuyOnline) { //是否支持在线购买（套餐单片）
            //alert("chargeMode222==="+Buy.chargeMode+"===="+Buy.pkgChargeMode);
            if(Buy.chargeMode=="1"||Buy.pkgChargeMode=="1"){
                var errorMsg = "亲，您还没有开通点播业务，现在拨打电话96296， 我们会登门为您办理。";
                showMsg(tipUrl + "T-nsp/tip/a_errorTip.htm", errorMsg);
            }else{
                Buy.getUserBlance();
                if(Buy.pkgChargeMode=="6"){
                    showBuyTip();
                }else{
                    if(Buy.chargeMode=="5"){  // 按次
                        productJson.comeFrom = "VOD";
                        productJson.implNum = 1;
                        Buy.getPrice();
                    }
                }
            }
        } else {
            var errorMsg = "亲，您还没有开通点播业务，现在拨打电话96296， 我们会登门为您办理。";
            showMsg(tipUrl + "T-nsp/tip/a_errorTip.htm", errorMsg);
        }
    }
}
var productJson = {
    "monthPrice" : 	0,
    "monthPriceTime" : "",
    "monthPriceUnit" : "",
    "MutiPrice" : "",
    "MutiPriceTime" : "",
    "MutiPriceUnit" : "",
    "singlePrice" : "",
    "singlePriceTime" : "",
    "singlePriceUnit" : "",
    "comeFrom" : "",
    "implNum" : ""
};

function getAmount(_dataJson){
    var balance = _dataJson.amount;
    document.getElementById("aMout").innerHTML = balance;
}

/**
 * @description 显示价格
 * @param {object} _dataJson ajax返回数据后解析的json对象
 */
function getMonthPrice(_dataJson){
    var result=_dataJson;
    var price = result.displayPrice;
    var priceTime = result.chargeTerm;//24
    var chargeTermUnit= result.chargeTermUnit;//分钟 小时var priceUnit
    var priceUnit="";
    switch(chargeTermUnit+""){
        case "0":
            priceUnit="分钟";
            break;
        case "1":
            priceUnit="小时";
            break;
        case "2":
            priceUnit="天";
            break;
        case "3":
            priceUnit="月";
            break;
        case "4":
            priceUnit="年";
            break;
        case "5":
            priceUnit="免费";
            break;
        case "6":
            priceUnit="部";
            break;
        case "7":
            priceUnit="次";
            break;
        case "8":
            priceUnit="秒";
            break;
        case "9":
            priceUnit="兆";
            break;
    }
    if(timer){
        clearTimeout(timer);
    }
    timer = setTimeout(function(){
        productJson.monthPrice = price;
        productJson.monthPriceTime = priceTime;
        productJson.monthPriceUnit = priceUnit;
        if(productJson.comeFrom == "MONTH"){
            showPopupMessage("MONTH");
        }
    }, 400);
}
function getTelePrice(_dataJson){
    var result=_dataJson;
    var price = result.displayPrice;
    var priceTime = result.chargeTerm;//24
    var chargeTermUnit= result.chargeTermUnit;//分钟 小时var priceUnit
    var priceUnit="";
    switch(chargeTermUnit+""){
        case "0":
            priceUnit="分钟";
            break;
        case "1":
            priceUnit="小时";
            break;
        case "2":
            priceUnit="天";
            break;
        case "3":
            priceUnit="月";
            break;
        case "4":
            priceUnit="年";
            break;
        case "5":
            priceUnit="免费";
            break;
        case "6":
            priceUnit="部";
            break;
        case "7":
            priceUnit="次";
            break;
        case "8":
            priceUnit="秒";
            break;
        case "9":
            priceUnit="兆";
            break;
    }

    productJson.MutiPrice = price;
    productJson.MutiPriceTime = priceTime;
    productJson.MutiPriceUnit = priceUnit;
    if(productJson.comeFrom == "TELE"){
        showPopupMessage("TELE");
    }else{
        Buy.getMonthPrice();
    }
}
function getPrice(_dataJson){
    var result=_dataJson;
    var price = result.displayPrice;
    var priceTime = result.chargeTerm;//24
    var chargeTermUnit= result.chargeTermUnit;//分钟 小时var priceUnit
    var priceUnit="";
    switch(chargeTermUnit+""){
        case "0":
            priceUnit="分钟";
            break;
        case "1":
            priceUnit="小时";
            break;
        case "2":
            priceUnit="天";
            break;
        case "3":
            priceUnit="月";
            break;
        case "4":
            priceUnit="年";
            break;
        case "5":
            priceUnit="免费";
            break;
        case "6":
            priceUnit="部";
            break;
        case "7":
            priceUnit="次";
            break;
        case "8":
            priceUnit="秒";
            break;
        case "9":
            priceUnit="兆";
            break;
    }
    productJson.singlePrice = price;
    productJson.singlePriceTime = priceTime;
    productJson.singlePriceUnit = priceUnit;
    if(productJson.comeFrom == "VOD"){
        showPopupMessage("VOD");
    }else if(productJson.comeFrom == "TELE" || (productJson.comeFrom == "MONTH" && productJson.implNum == 3)){
        Buy.goodsId = detailJson.goodsId;
        Buy.getTelePrice();
    }else{
        Buy.getMonthPrice();
    }
}

function showPopupMessage(_flag){
    productJson.implNum == "";
    productJson.comeFrom == "";
    document.getElementById("price1").innerHTML = productJson.singlePrice;
    if(_flag == "VOD")
    {
        buyTip=true;
        //var tipMsg="单片购买价格为" + productJson.singlePrice + "元, 购买后在" + +productJson.singlePriceTime+productJson.singlePriceUnit+ "内可以反复观看！<br />   ";
        var tipMsg='您好！你当前可用余额为<span id="amounts"></span> ,您选择了《' + Buy.assetName + '》,价格为' + productJson.singlePrice + '元, 购买后在'  +productJson.singlePriceTime+productJson.singlePriceUnit+ '内任何时间可以观看,是否要购买？<br />   ';
        showMsg(tipUrl + "T-nsp/tip/a_buyTip.htm", tipMsg);
    }else if(_flag == "TELE"){
        buyTip=true;
        var tipMsg='您好！你当前可用余额为<span id="amounts"></span> ,单片购买价格为' + productJson.singlePrice + '元/集, 购买后在'  +productJson.singlePriceTime+productJson.singlePriceUnit+ '内可以反复观看; 整剧购买价格为 ' + productJson.MutiPrice + '元/部，购买后在' + productJson.MutiPriceTime + productJson.MutiPriceUnit + '内可以反复观看<br />   ';
        showMsg(tipUrl + "T-nsp/tip/a_buyPkgTip.htm", tipMsg);
    }else if(_flag == "MONTH"){
        if(productJson.implNum == 2){
            buyTip=true;
            var tipMsg='您好！你当前可用余额为<span id="amounts"></span> ,单片购买价格为' + productJson.singlePrice + '元, 购买后在'  +productJson.singlePriceTime+productJson.singlePriceUnit+ '内可以反复观看; 套餐购买价格为 ' + productJson.monthPrice + '元，购买后在' + productJson.monthPriceTime + productJson.monthPriceUnit + '时间内可以反复观看<br />   ';
            showMsg(tipUrl + "T-nsp/tip/a_buyTip.htm", tipMsg);
        }else if(productJson.implNum == 3){
            buyTip=true;
            var tipMsg='您好！你当前可用余额为<span id="amounts"></span> ,单集购买为' + productJson.singlePrice + '元, 购买后' + productJson.singlePriceTime+productJson.singlePriceUnit+ '内可以反复观看; 整剧购买为 ' + productJson.MutiPrice + '元，购买后' + productJson.MutiPriceTime + productJson.MutiPriceUnit + '内可以反复观看, 套餐购买为 ' + productJson.monthPrice + '元，购买后' + productJson.monthPriceTime + productJson.monthPriceUnit + '时间内可以反复观看<br />   ';
            showMsg(tipUrl + "T-nsp/tip/a_buyTip.htm", tipMsg);
        }
    }
}

/**
 * @description 购买提示价格
 */

function showBuyTip(){	// 电视剧购买提示
    productJson.comeFrom = "TELE";
    productJson.implNum = 2;
    Buy.getPrice();
}


function showBuyPackTip(){//包月购买提示
    productJson.comeFrom = "MONTH";
    if(Buy.pkgChargeMode == 6){
        productJson.implNum = 3;
    }else{
        productJson.implNum = 2;
    }
    Buy.getPrice();
}


/**
 * @description 购买的回调函数
 * @param {object} _dataJson ajax返回数据后解析的json对象
 */
function buy(_dataJson) {
    if(_dataJson.code == "0") {
        var buyMsg='订购成功，账户余额为<span id="amounts2"></span>元,欣赏有效期至'+_dataJson.disableTime+'<br/> ';
        showMsg(tipUrl + "T-nsp/tip/a_buyOk.htm", buyMsg);
    } else {
        var errorMsg = _dataJson.message + "。 【 " + _dataJson.code + " 】";
        showMsg(tipUrl + "T-nsp/tip/a_errorTip.htm", errorMsg);
    }
}

function getMediaDetail(resourceId) {
    var VOD_getSubAssetDetail = {
        "param" : {
            "columnMapId" : Buy.columnMapId,
            "resourceId" : resourceId,
            "checkBuy" : "N",
            "checkBookmark" : "N"
        },
        "callBack" : getSubAssetDetail
    };
    IEPG.getData(URL.VOD_getSubAssetDetail, VOD_getSubAssetDetail);
}

function getSubAssetDetail(_dataJson) {
    Buy.assetName = _dataJson.assetName;
    Buy.resourceId = _dataJson.resourceId;
    setGlobalVar("assetChapter",_dataJson.chapters);
}

IEPG.onPlayAction = function(dataArr, focusIndex) {
    var cardId =  cardId;
    var userId =  userId;
    if(cardId == 0 || userId == 0){
        checkUser();
        return;
    }
    if(dataArr) {
        //saveGlobalVar();
        if(dataArr[focusIndex].isPackage == "1") {
            window.location.href = goUrl+ "/iPG/T-nsp/dsjc/detail_dsjc.htm?providerId="+ dataArr[focusIndex].providerId + "&titleAssetId=" + dataArr[focusIndex].assetId +"&folderAssetId="+dataArr[focusIndex].folderAssetId;
        } else {
            var pmJson = {
                "chargeMode" : dataArr[focusIndex].chargeMode,
                "goodsId" : dataArr[focusIndex].goodsId,
                "columnMapId" : dataArr[focusIndex].folderAssetId,
                "resourceId" : dataArr[focusIndex].assetId,
                "assetName" : dataArr[focusIndex].titleFull,
                "providerId" : dataArr[focusIndex].providerId,
                "recordType" : dataArr[focusIndex].serviceType || "VOD"
            };
            Buy = new IEPG.BUY(pmJson);
            Buy.checkBuy();
        }
    }
};

IEPG.PlayAction = function(dataArr) {
    if(dataArr) {
        //saveGlobalVar();
        if(dataArr.isPackage == "1") {
            window.location.href = goUrl+ "/iPG/T-nsp/dsjc/detail_dsjc.htm?providerId="+ dataArr.providerId + "&titleAssetId=" + dataArr.assetId +"&folderAssetId="+dataArr.folderAssetId;
        }
        else
        {
            window.location.href = goUrl+ "/iPG/T-nsp/jtyy/detail_jtyy.htm?providerId="+ dataArr.providerId + "&titleAssetId=" + dataArr.assetId +"&folderAssetId="+dataArr.folderAssetId+"&checkBookmark=Y";
        }
        /*
          else {
              var pmJson = {
                  "chargeMode" : dataArr.chargeMode,
                  "goodsId" : dataArr.serviceId,
                  "columnMapId" : dataArr.folderAssetId,
                  "resourceId" : dataArr.assetId,
                  "assetName" : dataArr.titleFull,
                  "providerId" : dataArr.providerId,
                  "recordType" : dataArr.serviceType || "VOD",
                  "buyPlayType" : "1",
                  "resumePoint" : dataArr.rentaInfo.resumePoint || 0
              };
              Buy = new IEPG.BUY(pmJson);
              Buy.checkBuy();
          }
          */
    }
};


/**
 * @description  子集列表按播放键、确定键直接播放
 */
/**
 * @description  子集列表按播放键、确定键直接播放
 */
IEPG.doPlayAction = function(playJson) {
    if(cardId == 0 || userId == 0){
        checkUser();
        return;
    }
    var titleAssetId=playJson.titleAssetId;
    if(!titleAssetId){
        titleAssetId = playJson.assetId;
    }

    if(playJson.isPackage == "1") {
        window.location.href = goUrl+ "/iPG/T-nsp/dsjc/detail_dsjc.htm?providerId=" + playJson.providerId + "&titleAssetId=" + titleAssetId+"&folderAssetId="+playJson.folderAssetId;
    } else {
        var pmJson = {
            "chargeMode" : playJson.chargeMode,
            "goodsId" : playJson.goodsId,
            "columnMapId" : playJson.columnMapId,
            "resourceId" : playJson.assetId,
            "assetName" : playJson.titleFull,
            "recordType" : playJson.serviceType || "VOD",
            "isPackage" : playJson.isPackage|| 0,
            "showType" : playJson.showType|| 0,
            "singleFlag":playJson.singleFlag|| "false",
            "resumePoint":playJson.resumePoint||0,
            "providerId" : playJson.providerId,
            "pkgChargeMode" : playJson.pkgChargeMode,
            "packageSingPlay" : playJson.packageSingPlay||"0",
            "buyPlayType" : playJson.buyPlayType|| "0",
            "columnId" : playJson.columnId,
            "pakgId": playJson.pakgId,
            "playTime": playJson.playTime
        };

        Buy = new IEPG.BUY(pmJson);

        Buy.checkBuy();
    }
};


IEPG.doBookmarkPlay = function() { //从断点处开始播放，获取续看的token
    usage="Resume";
    var VOD_bookmarkPlay = {
        "data":"<SelectionResume titleAssetId=\"" + Buy.resourceId + "\" fromStart=\"N\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\" serviceId=\"\"/>",
        "callBack" : getToken
    };
    IEPG.getData(URL.VOD_bookmarkPlay, VOD_bookmarkPlay);
};


IEPG.doPlay = function() {// 直接播放
    usage="Start";

    if( Buy.tryFlag == "1"){//获取试看Token
        var VOD_getToken = {
            "data":"<SelectionStart titleProviderId=\""+ Buy.providerId +"\" titleAssetId=\"" + Buy.resourceId + "\" folderAssetId=\"\" serviceId=\"\" playPreview=\"Y\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
            "callBack" : getTryToken
        };

    }else{

        var tempColumnId = Buy.columnId;
        if(Buy.columnId=="undefined") tempColumnId="";
        var VOD_getToken = {  //获取点播Token
            "data":"<SelectionStart titleProviderId=\""+ Buy.providerId +"\" titleAssetId=\"" + Buy.resourceId + "\" folderAssetId=\""+ tempColumnId+"\" serviceId=\"\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
            "callBack" : getToken
        };
    }

    IEPG.getData(URL.VOD_getToken, VOD_getToken);
};

IEPG.doNewsPlay = function() {//直接播放
    usage="Start";
    var VOD_getToken = {  //获取点播Token
        "data":"<SelectionStart titleProviderId=\"" + Buy.providerId + "\" noPurchase=\"1\" startTime=\""+Buy.startTime+"\" endTime=\""+Buy.endTime+"\" titleAssetId=\"" + Buy.resourceId + "\" folderAssetId=\"\" serviceId=\"\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
        "callBack" : getToken
    };
    IEPG.getData(URL.VOD_getToken, VOD_getToken);
};

var usage="";//缺省为：Start 'Start';点播 'Restart';重播  'Resume'续播
var rtspUrl="";
var purchaseToken;
function getTryToken(_dataJson){
    var result=_dataJson;
    var purchaseToken=result.purchaseToken;

    //alert(333+purchaseToken);

    if(isIPanel) rtspUrl = "rtsp://" + MAPIP + ":" + MAPPort + "/;purchaseToken=" + purchaseToken + ";serverID=" + portalIP + ":" + portalPort;
    else rtspUrl = result.rtsp;
    //setGlobalVar("vod_ctrl_rtsp", encodeURIComponent(rtspUrl));
    //alert(_dataJson.rtsp);
    setGlobalVar("displayName", Buy.assetName);
    setGlobalVar("vod_ctrl_startime", result.startTime);//试看开始时间点
    //setGlobalVar("vod_ctrl_startime", '0');
    setGlobalVar("vod_ctrl_endtime", result.displayRunTime);//试看总时长
    //setGlobalVar("vod_ctrl_endtime", '305');
    setGlobalVar("vod_recordType", "news");//试看时不保存书签用
    setGlobalVar("packageSingPlay", false);//试看时不保存书签用
    setGlobalVar("tryFlag", Buy.tryFlag);
    setGlobalVar("vod_play_type", Buy.buyPlayType);    //播放类型  0 正常, 1 续播
    setGlobalVar("vod_ctrl_rtsp", encodeURIComponent(rtspUrl));

    //setGlobalVar("vod_ctrl_rtsp", encodeURIComponent(_dataJson.rtsp));

    var backUrl = location.href;
    var index = backUrl.indexOf('&vod_ctrl_breakpoint');
    if(index > 0) {
        backUrl = backUrl.substring(0, index);
    }
    setGlobalVar("vod_ctrl_backurl", backUrl);
    delayTime = setTimeout(function() {
        //location.href = tipUrl + "T-nsp/vodctrl/vodplay.htm";
        //alert(333);
        location.href = goUrl2+"iPG/T-nsp/vodctrl/vodplay.htm";
        //http://10.9.216.15/win8/vodctrl/check_out.html?initPlayTime=0&currentStatus=-1&errorCode=100005
    }, 150);
}

function getToken(_dataJson){
    if(_dataJson.code){
        showMsg(tipUrl + "T-nsp/tip/a_errorTip.htm", _dataJson.message);
        return;
    }
    var result = _dataJson;
    purchaseToken=result.purchaseToken;
    //rtspUrl = _dataJson.rtsp;
    if(isIPanel) rtspUrl = "rtsp://" + MAPIP + ":" + MAPPort + "/;purchaseToken=" + purchaseToken + ";serverID=" + portalIP + ":" + portalPort;
    else rtspUrl = result.rtsp;

    setGlobalVar("vod_ctrl_rtsp", encodeURIComponent(rtspUrl));
    setGlobalVar("vod_ctrl_startime", result.startTime);//试看开始时间点
    setGlobalVar("vod_ctrl_endtime", result.displayRunTime);//试看总时长
    var playTotalTime = formateDate(Buy.endTime) - formateDate(Buy.startTime);
    /*	if(Buy.showType == "3"){
     setGlobalVar("displayName", Buy.assetName);
     setGlobalVar("vod_ctrl_startime", 0);
     var playTotalTime = formateDate(Buy.endTime) - formateDate(Buy.startTime);
     setGlobalVar("vod_ctrl_endtime", playTotalTime);
     //setGlobalVar("vod_recordType", Buy.recordType);
     setGlobalVar("assetId", Buy.resourceId);
     setGlobalVar("providerId", Buy.providerId);
     setGlobalVar("columnMapId", Buy.columnMapId);//保存当前资源包的上级id，用于电视剧播放下一集
     setGlobalVar("purchaseToken", purchaseToken);
     setGlobalVar("vod_play_type", Buy.buyPlayType);    //播放类型  0 正常, 1 续播
     setGlobalVar("playType", Buy.showType);
     setGlobalVar("serviceId", Buy.goodsId);
     setGlobalVar("vod_ctrl_rtsp", encodeURIComponent(rtspUrl));
     var backUrl = location.href;
     var index = backUrl.indexOf('&vod_ctrl_breakpoint');
     if(index > 0) {
     backUrl = backUrl.substring(0, index);
     }
     setGlobalVar("vod_ctrl_backurl", backUrl);
     var mp = new MediaPlayer();
     mp.stop();
     location.href = tipUrl + "/vodctrl/vodplay.htm";
     }else{*/
    if(purchaseToken!=""){
        //rtspUrl = "rtsp://" + MAPIP + ":" + MAPPort + "/;purchaseToken=" + purchaseToken + ";serverID=" + portalIP + ":" + portalPort;
        //alert(222+purchaseToken);
        var VOD_getPlaylist = {  //获取播放列表
            "data":"<GetPlaylist usage=\"" + usage +"\" deviceID=\"" + cardId +"\" PT=\"" + purchaseToken +"\"/>",
            "callBack" : getPlaylist
        };
        IEPG.getData(URL.VOD_getPlaylist, VOD_getPlaylist);
    }else{
        var errorMsg = "资源文件不存在";
        if( _dataJson.NavServerResponse.message){
            errorMsg = _dataJson.NavServerResponse.message;
        }
        showMsg(tipUrl + "T-nsp/tip/a_errorTip.htm", errorMsg);
    }

}

/**
 * @description 购买成功后获取rtsp串的回调函数
 * @param {object} _dataJson ajax返回数据后解析的json对象
 */
var delayTime;
function getPlaylist(_dataJson) {
    var playTotalTime=0,total_end_npt=0,total_start_npt=0;//广告加上影片的总时长
    var trickModesRestricted,playString="";//广告禁用按键 F 快进R 快退P 暂停D拖动
    var startNPT=parseInt(_dataJson.startNPT);//播放的开始时间点
    var Playlist = _dataJson.contentRefList;
    if(Playlist.length > 0) {
        for(var i = 0; i < Playlist.length; i++) {
            total_start_npt+=parseInt(Playlist[i].start_npt);
            total_end_npt+=parseInt(Playlist[i].end_npt);
            playString+=Playlist[i].start_npt+","+Playlist[i].end_npt+","+Playlist[i].trickModesRestricted+";";
        }

        //*****************************************************
        /*A  0-800     (0,800)      ---正片
         B  800-1100  (0-300)      ---广告
         C  1100-4100 (800-3800)   ---正片
         D  4100-4600 (0-500)      ---广告
         E  4600-8000 (3800-7200)  ---正片 */
        //*****************************************************

        //将取出的播放列表拼装成一个完成的播放进度条
        var oldvideoList=[];
        for(i=0;i<Playlist.length;i++)
        {
            var json={};
            json.s=+parseInt(Playlist[i].start_npt);
            json.e=+parseInt(Playlist[i].end_npt);
            json.k=Playlist[i].trickModesRestricted;
            oldvideoList.push(json);
        }

        var json=JSON.stringify(oldvideoList); ////将字符串转换成对象

        if(Buy.buyPlayType== "1") {//续看
            playTotalTime=total_end_npt-total_start_npt+startNPT;
        }else{
            playTotalTime=total_end_npt-total_start_npt;
        }

        setGlobalVar("playString", playString);//原播放列表
        setGlobalVar("oldPlayString",json);   //构造后老的播放列表 断点时间需要
    }
    setGlobalVar("displayName", Buy.assetName);
    setGlobalVar("vod_ctrl_startime", 0);
    if(Buy.buyPlayType== "1") {//续看
        setGlobalVar("vod_ctrl_startime", Buy.resumePoint);
    }
    setGlobalVar("vod_ctrl_endtime", playTotalTime);
    setGlobalVar("vod_recordType", Buy.recordType);

    if(Buy.isPackage == "1") {  //是否资源包
        setGlobalVar("chapterLength",mediaListLength);//媒资包的实际集数
        setGlobalVar("chapter",Buy.chapter);//当前媒资的集数
    }

    setGlobalVar("tryFlag", Buy.tryFlag);
    setGlobalVar("assetId", Buy.resourceId);
    setGlobalVar("providerId", Buy.providerId);
    setGlobalVar("columnMapId", Buy.columnMapId);//保存当前资源包的上级id，用于电视剧播放下一集
    setGlobalVar("catalogId", Buy.columnMapId);//保存当前资源包的上级id，用于电视剧播放下一集
    setGlobalVar("purchaseToken", purchaseToken);
    setGlobalVar("vod_play_type", Buy.buyPlayType);    //播放类型  0 正常, 1 续播
    setGlobalVar("serviceId", Buy.goodsId);
    setGlobalVar("packageSingPlay", Buy.packageSingPlay);
    setGlobalVar("vod_ctrl_rtsp", encodeURIComponent(rtspUrl));
    //alert(getGlobalVar("vod_ctrl_rtsp"));
    //播放类型，1:VOD点播 2:直播  3:回看
    setGlobalVar("videoPlayType","1");
    var backUrl = location.href;
    var index = backUrl.indexOf('&vod_ctrl_breakpoint');
    if(index > 0) {
        backUrl = backUrl.substring(0, index);
    }
    setGlobalVar("vod_ctrl_backurl", backUrl);
    delayTime = setTimeout(function() {
        //location.href = tipUrl + "iPG/T-nsp/BtvVodctrl/vodplay.htm";
        //alert(444);
        //	alert(goUrl+"/iPG/T-nsp/vodctrl_w/vodplay.htm");
        //location.href = goUrl+"/iPG/T-nsp/vodctrl/vodplay.htm";
        location.href = location.href.split("/RGyouku")[0] + "/RGyouku/iPG/T-nsp/vodctrl/vodplay.htm";//新播控
    }, 300);
}

/**
 * @description 定义BTV播放的对象
 */
var BTVPlayObj;
/**
 * @description 处理BTV播放
 * @param {object} _config 为播放需传入的参数，为json对象。
 *
 * @param {string} programName 频道节目名称，默认为空。(必选)
 * @param {string} channelId 频道ID，默认为0。(必选)
 * @param {string} programId 节目ID，默认为0。(可选)
 * @param {number} tryFlay 试看标识，默认为0正常播放，试看时为1。(可选)
 * @param {string} type 播放节目类型，默认为"btv"。(可选)
 * @param {string} assetId 媒资ID，默认为""。(必选
 *
 /*例如
 var playConfig = {
		"programName" : programData[programFocus].programName,
		"channelId" : channelData[channelIndex].channelId,
		"programId" : programData[programFocus].programId,
		"assetId" : programData[programFocus].assetId,
	};
 */

IEPG.BTVPlay = function(_config) {
    this.programName = _config.programName || "";
    this.channelId = _config.channelId || 0;
    this.programId = _config.programId || 0;
    this.tryFlag = _config.tryFlag || 0;
    this.type = _config.type || "btv";
    this.assetId = _config.assetId || "";
    setGlobalVar("channelId",this.channelId);
    this.doBTVPlay = function() {
        var BTV_getTvPlayRtsp = {
            "data":"<ChannelSelectionStart portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\" channelId=\"" + this.channelId + "\" assetId=\"" + this.assetId+"\"/>",
            "callBack" : getBTVRtsp
        };
        IEPG.getData(URL.BTV_getTvPlayRtsp, BTV_getTvPlayRtsp);
    };
};
/**
 * @description BTV获取rtsp串的回调函数
 * @param {object} _dataJson ajax返回数据后解析的json对象
 */
function getBTVRtsp(_dataJson) {
    if(_dataJson.code == "12011073"){
        showMsg(tipUrl + "T-nsp/yytc/a_timeshift_buyInfo.htm", null);
        return;
    }else if(_dataJson.code){
        showMsg(tipUrl + "T-nsp/tip/a_errorTip.htm", _dataJson.message);
        return;
    }

    var purchaseToken = _dataJson.purchaseToken;
    usage="Resume";
    //rtspUrl = _dataJson.rtsp;
    if(isIPanel) rtspUrl = "rtsp://" + MAPIP + ":" + MAPPort + "/;purchaseToken=" + purchaseToken + ";serverID=" + portalIP + ":" + portalPort;
    else rtspUrl = _dataJson.rtsp;
    setGlobalVar("vod_ctrl_rtsp", encodeURIComponent(rtspUrl));
    var VOD_getPlaylist = {  //获取播放列表
        "data":"<GetPlaylist usage=\"" + usage +"\" deviceID=\"" + cardId +"\" PT=\"" + purchaseToken +"\"/>",
        "callBack" : getBTVPlaylist
    };
    IEPG.getData(URL.VOD_getPlaylist, VOD_getPlaylist);

}

function getBTVPlaylist(_dataJson) {
    var playTotalTime=0,total_end_npt=0,total_start_npt=0;//广告加上影片的总时长
    var trickModesRestricted,playString="";//广告禁用按键 F 快进R 快退P 暂停D拖动
    var startNPT=parseInt(_dataJson.startNPT);//播放的开始时间点
    var Playlist = _dataJson.contentRefList;
    if(Playlist.length > 0) {
        for(var i = 0; i < Playlist.length; i++) {
            total_start_npt+=parseInt(Playlist[i].start_npt);
            total_end_npt+=parseInt(Playlist[i].end_npt);
            playString+=Playlist[i].start_npt+","+Playlist[i].end_npt+","+Playlist[i].trickModesRestricted+";";
        }
        playTotalTime=total_end_npt-total_start_npt;
        //*****************************************************
        /*A  0-800     (0,800)      ---正片
         B  800-1100  (0-300)      ---广告
         C  1100-4100 (800-3800)   ---正片
         D  4100-4600 (0-500)      ---广告
         E  4600-8000 (3800-7200)  ---正片 */
        //*****************************************************

        //将取出的播放列表拼装成一个完成的播放进度条
        var oldvideoList=[];
        for(i=0;i<Playlist.length;i++)
        {
            var json={};
            json.s=+parseInt(Playlist[i].start_npt);
            json.e=+parseInt(Playlist[i].end_npt);
            json.k=Playlist[i].trickModesRestricted;
            oldvideoList.push(json);
        }

        var json=JSON.stringify(oldvideoList); ////将字符串转换成对象
        setGlobalVar("playString", playString);
        setGlobalVar("oldPlayString",json);   //构造后老的播放列表 断点时间需要
    }

    setGlobalVar("vod_play_type", "0");
    setGlobalVar("vod_ctrl_endtime", playTotalTime);//总时长
    setGlobalVar("vod_ctrl_rtsp", encodeURIComponent(rtspUrl));
    var proName = getGlobalVar("BTV_programName");
    setGlobalVar("displayName", proName);
    setGlobalVar("vod_recordType", "BTV");//播放器中区分回看标示,回看不保存书签
    setGlobalVar("vod_ctrl_backurl", location.href);
    //播放类型，1:VOD点播 2:直播  3:回看
    setGlobalVar("videoPlayType","3");
    var mp = new MediaPlayer();
    mp.stop();
    location.href = goUrl+"/iPG/BtvVodctrl/vodplay.htm";
}

//=====================对象及字符串转换===============================
var JSON;if(!JSON){JSON={};}
(function(){'use strict';function f(n){return n<10?'0'+n:n;}
    if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+
        f(this.getUTCMonth()+1)+'-'+
        f(this.getUTCDate())+'T'+
        f(this.getUTCHours())+':'+
        f(this.getUTCMinutes())+':'+
        f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}
    var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
    function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
        if(typeof rep==='function'){value=rep.call(holder,key,value);}
        switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
            gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
                v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';gap=mind;return v;}
            if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==='string'){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
            v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
    if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
        rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
        return str('',{'':value});};}
    if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
        return reviver.call(holder,key,value);}
        text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+
            ('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
        if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
        throw new SyntaxError('JSON.parse');};}}());
