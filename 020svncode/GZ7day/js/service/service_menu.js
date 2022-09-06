/*******************************菜单数据获取 start*********************************/
var portalAddrObj = {}; //保存所有与portal有关的地址

var menuDataAccessObj = (function(){
	function Construct(){
		var self = this;
		this.munuData = null;  //用来json文件中读取的数据
		this.tempMenuData = null; //临时数据
		this.downloadImgList = null;
		this.sourceFlag = false;  //数据来源标志位 0——从portal开机请求获取，1——从内存中取
		this.picDownloadMaskId = -1; //下载id
		
		this.versionInfo = {}, //用来存放本地json文件中菜单和本地信息的版本号
		this.tempVersionInfo = {}, //用来存放请求到的新数据的菜单和本地信息的版本号
		this.downloadPos = 0;  //当前下载的位置
		
		this.checkNetFlag = false;  //检测网络通不通的标志位
		
		this.picFileName = "";  //正在下载的文件名称
		this.downloadImgFlag = false;  //下载完成标志位
		
		
		//主菜单数据
		this.mainMuneData = [{name: "本地"},{name: "直播"},{name: "影视"},{name: "应用"},{name: "我+"}];  
		this.pageNameArr = ["local_page","tv_page", "video_page", "application_page","my_page","play_tv"];
		this.pageIndex = 1;  //page索引
		
		this.secondMenuData = {};  //二级菜单数据,初始化为空数组
		this.secondMenuData["local_page"] = [];
		this.secondMenuData["tv_page"] = [];
		this.secondMenuData["video_page"] = [];
		this.secondMenuData["application_page"] = [];
		this.secondMenuData["my_page"] = [];		
		
		this.configInfo = null;  //用来存放本地配置信息
		
		this.setLocalName = function(localName){  //设置"本地"名称
			var localDom = SumaJS.$("#page_index td")[0];
			if(typeof localName != "undefined"){
				localDom.innerHTML = localName;
				this.mainMuneData[0].name = localName;
			}			
		};
		
		
		//获取主菜单数据
		this.getMainMenuData = function(){
			return this.mainMuneData;
		};

		this.getPageNameArray = function(){
			return this.pageNameArr;
		};
		this.getPageNameByIndex = function(index){
			return this.pageNameArr[index];
		};
		this.setPageIndex = function(index){
			this.pageIndex = index;
		};
		this.getPageIndex = function(){
			return this.pageIndex;
		};
		this.getPageIndexByName = function(pageName){
			for(var i=0;i<this.pageNameArr.length;i++){
				if(this.pageNameArr[i]==pageName){
					return i;
				}
			}
			return 1;
		};
		
		this.setSecondMenuData = function(name,data){  //设置二级菜单数据(修改为根据name来区分)
			switch(name){     //获取到数据的对应格式
				case "直播":  
					SumaJS.debug("setSecondMenuData: TV "+data.toString());
					this.secondMenuData["tv_page"] = data;
					break;
				case "点播":
					SumaJS.debug("setSecondMenuData: VIDEO "+data.toString());
					this.secondMenuData["video_page"] = data;
					break;
				case "应用":
					this.secondMenuData["application_page"] = data;
					break;
				case "我+":
					this.secondMenuData["my_page"] = data;
					break;
				case "本地":
					this.secondMenuData["local_page"] = data;
					break;
				default:
					break;
			}
		};
		
		this.getSecondMenuData = function(moduleName){  //获取二级菜单数据
			switch (moduleName){
				case "local_page":
					return this.secondMenuData["local_page"]||[];
					break;
				case "tv_page":
					return this.secondMenuData["tv_page"]||[];
					break;
				case "video_page":
					return this.secondMenuData["video_page"]||[];
					break;
				case "application_page":
					return this.secondMenuData["application_page"]||[];
					break;
				case "my_page":
					return this.secondMenuData["my_page"]||[];
					break;
				default:
					return [];
					break;
			}
		};
		
		this.getSecondLeftOrRightData = function(moduleName,direction){  //获取左侧或者右侧列表数据
			SumaJS.debug("getSecondLeftOrRightData: "+this.secondMenuData[moduleName].length);
			if(!this.secondMenuData[moduleName] || this.secondMenuData[moduleName].length==0){
				return [];
			}
			var leftArr = [],rightArr = [];
			var tempArr = this.secondMenuData[moduleName];
			for(var i=0;i<tempArr.length;i++){
				if(tempArr[i].type == "0"){  //img地址修改为本地地址	
					var imgValue = tempArr[i].logo;
					var picName = imgValue.substr(imgValue.lastIndexOf("/") + 1);			
					tempArr[i].logo = "file:///"+"/storage/storage0/menu/"+picName;			
					leftArr.push(tempArr[i]);
				}else if(tempArr[i].type == "1"){  								
					rightArr.push(tempArr[i]);
				}
			}
			if(direction == "left"){return leftArr;}
			if(direction == "right"){return rightArr;}
		};
		
		this.preLoadImg = function(){// 预加载图片
			var imgPics=[];
			var tempArrs=this.secondMenuData['tv_page'];
			try{
				for(var i=0; i<4 ; i++){
					if(tempArrs[i].type == "0"){  //img地址修改为本地地址	
						var imgValue = tempArrs[i].logo;
						var picName = imgValue.substr(imgValue.lastIndexOf("/") + 1);			
						var tempA= "file:///"+"/storage/storage0/menu/"+picName;			
						imgPics[i]=new Image();
						imgPics[i].src=tempA;
					}
				}
				return imgPics
			}catch(e){}	
		};
		this.aquireByPortal = function(){  //从portal获取菜单数据
			SumaJS.debug("menuDataAccessObj url = "+portalInterfaceObj["initial"]);
			this.sourceFlag = true;
			var obtainData = {
				url: portalInterfaceObj["initial"],
				method:"GET",
				async: false,  //同步加载
				success: adSuccess,
				failed:function(){  //获取失败解析本地中的文件
					SumaJS.debug("menuDataAccessObj aquireByPortal failed");
					self.checkNetFlag = false;
					self.parseData();					
				}
			};
			SumaJS.ajax(obtainData);
			function adSuccess(data){
				self.checkNetFlag = true;
				SumaJS.debug("menuDataAccessObj aquireByPortal success");
				try{
					var obj = JSON.parse(data.responseText);
					if(typeof obj.menu != "undefined" && typeof obj.menu.version != "undefined"){
						self.tempVersionInfo["menu"] = obj.menu.version;
						SumaJS.debug(" menuDataAccessObj adSuccess tempVersionInfo.menu = " +　self.tempVersionInfo["menu"]);
					}
					if(typeof obj.config != "undefined" && typeof obj.config.version != "undefined"){
						self.tempVersionInfo["config"] = obj.config.version;
						SumaJS.debug(" menuDataAccessObj adSuccess tempVersionInfo.config = " +　self.tempVersionInfo["config"]);
					}
					self.tempMenuData = obj;
					if(self.munuData == null || self.versionInfo["menu"] != self.tempVersionInfo["menu"]){  //本地文件为空或版本号不同
						SumaJS.debug("menuDataAccessObj adSuccess the menu version is not the same");
						FileSystem.createDirectory("/storage/storage0/menu_temp");	//创建临时文件
						saveJSONFile("/storage/storage0/menu_temp/initialData_temp.json", obj, 1);						
						
						SumaJS.debug("====================menuDataAccessObj download pics===============");
						SumaJS.eventManager.addEventListener("menuDataAccessObj", self, 50);
						self.downloadPics();
					}else if(self.versionInfo["config"] != self.tempVersionInfo["config"]){  //只有本地版本号不同时
						SumaJS.debug("menuDataAccessObj adSuccess the config version is not the same");
						saveJSONFile("/storage/storage0/menu/initialData.json", obj, 1); //保存json文件
						self.readJsonInfo(); //只有版本号更新时读取	
						self.parseData(); //解析
					}else{  //两个版本号都相同
						SumaJS.debug("menuDataAccessObj adSuccess all the version is the same");
						self.parseData();
					}
					
				}catch(e){
					SumaJS.debug("menuDataAccessObj adSuccess wrong");
					self.parseData();	
					return false;
				}
			}
		};
				
		this.downloadPics = function(){  //下载图片文件
			//SumaJS.eventManager.addEventListener("menuDataAccessObj", self, 50);
			SumaJS.debug("menuDataAccessObj downloadPics entered");
			if (this.downloadImgList == null) {
				this.downloadImgList = [];
				var menuArr = this.tempMenuData.menu.menuArr;
				for(var i=0; i<menuArr.length;i++){
					if(menuArr[i].name == "直播"){
						var data = menuArr[i].subArr;
						for(var j=0;j<data.length;j++){
							if(typeof data[j].logo != "undefined" && data[j].logo !="" ){
								this.downloadImgList.push(data[j].logo);
							}
						}
					}
				}				
			}	
			var picLength = this.downloadImgList.length;
			SumaJS.debug("menuDataAccessObj downloadPics:" + picLength);
			if (picLength == 0){return false};
			var data = this.downloadImgList[this.downloadPos];
			SumaJS.debug("====================downloadPos===============:" + this.downloadPos);
			if (this.downloadPos < picLength) {
				//var picUrl = PORTAL_ADDR + data;
				var menuPicUrl = picdownLoadPathValid(data);  //添加相对路径或绝对路径的处理
				this.picFileName = data.substr(data.lastIndexOf("/") + 1);
				SumaJS.debug("====================menuPicUrl===============:" + menuPicUrl);
				this.picDownloadMaskId = FileSystem.downloadRemoteFile(menuPicUrl, 5);
				this.downloadPos++;
			} else {
				if(this.downloadImgFlag){
					FileSystem.deleteDirectory("/storage/storage0/menu");
					SumaJS.debug("========deleteDirectory menu 2============");
					var fileList = FileSystem.getDirectory("/storage/storage0/menu_temp").fileList;
					var flag = true;
					if(fileList == -1 || fileList == 0){
						flag = false;
						SumaJS.debug("========getDirectory menu_temp failed============");							
					}
					var dirObj = FileSystem.createDirectory("/storage/storage0/menu");
					if(dirObj == 0){
						flag = false;
						SumaJS.debug("========createDirectory menu failed============");
					}else if(dirObj == -1){
						FileSystem.deleteDirectory("/storage/storage0/menu");
						SumaJS.debug("========deleteDirectory menu 5============");
						FileSystem.createDirectory("/storage/storage0/menu");
					}
					if(flag){
						FileSystem.killObject(dirObj);
						for(var i=0; i<fileList.length; i++){
							var name = fileList[i].name;
							if(name == "menu_temp.json"){
								continue;
							}
							var ret = 0;
							var n = 0;
							while(ret!=1 && n<5){
								ret = FileSystem.moveFile("/storage/storage0/menu_temp/"+name,"/storage/storage0/menu/"+name);
								n++;
							}
							if(ret!=1){
								FileSystem.deleteDirectory("/storage/storage0/menu_temp");
								flag = false;
								break;
							}
						}
						FileSystem.killObject(fileList);
						FileSystem.deleteDirectory("/storage/storage0/menu_temp");							
						if(flag){
							saveJSONFile("/storage/storage0/menu/initialData.json", this.tempMenuData, 1); //保存json文件						
							SumaJS.debug("download complished");
							this.readJsonInfo(); //下载完成后重新读取。
							this.parseData(); //解析
							/*if(self.sourceFlag){  //是开机那次更新
								SumaJS.debug("menuDataAccessObj download complished is open first");
								this.readJsonInfo(); //下载完成后重新读取。	
								this.parseData(); //解析
							}else{  //不是开机那次更新
								SumaJS.debug("menuDataAccessObj download complished is open not first");	
							}*/
						}
					}else{
						SumaJS.debug("menuDataAccessObj download complish error 1");
						FileSystem.killObject(fileList);
						FileSystem.deleteDirectory("/storage/storage0/menu_temp");
						if(self.sourceFlag){  //是开机那次更新
							SumaJS.debug("menuDataAccessObj download complish error 1 is open first");
							this.parseData(); //解析
						}
					}
				}else{
					SumaJS.debug("menuDataAccessObj download complish error 2");
					FileSystem.deleteDirectory("/storage/storage0/menu_temp");
					if(self.sourceFlag){  //是开机那次更新
						SumaJS.debug("menuDataAccessObj download complish error 2 is open first");
						this.parseData(); //解析
					}
				}
			}	
		};
		
		
		 this.aquireBySiconfig = function(){  //从配置表获取二级菜单数据
		  	
		};
		/*this.aquireByMemory = function(){  //获取上次保存的二级菜单数据
			this.sourceFlag = false;
			var dataStr = SysSetting.getEnv("initialData");
			SumaJS.debug("menuDataAccessObj data: "+dataStr);
			self.parseData(dataStr);  //解析初始化数据	
		};*/
		this.aquireByJson = function(){  //从json文件中读取菜单数据
			this.readJsonInfo(); //下载完成后重新读取。	
			this.parseData(); //解析
		};
		
		this.readJsonInfo = function(){  //读取保存的json文件信息
		
			var jsonData = null;
			try{
				jsonData = JSON.parse(readFile("/storage/storage0/menu/initialData.json", 3));
			}catch(e){
				SumaJS.debug("menuDataAccessObj readJsonInfo wrong");
				FileSystem.deleteDirectory("/storage/storage0/menu");
			}
			//SumaJS.debug("menuDataAccessObj readJsonInfo jsonData = "+ JSON.stringify(jsonData));	
			if(jsonData != null){
				this.munuData = jsonData;
				if(typeof jsonData.menu != "undefined" && typeof jsonData.menu.version != "undefined"){
					this.versionInfo["menu"] = jsonData.menu.version;	
				}else{
					this.versionInfo["menu"] = -1; //未读取到时赋值为-1
				}
				if(typeof jsonData.config != "undefined" && typeof jsonData.config.version != "undefined"){
					this.versionInfo["config"] = jsonData.config.version;
				}else{
					this.versionInfo["config"] = -1; //未读取到时赋值为-1
				}
				SumaJS.debug("menuDataAccessObj readJsonInfo versionInfo['menu'] = "+this.versionInfo["menu"]+", versionInfo['config'] = "+this.versionInfo["config"]);
			}else{
				//FileSystem.deleteDirectory("/storage/storage0/menu");
				SumaJS.debug("========deleteDirectory menu============");		
			}
		};
		
		this.parseData = function(){  //新的解析数据
			SumaJS.debug("menuDataAccessObj parseData entered");
			var ret = 0;
			if(this.munuData != null && typeof this.munuData != "undefined"){				
				if(typeof this.munuData!="undefined" && typeof this.munuData.config!="undefined"){  //本地配置信息数据				
					this.configInfo = this.munuData.config;				
					ret = this.parseConfig(this.munuData.config);
				}	
			}			
			if(ret == 0){  
				if(this.munuData != null && typeof this.munuData != "undefined"  && typeof this.munuData.config!="undefined"){  //本地配置信息数据							
					this.parseInitPos(this.munuData.config);  //解析本地板块信息
				}					
				if(this.munuData != null && typeof this.munuData != "undefined" && typeof this.munuData.menu!="undefined"){  //菜单数据
					SumaJS.debug("menuDataAccessObj parseData this.munuData.menu exist");		
					this.parseMenuData(this.munuData.menu);
				}else{
					SumaJS.debug("menuDataAccessObj parseData this.munuData.menu not exist");				
				}
				initialThreeBarBlock();
			}	
			
		};
		this.eventHandler = function(event){
			var code = event.keyCode||event.which;
			SumaJS.debug("menuDataMsg: "+code);
			var modifiers = event.modifiers;
			switch(code) {
				case 10151:  //已下载前端文件到内存中
					SumaJS.debug("menuDataMsg download success");
					if (self.picDownloadMaskId == modifiers) {
						var tempfile = FileSystem.getRemoteFile(self.picDownloadMaskId);
						tempfile.close();
						SumaJS.debug("downloadImgList picFileName =" + self.picFileName);
						self.downloadImgFlag = true;
						tempfile.saveAs('/storage/storage0/menu_temp/' + self.picFileName);
						FileSystem.killObject(tempfile);
						self.picDownloadMaskId = -1;
						self.downloadPics();
					}
					break;
				case 10153: //文件下载失败
					SumaJS.debug("menuDataMsg download failed");
					if (self.picDownloadMaskId == modifiers) {
						SumaJS.debug("downloadImgList failed: "+self.picFileName);
						self.downloadPos = self.downloadImgList.length;
						self.downloadImgFlag = false;
						self.picDownloadMaskId = -1;
						self.downloadPics();	
					}
					break;
				case 10154:  //超时时间到，文件下载未完成
					SumaJS.debug("menuDataMsg download timeout");
					if (self.picDownloadMaskId == modifiers) {
						SumaJS.debug("downloadImgList timeout: "+self.picFileName);
						self.downloadPos = self.downloadImgList.length;
						self.downloadImgFlag = false;
						self.picDownloadMaskId = -1;
						self.downloadPics();	
					}
					break;
				default:
					return true;
					break;
			}
		};
		
		
		this.parseMenuData = function(data){    //解析菜单数据
			if(typeof data.menuArr == "undefined"){return;}
			var array = data.menuArr;	
			for(var i=0;i<array.length;i++){				
				if(typeof array[i].name !="undefined"&&typeof array[i].subArr!="undefined"){
					this.setSecondMenuData(array[i].name,array[i].subArr);
				}
			}
		};
		this.parseConfig = function(data){  //解析本地配置数据
			SumaJS.debug("menuDataAccessObj parseConfig entered");
			if(typeof data.areaName != "undefined"){
				SumaJS.debug("menuDataAccessObj parseConfig areaName entered");
				var arrName = data.areaName.split(",");//分割成数组
				var tempName = arrName[arrName.length-1];//取数组最后一个值
				this.setLocalName(tempName);
			}		
			if(this.sourceFlag && typeof data.dayUrl != "undefined"){  //是开机且每日推荐存在
				SumaJS.debug("menuDataAccessObj parseConfig dayUrl entered");
				//此处添加跳转每日推荐
				if(SysSetting.getEnv("BOOT_RECOMMEND_FLAG") == ""){
					SumaJS.debug("showStartUpRecommend entered");
					SysSetting.setEnv("BOOT_RECOMMEND_FLAG", "1");
					var thisDayUrl = data.dayUrl;
					if(thisDayUrl != "" && self.checkNetFlag){
						SumaJS.debug("enter recommend url = " + thisDayUrl);
						if(!preparesRestartFlag){
							//window.location.href = PORTAL_ADDR + thisDayUrl;
							//jumpPathInitialization(thisDayUrl);
							return 1;
						}else{
							SumaJS.debug("升级完成，准备重启中，不能跳转到每日推荐页面");
						}				
					} 
				}
			}
			return 0;
		};
		this.parseInitPos = function(data){    //解析默认板块
			/*
			if(typeof data.initPos != "undefined" &&　parseInt(data.initPos)>0){				
				SumaJS.debug("menuDataAccessObj parseInitPos initPos entered");
				if((SysSetting.getEnv("BOOT_INITIAL_POS") == "")){   //不是开机就不读取默认版块信息了
					SysSetting.setEnv("BOOT_INITIAL_POS","1");
					this.setPageIndex(parseInt(data.initPos,10)-1);
					userAttrMgr.start(); //用户属性表 ,保证放在跳转每日推荐之后，防止异步请求未结束就调到每日推荐了。					
				}							
			}
			*/

			if(typeof data.initPos != "undefined" &&　parseInt(data.initPos)>0){
				SumaJS.debug("menuDataAccessObj parseInitPos initPos entered");
				var pos = parseInt(data.initPos,10)-1;
				if(pos>4 || pos<0){
					pos = 0;
					SumaJS.debug("wrong pos");
				}
				this.setPageIndex(pos);
			}
			if((SysSetting.getEnv("BOOT_INITIAL_POS") == "")){
				SysSetting.setEnv("BOOT_INITIAL_POS","1");
				userAttrMgr.start(); //用户属性表 ,保证放在跳转每日推荐之后，防止异步请求未结束就调到每日推荐了。
			}
			
		};
		this.getDayUrl= function(){   //获取开机每日推荐地址
			if(typeof this.configInfo != "undefined" && typeof this.configInfo.dayUrl != "undefined"){
				return this.configInfo.dayUrl;
			}
			return "";
		};

		this.getDayUrlByJson = function(){
			if(this.munuData != null){
				if(typeof this.munuData!="undefined" && typeof this.munuData.config!="undefined"){  //本地配置信息数据				
					var configInfo = this.munuData.config;				
					if(typeof configInfo != "undefined" && typeof configInfo.dayUrl != "undefined"){
						return configInfo.dayUrl;
					}
				}
			}
			return "";
		};
		
		
		
		this.aquireByAsync = function(){  //从portal异步获取,主页键时调用
			this.sourceFlag = false;
			SumaJS.debug("menuDataAccessObj aquireByAsync url = "+portalInterfaceObj["initial"]);
			var obtainData = {
				url: portalInterfaceObj["initial"],
				method:"GET",
				async: true,  //异步加载
				success: adSuccess,
				failed:function(){  //获取失败解析本地中的文件
					SumaJS.debug("menuDataAccessObj aquireByAsync failed");				
				}
			};
			SumaJS.ajax(obtainData);
			function adSuccess(data){
				SumaJS.debug("menuDataAccessObj aquireByAsync success");
				try{
					var obj = JSON.parse(data.responseText);
					if(typeof obj.menu != "undefined" && typeof obj.menu.version != "undefined"){
						self.tempVersionInfo["menu"] = obj.menu.version;
					}
					self.tempMenuData = obj;
					if(self.munuData == null || self.versionInfo["menu"] != self.tempVersionInfo["menu"]){  //本地文件为空或版本号不同
						SumaJS.debug("menuDataAccessObj aquireByAsync adSuccess the menu version is not the same");
						FileSystem.createDirectory("/storage/storage0/menu_temp");	//创建临时文件
						saveJSONFile("/storage/storage0/menu_temp/initialData_temp.json", obj, 1);						
						
						SumaJS.debug("====================menuDataAccessObj aquireByAsync download pics===============");
						self.downloadPics();
					}else{  //菜单版本号不同
						SumaJS.debug("menuDataAccessObj aquireByAsync adSuccess all the version is the same");
					}	
				}catch(e){
					SumaJS.debug("menuDataAccessObj aquireByAsync adSuccess wrong");
					return false;
				}
			}
		};
		
		
		
		//初始化所有的portal跳转入口对象
		this.initialPortalAddObj = function(){
			//title和footer
			portalAddrObj["search"] = PORTAL_ADDR+"/NewFrameWork/UE/html/backList.html";
			portalAddrObj["history"] = PORTAL_ADDR+"/NewFrameWork/UE/html/backList.html";
			
			//直播左侧列表
			portalAddrObj["tv_news"] = PORTAL_ADDR+"/NewFrameWork/UE/html/backList.html";
			portalAddrObj["tv_recommend"] = PORTAL_ADDR+"/NewFrameWork/UE/html/backList.html";
			portalAddrObj["tv_choice"] = PORTAL_ADDR+"/NewFrameWork/UE/html/backList.html";
			portalAddrObj["tv_lookBack"] = PORTAL_ADDR+"/NewFrameWork/UE/html/backList.html";
			
			//影视左侧列表
			portalAddrObj["video_blockbusterFilm"] = PORTAL_ADDR+"/NewFrameWork/UE/html/backList.html";
			portalAddrObj["tv_4k"] = PORTAL_ADDR+"/NewFrameWork/UE/html/backList.html";
			portalAddrObj["tv_studiosArea"] = PORTAL_ADDR+"/NewFrameWork/UE/html/backList.html";
			portalAddrObj["tv_dinis"] = PORTAL_ADDR+"/NewFrameWork/UE/html/backList.html";
			
			portalAddrObj["tvBusinessHall"] = PORTAL_ADDR+"/NewFrameWork/UE/html/backList.html";
			portalAddrObj["instructions"] = PORTAL_ADDR+"/NewFrameWork/UE/html/backList.html";
			portalAddrObj["contactUs"] = PORTAL_ADDR+"/NewFrameWork/UE/html/backList.html";			
		};
		this.initialPortalAddObj();
		
	}
	return new Construct();
})();

/*******************************菜单数据获取 end*********************************/









