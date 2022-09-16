var Tabdata;//标签数据
	var rollTabData;//getRoleTab接口返回的数据
    var CellArr = [];
    var Area = 0;
    var Tab;
    var ScrollH;
    var tabIndex = 0;
    var homeTab = 0;
    var updateTab = 0;
    var isBack="n";
    var lastUpdateTime;
    var updateInterval = 7200000;//更新布局时间间隔；
    var isNeedUpdate = false;
	//var weatherArray = null;
    var wIndex = 0;
	var smartCardId = null;
	var trueCardId = null;//未经处理的智能卡号
    var planId;//布局ID
	var confirmUrl="";//焦点移动到资源块上的链接url
	try{
		var user =users.currentUser;
	}catch(e){}
    //区分是开机进入首页还是刷新进入首页，逻辑：开机后isMenu=0,加载布局后isMenu=1存入缓存，且只有重启才清除该标志
    var isMenu =  parseInt(getGisMenu() || 0);
//	var keyUpTime =0;
	var resultCode = -1;//-1表示向aaa查询用户信息失败
	var caName = null;
    var confKey = 1;//后门按键
	var userCode = null;
    var stbNo = null;
    var mac = null;
    try{
        userCode = CITV.loginInfo.getValue("userId");
        stbNo = hardware.STB.serialNumber;
        mac = network.macAddress;
    }catch(e){}
	var isAutoGoPlay = true;  //开机后用户在N秒后没做任何操作，则自动打开直播页面
	var waitTime = 0;
	var iepgAddr = '';
	var canPreview = "0";//不支持预发布布局预览
	var liveArr = [];//直播窗口对象数组
    var tabOptions=[];
    var frequency;
    var rawFrequency;
    var serviceId;
    var marqueeBg;
    // 拦截菜单键
    var needSetFocus = true;
    var menuData =true;
    var mp;
    var roleBackDoorList = [];
    function initPage(){
        //document.getElementById('test').innerHTML = "这是单引擎";
        setGlobalVar('currentPage', 2);
        initMp();
        // getCardId();
        /* isMenu=1 */
		if(isMenu === 1){//判断是否通过菜单键刷新重新进入首页
			cleanFocusCache();
		}
        setRefreshableTimer();
		getSavaData();
		// xwj: 不需要getGlobalVar部分，因为第二个页面不会从后门页配置。基于测试需要保留getQueryString部分
        iepgAddr = getQueryString("iepgAddr") || getGlobalVar('iepgAddr');//判断是否从后门配置参数获取的布局
        if(iepgAddr !==null && iepgAddr !=='undefined' && iepgAddr !=='' && iepgAddr !=='null'){
            getConfigure();
            heartBeat();
            if(isBack === "y"){
                var tabData = getGTabData()
                initTab(tabData);
            }else{
                getData();//第二
            }
            /* 设置isMenu=1 开机会进入首页*/
            setGisMenu(1);
        }else{
            if (isBack === "y") {
                if (NeedUpdate()) {
                    load(false);
                } else {
                    heartBeat();
                    // showLayout(false);
                    var tabData = getGTabData()
                    initTab(tabData);
                }
            } else {
                load(true);
            }
            /* isMenu=1 */
            setGisMenu(1);
        }
    }

    function initMp() {
        try{
            mp = new MediaPlayer();
            mp.setVideoDisplayMode(2);
        }catch(e){}
    }

    function load(firstGoPlay){
	// xwj： 第二页流程也不需要做AAA认证，第一页已经做过AAA认证，并且数据是共享的；
	// xwj: 共享数据包括：分公司编码（districtCode）、天气代码(weatherCityCode)、区域码（area）、布局版本号（version）
	// xwj: 考虑在哪里获取上述数据
	// xwj: 不需要执行的流程是：自行梳理，感觉你还没有搞清楚哪些流程需要，哪些流程不需要
      queryTownUserInfo(function() {
          heartBeat();
          getHotPlay();
          getData()
          if(firstGoPlay){
              try{
                  waitTime = parseInt(iPanel.eventFrame.firstToPlayAuto);
              }catch(e){
                  waitTime = 15;
              }
              if(waitTime > 0){
                  setTimeout("firstGoPlayAuto()",waitTime*1000);
              }
          }
      });
    }

    // function getCardId(){
    //     try{
    //         smartCardId = CA.card.serialNumber;
    //         trueCardId = smartCardId;
    //         caName = CA.name;
    //     }catch(e){}
    //     if(smartCardId !==null && smartCardId !=='undefined' && smartCardId !=='' && smartCardId.length > 2 )
    //     {
    //         if(caName === "永新视博" && navigator.userAgent.indexOf("std") == -1){//天柏的卡用15位进行查询
    //           smartCardId = smartCardId.substring(0,smartCardId.length-1);
    //         }
    //     }
    // }

    function getConfigure(){
        iepgIP = getQueryString("iepgAddr") || getGlobalVar('iepgAddr');
        areaCode = getQueryString("areaCode") || getGlobalVar('areaCode');
        version = getQueryString("version") || getGlobalVar('version');
		    canPreview = getQueryString("canPreview") || getGlobalVar('canPreview');
    }

    function NeedUpdate(){
        var now = new Date().getTime();
        if(now - lastUpdateTime > updateInterval){
            isNeedUpdate = true;
        }
        return isNeedUpdate;
    }
    /* 一、先加载getData */

    function getData(){
        ajax({
            type: "GET",
            url: iepgIP+'getRoleTab?roleId=&version='+version+'&productType=DVB&areaCode='+areaCode+'&appType=moui&smartCardId='+trueCardId+'&isTest='+canPreview+'&uc='+getUC(),
            error: function () {
                gotoLive();
            },
            success: function (data) {
                var startUpDateTime = new Date().getTime();
                setGlastUpdateTime(startUpDateTime);
                setGTabData(data);
                initTab(data);
		// xwj: 快捷键在第二个页面也不需要更新
		// xwj: 不需要执行的流程是：自行梳理
                initKeyboardConf(data);
            }
        });
    }
    function initTab(data) {
        var jsonData = JSON.parse(data);
		rollTabData = jsonData;
        planId = jsonData.planId;
        Tabdata = jsonData.roleList[0].tabList;
        tabOptions = jsonData.options;
        if (jsonData.options != null && jsonData.options.carouselInterval != null) {
            timeInterval = parseInt(jsonData.options.carouselInterval);
        }
        Tab = new TabView(Tabdata, tabIndex);
        Tab.init('RoleTab', 'TabCell');
        if (isBack != "y") {
            if (isMenu == 1) {
                tabIndex = updateTab;
            }else{
                tabIndex = homeTab;
            }
        }
        Tab.focusPos = tabIndex;
        var margin = jsonData.titleSpacing/2;
        if (margin && margin > 0 ) {
            var doms = document.getElementsByClassName("navA");
            for (var i = 0; i < doms.length; i++) {
                doms[i].style.marginLeft=margin+'px';
                doms[i].style.marginRight=margin+'px';
            }
        }
        Tab.onfocus();
        if(isBack === "y"){
            if(isNeedUpdate){
                initCellData(tabIndex);
				        initMarqueeData();
            }else{
                backContent();
                initCell(CellArr[tabIndex].data, tabIndex);
                var marqueeData = getGlobalVar("marqueeData");
                initMarquee(JSON.parse(marqueeData).marqueeList);
            }
        }else{
            initCellData(tabIndex);
			      initMarqueeData();
        }
        Tab.tabFub = function (index) {
            stopLivePlay();
            tabIndex = index;
            if (CellArr[index] && !isNeedUpdate){
                ScrollH = CellArr[index];
                checkCarouse(null);
              if(ScrollH.isShow === 0){
                CellArr[index].init(index);
                CellArr[index].isShow = 1;
              }else{
                checkLivePlay(tabIndex);
              }
                if (CellArr[index].showDownIcon) {
                    $("downIconLeft").style.display = "block";
                    $("downIconRight").style.display = "block";
                }else{
                    $("downIconLeft").style.display = "none";
                    $("downIconRight").style.display = "none";
                }
            } else {
              debugger
                initCellData(index);
            }
            changeBg();

        }
        Tab.downFun = function () {
            if (CellArr[tabIndex]){
                Area = 1;
                Tab.onblur(true);
                ScrollH.focusId = ScrollH.firstFocusId;
              if($(ScrollH.focusId+"").style.display === "none"){//如果下一个资源块为隐藏状态，则默认将焦点移到滑动资源块数组第0个上
                ScrollH.focusId = rollArr[0].cellId;
              }
                  confirmUrl = ScrollH._data[ScrollH.focusId].intent;
                  console.log(confirmUrl)
                  ScrollH && ScrollH.onfocus();
                  var cellObj = {};
                  cellObj.cellId = CellArr[tabIndex].focusId
                  cellCheckCarouse(null,cellObj);
            }
        }
        Tab.upFun = function () {
        	if(focusLogoArr){
        		Area--;
        		Tab.onblur(true);
        	}
        }
    }
    function changeBg(){
        if(Tabdata[tabIndex].tabBgUrl != null && Tabdata[tabIndex].tabBgUrl.length>0){
            $("bg").style.background = "url('" + Tabdata[tabIndex].tabBgUrl + " ') no-repeat 0 center" ;
        }else{
            $("bg").style.background = marqueeBg;
        }
    }
    //从栏目页返回到首页后初始化CellArr
	function backContent(){
    for(var i = 0;i<CellArr.length;i++){
      if(CellArr[i] !== null){
        var mFocusId = CellArr[i].focusId;
        CellArr[i] = new ScrollHView(CellArr[i].data,i);
        CellArr[i].focusId = mFocusId;
        CellArr[i].isShow = 0;
        CellArr[i].upFun = function (){
          Area--;
          Tab.onfocus();
        }
      }
    }
  }
    function queryUserInfo(callback)
    {
    	/*if (dev) {return;} //开发环境跳过 AAA接口*/
        //用户信息接口地址
        var URL = userInfoInterface.cityUrl;
	    //var URL = "http://172.31.177.244:18080/aaa/Business/CoshipService?wsdl";
        //拼接webService接口请求报文
        var data;
        data = '<?xml version="1.0" encoding="utf-8"?>';
        data = data + '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://service.business.coship.com/">';
        data = data + '   <soap:Header/>' + '   <soap:Body>' + ' <ser:queryUserInfo>' + '<queryInfo>';
        data = data + '<queryType>'+"1"+'</queryType>';
        data = data + '<setTopBoxId>'+'</setTopBoxId>';
        data = data + '<smartCardId>'+smartCardId+'</smartCardId>';
        data = data + '<TVCode>'+'</TVCode>';
        data = data +  '</queryInfo>' +'</ser:queryUserInfo>'+'</soap:Body>'+'</soap:Envelope>';
        ajax({
            type:"POST",
            url: URL,
            async:true,
	        parseData:false,
	        processData:false,
            contentType:"application/soap+xml;charset=utf-8",
            data:data,
            success: function (data)  {
                try{
                    var x2js = new X2JS();
                    var jsonObj = x2js.xml_str2json(data);
                    var userInfo = userInfo = jsonObj.Envelope.Body.queryUserInfoResponse.return.userInfo;
                    resultCode = jsonObj.Envelope.Body.queryUserInfoResponse.return.resultCode;
                    if(userInfo.districtCode){
                        districtCode = userInfo.districtCode;
			                  setArea();
                    }
                }catch(e){}
                callback();
            },
            error: function () {
                callback();
            }
        });
    }

    function setArea(){
	      var realArea = getArea(districtCode);
        areaCode =  realArea.pramValue.split(",")[0];
        version = realArea.pramValue.split(",")[1];
    }

    function queryTownUserInfo(callback){
        var queryType = {
            "userCode":1,
            "setTopBoxId":2,
            "smartCardId":3
        }
        var queryKey = "5BEC11A4769E0A0E800318C647E5D1B9";
        var sign = hex_md5(smartCardId+""+queryType.smartCardId+""+queryKey).toUpperCase();
        var url = userInfoInterface.townUrl+"?user_code=&set_top_tox_id=&smart_card_id="+smartCardId+"&query_type="+queryType.smartCardId+"&sign="+sign;
        ajax({
            type:"GET",
            url: url,
            time:3000,
            success: function (data)  {
                try{

                    data = eval('(' + data + ')');
                    if (data.result_code == 0) {
                        districtCode = data.result_data.yzyp_policy.policy_code;
                    	if(checkAreaExist(districtCode)){
                        	setArea();
	                        callback();
        	            }else{
                	        queryUserInfo(callback);
                   	    }
		            }else{
			            queryUserInfo(callback);
		            }
                }catch(e){
                    queryUserInfo(callback);
                }
            },
            error: function () {
                queryUserInfo(callback);
            }
        });
    }


	var isKeyUp = true;
