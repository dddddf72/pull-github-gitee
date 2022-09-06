var KEY_UP = 87;
var KEY_DOWN = 83;
var KEY_LEFT = 65;
var KEY_RIGHT = 68;
var KEY_ENTER = 13;
var KEY_BACK = 8;
var KEY_HOME = 72;
var KEY_EXIT = 27;
var KEY_PAGE_UP = 306;
var KEY_PAGE_DOWN = 307;
var KEY_NUM0 = 48;
var KEY_NUM1 = 49;
var KEY_NUM2 = 50;
var KEY_NUM3 = 51;
var KEY_NUM4 = 52;
var KEY_NUM5 = 53;
var KEY_NUM6 = 54;
var KEY_NUM7 = 55;
var KEY_NUM8 = 56;
var KEY_NUM9 = 57;
var KEY_CHANNEL_DOWN = 91;   /*0x01AC,  遥控器上的频道减少键*/
var KEY_CHANNEL_UP = 93;   /*0x01AB,  遥控器上的频道增加键*/
var KEY_INFO = 73;  /*0x01C9,  遥控器上的信息键*/
var KEY_MENU = 72;  /*0x01D4,  遥控器上的菜单键*/
var KEY_EPG  = 69;  /*0x01CA,  遥控器上的节目指南键,预告键,即GUIDE*/
var KEY_FAV = 76;	/*喜爱按键*/
var KEY_MAIL = 77;	/*  邮件按键 */
var KEY_TV = 80; /*电视按键*/
var KEY_TRACK = 86; /*0x0197,  遥控器上的声道键,即AUDIO*/
var KEY_ASTERISK = 318; /*0x0197,  遥控器上的星号键*/
var KEY_POUND = 319;	/*遥控器#键*/
var MSG_REMIND_EVENT_ORDERED_ABOUT_TO_PLAY = 10801;// 用户预定的节目将要开始 
var MSG_REMIND_EVENT_ORDERED_START_PLAYING = 10802;// 用户预定的节目开始

var MSG_EPG_SEARCH_SUCCESS = 10201; //成功完成EPG搜索
var MSG_EPG_SEARCH_EXCEED_MAX_COUNT = 10202; //搜索结果达到255个，搜索自动停止
var MSG_EPG_SEARCH_TIMEOUT = 10203; //搜索EPG超时

var SYSEVT_DVB_EIT_EVENT_DESCRIPTOR_READY  = 10208;    // 已获取到EIT表的某个Event_Descriptor的值

var SYSEVT_SEARCH_FINISH = 10001; //搜索完成
var SYSEVT_SEARCH_FAILED = 10002; //搜索失败
var SYSEVT_SEARCH_DELIVERY_START = 10003; //频点搜索成功
var SYSEVT_SEARCH_SERVICE_READY = 10004; //当前频点service搜索完成
var SYSEVT_SEARCH_STOP = 10005; //搜索停止
var SYSEVT_NVOD_REFEVENT_READY = 10221;    // 接收NVOD参考事件成功,如果当前NVOD参考业务PF信息更新,则会再次发送此消息.
var SYSEVT_NVOD_REFEVENT_TIMEOUT = 10222;    // NVOD参考事件接收超时
var SYSEVT_NVOD_TISHIEVENT_READY = 10223;    // 接收NVOD时移事件成功.
var SYSEVT_NVOD_TISHIEVENT_TIMEOUT = 10224;    // NVOD时移事件接收超时
//锁频
var MSG_DVB_TUNE_SUCCESS = 10031;//锁频成功
var MSG_DVB_TUNE_FAILED = 10032;//锁频失败
var SYSEVT_DVB_NIT_NETWORK_DESCRIPTOR_READY = 10042;		//获取到NIT表的某个Network_Descriptor值
//数据备份
var SYSEVT_DATA_DEL_ALL_SUCCESS = 10101;//成功清除A、B、D区中PSI/SI数据
var SYSEVT_DATA_DEL_ALL_FAILED = 10102; //无法清除A、B、D区中PSI/SI数据
var SYSEVT_DATA_DEL_TMP_SUCCESS = 10103; //成功清除D区PSI/SI数据
var SYSEVT_DATA_DEL_TMP_FAILED = 10104; //无法清除D区PSI/SI数据
var SYSEVT_DATA_UPDATE_SUCCESS = 10105; //成功用D区更新A区数据
var SYSEVT_DATA_UPDATE_FAILED = 10106; //无法用D区更新A区数据
var SYSEVT_DATA_REVERT_SUCCESS = 10107; //成功用B区更换A区数据
var SYSEVT_DATA_REVERT_FAILED = 10108; //无法用B区更换A区数据
var SYSEVT_DATA_SAVE_SUCCESS = 10109; //成功将A区数据写入B区
var SYSEVT_DATA_SAVE_FAILED = 10110; //无法将A区数据写入B区
var SYSEVT_DATA_BACKUP_SUCCESS = 10111; //成功将B区数据备份到C区
var SYSEVT_DATA_BACKUP_FAILED = 10112; //无法将B区数据备份到C区
var SYSEVT_DATA_RESTORE_SUCCESS = 10113; //成功恢复A、B区数据
var SYSEVT_DATA_RESTORE_FAILED = 10114; //无法恢复A、B区数据
var SYSEVT_DOWNLOAD_FILE_SUCCESS = 10151;					//已下载前端文件到内存中
var SYSEVT_DOWNLOAD_FILE_NOTFOUND = 10152;					//前端不存在要下载的文件
var SYSEVT_DOWNLOAD_FILE_FAILED = 10153;					//文件下载失败
var SYSEVT_DOWNLOAD_FILE_TIMEOUT = 10154;					//超时时间到，文件下载未完成

var SYSEVT_NETWORK_CONNECTED = 10501;  //网络连接
var SYSEVT_NETWORK_DISCONNECTED = 10502;    // 网线已断开

var SYSEVT_OTA_FORCE_UPGRADE = 10701;    // OTA强制升级信息
var SYSEVT_OTA_MANUAL_UPGRADE = 10702;    // OTA手动升级信息
var SYSEVT_OTA_ANALY_UPGRADE_DATA = 10703;    // OTA 获取并分析升级数据
var IP_OTA_FORCE_UPGRADE = 10704;//IP OTA 强制升级
var IP_OTA_AUTO_UPGRADE = 10705;//IP OTA 提示升级
var IP_OTA_MANUAL_UPGRADE = 10706;//IP OTA 手动升级

var MSG_EPG_SEARCH_REFRESH = 18003; //EPG数据更新。当EPG搜索到部分数据时，发送该消息。

//***************************** app消息定义*****************************
var AppManager_APPLICATION_START              			= 50011;
var AppManager_APPLICATION_STOP               			= 50012;
var AppManager_APPLICATION_PAUSE              			= 50013;
var AppManager_APPLICATION_RESUME             			= 50014;
var AppManager_APPLICATION_INSTALL            			= 50016;
var AppManager_APPLICATION_UNINSTALL          			= 50017;
var AppManager_APPLICATION_UPGRADE            			= 50018;
var AppManager_COLLECTON_UPDATE             			= 50019; 
var AppManager_APPLICATION_INSTALL_CANCEL           	= 50020;

// todo 
var KEY_VOLUME_UP = 61;
var KEY_VOLUME_DOWN = 45;
var KEY_MUTE = 67;
var KEY_RED = 320;   /*0x0193,  遥控器上的功能键COLORED_KEY_0,RocME中代表红色按键*/
var KEY_YELLOW = 322;   /*0x0194,  遥控器上的功能键COLORED_KEY_1,RocME中代表黄色按键*/
var KEY_BLUE = 323;   /*0x0195,  遥控器上的功能键COLORED_KEY_2,RocME中代表蓝色按键*/
var KEY_GREEN = 321;   /*0x0196,  遥控器上的功能键COLORED_KEY_3,RocME中代表绿色按键*/

var SUPER_PASSWORD = DataAccess.getInfo("UserInfo","adminPassword");
var USER_TABLE_NAME = "USER_TABLE";

function getPageEvent(event,extendType) {
	var eventType = event.type;
	if(eventType) {
		eventType = extendType;
	}
	return {
		type : eventType,
		//source : event.source,
		source : event.type,
		which : event.keyCode||event.which,
		modifiers : event.modifiers,
		modifierInfo : getModefiersInfo(event.modifiers)
	}
};
function getModefiersInfo(modifiers){
	SysSetting.getEventInfo(modifiers);
};

function getSTBPlatformInfo() {
	var eths = Network.ethernets;
	var platformInfo = [
	  {"name":"中间件版权所有","value":SysInfo.middlewareCopyRight},
	  {"name":"主芯片型号","value":SysInfo.SOCModel},
	  {"name":"主芯片厂商","value":SysInfo.SOCProvider},
	  {"name":"机顶盒厂商","value":SysInfo.STBProvider},
	  {"name":"机顶盒类型","value":SysInfo.STBType },
	  {"name":"机顶盒品牌","value":SysInfo.STBBrand},
	  {"name":"机顶盒型号","value":SysInfo.STBModel},
	  {"name":"机顶盒序列号","value":SysInfo.STBSerialNumber},
	  {"name":"机顶盒MAC","value":eths[0].MACAddress},
	  {"name":"loader名称","value":SysInfo.loaderName},
	  {"name":"loader提供商","value":SysInfo.loaderProvider},
	  {"name":"loader版本号","value":SysInfo.loaderVersion},
	  {"name":"loader大小","value":SysInfo.loaderSize},
	  {"name":"硬件版本","value":SysInfo.hardwareVersion},
	  {"name":"软件版本","value":SysInfo.softwareVersion},
	  {"name":"浏览器版本","value":SysInfo.browserVersion}
  ];
  return platformInfo;
}

function getSTBHDInfo() {
	var hdInfo = [
		{"name":"DRAM大小","value":Hardware.DRAM.size + "MB"},
		{"name":"DRAM工作频率","value":Hardware.DRAM.frequency/10 + "KHz"},
		{"name":"Flash大小","value":Hardware.flash.size + "MB"}
	];
	
	return hdInfo;
 }
  
function getOSInfo() {
	var osInfo = [
		{"name":"OS名称","value":OS.name},
		{"name":"OS提供商","value":OS.provider },
		{"name":"OS版本","value":OS.version}
	];
	return osInfo;
}
function getDriverInfo() {
	var driverInfo = [
		{"name":"驱动名称","value":Driver.name},
		{"name":"驱动提供商","value":Driver.provider },
		{"name":"驱动大小","value":Driver.size},
		{"name":"驱动版本号","value":Driver.version}
	];
  return driverInfo;
}
function getMiddlewareInfo() {
	var curProtocols = Middleware.protocols;
	var curLen = curProtocols.length;
	var protocolsHTML="";
	for(var i=0;i<curLen;i++) {
		protocolsHTML += curProtocols[i]+"&nbsp;";
	}
	var middlewareInfo = [
		{"name":"中间件使用权归属者","value":Middleware.belongTo},
		{"name":"中间件图像格式信息","value":Middleware.graphicFormat},
		{"name":"中间件品牌图标URL","value":Middleware.logoURL},
		{"name":"中间件内存大小","value":Middleware.memorySize },
		{"name":"中间件NVRAM大小","value":Middleware.NVRAMSize},
		{"name":"中间件OC-CACHE大小","value":Middleware.OCCacheSize },
		{"name":"中间件应用管理器cache大小","value":Middleware.FFSCacheSize},
		{"name":"中间件HTTP-CACHE大小","value":Middleware.HTTPCacheSize},
		{"name":"中间件发布时间","value":Middleware.releaseDate},
		{"name":"中间件名称","value":Middleware.name},
		{"name":"中间件版本","value":Middleware.version},
		{"name":"中间件提供商","value":Middleware.provider},
		{"name":"技术支持服务联系信息","value":Middleware.supportInfo},
		{"name":"中间件EVENT Cache大小","value":Middleware.eventCache},
		{"name":"已注册的用户协议","value":protocolsHTML},
		{"name":"中间件section buffer大小","value":Middleware.sectionBufferSize},
		{"name":"中间件待显示页面缓存区大小","value":Middleware.renderingPageBufferSize},
		{"name":"中间件图片解码缓存区大小","value":Middleware.imageDecodeBufferSize},
		{"name":"中间件SI Manager缓存区大小","value":Middleware.SIManagerBufferSize},
		{"name":"中间件JS engine所用内存","value":Middleware.JSEngineBufferSize}
	];
	return middlewareInfo;
}

function getUserPassword() {
	return DataAccess.getInfo("UserInfo","adminPassword");
}

function setUserPassword(pwd) {
	DataAccess.setInfo("UserInfo","adminPassword",""+pwd);
	return DataAccess.save("UserInfo","adminPassword");
}

function dataAccessGet(param) {
	return DataAccess.getInfo(param.className,param.info);
}

function dataAccessSet(param) {
	var ret0 = DataAccess.setInfo(param.className,param.info,"" + param.value);
	var ret1 = DataAccess.save(param.className,param.info);
	return ret0 && ret1;
}

function saveDataAccess(param) {
	return DataAccess.save(param.className,param.info);
}

function getApps(param){
	return  AppManager.getApplications("null");
}

function stopAutodeployer(param) {
	return Autodeployer.stop(param);
}

function startAutodeployer(param) {
	return Autodeployer.start(param);
}

function startApp(orgId,appId) {
	AppManager.startApp(orgId,appId,"");
}

function uninstallApp(orgId,appId) {
	Autodeployer.stop(1);
	AppManager.uninstallApp(orgId, appId);
}

function stopApp(orgId,appId) {
	AppManager.stopApp(orgId, appId);
}
function mediaPlayerSetVolume(volume) {
	this.mediaPlayer.setVolume(volume);
};

function releaseMediaPlayer() {
	//var ret = this.mediaPlayer.unBindPlayerInstance();
	var ret1 = this.mediaPlayer.releasePlayerInstance();
	SysSetting.setEnv("mediaPlayerId", "");
	return ret1;
};

function setMediaPlayerArea() {
	if(this.mediaPlayer.position == this.rect){
		return;
	}
	this.mediaPlayer.position = this.rect;
	this.refresh();
};

function setEnableTrickMode(flag) {
	return this.mediaPlayer.enableTrickMode(flag);
}

function pauseMediaPlayer(mode) {
	SumaJS.debug("teatPause pause");
	this.mediaPlayer.pause(mode);
};

function playJSService() {
	var source = this.service.getPlaySrc();
	SumaJS.debug("mediaplayer start playJSService["+this.service.serviceName+"] source = "+source);
	this.mediaPlayer.source = source;
	this.mediaPlayer.play();
};

//add by liwenlei  用来播放nvod视频
function playJSNvodService(obj) {
	var source = "delivery://" + obj.Frequency +"."+ obj.SymbolRate +"."+ obj.Modulation +"."+ obj.ServiceId +"."+ obj.VideoPid +"."+ obj.AudioPid;
	SumaJS.debug("mediaplayer start playJSNvodService source = "+source);
	this.mediaPlayer.source = source;
	this.mediaPlayer.play();
};

function playUrl(source) {
	this.mediaPlayer.source = source;
}

function createJSTs(ts) {
	var networkId = ts.network_id;
	var originalNetworkId = ts.original_network_id;
	var transportStreamId = ts.transport_stream_id;
	var signalQuality = ts.signalQuality;
	var signalStrength = ts.signalStrength;
	var errorRate = ts.errorRate;
	var signalLevel = ts.signalLevel;
	var signalNoiseRatio = ts.signalNoiseRatio;
	var tuneParam = {
		"frequency" : ts.Frequency,
		"symbolRate" : ts.SymbolRate,
		"modulation" : ts.Modulation
	};
	var cfg = {
		networkId : networkId,
		originalNetworkId : originalNetworkId,
		transportStreamId : transportStreamId,
		signalQuality : signalQuality,
		signalStrength : signalStrength,
		errorRate : errorRate,
		signalLevel : signalLevel,
		signalNoiseRatio : signalNoiseRatio,
		tuneParam : tuneParam
	};
	
	return new JSTs(cfg);
}

function getTsByService(service) {
	SumaJS.debug("##########DvbBroadcast.getTS start");
	var tsInfo = service.tsInfo;
	//DVB.tune(tsInfo.Frequency, tsInfo.SymbolRate, tsInfo.Modulation);
	//var ts = DvbBroadcast.getTS(service.networkId, service.originalNetworkId, service.transportStreamId);
	//SumaJS.debug("##########DvbBroadcast.getTS end");
	return tsInfo;
};

function getAllChannel() {
	var tv = ChannelManager.filter([1000], [1]);
	var au = ChannelManager.filter([1000], [2]);
	var hd = ChannelManager.filter([1000], [17]);
	var ret = tv.concat(au).concat(hd);
	return ret;
	
	var bouquetId = parseInt(JSEnvManager.getEnv("currentBouquetId"),10);
	var ret = ChannelManager.filter([1002], [bouquetId]);
	return ret;
}

function initMediaPlayer() {
	this.instanceId = SysSetting.getEnv("mediaPlayerId");
	if(this.instanceId == ""){
		this.instanceId = this.mediaPlayer.createPlayerInstance("Video",2);
		SysSetting.setEnv("mediaPlayerId", this.instanceId);
	}else{
		this.mediaPlayer.bindPlayerInstance(parseInt(this.instanceId))
	}	
	SumaJS.debug("mediaplayer instanceId = " + this.instanceId);
	this.mediaPlayer.position = this.rect;
	//this.mediaPlayer.enableTrickMode(true);
	//this.mediaPlayer.setPauseMode(1);
	this.mediaPlayer.refresh();
		/*
		0 -- 未初始化；
		1 -- 已绑定,初始状态；
		2 -- 设置播放地址成功；
		3 -- 锁频成功；
		4 -- 播放状态；
		5 -- 特效状态；
	*/
	/*
		0 -- 无任务；
		1 -- 播放DVB任务；
		2. -- 播放本地/远程任务
	*/
	this.eventHandler = function(event) {
		if (!this.focus) {
			return true;
		}
		var code = event.keyCode||event.which;
		switch (code) {
		case MSG_MEDIA_URL_VALID: //	-	媒体源路径有效。
			SumaJS.debug("##########MSG_MEDIA_URL_VALID");
			this.mediaPlayer.play();
			return this.onSetURLValid();
			break;
		case MSG_MEDIA_URL_INVALID: //	-	媒体源路径无效。
			SumaJS.debug("mediaplayer set url invalid");
			this.mediaPlayer.play();
			return this.onSetURLInvalid();
			break;
		case MSG_MEDIA_PLAY_SUCCESS: //	-	开始播放成功
			SumaJS.debug("##########MSG_MEDIA_PLAY_SUCCESS");
			return this.onPlaySuccess();
			break;
		case MSG_MEDIA_PLAY_FAILED: //	-	开始播放失败。
			SumaJS.debug("mediaplayer play failed");
			return this.onPlayFailed();
			break;
		case MSG_MEDIA_SETPACE_SUCCESS: //	-	步长设置成功。
			return this.onSetPaceSuccess();
			break;
		case MSG_MEDIA_SETPACE_FAILED: //	-	步长设置失败。
			return this.onSetPaceFailed();
			break;
		case MSG_MEDIA_SEEK_SUCCESS: //	-	设置播放时间点成功。
			return this.onSeekSuccess();
			break;
		case MSG_MEDIA_SEEK_FAILED: //	-	设置播放时间点失败。
			return this.onSeekFailed();
			break;
		case MSG_MEDIA_PAUSE_SUCCESS: //	-	暂停播放成功。
			return this.onPauseSuccess();
			break;
		case MSG_MEDIA_PAUSE_FAILED: //	-	暂停播放失败。
			return this.onPauseFailed();
			break;
		case MSG_MEDIA_RESUME_SUCCESS: //	-	恢复播放成功。
			return this.onResumeSuccess();
			break;
		case MSG_MEDIA_RESUME_FAILED: //	-	恢复播放失败。
			return this.onResumeFailed();
			break;
		case MSG_MEDIA_STOP_SUCCESS: //	-	停止播放成功。
			SumaJS.debug("##########play, MSG_MEDIA_STOP_SUCCESS");
			return this.onStopSuccess();
			break;
		case MSG_MEDIA_STOP_FAILED: //	-	停止播放失败。
			SumaJS.debug("##########play, MSG_MEDIA_STOP_FAILED");
			return this.onStopFailed();
			break;
		case MSG_DVB_TUNE_SUCCESS: // 锁频成功		
			SumaJS.debug("mediaplayer tune success");
			SumaJS.debug("##########play, MSG_DVB_TUNE_SUCCESS");
			SumaJS.debug("##########setMediaSource start");
			this.playSource = this.service.getPlaySrc();
			SumaJS.debug("mediaplayer setSource, src = " + this.playSource);
			this.mediaPlayer.setMediaSource(this.playSource);
			SumaJS.debug("##########setMediaSource end");
			return this.onTuneSuccess();
			break;
		case MSG_DVB_TUNE_FAILED: // 锁频失败;
			SumaJS.debug("mediaplayer tune failed");
			this.playSource = this.service.getPlaySrc();
			this.mediaPlayer.setMediaSource(this.playSource);
			return this.onTuneFailed();
			break;
		default:
			return true;
			break;
		}
	};
	//controlList["eventManager"].addEventListener("mediaPlayer", this, MEDIAPLAYER_LEVEL);
	this.state = 1;
};

function getPlaySource() {
	var tsInfo = this.tsInfo;
	var source = "delivery://" + tsInfo.Frequency +"."+ tsInfo.SymbolRate +"."+ tsInfo.Modulation +"."+ this.serviceId +"."+ this.videoPid +"."+ this.currentAudioPid;
	return source;
};

function getServiceName() {
	var serviceObj = DvbBroadcast.getService(this.networkId, this.originalNetworkId, this.transportStreamId, this.serviceId);
	SumaJS.debug("serviceName = " + serviceObj.service_name);
	return serviceObj.service_name;
};

function saveChannel() {
	var channel = ChannelManager.getChannelByServiceID(this.serviceId);
	channel.channelId = this.channelId;
	channel.logicalId = this.logicalChannelId;
	channel.isDeleted = this.deleteFlag;
	channel.isFavorite = this.favorite;
	channel.isLocked = this.lock;
	channel.isHided = this.hide;
	channel.deltVolume = this.volume;
	channel.volumeOffset = this.offset;
	ChannelManager.save();
};

function createJSServiceByChannel(channel) {
	var service = channel.getService();
	var networkId = service.network_id;
	var originalNetworkId = service.original_network_id;
	var transportStreamId = service.transport_stream_id;
	var serviceId = service.service_id;
	//var serviceName = service.service_name;
	var provider = service.service_provider_name;
	var serviceType =  service.service_type;
	var serviceStatus = service.running_status;
	var bouquetIdArray = service.bouquetIDs;
	var pcrPid = service.PCRPID;
	var referenceServiceId = service.referServiceID;
	var timeshiftServiceIdArray = service.timeShiftServiceIDs;
	
	var caFlag = service.free_CA_mode;

	if (service.curVideoObj) {
		var videoPid = service.curVideoObj.elementary_PID;
	} else {
		if (service.getVideoESs().length > 0) {
			var videoPid = service.getVideoESs()[0].elementary_PID;
		} else {
			var videoPid = 0;
		}
	}

	if (service.curAudioObj) {
		var currentAudioPid = service.curAudioObj.elementary_PID;
	} else {
		if (service.getAudioESs().length > 0) {
			var currentAudioPid = service.getAudioESs()[0].elementary_PID;
		} else {
			var currentAudioPid = 0;
		}
	}
	
	var audioArray = [];
	var audioPidArray = service.getAudioESs();
	for(var i = 0, len = audioPidArray.length; i < len; ++i) {
		audioArray.push(audioPidArray[i].elementary_PID);
	}
	var hide = channel.isHided;
	var lock = channel.isLocked;
	var favorite = channel.isFavorite;
	var playback = channel.supportPlayback;
	var channelId = channel.channelId;
	var logicalChannelId = channel.logicalId;
	var deleteFlag = channel.isDeleted;
	
	var volume = channel.deltVolume;
	var offset = channel.volumeOffset;

	var cfg = {
		networkId : networkId,
		originalNetworkId : originalNetworkId,
		transportStreamId : transportStreamId,
		serviceId : serviceId,
		//serviceName : serviceName,
		provider : provider,
	    serviceType : serviceType,	
		serviceStatus : serviceStatus,
 		bouquetIdArray : bouquetIdArray,
	 	pcrPid : pcrPid,
		referenceServiceId : referenceServiceId,
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
		offset : offset
	}
	
	return new JSService(cfg);
}

function getEnvironment(key){
	return 1;
}

function getGlobalVolumeFlag(){
	var flag = JSDataAccess.getInfo({"className":"MediaSetting","info":"enableGlobalVolumn"});
	return flag;
}

function getSystemVolume() {
	var volume = DataAccess.getInfo ("VodApp","QAMName4");
	if(volume!=""&&volume!=null&&typeof(volume)!="undefined"){
		volume = parseInt(volume);
	}else{
		setSystemVolume(16);
		volume = 16;
	}
	return parseInt(volume);	
};

function setSystemVolume(volume) {
	DataAccess.setInfo("VodApp","QAMName4",volume+"");
	DataAccess.save ("VodApp","QAMName4");
};

function getMute() {
	return 0;	
};

function setMuteState(flag) {
	if (flag) {
		this.player.audioMute();
	} else {
		this.player.audioUnmute();
	}
};

function getMuteState() {
	return this.player.getMute();
};

function outputVolume(volume) {
	//if (this.globalFlag) {
		var ret0 = JSDataAccess.setInfo({"className":"MediaSetting","info":"OutputVolumn","value":volume});
		var ret1 = JSDataAccess.save({"className":"MediaSetting","info":"OutputVolumn"});
		return ret0 && ret1;
	//}
};

//////////////////////////////////////// epg ///////////////////////////////////////////////////////////
function getEventArrayByDate() {
	var ret =  EPGManager.getProgramsByDate(this.service.getPlaySrc(), this.date.startDate, this.date.endDate);
	return ret;
};

function getWeekEventArray() {
	var ret = [];
	var now = new Date();
	for(var i = 0; i < 7; ++i) {
		if (i == 0) {
			var startDate = new Date();
		} else {
			var startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
		}
		var endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, 23, 59, 59);
		array = EPGManager.getProgramsByDate(this.service.getPlaySrc(), startDate, endDate);
		ret.push(array);
	}
	return ret;
};

function getWeekEvent() {
	var ret = [];
	var now = new Date();
	for(var i = 0; i < 7; ++i) {
		if (i == 0) {
			var startDate = new Date();
		} else {
			var startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
		}
		var endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, 23, 59, 59);
		array = EPGManager.getProgramsByDate(this.service.getPlaySrc(), startDate, endDate);
		ret.concat(array);
	}
	return ret;
};

function getActualSchedule() {
	//var startDate = new Date();
	//var endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 23, 59, 59);
	//return EPGManager.getProgramsByDate(this.service.getPlaySrc(), startDate, endDate);
	//alert("getActualSchedule")
	SumaJS.debug("##########EPG.getSearchResult start");
	var info = EPG.getSearchResult(this.maskId);
	//alert("info length: "+info.length)
	var scheduleEvents = [];
	for(var i=0;i<info.length;i++) {
		var p = info[i];
		var tempInfo = {
			"network_id" : p.NetworkID,	
			"original_network_id" : p.NetworkID,	
			"transport_stream_id" : -1,
			"service_id" : p.serviceID,
			"event_id" : p.eventID,
			"event_name" : p.name,
			"event_description" : p.description,
			"running_status" : p.status,
			"startDate" : p.date,
			"endDate" : p.date,
			"startTime" : p.startTime,
			"endTime" : p.endTime,
			"duration" : p.duration,
			"minAge" : p.minAge,
			"free_CA_mode" : p.isCA,
		}
		var temp = {};
		temp["info"] = p;
		temp["eventObj"] = {};
		temp["eventObj"] = tempInfo;
		scheduleEvents.push(temp);
	}
	//SumaJS.debug("getActualSchedule schedule length: "+scheduleEvents.length)
	return scheduleEvents;
};

function getPFPEvent() {
	SumaJS.debug("##########EPG.getSearchResult start");
	var pfInfo = EPG.getSearchResult(this.maskId);
	var pfEvents = [];
	for(var i=0;i<pfInfo.length;i++) {
		var p = pfInfo[i];
		var tempPFInfo = {
			"network_id" : p.NetworkID,	
			"original_network_id" : p.NetworkID,	
			"transport_stream_id" : -1,
			"service_id" : p.serviceID,
			"event_id" : p.eventID,
			"event_name" : p.name,
			"event_description" : p.description,
			"running_status" : p.status,
			"startDate" : p.date,
			"endDate" : p.date,
			"startTime" : p.startTime,
			"endTime" : p.endTime,
			"duration" : p.duration,
			"minAge" : p.minAge,
			"free_CA_mode" : p.isCA,
		}
		var temp = {};
		temp["info"] = p;
		temp["eventObj"] = {};
		temp["eventObj"] = tempPFInfo;
		pfEvents.push(temp);
	}
	//SumaJS.debug("##########EPGManager.getFollowingProgram end");
	return [pfEvents[0], pfEvents[1]]
};

function searchProgramByService() {
	SumaJS.debug("##########EPG.searchProgramsByServiceId start mask="+this.mask);
	if (this.mask == 0x01 || this.mask == 0x02) {
		this.maskId = EPG.searchProgramsByServiceId(this.service.serviceId,this.mask,this.endureTime);
	} else if(this.mask == 0x11 || this.mask == 0x12 || this.mask == 0x13){
		this.maskId = EPGManager.searchProgramEventByService(this.service.getPlaySrc(), 0x02, this.endureTime);
	}
	SumaJS.debug("maskId = " + this.maskId);
};

function createJSEvent(eventInfo) {
	if (!eventInfo) {
		return null;
	}

	var programEvent = eventInfo.info;
	
	var dvbEvent = eventInfo.eventObj;
	if(!dvbEvent){
		return null;	
	}
	var networkId = dvbEvent.network_id;
	var originalNetworkId = dvbEvent.original_network_id;
	var transportStreamId = dvbEvent.transport_stream_id;
	var serviceId = dvbEvent.service_id;
	var eventId = dvbEvent.event_id;
	var eventName = dvbEvent.event_name;
	var eventDescription = dvbEvent.event_description;
	var state = dvbEvent.running_status;
	var startDate = dvbEvent.startDate;
	var endDate = dvbEvent.endDate;
	var startTime = dvbEvent.startTime;
	var endTime = dvbEvent.endTime;
	var duration = dvbEvent.duration;
	var minAge = dvbEvent.minAge;
	var caFlag = dvbEvent.free_CA_mode;
	
	var cfg = {
		"networkId" : networkId,
		"originalNetworkId" : originalNetworkId,
		"transportStreamId" : transportStreamId,
		"serviceId" : serviceId,
		"eventId" : eventId,
		"eventName": eventName,
		"eventDescription" : eventDescription,
		"state" : state,
		"startDate" : startDate,
		"endDate" : endDate,
		"startTime" : startTime,
		"endTime" : endTime,
		"duration" : duration,
		"minAge" : minAge,
		"caFlag" : caFlag,
		"programEvent" : programEvent
	};
	return new JSEvent(cfg);
};



function parseFile(filePath) {
	var fileHandle = FileSystem.getFile(filePath);
	if(fileHandle == -1){
		return null;
	}
	else if(fileHandle == 0){
		return null;
	}
	
	var ret = fileHandle.open(1);
	if(ret == 0){
		return null;
	}
	
	ret = fileHandle.readAllfile();
	if(ret == 0){
		return null;
	}
	var result = ret;//JSON.parse(ret);
	
	ret = fileHandle.close();
	if(ret == -1){
		return null;
	}
	
	ret = FileSystem.killObject(fileHandle);
	if(ret == 0)
		return null;
	return result;
}

function readFile(filePath, count) {
	var ret = null;
	while(count > 0 && (ret = parseFile(filePath)) == null) {
		--count;
	}
	return ret;
}

function saveFileOnce(filePath, content) {
	var fileHandle = FileSystem.createFile();
	var ret = fileHandle.open(1);
	if(ret == 0) {
		return false;
	}
	
	var text = JSON.stringify(content, null, 4);
	ret = fileHandle.writeFile(text);
	if(ret == 0) {
		return false;
	}
		
	ret = fileHandle.close();
	if(ret == -1) {
		return false;
	}
	
	var dirObj = FileSystem.createDirectory(filePath.substring(0, filePath.lastIndexOf('/')));
	if(dirObj == 0) {	
		return false;
	}

	ret = fileHandle.saveAs(filePath);
	if(ret == -1){
		return false;
	}
	else if(ret == 0){
		return false;
	}
	
	ret = FileSystem.killObject(fileHandle);
	if(ret == 0)
		return false;
	if (typeof dirObj == "object") {
		ret = FileSystem.killObject(dirObj);
		if(ret == 0)
			return false;
	}
		
	return true;
}

function saveJSONFile(filePath, content, count) {
	var ret = false;
	while(count > 0 && (ret = saveFileOnce(filePath, content)) == false) {
		--count;
	}
	return ret;
}

var StbFrontPanel = {
	clear : function(){
	},
	displayDate:function(){
	},
	displayText:function(str){
		SysSetting.panelDisplayText(str);
	}
}

function setEnvironment(key,value){
	SysSetting.setEnv(key, value);
}

function getEnvironment(key){
	SysSetting.getEnv(key);
}

function getOrderByEvent(){
	//SumaJS.debug("get orderbyEvent event = "+this.eventInfo);
	var tempOrder = user.orders.getOrderByEvent(this.eventInfo);
	var order = createJSOrder(tempOrder);
	return order;
}

function addOrder(jsEvent){
	return user.orders.add(jsEvent.eventInfo);
}

function deleteOrder(order){
	//var orderId = order.eventInfo.orderId;
	//var tempOrder = user.orders.getOrderByID(orderId);
	return user.orders.del(order.eventInfo);
	//return user.orders.del(tempOrder);
}

function saveOrderInfo(){
	user.orders.save();
}

function getConflictOrders(){
	var events = user.orders.getConflictEvents();
	var ret = [];
	for(var i = 0, len = events.length; i < len; ++i) {
		var tempOrder = user.orders.getOrderByEvent(events[i]);
		ret.push(createJSOrder(tempOrder));
	}
	return ret;
}

function createJSOrder(order) {
	var p = order;
	if(!p){
		return null;	
	}
	var eventInfo = p.whichEvent;
	if(!eventInfo){
		return null;	
	}
	var tempPFInfo = {
		"network_id" : eventInfo.NetworkID,	
		"original_network_id" : eventInfo.NetworkID,	
		"transport_stream_id" : -1,
		"service_id" : eventInfo.serviceID,
		"event_id" : eventInfo.eventID,
		"event_name" : eventInfo.name,
		"event_description" : eventInfo.description,
		"running_status" : p.status,
		"startDate" : eventInfo.date,
		"endDate" : eventInfo.date,
		"startTime" : eventInfo.startTime,
		"endTime" : eventInfo.endTime,
		"duration" : eventInfo.duration,
		"minAge" : eventInfo.minAge,
		"free_CA_mode" : eventInfo.isCA,
	}
	var temp = {};
	temp["info"] = p;
	temp["eventObj"] = {};
	temp["eventObj"] = tempPFInfo;
	var jsEvent = createJSEvent(temp);
	return jsEvent;
};

function getCAEntitles(opId){
	var data = [];
	var  currData = CA.getEntitles(opId);
	if(currData != null) data = currData;
	return data;
}

function deleteMail(index){
	CAMails.deleteEmail(index );
}

function deleteAllMails(){
	CAMails.deleteAllEmail();
}

function getCAMails(param) {
	var mails="";//CA.getMails();
		
	//mails=[{ID:"1",readFlag:"0",priority:"1",senderID:"东方广视互动电视",title:"五月份有优五月份有优惠活动，敬请关注！",arrivalTime:"1900-05-31 23:59:59",content:"word-break;break-all 支持版本：IE5以上 该行为与亚洲语言的 normal 相同。也允许非亚洲语言文本行的任意字内断开。该值适合包含一些非亚洲文本的亚洲文本。 WORD-WRAP:break-word 支持版本：IE5.5以上 内容将在边界内换行。如果需要，词内换行( word-break )也将发生。表格自动换行，避免撑开。 word-break : normal | break-all | keep-all 参数： normal : 依照亚洲语言和非亚洲语言的文本规则，允许在字内换行 break-all : 该行为与亚洲语言的normal相同。也允许非亚洲语言文本行的任意字内断开。该值适合包含一些非亚洲文本的亚洲文本 keep-all : 与所有非亚洲语言的normal相同。对于中文，韩文，日文，不允许字断开。适合包含少量亚洲文本的非亚洲文本 语法： word-wrap : normal | break-word 参数： normal : 允许内容顶开指定的容器边界 break-word : 内容将在边界内换行。如果需要，词内换行（word-break）也行发生说明：设置或检索当当前行超过指定容器的边界时是否断开转行。"},{ID:"2",readFlag:"1",priority:"1",senderID:"重已：",title:"test",arrivalTime:"1900-05-31 23:59:59"},{ID:"3",readFlag:"0",priority:"0",senderID:"普未：",title:"test",arrivalTime:"1900-05-31 23:59:59"},{ID:"4",readFlag:"1",priority:"0",senderID:"普已：",title:"test",arrivalTime:"1900-05-31 23:59:59"},{ID:"5",readFlag:"1",priority:"1",senderID:"运营商ID",title:"test",arrivalTime:"1900-05-31 23:59:59"},{ID:"6",readFlag:"1",priority:"1",senderID:"运营商ID",title:"test",arrivalTime:"1900-05-31 23:59:59"},{ID:"7",readFlag:"1",priority:"1",senderID:"运营商ID",title:"test",arrivalTime:"1900-05-31 23:59:59"},{ID:"8",readFlag:"1",priority:"1",senderID:"运营商ID",title:"test",arrivalTime:"1900-05-31 23:59:59"},{ID:"9",readFlag:"1",priority:"1",senderID:"运营商ID",title:"test",arrivalTime:"1900-05-31 23:59:59"},{ID:"10",readFlag:"1",priority:"1",senderID:"运营商ID",title:"test",arrivalTime:"1900-05-31 23:59:59"},{ID:"11",readFlag:"1",priority:"1",senderID:"运营商ID",title:"test",arrivalTime:"1900-05-31 23:59:59"}];
	return mails;
}

function getRemainMailNum() {
	var num = CAMails.remainEmailNum;
	if(!num){
		num = 0;
	}
	return num;	
}

function getOrderById(id){
	var order = user.orders.getOrderByID(id);
	return createJSOrder(order);
}

function getOrderArray(param){
	var info = user.getOrders(param);
	var orderList = [];
	for (var i = 0; i < info.length; i++) {
		var evt = info[i].whichEvent;
		var now =  SumaJS.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
		var evtStartTime = evt.date + " " + evt.startTime;
		if (evtStartTime < now) {
			user.orders.del(info[i]);	
		} else {
			var jsOrder = createJSOrder(info[i]);
			orderList.push(jsOrder);	
		}
	}
	user.orders.save();	
	return orderList;
}

//跑马灯对象
//FIXME:<div id="test_str_len0"> must given
function ShowNotice(PORTAL_ADDR,contextId){
	var self = this;
	var netid = DVB.currentDVBNetwork ? DVB.currentDVBNetwork.networkID : -1;	
	//this.noticeUrl = PORTAL_ADDR + "/portal/demand/getRecommendNew.action?identify=notice";
	this.noticeUrl = PORTAL_ADDR+"/u1/GetAnn?client=1&regionCode="+CA.regionCode+"&netWorkId="+netid+"&posCode=index_notice";
	//this.noticeUrl = './GetAnn.json'
	// this.speedPix = 2;
	// this.delayTime = 30;
	this.context = SumaJS.getDom(contextId);
	this.currNoticeIndex = 0;
	this.currNoticeData = null;
	this.noticeData = null;
	// this.scrollLeft = 0;
	// this.scrollWidth = 540;
	// this.scrollTimer = null;
	this.scrollCharWidth = 0;
	this.defaultContent =  "U互动，随我控，高清互动电视一手掌控！";
	this.getNoticeData = function(){
		SumaJS.debug("==============noticeUrl:" + this.noticeUrl);
		var ajaxParam = {
			url : this.noticeUrl,
			method: "GET",
			data: "",
			success: function(data){
				SumaJS.debug("==============notice request success");
				SumaJS.debug("==============notice new data:" + data.responseText);
				var str = data.responseText.substr(data.responseText.indexOf("{"));
				//alert(str);
				var noticeInfo = null;
				try{
					noticeInfo = eval('('+str+')');
				}catch(e){
					SumaJS.debug("notice data is not json string");
				}
				/*
				if(noticeInfo && noticeInfo.recommendData && noticeInfo.recommendData[0]){
					self.noticeData = noticeInfo.recommendData[0].sourceData;
				}
				*/
				//新接口解析数据变化 modified by liwenlei 
				if(noticeInfo && noticeInfo.sourceData){
					self.noticeData = noticeInfo.sourceData;
				}
				
				if(!self.noticeData || self.noticeData.length <= 0) {
					self.noticeData = [{content:self.defaultContent}];
				}
				//self.currNoticeIndex = 0;
				self.showScrollText();
			},
			failed: function(data){
				try{
					SumaJS.debug("==============notice request failed 1");
					self.noticeData = [{content:self.defaultContent}];
					//self.currNoticeIndex = 0;
					self.showScrollText();
					SumaJS.debug("==============notice request failed 2");
				}catch(e){
					SumaJS.debug("==============notice request failed error");
				}
			}
		};
		SumaJS.ajax(ajaxParam);
	};
	this.showScrollText = function () {
		if(!this.currNoticeData){
			var scrollText = "";
			var nums=this.noticeData.length;
			for(var i=0;i<nums;i++){
				this.currNoticeData = this.noticeData[i];
				//this.currNoticeData = this.noticeData[this.currNoticeIndex];
				if (typeof this.currNoticeData.img !="undefined" && this.currNoticeData.img != "") {
					//scrollText += "<img src='"+PORTAL_ADDR + this.currNoticeData.img + "' align='absmiddle'/>";
					var result = this.currNoticeData.img.split(".");
					//添加img的条件判断
					if(result[1] == "jpg" || result[1] == "jpeg" || result[1] == "png"  || result[1] == "bmp" ){
						scrollText += "<img src='"+PORTAL_ADDR + this.currNoticeData.img + "' align='absmiddle'/>";
					}
				}
				scrollText += this.currNoticeData.content+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
			}
			if(!scrollText){
				scrollText = this.defaultContent;
			}
			//添加走马灯marquee标签
			var noticeStr = "<marquee  direction='left' behavior='scroll' scrollamount='6' scrolldelay='0' loop='-1' hspace='10' vspace='0'>" + scrollText + "</marquee>";
			SumaJS.getDom("test_str_len0").innerHTML = noticeStr;
			// this.scrollCharWidth = parseInt(SumaJS.getDom("test_str_len0").offsetWidth,10);
			// SumaJS.debug("this.scrollCharWidth = "+this.scrollCharWidth);
			// this.context.style.left = this.scrollLeft+"px";
			// this.context.style.width = this.scrollCharWidth+"px";
			this.context.innerHTML = noticeStr;
		// 	if(this.scrollLeft == 0){
		// 		this.scrollLeft = 200;
		// 	}else{
		// 		this.scrollLeft = 650;
		// 	}
		// 	this.scrollTimer = setInterval(function(){self.showScrollText();}, this.delayTime);
		}
        //
		// if (this.scrollLeft <= (this.scrollCharWidth * -1)-20) {
		// 	clearInterval(this.scrollTimer);
		// 	this.currNoticeIndex++;
		// 	if (this.currNoticeIndex >= this.noticeData.length) {
		// 		this.currNoticeIndex = 0;
		// 	}
		// 	this.currNoticeData = null;
		// 	this.showScrollText();
		// } else {
		// 	this.scrollLeft -= this.speedPix;
		// 	this.context.style.left = this.scrollLeft + "px";
		// }
	}
}


//邮件图标管理
/*
CAMailF = function(sID){
    var o={
        ID:1,
        priority:0,
        senderID:!sID? "1":""+sID,
        content:function() {
            o.readFlag = 1;
            return "浮沉的云海留给天空一抺阴凉";//，把人间的八月点印出思念中的印斑，放入大脑。关于这个城市人影画像出现在脑海，印在上岗。让思念渲染绿叶，趁着花瓣还没有开放，慢慢生长。慢慢的等你走进万花丛中，闻着花香，飘进你心中的味道不是花香，而是我思念时的向往。在雨中， 我试着把你描绘。描绘出你的双眸和你最忧伤的目光。闪动着，张望远方。远方，有你的故乡。哪里有你的童年，有你的成长，有你的欢乐，也有你的忧伤。我把你的守望画在一张普通的白纸张上，白纸却因为有你的图像不在寻常。当你回到你的故乡，我就成了故乡里的游客。徘徊在青苔路中的石板上--- 晚霞，挂起一缕红光照在山上，用笔和纸描绘出你的模样，为何点缀不出你微笑时的酒窝。远方的你和留不下地青春，伴随着夕阳模糊在黑暗里。我们习惯用回忆祭奠青春；用放荡祭奠疯狂；用窘迫祭奠梦想。当回忆闪过，眼前的时光，剩下的不在是回忆，而是回忆后的忧伤，搁浅的没有沙滩的海面上。伴随着风，伴随着雨，伴随着你和我，飘去没有坐标的方向。",
        },
        title:"我是姜浩我是姜浩我是姜浩我是姜浩",
        arrivalTime:"2011-8-5 15:10:28",
        readFlag:1
    };
    return o;
}
var tmpCAMAILS = [CAMailF(1),CAMailF(2)];
var CA = new function(){
    this.getMails = function(){
        return tmpCAMAILS;
    }
};

var CAMails = new function(){
    this.getEmail = function(index){
        return tmpCAMAILS[index];
    }
};
*/
gMailIconMgr = new function(){
    this.getUnreadMailsNum = function(){
        var mails = CA.getMails();
        var mailsUnReadNum = 0;
        if (mails) {
            for (var i = 0; i < mails.length; i++) {
                var mail = CAMails.getEmail(i);
                if (mail && mail.readFlag == 0) {
                    mailsUnReadNum ++;
                }
            }
        }
        return mailsUnReadNum;
    };

    this.showMailsNum = function(num){
        var dom = SumaJS.getDom("header_main_icon_txt");
        if(dom){
            if(num > 0) {
                dom.innerHTML = num > 99? 99:num;
            }else{
                dom.innerHTML = "";
            }
        }
    }

};



