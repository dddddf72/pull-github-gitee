// JavaScript Document
//具体的IP配置,必须注意的是，页面上引用js时必须把config.js放在global.js 或global2.0.js前面
//try{
var stbVersion = true;
var G_NOTICE_INFO_SHOW_OR_HIDE = true;
var G_NOTICE_INFO_CONTENT = "";
var MY_PORTAL_ADDR="";
var MY_PORTAL_IP = "10.10.31.28";
var MY_PORTAL_PORT="80";
var G_INIT_PASSWORD ="000000"
var G_BTN_TIMEOUT  = 1500;

//获取portal 地址，如果没有获取到，则
var tempPortalAddress = DataAccess.getInfo("VodApp","PortalAddress");

var expIP = /^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/;
if( expIP.test(tempPortalAddress)){
	MY_PORTAL_ADDR = tempPortalAddress+":"+DataAccess.getInfo("VodApp","PortalPort");
}else{
	MY_PORTAL_ADDR = MY_PORTAL_IP +":"+MY_PORTAL_PORT;
}

SysSetting.setEnv("MY_PORTAL_ADDR",MY_PORTAL_ADDR);
//主应用页面的根目录
//这里注意的是，如果迁移项目，要修改的是项目的根目录：portal1011
var PORTAL_SUB_ADDR="http://"+MY_PORTAL_ADDR+"/NewFrameWork/newWeb/html/";
 var portRoot=SysSetting.getEnv("PORTAL_ADDR");
 portRoot = portRoot.substring(0,portRoot.lastIndexOf("/"));
var PORTAL_SUB_ADDR_IMG = ".."
/*if(/^[m][a][i][n]/.test(window.location.href)){
  var PORTAL_SUB_ADDR_IMG = "main://";
}else{
  var PORTAL_SUB_ADDR_IMG = "http://"+MY_PORTAL_ADDR+"/NewFrameWork/newWeb/";
}*/

//var PORTAL_SUB_ADDR_IMG = "http://"+MY_PORTAL_ADDR+"/NewFrameWork/newWeb/";
//增值业务
var ADD_PROGRAM_ADDR = "http://172.16.254.47/ADD_PROGRAM/html/";
//资讯360
//var PMS_ADDR ="172.16.254.47:8085"
var PMS_ADDR ="http://172.16.254.47:8085/webos/page/zixun/"
//云屏
var YUN_PING_ADDR="http://172.16.254.47/Stb/yunping/newWeb-STB-0517/index.html";
//推荐系统
var REC_URL = "http://172.16.254.33:9091";
 
var TV_SHOP ="http://172.16.0.22:8080/TVStore-HD-App";

//其他,页面测试连接
var TEST_UI_DEMO = "http://" + MY_PORTAL_ADDR + "/ui/index.html";


//全局配置项
//G搜索模式
//全局搜索参数
/*
餐宿{搜索模式,业务群ID,标示类型,标示(CA.regionCode)}
广州{0,0,0,0,[1,2,4,5,6,12,17]}
佛山{1,CA.regionCode,2,130,[1,2,4,5,6,12,17]}
东莞{0,0,0,0,[1,2,4,5,6,12,17]}
汕头{0,92,2,0,[1,2,6,12,17]}
*/
G_INFO_SEARCH_CHANNEL_TYPE = {
	SearchMode:0,
	BouquetID:0,
	DescriptorType:0,
	DescriptorTag:0,//0x90
	STGroup:[1,2,4,5,6,12,17]
};
//全局频道过滤参数
/*
广州{true,true,false,[],[]}
佛山{true,true,true,[],[]}
东莞{true,true,false,["V"],[]}

*/
G_INFO_SWARCH_CHANNEL_FITER = {
	usefilter:true,
	//启动过滤
	removeNoName:true,
	//过滤没有没有名字的节目
	removeLogicChannelIdZero:false,
	//过滤逻辑频道号为0的节目
	removeStrStart:[],
	//过滤以XXX开始的频道
	removeStrAll:[]
	//过滤含有XXX的频道
}
G_INFO_SORT_CHANNEL_TYPE_ARR = [[user.channels.SORTKEY_SDTLOGICNUM]]
G_INFO_SORT_CHANNEL_AD_ARR = [["ASC"]];
G_INFO_SORT_CHANNEL_BouquetID_ARR=[0];
G_INFO_SORT_CHANNEL_TAG_ARR = [144];
/*
G排序模式
G_INFO_SORT_CHANNEL_TYPE
参数:数组[]
user.channels.SORTKEY_SERVICEID
user.channels.SORTKEY_TSID
user.channels.SORTKEY_BOUQUETID
user.channels.SORTKEY_SERVICETYPE
user.channels.SORTKEY_SDTLOGICNUM
user.channels.SORTKEY_BATLOGICNUM
user.channels.SORTKEY_SERVICENAME
user.channels.SORTKEY_ FTA_SCR

G_INFO_SORT_CHANNEL_AD
参数:"ASC","DESC"
*/
G_INFO_FILTER_CHANNEL_TYPE = {
	"needCAFilter":false,
	//使用CA区域码进行过滤,使用:[佛山],不使用:[广州,东莞]
	"chan_all":{"name":"所有频道"},
	"chan_tv":{"name":"电视频道","filterType":[user.channels.FILTER_TYPE_SERVICETYPE,user.channels.FILTER_TYPE_SERVICETYPE],"filterValue":[1,17],"filterOA":1},
	//电视频道:使用业务类型1||17联合过滤
	"chan_au":{"name":"音频广播","filterType":[user.channels.FILTER_TYPE_SERVICETYPE],"filterValue":[2],"filterOA":1},
	//音频广播:使用业务类型2过滤
	"chan_sd":{"name":"标清频道","filterType":[user.channels.FILTER_TYPE_SERVICETYPE],"filterValue":[1],"filterOA":1,"filterRemove":["高清","付费","订购"]},
	//标清频道:使用业务类型1过滤,排除高清,付费,订购字段;
	"chan_hd":{"name":"高清频道","filterType":[user.channels.FILTER_TYPE_SERVICETYPE,user.channels.FILTER_TYPE_SERVICETYPE],"filterValue":[1,17],"filterOA":1,"filterNeed":["高清"]},
	//高清频道:使用业务类型1||17过滤,指定高清字段
	"chan_pay":{"name":"付费频道","filterType":[user.channels.FILTER_TYPE_SERVICETYPE],"filterValue":[1],"filterOA":1,"filterNeed":["付费","订购"]},
	//高清频道:使用业务类型1过滤,指定付费,订购字段
	"chan_favtv":{"name":"喜爱频道","filterType":[user.channels.FILTER_TYPE_FAV],"filterValue":[0],"filterOA":0},
	//高清频道:使用业务类型1&喜爱类型过滤
	"chan_playback":{"name":"时移频道","filterType":[user.channels.FILTER_TYPE_SERVICETYPE, user.channels.FILTER_TYPE_SERVICETYPE],"filterValue":[1,17],"filterOA":1,"filterService":["supportPlayback"]}
	//回看频道:使用业务类型1||17过滤,指定业务属性.
};
/*
频道过滤模式:
chan_all 所有频道
chan_tv 电视频道
chan_au 音频广播
chan_sd 标清频道
chan_hd 高清频道
chan_pay 付费频道
chan_favtv 喜爱频道
chan_favau 喜爱广播
chan_playback 回看频道
*/


G_INFO_SHOW_CHANNELID_TYPE = 3;
/*

G频道号显示模式
涉及内容:频道显示,输入频道号跳转,上下切台

0模式: 频道号模式[广州模式]
以CHANNELID显示,固定唯一频道号.

1模式: 逻辑频道号模式[佛山模式]
以LogicChannelId显示,固定唯一(逻辑)频道号.

2模式: ServiceId模式 [东莞模式]
以Index显示,不固定唯一频道号;
*/
/**  
 业务类型说明
**/
/**
 自动搜索页面，各个频段设置,总共配置的频点
**/
/**
AUTO_SEARCH_CONFIG = {
    "freConfig": [{"startFre":"auto","endFre":0},{"startFre":506000,"endFre":0},{"startFre":235000,"endFre":0},{"startFre":243000,"endFre":0},{"startFre":634000,"endFre":642000},{"startFre":570000,"endFre":594000}]
	}
//频段搜索
//SECTION_SEARCH_CONFIG = {}
//全频段搜索
FULL_SECTION_SEARCH_CONFIG = {
	 "freConfig": [{"startFre":"auto","endFre":0},{"startFre":570000,"endFre":578000},{"startFre":235000,"endFre":0},{"startFre":243000,"endFre":0},{"startFre":235000,"endFre":0},{"startFre":594000,"endFre":602000},{"startFre":626000,"endFre":642000},{"startFre":786000,"endFre":794000}]
}

*/



/**NVOD默认主频点值*/
var G_NVODMAINFRE_DEFUALT={
	   hasThisPorterty:true,  //佛山没有些属性准视频点播 值设为FALSE
	   mainNVODFrequency:"514000",
	   mainNVODSymbolrate:"6875",
	   mainNVODModulation:"64QAM"
	}
/**默认主频点值*/
var G_MAINFRE_DEFUALT={
	   hasThisPorterty:true,
	   mainFrequency:"259000",
	   mainFreSymbolrate:"6875",
	   mainFreModulation:"64QAM"
	}
/**应用部署默认参数值*/
var G_AUTODEPLOYER_DEFUALT ={
	  hasThisPorterty:true,
	  Frequency:"714000",
	  udpServer:"172.16.250.215",
	  udpServerPort:"8301",
	  DownloadTimeout:"90"
	  /*symbolRate:
	  modulationMode:
	  type:*/
	}
/**恢复出厂设置时 重置主频点值和NVOD主频道值和应用部署参数值*/
function setSysMainDefault(_config){
	var config = _config;
	/*主频点*/
	if(config.mainFreDefault.hasThisPorterty){
     var ret =  DataAccess.setInfo("DVBSetting","mainFrequency",config.mainFreDefault.mainFrequency);
     var ret1 = DataAccess.setInfo("DVBSetting","mainFreSymbolrate",config.mainFreDefault.mainFreSymbolrate);
     var ret2 = DataAccess.setInfo("DVBSetting","mainFreModulation",config.mainFreDefault.mainFreModulation);
     var ret3 =DataAccess.save("DVBSetting", "mainFrequency");
	 var ret4= DataAccess.save("DVBSetting", "mainFreSymbolrate");
	 var ret5 = DataAccess.save("DVBSetting", "mainFreModulation");
	}
	/*NVOD主频点*/
	if(config.nvodMainFre.hasThisPorterty){
	 var r1 = DataAccess.setInfo("DVBSetting","mainNVODFrequency", config.nvodMainFre.mainNVODFrequency);
	 var r2 = DataAccess.setInfo("DVBSetting","mainNVODSymbolrate",config.nvodMainFre.mainNVODSymbolrate);
	 var r3 = DataAccess.setInfo("DVBSetting","mainNVODModulation",config.nvodMainFre.mainNVODModulation);
	 var r4 = DataAccess.save("DVBSetting", "mainNVODFrequency");
	 var r5 = DataAccess.save("DVBSetting", "mainNVODSymbolrate");
	 var r6 = DataAccess.save("DVBSetting", "mainNVODModulation");
	}
	/*应用部署设置*/
	if(config.autoDeploy.hasThisPorterty){
		DataAccess.setInfo("Autodeployer","Frequency",config.autoDeploy.Frequency);
		DataAccess.setInfo("Autodeployer","udpServer",config.autoDeploy.udpServer);
		DataAccess.setInfo("Autodeployer","udpServerPort",config.autoDeploy.udpServerPort);
		DataAccess.setInfo("Autodeployer","DownloadTimeout",config.autoDeploy.DownloadTimeout);	
		DataAccess.save("Autodeployer","Frequency");
		DataAccess.save("Autodeployer","udpServer");
		DataAccess.save("Autodeployer","udpServerPort");
		DataAccess.save("Autodeployer","DownloadTimeout");
	}	
}


G_INFO_DVB = {
	"gz":{
		"regionCode":{"start":101,"end":999},
		"freConfig": [{"startFre":"auto","endFre":0},{"startFre":506000,"endFre":0},{"startFre":235000,"endFre":0},{"startFre":243000,"endFre":0},{"startFre":634000,"endFre":642000},{"startFre":570000,"endFre":594000}],
	   "networkId": 223,
	   "mainFreDefault":{
			 "hasThisPorterty":true,
	         "mainFrequency":"259000",
	         "mainFreSymbolrate":"6875",
	         "mainFreModulation":"64QAM"
	   },
	   "nvodMainFre":{
		       "hasThisPorterty":true,  //佛山没有些属性准视频点播 值设为FALSE
	           "mainNVODFrequency":"514000",
	           "mainNVODSymbolrate":"6875",
	           "mainNVODModulation":"64QAM"
		 },
		 "autoDeploy":{
			  "hasThisPorterty":true,
	          "Frequency":"714000",
	          "udpServer":"172.16.250.215",
	          "udpServerPort":"8301",
	          "DownloadTimeout":"90"
		  }
	},
	"foshan":{
		"regionCode":{"start":1601,"end":2099},
		"freConfig": [{"startFre":"auto","endFre":0}],
		 "mainFreDefault":{
			 "hasThisPorterty":true,
	         "mainFrequency":"323000",
	         "mainFreSymbolrate":"6875",
	         "mainFreModulation":"64QAM"
	   },
	   "nvodMainFre":{
		       "hasThisPorterty":false,
	           "mainNVODFrequency":"514000",
	           "mainNVODSymbolrate":"6875",
	           "mainNVODModulation":"64QAM"
		 },
		 "autoDeploy":{
			  "hasThisPorterty":true,
	          "Frequency":"714000",
	          "udpServer":"172.16.250.215",
	          "udpServerPort":"8301",
	          "DownloadTimeout":"90"
		  }
	},
	"zhuhai":{
		"regionCode":{"start":1201,"end":1399},
		"freConfig": [{"startFre":"auto","endFre":0},{"startFre":219000,"endFre":0}],
		"networkId": 268,
		"mainFreDefault":{
			 "hasThisPorterty":true,
	         "mainFrequency":"251000",
	         "mainFreSymbolrate":"6875",
	         "mainFreModulation":"64QAM"
	   },
	   "nvodMainFre":{
		       "hasThisPorterty":true, 
	           "mainNVODFrequency":"519000",
	           "mainNVODSymbolrate":"6875",
	           "mainNVODModulation":"64QAM"
		 },
		 "autoDeploy":{
			  "hasThisPorterty":true,
	          "Frequency":"221000",
	          "udpServer":"172.16.250.215",
	          "udpServerPort":"8301",
	          "DownloadTimeout":"90"
		  }
	},
	"dongguan":{
		"regionCode":{"start":4401,"end":5399},
		"freConfig": [{"startFre":"auto","endFre":0}],
		"mainFreDefault":{
			 "hasThisPorterty":true,
	         "mainFrequency":"339000",
	         "mainFreSymbolrate":"6875",
	         "mainFreModulation":"64QAM"
	   },
	   "nvodMainFre":{
		       "hasThisPorterty":true,  
	           "mainNVODFrequency":"187000",
	           "mainNVODSymbolrate":"6875",
	           "mainNVODModulation":"64QAM"
		 },
		 "autoDeploy":{
			  "hasThisPorterty":true,
	          "Frequency":"738000",
	          "udpServer":"172.16.250.215",
	          "udpServerPort":"8301",
	          "DownloadTimeout":"90"
		  }
	},
	"zhanjiang":{
		"regionCode":{"start":2401,"end":2599},
		"freConfig": [{"startFre":"auto","endFre":0},{"startFre":746000,"endFre":0}],
		"mainFreDefault":{
			 "hasThisPorterty":true,
	         "mainFrequency":"339000",
	         "mainFreSymbolrate":"6875",
	         "mainFreModulation":"64QAM"
	   },
	   "nvodMainFre":{
		       "hasThisPorterty":true,  
	           "mainNVODFrequency":"427000",
	           "mainNVODSymbolrate":"6875",
	           "mainNVODModulation":"64QAM"
		 },
		 "autoDeploy":{
			  "hasThisPorterty":true,
	          "Frequency":"714000",
	          "udpServer":"172.16.250.215",
	          "udpServerPort":"8301",
	          "DownloadTimeout":"90"
		  }
	},
	"shaoguan":{
		"regionCode":{"start":2101,"end":2399},
		"freConfig": [{"startFre":"auto","endFre":0}],
		"mainFreDefault":{
			 "hasThisPorterty":true,
	         "mainFrequency":"355000",
	         "mainFreSymbolrate":"6875",
	         "mainFreModulation":"64QAM"
	   },
	   "nvodMainFre":{
		       "hasThisPorterty":true,  
	           "mainNVODFrequency":"514000",
	           "mainNVODSymbolrate":"6875",
	           "mainNVODModulation":"64QAM"
		 },
		 "autoDeploy":{
			  "hasThisPorterty":true,
	          "Frequency":"714000",
	          "udpServer":"172.16.250.215",
	          "udpServerPort":"8301",
	          "DownloadTimeout":"90"
		  }
	},
	"huizhou":{
		"regionCode":{"start":3201,"end":3399},
		"freConfig": [{"startFre":"auto","endFre":0},{"startFre":794000,"endFre":0}],
		"mainFreDefault":{
			 "hasThisPorterty":true,
	         "mainFrequency":"227000",
	         "mainFreSymbolrate":"6875",
	         "mainFreModulation":"64QAM"
	   },
	   "nvodMainFre":{
		       "hasThisPorterty":false,  
	           "mainNVODFrequency":"519000",
	           "mainNVODSymbolrate":"6875",
	           "mainNVODModulation":"64QAM"
		 },
		 "autoDeploy":{
			  "hasThisPorterty":true,
	          "Frequency":"714000",
	          "udpServer":"172.16.250.215",
	          "udpServerPort":"8301",
	          "DownloadTimeout":"90"
		  }
	},
	/**498000为广东数据广播,850000股票频点**/
	"shantou":{
		"regionCode":{"start":1401,"end":1599},
		"freConfig": [{"startFre":"auto","endFre":0},{"startFre":498000,"endFre":0},{"startFre":850000,"endFre":0}],
		"mainFreDefault":{
			 "hasThisPorterty":true,
	         "mainFrequency":"482000",
	         "mainFreSymbolrate":"6875",
	         "mainFreModulation":"64QAM"
	   },
	   "nvodMainFre":{
		       "hasThisPorterty":true,  
	           "mainNVODFrequency":"522000",
	           "mainNVODSymbolrate":"6875",
	           "mainNVODModulation":"64QAM"
		 },
		 "autoDeploy":{
			  "hasThisPorterty":true,
	          "Frequency":"714000",
	          "udpServer":"172.16.250.215",
	          "udpServerPort":"8301",
	          "DownloadTimeout":"90"
		  }
	},
	"qingyuan":{
		"regionCode":{"start":4201,"end":4399},
		"freConfig": [{"startFre":"auto","endFre":0},{"startFre":706000,"endFre":0}],
		"mainFreDefault":{
			 "hasThisPorterty":true,
	         "mainFrequency":"299000",
	         "mainFreSymbolrate":"6875",
	         "mainFreModulation":"64QAM"
	   },
	   "nvodMainFre":{
		       "hasThisPorterty":true,  
	           "mainNVODFrequency":"514000",
	           "mainNVODSymbolrate":"6875",
	           "mainNVODModulation":"64QAM"
		 },
		 "autoDeploy":{
			  "hasThisPorterty":true,
	          "Frequency":"443000",
	          "udpServer":"172.16.250.215",
	          "udpServerPort":"8301",
	          "DownloadTimeout":"90"
		  }
	}
}


G_INFO_DVB_OPER = {
   	 getGinfoDvb:function(_regionCode){
		 for(var obj  in G_INFO_DVB){
			// $J.debug.msg("---start:-"+obj+"---end:"+G_INFO_DVB[obj].regionCode.end);
			 if( _regionCode >= G_INFO_DVB[obj].regionCode.start && _regionCode <= G_INFO_DVB[obj].regionCode.end  ){
				 //$J.debug.Msg("find dvb:"+_regionCode+", "+obj,6,"G_INFO_DVB_OPER");
				 return G_INFO_DVB[obj];
			}
		 }
		 return null;
	 }
}
/**
频道类型配置
//电视频道，标清频道，高清频道，付费频道，广播频道,要做成可配置化，频道类型的logo图片必须和id值一样
**/
//var G_INFO_CHANNEL_TYPE_CONFIG={ 
//    "defaultValue":"chan_tv","video_type":"chan_tv","audio_type":"chan_au",
//	 "chanTypeList":[
//				{"type":"chan","id":"chan_tv","name":"电视频道"},
				/*{"type":"chan","id":"chan_sd","name":"标清频道"},
				{"type":"chan","id":"chan_hd","name":"高清频道"},
				{"type":"chan","id":"chan_pay","name":"付费频道"},*/
//				{"type":"chan","id":"chan_favtv","name":"喜爱频道"},
//				{"type":"chan","id":"chan_playback","name":"时移频道"},
//				{"type":"chan","id":"chan_au","name":"广播频道"}
//	          ]
//	 }


//var G_OINFO_CHANNEL_TYPE_CONFIG=buildGroup();
//G_OINFO_CHANNEL_TYPE_CONFIG.push({GroupId:65535, GroupName:"喜爱频道"});
/*
var G_OINFO_CHANNEL_TYPE_CONFIG = {
    "defaultValue":9999,"video_type":9999,"audio_type":9999,
	 "chanTypeList":[]
}*/
var UseONGOD = 0;
//启用ONGOD列表读取模式
var onlyAllServiceList = false;
//只启用单一列表模式
//var groups = ODVB.getOServiceGroupList();
/*if(groups!=null){
	for(var i= 0,len = groups.length;i<len;i++){
		//G_OINFO_CHANNEL_TYPE_CONFIG.chanTypeList.push({"type":"group","id":groups[i].GroupId,"name":groups[i].GroupName})
	}
}*/

//}catch(e){
  //alert(e.message);	
//}

//后门设置
var backDoorQuick = {
	"index2test":{
		"pa":"index",
		"key":[ROC_IRKEY_YELLOW,ROC_IRKEY_RED,ROC_IRKEY_GREEN],
		"url":TEST_UI_DEMO,
		"index":0
	}

}
