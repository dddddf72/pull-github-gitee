(function(window) {
	var SumaJS = function() {
		this.global = {};
		var modules = {};
		var pages = {};
		var currentPageObj = null;
		var isDebug = true;
		var pageStack = [];
		this.globalTimerManager = new TimerManager();
		this.lastModuleName = "";
		this.currModuleName = "";
		this.registerModule = function (name, module) {
			if (this.getModuleByName(name)) {
				this.debug("module existed, register failed");
			} else {
				modules[name] = module;
				this.debug("module " + name + " register success");
			}
		};

		this.loadModule = function (name, param) {//alert("load module name:" + name);
			var Param = param;	
			this.debug("load module name:" + name);
			this.debug("load module param:" + param);
			if (name == "") {
				this.debug("module name is empty!");
				return;
			}
			this.lastModuleName = this.currModuleName;
			this.currModuleName = name;
			if(this.currModuleName == "liketv"){
				Param = "喜爱频道";
				this.currModuleName = "channel_list";
			}else if(this.currModuleName == "music"){	
				Param = "音频广播";
				this.currModuleName = "channel_list";
			}else if(this.currModuleName == "hdvideo"){
				Param = "高清轮播";
				this.currModuleName = "channel_list";								
			}
			if(this.currModuleName != "play_nvod" && this.currModuleName != "nvod"){
				EPG.exitNVODMode();
				tempNVODServiceId = [];
				SysSetting.setEnv("nvod_isSearch","0");
			}
			if(this.currModuleName == "sys_setting"){
				window.location.href = "html/html/system.v2.html";
			}
			
			if(this.currModuleName == "channel_editor"){
				window.location.href = "html/html/channel_editor.v2.html";
			}
			
			if(this.currModuleName == "channel_manager"){
				window.location.href = "html/html/channel_manager.v2.html";
			}			
			
			if(this.currModuleName == "order_manager"){
				window.location.href = "html/html/orderManager.v2.html";
			}
			
			if(this.currModuleName == "order_program"){
				window.location.href = "html/html/orderProgram.v2.html";
			}	
			
			if(this.currModuleName == "mail_list"){
				window.location.href = "email_manager.v2.ue.html";
			}
			
			if(this.currModuleName == "refactory"){
				window.location.href = "html/html/resetFactory.v2.html";
			}
			//var module = this.getModuleByName(this.currModuleName);
			if(this.currModuleName=="tv_page" || this.currModuleName=="local_page" || this.currModuleName=="video_page" ||
				this.currModuleName=="application_page" || this.currModuleName=="my_page" ){
					//SysSetting.setEnv("curPageName",this.currModuleName);
					var module = this.getModuleByName("tv_page");
				}else{
					var module = this.getModuleByName(this.currModuleName);
			}

            //数据采集
            if(this.currModuleName=="local_page" || this.currModuleName=="video_page" ||
                this.currModuleName=="application_page" || this.currModuleName=="my_page" || this.currModuleName == "tv_page"){
                var CATEGORY_ID = "01";
                var CATEGORY_TYPE = "00";
                var NAME = "";
                if(this.currModuleName=="local_page"){
                    CATEGORY_ID = "01";
                    NAME = "地市";
                }else if(this.currModuleName == "tv_page"){
                    CATEGORY_ID = "02";
                    NAME = "直播";
                }else if(this.currModuleName=="video_page"){
                    CATEGORY_ID = "03";
                    NAME = "点播";
                }else if(this.currModuleName=="application_page"){
                    CATEGORY_ID = "04";
                    NAME = "应用";
                }else if(this.currModuleName=="my_page"){
                    CATEGORY_ID = "05";
                    NAME = "我+";
                }

                DataCollection.collectData(["02",CATEGORY_ID," ",CATEGORY_TYPE,1,NAME]);
            }
			
			
			
			if (module) {//alert("module exists");
				if (pageStack.length == 32) {
					pageStack.shift();
				}
				pageStack.push(this.currModuleName);
				if (currentPageObj) {//alert('releaseCurrentPage');
					this.releaseCurrentPage();
					//alert('releaseCurrentPage success');
				}
				currentPageObj = new Page(module);
				if (typeof Param == "string") {//alert("page create 1");
					currentPageObj.onCreate(Param);
				} else {//alert("page create 2");
					currentPageObj.onCreate();
				}
			} else {//alert("module not exists, load module failed");
				this.debug("module not exists, load module failed");
			}
		};

		this.pageBack = function () {
			if (pageStack.length > 1) {
				pageStack.pop();
				var lastPage = pageStack[pageStack.length - 1];
				this.loadModule(lastPage);
			}
		};
		this.getModuleByName = function (name) {
			var module = null;
			if (modules[name]) {
				module = modules[name];
			}
			this.debug("getModuleByName [" + name + "]: " + module);
			return module;
		};
		this.getPageByName = function (name) {
			var page = null;
			if (pages[name]) {
				page = pages[name];
			}
			this.debug("getPageByName [" + name + "]: " + page);
			return page;
		};
		this.getCurrentPageObj = function () {
			var page = null;
			if (currentPageObj) {
				page = currentPageObj;
			}
			return page;
		};
		this.releaseModule = function (name) {
			this.debug("release module name:" + name);
			var module = this.getModuleByName(name);
			if (module) {
				modules[name] = null;
				delete modules[name];
			}
		};
		this.releasePage = function (name) {
			this.debug("release page name:" + name);
			var page = this.getPageByName(name);
			if (page) {
				page.onDestroy();
				page = null;
				if (currentPageObj == page) {
					currentPageObj = null;
				}
				delete pages[name];
			}
		};
		this.releaseCurrentPage = function () {
			if (currentPageObj) {
				currentPageObj.onDestroy();
				currentPageObj = null;
			}
		};
		this.debug = function (str) {
			if (!isDebug)
				return;
			if (typeof Utility != "undefined" && typeof Utility.println != "undefined") {
				Utility.println(str);
			} else if (typeof RocME != "undefined" && typeof RocME.debug != "undefined") {
				RocME.debug(str);
			} else if (typeof console != "undefined") {
				console.debug(str);
			} else {
				//no debug function avaliable
			}
		};

		this.extend = function (src) {
			for (var i in src) {
				this[i] = src[i];
			}
		};

	};
	window.SumaJS = new SumaJS();
})(window);

//timer管理
function TimerTask(callback, time) {
	var t = window.setTimeout(callback, time);
	this.clear = function () {
		window.clearTimeout(t);
	};
};

function IntervalTask(callback, time) {
	var t = window.setInterval(callback, time);
	this.clear = function () {
		window.clearInterval(t);
	};	
}

function TimerManager() {
	var timerPool = {};
	this.add = function (name, timerObj) {
		if (timerPool[name]) {
			timerPool[name].clear();
		}
		timerPool[name] = timerObj;
	};

	this.get = function (name) {
		var timer = null;
		if (timerPool[name]) {
			timer = timerPool[name];
		}
		return timer;
	};

	this.clearTimer = function (name) {
		var timer = this.get(name);
		if (timer) {
			timer.clear();
			delete timerPool[name];
		}
	};

	this.clearAll = function () {
		for (var i in timerPool) {
			timerPool[i].clear();
		}
		timerPool = {};
	};
};

(function (window) {
	var Page = function (params) {
		this.createFunc = params.onCreate;
		this.startFunc = params.onStart;
		this.destroyFunc = params.onDestroy;
		this.timerManager = new TimerManager();

		if (!params.parent) {
			this.parent = document.body;
		} else if (params.parent instanceof HTMLElement) {
			this.parent = params.parent;
		} else {
			this.parent = null;
			SumaJS.debug("not a valid parent element");
		}
	};
	Page.prototype.onCreate = function (param) {
		this.createFunc(param);
		this.onStart();
	};
	Page.prototype.onStart = function () {
		this.startFunc();
	};
	Page.prototype.onDestroy = function () {
		this.timerManager.clearAll();
		this.destroyFunc();
		if (this.parent) {
			this.parent.innerHTML = "";
		}
		/*document.onkeydown = function () {
			return 0;
		};
		document.onkeypress = function () {
			return 0;
		};
		document.onsystemevent = function () {
			return 0;
		};*/
	};
	Page.prototype.render = function (config) {
		if (!this.parent)
			return;
		var entry = config.entry;
		this.parent.appendChild(createPageElements(entry));
	};

	function createPageElements(config, elementIndex) {
		if (typeof config.type == "undefined" || config.type == "") {
			return null;
		}
		if (config.type == "list") {
			var e = document.createElement("div");
			var listCount = config.listCount;
			for (var i = 0; i < listCount; i++) {
				var item = document.createElement("div");
				if (typeof config.itemTemplate != "undefined") {
					if (typeof config.itemTemplate.styles != "undefined") {
						for (var j in config.itemTemplate.styles) {
							item.style[j] = config.itemTemplate.styles[j];
						}
					}
					if (typeof config.itemTemplate.properties != "undefined") {
						for (var j in config.itemTemplate.properties) {
							item[j] = config.itemTemplate.properties[j];
						}
					}
					if (typeof config.itemTemplate.childNodes != "undefined") {
						if (Array.isArray(config.itemTemplate.childNodes)) {
							for (var j = 0; j < config.itemTemplate.childNodes.length; j++) {
								item.appendChild(createPageElements(config.itemTemplate.childNodes[j], i));
							}
						} else {
							item.appendChild(createPageElements(config.itemTemplate.childNodes, i));
						}
					}
				}
				e.appendChild(item);
			}
		} else {
			var e = document.createElement(config.type);
		}
		if (typeof config.styles != "undefined") {
			for (var i in config.styles) {
				e.style[i] = config.styles[i];
			}
		}
		if (typeof config.properties != "undefined") {
			for (var i in config.properties) {
				e[i] = config.properties[i];
				if (typeof e[i] == "string" && typeof elementIndex == "number") {
					e[i] = e[i].replace(/\$i/g, elementIndex);
				}
			}
		}
		if (typeof config.childNodes != "undefined") {
			if (Array.isArray(config.childNodes)) {
				for (var i = 0; i < config.childNodes.length; i++) {
					var childConfig = config.childNodes[i];
					e.appendChild(createPageElements(childConfig, i));
				}
			} else {
				e.appendChild(createPageElements(config.childNodes, i));
			}
		}
		return e;
	}

	window.Page = Page;
})(window);