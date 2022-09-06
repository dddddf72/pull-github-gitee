/**
 * Created by smsx on 2016/9/4.
 */

var PORTAL_ADDR = "http://" + DataAccess.getInfo("VodApp", "PortalAddress") + ":" + DataAccess.getInfo("VodApp", "PortalPort");
var AREA_TITLE = 0;
var AREA_FOOTER = 1;
var AREA_CONTENT_LEFT = 2;
var AREA_CONTENT_RIGHT = 3;
var AREA_DVB_SELFCHECK = 4;
var AREA_SYSTEMSET_LEFTLIST = 5;
var AREA_SYSTEMSET_SUBPAGE = 6;
var AREA_MESSAGEBOX = 99;

function getParameter(param){
    param = param.toLowerCase();
    var query = window.location.search; //获取URL"?"后面的字符串
    if(query.length==0){
        return "";
    }else{
        query = query.toLowerCase();
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
}

/*
var enterPara = "";
enterPara = window.location.search;
enterPara = enterPara.substring(1,enterPara.length);
*/

//检查当前是否有邮件
gMailIconMgr.showMailsNum(gMailIconMgr.getUnreadMailsNum());

//由于复用index.css的样式，不完全满足需求，这里做修改
var titleDom = SumaJS.getDom("header");
var titleEmailDom = SumaJS.getDom("header_main_icon");
var focusDom = SumaJS.getDom("footer_focus");
var footerServiceDom = SumaJS.getDom("footer_service");
if(titleDom){
    titleDom.style.backgroundColor = "transparent";
    if(gMailIconMgr.getUnreadMailsNum()){
        //titleEmailDom.style.top = "-14px";
       // titleEmailDom.style.left = "737px";
        titleEmailDom.style.backgroundImage = "url(images/main_page/mail_num.png)";
    }else {
        titleEmailDom.style.backgroundImage = "url(images/main_page/mail.png)";
    }
    //focusDom.style.top = "-9px";
    focusDom.zIndex = "33";
    footerServiceDom.style.color = "#5d6166";
    footerServiceDom.style.borderColor = "#394a73";
}

SumaJS.showDateTime("header_time","header_date"); //显示时间

var gEventMgr = new function(){
    var self = this;
    this.area = AREA_CONTENT_LEFT;
    this.keyHandler = [];
    this.systemEventHandler = [];
    this.dealKeyEvent = function(event,isDown){
        var keyCode = event.which;
        if(keyCode == KEY_TV){
            var infoStr = SysSetting.getEnv("KEYTV_USE_INFO");
            if(infoStr) {
                try{
                    var info = JSON.parse(infoStr);
                    var service = info.serviceObj;
                    var isRec = info.isRec;
                    if(isRec){
                        SysSetting.setEnv("HOMETOPLAYTV", "14");
                    }else{
                        SysSetting.setEnv("HOMETOPLAYTV", "08");
                    }
                    window.location.href = "./index.html?page=play_tv&channelId="+service.channelId;
                }catch(e){

                }
            }
            return false;
        }else if(keyCode == KEY_MAIL){
            toEmailPage();
            return false;
        }
        self.keyHandler[self.area](event,isDown);
        return false;
    };
    this.dealSystemEvent = function(event){
        if(self.systemEventHandler[self.area]) {
            self.systemEventHandler[self.area](event);
        }
    }
};

var titleWidget = new function TitleWidget(){
    function log(str){
        LogI("titleWidget===="+str);
    }
    var self = this;
    var dom = SumaJS.getDom("header_main_icon");
    this.notifyLostFocus = null;
    this.notifyLostFocusInternal = function(isUp){
        if(isUp){
            footerWidget.onFocus();
        }else{
            if(this.notifyLostFocus) {
                this.notifyLostFocus();
            }
        }
    };
    this.onFocus = function(){
        gEventMgr.area = AREA_TITLE;
        if(gMailIconMgr.getUnreadMailsNum()) {
            //dom.style.top = "-12px";
            //dom.style.left = "735px";
            dom.style.backgroundImage = "url(images/main_page/mail_num_focus.png)";
        }else{
            dom.style.backgroundImage = "url(images/main_page/mail_focus.png)";
        }
    };
    this.onBlur = function(){
        if(gMailIconMgr.getUnreadMailsNum()) {
            //dom.style.top = "-14px";
            //dom.style.left = "737px";
            dom.style.backgroundImage = "url(images/main_page/mail_num.png)";
        }else{
            dom.style.backgroundImage = "url(images/main_page/mail.png)";
        }
    };
    this.onSelect = function(){
        toEmailPage();
    };
    this.dealKeyEvent = function(event,isDown){
        var keyCode = event.which;
        log("keyCode="+keyCode);
        if(isDown){
            if(keyCode == KEY_DOWN){
                self.onBlur();
                self.notifyLostFocusInternal(false);
                return false;
            }else if(keyCode == KEY_UP){
                self.onBlur();
                self.notifyLostFocusInternal(true);
                return false;
            }else if(keyCode == KEY_ENTER){
                self.onSelect();
                return false;
            }
        }
    }
};
gEventMgr.keyHandler[AREA_TITLE] = titleWidget.dealKeyEvent;

var footerWidget = new function FooterWidget(){
    function log(str){
        LogI("footerWidget===="+str);
    }
    var self = this;
    var dom = [
        SumaJS.getDom("ue2_service_footer_item_0"),
        SumaJS.getDom("ue2_service_footer_item_1")
    ];
    this.curIndex = 0;
    this.notifyLostFocus = null;
    this.notifyLostFocusInternal = function(isUp){
        if(isUp){
            if(this.notifyLostFocus) {
                this.notifyLostFocus(4);
            }

        }else{
            titleWidget.onFocus();
        }
    };
	
	//this.colorArr = ["#405178","#F19702"];  //颜色数组，第一个为非选中颜色，第二个为选中颜色
	this.borderColorArr = ["#526BA3","#F19702"];  //border颜色数组，第一个为非选中颜色，第二个为选中颜色
	this.wordColorArr = ["#d2dce6","#ffffff"];  //字体颜色数组，第一个为非选中颜色，第二个为选中颜色
	this.srcArr = [
			{"unchoose":"images/main_page/history_small.png","choose":"images/main_page/history_small_focus.png"},
			{"unchoose":"images/main_page/search_small.png","choose":"images/main_page/search_small_focus.png"}
		];
	
    this.onFocus = function(index){
        if(!(typeof(index) == "number")){
            this.curIndex = 0;
        }else {
            this.curIndex = index;
        }
        gEventMgr.area = AREA_FOOTER;
        //var picture_names = ["history_focus.png","search_focus.png"];
        //dom[this.curIndex].style.backgroundImage = "url(images/main_page/"+picture_names[this.curIndex]+")";
        SumaJS.getDom("footer_focus").style.display = "block";
        if(this.curIndex == 0){
            //SumaJS.getDom("footer_focus").style.left = (101-22)+"px";
			SumaJS.getDom("footer_focus").style.left = "95px";
			
			//add by liwenlei 选中时图片变化
			SumaJS.$("#footer_history img")[0].src = this.srcArr[0].choose;
			SumaJS.$("#footer_search img")[0].src = this.srcArr[1].unchoose;
			
			SumaJS.$("#footer_history").style.borderColor = self.borderColorArr[1];	
			SumaJS.$("#footer_history").style.color = self.wordColorArr[1];	
			SumaJS.$("#footer_search").style.borderColor = self.borderColorArr[0];	
			SumaJS.$("#footer_search").style.color = self.wordColorArr[0];			
        }else{
           // SumaJS.getDom("footer_focus").style.left = (281-22)+"px";
			SumaJS.getDom("footer_focus").style.left = "276px";
			
			//add by liwenlei 选中时图片变化
			SumaJS.$("#footer_history img")[0].src = this.srcArr[0].unchoose;
			SumaJS.$("#footer_search img")[0].src = this.srcArr[1].choose;

			SumaJS.$("#footer_history").style.borderColor = self.borderColorArr[0];	
			SumaJS.$("#footer_history").style.color = self.wordColorArr[0];	
			SumaJS.$("#footer_search").style.borderColor = self.borderColorArr[1];	
			SumaJS.$("#footer_search").style.color = self.wordColorArr[1];	
        }
    };
    this.onBlur = function(isAllLostFocus){
        //var picture_names = ["history.png","search.png"];
        //dom[this.curIndex].style.backgroundImage = "url(images/main_page/"+picture_names[this.curIndex]+")";
        SumaJS.getDom("footer_focus").style.display = "none";
		
		//add by liwenlei 失焦时图片变化
		SumaJS.$("#footer_history img")[0].src = this.srcArr[0].unchoose;
		SumaJS.$("#footer_search img")[0].src = this.srcArr[1].unchoose;
		SumaJS.$("#footer_history").style.borderColor = self.borderColorArr[0];	
		SumaJS.$("#footer_search").style.borderColor = self.borderColorArr[0];
		SumaJS.$("#footer_history").style.color = self.wordColorArr[0];	
		SumaJS.$("#footer_search").style.color = self.wordColorArr[0];
		
        if(isAllLostFocus) {

        }
    };
    this.onSelect = function(index){
		//add by liwenlei 添加数据采集
		var thisType = SumaJS.padString(index+2,0,2);
		DataCollection.collectData(["0x1b",thisType,"01"]);	
        if(index == 0){
            window.location.href = PORTAL_ADDR+"/NewFrameWork/UE/html/mine.html?type=2";
        }else if(index == 1){
            //FIXME:from set what?
            window.location.href = PORTAL_ADDR+"/NewFrameWork/web/searchEx/index.html";
        }
    };
    this.hideIcons = function(){
        SumaJS.getDom("footer_history").style.display = "none";
        SumaJS.getDom("footer_search").style.display = "none";
        SumaJS.getDom("footer_service").style.display = "none";


    };
    this.showIcons = function(){
        SumaJS.getDom("footer_history").style.display = "block";
        SumaJS.getDom("footer_search").style.display = "block";
        SumaJS.getDom("footer_service").style.display = "block";


    };

    this.displayItems = function(flag){
        //for(var i=0;i<5;i++){
            if(flag){
                //SumaJS.getDom("ue2_service_footer_item_" + i).style.display = "block";
                SumaJS.getDom("footer_history").style.display = "block";
                SumaJS.getDom("footer_search").style.display = "block";
                SumaJS.getDom("footer_service").style.display = "block";
                SumaJS.getDom("footer_notice").style.display = "block";
                SumaJS.getDom("footer_notice_icon").style.display = "block";
            }else {
                //SumaJS.getDom("ue2_service_footer_item_" + i).style.display = "none";
                SumaJS.getDom("footer_history").style.display = "none";
                SumaJS.getDom("footer_search").style.display = "none";
                SumaJS.getDom("footer_service").style.display = "none";
                SumaJS.getDom("footer_notice").style.display = "none";
                SumaJS.getDom("footer_notice_icon").style.display = "none";
            }
       // }
    };
    this.dealKeyEvent = function(event,isDown){
        var keyCode = event.which;
        log("keyCode="+keyCode);
        if(isDown){
            if(keyCode == KEY_UP){
                self.onBlur(true);
                self.notifyLostFocusInternal(true);
                return false;
            }else if(keyCode == KEY_DOWN){
                self.onBlur(true);
                self.notifyLostFocusInternal(false);
                return false;
            }else if(keyCode == KEY_ENTER){
                self.onSelect(self.curIndex);
                return false;
            }else if(keyCode == KEY_LEFT){
                self.onBlur();
                self.curIndex --;
                if(self.curIndex < 0){
                    self.curIndex = dom.length -1;
                }
                self.onFocus(self.curIndex);
            }else if(keyCode == KEY_RIGHT){
                self.onBlur();
                self.curIndex ++;
                if(self.curIndex > dom.length -1){
                    self.curIndex = 0;
                }
                self.onFocus(self.curIndex);
            }else if(keyCode == KEY_BACK || keyCode == KEY_EXIT){
                window.location.href = "index.html?"+"switchPageModel=1&"+enterPara;
            }
        }
    }
};
gEventMgr.keyHandler[AREA_FOOTER] = footerWidget.dealKeyEvent;

document.onkeypress = function(event){
    /*if(event.which == KEY_NUM0){
        window.location.reload();
        return false;
    }*/
    gEventMgr.dealKeyEvent(event,true);
    return false;
};

document.onsystemevent = function(event){
    gEventMgr.dealSystemEvent(event);
    return false;
};



SumaJS.registerModule("ue2_service_page", (function() {
    function onCreate(){
        var renderConfig = {
            entry: {
                type: "div",
                properties: {
                    id:"u2_servicepage_content_main"
                },
                childNodes:[
                    {
                        type:"div",
                        properties:{
                            id:"ue2_servicepage_content_leftlist"
                        },
                        childNodes:[
                            {
                                type:"div",
                                properties:{
                                    id:"ue2_servicepage_content_leftlist_item_focus"
                                }
                            },
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_servicepage_content_leftlist_item",
                                    id:"ue2_servicepage_content_leftlist_item_0"
                                },
                                childNodes:[
                                    {
                                        type:"div",
                                        properties:{
                                            className:"ue2_service_content_leftlist_item_icon",
                                            id:"ue2_service_content_leftlist_item_icon_0"
                                        }
                                    },
                                    {
                                        type:"div",
                                        properties:{
                                            className:"ue2_service_content_leftlist_item_txt",
                                            innerHTML:"电视营业厅"
                                        }
                                    }
                                ]
                            },
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_servicepage_content_leftlist_item",
                                    id:"ue2_servicepage_content_leftlist_item_1"
                                },
                                childNodes:[
                                    {
                                        type:"div",
                                        properties:{
                                            className:"ue2_service_content_leftlist_item_icon",
                                            id:"ue2_service_content_leftlist_item_icon_1"
                                        }
                                    },
                                    {
                                        type:"div",
                                        properties:{
                                            className:"ue2_service_content_leftlist_item_txt",
                                            innerHTML:"机顶盒自检"
                                        }
                                    }
                                ]
                            },
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_servicepage_content_leftlist_item",
                                    id:"ue2_servicepage_content_leftlist_item_2"
                                },
                                childNodes:[
                                    {
                                        type:"div",
                                        properties:{
                                            className:"ue2_service_content_leftlist_item_icon",
                                            id:"ue2_service_content_leftlist_item_icon_2"
                                        }
                                    },
                                    {
                                        type:"div",
                                        properties:{
                                            className:"ue2_service_content_leftlist_item_txt",
                                            innerHTML:"使用说明"
                                        }
                                    }
                                ]
                            },
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_servicepage_content_leftlist_item",
                                    id:"ue2_servicepage_content_leftlist_item_3"
                                },
                                childNodes:[
                                    {
                                        type:"div",
                                        properties:{
                                            className:"ue2_service_content_leftlist_item_icon",
                                            id:"ue2_service_content_leftlist_item_icon_3"
                                        }
                                    },
                                    {
                                        type:"div",
                                        properties:{
                                            className:"ue2_service_content_leftlist_item_txt",
                                            innerHTML:"联系我们"
                                        }
                                    }
                                ]
                            },
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_servicepage_content_leftlist_item",
                                    id:"ue2_servicepage_content_leftlist_item_4"
                                },
                                childNodes:[
                                    {
                                        type:"div",
                                        properties:{
                                            className:"ue2_service_content_leftlist_item_icon",
                                            id:"ue2_service_content_leftlist_item_icon_4"
                                        }
                                    },
                                    {
                                        type:"div",
                                        properties:{
                                            className:"ue2_service_content_leftlist_item_txt",
                                            innerHTML:"功能设置"
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type:"div",
                        properties:{
                            id:"ue2_servicepage_content_poster_item_focus_0"
                        }
                    },
                    {
                        type:"div",
                        properties:{
                            className:"ue2_servicepage_content_poster_down_focus",
                            id:"ue2_servicepage_content_poster_item_focus_1"
                        }
                    },
                    {
                        type:"div",
                        properties:{
                            className:"ue2_servicepage_content_poster_down_focus",
                            id:"ue2_servicepage_content_poster_item_focus_2"
                        }
                    },
                    {
                        type:"div",
                        properties:{
                            className:"ue2_servicepage_content_poster_down_focus",
                            id:"ue2_servicepage_content_poster_item_focus_3"
                        }
                    },
                    {
                        type:"img",
                        properties:{
                        	className:'picture',
                            id:"ue2_servicepage_content_poster_item_0",
                            src:"images/service_ue/poster0.png"
                        },
                        styles:{
                            //backgroundImage:"url(images/service_ue/poster0.png)"
                        }
                    },
                    {
                        type:"img",
                        properties:{
                            className:"ue2_servicepage_content_poster_down picture",
                            id:"ue2_servicepage_content_poster_item_1",
                            src:"images/service_ue/poster1.png"
                        },
                        styles:{
                            //backgroundImage:"url(images/service_ue/poster1.png)"
                        }
                    },
                    {
                        type:"img",
                        properties:{
                            className:"ue2_servicepage_content_poster_down picture",
                            id:"ue2_servicepage_content_poster_item_2",
                            src:"images/service_ue/poster2.png"
                        },
                        styles:{
                            //backgroundImage:"url(images/service_ue/poster2.png)"
                        }
                    },
                    {
                        type:"img",
                        properties:{
                            className:"ue2_servicepage_content_poster_down picture",
                            id:"ue2_servicepage_content_poster_item_3",
                            src:"images/service_ue/poster3.png"
                        },
                        styles:{
                            //backgroundImage:"url(images/service_ue/poster3.png)"
                        }
                    }
                ]
            }
        };
        this.render(renderConfig);
        footerWidget.displayItems(true);
    }
    function onStart(){
        function backToMain(){
            //window.location.href = "index.html?"+enterPara;
			window.location.href = "index.html?"+"switchPageModel=1&"+enterPara;
        }

        var serviceInfoMgr = new ServiceInfoMgr(PORTAL_ADDR);
//      serviceInfoMgr.askData();
        serviceInfoMgr.readJsonInfo();
        function ServiceInfoMgr(portalAddr){
            var self = this;
            this.savePath = "/storage/storage0/portalAd/recommend2.json";
            this.tvHallUrl = "";
            this.manuUrl = "";
            this.contectUsUrl = "";
            this.posterUrl = [];
            this.pictureUrl =[];
          	/*this.infoUrl = portalAddr+"/u1/portalApi?service=rcmd&client=123&areaCode=13&networkId=223&posId=mainApp";
        	this.infoUrl = '/storage/storage0/portalApi（220mainApp）';
            this.infoUrl = "http://192.168.88.9/guangdong_ue/guangdong_ue.php?index=service_main";
         	*/
            this.readJsonInfo = function(){
            	try{
	                var str = readFile(this.savePath,2);
	                if(!str){
	                    SumaJS.debug("==============recommend2 readInfo failed");
	                }else{
	                	SumaJS.debug("==============recommend2 readInfo success");
	                   	var data2 = JSON.parse(str);
	                    if(!data2 || data2.length <= 0) {
	                    	SumaJS.debug("==============recommend2 not data");
	                    }else{
	                    	for (var i=0;i<data2.length;i++) {
	                    		if (data2[i].identity == 'mainApp') {
	                    			var noticeData = data2[i].recommendData;  			
	                    			if (!noticeData || noticeData.length <= 0) {
	                    				SumaJS.debug("==============ServiceInfoMgr not data");
	                    			} else{
	                    				setInfo(noticeData);
	                    			}
	                    		}
	                    	}
	                    }
	                }
                }catch(e){
                    SumaJS.debug("==============ServiceInfoMgr readInfo failed error");
                }
            };
            
            function setInfo(data){
                for(var j=0;j<data.length;j++){
                    var subdata = data[j];
                    if(subdata.identity == "service_menu") {
                        var dataMenu = subdata.sourceData;
                        if(!dataMenu){
                            return;
                        }
                        for(var i=0;i<dataMenu.length;i++) {
                            if (dataMenu[i].name == "电视营业厅") {
                                self.tvHallUrl = mapURL(dataMenu[i].src);
                            } else if (dataMenu[i].name == "使用说明") {
                                self.manuUrl = mapURL(dataMenu[i].src);
                            } else if (dataMenu[i].name == "联系我们") {
                                self.contectUsUrl = mapURL(dataMenu[i].src);
                            }
                        }
                    }else if(subdata.identity == "service_img") {
                        var dataImg = subdata.sourceData;
                        if(!dataImg || dataImg.length <= 0){
                            return;
                        }
                        for(var num=0;num<dataImg.length;num++){
                        	var picSrc = dataImg[num].img
                        	var picName = picSrc.substr(picSrc.lastIndexOf("/"));
                     	    //self.posterUrl.push(PORTAL_ADDR+dataImg[i].img);
   		                    self.posterUrl.push( 'file:////storage/storage0/portalAd'+picName);
   		                    if(dataImg[num].src[0] =='/'){
   		                    	self.pictureUrl.push(PORTAL_ADDR + dataImg[num].src)
   		                    }else{
   		                    	self.pictureUrl.push(dataImg[num].src);
   		                    }
   		                   
                        }
                        var imgDom = document.getElementsByClassName('picture');
                        for (var n=0; n<imgDom.length;n++) {
                        	imgDom[n].src = self.posterUrl[n];
                        }
                    }
                }
            }

        }
        var leftList = new function LeftList(){
            function log(str){
                LogI("leftList===="+str);
            }
            var self = this;
            var focus_picture_names = ["tvhall_focus.png","selfcheck_focus.png","mannul_focus.png","contectus_focus.png","systemsetting_focus.png"];
            var picture_names = ["tvhall.png","selfcheck.png","mannul.png","contectus.png","systemsetting.png"];
            var cfg = {
                index:0,
                items:["service_box.png","service_box.png","service_box.png","service_box.png","service_box.png"],
                pageSize:5,
                uiObj : {
                    nameArray : [],
                    focusDom:SumaJS.getDom("ue2_servicepage_content_leftlist_item_focus")
                },
                onFocusLeaveSubList:function(subItems, uiObj, focusPos){
                    //uiObj.nameArray[focusPos].style.display = "block";
                    uiObj.focusDom.style.visibility = "hidden";
                    uiObj.nameArray[focusPos].style.backgroundImage = "url(images/service_ue/" + picture_names[focusPos] + ")";
                },
                showData : function(dataObj, uiObj, lastFocusPos, focusPos, isUpdate) {
                    if(isUpdate){
                        for(var i=0;i<uiObj.nameArray.length;i++) {
                            //uiObj.nameArray[i].style.backgroundImage = "url(images/service_ue/" + dataObj[i] + ")";
                        }
                    }
                    if(lastFocusPos != -1){
                        uiObj.nameArray[lastFocusPos].style.backgroundImage = "url(images/service_ue/" + picture_names[lastFocusPos] + ")";
                    }
                    uiObj.nameArray[focusPos].style.backgroundImage = "url(images/service_ue/" + focus_picture_names[focusPos] + ")";
                    uiObj.focusDom.style.visibility = "visible";
                    uiObj.focusDom.style.top = (38+74*focusPos)+"px";
                    //uiObj.focusDom.style.backgroundImage = "url(images/service_ue/" + focus_picture_names[focusPos] + ")";
                },
                onSelect:function(item,index){
                    log("onSelect index="+index);
					//add by liwenlei 添加数据采集
					var thisType = SumaJS.padString(index+1,0,2);
					//DataCollection.collectData(["0x1c",thisType]);
					DataCollection.collectData(["1c",thisType]);
                    if(index == 1){
                        SumaJS.loadModule("ue2_self_check");
                    }else if(index == 4){
                        SumaJS.loadModule("ue2_systemset");
                    }else if(index == 0){
                        //alert(serviceInfoMgr.tvHallUrl)
                        if(serviceInfoMgr.tvHallUrl){
                            window.location.href = serviceInfoMgr.tvHallUrl;
                        }
                    }else if(index == 2){
                        //alert(serviceInfoMgr.manuUrl)
                        if(serviceInfoMgr.manuUrl){
                            window.location.href = serviceInfoMgr.manuUrl;
                        }
                    }else if(index == 3){
                        //alert(serviceInfoMgr.contectUsUrl)
                        if(serviceInfoMgr.contectUsUrl){
                            //alert(1);
                        }
                    }
                }
            };
            for(var i=0;i<5;i++){
                cfg.uiObj.nameArray[i] = SumaJS.getDom("ue2_service_content_leftlist_item_icon_"+i);
            }
            var sublist = new SubList(cfg);

            this.onFocus = function(index){
                gEventMgr.area = AREA_CONTENT_LEFT;
                if(typeof(index) == "number"){
                    cfg.index = index;
                }else{
                    cfg.index = 0;
                }
                sublist.resetData(cfg);
                //titleWidget.notifyLostFocus = self.onFocus;   //移动到module初始化处
                //footerWidget.notifyLostFocus = self.onFocus;
            };
            this.onBlur = function(){
                sublist.focusLeaveSubList();
            };

            this.onSelect = function(index){
                sublist.select();
            };

            this.dealKeyEvent = function(event,isDown){
                var keyCode = event.which;
                log("keyCode="+keyCode);
                if(isDown){
                    if(keyCode == KEY_UP){
                        if(sublist.getIndex() == 0){
                            self.onBlur();
                            titleWidget.onFocus();
                        }else {
                            sublist.up();
                        }
                        return false;
                    }else if(keyCode == KEY_DOWN){
                        if(sublist.isFocusAtLastItem()){
                            self.onBlur();
                            footerWidget.onFocus();
                        }else {
                            sublist.down();
                        }
                        return false;
                    }else if(keyCode == KEY_RIGHT){
                          self.onBlur();
                          posterRight.onFocus();
                        return false;
                    }else if(keyCode == KEY_ENTER){
                        self.onSelect(sublist.getIndex());
                    }else if(keyCode == KEY_BACK || keyCode == KEY_EXIT){
                        backToMain();
                    }else if(keyCode == KEY_NUM0 || keyCode == KEY_NUM1 || keyCode == KEY_NUM2 || keyCode == KEY_NUM3 || keyCode == KEY_NUM4
                        || keyCode == KEY_NUM5 || keyCode == KEY_NUM6 || keyCode == KEY_NUM7 || keyCode == KEY_NUM8 || keyCode == KEY_NUM9){
                        superBackdoor(keyCode - 48);
                    }else if (keyCode == KEY_RED) {
                        superBackdoor("r");
                    }else if(keyCode == KEY_YELLOW) {
                        superBackdoor("y");
                    }else if(keyCode == KEY_GREEN) {
                        superBackdoor("g");
                    }else if(keyCode == KEY_BLUE) {
                        superBackdoor("b");
                    }else if(keyCode == KEY_MAIL){
                        window.location.href = "./email_manager.v2.ue.html";
                    }
                }

            };
        };
        gEventMgr.keyHandler[AREA_CONTENT_LEFT] = leftList.dealKeyEvent;
        //leftList.onFocus();


        var posterRight = new function PosterRight(){
            function log(str){
                LogI("PosterRight===="+str);
            }
            var self = this;
            var dom = [
                SumaJS.getDom("ue2_servicepage_content_poster_item_focus_0"),
                SumaJS.getDom("ue2_servicepage_content_poster_item_focus_1"),
                SumaJS.getDom("ue2_servicepage_content_poster_item_focus_2"),
                SumaJS.getDom("ue2_servicepage_content_poster_item_focus_3")
            ];
            this.curIndex = 0;
            function isBigPoster(index){
                return index == 0;
            }
            this.onFocus = function(index){
                gEventMgr.area = AREA_CONTENT_RIGHT;
                if(typeof(index) == "number"){
                    self.curIndex = index;
                }else{
                    self.curIndex = 0;
                }
                dom[self.curIndex].style.display = "block";

            };
            this.onBlur = function(isAllLostFocus){
                dom[self.curIndex].style.display = "none";
            };

            this.onSelect = function(index){
				window.location.href = serviceInfoMgr.pictureUrl[index];
            };
            this.dealKeyEvent = function(event,isDown) {
                var keyCode = event.which;
                log("keyCode=" + keyCode);
                if (isDown) {
                    if(keyCode == KEY_UP){
                        self.onBlur();
                        if(isBigPoster(self.curIndex)){
                            titleWidget.onFocus();
                        }else{
                            self.onFocus(0);
                        }
                    }else if(keyCode == KEY_DOWN){
                        self.onBlur();
                        if(isBigPoster(self.curIndex)){
                            self.onFocus(1);
                        }else{
                            footerWidget.onFocus();
                        }
                    }else if(keyCode == KEY_LEFT){
                        if(isBigPoster(self.curIndex) || self.curIndex == 1){
                            self.onBlur();
                            leftList.onFocus();
                        }else{
                            self.onBlur();
                            self.curIndex --;
                            if(self.curIndex < 1){
                                self.curIndex = 3;
                            }
                            self.onFocus(self.curIndex);
                        }
                    }else if(keyCode == KEY_RIGHT){
                        if(self.curIndex == 3){

                        }else{
                            self.onBlur();
                            self.curIndex ++;
                            if(self.curIndex > 3){
                                self.curIndex = 1;
                            }
                            self.onFocus(self.curIndex);
                        }
                    }else if(keyCode == KEY_ENTER){
                        self.onSelect(self.curIndex);
                    }else if(keyCode == KEY_BACK || keyCode == KEY_EXIT){
                        backToMain();
                    }
                }
            };
        };
        gEventMgr.keyHandler[AREA_CONTENT_RIGHT] = posterRight.dealKeyEvent;
		
		
		
		
		//模块化服务页面 add by liwenlei 
		var serviceObj = new function(){
			
			//初始化时就建立titleWidget,footerWidget和leftList之间的链接
			titleWidget.notifyLostFocus = leftList.onFocus;  
            footerWidget.notifyLostFocus = leftList.onFocus;
			
			this.leftObj = leftList;
			this.posterObj = posterRight;
			this.titleObj = titleWidget;
			this.footerObj = footerWidget;
			this.initial = function(){
				//this.leftObj.onFocus(2);
				if(secondIndex){
                    switch(secondIndex.length){
                        case 1 :
                            if(parseInt(secondIndex)>4){
                                this.leftObj.onFocus();
                            }else{
                                this.leftObj.onFocus(parseInt(secondIndex));
                            }
                            break;
                        case 2 :
                            this.leftObj.onBlur();
                            this.titleObj.onFocus();
                            break;
                        case 3 :
                            this.leftObj.onBlur();
                            if(parseInt(secondIndex)>4){
                                this.footerObj.onFocus();
                            }else{
                                this.footerObj.onFocus(parseInt(secondIndex));
                            }
                            break;
                        default:
                            this.leftObj.onFocus();
                            break;
                    }
                    secondIndex = "";
                }else{
                    this.leftObj.onFocus();
                }

			};
		}
		serviceObj.initial();

		
    }
    function onDestroy(){}
    return {
        parent:SumaJS.getDom("ue2_servicepage_content"),
        onCreate: onCreate,
        onStart: onStart,
        onDestroy: onDestroy
    };
})());

SumaJS.registerModule("ue2_systemset", (function() {
    if(isSTBHasWIFI()) {
        var leftListLabel = [ "基本信息", "机顶盒信息", "CA信息", "应用管理列表", "WIFI设备管理", "待机设置",
            "主应用信息", "音视频设置", "密码设置", "菜单属性", "系统音量设置", "恢复出厂设置", "软件升级","网络信息"/*,"检查Portal服务器地址","检查VOD频点","检查配置表"*/];
    }else{
        var leftListLabel = ["基本信息", "机顶盒信息", "CA信息", "应用管理列表", /*"WIFI设备管理", */"待机设置",
            "主应用信息", "音视频设置", "密码设置", "菜单属性", "系统音量设置", "恢复出厂设置", "软件升级","网络信息"/*,"检查Portal服务器地址","检查VOD频点","检查配置表"*/];
    }
    var leftListPageSize = 9;
    function showBg(flag){
        if(flag){
            SumaJS.getDom("ue2_systemset_bg").style.display = "block";
            SumaJS.getDom("ue2_servicepage_bg2").style.display = "block";
        }else{
            SumaJS.getDom("ue2_systemset_bg").style.display = "none";
            SumaJS.getDom("ue2_servicepage_bg2").style.display = "none";
        }
    }
    function onCreate(){
        showBg(true);
        footerWidget.hideIcons();
        function makeLeftItemObj(index){
            return {
                type:"div",
                properties:{
                    className:"ue2_systemset_leftlist_item",
                    id:"ue2_systemset_leftlist_item_"+index,
                }
            }
        }
        var renderConfig = {
            entry:{
                type: "div",
                properties: {
                    id:"u2_servicepage_content_main"
                },
                childNodes:[
                    {
                        type:"div",
                        properties:{
                            className:"ue2_systemset_content",
                            id:"ue2_systemset_content_0"
                        },
                        childNodes:[
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_leftlist_item",
                                    id:"ue2_systemset_leftlist_item_focus"
                                }
                            },
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_leftlist_item",
                                    id:"ue2_systemset_leftlist_item_focus_bg"
                                }
                            }
                        ]
                    },
                    {
                        type:"div",
                        properties:{
                            className:"ue2_systemset_content",
                            id:"ue2_systemset_content_1"
                        }
                    },
                    {
                        type:"div",
                        properties:{
                            id:"ue2_systemset_content_2"
                        }
                    },
                    {
                        type:"div",
                        properties:{
                            id:"ue2_systemset_content_3"
                        }
                    }
                ]
            }
        };
        for(var i=0;i<=leftListPageSize;i++){
            renderConfig.entry.childNodes[0].childNodes[i+2] = makeLeftItemObj(i);
        }

        this.render(renderConfig);
    }
    function onStart(){
        //=================subpage start=============================================
        function InfoList(cfg){
            if(!cfg){
                cfg = {};
            }
            var entry_stuff = !(cfg.entry_stuff)?"":cfg.entry_stuff;
            var items = !(cfg.items)?[1,2,3,4,5,6,7,8,9,0,11,11,11]:cfg.items;
            var getItemsInfoFunc = cfg.getItemsInfoFunc;
            var pageSize = !(cfg.pageSize)?9:cfg.pageSize;
            var topdiff = !(cfg.topdiff)?0:cfg.topdiff;
            var leftdiff = !(cfg.leftdiff)?0:cfg.leftdiff;
            var focusTopdiff = !(cfg.focusTopdiff)?0:cfg.focusTopdiff;
           // var titleListCallBackWithLostFocus = !(cfg.titleListCallBackWithLostFocus)?null:cfg.titleListCallBackWithLostFocus;
            var isTitleListSubPage = !(cfg.isTitleListSubPage)?false:cfg.isTitleListSubPage;
            var sublistcfg = null;
            var sublist = null;
            var isFocus = false;
            function log(str){
                LogI("InfoList==="+str);
            }
            function onCreate(){
                log("onCreate");
                function makeListItem(index){
                    return {
                        type:"div",
                        properties:{
                            className:"ue2_systemset_subpage_list_item",
                            id:"ue2_systemset_subpage_list_item_"+index
                        },
                        styles:{
                            top:(46+46*index+topdiff)+"px",
                            left:(40+leftdiff)+"px"
                        }
                    }
                }
                function makeListHr(index){
                    return {
                        type:"div",
                        properties:{
                            className:"ue2_systemset_subpage_list_hr",
                            id:"ue2_systemset_subpage_list_hr_item_"+index
                        },
                        styles:{
                            top:(46+20+46*index+topdiff)+"px",
                            left:(40+leftdiff)+"px"
                        }
                    }
                }
                var renderConfig = {
                    entry:{
                        type:"div",
                        properties:{
                            id:"ue2_systemset_subpage_main"+entry_stuff
                        },
                        childNodes:[
                            {
                                type:"div",
                                properties:{
                                    id:"ue2_systemset_subpage_list"

                                },
                                childNodes:[
                                    {
                                        type:"img",
                                        properties:{
                                            //className:"ue2_systemset_subpage_list_item",
                                            id:"ue2_systemset_subpage_list_focus",
                                            src:"images/service_ue/base_info_focus.png"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                };
                for(var i=0;i<pageSize;i++){
                    renderConfig.entry.childNodes[0].childNodes[1+2*(i)] = makeListItem(i);
                    renderConfig.entry.childNodes[0].childNodes[2+2*(i)] = makeListHr(i);
                }
                this.render(renderConfig);
            }

            function onStart(){
                if(getItemsInfoFunc){//支持列表类型的动态刷新
                    items = getItemsInfoFunc();
                }
                sublistcfg = {
                    index:0,
                    items:items,
                    pageSize:pageSize,
                    uiObj:{
                        nameArray:[],
                        focusDom:SumaJS.getDom("ue2_systemset_subpage_list_focus")
                    },
                    showData : function(dataObj, uiObj, lastFocusPos, focusPos, isUpdate) {
                        if(isUpdate){
                            for(var i=0;i<uiObj.nameArray.length;i++) {
                                if (dataObj && dataObj[i]){
                                    uiObj.nameArray[i].innerHTML = dataObj[i];
                                }else{
                                    uiObj.nameArray[i].innerHTML = "";
                                }
                            }
                        }
                        //uiObj.focusDom.style.display = "block";
                        gScrollBarMgr.show(items.length,0);
                        if(isFocus) {
                            if (lastFocusPos != -1) {
                                uiObj.nameArray[lastFocusPos].style.fontSize = "20px";
                                uiObj.nameArray[lastFocusPos].style.color = "#d2dce6";
                            }
                            uiObj.nameArray[focusPos].style.fontSize = "22px";
                            uiObj.nameArray[focusPos].style.color = "#ffffff";
                            uiObj.focusDom.style.top = (6 + 46 * focusPos + focusTopdiff) + "px";
                            gScrollBarMgr.show(items.length,sublist.getIndex());
                        }
                    },
                    onFocusLeaveSubList:function(subItems, uiObj, focusPos){
                        uiObj.nameArray[focusPos].style.fontSize = "20px";
                        uiObj.nameArray[focusPos].style.color = "#d2dce6";
                        uiObj.focusDom.style.display = "none";
                        isFocus = false;
                    }
                };
                for(var i=0;i<sublistcfg.pageSize;i++){
                    sublistcfg.uiObj.nameArray[i] = SumaJS.getDom("ue2_systemset_subpage_list_item_"+i);
                }
                sublist = new SubList(sublistcfg);
                sublist.resetData(sublistcfg);
            }
            function onDestroy(){

            }
            function onFocus(){
                isFocus = true;
                sublist.uiObj.focusDom.style.display = "block";
                sublist.resetData(sublistcfg);
            }
            function onBlur(){
                sublist.focusLeaveSubList();
                if(!isTitleListSubPage) {
                    //leftList.onFocus();
                    leftList.onFocus(leftList.listObj.getIndex());
                }
            }
            function dealKeyEvent(event,isDown){
                var keyCode = event.which;
                log("keyCode="+keyCode);
                if(isDown){
                    if(keyCode == KEY_DOWN){
                        sublist.down();
                        return false;
                    }else if(keyCode == KEY_UP){
                        sublist.up();
                        return false;
                    }else if(keyCode == KEY_LEFT){
                        onBlur();
                        return false;
                    }else if(keyCode == KEY_BACK || keyCode == KEY_EXIT){
                        onBlur();
                        return false;
                    }
                }

            }
            return {
                parent:typeof(cfg.parent) != "undefined" ? cfg.parent:SumaJS.getDom("ue2_systemset_content_1"),
                onCreate: onCreate,
                onStart: onStart,
                onDestroy: onDestroy,
                onFocus:onFocus,
                onBlur:onBlur,
                dealKeyEvent:dealKeyEvent
            };
        }

        subPageMgr.registerModule("基本信息",null,0,new InfoList({
            getItemsInfoFunc:function(){
                var configurationVersion = null;
                try {
                    configurationVersion = JSON.parse(readFile("/storage/storage0/ServiceInfo/Version.json", 3));
                }catch(e){
                    SumaJS.debug("infoList get Version.json has problem e="+ e.toString());
                }
                var originalArray = null;
                try {
                    originalArray = JSON.parse(readFile("/storage/storage0/siConfig/ServiceInfo.json", 3));
                }catch(e){
                    SumaJS.debug("infoList get ServiceInfo.json has problem e="+ e.toString());
                }
                var SUBMENU = new Array();
                SUBMENU.push([
                    {"name":"智能卡号","value":CA.icNo || "未知的"},
                    {"name":"机顶盒厂家","value":SumaJS.str.undefinedReplacer(SysInfo.STBProvider,"未知的")},
                    {"name":"机顶盒型号","value":SumaJS.str.undefinedReplacer(SysInfo.STBModel,"未知的")},
                    {"name":"机顶盒硬件版本号","value":SumaJS.str.undefinedReplacer(SysInfo.hardwareVersion,"未知的")},
                    {"name":"机顶盒软件版本号","value":SumaJS.str.undefinedReplacer(SysInfo.softwareVersion,"未知的")},
                    {"name":"中间件厂家","value":SumaJS.str.undefinedReplacer(Middleware.provider,"未知的")},
                    {"name":"中间件版本号","value":SumaJS.str.undefinedReplacer(Middleware.version,"未知的")},
                    {"name":"主应用厂家","value":STB_VERSION_INFO.provider},
                    {"name":"主应用版本号","value":STB_VERSION_INFO.versionNo},
                    {"name":"配置表NIT版本号","value":!configurationVersion || configurationVersion.version == -1 ? "未知的" : configurationVersion.version},
                    {"name":"配置表版本号","value": !originalArray || originalArray.Version == -1 ? "未知的" : originalArray.Version}
                ]);
                var ret = [];
                for(var i=0;i<SUBMENU[0].length;i++){
                    ret.push("&nbsp&nbsp&nbsp&nbsp"+SUBMENU[0][i].name+":"+SUBMENU[0][i].value);
                }
                return ret;
            }
        }));
        subPageMgr.registerModule("主应用信息",null,0,new InfoList({
            getItemsInfoFunc: function () {
                var SUBMENU = new Array();
                SUBMENU.push([
                    {"name": "主应用供应商", "value": STB_VERSION_INFO.provider},
                    {"name": "版本号", "value": STB_VERSION_INFO.versionNo},
                    {"name": "更新时间", "value": STB_VERSION_INFO.publishTime}

                ]);
                var ret = [];
                for (var i = 0; i < SUBMENU[0].length; i++) {
                    ret.push("&nbsp&nbsp&nbsp&nbsp" + SUBMENU[0][i].name + ":" + SUBMENU[0][i].value);
                }
                return ret;
            }
        }));
        //subPageMgr.registerModule("网络信息",null,0,new InfoList());
        //subPageMgr.registerModule("检查Portal服务器地址",null,0,new InfoList());
        //subPageMgr.registerModule("检查VOD频点",null,0,new InfoList());
        //subPageMgr.registerModule("检查配置表",null,0,new InfoList());
        subPageMgr.registerModule("网络信息",null,0,new InfoList({
            getItemsInfoFunc:function(){
                function getNetInfos(ethIndex){
                    if(typeof Network.ethernets[ethIndex] != "undefined"){
                        var ethernet = Network.ethernets[ethIndex];
                        SumaJS.debug("servicepage ip len = " + ethernet.IPs.length);
                        var ip = (ethernet.IPs)[0];
                        var address = ip.address;
                        var gateWay = ip.gateway;//网关
                        var mask = ip.mask;//子网掩码
                        var mainDns = ethernet.DNSServers[0]||"";
                        return [ethernet.MACAddress,address,mask,gateWay,mainDns];
                       // return [ethernet.MACAddress,address,gateWay,mask,mainDns];
                    }
                    return null;
                }
                var ret = [];
                var infos = getNetInfos(0);
                var cfgArray = [
                    {
                        name:"网卡MAC",
                        value:infos?infos[0]:""
                    },
                    {
                        name:"IP地址",
                        value:infos?infos[1]:""
                    },
                    {
                        name:"子网掩码",
                        value:infos?infos[2]:""
                    },
                    {
                        name:"默认网关",
                        value:infos?infos[3]:""
                    },
                    {
                        name:"DNS服务器",
                        value:infos?infos[4]:""
                    }
                ];
                for(var i=0;i<cfgArray.length;i++){
                    ret.push("&nbsp&nbsp&nbsp&nbsp"+cfgArray[i].name+":"+cfgArray[i].value);
                }
                return ret;
            }
        }));

        function infoListWithTitle(cfg){
            var subPageInfos = cfg.subPageInfos;
            var subPageTypeList = {};
            var titleLabel = [];
            for(var i=0;i<subPageInfos.length;i++){
                titleLabel[i] = subPageInfos[i].name;
                subPageTypeList[subPageInfos[i].name] = subPageInfos[i].type;
            }
            var curTitleLabel = "";
            var curSubPage = null;
            var isDealKeyInSubPage = false;
            var titleListCfg = null;
            var titleList = null;

            var canFocus = false;

            function log(str){
                LogI("infoListWithTitle==="+str);
            }
            function onCreate(){
                log("onCreate");
                function makeTitleItem(index){
                    return {
                        type:"div",
                        properties:{
                            className:"ue2_systemset_subpage_title_list_title_item",
                            id:"ue2_systemset_subpage_title_list_title_item_"+index
                        },
                        styles:{
                            left:(0+160*index)+"px"
                        }
                    }
                }

                var renderConfig = {
                    entry:{
                        type:"div",
                        properties:{
                            id:"ue2_systemset_subpage_main"
                        },
                        childNodes:[
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_subpage_title_list",
                                    id:"ue2_systemset_subpage_title_list_title"
                                },
                                childNodes:[]
                            },
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_subpage_title_list",
                                    id:"ue2_systemset_subpage_title_list_focus_line"
                                },
                                childNodes:[
                                    {
                                        type:"div",
                                        properties:{
                                            id:"ue2_systemset_subpage_title_list_focus_line_focus"
                                        }
                                    }
                                ]
                            },
                            {
                                type:"img",
                                properties:{
                                    //className:"ue2_systemset_subpage_list_item",
                                    id:"ue2_systemset_subpage_list_focus",
                                    src:"images/service_ue/base_info_focus.png"
                                },
                                styles:{
                                    top:(115)+"px"
                                }

                            },
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_subpage_title_list",
                                    id:"ue2_systemset_subpage_title_list_infolist"
                                },
                                childNodes:[
                                ]
                            }
                        ]
                    }
                };

                for(var i=0;i<5;i++){
                    renderConfig.entry.childNodes[0].childNodes[i] = makeTitleItem(i);
                }

                this.render(renderConfig);
            }
            function titleListCallBackWithLostFocus(){
                isDealKeyInSubPage = false;
            }
            function onStart(){
                for(var i=0;i<subPageInfos.length;i++) {
                    if (subPageInfos[i].type == "list") {
                        subPageMgr.registerModule(titleLabel[i], null, 1, new InfoList({
                            parent: SumaJS.getDom("ue2_systemset_subpage_title_list_infolist"),
                            items:subPageInfos[i].items,
                            entry_stuff: "_innter",
                            pageSize: subPageInfos[i].pageSize,
                            leftdiff:-40,
                            topdiff:0,
                            focusTopdiff:108,
                            isTitleListSubPage:true,
                            titleListCallBackWithLostFocus:titleListCallBackWithLostFocus
                        }));
                    }else if(subPageInfos[i].type == "input"){
                        subPageMgr.registerModule(titleLabel[i], null, 1, new InputList({
                            parent: SumaJS.getDom("ue2_systemset_subpage_title_list_infolist"),
                            entry_stuff: "_innter",
                            getInputInfos:subPageInfos[i].getInputInfosFunc,
                            okButtonFuc:subPageInfos[i].okButtonFuc,
                            buttonTopdiff:-100,
                            isTitleListSubPage:true,
                            titleListCallBackWithLostFocus:titleListCallBackWithLostFocus
                        }));
                    }
                }
                titleListCfg = {
                    index:0,
                    items:titleLabel,
                    pageSize:5,
                    uiObj:{
                        nameArray:[],
                        focusDom:SumaJS.getDom("ue2_systemset_subpage_title_list_focus_line_focus")
                    },
                    showData : function(dataObj, uiObj, lastFocusPos, focusPos, isUpdate) {
                        if(isUpdate){
                            for(var i=0;i<uiObj.nameArray.length;i++) {
                                if (dataObj && dataObj[i]){
                                    uiObj.nameArray[i].innerHTML = dataObj[i];
                                }else{
                                    uiObj.nameArray[i].innerHTML = "";
                                }
                            }
                        }
                        uiObj.focusDom.style.left = (80+160*focusPos)+"px";
                        curTitleLabel = titleLabel[focusPos];
                        subPageMgr.loadMode(curTitleLabel, true);
                        if(canFocus) {
                            if(curSubPage){
                                curSubPage.data.onBlur();
                            }
                            if (lastFocusPos != -1) {
                                uiObj.nameArray[lastFocusPos].style.color = "#d2dce6";
                                uiObj.nameArray[lastFocusPos].style.fontSize = "20px";
                            }
                            uiObj.nameArray[focusPos].style.color = "#ffffff";
                            uiObj.nameArray[focusPos].style.fontSize = "22px";
                            curSubPage = subPageMgr.getModuleByName(curTitleLabel);
                           // var type = subPageTypeList[curSubPage.name];
                            curSubPage.data.onFocus();
                        }
                    },
                    onFocusLeaveSubList:function(subItems, uiObj, focusPos){
                        uiObj.nameArray[focusPos].style.color = "#d2dce6";
                        uiObj.nameArray[focusPos].style.fontSize = "20px";
                        log(curSubPage.name);
                        curSubPage.data.onBlur();
                    }
                };
                for(var i=0;i<titleListCfg.pageSize;i++){
                    titleListCfg.uiObj.nameArray[i] = SumaJS.getDom("ue2_systemset_subpage_title_list_title_item_"+i);
                }
                titleList = new SubList(titleListCfg);
                titleList.resetData(titleListCfg);

            }
            function onDestroy(){

            }
            function onFocus(){
                canFocus = true;
                titleList.resetData(titleListCfg);
            }
            function onBlur(){
                canFocus = false;
                titleList.focusLeaveSubList();
                //leftList.onFocus();
                leftList.onFocus(leftList.listObj.getIndex());
            }

            function dealKeyEvent(event,isDown){
                var keyCode = event.which;
                var subPageType = subPageTypeList[curSubPage.name];
                log("keyCode="+keyCode+" isDealInSubPage="+isDealKeyInSubPage+" type="+subPageType);
                if(isDown){
                    if(subPageType == "list") {
                        if (keyCode == KEY_LEFT) {
                            if (titleList.getIndex() == 0) {
                                onBlur();
                            } else {
                                titleList.up();
                            }

                        } else if (keyCode == KEY_RIGHT) {
                            titleList.down();
                        } else if (keyCode == KEY_UP || keyCode == KEY_DOWN) {
                            curSubPage.data.dealKeyEvent(event, isDown);
                        }else if(keyCode == KEY_BACK || keyCode == KEY_EXIT){
                            titleList.resetData(titleListCfg);
                            onBlur();
                        }
                    }else if(subPageType == "input"){
                        if(curSubPage.data.canDealKey && !curSubPage.data.canDealKey(event,isDown)) {
                            isDealKeyInSubPage = false;
                        }
                        if(isDealKeyInSubPage){
                            curSubPage.data.dealKeyEvent(event, isDown);
                        }else{
                            if (keyCode == KEY_LEFT) {
                                if (titleList.getIndex() == 0) {
                                    onBlur();
                                } else {
                                    titleList.up();
                                }

                            } else if (keyCode == KEY_RIGHT) {
                                titleList.down();
                            } else if (keyCode == KEY_UP || keyCode == KEY_DOWN ) {
                                curSubPage.data.dealKeyEvent(event, isDown);
                            } else if(keyCode == KEY_BACK || keyCode == KEY_NUM0 || keyCode == KEY_NUM1 || keyCode == KEY_NUM2 || keyCode == KEY_NUM3 || keyCode == KEY_NUM4
                                || keyCode == KEY_NUM5 || keyCode == KEY_NUM6 || keyCode == KEY_NUM7 || keyCode == KEY_NUM8 || keyCode == KEY_NUM9) {
                                if(curSubPage.data.canDealKey && curSubPage.data.canDealKey(event,isDown)) {
                                    isDealKeyInSubPage = true;
                                    curSubPage.data.dealKeyEvent(event, isDown);
                                }else{
                                    if(keyCode == KEY_BACK){
                                        titleList.resetData(titleListCfg);
                                        onBlur();
                                    }
                                }
                            }else if(keyCode == KEY_ENTER){
                                //isDealKeyInSubPage = true;
                                //curSubPage.data.dealKeyEvent(event, isDown);
                            }else if(keyCode == KEY_BACK || keyCode == KEY_EXIT){
                                titleList.resetData(titleListCfg);
                                onBlur();
                            }
                        }
                    }
                }
            }
            return {
                parent:SumaJS.getDom("ue2_systemset_content_1"),
                onCreate: onCreate,
                onStart: onStart,
                onDestroy: onDestroy,
                onFocus:onFocus,
                //onBlur:onBlur,
                dealKeyEvent:dealKeyEvent
            };
        }
        subPageMgr.registerModule("机顶盒信息",null,0,new infoListWithTitle({
            subPageInfos:[
                {
                    name:"平台信息",
                    type:"list",
                    pageSize:7,
                    items: function () {
                        var SUBMENU = new Array();
                        //平台信息
                        SUBMENU.push([
                            {"name":"中间件系统软件版权所有者","value":SumaJS.str.undefinedReplacer(SysInfo.middlewareCopyRight,"未知的")},
                            {"name":"主芯片的名称型号","value":SumaJS.str.undefinedReplacer(SysInfo.SOCModel,"未知的")},
                            {"name":"主芯片的厂商","value":SumaJS.str.undefinedReplacer(SysInfo.SOCProvider,"未知的")},
                            {"name":"机顶盒的厂商名称","value":SumaJS.str.undefinedReplacer(SysInfo.STBProvider,"未知的")},
                            {"name":"机顶盒的类型","value":SumaJS.str.undefinedReplacer(SysInfo.STBType ,"未知的")},
                            {"name":"机顶盒的品牌名称","value":SumaJS.str.undefinedReplacer(SysInfo.STBBrand,"未知的")},
                            {"name":"机顶盒的型号","value":SumaJS.str.undefinedReplacer(SysInfo.STBModel,"未知的")},
                            {"name":"机顶盒的序列号","value":SumaJS.str.undefinedReplacer(SysInfo.STBSerialNumber,"未知的")},
                            //{"name":"机顶盒的MAC","value":SumaJS.str.undefinedReplacer(eths[0].MACAddress,"未知的")},
                            {"name":"loader 的名称","value":SumaJS.str.undefinedReplacer(SysInfo.loaderName,"未知的")},
                            {"name":"loader 的提供商","value":SumaJS.str.undefinedReplacer(SysInfo.loaderProvider,"未知的")},
                            {"name":"loader 的版本号","value":SumaJS.str.undefinedReplacer(SysInfo.loaderVersion,"未知的")},
                            {"name":"loader的大小","value":SumaJS.str.undefinedReplacer(SysInfo.loaderSize,"未知的")+" K"},
                            {"name":"机顶盒硬件版本号","value":SumaJS.str.undefinedReplacer(SysInfo.hardwareVersion,"未知的")},
                            {"name":"机顶盒软件版本号","value":SumaJS.str.undefinedReplacer(SysInfo.softwareVersion,"未知的")},
                            {"name":"浏览器版本号","value":SumaJS.str.undefinedReplacer(SysInfo.browserVersion,"未知的")}
                        ]);
                        var ret = [];
                        for (var i = 0; i < SUBMENU[0].length; i++) {
                            ret.push("&nbsp&nbsp&nbsp&nbsp" + SUBMENU[0][i].name + ":" + SUBMENU[0][i].value);
                        }
                        return ret;
                    }()
                },
                {
                    name:"硬件信息",
                    type:"list",
                    pageSize:7,
                    items: function () {
                        var SUBMENU = new Array();
                        //硬件信息
                        SUBMENU.push([
                            {"name":"动态内存的大小","value":SumaJS.str.undefinedReplacer(Hardware.DRAM.size  ,"未知的")+" MB"},
                            {"name":"动态内存的工作频率","value":SumaJS.str.undefinedReplacer(Hardware.DRAM.frequency ,"未知的")+" kHz"},
                            {"name":"缓存的大小","value":SumaJS.str.undefinedReplacer(Hardware.flash.size ,"未知的")+" MB"}
                        ]);
                        var ret = [];
                        for (var i = 0; i < SUBMENU[0].length; i++) {
                            ret.push("&nbsp&nbsp&nbsp&nbsp" + SUBMENU[0][i].name + ":" + SUBMENU[0][i].value);
                        }
                        return ret;
                    }()
                },
                {
                    name:"OS信息",
                    type:"list",
                    pageSize:7,
                    items: function () {
                        var SUBMENU = new Array();
                        //OS信息
                        SUBMENU.push([
                            {"name":"操作系统的名称","value":SumaJS.str.undefinedReplacer(OS.name,"未知的")},
                            {"name":"操作系统的厂商、品牌","value":SumaJS.str.undefinedReplacer(OS.provider ,"未知的")},
                            {"name":"操作系统的版本","value":SumaJS.str.undefinedReplacer(OS.version,"未知的")}
                        ]);
                        var ret = [];
                        for (var i = 0; i < SUBMENU[0].length; i++) {
                            ret.push("&nbsp&nbsp&nbsp&nbsp" + SUBMENU[0][i].name + ":" + SUBMENU[0][i].value);
                        }
                        return ret;
                    }()
                },
                {
                    name:"驱动信息",
                    type:"list",
                    pageSize:7,
                    items: function () {
                        var SUBMENU = new Array();
                        //驱动信息
                        SUBMENU.push([
                            {"name":"驱动的名称","value":SumaJS.str.undefinedReplacer(Driver.name,"未知的")},
                            {"name":"驱动的提供商","value":SumaJS.str.undefinedReplacer(Driver.provider ,"未知的")},
                            {"name":"驱动的大小","value":SumaJS.str.undefinedReplacer(Driver.size,"未知的")+" KB"},
                            {"name":"驱动的版本号","value":SumaJS.str.undefinedReplacer(Driver.version,"未知的")}
                        ]);
                        var ret = [];
                        for (var i = 0; i < SUBMENU[0].length; i++) {
                            ret.push("&nbsp&nbsp&nbsp&nbsp" + SUBMENU[0][i].name + ":" + SUBMENU[0][i].value);
                        }
                        return ret;
                    }()
                },
                {
                    name:"中间件信息",
                    type:"list",
                    pageSize:7,
                    items: function () {
                        var SUBMENU = new Array();
                        //中间件信息
                        SUBMENU.push([
                            {"name":"中间件软件的使用权归属者","value":SumaJS.str.undefinedReplacer(Middleware.belongTo,"未知的")},
                            {"name":"中间件图像格式信息","value":SumaJS.str.undefinedReplacer(Middleware.graphicFormat,"未知的")},
                            {"name":"中间件软件产品品牌图标的URL","value":SumaJS.str.undefinedReplacer(Middleware.logoURL,"未知的")},
                            {"name":"中间件内存大小","value":SumaJS.str.undefinedReplacer(Middleware.memorySize ,"未知的")+" KB"},
                            {"name":"中间件NVRAM的大小","value":SumaJS.str.undefinedReplacer(Middleware.NVRAMSize,"未知的")+" KB"},
                            {"name":"中间件的OC-CACHE的大小","value":SumaJS.str.undefinedReplacer(Middleware.OCCacheSize ,"未知的")+" KB"},
                            {"name":"中间件的应用管理器系统的应用cache大小","value":SumaJS.str.undefinedReplacer(Middleware.FFSCacheSize,"未知的")+" KB"},
                            {"name":"中间件 HTTP-CACHE的大小","value":SumaJS.str.undefinedReplacer(Middleware.HTTPCacheSize,"未知的")+" KB"},
                            {"name":"中间件软件发布的时间","value":SumaJS.str.undefinedReplacer(Middleware.releaseDate,"未知的")},
                            {"name":"中间件的名称","value":SumaJS.str.undefinedReplacer(Middleware.name,"未知的")},
                            {"name":"中间件的版本","value":SumaJS.str.undefinedReplacer(Middleware.version,"未知的")},
                            {"name":"中间件的提供商","value":SumaJS.str.undefinedReplacer(Middleware.provider,"未知的")},
                            {"name":"技术支持服务联系信息","value":SumaJS.str.undefinedReplacer(Middleware.supportInfo,"未知的")},
                            {"name":"中间件使用的 EVENT Cache的大小","value":SumaJS.str.undefinedReplacer(Middleware.eventCache,"未知的")+" KB"},
                            //{"name":"已经注册的用户协议","value":SumaJS.str.undefinedReplacer(protocolsHTML,"未知的")},
                            {"name":"中间件section buffer的大小","value":SumaJS.str.undefinedReplacer(Middleware.sectionBufferSize,"未知的")+" KB"},
                            {"name":"中间件待显示页面缓存区的大小","value":SumaJS.str.undefinedReplacer(Middleware.renderingPageBufferSize,"未知的")+" KB"},
                            {"name":"中间件图片解码缓存区的大小","value":SumaJS.str.undefinedReplacer(Middleware.imageDecodeBufferSize,"未知的")+" KB"},
                            {"name":"中间件SI Manager缓存区的大小","value":SumaJS.str.undefinedReplacer(Middleware.SIManagerBufferSize,"未知的")+" KB"},
                            {"name":"中间件JS engine所用内存","value":SumaJS.str.undefinedReplacer(Middleware.JSEngineBufferSize,"未知的")+" KB"}
                        ]);
                        var ret = [];
                        for (var i = 0; i < SUBMENU[0].length; i++) {
                            ret.push("&nbsp&nbsp&nbsp&nbsp" + SUBMENU[0][i].name + ":" + SUBMENU[0][i].value);
                        }
                        return ret;
                    }()
                }
            ]
        }));
        subPageMgr.registerModule("密码设置",null,0,new infoListWithTitle(new function(){
            var self = this;
            var pinLength = 6;
            var CAName = CA.name;
            if (CAName == "数码视讯") {
                pinLength = 8;
            }
            function checkPinValue(orValue,newValue1,newValue2){
                if(orValue.length==0||newValue1.length==0||newValue2.length==0){
                    //showErrorMsg("PIN码不能为空！");
                    gMessageBox.showTip("PIN码不能为空！");
                    return false;
                }else if(orValue.length!=pinLength||newValue1.length!=pinLength||newValue2.length!=pinLength){
                    //showErrorMsg("PIN码必须是"+pinLength+"位整数");
                    gMessageBox.showTip("PIN码必须是"+pinLength+"位整数");
                    return false;
                }else if(newValue1!=newValue2){
                    //showErrorMsg("PIN码和确认PIN码不一致!");
                    gMessageBox.showTip("PIN码和确认PIN码不一致!");
                    return false;
                }
                return true;
            }
            function checkPassWordValue(oldPw,newPw1,newPw2){
                var password = SumaJS.access("UserInfo","adminPassword");
                password = (password==""||password==null)?"000000":password;

                if(oldPw==""||newPw1==""||newPw2==""){
                    //showErrorMsg("密码不能为空！");
                    gMessageBox.showTip("密码不能为空！");
                    return false;
                }else if(newPw1.length<6){
                    //showErrorMsg("密码长度不能小于6位！");
                    gMessageBox.showTip("密码长度不能小于6位！");
                    return false;
                }else if(newPw1.length>6){
                    //showErrorMsg("密码长度不能大于6位！");
                    gMessageBox.showTip("密码长度不能大于6位！");
                    return false;
                }else if(newPw1!=newPw2){
                    //showErrorMsg("密码和确认密码不一致！");
                    gMessageBox.showTip("密码和确认密码不一致！");
                    return false;
                }else if(oldPw!=password){
                    //showErrorMsg("原密码不正确！");
                    gMessageBox.showTip("原密码不正确！");
                    return false;
                }
                return true;
            }
            this.subPageInfos = [
                {
                    name:"PIN码",
                    type:"input",
                    getInputInfosFunc:function(){
                        var inputInfos = [
                            {
                                name:"原PIN码：",
                                value:"",
                                type:"input",
                                topdiff:-50,
                                remark:"PIN码必须是"+pinLength+"位",
                                isPassWord:true
                            },
                            {
                                name:"新PIN码：",
                                value:"",
                                type:"input",
                                topdiff:-50,
                                isPassWord:true
                            },
                            {
                                name:"确认PIN码：",
                                value:"",
                                type:"input",
                                topdiff:-50,
                                isPassWord:true
                            }
                        ];
                        return inputInfos;
                    },
                    okButtonFuc:function(items){
                        var orvalue = items[0].value;
                        var newValue1 = items[1].value;
                        var newValue2 = items[2].value;
                        if(checkPinValue(orvalue,newValue1,newValue2)){
                            var result = CA.changePin(-1,orvalue,newValue1);
                            if(result==1){
                                gMessageBox.showTip("保存成功！");
                                //globalAlert.init({"val":"保存成功！","TCB":function(){pageObj.paramSet.cancelBtn()},"timeout":G_BTN_TIMEOUT});
                            }else{
                                gMessageBox.showTip("修改失败");
                                //globalAlert.init({"val":"修改失败","btnInfo":[{"name":"确认","callBack":null}],"timeout":0});
                            }
                        }
                    }
                },
                {
                    name:"管理员密码",
                    type:"input",
                    getInputInfosFunc:function(){
                        var inputInfos = [
                            {
                                name:"原密码：",
                                value:"",
                                type:"input",
                                topdiff:-50,
                                remark:"密码必须是6位",
                                isPassWord:true,
                                inputMaxLen:6
                            },
                            {
                                name:"新密码：",
                                value:"",
                                type:"input",
                                topdiff:-50,
                                isPassWord:true,
                                inputMaxLen:6
                            },
                            {
                                name:"确认密码：",
                                value:"",
                                type:"input",
                                topdiff:-50,
                                isPassWord:true,
                                inputMaxLen:6
                            }
                        ];
                        return inputInfos;
                    },
                    okButtonFuc:function(items){
                        var orvalue = items[0].value;
                        var newValue1 = items[1].value;
                        var newValue2 = items[2].value;
                        if(checkPassWordValue(orvalue,newValue1,newValue2)){
                            var result = SumaJS.access("UserInfo","adminPassword",newValue1+"");
                            if(result==1){
                                gMessageBox.showTip("保存成功！");
                                //globalAlert.init({"val":"保存成功！","TCB":function(){pageObj.paramSet.cancelBtn()},"timeout":G_BTN_TIMEOUT});
                            }else{
                                //globalAlert.init({"val":"修改失败","btnInfo":[{"name":"确认","callBack":null}],"timeout":0});
                                gMessageBox.showTip("修改失败");
                            }
                        }
                    }
                }
            ];
        }));

        function TipsInfo(cfg){
            function log(str){
                LogI("软件升级==="+str);
            }
            var focusPos = 0;
            var tipInfo = (!cfg.tipInfo)? "xxxx":cfg.tipInfo;
            var okButtonFunc = (!cfg.okButtonFunc)? function(){}:cfg.okButtonFunc;
            var dealSystemEventFunc = (!cfg.dealSystemEventFunc)? function(){}:cfg.dealSystemEventFunc;
            function getButton(index){
                return SumaJS.getDom("ue2_sytemset_tip_page_button_"+index);
            }
            function onCreate(){
                var renderConfig = {
                    entry:{
                        type:"div",
                        properties:{
                            id:"ue2_systemset_subpage_main"
                        },
                        childNodes:[
                            {
                                type:"div",
                                properties:{
                                    id:"ue2_sytemset_tip_page_title",
                                    innerHTML:"温馨提示"
                                }
                            },
                            {
                                type:"div",
                                properties:{
                                    id:"ue2_sytemset_tip_page_info",
                                    innerHTML:tipInfo
                                }
                            },
                            {
                                type:"div",
                                properties:{
                                    id:"ue2_sytemset_tip_page_button_0",
                                    innerHTML:"确定"
                                }
                            },
                            {
                                type:"div",
                                properties:{
                                    id:"ue2_sytemset_tip_page_button_1",
                                    innerHTML:"取消"
                                }
                            }
                        ]
                    }
                };
                this.render(renderConfig);
            }
            function onStart(){

            }
            function onDestroy(){

            }
            function onFocus(){
                log(focusPos)
                focusPos = 0;
                getButton(focusPos).style.backgroundImage = "url(images/service_ue/button_bg.png)";
            }
            function onBlur(){
                getButton(focusPos).style.backgroundImage = "";
                //leftList.onFocus();
                leftList.onFocus(leftList.listObj.getIndex());
            }
            function dealKeyEvent(event,isDown){
                var keyCode = event.which;
                log("keyCode="+keyCode);
                if(isDown){
                    if(keyCode == KEY_LEFT){
                        if(focusPos == 0){
                            onBlur();
                        }else{
                            getButton(focusPos).style.backgroundImage = "";
                            focusPos --;
                            getButton(focusPos).style.backgroundImage = "url(images/service_ue/button_bg.png)";
                        }
                    }else if(keyCode == KEY_RIGHT){
                        getButton(focusPos).style.backgroundImage = "";
                        focusPos ++;
                        if(focusPos >1){
                            focusPos = 0;
                        }
                        getButton(focusPos).style.backgroundImage = "url(images/service_ue/button_bg.png)";
                    }else if(keyCode == KEY_ENTER){
                        if(focusPos == 0){
                            okButtonFunc();
                        }else{
                            onBlur();
                        }
                    }else if(keyCode == KEY_BACK || keyCode == KEY_EXIT){
                        onBlur();
                    }
                }

            }
            function dealSystemEvent(event){
                dealSystemEventFunc(event);
                return false;
            }
            return {
                parent:SumaJS.getDom("ue2_systemset_content_1"),
                onCreate: onCreate,
                onStart: onStart,
                onDestroy: onDestroy,
                onFocus:onFocus,
                //onBlur:onBlur,
                dealKeyEvent:dealKeyEvent,
                dealSystemEvent:dealSystemEvent
            };
        }
        subPageMgr.registerModule("软件升级",null,0,new TipsInfo(new function(){
            var tuneFlag = false;
            function doUpgrade() {
                var global_var = SysSetting.getEnv("OTA_GOT_10703");
                if(typeof(global_var)=="string" && global_var=="1"){
                    Upgrade.startLater();
                    setTimeout("Upgrade.start()", 10000);
                    document.onkeypress = function(){};
                    document.onsystemevent = function(){};
                    //globalAlert.init({"val":"机顶盒即将重启并执行OTA升级","timeout":0});
                    gMessageBox.showTip("机顶盒即将重启并执行OTA升级");
                }
                else
                {
                    //globalAlert.init({"val":"暂时没有更新的软件版本","timeout":2000});
                    gMessageBox.showTip("暂时没有更新的软件版本");
                }
            }
            this.tipInfo = "&nbsp&nbsp&nbsp&nbsp机顶盒软件进行升级，升级后主菜单在不进行操作的情况下，15秒后将自动转换到上一次观看的频道。";
            this.okButtonFunc = function(){
                var upgradeFreq = SysSetting.getEnv("UPGRADE_FREQ");
                if (upgradeFreq == "") {
                    //globalAlert.init({"val":"暂时没有更新的软件版本","timeout":2000});
                    gMessageBox.showTip("暂时没有更新的软件版本");
                } else {
                    var upgradeFreqObj = eval("(" + upgradeFreq + ")");
                    DVB.tune(upgradeFreqObj.frequency, upgradeFreqObj.symbolRate, upgradeFreqObj.modulation);
                    tuneFlag = true;
                }
            };
            this.dealSystemEventFunc = function(event){
                var val = event.which;
                switch (val) {
                    case ROC_SYSEVENT_DVB_TUNE_SUCCESS:
                        if (tuneFlag) {
                            tuneFlag = false;
                            doUpgrade();
                        }
                        break;
                    case ROC_SYSEVENT_DVB_TUNE_FAILED:
                        //globalAlert.init({"val":"暂时没有更新的软件版本","timeout":2000});
                        gMessageBox.showTip("暂时没有更新的软件版本");
                        break;
                }
            }
        }));
        subPageMgr.registerModule("恢复出厂设置",null,0,new TipsInfo(new function(){
            function okBtnTimeOut(){
                if(SysSetting.restoreDefault()==1){
                    FileSystem.deleteFile("/storage/storage0/RecChannel.json");
                    FileSystem.deleteDirectory("/storage/storage0/siConfig");
                    var dirObj = FileSystem.createDirectory("/storage/storage0/siConfig");
                    SysSetting.setEnv("OFF_CHANNEL", "");
                    if(dirObj == 0)
                    {
                        //globalAlert.hide();
                        //showErrorMsg("恢复出厂设置发生错误,创建文件夹失败！");
                        gMessageBox.showTip("恢复出厂设置发生错误,创建文件夹失败！");
                        return;
                    }

                    if(typeof dirObj == "object")
                    {
                        ret = FileSystem.killObject(dirObj);
                        if(ret == 0)
                            return;
                    }
                    gMessageBox.showTip("恢复出厂设置成功！");
                    //globalAlert.hide();
                    //setSysMainDefault(G_INFO_DVB_OPER.getGinfoDvb(CA.regionCode));
                    //globalAlert.init({"val":"恢复出厂设置成功","TCB":function(){},"timeout":1000});              /*globalAlert.init({"val":"恢复出厂设置成功，是否进入自动搜索？","btnInfo":[{"name":"确认","callBack":function(){window.location.href = "auto_search.html"}},{"name":"取消","callBack":function(){pageObj.paramSet.cancelBtn()}}],"timeout":0});*/
                    // globalAlert.init({"val":"恢复出厂设置成功！","TCB":function(){pageObj.paramSet.cancelBtn()},"timeout":2000});
                }else{
                    //globalAlert.hide();
                    //showErrorMsg("恢复出厂设置失败！");
                    gMessageBox.showTip("恢复出厂设置失败！");
                }
            }
            this.tipInfo = "&nbsp&nbsp&nbsp&nbsp确认恢复出厂设置，将恢复所有用户自己设置的属性，删除预定节目，恢复管理员密码到默认值。";
            this.okButtonFunc = function() {
                //globalAlert.init({"val":"正在恢复出厂设置,请稍候...","TCB":function(){},"timeout":0});
               // gMessageBox.showTip("正在恢复出厂设置,请稍候...");
               // setTimeout(okBtnTimeOut,300);
                gMessageBox.showPassWordBox(function(){
                    gMessageBox.passwordboxHide();
                    gMessageBox.showTip("正在恢复出厂设置,请稍候...");

                    setTimeout(okBtnTimeOut,300);
                });
            };
            this.dealSystemEventFunc = function(event){

            }
        }));
        subPageMgr.registerModule("WIFI设备管理",null,0,new TipsInfo({
            tipInfo:"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp点击\"确认\"进入WIFI控制页面。",
            okButtonFunc:function(){
                SysSetting.setEnv("firstIndex","1");
                SysSetting.setEnv("secondIndex","4");
                window.location.href = "http://192.168.88.254";
            }
        }));

        function InputList(cfg){
            if(!cfg){
                cfg = {};
            }
            var entry_stuff = !(cfg.entry_stuff)?"":cfg.entry_stuff;
            var buttonTopDiff = !(cfg.buttonTopdiff)?0:cfg.buttonTopdiff;
            var getInputInfos = !(cfg.getInputInfos)?function(){ return[]; }:cfg.getInputInfos;
            var okButtonFuc = !(cfg.okButtonFuc)?function(){ return[]; }:cfg.okButtonFuc;
            var inputInfos = getInputInfos();
            var titleListCallBackWithLostFocus = !(cfg.titleListCallBackWithLostFocus)?null:cfg.titleListCallBackWithLostFocus;
            var isTitleListSubPage = !(cfg.isTitleListSubPage && titleListCallBackWithLostFocus)?false:cfg.isTitleListSubPage;
            var sublistcfg = null;
            var sublist = null;
            var gSelectBotton = null;
            var gInputButton = null;
            var canShowFocus = false;
            var KEY_AREA_INPUTLIST = 0;
            var KEY_AREA_BUTTON = 1;
            var KEY_AREA_SELECTBUTTON = 2;
            var KEY_AREA_INPUTBUTTON = 3;
            var KEY_AREA = KEY_AREA_INPUTLIST;
            var buttonFocusPos = 0;
            var haveDataChage = false;
            function getButton(index){
                return SumaJS.getDom("ue2_sytemset_tip_page_button_"+index);
            }
            function log(str){
                LogI("InputList==="+str);
            }
            function updateData(){
                inputInfos = getInputInfos();
                for(var i=0;i<inputInfos.length;i++) {
                    sublistcfg.items[i] = inputInfos[i];
                }
            }
            function onCreate(){
                log("onCreate");
                function makeInputItem(index){
                    return {
                        type:"div",
                        properties:{
                            className:"ue2_systemset_input_base_item",
                            id:"ue2_systemset_input_base_item_"+index
                        },
                        childNodes:[
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_input_name",
                                    id:"ue2_systemset_input_name_item_"+i,
                                    innerHTML:"姜浩"
                                },
                                styles:{
                                    top:(60+92*index+inputInfos[index].topdiff)+"px",
                                    textAlign : "justify",
                                    textJustify :"inter-ideograph"

                                }
                            },
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_input_select",
                                    id:"ue2_systemset_input_select_item_"+index
                                },
                                styles:{
                                    top:(22+92*index+inputInfos[index].topdiff)+"px"
                                },
                                childNodes:[
                                    {
                                        type:"div",
                                        properties:{
                                            className:"ue2_systemset_input_select_txt",
                                            id:"ue2_systemset_input_select_txt_item_"+index
                                        },
                                        styles:{
                                            top:(40)+"px"
                                        }
                                    }
                                ]
                            },
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_input_select_remark",
                                    id:"ue2_systemset_input_select_remark_"+index
                                },
                                styles:{
                                    top:(60+92*index+inputInfos[index].topdiff)+"px"
                                }
                            }
                        ]
                    }
                }

                var renderConfig = {
                    entry:{
                        type:"div",
                        properties:{
                            id:"ue2_systemset_subpage_main"+entry_stuff
                        },
                        childNodes:[
                            {
                                type:"div",
                                properties:{
                                    id:"ue2_systemset_subpage_list"

                                },
                                childNodes:[
                                    {
                                        type:"div",
                                        properties:{
                                            //className:"ue2_systemset_subpage_list_item",
                                            id:"ue2_systemset_input_focus"
                                        }
                                    },
                                    {
                                        type:"div",
                                        properties:{
                                            id:"ue2_sytemset_tip_page_button_0",
                                            innerHTML:"确定"
                                        },
                                        styles:{
                                            top:(368+buttonTopDiff)+"px"
                                        }
                                    },
                                    {
                                        type:"div",
                                        properties:{
                                            id:"ue2_sytemset_tip_page_button_1",
                                            innerHTML:"取消"
                                        },
                                        styles:{
                                            top:(368+buttonTopDiff)+"px"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                };
                for(var i=0;i<inputInfos.length;i++){
                    renderConfig.entry.childNodes[0].childNodes[i+3] = makeInputItem(i);
                }
                this.render(renderConfig);
            }
            function onStart(){
                function checkItemType(index,type){
                    return inputInfos[index].type && (inputInfos[index].type == type)
                }
                canShowFocus = false;
                KEY_AREA = KEY_AREA_INPUTLIST;
                inputInfos = getInputInfos();
                sublistcfg = {
                    index:0,
                    items:[],
                    pageSize:inputInfos.length,
                    uiObj:{
                        nameArray:[],
                        inputArray:[],
                        inputTxtArry:[],
                        remarkArray:[],
                        focusDom:SumaJS.getDom("ue2_systemset_input_focus")
                    },
                    showData : function(dataObj, uiObj, lastFocusPos, focusPos, isUpdate) {
                        if(isUpdate){
                            for(var i=0;i<uiObj.nameArray.length;i++) {
                                if (dataObj && dataObj[i]){
                                    uiObj.nameArray[i].innerHTML = dataObj[i].name;
                                    uiObj.inputTxtArry[i].innerHTML = dataObj[i].value;
                                    uiObj.remarkArray[i].innerHTML = dataObj[i].remark?dataObj[i].remark:"";
                                }else{
                                    uiObj.nameArray[i].innerHTML = "";
                                }
                            }
                        }
                        if(canShowFocus) {
                            if (lastFocusPos != -1) {
                                if(checkItemType(lastFocusPos, "input")){
                                    uiObj.inputArray[lastFocusPos].style.backgroundImage = "url(images/service_ue/input.png)";
                                }else {
                                    uiObj.inputArray[lastFocusPos].style.backgroundImage = "url(images/service_ue/select.png)";
                                }
                            }
                            if(checkItemType(focusPos, "input")){
                                uiObj.inputArray[focusPos].style.backgroundImage = "url(images/service_ue/input_focus.png)";
                                KEY_AREA = KEY_AREA_INPUTBUTTON;
                                gInputButton = new InputButton({
                                    txtDomId:"ue2_systemset_input_select_txt_item_"+focusPos,
                                    txtItem:dataObj[focusPos],
                                    isPassWord:dataObj[focusPos].isPassWord,
                                    inputMaxLen:dataObj[focusPos].inputMaxLen
                                })
                            }else {
                                uiObj.inputArray[focusPos].style.backgroundImage = "url(images/service_ue/select_focus.png)";
                            }
                        }
                    },
                    onFocusLeaveSubList:function(subItems, uiObj, focusPos){
                        //uiObj.focusDom.style.display = "none";
                        if(checkItemType(focusPos,"input")){
                            uiObj.inputArray[focusPos].style.backgroundImage = "url(images/service_ue/input.png)";
                        }else {
                            uiObj.inputArray[focusPos].style.backgroundImage = "url(images/service_ue/select.png)";
                        }
                    }
                };
                for(var i=0;i<sublistcfg.pageSize;i++){
                    sublistcfg.uiObj.nameArray[i] = SumaJS.getDom("ue2_systemset_input_name_item_"+i);
                    sublistcfg.uiObj.inputArray[i] = SumaJS.getDom("ue2_systemset_input_select_item_"+i);
                    sublistcfg.uiObj.inputTxtArry[i] = SumaJS.getDom("ue2_systemset_input_select_txt_item_"+i);
                    sublistcfg.uiObj.remarkArray[i] = SumaJS.getDom("ue2_systemset_input_select_remark_"+i);
                    sublistcfg.items[i] = inputInfos[i];
                    if(checkItemType(i, "input")){
                        sublistcfg.uiObj.inputArray[i].style.backgroundImage = "url(images/service_ue/input.png)";
                    }
                }
                sublist = new SubList(sublistcfg);
                sublist.resetData(sublistcfg);
            }
            function onDestroy(){

            }
            function onFocus(){
                canShowFocus = true;
                sublist.uiObj.focusDom.style.display = "block";
                KEY_AREA = KEY_AREA_INPUTLIST;
                updateData();
                sublist.resetData(sublistcfg);
            }
            function onBlur(){
                sublist.focusLeaveSubList();
                if(!isTitleListSubPage) {
                    //leftList.onFocus();
                    leftList.onFocus(leftList.listObj.getIndex());
                }
            }
            function dealKeyInInputListArea(event,isDown){
                function onSelect(index){
                    KEY_AREA = KEY_AREA_INPUTLIST;
                    sublistcfg.uiObj.inputArray[sublist.getIndex()].style.backgroundImage = "url(images/service_ue/select_focus.png)";
                    if(index == -1){
                        return;
                    }
                    haveDataChage = true;
                    sublist.getItem().value = sublist.getItem().extend_itmes[index];
                    sublistcfg.index = sublist.getIndex();
                    sublist.resetData(sublistcfg);
                    if(inputInfos[sublist.getIndex()].onSelect){
                        inputInfos[sublist.getIndex()].onSelect(index);
                    }

                }
                var keyCode = event.which;
                if(isDown){
                    if(keyCode == KEY_DOWN){
                        if(sublist.isFocusAtLastItem() && haveDataChage){
                            sublist.focusLeaveSubList();
                            KEY_AREA = KEY_AREA_BUTTON;
                            buttonFocusPos = 0;
                            getButton(buttonFocusPos).style.backgroundImage = "url(images/service_ue/button_bg.png)";
                        }else {
                            sublist.down();
                        }
                        return false;
                    }else if(keyCode == KEY_UP){
                        sublist.up();
                        return false;
                    }else if(keyCode == KEY_LEFT){
                        if(!isTitleListSubPage) {
                            onBlur();
                        }
                        return false;
                    }else if(keyCode == KEY_ENTER){
                        if(sublist.getItem().type == "input"){
                            return false;
                        }
                        sublistcfg.uiObj.inputArray[sublist.getIndex()].style.backgroundImage = "";
                        gSelectBotton = new SelectButton({
                            parentId:"ue2_systemset_input_base_item_0",
                            onSelectCallBack:onSelect,
                            top:inputInfos[sublist.getIndex()].extend_top,
                            left:inputInfos[sublist.getIndex()].extend_left
                        });
                        gSelectBotton.init(sublist.getItem().value,inputInfos[sublist.getIndex()].extend_itmes);
                        KEY_AREA = KEY_AREA_SELECTBUTTON;
                        return false;
                    }else if(keyCode == KEY_BACK || keyCode == KEY_EXIT){
                        if(!isTitleListSubPage) {
                            onBlur();
                        }
                        return false;
                    }
                }
            }
            function dealKeyInButtonArea(event,isDown){
                var keyCode = event.which;
                if(isDown) {
                    if (keyCode == KEY_LEFT) {
                        getButton(buttonFocusPos).style.backgroundImage = "";
                        buttonFocusPos--;
                        if (buttonFocusPos < 0) {
                            buttonFocusPos = 1;
                        }
                        getButton(buttonFocusPos).style.backgroundImage = "url(images/service_ue/button_bg.png)";
                        return false;
                    } else if (keyCode == KEY_RIGHT) {
                        getButton(buttonFocusPos).style.backgroundImage = "";
                        buttonFocusPos++;
                        if (buttonFocusPos > 1) {
                            buttonFocusPos = 0;
                        }
                        getButton(buttonFocusPos).style.backgroundImage = "url(images/service_ue/button_bg.png)";
                        return false;
                    }else if(keyCode == KEY_UP){
                        onFocus();
                        haveDataChage = false;
                        getButton(buttonFocusPos).style.backgroundImage = "";
                        return false;
                    }else if(keyCode == KEY_ENTER){
                        if(buttonFocusPos == 0) {
                            okButtonFuc(sublist.getItems());
                        }
                        haveDataChage = false;
                        onFocus();
                        getButton(buttonFocusPos).style.backgroundImage = "";
                        if(isTitleListSubPage) {
                            titleListCallBackWithLostFocus();
                        }
                        return false;
                    }else if(keyCode == KEY_BACK || keyCode == KEY_EXIT) {
                        if (!isTitleListSubPage) {
                            onBlur();
                        }
                    }
                }
            }
            function dealKeyEvent(event,isDown){
                var keyCode = event.which;
                log("keyCode="+keyCode);
                if(KEY_AREA == KEY_AREA_INPUTLIST){
                    return dealKeyInInputListArea(event,isDown);
                }else if(KEY_AREA == KEY_AREA_BUTTON){
                    return dealKeyInButtonArea(event,isDown);
                }else if(KEY_AREA == KEY_AREA_SELECTBUTTON){
                    if(gSelectBotton) {
                        return gSelectBotton.dealKeyEvent(event, isDown);
                    }else{
                        return false;
                    }
                }else if(KEY_AREA == KEY_AREA_INPUTBUTTON){
                    if(keyCode == KEY_UP || keyCode == KEY_DOWN || keyCode == KEY_LEFT || keyCode == KEY_RIGHT){
                        KEY_AREA = KEY_AREA_INPUTLIST;
                        dealKeyInInputListArea(event,isDown);
                        return false;
                    }else{
                        if(gInputButton.dealKeyEvent(event,isDown) == false){
                            haveDataChage = true;
                        }
                        return false;
                    }
                }

            }
            function canDealKey(event,isDown){
                var keyCode = event.which;
                if((KEY_AREA == KEY_AREA_INPUTBUTTON) && (keyCode == KEY_BACK || keyCode == KEY_LEFT || keyCode == KEY_RIGHT)
                    && sublist.getItem().value.length == 0){
                    return false;
                }
                if((KEY_AREA == KEY_AREA_INPUTBUTTON) && (keyCode == KEY_LEFT || keyCode == KEY_RIGHT) && !haveDataChage && isTitleListSubPage){
                    return false;
                }
                if((KEY_AREA == KEY_AREA_BUTTON) && (keyCode == KEY_BACK || keyCode == KEY_EXIT) && isTitleListSubPage){
                    return false;
                }
                return true;
            }
            return {
                parent:typeof(cfg.parent) != "undefined" ? cfg.parent:SumaJS.getDom("ue2_systemset_content_1"),
                onCreate: onCreate,
                onStart: onStart,
                onDestroy: onDestroy,
                onFocus:onFocus,
                onBlur:onBlur,
                dealKeyEvent:dealKeyEvent,
                canDealKey:canDealKey
            };
        }
        subPageMgr.registerModule("音视频设置",null,0,new InputList(new function(){
            var videoModes = [{key:"NTSC",value:"NTSC"},{key:"PAL",value:"PAL"},{key:"SECAM",value:"SECAM"},{key:"RGB",value:"RGB"}];
            //var videoScanModes =[{key:"576i",value:"576i"},{key:"576p",value:"576p"},{key:"720p",value:"720p"},{key:"1080i",value:"1080i"},{key:"1080p",value:"1080p"}];
            var videoScanModes =[{key:"576i",value:"576i"},{key:"576p",value:"576p"},{key:"720p",value:"720p"},{key:"1080i",value:"1080i"},{key:"1080p",value:"1080p"},{key:"2160p",value:"2160p"}];
            var soundModes = [{key:"立体音",value:"stereo"},{key:"混音",value:"mix"},{key:"单左声道",value:"left"},{key:"单右声道",value:"right"}];
            var spdifModes = [{key:"默认",value:"Default"},{key:"原信号",value:"ORIGINAL"},{key:"解码信号",value:"PCM"},{key:"关闭",value:"OFF"}];
            function getKeyByValue(src,value){
                for(var i=0;i<src.length;i++){
                    if(src[i].value == value){
                        return src[i].key;
                    }
                }
                //return "null";
                return src[0].key;
            }
            function getKeys(src){
                var ret = [];
                for(var i=0;i<src.length;i++){
                    ret.push(src[i].key);
                }
                return ret;
            }
            function getValueByKey(src,key){
                for(var i=0;i<src.length;i++){
                    if(src[i].key == key){
                        return src[i].value;
                    }
                }
                //return "null";
                return src[0].value;
            }
            this.getInputInfos = function() {


                var inputInfos = [
                    {
                        name: "制式：",
                        extend_top: 48,
                        extend_left: 332,
                        topdiff: 0
                    },
                    {
                        name: "分辨率：",
                        extend_top: 141,
                        extend_left: 332,
                        topdiff: 0
                    },
                    {
                        name: "伴音通道模式：",
                        extend_top: 233,
                        extend_left: 332,
                        topdiff: 0
                    },
                    {
                        name: "数字音频：",
                        extend_top: 325,
                        extend_left: 332,
                        topdiff: 0
                    }
                ];
                var videoMode =  SumaJS.access("MediaSetting","videoMode");
                var videoScanMode =  SumaJS.access("MediaSetting","videoScanMode");
                var soundMode = SumaJS.access("MediaSetting","soundMode");
                var spdifMode = SumaJS.access("MediaSetting","spdifMode");
                inputInfos[0].value = getKeyByValue(videoModes,videoMode);
                inputInfos[1].value = getKeyByValue(videoScanModes,videoScanMode);
                inputInfos[2].value = getKeyByValue(soundModes,soundMode);
                inputInfos[3].value = getKeyByValue(spdifModes,spdifMode);
                inputInfos[0].extend_itmes = getKeys(videoModes);
                inputInfos[1].extend_itmes = getKeys(videoScanModes);
                inputInfos[2].extend_itmes = getKeys(soundModes);
                inputInfos[3].extend_itmes = getKeys(spdifModes);
                return inputInfos;
            };
            this.okButtonFuc = function(items){
                if( SumaJS.access("MediaSetting","videoMode",getValueByKey(videoModes,items[0].value))&&
                    SumaJS.access("MediaSetting","videoScanMode",getValueByKey(videoScanModes,items[1].value))&&
                    SumaJS.access("MediaSetting","soundMode",getValueByKey(soundModes,items[2].value))&&
                    SumaJS.access("MediaSetting","spdifMode",getValueByKey(spdifModes,items[3].value)))
                {
                    gMessageBox.showTip("保存成功！");
                    DataCollection.collectData(["10",getValueByKey(videoModes,items[0].value),getValueByKey(videoScanModes,items[1].value),getValueByKey(soundModes,items[2].value),getValueByKey(spdifModes,items[3].value)]);
                    // globalAlert.init({"val":"保存成功！","TCB":function(){pageObj.paramSet.cancelBtn()},"timeout":G_BTN_TIMEOUT});
                }else{
                    // globalAlert.init({"val":"修改失败","btnInfo":[{"name":"确认","callBack":null}],"timeout":0});
                    gMessageBox.showTip("修改失败");
                }
            }
        }));
        subPageMgr.registerModule("待机设置",null,0,new InputList({
            getInputInfos:function() {
                var inputInfos = [
                    {
                        name: "夜间自动待机：",
                        value:"xj",
                        topdiff: 92,
                        extend_top: 141,
                        extend_left: 332,
                        extend_itmes: ["是", "否"],
                        onSelect:function(index){
                        }
                    }
                ];

                var sleepMode =  1;
                var sleepCfg = JSON.parse(readFile('/storage/storage0/sleepcfg.json', 1));
                if (sleepCfg && !sleepCfg.isActive) {
                    sleepMode =  0;
                }
                inputInfos[0].value = sleepMode == 1?"是":"否";

                if(isSTBHasWIFI()){
                    inputInfos[1] = {
                        name: "待机时启用wifi：",
                        value:"xj",
                        topdiff: 92,
                        extend_top: 233,
                        extend_left: 332,
                        extend_itmes: ["是", "否"],
                        onSelect:function(index){
                        }
                    };
                    var hibernateMode = SumaJS.access("SysInfo", "HibernationMode");
                    inputInfos[1].value = hibernateMode == 1?"是":"否";
                }

                return inputInfos;
            },
            okButtonFuc:function(items){
                saveJSONFile("/storage/storage0/sleepcfg.json", {isActive: items[0].value == "是"?1:0}, 1);
                if(isSTBHasWIFI()){
                    DataCollection.collectData(["14",items[0].value == "是"?1:0,items[1].value == "是"?1:0]);
                    SumaJS.access("SysInfo", "HibernationMode", "" + items[1].value == "是"?1:0);
                }
                gMessageBox.showTip("保存成功！");
            }
        }));
        subPageMgr.registerModule("系统音量设置",null,0,new InputList(new function() {
            function getKeyByValue(src,value){
                for(var i=0;i<src.length;i++){
                    if(src[i].value == value){
                        return src[i].key;
                    }
                }
                return "null";
            }
            function getKeys(src){
                var ret = [];
                for(var i=0;i<src.length;i++){
                    ret.push(src[i].key);
                }
                return ret;
            }
            function getValueByKey(src,key){
                for(var i=0;i<src.length;i++){
                    if(src[i].key == key){
                        return src[i].value;
                    }
                }
                return "null";
            }
            function checkValue(value){
                    if(!(/^\d{1,2}$/.test(value)&&parseInt(value,10)<=32)){
                        //showErrorMsg("请输入正确的统一音量值！");
                        gMessageBox.showTip("请输入正确的统一音量值！");
                        return false;
                    }
                return true;
            }
            var enalbeValue = [{key:"是",value:"1"},{key:"否",value:"0"}];
            this.getInputInfos = function() {
                var inputInfos = [
                    {
                        name: "音量统一控制：",
                        extend_top: 141,
                        extend_left: 332,
                        topdiff: 92
                    },
                    {
                        name: "统一音量值：",
                        type: "input",
                        topdiff: 92,
                        remark:"请输入0-32的整数",
                        inputMaxLen:2
                    }
                ];
                var globalVolumnBoolean = SumaJS.access("MediaSetting", "enableGlobalVolumn");
                var QamName4Val = SumaJS.access("VodApp","QAMName4");
                inputInfos[0].value = getKeyByValue(enalbeValue,globalVolumnBoolean);
                inputInfos[1].value = QamName4Val;
                inputInfos[0].extend_itmes = getKeys(enalbeValue);
                return inputInfos;
            };
            this.okButtonFuc = function(items){
                var value = items[1].value;
                var enable = getValueByKey(enalbeValue,items[0].value);
                if(checkValue(value)){
                    if(SumaJS.access("MediaSetting", "enableGlobalVolumn",enable)
                        && SumaJS.access("VodApp","QAMName4",value)){
                        DataCollection.collectData(["12",enable,parseInt(enable)? value:"-1"]);
                        //globalAlert.init({"val":"保存成功","btnInfo":[{"name":"确认","callBack":function(){pageObj.paramSet.cancelBtn()}}],"timeout":0});
                        gMessageBox.showTip("保存成功");
                    }else{
                        //globalAlert.init({"val":"修改失败","btnInfo":[{"name":"确认","callBack":null}],"timeout":0});
                        gMessageBox.showTip("修改失败");
                    }
                }
            }
        }));
        subPageMgr.registerModule("菜单属性",null,0,new InputList(new function(){
            function getKeyByValue(src,value){
                for(var i=0;i<src.length;i++){
                    if(src[i].value == value){
                        return src[i].key;
                    }
                }
                return "null";
            }
            function getKeys(src){
                var ret = [];
                for(var i=0;i<src.length;i++){
                    ret.push(src[i].key);
                }
                return ret;
            }
            function getValueByKey(src,key){
                for(var i=0;i<src.length;i++){
                    if(src[i].key == key){
                        return src[i].value;
                    }
                }
                return "null";
            }
            function checkOSDValue (value){
                if(!(/^\d{2,3}$/.test(value)&&parseInt(value,10)>=30&&parseInt(value,10)<=100)){
                    //showErrorMsg("输入的OSD层透明度信息不正确！");
                    gMessageBox.showTip("输入的OSD层透明度信息不正确！");
                    return false;
                }
                return true;
            }
            var cursorSounds = [{key:"是",value:"1"},{key:"否",value:"0"}];
            var lanuages = [{key:"中文",value:"china"}];
            this.getInputInfos = function(){
                var inputInfos = [
                    {
                        name:"OSD层透明度：",
                        type:"input",
                        topdiff:45,
                        remark:"请输入30至100的整数",
                        inputMaxLen:3
                    },
                    {
                        name:"语言选择：",
                        extend_top: 186,
                        extend_left: 332,
                        topdiff:45
                    },
                    {
                        name:"开启按键声音：",
                        extend_top: 278,
                        extend_left: 332,
                        topdiff:45
                    }
                ];
                var osdVal = SumaJS.access("MediaSetting","OSDAlpha");
                var cursorSoundVal = SumaJS.access("MediaSetting","CursorSound");
                inputInfos[0].value = osdVal;
                inputInfos[1].value = getKeyByValue(lanuages,"china");
                inputInfos[2].value = getKeyByValue(cursorSounds,cursorSoundVal);
                inputInfos[1].extend_itmes = getKeys(lanuages);
                inputInfos[2].extend_itmes = getKeys(cursorSounds);
                return inputInfos;
            };
            this.okButtonFuc = function(items){
                var osdValue = items[0].value;
                if(checkOSDValue(osdValue)){
                    if(SumaJS.access("MediaSetting","CursorSound",getValueByKey(cursorSounds,items[2].value)) && SumaJS.access("MediaSetting","OSDAlpha",osdValue)){
                        DataCollection.collectData(["11",osdValue,getValueByKey(cursorSounds,items[2].value)]);
                        //globalAlert.init({"val":"保存成功","TCB":function(){pageObj.paramSet.cancelBtn()},"timeout":G_BTN_TIMEOUT});
                        gMessageBox.showTip("保存成功");
                    }else{
                        //globalAlert.init({"val":"修改失败","btnInfo":[{"name":"确认","callBack":null}],"timeout":0});
                        gMessageBox.showTip("修改失败");
                    }

                }
            }
        }));


        function AppList(cfg){
            function log(str){
                LogI("xxx==="+str);
            }
            var sublistcfg = null;
            var sublist = null;
            var appInfos = null;
            var startAppFunc = (!cfg.startApp)?function(){}:cfg.startApp;
            var stopAppFunc = (!cfg.stopApp)?function(){}:cfg.stopApp;
            var stopCheckFunc = (!cfg.stopCheck)?function(){}:cfg.stopCheck;
            var isFocus = false;
            var focusIndex = 0;
            var FOCUS_LIST = 0;
            var FOCUS_BOTTOM = 1;
            var FOCUS_AREA = FOCUS_LIST;
            function changeFocus(top,left,type){
                var dom = SumaJS.getDom("ue2_systemset_subpage_applist_item_focus");
                if(type == "list"){
                    dom.style.backgroundImage = "url(images/service_ue/applist_focus.png)";
                }else if(type == "bottom"){
                    dom.style.backgroundImage = "url(images/service_ue/button_bg.png)";
                }else{
                    dom.style.backgroundImage = "";
                }

                dom.style.top = top+"px";
                dom.style.left = left+"px";
            }
            function resetList(){
                appInfos = cfg.getAppInfos();
                sublistcfg.items = appInfos;
                sublistcfg.index = sublist.getIndex();
                sublist.resetData(sublistcfg);
            }
            function onCreate(){
                function makeListTitle(index){
                    return {
                        type:"div",
                        properties:{
                            className:"ue2_systemset_subpage_applist_item",
                            id:"ue2_systemset_subpage_applist_item_"+index
                        },
                        styles:{
                            top:(46)+"px",
                            left:(40)+"px"
                        },
                        childNodes:[
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_subpage_applist_subitem_0",
                                    id:"ue2_systemset_subpage_applist_subitem_0_"+index,
                                    innerHTML:"名称"
                                },
                                styles:{
                                    top:(0)+"px"

                                }
                            },
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_subpage_applist_subitem_1",
                                    id:"ue2_systemset_subpage_applist_subitem_1_"+index,
                                    innerHTML:"状态"
                                },
                                styles:{
                                    top:(0)+"px"

                                }
                            },
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_subpage_applist_subitem_2",
                                    id:"ue2_systemset_subpage_applist_subitem_2_"+index,
                                    innerHTML:"应用类型"
                                },
                                styles:{
                                    top:(0)+"px"

                                }
                            },
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_subpage_applist_subitem_3",
                                    id:"ue2_systemset_subpage_applist_subitem_3_"+index,
                                    innerHTML:"版本"
                                },
                                styles:{
                                    top:(0)+"px"

                                }
                            },
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_subpage_applist_subitem_3",
                                    id:"ue2_systemset_subpage_applist_subitem_4_"+index,
                                    innerHTML:"操作"
                                },
                                styles:{
                                    top:(0)+"px",
                                    left:640+"px"

                                }
                            }

                        ]
                    }
                }
                function makeListItem(index){
                    return {
                        type:"div",
                        properties:{
                            className:"ue2_systemset_subpage_applist_item",
                            id:"ue2_systemset_subpage_applist_item_"+index
                        },
                        styles:{
                            top:(46+46+46*index)+"px",
                            left:(40)+"px"
                        },
                        childNodes:[
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_subpage_applist_subitem_0",
                                    id:"ue2_systemset_subpage_applist_subitem_0_"+index
                                },
                                styles:{
                                    top:(0)+"px"
                                }
                            },
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_subpage_applist_subitem_1",
                                    id:"ue2_systemset_subpage_applist_subitem_1_"+index
                                },
                                styles:{
                                    top:(0)+"px"
                                }
                            },
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_subpage_applist_subitem_2",
                                    id:"ue2_systemset_subpage_applist_subitem_2_"+index
                                },
                                styles:{
                                    top:(0)+"px"
                                }
                            },
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_subpage_applist_subitem_3",
                                    id:"ue2_systemset_subpage_applist_subitem_3_"+index
                                },
                                styles:{
                                    top:(0)+"px"
                                }
                            },
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_subpage_applist_button_0",
                                    id:"ue2_systemset_subpage_applist_button_0_"+index,
                                    innerHTML:"启动"
                                },
                                styles:{
                                    top:(0)+"px"
                                }
                            },
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_subpage_applist_button_1",
                                    id:"ue2_systemset_subpage_applist_button_1_"+index,
                                    innerHTML:"停止"
                                },
                                styles:{
                                    top:(0)+"px"
                                }
                            }
                        ]
                    }
                }
                function makeListHr(index){
                    return {
                        type:"div",
                        properties:{
                            className:"ue2_systemset_subpage_list_hr",
                            id:"ue2_systemset_subpage_list_hr_item_"+i
                        },
                        styles:{
                            top:(46+46+20+46*index)+"px",
                            left:(40)+"px"
                        }
                    }
                }
                var renderConfig = {
                    entry:{
                        type:"div",
                        properties:{
                            id:"ue2_systemset_subpage_main"
                        },
                        childNodes:[
                            {
                                type:"div",
                                properties:{
                                    id:"ue2_systemset_subpage_list"

                                },
                                childNodes:[
                                    {
                                        type:"div",
                                        properties:{
                                            //className:"ue2_systemset_subpage_list_item",
                                            id:"ue2_systemset_subpage_list_focus"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                };
                renderConfig.entry.childNodes[0].childNodes[0] = makeListTitle(8);
                renderConfig.entry.childNodes[0].childNodes[1] = {
                    type:"div",
                    properties:{
                        className:"ue2_systemset_subpage_list_hr",
                        id:"ue2_systemset_subpage_list_hr_item_"+8
                    },
                    styles:{
                        top:(46+20)+"px",
                        left:(40)+"px"
                    }
                };
                for(var i=0;i<7;i++){
                    renderConfig.entry.childNodes[0].childNodes[2+2*(i)] = makeListItem(i);
                    renderConfig.entry.childNodes[0].childNodes[3+2*(i)] = makeListHr(i);
                }
                renderConfig.entry.childNodes[0].childNodes[16] = {
                    type:"div",
                    properties:{
                        className:"ue2_systemset_subpage_applist_bottom",
                        id:"ue2_systemset_subpage_applist_bottom_item_0",
                        innerHTML:"停止检查"
                    }
                };
                renderConfig.entry.childNodes[0].childNodes[17] = {
                    type:"div",
                    properties:{
                        className:"ue2_systemset_subpage_applist_bottom",
                        id:"ue2_systemset_subpage_applist_bottom_item_1",
                        innerHTML:"上一页"
                    }
                };
                renderConfig.entry.childNodes[0].childNodes[18] = {
                    type:"div",
                    properties:{
                        className:"ue2_systemset_subpage_applist_bottom",
                        id:"ue2_systemset_subpage_applist_bottom_item_2",
                        innerHTML:"下一页"
                    }
                };
                renderConfig.entry.childNodes[0].childNodes[19] = {
                    type:"div",
                    properties:{
                        //className:"ue2_systemset_subpage_applist_bottom",
                        id:"ue2_systemset_subpage_applist_item_focus"
                    }
                };
                this.render(renderConfig);
            }
            function onStart(){
                appInfos = cfg.getAppInfos();
                sublistcfg = {
                    type:1,
                    index:0,
                    items:!appInfos?[]:appInfos,
                    pageSize:7,
                    uiObj:{
                        nameArray:[],
                        stateArray:[],
                        typeArray:[],
                        versionArray:[],
                        button0Array:[],
                        button1Array:[],
                        focusDom:SumaJS.getDom("ue2_systemset_subpage_applist_item_focus")
                    },
                    showData : function(dataObj, uiObj, lastFocusPos, focusPos, isUpdate) {
                        if(isUpdate){
                            for(var i=0;i<uiObj.nameArray.length;i++) {
                                if (dataObj && dataObj[i]){
                                    uiObj.nameArray[i].innerHTML = displayText(dataObj[i].name,160,20);
                                    uiObj.stateArray[i].innerHTML = dataObj[i].state;
                                    uiObj.typeArray[i].innerHTML = dataObj[i].type;
                                    uiObj.versionArray[i].innerHTML = dataObj[i].version;
                                    uiObj.button0Array[i].style.display = "block";
                                    uiObj.button1Array[i].style.display = "block";
                                }else{
                                    uiObj.nameArray[i].innerHTML = "";
                                    uiObj.button0Array[i].style.display = "none";
                                    uiObj.button1Array[i].style.display = "none";
                                }
                            }
                        }
                        if(isFocus) {
                            changeFocus(57+46*focusPos,652+focusIndex*70,"list");
                        }
                    },
                    onFocusLeaveSubList:function(subItems, uiObj, focusPos){
                        isFocus = false;
                        changeFocus(0,0,"");
                    }
                };
                for(var i=0;i<sublistcfg.pageSize;i++){
                    sublistcfg.uiObj.nameArray[i] = SumaJS.getDom("ue2_systemset_subpage_applist_subitem_0_"+i);
                    sublistcfg.uiObj.stateArray[i] = SumaJS.getDom("ue2_systemset_subpage_applist_subitem_1_"+i);
                    sublistcfg.uiObj.typeArray[i] = SumaJS.getDom("ue2_systemset_subpage_applist_subitem_2_"+i);
                    sublistcfg.uiObj.versionArray[i] = SumaJS.getDom("ue2_systemset_subpage_applist_subitem_3_"+i);
                    sublistcfg.uiObj.button0Array[i] = SumaJS.getDom("ue2_systemset_subpage_applist_button_0_"+i);
                    sublistcfg.uiObj.button1Array[i] = SumaJS.getDom("ue2_systemset_subpage_applist_button_1_"+i);
                }
                sublist = new SubList(sublistcfg);
                sublist.resetData(sublistcfg);
            }
            function onDestroy(){

            }
            function onFocus(){
                isFocus = true;
                FOCUS_AREA = FOCUS_LIST;
                focusIndex = 0;
                sublist.resetData(sublistcfg);
            }
            function onBlur(){
                sublist.focusLeaveSubList();
                //leftList.onFocus();
                leftList.onFocus(leftList.listObj.getIndex());
            }
            function dealKeyEvent(event,isDown){
                var keyCode = event.which;
                log("keyCode="+keyCode);
                if(isDown){
                    if(FOCUS_AREA == FOCUS_LIST){
                        if(keyCode == KEY_LEFT){
                            focusIndex -- ;
                            if(focusIndex < 0){
                                onBlur();
                            }else{
                                sublistcfg.index = sublist.getIndex();
                                sublist.resetData(sublistcfg);
                            }
                        }else if(keyCode == KEY_RIGHT){
                            focusIndex++;
                            if(focusIndex > 1){
                                focusIndex = 0;
                            }
                            sublistcfg.index = sublist.getIndex();
                            sublist.resetData(sublistcfg);
                        }else if(keyCode == KEY_DOWN){
                            if(sublist.isFocusAtLastItemOfCurrentPage()){
                                FOCUS_AREA = FOCUS_BOTTOM;
                                focusIndex = 0;
                                changeFocus(393,150,"bottom");
                            }else {
                                sublist.down();
                            }
                        }else if(keyCode == KEY_UP){
                            if(sublist.getIndex() != 0) {
                                sublist.up();
                            }
                        }else if(keyCode == KEY_ENTER){
                            if(focusIndex == 0){
                                startAppFunc(appInfos[sublist.getIndex()]);
                            }else if(focusIndex == 1){
                                stopAppFunc(appInfos[sublist.getIndex()]);
                            }
                        }else if(keyCode == KEY_BACK || keyCode == KEY_EXIT){
                            onBlur();
                        }
                    }else if(FOCUS_AREA == FOCUS_BOTTOM){
                        if(keyCode == KEY_UP){
                            FOCUS_AREA = FOCUS_LIST;
                            focusIndex = 0;
                            sublistcfg.index = sublist.getIndex();
                            sublist.resetData(sublistcfg);
                        }else if(keyCode == KEY_RIGHT){
                            focusIndex++;
                            if(focusIndex > 2){
                                focusIndex = 0;
                            }
                            changeFocus(393,150+150*focusIndex,"bottom");
                        }else if(keyCode == KEY_LEFT){
                            focusIndex--;
                            if(focusIndex < 0){
                                focusIndex = 2;
                            }
                            changeFocus(393,150+150*focusIndex,"bottom");
                        }else if(keyCode == KEY_ENTER){
                            if(focusIndex == 0){
                                stopCheckFunc();
                            }else if(focusIndex == 1){
                                FOCUS_AREA = FOCUS_LIST;
                                focusIndex = 0;
                                sublist.pageUp();
                            }else if(focusIndex == 2){
                                FOCUS_AREA = FOCUS_LIST;
                                focusIndex = 0;
                                sublist.pageDown();
                            }
                        }else if(keyCode == KEY_BACK || keyCode == KEY_EXIT){
                            onBlur();
                        }
                    }
                    return false;
                }

            }
            function dealSystemEvent(event){
                //消息处理函数直接移植，仅修改打印函数
                function page_systemevent_handler(event){
                    var val = event.which;
                    var jsonString = SysSetting.getEventInfo(event.modifiers);
                    var jsonObj;
                    LogI("====onsystemevent=== which["+event.which+"], type["+event.type+"], jsonString["+jsonString+"]");
                    switch(val)
                    {
                        case AppManager_APPLICATION_START: //下载消息
                            eval("jsonObj="+jsonString);
                            if(jsonObj.actionStatus == "succeed")
                            {
                                //alert("启动成功！");
                                LogI("========xml download succeed!!=====");
                            }else if(jsonObj.actionStatus == "failed"){
                                //alert("启动失败！");
                                gMessageBox.showTip("启动失败！");
                                LogI("========xml download failed!!=====");
                            }
                            resetList();
                            break;
                        case AppManager_APPLICATION_UNINSTALL:
                            eval("jsonObj="+jsonString);
                            LogI("========xml uninstall "+jsonObj.actionStatus+"!=====");
                            if(jsonObj.actionStatus == "succeed")
                            {
                                //alert("卸载成功！");
                                gMessageBox.showTip("卸载成功！");
                            }else if(jsonObj.actionStatus == "failed"){
                                //alert("卸载失败！");
                                gMessageBox.showTip("卸载失败！");
                            }
                            resetList();
                            break;
                        case AppManager_APPLICATION_STOP:
                            eval("jsonObj="+jsonString);
                            if(jsonObj.actionStatus == "succeed")
                            {
                                //alert("停止成功！");
                                gMessageBox.showTip("停止成功！");
                            }else if(jsonObj.actionStatus == "failed"){
                                //alert("停止失败！");
                                gMessageBox.showTip("停止失败！");
                            }
                            resetList();
                            break;
                        case 11901:
                            var deployType = DataAccess.getInfo("Autodeployer","type");
                            //alert("deployType:"+deployType);
                            if(deployType == "oc" || deployType == "auto-oc")
                            {
                                if(confirm("检测到应用列表已更新，需要立刻升级")){
                                    //tempArea = focusArea;
                                    //focusArea = FOCUS_UPDATE;
                                    //$("confirm_step_div").style.visibility = "visible";
                                    //$("confirm_step_content").innerHTML = "升级中请勿做任何操作,请勿断电."
                                    Autodeployer.startDeploy();
                                    //升级后要隐藏信息
                                }else{
                                    Autodeployer.cancelDeploy();
                                }

                            }else{
                                //alert("检测到应用列表已更新，后台升级中！");
                                gMessageBox.showTip("检测到应用列表已更新，后台升级中！");
                            }
                            break;
                        case 11902:
                            if(confirm("应用部署完成,是否查看应用")){
                                location.href = "appMan1.html";
                            }else{

                            }
                            break;
                        case 11903:
                            //alert("应用部署失败");
                            gMessageBox.showTip("应用部署失败");
                            window.location.reload();
                            //focusArea = focusArea;
                            //$("confirm_step_div").style.visibility = "hidden";
                            //$("confirm_step_content").innerHTML = ""
                            break;
                    }
                }
                page_systemevent_handler(event);
            }
            return {
                parent:SumaJS.getDom("ue2_systemset_content_1"),
                onCreate: onCreate,
                onStart: onStart,
                onDestroy: onDestroy,
                onFocus:onFocus,
                //onBlur:onBlur,
                dealKeyEvent:dealKeyEvent,
                dealSystemEvent:dealSystemEvent
            };
        }
        subPageMgr.registerModule("应用管理列表",null,0, new AppList({
            getAppInfos:function(){
                var APPLICATIONS = AppManager.getApplications("null");
                return APPLICATIONS;
            },
            startApp:function(app){
                AppManager.startApp(app.orgId,app.appId,"");
            },
            stopApp:function(app){
                AppManager.stopApp(app.orgId, app.appId);
            },
            stopCheck:function(){
                Autodeployer.stop(0);
            }
        }));

        function CAInfo(cfg){
            var subPageInfos = cfg.subPageInfos;
            var subPageTypeList = {};
            var titleLabel = [];
            for(var i=0;i<subPageInfos.length;i++){
                titleLabel[i] = subPageInfos[i].name;
                subPageTypeList[subPageInfos[i].name] = subPageInfos[i].type;
            }
            var curTitleLabel = "";
            var curSubPage = null;
            var isDealKeyInSubPage = false;
            var titleListCfg = null;
            var titleList = null;
            var canFocus = false;

            function log(str){
                LogI("CAInfo==="+str);
            }
            function onCreate(){
                log("onCreate");
                function makeTitleItem(index){
                    return {
                        type:"div",
                        properties:{
                            className:"ue2_systemset_subpage_title_list_title_item",
                            id:"ue2_systemset_subpage_title_list_title_item_"+index
                        },
                        styles:{
                            left:(0+160*index)+"px"
                        }
                    }
                }

                var renderConfig = {
                    entry:{
                        type:"div",
                        properties:{
                            id:"ue2_systemset_subpage_main"
                        },
                        childNodes:[
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_subpage_title_list",
                                    id:"ue2_systemset_subpage_title_list_title"
                                },
                                childNodes:[]
                            },
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_subpage_title_list",
                                    id:"ue2_systemset_subpage_title_list_focus_line"
                                },
                                childNodes:[
                                    {
                                        type:"div",
                                        properties:{
                                            id:"ue2_systemset_subpage_title_list_focus_line_focus"
                                        }
                                    }
                                ]
                            },
                            {
                                type:"img",
                                properties:{
                                    //className:"ue2_systemset_subpage_list_item",
                                    id:"ue2_systemset_subpage_list_focus",
                                    src:"images/service_ue/base_info_focus.png"
                                },
                                styles:{
                                    top:(115)+"px"
                                }

                            },
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_subpage_title_list",
                                    id:"ue2_systemset_subpage_title_list_infolist"
                                },
                                childNodes:[
                                ]
                            }
                        ]
                    }
                };

                for(var i=0;i<5;i++){
                    renderConfig.entry.childNodes[0].childNodes[i] = makeTitleItem(i);
                }

                this.render(renderConfig);
            }
            function titleListCallBackWithLostFocus(){
                isDealKeyInSubPage = false;
            }
            function onStart(){
                for(var i=0;i<subPageInfos.length;i++) {
                    if (subPageInfos[i].type == "list") {
                        subPageMgr.registerModule(titleLabel[i], null, 1, new InfoList({
                            parent: SumaJS.getDom("ue2_systemset_subpage_title_list_infolist"),
                            items:subPageInfos[i].items,
                            getItemsInfoFunc:subPageInfos[i].getItemsInfoFunc,
                            entry_stuff: "_innter",
                            pageSize: subPageInfos[i].pageSize,
                            leftdiff:-40,
                            topdiff:0,
                            focusTopdiff:108,
                            isTitleListSubPage:true,
                            titleListCallBackWithLostFocus:titleListCallBackWithLostFocus
                        }));
                    }else if(subPageInfos[i].type == "input"){
                        subPageMgr.registerModule(titleLabel[i], null, 1, new InputList({
                            parent: SumaJS.getDom("ue2_systemset_subpage_title_list_infolist"),
                            entry_stuff: "_innter",
                            getInputInfos:subPageInfos[i].getInputInfosFunc,
                            okButtonFuc:subPageInfos[i].okButtonFuc,
                            buttonTopdiff:-100,
                            isTitleListSubPage:true,
                            titleListCallBackWithLostFocus:titleListCallBackWithLostFocus
                        }));
                    }else if(subPageInfos[i].type == "calist"){
                        subPageMgr.registerModule(titleLabel[i], null, 1,new CAInfoSubList({
                            parent: SumaJS.getDom("ue2_systemset_subpage_title_list_infolist"),
                            entry_stuff: "_innter",
                            showpage_title:subPageInfos[i].showPageTitle,
                            showpage_titlenames:subPageInfos[i].showPageTitleNames,
                            showpage_titlenamesclass:subPageInfos[i].showPageTitleNamesClass,
                            items:subPageInfos[i].items,
                            getItemsFunc:subPageInfos[i].getItemsFunc
                        }));
                    }else if(subPageInfos[i].type == "timeset"){
                        subPageMgr.registerModule(titleLabel[i], null, 1, new TimesetList({
                            parent: SumaJS.getDom("ue2_systemset_subpage_title_list_infolist"),
                            entry_stuff: "_innter",
                            getInputInfos:subPageInfos[i].getInputInfosFunc,
                            okButtonFuc:subPageInfos[i].okButtonFuc,
                            buttonTopdiff:-100,
                            isTitleListSubPage:true,
                            titleListCallBackWithLostFocus:titleListCallBackWithLostFocus,
                            getTimeSetInfosFunc:subPageInfos[i].getTimeSetInfosFunc
                        }));
                    }
                }
                titleListCfg = {
                    index:0,
                    items:titleLabel,
                    pageSize:5,
                    uiObj:{
                        nameArray:[],
                        focusDom:SumaJS.getDom("ue2_systemset_subpage_title_list_focus_line_focus")
                    },
                    showData : function(dataObj, uiObj, lastFocusPos, focusPos, isUpdate) {
                        if(isUpdate){
                            for(var i=0;i<uiObj.nameArray.length;i++) {
                                if (dataObj && dataObj[i]){
                                    uiObj.nameArray[i].innerHTML = dataObj[i];
                                }else{
                                    uiObj.nameArray[i].innerHTML = "";
                                }
                            }
                        }
                        uiObj.focusDom.style.left = (80+160*focusPos)+"px";
                        curTitleLabel = titleLabel[focusPos];
                        subPageMgr.loadMode(curTitleLabel, true);
                        if(canFocus) {
                            if(curSubPage){
                                curSubPage.data.onBlur();
                            }
                            if (lastFocusPos != -1) {
                                uiObj.nameArray[lastFocusPos].style.color = "#d2dce6";
                                uiObj.nameArray[lastFocusPos].style.fontSize = "20px";
                            }
                            uiObj.nameArray[focusPos].style.color = "#ffffff";
                            uiObj.nameArray[focusPos].style.fontSize = "22px";
                            curSubPage = subPageMgr.getModuleByName(curTitleLabel);
                            // var type = subPageTypeList[curSubPage.name];
                            curSubPage.data.onFocus();
                        }
                    },
                    onFocusLeaveSubList:function(subItems, uiObj, focusPos){
                        uiObj.nameArray[focusPos].style.color = "#d2dce6";
                        uiObj.nameArray[focusPos].style.fontSize = "20px";
                        log(curSubPage.name);
                        curSubPage.data.onBlur();
                    }
                };
                for(var i=0;i<titleListCfg.pageSize;i++){
                    titleListCfg.uiObj.nameArray[i] = SumaJS.getDom("ue2_systemset_subpage_title_list_title_item_"+i);
                }
                titleList = new SubList(titleListCfg);
                titleList.resetData(titleListCfg);

            }
            function onDestroy(){

            }
            function onFocus(){
                canFocus = true;
                titleList.resetData(titleListCfg);
            }
            function onBlur(){
                canFocus = false;
                titleList.focusLeaveSubList();
                //leftList.onFocus();
                leftList.onFocus(leftList.listObj.getIndex());
            }

            function dealKeyEvent(event,isDown){
                var keyCode = event.which;
                var subPageType = subPageTypeList[curSubPage.name];
                log("keyCode="+keyCode+" isDealInSubPage="+isDealKeyInSubPage+" type="+subPageType);
                if(isDown){
                    if(subPageType == "list") {
                        if (keyCode == KEY_LEFT) {
                            if (titleList.getIndex() == 0) {
                                onBlur();
                            } else {
                                titleList.up();
                            }

                        } else if (keyCode == KEY_RIGHT) {
                            titleList.down();
                        } else if (keyCode == KEY_UP || keyCode == KEY_DOWN) {
                            curSubPage.data.dealKeyEvent(event, isDown);
                        }else if(keyCode == KEY_BACK || keyCode == KEY_EXIT){
                            onBlur();
                        }
                    }else if(subPageType == "input"){
                        if(curSubPage.data.canDealKey && !curSubPage.data.canDealKey(event,isDown)) {
                            isDealKeyInSubPage = false;
                        }
                        if(isDealKeyInSubPage){
                            curSubPage.data.dealKeyEvent(event,isDown);
                        }else{
                            if (keyCode == KEY_LEFT) {
                                if (titleList.getIndex() == 0) {
                                    onBlur();
                                } else {
                                    titleList.up();
                                }

                            } else if (keyCode == KEY_RIGHT) {
                                titleList.down();
                            } else if (keyCode == KEY_UP || keyCode == KEY_DOWN ) {
                                curSubPage.data.dealKeyEvent(event, isDown);
                            } else if(keyCode == KEY_BACK || keyCode == KEY_NUM0 || keyCode == KEY_NUM1 || keyCode == KEY_NUM2 || keyCode == KEY_NUM3 || keyCode == KEY_NUM4
                                || keyCode == KEY_NUM5 || keyCode == KEY_NUM6 || keyCode == KEY_NUM7 || keyCode == KEY_NUM8 || keyCode == KEY_NUM9) {
                                if(curSubPage.data.canDealKey && curSubPage.data.canDealKey(event,isDown)) {
                                    isDealKeyInSubPage = true;
                                    curSubPage.data.dealKeyEvent(event, isDown);
                                }else{
                                    if(keyCode == KEY_BACK){
                                        titleList.resetData(titleListCfg);
                                        onBlur();
                                    }
                                }
                            }else if(keyCode == KEY_ENTER){
                                //isDealKeyInSubPage = true;
                                //curSubPage.data.dealKeyEvent(event, isDown);
                            }else if(keyCode == KEY_BACK || keyCode == KEY_EXIT){
                                titleList.resetData(titleListCfg);
                                onBlur();
                            }
                        }
                    }else if(subPageType == "calist"){
                        if( curSubPage.data.dealKeyEvent(event, isDown) != false) {
                            if (keyCode == KEY_LEFT) {
                                if (titleList.getIndex() == 0) {
                                    onBlur();
                                } else {
                                    titleList.up();
                                }

                            } else if (keyCode == KEY_RIGHT) {
                                titleList.down();
                            }else if(keyCode == KEY_BACK || keyCode ==KEY_EXIT){
                                titleList.resetData(titleListCfg);
                                onBlur();
                            }
                        }
                    }else if(subPageType == "timeset"){
                        if(curSubPage.data.dealKeyEvent(event, isDown) != false){
                            if (keyCode == KEY_LEFT) {
                                if (titleList.getIndex() == 0) {
                                    onBlur();
                                } else {
                                    titleList.up();
                                }

                            } else if (keyCode == KEY_RIGHT) {
                                titleList.down();
                            }else if(keyCode == KEY_BACK || keyCode ==KEY_EXIT){
                                titleList.resetData(titleListCfg);
                                onBlur();
                            }

                        }
                    }
                }
            }
            return {
                parent:SumaJS.getDom("ue2_systemset_content_1"),
                onCreate: onCreate,
                onStart: onStart,
                onDestroy: onDestroy,
                onFocus:onFocus,
                //onBlur:onBlur,
                dealKeyEvent:dealKeyEvent
            };
        }
        function CAShowPage(cfg){
            function _makeInfoAdapter(strs,className){
                var len = strs.length;
                var ret = "";
                for(var i=0;i<len;i++){
                    ret +="<div class='"+className+"' id='"+(className+"_"+i)+"'>"+strs[i]+"</div>"
                }
                return ret;
            }
            var title = cfg.title;
            var notifyHideFunc = (!cfg.notifyHideFunc)?function(){}:cfg.notifyHideFunc;
            var self = this;
            var showPage = SumaJS.getDom("ue2_systemset_subpage_calist_showpage");
            var titleDom = SumaJS.getDom("ue2_systemset_subpage_calist_showpage_title");
            var titleNamesDom = SumaJS.getDom("ue2_systemset_subpage_calist_showpage_names");
            var module = null;
            var infoListcfg = {
                parent:SumaJS.getDom("ue2_systemset_subpage_calist_showpage_content"),
                pageSize:7,
                items:[]
            };
            this.init = function(id){
                //FIXME:目前处于方便，在此写死
                if(title == "钱包信息"){
                    var wallets = CA.getWallets(id);
                    if(null==wallets||wallets.length<1){
                        gMessageBox.showTip("未找到钱包信息！");
                        //globalAlert.init({"val":"未找到钱包信息！","btnInfo":[{"name":"确认","callBack":function(){backToMain()}}],"timeout":0});
                        return false;
                    }
                    for(var i=0;i<wallets.length;i++){
                        var strs = [];
                        strs.push(wallets[i].ID+"");
                        strs.push(wallets[i].balance+"");
                        strs.push(wallets[i].remainder+"");
                        infoListcfg.items[i] = _makeInfoAdapter(strs,cfg.titlenamesclass);
                    }
                }else if(title == "授权信息"){
                    var entitles = CA.getEntitles(id);
                    if(null==entitles||entitles.length<1){
                        gMessageBox.showTip("未找到授权信息！");
                        //globalAlert.init({"val":"未找到授权信息！","btnInfo":[{"name":"确认","callBack":function(){backToMain()}}],"timeout":0});
                        return false;
                    }
                    for(var i=0;i<entitles.length;i++){
                        var strs = [];
                        strs.push(entitles[i].productID+"");
                        strs.push(entitles[i].productName+"");
                        strs.push(entitles[i].startTime+"");
                        strs.push(entitles[i].endTime+"");
                        infoListcfg.items[i] = _makeInfoAdapter(strs,cfg.titlenamesclass);
                    }
                }
                subPageMgr.registerModule(title,null,2, new InfoList(infoListcfg));
            };
            this.show = function(){
                titleDom.innerHTML = title;
                titleNamesDom.innerHTML = _makeInfoAdapter(cfg.titlenames,cfg.titlenamesclass);
                showPage.style.display = "block";
                subPageMgr.loadMode(title,true);
                module = subPageMgr.getModuleByName(title);
                if(module){
                    module.data.onFocus();
                }
            };
            this.hide = function(){
                subPageMgr.destroyyLastPage();
                showPage.style.display = "none";
                notifyHideFunc();
            };

            this.dealKeyEvent = function(event,isDown){
                if(module){
                    module.data.dealKeyEvent(event,isDown);
                }
                return false;
            }
        }
        function CAInfoSubList(cfg){
            var pageSize = 6;
            var topdiff = 46;
            var focusTopdiff = 154;
            var leftdiff = -40;
            var entry_stuff = "_inner";
            var sublistcfg = null;
            var sublist = null;
            var isFocus = false;
            var isShowPageEnable = false;
            var showPage = null;
            var items = (!cfg.items)?[]:cfg.items;
            var getItemsFunc = cfg.getItemsFunc;
            function _makeInfoAdapter(str1,str2){
                var ret="";
                var space1_len=100;
                var space2_len=400;
                /*for(var i=0;i<space1_len;i++){
                    ret +="&nbsp";
                }
                ret +=str1;
                for(var i=0;i<space2_len;i++){
                    ret +="&nbsp";
                }
                ret +=str2;*/
                ret ="<div style=\"position:absolute;top;0;left:"+space1_len+"px;\">"+str1+"</div>"+"<div style=\"position:absolute;top;0;left:"+space2_len+"px;\">"+str2+"</div>";
                return ret;

            }
            function onCreate(){
                function makeListItem(index){
                    return {
                        type:"div",
                        properties:{
                            className:"ue2_systemset_subpage_list_item",
                            id:"ue2_systemset_subpage_list_item_"+index
                        },
                        styles:{
                            top:(46+46*index+topdiff)+"px",
                            left:(40+leftdiff)+"px"
                        }
                    }
                }
                function makeListHr(index){
                    return {
                        type:"div",
                        properties:{
                            className:"ue2_systemset_subpage_list_hr",
                            id:"ue2_systemset_subpage_list_hr_item_"+index
                        },
                        styles:{
                            top:(46+20+46*index+topdiff)+"px",
                            left:(40+leftdiff)+"px"
                        }
                    }
                }
                var renderConfig = {
                    entry:{
                        type:"div",
                        properties:{
                            id:"ue2_systemset_subpage_main"+entry_stuff
                        },
                        childNodes:[
                            {
                                type:"div",
                                properties:{
                                    id:"ue2_systemset_subpage_list"

                                },
                                childNodes:[
                                    {
                                        type:"div",
                                        properties:{
                                            //className:"ue2_systemset_subpage_list_item",
                                            id:"ue2_systemset_subpage_list_focus"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                };
                renderConfig.entry.childNodes[0].childNodes[1] = makeListItem(-1);
                renderConfig.entry.childNodes[0].childNodes[2] = makeListHr(-1);
                for(var i=0;i<pageSize;i++){
                    renderConfig.entry.childNodes[0].childNodes[3+2*(i)] = makeListItem(i);
                    renderConfig.entry.childNodes[0].childNodes[4+2*(i)] = makeListHr(i);
                }
                this.render(renderConfig);
            }
            function onStart(){
                if(getItemsFunc){
                    items = getItemsFunc();
                }
                SumaJS.getDom("ue2_systemset_subpage_list_item_-1").innerHTML = _makeInfoAdapter("运营商ID","运营商名称");
                showPage = new CAShowPage({
                    title:cfg.showpage_title,
                    titlenames:cfg.showpage_titlenames,
                    titlenamesclass:cfg.showpage_titlenamesclass
                });
                sublistcfg = {
                    index:0,
                    items:items,
                    pageSize:pageSize,
                    uiObj:{
                        nameArray:[],
                        focusDom:SumaJS.getDom("ue2_systemset_subpage_list_focus")
                    },
                    showData : function(dataObj, uiObj, lastFocusPos, focusPos, isUpdate) {
                        if(isUpdate){
                            for(var i=0;i<uiObj.nameArray.length;i++) {
                                if (dataObj && dataObj[i]){
                                    uiObj.nameArray[i].innerHTML = _makeInfoAdapter(dataObj[i].ID, dataObj[i].name);
                                }else{
                                    uiObj.nameArray[i].innerHTML = "";
                                }
                            }
                        }
                        //uiObj.focusDom.style.display = "block";
                        gScrollBarMgr.show(items.length,0);
                        if(isFocus) {
                            if (lastFocusPos != -1) {
                                uiObj.nameArray[lastFocusPos].style.fontSize = "20px";
                                uiObj.nameArray[lastFocusPos].style.color = "#d2dce6";
                            }
                            if(focusPos != -1) {
                                uiObj.nameArray[focusPos].style.fontSize = "22px";
                                uiObj.nameArray[focusPos].style.color = "#ffffff";
                                uiObj.focusDom.style.top = (6 + 46 * focusPos + focusTopdiff) + "px";
                                gScrollBarMgr.show(items.length,sublist.getIndex());
                            }
                        }
                    },
                    onFocusLeaveSubList:function(subItems, uiObj, focusPos){
                        if(focusPos != -1) {
                            uiObj.nameArray[focusPos].style.fontSize = "20px";
                            uiObj.nameArray[focusPos].style.color = "#d2dce6";
                        }
                        uiObj.focusDom.style.display = "none";

                        isFocus = false;
                    },
                    onSelect:function(item,index){
                        if(showPage.init(item.ID) != false){
                            isShowPageEnable = true;
                            showPage.show();
                        }

                    }
                };
                for(var i=0;i<sublistcfg.pageSize;i++){
                    sublistcfg.uiObj.nameArray[i] = SumaJS.getDom("ue2_systemset_subpage_list_item_"+i);
                }
                sublist = new SubList(sublistcfg);
                sublist.resetData(sublistcfg);
            }
            function onDestroy(){}
            function onFocus(){
                isFocus = true;
                sublist.uiObj.focusDom.style.top = (6 +  focusTopdiff) + "px";
                if(items.length > 0) {
                    sublist.uiObj.focusDom.style.display = "block";
                    sublist.uiObj.nameArray[0].style.fontSize = "22px";
                    sublist.uiObj.nameArray[0].style.color = "#ffffff";
                }
            }
            function onBlur(){
                sublist.focusLeaveSubList();
            }
            function dealKeyEvent(event,isDown){
                var keyCode = event.which;
                if(isDown) {
                    if(isShowPageEnable){
                        if(keyCode == KEY_BACK){
                            showPage.hide();
                            isShowPageEnable = false;
                            return false;
                        }else if(keyCode == KEY_UP){
                            showPage.dealKeyEvent(event,isDown);
                            return false;
                        }else if(keyCode == KEY_DOWN){
                            showPage.dealKeyEvent(event,isDown);
                            return false;
                        }else if(keyCode == KEY_LEFT){
                            return false;
                        }else if(keyCode == KEY_RIGHT){
                            return false;
                        }
                    }else {
                        if (keyCode == KEY_UP) {
                            sublist.up();
                            return false;
                        } else if (keyCode == KEY_DOWN) {
                            sublist.down();
                            return false;
                        } else if (keyCode == KEY_ENTER) {
                            sublist.select();
                            return false;
                        }
                    }
                }
            }
            return {
                parent:cfg.parent,
                onCreate: onCreate,
                onStart: onStart,
                onDestroy: onDestroy,
                onFocus:onFocus,
                onBlur:onBlur,
                dealKeyEvent:dealKeyEvent
            };
        }
        function TimesetList(cfg){
            if(!cfg){
                cfg = {};
            }
            var entry_stuff = !(cfg.entry_stuff)?"":cfg.entry_stuff;
            var buttonTopDiff = !(cfg.buttonTopdiff)?0:cfg.buttonTopdiff;
            var getInputInfos = !(cfg.getInputInfos)?function(){ return[]; }:cfg.getInputInfos;
            var okButtonFuc = !(cfg.okButtonFuc)?function(){ return[]; }:cfg.okButtonFuc;
            var getTimeSetInfos = !(cfg.getTimeSetInfosFunc)?function(){ return[]; }:cfg.getTimeSetInfosFunc;
            var inputInfos = getInputInfos();
            var timesetInfos = getTimeSetInfos();
            var titleListCallBackWithLostFocus = !(cfg.titleListCallBackWithLostFocus)?null:cfg.titleListCallBackWithLostFocus;
            var isTitleListSubPage = !(cfg.isTitleListSubPage && titleListCallBackWithLostFocus)?false:cfg.isTitleListSubPage;
            var sublistcfg = null;
            var sublist = null;
            var timesetlistcfg = null;
            var timesetlist = null;
            var gSelectBotton = null;
            var gInputButton = null;
            var canShowFocus = false;
            var KEY_AREA_INPUTLIST = 0;
            var KEY_AREA_BUTTON = 1;
            var KEY_AREA_SELECTBUTTON = 2;
            var KEY_AREA_INPUTBUTTON = 3;
            var KEY_AREA_TIMESET = 4;
            var KEY_AREA = KEY_AREA_TIMESET;
            var buttonFocusPos = 0;
            var haveDataChage = false;
            function getButton(index){
                return SumaJS.getDom("ue2_sytemset_tip_page_button_"+index);
            }
            function log(str){
                LogI("InputList==="+str);
            }
            function num2str(num){
                var ret = "";
                if(num <10){
                    ret += "0";
                }
                return ret+num;
            }
            function updateData(){
                inputInfos = getInputInfos();
                for(var i=0;i<inputInfos.length;i++) {
                    sublistcfg.items[i] = inputInfos[i];
                }
            }
            function updateTimeSetData(){
                timesetInfos = getTimeSetInfos();
                for(var i=0;i<timesetInfos.length;i++) {
                    timesetlistcfg.items[i] = timesetInfos[i];
                }
            }
            function onCreate(){
                log("onCreate");
                function makeInputItem(index){
                    return {
                        type:"div",
                        properties:{
                            className:"ue2_systemset_input_base_item",
                            id:"ue2_systemset_input_base_item_"+index
                        },
                        childNodes:[
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_input_name",
                                    id:"ue2_systemset_input_name_item_"+i,
                                    innerHTML:"姜浩"
                                },
                                styles:{
                                    top:(60+92*index+inputInfos[index].topdiff)+"px",
                                    textAlign : "justify",
                                    textJustify :"inter-ideograph"

                                }
                            },
                            {
                                type:"div",
                                properties:{
                                    className:"ue2_systemset_input_select",
                                    id:"ue2_systemset_input_select_item_"+index
                                },
                                styles:{
                                    top:(22+92*index+inputInfos[index].topdiff)+"px"
                                },
                                childNodes:[
                                    {
                                        type:"div",
                                        properties:{
                                            className:"ue2_systemset_input_select_txt",
                                            id:"ue2_systemset_input_select_txt_item_"+index
                                        },
                                        styles:{
                                            top:(40)+"px"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }

                var renderConfig = {
                    entry:{
                        type:"div",
                        properties:{
                            id:"ue2_systemset_subpage_main"+entry_stuff
                        },
                        childNodes:[
                            {
                                type:"div",
                                properties:{
                                    id:"ue2_systemset_subpage_list"

                                },
                                childNodes:[
                                    {
                                        type:"div",
                                        properties:{
                                            //className:"ue2_systemset_subpage_list_item",
                                            id:"ue2_systemset_input_focus"
                                        }
                                    },
                                    {
                                        type:"div",
                                        properties:{
                                            id:"ue2_sytemset_tip_page_button_0",
                                            innerHTML:"确定"
                                        },
                                        styles:{
                                            top:(368+buttonTopDiff)+"px"
                                        }
                                    },
                                    {
                                        type:"div",
                                        properties:{
                                            id:"ue2_sytemset_tip_page_button_1",
                                            innerHTML:"取消"
                                        },
                                        styles:{
                                            top:(368+buttonTopDiff)+"px"
                                        }
                                    },
                                    {
                                        type:"div",
                                        properties:{
                                            className:"ue2_sytemset_timeset_timeinput"
                                        },
                                        styles:{
                                            top:(30)+"px"
                                        },
                                        childNodes:[
                                            {
                                                type:"div",
                                                properties:{
                                                    id:"ue2_sytemset_timeset_timeinput_name",
                                                    innerHTML:"工作时段:"
                                                }
                                            },
                                            {
                                                type:"div",
                                                properties:{
                                                    className:"ue2_sytemset_timeset_timeinput_item",
                                                    id:"ue2_sytemset_timeset_timeinput_item_0"
                                                }
                                            },
                                            {
                                                type:"div",
                                                properties: {
                                                    className: "ue2_sytemset_timeset_timeinput_item",
                                                    id: "ue2_sytemset_timeset_timeinput_item_1"
                                                }
                                            },
                                            {
                                                type:"div",
                                                properties:{
                                                    className:"ue2_sytemset_timeset_timeinput_item",
                                                    id:"ue2_sytemset_timeset_timeinput_item_2"
                                                }
                                            },
                                            {
                                                type:"div",
                                                properties:{
                                                    className:"ue2_sytemset_timeset_timeinput_item",
                                                    id:"ue2_sytemset_timeset_timeinput_item_3"
                                                }
                                            },
                                            {
                                                type:"div",
                                                properties:{
                                                    className:"ue2_sytemset_timeset_timeinput_item",
                                                    id:"ue2_sytemset_timeset_timeinput_item_4",
                                                    innerHTML:":"
                                                }
                                            },
                                            {
                                                type:"div",
                                                properties:{
                                                    className:"ue2_sytemset_timeset_timeinput_item",
                                                    id:"ue2_sytemset_timeset_timeinput_item_5",
                                                    innerHTML:"——"
                                                }
                                            },
                                            {
                                                type:"div",
                                                properties:{
                                                    className:"ue2_sytemset_timeset_timeinput_item",
                                                    id:"ue2_sytemset_timeset_timeinput_item_6",
                                                    innerHTML:":"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                };
                for(var i=0;i<inputInfos.length;i++){
                    renderConfig.entry.childNodes[0].childNodes[i+4] = makeInputItem(i);
                }
                this.render(renderConfig);
            }
            function onStart(){
                function checkItemType(index,type){
                    return inputInfos[index].type && (inputInfos[index].type == type)
                }
                canShowFocus = false;
                KEY_AREA = KEY_AREA_TIMESET;
                inputInfos = getInputInfos();
                timesetlistcfg = {
                    index:0,
                    items:[num2str(0),num2str(0),num2str(0),num2str(0)],
                    pageSize:4,
                    uiObj:{
                       nameArray:[]
                    },
                    showData : function(dataObj, uiObj, lastFocusPos, focusPos, isUpdate) {
                        if(isUpdate){
                            for(var i=0;i<uiObj.nameArray.length;i++) {
                                if (dataObj && dataObj[i]){
                                    uiObj.nameArray[i].innerHTML = dataObj[i];
                                }else{
                                    uiObj.nameArray[i].innerHTML = "";
                                }
                            }
                        }
                        if(canShowFocus) {
                            if(lastFocusPos != -1){
                                uiObj.nameArray[lastFocusPos].style.fontSize = "20px";
                                uiObj.nameArray[lastFocusPos].style.color = "#d2dce6";
                                uiObj.nameArray[lastFocusPos].style.backgroundImage = "url(images/service_ue/work_time_set.png)";
                            }
                            uiObj.nameArray[focusPos].style.fontSize = "22px";
                            uiObj.nameArray[focusPos].style.color = "#ffffff";
                            uiObj.nameArray[focusPos].style.backgroundImage = "url(images/service_ue/work_time_set_focus.png)";
                        }
                    },
                    onFocusLeaveSubList:function(subItems, uiObj, focusPos){
                        uiObj.nameArray[focusPos].style.fontSize = "20px";
                        uiObj.nameArray[focusPos].style.color = "#d2dce6";
                        uiObj.nameArray[focusPos].style.backgroundImage = "url(images/service_ue/work_time_set.png)";
                    }
                };
                for(var i=0;i<timesetlistcfg.pageSize;i++){
                    timesetlistcfg.uiObj.nameArray[i] = SumaJS.getDom("ue2_sytemset_timeset_timeinput_item_"+i);
                    timesetlistcfg.items[i] = timesetInfos[i];
                }
                timesetlist = new SubList(timesetlistcfg);
                timesetlist.resetData(timesetlistcfg);

                sublistcfg = {
                    index:0,
                    items:[],
                    pageSize:inputInfos.length,
                    uiObj:{
                        nameArray:[],
                        inputArray:[],
                        inputTxtArry:[],
                        focusDom:SumaJS.getDom("ue2_systemset_input_focus")
                    },
                    showData : function(dataObj, uiObj, lastFocusPos, focusPos, isUpdate) {
                        if(isUpdate){
                            for(var i=0;i<uiObj.nameArray.length;i++) {
                                if (dataObj && dataObj[i]){
                                    uiObj.nameArray[i].innerHTML = dataObj[i].name;
                                    uiObj.inputTxtArry[i].innerHTML = dataObj[i].value;
                                }else{
                                    uiObj.nameArray[i].innerHTML = "";
                                }
                            }
                        }
                        if(canShowFocus) {
                            if (lastFocusPos != -1) {
                                if(checkItemType(lastFocusPos, "input")){
                                    uiObj.inputArray[lastFocusPos].style.backgroundImage = "url(images/service_ue/input.png)";
                                }else {
                                    uiObj.inputArray[lastFocusPos].style.backgroundImage = "url(images/service_ue/select.png)";
                                }
                            }
                            if(checkItemType(focusPos, "input")){
                                uiObj.inputArray[focusPos].style.backgroundImage = "url(images/service_ue/input_focus.png)";
                                KEY_AREA = KEY_AREA_INPUTBUTTON;
                                gInputButton = new InputButton({
                                    txtDomId:"ue2_systemset_input_select_txt_item_"+focusPos,
                                    txtItem:dataObj[focusPos],
                                    isPassWord:dataObj[focusPos].isPassWord,
                                    inputMaxLen:dataObj[focusPos].inputMaxLen
                                })
                            }else {
                                uiObj.inputArray[focusPos].style.backgroundImage = "url(images/service_ue/select_focus.png)";
                            }
                        }
                    },
                    onFocusLeaveSubList:function(subItems, uiObj, focusPos){
                        //uiObj.focusDom.style.display = "none";
                        if(checkItemType(focusPos,"input")){
                            uiObj.inputArray[focusPos].style.backgroundImage = "url(images/service_ue/input.png)";
                        }else {
                            uiObj.inputArray[focusPos].style.backgroundImage = "url(images/service_ue/select.png)";
                        }
                    }
                };
                for(var i=0;i<sublistcfg.pageSize;i++){
                    sublistcfg.uiObj.nameArray[i] = SumaJS.getDom("ue2_systemset_input_name_item_"+i);
                    sublistcfg.uiObj.inputArray[i] = SumaJS.getDom("ue2_systemset_input_select_item_"+i);
                    sublistcfg.uiObj.inputTxtArry[i] = SumaJS.getDom("ue2_systemset_input_select_txt_item_"+i);
                    sublistcfg.items[i] = inputInfos[i];
                    if(checkItemType(i, "input")){
                        sublistcfg.uiObj.inputArray[i].style.backgroundImage = "url(images/service_ue/input.png)";
                    }
                }
                sublist = new SubList(sublistcfg);
                sublist.resetData(sublistcfg);
            }
            function onDestroy(){

            }
            function onFocus(){
                canShowFocus = true;
                KEY_AREA = KEY_AREA_TIMESET;
                updateTimeSetData();
                timesetlist.resetData(timesetlistcfg);
            }
            function onBlur(){
                timesetlist.focusLeaveSubList();
                sublist.focusLeaveSubList();
                if(!isTitleListSubPage) {
                    //leftList.onFocus();
                    leftList.onFocus(leftList.listObj.getIndex());
                }
            }
            function dealKeyInInputListArea(event,isDown){
                function onSelect(index){
                    KEY_AREA = KEY_AREA_INPUTLIST;
                    if(index == -1){
                        return;
                    }
                    haveDataChage = true;
                    sublist.getItem().value = sublist.getItem().extend_itmes[index];
                    sublistcfg.index = sublist.getIndex();
                    sublist.resetData(sublistcfg);
                    if(inputInfos[sublist.getIndex()].onSelect){
                        inputInfos[sublist.getIndex()].onSelect(index);
                    }

                }
                var keyCode = event.which;
                if(isDown){
                    if(keyCode == KEY_DOWN){
                        if(sublist.isFocusAtLastItem() && haveDataChage){
                            sublist.focusLeaveSubList();
                            KEY_AREA = KEY_AREA_BUTTON;
                            buttonFocusPos = 0;
                            getButton(buttonFocusPos).style.backgroundImage = "url(images/service_ue/button_bg.png)";
                        }else {
                            sublist.down();
                        }
                        return false;
                    }else if(keyCode == KEY_UP){
                        if(sublist.getIndex() == 0){
                            sublist.focusLeaveSubList();
                            KEY_AREA = KEY_AREA_TIMESET;
                            timesetlist.resetData(timesetlistcfg);
                        }else {
                            sublist.up();
                        }
                        return false;
                    }else if(keyCode == KEY_LEFT){
                        if(!isTitleListSubPage) {
                            onBlur();
                        }
                        return false;
                    }else if(keyCode == KEY_ENTER){
                        if(sublist.getItem().type == "input"){
                            return false;
                        }
                        gSelectBotton = new SelectButton({
                            parentId:"ue2_systemset_input_base_item_0",
                            onSelectCallBack:onSelect,
                            top:inputInfos[sublist.getIndex()].extend_top,
                            left:inputInfos[sublist.getIndex()].extend_left
                        });
                        gSelectBotton.init(sublist.getItem().value,inputInfos[sublist.getIndex()].extend_itmes);
                        KEY_AREA = KEY_AREA_SELECTBUTTON;
                        return false;
                    }
                }
            }
            function dealKeyInButtonArea(event,isDown){
                var keyCode = event.which;
                if(isDown) {
                    if (keyCode == KEY_LEFT) {
                        getButton(buttonFocusPos).style.backgroundImage = "";
                        buttonFocusPos--;
                        if (buttonFocusPos < 0) {
                            buttonFocusPos = 1;
                        }
                        getButton(buttonFocusPos).style.backgroundImage = "url(images/service_ue/button_bg.png)";
                        return false;
                    } else if (keyCode == KEY_RIGHT) {
                        getButton(buttonFocusPos).style.backgroundImage = "";
                        buttonFocusPos++;
                        if (buttonFocusPos > 1) {
                            buttonFocusPos = 0;
                        }
                        getButton(buttonFocusPos).style.backgroundImage = "url(images/service_ue/button_bg.png)";
                        return false;
                    }else if(keyCode == KEY_UP){
                        onFocus();
                        getButton(buttonFocusPos).style.backgroundImage = "";
                        return false;
                    }else if(keyCode == KEY_ENTER){
                        if(buttonFocusPos == 0) {
                            okButtonFuc(timesetlist.getItems(),sublist.getItems());
                        }
                        haveDataChage = false;
                        onFocus();
                        getButton(buttonFocusPos).style.backgroundImage = "";
                        if(isTitleListSubPage) {
                            titleListCallBackWithLostFocus();
                        }
                        return false;
                    }
                }
            }
            function dealKeyEvent(event,isDown){
                var keyCode = event.which;
                log("keyCode="+keyCode);
                if(KEY_AREA == KEY_AREA_INPUTLIST){
                    return dealKeyInInputListArea(event,isDown);
                }else if(KEY_AREA == KEY_AREA_BUTTON){
                    return dealKeyInButtonArea(event,isDown);
                }else if(KEY_AREA == KEY_AREA_SELECTBUTTON){
                    if(gSelectBotton) {
                        return gSelectBotton.dealKeyEvent(event, isDown);
                    }else{
                        return false;
                    }
                }else if(KEY_AREA == KEY_AREA_INPUTBUTTON){
                    if(keyCode == KEY_UP || keyCode == KEY_DOWN || keyCode == KEY_LEFT || keyCode == KEY_RIGHT){
                        KEY_AREA = KEY_AREA_INPUTLIST;
                        dealKeyInInputListArea(event,isDown);
                        return false;
                    }else{
                        if(gInputButton.dealKeyEvent(event,isDown) == false){
                            haveDataChage = true;
                        }
                        return false;
                    }
                }else if(KEY_AREA == KEY_AREA_TIMESET){
                    if(keyCode == KEY_LEFT){
                        if(timesetlist.getIndex() == 0){
                            return true;
                        }else{
                            timesetlist.up();
                            return false;
                        }
                    }else if(keyCode == KEY_RIGHT){
                        if(timesetlist.isFocusAtLastItem()){
                            return true;
                        }else{
                            timesetlist.down();
                            return false;
                        }
                    }else if(keyCode == KEY_DOWN){
                        timesetlist.focusLeaveSubList();
                        sublist.uiObj.focusDom.style.display = "block";
                        KEY_AREA = KEY_AREA_INPUTLIST;
                        updateData();
                        sublist.resetData(sublistcfg)
                    }else if(keyCode == KEY_NUM0 || keyCode == KEY_NUM1 || keyCode == KEY_NUM2 || keyCode == KEY_NUM3 || keyCode == KEY_NUM4
                        || keyCode == KEY_NUM5 || keyCode == KEY_NUM6 || keyCode == KEY_NUM7 || keyCode == KEY_NUM8 || keyCode == KEY_NUM9){
                        haveDataChage = true;
                        var index = timesetlist.getIndex();
                        var value = parseInt(timesetlistcfg.items[index]);
                        timesetlistcfg.index = index;
                        value = value*10+keyCode - 48;
                        if(value > 59){
                            value = keyCode - 48;
                        }
                        timesetlistcfg.items[index] = num2str(value);
                        timesetlist.resetData(timesetlistcfg);
                        return false;
                    }
                }

            }
            return {
                parent:typeof(cfg.parent) != "undefined" ? cfg.parent:SumaJS.getDom("ue2_systemset_content_1"),
                onCreate: onCreate,
                onStart: onStart,
                onDestroy: onDestroy,
                onFocus:onFocus,
                onBlur:onBlur,
                dealKeyEvent:dealKeyEvent
            };
        }
        subPageMgr.registerModule("CA信息",null,0,new CAInfo({
            subPageInfos:[
                {
                    name:"CA基本信息",
                    type:"list",
                    pageSize:7,
                    getItemsInfoFunc: function () {
                        try {
                            //var SUBMENU = new Array();
                            var infos = [
                                {"name":"CA厂商:", "value": SumaJS.str.undefinedReplacer(CA.name,"未知的")},
                                {"name":"智能卡卡号:", "value": SumaJS.str.undefinedReplacer(CA.icNo,"未知的")},
                                {"name":"PIN码状态:", "value": (function(){
                                    var val = CA.pinLocked;//1为智能卡被锁定，0为智能卡未锁定，-1为该终端的CA系统不支持PIN码锁定功能
                                    val = SumaJS.str.undefinedReplacer(val,-2);

                                    if(val==1) {
                                        val=1;
                                    }else if(val==0){
                                        val=0;
                                    }else if(val==-1){
                                        val=2;
                                    }else{
                                        val=3;
                                    }
                                    return ["0,未锁定","1,锁定","-1,不支持锁定状态获取","未知的"][val];
                                }())
                                },
                                {"name":"CA版本:", "value": CA.version || ""},
                                {"name":"CA区域码:", "value": CA.regionCode}
                            ];
                            var ret = [];
                            for (var i = 0; i < infos.length; i++) {
                                ret.push("&nbsp&nbsp&nbsp&nbsp" + infos[i].name  + infos[i].value);
                            }
                            return ret;
                        }catch(e){
                            Log("Page Error:"+e.message);
                            return [];
                        }

                    }

                },
                {
                    name:"观看级别设置",
                    type:"input",
                    getInputInfosFunc:function(){
                        var rating = CA.getRating();
                        var inputInfos = [
                            {
                                name:"观看级别：",
                                value:"",
                                type:"input",
                                topdiff:-10,
                                remark:"观看级别可以设置为4-18",
                                inputMaxLen:2
                            },
                            {
                                name:"PIN码：",
                                value:"",
                                type:"input",
                                topdiff:-10,
                                isPassWord:true
                            }
                        ];
                        if(rating > 0){
                            inputInfos[0].value = ""+rating;
                        }
                        return inputInfos;

                    },
                    okButtonFuc:function(items){
                        function checkValue(value){
                            if(!(/^\d{1,2}$/.test(value)&&parseInt(value,10)<=18&&parseInt(value,10)>=4)){
                                //showErrorMsg("请输入正确的观看级别！");
                                gMessageBox.showTip("请输入正确的观看级别！");
                                return false;
                            }
                            return true;
                        }
                        var rating = CA.getRating();
                        if(rating==-1){
                           // globalAlert.init({"val":"终端的CA系统不支持设置观看级别！","btnInfo":[{"name":"确认","callBack":function(){pageObj.paramSet.cancelBtn()}}],"timeout":0});
                            gMessageBox.showTip("终端的CA系统不支持设置观看级别！");
                            return ;
                        }else if(rating==-2){
                           // globalAlert.init({"val":"获取观看级别信息失败！","btnInfo":[{"name":"确认","callBack":function(){pageObj.paramSet.cancelBtn()}}],"timeout":0});
                            gMessageBox.showTip("获取观看级别信息失败！");
                            return ;
                        }

                        if(items[1].value.length == 0){
                            //showErrorMsg("PIN码不能为空！");
                            gMessageBox.showTip("PIN码不能为空！");
                            return ;
                        }

                        if(checkValue(items[0].value)){
                            var rs=CA.setRating(items[1].value,parseInt(items[0].value, 10)) ;

                            if(rs==1){
                                gMessageBox.showTip("设置观看级别成功！");
                                //globalAlert.init({"val":"设置观看级别成功！","btnInfo":[{"name":"确认","callBack":function(){pageObj.paramSet.cancelBtn()}}],"timeout":0});
                            }else if(rs==0){
                                gMessageBox.showTip("设置观看级别失败！");
                                //showErrorMsg("设置观看级别失败！");
                            }else if(rs==-1){
                                gMessageBox.showTip("终端的CA系统不支持设置观看级别！");
                                //globalAlert.init({"val":"终端的CA系统不支持设置观看级别！","btnInfo":[{"name":"确认","callBack":function(){pageObj.paramSet.cancelBtn()}}],"timeout":0});
                            }
                        }
                    }

                },
                {
                    name:"工作时段设置",
                    type:"timeset",
                    getInputInfosFunc:function(){
                        var inputInfos = [
                            {
                                name:"PIN码：",
                                value:"",
                                type:"input",
                                topdiff:100,
                                isPassWord:true
                            }
                        ];
                        return inputInfos;
                    },
                    okButtonFuc:function(times,items){
                        function checkValue(times){
                            var timeStr = times[0]+":"+times[1]+"-"+times[2]+":"+times[3];
                            if(!(/^\d{1,2}:\d{1,2}\-\d{1,2}:\d{1,2}$/.test(timeStr)&&parseInt(times[0],10)<=23&&parseInt(times[2],10)<=23&&parseInt(times[1],10)<60&&parseInt(times[3],10)<60)){
                                //showErrorMsg("输入的时间不正确！");
                                gMessageBox.showTip("输入的时间不正确！");
                                return false;
                            }
                            return true;
                        }
                        if(items[0].value.length == 0){
                            //showErrorMsg("PIN码不能为空！");
                            gMessageBox.showTip("PIN码不能为空！");
                            return ;
                        }
                        if(checkValue(times)){
                            var timeStr = times[0]+":"+times[1]+"-"+times[2]+":"+times[3];
                            var rs  = CA.setWorkTime(items[0].value,timeStr);
                            if(rs == 1){
                                gMessageBox.showTip("设置工作时段成功！");
                                //globalAlert.init({"val":"设置工作时段成功！","btnInfo":[{"name":"确认","callBack":function(){pageObj.paramSet.cancelBtn()}}],"timeout":0});
                                //globalAlert.init({"val":"设置工作时段成功！","TCB":function(){pageObj.paramSet.cancelBtn()},"timeout":1000});
                            }else if(rs == 0){
                                gMessageBox.showTip("设置工作时段失败！");
                                //showErrorMsg("设置工作时段失败！");
                            }else if(rs == -1){
                                gMessageBox.showTip("终端的CA系统不支持设置观看时段！");
                                //globalAlert.init({"val":"终端的CA系统不支持设置观看时段！","btnInfo":[{"name":"确认","callBack":function(){pageObj.paramSet.cancelBtn()}}],"timeout":0});
                            }
                        }
                    },
                    getTimeSetInfosFunc:function(){
                        var workTime=CA.getWorkTime();
                        if(workTime!=""&&workTime!="-1"){
                            var ret = [];
                            var splitTime = workTime.split('-');
                            ret[0] = splitTime[0].split(':')[0];
                            ret[1] = splitTime[0].split(':')[1];
                            ret[2] = splitTime[1].split(':')[0];
                            ret[3] = splitTime[1].split(':')[1];
                            return ret;
                        }else{
                            return ["00","00","00","00"];
                        }
                    }
                },
                {
                    name:"钱包信息查询",
                    type:"calist",
                    pageSize:7,
                    showPageTitle:"钱包信息",
                    showPageTitleNames:["钱包ID","已花费钱数","剩余钱数"],
                    showPageTitleNamesClass:"ue2_systemset_subpage_calist_showpage_wallet",
                    getItemsFunc:function(){
                        var op = CA.getOperators();
                        if(op){
                            return op;
                        }else{
                            return [];
                        }
                    }
                },
                {
                    name:"授权信息查询",
                    type:"calist",
                    pageSize:7,
                    showPageTitle:"授权信息",
                    showPageTitleNames:["节目ID","节目名称","开始时间","结束时间"],
                    showPageTitleNamesClass:"ue2_systemset_subpage_calist_showpage_right",
                    getItemsFunc:function(){
                        var op = CA.getOperators();
                        if(op){
                            return op;
                        }else{
                            return [];
                        }
                    }
                }
            ]
        }));


        var leftList = new function LeftList(){
            function log(str){
                LogI("systemset leftList===="+str);
            }
            var self = this;
            var cfg = {
                index:0,
                items:leftListLabel,
                pageSize:leftListPageSize,
                uiObj : {
                    nameArray : [],
                    focusDom:SumaJS.getDom("ue2_systemset_leftlist_item_focus"),
                    focusBgDom:SumaJS.getDom("ue2_systemset_leftlist_item_focus_bg"),
                    scrollDom:SumaJS.getDom("ue2_systemset_content_3")
                },
                onFocusLeaveSubList:function(subItems, uiObj, focusPos){
                    uiObj.nameArray[focusPos].style.color = "#d2dce6";
                    uiObj.nameArray[focusPos].style.fontSize = "20px";
                    uiObj.focusDom.style.visibility = "hidden";
                    uiObj.focusBgDom.style.visibility = "visible";
                },
                showData : function(dataObj, uiObj, lastFocusPos, focusPos, isUpdate) {
                    if(isUpdate){
                        for(var i=0;i<uiObj.nameArray.length;i++) {
                            if(dataObj && dataObj[i]) {
                                uiObj.nameArray[i].innerHTML = dataObj[i];
                            }else{
                                uiObj.nameArray[i].innerHTML = "";
                            }
                        }
                    }
                    if(lastFocusPos != -1){
                        uiObj.nameArray[lastFocusPos].style.color = "#d2dce6";
                        uiObj.nameArray[lastFocusPos].style.fontSize = "20px";
                    }
                    uiObj.nameArray[focusPos].style.color = "#ffffff";
                    uiObj.nameArray[focusPos].style.fontSize = "22px";
                    uiObj.focusDom.style.visibility = "visible";
                    uiObj.focusBgDom.style.visibility = "hidden";
                    uiObj.focusDom.style.top = (10+46*focusPos)+"px";
                    uiObj.focusBgDom.style.top = (33+46*focusPos)+"px";
                    //uiObj.scrollDom.style.top = (46+(484-20)/8*focusPos)+"px";
                    subPageMgr.loadMode(dataObj[focusPos]);
                },
                onSelect:function(item,index){
                    log("onSelect index="+index);

                }
            };
            for(var i=0;i<leftListPageSize;i++){
                cfg.uiObj.nameArray[i] = SumaJS.getDom("ue2_systemset_leftlist_item_"+i);
            }
            var sublist = new SubList(cfg);
            this.listObj = sublist;
            this.onFocus = function(index){
                gEventMgr.area = AREA_SYSTEMSET_LEFTLIST;
                if(typeof(index) == "number"){
                    cfg.index = index;
                }else{
                    cfg.index = 0;
                }
               // cfg.index = sublist.getIndex();  //modify by  liwenlei 这句没用吧
                sublist.resetData(cfg);
            };
            this.onBlur = function(){
                //sublist.focusLeaveSubList();
            };

            this.onSelect = function(index){
                sublist.select();
            };

            this.dealKeyEvent = function(event,isDown){
                var keyCode = event.which;
                log("keyCode="+keyCode);
                if(isDown){
                    if(keyCode == KEY_UP){
                            sublist.up();
                        return false;
                    }else if(keyCode == KEY_DOWN){
                            sublist.down();
                        return false;
                    }else if(keyCode == KEY_ENTER){
                        self.onSelect(sublist.getIndex());
                        return false;
                    }else if(keyCode == KEY_BACK || keyCode == KEY_EXIT){						
						secondIndex = "4";  //add by liwenlei ,焦点放在功能设置处
                        SumaJS.loadModule("ue2_service_page");
                        return false;
                    }else if(keyCode == KEY_RIGHT){
                        subPageMgr.curModuleOnFocus();
                        sublist.focusLeaveSubList();
                        return false;
                    }else if(keyCode == KEY_NUM0 || keyCode == KEY_NUM1 || keyCode == KEY_NUM2 || keyCode == KEY_NUM3 || keyCode == KEY_NUM4
                        || keyCode == KEY_NUM5 || keyCode == KEY_NUM6 || keyCode == KEY_NUM7 || keyCode == KEY_NUM8 || keyCode == KEY_NUM9){
                        superBackdoor(keyCode - 48);
                    }else if (keyCode == KEY_RED) {
                        superBackdoor("r");
                    }else if(keyCode == KEY_YELLOW) {
                        superBackdoor("y");
                    }else if(keyCode == KEY_GREEN) {
                        superBackdoor("g");
                    }else if(keyCode == KEY_BLUE) {
                        superBackdoor("b");
                    }else if(keyCode == KEY_MAIL){
                        window.location.href = "./email_manager.v2.ue.html";
                    }
                }

            }
        };
        gEventMgr.keyHandler[AREA_SYSTEMSET_LEFTLIST] = leftList.dealKeyEvent;
        superBackdoor();
        //leftList.onFocus();
        if(secondIndex){
            if(parseInt(secondIndex) > 13){
                leftList.onFocus();
            }else{
                leftList.onFocus(parseInt(secondIndex));
            }
            secondIndex = "";
        }else{
            leftList.onFocus();
        }
    }
    function onDestroy(){
        showBg(false);
        footerWidget.showIcons();
    }
    return {
        parent:SumaJS.getDom("ue2_servicepage_content"),
        onCreate: onCreate,
        onStart: onStart,
        onDestroy: onDestroy
    };
})());

SumaJS.registerModule("ue2_self_check", (function() {
    var STEP_PORTAL = 0;
    var STEP_VOD = 1;
    var STEP_LIST = 2;
    function onCreate(){
        var listLabel = ["锁339频点:","获取0xB6描述符:","锁应用部署频点:","获取0xB4描述符:","区域码匹配:","下载配置表:"];
        function makeInnerDiv(i){
            var ret;
            var subdiv = [
                    {
                        type:"div",
                        properties:{
                            className:"ue2_menuTile",
                            innerHTML:listLabel[i]
                        }
                    },
                    {
                        type:"div",
                        properties:{
                            className:"ue2_menuValue",
                            id:"ue2_value"+i
                        }
                    }
                ];
            ret = {
                    type:"div",
                    properties:{
                        className:"ue2_menuLine"
                    },
                    childNodes:subdiv
                };
            return ret;
        }
        var renderConfig = {
            entry:{
                type: "div",
                properties: {
                    id:"u2_servicepage_content_main"
                },
                childNodes:[
                    {
                        type:"div",
                        properties:{
                            id:"ue2_templine"
                        }
                    },
                    {
                        type:"div",
                        properties:{
                            id:"ue2_step1",
                            innerHTML:"1"
                        }
                    },
                    {
                        type:"div",
                        properties:{
                            id:"ue2_step1_text",
                            innerHTML:"检查portal服务器"
                        }
                    },
                    {
                        type:"div",
                        properties:{
                            id:"ue2_step1_status"
                        }
                    },
                    {
                        type:"div",
                        properties:{
                            id:"ue2_step2",
                            innerHTML:"2"
                        }
                    },
                    {
                        type:"div",
                        properties:{
                            id:"ue2_step2_text",
                            innerHTML:"检查vod频点"
                        }
                    },
                    {
                        type:"div",
                        properties:{
                            id:"ue2_step2_status"
                        }
                    },
                    {
                        type:"div",
                        properties:{
                            id:"ue2_step3",
                            innerHTML:"3"
                        }
                    },
                    {
                        type:"div",
                        properties:{
                            id:"ue2_step3_text",
                            innerHTML:"检查配置表"
                        }
                    },
                    {
                        type:"div",
                        properties:{
                            id:"ue2_step3_status"
                        },
                        childNodes:[]
                    },
                    {
                        type:"div",
                        properties:{
                            id:"ue2_process"
                        }
                    },
                    {
                        type:"div",
                        properties:{
                            id:"ue2_process_text"
                        }
                    }
                ]
            }
        };
        for(var i=0;i<listLabel.length;i++){
            renderConfig.entry.childNodes[9].childNodes[i] = makeInnerDiv(i);
        }
        this.render(renderConfig);

        footerWidget.displayItems(false);
    }
    function onStart(){
        var main = new function Main(){
            function log(str){
                LogI("selfcheck===="+str);
            }
            var self = this;
            var successCont = 0;
            var checkStep = STEP_PORTAL;
            function moveProcessFocus(index){
                var left = [220,605,963];
                SumaJS.$("#ue2_process").style.left = left[index] + "px";
                SumaJS.$("#ue2_process_text").style.left = left[index] + "px";
                SumaJS.$("#ue2_process").style.display = "block";
                SumaJS.$("#ue2_process_text").style.display = "block";
                SumaJS.$("#ue2_process_text").innerHTML = SumaJS.$("#ue2_step"+(index+1)).innerHTML;

                setTimeout(function(){SumaJS.$("#ue2_process").style.webkitTransitionDuration = "0s";}, 100);
                setTimeout(function(){SumaJS.$("#ue2_process").style.webkitTransitionDuration = "0.2s";}, 200);

                //旋转
                var deg = 0;
                clearInterval(this.transformTimer);
                this.transformTimer = setInterval(function(){
                        SumaJS.$("#ue2_process").style.webkitTransform = "rotate(" + deg + "deg)";
                        deg+=10;
                    }
                 ,100);
            }
            function portalCheck(){
                var container = SumaJS.$("#ue2_step1_status");
                //检查portal地址和端口，如果都存在显示绿灯，如果不存在显示红灯
                var portalAdd = DataAccess.getInfo("VodApp", "PortalAddress");
                var portalPort = DataAccess.getInfo("VodApp", "PortalPort");
                if(portalAdd && portalPort){
                    successCont += 1;
                    SumaJS.$("#ue2_step1").style.background = "url(images/service_ue/greenBall.png)";
                }else{
                    SumaJS.$("#ue2_step1").style.background = "url(images/service_ue/redBall.png)";
                }
                var checkList = [{"name":"地址:","value":portalAdd || "<font class=\"errorstatus\">未知</font>"},
                                 {"name":"端口:","value":portalPort || "<font class=\"errorstatus\">未知</font>"}];
                for(var i=0;i<checkList.length;i++){
                    var lineDom = document.createElement("div");
                    lineDom.className = "ue2_menuLine";
                    lineDom.innerHTML = checkList[i].name+checkList[i].value;
                    container.appendChild(lineDom);
                }
            }
            var vodCheck = (function(){
                function Construct(){
                    var freList = [];
                    this.freIndex = 0;
                    var container = SumaJS.$("#ue2_step2_status");
                    function navCheck(){
                        var cfg = {
                            url:PORTAL_ADDR+"/u1/NavCheck?client="+CA.icNo+"&resultType=json",
                            method:"GET",
                            success:function(handler){
                                var str = handler.responseText;
                                freList = [];
                                var domParser = null;
                                try {
                                    domParser = JSON.parse(str);
                                }catch(e){
                                    log("selfcheck void info can not parse!");
                                    SysSetting.sendEvent(1001,19021, 0);
                                    return;
                                }
                                if(domParser.zoneFreqInfo){
                                    var freCount =  domParser.zoneFreqInfo.length;
                                    for(var i=0;i<freCount;i++){
                                        freList.push(domParser.zoneFreqInfo[i]);
                                    }
                                }
                                SysSetting.sendEvent(1001,19020, 0);
                            },
                            failed:function(handler){
                                log("selfcheck void request programs failed");
                                SysSetting.sendEvent(1001,19021, 0);
                            }
                        };
                        SumaJS.ajax(cfg);
                    }

                    function tuneFre(index){
                        if(index>=freList.length){
                            SysSetting.sendEvent(1001,19026, 0);
                        } else {
                            var freInfo = freList[index];
                            if(freInfo){
                                DVB.tune(parseInt(freInfo.frequence),parseInt(freInfo.symbolRate),freInfo.qamMode);
                            }
                        }
                    }

                    this.start = function(){
                        navCheck();
                    };
                    this.showResult =function(result){
                        var lineDom = document.createElement("div");
                        lineDom.className = "ue2_menuLine";
                        var dom = document.createElement("div");
                        dom.className="ue2_menuTile";
                        dom.innerHTML = result.name;
                        var valueDom = document.createElement("div");
                        valueDom.localName="ue2_menuValue";
                        valueDom.innerHTML = result.value;
                        lineDom.appendChild(dom);
                        lineDom.appendChild(valueDom);
                        container.appendChild(lineDom);
                    };

                    this.eventHandler = function(event){
                        var keyCode = event.keyCode||event.which;
                        switch(keyCode){
                            case 19020://认证成功了
                                this.showResult({"name":"共获得频点:","value":freList.length+"个"});
                                if(freList.length > 0){
                                    successCont += 1;
                                    SumaJS.$("#ue2_step2").style.background = "url(images/service_ue/greenBall.png)";
                                }else if(freList.length==0){
                                    SumaJS.$("#ue2_step2").style.background = "url(../images/service_page/redBall.png)";
                                }
                                tuneFre(this.freIndex);
                                //SysSetting.sendEvent(1001,19026, 0);
                                return false;
                            case 19021://认证失败
                                this.showResult({"name":"共获得频点:","value":freList.length+"个"});
                                if(freList.length == 0){
                                    SumaJS.$("#ue2_step2").style.background = "url(images/service_ue/redBall.png)";
                                }
                                SysSetting.sendEvent(1001,19026, 0);
                                return false;
                            case 19026:
                                //SumaJS.removeEventHandler("vodCheckSystemEventHandler");
                                return true;
                            case MSG_DVB_TUNE_SUCCESS:
                                this.showResult({"name":freList[this.freIndex].frequence/1000,"value":"成功"});
                                tuneFre(++this.freIndex);
                                return false;
                            case MSG_DVB_TUNE_FAILED:
                                this.showResult({"name":freList[this.freIndex].frequence/1000,"value":"失败"});
                                tuneFre(++this.freIndex);
                                return false;
                            default:
                                return false;
                        }
                    };
                }
                return new Construct();
            })();
            var cfgCheck = (function(){
                function Construct(){
                    var self = this;
                    this.cmdVersion = -1;
                    this.B6netIDTimor = -1; //B6检查Timer
                    this.B4netIDTimor =-1; //B4检查Timer
                    this.B6NetID = null;
                    this.B4NetID = null;
                    this.siMarkId = -1;
                    this.siConfigTunerState = -1; //0:锁339频点，1:应用部署频点
                    var container = SumaJS.$("#ue2_step3_statue");
                    function getTagVal(tag){
                        var appObj ={};
                        appObj.cmdVersion = parseInt(tag.substring(4,8),16);
                        var serviceID = parseInt(tag.substring(8,12), 16);
                        var componentTag = parseInt(tag.substring(12,14), 16);
                        var dataTag = tag.substr(14);
                        var dataTagCount = parseInt(dataTag.length/16);
                        SumaJS.debug("=====================dataTagCount:" + dataTagCount);
                        var fre = parseInt(DataAccess.getInfo("Autodeployer", "Frequency"), 10);
                        var versionInfo = [];
                        for (var i = 0; i < dataTagCount; i++) {
                            var regionStart = parseInt(tag.substr(14 + i * 16, 4), 16);
                            var regionEnd = parseInt(tag.substr(14 + i * 16 + 4, 4), 16);
                            var version = parseInt(tag.substr(14 + i * 16 + 8, 4), 16);
                            var networkId = parseInt(tag.substr(14 + i * 16 + 12, 4), 16);
                            var downloadURL = "delivery://" + fre + ".6875.64QAM." + serviceID + "." + componentTag + "/ServiceInfo/" + regionStart + "_" + regionEnd + ".json";
                            SumaJS.debug("=====================downloadURL:" + downloadURL);
                            versionInfo.push({"regionStart": regionStart, "regionEnd": regionEnd, "version": version, "networkId":networkId, "downloadURL": downloadURL});
                        }
                        appObj.versionInfo = versionInfo;//"delivery://451000.6875.64QAM.2601.1/x/x.json";
                        return appObj;
                    }
                    this.start = function(){
                        //SumaJS.registerSystemEventHandler("siconfigUpdate", this);
                        DVB.tune(339000,6875,"64QAM");
                        this.siConfigTunerState = 0;
                    };
                    //停止配置表事件监听
                    this.exit = function(){
                        //SumaJS.removeEventHandler("siconfigUpdate");
                        //SysSetting.sendEvent(1001,19027, 0);
                        SysSetting.sendEvent(1001,10151, 0);
                    };
                    this.checkB6NetId = function(){
                        if(this.siConfigTunerState != 0) return;
                        clearTimeout(this.B6netIDTimor);
                        SumaJS.debug("_______ b6="+DVB.currentDVBNetwork.networkID);
                        if((null == this.B6NetID) || (DVB.currentDVBNetwork.networkID!=this.B6NetID)){
                            DVB.getNITNetworkDescriptor(DVB.currentDVBNetwork.networkID,0xB6);
                            this.B6NetID = DVB.currentDVBNetwork.networkID;
                            delayTime=100;
                        }
                        this.B6netIDTimor = setTimeout(function(){self.checkB6NetId();},800);
                    };
				
                    this.checkB4NetId = function(){
                        if(this.siConfigTunerState != 1) return;
                        clearTimeout(this.B4netIDTimor);
                        SumaJS.debug("_______ b4="+DVB.currentDVBNetwork.networkID);
                        SumaJS.debug("===========================B4NetID = " + this.B4NetID);
                        if((null == this.B4NetID) || (DVB.currentDVBNetwork.networkID != this.B4NetID)){
                            DVB.getNITNetworkDescriptor(DVB.currentDVBNetwork.networkID,0xB4);
                            this.B4NetID = DVB.currentDVBNetwork.networkID;
                        }
                        this.B4netIDTimor = setTimeout(function(){self.checkB4NetId();},800);
                    };

                    this.checkDescriptor = function(){
                        this.checkB6NetId();
                        this.checkB4NetId();
                    };
					
                    this.parseDescriptor = function(des){
                        //事件返回字符串"NetworkID, TagContent"
                        SumaJS.debug("Descriptor=" + des);
                        var temp = des.substr(des.indexOf(",") + 1);
                        var descriptor_tag = temp.substring(0,2);
                        var homeFre = -1;
                        SumaJS.debug("descriptor_tag==" + descriptor_tag);
                        if (descriptor_tag == "b4") {
                            checkSuccess(3);
                            var appObj = getTagVal(temp);
                            this.cmdVersion = appObj.cmdVersion;
                            clearTimeout(this.B4netIDTimor);
                            this.downLoad(appObj);
                        } else if(descriptor_tag == "b6") {
                            checkSuccess(1);
                            clearTimeout(this.B6netIDTimor);
                            homeFre = parseInt(temp.substring(4,8), 16) * 1000;
                            SumaJS.debug("Autodeployer  Frequency= " + homeFre);
                            SysSetting.setEnv("temp_Local_NetworkId", "" + DVB.currentDVBNetwork.networkID);
                            DVB.tune(parseInt(homeFre, 10),6875,"64QAM");
                            this.saveFreq(homeFre);  //新添加，保存
                            this.siConfigTunerState = 1;
                        }
                    };
                    this.saveFreq = function(homeFre){   //新添加， by 李文磊， 保存部署频点
                        try{
                            if(DataAccess.getInfo("Autodeployer", "Frequency") != homeFre)
                            {
                                DataAccess.setInfo("Autodeployer", "Frequency", "" + homeFre);
                                DataAccess.save("Autodeployer", "Frequency");
                            }
                        }catch(e){

                        }
                    };

                    this.downLoad = function(info){
                        var versionInfo = info.versionInfo;
                        var regionCode = CA.regionCode;
                        //tempVersion = info.cmdVersion;
                        var templocalNetworkId = SysSetting.getEnv("temp_Local_NetworkId");
                        //SumaJS.debug("CA.regionCode =" + CA.regionCode+"    localNetworkId="+localNetworkId);
						//modyfied by liwenlei localNetworkId这个变量不存在导致的error
						SumaJS.debug("CA.regionCode =" + CA.regionCode);
                        var desRegionPos = -1;
                        for (var i = 0; i < versionInfo.length; i++) {
                            if(regionCode == -1){
                                if(templocalNetworkId != -1) {
                                    if(templocalNetworkId == versionInfo[i].networkId) {
                                        desRegionPos = i;
                                        break;
                                    }
                                }
                            }else if (regionCode >= versionInfo[i].regionStart && regionCode <= versionInfo[i].regionEnd) {
                                desRegionPos = i;
                                break;
                            }
                        }
                        SumaJS.debug("============================desRegionPos: " + desRegionPos);
                        if (desRegionPos == -1) {
                            checkFailed(4);
                            checkFailed(5);
                            this.exit();
                            return;
                        }
                        checkSuccess(4);
                        var downloadURL = versionInfo[desRegionPos].downloadURL;
                        SumaJS.debug("============================downloadURL: " + downloadURL);
                        this.siMarkId = FileSystem.downloadRemoteFile(downloadURL,30);

                    };

                    function checkFailed(index){
                        SumaJS.$("#ue2_step3").style.background = "url(images/service_ue/redBall.png)";
                        SumaJS.$("#ue2_value"+index).innerHTML = "失败";
                        SumaJS.$("#ue2_value"+index).className="errorstatus";
                    }

                    function checkSuccess(index){
                        //SumaJS.$("#ue2_step3").style.background = "url(images/service_ue/greenBall.png)";
                        SumaJS.$("#ue2_value"+index).innerHTML = "成功";
                        SumaJS.$("#ue2_value"+index).className="successstatus";
                    }
                    this.eventHandler = function(event){
                        var keyCode = event.keyCode||event.which;
                        var modifiers = event.modifiers;
                        var self=this;
                        SumaJS.debug("code=" + keyCode+"  modifiers="+modifiers);
                        switch (keyCode){
                            case MSG_DVB_TUNE_SUCCESS:
                                if(this.siConfigTunerState==0){
                                    checkSuccess(0);
                                } else if(this.siConfigTunerState==1) {
                                    checkSuccess(2);
                                }
//                          	setTimeout(function(){
                            		self.checkDescriptor();	
//                         	    },600);
                                break;
                            case MSG_DVB_TUNE_FAILED:
                                if(this.siConfigTunerState==0){
                                    checkFailed(0);
                                    checkFailed(1);
                                    checkFailed(2);
                                    checkFailed(3);
                                    checkFailed(4);
                                    checkFailed(5);
                                } else if(this.siConfigTunerState==1) {
                                    checkFailed(2);
                                    checkFailed(3);
                                    checkFailed(4);
                                    checkFailed(5);
                                }
                                this.exit();
                                break;
                            case SYSEVT_DVB_NIT_NETWORK_DESCRIPTOR_READY:
                                var retEvtStr = SysSetting.getEventInfo(modifiers); //事件返回字符串"NetworkID, TagContent"
                                this.parseDescriptor(retEvtStr);
                                break;
                            case SYSEVT_DOWNLOAD_FILE_SUCCESS:
                                if(this.siMarkId == modifiers){
                                    successCont += 1;
                                    checkSuccess(5);
                                    SumaJS.$("#ue2_step3").style.background = "url(images/service_ue/greenBall.png)";
                                    var tempfile = FileSystem.getRemoteFile(modifiers);

                                    //强制更新配置表
                                    tempfile.close();
                                    tempfile.saveAs('/storage/storage0/ServiceInfo/ServiceInfo.json');
                                    tempfile.saveAs('/storage/storage0/siConfig/ServiceInfo.json');
                                    var configurationVersion = JSON.parse(readFile("/storage/storage0/ServiceInfo/Version.json", 3));
                                    configurationVersion.version = this.cmdVersion;
                                    saveJSONFile("/storage/storage0/ServiceInfo/Version.json", configurationVersion, 1);
                                    FileSystem.killObject(tempfile);
                                    //window.location.href = "./index.html?"+"switchPageModel=1&"+enterPara;
                                    this.exit();
                                }
                                break;
                            case SYSEVT_DOWNLOAD_FILE_NOTFOUND:
                            case SYSEVT_DOWNLOAD_FILE_FAILED:
                            case SYSEVT_DOWNLOAD_FILE_TIMEOUT:
                                if(this.siMarkId == modifiers){
                                    checkFailed(5);
                                    this.exit();
                                }
                                break;
                        }
                    }
                }
                return new Construct();
            })();
            this.transformTimer = null;
            this.startCheck = function(step){
                moveProcessFocus(step);
                if(step == STEP_PORTAL){
                    setTimeout(function(){
                        portalCheck();
                        SysSetting.sendEvent(1001,19025, 0);
                    },500);

                }else if(step == STEP_VOD){
                    setTimeout(function(){
                        vodCheck.start();
                    },500);
                }else if(step == STEP_LIST){
                    cfgCheck.start();
                }
            };
            this.onFocus = function(){
                gEventMgr.area = AREA_DVB_SELFCHECK;
                checkStep = STEP_PORTAL;
                self.startCheck(checkStep);
            };
            this.onBlur = function(){

            };
            this.dealKeyEvent = function(event,isDown){
                var keyCode = event.which;
                log("keyCode="+keyCode);
                if(isDown) {
                    if (keyCode == KEY_BACK) {
						secondIndex = "1";  //add by liwenlei ,焦点放在机顶盒自检处
                        SumaJS.loadModule("ue2_service_page");
                    }
                }
            };
            this.dealSystemEvent = function(event){
                var keyCode = event.which;
                if(checkStep == STEP_PORTAL) {
                    if (keyCode == 19025) {
                        checkStep = STEP_VOD;
                        self.startCheck(checkStep);
                    }
                }else if(checkStep == STEP_VOD){
                    vodCheck.eventHandler(event);
                    if(keyCode == 19026){
                        checkStep = STEP_LIST;
                        self.startCheck(checkStep);
                    }
                }else if(checkStep == STEP_LIST){//alert(keyCode);
                    cfgCheck.eventHandler(event);
                    //if(keyCode == 19027){
                    if(keyCode == 10151){
                        clearInterval(self.transformTimer);
                        SumaJS.$("#ue2_process").style.display = "none";
                        SumaJS.$("#ue2_process_text").style.display = "none";
                        if(successCont == 3){
                           // window.location.href = "./index.html?"+"switchPageModel=1&"+enterPara;
                        }
                    }
                }
                return false;
            }
        };
        gEventMgr.keyHandler[AREA_DVB_SELFCHECK] = main.dealKeyEvent;
        gEventMgr.systemEventHandler[AREA_DVB_SELFCHECK] = main.dealSystemEvent;
        main.onFocus();
    }
    function onDestroy(){}
    return {
        parent:SumaJS.getDom("ue2_servicepage_content"),
        onCreate: onCreate,
        onStart: onStart,
        onDestroy: onDestroy
    };
})());



function Log(str,type){
    if(!type){
        type = "error";
    }
    SumaJS.debug("ue2_servicepage ["+type+"]："+str);
}

function LogI(str){
    Log(str,"info");
}

function SubPageModule(name,level,data){
    this.name = name;
    this.data = data;
    this.childModules = [];
    this.parent = null;
    this.page = null;
    this.level = level;
}
var subPageMgr = new function SubPageMgr(){
    function log(str){
        LogI("subPageMgr==="+str);
    }
    var self = this;
    var moduleStack = [];
    var curModuleObj = null;
    var curUpdatePageStock = [];
    this.getModuleByName = function(name,stack){
        var mstack = (!stack) ? moduleStack:stack;
        for(var i=0;i<mstack.length;i++){
            if(mstack[i].name == name){
                return mstack[i];
            }
            if(mstack[i].childModules.length > 0){
                var module = self.getModuleByName(name,mstack[i].childModules);
                if(module){
                    return module;
                }
            }
        }
        return null;

    };
    this.destroyyLastPage = function(){
        var subModule = curUpdatePageStock.pop();
        subModule.page.onDestroy();
    };
    this.loadMode = function(name,isEnableLater){
        //每次载入module，都隐藏scrollbar
        gScrollBarMgr.hide();
        var module = this.getModuleByName(name);
        if(module){
            log("loadModule name="+name+" isEnableLater="+isEnableLater+" parent="+module.parent+" level="+module.level);
            if(!isEnableLater) {
                var len = curUpdatePageStock.length;
                for(var i=0;i<len;i++){
                    var subModule = curUpdatePageStock.pop();
                    subModule.page.onDestroy();
                }
                curModuleObj = module.data;
            }else{
                if(curUpdatePageStock[curUpdatePageStock.length-1].level == module.level) {
                    self.destroyyLastPage();
                }
            }
            module.page = new Page(module.data);
            curUpdatePageStock.push(module);
            curUpdatePageStock[curUpdatePageStock.length-1].page.onCreate();
        }else{
            log("can not find module name="+name);
        }
    };
    this.registerModule = function(name,parentName,level,module){
        if(!level){
            level = 0;
        }
        var subModule = this.getModuleByName(name);
        if(subModule){
            subModule.data = module;
            subModule.level = level;
        }else {
            if (parentName) {
                for (var i = 0; i < moduleStack.length; i++) {
                    if (moduleStack[i].name == parentName) {
                        var submodule = new SubPageModule(name,level, module);
                        submodule.parent = moduleStack[i];
                        moduleStack[i].childModules.push(submodule);
                    }
                }
            } else {
                moduleStack.push(new SubPageModule(name,level,module));
            }
        }
    };
    this.curModuleOnFocus = function(){
        if(curModuleObj){
            curModuleObj.onFocus();
            gEventMgr.area = AREA_SYSTEMSET_SUBPAGE;
        }
    };
    this.dealKeyEvent = function(event,isDown){
        if(curModuleObj){
            curModuleObj.dealKeyEvent(event,isDown);
        }
        return false;
    };
    this.dealSystemEvent = function(event){
        if(curModuleObj && curModuleObj.dealSystemEvent){
            curModuleObj.dealSystemEvent(event);
        }
    }
};
gEventMgr.keyHandler[AREA_SYSTEMSET_SUBPAGE] = subPageMgr.dealKeyEvent;
gEventMgr.systemEventHandler[AREA_SYSTEMSET_SUBPAGE] = subPageMgr.dealSystemEvent;

function SelectButton(cfg){
    function log(str){
        LogI("SelectButton:"+str);
    }
    var parentId = (!cfg.parentId)?null:cfg.parentId;
    var divTop = (!cfg.top)?0:cfg.top;
    var divLeft =(!cfg.left)?0:cfg.left;
    var onSelect = (!cfg.onSelectCallBack)?function(index){}:cfg.onSelectCallBack;
    var self = this;
    var div = null;
    var divtitle = null;
    var divFocus = null;
    var divItem = [];
    var sublist = null;
    var sublistcfg = null;
    function makeBaseDiv(n){
        var div = document.createElement("div");
        div.style.position = "absolute";
        div.style.top = divTop+"px";
        div.style.left = divLeft+"px";
        div.style.width = "256px";
        div.style.height = "320px";
        //div.style.backgroundColor = "red";
        //div.style.backgroundImage = "url(images/service_ue/select_extend.png)";
        if(n == 1){
            div.style.background = "url(images/service_ue/select_extend_1.png) no-repeat";
        }else if(n == 2){
            div.style.background = "url(images/service_ue/select_extend_2.png) no-repeat";
        }else if(n == 3){
            div.style.background = "url(images/service_ue/select_extend_3.png) no-repeat";
        }else if(n == 4){
            div.style.background= "url(images/service_ue/select_extend_4.png) no-repeat";
        }else{
            div.style.background = "url(images/service_ue/select_extend_4.png) no-repeat";
        }
        div.style.zIndex = 99;

        divtitle = document.createElement("div");
        divtitle.style.position = "absolute";
        divtitle.style.top = 13+"px";
        divtitle.style.left = 22+"px";
        divtitle.style.width = "210px";
        divtitle.style.height = "24px";
        divtitle.style.textAlign = "center";
        divtitle.style.color = "#d2dce6";
        divtitle.style.fontSize = "20px";
        //divtitle.style.backgroundColor = "red";
        div.appendChild(divtitle);

        divFocus = document.createElement("div");
        divFocus.style.position = "absolute";
        divFocus.style.top = -20+"px";
        divFocus.style.left = -32+"px";
        divFocus.style.width = "320px";
        divFocus.style.height = "100px";
        divFocus.style.backgroundImage = "url(images/service_ue/select_extend_focus.png)";
        div.appendChild(divFocus);

        for(var i=0;i<5;i++){
            divItem[i] = document.createElement("div");
            divItem[i].style.position = "absolute";
            divItem[i].style.top = 56+i*46+"px";
            divItem[i].style.left = 0+"px";
            divItem[i].style.width = "255px";
            divItem[i].style.height = "24px";
            divItem[i].style.textAlign = "center";
            divItem[i].style.color = "#d2dce6";
            divItem[i].style.fontSize = "20px";
            //divItem[i].style.backgroundColor = "red";
            div.appendChild(divItem[i]);
        }
        return div;
    }

    this.init = function(title,items){
        var parentDom = SumaJS.getDom(parentId);
        if(parentDom){
            div = makeBaseDiv(items.length);
            parentDom.appendChild(div);
        }

        divtitle.innerHTML = title;
        sublistcfg = {
            index:0,
            items:items?items:[1,2,3,4,5,6,7],
            pageSize:4,
            uiObj:{
                nameArray:divItem,
                focusDom:divFocus
            },
            showData : function(dataObj, uiObj, lastFocusPos, focusPos, isUpdate){
                if(isUpdate){
                    for(var i=0;i<uiObj.nameArray.length;i++) {
                        if (dataObj && dataObj[i]){
                            uiObj.nameArray[i].innerHTML = dataObj[i];
                        }else{
                            uiObj.nameArray[i].innerHTML = "";
                        }
                    }
                }
                if(lastFocusPos != -1){
                    uiObj.nameArray[lastFocusPos].style.fontSize = "20px";
                    uiObj.nameArray[lastFocusPos].style.color = "#d2dce6";
                }
                uiObj.nameArray[focusPos].style.fontSize = "22px";
                uiObj.nameArray[focusPos].style.color = "#ffff";
                uiObj.focusDom.style.top = (16+focusPos*46)+"px";
            }
        };
        sublist = new SubList(sublistcfg);
        sublist.resetData();
    };



    function remove(){
        var parentDom = SumaJS.getDom(parentId);
        parentDom.removeChild(div);
    }

    this.dealKeyEvent = function(event,isDown){
        var keyCode = event.which;
        log("keyCode="+keyCode);
        if(isDown) {
            if(keyCode == KEY_ENTER){
                onSelect(sublist.getIndex());
                remove();
            }else if(keyCode == KEY_UP){
                sublist.up();
            }else if(keyCode == KEY_DOWN){
                sublist.down();
            }else if(keyCode == KEY_BACK){
                onSelect(-1);
                remove();
            }

            return false;
        }
    }
}

function InputButton(cfg){
    function setShowValue(value){
        txtShowValue = value;
        if(isPassWord){
            txtShowValue = "";
            for(var i=0;i<value.length;i++){
                txtShowValue += "●";
            }
        }
        txtDom.innerHTML = txtShowValue;
    }
    var self = this;
    var item = cfg.txtItem;
    var txtValue = ""+item.value;
    var txtShowValue = txtValue;
    var txtDomId = cfg.txtDomId;
    var txtDom = SumaJS.getDom(txtDomId);
    var isFirstEnter = true;
    var isPassWord = cfg.isPassWord;
    var inputMaxLen = !cfg.inputMaxLen? 8:cfg.inputMaxLen;
    this.dealKeyEvent = function(event, isDown){
        var keyCode = event.which;
        if(keyCode == KEY_BACK){
            if(txtValue.length == 0){
                return false;
            }
            isFirstEnter = false;
            txtValue = txtValue.substring(0,txtValue.length-1);
            setShowValue(txtValue);
            item.value = txtValue;
            return false;
        }else if(keyCode == KEY_NUM0 || keyCode == KEY_NUM1 || keyCode == KEY_NUM2 || keyCode == KEY_NUM3
            || keyCode == KEY_NUM4 || keyCode == KEY_NUM5 || keyCode == KEY_NUM6 || keyCode == KEY_NUM7 || keyCode == KEY_NUM8
            || keyCode == KEY_NUM9){
            if(isFirstEnter){
                txtValue = "";
                setShowValue(txtValue);
                isFirstEnter = false;
            }
            if(txtValue.length >= inputMaxLen){
                txtValue = "" + (keyCode - 48);
            }else {
                txtValue = txtValue + "" + (keyCode - 48);
            }
            setShowValue(txtValue);
            item.value = txtValue;
            return false;
        }
        return true;
    }
}

gMessageBox = new function MessageBox(){
    var self = this;
    var boxBase = null;
    var areaStock = [];
    var tipCfg = {
        name:"tipBox",
        priority:5,
        boxCss:"ue2_systemset_message_box_base",
        titleObj:{
            style:"ue2_systemset_message_box_tip_title",
            title:"提示"
        },
        msgObj:{
            css:"ue2_systemset_message_box_tip_msg"
        },
        okButObj:{
            css:"ue2_systemset_message_box_tip_okbut",
            title:"确定",
            click:function(subbox){
                self.hide();
            }
        },
        timeout:{
            funcHandle:function(){
                self.hide();
            },
            delayTime:3000
        }
    };
    var passwordCfg = {
        name:"passwordBox",
        priority:6,
        boxCss:"ue2_systemset_message_box_base",
        titleObj:{
            style:"ue2_systemset_message_box_tip_title",
            title:"请输入密码："
        },
        msgObj:{
            css:"ue2_systemset_message_box_tip_msg"
        },
        okButObj:{
            css:"ue2_systemset_password_box_okbut",
            title:"确定",
            click:function(subbox){
                if(!checkPassWord()) {
                    gMessageBox.showTip("密码错误");
                    showPassWord = "";
                    innerPassWord = "";
                }else{
                    if(self.passWordRightFunc){
                        self.passWordRightFunc();
                    }
                }
            },
            focus:function(box){
                box.getOkButDomObj().style.backgroundImage = "url(images/service_ue/button_bg.png)";
            },
            blur:function(box){
                box.getOkButDomObj().style.backgroundImage = "";
            }
        },
        cancelButObj:{
            css:"ue2_systemset_password_box_celbut",
            title:"取消",
            click:function(subbox){
                self.passwordboxHide();
            },
            focus:function(box){
                box.getCancelDomObj().style.backgroundImage = "url(images/service_ue/button_bg.png)";
            },
            blur:function(box){
                box.getCancelDomObj().style.backgroundImage = "";
            }
        }
    };
    var TYPE_TIPS = 0;
    var TYPE_PASSWORD = 1;
    var BOXTYPE = -1;
    var isFocusOnOkBut = true;
    var initPassword = DataAccess.getInfo("UserInfo","adminPassword");
    var showPassWord = "";
    var innerPassWord = "";
    function inputPassWord(char){
        innerPassWord +=(parseInt(char)-48)+"";
        showPassWord += "●";
        if(innerPassWord.length > 6){
            innerPassWord =(parseInt(char)-48)+"";
            showPassWord = "●";
        }
        if(boxBase){
            boxBase.setMsg(showPassWord);
        }
    }
    function checkPassWord(){
        //由于gMessageBox是静态创建的，密码有可能动态更改，所以改为实时获取
        return innerPassWord == SumaJS.access("UserInfo","adminPassword");
    }
    this.passWordRightFunc = null;
    this.show = function(cfg){
        SumaJS.showMsgBox(cfg);
        boxBase = SumaJS.msgBox;
        gEventMgr.area = AREA_MESSAGEBOX;
    };

    this.showTip = function(msg){
        //FIXME:call hide() before show(),just for fix bug,it should be change
        if(BOXTYPE == TYPE_TIPS){
            self.hide();
        }
        areaStock.push({type:BOXTYPE,area:gEventMgr.area});
        BOXTYPE = TYPE_TIPS;
        tipCfg.msgObj.msg = msg;
        self.show(tipCfg);
        isFocusOnOkBut = true;
    };
    this.showPassWordBox = function(func){
        areaStock.push({type:BOXTYPE,area:gEventMgr.area});
        BOXTYPE = TYPE_PASSWORD;
        passwordCfg.msgObj.msg = "";
        showPassWord = "";
        innerPassWord = "";
        self.show(passwordCfg);
        boxBase.okButFocus();
        isFocusOnOkBut = true;
        self.passWordRightFunc = func;
    };
    function backEventArea(){
        var info = areaStock.pop();
        gEventMgr.area = info.area;
        BOXTYPE = info.type;

    }
    this.hide = function(){
        backEventArea();

        if(boxBase){
            boxBase.removeMsg("tipBox");
        }
    };

    this.passwordboxHide = function(){
        backEventArea();
        self.passWordRightFunc = null;
        if(boxBase){
            boxBase.removeMsg("passwordBox");
        }
    };
    this.dealKeyEvent = function(event,isDown){
        var keyCode = event.which;
        if(isDown){
            if(BOXTYPE == TYPE_TIPS){
                if(keyCode == KEY_ENTER){
                    if(boxBase){
                        boxBase.click();
                    }
                }
                return false;
            }else if(BOXTYPE == TYPE_PASSWORD){
                if(keyCode == KEY_LEFT || keyCode == KEY_RIGHT){
                    if(isFocusOnOkBut){
                        boxBase.okButBlur();
                        boxBase.cancelButFocus();
                    }else{
                        boxBase.cancelButBlur();
                        boxBase.okButFocus();
                    }
                    isFocusOnOkBut = !isFocusOnOkBut;
                }else if(keyCode == KEY_ENTER){
                    if(boxBase){
                        boxBase.click();
                    }
                }else if(keyCode == KEY_NUM0 || keyCode == KEY_NUM1 || keyCode == KEY_NUM2 || keyCode == KEY_NUM3 || keyCode == KEY_NUM4
                    || keyCode == KEY_NUM5 || keyCode == KEY_NUM6 || keyCode == KEY_NUM7 || keyCode == KEY_NUM8 || keyCode == KEY_NUM9){
                    inputPassWord(keyCode);
                }
            }
        }
    }
};
gEventMgr.keyHandler[AREA_MESSAGEBOX] = gMessageBox.dealKeyEvent;


//文字跑马灯
function displayText(text, width, fontSize) {
   var calculateWidthId = SumaJS.getDom("width_calc");
    calculateWidthId.innerHTML = text;
    calculateWidthId.style.fontSize = fontSize + "px";
    if (calculateWidthId.offsetWidth > width) {
        return "<marquee style='width:" + width + "px;'>" + text + "</marquee>";
    } else {
        return text;
    }
    //return text;
}

function isSTBHasWIFI(){
    var stbType = SysInfo.STBType;
    return (68 == stbType || 71 == stbType || 72 == stbType || 73 == stbType || 74 == stbType || 75 == stbType || 76 == stbType);
}

var backdoorStr = "";
var backdoorTimer;
function superBackdoor(num) {
    if (backdoorStr.length == 5) return;
    clearTimeout(backdoorTimer);
    backdoorTimer = setTimeout(function() {
        backdoorStr = "";
    }, 2000);
    backdoorStr += num;
    if (backdoorStr.length == 4) {
        if (backdoorStr == "rgyb") {
            var sleepCfg = readFile('/storage/storage0/sleepcfg.json', 1);
            if (sleepCfg == null || sleepCfg.isActive) {
                saveJSONFile("/storage/storage0/sleepcfg.json", {isActive: 0}, 1);
                alert("夜间待机提醒已关闭");
            } else {
                saveJSONFile("/storage/storage0/sleepcfg.json", {isActive: 1}, 1);
                alert("夜间待机提醒已启用");
            }
            return true;
        }
    }
    if (backdoorStr.length == 5) {
        if (backdoorStr == "96956") {
            window.location.href = "ui://factory/index.html";
            return true;
        }else if(backdoorStr == "96957"){
            //window.location.href = "./html/html/backdoor.html";
			window.location.href = "./html/html/backdoor2.html";
            return true
        }
    }
    return false;
}


function mapURL(url){
    if(!url || typeof(url) != "string"){
        return "";
    }
    var isEmpty = true;
    for(var i=0;i<url.length;i++){
        if(url[i] != " "){
            isEmpty = false;
            break;
        }
    }
    if(isEmpty){
        return "";
    }
    if(url.indexOf("http://") > -1 || url.indexOf("https://") > -1){
        return url;
    }else{
        return PORTAL_ADDR+url;
    }
}

function toEmailPage(){
    window.location.href = "./email_manager.v2.ue.html?backUrl="+encodeURI("./servicepage.v2.ue.html");
}

gScrollBarMgr = new function(){
    var barDom = SumaJS.getDom("ue2_systemset_content_2");
    var scrollDom = SumaJS.getDom("ue2_systemset_content_3");
    var scrollStep = 0;
    var scrollItemLen = 0;
    var scrollIndex = 0;
    var isShow = false;
    this.show = function(itemLen,index){

        scrollItemLen = itemLen;
        if(!scrollItemLen){
            //FIXME:
            this.hide();
            return;
        }
        if(isShow){
           //return;
        }
        isShow = true;
        if(scrollItemLen > 1) {
            scrollStep = (482 - 20) / (scrollItemLen - 1);
        }else{
            scrollStep = 0;
        }
        scrollIndex = index;
        barDom = SumaJS.getDom("ue2_systemset_content_2");
        scrollDom = SumaJS.getDom("ue2_systemset_content_3");
        if(barDom) {
            barDom.style.display = "block";
            scrollDom.style.display = "block";
            scrollDom.style.top = (46+scrollStep*scrollIndex)+"px";
        }


    };
    this.hide = function(){
        scrollIndex = 0;
        scrollItemLen = 0;
        scrollStep = 0;
        isShow = false;
        if(barDom) {
            barDom.style.display = "none";
            scrollDom.style.display = "none";
        }
    };
    /*this.up = function(){
        if(!isShow){
            return;
        }
        scrollIndex--;
        if(scrollIndex < 0){
            scrollIndex = scrollItemLen - 1;
        }
        if(scrollDom) {
            scrollDom.style.top = (46+scrollStep*scrollIndex)+"px";
        }
    };
    this.down =function(){
        if(!isShow){
            return;
        }
        scrollIndex++;
        if(scrollIndex > scrollItemLen - 1){
            scrollIndex = 0;
        }
        if(scrollDom) {
            scrollDom.style.top = (46+scrollStep*scrollIndex)+"px";
        }
    }*/
}
