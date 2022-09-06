/**
 * 扫码支付
 */


/*** 重写checkBuy方法，支持扫码支付 ***/
var d1 = 0.8;
var d2 = 0.7;
var d3 = 0.6;
function gotoScanCode(){
    $('pop').innerHTML='ASDASDAD';
    var href = '';
    var backUrl = location.href;
    setGlobalVar("scan_to_detail", backUrl);
    setGlobalVar("vod_ctrl_backurl", backUrl);
    href = goUrl+'/RGyouku'+"/scan/scan_test_list.htm?assetId=" + ''  +'&columnId='+columnId+'&backUrl='+goUrl+'/RGyouku/win8/index.htm'+"&prop=1"+'&gotoUrl='+goUrl+''+'&d1='+d1+'&d2='+d2+'&d3='+d3;
    $('pop').innerHTML=href;
    setTimeout(function (){location.href = href},200);
    var errorMsg = "您好！您暂无观看权限，此套餐不支持在线购买，现在拨打电话96296，我们会登门为您办理。";
    showMsg(tipUrl + "/T-nsp/tip/a_errorTip.htm", errorMsg);
}