var ADContrl = (function(){
    var adctrl_o = {};
    
    var config = { 
        "ADROOT": "/storage/storage0/adv/",
        "ADFILESUFFIX": ".adv",
        "PATHPREFIX": "file:///", //TODO: 目前的方案, 如何让img src的情况下,浏览器能取到本地文件系统的内容? 目前暂时这样处理, 但这不是最终解决方案.
        "ADNAME": { //key: ADName, value: ADV file name
            "init": ["boot"],
            "epg": ["epg"],
            "playTv": ["pfbar","channel","volumebar"],
            "index": ["mainmenu", "text"]
        },
		"LOCAL_PATHPREFIX":"",
        "LOCAL_DEFAULTROOT": "images/",
        "LOCAL_DEFAULTFILE": {
            "pfbar": "",
            "mainmenu": "",
            "epg": "",
            "channel": "",
			"volumebar": ""
        },
        "LOCAL_NULLIMG": "images/alpha.gif"
    };
    
	//for 目录结构,主页目录和内容目录不在一个级别, 要对主页做特殊处理
    if( ((window.location.href).indexOf("index.html"))!=-1 ||
        ((window.location.href).indexOf("index_child.html"))!=-1 ||
        ((window.location.href).indexOf("index_old.html"))!=-1)
	{
		config.LOCAL_PATHPREFIX = "";
    }
	
    var getDefaultFile = function(adname){
        var str = config.LOCAL_PATHPREFIX + config.LOCAL_DEFAULTROOT + config.LOCAL_DEFAULTFILE[adname];
        return str;
    };
    
    var getNowDate = function(){var dd = new Date(); return dd;};
	//TODO: 临时处理: 如果网络中没有TDT,则需要重新定义getNowDate,以免时间跑出有效期.
    //getNowDate = function(){var dd = new Date(2011, 2, 29, 18, 22, 20); return dd;}
    
    var getAdNames = function(key){
        SumaJS.debug("getAdNames("+key+")");
        var ret = null;
        if(typeof(key)=="string"){
            var nameArr = config.ADNAME[key];
            if(typeof(nameArr)!="undefined" && nameArr.length>0){
                ret = [];
                for(var i=0,len=nameArr.length; i<len; i++){
                    var name = nameArr[i];
                    SumaJS.debug("getAdNames: name: "+name);
                    ret.push(name);
                }
            }
        }
        
        return ret;
    };
    
    var getAdvJsonObjArr = function(ADName){
        SumaJS.debug("getAdvJsonObjArr entry! ADName["+ADName+"]");
        if(typeof(ADName)=="undefined") return null;
        var adNames = getAdNames(ADName);
        if(adNames==null) return null;
       
        var jsonObjArr = [];
        for(var i=0,len=adNames.length; i<len; i++){
            var tmpJsonObj = null;
            
            var tmpAdvPath = config.ADROOT + adNames[i] + config.ADFILESUFFIX;
            /*
            var tmpJsonFile = new File(tmpAdvPath);
            var tmpJsonFileHandle = tmpJsonFile.openFile("r");
            if(tmpJsonFileHandle>0 && tmpJsonFile.size>0){
                var tmpJsonStr = tmpJsonFile.readFile(tmpJsonFile.size);
                tmpJsonFile.closeFile();
                eval("tmpJsonObj="+tmpJsonStr);
            }
            */
            var tmpJsonFile = FileSystem.getFile(tmpAdvPath);
			//alert(tmpAdvPath);
			//alert(tmpJsonFile);
            if(typeof(tmpJsonFile)=="object"){
                SumaJS.debug("FileSystem.getFile('"+tmpAdvPath+"') success! file size="+tmpJsonFile.size);
                if(tmpJsonFile.size>0){
                    var openRet = tmpJsonFile.open(1);
                    SumaJS.debug("file.open(1), return "+openRet);
                    if(openRet==1){
                        var tmpJsonStr = tmpJsonFile.readAllfile();
                        tmpJsonFile.close();
                        eval("tmpJsonObj="+tmpJsonStr);
						if (tmpJsonObj.length == 1) {
							if (!tmpJsonObj[0].SubType) {
								tmpJsonObj[0].SubType = 1;
							}
						}
                        jsonObjArr.push(tmpJsonObj);
                    }
                }
                FileSystem.killObject(tmpJsonFile);
            }
            else{
                SumaJS.debug("FileSystem.getFile('"+tmpAdvPath+"') return "+tmpJsonFile);
            }
        }
        return jsonObjArr;
    };
       
    var getDateFromStr = function(yymmdd){
        var strArr = yymmdd.split("-");
        var yy = parseInt(strArr[0], 10);
        var mm = parseInt(strArr[1], 10) - 1;
        var dd = parseInt(strArr[2], 10);
        
        ret.setFullYear(yy, mm, dd);
        return ret;
    };
    
    var getTimeFromStr = function(hhmmss){
        var ret = getNowDate();
        
        var strArr = hhmmss.split(":");
        var hh = parseInt(strArr[0], 10);
        var mm = parseInt(strArr[1], 10);
        var ss = parseInt(strArr[2], 10);
        
        ret.setHours(hh, mm, ss);
        
        return ret;
    };
    
    var checkTime = function(_start,_end){
        SumaJS.debug("checkTime: _start["+_start+"], _end["+_end+"]");
        //与当前时间比较时间
        var d = getNowDate().getTime();
        SumaJS.debug("checkTime: d["+d+"]");
        var s = getTimeFromStr(_start).getTime();
        SumaJS.debug("checkTime: s["+s+"]");
        var e = getTimeFromStr(_end).getTime();
        SumaJS.debug("checkTime: e["+e+"]");
        
        if( d >= s && d <= e ){
            return true;
        }
        return false;
    };
    
    var checkDate = function(_start,_end){
		SumaJS.debug("checkDate: _start[" + _start + "], _end[" + _end + "]");
		var currTime = getNowDate();
		var year = currTime.getFullYear();
		var month = currTime.getMonth() + 1;
		month = month < 10 ? "0" + month : month;
		var date = currTime.getDate();
		date = date < 10 ? "0" + date : date;
		var currDateStr = year + "-" + month + "-" + date;
		SumaJS.debug("checkDate: currDate[" + currDateStr + "]");

		if (currDateStr >= _start && currDateStr <= _end) {
			return true;
		}
		return false;
    };
    
    var checkResult = function(_ValidTime){
        //循环判断时间段
        var bool = false;
        var timeLength = _ValidTime.length;
        for(var i = 0;i<timeLength; i++ ){
            var time = _ValidTime[i];
            bool = checkTime(time.Start,time.End);
            if( bool ){//在显示时间段内
                break;	
            }
        }
        return bool;
    };
    
    var checkShow = function(_json){
        //判断是否显示
        var json = _json;
        var ValidDate = json.ValidDate;
        var ValidTime = json.ValidTime;
        if(ValidDate == null){
            //所有日期有效
            if(ValidTime == null){
                //所有时间有效
                return true;
            }
            else{
                //判断当前时间是否在指定时间段内
                return checkResult(ValidTime);
            }
        }
        else{
            b1 = checkDate(ValidDate.Start,ValidDate.End);
            if(b1){
                if( ValidTime == null ){
                    return true;
                }
                else{
                    return checkResult(ValidTime);
                }
            }
            else{//不在日期内
                return false;
            }
        }
    };
    
    adctrl_o.switchTimer = {};
    adctrl_o.switchImgArr = {};
    adctrl_o.switchImg = function(id, idx, interval){
        SumaJS.debug("switchImg: id["+id+"], idx["+idx+"], interval["+interval+"], adctrl_o.switchTimer[id]="+adctrl_o.switchTimer[id]);
        if(typeof(adctrl_o.switchTimer[id])!="undefined" && adctrl_o.switchTimer[id]!=-1){
            clearTimeout(adctrl_o.switchTimer[id]);
            SumaJS.debug("switchImg: change DOM["+document.getElementById(id)+"] img src="+adctrl_o.switchImgArr[id][idx]);
            document.getElementById(id).src = config.PATHPREFIX + config.ADROOT + adctrl_o.switchImgArr[id][idx];
        }
        var newIdx = (idx+1)%adctrl_o.switchImgArr[id].length;
        SumaJS.debug("newIdx="+newIdx);
        //var self = adctrl_o;
        //adctrl_o.switchTimer[id] = setTimeout(function(){self.switchImg(id, newIdx, interval);} , interval*1000);
        adctrl_o.switchTimer[id] = setTimeout("ADContrl.switchImg('"+id+"', "+newIdx+", "+interval+")", interval*1000);
    };
 
	adctrl_o.bindObj = {};
	adctrl_o.bindImgArray = [];
	adctrl_o.noBindChangeTimers = {};
	adctrl_o.noBindDatas = [];
	
	adctrl_o.getNoBindAD = function(adUIPosition){
		 for(var i in adctrl_o.bindObj){
            var obj = adctrl_o.bindObj[i];
            var id = document.getElementById(i);
			var adName = i.substring(0,i.indexOf("_"));
			if(adUIPosition == i ) {
				if(!adctrl_o.noBindDatas.adUIPosition) {
					adctrl_o.noBindDatas[adUIPosition] = {"data":obj["NoBind"],"uiObjId":i,"index":0};
				}
			}
		 }
	};
	
	function switchNobindImg(data,time,timerName){
		var currData = data;
		//alert("switchNobindImg "+currData.uiObjId+":::: "+timerName)
		var uiobj = document.getElementById(currData.uiObjId);
		uiobj.src = config.PATHPREFIX + config.ADROOT + currData.data.url[currData.index];
		adctrl_o.noBindChangeTimers[timerName] = setInterval(function(){
			var uiobj = document.getElementById(currData.uiObjId);
			if(!uiobj){
				return;
			}
			uiobj.src = config.PATHPREFIX + config.ADROOT + currData.data.url[currData.index];
			data.index = (data.index + 1) % currData.data.url.length;
		},time);
	}
	
	//直播音量广告切换(每弹出一次音量条换一次)
	adctrl_o.volumebarData = null;
	adctrl_o.switchVolumebarImg = function(){
		if(!adctrl_o.volumebarData){
			return;
		}
		if(adctrl_o.volumebarData.data.url.length <= 1){
			//修复只有一张图片数据采集不上报问题
			DataCollection.collectData(["09","02","02","01",adctrl_o.volumebarData.data.url[0],adctrl_o.volumebarData.data.url[0]]);
			return;
		}
		var uiobj = document.getElementById(adctrl_o.volumebarData.uiObjId);
		if(!uiobj){
			return;
		}		
		uiobj.src = config.PATHPREFIX + config.ADROOT + adctrl_o.volumebarData.data.url[adctrl_o.volumebarData.index];
		adctrl_o.volumebarData.index = (adctrl_o.volumebarData.index + 1) % adctrl_o.volumebarData.data.url.length;
		//预加载下一次图片
		var tempSrc = config.PATHPREFIX + config.ADROOT + adctrl_o.volumebarData.data.url[adctrl_o.volumebarData.index];
		SumaJS.preloadImages([tempSrc]);		
		//用户行为数据采集
		var imgName = uiobj.src.substr(uiobj.src.lastIndexOf("/")+1);
		DataCollection.collectData(["09","02","02","01",imgName,imgName]);		
	};
	
	//全部直播电视列表广告
	adctrl_o.channelData = null;
	adctrl_o.switchChannelTimer = null;
	adctrl_o.switchChannelInterval = 5;
	adctrl_o.switchChannelFlag = false;
	adctrl_o.channelShowFlag = false;
    adctrl_o.channelImgGroups = [];
    adctrl_o.channelImgGroupsIndex = 0;
    adctrl_o.channelDataUrlLen = 0;
    adctrl_o.isChannelDataUrlUpdate = function(){
        if(adctrl_o.channelDataUrlLen == adctrl_o.getChannelUrlLength()){
            return false;
        }else{
            adctrl_o.channelDataUrlLen = adctrl_o.getChannelUrlLength();
            return true;
        }
    };
    adctrl_o.getUrl = function(index){
        return adctrl_o.channelData.data.url[index];
    };
    adctrl_o.getChannelUrlLength = function(){
        if(!adctrl_o.channelData){
            return 0;
        }else{
            return adctrl_o.channelData.data.url.length;
        }
    };
    adctrl_o.reComputeGroups = function(){
        adctrl_o.channelImgGroups = [];
        var urlLen = adctrl_o.getChannelUrlLength();
        var gruopLen = parseInt(urlLen/3)+(urlLen%3 == 0 ? 0:1);
        for(var index=0;index<gruopLen;index++){
            adctrl_o.channelImgGroups.push([]);
            for(var i=index*3;(i<urlLen && i<(index*3+3));i++){
                adctrl_o.channelImgGroups[index].push(adctrl_o.getUrl(i));
            }
        }
    };
    adctrl_o.getImgUiObjs = function(){
        return [
            document.getElementById("channel_AD_0_img"),
            document.getElementById("channel_AD_1_img"),
            document.getElementById("channel_AD_2_img")
        ];
    };
    adctrl_o.showCurGroup = function(uiObjs){
        //alert(adctrl_o.channelImgGroupsIndex)
        var imgUrls = adctrl_o.channelImgGroups[adctrl_o.channelImgGroupsIndex];
        for(var i=0;i<3;i++){
            if(imgUrls[i]){
                uiObjs[i].style.display = "block";
                uiObjs[i].src = config.PATHPREFIX + config.ADROOT + imgUrls[i];
            }else{
                uiObjs[i].style.display = "none";
            }
        }
    };
    adctrl_o.preloadImgs = function(){
        try {
            if(adctrl_o.channelImgGroups.length == 0){
                return;
            }
            //alert(adctrl_o.channelImgGroupsIndex)
            adctrl_o.channelImgGroupsIndex = (adctrl_o.channelImgGroupsIndex + 1) % adctrl_o.channelImgGroups.length;
            var tempSrc = [];
            var tmpImgUrls = adctrl_o.channelImgGroups[adctrl_o.channelImgGroupsIndex];
            for (var i = 0; i < 3; i++) {
                if (tmpImgUrls[i]) {
                    tempSrc.push(config.PATHPREFIX + config.ADROOT + tmpImgUrls[i]);
                }
            }
            //var tempSrc = config.PATHPREFIX + config.ADROOT + adctrl_o.channelData.data.url[adctrl_o.channelData.index];
            SumaJS.preloadImages(tempSrc);
        }catch(e){
            alert("preloadImg "+ e.toString());
        }
    };
	adctrl_o.switchChannelImg = function(){
		if(!adctrl_o.channelData){
			return;
		}
		/*if(adctrl_o.switchChannelFlag){
			return;
		}
		adctrl_o.switchChannelFlag = true;*/

        if(adctrl_o.isChannelDataUrlUpdate()){
            adctrl_o.channelImgGroupsIndex = 0;
        }
        adctrl_o.reComputeGroups();
        if(adctrl_o.channelImgGroups.length <=0){
            return 0;
        }
		//var uiobj = document.getElementById(adctrl_o.channelData.uiObjId);
		/*if(!uiobj){
			return;
		}*/
        var uiObjs = adctrl_o.getImgUiObjs();
        if(!uiObjs[0]){
            return;
        }
		clearInterval(adctrl_o.switchChannelTimer);		
		//uiobj.src = config.PATHPREFIX + config.ADROOT + adctrl_o.channelData.data.url[adctrl_o.channelData.index];
		//adctrl_o.channelData.index = (adctrl_o.channelData.index + 1) % adctrl_o.getChannelUrlLength();
        //显示当前分组
        adctrl_o.showCurGroup(uiObjs);
		//预加载下一次图片
        adctrl_o.preloadImgs();
		//用户行为数据采集
        for(var i=0;i<uiObjs.length;i++) {
            if(uiObjs[i].src) {
                var imgName = uiObjs[i].src.substr(uiObjs[i].src.lastIndexOf("/") + 1);
                DataCollection.collectData(["09", "03", "03", "01", imgName, imgName]);
            }
        }
				
		adctrl_o.switchChannelInterval = adctrl_o.channelData.data.interval || adctrl_o.switchChannelInterval;
		adctrl_o.switchChannelTimer = setInterval(
			function(){
                if(!adctrl_o.channelShowFlag){
                    return;
                }
                if(adctrl_o.isChannelDataUrlUpdate()){
                    adctrl_o.channelImgGroupsIndex = 0;
                }
                adctrl_o.reComputeGroups();
                if(adctrl_o.channelImgGroups.length <=0){
                    return 0;
                }
                //显示当前分组
                adctrl_o.showCurGroup(uiObjs);
                //预加载下一次图片
                adctrl_o.preloadImgs();
                //用户行为数据采集
                for(var i=0;i<uiObjs.length;i++) {
                    if(uiObjs[i].src) {
                        var imgName = uiObjs[i].src.substr(uiObjs[i].src.lastIndexOf("/") + 1);
                        DataCollection.collectData(["09", "03", "03", "01", imgName, imgName]);
                    }
                }
			}
		, adctrl_o.switchChannelInterval*1000);
	};
	
	//广播电视广告
	adctrl_o.epgData0 = null;
	adctrl_o.epgData1 = null;
	adctrl_o.switchEpgTimer = null;
	adctrl_o.switchEpgInterval = 5;
	adctrl_o.switchEpgFlag = false;
	adctrl_o.switchEpgImg = function(){
		if(!adctrl_o.epgData0 && !adctrl_o.epgData1){
			return;
		}
		if((adctrl_o.epgData0.data.url.length <= 1 && adctrl_o.epgData1.data.url.length <= 1)){
			//修复只有一张图片数据采集不上报问题
			if((adctrl_o.epgData0.data.url.length == 1  )){
				DataCollection.collectData(["09","05","05","01",adctrl_o.epgData0.data.url[0],adctrl_o.epgData0.data.url[0]]);
			}
			if(adctrl_o.epgData1.data.url.length ==1 ){
				DataCollection.collectData(["09","04","04","01",adctrl_o.epgData1.data.url[0],adctrl_o.epgData1.data.url[0]]);
			}
			return;
		}
		if(adctrl_o.switchEpgFlag){
			return;
		}		
		adctrl_o.switchEpgFlag = true;	
		clearInterval(adctrl_o.switchEpgTimer);	
		if(adctrl_o.epgData0){
			var uiobj0 = document.getElementById(adctrl_o.epgData0.uiObjId);
			uiobj0.src = config.PATHPREFIX + config.ADROOT + adctrl_o.epgData0.data.url[adctrl_o.epgData0.index];
			adctrl_o.epgData0.index = (adctrl_o.epgData0.index + 1) % adctrl_o.epgData0.data.url.length;
			//预加载下一次图片
			var tempSrc = config.PATHPREFIX + config.ADROOT + adctrl_o.epgData0.data.url[adctrl_o.epgData0.index];
			SumaJS.preloadImages([tempSrc]);					
			//用户行为数据采集
			var type = "00";
			if(uiobj0.id == "epg_AD_0_img"){
				type = "05";
			}else{
				type = "04";
			}
			var imgName = uiobj0.src.substr(uiobj0.src.lastIndexOf("/")+1);
			DataCollection.collectData(["09",type,type,"01",imgName,imgName]);
		}
		if(adctrl_o.epgData1){
			var uiobj1 = document.getElementById(adctrl_o.epgData1.uiObjId);
			uiobj1.src = config.PATHPREFIX + config.ADROOT + adctrl_o.epgData1.data.url[adctrl_o.epgData1.index];
			adctrl_o.epgData1.index = (adctrl_o.epgData1.index + 1) % adctrl_o.epgData1.data.url.length;
			//预加载下一次图片
			var tempSrc = config.PATHPREFIX + config.ADROOT + adctrl_o.epgData1.data.url[adctrl_o.epgData1.index];
			SumaJS.preloadImages([tempSrc]);					
			//用户行为数据采集
			var type = "00";
			if(uiobj1.id == "epg_AD_0_img"){
				type = "05";
			}else{
				type = "04";
			}
			var imgName = uiobj0.src.substr(uiobj0.src.lastIndexOf("/")+1);
			DataCollection.collectData(["09",type,type,"01",imgName,imgName]);			
		}		
		adctrl_o.switchEpgInterval = adctrl_o.epgData0.data.interval || adctrl_o.switchEpgInterval;
		adctrl_o.switchEpgTimer = setInterval(
			function(){
				if(adctrl_o.epgData0 && adctrl_o.epgData0.data.url.length > 1){
					var uiobj0 = document.getElementById(adctrl_o.epgData0.uiObjId);
					uiobj0.src = config.PATHPREFIX + config.ADROOT + adctrl_o.epgData0.data.url[adctrl_o.epgData0.index];
					adctrl_o.epgData0.index = (adctrl_o.epgData0.index + 1) % adctrl_o.epgData0.data.url.length;
					//预加载下一次图片
					var tempSrc = config.PATHPREFIX + config.ADROOT + adctrl_o.epgData0.data.url[adctrl_o.epgData0.index];
					SumaJS.preloadImages([tempSrc]);					
					//用户行为数据采集
					var type = "00";
					if(uiobj0.id == "epg_AD_0_img"){
						type = "05";
					}else{
						type = "04";
					}
					var imgName = uiobj0.src.substr(uiobj0.src.lastIndexOf("/")+1);
					DataCollection.collectData(["09",type,type,"01",imgName,imgName]);										
				}
				if(adctrl_o.epgData1 && adctrl_o.epgData1.data.url.length > 1){
					var uiobj1 = document.getElementById(adctrl_o.epgData1.uiObjId);
					uiobj1.src = config.PATHPREFIX + config.ADROOT + adctrl_o.epgData1.data.url[adctrl_o.epgData1.index];
					adctrl_o.epgData1.index = (adctrl_o.epgData1.index + 1) % adctrl_o.epgData1.data.url.length;
					//预加载下一次图片
					var tempSrc = config.PATHPREFIX + config.ADROOT + adctrl_o.epgData1.data.url[adctrl_o.epgData1.index];
					SumaJS.preloadImages([tempSrc]);					
					//用户行为数据采集
					var type = "00";
					if(uiobj1.id == "epg_AD_0_img"){
						type = "05";
					}else{
						type = "04";
					}
					var imgName = uiobj0.src.substr(uiobj0.src.lastIndexOf("/")+1);
					DataCollection.collectData(["09",type,type,"01",imgName,imgName]);										
				}							
			}
		, adctrl_o.switchEpgInterval*1000);
	};				
	
	function clearAllNobindTimer(){
		for(xx in adctrl_o.noBindChangeTimers) {
			clearInterval(adctrl_o.noBindChangeTimers[xx]);
			adctrl_o.noBindChangeTimers[xx] = -1;
		}
	}
	
	//停止所有广告定时显示
	adctrl_o.stopChangeTimerAll = function(){
		adctrl_o.refreshADByService(-1,-1,-1);
	};
	
    //[外部接口]当需要切换为某个service的广告时调用, 传入service三要素
    adctrl_o.refreshADByService = function(nid, tsid, serviceid){
        SumaJS.debug("[AD refreshADByService]准备刷新service相关广告: service["+nid+","+tsid+","+serviceid+"]");
        for(var i in adctrl_o.bindObj){
            SumaJS.debug("[AD refreshADByService]处理id = " + i);
            var obj = adctrl_o.bindObj[i];
            var id = document.getElementById(i);
			var key = [nid, tsid, serviceid];
			var adName = i.substring(0,i.indexOf("_"));
			var adUIPosition = i;
			if(nid == -1 && tsid == -1 && serviceid == -1){
				if(adctrl_o.noBindChangeTimers[adUIPosition]) {
					clearInterval(adctrl_o.noBindChangeTimers[adUIPosition]);
					adctrl_o.noBindChangeTimers[adUIPosition] = -1;
				}				
            }else if (obj[key]) {
				if(adctrl_o.noBindChangeTimers[adUIPosition]) {
					clearInterval(adctrl_o.noBindChangeTimers[adUIPosition]);
					adctrl_o.noBindChangeTimers[adUIPosition] = -1;
				}
				id.src = config.PATHPREFIX + config.ADROOT + obj[key].url[obj[key].index];
				obj[key].index = ++obj[key].index == obj[key].url.length ? 0 : obj[key].index;
			} else {
				if(obj["NoBind"]) {
					if(adName.indexOf("epg") >=0 || adName.indexOf("channel") >=0 || adName.indexOf("volumebar") >=0) {
						//alert(adctrl_o.noBindChangeTimers[adUIPosition])
						if(!adctrl_o.noBindDatas[adUIPosition]){
							adctrl_o.getNoBindAD(adUIPosition);
						}
						//alert("no bind datas = "+JSON.stringify(adctrl_o.noBindDatas[adUIPosition]))
						if(adctrl_o.noBindDatas[adUIPosition] && (!adctrl_o.noBindChangeTimers[adUIPosition] || adctrl_o.noBindChangeTimers[adUIPosition] == -1)) {				
							/*
							var interval = adctrl_o.noBindDatas[adUIPosition].data.interval || 5;
							clearInterval(adctrl_o.noBindChangeTimers[adUIPosition]);
							switchNobindImg(adctrl_o.noBindDatas[adUIPosition],interval*1000,adUIPosition);
							*/
							if(adName.indexOf("volumebar") >=0){
								if(!adctrl_o.volumebarData){
									adctrl_o.volumebarData = adctrl_o.noBindDatas[adUIPosition];
								}
							}else if(adName.indexOf("channel") >=0){
								if(!adctrl_o.channelData){
									adctrl_o.channelData = adctrl_o.noBindDatas[adUIPosition];
								}
							}else if(adName.indexOf("epg") >=0){
								var flag = false;
								if(!adctrl_o.epgData0){
									flag = true;
									adctrl_o.epgData0 = adctrl_o.noBindDatas[adUIPosition];
								}
								if(!adctrl_o.epgData1 && !flag){
									adctrl_o.epgData1 = adctrl_o.noBindDatas[adUIPosition];
								}																
							}
						}
					} else {
						if(SysSetting.getEnv("PFBAR_AD_INDEX") == "" || parseInt(SysSetting.getEnv("PFBAR_AD_INDEX")) > obj["NoBind"].url.length){
							SysSetting.setEnv("PFBAR_AD_INDEX", 0+"");
						}
						obj["NoBind"].index = parseInt(SysSetting.getEnv("PFBAR_AD_INDEX"));
						id.src = config.PATHPREFIX + config.ADROOT + obj["NoBind"].url[obj["NoBind"].index];
						obj["NoBind"].index = ++obj["NoBind"].index == obj["NoBind"].url.length ? 0 : obj["NoBind"].index;
						SysSetting.setEnv("PFBAR_AD_INDEX", obj["NoBind"].index+"");
						//预加载下一次图片
						var tempSrc = config.PATHPREFIX + config.ADROOT + obj["NoBind"].url[obj["NoBind"].index];
						SumaJS.preloadImages([tempSrc]);						
						if(id.id == "pfbar_AD_0_img"){
							//用户行为数据采集
							var imgName = id.src.substr(id.src.lastIndexOf("/")+1);
							DataCollection.collectData(["09","01","01","01",imgName,imgName]);
						}
					}
				} else {
					var defaulturl = config.LOCAL_PATHPREFIX  + config.LOCAL_NULLIMG;
					var cfgDefault = config.LOCAL_DEFAULTFILE[adName];
					if(cfgDefault) {
						defaulturl = config.LOCAL_PATHPREFIX  + config.LOCAL_DEFAULTROOT + cfgDefault;
					}
					id.src = defaulturl;
				}
			}	
        }
    };
    
    //[外部接口]查看本页面是否有AD并显示AD
    //约定: 主应用带广告位的页面中, 已经在预留的广告位, 放置了id=<ADType>_AD_<index>的元素
    adctrl_o.showAD = function(ADName){
		adctrl_o.bindObj = {};
		adctrl_o.bindImgArray = [];
        var jsonObjArr = getAdvJsonObjArr(ADName);
		
        if(jsonObjArr==null) return 0;
        SumaJS.debug("准备显示广告. 已读取的广告描述对象有"+jsonObjArr.length+"个.");
        if(typeof(jsonObjArr)=="object"){
            for(var i=0,len=jsonObjArr.length; i<len; i++){
                SumaJS.debug("handle the jsonObjArr, i="+i);
                var jsonObj = jsonObjArr[i];
                if(typeof(jsonObj.length)=="undefined"){
                    return 0; //boot广告
                }
                else{
                    SumaJS.debug("**** 开始处理第"+i+"个广告描述对象 ****");
                    SumaJS.debug("该广告描述对象下有"+jsonObj.length+"个广告位");
                    for(var j=0,l=jsonObj.length; j<l; j++){
                        var adObj = jsonObj[j];
                        var Type = adObj.Type;
                        SumaJS.debug("====开始处理第"+j+"个广告位====");
                        SumaJS.debug("ready to checkShow for adObj["+j+"], adObj.Type["+Type+"]");
                        if(checkShow(adObj)){
                            var eleId = Type+"_AD_"+ (adObj.SubType - 1);
                            SumaJS.debug("checkShow pass! ready to show ad on eleId["+eleId+"]");
                            
                            if(Type=="text"){
                                var TextInfo = adObj.TextInfo;
                                var innerHTML = '<marquee';
                                
                                var styleValue = '';
                                if(typeof(TextInfo.fontsize)!="undefined" && TextInfo.fontsize!=null){
                                    styleValue += 'font-size:'+TextInfo.fontsize+';';
                                }
                                if(typeof(TextInfo.color)!="undefined" && TextInfo.color!=null){
                                    styleValue += 'color:'+TextInfo.color+';';
                                }
                                if(typeof(TextInfo.bgcolor)!="undefined" && TextInfo.bgcolor!=null){
                                    styleValue += 'background-color:'+TextInfo.bgcolor+';';
                                }
                                if(styleValue.length>0){
                                    innerHTML += ' style="'+styleValue+'"';
                                }
                                
                                if(typeof(TextInfo.direction)!="undefined" && TextInfo.direction!=null){
                                    innerHTML += ' direction="'+TextInfo.direction+'"';
                                }
                                
                                if(typeof(TextInfo.times)!="undefined" && TextInfo.times!=null){
                                    innerHTML += ' loop="'+TextInfo.times+'"';
                                }
                                
                                if(typeof(TextInfo.speed)!="undefined" && TextInfo.speed!=null){
                                    innerHTML += ' scrollamount="'+TextInfo.speed+'"';
                                    innerHTML += ' scrolldelay="30"';//默认20
                                }
                                
                                var text = TextInfo.text;
                                innerHTML += '>' + TextInfo.text + '</marquee>';
                                document.getElementById(eleId).innerHTML = innerHTML;
                            }
                            else{//暂时只考虑放置图片广告的情况
                                var FileList = adObj.FileList;
                                var imgHTML = "";
								var imgId = eleId+'_img';
								 var imgUrl = config.PATHPREFIX + config.ADROOT;  
                                if (FileList.length == 1 && (typeof FileList[0].url == "string" || FileList[0].url.length == 1)) {                   
									imgUrl += FileList[0].url;
									//修复只有一张图片数据采集不上报问题
									var obj = FileList[0];
									if (!adctrl_o.bindObj[imgId]) {
										adctrl_o.bindObj[imgId] = {};
									}
									if (!adctrl_o.bindObj[imgId]["NoBind"]) {
										adctrl_o.bindObj[imgId]["NoBind"] = obj;
									} else {
										adctrl_o.bindObj[imgId]["NoBind"].url.concat(obj.url);
									}
                                } else {
								/*	imgUrl += FileList[0].url[0];
									
									var imgURLIndex = parseInt(SysSetting.getEnv("PFBAR_AD_INDEX"));
									if(!imgURLIndex){imgURLIndex = 0;}	
									imgUrl += FileList[0].url[imgURLIndex];
								*/	
									
									if(Type == "pfbar"){
										var imgURLIndex = parseInt(SysSetting.getEnv("PFBAR_AD_INDEX"));
										if(!imgURLIndex){imgURLIndex = 0;}			
										imgUrl += FileList[0].url[imgURLIndex];
									}else{
										imgUrl += FileList[0].url[0];
									}

									for(var k = 0, m = FileList.length; k < m; ++k) {
										var obj = FileList[k];
										if (typeof obj.services == "object") {
											if (!adctrl_o.bindObj[imgId]) {
												adctrl_o.bindObj[imgId] = {};
											}
											var arrayLen = adctrl_o.bindImgArray.length;
											adctrl_o.bindImgArray[arrayLen] = {};
											adctrl_o.bindImgArray[arrayLen].url = obj.url;
											adctrl_o.bindImgArray[arrayLen].defaulturl = obj.defaulturl;
											adctrl_o.bindImgArray[arrayLen].interval = obj.interval || 5;
											adctrl_o.bindImgArray[arrayLen].index = 0;
											for(var o = 0, p = obj.services.length; o < p; ++o) {
												adctrl_o.bindObj[imgId][obj.services[o]] = adctrl_o.bindImgArray[arrayLen];
											}
										} else {
											if (!adctrl_o.bindObj[imgId]) {
												adctrl_o.bindObj[imgId] = {};
											}
											var arrayLen = adctrl_o.bindImgArray.length;
											adctrl_o.bindImgArray[arrayLen] = {};
											adctrl_o.bindImgArray[arrayLen].url = obj.url;
											adctrl_o.bindImgArray[arrayLen].interval =  obj.interval || 5;
											adctrl_o.bindImgArray[arrayLen].index = 0;
											if (!adctrl_o.bindObj[imgId]["NoBind"]) {
												adctrl_o.bindObj[imgId]["NoBind"] = adctrl_o.bindImgArray[arrayLen];
											} else {
												adctrl_o.bindObj[imgId]["NoBind"].url.concat(obj.url);
											}
										}
									}
								}
								
								var imgPositionX = FileList[0].position[0];
								var imgPositionY = FileList[0].position[1];
								var imgPositionW = FileList[0].position[2];
								var imgPositionH = FileList[0].position[3];
								var styleValue = "";
								if (imgPositionX + imgPositionY + imgPositionW + imgPositionH >0) {
									var imgStr = '<img id="'+imgId+'" src="'+imgUrl+'"';
									if (imgPositionW > 0) {
										imgStr += ' width="'+imgPositionW+'"';
									}
									if (imgPositionH > 0) {
										imgStr += ' height="'+imgPositionH+'"';
									}
									imgStr += ' onerror="javascript:this.style.display=\'none\'"/>';
									
									var styleValue = "";
									if (imgPositionX+imgPositionY > 0){
										styleValue = ' style="position:absolute; left:'+imgPositionX+'px; top:'+imgPositionY+'px;"';
									}
									imgHTML += '<div'+styleValue+'>'+imgStr+'</div>';
								}
								else{
									var imgStr = '<img id="'+imgId+'" src="'+imgUrl+'"';
									if(eleId =="pfbar_AD_0" || eleId =="volumebar_AD_0" || eleId =="channel_AD_0"){
										imgStr += ' width="232"';
										imgStr += ' height="130"';
									}else if(eleId =="epg_AD_0"){
										imgStr += ' width="398"';
										imgStr += ' height="398"';
									}
									imgStr += ' onerror="javascript:this.style.display=\'none\'"/>';
									imgHTML += '<div>'+imgStr+'</div>';
									//imgHTML += '<div><img id="'+imgId+'" src="'+imgUrl+'" onerror="javascript:this.style.display=\'none\'"/></div>';
								}
                                SumaJS.debug("imgHTML:"+imgHTML);
								//alert(imgHTML);
                                if(Type == "channel"){//FIXME:为了逻辑的可读性，将channel类型的特殊处理放到了switchChannelImg里，再次仅把dom节点创建出来
                                    if(document.getElementById("channel_AD_0_img")){
                                        return;
                                    }
                                    function makeImgHTML(index){
                                        var imgStr = '<img id="'+"channel_AD_"+index+'_img" src="'+" "+'"';
                                        imgStr += ' width="232"';
                                        imgStr += ' height="130"';
                                        imgStr += ' onerror="javascript:this.style.display=\'none\'"/>';
                                        return '<div>'+imgStr+'</div>';
                                    }
                                    document.getElementById("channel_AD_0").innerHTML = makeImgHTML(0);
                                    document.getElementById("channel_AD_1").innerHTML = makeImgHTML(1);
                                    document.getElementById("channel_AD_2").innerHTML = makeImgHTML(2);
                                }else {
                                    document.getElementById(eleId).innerHTML = imgHTML;
                                }
                            }
                        }
                        else{
                            SumaJS.debug("checkShow not pass, no need to show ad!");
                        }
                        SumaJS.debug("====结束处理第"+j+"个广告位====");
                    }//end for j
                    SumaJS.debug("**** 结束处理第"+i+"个广告描述对象 ****");
                }//end not boot else
            }//end for i
            
        }
    };
	
	//初始化广告数据
	adctrl_o.init = function(){
		adctrl_o.volumebarData = null;
		adctrl_o.channelData = null;
		adctrl_o.switchChannelTimer = null;
		adctrl_o.switchChannelInterval = 5;
		adctrl_o.switchChannelFlag = false;		
		adctrl_o.epgData0 = null;
		adctrl_o.epgData1 = null;
		adctrl_o.switchEpgTimer = null;
		adctrl_o.switchEpgInterval = 5;
		adctrl_o.stopChangeTimerAll();		
	};
    
    return adctrl_o;
}());