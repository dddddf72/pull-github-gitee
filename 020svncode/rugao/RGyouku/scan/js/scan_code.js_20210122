/**
 * 扫码支付
 */
var scan_youku_columnId = "MANU50438"; // 优酷专区栏目ID
// 最终的栏目ID，既可以通过外部参数获取，也可以在当前页面重新赋值
// var real_origin_columnId = getQueryStr(location.href, "folderAssetId") || "";
var d1 = 1;
var d2 = 0.8;
var d3 = 0.7;
/*** 重写checkBuy方法，支持扫码支付 ***/
//getScanResult(); // 若从扫码页面返回，先判断是否订购成功
function checkBuy(_dataJson) {
    var result=_dataJson;
    Buy.isBuy = result.orderFlag;
    // gotoScanCode();



    gotoScanCode();



}
// function getProduct() {
//
// }


var columnOncePayFlag ='Y';
function getFolderContent(_dataJson){
    var result = _dataJson;
    if(result.code || result.folderFrame == undefined){
        var errorMsg = "获取栏目信息失败，系统出现异常！";
        showMsg(tipUrl + "T-nsp/tip/a_errorTip.htm", errorMsg);
    } else {
        columnOncePayFlag = _dataJson.columnOncePayFlag;
        setGlobalVar('columnOncePayFlag',columnOncePayFlag);
        var orderServices = {
            "data": '<GetOrderServices assetId="' + buyJson.assetId + '" portalId="' + portalId + '" account="'+ userId +'" client="' + cardId + '" folderAssetId="'+columnId+'" minOncePriceFlag="Y" />',
            "callBack": getOrderService
        };
        IEPG.getData("/GetOrderServices", orderServices);
    }
}
var type= '1';
function getOrderService(_dataJson) {
    var orderServiceItemList = _dataJson.orderServiceItem;
    var anciItem;
    var baoyueItem;
    for (var i = 0; i < orderServiceItemList.length; i++) {
        var orderItem = orderServiceItemList[i];
        if(orderItem.chargeType=='1'){
            anciItem = orderItem;
        }else if(orderItem.chargeType=='5'){
            if(buyJson.goodsId==orderItem.serviceId){
                baoyueItem = orderItem;
            }
        }
    }
    if (anciItem&&columnOncePayFlag=='Y'){
        var href=goUrl+'/RGyouku'+"/scan/scan_test.htm?assetId=" + Buy.resourceId + "&type=" + 'all' + "&playTime="
            + Buy.playTime + "&providerId=" + Buy.providerId + "&productCode=" +  Buy.goodsId+"&goodsName="+Buy.goodsName+'&backUrl=http://'+goUrl+'/RGyouku/win8/index.htm'+"&columnId="+Buy.columnId+"&prop=1"+"&assetName="+Buy.displayName;
        location.href = href;
    } else{
        var displayName = encodeURIComponent(baoyueItem.title); // 栏目名称
        setGlobalVar("scan_goods_name", displayName);
        var href=goUrl+'/RGyouku'+"/scan/scan_test.htm?assetId=" + Buy.resourceId + "&type=" + '1' + "&playTime="
            + Buy.playTime + "&providerId=" + Buy.providerId + "&productCode=" +  Buy.goodsId+"&goodsName="+Buy.goodsName+'&backUrl=http://'+goUrl+'/RGyouku/win8/index.htm'+"&columnId="+Buy.columnId+"&prop=1"+"&assetName="+Buy.displayName;
        location.href = href;
    }
}

function gotoScanCode(){
    if(Buy.isBuy == "Y" || Buy.chargeMode == 3) { // 购买或免费类型
        //if($("orderFlag")){$("orderFlag").innerHTML="已订购";}
        if(Buy.showType == "3"){ // 新闻拆条
            IEPG.doNewsPlay();
        }else if(Buy.buyPlayType == "1") {// 续播

            IEPG.doPlay();
        } else { // 正常播放
            IEPG.doPlay();
        }
    } else if(Buy.isBuy == "N"){
        var backUrl = location.href;
        setGlobalVar("chargeMode",buyJson.chargeMode);
        setGlobalVar("goodsId",buyJson.goodsId);
        setGlobalVar("columnMapId",buyJson.columnMapId);
        setGlobalVar("resourceId",buyJson.assetId);
        setGlobalVar("assetName",buyJson.titleFull);
        setGlobalVar("recordType",buyJson.serviceType || "VOD");
        setGlobalVar("isPackage" ,buyJson.isPackage|| 0);
        setGlobalVar("showType",buyJson.showType|| 0);
        setGlobalVar("singleFlag",buyJson.singleFlag|| "false");
        setGlobalVar("resumePoint",buyJson.resumePoint||0);
        setGlobalVar("providerId" , buyJson.providerId);
        setGlobalVar("pkgChargeMode", buyJson.pkgChargeMode);
        setGlobalVar("packageSingPlay",buyJson.packageSingPlay||"0");
        setGlobalVar("buyPlayType",buyJson.buyPlayType|| "0");
        setGlobalVar("columnId",buyJson.columnId);
        setGlobalVar("pakgId",buyJson.pakgId);
        setGlobalVar("playTime",buyJson.playTime);
        setGlobalVar("columnOncePayFlag",buyJson.columnOncePayFlag);
        setGlobalVar("scan_to_detail", backUrl);
        setGlobalVar("vod_ctrl_backurl", backUrl);
        if(tryflag) {
            tryPlay();
        }else if(Buy.BuyOnline) { // 是否支持在线购买，包月和单片按次

            var errorMsg = "亲，您还没有购买此影片，是否试看";
            showMsg(tipUrl + "T-nsp/tip/a_tryPlay.htm", errorMsg);
            return;
        } else {
            var errorMsg = "您好！您暂无观看权限，此套餐不支持在线购买，现在拨打电话96296，我们会登门为您办理。";
            showMsg(tipUrl + "/T-nsp/tip/a_errorTip.htm", errorMsg);
        }
    }else {
        var errorMsg = "您好！暂未查到授权信息。";

        showMsg(tipUrl + "/T-nsp/tip/a_errorTip.htm", errorMsg);
    }
}

function closeTryTip() {
    closeTip();
    setGlobalVar("tryFlag",0);
    var href = '';
    href = goUrl+'/RGyouku'+"/scan/scan_test.htm?assetId=" + Buy.resourceId  +'&columnId='+Buy.columnId +'&providerId='+buyJson.providerId+'&assetName='+buyJson.titleFull+'&goodsId='+buyJson.goodsId+'&backUrl='+goUrl+'/RGyouku/win8/index.htm'+"&prop=1"+'&gotoUrl='+goUrl+''+'&d1='+d1+'&d2='+d2+'&d3='+d3;
    setTimeout(function (){location.href = href},200);
}
