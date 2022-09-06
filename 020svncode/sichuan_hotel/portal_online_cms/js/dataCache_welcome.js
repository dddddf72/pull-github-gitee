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
        /*setGlobalVar('welcome_focusId',ScrollH.focusId);
        setGlobalVar('welcome_Area',Area);
        setGlobalVar('welcome_tabIndex',Tab.focusPos);
		setGlobalVar('welcome_CellArr',JSON.stringify(CellArr).toString());
        setGlobalVar('welcome_isBackToPortal',"y");
		setGlobalVar('welcome_districtCode',districtCode);
		if(rollArr.length >0){
            setGlobalVar('welcome_rollArrBak',JSON.stringify(rollArr).toString());
			setGlobalVar('welcome_rollTop',rollTop);
        }
        setGlobalVar('welcome_isMenu',isMenu);
		if(keyBoardConfArr.length > 0){
			setGlobalVar('welcome_keyBoardConfArr',JSON.stringify(keyBoardConfArr).toString());
		}
		setGlobalVar('welcome_iepgAddr',iepgAddr);
		setGlobalVar("welcome_areaCode",areaCode);
		if(iepgAddr !==null && iepgAddr !=='undefined' && iepgAddr !==''){
			
			setGlobalVar("welcome_version",version);
			setGlobalVar("welcome_canPreview",canPreview);
		}
		setGlobalVar('welcome_logoFocusIndex',logoFocusIndex);
		setGlobalVar('welcome_hotplay',JSON.stringify(hotplay).toString());
		setCarouseGlobal();*/
    }

    function getSavaData(){
        lastUpdateTime = getGlobalVar('welcome_lastUpdateTime') || new Date().getTime();
        Area = parseInt(getGlobalVar('welcome_Area')) || 0;
        tabIndex = parseInt(getGlobalVar('welcome_tabIndex') || 0);
        isBack = getGlobalVar('welcome_isBackToPortal');
		var CellArrStr = getGlobalVar('welcome_CellArr') || "";
		if(CellArrStr != ""){
			CellArr = JSON.parse(CellArrStr);
		}		
		districtCode = getGlobalVar('welcome_districtCode') || districtCode;
		areaCode = getGlobalVar('welcome_areaCode') || areaCode;
		rollTop = parseInt(getGlobalVar('welcome_rollTop') || 470);
	//	var rollTabIdBak = getGlobalVar('welcome_rollTabId') || "";
	//	if(rollTabIdBak !== ""){
	//		rollTabId = parseInt(rollTabIdBak);
	//	}
     //   isMenu = parseInt(getGlobalVar('welcome_isMenu') || 1);
	    var keyBoardConfStr = getGlobalVar('welcome_keyBoardConfArr') || "";
		if(keyBoardConfStr != ""){
			keyBoardConfArr = JSON.parse(keyBoardConfStr);
		}
		var hotplayStr = getGlobalVar("welcome_hotplay") || "";
		if(hotplayStr != ""){
			hotplay = JSON.parse(hotplayStr);
		}
		logoFocusIndex = getGlobalVar('welcome_logoFocusIndex') || 0;
		getCarouseGlobal();
    }