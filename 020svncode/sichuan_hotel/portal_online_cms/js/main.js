var beyondTop = 750;//top值超出500则设置为隐藏
var rollLeft = 0;//需要滚动的资源块的left值,0代表不需要滚动
var rollArr = [];
var rollTabId = 3;
var rollTop = 420;  //小于beyondTop但为最大的top值
var maxTop = 0;//rollArr中最大的cellY值
var firstRoll;//初始rollArr中的第0个元素
var liveTabId = 0;//直播小窗口所在的标签ID
//横向瀑布流布局
function ScrollHView(data, pageIndex) {
    this.data = parseCellData(data,pageIndex);
    this._data = {};
    this.pageIndex = pageIndex;
    this.map = {};
    this.id = '';
    this.focusId = getGlobalVar('focusId')||'';
    this.upFun = null;
    this.downFun = function () {
        this.onfocus()
    };
	this.firstFocusId = '';
	this.isShow = 0;//该标签下的海报是否展示过，0代表未展示，1代表已经展示过
    this.sort();
}

ScrollHView.prototype.init = function (index){
    var data = this.data;
    var html = '';
	if(index === rollTabId){
		rollArr = [];
	}
    data.forEach(function (el, j) {
        if(index === rollTabId && rollLeft !==0 && el.cellX === rollLeft){
			var elBak = JSON.parse(JSON.stringify(el));//对象深拷贝
            rollArr.push(elBak);
			//rollArr.push(el);
        }

        var isLive = "";
		if(el.option && el.option.isLive){
			liveTabId = index;
            
            var liveObj = {};
            liveObj.tabIndex = Tab.focusPos;
            liveObj.cellX = el.cellX;
            liveObj.cellY = el.cellY;
            liveObj.width = el.width;
            liveObj.height = el.height;
            liveObj.serviceId = el.option.serviceId || "";
            liveObj.frequency = el.option.frequency || "";
            liveObj.channelId = el.option.channelId || "";
            liveArr.push(liveObj);
            isLive = "true";
		}

        var link="";
        if (el.option && el.option.hotplay) {
            if (hotplay.link && hotplay.link.length>0 && hotplay.poster && hotplay.poster.length>0) {
                el.posterUrl = hotplay.poster;
                link = hotplay.link;
            }
        }

        var hasSubpage = false;
        if (el.tabCell != null && el.tabCell.length>0) {
            hasSubpage = true;
        }

        var channelId="";
        if (el.option && el.option.channelId) {
            channelId = el.option.channelId;
        }

        var style = 'position:absolute;' + 'left:' + el.cellX + 'px;top:' + el.cellY + 'px;width:' + el.width + 'px;height:' + el.height + 'px';
        if(el.cellY > beyondTop){
            style+= ';display:none;';
        }
        html += '<div class="main_cell" isLive="'+isLive+'" link="'+link+'" channelId="'+channelId+'" hasSubpage="'+hasSubpage+'" id="' + el.cellId + '" cellIndex="'+j+'" style=' + style + '><img src=' + el.posterUrl + ' /></div>'
        //html += '<h2>' + el.cellId + '</h2>'//标题
    })
	if(index === rollTabId && rollArr.length > 0){
		rollArr.sort(function(a,b){return a.cellY-b.cellY});
	//	console.log(rollArr);
		firstRoll = rollArr[0];
		maxTop = rollArr[rollArr.length-1].cellY;
	}
    this.id = 'tab' + index;
    $('tab' + index).innerHTML = html;

  checkLivePlay(tabIndex); 
    
}

ScrollHView.prototype.sort = function (){
    var map = {};
    var obj = this.data;
    var len = obj.length;
	this.firstFocusId = getFirstId(obj);
    try{
        this.focusId = parseInt(getGlobalVar('tabIndex'))===Tab.focusPos?this.focusId:this.firstFocusId;
    }catch(e){
        this.focusId = this.firstFocusId;
    }
    for (var i = 0; i < len; i++) {
        //
        this._data[obj[i].cellId] = obj[i];
        //
        var item = obj[i];
        var X = item.cellX;
        var Y = item.cellY;
        if(Y>beyondTop){
            rollLeft = X;
        }
        var W = item.width;
        var H = item.height;
		var canGetFocus = getBinaryE(item.cellState,3);
//var Right = obj.filter((el) => (el.cellX >= X + W) && (el.cellY <= Y)).sort((a, b) => (a.cellX - b.cellX) || (b.cellY - a.cellY))[0];
        var Right = obj.filter(function (el) { return (el.cellX >= X + W*.5) && (el.cellY>=Y&&el.cellY<=Y+H || el.cellY<=Y&&el.cellY+el.height>=Y) }).sort(function (a, b) { return (a.cellX - b.cellX) || ( a.cellY + a.height*.5 +  b.cellY + b.height*.5 - 2*Y - H)*(a.cellY + a.height*.5 -  b.cellY - b.height*.5) || (a.cellY - b.cellY) })[0];
        var Bottom = obj.filter(function (el) { return (el.cellY >= Y+H*.5) && (el.cellX>=X&&el.cellX<=X+W || el.cellX<=X&&el.cellX+el.width>=X) }).sort(function (a, b) { return (a.cellY - b.cellY) || ( a.cellX + a.width*.5 +  b.cellX + b.width*.5 - 2*X - W)*(a.cellX + a.width*.5 -  b.cellX - b.width*.5) || (a.cellX - b.cellX) })[0];
        var Left = obj.filter(function (el) { return (el.cellX + el.width <= X+W*.5) && (el.cellY>=Y&&el.cellY<=Y+H || el.cellY<=Y&&el.cellY+el.height>=Y ) }).sort(function (a, b) { return (b.cellX + b.width - a.cellX - a.width) || ( a.cellY + a.height*.5 +  b.cellY + b.height*.5 - 2*Y - H)*(a.cellY + a.height*.5 -  b.cellY - b.height*.5) || (a.cellY - b.cellY) })[0];
        var Top = obj.filter(function (el) { return (el.cellY + el.height <= Y+H*.5) && (el.cellX>=X&&el.cellX<=X+W || el.cellX<=X&&el.cellX+el.width>=X) }).sort(function (a, b) { return (b.cellY + b.height - a.cellY - a.height) || ( a.cellX + a.width*.5 +  b.cellX + b.width*.5 - 2*X - W)*(a.cellX + a.width*.5 -  b.cellX - b.width*.5) || (a.cellX - b.cellX) })[0];
        map[item.cellId] = {
            left: Left,
            right: Right,
            up: Top,
            down: Bottom,
			canGetFocus:canGetFocus,
        };
    }
	//	if(rollTabId === null && rollLeft !== 0){
	//	console.log("rollTabId:"+rollTabId);
	//	rollTabId = Tab.focusPos;
	//}
    this.map = map;
}

	//取第一个焦点
    function getFirstId(obj){
        var item = obj[0];
		item = obj.sort(function(a,b){
            if (Math.abs(a.cellX-b.cellX)<=10) {
                return (a.cellY-b.cellY);
            }else{
                return a.cellX-b.cellX;
            }
        })[0]
            //return Math.abs(a.cellX-b.cellX)-10 || (a.cellY-10-b.cellY)})[0];
		return item.cellId;
    }


ScrollHView.prototype.onkey = function (action) {
    this.onblur();
    var scrollview = this.id;
    var current = this.map[this.focusId][action];
    if (current) {
        this.focusId = current.cellId;
        var left = parseInt($(scrollview).style.left);
        if (current.cellX + current.width + left > 1920) {
            $(scrollview).style.left = (1920 - current.cellX - 180 - current.width) + 'px';
        }
        if (current.cellX + left < 0) {
            $(scrollview).style.left = (180 - current.cellX) + 'px';
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
            default:
                this.onfocus();
                break;
        }
    }
}

ScrollHView.prototype.onfocus = function () {
    addClass($(this.focusId), 'focus');
}

ScrollHView.prototype.onblur = function () {
    removeClass($(this.focusId), 'focus');
}

ScrollHView.prototype.up = function () {
    if (this.upFun) {
        // this.onblur();
        // this.upFun();
    }
}

ScrollHView.prototype.down = function () {
    if (this.downFun) {
        this.onblur();
        this.downFun();
    }
}

//Tab 布局
function TabView(data, pageIndex) {
    this.pageIndex = pageIndex;
    this.data = data;
    this.len = data.length;
    this.downFun = null;
    this.upFun = null;
    this.tabFub = null;
    this.focusPos = pageIndex;
}

TabView.prototype.init = function (obj, obj2) {
    var data = this.data;
    var html = '';
    var html2 = '';
    data.forEach(function (el, i) {
        if(el.packageName != null && el.packageName.length > 0 && el.packageName != "null")
            html += '<span id="packageName'+i+'" class="packageName">'+el.packageName+'</span>';
        else
            html += '<span id="packageName'+i+'" class="packageName"></span>';
        if (el.tabIconUrl != null && el.tabIconUrl.length > 0) {
            html += '<a id="nav' + i + '" class="navA"><img src='+el.tabIconUrl+'></a>';
        }else{
            html += '<a id="nav' + i + '" class="navA">'+el.tabName+'</a>';
        }
        
        html2 += '<div class="main_list" style="left:0px" id="tab' + i + '"><div class="tabloading">正在加载...</div></div>';

        //设置homeTab 和 updateTab
        if (el.bootTab == 1) {
            homeTab = i;
        }
        if (el.updateTab == 1) {
            updateTab = i;
        }

    })
    $(obj).innerHTML = html;
    $(obj2).innerHTML = html2;
}

TabView.prototype.onkey = function (action) {
    if (action === 'down') {
        this.down();
    } else {
        this.onblur();
        switch (action) {
            case 'left':
                this.focusPos--;
                break;
            case 'right':
                this.focusPos++;
                break;
            case 'up':
                /*this.onfocus();
				this.onblur(true);
                Area--;
                Logo.onfocus();
				return;*/
                break;
        }
        if (this.focusPos < 0) {
        //    this.focusPos = 0;
			this.focusPos = this.len - 1;
        }
        if (this.focusPos > this.len - 1) {
         //   this.focusPos = this.len - 1;
			this.focusPos = 0;
        }
        this.tabFub && this.tabFub(this.focusPos);
        this.onfocus();
    }
}

TabView.prototype.onfocus = function (bool) {
    if (bool) {
        $('nav' + this.focusPos).className = 'current';
    } else {
        $('nav' + this.focusPos).className = 'current focus';
        addClass($('tab' + this.focusPos), 'current');
    }
    $('packageName' + this.focusPos).style.visibility="visible";
}

TabView.prototype.onblur = function (bool) {
    if (bool) {
        $('nav' + this.focusPos).className = 'current';
    } else {
        $('nav' + this.focusPos).className = '';

        removeClass($('tab' + this.focusPos), 'current');
        $('packageName' + this.focusPos).style.visibility="hidden";
    }
    
}

TabView.prototype.down = function () {
    this.downFun&&this.downFun();
}




//初始化
var Area = 0;
var Tab;
var ScrollH;

//键盘逻辑
function moveLeft() {
    switch (Area) {
        case -1:
            Logo && Logo.onkey('left');
            break;
        case 0:
//			if(lock){
//				lock =false;
				Tab && Tab.onkey('left');
//			}
            break;
        case 1:
            ScrollH && ScrollH.onkey('left');
            break;
        default:
            break;
    }
}

function moveRight() {
    switch (Area) {
        case -1:
            Logo && Logo.onkey('right');
            break;
        case 0:
            Tab && Tab.onkey('right');
            break;
        case 1:
            ScrollH && ScrollH.onkey('right');
            break;
        default:
            break;
    }
}

function moveUp() {
    switch (Area) {
        case -1:
            Logo && Logo.onkey('up');
            break;
        case 0:
			if(confKey>=6){
				stopLivePlay();
				location.href = "configure.html";
            } 
            Tab && Tab.onkey('up');
            break;
        case 1:
            ScrollH && ScrollH.onkey('up');
            break;
        default:
            break;
    }
}

function moveDown() {
    switch (Area) {
        case -1:
            Logo && Logo.onkey('down');
            break;
        case 0:
            Tab && Tab.onkey('down');
            break;
        case 1:
            ScrollH && ScrollH.onkey('down');
            break;
        default:
            break;
    }
}

function getBinaryE(integer,index) {
        var str = integer.toString(2);
        var resStr = str.split("").reverse().join("");
        var e =resStr[index];
        if(e !== "1"){
            return 0;
        }else{
            return 1;
        }
    }

    function initCellData(index) {
        var tabId = Tabdata[index].tabId;
        ajax({
            type:"GET",
            url: iepgIP+'getTabCell?planId='+planId+'&tabId=' + tabId+'&isTest='+canPreview,
            success: function (data) {
                initCell(JSON.parse(data).tabCell,index);
            //  lock = true;
            },
            error: function () {

            }
        });
    }
    

    function initCell(data,index) {
        CellArr[index] = new ScrollHView(data,index);
        CellArr[index].init(index);
        CellArr[index].isShow = 1;
    //  console.log(CellArr);
        ScrollH = CellArr[index];
        ScrollH.upFun = function () {
            Area--;
            Tab.onfocus();
        }
        if (Area === 1) {
            if(isBack === "y" && index === rollTabId){
                var rollArrBak = JSON.parse(getGlobalVar("rollArrBak"));
                rollArr = JSON.parse(JSON.stringify(rollArr));
            //  console.log(rollArr);
            //  console.log(rollArrBak);
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
                    /*if(ScrollH.map[rollArr[i].cellId]['right'] === undefined){
                        ScrollH.map[rollArr[i].cellId]['right'] = ScrollH.map[rollArr[0].cellId]['right'];
                    }else if(ScrollH.map[rollArr[i].cellId]['left'] === undefined){
                        ScrollH.map[rollArr[i].cellId]['left'] = ScrollH.map[rollArr[0].cellId]['left'];
                    }*/
                }
                rollArr = rollArrBak;
            }
            try{
                Tab.onblur(true);
            }catch(e){}
            
            ScrollH && ScrollH.onfocus();
            confirmUrl = ScrollH._data[ScrollH.focusId].intent;
        }else if(isBack !== "y" && index === liveTabId){//开机或者按菜单键刷新后焦点默认落在直播窗口上
            Area++;
            try{
                Tab.onblur(true);
            }catch(e){}
            ScrollH && ScrollH.onfocus();
            confirmUrl = ScrollH._data[ScrollH.focusId].intent;
        }

        if(isBack === "y" && !isNeedUpdate){
            if (Area == 1) {
                checkCarouse(parseInt(getGlobalVar("focusId")) || null);   
            }else{
                checkCarouse(null);
            }
        }else{
            
            if (Area == 1) {
                checkCarouse(ScrollH.focusId);
            }else{
                checkCarouse(null);
            }
            
        }

        //checkLivePlay(Tab.focusPos);
    }
    
    function debug(str){
        if (debugInfoOn) {
           $("test").innerHTML=str; 
        }
    }


    function checkLivePlay(tabIndex) {

        //return;
        for (var i = 0; i < liveArr.length; i++) {
            if (liveArr[i].tabIndex == tabIndex) {
                getSelection(liveArr[i]);
                return;
            }
            
        }
        stopLivePlay();
    }

    function getSelection(liveObj) {
        //document.getElementById('test').innerHTML = "client:"+getUserId()+"----account:"+getSmartCardId();
        var getChannelSelectionStart = {
            "data": '<ChannelSelectionStart portalId="1" client="'+getSmartCardId()+'" account="'+getUserId()+'" channelId="'+liveObj.channelId+'" startDateTime="' + getTTVDate() + '"/>',
            "callBack": function (data) {
                var rtspUrl = data.rtsp;
                liveObj.rtspUrl = rtspUrl;
                openVideo(liveObj);
            }
        };
        IEPG.getData(userInfoInterface.ChannelSelectionStart, getChannelSelectionStart);
    }

    function getTTVDate() {
        var date = new Date();
        date = date.valueOf();
        date = date - 10 * 1000;
        date = new Date(date);
        var year = date.getFullYear();
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        return year + month + day + hour + minute + second;
    }

    IEPG.getData = function(_APIUrl, _configs){
        var paramUrl, dataUrl;
        var _data = xmlHead + _configs.data;

        //alert("paramUrl=" + paramUrl);
        var reqUrl = _APIUrl + "?dataType=json";
        new ajaxUrl(reqUrl, _configs.callBack, _data);
    };

    function ajaxUrl(_url, _handler, _data){
        this.xmlHttp = null;
        this.createXMLHttpRequest = function () {
            if(window.XMLHttpRequest) {
                this.xmlHttp = new XMLHttpRequest();
                if (this.xmlHttp.overrideMimeType) {
                    this.xmlHttp.overrideMimeType('text/xml');
                }
            } else {
                if(window.ActiveXObject) {
                    this.xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
            }
        };
        this.getData = function () {
            this.createXMLHttpRequest();
            var xmlHttp = this.xmlHttp;
    //      _url = "http://" + portalIP + ":" + portalPort + _url;
            this.xmlHttp.open("POST", _url, true);
            this.xmlHttp.send(_data);
            this.xmlHttp.onreadystatechange = function() {
                if(xmlHttp.readyState == 4) {
                    if(xmlHttp.status == 200) {
                        callBackData3(xmlHttp, _handler);
                    } else {
                        //showMsg("", "");
                    }
                }
            };
        };
        this.getData();
    }

    function callBackData3(_xmlHttp, _handler){
        var resText = _xmlHttp.responseText;
        resText = eval("(" + resText + ")");
        _handler(resText);
    }

    function openVideo(liveObj){

        var dataAccess ;// new DataAccess("Systemsetting.properties");
        if(dataAccess != null)
        {
            dataAccess.revert();
            portalVolume = dataAccess.get("portalVolume");
            if(portalVolume == null || portalVolume == "")
            {
                portalVolume = 10;
            }
        }
        var mediaStr = liveObj.rtspUrl;
        var areaCode = "";
        try {
            areaCode = Utility.getSystemInfo("ARC");
            if(areaCode == ""||areaCode == "0"||areaCode ==0){
                areaCode =CITV.loginInfo.areaCode;
            }
        }catch (e) {
            areaCode = "";
        }
        mediaStr = mediaStr.replaceQueryStr(areaCode, "areaCode");
        try{
            mp = new MediaPlayer();
            mp.setSingleMedia(mediaStr);
            mp.setVideoDisplayMode(0);
            mp.setVolume(parseInt(portalVolume));
            mp.setVideoDisplayArea(liveObj.cellX+5,liveObj.cellY+60+5,liveObj.width-10,liveObj.height-10);//left,top,width,height
            mp.refreshVideoDisplay();
            mp.playFromStart();
        }catch(err){
        }
    }
    function stopLivePlay(){
        try{
            if(mp != null){
                portalVolume = mp.getVolume();
                dataAccess.set("portalVolume",portalVolume);
                dataAccess.submit();
                mp.stop();
                mp.setVideoDisplayMode(1);
                mp.refreshVideoDisplay();
            }
        }catch(err){
        }
    }

    function firstGoPlayAuto(){
        if(isAutoGoPlay){
            location.href = "ui://play.html";
        }
    }

ScrollHView.prototype.onkey = function (action) {
    
    var scrollview = this.id;
    var lastFocusId = parseInt(this.focusId);
    var current = this.map[this.focusId][action];
    //判下一个资源块能否获得焦点
    if (current){
        this.onblur();
        if(this.map[current.cellId]['canGetFocus'] === 0){
            current = this.map[current.cellId][action];
        }
        confirmUrl = current.intent;
        var link = $(current.cellId).getAttribute("link");
        if(link!=null && link.length>0){
            confirmUrl = link;
        }
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
            //  console.log(rollArr);
            //  console.log(CellArr);
                var topValue = parseInt($(current.cellId+"").style.top.split("p")[0]);
                if(Tab.focusPos === rollTabId && topValue > beyondTop){
                //  var CellArrBak = JSON.parse(JSON.stringify(CellArr));//深度拷贝CellArr对象
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
                //  rollArrIndex--;
                //    rollArr.push(current);
                    $(current.cellId+"").style.top=rollTop + 'px';
                    $(current.cellId+"").style.display = "block";
                //  CellArr = CellArrBak;
                }
            //  rollArrIndex++;
                break;
            case 'up':
                if(Tab.focusPos === rollTabId && lastFocusId === rollArr[0].cellId){
                //  var CellArrBak = JSON.parse(JSON.stringify(CellArr));
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
                //  CellArr = CellArrBak;
                }
                break;
            case 'left':
                var currentBak = JSON.parse(JSON.stringify(current));
                if($(current.cellId+"").style.display === "none"){//如果下一个资源块为隐藏状态，则默认将焦点移到滑动资源块数组第0个上
                    currentBak = rollArr[0];
                //  rollArrIndex = 0;
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
                /*Area = 0;
                Tab && Tab.onkey('left');*/
            //  Tab && Tab.onkey('down');
                break;
            case 'right':
                /*Area = 0;
                Tab && Tab.onkey('right');*/
            //  Tab && Tab.onkey('down');
                break;
            default:
                this.onfocus();
                break;
        }
    }
    cellCheckCarouse(lastFocusId,current);
}

//标签自适应，计算标签的margin以及packageName的宽度
function tabAdapt(tabLength) {
    var doms = document.getElementsByClassName("navA");
    var navWidth;
    if (doms.length>0) {
        navWidth = doms[0].offsetWidth;
    }
    var margin = (1200/tabLength - navWidth)/2;
    
    for (var i = 0; i < doms.length; i++) {
        doms[i].style.marginLeft=margin+'px';
        doms[i].style.marginRight=margin+'px';
    }

    var packageNames = document.getElementsByClassName("packageName");
    for (var i = 0; i < packageNames.length; i++) {
        packageNames[i].style.width=2*margin+navWidth+'px';
    }
}
/*
function tabAdapt(tabLength) {
    var doms = document.getElementsByClassName("navA");

    var margin = ((1280-66)/tabLength - 87)/2;
    
    for (var i = 0; i < doms.length; i++) {
        doms[i].style.marginLeft=margin+'px';
        doms[i].style.marginRight=margin+'px';
    }

    var packageNames = document.getElementsByClassName("packageName");
    for (var i = 0; i < packageNames.length; i++) {
        packageNames[i].style.width=2*margin+87+'px';
    }
}*/
