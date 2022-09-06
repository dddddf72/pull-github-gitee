/**
 * 扫码支付
 */
// 三个专区的测试栏目
var scan_youku_columnId = "MANU50438"; // 优酷专区栏目ID
var scan_youku_columnId2 = "MANU50447"; // 优酷专区栏目ID
var scan_aiqiyi_columnId = ""; // 爱奇艺
var scan_sohu_columnId = ""; // 搜狐

// 最终的栏目ID，既可以通过外部参数获取，也可以在当前页面重新赋值
var real_origin_columnId = getQueryStr(location.href, "folderAssetId") || "";

/*** 重写checkBuy方法，支持扫码支付 ***/
//getScanResult(); // 若从扫码页面返回，先判断是否订购成功
function checkBuy(_dataJson) {
    var result=_dataJson;
    Buy.isBuy = result.orderFlag;
    //gotoScanCode();
    if(Buy.chargeMode == "5" ||Buy.pkgChargeMode=="5"){ // 单片按次，直接根据媒资查询二维码
        gotoScanCode();
    } else { // 包月，需要根据栏目重新获取订购信息
        getColumnChargeMode();
    }
}
// function getProduct() {
//
// }
function getColumnChargeMode(){
    var columnId = "";
    if(real_origin_columnId != ""){
        columnId = real_origin_columnId;
    } else {
        columnId =  getQueryStr(location.href, 'folderColumnId') || "";
        if(columnId==''){
            columnId = getQueryStr(location.href, "folderAssetId") || "";
        }
    }
    if(columnId=="") {
        columnId = scan_youku_columnId;
    }
    getFolder(columnId);
}
function getFolder(columnId) {
    
    var folderContent = {
        "data": '<GetFolderContents assetId="' + columnId + '" portalId="' + portalId + '" account="'+ userId +'" client="' + cardId + '"  includeFolderProperties="Y" />',
        "callBack": getFolderContent
    };
    IEPG.getData("/GetFolderContents", folderContent);
}
function getFolderContent(_dataJson){
    var result = _dataJson;
    if(result.code || result.folderFrame == undefined){
        var errorMsg = "获取栏目信息失败，系统出现异常！";
        showMsg(tipUrl + "T-nsp/tip/a_errorTip.htm", errorMsg);
    } else {
        if(Buy.chargeMode=='1'||Buy.pkgChargeMode=="1"){
            if(result.folderFrame.serviceId!=''){
                Buy.chargeMode = result.folderFrame.chargeMode;
                Buy.pkgChargeMode = result.folderFrame.chargeMode;
                Buy.goodsId = result.folderFrame.serviceId;
                Buy.displayName = result.folderFrame.displayName;
                Buy.goodsName = result.folderFrame.productName;
                Buy.columnId = result.folderFrame.assetId;
                gotoScanCode();
            }else{
                if(result.folderFrame.parentAssetId!=''&&result.folderFrame.parentAssetId!='MANU0000000000000000') {
                    getFolder(result.folderFrame.parentAssetId);
                }else{
                    gotoScanCode();
                }
            }
        }else if(result.folderFrame.chargeMode == '3'){
            Buy.chargeMode = result.folderFrame.chargeMode;
            Buy.pkgChargeMode = result.folderFrame.chargeMode;
            Buy.goodsId = result.folderFrame.serviceId;
            Buy.displayName = result.folderFrame.displayName;
            Buy.goodsName = result.folderFrame.productName;
            Buy.columnId = result.folderFrame.assetId;
            gotoScanCode();
        }else{
            gotoScanCode();
        }
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
        if(Buy.BuyOnline) { // 是否支持在线购买，包月和单片按次
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
            var href = '';
            if(Buy.chargeMode=="1"||Buy.pkgChargeMode=="1"){ // 包月
                var backUrl = location.href;

                setGlobalVar("scan_to_detail", backUrl);
                setGlobalVar("vod_ctrl_backurl", backUrl);
                var displayName = encodeURIComponent(Buy.displayName); // 栏目名称
                setGlobalVar("scan_goods_name", displayName);
                href=goUrl+'/RGyouku'+"/scan/scan_test.htm?assetId=" + Buy.resourceId + "&type=" + '1' + "&playTime="
                    + Buy.playTime + "&providerId=" + Buy.providerId + "&productCode=" +  Buy.goodsId+"&goodsName="+Buy.goodsName+'&backUrl=http://'+goUrl+'/RGyouku/win8/index.htm'+"&columnId="+Buy.columnId+"&prop=1"+"&assetName="+Buy.displayName;
                location.href = href;
            }else if(Buy.chargeMode=="5" ||Buy.pkgChargeMode=="5" ){ // 单片按次
                var backUrl = location.href;

                setGlobalVar("scan_to_detail", backUrl);
                setGlobalVar("vod_ctrl_backurl", backUrl);
                var displayName = encodeURIComponent(Buy.assetName); // 媒资名称

                setGlobalVar("scan_goods_name", displayName);
                href = goUrl+'/RGyouku'+"/scan/scan_test.htm?assetId=" + Buy.resourceId + "&type=" + '5' + "&playTime="
                    + Buy.playTime + "&providerId=" + Buy.providerId + "&productCode=" +  Buy.goodsId+"&assetName="+displayName+'&backUrl=http://'+goUrl+'/RGyouku/win8/index.htm'+"&prop=1"+"&goodsName="+displayName;
                location.href = href;
            }
            // else if(Buy.chargeMode=="0" ){
            //     var backUrl = location.href;
            //
            //     setGlobalVar("scan_to_detail", backUrl);
            //     setGlobalVar("vod_ctrl_backurl", backUrl);
            //     var displayName = encodeURIComponent(Buy.displayName); // 栏目名称
            //     setGlobalVar("scan_goods_name", displayName);
            //     href=goUrl+'/RGyouku'+"/scan/scan_test.htm?assetId=" + Buy.resourceId + "&type=" + '0' + "&playTime="
            //         + Buy.playTime + "&providerId=" + Buy.providerId + "&productCode=" +  Buy.goodsId+'&backUrl=http://'+goUrl+'/RGyouku/win8/index.htm'+'&assetName='+displayName+"&prop=1"+"&goodsName="+displayName;
            //     location.href = href;
            // }
            else{
                var errorMsg = "您好！您暂无观看权限，此套餐不支持在线购买，现在拨打电话96296，我们会登门为您办理。";
                showMsg(tipUrl + "/T-nsp/tip/a_errorTip.htm", errorMsg);
            }
        } else {
            var errorMsg = "您好！您暂无观看权限，此套餐不支持在线购买，现在拨打电话96296，我们会登门为您办理。";

            showMsg(tipUrl + "/T-nsp/tip/a_errorTip.htm", errorMsg);
        }

    }else {
        var errorMsg = "您好！暂未查到授权信息。";

        showMsg(tipUrl + "/T-nsp/tip/a_errorTip.htm", errorMsg);
    }
}

