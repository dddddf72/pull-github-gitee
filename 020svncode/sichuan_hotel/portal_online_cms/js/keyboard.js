var keyBoardConfArr = [];

function initKeyboardConf(data){
	data = eval("(" + data + ")");
	keyBoardConfArr = data.backdoorsButtons;
	if (keyBoardConfArr.length == 0) {
		getDefaultConf();
	}
}

function getDefaultConf() {
	ajax({
        type:"GET",
        url: iepgIP+'getPram?PramName=keyboardConf&version=V001',
        async:true,
        success: function (data)  {
            var defaultConf = eval('(' + data + ')').datas;
            if (defaultConf.length > 0) {
            	for (var i = defaultConf.length - 1; i >= 0; i--) {
            		defaultConf[i].key = defaultConf[i].pramKey;
            		defaultConf[i].value = defaultConf[i].pramValue;
            		defaultConf[i].toast = defaultConf[i].remark;
            	}
            	keyBoardConfArr = defaultConf;
            }
        },
        error: function () {
        }
    });	
}

//键盘事件
document.onkeydown = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
	isAutoGoPlay = false;
	//document.getElementById('test').innerHTML += "keycode:"+e.keyCode;
	switch (e.keyCode) {
		case KEY.LEFT:
		case KEY.LEFT_N:
			moveLeft();	
			isKeyUp = false;
			break;
		case KEY.UP:
		case KEY.UP_N:
			moveUp();
			isKeyUp = false;
			break;
		case KEY.RIGHT:
		case KEY.RIGHT_N:
			moveRight();
			isKeyUp = false;
			break;
		case KEY.DOWN:
		case KEY.DOWN_N:
			moveDown();
			isKeyUp = false;
			break;
		case KEY.ENTER:
		case KEY.ENTER_N:
			doConfirm();
			break;
		case KEY.BACK:
			keyBack();
			break;
		case KEY.key_4:
            confKey++;
			break;
		case KEY.RETURN:
		case KEY.QUIT_NJ:
		case KEY.QUIT_SC:
			e.preventDefault();
			break;
		case KEY.HOMEPAGE:
			location.replace(location);
		default:
			for (var i = 0; i < keyBoardConfArr.length; i++) {
				var key = keyBoardConfArr[i].key;
				if (KEY["key_"+key] == e.keyCode) {
					href = keyBoardConfArr[i].value;
					stopLivePlay();
					location.href = href;
				}
			}
		break;
	}
};

//回车事件
	function doConfirm(){
        if(Area != 0){
	       var channelId = $(CellArr[tabIndex].focusId).getAttribute("channelId");
	       /*if (channelId !=null && channelId.length>0) {
                getEpgChannel(channelId);
                return;
            }*/

            /*var isLive = $(CellArr[tabIndex].focusId).getAttribute("isLive");
    	    if(isLive != null && isLive=="true"){
    	   		gotoChannel(rawFrequency,serviceId);
    	    }
*/
    	   var link = $(CellArr[tabIndex].focusId).getAttribute("link");
    	   if(link != null && link.length>0){
    	   		confirmUrl = link;
    	   }

           if ($(CellArr[tabIndex].focusId).hasAttribute("carouselLink")) {
                var link = $(CellArr[tabIndex].focusId).getAttribute("carouselLink");
                confirmUrl = link;
           }

		   var hasSubpage = $(CellArr[tabIndex].focusId).getAttribute("hasSubpage");
           if (hasSubpage=="true") {
           		var cellId = CellArr[tabIndex].focusId;
           		confirmUrl = "subpage.html?planId="+planId+"&tabId="+Tabdata[tabIndex].tabId+"&isTest="+canPreview+"&cellId="+cellId;
           }

            if(confirmUrl !== ""){
                if(tabIndex === 0){
                    stopLivePlay();
                }
                isMenu = 0;

                //var channelId = $(CellArr[tabIndex].focusId).getAttribute("channelId");
                //if (channelId !=null && channelId.length>0) {
                //	getEpgChannel(channelId);
	        //        return;
                //}
                
                
				if(areaCode==="0000" && confirmUrl.indexOf("coshipUrl") !== -1){
					confirmUrl = getUrlParam(confirmUrl,"coshipUrl");
				}else if(confirmUrl.indexOf("{userCode}") !== -1){
					confirmUrl = confirmUrl.replace("{userCode}",userCode);
				}else if(confirmUrl.indexOf("{stbNo}") !== -1){					
					confirmUrl = confirmUrl.replace("{stbNo}",stbNo);
				}else if(confirmUrl.indexOf("{cardId}") !== -1){
					confirmUrl = confirmUrl.replace("{cardId}",trueCardId);
				}else if(confirmUrl.indexOf("{mac}") !== -1){					
					confirmUrl = confirmUrl.replace("{mac}",mac);
				}else if(confirmUrl.indexOf("{channelId}") !== -1){					
					confirmUrl = confirmUrl.replace("{channelId}",channelId);
				}
                saveData();//缓存焦点
                accessAsset(function(){
                	location.href= confirmUrl;
                });
			// $("xt").innerHTML = confirmUrl;
            }
        }
	}

	function gotoChannel(frequency,serviceId){
		var path;
		try{
			path = Utility.getEnv("LOCAL_ROOT_PATH");
			if(Utility.getMidWareVersion() && Utility.getMidWareVersion()!=undefined && Utility.getMidWareVersion()!=null){
				path = Utility.getEnv("PLAY_ROOT_PATH");
			}
			var url = path + "play/play.htm?location=deliver://"+frequency+"0000.6875.64."+serviceId;	
			accessAsset(function(){
        		location.href= url;
        	});
			
		}catch(e){
			accessAsset(function(){
        		location.href = "ui://play.html";
        	});
			
		}
	}