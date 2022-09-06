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
    var AudioObject;
    function init() {
        $("loader-wrapper").style.display="block";
         getData();
        //setDate();
    }

    /**
     * @description MediaPlayer 页面显示音频流
     * @param {object} _config 音频对象包含url，静音div的id
     * @param {string} staticId 页面上静音div的id
     * @param {string} videoUrl 音频url
     *
     var videoConfig = {
     staticId:"g_static",
     videoUrl:"http://192.168.1.2/music.mp3"
     }
     */
    var V, MOUI = V = MOUI || {};
    MOUI.MediaPlayer = function(_config) {
        var mp = null, muteMode = null;
        this.staticId = _config.staticId;
        this.videoUrl = _config.videoUrl || "";
    };

    MOUI.MediaPlayer.prototype = {
        openNewVideo : function() {
            try {
                mp = new MediaPlayer();
                muteMode = mp.getMute();
                mp.createPlayerInstance("video", 0);
                mp.source = this.videoUrl;
                mp.play();
                mp.refresh();
            } catch(err) {
                muteMode = 0;
            }
        },
        closeVideo : function() {
            try {
                if(mp != null) {
                    if(mp.releasePlayerInstance) {
                        mp.releasePlayerInstance();
                    } else {
                        mp.stop();
                    }
                }
            } catch(err) {
            }
        },
        initStatic : function() {
            if(muteMode == 1) {
                $(this.staticId).style.visibility = "visible";
            } else {
                $(this.staticId).style.visibility = "hidden";
            }
        },
        resetStatic : function() {
            if(muteMode == 1) {
                muteMode = 0;
                mp.audioUnmute();	//将当前播放实例解除静音状态
            } else {
                muteMode = 1;
                mp.audioMute();		//将某个播放实例设置为静音
            }
            this.initStatic();
        }
    };

    function setAudioPlay(data){
        var jsonData = JSON.parse(data);
        setTimeout(function() {
            var videoConfig = {
                staticId : "g_static",
                videoUrl : jsonData.musicList[0].localPath
            };
            AudioObject = new MOUI.MediaPlayer(videoConfig);
            AudioObject.openNewVideo();
        }, 300);
    }
    function stopAudioPlay(){
        AudioObject.closeVideo();
    }


    function NeedUpdate(){
        var now = new Date().getTime();
        if(now - lastUpdateTime > updateInterval){
            isNeedUpdate = true;
        }
        return isNeedUpdate;
    }

    function getData(){
        var smartCardId =  getSmartCardId();
        ajax({
            type: "GET",
            url: iepgIP +'getRoleTab?appType=welcome&smartCardId='+smartCardId,
            error: function () {//异常获取不到欢迎页，不再跳转到欢迎页
                $("loader-wrapper").style.display="none";
                SysSetting.setEnv("preparesRestartFlag","Y");
                setTimeout(gotoIndex(),100);
            },
            success: function (data) {
                $("loader-wrapper").style.display="none";
                if(typeof(JSON.parse(data).roleList)!='undefined' || JSON.parse(data).roleList!=null)
                {
                    var startUpDateTime = new Date().getTime();
                    setGlobalVar("lastUpdateTime",startUpDateTime);
                    setGlobalVar("tabData",data);
                    setAudioPlay(data);
                    initTab(data);
                }
                else
                {
                    SysSetting.setEnv("preparesRestartFlag","Y");
                    setTimeout(gotoIndex(),100);
                }

            }
        });
    }
    function initTab(data) {
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
				//initMarqueeData();
            }else{
				backContent();
				initCell(CellArr[tabIndex].data, tabIndex);
				var marqueeData = getGlobalVar("marqueeData");
                initMarquee(JSON.parse(marqueeData).marqueeList);
            }
        }else{
            initCellData(tabIndex);
			//initMarqueeData();
        }
        Tab.tabFub = function (index) {
            tabIndex = index;
            //console.log(Tabdata[index].tabId)
            if (CellArr[index] && !isNeedUpdate) {
                ScrollH = CellArr[index];
            } else {
                    initCellData(index);
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
				confirmUrl = ScrollH._data[ScrollH.focusId].intent;
				if($(ScrollH.focusId+"").style.display == "none"){//如果下一个资源块为隐藏状态，则默认将焦点移到滑动资源块数组第0个上
					ScrollH.focusId = rollArr[0].cellId;
				}
				ScrollH && ScrollH.onfocus();
            }
        }

    }
    function loadTabPos(){
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
        var tabId = Tabdata[index].tabId;
        ajax({
            type:"GET",
            url: iepgIP+'getTabCell?planId='+planId+'&tabId=' + tabId,
            success: function (data) {
                initCell(JSON.parse(data).tabCell,index);
            },
            error: function () {
                SysSetting.setEnv("preparesRestartFlag","Y");
                setTimeout(gotoIndex(),200);
            }
        });
    }

	function initMarqueeData(){
        var smartCardId = getSmartCardId();
		ajax({
            type:"GET",
            url: iepgIP +'getMarquee?smartCardId='+smartCardId+'&marqueeVersion=0',
            success: function (data)  {
                setGlobalVar("marqueeData",data);
                initMarquee(JSON.parse(data).marqueeList);
            },
            error: function () {
            }
        });
	}


    function initCell(data,index) {
        CellArr[index] = new ScrollHView(data);
        CellArr[index].init(index);
		console.log(CellArr);
        ScrollH = CellArr[index];
        ScrollH.upFun = function () {
            Area--;
            Tab.onfocus();
        }
        if (Area == 1) {
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
			Area++;
			Tab.onblur(true);
            ScrollH && ScrollH.onfocus();
			confirmUrl = ScrollH._data[ScrollH.focusId].intent;
		}
    }

	function initMarquee(data) {
		for(var i = 0;i<data.length;i++){
			var marquee = data[i];
			if(marquee.type == 0){
				var txt = marquee.infoList[0].font.text;
				$("notice").innerHTML ="";
				$("notice").innerHTML = txt;
			}else if(marquee.type == 1){
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
    }

	//设置日期
	function setDate() {
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


 //回车事件
	function doEnter() {
               stopAudioPlay();
               SysSetting.setEnv("preparesRestartFlag","Y");
               setTimeout(gotoIndex(),200);
    }
function gotoIndex(){
    window.location.href = "main://index.html";
}
document.onkeypress = grabPressEvent;
var keycode;
function grabPressEvent(_e) {
    keycode = _e.keyCode || _e.which;
    switch (keycode) {
        case KEY.BACK:
        case KEY.RETURN:
        case KEY.QUIT:
        case KEY.HOMEPAGE:
            return false;
        case KEY.ENTER:
        case KEY.ENTER_N:
            doEnter();
            break;
        case KEY.VOICEUP:
            break;
        case KEY.VOICEDOWN:
            break;
        case KEY.MUTE:
            AudioObject.resetStatic();
            break;
        default:
            break;
    }
}

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

function handleSysEvent(e) {
    var val = e.which || e.keyCode;
    var keyType = e.type ? e.type : 1001;
    var id = e.modifiers;
    var code = SysSetting.getEventInfo(id);
    var b = [];
    var descStr = "";
    b = code.split(",");
    if(keyType == 1001) {
        switch(val) {
            case 10901://文件到尾
                stopAudioPlay();
                setAudioPlay();
                break;
        }
    }
}

document.onsystemevent = handleSysEvent;


