
/**********************************海报推荐读取**********************************/
portalAd = {
	adData:null,  //数据
	tempAdData:null, //临时数据
	sequeData:null,
	tempSequeData:null,
	sequeImgIndex:[0,0,0,0,0,0],
	sequeDom:[],
	keynumDom:[],
	sequeImg:[],
	sequeKey:[],
	downloadPos:0,
	picDownloadMaskId:-1,
	picFileName:"",
	downloadImgList:null,
	downloadImgFlag:false,
	infoUrl:"",
	tempInfoUrl:"",
	infoSequeData:null,
	tempInfoSequeData:null,
	searchUrl:"",
	tempSearchUrl:"",
	searchUrlSequeData:null,
	tempSearchUrlSequeData:null,
	versionInfo: {}, //用来存放每个板块的版本号
	tempVersionInfo: {}, //用来存放请求道的新数据的每个版块的版本号
	
	/*init:function(){   //遗留,目前未用
		SumaJS.debug("==============init portalAd=================");
		for(var i=0; i<6; i++){
			this.sequeDom[i] = SumaJS.getDom("seque"+(i+1));
			this.keynumDom[i] = SumaJS.getDom("keynum"+(i+1));
		}
	},
	reset:function(){   //遗留,目前未用
		this.sequeImg = [];
		this.sequeKey = [];
		this.showImgLeftSelect = [];
		this.showImgRightSelect = [];	
	},*/
	updateAd:function(type){   //更新海报数据,
		//var wUrl = PORTAL_ADDR + "/portal/demand/getRecommendNew.action?identify=index2.0";
		//var wUrl = PORTAL_ADDR + "/simulationData/recommedJSON.php";
		var wUrl = portalInterfaceObj["rcmd"];
		var ajaxParam = {
			url : wUrl,	
			method: "GET",
			data: "",
			success: adSuccess,
			failed: function(data){
				SumaJS.debug("==============updateAd request failed");
				portalAd.end();
			}
		};		
		SumaJS.ajax(ajaxParam);
		function adSuccess(data){
			try{
				SumaJS.debug("============updateAd request success");
				var data = JSON.parse(data.responseText);
				for(var i=0;i<data.length;i++){
					if(typeof data[i].identity != "undefined"){
						portalAd.tempVersionInfo[data[i].identity] = data[i].version; 
					}					
				}
				var versionFlag = isObjectValueEqual(portalAd.versionInfo,portalAd.tempVersionInfo); //版本是否全部相等标志位
				if(portalAd.adData == null || (!versionFlag)){  //数据为空或版本号不全相同
					FileSystem.createDirectory("/storage/storage0/portalAd_temp");	//创建临时文件
					saveJSONFile("/storage/storage0/portalAd_temp/recommend_temp.json", data, 1);
					portalAd.tempAdData = data;
					SumaJS.debug("====================download pics===============");
					portalAd.downloadPics();
				}else{
					SumaJS.debug("the version is all the same");
					portalAd.end();
				}
			}catch(e){
				SumaJS.debug("identify data is error");
				portalAd.end();
				return false;
			}
		}		
	},
	
	/*updateAdByModule: function(type){   //更新海报数据, type为板块类型
		if(type !="index_tv" && type !="index_vod" && type !="index_home" 
			&& type !="index_local" && type !="index_app" ){
			SumaJS.debug("updateAdByModule wrong type");
			return;
		}
		SumaJS.debug("updateAdByModule "+type);
		var wUrl = portalInterfaceObj["rcmd"]+type;
		var ajaxParam = {
			url : wUrl,	
			method: "GET",
			data: "",
			success: adSuccess,
			failed: function(data){
			}
		};		
		SumaJS.ajax(ajaxParam);
		function adSuccess(data){
			try{
				var data = JSON.parse(data.responseText);
			}catch(e){
				SumaJS.debug("identify data is error");
				return false;
			}
		}		
	},
	*/
	downloadPics: function(){  //测试下载
		SumaJS.debug("==============downloadPics");
		if (this.downloadImgList == null) {
			this.downloadImgList = [];
			for (var i = 0; i < this.tempAdData.length; i++) {
				var data = this.tempAdData[i];
				SumaJS.debug("this.versionInfo["+data.identity+"]: is not same");
				for(var j=0; j<data.recommendData.length;j++){
					for(var k=0;k<data.recommendData[j].sourceData.length;k++){
						var temp = data.recommendData[j].sourceData[k].img;
						this.downloadImgList = this.downloadImgList.concat(temp);
					}
				}
			}
		}		
		var picLength = this.downloadImgList.length;
		if (picLength == 0){ portalAd.end(); return false;}
		var data = this.downloadImgList[this.downloadPos];
		if (this.downloadPos < picLength) {
			//var picUrl = PORTAL_ADDR + data;
			//var picUrl = PORTAL_ADDR + data;
			if(!data || typeof data != "string"){  //添加异常处理，下载路径非法时直接走失败流程
				SumaJS.debug("===downloadPics= data is illegal");
				portalAd.end();
				return ;
			}
			var portalAdPicUrl = picdownLoadPathValid(data);  //添加相对路径或绝对路径的处理
			this.picFileName = data.substr(data.lastIndexOf("/") + 1);
			SumaJS.debug("====================portalAdPicUrl===============:" + portalAdPicUrl);
			this.picDownloadMaskId = FileSystem.downloadRemoteFile(portalAdPicUrl, 5);
			this.downloadPos++;
		} else {
			if(this.downloadImgFlag && this.tempAdData.length > 0){
				FileSystem.deleteDirectory("/storage/storage0/portalAd");
				SumaJS.debug("========deleteDirectory portalAd 2============");
				var fileList = FileSystem.getDirectory("/storage/storage0/portalAd_temp").fileList;
				var flag = true;
				if(fileList == -1 || fileList == 0){
					flag = false;
					SumaJS.debug("========getDirectory portalAd_temp failed============");							
				}
				var dirObj = FileSystem.createDirectory("/storage/storage0/portalAd");
				if(dirObj == 0){
					flag = false;
					SumaJS.debug("========createDirectory portalAd failed============");
				}else if(dirObj == -1){
					FileSystem.deleteDirectory("/storage/storage0/portalAd");
					SumaJS.debug("========deleteDirectory portalAd 5============");
					FileSystem.createDirectory("/storage/storage0/portalAd");
				}
				if(flag){
					FileSystem.killObject(dirObj);
					for(var i=0; i<fileList.length; i++){
						var name = fileList[i].name;
						if(name == "recommend_temp.json"){
							continue;
						}
						var ret = 0;
						var n = 0;
						while(ret!=1 && n<5){
							ret = FileSystem.moveFile("/storage/storage0/portalAd_temp/"+name,"/storage/storage0/portalAd/"+name);
							n++;
						}
						if(ret!=1){
							FileSystem.deleteDirectory("/storage/storage0/portalAd_temp");
							flag = false;
							break;
						}
					}
					FileSystem.killObject(fileList);
					FileSystem.deleteDirectory("/storage/storage0/portalAd_temp");							
					if(flag){
						saveJSONFile("/storage/storage0/portalAd/recommend2.json", this.tempAdData, 1); //保存json文件						
						SumaJS.debug("download complished");
						this.readAd(); //下载完成后重新读取。					
						this.refresh();// 关闭刷新接口，只读取，在板块间切换时保证显示最新的海报数据
					}
					portalAd.end();
				}else{
					FileSystem.killObject(fileList);
					FileSystem.deleteDirectory("/storage/storage0/portalAd_temp");
					portalAd.end();
				}
			}else{
				FileSystem.deleteDirectory("/storage/storage0/portalAd_temp");
				portalAd.end();
			}
		}	
	},
	readAd:function(){  //读取配置表海报数据
		var data = null;
		try{		
			data = JSON.parse(readFile("/storage/storage0/portalAd/recommend2.json", 2));
		}catch(e){
			SumaJS.debug("portalAd readAd wrong");
			FileSystem.deleteDirectory("/storage/storage0/portalAd");
		}
		if(data != null) {
			this.adData = {};
			for(var i=0; i<data.length; i++){
				if(typeof data[i].identity != "undefined"
				&& typeof data[i].recommendData != "undefined"){
					this.adData[data[i].identity] = data[i].recommendData;
					this.versionInfo[data[i].identity] = data[i].version; //获取版本号
				}				
			}			
		}else{
			//FileSystem.deleteDirectory("/storage/storage0/portalAd");
			SumaJS.debug("========deleteDirectory portalAd 3============");		
		}			
	},
	eventHandler: function(event){  //消息事件
		var code = event.keyCode||event.which;
		SumaJS.debug("portalAd handle msg: "+code);
		var modifiers = event.modifiers;
		switch(code) {
			case 10151:  //已下载前端文件到内存中				
				if (portalAd && portalAd.picDownloadMaskId == modifiers) {
					SumaJS.debug("portalAd download success");
					var tempfile = FileSystem.getRemoteFile(portalAd.picDownloadMaskId);
					tempfile.close();
					SumaJS.debug("downloadImgList picFileName =" + portalAd.picFileName);
					portalAd.downloadImgFlag = true;
					tempfile.saveAs('/storage/storage0/portalAd_temp/' + portalAd.picFileName);
					//tempfile.saveAs('/storage/storage0/test_img/' + portalAd.picFileName);
					FileSystem.killObject(tempfile);
					portalAd.picDownloadMaskId = -1;
					portalAd.downloadPics();	
				}else if (menuDataAccessObj && menuDataAccessObj.picDownloadMaskId == modifiers) {
					SumaJS.debug("menuDataMsg2 download success");
					var tempfile = FileSystem.getRemoteFile(menuDataAccessObj.picDownloadMaskId);
					tempfile.close();
					SumaJS.debug("downloadImgList picFileName =" + menuDataAccessObj.picFileName);
					menuDataAccessObj.downloadImgFlag = true;
					tempfile.saveAs('/storage/storage0/menu_temp/' + menuDataAccessObj.picFileName);
					FileSystem.killObject(tempfile);
					menuDataAccessObj.picDownloadMaskId = -1;
					menuDataAccessObj.downloadPics();	
				}
				break;
			case 10153: //文件下载失败
				SumaJS.debug("portalAd download failed");
				if (portalAd && portalAd.picDownloadMaskId == modifiers) {
					SumaJS.debug("downloadImgList failed: "+portalAd.picFileName);
					portalAd.downloadPos = portalAd.downloadImgList.length;
					portalAd.downloadImgFlag = false;
					portalAd.picDownloadMaskId = -1;
					portalAd.downloadPics();	
				}else if(menuDataAccessObj.picDownloadMaskId == modifiers) {
					SumaJS.debug("menuDataMsg2 download failed");
					menuDataAccessObj.downloadPos = menuDataAccessObj.downloadImgList.length;
					menuDataAccessObj.downloadImgFlag = false;
					menuDataAccessObj.picDownloadMaskId = -1;
					menuDataAccessObj.downloadPics();	
				}
				break;
			case 10154:  //超时时间到，文件下载未完成
				SumaJS.debug("portalAd download timeout");
				if (portalAd && portalAd.picDownloadMaskId == modifiers) {
					SumaJS.debug("downloadImgList timeout: "+portalAd.picFileName);
					portalAd.downloadPos = portalAd.downloadImgList.length;
					portalAd.downloadImgFlag = false;
					portalAd.picDownloadMaskId = -1;
					portalAd.downloadPics();	
				}else if(menuDataAccessObj.picDownloadMaskId == modifiers){
					SumaJS.debug("menuDataMsg2 download timeout");
					menuDataAccessObj.downloadPos = menuDataAccessObj.downloadImgList.length;
					menuDataAccessObj.downloadImgFlag = false;
					menuDataAccessObj.picDownloadMaskId = -1;
					menuDataAccessObj.downloadPics();	
				}
				break;
			case 10101:
				SumaJS.debug("清除数据成功，确认开始配置表注入");
				var newOriginalArray = JSON.parse(readFile("/storage/storage0/siConfig/ServiceInfo.json", 3));
				if(!newOriginalArray){
					SumaJS.debug("配置表为空，配置表注入失败");	
				}else{
					var tempflag = inJectServiceInfo(newOriginalArray);	
				}
				break;
			case 10102:
				SumaJS.debug("清除数据失败，配置表注入失败");
				break;	
			case 10109:
				SumaJS.debug("数据保存成功");
				user.channels.save();	
			default:
				return true;
				break;
		}
	},
	
	channelEidt:function(){
		if(!portalAd.adData){return null}
		var chEidt = portalAd.adData['mainApp'];
		if(!chEidt || chEidt.length<=0){return null}
		for(var i =0; i<chEidt.length;i++){
			if(chEidt[i].identity == 'channel_edit'){
				var picSrc = chEidt[i].sourceData[0].img;
				if(picSrc){
					picSrc = picSrc.substr(picSrc.lastIndexOf("/"));
					return "file:////storage/storage0/portalAd"+picSrc;
				} 
			}
		}
	},
    
	getTypeArr: function(type){  //获取该种类型的图片数据数组	
		var imgArr = [];
		if(!portalAd.adData){return [];}
		if(!portalAd.adData[type]){return [];}
		var arr = portalAd.adData[type];
		for(var i=0; i<arr.length; i++){
            var t = arr[i].sourceData[0];
            //为了数据采集的需要增加字段
            t["windowId"] = arr[i].identity;
            t["windowName"] = arr[i].identity;
			imgArr.push(t);
			if(i==4&&arr[i].sourceData.length>1){
            	var t1 = arr[i].sourceData[1];
            	t1["windowId"] = arr[i].identity;
	            t1["windowName"] = arr[i].identity;
				imgArr.push(t1);
           }
		}
		for(var i=0;i<imgArr.length;i++){  //修改img属性为src可以调用的地址
			var imgValue = imgArr[i].img;
			var picName = imgValue.substr(imgValue.lastIndexOf("/") + 1);			
			imgArr[i].img = "file:////storage/storage0/portalAd/"+picName;
		}
		return imgArr;	
	},
	preLoadImg:function(imgArr){// 预加载图片
		var imgPic=[];
		for (var i=0; i<imgArr.length;i++) {
			imgPic[i]=new Image();
			imgPic[i].src=imgArr[i].img;
		}
		return imgPic;
	},

	refresh: function(){  //下载完成后调用该接口进行刷新。
		SumaJS.debug("portalAd refresh entered");
		if(typeof PageObj.recommendObj != "undefined" &&　typeof PageObj.recommendObj.initial != "undefined"){
			SumaJS.debug("portalAd refresh entered 2");
			PageObj.recommendObj.initial();
		}
	},
	
	end: function(){   //海报更新流程结束
		SumaJS.debug("portalAd end");
		menuDataAccessObj.aquireByAsync();  //开启菜单数据获取流程
	}
};

/**********************************海报推荐读取 END**********************************/

function isObjectValueEqual(a,b){  //用来判定两个对象是否相等
	var aProps = Object.getOwnPropertyNames(a);
	var bProps = Object.getOwnPropertyNames(b);
	if(aProps.length != bProps.length){return false;}
	for(var i=0;i<aProps.length;i++){
		var propName = aProps[i];
		if(a[propName] != b[propName]){
			return false;
		}
	}
	return true;
}









/**********************************获取推荐直播频道 START**********************************/
RecLiveChannel = {
	NetworkId: DVB.currentDVBNetwork ? DVB.currentDVBNetwork.networkID : -1,			//区域代码(String),必选
	RegionCode: CA.regionCode,				//区域代码(String),可选
	ClientId: CA.icNo,				//卡号,必选
	Info:{},
	RecList:{},
	isPushRec:false,
	Config:{},//上下键盲切配置
	lastPressTime:0,//上次按键时间
	lastPressKeyCode:0,//上次按键键值
	comboPressCount:0,//盲切间隔计数
	getData: function () {
		SumaJS.debug("RecLiveChannel getData entered");
		var ajaxParam = {
			url:UBAServerAdd + "/uba-online-mongodb/1.0/json/GetRecForChannel?RegionCode="+this.RegionCode+"&NetworkId="+this.NetworkId+"&ClientId="+this.ClientId,
			//url:  "http://192.166.65.165" + "/simulationData/GetRecForChannel.php",
			method:"GET",
			data:"",
			success: function (data) {
				SumaJS.debug("RecLiveChannel getData success");
				var datastr = data.responseText;
				SumaJS.debug("RecLiveChannel datastr = "+datastr);
				try{
					RecLiveChannel.Info = eval("("+datastr+")");
					//RecLiveChannel.Info = JSON.parse(datastr);
					if(typeof RecLiveChannel.Info.code != "undefined"){
						SumaJS.debug("ajax return RecLiveChannel info syntax error11");
					}else if(RecLiveChannel.Info.RecList){
						var recChannelInfo = SysSetting.getEnv("RECMMEND_CHANNEL_INFO");
						if(recChannelInfo =="" || JSON.parse(datastr).Version != JSON.parse(recChannelInfo).Version){
							SumaJS.debug("RecLiveChannel update");
							SysSetting.setEnv("RECMMEND_CHANNEL_INFO",datastr);
							saveJSONFile("/storage/storage0/RecChannel.json", RecLiveChannel.Info, 1);									
						}
					}					
				}catch(e){
					SumaJS.debug("ajax return RecLiveChannel info syntax error");
				}
				/***  开机视频播放移动到获取数据之前
				var thisIndex = menuDataAccessObj.getPageIndex();   
				if(thisIndex>=0 && thisIndex <=4){  //FIXME by zhuyangbing:临时解决方案，解决portal直接进全屏会先播小视频的问题，reviewedby liwenlei
					smallHomeVideo.playByOrder(7,0);
				}else{//全屏直播
				}
				****/
			},
			failed: function (data) {
				SumaJS.debug("RecLiveChannel getData failed");
				
				/***  开机视频播放移动到获取数据之前
				var thisIndex = menuDataAccessObj.getPageIndex();
				if(thisIndex>=0 && thisIndex <=4){  //首页的四个板块
					smallHomeVideo.playByOrder(7,0);
				}else{//全屏直播
				}
				******/
				
				//alert("ajax GetRecForChannel fail:"+JSON.stringify(data));
				//RecLiveChannel.Info = JSON.parse(readFile("/storage/storage0/RecChannel.json", 3)) ;
			}
		};
		SumaJS.ajax(ajaxParam);
		this.getUpDownKeyConfig();
		
	},
	getRecChannel: function (scene) {
		try{
			RecLiveChannel.Info = JSON.parse(readFile("/storage/storage0/RecChannel.json", 3));
		}catch(e){
			SumaJS.debug("parse RecLiveChannel info syntax error");
			FileSystem.deleteFile("/storage/storage0/RecChannel.json");  //解析失败删除json文件
			return null;
		}
		if(!this.Info){
			return null;
		}
		this.RecList = this.Info.RecList;
		var recLiveService = null;
		var favRecLiveChannelId = [];
		var currTime =(new Date()).getTime();
		var flag = false;
		if(scene == 8){
			for(var i = 0;i<this.RecList.length;i++){
				if(parseInt(this.RecList[i].SceneType) == scene ){
					if(currTime>= parseInt(this.RecList[i].StartTime) && currTime<parseInt(this.RecList[i].EndTime)){
						favRecLiveChannelId.push({"ChannelId":this.RecList[i].ChannelId})
					}
				}
			}
			return favRecLiveChannelId;
		}else{
			for(var i = 0;i<this.RecList.length;i++){
				if(parseInt(this.RecList[i].SceneType) == scene ){
					if(currTime>= parseInt(this.RecList[i].StartTime) && currTime<parseInt(this.RecList[i].EndTime)){
						recLiveService = SumaJS.getServiceByChannelId(parseInt(this.RecList[i].ChannelId));
					}
				}
			}
			return recLiveService;
		}
		
		return null;
		
	},
	pushRecChannel:function (scene){
		var recommendChannel = RecLiveChannel.getRecChannel(scene);
		if(!recommendChannel){
			this.isPushRec = false;
			return false;
		}
		//1、开机自当机顶盒启动后，自动进入全屏直播状态时；2、当用户从T型菜单首页进入“电视频道”时；3、当用户在全屏直播状态下连续按【上键】或【下键】切换若干次频道时；策略由推荐系统下发。
		//4、全局按电视键;5、首页按退出键;6、首页按返回键
		switch (scene){
			case 1:
				OffChannelObj.saveOffChannelToM(recommendChannel);
				changeTvMode = "11";
				break;
			case 2:
				OffChannelObj.saveOffChannelToM(recommendChannel);
				changeTvMode = "12";
				break;
			case 4:
				this.isPushRec = true;
				OffChannelObj.saveOffChannelToM(recommendChannel);
				changeTvMode = "14";
				break;
			case 5:
				OffChannelObj.saveOffChannelToM(recommendChannel);
				changeTvMode = "15";
				break;
			case 6:
				OffChannelObj.saveOffChannelToM(recommendChannel);
				changeTvMode = "16";
				break;
			case 7:   //主菜单视频小窗口
				OffChannelObj.saveOffChannelToM(recommendChannel);
				changeTvMode = "17";
				break;
			case 8:   //常看频道中的推荐频道
				changeTvMode = "18";
				return RecLiveChannel.getRecChannel(8);
				break;
			default :
				break;
		}
	},
	getUpDownKeyConfig:function(callBack){
		var ajaxParam = {
			url:UBAServerAdd+"/uba-online-mongodb/1.0/json/UpDownKeyConfig",
			method:"GET",
			data:"",
			success: function (data) {
				var datastr = data.responseText;
				//alert("ajax UpDownKeyConfig scc")
				 var configObj = eval("("+datastr+")");
				RecLiveChannel.Config = configObj.Config;
				if(RecLiveChannel.Config.code != "undefined"){
					SumaJS.debug("GetRecForChannel return "+ RecLiveChannel.Info)
				}else{
					callBack();
				}
				//alert(JSON.stringify(RecLiveChannel.Config))
			},
			failed: function (data) {
				//alert("ajax UpDownKeyConfig fail:"+JSON.stringify(data))
				RecLiveChannel.Config = {IsUsed:"1",Count:"5",Time:"1"};
			}
		};
		SumaJS.ajax(ajaxParam);
	},
	UpDownKeyChannelTrigger:function(keyCode){
		if(this.Config.IsUsed == 1){return false;}
		if(this.lastPressKeyCode ==  keyCode){
			var currPressTime = (new Date()).getTime();
			var pressTimeDuration = (currPressTime - this.lastPressTime)/1000;//以秒为单位
			(pressTimeDuration < this.Config.Time && pressTimeDuration >0.1)?this.comboPressCount++ :this.comboPressCount = 0;
			this.lastPressTime = (new Date()).getTime();
		}else{
			this.lastPressKeyCode = keyCode;
			this.comboPressCount = 0;
			this.lastPressTime = (new Date()).getTime();
		}
		if(this.comboPressCount >= (this.Config.Count-1) && this.getRecChannel(3)){
			this.comboPressCount = 0;
			this.lastPressTime = 0;
			changeTvMode = "13";
			return true;
		}else{
			return false;
		}
	},

};


//首页小视频对象
var smallHomeVideo = new function(){
	this.isNvodFlag = false;   //用来判断是否是配置表中的推荐频道是否是nvod频道
	this.isPlayingNvod = false;
	this.nvodObj = null; //nvod对对象 
	this.recService = null;  //前端推送的推荐频道
	this.siService = null;  //配置表配置的推荐频道
	var self = this;
	this.getRecService = function(recType){		//获取前端推送的推荐频道
		SumaJS.debug("smallHomeVideo getRecService entered");
		var thisService = RecLiveChannel.getRecChannel(recType);	
		SumaJS.debug("smallHomeVideo getRecService thisService = "+JSON.stringify(thisService));	
		if(thisService){
			return thisService;
		}else{
			return null;
		}
	};
	this.getSiServiceIncludeNvod = function(){		//获取包括nvod的配置表推荐频道
		SumaJS.debug("smallHomeVideo getSiServiceIncludeNvod entered");
		var thisService = null;
		if(originalArray && typeof originalArray.RecommonVideo!= "undefined") {
			var recArr = originalArray.RecommonVideo;
			if(typeof recArr[0].ChannelId != "undefined" && parseInt(recArr[0].ChannelId) > 0){  //存在且大于零
				thisService = SumaJS.getServiceByChannelId(recArr[0].ChannelId);
			}else{   
				if(this.judgeByParameter(recArr[0])){   //是nvod
					SumaJS.debug("getSiServiceIncludeNvod is nvod");
					this.isNvodFlag = true;
					this.nvodObj = recArr[0];
					thisService = recArr[0];
				}
			}			
		}else{
			return null;
		}
		return thisService;
	};
	this.getSiServiceExceptNvod = function(){	//获取不包括nvod的配置表推荐频道
		SumaJS.debug("smallHomeVideo getSiServiceExceptNvod entered");
		var thisService = null;
		if(originalArray && typeof originalArray.RecommonVideo!= "undefined") {
			SumaJS.debug("smallHomeVideo getSiServiceExceptNvod entered 1");
			var recArr = originalArray.RecommonVideo;
			if(typeof recArr[0].ChannelId == "undefined" || parseInt(recArr[0].ChannelId) <=0){  //ChannelId无效
				return null;					
			}else{
				thisService = SumaJS.getServiceByChannelId(parseInt(recArr[0].ChannelId));
			}			
		}else{
			return null;
		}
		return thisService;
	};
	this.getOffService = function(){    //获取关机频道
		SumaJS.debug("smallHomeVideo getOffService entered");
		var thisChannel = OffChannelObj.getOffChannel();
		SumaJS.debug("smallHomeVideo getOffService thisChannel = "+JSON.stringify(thisChannel));	
		if(thisChannel){
			var thisService = SumaJS.getServiceByLogicalChannelId(thisChannel.logicalChannelId);
			if(thisService){
				return thisService;
			}else{
				return null;
			}
		}else{
			return null;
		}
	};
	
	this.getNumber1 = function(){   //获取number为1的频道
		SumaJS.debug("smallHomeVideo getNumber1 entered");
		var thisService = SumaJS.getServiceByLogicalChannelId(1);
		SumaJS.debug("smallHomeVideo getNumber1 thisService = "+JSON.stringify(thisService));
		if(thisService){
			return thisService;
		}else{
			var allServices = SumaJS.getAllVideoServiceOrderByLogicalId();
			return allServices[0];
		}
	};
	
	this.hasRecService = function(recType,type){
        if(this.getRecService(recType)){
            return true;
        }
        return false;
    };
    this.hasSiService = function(recType,type){
        if(type == 0){
            if(this.getSiServiceIncludeNvod()){
                return true;
            }
        }else{
            if(this.getSiServiceExceptNvod()){
                return true;
            }
        }
        return false;
    };

	this.getServiceByOrder = function(recType,type){  //recType推荐频道类型,按照顺序获取要播放的频道, 0包括nvod，1不包括nvod
		if(this.getRecService(recType)){return this.getRecService(recType);}
		/*if(type == 0){  
			if(this.getSiServiceIncludeNvod()){
				return this.getSiServiceIncludeNvod();
			}
		}else{
			if(this.getSiServiceExceptNvod()){
				return this.getSiServiceExceptNvod();
			}
		}*/
		if(this.getOffService()){
			return this.getOffService();
		}
		if(this.getNumber1()){
			return this.getNumber1();
		}
		return null;
	};
	this.getServiceWhenEnterPlayTv = function(recType){  //退出，返回，电视键进全屏时顺序获取service,无配置表推荐
		if(this.getRecService(recType)){return this.getRecService(recType);}
		if(this.getOffService()){return this.getOffService();}
		if(this.getNumber1()){return this.getNumber1();}
		return null;
	};
	
	this.getRecOrSiService = function(recType){  //按照顺序获取前端推荐或者配置表推荐频道
		if(this.getRecService(recType)){return this.getRecService(recType);}  
		//if(this.getSiServiceExceptNvod()){return this.getSiServiceExceptNvod();}
		//if(this.getSiServiceIncludeNvod()){return this.getSiServiceIncludeNvod();}
		return null;
	};
	
	this.playByOrder = function(recType,type){   //按照顺序播放, 0包括nvod，1不包括nvod
        var self = this;
		var thisService = this.getServiceByOrder(recType,0);
		SumaJS.debug("playByOrder thisService = "+JSON.stringify(thisService));
		if(!this.isNvodFlag){   //判定是否是nvod
			this.playService(thisService);
			 setTimeout(function(){
				if(thisService){
					if(self.hasRecService(recType,0)){
						changeTvMode = "25";
					}else if(self.hasSiService(recType,0)){
						changeTvMode = "27";
					}else{
						changeTvMode = "28";
					}
					DataCollection.collectData(["04", thisService.channelId + "", thisService.serviceName, thisService.serviceId + "", thisService.networkId + "", thisService.tsInfo.TsId + "", changeTvMode, playTvStatus]);
					changeTvMode = "00";//由于此接口仅仅是在进入index.html是调用一次，所以上报后清零
				}
			},1500);
		}else{
			this.playNvod(thisService);
		}		
       
	};
	
	
	this.getNvodFlag = function(){  //获取nvod标志位
		return this.isNvodFlag;
	};
	this.getNvodObj = function(){   //获取nvod对象
		return this.nvodObj;
	};
	
	this.judgeByParameter = function(obj){   //根据六个参数判断是否是合法的nvod对象			
		SumaJS.debug("judgeByParameter entered");
		if(typeof obj.ServiceId != "undefined" && typeof obj.VideoPid != "undefined" 
			&& typeof obj.AudioPid != "undefined" && typeof obj.Frequency != "undefined" 
			&& typeof obj.SymbolRate != "undefined" && typeof obj.Modulation != "undefined"){
				if(parseInt(obj.ServiceId) > 0 && parseInt(obj.VideoPid) > 0 && parseInt(obj.AudioPid) > 0 &&
					parseInt(obj.Frequency) > 0 && parseInt(obj.SymbolRate) > 0 && parseInt(obj.Modulation) > 0){
						return true;
					}
				
			}
		return false;
	};
	
	this.getIsPlayingNvod = function(){
		return this.isPlayingNvod;
	};
	this.setIsPlayingNvod = function(status){
		this.isPlayingNvod = status;
	};
	
	
	this.playService = function(service){   //播放service
		if(!service){return;}		
		SumaJS.debug("smallHomeVideo playService serviceName = "+service.serviceName);
		if(!SumaJS.globalPlayer){
			SumaJS.createPlayer();
		}
		setMediaplayer(2);
		currentService = service;
		SumaJS.globalPlayer.playService(currentService);		
		//this.isPlayingNvod = false;
		this.setIsPlayingNvod(false);
		DVB.tune(currentService.tsInfo.Frequency,currentService.tsInfo.SymbolRate,currentService.tsInfo.Modulation);
	};
	this.playNvod = function(obj){     //播放nvod
		if(!obj){return;}
		if(!SumaJS.globalPlayer){
			SumaJS.createPlayer();
		}		
		var source = "delivery://" + obj.Frequency +"."+ obj.SymbolRate +"."+ obj.Modulation +"."+ obj.ServiceId +"."+ obj.VideoPid +"."+ obj.AudioPid;
		SumaJS.debug("playNvod source = "+source);
		currentService = null;
		SumaJS.globalPlayer.playNvodService(obj);
		//setMediaplayer(2);
		//this.isPlayingNvod = true;
		this.setIsPlayingNvod(true);
		
		DVB.tune(obj.Frequency,obj.SymbolRate,obj.Modulation);
	};
	function setMediaplayer(type){  //设置播放器模式和位置
		if (SumaJS.globalPlayer && type == 2) {
			SumaJS.globalPlayer.setFocusState(1);
			//setTimeout(function(){SumaJS.globalPlayer.setVideoDisplayArea("0, 83, 153, 380, 215");},10);
			SumaJS.globalPlayer.setVideoDisplayArea("0, 40, 162, 386, 280");
            SumaJS.globalPlayer.refresh();
		} else if(!SumaJS.globalPlayer && type == 1){
			SumaJS.createPlayer();
		}
	};
	/*
	this.eventHandler = function(event){
		var val = event.keyCode||event.which;
		var event_modifer = parseInt(event.modifiers);
		SumaJS.debug("====smallHomeVideo message === which["+val+"]"); 
		switch(val){
			case MSG_DVB_TUNE_SUCCESS:  //锁频成功
				SumaJS.debug("====smallHomeVideo MSG_DVB_TUNE_SUCCESS"); 
				if(currentService){
					SumaJS.globalPlayer.playService(currentService);
				}else if(self.getNvodFlag()){
					SumaJS.debug("self.getNvodFlag() is true");
					var obj = self.getNvodObj();
					var source = "delivery://" + obj.Frequency +"."+ obj.SymbolRate +"."+ obj.Modulation +"."+ obj.ServiceId +"."+ obj.VideoPid +"."+ obj.AudioPid;
					SumaJS.debug("MSG_DVB_TUNE_SUCCESS playNvod source = "+source);
					SumaJS.globalPlayer.playNvodService(obj);
				}
				this.end();
				return false;
			case MSG_DVB_TUNE_FAILED:  //锁频失败
				SumaJS.debug("====smallHomeVideo MSG_DVB_TUNE_FAILED"); 
				this.end(); 
				return false;
			default:
				return true;
			}
		return true;
	};
	this.start = function(){
		SumaJS.eventManager.addEventListener("smallHomeVideo", this, 48);
	};
	this.end = function(){
		SumaJS.eventManager.removeEventListener("smallHomeVideo");
	};
	*/
	
	this.showCover = function(cfg){   //显示由于锁频失败的提示消息
		SumaJS.getDom("tv_page_small_video_cover_msg").innerHTML = !cfg.msg? "":cfg.msg;
		SumaJS.getDom("tv_page_small_video_cover").style.display = "block";
	};
	this.hideCover = function(){  //隐藏由于锁频失败的提示消息
		SumaJS.getDom("tv_page_small_video_cover").style.display = "none";
	};
	this.showCACover = function(cfg){    //显示CA信息
		SumaJS.getDom("tv_page_small_video_cover_msg_ca").innerHTML = !cfg.msg? "":cfg.msg;
		SumaJS.getDom("tv_page_small_video_cover_ca").style.display = "block";
	};
	this.hideCACover = function(){   //隐藏CA信息
		SumaJS.getDom("tv_page_small_video_cover_ca").style.display = "none";
	};
};



