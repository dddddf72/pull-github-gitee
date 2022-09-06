var timeOutWait = 500 ;//列表数据获得焦点时请求剧集等待时间
var mediaJson = null ;
var mediaPageJson ;
var curMainPmId = null;
var moreMediaSize = 48;
var moreMediaCurPage = 1;
var mediaId=getGlobalVar("mediaId") == ""? 1 : parseInt(getGlobalVar("mediaId"));//集数下标id记忆
var mediaPage=getGlobalVar("mediaPage") == ""? 1 : parseInt(getGlobalVar("mediaPage"));//分页记忆
var pkgData;
var assetData;
var zybData;
//获取剧集操作
function getMediaList(json,pageSize)
{
    mediaJson = null;
    pkgData = json;
//	curMainPmId = json.mainPmId;
    var morObj = document.getElementsByName("moreBtn")[0];
    if(json.isPackage + "" == "1")
    {
        morObj.value = "更多";
        morObj.onclick = function()
        {
            moreMedia();
        }
    }
    else
    {
        morObj.value = "播放";  //单片
        morObj.onclick = function()
        {
            //onPlayAction(currentFocusPm,"0");
            var playJson = currentFocusPm;
            playJson.goodsId = playJson.serviceId;
            IEPG.doPlayAction(playJson);
        }
        cleanButtons();
        document.getElementById("num_prevPage").onclick = function(){};
        document.getElementById("num_prevPage").onclick = function(){};
        document.getElementById("mediaPageSize").innerHTML = "0/0";
        return;
    }
    /*
    var url = epgUrl + "PmChoose.do?pageSize=999&pmId=" + json.mainPmId + "&svstype=mediaJson";
    ajaxUrl(url, function(x)
    {
        mediaJson = eval('(' + x.responseText + ')');
        var divisiblePage=mediaJson.length % pageSize;//判断是否整除
        if(divisiblePage==0){
            var count = mediaJson.length / pageSize;
        }else{
            var count = mediaJson.length / pageSize + 1 ;
        }

        if(mediaJson.length == undefined || mediaJson.length == 0 )
        {
            count = 0;
        }
        mediaPageJson =
        {
            pageInfo:{pageSize:pageSize,curPage:1,countPage:count},
            pageId:{pageInfo:"mediaPageSize",prev:"num_prevPage",next:"num_nextPage"}
        };

        for(var i=0; i < mediaJson.length; i++)
        {
            mediaJson[i].mainPmId = json.mainPmId;
            mediaJson[i].mainGoodsId = json.goodsId;
            mediaJson[i].mainPrice = json.price;
            mediaJson[i].saleType = json.saleType;
            mediaJson[i].resourceIdAll = json.resourceId;
        }

        mediaId = getGlobalVar("mediaId") == ""? 0 : parseInt(getGlobalVar("mediaId")) //检查cookie中mediaId的值并根据该值计算集数的页码（集数分5或12为一页）
        mediaPage = parseInt(mediaId / pageSize) + 1 ;
        //mediaPage=Math.ceil(mediaId / mediaPageJson.pageInfo.pageSize);
        setGlobalVar("mediaId",parseInt(mediaId));//保存当前点播的集数下标
        turnMediaPage(mediaPage); //获得cookie中当前页数
    });
    */
    var folderAssetId = getGlobalVar("cate_Id");
    var VOD_getAssetDetail = {//媒资详情
        'data':'<GetFolderContents folderAssetId="'+detailJson.folderAssetId +'" titleProviderId="' + detailJson.providerId + '" assetId="'+detailJson.titleAssetId+'" portalId="'+portalId+'" client="'+cardId+'" account="'+userId+'" startAt =\"1\" maxItems=\"999\" includeFolderProperties="Y" includeSubFolder="Y" includeSelectableItem="Y"/>',
        "callBack" : getAssetDetail
    };
    IEPG.getData(URL.VOD_getAssetList, VOD_getAssetDetail);
}

function getAssetDetail(_dataJson){
    assetData = _dataJson;
    zybData =_dataJson.folderFrame;
    mediaJson = _dataJson.selectableItemList;
    if(_dataJson.selectableItemList.length<=0){
        showMsg;//局方需求，当此媒资都不存在了，提示”媒资已下架“
        return;
    }
    var divisiblePage=mediaJson.length % pageSize;//判断是否整除
    if(divisiblePage==0){
        var count = mediaJson.length / pageSize;
    }else{
        var count = mediaJson.length / pageSize + 1 ;
    }

    if(mediaJson.length == undefined || mediaJson.length == 0 )
    {
        count = 0;
    }
    mediaPageJson =
        {
            pageInfo:{pageSize:pageSize,curPage:1,countPage:count},
            pageId:{pageInfo:"mediaPageSize",prev:"num_prevPage",next:"num_nextPage"}
        };

    mediaId = getGlobalVar("mediaId") == ""? 0 : parseInt(getGlobalVar("mediaId")) //检查cookie中mediaId的值并根据该值计算集数的页码（集数分5或12为一页）
    mediaPage = parseInt(mediaId / pageSize) + 1 ;
    //mediaPage=Math.ceil(mediaId / mediaPageJson.pageInfo.pageSize);
    setGlobalVar("mediaId",parseInt(mediaId));//保存当前点播的集数下标
    turnMediaPage(mediaPage); //获得cookie中当前页数
    initResourceInfo();
}

//详情页初始化资源包信息使用，在详情页重写
function initResourceInfo(){}

//清除剧集按钮信息
function cleanButtons()
{
    var buttons = document.getElementsByName("mediaBtn");
    for(var j = 0 ; j < buttons.length; j++)
    {
        buttons[j].style.display = "none";
        buttons[j].value = "";
        buttons[j].disabled = true;
    }
}
//翻到指定页
function turnMediaPage(mediaCurPage)
{
    setGlobalVar("mediaPage",parseInt(mediaCurPage));//保存当前集数页数
    mediaPageJson.pageInfo.curPage = mediaCurPage;
    showMediaPage(mediaPageJson);
    //turnMediaInfo(mediaCurPage);
}

function showMediaPage(pageJson) //显示剧集信息
{
    var pageIdJson = pageJson.pageId;
    var pageInfoJson = pageJson.pageInfo;

    var countPage = parseInt(pageInfoJson.countPage, 10);
    var curPage = pageInfoJson.curPage;
    if(countPage == 0)
    {
        curPage = 0;
    }

    showMediaButton(curPage);//显示剧集按钮
    //以下是为上下页翻页按钮添加事件
    if(countPage <= 1)
    {
        document.getElementById(pageIdJson.prev).onclick = function(){};
        document.getElementById(pageIdJson.next).onclick = function(){};
        return;
    }
    document.getElementById(pageIdJson.prev).onclick = function()
    {
        if(curPage == 1)
        {
            turnMediaPage(countPage);
        }
        else
        {
            turnMediaPage(curPage - 1);
        }
    }
    document.getElementById(pageIdJson.next).onclick = function()
    {
        if(curPage == countPage)
        {
            turnMediaPage(1);
        }
        else
        {
            turnMediaPage(curPage + 1);
        }
    }

}
//添加点击事件
function addNumClickEvent(obj,index)
{
    obj.onclick = function ()
    {
        onPlayMedia(index);
    };
}

function showMediaButton(curPage) //显示剧集按钮
{
    var pageSize = mediaPageJson.pageInfo.pageSize;
    var buttons = document.getElementsByName("mediaBtn");
    var index = curPage == 0 ? 0 : (curPage - 1) * pageSize;
    //index + pageSize && i < mediaJson.length
    for(var i = index , j = 0 ; j < pageSize; j++, i ++)
    {
        if( i < mediaJson.length)
        {
//			var tempJson =  mediaJson[i];
            buttons[j].value = mediaJson[i].chapter;
            //buttons[j].value = j;
            buttons[j].disabled = false;
            addNumClickEvent(buttons[j],i);
            buttons[j].style.display = "";
        }
        else
        {

            buttons[j].style.display = "none";
            buttons[j].value = "";
            buttons[j].disabled = true;
            buttons[j].onclick = function(){};
        }
    }

}

function onPlayMedia(index)
{
    var tipPkgWindwo = $("tipWindow");
    if(tipPkgWindwo) {
        tipPkgWindwo.style.display = "none";
        tipPkgWindwo.innerHTML = "";
    }
    //saveGlobalVar();
    setGlobalVar("mediaId",parseInt(index));//保存当前点播的集数下标
    if(parseInt(index)<=mediaJson.length-1){
        setGlobalToPlayNext(index);
    }
    buttons[index].disabled = false;
    //onPlayAction(mediaJson[index],"0");
    var dsjc_curPage=getGlobalVar("turnPage_curPage");
    setGlobalVar("dsjcgq_curPage",dsjc_curPage);
    //var cate_Id=getQueryStr(url,"cateId");
    var cate_Id= getGlobalVar("cate_Id");
    setGlobalVar("cate_Id",cate_Id);


    var playJson = mediaJson[index];
    playJson.folderAssetId = zybData.parentAssetId;
    //如果子集获取不到chargMode，则取资源包的

    if(playJson.chargeMode == ""){
        //alert("chargeMode1111==="+zybData.chargeMode);
        playJson.chargeMode = zybData.chargeMode;
    }
    playJson.pkgChargeMode = zybData.chargeMode;
    //如果子集获取不到serviceId，则取资源包的
    if(playJson.serviceId == ""){
        //playJson.serviceId = detailJson.goodsId;
        playJson.resourceId = playJson.folderAssetId;
//		if(playJson.chargeMode == 6){
//			playJson.pkgChargeMode = "6";
//		}else{
//			playJson.pkgChargeMode = "5";
//		}
    }
    playJson.goodsId = playJson.serviceId;
    var playTime = parseInt(playJson.displayRunTime,10)||0;
    playJson.playTime = playTime;
    playJson.columnId = zybData.parentAssetId;
    IEPG.doPlayAction(playJson);

}
function setGlobalToPlayNext(_index){
    setGlobalVar("playType","pakg");   // 电视剧续播标识
    setGlobalVar("mediaFocus", _index);//保存当前播放章节数
    setGlobalVar("pakgAssetId", zybData.assetId);//保存当前资源包的id，用于电视剧播放下一集
    setGlobalVar("sumListLength",mediaJson.length-1);
}

function moreMedia()
{
    turnMoreMedia(moreMediaCurPage);
}

function turnMoreMedia(curPage)
{
    var count = parseInt(mediaJson.length / moreMediaSize) + 1 ;
    if(mediaJson.length == undefined || mediaJson.length == 0 )
    {
        count = 0;
    }
    if(curPage > count)
    {
        curPage = 1;
    }
    else if(curPage < 1)
    {
        curPage = count;
    }
    moreMediaCurPage = curPage;
    showMoreMedia(moreMediaCurPage);
}

function  doPageDownPressWhenShow(event, keyValue)//当有弹出框时，按下一页
{
    if(tipFlag)
    {
        turnNextMoreMedia();
    }
}
function  doPageUpPressWhenShow(event, keyValue)//当有弹出框时，按上一页
{
    if(tipFlag)
    {
        trunPrevMoreMedia();
    }
}

function turnNextMoreMedia()
{
    turnMoreMedia(moreMediaCurPage+1);
}
function trunPrevMoreMedia()
{
    turnMoreMedia(moreMediaCurPage-1);
}
function showMoreMedia(curPage)
{
    var mediaPop = '<div class="alertBg">'
        + '<div class="alert">'
        + '<div class="alertTitle"></div>'
        + '<div class="collect">';
    var id = "";
    var index = (curPage -1) * moreMediaSize;
    for(var i = index; i < mediaJson.length && i < index + moreMediaSize; i++)
    {
        if(i%moreMediaSize == 0)
        {
            id = " id='OKButton' ";
        }
        else
        {
            id = "";
        }
        mediaPop += '<input ' + id + ' onclick="onPlayMedia(' + i + ')" type="button" class="" onfocus="changeObjClass(this,\'setFocus\')" onblur="changeObjClass(this,\'\')" type="button" value="' +  mediaJson[i].chapter + '"/>';
    }
    mediaPop += '</div> </div></div>';
    setTimeout(function(){showInfo(mediaPop);},250);
//	showInfo(mediaPop);
}

function EnvNumberInputFocus(handler)
{
    if(isNaN(handler.value))
    {
        handler.value = "";
    }
}

function EnvNumberInputBlur(handler)
{
    if(handler.value =="" || isNaN(handler.value))
    {
        handler.value = "请输入集数";
    }
}

function comfirmOnclick()
{
    if(mediaJson == null || mediaJson.length == 0) return; //没有剧集直接返回
    if(isNaN(obj.value))
    {
        obj.value = 1;
    }
    else if(obj.value > mediaJson.length )
    {
        obj.value = mediaJson.length;
    }
    else if(obj.value < 1)
    {
        obj.value = 1;
    }
    var dsjc_curPage=getGlobalVar("turnPage_curPage");
    setGlobalVar("dsjcgq_curPage",dsjc_curPage);
    //var cate_Id=getQueryStr(url,"cateId");
    var cate_Id= getGlobalVar("cate_Id");
    setGlobalVar("cate_Id",cate_Id);
    setGlobalVar("mediaId",parseInt(obj.value-1));//保存输入集数点播的下标
    if(parseInt(obj.value-1)<=mediaJson.length-1){
        setGlobalToPlayNext(parseInt(obj.value-1));
    }

    var playJson = mediaJson[obj.value - 1];
    playJson.folderAssetId = zybData.parentAssetId;
    if(playJson.chargeMode == ""){
        playJson.chargeMode = zybData.chargeMode;
    }
    playJson.pkgChargeMode = zybData.chargeMode;
    if(playJson.serviceId == ""){
        playJson.resourceId = playJson.folderAssetId;
    }
    playJson.goodsId = playJson.serviceId;
    var playTime = parseInt(playJson.displayRunTime,10)||0;
    playJson.playTime = playTime;
    playJson.columnId = zybData.parentAssetId;
    IEPG.doPlayAction(playJson);

    //onPlayAction(mediaJson[obj.value - 1],"0");
}
//清除记录光标
function clearFocus()
{
    setGlobalVar("mediaPage",1);//清除当前页数
    mediaId=setGlobalVar("mediaId","");//清除集数记忆的下标
    //setGlobalVar("indexId","");//清除影片列表记忆的下标
}
//获得当前播放集数的断点
function  getCurrentPlayJson( ){
    //检查书签获得续播时间点
    var VOD_checkBookmark = { //folderAssetId用资源包assetId
        'data':'<CheckSavedProgram  folderAssetId="'+titleAssetId+'" portalId="'+portalId+'" client="'+cardId+'" account="'+userId+'"  />',
        "callBack" : checkCurrentBookmark
    };
    setTimeout(function(){
        IEPG.getData(URL.VOD_checkBookmark, VOD_checkBookmark);
    },10);
}

var CurrentBookmarkFlag ;
var CurrentTime = "";
var str = "";
var CurrentBookNumFocus = "";

//检查当前播放集数断点，续播时间点回掉方法
function checkCurrentBookmark(_dataJson) {

    var obj = document.getElementById("watchHistory");

    CurrentBookmarkFlag = _dataJson.bookmarkFlag;

    //有断点
    if(CurrentBookmarkFlag == "true"){

        //obj.style.visibility= "visible";

        var resourceId = _dataJson.assetId;

        for(var i=0;i<mediaJson.length;i++){
            if(mediaJson[i].assetId==resourceId){

                CurrentBookNumFocus= i;

                break;
            }


        }


        var CurrentResumePoint = _dataJson.timePosition;

        var  minute = parseInt( CurrentResumePoint / 60 );
        var  second = parseInt( CurrentResumePoint % 60 );

        if(minute > 0){

            CurrentTime = " "+minute+"分"+second+"秒";

        }else{

            CurrentTime = " "+second+"秒";
        }



        str = "上次观看:第"+(CurrentBookNumFocus+1)+"集 "+CurrentTime;

        obj.innerHTML = str;


        //第一次播放
    }else{

        //CurrentTime = "";

        //obj.style.visibility= "hidden";

        obj.innerHTML = "";
    }
}


var numId;
function setIdValue(id){
    numId = id;
}