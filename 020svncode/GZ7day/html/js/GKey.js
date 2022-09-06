// JavaScript Document
//document.addEventListener("keypress",GKey,true);
document.onkeypress = LKey;//GKey;
//document.onkeyup = LKey;
//document.onkeydown = DKey;
//if(PORTAL_SUB_ADDR_IMG){var PORTAL_SUB_ADDR_IMG=".."}
//var PORTAL_SUB_ADDR_IMG = "../"
//var portRoot = ".."
var GKeyLastKey = 0;
var GKeyRekeyTimes = 0;
var ci = 0;
var di = 0;
var ei = 0;
var Need_Confirm = false;
var LongKeyTag = true;
var DKeyReturn = true;
function DKey(event){
	var val = event.which|event.keyCode;
	//debug("按下按键:val:"+val+"/"+ei++)
	//LongKeyTag = false
	return DKeyReturn;
}
function debug(_val){
	//try{
	var val = document.getElementById("debug").innerHTML;
	document.getElementById("debug").innerHTML = val+_val;
	//}catch(e){
		//alert(_val)
	//}
}
function debug2(_val){
	//try{
	document.getElementById("debug2").innerHTML = _val;
	//}catch(e){
		//alert(_val)
	//}
}
function debug3(_val){
	//try{
	document.getElementById("debug3").innerHTML = _val;
	//}catch(e){
		//alert(_val)
	//}
}

//var grabEvent = function(event){return true;}
var GKeyRetrun = false;
var GKeyReturnBack = false;
var GKeyReturnExit = false;
var GKeyReturnUDLR = true;
var GKey2LKey = false;
function GKey(event){
	var val = event.which|event.keyCode;
	//debug2("按住按键:val:"+val+"/"+ei+++"/"+GKeyRekeyTimes)
	if(val==GKeyLastKey){
		GKeyRekeyTimes++;
		//debug("GKey:GKeyRekeyTimes:"+GKeyRekeyTimes)
	}else{
		LongKeyTag = false;
		GKeyRekeyTimes = 0;	
	}
	GKeyLastKey = val;
	if(val == ROC_IRKEY_BACK){
		return GKeyReturnBack;
	}
	if(val == ROC_IRKEY_EXIT&&GKeyRekeyTimes<=2){
		return GKeyReturnExit;
	}
	if((val == ROC_IRKEY_DOWN||val == ROC_IRKEY_UP||val == ROC_IRKEY_LEFT||val == ROC_IRKEY_RIGHT)&&GKeyRekeyTimes<=2){
		return GKeyReturnUDLR;
	}
	if(GKeyRekeyTimes>2){
		//对长按键进行特殊处理
		switch(val){
			case ROC_IRKEY_EXIT:
				LongKeyTag = true;
				//window.location.href = "http://"+$J.access("VodApp","PortalAddress");
				SysSetting.setEnv("PORRAL_EXIT","exit");
				var mianAddr = SysSetting.getEnv("MAIN_ADDR")
				if(mianAddr!=""){
					window.location.href = mianAddr;
				}else{
					window.location.href = "main://index.html";
				}
				return GKeyReturnExit;
			break;
			case ROC_IRKEY_DOWN:
			case ROC_IRKEY_UP:
			case ROC_IRKEY_LEFT:
			case ROC_IRKEY_RIGHT:
			case ROC_IRKEY_CHANNEL_DOWN:
			case ROC_IRKEY_CHANNEL_UP:
			case ROC_IRKEY_VOLUME_DOWN:
			case ROC_IRKEY_VOLUME_UP:
				LongKeyTag = false;
				GKey2LKey = true;
				LKey(event);
			break;
		}
	}
	return GKeyRetrun;
}
function SendCustomEvent(event){ 
    LongKeyTag = false;
	LKey(event);
}
function LKey(event){
	console.debug("===============================event.which = " + event.which);
	if(globalAlert.events(event)){
		  if(passwordFrame.events(event)){
			if(DYG.keyHandle(event)){
				if(backDoor.check(event)){
					if(globalVolEvent(event)){
						if(grabEvent(event)){
							if(globalKeyFunc(event)){
								if(globalQuickFunc(event)){
									return true;
									
								}
							}
						}
					}
				}
			}
		 }
	}
	return false;
}



//全局按键控制
function globalMail(event){
	var val=event.which|event.keyCode;
			switch(val){
			case ROC_IRKEY_EXIT:
			case ROC_IRKEY_BACK:
			case ROC_IRKEY_SELECT:
			document.getElementById("mail_s").style.visibility="hidden";
			}
			setTimeout("mails_hide()",15000);
}
function mails_hide(){
	document.getElementById("mail_s").style.visibility="hidden";
	}
var globalVolumeBar = null;

function globalKeyFunc(event){
	var val = event.which|event.keyCode;
	switch(val){
		case ROC_IRKEY_BACK:
			window.open('http://10.10.30.28','_self');
			 add_back();
			 return false;
		break;
		case ROC_IRKEY_EXIT:
			add_exit();
			return false;
		break;
		case ROC_IRKEY_VOLUME_UP:
			VOLUME_HANDLE.volumeUp();
		break;
		case ROC_IRKEY_VOLUME_DOWN:
			VOLUME_HANDLE.volumeDown();
		break;
		case ROC_IRKEY_VOLUME_MUTE:
		  VOLUME_HANDLE.setMute();
		break;
	}
	return true;
}
function globalVolEvent(event) {
	var currUrl = window.location.href;
	if(currUrl.indexOf("playTv.v2.html") >=0 || currUrl.indexOf("ChanList.v2.html") >=0 || currUrl.indexOf("EPG.v2.html") >=0 || currUrl.indexOf("nvod_play.v2.html") >=0 || currUrl.indexOf("nvod_sort_ext.v2.html") >=0){
		return true;	
	}
	var val = event.which|event.keyCode;
	switch(val){
		case ROC_IRKEY_BACK: 
		case ROC_IRKEY_EXIT:
		case ROC_IRKEY_SELECT:
			if(globalVolumeBar&&globalVolumeBar.isDisplay) {
				globalVolumeBar.hideVolumeBar();
				return false;
			}
		break;
		case ROC_IRKEY_VOLUME_UP:
			globalVolumeBar.volumeUp();
			return false;
		break;
		case ROC_IRKEY_VOLUME_DOWN:
			globalVolumeBar.volumeDown();
			return false;
		break;
		case ROC_IRKEY_VOLUME_MUTE:
			//globalVolumeBar.setMute();
			return false;
		break;
	}
	return true;
}
//添加全局快捷键控制
function globalQuickFunc(event){
	var val = event.which|event.keyCode;
	switch(val){
		case ROC_IRKEY_TRACK:
		case 313:
		case ROC_IRKEY_ASTERISK:
			 if(ADD_PA!="index")
			 DYG.show();
			 return false;
		break;
		case ROC_IRKEY_EPG:
		case 37:
			if(Need_Confirm){
			   globalAlert.init({"val":"是否进入节目指南?","btnInfo":[{"name":"确认","callBack":function(){ KeyFun.Shortcut("EPG");}},{"name":"取消","callBack":null}],"timeout":0});
			}else{
			   KeyFun.Shortcut("EPG");
			}
		break;
		case ROC_IRKEY_LIKE:
		    if(Need_Confirm){
			   globalAlert.init({"val":"是否进入喜爱节目?","btnInfo":[{"name":"确认","callBack":function(){ KeyFun.Shortcut("FAVORITE");}},{"name":"取消","callBack":null}],"timeout":0});
			}else{
			    KeyFun.Shortcut("FAVORITE");
			}
		   
		break;
		case ROC_IRKEY_MAIL:
		    if(Need_Confirm){
				globalAlert.init({"val":"是否进入电视邮箱?","btnInfo":[{"name":"确认","callBack":function(){ KeyFun.Shortcut("EMAIL");}},{"name":"取消","callBack":null}],"timeout":0});
			}else{
			     KeyFun.Shortcut("EMAIL");
			}
		    
		break;
		case 80:
			if (window.location.href.indexOf("playTv.v2.html") >= 0) {
				return false;	
			}
		    if(Need_Confirm){
				globalAlert.init({"val":"是否进入直播电视?","btnInfo":[{"name":"确认","callBack":function(){ KeyFun.Shortcut("BROADCAST");}},{"name":"取消","callBack":null}],"timeout":0});
			}else{
			     KeyFun.Shortcut("BROADCAST");
			}
		break;	
		case 1:
			
		break;
	}
	return true;
}
//全局alert框组件
function globalAlertFunc(){
  this.div = null;
  this._Json = null;
  this.focusBtn = 0;
  this.personalityTimeout = -1;
  this.changeText = function(text){
    document.getElementById("tip_box_text_global").innerHTML=text;
  }
  this.initdiv = function(){
	  var div0;
	 if(this.div==null){ 
       div0 = document.createElement("div");
	   div0.id="tip_box_bg_global";
	   div0.className="tip_box_bg";	
	   div0.style.zIndex = 9999;
	   this.div = div0;
	 }else{
	   this.div.innerHTML="";
	   div0 = this.div;
	 }
	 var div1 = document.createElement("div");
	 div1.id="tip_box_title_global";
	 div1.className="tip_box_title";
	 div1.innerHTML="提 示";
	 
	 var div2 = document.createElement("div");
	 this.textdiv = div2;
	 div2.id="tip_box_text_global";
	 div2.className="tip_box_text";
	 div2.innerHTML=this._Json.val;
	 div0.appendChild(div1);
	 div0.appendChild(div2);

	   if(this._Json.btnInfo!=null){
		 var div3 = document.createElement("div");
		 if(this._Json.btnInfo.length==1){
			div3.className="tip_box_button_alert_focus";
		 }else if(this._Json.btnInfo.length==2){
		    div3.className="tip_box_button_focus_01";
		 }
		  div3.id="tip_box_btn_global_01";
		  div3.innerHTML = this._Json.btnInfo[0].name;
		  div0.appendChild(div3);
	    
		if(this._Json.btnInfo.length==2){
			div4 = document.createElement("div");
			div4.className="tip_box_button_blur_02";
			div4.id="tip_box_btn_global_02";
		    div4.innerHTML = this._Json.btnInfo[1].name
			div0.appendChild(div4);	
		 }
	   }
	 	document.body.appendChild(div0);
  }
  this.init = function(_Json){
	    this._Json = _Json;
		this.focusBtn = 0;
        this.personalityTimeout = -1;
		this.initdiv()
		this.timeout = _Json.timeout;
		this.timeoutCallBack = _Json.TCB||function(){};
		this.left();
		this.show();
	}
	
  this.show = function(){
		this.div.style.display="block";
		this.div.style.visibility="visible";
		this.showTag = 1;
		clearTimeout(this.timeoufunc);
		clearTimeout(this.personalityTimeout);
		if(this.timeout>0&&this.timeout!=null){
			//try{
			this.timeoufunc = setTimeout("globalAlert.timeoutFunc()",this.timeout)
			//}catch(e){alert(e.message)}
		}
		
	}
	this.timeoutFunc  = function(){
		this.hide();
		this.timeoutCallBack();
		
	}
	this.hide = function(){
		if(this.div!=null){
		this.showTag = 0;
		this.div.style.display="none";
		this.div.style.visibility="hidden";
		clearTimeout(this.personalityTimeout);
		clearTimeout(this.timeoufunc);			
		}
	}
	this.left = function(){
	   if(this._Json.btnInfo!=null){
		if(this.focusBtn>0){
		  $("tip_box_btn_global_0"+(this.focusBtn+1)).className = "tip_box_button_blur_02";
		     this.focusBtn--;
		  $("tip_box_btn_global_0"+(this.focusBtn+1)).className = "tip_box_button_focus_01";
		}
	   }
	}
	this.right = function(){
	  if(this._Json.btnInfo!=null){
		if(this.focusBtn<this._Json.btnInfo.length-1){
		   $("tip_box_btn_global_0"+(this.focusBtn+1)).className = "tip_box_button_blur_01";
		     this.focusBtn++;
		   $("tip_box_btn_global_0"+(this.focusBtn+1)).className = "tip_box_button_focus_02";
		}
	  }
    }
	this.ok = function(){
	   if(this._Json.btnInfo!=null){
		 	this.hide();
			if(this._Json.btnInfo[this.focusBtn].callBack){
				(this._Json.btnInfo[this.focusBtn].callBack)();
	   	}
	  }
	}
	this.events = function(event){
		var val = event.which|event.keyCode;
		if(this.showTag){
			if(this._Json.btnInfo==null&&!this._Json.topMsg){
			   return true;
			}
			switch(val){
				case ROC_IRKEY_LEFT:
					this.left();
					return false;
				break;
				case ROC_IRKEY_RIGHT:
					this.right();
					return false;
				break;
				case ROC_IRKEY_SELECT:
					this.ok();
					return false;
				break;	
				default:
				  if(this._Json.topMsg==null||this._Json.topMsg){
			    		return false;
				  }else{
				    return true;
			      } 
				break;
			}	
			
		}else{
			return true;	
		}
	}
	this.showTag = false;
	this.selects = false;
}

var globalAlert = new globalAlertFunc();

function grabEvent(){
	return true;
}

//-------------多音轨---------------------
var YinGui = {};
YinGui[4+""] = "Mpeg";
YinGui[3+""] = "Mpeg";
YinGui[6+""] = "AC3";
YinGui[129+""] = "AC3"
var playingAudioPid = 0;
function duoyingui(){
	this.div = null;
	this.showTag = false;
	this.soundMode = 0;
	this.focusLR = 0;
	this.show = function(){
		var Strems ;
		this.yingui = 0;
		if(page.mediaPlayer.id == ""){
			return false;
		}
		this.yinguiArr= new Array({"id":0,"no":0,"ge":"无"});
		if(playTvObj){
			if(new Boolean(playTvObj.playService)==true){
				Strems =playTvObj.playService.AudioArray; 
				if(Strems instanceof Array){
					for(var i=0;i<Strems.length;i++){
						this.yinguiArr[i]=	{"id":Strems[i].AudioPid,"no":i,"ge":Strems[i].AudioName || "未知"};
					}
				}else{
					this.yinguiArr= new Array({"id":Strems["AudioPid"],"no":0,"ge":Strems["AudioName"] || "未知"});
				}
			}
		}
		this.showTag = true;
		
		this.soundModeArr=new Array("stereo","mix","left","right")
		this.soundValueArr=new Array("立体声","混音","左声道","右声道")
		
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
					tips = "<img align='absmiddle' src='../images/yinguiplay.png' />";
					this.yingui = i;
			}else{
					tips ='';
			}
			html1 += "<div id='duoyingui_sd_"+i+"' style='width:228px; height:48px; line-height:48px;'>&nbsp;&nbsp;&nbsp;音轨"+this.yinguiArr[i].no+"&nbsp;["+this.yinguiArr[i].ge+"]"+tips+"</div>";
		}
		for(var i=0;i<this.soundValueArr.length;i++){
			html2 += "<div id='duoyingui_sc_"+i+"' style='width:228px; height:48px; line-height:48px;'>&nbsp;&nbsp;"+this.soundValueArr[i]+"</div>";
		}
		this.div = document.createElement("div");	
		this.div.style.fontSize="24px";	
		this.div.style.position = "absolute";
		this.div.style.background = "url(../images/tip_box_yingui.png)";
		this.div.style.right = "400px";
		this.div.style.top = "160px";
		this.div.style.width = "480px";
		this.div.style.height = "290px";
		this.div.style.color ="#ffffff";
		this.div.innerHTML = "<div style='margin-top:70px; margin-left:10px;width:235px;float:left;background:;'>"+html1+"</div><div style='margin-top:70px;width:235px;float:left;background:;'>"+html2+"</div>";
		document.body.appendChild(this.div);
		this.left()
	}	    
	this.focus = function(_obj){
		_obj.style.background = "url(../images/tip_box_yingui_focus2.png)"
	}
	this.focused = function(_obj){
		_obj.style.background = "url(../images/tip_box_yingui_focus.png)"
	}
	this.unfocus = function(_obj){
		_obj.style.background = "url()";
	}
	this.left = function(){
		this.focusLR = 0;
		var rightObj = document.getElementById("duoyingui_sc_"+this.soundMode);
		var leftObj = document.getElementById("duoyingui_sd_"+this.yingui);
		this.focus(leftObj);
		this.focused(rightObj);
		return false;
	}
	this.right = function(){
		this.focusLR = 1
		var rightObj = document.getElementById("duoyingui_sc_"+this.soundMode);
		var leftObj = document.getElementById("duoyingui_sd_"+this.yingui);
		this.focus(rightObj);
		this.focused(leftObj);
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
		}else{
			var rightObj = document.getElementById("duoyingui_sc_"+this.soundMode);
			this.unfocus(rightObj);
			this.soundMode--;
			this.soundMode<0?this.soundMode = this.soundValueArr.length-1:"";
			var rightObj = document.getElementById("duoyingui_sc_"+this.soundMode);
			this.focus(rightObj);
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
		}else{
			var rightObj = document.getElementById("duoyingui_sc_"+this.soundMode);
			this.unfocus(rightObj);
			this.soundMode++;
			this.soundMode>=this.soundValueArr.length?this.soundMode = 0:"";
			var rightObj = document.getElementById("duoyingui_sc_"+this.soundMode);
			this.focus(rightObj);
		}
		return false;
	}
	this.seletced = function(){
		this.hide();
		if(this.focusLR==1){
			var modeRet = DataAccess.setInfo ("MediaSetting","soundMode",this.soundModeArr[this.soundMode]);
			DataAccess.save("MediaSetting","soundMode");
			if(modeRet==1){ 
				showErrorMsg("切换声道成功");	
			}else{showErrorMsg("切换声道失败");}	
		}else{	
			if(this.yinguiArr[this.yingui].id==0){
				showErrorMsg("切换音轨成功");
				return false;
			}
			var result = page.mediaPlayer.player.changeAudio(this.yinguiArr[this.yingui].id);
			if(result==1){
				playingAudioPid = this.yinguiArr[this.yingui].id;
				page.mediaPlayer.player.refresh();
				showErrorMsg("切换音轨成功");
			}else{
				showErrorMsg("切换音轨失败");
			}
		}
		return false;
	}
	this.hide = function(){
		this.showTag = false;
		document.body.removeChild(this.div);
	}
	this.keyHandle = function(event){
		//try{
		if(!this.showTag){return true}
		var val = event.which|event.keyCode;
		switch(val){
			case ROC_IRKEY_DOWN:
				this.down();
			break;
			case ROC_IRKEY_UP:
				this.up();
			break;
			case ROC_IRKEY_LEFT:
				this.left();
			break;
			case ROC_IRKEY_RIGHT:
				this.right();
			break;
			case ROC_IRKEY_SELECT:
				this.seletced();
			break;
			case ROC_IRKEY_ASTERISK:
			case ROC_IRKEY_TRACK:
			case ROC_IRKEY_BACK:
			case ROC_IRKEY_EXIT:
				this.hide();
			break;
		}
		//}catch(e){
			//alert(e.message)
		//}
	}
}
var DYG = new duoyingui();

//----------------------------------


var Shortcutkey = {
	"EPG":{href:"/index.html"},
	"EMAIL":{href:"/html/html/email_manager.v2.html"},
	"FAVORITE":{href:"/index.html"},
	"BROADCAST":{href:"/index.html"}
	};

var KeyFun = {
	   Shortcut:function(tag){ //快捷键
			switch(tag){
				case "EPG":
					SysSetting.setEnv("PAGEFOCUSINDEX","epg_page");
					break;
				case "EMAIL":
					break;
				case "FAVORITE":
					SysSetting.setEnv("PAGEFOCUSINDEX","liketv");
					break;
				case "BROADCAST":
					var temp = SysSetting.getEnv("OFF_CHANNEL");
					if(temp){
						temp = JSON.parse(temp);
						if(temp.serviceType == 2){
							SysSetting.setEnv("OFF_CHANNEL","");
						}
					}				
					SysSetting.setEnv("PAGEFOCUSINDEX","play_tv");
					break;
				default:
					break;
			}
			SysSetting.setEnv("MAINPAGE", "1");
			window.location.href=portRoot+Shortcutkey[tag].href;
		}
};

var backDoor = {	
	"index":0,
	"quick":backDoorQuick,
	"check":function(event){
		//try{
		var returnTag = 1;
		for(i in this.quick){
			var tag = this.checkKey({"type":i,"val":(event.which|event.keyCode)})
			tag == 0?returnTag = 0:"";
		}
		return returnTag;
		//}catch(e){alert(e.message)}
	},
	"checkKey":function(_obj){
		if(ADD_PA==this["quick"][_obj.type]["pa"]||this["quick"][_obj.type]["pa"]=="all"){
			this["quick"][_obj.type].index == null?this["quick"][_obj.type].index =0:"";
			if(_obj.val == this["quick"][_obj.type]["key"][this["quick"][_obj.type].index]){
				this["quick"][_obj.type].index++;
				//$("welcomeMsg").innerHTML=("type:"+_obj.type+" index:"+this["quick"][_obj.type].index)
				if(this["quick"][_obj.type].index == this["quick"][_obj.type]["key"].length){
					//alert(this["quick"][_obj.type].url)
					if(this["quick"][_obj.type].url!=null){
						location.href = this["quick"][_obj.type].url;
					}
					if(this["quick"][_obj.type].fun!=null){
						this["quick"][_obj.type].fun();
					}
					return 0;
				}
			}else{
				this["quick"][_obj.type].index = 0;
				return 1;
			}
		}
	}
}


/*********音量偏差标准计算*****************/
/*音量补偿范围*/
var VOLUME_COMPENSATION_RANGE=[-16,16];
/*音量初始化的标准值*/
var G_STANDARD_VOLUME_VALUE=16;

var VOLUME_HANDLE = {
	  /*设置频道的音量补偿值*/
	  handleVolumeCompensation:function(channel,volume){
		   channel.volume = volume;
	  },
	  initVolume:function(channel){
		  var volume ;
		  //try{
			 if(typeof(channel)=="undefined"){
				  volume = VOLUME_HANDLE.getStandardVolume();
				  VOLUME_HANDLE.executeVolume(volume);
			  }else{
			     if(VOLUME_HANDLE.enableGlobalVolume()){
				   volume = VOLUME_HANDLE.getStandardVolume();
				   //alert(VOLUME_HANDLE.getRealVolume(channelInfoObj[channel.ServiceHandle].offset));
				   VOLUME_HANDLE.executeVolume(VOLUME_HANDLE.getRealVolume(channelInfoObj[channel.ServiceHandle].offset));
				 }else{
				   volume = channelInfoObj[channel.ServiceHandle].volume;  
				   //alert("111" + volume); 
				   VOLUME_HANDLE.executeVolume(volume);
			   }
			 }	 
		 // }catch(e){
			 //  $J.debug.msg("音量初始化错误:"+e.message); 
		  //}
		    return volume;
		  },
	  /*统一控制时根据音量补偿得到实际音量并生效音量*/
	  getRealVolume:function(compensation){
		  // try{
		    var globalVolume = VOLUME_HANDLE.getStandardVolume();
			var volume;
			if(globalVolume!=0){
			     volume = globalVolume+(parseInt(compensation));  				 
			     volume = volume>32?32:(volume<0?0:volume);		
			}else{
				 volume=0;
			}
		 // }catch(e){
			  // $J.debug.msg("单独控制音量获取实际音量错误:"+e.message); 
		  //}
		  	return volume;
		  },
	  /*改变统一音量值*/
	  setStandardVolume:function(volume){
		  	DataAccess.setInfo("VodApp","QAMName4",volume+"");
		 	DataAccess.save ("VodApp","QAMName4");
			//channelInfoObj["GlobalVolume"] = volume;
		  },	  
	  /*得到统一音量值*/
	  getStandardVolume:function(){
		  	 var volume = DataAccess.getInfo ("VodApp","QAMName4");
			 if(volume!=""&&volume!=null&&typeof(volume)!="undefined"){
			  	volume = parseInt(volume);
			  }else{
				VOLUME_HANDLE.setStandardVolume(G_STANDARD_VOLUME_VALUE);
			  	volume = G_STANDARD_VOLUME_VALUE;
			  }
		  	 return parseInt(volume);
			// return  channelInfoObj["GlobalVolume"];
		  },
	  /*生效当前音量*/
	  executeVolume:function(volume){	  
		     DataAccess.setInfo("MediaSetting", "OutputVolumn", volume+"");
             DataAccess.save("MediaSetting", "OutputVolumn");
			// $J.debug.msg("音量设置:"+volume); 
		  },
	  /*音量是否统一控制*/
	  enableGlobalVolume:function(){
		    return parseInt(DataAccess.getInfo("MediaSetting", "enableGlobalVolumn"))==1?true:false;
			//return channelInfoObj["IsGlobalVolume"] == 1?true:false;
			 
		  },
	  /*增加音量*/
	  volumeUp:function(channel){
		  VOLUME_HANDLE.setMute("hide");
	  		var val ;
			if(VOLUME_HANDLE.enableGlobalVolume()||typeof(channel)=="undefined"){
				val = VOLUME_HANDLE.getStandardVolume();
				val = val<32?++val:32;
				VOLUME_HANDLE.setStandardVolume(val);
				if(typeof(channel)=="undefined"){
					VOLUME_HANDLE.executeVolume(val);
				}else{
					VOLUME_HANDLE.executeVolume(VOLUME_HANDLE.getRealVolume(channelInfoObj[channel.ServiceHandle].offset));
				}
			}else{
				val =parseInt(channelInfoObj[channel.ServiceHandle].volume);
				val = val<32?++val:32;
				channelInfoObj[channel.ServiceHandle].volume = val;
				VOLUME_HANDLE.executeVolume(val);
			}
			return val;
	 	 },
	   /*减少音量*/
	  volumeDown:function(channel){
		    VOLUME_HANDLE.setMute("hide");
		    var val;
			if(VOLUME_HANDLE.enableGlobalVolume()||typeof(channel)=="undefined"){
				val = VOLUME_HANDLE.getStandardVolume();
				val = val>0?--val:0;
				VOLUME_HANDLE.setStandardVolume(val);
				if(typeof(channel)=="undefined"){
				  VOLUME_HANDLE.executeVolume(val);
				}else{
				  VOLUME_HANDLE.executeVolume(VOLUME_HANDLE.getRealVolume(channelInfoObj[channel.ServiceHandle].offset));
				}
			}else{ 
				val =parseInt(channelInfoObj[channel.ServiceHandle].volume);
				val = val>0?--val:0;
				channelInfoObj[channel.ServiceHandle].volume = val;
				VOLUME_HANDLE.executeVolume(val);	
			}		
			return val;
		  }, 
		//updateVolume:function(){
		    //var channels = G_INFO_FILTER_CHANNEL_TYPE.getChannel("chan_all",2);
		    //for(var i=0;i<channels.length; i++){
			  //if(VOLUME_HANDLE.enableGlobalVolume()){
				//var volume = ODVB.getChannelsVolume(channels[i].getService().serviceID);				
				//channels[i].volume=VOLUME_COMPENSATION_RANGE[1] + volume;/**初始化频道的音量偏差都为0**/
			  //}else{
				//channels[i].volume=G_STANDARD_VOLUME_VALUE;	   /**音量单独控制时*/
			  //}
			//}
	   //},
	   //设置静音，打开静音
	  setMute:function(tag){
		 
		 var mute = -1;
		 //try{
			 mute = page.mediaPlayer.player.getMute();
		    if(mute ==1||(tag!=null&&tag=="hide")){//当前是静音
				 //显示图标
				 $J.debug.msg("关闭静音"); 
				  page.mediaPlayer.player.audioUnmute();
				  VOLUME_HANDLE.showOrHideMuteDiv();
			 }else if(mute==0){
				 $J.debug.msg("设置为静音"); 
				 page.mediaPlayer.player.audioMute();
				VOLUME_HANDLE.showOrHideMuteDiv();		 
			 }
		// }catch(e){
			 //$J.debug.msg("设置或起用静音失败，原因:"+e.message); 
		 //}
		  
	  },
	  //取得页面上静音div
	  getMuteDiv : function(){
		  var muteDiv = document.getElementById("Mute_Div");
		  return muteDiv;
	  },
	  //取得当前是否为静音
	  getMute:function(){
		  var mute = -1;
		  //try{
			  mute = page.mediaPlayer.player.getMute();
			  if( mute ==1){ return true;}
			  return false;
		 // }catch(e){
			   // $J.debug.msg("取得是否为静音，原因:"+e.message); 
		 // }
	  },
	  showOrHideMuteDiv:function(){
			//try{ 
				var muteDiv = VOLUME_HANDLE.getMuteDiv();
				if(VOLUME_HANDLE.getMute()){
					if( typeof(muteDiv) != "undefined" ){
						 muteDiv.style.display = "block";
						 muteDiv.style.visibility = "visible"; 
					}
				}else{
					if( typeof(muteDiv) != "undefined" ){
						 muteDiv.style.display = "none";
						 muteDiv.style.visibility = "hidden"; 
					}
				} 
			//}catch(e){
				//try{$J.debug.msg("call showOrHideMuteDiv() error:"+e.message);}catch(e1){}	
			//}
		   }

	}
	

//全局管理员密码确认
var  passwordFrame = new passwordFrameFunc();

function passwordFrameFunc(){
	   this.div = null;	
	   this.showTag = false;
	   this.selects = false;
	   this.topMsg = true;
	   this.initdiv = function(){
		var div0 = document.createElement("div");
		this.div = div0;
		div0.id="password_box";
		div0.className="tip_box_bg";	
		//div0.style.background="url('"+PORTAL_SUB_ADDR_IMG+"/images/tip_box.png')";
		div0.style.zIndex = 9999;
		var div1 = document.createElement("div");
		div1.id="password_box_msg";
		div1.className="tip_box_title";
		div1.innerHTML="请输入密码:";
		var div2 = document.createElement("div");
		this.textdiv = div2;
		div2.id="password_box_text";
		div2.className="tip_box_text";
		div2.innerHTML="&nbsp;";
		var div3 = document.createElement("div");
		div3.className="tip_box_button_01";
		
		var leftImg =  document.createElement("img");
		//leftImg.className="tip_box_button_01";
		leftImg.id="password_box_left";
		leftImg.src=PORTAL_SUB_ADDR_IMG+"/images/determine_02.png";
		leftImg.width=190;
		leftImg.height=60;
		div3.appendChild(leftImg);
		
		var div4 = document.createElement("div");
		div4.className="tip_box_button_02";
		
		var rightImg =  document.createElement("img");
		rightImg.id="password_box_right";
		//rightImg.id="tip_box_button_02";
		rightImg.src=PORTAL_SUB_ADDR_IMG+"/images/cancel.png";
		rightImg.width=190;
		rightImg.height=60;
		div4.appendChild(rightImg);
		
		div0.appendChild(div1);
		div0.appendChild(div2);
		div0.appendChild(div3);
		div0.appendChild(div4);
		document.body.appendChild(div0);			
	  }
	  
	  this.init = function(_Json){
		if(this.div == null){
			this.initdiv()
		}
		this.topMsg = _Json.topMsg==null?true:_Json.topMsg;
		this.password = "";
	    this.replacePwd = ""
		this.initPassword = DataAccess.getInfo("UserInfo","adminPassword");
		if(this.initPassword==""||this.initPassword==null){
			this.initPassword = G_INIT_PASSWORD;
			DataAccess.setInfo ("UserInfo","adminPassword",G_INIT_PASSWORD);
			DataAccess.save("UserInfo","adminPassword");
		}
		this.sbtn = PORTAL_SUB_ADDR_IMG+"/images/determine.png";
		this.fbtn = PORTAL_SUB_ADDR_IMG+"/images/cancel.png";
		this.sfbtn = this.sbtn.replace(/[.]png$/,"_02.png");
		this.ffbtn = this.fbtn.replace(/[.]png$/,"_02.png");
		this.trueCallBack = _Json.SCB||function(){};
		this.falseCallBack = _Json.FCB||function(){};
		$("password_box_text").innerHTML="";
		this.left();
		this.show();
	}
	this.show = function(){
		this.div.style.display="block";
		this.div.style.visibility="visible";
		this.showTag = true;
	}
	this.hide = function(){
		if(this.div!=null){
		this.showTag = false;
		this.div.style.display="none";
		this.div.style.visibility="hidden";	
		}
	}
	this.left = function(){
		this.selects = true;
		 $("password_box_left").src = this.sfbtn;
		 $("password_box_right").src = this.fbtn;		
	}
	this.right = function(){
		this.selects = false;
	     $("password_box_left").src = this.sbtn;
		 $("password_box_right").src = this.ffbtn;
	}
	this.ok = function(){		
		if(this.selects){
			if(this.password==this.initPassword){
				this.hide();
				this.trueCallBack();
			}else{
				this.password ="";
				this.replacePwd = "";
				$("password_box_text").innerHTML="密码错误！";
			}
					
		}else{
			this.hide();
			this.falseCallBack();
			
		}
		
	}
	this.events = function(event){
		var val = event.which|event.keyCode;
		if(this.showTag){
			switch(val){
				case ROC_IRKEY_LEFT:
					this.left();
					return false;
				break;
				case ROC_IRKEY_RIGHT:
					this.right();
					return false;
				break;
				case ROC_IRKEY_SELECT:
					this.ok();
					return false;
				break;
				case ROC_IRKEY_BACK:
					if(this.password.length>0){
						this.password =this.password.slice(0,this.password.length-1);
						this.replacePwd = this.replacePwd.slice(0,this.replacePwd.length-1);
						$("password_box_text").innerHTML=this.replacePwd;
					}
					return false;
				break;
				case ROC_IRKEY_NUM0:
				case ROC_IRKEY_NUM1:
				case ROC_IRKEY_NUM2:
				case ROC_IRKEY_NUM3:
				case ROC_IRKEY_NUM4:
				case ROC_IRKEY_NUM5:
				case ROC_IRKEY_NUM6:
				case ROC_IRKEY_NUM7:
				case ROC_IRKEY_NUM8:
				case ROC_IRKEY_NUM9:
			      this.password+=(parseInt(val)-48)+"";
				  this.replacePwd+="●";
					if(this.password.length>6){
						this.password =(parseInt(val)-48)+"";
						this.replacePwd = "●"
					}
					$("password_box_text").innerHTML=this.replacePwd;
					return false;
				break;
				case ROC_IRKEY_INFO:
				 return false;
				 break;
				default:
				 if(this.topMsg){
					   return false;
				   }else{
				       return true;
				   }			
				break;
			}	
		}else{
			return true;	
		}
	}

	
}


function MSG_DIV_CONTROL(_json){
	this.id = _json.id;
	this.width = _json.width;
	this.height = _json.height
	this.img = null;
	this.setSrc = function(_src){
		if(this.img==null){
		   this.img = document.createElement("img");
		   this.img.height = this.height;
		   this.img.width = this.width;	  
		   $(this.id).appendChild(this.img);
		}
	    this.img.src = _src;
		this.show();
	}
	this.show = function(){
	   $(this.id).style.display = "block";
	   $(this.id).style.visibility = "visible";
	}
	this.hide = function (){
		$J.debug.msg("[MSG_DIV_CONTROL hide]")
	   $(this.id).style.display = "none";
	   $(this.id).style.visibility = "hidden";
	}
}

var channelLockControl = {
   getLockedState:function(_channel){
	  if(typeof(_channel)=="undefined"){
	    return true;
	  }
	  if(_channel.lock==0){
	    return true;//未锁
	  }
      var unLockChannel = SysSetting.getEnv("unLockChannel");
	  if(unLockChannel.indexOf("#"+_channel.ServiceHandle+"#")!=-1){
	  	return true;//临时解锁
	  }
	  return false;
   },
   resoveLockedChan:function(_channel){
	   if(typeof(_channel)=="undefined") return ;
      var unLockChannel = SysSetting.getEnv("unLockChannel");
	  SysSetting.setEnv("unLockChannel",unLockChannel+"#"+_channel.channelId+"#");
   }
}