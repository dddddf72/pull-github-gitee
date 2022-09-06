/**
	整理一些功能的函数，用于其他地方的调用
**/

//获取传递的参数
function getParameter(param){
	param = param.toLowerCase();
	var query = window.location.search; //获取URL"?"后面的字符串
	if(query.length==0){
		return "";
	}else{
		query = query.toLowerCase();
		var iLen = param.length;
		var iStart = query.indexOf(param+"=");
		if (iStart == -1) //判断是否有那个需要查询值的传递参数
			return ""; //没有就返回一个空值
		iStart += iLen + 1;
		var iEnd = query.indexOf("&", iStart); //判断是不是带有多个参数   &为多个参数的连接符号
		if (iEnd == -1) {
			return query.substring(iStart);
		}
		return query.substring(iStart, iEnd);
	}
}

//将版本信息提交给前端
function StbRegister(tempOriginalArray){
	SumaJS.debug("StbRegister");
	if(tempOriginalArray == null){
		return;
	}
	if (typeof tempOriginalArray.NetworkManager != "undefined") {
		//SumaJS.debug("NetworkManager = "+JSON.stringify(originalArray.NetworkManager));
		var managerAdress = tempOriginalArray.NetworkManager.ManagerAdress;
		var managerPort = tempOriginalArray.NetworkManager.ManagerPort;
		var requestUrl = "http://"+managerAdress+ ":" + managerPort + "/StbRegister";
		var ethArr = Network.ethernets;
		var OTAinfo = JSON.parse(readFile("/storage/storage0/UpgradeVersion.json",3));
		var oldSoftVer = OTAinfo.UpgradeVersion;
		var oldMiddlewareVer = OTAinfo.middlewareVersion;
		var oldMainAppVer = OTAinfo.mainAppVersion;
		if(ethArr.length > 0){
			var enableEth = ethArr[0];
			var postData ='<?xml version="1.0" encoding="UTF-8" ?><StbRegister serialNumber="'+SysInfo.STBSerialNumber+'" smartCardID="'+CA.icNo+'" macAddress="'+enableEth.MACAddress+'" appVersion="'+STB_VERSION_INFO.versionNo+'" middlewareProvider="'+Middleware.name+'" middlewareVerison="'+Middleware.version+'" stbSoftwareVersion="'+SysInfo.softwareVersion+'" SITableVersion="'+tempOriginalArray.Version+'" stbProvider="'+SysInfo.STBProvider+'" regionCode="'+CA.regionCode+'" stbType="'+SysInfo.STBType+'" oldAppVersion="'+oldMainAppVer+'" oldMiddlewareVerison="'+oldMiddlewareVer+'" oldStbSoftwareVersion="'+oldSoftVer+'" />';
		
			var ajaxParam = {
				url : requestUrl,	
				method: "POST",
				data: postData,
				succss: function(){
					var middlewareVersion = Middleware.version;
					var mainAppVersion = STB_VERSION_INFO.versionNo;
					saveJSONFile("/storage/storage0/UpgradeVersion.json", {"UpgradeVersion": SysInfo.softwareVersion, "middlewareVersion": middlewareVersion, "mainAppVersion": mainAppVersion}, 1);							
				},
				failed: function(data){}
			}
			SumaJS.ajax(ajaxParam);				
		}
	}
}

//检查智能卡
var IcCard = {
	icCard:CA.icNo,
	noICCard:false,
	changeICCard:false,
	invalidFlag:true,
	timeOut:5000,
	checkICCard:function(){
		if(CA.icNo==""||CA.icNo==null){
			IcCard.noICCard=true;
			//showGlobalMsgBox("请插入智能卡");
            gMsgBoxMgr.showTipBox({id:"ca_info",msg:"请插入智能卡"});
		}else if(CA.icNo!=IcCard.icCard){
			if (IcCard.icCard) {
				IcCard.changeICCard = true;
				//showGlobalMsgBox("已更换智能卡");
                gMsgBoxMgr.showTipBox({id:"ca_info",msg:"已更换智能卡"});
			}
			if (CA.icNo) {
				IcCard.icCard = CA.icNo;
			}
		}else if(CA.icNo==IcCard.icCard && IcCard.noICCard==true){
			IcCard.noICCard = false;
			IcCard.changeICCard = false;
			//SumaJS.msgBox.removeMsg("global_tip_box");
            gMsgBoxMgr.removeBox("ca_info");
		}
	}
}	

//显示全局消息提示框
function showGlobalMsgBox(msg, okFucntion) {
	var retCfg = {
		name : "global_tip_box",
		priority : 13,
		boxCss : "info",
		titleObj : {
			title : "",
			style : "title"
		},
		msgObj : {
			msg : msg,
			css : "alert_msg"
		},
		okButObj : {
			css : "alert_ok_btn",
			click : function(theBox) {
				if(!originalArray){
					window.location.reload();
				}
				if(okFucntion){okFucntion();};
				theBox.removeMsg("global_tip_box");
				return false;
			}
		},				
		eventHandler : function(event) {
			if (this.focus && event.source != 1001) {
				var keyCode = event.keyCode||event.which;
				switch (keyCode) {
				case KEY_ENTER:
				case KEY_BACK:
				case KEY_EXIT:
					this.onclick(this);
					break;
				default:
					return false;
					break;
				}
				return false;
			} else {
				return true;
			}
		}
	};
	SumaJS.showMsgBox(retCfg);
}
//选择消息弹出框
function selectMsgBox(name, title, msg, okfunction, cancelfunction){
	var cfg = {
		name : name,
		priority : 10,
		boxCss : "confirm",
		titleObj : {
			title : title,
			style : "title_confirm"
		},
		msgObj : {
			msg : msg,
			css : "msg_box_confirm"
		},
		okButObj : {
			css : "confirm_determine_btn",
            title:"确认",
			focus : function(theBox) {
				theBox.getOkButDomObj().style.backgroundImage = "url(images/message_box/confirm_focus.png)";
			},
			blur : function(theBox) {
				theBox.getOkButDomObj().style.backgroundImage = "";
			},
			click : function(theBox) {
				theBox.removeMsg(name);
				if(okfunction){
					okfunction();
				}
				return false;
			}
		},
		cancelButObj : {
			css : "confirm_cancel_btn",
            title:"取消",
			focus : function(theBox) {
				theBox.getCancelDomObj().style.backgroundImage = "url(images/message_box/confirm_focus.png)";
			},
			blur : function(theBox) {
				theBox.getCancelDomObj().style.backgroundImage = "";
			},
			click : function(theBox) {
				theBox.removeMsg(name);
				if(cancelfunction){
					cancelfunction();
				}
				return false;
			}

		},
		eventHandler : function(event) {
			if (this.focus && event.source != 1001) {
				var keyCode = event.keyCode||event.which;
				switch (keyCode) {
				case KEY_LEFT:
					this.okButFocus();
					this.cancelButBlur();
					break;
				case KEY_RIGHT:
					this.cancelButFocus();
					this.okButBlur();
					break;
				case KEY_ENTER:
					this.click();
					break;
				default:
					return false;
					break;
				}
				return false;
			} else {
				return true;
			}
		}
	};
	SumaJS.showMsgBox(cfg);		
}

//新增消息提示框
gMsgBoxMgr = new function(){
    var self = this;
    this.showTipBox = function(cfg){
        var id = !cfg.id?"":cfg.id;
        var type = !cfg.type? 2:cfg.type;
        function defaultOkBtnFunc(event){
            if (this.focus && event.source != 1001) {
                var keyCode = event.keyCode || event.which;
                switch (keyCode) {
                    case KEY_ENTER:
                    case KEY_BACK:
                    case KEY_EXIT:
                        this.onclick(this);
                        break;
                    default:
                        return false;
                        break;
                }
                return false;
            }else{
                return true;
            }
        }
        var retCfg = {
            name: id,
            priority: !cfg.priority ? 13 : cfg.priority,
            boxCss: "boxmgr_boxbg_" + id,
            titleObj: {
                title: "",
                style: "boxmgr_title"
            },
            msgObj: {
                msg: cfg.msg,
                css: "boxmgr_tip_msg"
            }
        };

        if(type == 2) {
            var okFunction = cfg.okFunction;
            retCfg["okButObj"] = {
                css:"boxmgr_ok_btn_"+id,
                click:function(theBox) {
                    if (okFunction) {
                        okFunction();
                    }
                    theBox.removeMsg(id);
                    return false;
                }
            };
            retCfg["eventHandler"] = defaultOkBtnFunc;
        }

        SumaJS.showMsgBox(retCfg);
    };
    this.removeBox = function(id){
        if(SumaJS.msgBox) {
            SumaJS.msgBox.removeMsg(id);
        }
    }
};

//夜间待机提醒功能
var sleepTimer = null;
var sleepCheck = function(){};
var sleepCfg = null;
var sleepTime = null;
function sleepInit(tempOriginalArray){
	sleepCfg = JSON.parse(readFile('/storage/storage0/sleepcfg.json',3));
	if (!tempOriginalArray || typeof tempOriginalArray.SleepConfig == "undefined" || !tempOriginalArray.SleepConfig.IsActive || (sleepCfg && !sleepCfg.isActive)) {
		SumaJS.debug("==============night sleep is not available======================");
		return;
	}
	sleepTime = tempOriginalArray.SleepConfig.Time;
	SumaJS.debug("==============sleepTime======================"+sleepTime);
	sleepCheck = function() {
		var lastRemindDate = SysSetting.getEnv("RemindDate");
		SumaJS.debug("==============lastRemindDate:" + lastRemindDate);
		var currTime = new Date();
		SumaJS.debug("==============currDate:" + currTime.getDate());
		if (currTime.getDate() != lastRemindDate) {
			var currTimeStr = SumaJS.dateFormat(currTime,"hh:mm:ss");
			var currDateStr = SumaJS.dateFormat(currTime, "yyyy/MM/dd");
			var sleepDateObj = new Date(currDateStr + " " + sleepTime);
			SumaJS.debug("==============currTimeStr:" + currTimeStr);
			if (currTime >= sleepDateObj && (currTime - sleepDateObj) < 120000) {
				var tip = tempOriginalArray.SleepConfig.TipContent;
				var retCfg = {
					name : "sleep_tip_box",
					priority : 13,
					boxCss : "info",
					titleObj : {
						title : "",
						style : "title"
					},
					msgObj : {
						msg : tip,
						css : "alert_msg"
					},
					okButObj : {
						css : "alert_ok_btn",
						click : function(theBox) {
							DataCollection.collectData(["18"]);
							theBox.removeMsg("sleep_tip_box");
							return false;
						}
					},				
					eventHandler : function(event) {
						if (this.focus && event.source != 1001) {
							var keyCode = event.keyCode||event.which;
							switch (keyCode) {
							case KEY_ENTER:
							case KEY_EPG:
							case KEY_MAIL:
							case KEY_TV:
							case KEY_FAV:
							case KEY_LEFT:
							case KEY_RIGHT:
							case KEY_UP:
							case KEY_DOWN:
							case KEY_NUM0:
							case KEY_NUM1:
							case KEY_NUM2:
							case KEY_NUM3:
							case KEY_NUM4:
							case KEY_NUM5:
							case KEY_NUM6:
							case KEY_NUM8:
							case KEY_NUM9:
								clearTimeout(sleepTimer);
								this.click();
								break;
							}
							return false;
						} else {
							return true;
						}
					}
				};
				SumaJS.showMsgBox(retCfg);
				SysSetting.setEnv("RemindDate", "" + new Date().getDate());
				sleepTimer = setTimeout(function(){
					DataCollection.collectData(["0c","02"]);
					SysSetting.standby(0);
				},60000);
			}
		}
	};
}


//关机频道对象
var OffChannelObj = new function(){
	this.saveOffChannelToM = function(ser){  //保存关机频道到内存中
		if(!ser){return false;}
		var tempOff = {};
		if(!ser.logicalChannelId || !ser.serviceHandle || !ser.serviceType){
			return false;
		}
		tempOff.logicalChannelId = ser.logicalChannelId;
		tempOff.serviceHandle = ser.serviceHandle;
		tempOff.serviceType = ser.serviceType;
		SysSetting.setEnv("OFF_CHANNEL",JSON.stringify(tempOff));
	};
	this.saveOffChannel = function(ser){  //保存关机频道到json文件中
		if(!ser){return;}			
		ser.ServiceHandle = ser.serviceHandle;
		ser.ChannelNumber = ser.logicalChannelId;
		//alert("saveOffChannel ");
		saveJSONFile("/storage/storage0/siConfig/OffChannel.json", ser, 1);
	};
	this.getOffChannel = function(){    //从json文件中获取关机频道
		var offChannelInfo = readFile("/storage/storage0/siConfig/OffChannel.json", 3);
		var offChannel = null;			
		if(!offChannelInfo){
			return null;
		}			
		try {
			offChannel = JSON.parse(offChannelInfo);
		} catch(e) {
			SumaJS.debug("offchannel is not json");
			return null;
		}			
		//兼容老版本电视号
		if(typeof offChannel.logicalChannelId == "undefined" && offChannel.ChannelNumber){
			offChannel.logicalChannelId = offChannel.ChannelNumber;
		}
		return offChannel;
	};
};


//文字跑马灯
function displayText(text, width, fontSize, fontWeight) {
	var calculateWidthId = SumaJS.getDom("width_calc");
	calculateWidthId.innerHTML = text;
	calculateWidthId.style.fontSize = fontSize + "px";
	if(typeof fontWeight != "undefined"){
		calculateWidthId.style.fontWeight = fontWeight + "";
	}else{
		calculateWidthId.style.fontWeight = "normal";
	}
	if (calculateWidthId.offsetWidth > width) {
		return "<marquee style='width:" + width + "px;'>" + text + "</marquee>";
	} else {
		return text;
	}
}

function isArray(obj){
	return typeof obj == "object" && Array == obj.constructor;
}


//portal跳转路径初始化，用来处理二级菜单和海报路径的处理
function pathInitialization(str){
	var tempStr = ""
	if(typeof str != "string"){return "";}
	if(str[0] != "/"){
		tempStr = str;
	}else{
		tempStr = PORTAL_ADDR + str;
	}
//	if(tempStr.indexOf("?")>-1){
//		tempStr = tempStr + "&page=" +SumaJS.currModuleName;
//	}else{
//		tempStr = tempStr + "?page=" +SumaJS.currModuleName;
//	}
	return tempStr;
}

function jumpPathInitialization(url){
	if(typeof url != "string"){return "";}
	if(url.indexOf("main://")>-1){
		url = "u:"+url.substr(7);
	}else if(url[0] == "/"){
		url = "u:"+PORTAL_ADDR+url;
	}else if(url.indexOf("http://")>-1 || url.indexOf("https://")>-1){
		url = "u:"+url;
	} else if(url.indexOf("dvb://")>-1) {
		var urlArray = url.split(".");
		var temp_networkId = parseInt(urlArray[0].replace("dvb://", ""), 10);
		var temp_tsId = parseInt(urlArray[1], 10);
		var temp_serviceId = parseInt(urlArray[2], 10)
		var tempService = DVB.getService(temp_networkId, temp_tsId, temp_serviceId);
		if (!tempService) {
			var obj = null;
			var tempServices = originalArray.ServiceInfo.ServiceArray;
			for(var i=0, len = tempServices.length; i<len; i++){
				if(tempServices[i].OriginalNetworkId==temp_networkId && tempServices[i].TsId==temp_tsId &&tempServices[i].ServiceId==temp_serviceId){
					obj = tempServices[i];
					break;	
				}	
			}
			if (!obj) {
				SumaJS.debug("=================================can not find this service");
			} else {
				var ret = DVB.addDVBNetwork(obj.NetworkId, originalArray.ServiceInfo.NetworkArray.NetworkName);
				SumaJS.debug("==========================================addDVBNetwork, ret = " + ret);
				ret = DVB.addTS(obj.OriginalNetworkId, obj.TsId, '{\
				  "NetworkID":' + obj.NetworkId + ',\
				  "Frequency":' + obj.Frequency + ',\
				  "SymbolRate":' + obj.SymbolRate + ',\
				  "Modulation":"' + obj.Modulation + 
				'"}');
				SumaJS.debug("==========================================addTS, ret = " + ret);
				ret = DVB.addDVBService(obj.OriginalNetworkId, obj.TsId, obj.ServiceId, obj.ServiceName || " ", obj.ServiceType, obj.Provider || " ", obj.PmtPid, [obj.BouquetId], [obj.TiShiServiceId], obj.ReferServiceId,0,0);
				SumaJS.debug("==========================================addDVBService, ret = " + ret);
			}
		}
		url = "u:"+url;
	}
	if(url.indexOf("u:")>-1){
		SumaJS.debug("LIWENLEItEST: window.location.href");
		url = url.substr(2);
//		if(url.indexOf("?")>-1){
//			if(SumaJS.currModuleName=="tv_page"){
//				url = url + "&page=" +thisPageName;
//			}else{
//				url = url + "&page=" +SumaJS.currModuleName;
//			}
//			//url = url + "&page=" +SumaJS.currModuleName;
//		}else{
//			if(SumaJS.currModuleName=="tv_page"){
//				url = url + "?page=" +thisPageName;
//			}else{
//				url = url + "?page=" +SumaJS.currModuleName;
//			}
//			//url = url + "?page=" +SumaJS.currModuleName;
//		}
//		SumaJS.debug("jumpPathInitialization url : "+url);
//		 alert("url = "+url);
		window.location.href = url;
	}else{
		showGlobalMsgBox("此业务尚未开通!");
		SumaJS.debug("LIWENLEItEST: 此业务尚未开通");
	}
}

function picdownLoadPathValid(str){   //用来处理海报的下载路径
	var tempStr = ""
	if(typeof str != "string"){return "";}
	if(str[0] != "/"){
		tempStr = str;
	}else{
		tempStr = PORTAL_ADDR + str;
	}
	return tempStr;
}

var userAttrMgr = new function(){  //用户属性表
	var self = this;
	this.baseFilePath = "/storage/storage0/";
	this.iniFilePath = this.baseFilePath + "LocalInformation.cfg";
	this.updateFilePath = this.baseFilePath + "User"+CA.icNo+".cfg";
	this.iniVersion = 0;
	this.updateVersion = 0;
	this.readFile = function(path){
		var Data = null;
		try {
			Data = JSON.parse(readFile(path, 3));
		}catch(e){}
		if(Data){
			return Data;
		}else{
			return null;
		}
	};
	this.askIniFile = function(version){
		var iniFileCfg = {
			url : PORTAL_ADDR+"/u1/initialCPEConfig?icNo="+CA.icNo+"&STBSerialNumber="+parseInt(SysInfo.STBSerialNumber)+"&localVersion="+version,
			//url:"http://172.16.250.247:8000/u1/initialCPEConfig?icNo=321321888&STBSerialNumber=8888888&localVersion=1.0",
			method: "POST",
			success: function(data){
				var str = data.responseText;
				var obj = null;
				try{
					obj = JSON.parse(str);
					if(obj && obj.localInformation){
						var newVersion = obj.localInformation.cfgVersion;
						if(self.iniVersion != parseInt(newVersion)){
							self.iniVersion = newVersion;
							var ret = saveJSONFile(self.iniFilePath,obj,1);
							if(!ret){
								SumaJS.debug("userAttr inifile saveFile failed str=" + str);
							}
						}
					}else{
						SumaJS.debug("userAttr inifile parse json empty str=" + str);
					}
				}catch(e) {
					SumaJS.debug("userAttr inifile parse json failed str=" + str);
				}

			},
			failed: function(data){
				SumaJS.debug("userAttr inifile ask failed");
			}
		};
		SumaJS.ajax(iniFileCfg);
	};
	this.askUpdateFile = function(version){
		var updateFileCfg = {
			url : PORTAL_ADDR+"/u1/updateCPEConfig?icNo="+CA.icNo+"&STBSerialNumber="+parseInt(SysInfo.STBSerialNumber)+"&localVersion="+version,
			//url:"http://172.16.250.247:8000/u1/updateCPEConfig?icNo=321321888&STBSerialNumber=8888888&userVersion=1.0",
			method: "POST",
			success: function(data){
				var str = data.responseText;
				var obj = null;
				try{
					obj = JSON.parse(str);
					if(obj && obj.userInformation){
						var newVersion = obj.userInformation.cfgVersion;
						if(self.updateVersion != parseInt(newVersion)){
							self.updateVersion = newVersion;
							var ret = saveJSONFile(self.updateFilePath,obj,1);
							if(!ret){
								SumaJS.debug("userAttr updateFile saveFile failed str=" + str);
							}
						}
					}else{
						SumaJS.debug("userAttr updateFile parse json empty str=" + str);
					}
				}catch(e) {
					SumaJS.debug("userAttr updateFile parse json failed str=" + str);
				}

			},
			failed: function(data){
				SumaJS.debug("userAttr updateFile ask failed");
			}
		};
		SumaJS.ajax(updateFileCfg);
	};
	this.start = function(){
		var iniData = null;
		iniData = this.readFile(this.iniFilePath);
		if(iniData){
			this.iniVersion = iniData.localInformation.cfgVersion;
			this.askIniFile(this.iniVersion);
		}else{
			this.askIniFile(0);
		}

		var updateData = null;
		updateData = this.readFile(this.updateFilePath);
		if(updateData){
			this.updateVersion = updateData.userInformation.cfgVersion;
			this.askUpdateFile(this.updateVersion);
		}else{
			this.askUpdateFile(0);
		}
	}
};


function openUrl(url){   //三次尝试打开该url
	if(url == ""){return;}
	var count = 3;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState==4 && xmlhttp.status==200){	
			window.location.href = url;
			return true;
		}else{
			return false;
		}
	};
	xmlhttp.open("GET", url, false);
	xmlhttp.send();	
}
function tryOpenUrl(url, count) {
	while(count > 0 && (openUrl(url)) == false) {
		--count;
	}
	window.location.href = url;
}


 //音频背景的显示与隐藏控制
var audio_bg = new function(){
	this.show = function(){  
		var dom = document.getElementById("chalist_audio_bg");
		if(dom){
			dom.style.display = "block";
		}else {
			var timg = document.createElement("img");
			timg.id = "chalist_audio_bg";
			timg.src = "images/main_page/chanlist_au_bg.jpg";
			timg.style.width = "380px";
			timg.style.height = "215px";
			timg.style.position = "absolute";
			timg.style.top = "153px";
			timg.style.left = "83px";
			timg.style.display = "block";
			timg.style.zIndex = "0";
			document.body.appendChild(timg);
		}
	};
	this.hide = function(){
		var dom = document.getElementById("chalist_audio_bg");
		if(dom){
			dom.style.display = "none";
		}
	}
};

//用来处理页面地址后面传递的参数
var locationSearchObj = (function(){
	function Constructor(){
		this.initial = function(){
			closeCycleControl.recoverStack();
			if(this.checkIfPlayTv()){
				SumaJS.debug("locationSearchObj 进全屏直播");
				closeCycleControl.clearStack();
				menuDataAccessObj.setPageIndex(5);
				return ;
			}
			var model = getParameter("switchPageModel");
			if(model==1){
				SumaJS.debug("locationSearchObj 闭环");
				this.closeLoop();
				return;
			}else if(model == 2){
				SumaJS.debug("locationSearchObj 主动跳转");
				closeCycleControl.clearStack();
				this.jump();
				return;
			}else{
				closeCycleControl.clearStack();
				SumaJS.debug("locationSearchObj 走默认");
			}
		};
		this.checkIfPlayTv = function(){
			var tempPage = getParameter("page");
			if(tempPage == "play_tv" || tempPage == "playtv_page"){
				return true;
			}
			return false;
		};
		this.closeLoop = function(){  //闭环
			var stack = closeCycleControl.stack;  //获取闭环保存的page
			if(!stack || stack.length ==0){  //异常,无闭环数据
				SumaJS.debug("locationSearchObj closeLoop error ");
				return;
			}
			var jumpPageName = stack[stack.length-1].moduleName;
			SumaJS.debug("locationSearchObj closeLoop jumpPageName = "+jumpPageName);
			closeCycleControl.setIsBackToPage(1);
			var pageNameArr = menuDataAccessObj.getPageNameArray();
			for(var j = 0;j<pageNameArr.length;j++){
				if(pageNameArr[j]==jumpPageName){
					menuDataAccessObj.setPageIndex(j);
					SumaJS.debug("locationSearchObj closeLoop 加载 page = = "+pageNameArr[j]);
					return;
				}
			}

		};
		this.jump = function(){  //主动跳转
			var pageStr = getParameter("page");  //传递的page参数
			var pageNameArr = menuDataAccessObj.getPageNameArray();
			if(pageStr){
				for(var j = 0;j<pageNameArr.length;j++){
					if(pageNameArr[j]==pageStr){
						//alert("加载 page = "+pageNameArr[j]);
						menuDataAccessObj.setPageIndex(j);
						return;
					}
				}
			}
		};
	}
	return new Constructor();
}());