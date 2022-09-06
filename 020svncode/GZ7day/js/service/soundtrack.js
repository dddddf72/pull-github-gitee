/************************************* 多音轨 **********************************************/
var YinGui = {};
YinGui[4+""] = "Mpeg";
YinGui[3+""] = "Mpeg";
YinGui[6+""] = "AC3";
YinGui[129+""] = "AC3";
var playingAudioPid = 0;

function Soundtrack(){
	this.div = null;
	this.showTag = false;
	this.soundMode = 0;
	this.focusLR = 0;

	this.filepath = "/storage/storage0/soundtrack.json";
	this.soundtrackObj = {};

	this._init = function(){
		var tmp = readFile(this.filepath,3);
		if(tmp){
			try{
				this.soundtrackObj = JSON.parse(tmp);
				if(originalArray) {
					//删除已经不存在的频道音轨信息
					var sortArray = originalArray.ServiceSortInfo.ServiceSortArray;
					var sortObj = null;
					for(var i=0;i<sortArray.length;i++){
						sortObj[sortArray[i].ServiceHandle] = sortArray[i];
					}

					for(var j in this.soundtrackObj){
						if(typeof(sortObj[j]) == "undefined"){
							delete this.soundtrackObj[j];
						}
					}

				}
			}catch(e){
				SumaJS.debug("soundtrack : can parse soundtrack obj");
			}
		}
	};
	//this._init();
	this.saveSoundTrackObj = function(){
		//saveJSONFile(this.filepath,this.soundtrackObj,1);
	};

	this.getLastAudioPid = function(service){
		/*var pid = -1;
		var array = [];
		if(service.serviceHandle && service.audioArray){
			array = array.concat(service.audioArray);
			var lastPid = this.soundtrackObj[service.serviceHandle+""];
			for(var i=0;i<array.length;i++){
				if(lastPid == array[i].AudioPid){
					return lastPid;
				}
			}
		}*/
		//此函数每次切台调用，每次切台清空保持的pid
		if(service.serviceHandle){
			this.soundtrackObj[service.serviceHandle+""] = 0;
		}
		return -1;
	};

	this._findLastPlayingAudioPID = function(service){
		var serviceHandle = service.serviceHandle;
		if(this.soundtrackObj[serviceHandle+""]){
			var isFind = false;
			for(var i=0;i<this.yinguiArr.length;i++){
				if(this.soundtrackObj[serviceHandle+""] == this.yinguiArr[i].id){
					isFind = true;
					break;
				}
			}
			if(isFind){
				return this.yinguiArr[i].id;
			}else{
				this.soundtrackObj[serviceHandle+""] = this.yinguiArr[0].id;
				return this.yinguiArr[0].id;
			}
		}else{
			this.soundtrackObj[serviceHandle+""] = this.yinguiArr[0].id;
			return this.yinguiArr[0].id;
		}
	};
	this.show = function(){
		var Strems;
		this.yingui = 0;
		if(!SumaJS.globalPlayer){
			return false;
		}
		this.yinguiArr= new Array({"id":0,"no":0,"ge":"无"});
		if(currentService){
			Strems = currentService.audioArray;
			//SumaJS.debug("Soundtrack get audio track info streams = "+JSON.stringify("Strems = "+Strems));
			if(Strems instanceof Array) {
				for(var i=0;i<Strems.length;i++){
					this.yinguiArr[i]=	{"id":Strems[i].AudioPid,"no":i,"ge":Strems[i].AudioName || "未知"};
				}
			} else{
				this.yinguiArr= new Array({"id":Strems["AudioPid"],"no":0,"ge":Strems["AudioName"] || "未知"});
			}
		}
		this.showTag = true;
		playingAudioPid = this._findLastPlayingAudioPID(currentService);
		this.soundModeArr=new Array("stereo","mix","left","right");
		this.soundValueArr=new Array("立体声","混音","左声道","右声道");
		
		var mode = DataAccess.getInfo ("MediaSetting","soundMode");
		for(var i=0;i<this.soundModeArr.length;i++){
			if(this.soundModeArr[i] == mode){
				this.soundMode  = i;
			}
		}
		var html1 = "";
		var html2 = "";
		var tips ='';
		for(var i=0;i<this.yinguiArr.length;i++){
			if(this.yinguiArr[i].id == playingAudioPid){
				tips = "<img align='center' style='width:21px; height:21px;padding-bottom:4px;padding-left:5px;' src='images/soundtrack/yinguiplay.png' />";
				this.yingui = i;
			}else{
				tips ='';
			}
			html1 += "<div id='duoyingui_sd_"+i+"' style='width:286px; height:49px;line-height:49px;text-align:center;'>音轨"+this.yinguiArr[i].no+"["+this.yinguiArr[i].ge+"]"+tips+"</div>";
		}
		for(var i=0;i<this.soundValueArr.length;i++){

			html2 += "<div id='duoyingui_sc_"+i+"' style='width:164px; height:49px;line-height:49px;text-align:center;'>"+this.soundValueArr[i]+"</div>";
		}
		this.div = document.createElement("div");
		this.div.style.fontSize="22px";
		this.div.style.position = "absolute";
		this.div.style.background = "url(images/soundtrack/tip_box_yingui.png)";
		this.div.style.left = "394px";
		this.div.style.top = "260px";
		this.div.style.width = "549px";
		this.div.style.height = "336px";
		this.div.style.color = "#ffffff";
		this.div.style.zIndex = "85";
		this.div.innerHTML = "<div style='margin:96px 0px 0px 60px;width:260px;float:left;'>"+html1+"</div><div style='margin:96px 0px 0px 0px;width:164px;float:left;'>"+html2+"</div>";
		document.body.appendChild(this.div);
		//SumaJS.debug("STrack ALL html = "+document.body.outerHTML)
		this.left()
	}
	this.focus = function(_obj){
		_obj.style.background = "url(images/soundtrack/tip_box_yingui_focus2.png) center"

	}
	this.focused = function(_obj){
		//_obj.style.background = "url(images/soundtrack/tip_box_yingui_focus.png) center";
		_obj.style.color = "#fff799";

	}
	this.unfocus = function(_obj){
		_obj.style.background = "url()";
		_obj.style.color = "#ffffff";
	}
	this.left = function(){
		this.focusLR = 0;
		var rightObj = document.getElementById("duoyingui_sc_"+this.soundMode);
		var leftObj = document.getElementById("duoyingui_sd_"+this.yingui);
		this.unfocus(rightObj);
		this.focus(leftObj);
		this.focused(rightObj);
		leftObj.style.backgroundSize = "286px 86px";
		return false;
	}
	this.right = function(){
		this.focusLR = 1
		var rightObj = document.getElementById("duoyingui_sc_"+this.soundMode);
		var leftObj = document.getElementById("duoyingui_sd_"+this.yingui);
		this.unfocus(leftObj);
		this.focus(rightObj);
		this.focused(leftObj);
		rightObj.style.backgroundSize = "164px 86px";
		return false;
	}
	
	this.up = function(){
		if(this.focusLR==0){
			var leftObj = document.getElementById("duoyingui_sd_"+this.yingui);
			this.unfocus(leftObj);
			this.yingui--;
			this.yingui<0?this.yingui = this.yinguiArr.length-1:"";
			var leftObj = document.getElementById("duoyingui_sd_"+this.yingui);
			this.focus(leftObj);
			leftObj.style.backgroundSize = "286px 86px";
		}else{
			var rightObj = document.getElementById("duoyingui_sc_"+this.soundMode);
			this.unfocus(rightObj);
			this.soundMode--;
			this.soundMode<0?this.soundMode = this.soundValueArr.length-1:"";
			var rightObj = document.getElementById("duoyingui_sc_"+this.soundMode);
			this.focus(rightObj);
			rightObj.style.backgroundSize = "164px 86px";
		}
		return false;
	}
	this.down = function(){
		if(this.focusLR==0){
			var leftObj = document.getElementById("duoyingui_sd_"+this.yingui);
			this.unfocus(leftObj);
			this.yingui++;
			this.yingui>=this.yinguiArr.length?this.yingui = 0:"";
			var leftObj = document.getElementById("duoyingui_sd_"+this.yingui);
			this.focus(leftObj);
			leftObj.style.backgroundSize = "286px 86px";
		}else{
			var rightObj = document.getElementById("duoyingui_sc_"+this.soundMode);
			this.unfocus(rightObj);
			this.soundMode++;
			this.soundMode>=this.soundValueArr.length?this.soundMode = 0:"";
			var rightObj = document.getElementById("duoyingui_sc_"+this.soundMode);
			this.focus(rightObj);
			rightObj.style.backgroundSize = "164px 86px";
		}
		return false;
	}
	this.seletced = function(){
		this.hide();
		if(this.focusLR==1){
			var modeRet = DataAccess.setInfo ("MediaSetting","soundMode",this.soundModeArr[this.soundMode]);
			DataAccess.save("MediaSetting","soundMode");
			if(modeRet==1){ 
				showGlobalMsgBox("切换声道成功");	
			}else{
				showGlobalMsgBox("切换声道失败");
			}	
		}else{	
			if(this.yinguiArr[this.yingui].id==0){
				showGlobalMsgBox("切换音轨成功");
				return false;
			}
			var result = SumaJS.globalPlayer.mediaPlayer.changeAudio(this.yinguiArr[this.yingui].id);
			if(result==1){
				this.soundtrackObj[currentService.serviceHandle+""] = this.yinguiArr[this.yingui].id;
				DataCollection.collectData(["16",currentService.channelId+"",currentService.serviceId+"",currentService.networkId+"",currentService.transportStreamId+"",this.yinguiArr[this.yingui].ge]);
				playingAudioPid = this.yinguiArr[this.yingui].id;
				SumaJS.globalPlayer.mediaPlayer.refresh();
				showGlobalMsgBox("切换音轨成功");
			}else{
				showGlobalMsgBox("切换音轨失败");
			}
		}
		return false;
	}
	this.hide = function(){
		this.showTag = false;
		document.body.removeChild(this.div);
		this.saveSoundTrackObj();
	}
	this.eventHandler = function(event){
		//try{
		if(!this.showTag){return true}
		var val = event.keyCode||event.which;
		if(event.type == 1001) {
			return true;	
		}
		switch(val) {
			case KEY_DOWN:
				this.down();
				return false;
			case KEY_UP:
				this.up();
				return false;
			case KEY_LEFT:
				this.left();
				return false;
			case KEY_RIGHT:
				this.right();
				return false;
			case KEY_ENTER:
				this.seletced();
				return false;
			case KEY_ASTERISK:
			case KEY_TRACK:
			case KEY_BACK:
			case KEY_EXIT:
				this.hide();
				return false;
			default:
				return true;
		}
		
	}
}
var STrack = new Soundtrack();
SumaJS.eventManager.addEventListener("STrack", STrack, 60);
/*********************************************************************************************/