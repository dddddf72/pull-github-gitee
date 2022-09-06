SumaJS.extend({
	//参数格式"yyyy-MM-dd hh:mm:ss w"
	dateFormat : function(dateObj, format) {
		//var weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
		var weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
		var date = {
			"M+" : dateObj.getMonth() + 1,
			"d+" : dateObj.getDate(),
			"h+" : dateObj.getHours(),
			"m+" : dateObj.getMinutes(),
			"s+" : dateObj.getSeconds(),
			"w+" : weekDays[dateObj.getDay()],
			"S+" : dateObj.getMilliseconds()
		};
		if (/(y+)/i.test(format)) {
			format = format.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length));
		}
		for (var k in date) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
			}
		}
		return format;
	},
	getQueryStr : function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return unescape(r[2]);
		return null;
	},
	//参数格式：{url: "", method: "GET", data: "", succss: func, failed: func}
	ajax : function(params) {
		var url = params.url;
		var method = params.method || "GET";
		var data = params.data || "";
		var async = params.async !== false;
		var success = params.success || function(){};
		var failed = params.failed || function(){};
		var maskId = typeof params.maskId != "undefined" ? params.maskId : parseInt((new Date()).getTime()+""+parseInt(Math.random()*1000));

		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4) {// 已收到响应
				if (xmlHttp.status == 200 ) {// 请求成功
					success(xmlHttp);
				}else{
					if(xmlHttp.responseText && xmlHttp.responseText.length>0){
						success(xmlHttp);
					}else{
						failed(xmlHttp);
					}
				}
			}
		};
		xmlHttp.maskId = maskId;

		xmlHttp.open(method, url, async);

		if (method.toLowerCase() == "post") {
			xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xmlHttp.send(data);
		} else {
			xmlHttp.send(null);
		}
		return xmlHttp;
	},
	
	undefinedReplacer : function(content,substitute){
		return (typeof(content)=="undefined")  ? substitute : content;
	},
	
	showMsgBox : function(cfg) {
		if (!SumaJS.msgBox) {
			var msgBox = new MessageBox();
			SumaJS.msgBox = msgBox;
			SumaJS.eventManager.addEventListener("messageBox", msgBox, 30);
		}
		SumaJS.msgBox.createBox(cfg);
	},
	
	getDom :function(id) {
		return document.getElementById(id);
	},
	
	$: function(param){
		if(typeof param != "string"){return null;}
		param = param.split(" ");
		var result = document;
		for(var i=0;  i<param.length; i++){
			switch(param[i][0]){
				case ".":		//classname
					result = result.getElementsByClassName(param[i].substr(1));
					break;
				case "#":		//ID
					result = result.getElementById(param[i].substr(1));
					break;
				default:		//tagname
					result = result.getElementsByTagName(param[i]);
					break;
			}
		}
		return result;
	},
	hasClass: function (obj,cls) {//判断元素是否有此class
		return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	},
	addClass: function (obj,cls) {//为元素增加class
		if (!this.hasClass(obj, cls)) {
			obj.className += " " + cls;
		}
	},
	padString : function(str,replaceChar,length) {
		var str = ""+str;
		for( var i = str.length; i < length; i++) {
			str = replaceChar + str;
		}
		return str;
	},
	
	preloadImages: function(imgList) {
		//var imgList = imgArr[indexStr];
		if(!imgList || typeof imgList == "undefined"){
			return;
		}
        var d = document;
        if (!d.preImgs) {
            d.preImgs = [];
        }
        for (var i = 0; i < imgList.length; i++) {
			if(!imgList[i]){continue;}
			var img = new Image();
            img.src = imgList[i];
            d.preImgs.push(img);
        }
    },
	
	createPlayer: function() {
        SumaJS.globalPlayer = new Player({
			onPlaySuccess : function() {
				//checkLock();
			},
			onPlayFailed : function() {
				//checkLock();
			}
		});
    },
	
	stopPlayer: function(state) {
		var state = state || 0;
		if(SumaJS.globalPlayer){
			SumaJS.globalPlayer.pause(state);	
		}
	},
	
	releasePlayer: function() {
		if(SumaJS.globalPlayer){
			SumaJS.globalPlayer.release();
			SumaJS.globalPlayer = null;	
		}	
	},
	
	getServiceInfo : function() {
		//不包括隐藏节目
		this.globalServiceInfo = getServiceInfo(1);
		this.addTimeshiftInfo();
	},
	getServiceInfoExceptAudioService : function() {
		//所有非音频节目;
		var services =[];
		if(this.globalServiceInfo){
			for(var i=0;i<this.globalServiceInfo.length;i++){
				var tempServices = this.globalServiceInfo[i].services;
				for(var j=0;j<tempServices.length;j++){
					if(tempServices[j].serviceType != 2){
						services.push(tempServices[j]);
					}
				}
			}
		}
		//return services;
		var newServices = this.unique(services);
		return newServices;
	},
	
	getAllVideoServiceOrderByLogicalId : function(){   //获取非常音频 并按照logicalChannelId排序
		if(!this.globalServiceInfo){
			this.getServiceInfo();	
		}
		var allVideoServices = this.getServiceInfoExceptAudioService();
		for (var j = 0; j < allVideoServices.length - 1; j++) {
			for (var k = j + 1; k < allVideoServices.length; k++) {
				if (parseInt(allVideoServices[j].logicalChannelId, 10) > parseInt(allVideoServices[k].logicalChannelId, 10)) {
					var temp = allVideoServices[j];
					allVideoServices[j] = allVideoServices[k];
					allVideoServices[k] = temp;
				}
			}
		}
		return allVideoServices;
	},
	
	getServiceByChannelId : function(channelId){
		if(!channelId){return null;}
		//通过channelId来查找对应频道service
		if(!this.globalServiceInfo){
			this.getServiceInfo();	
		}	
		var allServiceExceptAudio = this.getServiceInfoExceptAudioService();		
		for(var i=0; i<allServiceExceptAudio.length; i++){		
			if(parseInt(allServiceExceptAudio[i].channelId) == parseInt(channelId)){
				return allServiceExceptAudio[i];
			}
		}
		return null;
	},
	
	getServiceByLogicalChannelId : function(logicalChannelId){
		if(!logicalChannelId){return null;}
		//通过logicalChannelId来查找对应频道service
		if(!this.globalServiceInfo){
			this.getServiceInfo();	
		}
		/*		
		for(var i=0; i<this.globalServiceInfo.length; i++){
			for(var j=0; j<this.globalServiceInfo[i].services.length; j++){
				if(parseInt(this.globalServiceInfo[i].services[j].logicalChannelId) == parseInt(logicalChannelId)){
					return this.globalServiceInfo[i].services[j];
				}
			}
		}
		*/
		var allServiceExceptAudio = this.getServiceInfoExceptAudioService();
		for(var i=0; i<allServiceExceptAudio.length; i++){		
			if(parseInt(allServiceExceptAudio[i].logicalChannelId) == parseInt(logicalChannelId)){
				return allServiceExceptAudio[i];
			}
		}
		return null;
	},
	getFullServices : function(){
		this.fullGlobalServiceInfo = getServiceInfo(0);
	}, 
	getAllService: function(sortType){
		//sortType 0:channelId  1:logicalChannelId 
		if(this.globalServiceInfo == null) {
			//this.getFullServices();
			this.getServiceInfo();
		}
		
		var tempAllService = [];
		for(var i=0,len=this.globalServiceInfo.length; i<len; i++) {
			var tempServices = this.globalServiceInfo[i].services;
			for(var j=0,size=tempServices.length;j<size;j++){
				var tempSer = tempServices[j];
				var sortIndex = tempSer.channelId;
				if(sortType == 1) {
					sortIndex = tempSer.logicalChannelId
				}
				sortIndex = parseInt(sortIndex, 10);
				if(!tempAllService[sortIndex]) {
					tempAllService[sortIndex] = tempSer;
				}
			}
		}
		this.allService = [];
		for(var i=0,len = tempAllService.length; i<len;i++){
			if(tempAllService[i]) {
				this.allService.push(tempAllService[i]);
			}
		}
		return this.allService;
	},
	showDateTime: function (timeId,dataId,type) {
		var dd = new Date();
		if (dd.getFullYear() < 1971) {
			return false;
		}//时间获取错误就不显示
        var timeDom = document.getElementById(timeId);
        if(timeDom) {
            if (type == 1) {
                timeDom.innerHTML = this.dateFormat(dd, "hh:mm:ss");
            } else {
                timeDom.innerHTML = this.dateFormat(dd, "hh:mm");
            }
        }
        var dataDom = document.getElementById(dataId);
        if(dataDom) {
            dataDom.innerHTML = this.dateFormat(dd, "MM") + "月" + this.dateFormat(dd, "dd") + "日  " + this.dateFormat(dd, "w");
        }
		var self = this;
		var pageObj = this.getCurrentPageObj();
		if (pageObj) {
			pageObj.timerManager.add("showDateTime", new TimerTask(function() {
				self.showDateTime(timeId,dataId,type);
			}, 1000));
		}
	},
	addTimeshiftInfo : function(){
		var timeshitChannel = readFile("/storage/storage0/vod/Timeshift.json", 3);
		if(timeshitChannel) {
			//SumaJS.debug("timeshitChannel info = "+timeshitChannel);
			try {
				timeshitChannel = JSON.parse(timeshitChannel).TimeShiftChannels;
			} catch(e){
				SumaJS.debug("timeshitChannel info syntax error");
				return;
			}
			if(timeshitChannel && timeshitChannel.length>0){ 
				for(var i=0,len = this.globalServiceInfo.length;i<len;i++){
					var tempSerArray = this.globalServiceInfo[i].services;
					for(var j=0,size=tempSerArray.length;j<size;j++) {
						this.globalServiceInfo[i].services[j].playback = 0;
						for(var ii=0,timshiftLen=timeshitChannel.length; ii<timshiftLen;ii++){
							if(timeshitChannel[ii].ChannelId == tempSerArray[j].channelId) {
								this.globalServiceInfo[i].services[j].playback = 1;
								break;
							}
						}
					} 		
				}
			}
		}
	},
    str:{
        undefinedReplacer: function(input, replace){
            return (typeof(input)=="undefined")  ? replace : input;
        }
    },
    access:function(_class,_attr,_val) {
        if (_val == null) {
            var result = DataAccess.getInfo(_class, _attr);
            //this.debug.Msg("GET CLASS:"+_class+" ATTR:"+_attr+"VAL:"+result,4,"DateAccess Debug")
            return result;
        } else {
            var result = DataAccess.setInfo(_class, _attr, _val)
            //this.debug.Msg("SET CLASS:"+_class+" ATTR:"+_attr+"VAL:"+_val,4,"DateAccess Debug")
            if (result) {
                // this.debug.Msg("SAVE CLASS:"+_class+" ATTR:"+_attr,4,"DateAccess Debug")
                return DataAccess.save(_class, _attr)
            } else {
                //this.debug.Msg("SET CLASS:"+_class+" ATTR:"+_attr+"VAL:"+_val,1,"DateAccess Error")
                return 0;
            }

        }
    },
	unique: function(arr) {    //根据serviceHandle去重
		var result = [], isRepeated;
		for (var i = 0, len = arr.length; i < len; i++) {
			isRepeated = false;
			for (var j = 0, len1 = result.length; j < len1; j++) {
				if (parseInt(arr[i].serviceHandle) == parseInt(result[j].serviceHandle)) {   
					isRepeated = true;
					break;
				 }
			}
			if (!isRepeated) {
				 result.push(arr[i]);
			}
		 }
		 return result;
	}
});
