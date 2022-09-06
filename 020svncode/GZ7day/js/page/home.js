var homeObj = new function(){
	
	

	function checkNewMail(){  //检测是否有新邮件
		var mails = CA.getMails();
		if (mails) {
			for(var i=0;i<mails.length;i++){
				var mail = CAMails.getEmail(i);
				if(mail && mail.readFlag == 0){
					SumaJS.getDom("header_main_icon").style.display = "block";
					return;	
				}	
			}
		}
	}

	
	function showVersionLogo(){  //显示互动平台版本logo
		var ajaxParam = {
			url : PORTAL_ADDR+"/NewFrameWork/newWeb/images/flag.png",	
			method: "GET",
			data: "",
			success: function(){
				SumaJS.getDom("version_logo").innerHTML = "<img src='"+PORTAL_ADDR+"/NewFrameWork/newWeb/images/flag.png' width='100%' height='100%' onerror='this.style.display=\"none\";' />";	
				SumaJS.getDom("version_logo").style.display = "block";
			},
			failed: function(data){
				SumaJS.getDom("version_logo").style.display = "none";
			}
		};		
		SumaJS.ajax(ajaxParam);
	}

	function checkCard(){  //检测智能卡
		IcCard.checkICCard();
		var checkICCard = new IntervalTask(function(){
			IcCard.checkICCard();
		},IcCard.timeOut);
		SumaJS.globalTimerManager.add("checkICCard",checkICCard);
	}
	
	
	
	this.initial = function(){  //加载首页初始化
		StbFrontPanel.displayText("good");		
		//SysSetting.setEnv("PAGEFOCUSINDEX","home");	
		//currentService = null;
		SysSetting.setEnv("BACKTAGTPL","");
		SysSetting.setEnv("PORTAL_SEARCHURL","");
		
		//清空播放参数
		SysSetting.setEnv("playParam","");
		SysSetting.setEnv("lastServiceObj","");
		SysSetting.setEnv("changePage_playParam","");
		SysSetting.setEnv("play_channelId","");
		
		//checkCard();		//检查智能卡
		checkNewMail(); //检查是否有新邮件
		
		//把记忆频道存在内存中
		var offchannel = OffChannelObj.getOffChannel();
		OffChannelObj.saveOffChannelToM(offchannel);
		
		//showVersionLogo();  //显示互动平台版本logo
		//SumaJS.showDateTime("header_time","header_date"); //显示时间
		
		//图片预加载
		//SumaJS.preloadImages(imgArr["home1"]);				
		//DataCollection.collectData(["01","main://index.html?home",SysSetting.getEnv("SOURCE_PATH"),"主页"]);
		//SysSetting.setEnv("SOURCE_PATH","main://index.html?home");
	};

	this.destroy = function(){
		siMonitor.setFocusState(0);
		SumaJS.eventManager.removeEventListener("pageElementManage");
		SumaJS.eventManager.removeEventListener("siMonitor");
		if(SumaJS.msgBox) {
			SumaJS.eventManager.removeEventListener("messageBox");
			SumaJS.msgBox = null;
		}
		SumaJS.globalTimerManager.clearAll();
	}
};
