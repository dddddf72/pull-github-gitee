var iepgIP = "http://10.254.239.56:8088/iepg/";//现网iepg地址

var districtCode = "0000"; //默认分公司编码
var areaCode="0000";//默认区域码
var version="32000";//默认终端版本号
var defaultCity={"pramKey":"0000","pramValue":"0000,32000","remark":"南京市","rank":null,"version":"0"};//默认城市
var defaultWeather={"city":"未获取","date":"未获取","des":"未获取","image": "img/ic_cloud.png","temperature":"未获取"};//默认天气

var tableName = "cityLayout3";//版本对照表参数
var weatherUrl = "http://tvos.jsamtv.com/weather/weatherAction!getWeather.do"; //天气预报接口地址

var localArea = defaultCity;
var weatherArray = null;
var cityData;

var debugInfoOn = false; 
var dev = false; // dev 是否开发环境； true:开发环境，false:现网正式环境；
if(location.href.indexOf("10.9.21") != -1 || location.href.indexOf("localhost") != -1){
	dev = true;
}

var userInfoInterface = {
	"cityUrl":"http://172.31.217.78:8091/aaa/Business/CoshipService?wsdl",
//	"townUrl":"http://172.31.183.54/nn_cms/api/jsyx/z217/z217_b/z217_b_1.php"
	"townUrl":"http://172.31.177.244:18080/differScreenPolicy",
	"NavCheck":"http://118.123.222.5:8080/NavCheck?dataType=JSON",
	"ChannelSelectionStart":"http://118.123.222.5:8080/ChannelSelectionStart"
}

//热播追剧业务
var hotplay = {
	"ip":"http://recommend.jsamtv.com",
	"recommendAction":"/businessrecommend/businessRecommendAction!getRecommend.do",
	"link":"",
	"poster":""
}

//epg栏目信息
var epgChannel = {
	"ip":"http://172.30.21.254",
	"action":"/api/GetChannelInfo",
	"apikey":"6WnJpreH",
	"secretkey":"f742350531faec09be9ad1ffb59abaa9"
}

//数据上报dap
var dataReport = {
	"dapInterface":"http://10.9.220.9:81/dc.gif",
	"heartBeatInterval":1000*60*5
}

//开发环境参数配置
var interfaceUrl = "http://localhost:8888"
if(dev){
	iepgIP = "http://10.9.217.3:8089/iepg/";//开发环境中 iepg地址
	//weatherArray = [{"city":"南通","date":"2018-05-04 11:30:00.0","des":"晴转多云","image":"http://tvos.jsamtv.com/picture/weather/weather_01.png","temperature":"27~17℃"},{"city":"苏州","date":"2018-05-04 11:30:00.0","des":"多云转阴","image":"http://tvos.jsamtv.com/picture/weather/weather_02.png","temperature":"28~18℃"},{"city":"无锡","date":"2018-05-04 11:30:00.0","des":"多云转阴","image":"http://tvos.jsamtv.com/picture/weather/weather_02.png","temperature":"27~18℃"},{"city":"常州","date":"2018-05-04 11:30:00.0","des":"晴转阴","image":"http://tvos.jsamtv.com/picture/weather/weather_02.png","temperature":"28~18℃"},{"city":"镇江","date":"2018-05-04 11:30:00.0","des":"多云转雷阵雨","image":"http://tvos.jsamtv.com/picture/weather/weather_04.png","temperature":"28~18℃"},{"city":"泰州","date":"2018-05-04 11:30:00.0","des":"多云转阴","image":"http://tvos.jsamtv.com/picture/weather/weather_02.png","temperature":"26~17℃"},{"city":"扬州","date":"2018-05-04 11:30:00.0","des":"多云转雷阵雨","image":"http://tvos.jsamtv.com/picture/weather/weather_04.png","temperature":"27~17℃"},{"city":"盐城","date":"2018-05-04 11:30:00.0","des":"晴转多云","image":"http://tvos.jsamtv.com/picture/weather/weather_01.png","temperature":"26~17℃"},{"city":"淮安","date":"2018-05-04 11:30:00.0","des":"多云转雷阵雨","image":"http://tvos.jsamtv.com/picture/weather/weather_04.png","temperature":"27~17℃"},{"city":"宿迁","date":"2018-05-04 11:30:00.0","des":"晴转多云","image":"http://tvos.jsamtv.com/picture/weather/weather_01.png","temperature":"28~18℃"},{"city":"连云港","date":"2018-05-04 11:30:00.0","des":"多云","image":"http://tvos.jsamtv.com/picture/weather/weather_01.png","temperature":"28~15℃"},{"city":"徐州","date":"2018-05-04 11:30:00.0","des":"多云转小雨","image":"http://tvos.jsamtv.com/picture/weather/weather_07.png","temperature":"29~18℃"},{"city":"南京","date":"2018-05-04 11:30:00.0","des":"多云转雷阵雨","image":"http://tvos.jsamtv.com/picture/weather/weather_04.png","temperature":"28~17℃"}];
	weatherUrl = interfaceUrl+"/getWeather";//模拟天气接口

	hotplay.ip = interfaceUrl;
	epgChannel.ip = interfaceUrl;
	userInfoInterface.cityUrl = interfaceUrl+"/cityAction";
	userInfoInterface.townUrl = interfaceUrl+"/townAction";
}

function getAreaCodeAndver(callback) {
	ajax({
        type:"GET",
        url: iepgIP+'getPram?PramName='+tableName+'&version=V001',
        async:true,
        success: function (data)  {
            cityData = eval('(' + data + ')').datas;
            
        },
        error: function () {
        }
    });	
	
}
function showLayout(update,planType){
	if(update){
		saveDistrictCode();	            
        getData(planType);
	}
	//initWeatherInfo();
}


function getArea(districtCode){
	for (var i = cityData.length - 1; i >= 0; i--) {
		if(cityData[i].pramKey==districtCode){
			return cityData[i];
		}
	}
	return defaultCity;
}

function checkAreaExist(districtCode){
	for (var i = cityData.length - 1; i >= 0; i--) {
		if(cityData[i].pramKey==districtCode){
			return true;
		}
	}
	return false;
}

//获取热播追剧资源信息接口
function getHotPlay() {
	var userCode = getUserRelId();
	//var userCode = CITV.loginInfo.getValue("userId");
	ajax({
        type:"GET",
        url: hotplay.ip+hotplay.recommendAction+"?userCode="+userCode,
        async:false,
        success: function (data)  {
        	data = JSON.parse(data);
	    //debug("userId:"+getUserRelId());	
            hotplay.link = "http://recommend.jsamtv.com/recommend.do?userCode="+userCode;
            hotplay.poster = hotplay.ip+data.logo;
        },
        error: function () {
        }
    });	
}

//获取对应直播参数接口
function getEpgChannel(channelId) {
	//$("test").innerHTML = "userCode:"+userCode;
	ajax({
        type:"GET",
        url: epgChannel.ip+epgChannel.action+"?groupid="+weatherCityCode+"&channelId="+channelId+"&apikey="+epgChannel.apikey+"&secretkey="+epgChannel.secretkey,
        async:false,
        success: function (data)  {
            //$("test").innerHTML = "userCode:"+userCode+"=====data:"+data;	
		    data = JSON.parse(data);
            if (data.error.code==0) {
            	var serviceId = data.data.channelServiceId;
            	var frequency = data.data.frequency+"0000";

                saveData();//缓存焦点

				gotoChannel(frequency,serviceId);
				
	        }else{
	        	accessAsset(function(){
                	location.href = "ui://play.html";
                });
	        }
	    },
        error: function () {
        	accessAsset(function(){
                location.href = "ui://play.html";
            });
        }
    });	
}
