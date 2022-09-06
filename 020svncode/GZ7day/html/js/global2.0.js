SysSetting.setEnv("PAGEFOCUSINDEX","home");
// 本文件定义一些常见的公共函数及变量
var U = {
	"UILanguage": "chi"
};

function showErrorMsg(msg, showTime){
	var timeout = 0;
	if (typeof showTime != "undefined") {
		timeout = showTime;
	}
	globalAlert.init({"val":msg,"btnInfo":[{"name":"确认","callBack":null}],"timeout":timeout});
}
console = (function(){
	var console_o = {};
	var CONFIG = {
		"debug" : true,
		"info" : true,
		"warn" : true,
		"error" : true
	};
	
	var PRINT_MODE = 1; //0 不输出; 1 console.debug()输出; 2 alert输出
    var platform_print = function(str){};
    if(typeof(Middleware)!="undefined" && typeof(Middleware.name)=="string")
	{
	    switch(Middleware.name)
		{
		    case "RocME":
			    platform_print = function(str){RocME.debug(str)}; 
			    break;
			default:
			    break;
		}
	}
    
	var printLog = function(msg){
		var str = "";
		if(typeof(PRINT_PREFIX)=="string") str = PRINT_PREFIX;
		switch(PRINT_MODE){
			case 0:
				break;
			case 1:
				str += msg;
				platform_print(str);
				break;
			case 2:
				str += msg;
				break;
		}
		
	};
	
	console_o.debug = function(msg){
		if(!CONFIG.debug) return;
		printLog(msg);
	};
	
	console_o.info = function(msg){
		if(!CONFIG.info) return;
		printLog("<info>"+msg);
	};
	
	console_o.warn = function(msg){
		if(!CONFIG.warn) return;
		printLog("<warn>"+msg);
	};
	
	console_o.error = function(msg){
		if(!CONFIG.error) return;
		printLog("<error>"+msg);
	};
	
	return console_o;
}());

var $G = {
	
	"getParameter" : function(param){
		var query = window.location.search; //获取URL"?"后面的字符串
		if(query.length==0){
			return "";
		}
		else{
			var iLen = param.length;
			var iStart = query.indexOf(param);
			if (iStart == -1) //判断是否有那个需要查询值的传递参数
				return ""; //没有就返回一个空值
			iStart += iLen + 1;
			var iEnd = query.indexOf("&", iStart); //判断是不是带有多个参数   &为多个参数的连接符号
			if (iEnd == -1) {
				return query.substring(iStart);
			}
			return query.substring(iStart, iEnd);
		}
	},
	"validChecker": function(type, value){
		var t = typeof(value);
        var retValue = null;
		if(1){//无论哪种类型, 都要进行简单判断
			switch(t){
				case "undefined":
					return false;
					break;
				case "number":
					if(value==0) return false;
					break;
				case "boolean":
					if(!value) return false;
					break;
				case "string":
					if(value=="") return false;
					break;
				case "object":
					if(value==null) return false;
					if(typeof(value.length)!="undefined"){
						if(value.length==0) return false;
					}
					break;
				case "function":
					break;
				default:
					return false;
			}
		}
		
		if(type=="") return true;
		
		else if(type=="stringnum"){
			var val = parseInt(value);
			if(typeof(val)=="number") return true;
			return false;
		}
		else if(type=="ip"){
			return false;
		}
	}	
}

function msgbox(name,init,show,hide,zindex){
    this.name = name;
    this.init = init;
    this.show = show;
    this.hide = hide;
    this.zindex = zindex;
};

msgBoxControl_lastName = null;
msgBoxControl_showNum = 0;

var msgBoxControl = (function(){
    var o_msgbox_ctrl = {};
    
    var ctrlArr = [];
    
    var msg_control = function(msgbox){
        this.showNum = 0;
		this.msgbox = msgbox;
		this.name = msgbox.name;
		this.zindex = msgbox.zindex;
        this.show = function(){
            console.debug("msg_control show entry!");
			console.debug("curr lastName is "+msgBoxControl_lastName+',want show name '+msgbox.name);
            if(msgBoxControl_lastName!=this.name){
                this.msgbox.init();
            }
            console.debug("ready to show "+this.name);
            this.msgbox.show();
            console.debug("set lastName to"+this.name);
            msgBoxControl_lastName = this.name;
            console.debug("msgBoxControl_showNum ++");
            msgBoxControl_showNum ++;
            console.debug(typeof(msgBoxControl_showNum));
            this.showNum = msgBoxControl_showNum;
            console.debug('set showNum to '+this.showNum);
        };
        this.hide = function(){
            this.msgbox.hide();
            this.showNum = 0;
            console.debug('set showNum to '+this.showNum);
        };
    };
    
    var findTop = function(){
        console.debug('=====findTop=====');
        var top = null;
        for(var i=0,len=ctrlArr.length; i<len; i++){
            var tmp = ctrlArr[i];
            console.debug(tmp.name);
            if(tmp.showNum>0){
                console.debug('zindex['+tmp.zindex+'],showNum['+tmp.showNum+']');
                if(top==null){
                    top = tmp;
                    console.debug('top:'+tmp.name);
                }
                else if(tmp.zindex>top.zindex 
                    || (tmp.zindex==top.zindex && tmp.showNum>top.showNum))
                {
                    top = tmp;
                }
            }
        }
        if (top!=null) console.debug('=====findTop=====rst:'+top.name);
        else console.debug('=====findTop=====rst:null');
        return top;
    };
    
    o_msgbox_ctrl.add = function(msgbox){
        var ctrl = new msg_control(msgbox);
        ctrlArr.push(ctrl);
        return ctrl;
    };
    
    o_msgbox_ctrl.get = function(name){
        for(var i=0,len=ctrlArr.length; i<len; i++){
            var tmp = ctrlArr[i];
            if(tmp.name==name) return tmp;
        }
        return null;
    };
    
    o_msgbox_ctrl.dispatchKey = function(event){
        var top = findTop();
        if(top==null){
            console.debug("can't find top msgbox, return -1");
            return -1;
        }
        else{
            console.debug("find top msgbox["+top.name+"], dispatch key to this msgbox...");
            return top.keyhandle(event);
        }
    };
    
    
    return o_msgbox_ctrl;
}());


$ = function(ele){return document.getElementById(ele);}

var util = {
	/**
	 * util.date对象，用来放置与Date有关的工具
	 */
	date: {
		/**
		 * util.date.format方法，将传入的日期对象d格式化为formatter指定的格式
		 * @param {object} d 传入要进行格式化的date对象
		 * @param {string} formatter 传入需要的格式，如“yyyy-MM-dd hh:mm:ss”
		 * @return {string} 格式化后的日期字符串，如“2008-09-01 14:00:00”							
		 */
		format: function(d, formatter) {
		    if(!formatter || formatter == "")
		    {
		        formatter = "yyyy-MM-dd";
		    }
			
			var weekdays = {
				"chi": ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
				"eng": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
			};
		    var year = d.getFullYear().toString();
		    var month = (d.getMonth() + 1).toString();
		    var date = d.getDate().toString();
		    var day = d.getDay();
			var hour = d.getHours().toString();
			var minute = d.getMinutes().toString();
			var second = d.getSeconds().toString();

			var yearMarker = formatter.replace(/[^y|Y]/g,'');
			if(yearMarker.length == 2) {
				year = year.substring(2,4);
			} else if (yearMarker.length == 0) {
				year = "";
			}

			var monthMarker = formatter.replace(/[^M]/g,'');
			if(monthMarker.length > 1) {
				if(month.length == 1) {
					month = "0" + month;
				}
			} else if (monthMarker.length == 0) {
				month = "";
			}

			var dateMarker = formatter.replace(/[^d]/g,'');
			if(dateMarker.length > 1) {
				if(date.length == 1) {
					date = "0" + date;
				}
			} else if (dateMarker.length == 0) {
				date = "";
			}

			var hourMarker = formatter.replace(/[^h]/g, '');
			if(hourMarker.length > 1) {
				if(hour.length == 1) {
					hour = "0" + hour;
				}
			} else if (hourMarker.length == 0) {
				hour = "";
			}

			var minuteMarker = formatter.replace(/[^m]/g, '');
			if(minuteMarker.length > 1) {
				if(minute.length == 1) {
					minute = "0" + minute;
				}
			} else if (minuteMarker.length == 0) {
				minute = "";
			}

			var secondMarker = formatter.replace(/[^s]/g, '');
			if(secondMarker.length > 1) {
				if(second.length == 1) {
					second = "0" + second;
				}
			} else if (secondMarker.length == 0) {
				second = "";
			}
		    
		    var dayMarker = formatter.replace(/[^w]/g, '');
		    var lang = U.UILanguage;
		    var result = formatter.replace(yearMarker,year).replace(monthMarker,month).replace(dateMarker,date).replace(hourMarker,hour).replace(minuteMarker,minute).replace(secondMarker,second); 
			if (dayMarker.length != 0) {
				result = result.replace(dayMarker,weekdays[lang][day]);
			}
		    return result;
		},
        
        getDate: function(offset) {
            var d = new Date();
            var year = d.getFullYear();
            var month = d.getMonth();
            var date = d.getDate();
            var hour = d.getHours();
            var minute = d.getMinutes();
            var second = d.getSeconds();
            
            var dd = new Date(year, month, (date+offset), hour, minute, second);
            return dd;
        }
	},
	str: {
		addZero: function(__str, __num){
			__str = __str.toString();
			for(var i = __str.length; i < __num; i++){
				__str = "0"+__str;
			}
			return __str;
		},
		
		getDuration: function(__t1, __t2){
			var t1 = __t1.split(":");
			var t2 = __t2.split(":");
			var duration = 0;
			duration = (Math.floor(t2[0])*60+Math.floor(t2[1])) - (Math.floor(t1[0])*60+Math.floor(t1[1]));
			if(t1[0] > t2[0]) duration = duration + 1440;
			return duration;
		},
		
		millisecondToMinute: function(__mili){			
			return parseInt((__mili/1000)/60);		
		},

		secondToStringTime: function(__sec){
			var hour = Math.floor(__sec/3600);
			var minute = Math.floor((__sec - hour*3600)/60);
			var second = __sec - hour*3600 - minute*60;
			hour = hour>9?hour:"0"+hour;
			minute = minute>9?minute:"0"+minute;
			second = second>9?second:"0"+second;
			return hour+":"+minute+":"+second;
		},
		
		/**
		 * 根据传入的字符串日期和时间格式转换为毫秒的整数格式时间
		 * @param string __str : 格式为“2008-09-01 14:00:00”的日期和时间字符串
		 * @return long int : 毫秒的时间格式
		 */
		stringDateTimeToMiliTime: function(__str){
			var y = Math.floor(__str.substring(0,4));
			var m = Math.floor(__str.substring(5,7))-1;
			var d = Math.floor(__str.substring(8,10));
			var t_h = Math.floor(__str.substring(11,13));
			var t_m = Math.floor(__str.substring(14,16));
			var t_s = Math.floor(__str.substring(17,19));
			var my_date = new Date();
			my_date.setYear(y);
			my_date.setMonth(m);
			my_date.setDate(d);
			my_date.setHours(t_h);
			my_date.setMinutes(t_m);
			my_date.setSeconds(t_s);
			my_date.setMilliseconds(0);
			return my_date.getTime();
		},

		/* ---------------------------
		 功能 - 将输入字串前补add_string至设定宽度
		 参数 -
			arg1: 输入, 可以是字符串或数字
			arg2: 欲补到多宽的字串
			arg3: 欲补的字串，一般为一个字符
		---------------------------*/
		toPaddedString: function(input,width,add_string){
			var str = input.toString();
			while(str.length<width){
				str = add_string + str;
			}
			return str;
		},
        
        undefinedReplacer: function(input, replace){
            return (typeof(input)=="undefined")  ? replace : input;
        }
	}
};

function getSIConfigService(networkId, tsId, serviceId)
{
	var ret = null;
	for(var i = 0; i < globalConfigArray.length; ++i)
	{
		if(serviceId == globalConfigArray[i].ServiceId
			&& tsId == globalConfigArray[i].TsId
			/*&& networkId == globalConfigArray[i].NetworkId*/)
		{
			ret = globalConfigArray[i];
			break;
		}
	}
	return ret;
}

function getTimeShiftChannel(channelId) {
	var ret = null;
	for(var i = 0; i < globalConfigArray.length; ++i)
	{
		if (channelId == globalConfigArray[i].ChannelId) {
			ret = globalConfigArray[i];
			break;
		}
	}
	return ret;
}

function getSIConfigChannel(originalNetworkId, tsId, serviceId)
{
	var ret = null;
	for(var i = 0; i < globalConfigArray.length; ++i)
	{
		if(serviceId == globalConfigArray[i].ServiceId
			&& tsId == globalConfigArray[i].TsId
			&& originalNetworkId == globalConfigArray[i].OriginalNetworkId)
		{
			ret = globalConfigArray[i];
			break;
		}
	}
	return ret;
}

function goToPlayByService(serviceObj){
	//$J.evn("lastServiceObj","{'serviceID':"+serviceObj.serviceID+",'TSID':"+serviceObj.TSID+",'NetworkID':"+serviceObj.NetworkID+"}");
	for(var i = 0; i < globalConfigArray.length; ++i)
	{
		//var text = JSON.stringify(globalConfigArray[i]);
		//console.debug("===========================globalConfigArray[i] = " + text);
		if(serviceObj.serviceID == globalConfigArray[i].ServiceId
			&& serviceObj.TSID == globalConfigArray[i].TsId
			/*&& serviceObj.NetworkID == globalConfigArray[i].NetworkId*/)
		{
			var playParam = {
				serviceInfo:{
					TSID:serviceObj.TSID,
					serviceID:serviceObj.serviceID
				}
			};		
			SysSetting.setEnv("MAINPAGE", "1");	
			SysSetting.setEnv("PAGEFOCUSINDEX","play_tv");
			SysSetting.setEnv("playParam",JSON.stringify(playParam));
			window.location.href = "../../index.html";
		}
	}	
}
function isServiceOnPlay(serviceObj){
  var currentHref = window.location.href+"";
  if(currentHref.indexOf("playTv")==-1){
     return false;
  }else{
	  if(playTvObj.playService.NetworkId==serviceObj.NetworkID&&playTvObj.playService.TsId==serviceObj.TSID&&playTvObj.playService.ServiceId==serviceObj.serviceID){
		  return true;
	  }else{
	      return false;
	  }
	  
  }
	
}

function EvtObj(){
    this.tranToNext = true;
    this.isPrevent = false;
}
var tl;
var handlerFlag = true;
function all_systemevent_handler(event)
{
	tl = new Date();
	var Evt = null;
	
	Evt = global_systemevent_handler(event);
	/*
	if(Evt.isPrevent) return 0;
	else if(!Evt.tranToNext) return 1;
	*/
	if(typeof page_systemevent_handler=='function')
		Evt = page_systemevent_handler(event);
		
	if(typeof deployerEvent=='function'){
		deployerEvent(event);
	}
	/*
	if(Evt.isPrevent) return 0;
	else if(!Evt.tranToNext) return 1;
	*/
}

DEPLOY = {};

function global_systemevent_handler(event)
{
    var Evt = new EvtObj();
    
    var code = event.which;
	var type = event.type;
	var modifiers = event.modifiers;
	console.debug("######[global_systemevent_handler]event.type="+type+";event.which"+code+"event.modifiers="+modifiers);
	switch(code)
	{	
		case ROC_SYSEVENT_DVB_NIT_NETWORK_DESCRIPTOR_READY:
			DEPLOY.receiveMessageFlag = true;
			clearTimeout(DEPLOY.getNitDescTimer);
			var retEvtStr = SysSetting.getEventInfo(modifiers);	//事件返回字符串"NetworkID, TagContent"
			console.debug("==========retEvtStr==========" + retEvtStr);
			DEPLOY.binaryDataStr = retEvtStr.substr(retEvtStr.indexOf(",") + 1);
			var descriptor_tag = DEPLOY.binaryDataStr.substring(0,2);
			console.debug("==========descriptor_tag==========" + descriptor_tag);
			if (descriptor_tag == "b3") {
				DEPLOY.tagVersion = parseInt(DEPLOY.binaryDataStr.substr(6, 2), 16);
				//alert("==========global==========" + DEPLOY.tagVersion + "============" + DEPLOY.tagVersionAttribute);
				if (DEPLOY.tagVersionAttribute != DEPLOY.tagVersion || typeof(DEPLOY.tagVersionAttribute) == "undefined") {
					DEPLOY.parseNITDescStr(DEPLOY.binaryDataStr);
				} else {
					DEPLOY.receiveMessageFlag = false;
					DEPLOY.getNitDescTimer = setInterval(function () {
						if (DEPLOY.receiveMessageFlag) {
							clearTimeout(DEPLOY.getNitDescTimer);
						} else {
							DVB.getNITNetworkDescriptor(currNetworkID, 0xb3);
						}
					}, 60000);
				}
			}
		break;
		case 10151:
			/*if(markId != modifiers && siMarkId != modifiers)
			{
				DEPLOY.receiveMessageFlag = true;
				clearTimeout(DEPLOY.getNitDescTimer);
				DEPLOY.readAppListFile();
			}*/
		break;
		case 10154:
			DEPLOY.receiveMessageFlag = false;
			DEPLOY.getNitDescTimer = setInterval(function () {
				if (DEPLOY.receiveMessageFlag) {
					clearTimeout(DEPLOY.getNitDescTimer);
				} else {
					DVB.getNITNetworkDescriptor(DEPLOY.currNetworkID, 0xb3);
				}
			}, 60000);
		break;
		
		case ROC_SYSEVENT_OTA_ANALY_UPGRADE_DATA:
			SysSetting.setEnv("OTA_GOT_10703", "1");
			var currTS = DVB.currentTS;
			SysSetting.setEnv("UPGRADE_FREQ", "{frequency:"+currTS.frequency+", symbolRate:"+currTS.symbolRate+", modulation:'"+currTS.modulation+"'}");			
			break;
				
		case ROC_SYSEVENT_OTA_FORCE_UPGRADE://OTA强制升级
			var rs = Upgrade.startLater();
			if(rs==0){
				showErrorMsg("OTA升级失败！");
				return ;
			}
			setTimeout("Upgrade.start()",10000);
			document.onkeypress = function(){return 0};
			globalAlert.init({"val":"发现新软件版本,强制升级中!10秒后机顶盒重启,请勿操作...","timeout":0});
		break;
		case ROC_SYSEVENT_OTA_MANUAL_UPGRADE://OTA自动升级
			if (SysSetting.getEnv("Upgrade_notify_flag") == "") {
				globalAlert.init({
				"val":"系统检测到新软件版本,是否升级,选择确定将在10秒后自动重启。",
				"btnInfo":[{
					"name":"确定",
					"callBack":function(){
						var rs = Upgrade.startLater();
						if(rs==0){
							showErrorMsg("OTA升级失败！");
						} else {
							globalAlert.init({"val":"机顶盒将在10秒钟后重启，请稍候...","timeout":0});
							document.onkeypress = function(){return 0};
							setTimeout("Upgrade.start()",10000);
						}
					}
				},{"name":"取消",
					"callBack":function(){
						var currTS = DVB.currentTS;
						globalAlert.hide();
						globalAlert.init({"val":"正在写入升级信息，机顶盒将在下次开机时进行自动升级...","timeout":0});
						Upgrade.startLater();
						SysSetting.setEnv("Upgrade_notify_flag", "1");
						globalAlert.hide();
						DVB.tune(currTS.frequency, currTS.symbolRate, currTS.modulation);
					}
				}],"timeout":0});
			}
        break;

		case IP_OTA_FORCE_UPGRADE://IP OTA强制升级
			console.debug("IP OTA 强制升级 :"+modifiers)
			var upGradeInfo =  SysSetting.getEventInfo(modifiers);
			console.debug("IP OTA 强制升级 参数 :"+upGradeInfo);
			var upGradeParam = upGradeInfo.split(",");
			var packageUrl = upGradeParam[0];
			var downloadPort = upGradeParam[1];
			var hashCode = upGradeParam[2];
			console.debug("IP OTA 强制升级 参数 packageUrl ["+packageUrl+"]");
			console.debug("IP OTA 强制升级 参数 downloadPort ["+downloadPort+"]");
			console.debug("IP OTA 强制升级 参数 hashCode ["+hashCode+"]");
			var rs = Upgrade.ipStartLater(packageUrl,downloadPort,hashCode);
			if(rs==0){
				showErrorMsg("OTA升级失败！");
				return ;
			}
			setTimeout("Upgrade.start()",10000);
			document.onkeypress = function(){return 0};
			globalAlert.init({"val":"发现新软件版本,强制升级中!10秒后机顶盒重启,请勿操作...","timeout":0});
		break;
		case IP_OTA_AUTO_UPGRADE://IP OTA 提示升级
			console.debug("IP OTA 提示升级 :"+modifiers)
			var upGradeInfo =  SysSetting.getEventInfo(modifiers);
			console.debug("IP OTA 提示升级 参数 :"+upGradeInfo);
			var upGradeParam = upGradeInfo.split(",");
			var packageUrl = upGradeParam[0];
			var downloadPort = upGradeParam[1];
			var hashCode = upGradeParam[2];
			console.debug("IP OTA 提示升级 参数 packageUrl ["+packageUrl+"]");
			console.debug("IP OTA 提示升级 参数 downloadPort ["+downloadPort+"]");
			console.debug("IP OTA 提示升级 参数 hashCode ["+hashCode+"]");
			if(SysSetting.getEnv("IP_Upgrade_notify_flag") == 1){
				return;
			}
			globalAlert.init({
			"val":"系统检测到新软件版本,是否升级,选择确定将在10秒后自动重启。",
			"btnInfo":[{
				"name":"确定",
				"callBack":function(){
					var rs = Upgrade.ipStartLater(packageUrl,downloadPort,hashCode);
					if(rs==0){
						showErrorMsg("OTA升级失败！");
					} else {
						globalAlert.init({"val":"机顶盒将在10秒钟后重启，请稍候...","timeout":0});
						document.onkeypress = function(){return 0};
						setTimeout("Upgrade.start()",10000);
					}
				}
			},{"name":"取消",
				"callBack":function(){
					globalAlert.hide();
					globalAlert.init({"val":"正在写入升级信息，机顶盒将在下次开机时进行自动升级...","timeout":0});
					Upgrade.ipStartLater(packageUrl,downloadPort,hashCode);
					SysSetting.setEnv("IP_Upgrade_notify_flag", "1");
					globalAlert.hide();
				}
			}],"timeout":0});
		case IP_OTA_MANUAL_UPGRADE:
			console.debug("IP OTA 手动升级 :"+modifiers)
			var upGradeInfo =  SysSetting.getEventInfo(modifiers);
			console.debug("IP OTA 手动升级 参数 :"+upGradeInfo);
			SysSetting.setEnv("OTA_GOT_10706", upGradeInfo);			
			break;
        break;
		case ROC_SYSEVENT_OTA_BURNING_SUCCESS:
		    showErrorMsg("系统升级成功");
		break;
		case ROC_SYSEVENT_OTA_BURNING_FAILED:
			globalAlert.init({"val":"系统升级失败，是否重新升级！","btnInfo":[{"name":"重新升级","callBack":function(){
																		  var rs = Upgrade.startLater();
																		  if(rs==0){
																			  showErrorMsg("OTA升级失败！");
																			  return ;
																		   }
																		   setTimeout("Upgrade.start()",10000);
																		  }
										  },{"name":"取消","callBack":null}],"timeout":0});
		break;	
		
        case ROC_SYSEVENT_ORDERD_EVENT_WILL_START:
        {  
			var orderID = event.modifiers;
			var order = user.orders.getOrderByID(orderID);
			var currHref = window.location.href+"";
			if(currHref.indexOf("auto_search")!=-1){
				user.orders.del(order);
			}
			else
			{
				var DVBEvent = order.whichEvent; //20110306:这里少些了这句，将导致预定提醒时，无法正确进入播放
				if (getSIConfigService(DVBEvent.NetworkID, DVBEvent.TSID, DVBEvent.serviceID).hide == 1) {
					user.orders.del(order);
					return;	
				}
				var seconds = getOrderStartSecond(order.whichEvent.date,order.whichEvent.startTime);//user.orders.advanceRemind;startTime
		
				if(isServiceOnPlay(DVBEvent)){
				  return ;
				}
				var name = order.whichEvent.name;
				name = getStrChineseLen(name,12);
				globalAlert.init({"val":"您预订的节目:《"+name+"》将在"+seconds+"秒后开始, 是否进入播放?","btnInfo":[
				{
					"name":"确定","callBack":function(){
						goToPlayByService(DVBEvent);
						user.orders.del(order);
					}
				},
				{
					"name":"取消","callBack":function(){
						user.orders.del(order);
						var currentHref = window.location.href+"";
						if(currentHref.indexOf("EPG")!=-1){
							if (infoList && infoList.refresh) {
								infoList.refresh();
								if (!dateListShowFlag) {
									$("epg_list_item" + infoList.getIndex()).style.color = "#000";
								}
							}		
						}
					}
				}],"timeout":0
				});
				orderTime(parseInt(seconds),name);			
			}
		}		
        break;
        case ROC_SYSEVENT_ORDERD_EVENT_START:
        {
            var orderID = event.modifiers;
            var order = user.orders.getOrderByID(orderID);

            var DVBEvent = order.whichEvent;
			if (getSIConfigService(DVBEvent.NetworkID, DVBEvent.TSID, DVBEvent.serviceID).hide == 1) {
				user.orders.del(order);
				return;	
			}
			if(isServiceOnPlay(DVBEvent)){
				return ;
			}
            var name = order.whichEvent.name;
			name = getStrChineseLen(name,12);
			globalAlert.init({"val":"您预订的节目: 《" + name + " 》已经开始!是否收看?","btnInfo":[{"name":"确定","callBack":function(){goToPlayByService(DVBEvent);}},{"name":"取消","callBack":null}],"TCB": function(){goToPlayByService(DVBEvent);},"timeout":10000});
			//goToPlayByService(DVBEvent);
        }
		break;
		case ROC_SYSEVENT_EMAIL:
		break;
		case ROC_SYSEVENT_NETWORK_DISCONNECTED://网络断开
		  //showErrorMsg("当前网络信号丢失，请检查信号线或致电客服");
		  globalAlert.init({"val":"当前网络信号丢失，请检查信号线或致电客服","SCB":null,"FCB":null,"timeout":3000, 
						"btnInfo":[{
							"name":"确定",
							"callBack":function(){
								globalAlert.hide();
							}
						}]
					});
			break;
		case ROC_SYSEVENT_NETWORK_CONNECTED ://网络连接
		//this.addEventListener;
		globalAlert.hide();
		break;
		case 10608:	//电视机关机消息
			DataCollection.collectData(["0c","03"]);
			break;
		case 10609:	//电视机开机消息
			DataCollection.collectData(["0b","02"]);
			break;		
	}
    
    return Evt;
}

function orderTime(seconds,name){
	var sec = parseInt(seconds)
   if(sec>0){ 
      globalAlert.changeText("《"+name+"》"+seconds+"秒后开始!是否进入播放?");
	  sec--;
	  globalAlert.personalityTimeout=setTimeout("orderTime("+sec+",'"+name+"')",1000);	  
   }else{
	   //globalAlert.changeText("《"+name+"》已经开始!是否进入播放?");
	   clearTimeout(globalAlert.personalityTimeout);
   }
}
function getOrderStartSecond(startDate,startTime){
	var date = startDate.split('-');
	var time = startTime.split(':');
	var startTime = new Date(parseInt(date[0],10),
							  parseInt(date[1],10)-1,
							  parseInt(date[2],10),
							  parseInt(time[0],10),
							  parseInt(time[1],10),
							  parseInt(time[2],10)
										)
	var currTime = new Date();
	return parseInt((startTime.getTime()-currTime.getTime())/1000)
	
}
//隐藏邮件提示
function tishi_hide(){
	document.getElementById("mail_s").style.visibility="hidden";
	}
//系统消息处理函数,分成全局消息和页面消息两部分.
document.onsystemevent = all_systemevent_handler;

//-------alex add msgbox -------------
var alexMsgBox = new alexMsgBox();
function alexMsgBox(){
	/**
	_Json.type 消息类型;
	alert 确认/ confirm 确认  取消
	_Json.content 内容;
	_Json.timeout 有timeout时定时关闭,无timeout时不关闭
	_Json.CallBackYes;
	_Json.CallBackNo;
	**/
	this.show = show;
	this.press = press;
	this.hidden = hidden;
	this.showTag = 0;
	this.keyTag = 0;
	function show(_Json){
		if(_Json.type=="alert"){
			this.showTag = 1;
			$("alexMsgBox").style.visibility = "visible"
			$("alexMsgBox").style.backgroundImage = "url(../images/tips1.png)";
			$("alexMsgBoxContent").innerHTML = _Json.content;
			$("alexMsgBoxBtn").style.visibility = "hidden";
			
			
			
		}else if(_Json.type=="confirm"){
			this.showTag = 1;
			$("alexMsgBox").style.visibility = "visible"
			$("alexMsgBox").style.backgroundImage = "url(../images/tips2.png)";
			$("alexMsgBoxContent").innerHTML = _Json.content;
			$("alexMsgBoxBtn").style.visibility = "visible";
			
			
		}
		this.showTag = 1;
	
	}	
	function hidden(){
		this.showTag = 0;
		$("alexMsgBox").style.visibility = "hidden"
		$("alexMsgBoxBtnNo").style.backgroundImage = "url(../images/cancel_focus.png)";
		$("alexMsgBoxBtnYes").style.backgroundImage = "url(../images/confirm_blur.png)";
		
	}
	function press(event){
		var val = event.which | event.keyCode;
		if(showTag ==1 ){
			switch(val){
				case ROC_IRKEY_UP:
					return 0;
				break;
				case ROC_IRKEY_RIGHT:
					this.keyTag = 1;
					$("alexMsgBoxBtnNo").style.backgroundImage = "url(../images/cancel_focus.png)";
					$("alexMsgBoxBtnYes").style.backgroundImage = "url(../images/confirm_blur.png)";					
					
					break;
				case ROC_IRKEY_LEFT:
					this.keyTag = 0;
					$("alexMsgBoxBtnNo").style.backgroundImage = "url(../images/cancel_focus.png)";
					$("alexMsgBoxBtnYes").style.backgroundImage = "url(../images/confirm_blur.png)";
					break;
				case ROC_IRKEY_SELECT:
					if(keyTag==1&&_Json.CallBackYes!=null){
						setTimeout(_Json.CallBackYes,100);
					}
					if(keyTag==0&&_Json.CallBackNo!=null){
						setTimeout(_Json.CallBackNo,100);
					}
					this.hidden();
					break;
			}
			return 0;	
		}
		
		
	}
}
//document.onkeypress = alexMsgBox.Press;

var timer_datetime = -1;
function showDateTime(){
  /* clearTimeout(timer_datetime);
    var dd = new Date();
	var CURRENT_TIME = util.date.format(dd,"yyyy-MM-dd w hh:mm")
    $("current_Time").innerHTML = CURRENT_TIME;
    timer_datetime = setTimeout("showDateTime()", 60*1000);*/	
	var day=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
    clearTimeout(timer_datetime);
    var dd = new Date();
	if(dd.getFullYear()<1971){return false;}//时间获取错误就不显示
    $("time_HMS").innerHTML = (dd.getHours()<10?("0"+dd.getHours()):dd.getHours())+":"+(dd.getMinutes()<10?("0"+dd.getMinutes()):dd.getMinutes())+":"+(dd.getSeconds()<10?("0"+dd.getSeconds()):dd.getSeconds());
    $("time_YMDW").innerHTML = dd.getFullYear()+"-"+(dd.getMonth()<9?("0"+(dd.getMonth()+1)):(dd.getMonth()+1))+"-"+(dd.getDate()<10?"0"+dd.getDate():dd.getDate())+" "+day[dd.getDay()];
    timer_datetime = setTimeout("showDateTime()",1000);
	
}

//**滚动条***/
/**
	   传入的参数：
	    areaHeight：滚动的区域高度
		iniTop:滚动条初始Top
		pageSize:每页显示的数量长度
		dataLength:总数据量
	    isCycling:是否打循环 
	 */
function scrollBar(areaHeight,iniTop,pageSize,dataLength,isCycling){
		this.areaHeight=areaHeight;
		this.iniTop=iniTop;
		this.pageSize=pageSize;
		this.dataLength=dataLength;
		this.isCycling = isCycling;
		this.scrollHeight=Math.round(areaHeight/dataLength*pageSize);
		this.id="scroll"+Math.round(Math.random()*1000);
		
		this.offset=(areaHeight-this.scrollHeight)/(dataLength-1);                  
		//Math.round((areaHeight-this.scrollHeight)/dataLength);		
		this.currentOffset=0;
		this.up = up;
		this.down = down;
		this.setPosition = setPosition;
		
		//滚动条长度
		this.initBar = initBar;
		function initBar(){
			 var html="";
			 if(this.dataLength>this.pageSize){
			 	//html = "<div class='slider' style='height:"+this.scrollHeight+"px;' id='"+this.id+"'></div>";
				html="<div class='slider' id='"+this.id+"' style='top:0px;'><div class='slider_u'  style='height:"+this.scrollHeight+"px;'></div><div class='slider_d'></div></div>"
			}
		   return html;
		}				
		function up(){
		   if(this.dataLength>this.pageSize){	
			 if(this.currentOffset!=0){
			   this.currentOffset--;
			   document.getElementById(this.id).style.top=Math.round(this.currentOffset*this.offset)+"px";
			 }else if(this.isCycling==true&&this.currentOffset==0){
			     this.currentOffset=this.dataLength;
				 document.getElementById(this.id).style.top=Math.round(this.currentOffset*this.offset)+"px";
			 }  
		   }
        }
		function down(){
		   if(this.dataLength>this.pageSize){	
		    if(this.currentOffset<this.dataLength-1){
			   this.currentOffset++;
			   document.getElementById(this.id).style.top=Math.round(this.currentOffset*this.offset)+"px";
			}else if(this.isCycling==true&&this.currentOffset==this.dataLength-1){
			   this.currentOffset=0;
			   document.getElementById(this.id).style.top=Math.round(this.currentOffset*this.offset)+"px";
			}
		   }
		}
		function setPosition(index){
		  if(this.dataLength>this.pageSize){	
			this.currentOffset=index;
		    document.getElementById(this.id).style.top=Math.round(index*this.offset)+"px";
		  }
		}	      
	}



//返回字符串汉字长度 英文或特殊字符两个相当于一个汉字
/*
 *str:传入的字符串
 *len:字符串的最大长度
 *返回截取的字符串
 */
function getStrChineseLen(str,len){
	str = str + "";
	var w = 0;
	str = str.replace(/[ ]*$/g,"");
	if(getStrChineseLength(str)>len){
		for (var i=0; i<str.length; i++) {
			 var c = str.charCodeAt(i);
			 //单字节加1
			 if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
			   w++;
			 }else {
			   w+=2;
			 }
			 if(parseInt((w+1)/2)>len){
				return str.substring(0,i-1)+"..";
				break;
			 }
		 
		} 
	}
	return str;
  
}


function getStrChineseLength(str){
	str = str+"";
	str = str.replace(/[ ]*$/g,"");
	var w = 0;
	for (var i=0; i<str.length; i++) {
     var c = str.charCodeAt(i);
     //单字节加1
     if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
       w++;
     }else {
       w+=2;
     }
    } 	
	var length = w % 2 == 0 ? (w/2) : (parseInt(w/2)+1) ;
	return length;
  
}

var globalFocusArea=0; 
var GLOBAL_EXIT=0;
var GLOBAL_MENU=1;
var global_exit_type =GLOBAL_MENU;
var global_display_tag =0;
var global_msg_div;
var global_control_mode = 0;

var globalControlMode = 0;
function globalEvent(event){
	switch(val){
		case ROC_IRKEY_RED:
			// document.removeEventListener("keypress",grabEvent,false);
			return false;
		break;
		case ROC_IRKEY_EPG:
		    window.location.href=portRoot+"/html/EPG.html";
			return false;
		break;
		//case ROC_IRKEY_MENU:
		//case ROC_IRKEY_EXIT://退出
		//	callGlobalEvent(event);
		//break;
		/*
		case ROC_IRKEY_MENU:
		   if( globalControlMode ==0 ){
		      window.location.href=portRoot+"/index.html";
		   }
		   return false;
		 break;
		case ROC_IRKEY_EXIT://退出
		 if( globalControlMode ==0 ){
			 window.location.href=portRoot+"/html/playTv.html";
		 }
		//window.history.go(-1);
		return false;
		break;
		*/
		//case GD_KEY_MAIL://短信
		//return false;
		//break;
		//case GD_KEY_GAME://游戏
		//window.location.href=PORTAL_SUB_ADDR+"game.html";
		//return false;
		//break;
		//case GD_KEY_TV://电视
		//window.location.href=portRoot+"/html/ChanList.html?type=chan_tv";
		////return false;
		//break;
		//case GD_KEY_AUDIO://广播
		//window.location.href=portRoot+"/html/ChanList.html?type=chan_au";
		//return false;
		//break;
		//case GD_KEY_MOVE://点播
		//window.location.href=PORTAL_SUB_ADDR+"highClear.html";
		//return false;
		//break;
		//case GD_KEY_INFO://信息
		//return false;
		//break;
		//case DG_KEY_XIAI://喜爱
		//return false;
		//break;
	}
}
function selectGlobalOperate(event){
	var val = event.which | event.keyCode;
		switch(val){
		   case ROC_IRKEY_LEFT:
		   case ROC_IRKEY_RIGHT:
		        if( global_display_tag==0 ){
			     $("tip_box_img_global_01").src = PORTAL_SUB_ADDR_IMG+"/images/determine.png";
				 $("tip_box_img_global_02").src = PORTAL_SUB_ADDR_IMG+"/images/cancel_02.png";
		    	 global_display_tag =1;
		        }else if( global_display_tag==1 ){
			     $("tip_box_img_global_01").src = PORTAL_SUB_ADDR_IMG+"/images/determine_02.png";
				 $("tip_box_img_global_02").src = PORTAL_SUB_ADDR_IMG+"/images/cancel.png";
		    	 global_display_tag =0;
		        }
		   break;
		   
		   case ROC_IRKEY_SELECT:
		      if( global_exit_type ==  GLOBAL_EXIT){
				   if( global_display_tag == 0 ){
					   window.location.href=portRoot+"/html/playTv.v2.html";
				   }else if( global_display_tag==1 ){
					   //表示取消
					   initGlobalEvent();
				   }
			  }else if( global_exit_type ==  GLOBAL_MENU ){
				  if( global_display_tag == 0 ){
					   window.location.href=portRoot+"/index.html";
				   }else if( global_display_tag==1 ){
					   //表示取消
					   initGlobalEvent();
				   }
			  }
		   break;
		}
}
var global_control_mode = 0;
var globalFocusArea = 0;
function callGlobalEvent(event){
	    var val = event.which | event.keyCode;
		if( global_control_mode == 1 || globalFocusArea == 1 ){
	        return;	
	    }
		//移除页面上的监听
		/*
		if(typeof(grabEvent) == "undefined"){//可能是页面上没有定义相应的函数
			switch(val){
				 case ROC_IRKEY_EXIT:
		            window.location.href=portRoot+"/html/playTv.html";
		         break;
		         case ROC_IRKEY_MENU:
				     window.location.href=portRoot+"/index.html";
		         break;
			}
		}
		*/
		globalFocusArea = 1;//说明弹出全局对话框
		document.removeEventListener("keypress",grabEvent,false);
		switch(val){
		   case ROC_IRKEY_EXIT:
		       //弹出提示框
			   global_exit_type=GLOBAL_EXIT;
			   showConfirmMsg("确定要退出吗?");
			    
		   break;
		   case ROC_IRKEY_MENU:
		       global_exit_type=GLOBAL_MENU;
			   showConfirmMsg("确认回主菜单吗?");
			   event.preventDefault();
		   break;
		}
	}
//显示信息
//确认退出是转到放电视页面
//确认进主菜单到主菜单页面
//如果取消，都在本页面不操作
function showConfirmMsg(_global_msg){
	/*
	if(confirm(_global_msg)){
	   switch(global_exit_type){
		   case GLOBAL_EXIT:
		      window.location.href=portRoot+"/html/playTv.html";
		   break;
		   case GLOBAL_MENU:
		      window.location.href=portRoot;
		   break;
	   }
	}else{
		globalFocusArea =0;
	   //alert("false");	
	   //不操作，让下一个监听处理
	}*/
	var div0 = document.createElement("div");
	global_msg_div = div0;
	div0.id="tip_box_bg_global";
	div0.className="tip_box_bg";
	
	/*div0.style.width="487px";
	div0.style.height="225px";
	div0.style.left="399px";
	div0.style.top="220px";
	div0.style.zIndex=6;*/
	
	div0.style.background="url('"+PORTAL_SUB_ADDR_IMG+"/images/tip_box.png')";
	div0.style.zIndex = 9999;
	var div1 = document.createElement("div");
	div1.id="tip_box_title_global";
	/*
	div1.style.width="398px";
	div1.style.height="34px";
	div1.style.position="absolute";
	div1.style.top="22px";
	div1.style.left="44px";
	div1.style.zIndex=7;
	div1.style.color="#FFF";
	div1.style.fontSize="28px";
	div1.style.textAlign="center";
	div1.style.lineHeight="32px";
*/
	div1.className="tip_box_title";
	div1.innerHTML="提 示";
	
	var div2 = document.createElement("div");
	div2.id="tip_box_text_global";
	div2.className="tip_box_text";
	div2.innerHTML=_global_msg;
	var div3 = document.createElement("div");
	div3.className="tip_box_button_01";
	
	var leftImg =  document.createElement("img");
	leftImg.id="tip_box_img_global_01";
	leftImg.src=PORTAL_SUB_ADDR_IMG+"/images/determine_02.png";
	leftImg.width=190;
	leftImg.height=60;
	div3.appendChild(leftImg);
	
	var div4 = document.createElement("div");
	div4.className="tip_box_button_02";
	
	var rightImg =  document.createElement("img");
	rightImg.id="tip_box_img_global_02";
	rightImg.src=PORTAL_SUB_ADDR_IMG+"/images/cancel.png";
	rightImg.width=190;
	rightImg.height=60;
	div4.appendChild(rightImg);
	
	div0.appendChild(div1);
	div0.appendChild(div2);
	div0.appendChild(div3);
	div0.appendChild(div4);
	document.body.appendChild(div0);
	div0.style.visibility="visible";
	/*
	<div class="tip_box_bg" id="tip_box_bg">
    	<div class="tip_box_title" id="tip_box_title">提 示</div>
        <div class="tip_box_text" id="tip_box_text"></div>
 		<div class="tip_box_button_01">  
         <img src="../images/research.png" width="190" height="60" id="tip_box_img_01" /> 
          </div>
    	<div class="tip_box_button_02"><img src="../images/cancel_02.png" width="190" height="60" id="tip_box_img_02" /></div>
 </div>
 */
}
//处理一些特殊的按键，如节目指南股票等
//document.addEventListener("keypress",globalEvent,true);

//document.onkeypress = globalEvent;




/*G_INFO_FILTER_CHANNEL_TYPE.getChannel = function(_type,_hiddenTag){
	//try{
	var hiddenTag =0;
	if( typeof(_hiddenTag) != "undefined" && _hiddenTag != "" && _hiddenTag != null){
		hiddenTag = parseInt(_hiddenTag);
	}
	if(_type=="chan_all"){
		var channelList = G_INFO_FILTER_CHANNEL_TYPE.getChannel("chan_tv",hiddenTag);
		var au = G_INFO_FILTER_CHANNEL_TYPE.getChannel("chan_au",hiddenTag);
		for(var i=0,len = au.length;i<len;i++){
			channelList.push(au[i])
		}
		return channelList;
	}
	_json = G_INFO_FILTER_CHANNEL_TYPE[_type];
	if(G_INFO_FILTER_CHANNEL_TYPE.needCAFilter){
		if(_json.filterOA==1){
			var channels = new Array();
			for(var k=0;k<_json.filterType.length;k++){
				var tempChs = user.channels.filter([_json.filterType[k],user.channels.FILTER_TYPE_BAT],[_json.filterValue[k],CA.regionCode],0,hiddenTag)
				for(var i=0;i<tempChs.length;i++){
					channels.push(tempChs[i])
				}
			}
		}else{
			var tempFilterType = _json.filterType;
			tempFilterType.push(user.channels.FILTER_TYPE_BAT);
			var tempFilterValue = _json.filterValue;
			tempFilterValue.push(CA.regionCode);
			var channels =  user.channels.filter(tempFilterType,tempFilterValue,0,hiddenTag);
		}
	}else{
		var channels =  user.channels.filter(_json.filterType,_json.filterValue,_json.filterOA,hiddenTag);
	}
	var fiReLen = _json["filterRemove"]?_json.filterRemove.length:0;
	var fiNeLen = _json["filterNeed"]?_json.filterNeed.length:0;
	var fiSeLen = _json["filterService"]?_json.filterService.length:0;
	channelList = new Array();
	if(fiReLen>0||fiNeLen>0||fiSeLen>0){
		for(var i=0,len=channels.length; i<len; i++){
			var rTag = fiReLen>0?G_FUNC.checkNoStr(channels[i].getService().name,_json.filterRemove):true;
			var nTag = fiNeLen>0?G_FUNC.checkHasStr(channels[i].getService().name,_json.filterNeed):true;
			var sTag = fiSeLen>0?G_FUNC.checkHasAttr(channels[i].getService(),_json.filterService):true;
			if(rTag&&nTag&&sTag){
				channelList.push(channels[i])
			}
		}
	}else{
		channelList = channels;
	}
	if(_type=="chan_playback"){
			
	}
	return channelList;
	//}catch(e){alert(e.message)}
}*/
var G_FUNC = {};
G_FUNC.checkHasAttr = function(_Obj,_KeyArr){
	var tag = false;
	for(var k=0,len = _KeyArr.length;k<len;k++){
		var ret = _Obj[_KeyArr[k]];
		ret==true?tag = true:"";
	}
	return tag;
}

G_FUNC.checkHasStr = function(_Str,_KeyArr){
	var tag = false;
	for(var k=0,len = _KeyArr.length;k<len;k++){
		var ret = _Str.indexOf(_KeyArr[k]);
		ret>=0?tag = true:"";
	}
	return tag;
}
G_FUNC.checkNoStr = function(_Str,_KeyArr){
	var tag = true;
	for(var k=0,len = _KeyArr.length;k<len;k++){
		var ret = _Str.indexOf(_KeyArr[k]);
		ret>=0?tag = false:"";
	}
	return tag;
}


function getChannelId(_list,_idx){
	try{
	switch(G_INFO_SHOW_CHANNELID_TYPE){
		case 0:
		channelId = _list[_idx].channelId;
		break;
		case 1:
		if(_list[_idx].logicalChannelId!=null){
			channelId = _list[_idx].logicalChannelId
		}else{
			channelId = _idx+1;
		}
		break;
		case 2:
			channelId = _idx+1;
		break;
		default:
			channelId = _list[_idx].channelId;
		break;
		}
		return channelId;
	}catch(e){/*alert(e.message)*/}
}

var PANELDISPLAY = {
	ShowText:function(text){
      SysSetting.panelDisplayText(text+"")
	},
	ShowNum:function(CID){
      var TEXT = CID
	  TEXT = CID<1000?"0"+CID:TEXT;
	  TEXT = CID<100?"00"+CID:TEXT;
	  TEXT = CID<10?"000"+CID:TEXT;	
	  SysSetting.panelDisplayText(TEXT)
	},
	Default:function(){
	  SysSetting.panelDisplayText("good")
	}
  }
PANELDISPLAY.Default();

var globalConfigArray = [];
var serviceHandleIndexHash = {};
var groupIndexHash = {};
var numberIndexHash = {};
var nvodGroupIDIndexHash = [];
var channelGroups = [];
var nvodGroups = {};
var allNVODGroupID = 10007;
var favoriteGroupID = 10001;
var notAudioGroupID = 10002;
var timeShiftGroupID = 10003;
var allChannelGroupID = 10006;
var offChannel = null;
var extendInfoArray = [];
var channelInfoObj = null;
var configServiceFlag = [];
var mainFre = 0;
var searchArray = [];
var groupListCache = {};
groupListCache.caCode = CA.regionCode;


var favoriteGroupList = {
	"GroupName": "喜爱频道",
	"GroupInfo": []
};

var allChannelGroupList = {
	"GroupName": "所有频道",
	"GroupInfo": []
};

var editGroupList = [];
	

function saveServiceInfoFile(content)
{
	return saveJSONFile("/storage/storage0/siConfig/ServiceInfo.json", content, 1);
}

function getOffChannel()
{
	var envOffChannel = SysSetting.getEnv("OFF_CHANNEL");
	var offChannel = "";
	if (envOffChannel != "") {
		offChannel = eval("(" + envOffChannel + ")");
	} else {
		offChannel = readFile('/storage/storage0/siConfig/OffChannel.json', 1);
	}
	return offChannel;
}

var saveOffChannelTimer = -1;
function saveOffChannel(content)
{
	var ret = true;
	SysSetting.setEnv("OFF_CHANNEL", JSON.stringify(content));
	clearTimeout(saveOffChannelTimer);
	saveOffChannelTimer = setTimeout(function() {
		saveJSONFile("/storage/storage0/siConfig/OffChannel.json", content, 1);
	}, 5000);
	return ret;
}

function parseFile(filePath)
{
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
	
	try {
		var result = JSON.parse(ret);
	} catch(e) {
		console.debug("=================================json parse error");
		return null;
	}
	
	ret = fileHandle.close();
	if(ret == -1){
		return null;
	}
	
	ret = FileSystem.killObject(fileHandle);
	if(ret == 0)
		return null;
		
	return result;
}

function readFile(filePath, count)
{
	var ret = null;
	while(count > 0 && (ret = parseFile(filePath)) == null)
	{
		--count;
	}
	return ret;
}

function saveFileOnce(filePath, content)
{
	var fileHandle = FileSystem.createFile();
	var ret = fileHandle.open(1);
	if(ret == 0){
		return false;
	}
	
	var text = JSON.stringify(content, null, 4);
	ret = fileHandle.writeFile(text);
	if(ret == 0){
		return false;
	}
		
	ret = fileHandle.close();
	if(ret == -1){
		return false;
	}
	
	var dirObj = FileSystem.createDirectory(filePath.substring(0, filePath.lastIndexOf('/')));
	if(dirObj == 0)
	{	
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

function saveJSONFile(filePath, content, count)
{
	var ret = false;
	while(count > 0 && (ret = saveFileOnce(filePath, content)) == false)
	{
		--count;
	}
	return ret;
}

function initChannelInfoFile(originalArray)
{
	//FIXME:此函数与index.html中的函数重名，但如果read(channelinfo.json)不发生错误的话是不会走这个函数的 by jh 20151214
	channelInfoObj = {};
	var originalServiceArray = originalArray.ServiceInfo.ServiceArray;	
	for(var i = 0; i < originalServiceArray.length; ++i)
	{
		channelInfoObj[originalServiceArray[i].ServiceHandle] = {};
		channelInfoObj[originalServiceArray[i].ServiceHandle]["serviceId"] = originalServiceArray[i].ServiceId;
		channelInfoObj[originalServiceArray[i].ServiceHandle]["hide"] = 0;
		channelInfoObj[originalServiceArray[i].ServiceHandle]["favorite"] = 0;
		channelInfoObj[originalServiceArray[i].ServiceHandle]["lock"] = 0;
		channelInfoObj[originalServiceArray[i].ServiceHandle]["volume"] = 16;
		channelInfoObj[originalServiceArray[i].ServiceHandle]["channelId"] = originalServiceArray[i].ChannelId;
		if(typeof globalConfigArray[serviceHandleIndexHash[originalServiceArray[i].ServiceHandle]] != "undefined" 
			&& typeof globalConfigArray[serviceHandleIndexHash[originalServiceArray[i].ServiceHandle]].VolumeOffset != "undefined")
		{

			channelInfoObj[originalServiceArray[i].ServiceHandle]["offset"] = 
				globalConfigArray[serviceHandleIndexHash[originalServiceArray[i].ServiceHandle]].VolumeOffset;
		}
		else
		{
			channelInfoObj[originalServiceArray[i].ServiceHandle]["offset"] = 0;
		}
	}
	
	return saveJSONFile("/storage/storage0/siConfig/ChannelInfo.json", channelInfoObj, 1);
}

function saveChannelInfoFile()
{
	return saveJSONFile("/storage/storage0/siConfig/ChannelInfo.json", channelInfoObj, 1);
}
var siVersion = -1;
function initConfig(originalArray,channelInfoObj){
	var parseSaveFlag = 0;
	siVersion = originalArray.Version;
	var originalTsArray = originalArray.ServiceInfo.TsInfoArray;
	var tempTsObj = {};
	for(var i = 0; i < originalTsArray.length; ++i)
	{
		tempTsObj[originalTsArray[i].TsId] = originalTsArray[i];
	}

	if(typeof originalArray.ServiceInfo.ServiceExtArray != "undefined")
	{
		var originalServiceExtArray = originalArray.ServiceInfo.ServiceExtArray;	
		var tempServiceExtObj = {};
		for(i = 0; i < originalServiceExtArray.length; ++i)
		{
			tempServiceExtObj[originalServiceExtArray[i].ServiceHandle] = originalServiceExtArray[i];
		}
	}
	
	var originalDVBGroupArray = originalArray.ServiceGroupInfo.DVBGroupArray;	
	var tempDVBGroupObj = {};
	for(i = 0; i < originalDVBGroupArray.length; ++i)
	{
		for(var k = 0; k < originalDVBGroupArray[i].GroupServices.length; ++k)
		{
			if(tempDVBGroupObj[originalDVBGroupArray[i].GroupServices[k].ServiceHandle] instanceof Array)
			{
				var len = tempDVBGroupObj[originalDVBGroupArray[i].GroupServices[k].ServiceHandle].length;
				tempDVBGroupObj[originalDVBGroupArray[i].GroupServices[k].ServiceHandle][len] = {};
				tempDVBGroupObj[originalDVBGroupArray[i].GroupServices[k].ServiceHandle][len]["GroupId"] = originalDVBGroupArray[i].GroupId;
				tempDVBGroupObj[originalDVBGroupArray[i].GroupServices[k].ServiceHandle][len]["GroupName"] = originalDVBGroupArray[i].GroupName;			
			}
			else
			{
				tempDVBGroupObj[originalDVBGroupArray[i].GroupServices[k].ServiceHandle] = [];
				tempDVBGroupObj[originalDVBGroupArray[i].GroupServices[k].ServiceHandle][0] = {};
				tempDVBGroupObj[originalDVBGroupArray[i].GroupServices[k].ServiceHandle][0]["GroupId"] = originalDVBGroupArray[i].GroupId;
				tempDVBGroupObj[originalDVBGroupArray[i].GroupServices[k].ServiceHandle][0]["GroupName"] = originalDVBGroupArray[i].GroupName;
			}
		}
	}
		
	var originalServiceSortArray = originalArray.ServiceSortInfo.ServiceSortArray;
	var tempServiceSortObj = {};
	for(i = 0; i < originalServiceSortArray.length; ++i)
	{
		tempServiceSortObj[originalServiceSortArray[i].ServiceHandle] = originalServiceSortArray[i];
		numberIndexHash[originalServiceSortArray[i].ChannelNumber] = i;
	}
	
	var originalVarsInfoArray = originalArray.VarsInfo;
	for(i = 0; i < originalVarsInfoArray.length; ++i)
	{
		extendInfoArray[originalVarsInfoArray[i]["VarsId"]] = [];
		if(originalVarsInfoArray[i].VarsArray instanceof Array)
		{
			for(j = 0; j < originalVarsInfoArray[i].VarsArray.length; ++j)
			{
				extendInfoArray[originalVarsInfoArray[i]["VarsId"]][j] = [];
				extendInfoArray[originalVarsInfoArray[i]["VarsId"]][j]["name"] = originalVarsInfoArray[i].VarsArray[j].Name;
				extendInfoArray[originalVarsInfoArray[i]["VarsId"]][j]["url"] = originalVarsInfoArray[i].VarsArray[j].Addr;
			}
		}
		else if (typeof originalVarsInfoArray[i].VarsArray != "undefined")
		{
			extendInfoArray[originalVarsInfoArray[i]["VarsId"]][0] = [];
			extendInfoArray[originalVarsInfoArray[i]["VarsId"]][0]["name"] = originalVarsInfoArray[i].VarsArray.Name;
			extendInfoArray[originalVarsInfoArray[i]["VarsId"]][0]["url"] = originalVarsInfoArray[i].VarsArray.Addr;
		}
	}
	
	var originalServiceArray = originalArray.ServiceInfo.ServiceArray;	
	var index = 0;
	var temp = 0;
	
	var tempServiceTypeHash = {};
	for(i = 0; i < originalServiceArray.length; ++i)
	{
		tempServiceTypeHash[originalServiceArray[i].ServiceHandle] = originalServiceArray[i].ServiceType;
	}
	
	for(var n = 0; n < originalServiceArray.length; ++n)
	{	
		if(typeof tempServiceSortObj[originalServiceArray[n].ServiceHandle] != "undefined")
		{
			temp = parseInt(tempServiceSortObj[originalServiceArray[n].ServiceHandle]["ChannelNumber"], 10) - 1;
			
			editGroupList[temp] = {};
			editGroupList[temp]["ServiceHandle"] = originalServiceArray[n].ServiceHandle;
			editGroupList[temp]["ChannelNumber"] = tempServiceSortObj[originalServiceArray[n].ServiceHandle]["ChannelNumber"];
			editGroupList[temp]["ServiceName"] = originalServiceArray[n].ServiceName;
			editGroupList[temp]["ServiceType"] = tempServiceTypeHash[originalServiceArray[n].ServiceHandle];
			editGroupList[temp]["RegionCode"] = originalServiceArray[n].RegionCode;
			editGroupList[temp]["ChannelId"] = originalServiceArray[n].ChannelId;
		}
	
		if((window.location.href + "").indexOf("channel_manager.v2.html") == -1)
		{
			if(channelInfoObj[originalServiceArray[n].ServiceHandle]
				&& channelInfoObj[originalServiceArray[n].ServiceHandle].hide)
			{
				continue;
			}
		}
		
		globalConfigArray[index] = originalServiceArray[n]; //reference
		serviceHandleIndexHash[originalServiceArray[n].ServiceHandle] = index;
		
		
		for(var j in tempTsObj[originalServiceArray[n].TsId]){
			globalConfigArray[index][j] = tempTsObj[originalServiceArray[n].TsId][j];
		}
		
		if(typeof originalArray.ServiceInfo == "undefined")
			console.debug("=============================originalArray = "+ originalArray);
			
		if(typeof originalArray.ServiceInfo.ServiceExtArray != "undefined")
		{
			for( j in tempServiceExtObj[originalServiceArray[n].ServiceHandle]){
				globalConfigArray[index][j] = tempServiceExtObj[originalServiceArray[n].ServiceHandle][j];
			}
		}
		
		for( j in tempServiceSortObj[originalServiceArray[n].ServiceHandle]){
			globalConfigArray[index][j] = tempServiceSortObj[originalServiceArray[n].ServiceHandle][j];
		}
		
		globalConfigArray[index]["GroupInfo"] = tempDVBGroupObj[originalServiceArray[n].ServiceHandle];
		var len = 0;
		var tempLen = 0;
		if(typeof tempDVBGroupObj[originalServiceArray[n].ServiceHandle] == "undefined")
		{
			++index;
			continue;
		}
		else
		{
			for(var m = 0; m < tempDVBGroupObj[originalServiceArray[n].ServiceHandle].length; ++m)
			{
				if(typeof groupIndexHash[tempDVBGroupObj[originalServiceArray[n].ServiceHandle][m]["GroupId"]] != "undefined")
				{
					tempLen = groupIndexHash[tempDVBGroupObj[originalServiceArray[n].ServiceHandle][m]["GroupId"]]["GroupList"].length;
					groupIndexHash[tempDVBGroupObj[originalServiceArray[n].ServiceHandle][m]["GroupId"]]["GroupList"][tempLen] = index;
				}
				else
				{
					groupIndexHash[tempDVBGroupObj[originalServiceArray[n].ServiceHandle][m]["GroupId"]] = {};
					groupIndexHash[tempDVBGroupObj[originalServiceArray[n].ServiceHandle][m]["GroupId"]]["GroupName"] = 
						tempDVBGroupObj[originalServiceArray[n].ServiceHandle][m]["GroupName"];
					groupIndexHash[tempDVBGroupObj[originalServiceArray[n].ServiceHandle][m]["GroupId"]]["GroupList"] = [];
					groupIndexHash[tempDVBGroupObj[originalServiceArray[n].ServiceHandle][m]["GroupId"]]["GroupList"][0] = index;
				}
			}
		}
	
		if(typeof channelInfoObj[originalServiceArray[n].ServiceHandle] == "undefined")
		{
			channelInfoObj[originalServiceArray[n].ServiceHandle] = {};
			channelInfoObj[originalServiceArray[n].ServiceHandle]["hide"] = 0;
			channelInfoObj[originalServiceArray[n].ServiceHandle]["favorite"] = 0;
			channelInfoObj[originalServiceArray[n].ServiceHandle]["lock"] = 0;
			channelInfoObj[originalServiceArray[n].ServiceHandle]["volume"] = 16;
			channelInfoObj[originalServiceArray[n].ServiceHandle]["offset"] = 0;
			parseSaveFlag = 1;
			globalConfigArray[index]["hide"] = 0;
			globalConfigArray[index]["favorite"] = 0;
			globalConfigArray[index]["lock"] = 0;
		}
		else
		{
			for(j in channelInfoObj[originalServiceArray[n].ServiceHandle])
			{
				globalConfigArray[index][j] = channelInfoObj[originalServiceArray[n].ServiceHandle][j];
			}
		}
		
		if(channelInfoObj[globalConfigArray[index].ServiceHandle].favorite == 1)
		{
			favoriteGroupList["GroupInfo"][parseInt(globalConfigArray[index].ChannelNumber, 10)] 
				= globalConfigArray[index];
		}
			
		if(typeof globalConfigArray[index].ChannelNumber != "undefined")
		{
			temp = parseInt(globalConfigArray[index].ChannelNumber, 10) - 1;
			allChannelGroupList["GroupInfo"][temp] = globalConfigArray[index];
		}
		
		globalConfigArray[index].currentGroupId = globalConfigArray[index].GroupInfo[0].GroupId;		
		++index;
	}
	
	for(var i = 0; i < allChannelGroupList["GroupInfo"].length; ++i)
	{
		if(typeof allChannelGroupList["GroupInfo"][i] == "undefined")
		{
			allChannelGroupList["GroupInfo"].splice(i,1);
			--i;
		}
	}
	
	for(var i = 0; i < favoriteGroupList["GroupInfo"].length; ++i)
	{
		if(typeof favoriteGroupList["GroupInfo"][i] == "undefined")
		{
			favoriteGroupList["GroupInfo"].splice(i,1);
			--i;
		}
	}
	
	for(var i = 0; i < originalDVBGroupArray.length; ++i)
	{
		channelGroups[i] = originalDVBGroupArray[i].GroupId;
		if(typeof groupIndexHash[originalDVBGroupArray[i].GroupId] == "undefined")
		{
			groupIndexHash[originalDVBGroupArray[i].GroupId] = {};
			groupIndexHash[originalDVBGroupArray[i].GroupId]["GroupName"] = originalDVBGroupArray[i].GroupName;
			groupIndexHash[originalDVBGroupArray[i].GroupId]["GroupList"] = [];
		}
	}

	len = channelGroups.length;
	channelGroups[len] = favoriteGroupID;
	configServiceFlag = originalArray.ServiceFlag;
	if (configServiceFlag.NVODFlag == 1 && typeof originalArray.ServiceGroupInfo.NVODGroupArray != "undefined") {
		var originalNVODGroupArray = originalArray.ServiceGroupInfo.NVODGroupArray;
		if(originalNVODGroupArray instanceof Array)
		{
			for(i = 0; i < originalNVODGroupArray.length; ++i)
			{
				var nvodGroupID = originalNVODGroupArray[i]["NvodGroupId"];
				nvodGroups[nvodGroupID] = {};
				nvodGroupIDIndexHash[i] = nvodGroupID;
				nvodGroups[nvodGroupID]["NvodGroupName"] = originalNVODGroupArray[i]["NvodGroupName"];
				nvodGroups[nvodGroupID]["NvodGroupFlag"] = originalNVODGroupArray[i]["NvodGroupFlag"];
				nvodGroups[nvodGroupID]["NvodGroupServices"] = [];
				for(m = 0; m < originalNVODGroupArray[i]["NvodGroupServices"].length; ++m)
					nvodGroups[nvodGroupID]["NvodGroupServices"][m] = 
						globalConfigArray[serviceHandleIndexHash[originalNVODGroupArray[i]["NvodGroupServices"][m]]];
			}
		}
		else
		{
			var nvodGroupID = originalNVODGroupArray["NvodGroupId"];
			nvodGroups[nvodGroupID] = {};
			nvodGroupIDIndexHash[0] = nvodGroupID;
			nvodGroups[nvodGroupID]["NvodGroupName"] = originalNVODGroupArray["NvodGroupName"];
			nvodGroups[nvodGroupID]["NvodGroupFlag"] = originalNVODGroupArray["NvodGroupFlag"];
			nvodGroups[nvodGroupID]["NvodGroupServices"] = [];
			for(m = 0; m < originalNVODGroupArray["NvodGroupServices"].length; ++m)
				nvodGroups[nvodGroupID]["NvodGroupServices"][m] = 
					globalConfigArray[serviceHandleIndexHash[originalNVODGroupArray["NvodGroupServices"][m]]];
		}
	}
	
	if (parseSaveFlag) {
		saveChannelInfoFile();
	}
	
	return globalConfigArray;
}

function getNVODGroupList(GroupId)
{
	if(GroupId != allNVODGroupID)
		return filterRegionCode(nvodGroups[GroupId]);
	else
	{
		var allNVODGroupList = {};
		allNVODGroupList["GroupName"] = "NVOD";
		allNVODGroupList["GroupInfo"] = [];
		var k = 0;
		for(var i = 0; i < nvodGroupIDIndexHash.length; ++i)
		{
			for(var j = 0; j < nvodGroups[nvodGroupIDIndexHash[i]]["NvodGroupServices"].length; ++j)
			{
				allNVODGroupList["GroupInfo"][k] = nvodGroups[nvodGroupIDIndexHash[i]]["NvodGroupServices"][j];
				++k;
			}
		}
		return filterRegionCode(allNVODGroupList);
	}
}

function filterRegionCode(groupList)
{
	var tempRegionCode = CA.regionCode;
	for(var i = 0; i < groupList.GroupInfo.length; ++i)
	{
		var isRegion = false;
		if(groupList.GroupInfo[i].RegionCode instanceof Array)
		{
			for(var j = 0; j < groupList.GroupInfo[i].RegionCode.length; ++j)
			{
				if(groupList.GroupInfo[i].RegionCode[j] == tempRegionCode)
				{
					isRegion = true;
					break;
				}
			}
			if(isRegion == false)
			{
				groupList.GroupInfo.splice(i,1);
				--i;
			}
		}
		else
		{
			if(groupList.GroupInfo[i].RegionCode != 0 && groupList.GroupInfo[i].RegionCode != tempRegionCode)
			{
				groupList.GroupInfo.splice(i,1);
				--i;
			}
		}
	}
	
	return groupList;
}

function getGroupList(GroupId)
{
	var caCode = CA.regionCode;
	if (groupListCache.caCode != caCode) {
		groupListCache = {};
		groupListCache.caCode = caCode;
	}
	if (groupListCache[GroupId]) {
		return groupListCache[GroupId];
	}
	if(GroupId == favoriteGroupID)
	{
		var ret = filterRegionCode(favoriteGroupList);
		if (!groupListCache[GroupId]) {
			groupListCache[GroupId] = ret;
		}
		return ret;
	}
	else if(GroupId == allChannelGroupID) {
		var ret = filterRegionCode(allChannelGroupList);
		if (!groupListCache[GroupId]) {
			groupListCache[GroupId] = ret;
		}
		return ret;
	}
		
	else if(GroupId == timeShiftGroupID) {
		var ret = timeShiftGroup;
		if (!groupListCache[GroupId]) {
			groupListCache[GroupId] = ret;
		}
		return ret;
	}
		
	if(typeof groupIndexHash[GroupId] == "undefined")	
		return null;
	var groupList = {};
	groupList["GroupName"] = groupIndexHash[GroupId]["GroupName"];
	groupList["GroupInfo"] = [];

	for(var i = 0; i < groupIndexHash[GroupId]["GroupList"].length; ++i)
	{
		if(typeof groupIndexHash[GroupId]["GroupList"][i] == "undefined" || groupIndexHash[GroupId]["GroupList"][i] == null)
		{
			continue;
		}
		else
		{
			groupList["GroupInfo"][parseInt(globalConfigArray[groupIndexHash[GroupId]["GroupList"][i]].ChannelNumber, 10)] = globalConfigArray[groupIndexHash[GroupId]["GroupList"][i]];
		}
	}
	
	for(var j = 0; j < groupList.GroupInfo.length; ++j)
	{
		if(typeof groupList.GroupInfo[j] == "undefined")
		{
			groupList.GroupInfo.splice(j,1);
			--j;
		}
	}
	
	var ret = filterRegionCode(groupList);
	if (!groupListCache[GroupId]) {
		groupListCache[GroupId] = ret;
	}
	return ret;
}

function getEditGroupList()
{
	var ret = {};
	ret.GroupName = "所有频道";
	ret.GroupInfo = [];
	for(var i = 0, k = 0; i < editGroupList.length; ++i)
	{
		if(!editGroupList[i]) 
			continue;
		else 
		{
			ret.GroupInfo[k] = editGroupList[i];
			++k;
		}
	}
	
	return filterRegionCode(ret);
}

/*function getEditGroupList(isTVList)
{
	
	var ret = {};
	if(isTVList == 1)
	{
		ret.GroupName = "电视频道";
	}
	else
	{
		ret.GroupName = "广播频道";
	}
	ret.GroupInfo = [];
	
	for(var i = 0; i < editGroupList.length; ++i)
	{
		if(!editGroupList[i]) continue;
		if(isTVList == 1)
		{
			if(editGroupList[i].ServiceType == 1 || editGroupList[i].ServiceType == 17)
			{
				ret.GroupInfo.push(editGroupList[i]);
			}
		}
		else
		{
			if(editGroupList[i].ServiceType == 2)
			{
				ret.GroupInfo.push(editGroupList[i]);
			}
		}
	}
	
	return filterRegionCode(ret);
}*/

function setTempUnLock(service)
{
	var text = SysSetting.getEnv("tempUnLockObj");
	if(text)
	{
		var tempUnLockObj = JSON.parse(text);
	}
	else
	{
		var tempUnLcokObj = {};
	}
	tempUnLockObj[service.ServiceHandle] = 1;
	text = JSON.stringify(tempUnLockObj);
	SysSetting.setEnv("tempUnLockObj", text);
}

function isTempUnLock(service)
{
	var text = SysSetting.getEnv("tempUnLockObj");
	if(text)
	{
		var tempUnLockObj = JSON.parse(text);
		if(tempUnLockObj[service.ServiceHandle]) 
			return true;
		else
			return false;
	}
	else
	{
		var tempUnLockObj = {};
		text = JSON.stringify(tempUnLockObj);
		SysSetting.setEnv("tempUnLockObj", text); 
		return false;
	}
}

function getChannelNumber(networkId, tsId, serviceId)
{
	for(var i = 0; i < globalConfigArray.length; ++i)
	{
		if(globalConfigArray[i].NetworkId == networkId
			&& globalConfigArray[i].TsId == tsId
			&& globalConfigArray[i].ServiceId == serviceId)
		{
			return globalConfigArray[i].ChannelNumber;
		}
	}
	return "";
}

function getSIObj(orginalNetworkId, tsId, serviceId)
{
	for(var i = 0; i < globalConfigArray.length; ++i)
	{
		if(globalConfigArray[i].OriginalNetworkId == orginalNetworkId
			&& globalConfigArray[i].TsId == tsId
			&& globalConfigArray[i].ServiceId == serviceId)
		{
			return globalConfigArray[i];
		}
	}
	return null;
}

var timeShiftGroup = null;

function parseTimeShiftFile()
{
	var timeShift = readFile("/storage/storage0/vod/Timeshift.json", 3);
	//alert(timeShift);
	/*timeShift = {
		TimeShiftChannels:{
			"ServiceId": 101,
			"OriginalNetworkId": 223,
			"TsId": 23,
			"ChannelId": 107530,
			"SupportPlayback": 1,
			"IsOrdered": 1
		}
	};*/
	timeShiftGroup = {};
	timeShiftGroup.GroupName = "时移频道";
	timeShiftGroup.GroupInfo = [];
	var tempGroup = [];
	if (globalConfigArray[0] && typeof globalConfigArray[0].ChannelId != "undefined") {
		var timeShiftFlag = true;
	} else {
		var timeShiftFlag = false;
	}

	if(timeShift != null)
	{
		for(var i = 0; i < timeShift.TimeShiftChannels.length; ++i)
		{
			if(timeShiftFlag) {
				var tempService = getTimeShiftChannel(timeShift.TimeShiftChannels[i].ChannelId);
			} else {
				var tempService = getSIConfigChannel(timeShift.TimeShiftChannels[i].OriginalNetworkId, timeShift.TimeShiftChannels[i].TsId, timeShift.TimeShiftChannels[i].ServiceId);
			}
			
			
			if(tempService)
			{
				var idx = parseInt(tempService.ChannelNumber, 10);
				tempGroup[idx] = tempService;
				tempGroup[idx].ChannelId = timeShift.TimeShiftChannels[i].ChannelId;
				tempGroup[idx].SupportPlayback = timeShift.TimeShiftChannels[i].SupportPlayback;
				tempGroup[idx].IsOrdered = timeShift.TimeShiftChannels[i].IsOrdered;
			}
			else
			{
				continue;
			}
			
		}
		for (var i = 0; i < tempGroup.length; i++) {
			if (tempGroup[i]) {
				timeShiftGroup.GroupInfo.push(tempGroup[i]);	
			}
		}
	}
	
	len = channelGroups.length;
	channelGroups[len] = timeShiftGroupID;	
}

function restoreConfig()
{
	fileName = "/storage/storage0/ServiceInfo/ServiceInfo.json";
	FileSystem.deleteFile("/storage/storage0/siConfig/ServiceInfo.json");
	FileSystem.deleteFile("/storage/storage0/siConfig/ChannelInfo.json");
	FileSystem.deleteFile("/storage/storage0/siConfig/OffChannel.json");
	ret = FileSystem.copyFile(fileName,"/storage/storage0/siConfig/ServiceInfo.json")
	if(ret != 1)
	{
		//globalAlert.hide();
		//showErrorMsg("恢复配置表发生错误！");
		console.debug("恢复配置表发生错误");
		return;
	}
	
	originalArray = readFile("/storage/storage0/siConfig/ServiceInfo.json", 3);
	DataAccess.setInfo ("DVBSetting", "mainFrequency", originalArray.FrequecyInfo.MainFrequency);
	DataAccess.save("DVBSetting", "mainFrequency");
	DataAccess.setInfo("DVBSetting", "mainNVODFrequency", originalArray.FrequecyInfo.NvodMainFrequency);
	DataAccess.save("DVBSetting", "mainNVODFrequency");
	for (var i = 0; i < originalArray.ServiceInfo.TsInfoArray.length; i++) {
		if (originalArray.ServiceInfo.TsInfoArray[i].Frequency == originalArray.FrequecyInfo.NvodMainFrequency) {
			DataAccess.setInfo("DVBSetting", "mainNVODSymbolrate", "" + originalArray.ServiceInfo.TsInfoArray[i].SymbolRate);
			DataAccess.setInfo("DVBSetting", "mainNVODModulation", originalArray.ServiceInfo.TsInfoArray[i].Modulation);
			DataAccess.save("DVBSetting", "mainNVODSymbolrate");
			DataAccess.save("DVBSetting", "mainNVODModulation");
			break;	
		}
	}
	if (DataAccess.getInfo("VodApp", "PortalAddress") == "" && typeof originalArray.VodInfo != "undefined") {
		if(typeof originalArray.VodInfo.PortalAdress != "undefined")
		{
			DataAccess.setInfo("VodApp", "PortalAddress", originalArray.VodInfo.PortalAdress);
			DataAccess.save("VodApp", "PortalAddress");
		}
		if(typeof originalArray.VodInfo.PortalPort != "undefined")
		{
			DataAccess.setInfo("VodApp", "PortalPort", originalArray.VodInfo.PortalPort);
			DataAccess.save("VodApp", "PortalPort");
		}
	}
	SysSetting.setEnv("isGetFre", "");
}

var configurationVersion = readFile("/storage/storage0/ServiceInfo/Version.json", 3);
if(configurationVersion == null)
{
	configurationVersion = {
		version : -1,
		moveFlag : 0
	};
	saveJSONFile("/storage/storage0/ServiceInfo/Version.json", configurationVersion, 1);	
}
if (SysSetting.getEnv("FIRST_OPEN_STB") == "") {
	var CARegionCode = CA.regionCode;
	var localNetworkId = parseInt(SysSetting.getEnv("Local_NetworkId"));
	var regionIndex = -1;
	if (CARegionCode == -1) {
		if (localNetworkId != -1) {
			regionIndex = localNetworkId;
		}
	}
	console.debug("======================CARegionCode================================:" + CARegionCode);
	var localRegionIndex = readFile("/storage/storage0/localNetwork.json", 1);
	if (localRegionIndex == null) {
		localRegionIndex = {
			localNetwork:regionIndex,
			localRegionCode:CARegionCode
		};
		saveJSONFile("/storage/storage0/localNetwork.json", localRegionIndex, 1);	
		console.debug("======================localRegionCode.regionIndex================================:" + JSON.stringify(localRegionIndex));	
	}
	/*if (CARegionCode == -1) { 
		if (regionIndex != -1 && localRegionIndex.localNetwork != -1 && localRegionIndex.localNetwork != regionIndex) {
			FileSystem.deleteDirectory("/storage/storage0/siConfig");
			FileSystem.deleteFile("/storage/storage0/ServiceInfo/ServiceInfo.json");
			FileSystem.deleteFile("/storage/storage0/sysInfo/sysInfo.json");
			localRegionIndex = {
				localNetwork:regionIndex,
				localRegionCode:CARegionCode
			};
			saveJSONFile("/storage/storage0/localNetwork.json", localRegionIndex, 1);	
		}
	} else {
		if (localRegionIndex.localRegionCode != CARegionCode) {
			FileSystem.deleteDirectory("/storage/storage0/siConfig");
			FileSystem.deleteFile("/storage/storage0/ServiceInfo/ServiceInfo.json");
			FileSystem.deleteFile("/storage/storage0/sysInfo/sysInfo.json");
			localRegionIndex = {
				localNetwork:regionIndex,
				localRegionCode:CARegionCode
			};
			saveJSONFile("/storage/storage0/localNetwork.json", localRegionIndex, 1);
		}
	}*/
}

var originalArray = readFile("/storage/storage0/siConfig/ServiceInfo.json", 3);
if(originalArray == null)
{
	restoreConfig();
}
var adCfgInfo = readFile("/storage/storage0/rojao.config", 3);
if(!adCfgInfo) {
	if(originalArray){
		var adCfg = originalArray.AdvInfo;
		if(adCfg) {
			//"AdvInfo":{"AdvFrequency":"578000","AdvModulation":"64QAM","AdvSymbol":"6875","AdvPid":"8050","AdvTimeout":"8"}
			console.debug("save ad config: ad info =  " + JSON.stringify(adCfg));
			adCfg.AdvFrequency = parseInt(adCfg.AdvFrequency, 10);
			adCfg.AdvSymbol = parseInt(adCfg.AdvSymbol, 10);
			adCfg.AdvPid = parseInt(adCfg.AdvPid, 10);
			adCfg.AdvTimeout = parseInt(adCfg.AdvTimeout, 10);
			saveJSONFile("/storage/storage0/rojao.config", adCfg, 1);
		} else {
			console.debug("save ad config: no get ad config info ");	
		}	
	}
}

var channelInfoObj = readFile("/storage/storage0/siConfig/ChannelInfo.json", 3);
if(channelInfoObj == null)
{
	if(originalArray != null)
	{
		channelInfoObj = {};
		var originalServiceArray = originalArray.ServiceInfo.ServiceArray;	
		for(var i = 0; i < originalServiceArray.length; ++i)
		{
			channelInfoObj[originalServiceArray[i].ServiceHandle] = {};
			channelInfoObj[originalServiceArray[i].ServiceHandle]["serviceId"] = originalServiceArray[i].ServiceId;
			channelInfoObj[originalServiceArray[i].ServiceHandle]["hide"] = 0;
			channelInfoObj[originalServiceArray[i].ServiceHandle]["favorite"] = 0;
			channelInfoObj[originalServiceArray[i].ServiceHandle]["lock"] = 0;
			channelInfoObj[originalServiceArray[i].ServiceHandle]["volume"] = 16;
			channelInfoObj[originalServiceArray[i].ServiceHandle]["offset"] = 0;
			channelInfoObj[originalServiceArray[i].ServiceHandle]["channelId"] = originalServiceArray[i].ChannelId;
		}
		initConfig(originalArray, channelInfoObj);
		initChannelInfoFile(originalArray);
	}
}
else
{
	if(originalArray != null)
	{	
		initConfig(originalArray, channelInfoObj);
	}
}

offChannel = getOffChannel();
/*
if(offChannel == null)
{
	if(originalArray != null)
	{
		var tempList = getGroupList(channelGroups[0]);
		offChannel = tempList.GroupInfo[0];
		offChannel.currentGroupId = offChannel.currentGroupId;
		saveOffChannel(offChannel);
	}
}
*/
/*
setInterval(function () {
	if (typeof originalArray.NetworkManager != "undefined") {
		var managerAdress = originalArray.NetworkManager.ManagerAdress;
		var managerPort = originalArray.NetworkManager.ManagerPort;
		var requestUrl = "http://"+managerAdress+ ":" + managerPort + "/StbStatistic?STBSerial=" + SysInfo.STBSerialNumber + "&CANo=" + CA.icNo +"&regionCode=" + CA.regionCode;
		console.debug("statistic requestUrl = " + requestUrl);
		var xmlHandle = new XMLHttpRequest();
		xmlHandle.onreadystatechange = function(){
			if(xmlHandle.readyState == 4){
				if(xmlHandle.status == 200){
					console.debug("statistic data submit success");
				} else {
					console.debug("statistic data submit failed, error code=" + xmlHandle.status);
				}
				xmlHandle = null;
			}
		}
		xmlHandle.open("GET", requestUrl, true);
		xmlHandle.send(null);
	}
}, 60000);*/

if (readFile("/storage/storage0/sysInfo/sysInfo.json", 1) == null) {
	if (typeof originalArray.NetworkManager != "undefined") {
		var managerAdress = originalArray.NetworkManager.ManagerAdress;
		var managerPort = originalArray.NetworkManager.ManagerPort;
		saveJSONFile("/storage/storage0/sysInfo/sysInfo.json", {sysInfo: {STBSerialNumber: SysInfo.STBSerialNumber || "", ManagerAddress: managerAdress, ManagerPort: managerPort}}, 1);
	}
}

//用户行为分析服务器地址，依赖于配置表，故放在global中进行声明
var UserAnalysisIP = "";
(function () {
	if (typeof originalArray.BehaviorAnalysis != "undefined") {
		var addr = originalArray.BehaviorAnalysis.ServerAddress;
		var port = originalArray.BehaviorAnalysis.ServerPort;
		UserAnalysisIP = "http://" + addr + ":" + port + "/winterfaces";
		console.debug("===================UserAnalysisIP : " + UserAnalysisIP);
	}
})();

function VolumeBar(){
	this.volDom = null;
	this.isDisplay = false;
	this.defaultGlobalVol = 16;
	this.displayTimer = -1;
	this.defaultDisplayTime = 5;
	this.muteObj = null;
	this.creatElement = function(){
		this.volDom = document.createElement('div');
		this.volDom.innerHTML = '<div id="global_volume_div"><div id="global_volume"></div><div id="global_volume_btn"></div><div id="global_volume_value">22</div></div>';
		document.body.appendChild(this.volDom);	
		this.hideVolumeBar();
		this.showMuteState();
	},
	this.show = function(){
		this.isDisplay = true;
		this.volDom.style.visibility = "visible";
		var self = this;
		if(this.displayTimer != -1) clearTimeout(this.displayTimer);
		this.displayTimer = setTimeout(function(){
			self.hideVolumeBar();
		}, this.defaultDisplayTime*1000);
		
	},
	this.hideVolumeBar = function(){
		if(this.displayTimer != -1) {
			clearTimeout(this.displayTimer);
			this.displayTimer = -1;
		}
		this.isDisplay = false;
		this.volDom.style.visibility = "hidden";
		if(this.isGlobalVolume() == false) {
			saveChannelInfoFile();
		}
	},
	this.changeVolumeBar = function(volume){
		if(this.displayTimer != -1) clearTimeout(this.displayTimer);
		var self = this;
		this.displayTimer = setTimeout(function(){
			self.hideVolumeBar();
		}, this.defaultDisplayTime*1000);
		document.getElementById("global_volume_value").innerHTML = volume;
		if(volume == 0){
			document.getElementById("global_volume").style.width ="1px";
			document.getElementById("global_volume_btn").style.width = parseInt(18.3*volume+50) + "px";
		} else {
			document.getElementById("global_volume").style.width = parseInt(18.3*volume)+"px";
			document.getElementById("global_volume_btn").style.width = parseInt(18.3*volume+50) + "px";
		}
		this.muteObj.style.visibility = "hidden";
	//	var player = this.getPlayer();
//		if(player.getMute()){
//			player.audioUnmute();
//		}
	},
	this.volumeUp = function() {
		if(!this.isDisplay) this.show();
		var volume = null;
		if(this.isGlobalVolume()){
			volume = parseInt(this.getGlobalVolume());
			volume++;
			if(volume > 32) volume = 32;
			this.setGlobalVolume(volume);
			volume = volume + this.getOffset();
			if(volume < 0) volume = 0;
			if(volume > 32) volume = 32;
			this.saveVolume(volume);
		} else {
			volume = this.getCurrChannelVol();
			volume++;
			if(volume > 32) volume = 32;
			if(typeof(playTvObj) != "undefined" &&  typeof(playTvObj.playService) != "undefined") {
				var currChannel = playTvObj.playService;
				if(channelInfoObj && channelInfoObj[currChannel.ServiceHandle] && typeof(channelInfoObj[currChannel.ServiceHandle].volume) != "undefined") {
					 channelInfoObj[currChannel.ServiceHandle].volume = volume;
				}
			}
			this.saveVolume(volume);	
		}
		this.changeVolumeBar(volume);
	},
	this.volumeDown = function(){
		if(!this.isDisplay) this.show();
		var volume = null;
		if(this.isGlobalVolume()){
			volume = this.getGlobalVolume();
			volume--;
			if(volume < 0) volume = 0;
			this.setGlobalVolume(volume);
			volume = volume + this.getOffset();
			if(volume < 0) volume = 0;
			if(volume > 32) volume = 32;
			this.saveVolume(volume);
		} else {
			volume = this.getCurrChannelVol();
			volume--;
			if(volume < 0) volume = 0;
			if(typeof(playTvObj) != "undefined" &&  typeof(playTvObj.playService) != "undefined") {
				var currChannel = playTvObj.playService;
				if(channelInfoObj && channelInfoObj[currChannel.ServiceHandle] && typeof(channelInfoObj[currChannel.ServiceHandle].volume) != "undefined") {
					 channelInfoObj[currChannel.ServiceHandle].volume = volume;
				}
			}
			this.saveVolume(volume);
		}
		this.changeVolumeBar(volume);
	},
	this.setMute = function(){
		var player = this.getPlayer();
		if(player.getMute()){
			this.muteObj.style.visibility = "hidden";
			player.audioUnmute();
		} else {
			this.muteObj.style.visibility = "visible";
			player.audioMute();
		}
		
	},
	this.showMuteState = function(){
		if(this.muteObj == null){
			this.muteObj = document.createElement('div');
			this.muteObj.style.visibility = "hidden";
			document.body.appendChild(this.muteObj);	
			this.muteObj.id = "global_mute_flag";//用于在pub.css中设置静音图片样式
		}
		var player = this.getPlayer();
		if(player.getMute()){
			this.muteObj.style.visibility = "visible";
			//player.audioMute();
		} else {
			this.muteObj.style.visibility = "hidden";
			//player.audioUnmute();
		}
	}
	this.getPlayer = function(){
		//page.mediaPlayer.player
		if(typeof(page) != "undefined" && typeof(page.mediaPlayer) != "undefined" && typeof(page.mediaPlayer.player) != "undefined") {
			return page.mediaPlayer.player;	
		} else {
			var id = SysSetting.getEnv("mediaPlayerId");
			var player = new MediaPlayer();
			
			if(id == ""){
				id = player.createPlayerInstance("Video",2);
				SysSetting.setEnv("mediaPlayerId",""+id)
			}else{
				player.bindPlayerInstance(parseInt(id))
			}
			return player;
		}
	},
	//判断是否是全局音量
	this.isGlobalVolume = function(){
		return parseInt(DataAccess.getInfo("MediaSetting", "enableGlobalVolumn"))==1?true:false;
	},
	/*改变统一音量值*/
	this.setGlobalVolume = function(volume){
		DataAccess.setInfo("VodApp","QAMName4",volume+"");
		DataAccess.save ("VodApp","QAMName4");
	},	  
	/*得到统一音量值*/
	this.getGlobalVolume = function(){
		var volume = DataAccess.getInfo ("VodApp","QAMName4");
		if(volume!=""&&volume!=null&&typeof(volume)!="undefined"){
			volume = parseInt(volume);
		}else{
			this.setGlobalVolume(this.defaultGlobalVol);
			volume = this.defaultGlobalVol;
		}
		return parseInt(volume);
	},
	/*生效当前音量*/
	this.saveVolume = function(volume){	  
		DataAccess.setInfo("MediaSetting", "OutputVolumn", volume+"");
		DataAccess.save("MediaSetting", "OutputVolumn");
	},
	this.getOffset = function(){
		var offset = 0;
		if(typeof(playTvObj) != "undefined" &&  typeof(playTvObj.playService) != "undefined") {
			var currChannel = playTvObj.playService;
			if(channelInfoObj && channelInfoObj[currChannel.ServiceHandle] && typeof(channelInfoObj[currChannel.ServiceHandle].offset) != "undefined") {
				offset = channelInfoObj[currChannel.ServiceHandle].offset;
			}
		}
		return offset;	
	},
	this.getCurrChannelVol = function(){
		var vol = this.defaultGlobalVol;
		if(typeof(playTvObj) != "undefined" && typeof(playTvObj.playService) != "undefined") {
			var currChannel = playTvObj.playService;
			if(channelInfoObj && channelInfoObj[currChannel.ServiceHandle] && typeof(channelInfoObj[currChannel.ServiceHandle].volume) != 'undefined') {
				vol = channelInfoObj[currChannel.ServiceHandle].volume;
			}
		}
		return parseInt(vol)
	}
}

/*
window.addEventListener("load", function(){
	var currUrl = window.location.href;
	if(currUrl.indexOf("playTv.v2.html") >=0 || currUrl.indexOf("ChanList.v2.html") >=0 || currUrl.indexOf("EPG.v2.html") >=0 || currUrl.indexOf("nvod_play.v2.html") >=0 || currUrl.indexOf("nvod_sort_ext.v2.html") >=0){
		return;	
	}
	globalVolumeBar = new VolumeBar();
	globalVolumeBar.creatElement();
}, false);
*/

/************夜间待机提醒功能*********************/
(function (){
	var sleepCfg = readFile('/storage/storage0/sleepcfg.json', 1);
	if (!originalArray || typeof originalArray.SleepConfig == "undefined" || !originalArray.SleepConfig.IsActive || (sleepCfg && !sleepCfg.isActive)) {
		console.debug("==============night sleep is not available======================");
		return;
	}
	var sleepTime = originalArray.SleepConfig.Time;
	var sleepCheck = function() {
		var lastRemindDate = SysSetting.getEnv("RemindDate");
		console.debug("==============lastRemindDate:" + lastRemindDate);
		var currTime = new Date();
		console.debug("==============currDate:" + currTime.getDate());
		if (currTime.getDate() != lastRemindDate) {
			var currTimeStr = util.date.format(currTime, "hh:mm:ss");
			var currDateStr = util.date.format(currTime, "yyyy/MM/dd");
			var sleepDateObj = new Date(currDateStr + " " + sleepTime);

			console.debug("==============currTimeStr:" + currTimeStr);
			if (currTime >= sleepDateObj && (currTime - sleepDateObj) < 120000) {
				var tip = originalArray.SleepConfig.TipContent;
				globalAlert.init({
					"val": tip,
					"btnInfo":[{
						"name":"确定",
						"callBack":function(){
							globalAlert.hide();
						}
					}],
					"TCB": function() {
						globalAlert.hide();
						SysSetting.standby(0);
					},
					"timeout": 60000});				
				SysSetting.setEnv("RemindDate", "" + new Date().getDate());
			}
		}
	};
	window.addEventListener("load", function() {
		sleepCheck();
		setInterval(function(){
			sleepCheck();
		}, 60000);
	}, false);
})();

/*********************如加资讯扩展功能***************************/
(function() {
	var advFrame = null;
	var msgObj = null;
	var timer = -1;
	var showFlag = false;

	var rojaoAdv = function () {
//		this.init();
		this.isVisible = false;
	};

	rojaoAdv.prototype.init = function () {
		if (!advFrame) {
			var ifm = document.createElement("iframe");
			ifm.name = "adv_frame";
			ifm.style.position = "absolute";
			ifm.style.left = "0px";
			ifm.style.top = "0px";
			ifm.style.width = "1280px";
			ifm.style.height = "720px";
			ifm.style.overflow = "hidden";
			ifm.style.display = "none";
			ifm.frameBorder = "0";
			document.body.appendChild(ifm);
			advFrame = ifm;
		}
		var advEvent = getMsgObj();
		if (advEvent) {
			msgObj = advEvent;
		}
	};

	rojaoAdv.prototype.onAdvEvent = function (evtStr) {
		try {
			console.debug(evtStr);
			var evtObj = eval("(" + evtStr + ")");
		} catch (e) {
			var evtObj = null;
			console.debug("==============error:" + e.message);
		}
		msgObj = evtObj;
		msgObj.ReceiveTime = new Date().getTime();
		console.debug("==============rojaoAdv receiveTime : " + msgObj.ReceiveTime);
		saveMsgObj();
		//this.show();
	};

	rojaoAdv.prototype.onKeyEvent = function (evt) {
		if (!this.isVisible)
			return true;
		var evtCode = evt.which;
		var evtModifiers = {
			"Status": "success",
			"MsgType": msgObj.MsgType,
			"Version": msgObj.Version
		};

		if (SysSetting.sendAppEvent) {
			SysSetting.sendAppEvent(21002, JSON.stringify(evtModifiers), 0, 0);
		}
		var flag = false;
		if (Array.isArray(msgObj.HotKey) && msgObj.HotKey.length > 0) {
			for (var i = 0; i < msgObj.HotKey.length; i++) {
				if (msgObj.HotKey[i] == evtCode) {
					flag = true;
					break;
				}
			}

		} else {
			if (msgObj.HotKey == evtCode) {
				flag = true;
			}
		}
		if (flag) {
			var eventHandle = advFrame.contentWindow.document.onkeydown || advFrame.contentWindow.document.onkeypress;
			if (eventHandle) {
				eventHandle(evt);
			}
			return false;
		} else {
			return true;
		}
	};

	rojaoAdv.prototype.show = function () {
		if (!msgObj) return;
		console.debug("==============rojaoAdv AutoHideTime : " + msgObj.AutoHideTime);
		if (!showFlag) 
			return;
		if (new Date().getTime() - msgObj.ReceiveTime > msgObj.AutoHideTime * 1000) {
			return;
		}
		if (msgObj.DisplayTimes != 65535) {
			if (msgObj.DisplayTimes > 0) {
				msgObj.DisplayTimes--;
			} else {
				return;
			}
		}
		if (!FileSystem.existlocalFile(msgObj.Url)) 
			return;
		this.isVisible = true;
		saveMsgObj();
		advFrame.style.display = "block";
		advFrame.src = "file://" + msgObj.Url;
		if (msgObj.duration != 65535) {
			var self = this;
			timer = setTimeout(function () {
				self.hide();
			}, msgObj.Duration * 1000);
		}
	};

	rojaoAdv.prototype.hide = function () {
		this.isVisible = false;
		advFrame.style.display = "none";
		advFrame.src = "blank.html";
		clearTimeout(timer);
		if (showFlag && msgObj.DisplayTimes != 0) {
			var self = this;
			timer = setTimeout(function (){
				self.show();
			}, msgObj.Interval * 1000);
		}
	};

	rojaoAdv.prototype.close = function () {
		clearTimeout(timer);
		this.isVisible = false;
		advFrame.style.display = "none";
		advFrame.src = "blank.html";
	};

	rojaoAdv.prototype.checkAdvBinding = function (networkId, tsId, serviceId) {
		if (!msgObj) return;
		showFlag = false;
		if (!msgObj.Services) {
			showFlag = true;
		} else {
			var bindType = msgObj.BindType;
			var services = msgObj.Services;
			var findFlag = false;
			for (var i = 0; i < services.length; i++) {
				console.debug("=====================checkAdvBinding service:" + services[i]);
				if (services[i][0] == networkId && services[i][1] == tsId && services[i][2] == serviceId) {
					findFlag = true;
					break;
				}
			}
			
			if ((bindType == "forward" && findFlag) || (bindType == "inverse" && !findFlag)) {
				showFlag = true;
			} else {
				showFlag = false;
			}
		}
		console.debug("=====================checkAdvBinding showFlag:" + showFlag);
		if (showFlag) {
			if (!this.isVisible) {
				this.show();
			}
		} else {
			if (this.isVisible) {
				this.close();
			}
		}
	};

	function saveMsgObj() {
		SysSetting.setEnv("rojaoAdv", JSON.stringify(msgObj));
	}

	function getMsgObj() {
		var msgStr = SysSetting.getEnv("rojaoAdv");
		if (msgStr != "") {
			return eval("(" + msgStr + ")");
		} else {
			return null;
		}
	}

	window.rojaoAdv = new rojaoAdv();
})();
