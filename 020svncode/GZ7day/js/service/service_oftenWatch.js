
//常看频道控制对象
var oftenWatchObj = new function(){
	var self = this;
	this.folderUrl = "/storage/storage0/oftenWatch";  //文件夹路径
	this.fileUrl = "/storage/storage0/oftenWatch/oftenWatchDatas.json"; //文件路径
	this.ajaxFlag = false;  //判断是否从ajax获取过
	this.userChannelCount = 0; //用户自设常看频道个数
	this.userChannels = [];  //用户自设常看频道
	this.recChannels = []; //前端推送的常看频道
	this.getUserArray = function(){
		return this.userChannels;
	};
	this.getRecArray = function(){
		return this.recChannels;
	};
	this.getUserChannelsByAjax = function(fn){  //从前端获取用户自设的常看频道，fn为回调函数。
		var currTime = new Date();
		var netid = DVB.currentDVBNetwork ? DVB.currentDVBNetwork.networkID : -1;
		var url = UBAServerAdd + "/uba-searchReseed/1.0/json/GetFavChannels?ClientId="+CA.icNo + "&RegionCode=" + CA.regionCode + "&NetworkId=" + netid;
		//var url = "http://192.168.88.102"+"/uba-online-zsbtv/1.0/json/GetFavChannels.php";
		//alert("url = "+url);
		var ajaxParam = {
			url: url,
			method: "GET",
			async:false, //同步获取
			data: "",
			success: function (data) {				
				SumaJS.debug("oftenWatchObj getUserChannelsByAjax success");				
				var filestr = data.responseText;
				//alert("success = "+filestr);
				SumaJS.debug("oftenWatchObj filestr = "+filestr);
				var jsonObj;
				try {
					//jsonObj = eval("(" + filestr + ")");
					jsonObj = JSON.parse(filestr);
					
					/*
					if(jsonObj.Channels){
						self.userChannelCount = jsonObj.Channels.length;
					}
					self.userChannels = jsonObj.Channels;
					*/
					//获取成功后保存到json文件
					self.saveToJson(jsonObj);
					
				}catch(e){
					SumaJS.debug("oftenWatchObj GetFavChannels but can not parse: " + e.toString());
					//return;
				}
				if(typeof fn == "function"){
					fn();
				}

			},
			failed: function (data) {
				//alert("failed ");
				SumaJS.debug("oftenWatchObj getUserChannelsByAjax failed");
				if(typeof fn == "function"){
					fn();
				}
				//alert(JSON.stringify(data));
			}
		}
		this.ajaxFlag = true;
		SumaJS.ajax(ajaxParam);
	};
	this.saveToJson = function(obj){    //保存到json文件
		SumaJS.debug("oftenWatchObj saveToJson entered");
		var flag = true;
		var dirObj = FileSystem.createDirectory(self.folderUrl);
		if(dirObj == 0){
			flag = false;
			SumaJS.debug("========createDirectory oftenWatch failed============");
		}else if(dirObj == -1){
			FileSystem.deleteDirectory(self.folderUrl);
			SumaJS.debug("========deleteDirectory oftenWatch 5============");
			FileSystem.createDirectory(self.folderUrl);
		}
		if(flag){
			saveJSONFile(this.fileUrl, obj, 1);
			this.getUserChannelsByJson();
		}
	};
	this.sortByOrder = function(arr){  //按照order属性进行排序
		
	};
	this.getUserChannelsByJson = function(){   //从json文件中获取用户自设的常看频道。
		SumaJS.debug("oftenWatchObj getUserChannelsByJson entered");
		var data = null;
		try{	
			var str = readFile(self.fileUrl, 3);
			SumaJS.debug("oftenWatchObj read oftenWatchDatas str: "+str);
			data = JSON.parse(str);
			data.Channels = this.unique(data.Channels);
			//alert(JSON.stringify(data.Channels));
			SumaJS.debug("oftenWatchObj read oftenWatchDatas data: "+JSON.stringify(data));
			if(data != null && typeof data.Channels != "undefined") {				
				var channelArray = data.Channels;
				this.userChannels = channelArray;
				SumaJS.debug("oftenWatchObj read channelArray: "+JSON.stringify(channelArray));
			}else{
				FileSystem.deleteDirectory(self.folderUrl);
				SumaJS.debug("========deleteDirectory oftenWatch 3============");
				if(!this.ajaxFlag){
					this.getUserChannelsByAjax();  //解析失败从前端获取
				}else{
					SumaJS.debug("oftenWatchObj failed");
				}			
			}
		}catch(e){
			FileSystem.deleteDirectory(self.folderUrl);
			SumaJS.debug("oftenWatchObj getUserChannelsByJson wrong");
			if(!this.ajaxFlag){
				this.getUserChannelsByAjax();  //解析失败从前端获取
			}
		}
					
	};
	this.getRecChannels = function(){  //获取前端推送的常看频道
		this.recChannels = RecLiveChannel.pushRecChannel(8);
	};
	this.setOftenChannel = function(service){  //将某频道设置为常看频道
		if(this.userChannelCount>=20){
			alert("常看已满，请清理");
		}else{
			this.saveOftenChannels(service);
		}
	};
	this.saveOftenChannels = function(service){
		
	};
	this.sendModifyByAjax = function(serviceArr){  //修改保存用户自设
		if(!isArray(serviceArr)){return;}
		var netid = DVB.currentDVBNetwork ? DVB.currentDVBNetwork.networkID : -1;
		var data = {"clientID":CA.icNo,"RegionCode":CA.regionCode,"NetworkId":netid,"channels":[]};
		for(var i=0,len = serviceArr.length;i<len;i++){
			var tmp = serviceArr[i];
			//data.channels.push({"ChannelId":tmp.channelId,"Order":i+1});
			if(this.checkChannelId(tmp) == 1){   //添加channelId的合法性判断
				data.channels.push({"ChannelId":tmp.channelId,"Order":i+1});
			}
		}
		data.channels = this.unique(data.channels);
		var jsonStr = JSON.stringify(data);
		SumaJS.debug("@@@ jsonStr="+jsonStr);			
		var url = UBAServerAdd + "/uba-searchReseed/1.0/json/SetFavChannels?ClientId="+CA.icNo + "&RegionCode=" + CA.regionCode + "&NetworkId=" + netid;
		var sendCfg = {
			url:url,
			method:"POST",
			async:true,
			data:jsonStr,
			success:function(action){
				var text = action.responseText;
				SumaJS.debug("oftenWatchObj sendModifyByAjax success result="+text);
			},
			failed:function(action){
				SumaJS.debug("oftenWatchObj sendModifyByAjax failed");
			}
		};
		SumaJS.ajax(sendCfg);		
	};
	
	this.modifyToJson = function(serviceArr){   //修改到json文件
		var data = {"clientID":CA.icNo,"Channels":[]};
		for(var i=0,len = serviceArr.length;i<len;i++){
			var tmp = serviceArr[i];
			//data.Channels.push({"ChannelId":tmp.channelId,"Order":i+1});
			if(this.checkChannelId(tmp) == 1){   //添加channelId的合法性判断
				data.Channels.push({"ChannelId":tmp.channelId,"Order":i+1});
			}
		}
		data.Channels = this.unique(data.Channels);
		SumaJS.debug("modifyToJson data = "+JSON.stringify(data));
		saveJSONFile(this.fileUrl, data, 1);
		
		//this.sendModifyByAjax(data.Channels);
	};
	
	this.concatUserAndRecChannels = function(userArr,recArr){  //组合用户自设和前端推送的频道，取20个
		if(isArray(userArr)){
			if(isArray(recArr)){
				var AllArr = userArr.concat(recArr);		
				var totalArr = this.unique(AllArr);
				return totalArr.slice(0,20);
			}else{
				return userArr;
			}
			
		}else if(isArray(recArr)){
			return recArr;
		}else{
			return [];
		}
		
	};

	this.unique = function(arr) {    //根据channelId去重
		if (arr.length>1) {
			var result = [], isRepeated;
			for (var i = 0, len = arr.length; i < len; i++) {
				isRepeated = false;
				for (var j = 0, len1 = result.length; j < len1; j++) {
					if (parseInt(arr[i].ChannelId) == parseInt(result[j].ChannelId)) {   
						isRepeated = true;
						break;
					 }
				}
				if (!isRepeated) {
					 result.push(arr[i]);
				}
			 }
			 return result;
		}else{
			return arr;
		}
	};
	this.checkChannelId = function(service){  //根据channelId检测是否合法
		if(parseInt(service.channelId) <=0){return 0;}
		var allServices = SumaJS.getAllVideoServiceOrderByLogicalId();
		for(var i=0;i<allServices.length;i++){
			if(parseInt(allServices[i].channelId) == parseInt(service.channelId)){
				return 1;
			}
		}
		return 0;
	};
};