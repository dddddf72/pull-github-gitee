SysSetting.setEnv("PORTAL_ADDR", window.location.href);
Recommend_flag = false;
if(!SysSetting.getEnv("background_flag")){
	SysSetting.setEnv("background_flag", '1');
	setTimeout(function(){//隐藏背景图
    	SumaJS.$("#background").style.display = "none";
    },20000)
}else{
	SumaJS.$("#background").style.display = "none";
}//开机加载背景图

//拦截退出和返回按键
document.onkeypress = function() {
    return false;
}


//读取版本信息
var configurationVersion = {};
var str = readFile("/storage/storage0/ServiceInfo/Version.json", 3);
if (str) {
    try {
        configurationVersion = JSON.parse(str);
    } catch (e) {
        configurationVersion = {};
    }
}
if (typeof configurationVersion.version == "undefined") {
    configurationVersion = {
        version: -1,
        moveFlag: 0
    };
    saveJSONFile("/storage/storage0/ServiceInfo/Version.json", configurationVersion, 1);
} else if (typeof configurationVersion.moveFlag == "undefined") {
    configurationVersion.moveFlag = 0;
    saveJSONFile("/storage/storage0/ServiceInfo/Version.json", configurationVersion, 1);
}

//读取本地保存的网络id
var str2 = readFile("/storage/storage0/NetworkId.json", 3);
if (str2) {
    try {
        var obj = JSON.parse(str2);
        localNetworkId = obj.NetworkId;
        SysSetting.setEnv("Local_NetworkId", localNetworkId.toString());
        SumaJS.debug("get Local_NetworkId from json = " + localNetworkId);
    } catch (e) {
        localNetworkId = -1;
        SysSetting.setEnv("Local_NetworkId", localNetworkId);
        SumaJS.debug("get Local_NetworkId from json wrong");
    }
}

checkServiceInfoFile(); //读取配置表中的版本信息及数据
menuDataAccessObj.readJsonInfo(); //读取配置表中的菜单数据
//oftenWatchObj.getUserChannelsByJson();  //读取常看频道json文件

SumaJS.globalPlayer = null;
SumaJS.globalServiceInfo = null;
SumaJS.eventManager = new EvtManager();
SumaJS.eventManager.run();


//if (CA.regionCode >= 10000 && CA.regionCode <= 10999) { //判断是否是酒店住应用
    //alert("酒店集团用户");
  //  userAttrMgr.start(); //用户属性表
    //var url = "http://172.16.244.103/NewFrameWork/web/searchEx/index.html";
    //tryOpenUrl(url, 3);
    //window.location.href = url;
//} else 
if (SysSetting.getEnv("INIT_FLAG") == "" && CA.regionCode == -1) { //先获取networkId
    SumaJS.debug("open STB 1");
    window.location.href = "init.html";
} else if (SysSetting.getEnv("BOOT_SINCONFIG_FLAG") == "") { //进入配置表更新流程
    SumaJS.debug("open STB 3");
    SysSetting.setEnv("BOOT_SINCONFIG_FLAG", "1");
    if (SysSetting.getEnv("Local_NetworkId") == "") {
        SysSetting.setEnv("Local_NetworkId", "-1");
    }
    localNetworkId = parseInt(SysSetting.getEnv("Local_NetworkId"));
    SumaJS.debug("index.js localNetworkId = " + localNetworkId);

    //userAttrMgr.start(); //用户属性表,将其移动到从每日推荐回来后，防止异步请求未结束就调到每日推荐了
    //配置表更新
    upDateSiconfig();

    //menuDataAccessObj.aquireByJson();

} else if (SysSetting.getEnv("LoadProgressFlag") == "0") {
    SumaJS.debug("open STB 4");
    if (typeof(SysSetting.setLoadProgressFlag) == "function") {
        SysSetting.setLoadProgressFlag(1);
    }
    SysSetting.setEnv("LoadProgressFlag", "1");
    window.location.reload();
} else {
    SumaJS.debug("open STB 5");
    SumaJS.debug("onload main page");

    //menuDataAccessObj.readJsonInfo();

    menuDataAccessObj.parseData(); //解析
   // if(!preparesRestartFlag){
        //var goUrl = location.href.split("/index.html")[0];
       // var thisDayUrl = goUrl + "/entrance.html";
       // location.href=thisDayUrl;
       // jumpPathInitialization(thisDayUrl);
   // }

}

//配置表更新完成标志位
/*
if(SysSetting.getEnv("siConfigUpdateFlag") == "1"){
	SumaJS.debug("siConfigUpdateFlag is 1");
	SysSetting.setEnv("siConfigUpdateFlag",""); 
	DVB.deleteAll();//配置表更新完成后注入数据
}
*/

function debug(str) {
    if (typeof Utility != "undefined" && typeof Utility.println != "undefined") {
        Utility.println(str);
    } else if (typeof RocME != "undefined" && typeof RocME.debug != "undefined") {
        RocME.debug(str);
    } else if (typeof console != "undefined") {
        console.debug(str);
    } else {}
}

function showStartUpRecommend() {
    SumaJS.debug("showStartUpRecommend entered");
    SysSetting.setEnv("BOOT_RECOMMEND_FLAG", "1");
    var dayUrl = menuDataAccessObj.getDayUrlByJson();
    SumaJS.debug("showStartUpRecommend dayUrl = " + dayUrl);
    if (dayUrl != "") {
        SumaJS.debug("enter recommend");
        window.location.href = PORTAL_ADDR + dayUrl;
    }
}

function upDateSiconfig() {
    siMonitor = new ServiceInfoMonitor(Version, SysSetting.getEnv("Local_NetworkId"));
    siMonitor.setFocusState(1);
    SumaJS.eventManager.addEventListener("siMonitor", siMonitor, 40);
    siMonitor.setTipMsg(function(msgInfo) {
        var msg = msgInfo;
        var retCfg = {
            name: "si_prompt",
            priority: 13,
            boxCss: "info",
            titleObj: {
                title: "",
                style: "title"
            },
            msgObj: {
                msg: msg.val,
                css: "msg_box1"
            },
            eventHandler: function(event) {
                if (this.focus && event.source != 1001) {
                    var val = event.keyCode || event.which;
                    switch (val) {
                        case KEY_ENTER:
                        case KEY_BACK:
                        case KEY_EXIT:
                            this.removeMsg("si_prompt");
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
        SumaJS.$("#background").style.display = "none";//隐藏背景图
        if (typeof msg.timeout != "undefined") {
            setTimeout(function() {
            	SumaJS.msgBox.removeMsg("si_prompt");
            }, msg.timeout);
        }
    });
    siMonitor.setSaveUpdate(function() {
        SumaJS.globalServiceInfo = null;
        var serviceInfoStr = readFile("/storage/storage0/siConfig/ServiceInfo.json", 3);
        var tempOriginalArray = JSON.parse(serviceInfoStr);
        if (DataAccess.getInfo("DVBSetting", "mainFrequency") != tempOriginalArray.FrequecyInfo.MainFrequency) {
            DataAccess.setInfo("DVBSetting", "mainFrequency", tempOriginalArray.FrequecyInfo.MainFrequency);
            DataAccess.save("DVBSetting", "mainFrequency");
        }
        if (DataAccess.getInfo("DVBSetting", "mainNVODFrequency") != tempOriginalArray.FrequecyInfo.NvodMainFrequency ||
            DataAccess.getInfo("DVBSetting", "mainNVODSymbolrate") == 0 ||
            DataAccess.getInfo("DVBSetting", "mainNVODModulation") == "") {
            DataAccess.setInfo("DVBSetting", "mainNVODFrequency", tempOriginalArray.FrequecyInfo.NvodMainFrequency);
            DataAccess.save("DVBSetting", "mainNVODFrequency");
            for (var i = 0; i < tempOriginalArray.ServiceInfo.TsInfoArray.length; i++) {
                if (tempOriginalArray.ServiceInfo.TsInfoArray[i].Frequency == tempOriginalArray.FrequecyInfo.NvodMainFrequency) {
                    DataAccess.setInfo("DVBSetting", "mainNVODSymbolrate", "" + tempOriginalArray.ServiceInfo.TsInfoArray[i].SymbolRate);
                    DataAccess.setInfo("DVBSetting", "mainNVODModulation", tempOriginalArray.ServiceInfo.TsInfoArray[i].Modulation);
                    DataAccess.save("DVBSetting", "mainNVODSymbolrate");
                    DataAccess.save("DVBSetting", "mainNVODModulation");
                    break;
                }
            }
        }
        if (DataAccess.getInfo("VodApp", "PortalAddress") == "" && typeof tempOriginalArray.VodInfo != "undefined") {
            if (typeof tempOriginalArray.VodInfo.PortalAdress != "undefined") {
                DataAccess.setInfo("VodApp", "PortalAddress", tempOriginalArray.VodInfo.PortalAdress);
                DataAccess.save("VodApp", "PortalAddress");
            }
            if (typeof tempOriginalArray.VodInfo.PortalPort != "undefined") {
                DataAccess.setInfo("VodApp", "PortalPort", tempOriginalArray.VodInfo.PortalPort);
                DataAccess.save("VodApp", "PortalPort");
            }
        }

        if (typeof tempOriginalArray.NetworkManager != "undefined") {
            var managerAdress = tempOriginalArray.NetworkManager.ManagerAdress;
            var managerPort = tempOriginalArray.NetworkManager.ManagerPort;
            saveJSONFile("/storage/storage0/sysInfo/sysInfo.json", { sysInfo: { STBSerialNumber: SysInfo.STBSerialNumber || "", ManagerAddress: managerAdress, ManagerPort: managerPort } }, 1);
        }

        initChannelInfo(serviceInfoStr);

        configurationVersion.version = this.cmdVersion;
        saveJSONFile("/storage/storage0/ServiceInfo/Version.json", configurationVersion, 1);

        SysSetting.setEnv("tempUnLockObj", "");

        StbRegister(tempOriginalArray);
    });

    siMonitor.start();
}

//检测配置表文件
function checkServiceInfoFile() {
    originalArray = null;
    SumaJS.debug("checkServiceInfoFile");
    var fileName1 = "/storage/storage0/ServiceInfo/ServiceInfo.json";
    var fileName2 = "/storage/storage0/siConfig/ServiceInfo.json";
    var serviceInfo1 = readFile(fileName1, 3);
    var serviceInfoJson = null;
    if (!serviceInfo1) {
        return false;
    } else {
        try {
            serviceInfoJson = JSON.parse(serviceInfo1);
            Version = serviceInfoJson.Version;
            SumaJS.debug("checkServiceInfoFile Version = " + Version);
        } catch (e) {
            return false;
        }
    }

    var serviceInfo2 = readFile(fileName2, 3);

    if (!serviceInfo2) {
        var ret = 0;
        ret = FileSystem.copyFile(fileName1, fileName2);
        if (ret != 1) {
            SumaJS.debug("恢复配置表发生错误");
            //alert("恢复配置表发生错误");
            return false;
        } else {
            originalArray = serviceInfoJson;
            initChannelInfo(serviceInfo1);
        }
    } else {
        var flag_json = 0;
        try {
            var temp = JSON.parse(serviceInfo2);
            originalArray = temp;
        } catch (e) {
            flag_json = 1;
        }

        if (flag_json) {
            FileSystem.deleteFile(fileName2);
            var ret = 0;
            ret = FileSystem.copyFile(fileName1, fileName2);
            if (ret != 1) {
                SumaJS.debug("恢复配置表发生错误");
                //alert("恢复配置表发生错误");
                return false;
            } else {
                originalArray = serviceInfoJson;
                initChannelInfo(serviceInfo1);
            }
        }
    }


    //初始化portal地址 add by liwenlei 2016-09-20
    if (DataAccess.getInfo("VodApp", "PortalAddress") == "" && typeof originalArray.VodInfo != "undefined") {
        if (typeof originalArray.VodInfo.PortalAdress != "undefined") {
            DataAccess.setInfo("VodApp", "PortalAddress", originalArray.VodInfo.PortalAdress);
            DataAccess.save("VodApp", "PortalAddress");
        }
        if (typeof originalArray.VodInfo.PortalPort != "undefined") {
            DataAccess.setInfo("VodApp", "PortalPort", originalArray.VodInfo.PortalPort);
            DataAccess.save("VodApp", "PortalPort");
        }
    }

    PORTAL_ADDR = "http://" + DataAccess.getInfo("VodApp", "PortalAddress") + ":" + DataAccess.getInfo("VodApp", "PortalPort");
    PORTAL_SUB_ADDR = PORTAL_ADDR + "/NewFrameWork/newWeb/html/";
    SumaJS.debug("0920test get PORTAL_ADDR  = " + PORTAL_ADDR);


    portalInterfaceObj["initial"] = PORTAL_ADDR + "/u1/portalApi?service=init&client=" + CA.icNo + "&areaCode=" + CA.regionCode + "&netWorkId=" + localNetworkId;
    portalInterfaceObj["menu"] = PORTAL_ADDR + "/u1/portalApi?service=menu&client=" + CA.icNo + "&areaCode=" + CA.regionCode + "&netWorkId=" + localNetworkId;
    portalInterfaceObj["config"] = PORTAL_ADDR + "/u1/portalApi?service=config&client=" + CA.icNo + "&areaCode=" + CA.regionCode + "&netWorkId=" + localNetworkId;
    portalInterfaceObj["rcmd"] = PORTAL_ADDR + "/u1/portalApi?service=rcmd&client=" + CA.icNo + "&areaCode=" + CA.regionCode + "&netWorkId=" + localNetworkId + "&posId=index_tv,index_vod,index_home,index_local,index_app,mainApp";


    //模拟地址，用来调试
    //portalInterfaceObj["initial"] =	"http://192.166.65.165"+"/simulationData/initialData.php";
    //portalInterfaceObj["rcmd"] = "http://192.166.65.165" + "/simulationData/portalApi-rcmd.php";

    //盒子模拟调试用
    //PORTAL_ADDR = "http://192.168.88.4";
    //portalInterfaceObj["initial"] ="http://192.168.88.4"+"/simulationData/initialData.php";
    //portalInterfaceObj["rcmd"] = "http://192.168.88.4" + "/simulationData/portalApi-rcmd.php";

    SumaJS.debug("portalInterfaceObj.initial = " + portalInterfaceObj["initial"]);
    SumaJS.debug("portalInterfaceObj.rcmd = " + portalInterfaceObj["rcmd"]);
}

function initChannelInfo(serviceInfo) {
    SumaJS.debug("initChannelInfo entered");
    //serviceInfo 是JSON字符串类型
    var tempOriginalArray = {};
    if (serviceInfo) {
        try {
            tempOriginalArray = JSON.parse(serviceInfo);
        } catch (e) {
            SumaJS.debug("initChannelInfo parse ServiceInfo file error！");
            return;
        }
        var originalServiceArray = tempOriginalArray.ServiceInfo.ServiceArray;
        var tempChannelInfoObj = {};
        for (var i = 0; i < originalServiceArray.length; ++i) {
            tempChannelInfoObj[originalServiceArray[i].ServiceHandle] = {};
            tempChannelInfoObj[originalServiceArray[i].ServiceHandle]["serviceId"] = originalServiceArray[i].ServiceId;
            tempChannelInfoObj[originalServiceArray[i].ServiceHandle]["hide"] = 0;
            tempChannelInfoObj[originalServiceArray[i].ServiceHandle]["favorite"] = 0;
            tempChannelInfoObj[originalServiceArray[i].ServiceHandle]["lock"] = 0;
            tempChannelInfoObj[originalServiceArray[i].ServiceHandle]["volume"] = 16;
            tempChannelInfoObj[originalServiceArray[i].ServiceHandle]["offset"] = 0;
            tempChannelInfoObj[originalServiceArray[i].ServiceHandle]["channelId"] = originalServiceArray[i].ChannelId;
        }

        var channelInfoStr = readFile("/storage/storage0/siConfig/ChannelInfo.json", 3);
        var channelInfo = {};
        if (channelInfoStr) {
            try {
                channelInfo = JSON.parse(channelInfoStr);
            } catch (e) {}
        }
        for (var i in channelInfo) {
            if (typeof tempChannelInfoObj[i] != "undefined" && channelInfo[i].serviceId == tempChannelInfoObj[i].serviceId) {
                tempChannelInfoObj[i]["hide"] = channelInfo[i]["hide"];
                tempChannelInfoObj[i]["favorite"] = channelInfo[i]["favorite"];
                tempChannelInfoObj[i]["lock"] = channelInfo[i]["lock"];
                tempChannelInfoObj[i]["volume"] = channelInfo[i]["volume"];
                tempChannelInfoObj[i]["offset"] = channelInfo[i]["offset"];
            }
        }

        SumaJS.debug("saveJSONFile ChannelInfo");
        saveJSONFile("/storage/storage0/siConfig/ChannelInfo.json", tempChannelInfoObj, 1);
    } else {
        SumaJS.debug("initChannelInfo get ServiceInfo file failed！");
    }
}


//从其他页面返回时的传递参数的处理.

function LocationSearch() {
    closeCycleControl.recoverStack();
    var paramStr = window.location.search; //main://index.html?switchPageModel=1&page=application_page
    if (paramStr.length > 0) {
        var stack = closeCycleControl.stack; //获取闭环保存的page
        var jumpPageName = stack[stack.length - 1].moduleName;
        SumaJS.debug("test closeCycleControl.stack = " + closeCycleControl.stack);
        var model = getParameter("switchPageModel");
        var pageStr = getParameter("page"); //传递的page参数
        SumaJS.debug("test model = " + model);
        SumaJS.debug("pageStr model = " + pageStr);
        var pageNameArr = menuDataAccessObj.getPageNameArray();
        if (model == 1) { //闭环
            closeCycleControl.setIsBackToPage(1);
            for (var j = 0; j < pageNameArr.length; j++) {
                if (pageNameArr[j] == jumpPageName) {
                    menuDataAccessObj.setPageIndex(j);
                    return;
                }
            }
        } else if (model == 2) { //主动跳转
            closeCycleControl.clearStack();
            if (pageStr) { //用来设置pageIndex属性。
                for (var j = 0; j < pageNameArr.length; j++) {
                    if (pageNameArr[j] == pageStr) {
                        //alert("j = " + j);
                        menuDataAccessObj.setPageIndex(j);
                        return;
                    }
                }
            }
        } else {
            closeCycleControl.clearStack();
        }
    } else {
        closeCycleControl.clearStack();
    }
}


/****     页面大模块的初始化    start   *******/

var headerObj,
    footerObj,
    titleObj; //定义三个块
var threeBarBlock; //三个块组成的block

//初始化header、footer和title块对象。
function initialThreeBarBlock() {
    SumaJS.debug("initialThreeBarBlock entered");
	initPage();
    headerObj = new function() {
        this.focus = 0;
        var self = this;
        var cfg = {
            items: [],
            type: 1,
            pageSize: 1,
            uiObj: {
                imgArray: SumaJS.$(".header"),
            },
            showData: function(subItems, uiObj, lastFocusPos, focusPos, isUpdate) {
                if (!subItems) {
                    for (var i = 0; i < uiObj.imgArray.length; ++i) {
                        uiObj.imgArray[i].innerHTML = "";
                    }
                } else {
                    var unreadMailsNum = gMailIconMgr.getUnreadMailsNum();
                    gMailIconMgr.showMailsNum(unreadMailsNum);
                    SumaJS.getDom("header").style.zIndex = 1;
                    for (var i = 0; i < uiObj.imgArray.length; i++) {
                        if (unreadMailsNum <= 0) {
                            if (typeof subItems[i].img[0] == "string") {
                                //uiObj.imgArray[i].innerHTML = "<img src='"+subItems[i].img+"'/>";
                                uiObj.imgArray[i].style.backgroundImage = "url(" + subItems[i].img[0] + ")";
                            }
                        } else {
                            if (typeof subItems[i].img[1] == "string") {
                                //uiObj.imgArray[i].innerHTML = "<img src='"+subItems[i].img+"'/>";
                                //SumaJS.getDom("header_main_icon").style.top = "-14px";//由于图片大小问题，在此进行调整
                                //SumaJS.getDom("header_main_icon").style.left = "737px";
                                uiObj.imgArray[i].style.backgroundImage = "url(" + subItems[i].img[1] + ")";
                            }
                        }
                    }
                    if (focusPos > -1 && self.focus == 1) {
                        //uiObj.imgArray[focusPos].innerHTML = "<img src='"+subItems[focusPos].focusImg+"'/>";
                        SumaJS.getDom("header").style.zIndex = 2; //防止邮件焦点被遮挡
                        if (unreadMailsNum <= 0) {
                            uiObj.imgArray[focusPos].style.backgroundImage = "url(" + subItems[focusPos].focusImg[0] + ")";
                        } else {
                            //SumaJS.getDom("header_main_icon").style.top = "-12px";//由于图片大小问题，在此进行调整
                            //SumaJS.getDom("header_main_icon").style.left = "735px";
                            uiObj.imgArray[focusPos].style.backgroundImage = "url(" + subItems[focusPos].focusImg[1] + ")";
                        }
                    }
                }
            }
        };

        this.listObj = new SubList(cfg);
        this.ImgArray = [{
            id: "header_main_icon",
            img: ["images/main_page/mail.png", "images/main_page/mail_num.png"],
            focusImg: ["images/main_page/mail_focus.png", "images/main_page/mail_num_focus.png"]
        }];
        this.listObj.resetData({ index: 0, items: this.ImgArray });
        this.eventHandler = function(event) {
            var keyCode = event.keyCode || event.which;
            SumaJS.debug("headerObjEvent keyCode = " + keyCode);
            switch (keyCode) {
                case KEY_LEFT:
                    self.listObj.up();
                    return false;
                case KEY_RIGHT:
                    self.listObj.down();
                    return false;
                case KEY_UP:
                    this.loseFocus();
                    //footerEventHander.getFocus(self.listObj.getFocusPos());
                    footerObj.getFocus(0);
                    return false;
                case KEY_DOWN:
                    this.loseFocus();
                    //titleEventHander.getFocus(menuDataAccessObj.getPageIndexByName(SumaJS.currModuleName));
                    //titleObj.getFocus(menuDataAccessObj.getPageIndexByName(SumaJS.currModuleName));
                    titleObj.getFocus(menuDataAccessObj.getPageIndexByName(thisPageName));
                    return false;
                case KEY_ENTER:
                    switch (self.listObj.getItem().id) {
                        case "header_main_icon":
                            //add by liwenlei 添加数据采集
                            //DataCollection.collectData(["0x1b","01","01"]);
                            DataCollection.collectData(["1b", "01", "01"]);

                            closeCycleControl.setNode(thisPageName, [self.listObj.getIndex()], "Header");
                            closeCycleControl.pushNodeToStack();
                            closeCycleControl.saveStack();
                            SysSetting.setEnv("MAIL_BACKADDR", "main://index.html?page=" + SumaJS.currModuleName + "&switchPageModel=1");
                            //window.location.href="main://email_manager.v2.ue.html?switchPageModel=2";
                            window.location.href = "email_manager.v2.ue.html?page=" + SumaJS.currModuleName;
                            break;
                        default:
                            break;
                    };
                    return false;
                default:
                    return true;
            }
        };
        this.getFocus = function(index) {
            this.focus = 1;
           SumaJS.eventManager.addEventListener("headerObjEvent", this, 100);
            if (typeof index != "number") { index = 0; }
            self.listObj.setIndex(index);
            self.listObj.upDate();
        };
        this.loseFocus = function() {
            this.focus = 0;
           // SumaJS.eventManager.removeEventListener("headerObjEvent");
            self.listObj.upDate();
        };
    };

    footerObj = new function() {
        this.focus = 0;
        var self = this;
        //this.colorArr = ["#405178","#F19702"];  //颜色数组，第一个为非选中颜色，第二个为选中颜色
        this.borderColorArr = ["#526BA3", "#F19702"]; //border颜色数组，第一个为非选中颜色，第二个为选中颜色
        this.wordColorArr = ["#d2dce6", "#ffffff"]; //字体颜色数组，第一个为非选中颜色，第二个为选中颜色
        this.urlArr = [
            { "unchoose": "images/main_page/history_small.png", "choose": "images/main_page/history_small_focus.png" },
            { "unchoose": "images/main_page/search_small.png", "choose": "images/main_page/search_small_focus.png" },
            { "unchoose": "images/main_page/service_small.png", "choose": "images/main_page/service_small_focus.png" }
        ];
        var cfg = {
            items: [],
            type: 1,
            pageSize: 3,
            uiObj: {
                nameArray: SumaJS.$(".footer"),
                imgArray: SumaJS.$(".footer_img"),
                focusBg: SumaJS.$("#footer_focus")
            },
            showData: function(subItems, uiObj, lastFocusPos, focusPos, isUpdate) {
                if (!subItems) {
                    //for (var i = 0; i < uiObj.nameArray.length; ++i) {
                        //uiObj.nameArray[i].innerHTML = "";	
                    //}
                } else {
                    if (lastFocusPos > -1 && self.focus == 1) {
                        uiObj.nameArray[lastFocusPos].style.borderColor = self.borderColorArr[0];
                        uiObj.nameArray[lastFocusPos].style.color = self.wordColorArr[0];
                        uiObj.imgArray[lastFocusPos].src = self.urlArr[lastFocusPos].unchoose;
                    }
                    if (focusPos > -1 && self.focus == 1) {
                        uiObj.nameArray[focusPos].style.borderColor = self.borderColorArr[1];
                        uiObj.nameArray[focusPos].style.color = self.wordColorArr[1];
                        uiObj.imgArray[focusPos].src = self.urlArr[focusPos].choose;
                        switch (focusPos) {
                            case 0:
                                //uiObj.focusBg.style.left = "89px";
                                uiObj.focusBg.style.left = "95px";
                                break;
                            case 1:
                                //uiObj.focusBg.style.left = "285px";
                                uiObj.focusBg.style.left = "276px";
                                break;
                            case 2:
                                //uiObj.focusBg.style.left = "483px";
                                uiObj.focusBg.style.left = "483px";
                                break;
                            default:
                                break;
                        }
                    }

                }
            }
        };
        this.listObj = new SubList(cfg);
        this.listObj.resetData({ index: 0, items: [{}, {}, {}] });
        this.eventHandler = function(event) {
            var keyCode = event.keyCode || event.which;
            SumaJS.debug("footerObjEvent keyCode = " + keyCode);
            switch (keyCode) {
                case KEY_LEFT:
                    self.listObj.up();
                    return false;
                case KEY_RIGHT:
                    self.listObj.down();
                    return false;
                case KEY_UP:
                    this.loseFocus();
                    if (PageObj.groupListObj.listObj.getItems().length > 0) { //分组列表有数据则移动到分组列表最后一项
                        PageObj.groupListObj.getFocus(PageObj.groupListObj.listObj.items.length - 1);
                    } else if (PageObj.leftListObj.listObj.getItems().length > 0) { //左侧列表有数据则移动到左侧列表最后一项
                        PageObj.leftListObj.getFocus(PageObj.leftListObj.listObj.items.length - 1);
                    } else { //否则小视频窗口获焦
                        PageObj.smallVideoObj.getFocus();
                    }
                    return false;
                case KEY_DOWN:
                    this.loseFocus();
                    headerObj.getFocus(0);
                    return false;
                case KEY_ENTER:
                    var thisIndex = self.listObj.getIndex();
                    closeCycleControl.setNode(thisPageName, [thisIndex], "Footer");
                    closeCycleControl.pushNodeToStack();
                    closeCycleControl.saveStack();
                    //add by liwenlei 添加数据采集
                    var thisType = SumaJS.padString(thisIndex + 2, 0, 2);
                    //DataCollection.collectData(["0x1b",thisType,"01"]);
                    DataCollection.collectData(["1b", thisType, "01"]);
                    switch (thisIndex) {
                        case 0: //历史
                            SumaJS.debug("enter history");
                            //var url = pathInitialization("/NewFrameWork/UE/html/mine.html?type=2");
                            var url = "http://192.168.88.100/index2moui.htm";
                            SumaJS.debug("enter history  url = " + url);
                            window.location.href = url;
                            break;
                        case 1: //搜索
                            SumaJS.debug("enter search");
                            //var url = pathInitialization("/NewFrameWork/web/searchEx/index.html");
                           var url = "index2moui.htm";
                            SumaJS.debug("enter search  url = " + url);
                            window.location.href = url;
                            break;
                        case 2: //服务
                            //SysSetting.setEnv("INNERBACKADDR","../index.html?page="+SumaJS.currModuleName);
                            //window.location.href="main://servicepage.v2.ue.html?page="+SumaJS.currModuleName;
                            window.location.href = "servicepage.v2.ue.html";
                           //window.location.href = "servicepage.v2.ue.html?page=" + SumaJS.currModuleName;
                            break;
                        default:
                            break;
                    };
                    return false;
                default:
                    return true;
            }
        };
        this.getFocus = function(index) {
            this.focus = 1;
            self.listObj.uiObj.focusBg.style.display = "block";
            SumaJS.eventManager.addEventListener("footerEventHander", this, 100);
            if (typeof index != "number") { index = 0; }
            self.listObj.setIndex(index);
            self.listObj.upDate();
        };
        this.loseFocus = function() {
            this.focus = 0;
            this.clearFocusBg();
            self.listObj.uiObj.focusBg.style.display = "none";
            SumaJS.eventManager.removeEventListener("footerEventHander");
            self.listObj.upDate();
        };
        this.clearFocusBg = function() {
            for (var i = 0; i < this.listObj.pageSize; i++) {
                this.listObj.uiObj.nameArray[i].style.borderColor = self.borderColorArr[0];
                this.listObj.uiObj.nameArray[i].style.color = self.wordColorArr[0];
            }
        };
    };
    titleObj = new function() {
        var selfTime;
        this.delayTime = function(fn) {
        	clearTimeout(selfTime);
            thisPageName = menuDataAccessObj.getPageNameByIndex(self.listObj.getFocusPos());
           	thisPageIndex = menuDataAccessObj.getPageIndexByName(thisPageName); 
            	PageObj.leftListObj.initial(); //初始化左侧列表
            	PageObj.groupListObj.initial(); //初始化分组列表
            selfTime = setTimeout(function(){
            	PageObj.recommendObj.recommendFlag = false;
            	PageObj.recommendObj.initial(); //初始化推荐海报
            	SysSetting.setEnv("curPageName",thisPageName);
            },400);
        }
        this.focus = 0;
        this.colorArr = ["#CAD5DC", "#FFFFFE"]; //颜色数组，第一个为非选中颜色，第二个为选中颜色
        var self = this;
        var cfg = {
            items: [],
            type: 1,
            pageSize: 5,
            uiObj: {
                nameArray: SumaJS.$("#page_index td"),
                focusBg: SumaJS.$("#page_index_focus")
            },
            showData: function(subItems, uiObj, lastFocusPos, focusPos, isUpdate) {
                if (!subItems) {
                    for (var i = 0; i < uiObj.nameArray.length; ++i) {
                        uiObj.nameArray[i].innerHTML = subItems[i].name;
                    }
                } else {
                    if (isUpdate) {
                        for (var i = 0; i < uiObj.nameArray.length; ++i) {
                            if (subItems[i]) {
                                uiObj.nameArray[i].innerHTML = subItems[i].name;
                            } else {
                                uiObj.nameArray[i].innerHTML = subItems[i].name;
                            }
                        }
                    } else if (lastFocusPos > -1) {
                        uiObj.nameArray[lastFocusPos].style.fontSize = "24px";
                        uiObj.nameArray[lastFocusPos].style.color = self.colorArr[0];
                    }
                    if (focusPos > -1) {
                        uiObj.nameArray[focusPos].style.fontSize = "32px";
                        //uiObj.focusBg.style.left = 157+focusPos*180+"px";
                        uiObj.focusBg.style.left = 78 + focusPos * 180 + "px";
                        uiObj.nameArray[focusPos].style.color = self.colorArr[1];
                    }
                }
            }
        };

        this.listObj = new SubList(cfg);
        this.listObj.resetData({ index: 0, items: menuDataAccessObj.getMainMenuData() });
        this.eventHandler = function(event) {
            var keyCode = event.keyCode || event.which;
            SumaJS.debug("titleObjEvent keyCode = " + keyCode);
            switch (keyCode) {
                case KEY_LEFT:
                    self.listObj.up();
                    this.delayTime();
                    return false;
                case KEY_RIGHT:
                    self.listObj.down();
                    this.delayTime();
                    //SumaJS.loadModule("tv_page");
                    return false;
                case KEY_UP:
                    this.loseFocus();
                    headerObj.getFocus(0);
                    return false;
                case KEY_DOWN:
                    this.loseFocus();
                    PageObj.smallVideoObj.getFocus();
                    return false;
                case KEY_ENTER: //焦点在直播处确定键进全屏逻辑
                    if (self.listObj.getIndex() == 1) {
                        closeCycleControl.setNode("tv_page", [1], "Title");
                        closeCycleControl.pushNodeToStack();
                        if (smallHomeVideo.getIsPlayingNvod()) { //判定正在播放nvod
                            var nvodObj = smallHomeVideo.getNvodObj();
                            var obj = { NvodSource: nvodObj };
                            this.loseFocus();
                            SumaJS.loadModule("play_tv", JSON.stringify(obj));
                        } else if (currentService) {
                            if (typeof currentService.serviceType != "undefined" && currentService.serviceType != 2) { //非广播节目			
                                OffChannelObj.saveOffChannelToM(currentService);
                                OffChannelObj.saveOffChannel(currentService);
                                this.loseFocus();
                                SumaJS.loadModule("play_tv");
                            }
                        }
                    }
                    return false;
                default:
                    return true;
            }
        };
        this.getFocus = function(index) {
            this.focus = 1;
            SumaJS.eventManager.addEventListener("titleObjEvent", this, 100);
            if (typeof index != "number") { index = 0; }
            self.listObj.uiObj.focusBg.style.background = "url(images/main_page/title_focus.png) no-repeat";

            self.listObj.setIndex(index);
            self.listObj.upDate();
        };
        this.loseFocus = function() {
            this.focus = 0;
            SumaJS.eventManager.removeEventListener("titleObjEvent");
            self.listObj.uiObj.focusBg.style.background = "url(images/main_page/title.png) no-repeat";
        };
        this.getState = function() {
            return this.focus;
        };
    };
    var threeBarCfg = [{
            name: "Header",
            level: 1,
            barObj: headerObj,
            parentBlockName: null,
            children: []
        },
        {
            name: "Footer",
            level: 1,
            barObj: footerObj,
            parentBlockName: null,
            children: []
        },
        {
            name: "Title",
            level: 1,
            barObj: titleObj,
            parentBlockName: null,
            children: []
        }
    ];
    threeBarBlock = new Block(threeBarCfg);

    SumaJS.eventManager.removeEventListener("menuDataAccessObj"); //移除菜单消息事件。

    portalAd.readAd(); //读取海报数据
    SumaJS.eventManager.addEventListener("portalAd", portalAd, 110);
    portalAd.updateAd();
    if (originalArray && originalArray.UBAServer && originalArray.UBAServer.ServerAddress) {
       	var serverPort = "80";
        var UBAServerAddress = "http://" + originalArray.UBAServer.ServerAddress;
        SysSetting.setEnv("UBAServerAdd", UBAServerAddress);
        UBAServerAdd = SysSetting.getEnv("UBAServerAdd");
    }

    //LocationSearch();  //从其他页面返回时的传递参数的处理.
    locationSearchObj.initial();

    var thisIndex = menuDataAccessObj.getPageIndex();
    if (thisIndex >= 0 && thisIndex <= 4) { //首页的四个板块
        titleObj.getFocus(menuDataAccessObj.getPageIndex());
        RecLiveChannel.getData(); //先播放小视频，再ajax请求直播推荐数据
        var temCurPageName = menuDataAccessObj.getPageNameByIndex(thisIndex);
        SysSetting.setEnv("curPageName",temCurPageName);
        SumaJS.loadModule(temCurPageName);
    } else { //全屏直播
        var tempPage = getParameter("page");
        if (tempPage == "play_tv" || tempPage == "playtv_page") {
            var channelId = getParameter("channelId");
            if (channelId) {
                var channel = SumaJS.getServiceByChannelId(channelId);
                if (channel) {
                    var playChannelId = { channelId: channelId };
                    SysSetting.setEnv("play_channelId", JSON.stringify(playChannelId));
                }
            }
            var type = getParameter("type");
            if (type) {
                SysSetting.setEnv("OTHERTOPALYTV", type);
            }
            var action = getParameter("action");
            if (action) {
                if (action == "success") {
                    SysSetting.setEnv("DINGGOU_BACK_ACTION", JSON.stringify({ action: action }));
                } else {
                    var code = getParameter("code");
                    SysSetting.setEnv("DINGGOU_BACK_ACTION", JSON.stringify({ action: action, code: decodeURI(code) }));
                }
            }
            SysSetting.setEnv("MAINPAGE", "1");
            SumaJS.loadModule("play_tv");
        }
        RecLiveChannel.getData();
        SysSetting.setEnv("PAGEFOCUSINDEX", tempPage);
    }
    //titleObj.loseFocus();		

    //配置表更新完成标志位
    if (SysSetting.getEnv("siConfigUpdateFlag") == "1") {
        SumaJS.debug("siConfigUpdateFlag is 1");
        SysSetting.setEnv("siConfigUpdateFlag", "");
        needInject = true;
        DVB.deleteAll(); //配置表更新完成后注入数据
    }
}

/****     页面大模块的初始化    end   *******/