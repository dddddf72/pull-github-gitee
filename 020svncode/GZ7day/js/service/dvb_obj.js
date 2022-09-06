function JSService(cfg) {
	this.serviceHandle = typeof cfg.serviceHandle != "undefined" ? cfg.serviceHandle : -1;
	this.networkId = typeof cfg.networkId != "undefined" ? cfg.networkId : -1;
	this.originalNetworkId = typeof cfg.originalNetworkId != "undefined" ? cfg.originalNetworkId : -1;
	this.transportStreamId = typeof cfg.transportStreamId != "undefined" ? cfg.transportStreamId : -1;
	this.serviceId = typeof cfg.serviceId != "undefined" ? cfg.serviceId : -1;
	this.serviceName = typeof cfg.serviceName != "undefined" ? cfg.serviceName : "";
	this.provider = typeof cfg.provider != "undefined" ? cfg.provider : "";
	this.serviceType =  typeof cfg.serviceType != "undefined" ? cfg.serviceType : -1;
	this.serviceStatus = typeof cfg.serviceStatus != "undefined" ? cfg.serviceStatus : -1;
	this.bouquetIdArray = typeof cfg.bouquetIdArray != "undefined" ? cfg.bouquetIdArray : [];
	this.pcrPid = typeof cfg.pcrPid != "undefined" ? cfg.pcrPid : [];
	this.referenceServiceId = typeof cfg.referenceServiceId != "undefined" ? cfg.referenceServiceId : -1;
	this.timeshiftServiceIdArray = typeof cfg.timeshiftServiceIdArray != "undefined" ? cfg.timeshiftServiceIdArray : [];
	this.caFlag = typeof cfg.caFlag != "undefined" ? cfg.caFlag : 1;
	this.videoPid = typeof cfg.videoPid != "undefined" ? cfg.videoPid : 0;
	this.currentAudioPid = typeof cfg.currentAudioPid != "undefined" ? cfg.currentAudioPid : -1;
	this.audioArray = typeof cfg.audioArray != "undefined" ? cfg.audioArray : [];
	
	this.hide = typeof cfg.hide != "undefined" ? cfg.hide : 0;
	this.lock = typeof cfg.lock != "undefined" ? cfg.lock : 0;
	this.favorite = typeof cfg.favorite != "undefined" ? cfg.favorite : 0;
	this.deleteFlag = typeof cfg.deleteFlag != "undefined" ? cfg.deleteFlag : 0; 
	this.playback = typeof cfg.playback != "undefined" ? cfg.playback : 0;
	this.channelId = typeof cfg.channelId != "undefined" ? cfg.channelId : 0;
	this.vodChannelId = typeof cfg.vodChannelId != "undefined" ? cfg.vodChannelId : 0;
	this.logicalChannelId = typeof cfg.logicalChannelId != "undefined" ? cfg.logicalChannelId : 0;
	this.volume = typeof cfg.volume != "undefined" ? cfg.volume : 0;
	
	this.offset = typeof cfg.offset != "undefined" ? cfg.offset : 0;
	this.index = typeof cfg.index != "undefined" ? cfg.index : 0;
	this.tsInfo = typeof cfg.tsInfo != "undefined" ? cfg.tsInfo : -1;
	this.currentGroupId = typeof cfg.currentGroupId != "undefined" ? cfg.currentGroupId : -1;
	//alert("ts info = "+JSON.stringify(this.tsInfo));
	//var strSource = "delivery://" + fre +"."+ sym +"."+ mod +"."+ playTvObj.playService.ServiceId +"."+ videoPid +"."+ audioPid;
};

JSService.prototype.getPlaySrc = function() {
	return getPlaySource.call(this);
};

JSService.prototype.getServiceName = function() {
	return getServiceName.call(this);
};

JSService.prototype.save = function() {
	return saveChannel.call(this);
};

JSService.prototype.getTs = function() {
	var ts = getTsByService(this);
	return createJSTs(ts);
};

JSService.prototype.getPresentEvent = function() {
	return getPresentEvent.call(this);
};

JSService.prototype.getFollowingEvent = function() {
	return getFollowingEvent.call(this);
};

function JSTs(cfg) {
	this.networkId = typeof cfg.networkId != "undefined" ? cfg.networkId : -1;
	this.originalNetworkId = typeof cfg.originalNetworkId != "undefined" ? cfg.originalNetworkId : -1;
	this.transportStreamId = typeof cfg.transportStreamId != "undefined" ? cfg.transportStreamId : -1;
	this.signalQuality = typeof cfg.signalQuality != "undefined" ? cfg.signalQuality : -1;
	this.signalStrength = typeof cfg.signalStrength != "undefined" ? cfg.signalStrength : -1;
	this.errorRate  = typeof cfg.errorRate != "undefined" ? cfg.errorRate : -1;
	this.signalLevel  = typeof cfg.signalLevel != "undefined" ? cfg.signalLevel : -1;
	this.signalNoiseRatio  = typeof cfg.signalNoiseRatio != "undefined" ? cfg.signalNoiseRatio : -1;
	this.deliveryType = typeof cfg.deliveryType != "undefined" ? cfg.deliveryType :  1; // 1 -- dvb - c
	this.tuneParam = typeof cfg.tuneParam != "undefined" ? cfg.tuneParam : null;
};

JSTs.prototype.tune = function() {
	tune(this.deliveryType, this.tuneParam);
};

JSTs.prototype.getNetwork = function() {
	var network = getNetworkByTs(this);
	return createJSNetwork(network);
};

JSTs.prototype.getAllSimpleServices = function() {
	return getAllSimpleServices.call(this);	
};

function JSNetwork(cfg) {
	this.networkId = typeof cfg.networkId != "undefined" ? cfg.networkId : -1;
	this.networkName = typeof cfg.networkName != "undefined" ? cfg.networkName : "";
	this.networkType = typeof cfg.networkType != "undefined" ? cfg.networkType : 1;
};

function JSEvent(cfg) {
	this.networkId = typeof cfg.networkId != "undefined" ? cfg.networkId : -1;
	this.originalNetworkId = typeof cfg.originalNetworkId != "undefined" ? cfg.originalNetworkId : -1;
	this.transportStreamId = typeof cfg.transportStreamId != "undefined" ? cfg.transportStreamId : -1;
	this.serviceId = typeof cfg.serviceId != "undefined" ? cfg.serviceId : -1;
	this.eventId = typeof cfg.eventId != "undefined" ? cfg.eventId : -1;
	this.eventName = typeof cfg.eventName != "undefined" ? cfg.eventName : "";
	this.eventDescription = typeof cfg.eventDescription != "undefined" ? cfg.eventDescription : "";
	this.state = typeof cfg.state != "undefined" ? cfg.state : -1;
	this.startDate = typeof cfg.startDate != "undefined" ? cfg.startDate : "";
	this.endDate = typeof cfg.endDate != "undefined" ? cfg.endDate : "";
	this.startTime = typeof cfg.startTime != "undefined" ? cfg.startTime : "";
	this.endTime = typeof cfg.endTime != "undefined" ? cfg.endTime : "";
	this.duration = typeof cfg.duration != "undefined" ? cfg.duration : -1;
	this.minAge = typeof cfg.minAge != "undefined" ? cfg.minAge : -1;
	this.caFlag = typeof cfg.caFlag != "undefined" ? cfg.caFlag : -1;
	this.eventInfo = typeof cfg.programEvent != "undefined" ? cfg.programEvent : {};
	this.type = 0;
};

JSEvent.prototype.getService = function() {
	return getServiceByEvent.call(this);
};

JSEvent.prototype.getOrder = function() {
	return getOrderByEvent.call(this);
};

function JSOrder(cfg) {
	this.orderId = typeof cfg.orderId != "undefined" ? cfg.orderId : -1;
	this.deleteFlag = typeof cfg.deleteFlag != "undefined" ? cfg.deleteFlag : -1;
	this.service = typeof cfg.service != "undefined" ? cfg.service : null;
	this.eventInfo = typeof cfg.eventInfo != "undefined" ? cfg.eventInfo : null;
	this.saveTimer = -1;
};

JSOrder.prototype.markDelFlag = function(flag) {
	this.deleteFlag = flag;
	return markDelFlag.call(this, flag);
};

JSOrderManager = (function(){
	return {
		getJSOrderById : function(id) {
			var order = getOrderById.call(this, id);
			return createJSOrder.call(this, order);
		},
		deleteJSOrder : function(order) {
			return deleteOrder.call(this, order);
		},
		deleteAllMarkedOrder : function() {
			return deleteAllMarkedOrder.call(this);
		},
		getJSOrders : function(param) {
			return getOrderArray.call(this, param);
		},
		save : function() {
			return saveOrderInfo.call(this);
		},
		getConflictJSOrders : function() {
			return getConflictOrders.call(this);
		},
		addOrder : function(jsEvent) {
			return addOrder.call(this, jsEvent);
		},
		getAdvanceRemind : function() {
			return getaAdvanceRemind.call(this);
		},
		getPlayingList : function() {
			return getPlayingList.call(this);
		}
	};
})();

JSEnvManager = (function(){
	return {
		setEnv : function(key, value) {
			return setEnvironment.call(this, key, value);
		},
		getEnv : function(key) {
			return getEnvironment.call(this, key);
		},
		clearEnv : function() {
			return clearEnvironment.call(this);
		}
	}
})();

JSDataAccess = (function() {
	return {
		cache : {},
		save : function(param) {
			return saveDataAccess.call(this,param);
		},
		getInfo : function (param){
			return dataAccessGet.call(this, param);
		},
		setInfo : function (param){
			return dataAccessSet.call(this, param);
		},
		getMute : function() {
			return getMute.call(this);
		},
		setMute : function(mute) {
			return setMute.call(this, mute);
		},
		getGlobalVolume : function() {
			return getGlobalVolume.call(this);
		},
		setGlobalVolume : function(volume) {
			return setGlobalVolume.call(this, volume);
		},
		getUserTableId : function(name) {
			return getUserTableId.call(this, name);
		},
		createUserTable : function(name) {
			return createUserTable.call(this, name);
		},
		getVolume : function() {
			return getSystemVolume.call(this);
		},
		setVolume : function(volume) {
			return setSystemVolume.call(this, volume);
		},
		getGlobalVolumeFlag : function() {
			return getGlobalVolumeFlag.call(this);
		},
		setGlobalVolumeFlag : function(flag) {
			return setGlobalVolumeFlag.call(this, flag);
		},
		getPasswordFlag : function() {
			return getPasswordFlag.call(this);
		},
		setPasswordFlag : function(flag) {
			return setPasswordFlag.call(this, flag);
		},
		getPassword : function() {
			return getUserPassword.call(this);
		},
		setPassword : function(pass) {
			return setUserPassword.call(this, pass);
		},
		restoreDefault : function() {
			return restoreSysDefault.call(this);
		},
		getSPDIFMode : function() {
			return getSPDIFMode.call(this);
		},
		setSPDIFMode : function(mode) {
			return setSPDIFMode.call(this, mode);
		},
		getVideoMode : function() {
			return getVideoMode.call(this);
		},
		setVideoMode : function(mode) {
			return setVideoMode.call(this, mode);
		},
		getOSDAlpha : function() {
			return getOSDAlpha.call(this);
		},
		setOSDAlpha : function(alpha) {
			return setOSDAlpha.call(this, alpha);
		},
		getBrightness : function() {
			return getBrightness.call(this);
		},
		setBrightness : function(brightness) {
			return setBrightness.call(this, brightness);
		},
		getSaturation : function() {
			return getSaturation.call(this);
		},
		setSaturation : function(saturation) {
			return setSaturation.call(this, saturation);
		},
		getContrast : function() {
			return getContrast.call(this);
		},
		setContrast : function(contrast) {
			return setContrast.call(this, contrast);
		},
		getTransparency : function() {
			return getTransparency.call(this);
		},
		setTransparency : function(transparency) {
			return setTransparency.call(this, transparency);
		},
		getAspectRatio : function() {
			return getAspectRatio.call(this);
		},
		setAspectRatio : function(aspectRatio) {
			return setAspectRatio.call(this, aspectRatio);
		},
		getSoundMode : function() {
			return getSoundMode.call(this);
		},
		setSoundMode : function(mode) {
			return setSoundMode.call(this, mode);
		},
		getPFDisplayTime : function() {
			return getPFDisplayTime.call(this);
		},
		setPFDisplayTime : function(time) {
			return setPFDisplayTime.call(this, time);
		},
		getMenuDisplayTime : function() {
			return getMenuDisplayTime.call(this);
		},
		setMenuDisplayTime : function(time) {
			return setMenuDisplayTime.call(this, time);
		},
		getStandbyFlag : function() {
			return getStandbyFlag.call(this);
		},
		setStandbyFlag : function(flag) {
			return setStandbyFlag.call(this, flag);
		},
		getSleepTime : function() {
			return getSleepTime.call(this);
		},
		setSleepTime : function(time) {
			return setSleepTime.call(this, time);
		},
		getLanguage : function() {
			return getLanguage.call(this);
		},
		setLanguage : function(lang) {
			return setLanguage.call(this, lang);
		},
		getReminderTime : function() {
			return getReminderTime.call(this);
		},
		setReminderTime : function(time) {
			return setReminderTime.call(this, time);
		},
		getMainFrequencyInfo : function() {
			return getMainFrequencyInfo.call(this);
		},
		setMainFrequencyInfo : function(info) {
			return setMainFrequencyInfo.call(this, info);
		},
		getMainFrequency : function(index) {
			return getMainFrequency.call(this, index);
		},
		setMainFrequency : function(freq, index) {
			return setMainFrequency.call(this, freq, index); 
		},
		getSymbolRate : function(index) {
			return getSymbolRate.call(this, index);
		},
		setSymbolRate : function(sym, index) {
			return setSymbolRate.call(this, sym, index);
		},
		getModulation : function(index) {
			return getModulation.call(this, index);
		},
		setModulation : function(mod, index) {
			return setModulation.call(this, mod, index);
		},
		clearCache : function() {
			this.cache = {};
		}
	}
})();