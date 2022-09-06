initPage(window);

//全局模块对象
var moduleObjs = {
    listObj: null,
};

//全局变量
var globalVar = {
    focusArea: 0, //0:栏目 1：宫格 开机焦点默认在栏目上
    menuBox: null,
    menuPos: 0,
    menuDom: [],
    broswerType: "",
	posterPos:0,
	recordFocusObj:null,//记忆的焦点
	posterTimer:-1,//海报轮播
    subTimer:-1//二级的延时刷新
}

var currMenuData = []; //宫格对象
var yellowCount  = 0;//四下黄建进后门测试页面
var yellowCountTimer = -1;
var dateTimer = -1;

//var hotKey = []; //存储快捷键的跳转链接

function getUrlParams(_key, _url, _spliter) {
	//iPanel.debug("common.js===getUrlParams====_url" + _url);
	if (typeof(_url) == "object") {
		var url = _url.location.href;
	} else {
		var url = _url ? _url : window.location.href;
	}
	if (url.indexOf("?") == -1 && url.indexOf("#") == -1) {
		return "";
	}
	var spliter = _spliter || "&";
	var spliter_1 = "#";
	var haveQuery = false;
	var x_0 = url.indexOf(spliter);
	var x_1 = url.indexOf(spliter_1);
	var urlParams;
	if (x_0 != -1 || x_1 != -1 || url.indexOf("?") != -1) {
		if(url.indexOf("?") != -1) urlParams = url.split("?")[1];
		else if(url.indexOf("#") != -1) urlParams = url.split("#")[1];
		else urlParams = url.split(spliter)[1];
		if (urlParams.indexOf(spliter) != -1 || urlParams.indexOf(spliter_1) != -1) {//可能出现 url?a=1&b=3#c=2&d=5 url?a=1&b=2 url#a=1&b=2的情况。
			var v = [];
			if(urlParams.indexOf(spliter_1) != -1){
				v = urlParams.split(spliter_1);
				urlParams = [];
				for(var x = 0; x < v.length; x++){
					urlParams = urlParams.concat(v[x].split(spliter));
				}
			}else{
				urlParams = urlParams.split(spliter);
			}
		} else {
			urlParams = [urlParams];
		}
		haveQuery = true;
	} else {
		urlParams = [url];
	}
	var valueArr = [];
	for (var i = 0, len = urlParams.length; i < len; i++) {
		var params = urlParams[i].split("=");
		if (params[0] == _key) {
			valueArr.push(params[1]);
		}
	}
	if (valueArr.length > 0) {
		if (valueArr.length == 1) {
			return valueArr[0];
		}
		return valueArr;
	}
	return "";
}
// 获取地址上带的参数
function urlParam(){
    var _url = window.location.href;
    var _param = _url.split("?")[1];
    iDebug("--------------url_param="+_param);
    if(_param != "" && _param != undefined){
        // 接收地址上带的参数，页面初始化到对应的栏目
        var tmpMenuPos = getUrlParams('menuPos');
    
        if(tmpMenuPos != "" && tmpMenuPos != undefined){
            globalVar.menuPos = parseInt(tmpMenuPos);
        }
    }
}

function eventHandler(eventObj, _type) {
    iDebug("[portal]--eventHandler--keycode=" + eventObj.code);
    switch (eventObj.code) {
        case "KEY_MUTE":
            return true;
            break;
        case "KEY_MENU":
		    if (globalVar.broswerType == "iPanel") {
               iPanel.eventFrame.goToIPIndex("http://maanshan-utc.wasu.cn/index.jsp");
            }
            return false;
            break;
        case "KEY_LEFT": //left
            doKeyLeft();
            break;
        case "KEY_RIGHT": //right
            doKeyRight();
            break;
        case "KEY_UP": //up
            dokeyUp();
            break;
        case "KEY_DOWN": //down
            dokeyDown();
            break;
        case "KEY_SELECT": //确定
            doKeySelect();
            break;
        case "KEY_BACK": //返回
        case "KEY_EXIT": //exit
            if (globalVar.broswerType == "iPanel") {
                iPanel.eventFrame.exitToPlay();
            }
            return false;
            break;
		case "KEY_YELLOW":
			checkYellowCount();	
			return false;
            break;
		case "KEY_NUMERIC": //输入快捷键进行页面跳转
		   iDebug("[portal]--globalVar.menuBox.position=" + globalVar.menuBox.position);
		    if(globalVar.menuBox.position == 0){  //直播
		        openImmediately(eventObj.args.value);	
			}else if(globalVar.menuBox.position == 1){ //教育
				 openImmediately_jiaoyu(eventObj.args.value);	
			}else if(globalVar.menuBox.position == 2){ //我家电视台
				 openImmediately_wjdst(eventObj.args.value);	
			}else if(globalVar.menuBox.position == 3){ //智慧诗城
				 openImmediately_zhsc(eventObj.args.value);	
			}else if(globalVar.menuBox.position == 4){ //影视
				 openImmediately_ys(eventObj.args.value);	
			}
			return false;
            break;	
        case "EIS_VOD_PREPAREPLAY_SUCCESS": //exit
		    iPanel.debug("city play EIS_VOD_PREPAREPLAY_SUCCESS!");
		   //media.AV.play();
            return false;
            break;
        case "EIS_VOD_PLAY_SUCCESS": //exit
            return false;
            break;
        case "EIS_VOD_PROGRAM_END": //exit
		    media.AV.stop();
		    media.AV.close();
		    PlayLocalVideo();
            return false;
            break;  		
    }
    return eventObj.args.type;
}


function openImmediately_ys(_num){
	  if (globalVar.broswerType == "iPanel") {
            iPanel.debug("eventObj.args.value==========="+_num);
      }		
	recordFocus(); 
	switch(_num){
		case 0:
		     var _posterList = currMenuData[7].poster || [];	
		    if(_posterList.length == 0) return;
			window.location.href = currMenuData[7].poster[0].url;
	    	break;
		case 1:
		    var _posterList = currMenuData[8].poster || [];	
		    if(_posterList.length == 0) return;
			window.location.href = currMenuData[8].poster[0].url;
		    break; 
		case 2:
		   var _posterList = currMenuData[9].poster || [];	
		    if(_posterList.length == 0) return;
			window.location.href = currMenuData[9].poster[0].url;
		    break;
		case 3:
		   var _posterList = currMenuData[8].poster || [];	
		   if(_posterList.length == 0) return;
		   window.location.href = currMenuData[8].poster[1].url;
		   break; 
        case 4: 
		   var _posterList = currMenuData[9].poster || [];	
		    if(_posterList.length == 0) return;
			window.location.href = currMenuData[9].poster[1].url;
		   break; 
		case 5: 
		   var _posterList = currMenuData[8].poster || [];	
		   if(_posterList.length == 0) return;
		   window.location.href = currMenuData[8].poster[2].url;
		   break;    
		case 6: 
		    var _posterList = currMenuData[9].poster || [];	
		    if(_posterList.length == 0) return;
			window.location.href = currMenuData[9].poster[2].url;
		    break;
        case 7: 
		    var _posterList = currMenuData[1].poster || [];	
		    if(_posterList.length == 0) return;
		    window.location.href =currMenuData[1].poster[0].url;
		   break;	
        case 8: 
		    var _posterList = currMenuData[2].poster || [];	
		    if(_posterList.length == 0) return;
		    window.location.href =currMenuData[2].poster[0].url;
		   break; 
		case 9: 
		    var _posterList = currMenuData[3].poster || [];	
		    if(_posterList.length == 0) return;
		    window.location.href =currMenuData[3].poster[0].url;
		   break;		   
		}
}


function openImmediately_wjdst(_num){
	  if (globalVar.broswerType == "iPanel") {
            iPanel.debug("eventObj.args.value==========="+_num);
      }	
	recordFocus();  
	switch(_num){
		case 0:
		     var _posterList = currMenuData[8].poster || [];	
		    if(_posterList.length == 0) return;
			window.location.href = currMenuData[8].poster[0].url;
	    	break;
		case 1:
		    var _posterList = currMenuData[2].poster || [];	
		    if(_posterList.length == 0) return;
			window.location.href = currMenuData[2].poster[0].url;
		    break; 
		case 2:
		   var _posterList = currMenuData[1].poster || [];	
		    if(_posterList.length == 0) return;
			window.location.href = currMenuData[1].poster[0].url;
		    break;
		case 3:
		   var _posterList = currMenuData[8].poster || [];	
		   if(_posterList.length == 0) return;
		   window.location.href = currMenuData[8].poster[1].url;
		   break; 
        case 4: 
		    var _posterList = currMenuData[2].poster || [];	
		    if(_posterList.length == 0) return;
			window.location.href = currMenuData[2].poster[1].url;
		   break; 
		case 5: 
		    var _posterList = currMenuData[1].poster || [];	
		    if(_posterList.length == 0) return;
			window.location.href = currMenuData[1].poster[1].url;
		   break;    
		case 6: 
		   var _posterList = currMenuData[4].poster || [];	
		   if(_posterList.length == 0) return;
		   window.location.href =currMenuData[4].poster[0].url;
		   break;
        case 7: 
		    var _posterList = currMenuData[5].poster || [];	
		    if(_posterList.length == 0) return;
		    window.location.href =currMenuData[5].poster[0].url;
		   break;	
        case 8: 
		    var _posterList = currMenuData[6].poster || [];	
		    if(_posterList.length == 0) return;
		    window.location.href =currMenuData[6].poster[0].url;
		   break; 
		case 9: 
		    var _posterList = currMenuData[7].poster || [];	
		    if(_posterList.length == 0) return;
		    window.location.href =currMenuData[7].poster[0].url;
		   break;		   
		}
}


function openImmediately_zhsc(_num){
	  if (globalVar.broswerType == "iPanel") {
            iPanel.debug("eventObj.args.value==========="+_num);
      }		
	recordFocus();  
	switch(_num){
		case 0:
		     var _posterList = currMenuData[10].poster || [];	
		    if(_posterList.length == 0) return;
			window.location.href = currMenuData[10].poster[0].url;
	    	break;
		case 1:
		    var _posterList = currMenuData[4].poster || [];	
		    if(_posterList.length == 0) return;
			window.location.href = currMenuData[4].poster[0].url;
		    break; 
		case 2:
		   var _posterList = currMenuData[1].poster || [];	
		    if(_posterList.length == 0) return;
			window.location.href = currMenuData[1].poster[0].url;
		    break;
		case 3:
		   var _posterList = currMenuData[11].poster || [];	
		   if(_posterList.length == 0) return;
		    window.location.href = currMenuData[11].poster[0].url;
		   break; 
        case 4: 
		    var _posterList = currMenuData[5].poster || [];	
		    if(_posterList.length == 0) return;
			window.location.href = currMenuData[5].poster[0].url;
		   break; 
		case 5: 
		    var _posterList = currMenuData[2].poster || [];	
		    if(_posterList.length == 0) return;
			window.location.href = currMenuData[2].poster[0].url;
		   break;    
		case 6: 
		   var _posterList = currMenuData[9].poster || [];	
		    if(_posterList.length == 0) return;
		    window.location.href =currMenuData[9].poster[0].url;
		    break;
        case 7: 
		    var _posterList = currMenuData[8].poster || [];	
		    if(_posterList.length == 0) return;
		    window.location.href =currMenuData[8].poster[0].url;
		   break;	
        case 8: 
		    var _posterList = currMenuData[6].poster || [];	
		    if(_posterList.length == 0) return;
		    window.location.href =currMenuData[6].poster[0].url;
		   break; 	
         case 9: 
		    var _posterList = currMenuData[3].poster || [];	
		    if(_posterList.length == 0) return;
		    window.location.href =currMenuData[3].poster[0].url;
		   break; 			   
		}
}

function openImmediately_jiaoyu(_num){
	  if (globalVar.broswerType == "iPanel") {
            iPanel.debug("eventObj.args.value==========="+_num);
      }	
	recordFocus();  
	switch(_num){
		case 0:
		    var _posterList = currMenuData[4].poster || [];	
		    if(_posterList.length == 0) return;
			window.location.href = currMenuData[4].poster[0].url;
	    	break;
		case 1:
		    var _posterList = currMenuData[10].poster || [];	
		    if(_posterList.length == 0) return;
			window.location.href = currMenuData[10].poster[0].url;
		    break; 
		case 2:
		   var _posterList = currMenuData[10].poster || [];	
		    if(_posterList.length == 0) return;
			window.location.href = currMenuData[10].poster[1].url;
		    break;
		case 3:
		   var _posterList = currMenuData[10].poster || [];	
		    if(_posterList.length == 0) return;
			window.location.href = currMenuData[10].poster[2].url;
		   break; 
        case 4: 
		   var _posterList = currMenuData[10].poster || [];	
		    if(_posterList.length == 0) return;
			window.location.href = currMenuData[10].poster[3].url;
		   break; 
		case 5: 
		    var _posterList = currMenuData[3].poster || [];	
		    if(_posterList.length == 0) return;
		    window.location.href =currMenuData[3].poster[0].url;
		   break;    
		case 6: 
		   var _posterList = currMenuData[1].poster || [];	
		    if(_posterList.length == 0) return;
		    window.location.href =currMenuData[1].poster[0].url;
		    break;
        case 7: 
		    var _posterList = currMenuData[9].poster || [];	
		    if(_posterList.length == 0) return;
		    window.location.href =currMenuData[9].poster[0].url;
		   break;	
        case 8: 
		    var _posterList = currMenuData[2].poster || [];	
		    if(_posterList.length == 0) return;
		    window.location.href =currMenuData[2].poster[0].url;
		   break; 
		case 9: 
		    var _posterList = currMenuData[8].poster || [];	
		    if(_posterList.length == 0) return;
		    window.location.href =currMenuData[8].poster[0].url;
		   break;		   
		}
}

function openImmediately(_num){
	  if (globalVar.broswerType == "iPanel") {
            iPanel.debug("eventObj.args.value==========="+_num);
      }	
	recordFocus();  
	switch(_num){
		case 0:
		    window.location.href = currMenuData[6].poster[0].url;
	    	break;
		case 1:
		    window.location.href = currMenuData[7].poster[0].url;
		    break;  
		case 2:
		   /*var _posterList = currMenuData[5].poster || [];	
		   if(_posterList.length == 0) return;
		   var _tmpObj = _posterList[globalVar.posterPos%_posterList.length];
		   var _url = _tmpObj.url;	   
		   window.location.href = _url;*/
		   var _posterList = currMenuData[5].poster || [];	
		   if(_posterList.length == 0) return;
		   //if(globalVar.posterPos%_posterList.length!=0) return;
			window.location.href = currMenuData[5].poster[0].url;
		    break;
		case 3:
		   var _posterList = currMenuData[5].poster || [];	
		   if(_posterList.length == 0) return;
		   //if(globalVar.posterPos%_posterList.length!=0) return;
		    window.location.href =currMenuData[4].poster[0].url;
		   break; 
        case 4: 
		    var _posterList = currMenuData[5].poster || [];	
		    if(_posterList.length == 0) return;
		    //if(globalVar.posterPos%_posterList.length!=1) return;
		    window.location.href =currMenuData[5].poster[1].url;
		   break; 
		case 5: 
		    var _posterList = currMenuData[5].poster || [];	
		    if(_posterList.length == 0) return;
		   // if(globalVar.posterPos%_posterList.length!=1) return;
		    window.location.href =currMenuData[4].poster[1].url;
		   break;    
		case 6: 
		    var _posterList = currMenuData[5].poster || [];	
		    if(_posterList.length == 0) return;
		   // if(globalVar.posterPos%_posterList.length!=2) return;
		    window.location.href =currMenuData[5].poster[2].url;
		   break;
        case 7: 
		    var _posterList = currMenuData[5].poster || [];	
		    if(_posterList.length == 0) return;
		    //if(globalVar.posterPos%_posterList.length!=2) return;
		    window.location.href =currMenuData[4].poster[2].url;
		   break;		   
		}
}


function showMarquee(){		
		$("marqueeTxt").innerHTML = '<marquee id="marqueeInfo" scrolldelay="40" scrollamount="3">'+menuData.menu[4].url+'</marquee>';
}


	//首页按4下F2进入测试页面
function checkYellowCount(){
	clearTimeout(yellowCountTimer);
	yellowCount++;
	if(yellowCount == 4){
		window.location.href = "http://10.138.255.201/testapps/test3.htm";	
	}else{
		yellowCountTimer = setTimeout(function(){
			yellowCount = 0;
		},2000);
	}
}
	
	
function doKeyLeft() {
    if (globalVar.focusArea == 0) {
        changeMainList(-1);
        setFocusStyle(1);
    } else if (globalVar.focusArea == 1) {
        moduleObjs.listObj.doKeyLeft();
    }
}

function doKeyRight() {
    if (globalVar.focusArea == 0) {
        changeMainList(1);
        setFocusStyle(1);
    } else if (globalVar.focusArea == 1) {
        moduleObjs.listObj.doKeyRight();
    }
}

function dokeyUp() {
    if (globalVar.focusArea == 0) {
        setFocusStyle(0);
        globalVar.focusArea = 1;
        for(var i = 0; i < moduleObjs.listObj.unitInfoList.length; i++){
            // if(moduleObjs.listObj.unitInfoList[i].left>=380 && moduleObjs.listObj.unitInfoList[i].left+moduleObjs.listObj.unitInfoList[i].width<680){
            //     if(moduleObjs.listObj.unitInfoList[i].le == moduleObjs.listObj.unitInfoList[i].lMax - 1){
            //         moduleObjs.listObj.dataPos = i;
            //         break;
            //     }
            // } else {
            //     moduleObjs.listObj.getCurrFocusObj.dataPos = 0;
            // }

            if(moduleObjs.listObj.unitInfoList[i].left>=380 && moduleObjs.listObj.unitInfoList[i].left<500){
                if(moduleObjs.listObj.unitInfoList[i].le == moduleObjs.listObj.unitInfoList[i].lMax - 1){
                    moduleObjs.listObj.dataPos = i;
                    break;
                }
            } else {
                moduleObjs.listObj.getCurrFocusObj().dataPos = 0;
            }
        }
        moduleObjs.listObj.showFocus(1);
    } else if (globalVar.focusArea == 1) {
        //由于直播栏目页面布局不规则，需要对直播栏目进行单独处理，中间的广告按上键焦点才能直接移动到回看
        var _key = menuData.menu[globalVar.menuBox.position].key;
        if(_key == "is_video"){
            if(moduleObjs.listObj.getCurrFocusObj().dataPos == 3){
                moduleObjs.listObj.dataPos = 7;  //焦点移动到回看
                moduleObjs.listObj.showFocus(1);
            }else{
                moduleObjs.listObj.doKeyUp();
            }
        }else{
            moduleObjs.listObj.doKeyUp();
        }
        // moduleObjs.listObj.doKeyUp();
    }
}

function dokeyDown() {
    if (globalVar.focusArea == 1) {
        var _ret = moduleObjs.listObj.doKeyDown();
        if (_ret.res == "success") {

        } else {
            moduleObjs.listObj.hideFocus(1);
            globalVar.focusArea = 0;
            setFocusStyle(1);
        }
    }
}

function doKeySelect() {
    recordFocus();
    if (globalVar.focusArea == 0) {
        var _key = menuData.menu[globalVar.menuBox.position].key
        if (_key == "is_video") {
            //跳转到直播
            if (globalVar.broswerType == "iPanel") {
                iPanel.eventFrame.exitToPlay();
            }
        }
    } else if (globalVar.focusArea == 1) {
		var _param = moduleObjs.listObj.getCurrFocusObj();
		iDebug("doKeySelect_param.dataPos =" +_param.dataPos);
		var _posterList = currMenuData[_param.dataPos].poster || [];		
		if(_posterList.length == 0) return;
		var _tmpObj = _posterList[globalVar.posterPos%_posterList.length];
		var _desc = _tmpObj.desc;
		var _url = _tmpObj.url;
		var _posKey = _tmpObj.key;		
        if (_desc == "video") {
            //跳转到点播播控页面
            if (globalVar.broswerType == "iPanel") {
                window.location.href = _url;
            }
        }else if (_desc == "is_video") {
			//跳转到直播
			if (globalVar.broswerType == "iPanel") {
				iPanel.eventFrame.exitToPlay();
			}
        }else if(typeof(_posKey)!= "undefined" && _posKey != ""){
            var freq = parseInt(_posKey.split("&")[0],10);
            var serviceId = parseInt(_posKey.split("&")[1],10);
            DVB.playAV(freq,serviceId);	
            //user.getOffChannel().open();
			setTimeout("iPanel.eventFrame.exitToPlay();", 1000);
		} else if(_url){
			iDebug("doKeySelect--_url="+_url);
 			window.location.href = _url;
        }  
    }
}

//显示时间
function showTime() {
	clearTimeout(dateTimer);
    var _timeStr = smallUtil.dateFormat("yyyy-MM-dd w hh:mm");
    $("currTime").innerHTML = _timeStr.split(" ")[2];
    // $("date").innerHTML = _timeStr.split(" ")[0];
    //$("weekdays").innerHTML = _timeStr.split(" ")[1];
	dateTimer = setTimeout(showTime, 30000);
}

function changeMainList(_num) {
    globalVar.menuBox.changeList(_num);
	clearTimeout(globalVar.subTimer);
	globalVar.subTimer = setTimeout(initCurrListObj,100);
	if(globalVar.menuBox.position == 4){
        $("marqueeTxt").style.visibility = "visible";		
		showMarquee();
	}else{
		$("marqueeTxt").style.visibility = "hidden";
		
	}
}

//一级菜单
function initMainList() {
  debugger
    globalVar.menuBox = new showList(globalVar.menuDom.length, menuData.menu.length, globalVar.menuPos, 625, window);
    globalVar.menuBox.focusPos = 2;
    globalVar.menuBox.focusFixed = true;
    globalVar.menuBox.haveData = function (_list) {
        globalVar.menuDom[_list.idPos].src = menuData.menu[_list.dataPos].blur[1];
    }
    globalVar.menuBox.notData = function (_list) {
        globalVar.mainDoms[_list.idPos].src = "";
    }
    globalVar.menuBox.startShow();
    setFocusStyle(1);
    debugger
    initCurrListObj();
}

function initCurrListObj(_keyType) {
  debugger
	globalVar.posterPos = 0;
	clearTimeout(globalVar.posterTimer);
    var _menuPos = globalVar.menuBox.position;
    debugger
    var _subObj = menuData.menu[_menuPos];
    currMenuData = _subObj.pos;
    initOneList(_menuPos, currMenuData, _keyType);
    moduleObjs.listObj = moduleObjs["list" + globalVar.menuBox.position];
    //切换直播页面小视频背景图
    if (menuData.menu[_menuPos].key == "is_video" || moduleObjs.listObj.videoInfo.haveVideo) {
		if(_menuPos == 0){
			$("bgBox0").style.visibility = "hidden";
			$("bgBox2").style.visibility = "hidden";
			$("bgBox3").style.visibility = "hidden";
            $("bgBox1").style.visibility = "visible";
		}else if(_menuPos == 3){
			$("bgBox0").style.visibility = "hidden";
			$("bgBox1").style.visibility = "hidden";
			$("bgBox2").style.visibility = "hidden";
            $("bgBox3").style.visibility = "visible";
		}else{
			$("bgBox0").style.visibility = "hidden";
			$("bgBox1").style.visibility = "hidden";
			$("bgBox3").style.visibility = "hidden";
            $("bgBox2").style.visibility = "visible";
		}
         playSmallVideo();
    }else {
        $("bgBox0").style.visibility = "visible";
        $("bgBox1").style.visibility = "hidden";
		$("bgBox2").style.visibility = "hidden";
		$("bgBox3").style.visibility = "hidden";
       stopSmallVideo();
    }
    if(globalVar.focusArea == 1) {
        moduleObjs.listObj.showFocus(1);
    }
}

function PlayLocalVideo(){
    if (globalVar.broswerType == "iPanel") {
		VOD.changeServer("isma_v2","ip");
		media.video.setPosition(75, 120, 507, 258);
		var mUrl = "rtsp://10.138.255.247:554/{d78c219fbff8752e3aaea183beee7cf1}.ez60nxcp.vts";
		media.AV.open(mUrl,"VOD"); 
		media.AV.play();
	}
}

function initOneList(_pos, _data, _keyType) {
  debugger
    if (typeof _data == "undefined") {
        var _subObj = menuData.menu[_pos];
        _data = _subObj.pos;
    }
    moduleObjs["list" + _pos] = null;
    var _dataPos = 0;
    if (globalVar.broswerType == "iPanel") {
        if (globalVar.recordFocusObj && globalVar.recordFocusObj.dataPos) { //焦点记忆
            _dataPos = globalVar.recordFocusObj.dataPos;
			globalVar.recordFocusObj.dataPos = 0;
        }
    }
    if (typeof moduleObjs["list" + _pos] == "undefined" || moduleObjs["list" + _pos] == null) {
        iDebug("initOneList no exit");
        debugger
        moduleObjs["list" + _pos] = new drawSquareObj({
            callBack: function (_status, _param) {
                return modulesCallBack("squareShow", _status, _param);
            },
            drawInfoObj: drawInfoObj,
            data: _data,
            dataPos: _dataPos,
            focusPos: _dataPos,
            panelId: "menuSquareBox",
            unitId: "unit"
        });
        moduleObjs["list" + _pos].initData();
        if (_keyType == -1) {
            moduleObjs["list" + _pos].dataPos = moduleObjs["list" + _pos].unitInfoList.length - 1;
        }
    } else {
        iDebug("initOneList have exist");
        moduleObjs["list" + _pos].dataPos = _dataPos;
    }
	globalVar.posterTimer = setTimeout(posterChange,8000);
    //moduleObjs.listObj.showFocus(1);
}

//海报循环
function posterChange(){
	iDebug("posterChange--in");
	clearTimeout(globalVar.posterTimer);
	globalVar.posterPos++;
	var _posLen = 0;
	iDebug("posterChange--innerHTML="+$("menuSquareBox").innerHTML);
	for(var i=0;i<menuData.menu[globalVar.menuBox.position].pos.length;i++){
		var _posterList = menuData.menu[globalVar.menuBox.position].pos[i].poster;
		iDebug("posterChange--i="+i+"--_posterList.length="+_posterList.length);
		if(_posterList.length < 2)continue;
		if(_posterList.length > _posLen){
			_posLen = _posterList.length;	
		}
		iDebug("posterChange--i="+i+"--_posLen="+_posLen);
		var _unitObj = $("unit"+i);
		iDebug("posterChange--typeof _unitObj="+typeof _unitObj);
		iDebug("posterChange_zhangxiao-1111--typeof _unitObj ="+_unitObj);
		if(_unitObj){
			var _imgObj = _unitObj.getElementsByTagName("img");
			if(_imgObj.length > 0){
				_imgObj = _imgObj[0];
				var _pObj = _posterList[globalVar.posterPos%_posterList.length];
				_imgObj.src = _pObj.src[1];	
			}
			iDebug("posterChange--_unitObj--typeof _imgObj="+typeof _imgObj);
		}
		if(i==menuData.menu[globalVar.menuBox.position].pos.length-1 && globalVar.posterPos > _posLen-1){
			globalVar.posterPos = 0;	
		}
	}
	globalVar.posterTimer = setTimeout(posterChange,8000);
}

//播放小视频
function playSmallVideo() {
    if (globalVar.broswerType == "iPanel") {
		iDebug("playSmallVideo--media.AV.status="+media.AV.status);
		if(media.AV.status != "stop"){
    		media.AV.stop();
			media.AV.close();
		}
      if(globalVar.menuBox.position==0){//直播
	      media.video.setPosition(72, 120, 507, 258);
		  var url = menuData.menu[0].pos[7].poster[0].key; //增加直播页面视频框开机引导功能  
         iDebug("doKeySelect_param.dataPos—_url =" +url);
	   }else if(globalVar.menuBox.position==1){//教育
	       media.video.setPosition(72, 120, 454, 292);
		  var url = menuData.menu[1].pos[10].poster[0].key;
		  iDebug("doKeySelect_param.dataPos—_url =" +url);
	   }else if(globalVar.menuBox.position==2){//我家电视台
	       media.video.setPosition(72, 120, 454, 292);
		  var url = menuData.menu[2].pos[7].poster[0].key; 
		  iDebug("doKeySelect_param.dataPos—_url =" +url);
	   }else if(globalVar.menuBox.position==3){//智慧诗城
	       //media.video.setPosition(300, 120, 454, 292);
		    media.video.setPosition(72, 120, 454, 292);
		  var url = menuData.menu[3].pos[11].poster[0].key; 
		  iDebug("doKeySelect_param.dataPos—_url =" +url);
	   }else if(globalVar.menuBox.position==4){//影视
	      media.video.setPosition(72, 120, 454, 292);
		  var url = menuData.menu[4].pos[8].poster[0].key;
		  iDebug("doKeySelect_param.dataPos—_url =" +url);
	   }
        if(typeof(url)!= "undefined" && url != ""){
            var freq = parseInt(url.split("&")[0],10);
            var serviceId = parseInt(url.split("&")[1],10);
            DVB.playAV(freq,serviceId);
        }else{
            var user = users.currentUser;
            var offChannel = user.getOffChannel(1); //获取关机频道
            var offService = offChannel.getService();
            DVB.playAV(offService.frequency, offService.serviceId);
        }
    }	
}

//停止小视频
function stopSmallVideo(_type) {
    if (globalVar.broswerType == "iPanel") {
        DVB.stopAV(0);
        DVB.clearVideoLevel(1);
		iDebug("stopSmallVideo--media.AV.status="+media.AV.status);
		if(media.AV.status != "stop"){
    		media.AV.stop();
			media.AV.close();
		}
		//if(_type == 1){
        	media.video.setPosition(0, 0, 1280, 720);
		//}	
    }
}

/*
 *统一模块回调方法
 *@param {String} _moduleName 各模块名称
 *@param {String} _status 该模块回调状态
 *@param {Object} _param 该模块回调状态对应的参数
 */
function modulesCallBack(_moduleName, _status, _param) {
    switch (_moduleName) {
        case "squareShow":
            switch (_status) {
                case "moveFocus":
                    setSquareFocusLocation(_param);
                    break;
                case "onFocus":
                    if (globalVar.focusArea == 1) {
                        setSquareFocus(_param, 1);
                    }
                    break;
                case "loseFocus":
                    setSquareFocus(_param, 0);
                    break;
                case "showFocus":
                    if (globalVar.focusArea == 1) {
                        setSquareFocus(_param, 1);
                        $("subFocus").style.visibility = "visible";
                    }
                    break;
                case "hideFocus":
                    setSquareFocus(_param, 0);
                    $("subFocus").style.visibility = "hidden";
                    break;
                case "getUnitStyle":
                    var _obj = {
                        titleStyle: "",
                        titleFontStyle: "",
                        isVideo: false, //有视频的话约定好小视频的判断方式
                        imgStyle: "",
                        show: false
                    };
                    iDebug("modulesCallBack  typeof _param=" + typeof _param);
                    if (_param.poster && _param.poster.length > 0) {
                        var _desc = _param.poster[0].desc;
                        _desc == "is_video" ? _obj.isVideo = true : "";
                    }
                    return _obj;
                    break;
                case "changeData":
                    currMenuData = _param;
                    break;
            }
    }
}

//设置栏目焦点
function setFocusStyle(_type) {
  debugger
    switch (globalVar.focusArea) {
        case 0:
            if (_type == 0) {
                globalVar.menuDom[2].src = menuData.menu[globalVar.menuBox.position].focus[1];
            }
            if (_type == 1) {
                globalVar.menuDom[2].src = menuData.menu[globalVar.menuBox.position].focus[2];
            }
            break;
            case 1: 
                globalVar.menuDom[2].src = menuData.menu[globalVar.menuBox.position].focus[1];
                break;
    }
}

//设置宫格焦点
function setSquareFocusLocation(_dataObj) {
    var _tmpObj = currMenuData[_dataObj.dataPos];
    var _focusDomObj = $("subFocus");
    var _isFirst = _dataObj.isFirst;
    if (_isFirst) {} else {}
    var unitInfo = _dataObj.unitInfo;
    if (_tmpObj.haveVideo) {
        var _w = 0;
        var _h = 0;
        _focusDomObj.style.top = (unitInfo.top + 120) - (_h / 2) + "px";
        _focusDomObj.style.left = (unitInfo.left + 70) - (_w / 2) + "px";
        _focusDomObj.style.width = (unitInfo.width + 6) + _w + "px";
        _focusDomObj.style.height = (unitInfo.height) + _h + "px";
    } else {
        var _w = 0; //parseInt(unitInfo.width*0.1);
        var _h = 0; //parseInt(unitInfo.height*0.1);
        _focusDomObj.style.top = (unitInfo.top + 120) - (_h / 2) + "px";
        _focusDomObj.style.left = (unitInfo.left + 70) - (_w / 2) + "px";
        _focusDomObj.style.width = (unitInfo.width + 6) + _w + "px";
        _focusDomObj.style.height = (unitInfo.height) + _h + "px";
    }
}

function setSquareFocus(_dataObj, _type) {
    if (globalVar.menuBox.position == 0 && _dataObj.dataPos == 0) return;
    if (_type == 0) {
        //$(_dataObj.unitInfo.id).style.webkitTransform = "scale(1.0,1.0)";
    } else if (_type == 1) {
        //$(_dataObj.unitInfo.id).style.webkitTransform = "scale(1.1,1.1)";
    }
}

// 焦点记忆
function recordFocus() {
    if (globalVar.broswerType == "iPanel") {
        var _param = moduleObjs.listObj.getCurrFocusObj();
        var _focusObj = {
            focusArea: globalVar.focusArea,
            menuPos: globalVar.menuBox.position,
            dataPos: _param.dataPos
        };
        iPanel.eventFrame.portalFocusObj = _focusObj;
    }
    /*
    iPanel.setGlobalVar("focusArea", globalVar.focusArea);
    iPanel.setGlobalVar("menuPos", globalVar.menuBox.position);
    var _param = moduleObjs.listObj.getCurrFocusObj();
    globalVar.focusObj.dataPos = _param.dataPos;
    iPanel.setGlobalVar("squareFocus",globalVar.focusObj.dataPos)
	*/
}

function initParam() {
    if (globalVar.broswerType == "iPanel") {
        if (iPanel.eventFrame.portalFocusObj) {
            globalVar.menuPos = iPanel.eventFrame.portalFocusObj.menuPos;
            globalVar.focusArea = iPanel.eventFrame.portalFocusObj.focusArea;
			globalVar.recordFocusObj =  iPanel.eventFrame.portalFocusObj;
            iPanel.eventFrame.portalFocusObj = null;	

        }
    }
}

function init() {
  debugger
    globalVar.menuDom = $("menu").getElementsByTagName("img");
    globalVar.broswerType = getBrowserType();
    initParam();
    urlParam();
    showTime();
    //initMainList();
	setTimeout(initMainList,100);
	if (globalVar.broswerType == "iPanel") {
		iPanel.preDownload("http://10.138.255.201/standby_img/standby.jpg",1);//待机图片下载到内存
	}
}

function exitPage() {
	if (moduleObjs.listObj.videoInfo.haveVideo) {
    	stopSmallVideo(1);
	}
}
