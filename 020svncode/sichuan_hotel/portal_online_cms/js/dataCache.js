//清除缓存
    function cleanFocusCache(){
    	var storage = window.localStorage;
        var len = storage.length;
        for (var i=0; i  <  len; i++){     
            var key = storage.key(i); 
            //保留 isMenu 来判断  是开机进入首页还是刷新进入首页    
            if (key != "isMenu") {
                var value = storage.getItem(key);
                storage.setItem(key,"");
            }
            
        }  
    }

    //缓存
    function saveData(){
        /*setGlobalVar('focusId',ScrollH.focusId);
        setGlobalVar('Area',Area);
        setGlobalVar('tabIndex',Tab.focusPos);
		setGlobalVar('CellArr',JSON.stringify(CellArr).toString());
        setGlobalVar('isBackToPortal',"y");
		setGlobalVar('districtCode',districtCode);
		if(rollArr.length >0){
            setGlobalVar('rollArrBak',JSON.stringify(rollArr).toString());
			setGlobalVar('rollTop',rollTop);
        }
        setGlobalVar('isMenu',isMenu);
		if(keyBoardConfArr.length > 0){
			setGlobalVar('keyBoardConfArr',JSON.stringify(keyBoardConfArr).toString());
		}
		setGlobalVar('iepgAddr',iepgAddr);
		setGlobalVar("areaCode",areaCode);
		if(iepgAddr !==null && iepgAddr !=='undefined' && iepgAddr !==''){
			
			setGlobalVar("version",version);
			setGlobalVar("canPreview",canPreview);
		}
		setGlobalVar('logoFocusIndex',logoFocusIndex);
		setGlobalVar('hotplay',JSON.stringify(hotplay).toString());*/
		setGlobalVar('PORTAL_ADDR',location.href);
		setGlobalVar('urlPathGlobalName',location.href);
		setCarouseGlobal();
    }

    function getSavaData(){
        lastUpdateTime = getGlobalVar('lastUpdateTime') || new Date().getTime();
        Area = parseInt(getGlobalVar('Area')) || 0;
        tabIndex = parseInt(getGlobalVar('tabIndex') || 0);
        isBack = getGlobalVar('isBackToPortal');
		var CellArrStr = getGlobalVar('CellArr') || "";
		if(CellArrStr != ""){
			CellArr = JSON.parse(CellArrStr);
		}		
		districtCode = getGlobalVar('districtCode') || districtCode;
		areaCode = getGlobalVar('areaCode') || areaCode;
		rollTop = parseInt(getGlobalVar('rollTop') || 470);
	//	var rollTabIdBak = getGlobalVar('rollTabId') || "";
	//	if(rollTabIdBak !== ""){
	//		rollTabId = parseInt(rollTabIdBak);
	//	}
     //   isMenu = parseInt(getGlobalVar('isMenu') || 1);
	    var keyBoardConfStr = getGlobalVar('keyBoardConfArr') || "";
		if(keyBoardConfStr != ""){
			keyBoardConfArr = JSON.parse(keyBoardConfStr);
		}
		var hotplayStr = getGlobalVar("hotplay") || "";
		if(hotplayStr != ""){
			hotplay = JSON.parse(hotplayStr);
		}
		logoFocusIndex = getGlobalVar('logoFocusIndex') || 0;
		getCarouseGlobal();
    }