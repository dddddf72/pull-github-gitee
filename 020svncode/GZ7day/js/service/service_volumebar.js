/**
 * @constructor Volumebar
 */
function VolumeBar(cfg) {
	this.focus = 1;
	
	this.middlewareMinVolume = typeof cfg.middlewareMinVolume != "undefined" ? cfg.middlewareMinVolume : 0;
	this.middlewareMaxVolume = typeof cfg.middlewareMaxVolume != "undefined" ? cfg.middlewareMaxVolume : 100;
	/**
	 * @description 音量的最小值,默认为0
	 * @type {Number}
	 */
	this.minVolume = typeof cfg.minVolume != "undefined" ? cfg.minVolume : 0;

	/**
	 * @description 音量的最大值,默认为100
	 * @type {Number}
	 */
	this.maxVolume = typeof cfg.maxVolume != "undefined" ? cfg.maxVolume : 100;
	
	this.globalFlag = parseInt(JSDataAccess.getGlobalVolumeFlag());
	if (this.globalFlag) {
		this.volume = JSDataAccess.getVolume();
	} else {
		this.volume = JSDataAccess.getVolume();
	}
	/**
	 * @description 媒体播放器对象
	 * @type {Object}
	 */
	this.player = cfg.player;
	/**
	 * @description 是否静音
	 * @type {Number} 1为静音，0为未静音
	 */
	this.mute = getMuteState.call(this);

	/**
	 * @description 显示时间
	 * @type {Number}
	 */
	this.timeout = typeof cfg.timeout != "undefined" ? cfg.timeout : 5000;

	/**
	 * @description 是否可见，1为可见，0为隐藏
	 * @type {Number}
	 */

	this.showFlag = 0;

	/**
	 * @description 计时器id
	 * @type {Number}
	 */
	this.timer = -1;

	/**
	 * @description 控件所对应的ui对象
	 * @type {Object}
	 */
	this.uiObj = cfg.uiObj;

	/**
	 * @description ui变化时被调用的方法
	 * @type {Function}
	 */
	this.onUIAdapter = cfg.onUIAdapter;

	if (this.mute == 1) {
		var dataObj = {
			"mute" : 1
		};
		this.onUIAdapter(dataObj, this.uiObj);
	}

	/**
	* @description 控件接收消息时被调用的方法
	* @type {Function}
	*/

	this.eventHandler = typeof cfg.onEventHandler != "undefined" ? cfg.onEventHandler : function(event) {
		return true;
	};

	this.dataCollectInfo = null;
}

/**
 * @description 检查音量值的有效性，返回有效区间的音量值
 * @param {Number}value 待检测的音量值
 * @return {Number} 有效音量值
 */
VolumeBar.prototype.validCheck = function(value) {
	if (value < this.middlewareMinVolume) {
		return this.middlewareMinVolume;
	} else if (value > this.middlewareMaxVolume) {
		return this.middlewareMaxVolume;
	} else {
		return value;
	}
};

VolumeBar.prototype.valueValidCheck = function(value) {
	if (value < this.minVolume) {
		return this.minVolume;
	} else if (value > this.maxVolume) {
		return this.maxVolume;
	} else {
		return value;
	}
};

/**
 * @description 初始化频道音量
 * @param {Object}channel 音量对应的频道
 */
VolumeBar.prototype.initChannelVolume = function(service) {
	if (this.globalFlag || typeof service == "undefined") {
		var volume = 0;
		if(typeof service == "undefined"){
			volume = this.volume;
		}else{
			volume = this.volume  + service.offset;
		}
		volume = this.valueValidCheck(volume);
		if (this.volume == 0) {
			this.outputVolume(0);
		} else {
			this.outputVolume(volume);
		}
	} else {
		var volume = service.volume;
		this.outputVolume(volume);
	}
};

/**
 * @description 静音操作，当播放器处于非静音状态时静音，处于静音状态时解除静音
 */
VolumeBar.prototype.muteFunc = function() {
	if (this.mute == 0) {
		this.mute = 1;
		setMuteState.call(this, 1);
		var dataObj = {
			"mute" : 1
		};
		this.onUIAdapter(dataObj, this.uiObj);
	} else {
		this.mute = 0;
		setMuteState.call(this, 0);
		var dataObj = {
			"mute" : 0
		};
		this.onUIAdapter(dataObj, this.uiObj);
	}
};

/**
 * @description 增加音量，并通知ui做出相应变化
 * @param {Object}channel 音量对应的频道
 */
VolumeBar.prototype.volumeUp = function(service, dataCollectInfo) {
	if (this.mute) {
		setMuteState.call(this, 0);
		this.mute = 0;
	}
	this.dataCollectInfo = dataCollectInfo;
	if (this.globalFlag || !service) {
		if (this.volume < this.maxVolume && this.volume >= this.minVolume) {
			++this.volume;
			JSDataAccess.setVolume(this.volume);
			var volume = 0;
			if(!service){
				volume = this.volume;
			}else{
				volume = this.volume  + service.offset;
			}
			volume = this.valueValidCheck(volume);			
			if (this.volume == 0) {
				this.outputVolume(0);
			} else {
				this.outputVolume(volume);
			}
		}
	} else {
		var temp = service.volume;
		if (temp < this.maxVolume && temp >= this.minVolume) {
			++temp;
			service.volume = temp;
			this.outputVolume(temp);
			this.save(service);
		}
	}
	
	this.show(service);
};

/**
 * @description 增加音量，并通知ui做出相应变化
 * @param {Object}channel 音量对应的频道
 */
VolumeBar.prototype.volumeDown = function(service, dataCollectInfo) {
	if (this.mute) {
		setMuteState.call(this, 0);
		this.mute = 0;
	}
	this.dataCollectInfo = dataCollectInfo;
	if (this.globalFlag || !service) {
		if (this.volume <= this.maxVolume && this.volume > this.minVolume) {
			--this.volume;
			JSDataAccess.setVolume(this.volume);
			var volume = 0;
			if(!service){
				volume = this.volume;
			}else{
				volume = this.volume  + service.offset;
			}
			volume = this.valueValidCheck(volume);
			if (this.volume == 0) {
				this.outputVolume(0);
			} else {
				this.outputVolume(volume);
			}
		}
	} else {
		var temp = service.volume;
		if (temp <= this.maxVolume && temp > this.minVolume) {
			--temp;
			service.volume = temp;		
			this.outputVolume(temp);
			this.save(service);
		}
	}
	
	this.show(service);
};

/**
 * @description 保存频道音量
 */
VolumeBar.prototype.save = function(service) {
	if(!service || typeof service == "undefined"){
		return;
	}
	var	channelInfo = JSON.parse(readFile("/storage/storage0/siConfig/ChannelInfo.json", 3));

	//add by lliwenlei 判断是否存在该文件,避免不存在时报错
	if(channelInfo && typeof channelInfo[service.serviceHandle] != "undefined" && typeof channelInfo[service.serviceHandle].volume != "undefined"){
		channelInfo[service.serviceHandle].volume = service.volume;
		saveJSONFile("/storage/storage0/siConfig/ChannelInfo.json", channelInfo, 1);
	}
	//channelInfo[service.serviceHandle].volume = service.volume;
	//saveJSONFile("/storage/storage0/siConfig/ChannelInfo.json", channelInfo, 1);	
}


/**
 * @description 显示当前音量
 */
VolumeBar.prototype.show = function(service) {
	this.focus = 1;
	var showValue = 0;
	if (this.globalFlag || typeof service == "undefined") {
		showValue = this.volume;
	} else {
		showValue = service.volume;
	}

	this.showFlag = 1;
	var dataObj = {
		"showFlag" : 1,
		"value" : showValue,
		"mute" : this.mute
	};
	this.onUIAdapter(dataObj, this.uiObj);

	if (this.timeout != -1) {
		clearTimeout(this.timer);
		var self = this;
		this.timer = setTimeout(function() {
			self.hide();
		}, this.timeout);
	}
};

/**
 * @description 隐藏音量条
 */
VolumeBar.prototype.hide = function() {
	this.focus = 0;
	if (this.showFlag) {
		var dataObj = {
			"showFlag" : 0
		};
		this.showFlag = 0;
		clearTimeout(this.timer);
		this.onUIAdapter(dataObj, this.uiObj);
		if(this.dataCollectInfo){
			try{
				var currentService = this.dataCollectInfo.curService;
				var changeTvMode = this.dataCollectInfo.mode;
				var playTvStatus = this.dataCollectInfo.status;
				var code = this.dataCollectInfo.code;
				SumaJS.debug("VolumeBar hide code="+code);
				var showValue = 0;
				if (this.globalFlag) {
					showValue = this.volume;
				} else {
					showValue = currentService.volume;
				}
				DataCollection.collectData(["17",currentService.channelId+"",currentService.serviceId+"",currentService.networkId+"",currentService.tsInfo.TsId+"",showValue,code]);
			}catch(e){
			}
		}

	}
};

/**
 * @description 获取控件当前状态，1为可见，0为隐藏
 * @return {Number} 1为可见，0为隐藏
 */
VolumeBar.prototype.getState = function() {
	return this.showFlag;
};

/**
 * @description 设置播放器音量
 * @param {Number}volume 音量值
 */
VolumeBar.prototype.outputVolume = function(volume) {
	outputVolume.call(this, this.validCheck(volume));
};

/**
 * @description 获取是否开启全局音量控制的状态
 * @return {Number} 1为全局音量控制状态，0为频道单独控制状态
 */
VolumeBar.prototype.getGlobalFlag = function() {
	return this.globalFlag;
};

/**
 * @description 设置是否开启全局音量控制状态
 * @param {Number}flag 1为全局音量控制状态，0为频道单独控制状态
 */
VolumeBar.prototype.setGlobalFlag = function(flag) {
	if (this.globalFlag != flag) {
		this.globalFlag = flag;
		JSDataAccess.setGlobalVolumeFlag(flag);
	}
};

VolumeBar.prototype.setFocusState = function(state) {
	if (state) {
		this.show();
	} else {
		this.hide();
	}
};
