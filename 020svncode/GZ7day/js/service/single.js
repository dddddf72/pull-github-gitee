function ServiceInfoJSON(str) {
	try {
		//eval('this.json = '+str);
		this.json = JSON.parse(str);
	} catch (e) {
		this.json = null;
		SumaJS.debug("str is not a json");
		//alert("str is not a json");
	}
};

ServiceInfoJSON.prototype.getTs = function(tsId) {
	
	var ret = this.tsHash[tsId];
	if(!ret) {
		ret = {"NetworkId":-1,"OriginalNetworkId":-1,"TsId":-1,"Frequency":-1,"SymbolRate":-1,"Modulation":-1};
	}
	return ret;
};

ServiceInfoJSON.prototype.getExt = function(handle) {
	if (!this.extHash) {
		this.extHash = {};
		if (this.json && this.json.ServiceInfo && this.json.ServiceInfo.ServiceExtArray) {
			var extArray = this.json.ServiceInfo.ServiceExtArray;
			for (var i = 0; i < extArray.length; ++i) {
				this.extHash[extArray[i].ServiceHandle] = extArray[i];
			}
		} 
	}
	return this.extHash[handle];
};

ServiceInfoJSON.prototype.getGroup = function(groupId) {
	if (!this.groupHash) {
		this.groupHash = {};
		if (this.json && this.json.ServiceGroupInfo && this.json.ServiceGroupInfo.DVBGroupArray) {
			var groupArray = this.json.ServiceGroupInfo.DVBGroupArray;
			for (var i = 0; i < groupArray.length; ++i) {
				this.groupHash[groupArray[i].GroupId] = groupArray[i];
			}
		} 
	}
	return this.groupHash[groupId];
};

ServiceInfoJSON.prototype.getNVODGroup = function(groupId) {
	if (!this.nvodGroupHash) {
		if (this.json && this.json.ServiceGroupInfo && this.json.ServiceGroupInfo.NVODGroupArray) {
			var groupArray = this.json.ServiceGroupInfo.NVODGroupArray;
			for (var i = 0; i < groupArray.length; ++i) {
				this.nvodGroupHash[groupArray[i].NvodGroupId] = groupArray[i];
			}
		} 
	}
	return this.nvodGroupHash[groupId];
};

ServiceInfoJSON.prototype.getAllNVOD = function() {
	if(!this.AllNVOD){
		this.AllNVOD = [];
		if (this.json && this.json.ServiceFlag.NVODFlag && this.json.ServiceGroupInfo && this.json.ServiceGroupInfo.NVODGroupArray) {
			var groupArray = this.json.ServiceGroupInfo.NVODGroupArray;
			for (var i = 0; i < groupArray.length; ++i) {
				this.AllNVOD = this.AllNVOD.concat(groupArray[i].NvodGroupServices);
			}
		} 
	}
	return this.AllNVOD;
};

ServiceInfoJSON.prototype.getChannelNumber = function(handle) {
	
	return this.numberHash[handle];
};

ServiceInfoJSON.prototype.getService = function(handle) {
	if (!this.serviceHash) {
		this.serviceHash = {};
		if (this.json && this.json.ServiceInfo && this.json.ServiceInfo.ServiceArray) {
			var serviceArray = this.json.ServiceInfo.ServiceArray;
			for (var i = 0; i < serviceArray.length; ++i) {
				//this.serviceHash[serviceArray[i].ServiceHandle] = serviceArray[i];
				// 过滤掉 4k
				if(serviceArray[i].ServiceType != 225){
					this.serviceHash[serviceArray[i].ServiceHandle] = serviceArray[i];
				}
			}
		} 
	}
	return this.serviceHash[handle];
};

ServiceInfoJSON.prototype.getIndexItems = function(id) {
	if (!this.itemsHash) {
		if (this.json && this.json.VarsInfo) {
			var itemsArray = this.json.VarsInfo;
			for (var i = 0; i < itemsArray.length; ++i) {
				this.itemsHash[itemsArray[i].VarsId] = itemsArray[i];
			}
		} 
	}
	return this.itemsHash[id];
};


//to do
ServiceInfoJSON.prototype.getGroupName = function(id) {
	if (!this.groupNameHash) {
		if (this.json && this.json.ServiceGroupInfo && this.json.ServiceGroupInfo.DVBGroupArray) {
			var groupArray = this.json.ServiceGroupInfo.DVBGroupArray;
			for (var i = 0; i < groupArray.length; ++i) {
				this.groupNameHash[groupArray[i].GroupId] = groupArray[i].GroupName;
				this.groupInfo.push(groupArray[i].GroupId);
			}
		}
	}
	return this.groupNameHash[id];
};

ServiceInfoJSON.prototype.getGroupArray = function() {
	if (!this.groupInfo) {
		this.groupInfo = [];
		if(typeof(this.groupNameHash) == "undefined"){
			this.groupNameHash = {};
		}
		if (this.json && this.json.ServiceGroupInfo && this.json.ServiceGroupInfo.DVBGroupArray) {
			var groupArray = this.json.ServiceGroupInfo.DVBGroupArray;
			for (var i = 0; i < groupArray.length; ++i) {
				if(groupArray[i].GroupId != "225"){  // 过滤掉 "4k超清频道"
					this.groupNameHash[groupArray[i].GroupId] = groupArray[i].GroupName;
					this.groupInfo.push(groupArray[i].GroupId);
				}
			}
		}
	}
	return this.groupInfo;
};

ServiceInfoJSON.prototype.getGroupServices = function(id) {
	if (!this.groupServiceHash) {
		var group = this.getGroup(id);
		if (group) {
			var array = group.GroupServices;
			for (var i = 0; i < array.length; ++i) {
				var service  = this.getService(array[i].ServiceHandle);
				if (service) {
					this.groupServiceHash[id].push(service);
				}
			}
		}
	} 
	return this.groupServiceHash[id];
};

ServiceInfoJSON.prototype.getVersion = function() {
	return this.json.Version;
}

function ChannelInfo(str) {
	try {
		this.json = JSON.parse(str);
	} catch (e) {
		this.json = null;
		SumaJS.debug("str is not a json");
	}
};

ChannelInfo.prototype.getServiceId = function(handle) {
	if (this.json[handle]) {
		return this.json[handle].ServiceId;
	} else {
		return -1;
	}
};

ChannelInfo.prototype.getHide = function(handle) {
	if (this.json[handle]) {
		return this.json[handle].hide;
	} else {
		return -1;
	}
};

ChannelInfo.prototype.getFav = function(handle) {
	if (this.json[handle]) {
		return this.json[handle].favorite;
	} else {
		return -1;
	}
};

ChannelInfo.prototype.getLock = function(handle) {
	if (this.json[handle]) {
		return this.json[handle].lock;
	} else {
		return -1;
	}
};

ChannelInfo.prototype.getVolume = function(handle) {
	if (this.json[handle]) {
		return this.json[handle].volume;
	} else {
		return -1;
	}
};

ChannelInfo.prototype.getOffset = function(handle) {
	if (this.json[handle]) {
		return this.json[handle].offset;
	} else {
		return 0;
	}
};

function getServiceInfo(type) {
	//type 0:所有节目； 1：非隐藏节目
	var serviceInfoStr = readFile("/storage/storage0/siConfig/ServiceInfo.json", 3);//alert(serviceInfoStr);	
	var channelInfoStr = readFile("/storage/storage0/siConfig/ChannelInfo.json", 3);//alert(channelInfoStr);	
	var timeShiftInfoStr = readFile("/storage/storage0/vod/Timeshift.json", 3);
	
	var serviceInfo = new ServiceInfoJSON(serviceInfoStr);//alert(serviceInfo);

	if(!serviceInfo.json){
		return 0;
	}

	Version = serviceInfo.getVersion();
	
	var timeShiftInfo = {};
	if(timeShiftInfoStr){
		try{
			timeShiftInfo = JSON.parse(timeShiftInfoStr);
		}catch(e){
			timeShiftInfo.TimeShiftChannels = [];
		}
	}else{
		timeShiftInfo.TimeShiftChannels = [];
	}
	
	var tempOriginalArray = {};
	try{
		tempOriginalArray = JSON.parse(serviceInfoStr);
	}catch(e){
	}
	
	/*  portal地址的获取前移到index.js中了，此处先注释掉(2016-09-26 by liwenlei)
	if (DataAccess.getInfo("VodApp", "PortalAddress") == "" && typeof tempOriginalArray.VodInfo != "undefined") {
		if(typeof tempOriginalArray.VodInfo.PortalAdress != "undefined") {
			DataAccess.setInfo("VodApp", "PortalAddress", tempOriginalArray.VodInfo.PortalAdress);
			DataAccess.save("VodApp", "PortalAddress");
		}
		if(typeof tempOriginalArray.VodInfo.PortalPort != "undefined") {
			DataAccess.setInfo("VodApp", "PortalPort", tempOriginalArray.VodInfo.PortalPort);
			DataAccess.save("VodApp", "PortalPort");
		}
	}
	*/
	
	if (!serviceInfo.tsHash) {
		serviceInfo.tsHash = {};
		if (serviceInfo.json && serviceInfo.json.ServiceInfo && serviceInfo.json.ServiceInfo.TsInfoArray) {
			var tsArray = serviceInfo.json.ServiceInfo.TsInfoArray;
			for (var i = 0; i < tsArray.length; ++i) {
				serviceInfo.tsHash[tsArray[i].TsId] = tsArray[i];
			}
		} 
	}
	
	if (!serviceInfo.numberHash) {
		serviceInfo.numberHash = {};
		if (serviceInfo.json && serviceInfo.json.ServiceSortInfo && serviceInfo.json.ServiceSortInfo.ServiceSortArray) {
			var sortArray = serviceInfo.json.ServiceSortInfo.ServiceSortArray;
			for (var i = 0; i < sortArray.length; ++i) {
				var sortObj = sortArray[i];
				if (sortObj && sortObj.ChannelNumber && sortObj.ServiceHandle) {
					serviceInfo.numberHash[sortObj.ServiceHandle] = sortObj.ChannelNumber;
				}
			}
		} 
	}
	
	var channelInfo = null;
	if(channelInfoStr != null){
		channelInfo = new ChannelInfo(channelInfoStr);
	}
	var groupArray = serviceInfo.getGroupArray();
	var ret = [];
	for (var i = 0; i < groupArray.length; ++i) {
		var group = serviceInfo.getGroup(groupArray[i]);
		var name = serviceInfo.getGroupName(groupArray[i]);//alert(name);
		var siObj = {
			name : name,
			groupId:group.GroupId,
			services : []
		}
		ret.push(siObj);
		var groupService = group.GroupServices;//alert(groupService.length);
		for (var j = 0; j < groupService.length; ++j) {
			//alert("get service info handle: "+JSON.stringify(groupService[j].ServiceHandle))
			var service = serviceInfo.getService(groupService[j].ServiceHandle);
			if(!service){
				continue;
			}
			var jsService = createJSServiceByJSON(service, serviceInfo, channelInfo, timeShiftInfo, group.GroupId);//alert('jsService');
			if(type){
				if(jsService.hide != 1){
					siObj.services.push(jsService);
				}
			} else {
				siObj.services.push(jsService);
			}
		}
	};

	// 添加组内排序
	for(var i=0, len=ret.length; i<len; i++){
		var serArr = ret[i]["services"];
		sortByProperty(serArr, "logicalChannelId");
	}
	return ret;
}

function sortByProperty(array, property){  //对象数组按照某个属性大小排序
	function compare(pro){
		return function(a,b){
			return a[pro] - b[pro];
		}
	}
	array.sort(compare(property));
};

//创建service对象。
function createJSServiceByJSON(service, siJSON, ciJSON, timeShiftInfo, groupId) {
	var id = service.ServiceHandle;
	//alert(id);
	var tsObj = siJSON.getTs(service.TsId);
	var networkId = tsObj.NetworkId;
	var originalNetworkId = tsObj.OriginalNetworkId;
	var transportStreamId = tsObj.TsId;
	var serviceId = service.ServiceId;
	var serviceName = service.ServiceName;
	var provider = service.service_provider_name;
	var serviceType =  service.ServiceType;
	var serviceStatus = -1; // to do
	var bouquetIdArray = service.BouquetId; // to do
	var pcrPid = service.PcrPid;
	var referenceServiceId = service.ReferServiceId;
	var regionCode = service.RegionCode;
	var timeshiftServiceIdArray = service.timeshiftServiceIdArray;
	
	var caFlag = -1; // to do
	var videoPid = service.VideoPid;	
	var audioArray = [];
	var audioPidArray = service.AudioArray;
	if (audioPidArray instanceof Array) {
		for(var i = 0, len = audioPidArray.length; i < len; ++i) {
			audioArray.push(audioPidArray[i]);
		}
	} else {
		audioArray.push(audioPidArray);
	}
	var currentAudioPid = audioArray[0].AudioPid;
	
	var playback = service.playback == 1? 1 : 0; // to do
	
	var hide = 0;
	var lock = 0;
	var favorite = 0;
	var offset =  0;
	var volume = 16; 
	if(ciJSON != null){  //从channelInfo配置表中获取一些属性
		hide = ciJSON.getHide(id);
		lock = ciJSON.getLock(id);
		favorite = ciJSON.getFav(id);
		offset =  ciJSON.getOffset(id);	
		volume = ciJSON.getVolume(id);	
	}
	
	var channelId = service.ChannelId ? service.ChannelId : -1; // to do

	var logicalChannelId = siJSON.getChannelNumber(id);
	var deleteFlag = -1;
	
	var ext = siJSON.getExt(service.ServiceHandle);

	if(ext) {
		//offset = ext.VolumeOffset;
	}
	var cfg = {
		serviceHandle: id,
		networkId : networkId,
		originalNetworkId : originalNetworkId,
		transportStreamId : transportStreamId,
		serviceId : serviceId,
		serviceName : serviceName,
		provider : provider,
	    serviceType : serviceType,	
		serviceStatus : serviceStatus,
 		bouquetIdArray : bouquetIdArray,
	 	pcrPid : pcrPid,
		referenceServiceId : referenceServiceId,
		regionCode : regionCode,
		timeshiftServiceIdArray : timeshiftServiceIdArray,
		caFlag : caFlag,
		videoPid : videoPid,
		currentAudioPid : currentAudioPid,
	    audioArray : audioArray,
		hide : hide,
		lock : lock,
		favorite : favorite,
		playback : playback,
		channelId : channelId,
		logicalChannelId : logicalChannelId,
		deleteFlag : deleteFlag,
		volume : volume,
		offset : offset,
		tsInfo: tsObj,
		currentGroupId: groupId
	};
	return new JSService(cfg);
};




function ServiceInfoMonitor(version, networkId) {
	this.version = version;  //版本号
	this.networkId = networkId;  //网络id
	this.deployerFreq = -1;  //部署频点
	this.focus = 1;  //状态
	this.tuneMainFreqFlag = 0;  //锁主频点标志位
	this.tuneDeployFreqFlag = 0;  //锁部署频点标志位
	this.b4Timer = -1;  //b4定时器
	this.b4TimeNum = 0
	this.b6Timer = -1;  //b6定时器
	this.b6TimeNum = 0;
	this.b4NetworkId = null; //
	this.b6NetworkId = null;
	this.getDeployFreqFlag = 0;
	this.downloadMaskId = -1;
	this.cmdVersion = -1;
};

//开始检测配置表更新
ServiceInfoMonitor.prototype.start = function() {
	SumaJS.debug("ServiceInfoMonitor start entered");
	if (!this.focus) {
		return;
	}
	//SumaJS.debug("ServiceInfoMonitor start this.getDeployFreqFlag = "+this.getDeployFreqFlag);
	if (SysSetting.getEnv("isGetFre")) {  //是否拿到了部署频点频率
		var fre = parseInt(DataAccess.getInfo("Autodeployer", "Frequency"), 10);
		SumaJS.debug("ServiceInfoMonitor fre = "+fre);
		this.deployerFreq = fre;
		DVB.tune(fre, 6875, "64QAM");
		this.tuneDeployFreqFlag = 1;
	} else {
		SumaJS.debug("ServiceInfoMonitor fre = "+"339000");
		this.deployerFreq = 339000;
		DVB.tune(339000, 6875, "64QAM");
		this.tuneMainFreqFlag = 1;
	}
};

ServiceInfoMonitor.prototype.setFocusState = function(focus) {
	this.focus = focus;
};

ServiceInfoMonitor.prototype.setSaveUpdate = function(fn) {
	if (!this.focus) {
		return;
	}	
	this.saveUpdate = fn;
};

ServiceInfoMonitor.prototype.setOnUpdate = function(fn) {
	if (!this.focus) {
		return;
	}	
	this.onUpdate = fn;
};

ServiceInfoMonitor.prototype.setTipMsg = function(fn) {
	if (!this.focus) {
		return;
	}	
	this.showTipMsg = fn;
};

ServiceInfoMonitor.prototype.reset = function() {
	if (!this.focus) {
		return;
	}	
	//this.getDeployFreqFlag = 0;
	clearTimeout(this.b4Timer);
	clearTimeout(this.b6Timer);
	this.b4Timer = -1;
	this.b4TimeNum =0;
	this.b6Timer = -1;
	this.b6TimeNum =0;
	this.b4NetworkId = null;
	this.b6NetworkId = null;
	this.deployerFreq = -1;
};

ServiceInfoMonitor.prototype.checkB4Network = function() {
	if (!this.focus) {
		return;
	}
	if(this.b4TimeNum > 10){   //add by liwenlei 用来处理锁频成功但描述符却拿不到的异常情况
		this.b4Timer = -1;
		this.b4TimeNum = 0;
		this.end();
		return;
	}	
	clearTimeout(this.b4Timer);
	if((this.b4NetworkId == null) || (DVB.currentDVBNetwork && DVB.currentDVBNetwork.networkID != this.b4NetworkId)){
		DVB.getNITNetworkDescriptor(DVB.currentDVBNetwork.networkID, 0xB4);
		this.b4NetworkId = DVB.currentDVBNetwork.networkID;	
	}
	var self = this;
	this.b4Timer = setTimeout(function() {
		self.checkB4Network();
		self.b4TimeNum++;
	}, 1000);	
};

ServiceInfoMonitor.prototype.checkB6Network = function() {
	if (!this.focus) {
		return;
	}	
	if(this.b6TimeNum > 10){   //add by liwenlei 
		this.b6Timer = -1;
		this.b6TimeNum = 0;
		this.end();
		return;
	}	
	clearTimeout(this.b6Timer);
	if(DVB.currentDVBNetwork && DVB.currentDVBNetwork.networkID != this.b6NetworkId){
		DVB.getNITNetworkDescriptor(DVB.currentDVBNetwork.networkID, 0xB6);
		this.b6NetworkId = DVB.currentDVBNetwork.networkID;	
	}
	var self = this;
	this.b6Timer = setTimeout(function() {
		self.checkB6Network();
		self.b6TimeNum++;
	}, 1000);
};

ServiceInfoMonitor.prototype.eventHandler = function(event) {
	function _formatChannelNum(num){
		if(num<10){
			return "00"+num;
		}else if(num >=10 && num <100){
			return "0"+num;
		}else{
			return ""+num;
		}
	}
	function channelSort(oldConfig, newConfig){
		var oldSortArray = oldConfig.ServiceSortInfo.ServiceSortArray;
		var newSortArray = newConfig.ServiceSortInfo.ServiceSortArray;
		if(!oldSortArray || !newSortArray) {
			saveJSONFile("/storage/storage0/siConfig/ServiceInfo.json", newConfig, 1);
		}else{
			newSortArray = newSortArray.sort(
				function(a,b){return parseInt(a.ChannelNumber)-parseInt(b.ChannelNumber);}
			);
			var deletChannelHandles = [];
			for(var i=0;i<oldSortArray.length;i++){
				var isFind = false;
				for(var j=0;j<newSortArray.length;j++){
					if(newSortArray[j].ServiceHandle == oldSortArray[i].ServiceHandle){
						isFind = true;
						break;
					}
				}
				if(!isFind){
					deletChannelHandles.push(oldSortArray[i].ServiceHandle);
				}
			}

			var addChannelIndex = [];
			for(var i=0;i<newSortArray.length;i++){
				var isFind = false;
				for(var j=0;j<oldSortArray.length;j++){
					if(newSortArray[i].ServiceHandle == oldSortArray[j].ServiceHandle){
						isFind = true;
						break;
					}
				}
				if(!isFind){
					addChannelIndex.push(i);
				}
			}

			for(var i=0;i<oldSortArray.length;i++){
				for(var j=0;j<deletChannelHandles.length;j++){
					if(oldSortArray[i].ServiceHandle == deletChannelHandles[j]){
						oldSortArray.splice(i,1);
						--i;
					}
				}
			}

			var maxChannelNumInOld =parseInt(oldSortArray[0].ChannelNumber);
			for(var i=1;i<oldSortArray.length;i++){
				if(parseInt(oldSortArray[i].ChannelNumber)>maxChannelNumInOld){
					maxChannelNumInOld = parseInt(oldSortArray[i].ChannelNumber);
				}
			}


			for(var i=0;i<addChannelIndex.length;i++){
				var tmp = newSortArray[addChannelIndex[i]];
				tmp.ChannelNumber = _formatChannelNum(maxChannelNumInOld + i+1);
				oldSortArray.push(tmp);
			}
			newConfig.ServiceSortInfo.ServiceSortArray = oldSortArray;
			saveJSONFile("/storage/storage0/siConfig/ServiceInfo.json", newConfig, 1);
		}
	};
	if (this.focus) {
		var code = event.keyCode||event.which;
		SumaJS.debug("ServiceInfoMonitor handle msg: "+code);
		var modifiers = event.modifiers;
		switch(code) {
		case 10042:  //获取到描述符
			var str = SysSetting.getEventInfo(modifiers);//SysSetting.getEventInfo(modifiers);	//"NetworkID, TagContent"
			var tagStr = str.substr(str.indexOf(",") + 1);
			var tag = tagStr.substring(0, 2);
			SumaJS.debug("descriptor_tag = " + tag);
			if (tag == "b4") {
				clearTimeout(this.b4Timer);
				//if(SumaJS.currModuleName != "home"){siconfigUpdateFlag = false; return false;}	//如果已经不在首页则停止更新
				if (!CA.icNo) {
					siconfigUpdateFlag = false;
					this.end();
					return false;
				}
				var regionCode = CA.regionCode;
				if (this.networkId == -1 && regionCode == -1) {
					siconfigUpdateFlag = false;
					this.end();
					return false;	
				}
				this.cmdVersion = parseInt(tagStr.substring(4,8),16);
				var serviceId = parseInt(tagStr.substring(8,12), 16);
				var componentTag = parseInt(tagStr.substring(12,14), 16);
				var regionInfoStr = tagStr.substr(14);
				var regionCnt = parseInt(regionInfoStr.length / 16);
				var downloadURL = "";
				var version = -1;
				var networkId = -1;
				for (var i = 0; i < regionCnt; i++) {
					var regionStart = parseInt(regionInfoStr.substr(i * 16, 4), 16);
					var regionEnd = parseInt(regionInfoStr.substr(i * 16 + 4, 4), 16);
					version = parseInt(regionInfoStr.substr(i * 16 + 8, 4), 16);
					networkId = parseInt(regionInfoStr.substr(i * 16 + 12, 4), 16);
					if (regionCode == -1) {
						if (this.networkId != -1) {
							if (networkId == this.networkId) {
								downloadURL = "delivery://" + this.deployerFreq + ".6875.64QAM." + serviceId + "." + componentTag + "/ServiceInfo/" + regionStart + "_" + regionEnd + ".json";
								break;	
							}
						}
					} else {
						if (regionCode >= regionStart && regionCode <= regionEnd) {
							downloadURL = "delivery://" + this.deployerFreq + ".6875.64QAM." + serviceId + "." + componentTag + "/ServiceInfo/" + regionStart + "_" + regionEnd + ".json";
							break;
						}
					}
				}
				if (i == regionCnt) {
					siconfigUpdateFlag = false;
					this.end();
					return false;
				}
				
				var serviceInfo = readFile("/storage/storage0/ServiceInfo/ServiceInfo.json",3);
				try{
					var json1= JSON.parse(serviceInfo);
				}catch(e){
					serviceInfo = null;
				}
				SumaJS.debug("lileithis.version = "+this.version+",,,,,,version = "+version);
				if (this.version != version || !serviceInfo) {
					//如果在升级中则暂停配置表更新
					var siconfigUpdateDelayTime = 0;
					if(upgradeFlag){	
						siconfigUpdateDelayTime = 2000;
					}
					var self = this;
					var siconfigUpdateTimer = setInterval(
						function(){
							if(upgradeFlag){
								siconfigUpdateDelayTime = 2000;
								return;
							}
							clearInterval(siconfigUpdateTimer);
							siconfigUpdateFlag = true;
							//if(SumaJS.currModuleName != "home"){siconfigUpdateFlag = false; return false;}	//如果已经不在首页则停止更新					
							needInject = false;
							FileSystem.deleteFile("/storage/storage0/sysInfo/sysInfo.json");
							self.downloadMaskId = FileSystem.downloadRemoteFile(downloadURL,30);
							SumaJS.debug("============================downloadURL: " + downloadURL);
							//this.onUpdate();
							self.showTipMsg({"val":"配置更新中，请勿进行其他操作，<br/>请稍候..."});
						}
						,siconfigUpdateDelayTime
					);
					//暂停自动跳转直播页面
					clearTimeout(playTvTimer);
				}else{
					siconfigUpdateFlag = false;
					configurationVersion.version = this.cmdVersion;
					saveJSONFile("/storage/storage0/ServiceInfo/Version.json", configurationVersion, 1);
					SumaJS.debug("no need to update");
					this.end();					
				}
			} else if(tag == "b6") {
				clearTimeout(this.b6Timer);

				//如果在升级中则暂停配置表更新
				var siconfigUpdateDelayTime = 0;
				if(upgradeFlag){	
					siconfigUpdateDelayTime = 2000;
				}
				var self = this;
				var siconfigUpdateTimer = setInterval(
					function(){
						if(upgradeFlag){
							siconfigUpdateDelayTime = 2000;
							return;
						}
						clearInterval(siconfigUpdateTimer);
						//if(SumaJS.currModuleName != "home"){siconfigUpdateFlag = false; return false;}	//如果已经不在首页则停止更新
						
						siconfigUpdateFlag = true;
						self.deployerFreq = parseInt(tagStr.substring(4,8), 16) * 1000;
						if(DataAccess.getInfo("Autodeployer", "Frequency") != self.deployerFreq)
						{
							DataAccess.setInfo("Autodeployer", "Frequency", "" + self.deployerFreq);
							DataAccess.save("Autodeployer", "Frequency");
						}
						DVB.tune(parseInt(self.deployerFreq, 10),6875,"64QAM"); // to do		
						//this.getDeployFreqFlag = 1;
						self.tuneDeployFreqFlag = 1;
						SysSetting.setEnv("isGetFre","1");	
						/*  modified by liwenlei 移动到锁频成功后
						SysSetting.setEnv("Local_NetworkId", "" + DVB.currentDVBNetwork.networkID);
						saveJSONFile("/storage/storage0/NetworkId.json", {NetworkId:DVB.currentDVBNetwork.networkID}, 3);
						SumaJS.debug("ServiceInfoMonitor get Local_NetworkId = "+SysSetting.getEnv("Local_NetworkId"));
						*/
					}
					,siconfigUpdateDelayTime
				);				
			}
			break;
		case MSG_DVB_TUNE_SUCCESS:  //锁频成功
			SumaJS.debug("ServiceInfoMonitor MSG_DVB_TUNE_SUCCESS");
			if (modifiers == this.deployerFreq) {
				if(this.deployerFreq == 339000) {
					try{
						SysSetting.setEnv("Local_NetworkId", "" + DVB.currentDVBNetwork.networkID);
						saveJSONFile("/storage/storage0/NetworkId.json", {NetworkId:DVB.currentDVBNetwork.networkID}, 3);
						SumaJS.debug("ServiceInfoMonitor get Local_NetworkId = "+SysSetting.getEnv("Local_NetworkId"));
					}catch(e){
						SumaJS.debug("ServiceInfoMonitor get DVB.currentDVBNetwork.networkID wrong ");
					}
					if(this.tuneMainFreqFlag) {  //锁主频点状态
						this.checkB6Network();
						break;
					}else if(this.tuneDeployFreqFlag) {  //锁部署频点状态
						this.tuneDeployFreqFlag = 0;
						this.checkB4Network();
						break;
					}
				}
				if (this.tuneDeployFreqFlag) {
					this.tuneDeployFreqFlag = 0;
					this.checkB4Network();
					break;
				}
			}
			return true;
			break;
		case MSG_DVB_TUNE_FAILED:  //锁频失败
			SumaJS.debug("ServiceInfoMonitor MSG_DVB_TUNE_FAILED");
			if (modifiers == this.deployerFreq) {
				if(this.deployerFreq == 339000) {
					saveJSONFile("/storage/storage0/NetworkId.json", {NetworkId:-1}, 3);
				}
			}
			this.end();
			return true;
			break;			
		case 10151:  //已下载前端文件到内存中
			//this.downloadMaskId = 339000;
			SumaJS.debug("ServiceInfoMonitor download ok to memory");
			if(this.downloadMaskId == modifiers) {
				SumaJS.debug("=====================================download ServiceInfo success");
				var tempfile = FileSystem.getRemoteFile(this.downloadMaskId);  //获取内存中的file对象
				var dirObj = FileSystem.createDirectory('/storage/storage0/siConfig');  //创建文件夹
				if(dirObj == 0) {
					this.showTipMsg({"val":"创建文件夹失败","timeout":1000});
					siconfigUpdateFlag = false;
					break;
				}
				tempfile.close();
				tempfile.saveAs('/storage/storage0/ServiceInfo/ServiceInfo.json');
				
				//存储用户频道排序
				/*var oldConfig = null;
				try{
					oldConfig = JSON.parse(readFile('/storage/storage0/siConfig/ServiceInfo.json',3));
				}catch(e){
				}*/
				var newConfig = null;
				try{
					newConfig = JSON.parse(readFile('/storage/storage0/ServiceInfo/ServiceInfo.json',3));
				}catch(e){
				}

				if(configurationVersion.moveFlag){
					//channelSort(oldConfig, newConfig);
					saveJSONFile("/storage/storage0/siConfig/ServiceInfo.json", newConfig, 1);
				}else{
					tempfile.saveAs('/storage/storage0/siConfig/ServiceInfo.json');
				}
				
				FileSystem.killObject(tempfile);
				FileSystem.deleteFile("/storage/storage0/siConfig/OffChannel.json");  //删除关机频道文件
				SysSetting.setEnv("OFF_CHANNEL","");
				FileSystem.deleteFile("/storage/storage0/siConfig/SearchInfo.json");  //
				FileSystem.deleteFile("/storage/storage0/rojao.config");		//配置表更新时删除原先如家广告配置文件
				this.downloadMaskId = -1;
				this.saveUpdate();
				FileSystem.killObject(dirObj);
				needInject = true;
				if(Middleware.name != "iPanel"){
					//DVB.deleteAll();//配置表更新完成后注入数据	
					
					//modify by liwenlei 设置更新完成变量并保存。
					SysSetting.setEnv("siConfigUpdateFlag","1");  //配置表更新完成标志位					
				}
				this.showTipMsg({"val":"配置表更新完成","timeout":2000});
				SysSetting.setEnv("PAGEFOCUSINDEX","home");
				SysSetting.setEnv("HOMEFOCUSINDEX","");
				checkServiceInfoFile();  //配置表更新完成，重新读取配置表数据”
				this.end();
				if(Middleware.name == "iPanel"){
					window.location.reload();
				}
				return false;
			}else if (portalAd && portalAd.picDownloadMaskId == modifiers) {
				var tempfile = FileSystem.getRemoteFile(portalAd.picDownloadMaskId);
				tempfile.close();
				SumaJS.debug("downloadImgList picFileName =" + portalAd.picFileName);
				portalAd.downloadImgFlag = true;
				tempfile.saveAs('/storage/storage0/portalAd_temp/' + portalAd.picFileName);
				FileSystem.killObject(tempfile);
				portalAd.picDownloadMaskId = -1;
				portalAd.downloadPics();	
			}
			break;
		case 10153: //文件下载失败
			SumaJS.debug("ServiceInfoMonitor download failed");
			if(this.downloadMaskId == modifiers) {
				SumaJS.debug("===============ServiceInfo.json======================下载失败");
				this.downloadMaskId = -1;
				this.showTipMsg({"val":"文件下载失败","timeout":1500});
				siconfigUpdateFlag = false;
				//return false;
			} else if (portalAd && portalAd.picDownloadMaskId == modifiers) {
				SumaJS.debug("downloadImgList failed: "+portalAd.picFileName);
				portalAd.downloadPos = portalAd.downloadImgList.length;
				portalAd.downloadImgFlag = false;
				portalAd.picDownloadMaskId = -1;
				portalAd.downloadPics();	
			}
			this.end();
			break;
		case 10154:  //超时时间到，文件下载未完成
			SumaJS.debug("ServiceInfoMonitor download timeout");
			if(this.downloadMaskId == modifiers) {
				SumaJS.debug("===============ServiceInfo.json======================下载超时");
				this.downloadMaskId = -1;
				this.showTipMsg({"val":"文件下载超时","timeout":1500});
				siconfigUpdateFlag = false;
				//return false;
			} else if (portalAd && portalAd.picDownloadMaskId == modifiers) {
				SumaJS.debug("downloadImgList timeout: "+portalAd.picFileName);
				portalAd.downloadPos = portalAd.downloadImgList.length;
				portalAd.downloadImgFlag = false;
				portalAd.picDownloadMaskId = -1;
				portalAd.downloadPics();	
			}
			this.end();
			break;
	/*	case 10101:
			SumaJS.debug("清除数据成功，确认开始配置表注入");
			var newOriginalArray = JSON.parse(readFile("/storage/storage0/siConfig/ServiceInfo.json", 3));
			if(!newOriginalArray){
				SumaJS.debug("配置表为空，配置表注入失败");	
				if(!SysSetting.getEnv("HOMEFOCUSINDEX")){
					window.location.reload();
				}  
			}else{
				var tempflag = inJectServiceInfo(newOriginalArray);
				if(!SysSetting.getEnv("HOMEFOCUSINDEX") && !tempflag){
					window.location.reload();
				}		 	
			}
			break;
		case 10102:
			SumaJS.debug("清除数据失败，配置表注入失败");
			if(!SysSetting.getEnv("HOMEFOCUSINDEX")){
				window.location.reload();
			}   
			break;	
		case 10109:
			SumaJS.debug("数据保存成功");
			user.channels.save();	
			if(!SysSetting.getEnv("HOMEFOCUSINDEX")){
				window.location.reload();
			}		
		*/
		default:
			return true;
			break;
		}
		return false;
	} else {
		return true;
	}
};


ServiceInfoMonitor.prototype.end = function() {  //更新结束
	SumaJS.debug("ServiceInfoMonitor end ");
	SumaJS.eventManager.removeEventListener("siMonitor");
	menuDataAccessObj.aquireByPortal();  //从内存中获取保存的数据并初始化
};




//配置表注入
function inJectServiceInfo(originalArray) {
	SumaJS.debug("inJectServiceInfo entered 0");
	if(null == originalArray || needInject == false) {return false;}
	SumaJS.debug("inJectServiceInfo entered 1");
	try {
		var ret = null;
		var saveFlag = false;
		var successAddNetworkId = 0;
		if(originalArray.ServiceInfo.NetworkArray instanceof Array) {
			SumaJS.debug("inJectServiceInfo entered 2");
			for(var i = 0; i < originalArray.ServiceInfo.NetworkArray.length; ++i) {
				//SumaJS.debug("[addDVBNetwork] NetworkId = "+originalArray.ServiceInfo.NetworkArray[i].NetworkId+", NetworkName = "+originalArray.ServiceInfo.NetworkArray[i].NetworkName);
				ret = DVB.addDVBNetwork(successAddNetworkId || originalArray.ServiceInfo.NetworkArray[i].NetworkId, originalArray.ServiceInfo.NetworkArray[i].NetworkName);
				SumaJS.debug("save service info ret [addDVBNetwork] = " +ret);
				if(ret == 1 && !successAddNetworkId){
					successAddNetworkId = originalArray.ServiceInfo.NetworkArray[i].NetworkId;
				}
			}
		} else {
			SumaJS.debug("inJectServiceInfo entered 3");
			//SumaJS.debug("[addDVBNetwork] NetworkId = "+originalArray.ServiceInfo.NetworkArray.NetworkId+", NetworkName = "+originalArray.ServiceInfo.NetworkArray.NetworkName);
			ret = DVB.addDVBNetwork(originalArray.ServiceInfo.NetworkArray.NetworkId, originalArray.ServiceInfo.NetworkArray.NetworkName);
			SumaJS.debug("save service info ret [addDVBNetwork] = " +ret);
			if(ret == 1){
				successAddNetworkId = originalArray.ServiceInfo.NetworkArray.NetworkId;
			}					
		}
		
		if(!successAddNetworkId){
			SumaJS.debug("配置表数据注入异常");	
			return false;					
		}
						
		//注入tsinfo信息
		for(var i = 0; i < originalArray.ServiceInfo.TsInfoArray.length; ++i){
			var str = '"NetworkInfor" : [{"NetworkID": ' + successAddNetworkId + ',"Frequency":' + originalArray.ServiceInfo.TsInfoArray[i].Frequency + ',"SymbolRate":' + originalArray.ServiceInfo.TsInfoArray[i].SymbolRate + ',"Modulation":"' + originalArray.ServiceInfo.TsInfoArray[i].Modulation + '"}]';
			ret = DVB.addTS(originalArray.ServiceInfo.TsInfoArray[i].OriginalNetworkId, originalArray.ServiceInfo.TsInfoArray[i].TsId, str);
			SumaJS.debug("save service info ret [addTS] = " +ret);
		}	
		DVB.save();	
		return true;
	} catch(e) {
		SumaJS.debug("配置表数据注入异常");	
		return false;
	}
}


//add by liwenlei 从JSON文件获取锁定主频点时的DVB.currentDVBNetwork.networkID
function getMainFreNetworkIDFromJson(){
	var str = readFile("/storage/storage0/NetworkId.json", 3);
	if(str){
		try{
			var obj = JSON.parse(str);
			return obj.NetworkId;
		}catch(e){
			return -1;
		}
	}else{
		return -1;
	}
}