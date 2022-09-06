var Tabdata;
    var CellArr = [];
    var Area = 0;
    var Tab;
    var ScrollH;
    var tabIndex = 0;
    var isBack="n";
    var lastUpdateTime;
    var updateInterval = 7200000;//更新布局时间间隔；
    var isNeedUpdate = false;
	var weatherArray = null;
    var wIndex = 0;
	var smartCardId = null;
    var districtCode = 1004; //区域编码
    var planId;//布局ID
	var confirmUrl="";//焦点移动到资源块上的链接url
    var imgar = [];
    var roleTabMargin;
    var roleTabPos = [];
	try{
		var user =users.currentUser;
	}catch(e){

	}
//	var lock = true;
    var isMenu =  parseInt(getGlobalVar('isMenu') || 1);//是否是通过按的菜单键进的首页,1代表是
	var keyUpTime =0;

    function initPage() {
        if(!SumaJS.globalPlayer){
            SumaJS.createPlayer();
        }
    	if(isMenu == 1){//判断是否通过菜单键刷新重新进入首页
			cleanFocusCache();
		}
        SumaJS.eventManager.addEventListener("mouiEventHander", this, 41);
        SumaJS.debug("initPage onload");
        getSavaData();
        if(isBack == "y"){
            if(NeedUpdate()){
                SumaJS.debug("initPage 11111");
				//queryUserInfo();
				getAreaCodeAndver();
                //initWeatherInfo();
                getData();
            }else{
                SumaJS.debug("initPage 2222");
				getAreaCodeAndver();
                var tabData = getGlobalVar("tabData");
                initTab(tabData);
            }
			setGlobalVar('isMenu',1);
			weatherArray = JSON.parse(getGlobalVar("weatherData"));
        }else{
            SumaJS.debug("initPage 3333");
			//queryUserInfo();
			getAreaCodeAndver();
			//initWeatherInfo();
            getData();
        }
		if(tabIndex == 0){
			setLivePlay();
		}else{
			stopLivePlay();
		}
        setDate();
		//setInterval("weatherChange()",4000);

    }

//	function setInitLivePlay(){
//        smallHomeVideo.playByOrder(7, 0); //将小视频播放移到此处。
//	}
    function setLivePlay(){
      //RecLiveChannel.getData();
      SumaJS.debug("initPage setLivePlay");
      smallHomeVideo.playByOrder(7, 0); //将小视频播放移到此处。
   }
   function stopLivePlay(){
       SumaJS.debug("initPage stopLivePlay");
       SysSetting.setEnv("KAIJIZHIBO", "false");

        if(typeof(SysSetting.setLoadProgressFlag) == "function") {
            SysSetting.setLoadProgressFlag(1);
        }
        if(SumaJS.globalPlayer) {
            if(enterTimeShift) {
                SumaJS.stopPlayer(1);
            } else {
                SumaJS.stopPlayer(0);
            }
            //SumaJS.releasePlayer();
        }
        var deployType = DataAccess.getInfo("Autodeployer", "type");
        if(deployType == "oc" || deployType == "auto-oc") {
            Autodeployer.stop();
        }
    }

    function NeedUpdate(){
        SumaJS.debug("initPage NeedUpdate");
        var now = new Date().getTime();
        if(now - lastUpdateTime > updateInterval){
            isNeedUpdate = true;
        }
        return isNeedUpdate;
    }

    function getData(){
        SumaJS.debug("initPage getData");
        var smartCardId = getSmartCardId();
        ajax({
            type: "GET",
            url: iepgIP +'getRoleTab?smartCardId='+smartCardId,
            error: function () {
                SumaJS.debug("initPage  getData error");
                var startUpDateTime = new Date().getTime();
                if(typeof(tabDatas)=="object"){
                    var data = JSON.stringify(tabDatas).toString();
                    setGlobalVar("tabData",data);
                }
                SumaJS.debug("initPage getData fail to get nativeRoleTabData success");
                setGlobalVar("lastUpdateTime",startUpDateTime);
                initTab(data);
            },
            success: function (data) {
                var startUpDateTime = new Date().getTime();
                SumaJS.debug("initPage  getData success");
                setGlobalVar("lastUpdateTime",startUpDateTime);
                setGlobalVar("tabData",data);
                initTab(data);
            }
        });
    }
    function initTab(data) {
        SumaJS.debug("initPage initTab");
        var jsonData = JSON.parse(data);
        $('bg').style.background = 'url(' + jsonData.roleList[0].tabList[tabIndex].tabBgUrl + ')';
        planId = jsonData.planId;
        roleTabMargin = jsonData.margin;
        loadTabPos();
        Tabdata = jsonData.roleList[0].tabList;
        loadImg();
        Tab = new TabView(Tabdata, tabIndex);
        Tab.init('RoleTab', 'TabCell');
        Tab.onfocus();
        //初始化
        if(isBack == "y"){
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
            tabIndex = index;
            SumaJS.debug("initPage initTab tabFub");
            //console.log(Tabdata[index].tabId)
            if (CellArr[index] && !isNeedUpdate) {
                ScrollH = CellArr[index];
			//	lock = true;
            } else {
//                if(isBack === "y"){
//                    if(isNeedUpdate){
//                       initCellData(tabIndex);
//					   initMarqueeData();
//                    }else{
//                       initCell(CellArr[index].data, index);
//					   var marqueeData = getGlobalVar("marqueeData");
//					   initMarquee(JSON.parse(marqueeData).marqueeList);
//                    }
 //               }else{
                    initCellData(index);
//					initMarqueeData();
//               }
            }
			if(index == 0){
                setLivePlay();
			}
            else{
                stopLivePlay();
			}
        }
        Tab.downFun = function () {
            if (CellArr[tabIndex]){
                Area++;
                Tab.onblur(true);
                SumaJS.debug("initPage initTab downFun");
				confirmUrl = ScrollH._data[ScrollH.focusId].intent;
				if($(ScrollH.focusId+"").style.display == "none"){//如果下一个资源块为隐藏状态，则默认将焦点移到滑动资源块数组第0个上
					ScrollH.focusId = rollArr[0].cellId;
				}
				ScrollH && ScrollH.onfocus();
            }
        }

    }
    function loadTabPos(){
        SumaJS.debug("initPage loadTabPos");
        var array = roleTabMargin.split(",");
        for (var i=0 ; i< array.length ; i++)
        {
            roleTabPos[i]=array[i];
        }
        if(roleTabPos[0]=="287" && roleTabPos[1]=="80"){
            $("RoleTab").style.left="0px";
            $("RoleTab").style.top="92px";
        }else{
            $("RoleTab").style.left=roleTabPos[0]+"px";
            $("RoleTab").style.top=roleTabPos[1]+"px";
        }
    }
    function loadImg(){
        SumaJS.debug("initPage loadBgImg");
        for(var i=0; i<Tabdata.length; i++){
            imgar[i] = new Image();
            imgar[i].src = Tabdata[i].tabBgUrl;
            imgar[i].onload=function(){
                this.width = 1280;
                this.height = 720;
            }
        }
    }
    //从栏目页返回到首页后初始化CellArr
	function backContent(){
		console.log(CellArr);
        SumaJS.debug("initPage backContent");
        for(var i = 0;i<CellArr.length;i++){
            if(CellArr[i]!=null){
			var mFocusId = CellArr[i].focusId;
            CellArr[i] = new ScrollHView(CellArr[i].data);
			CellArr[i].focusId = mFocusId;
            CellArr[i].init(i);
			CellArr[i].upFun = function (){
                Area--;
                Tab.onfocus();
            }
         }
		//console.log(CellArr);
      }
    }
    function initCellData(index) {
        SumaJS.debug("initPage initCellData");
        var tabId = Tabdata[index].tabId;
        ajax({
            type:"GET",
            url: iepgIP+'getTabCell?planId='+planId+'&tabId=' + tabId,
            success: function (data) {
                SumaJS.debug("initPage initCellData  success");
                initCell(JSON.parse(data).tabCell,index);
            },
            error: function () {
                SumaJS.debug("initPage initCellData  error");
                var data;
                if(index==0){
                    data=cellDatas0;
                }else if(index==1){
                    data=cellDatas1;
                }else if(index==2){
                    data=cellDatas2;
                }else if(index==3){
                    data=cellDatas3;
                }else if(index==4){
                    data=cellDatas4;
                }else if(index==5){
                    data=cellDatas5;
                }else if(index==6){
                    data=cellDatas6;
                }else if(index==7){
                    data=cellDatas7;
                }
                if(typeof(data)=="object"){
                    initCell(data.tabCell,index);
                }
                SumaJS.debug("initPage initCellData fail to  initPage nativeTabCellData success");
            }
        });
    }

	function initMarqueeData(){
        SumaJS.debug("initPage initMarqueeData");
        var smartCardId = getSmartCardId();
		ajax({
            type:"GET",
            url: iepgIP +'getMarquee?smartCardId='+smartCardId+'&marqueeVersion=0',
            success: function (data)  {
                SumaJS.debug("initPage initMarqueeData  success");
                setGlobalVar("marqueeData",data);
                initMarquee(JSON.parse(data).marqueeList);
            },
            error: function () {
                SumaJS.debug("initPage initMarqueeData  error");
                if(typeof(marqueeDatas)=="object"){
                    var data = marqueeDatas;
                    setGlobalVar("marqueeData",JSON.stringify(data).toString());
                    initMarquee(data.marqueeList);
                }
                SumaJS.debug("initPage initMarqueeData fail to  initPage nativeMarqueeData success");
            }
        });
	}


    function initCell(data,index) {
        SumaJS.debug("initPage initCell");
        CellArr[index] = new ScrollHView(data);
        CellArr[index].init(index);
		console.log(CellArr);
        ScrollH = CellArr[index];
        ScrollH.upFun = function () {
            Area--;
            Tab.onfocus();
        }
        if (Area == 1) {
            SumaJS.debug("initPage initCell  area=1");
			if(isBack == "y" && index == rollTabId){
                var rollArrBak = JSON.parse(getGlobalVar("rollArrBak"));
				rollArr = JSON.parse(JSON.stringify(rollArr));
                var index = rollArr.length - rollArrBak.length;
                for(var i =0;i<rollArr.length;i++){
                    if(i<index){
                        $(rollArr[i].cellId+"").style.display= "none";
                        $(rollArr[i].cellId+"").style.top = rollArr[0].cellY +"px";
                    }else{
						$(rollArr[i].cellId+"").style.display = "block";
                        $(rollArr[i].cellId+"").style.top = rollArrBak[i-index].cellY +"px";
                        if(rollArrBak[i-index].cellY > rollTop){
                            $(rollArr[i].cellId+"").style.display = "none";
                        }
                    }
					if(ScrollH.map[rollArr[i].cellId]['right'] == undefined){
						ScrollH.map[rollArr[i].cellId]['right'] = ScrollH.map[rollArr[0].cellId]['right'];
					}else if(ScrollH.map[rollArr[i].cellId]['left'] == undefined){
						ScrollH.map[rollArr[i].cellId]['left'] = ScrollH.map[rollArr[0].cellId]['left'];
					}
                }
				rollArr = rollArrBak;
            }
            Tab.onblur(true);
            ScrollH && ScrollH.onfocus();
			confirmUrl = ScrollH._data[ScrollH.focusId].intent;
        }else if(isBack !== "y" && index == liveTabId){//开机或者按菜单键刷新后焦点默认落在直播窗口上
            SumaJS.debug("initPage initCell  liveTabId");
			Area++;
			Tab.onblur(true);
            ScrollH && ScrollH.onfocus();
			confirmUrl = ScrollH._data[ScrollH.focusId].intent;
		}
    }

	function initMarquee(data) {
        SumaJS.debug("initPage initMarquee");
		for(var i = 0;i<data.length;i++){
			var marquee = data[i];
			if(marquee.type == 0){
                SumaJS.debug("initPage initMarquee notice");
				var txt = marquee.infoList[0].font.text;
				$("notice").innerHTML ="";
				$("notice").innerHTML = txt;
			}else if(marquee.type == 1){
                    SumaJS.debug("initPage initMarquee logo ");
					$("logo").style.background = "url('"+marquee.bgImage+"')";    
                    $("logo").style.left=marquee.position[0]+"px";
                    $("logo").style.top=marquee.position[1]+"px";
                    if(marquee.position[2]!=1920)
                    {
                      $("logo").style.width=marquee.position[2]+"px";
                      $("logo").style.height=marquee.position[3]+"px";
                    }else{
                        $("logo").style.width="145px";
                        $("logo").style.height="30px";
                    }
			}
		}
        if(SumaJS.globalPlayer){
            SumaJS.debug("initPage initialVolumebar start ");
            setTimeout(initialVolumebar(),5000);
        }
    }

	//设置日期
	function setDate() {
        SumaJS.debug("initPage setDate ");
		var nowDate = new Date();
		var year = nowDate.getFullYear();
		var month = nowDate.getMonth()+1;
		var monthDay = nowDate.getDate();
		var weekDay = nowDate.getDay();
		var hours = nowDate.getHours().toString();
		var min = nowDate.getMinutes().toString();
		if (month/10 < 1) {
			month = "0" + month;
		}
		if (monthDay/10 < 1) {
			monthDay = "0" + monthDay;
		}
		if(weekDay == 0)
			weekDay=" 星期日 ";
		else if(weekDay == 1)
			weekDay=" 星期一 ";
		else if(weekDay == 2)
			weekDay=" 星期二 ";
		else if(weekDay == 3)
			weekDay=" 星期三 ";
		else if(weekDay == 4)
			weekDay=" 星期四 ";
		else if(weekDay == 5)
			weekDay=" 星期五 ";
		else if(weekDay == 6)
			weekDay=" 星期六 ";
		if(hours.length < 2){
			hours = "0"+hours;
		}
		if(min.length < 2){
			min = "0"+min;
		}
		var showTime = month+"/"+monthDay+" "+ hours+":"+min;
		$("date").innerHTML = showTime;
		$("week").innerHTML = weekDay;
		setTimeout("setDate();",60000);
	}
	   //获取天气预报数据
    function initWeatherInfo(){
        ajax({
            type:"GET",
            url: 'http://tvos.jsamtv.com/weather/weatherAction!getWeather.do',
            success: function (data) {
				setGlobalVar("weatherData",data);
                weatherArray =  JSON.parse(data);
            },
            error: function () {

            }
        });

    }

    //天气数据轮播
    function weatherChange()
    {
        try{
            var weather = weatherArray[wIndex];
            if (weather !== null && weather !== 'undefined' && weather !== '') {
                $('weatherCity').innerHTML = weather.city;
                $('weatherTemperature').innerHTML = weather.temperature;
                $('weatherDes').innerHTML = weather.des;
                $('weatherImage').src = weather.image;
                //设置日期
                setDate();
                wIndex++;
                if (wIndex == weatherArray.length) {
                    wIndex = 0;
                }
            }
        }catch(e){

        }

    }

 //回车事件
	function doConfirm() {
        if(Area > 0){
        isMenu = 0;
		saveData();//缓存焦点
		if(confirmUrl !== ""){
			if(confirmUrl=="S.package=ui://play.html;"){
                SumaJS.eventManager.removeEventListener("mouiEventHander");
                SumaJS.debug("initPage doConfirm play_tv");
                SysSetting.setEnv("KAIJIZHIBO", "false");
                OffChannelObj.saveOffChannelToM(currentService);
                OffChannelObj.saveOffChannel(currentService);
                SumaJS.eventManager.removeEventListener("titleObjEvent");
                SumaJS.loadModule("play_tv");
//                var thisService = RecLiveChannel.getRecChannel(7);alert(thisService+"==thisService===");
//                closeCycleControl.setNode("tv_page", [1], "Title");
//                closeCycleControl.pushNodeToStack();
//                if (smallHomeVideo.getIsPlayingNvod()) { //判定正在播放nvod
//                    var nvodObj = smallHomeVideo.getNvodObj();
//                    var obj = { NvodSource: nvodObj };
//                    this.loseFocus();
//                    SumaJS.loadModule("play_tv", JSON.stringify(obj));
//                } else if (currentService) {
//                    if (typeof thisService.serviceType != "undefined" && thisService.serviceType != 2) { //非广播节目
//                        alert("22222233344");
//                        OffChannelObj.saveOffChannelToM(thisService);
//                        OffChannelObj.saveOffChannel(thisService);
//                        this.loseFocus();
//                        SumaJS.loadModule("play_tv");
//                    }
//                }
			}else{
                if(confirmUrl=="S.package=;"){
                    return;
                }else if(confirmUrl=="ui://play.html"){//本地默认数据进入直播全屏
                    SumaJS.eventManager.removeEventListener("mouiEventHander");
                    SumaJS.debug("initPage doConfirm play_tv");
                    SysSetting.setEnv("KAIJIZHIBO", "false");
                    OffChannelObj.saveOffChannelToM(currentService);
                    OffChannelObj.saveOffChannel(currentService);
                    SumaJS.eventManager.removeEventListener("titleObjEvent");
                    SumaJS.loadModule("play_tv");
                }else
                {
                    SumaJS.debug("initPage doConfirm");
                    stopLivePlay();
                    location.href= confirmUrl;
                }
			}
		}
	  }
    }
	//清除缓存
    function cleanFocusCache(){
        SumaJS.debug("initPage cleanFocusCache");
    	var storage = window.localStorage;
        var len = storage.length;
        for (var i=0; i  <  len; i++){
            var key = storage.key(i);
            var value = storage.getItem(key);
           	storage.setItem(key,"");
        }
    }

    //缓存
    function saveData(){
        SumaJS.debug("initPage saveData");
        setGlobalVar('focusId',ScrollH.focusId);
        setGlobalVar('Area',1);
        setGlobalVar('tabIndex',Tab.focusPos);
		setGlobalVar('CellArr',JSON.stringify(CellArr).toString());
        setGlobalVar('isBackToPortal',"y");
		setGlobalVar('districtCode',districtCode);
		if(rollArr.length >0){
            setGlobalVar('rollArrBak',JSON.stringify(rollArr).toString());
			setGlobalVar('rollTop',rollTop);
        }
		if(rollTabId !== null){
			setGlobalVar('rollTabId',rollTabId);
		}
        setGlobalVar('isMenu',isMenu);
    }

    function getSavaData(){
        SumaJS.debug("initPage getSavaData");
        lastUpdateTime = getGlobalVar('lastUpdateTime') || new Date().getTime();
        Area = parseInt(getGlobalVar('Area')) || 0;
        tabIndex = parseInt(getGlobalVar('tabIndex') || 0);
        isBack = getGlobalVar('isBackToPortal');
		var CellArrStr = getGlobalVar('CellArr') || "";
		if(CellArrStr != ""){
			CellArr = JSON.parse(getGlobalVar('CellArr'));
		}		
		districtCode = getGlobalVar('districtCode') || districtCode;
		rollTop = parseInt(getGlobalVar('rollTop') || 470);
		var rollTabIdBak = getGlobalVar('rollTabId') || "";
		if(rollTabIdBak !== ""){
			rollTabId = parseInt(rollTabIdBak);
		}
     //   isMenu = parseInt(getGlobalVar('isMenu') || 1);
    }


this.eventHandler = function(event) {
        var keyCode = event.keyCode || event.which;
        SumaJS.debug("initPage mouiEventHander keyCode="+keyCode);
        switch (keyCode) {
            case KEY.LEFT:
            case KEY.LEFT_N:
                moveLeft();
                break;
            case KEY.UP:
            case KEY.UP_N:
                moveUp();
                break;
            case KEY.RIGHT:
            case KEY.RIGHT_N:
                moveRight();
                break;
            case KEY.DOWN:
            case KEY.DOWN_N:
                moveDown();
                break;
            case KEY.ENTER:
            case KEY.ENTER_N:
                doConfirm();
                break;
            case KEY.BACK:
            case KEY.QUIT:
                if(tabIndex==0)
                {
                    isMenu = 0;
                    saveData();//缓存焦点
                    setTimeout(function goTV(){
                        SumaJS.eventManager.removeEventListener("mouiEventHander");
                        SumaJS.debug("initPage back or quit play_tv");
                        SysSetting.setEnv("KAIJIZHIBO", "false");
                        OffChannelObj.saveOffChannelToM(currentService);
                        OffChannelObj.saveOffChannel(currentService);
                        SumaJS.eventManager.removeEventListener("titleObjEvent");
                        SumaJS.loadModule("play_tv");
                    },500);

                }
                break;
            case KEY.VOICEUP:
                if (volumebar) {
                    SumaJS.debug("initPage tvPageEventHandler volume up");
                    volumebar.volumeUp(currentService, { curService: currentService, code: KEY_VOLUME_UP });
                }
                break;
            case KEY.VOICEDOWN:
                if (volumebar) {
                    SumaJS.debug("initPage tvPageEventHandler volume down");
                    volumebar.volumeDown(currentService, { curService: currentService, code: KEY_VOLUME_DOWN });
                }
                break;
            case KEY.MUTE:
                if (volumebar) {
                    SumaJS.debug("initPage tvPageEventHandler volume mute");
                    volumebar.muteFunc();
                }
                break;
            case KEY.HOMEPAGE:
                return true;
                break;
            default:
                return true;
                break;
        }
};

ScrollHView.prototype.onkey = function (action) {
    this.onblur();
    var scrollview = this.id;
	var lastFocusId = parseInt(this.focusId);
    var current = this.map[this.focusId][action];
	//判下一个资源块能否获得焦点
    if (current){
		if(this.map[current.cellId]['canGetFocus'] == 0){
			current = this.map[current.cellId][action];
		}
		confirmUrl = current.intent;
        this.focusId = current.cellId;
        var left = parseInt($(scrollview).style.left);
        if (current.cellX + current.width + left > 1920){
            $(scrollview).style.left = (1920 - current.cellX - 180 - current.width) + 'px';
        }
        if (current.cellX + left < 0) {
            $(scrollview).style.left = (180 - current.cellX) + 'px';
        }
		switch (action){
			case 'down':
				console.log(rollArr);
				console.log(CellArr);
				var topValue = parseInt($(current.cellId+"").style.top.split("p")[0]);
				if(Tab.focusPos == rollTabId && topValue > beyondTop){
				//	var CellArrBak = JSON.parse(JSON.stringify(CellArr));//深度拷贝CellArr对象
					rollArr = JSON.parse(JSON.stringify(rollArr));
					this.map[current.cellId]['right'] = this.map[firstRoll.cellId]['right'];
					this.map[current.cellId]['left'] = this.map[firstRoll.cellId]['left'];
					var id = rollArr[0].cellId;
					$(id+"").style.display = "none";
					var lastTop = rollArr[0].cellY;
					var currentTop;
					for(var i = 0;i<rollArr.length;i++){
						if(i>0){ 
						   $(rollArr[i].cellId+"").style.top = lastTop + 'px';
						   currentTop = rollArr[i].cellY;
						   rollArr[i].cellY = lastTop;
						   lastTop = currentTop;
						}
						if(currentTop < beyondTop && rollArr[i+1].cellY >= beyondTop){
							rollTop = currentTop;
						}
					}
					rollArr.splice(0,1);
				//	rollArrIndex--;
				//    rollArr.push(current);
					$(current.cellId+"").style.top=rollTop + 'px';
					$(current.cellId+"").style.display = "block";
				//	CellArr = CellArrBak;
				}
			//	rollArrIndex++;
				break;
			case 'up':
				if(Tab.focusPos == rollTabId && lastFocusId == rollArr[0].cellId){
				//	var CellArrBak = JSON.parse(JSON.stringify(CellArr));
					rollArr = JSON.parse(JSON.stringify(rollArr));
					var initTop = rollArr[0].cellY;
					for(var i = 0;i<rollArr.length;i++){
						if(i !== rollArr.length-1){
							rollArr[i].cellY = rollArr[i+1].cellY
						}else{
							rollArr[i].cellY  = maxTop;
						}
						$(rollArr[i].cellId+"").style.top = rollArr[i].cellY + 'px';
						if(rollArr[i].cellY > rollTop){
							$(rollArr[i].cellId+"").style.display = "none";
						}
					}
					var currentBak = JSON.parse(JSON.stringify(current));
					currentBak.cellY = initTop;
					rollArr.splice(0,0,currentBak);
					$(current.cellId+"").style.display = "block";
				//	CellArr = CellArrBak;
				}
			//	rollArrIndex--;
			//	if(rollArrIndex < 0){
			//		rollArrIndex = 0;
			//	}
				break;
			case 'left':
				var currentBak = JSON.parse(JSON.stringify(current));
				if($(current.cellId+"").style.display == "none"){//如果下一个资源块为隐藏状态，则默认将焦点移到滑动资源块数组第0个上
					currentBak = rollArr[0];
				//	rollArrIndex = 0;
				}
				confirmUrl = currentBak.intent;
				this.focusId = currentBak.cellId;
				break;
		}
        this.onfocus();
    } else {
        switch (action) {
            case 'up':
                this.up();
                break;
            case 'down':
                this.down();
                break;
			case 'left':
				Tab && Tab.onkey('left');
				Tab && Tab.onkey('down');
				Area = 1;
				break;
			case 'right':
				Tab && Tab.onkey('right');
				Tab && Tab.onkey('down');
				Area = 1;
				break;
            default:
                this.onfocus();
                break;
        }
    }
}

var volumebar;
function initialVolumebar() { //初始化 volumebar
    var uiObj = {
        volumebar: SumaJS.getDom("initPage tv_page_volume_bar"),
        volumeProgress: SumaJS.getDom("initPage tv_page_volume_bar_progress"),
        volumeValue: SumaJS.getDom("initPage tv_page_volume_bar_num"),
        mute: SumaJS.getDom("initPage tv_page_volume_mute")
    };
    var cfg = {
        minVolume: 0,
        maxVolume: 32,
        uiObj: uiObj,
        player: SumaJS.globalPlayer.mediaPlayer,
        onUIAdapter: function(dataObj, uiObj) {
            if (typeof dataObj.mute != "undefined" && dataObj.mute == 1) {
                uiObj.mute.style.display = "block";
            } else if (typeof dataObj.mute != "undefined" && dataObj.mute == 0) {
                uiObj.mute.style.display = "none";
            }
            if (dataObj.showFlag) {
                uiObj.volumeValue.innerHTML = dataObj.value;
                var width = 24 * dataObj.value;
                uiObj.volumeProgress.style.width = width + "px";
                uiObj.volumebar.style.display = "block";
                this.focus = 1;
            } else {
                uiObj.volumebar.style.display = "none";
                this.focus = 0;
            }
        },
        onEventHandler: function(event) {
            SumaJS.debug("initPage tv_page volume entered focus = " + this.focus);
            if (this.focus) {
                var val = event.keyCode || event.which;
                SumaJS.debug("initPage tv_page volume keyCode = " + val);
                switch (val) {
                    case KEY_VOLUME_UP:
                        this.volumeUp(currentService);
                        break;
                    case KEY_VOLUME_DOWN:
                        this.volumeDown(currentService);
                        break;
                    case KEY_MUTE:
                        this.muteFunc();
                        break;
                    case KEY_EXIT:
                    case KEY_UP:
                    case KEY_DOWN:
                    case KEY_LEFT:
                    case KEY_RIGHT:
                        this.hide();
                        return true;
                        break;
                    case KEY_ENTER:
                        this.hide();
                        return true;
                        break;
                    default:
                        return true;
                        break;
                }
                return false;
            } else {
                return true;
            }
        }
    }
    volumebar = new VolumeBar(cfg);
    volumebar.setFocusState(0);
    //SumaJS.eventManager.addEventListener("volumebar", volumebar, 98);
}

