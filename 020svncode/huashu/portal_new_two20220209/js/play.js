function play(){
	this.currChannel = null;
	this.currService = null;
	this.currChannelPos = 0;
	this.channelList = [];
	this.channelListLength = 0;
	this.channelListInitFinished = false;
	this.openChannelTimeout = -1;

	this.presentProgram = null;
	this.followingProgram = null;
	this.currWindow = iPanel.mainFrame;

	this.favoriteList = [];
	this.favoriteListLength = 0;
	this.currFavoritePos = 0;
	this.currFavoriteChannel = null;
	this.favChannelListInitFinished = false;

	this.offBouquetId = 0;
	this.bouquetStr = "";
	this.currChannelInBouquet = true;
	
	this.channelNumberId = "channelNumber"; //存放频道号背景的区域id号
	this.channelNumberInputId = "input";   //存放频道号值的区域id号
	this.channelNumberType = "image"; //"text": 表示纯文本，"image": 表示图片方式
	this.goToOpenTimer = 1500;        //输入频道号后延迟多少毫秒打开频道
	this.maxChannelNumLength = 3;     //频道号最长的个数
	this.channelNumTimer = 5000;      //频道号消失时间，单位毫秒
	this.openChannelTimer = 500;        //当切换频道时去打开视频和音频的时间，单位毫秒, 0:即时打开 ,非0延迟多少毫秒打开
 	this.channelNumberShowType = true;//true 表示需要在频道号数字前面加-，false不需要加

	this.channelNumShowFlag = false;
	this.channelNumTimeout = -1;
	this.channelNumPos = 0;           //输入频道号时的当前位置，从左到右0~2
	this.inputChannelNum = "";        //当前输入的频道号
	this.inInputStatus = false;       //当前是否处于频道号输入的状态
	this.goToOpenTimeout = -1;

	//频道号图片0~9
	this.channelNumberImages = [
		'images/num_0.png',	
		'images/num_1.png',	
		'images/num_2.png',
		'images/num_3.png',	
		'images/num_4.png',	
		'images/num_5.png',	
		'images/num_6.png',	
		'images/num_7.png',	
		'images/num_8.png',	
		'images/num_9.png'	
	];
	this.channelNullImage =  'images/num_0.png';//用于显示输入频道时横杠“-”的图片
}
play.prototype = {
	getOffChannel: function(__type){
		if(typeof(__type) == "number"){
			this.currChannel = user.getOffChannel(__type);
		}
		else{
			this.currChannel = user.getOffChannel();
		}
		return this.currChannel;
	},
	
	//add by hj:去掉加锁频道
	filterLockChannel: function( __channelList ){
		var _len = __channelList.length;
		iPanel.debug("play.js filterLockChannel _len = "+_len);
		for( var i = _len-1; i >= 0; i-- ){
			var __lock = __channelList[i].lock;
			iPanel.debug("play.js filterLockChannel __lock = "+__lock);
			if( __lock == 1 ){  //频道被锁定
				__channelList.splice( i, 1 );
			}
		}
		return __channelList;
	},

	initChannelList: function(__type, __fav,__initChannelListFun){
		this.channelListInitFinished = false;
		if(typeof __initChannelListFun == "function"){
			this.channelList = __initChannelListFun();
		}
		else{
			if(typeof(__type) == "number"){
				iPanel.debug("typeof(__fav)="+typeof(__fav));
				if(typeof(__fav) == "string"){
					if(__fav == "all"){
						this.channelList = user.channels.getFavoriteAVList(0);
					}
					else{
						if(__type == 1){
							this.channelList = user.channels.getVideoList(__fav);
							//this.channelList = this.filterLockChannel( user.channels.getVideoList(__fav) );
						}
						else if(__type == 2){
							this.channelList = user.channels.getAudioList(__fav);
						}
					}
				}
				else{
					if(__type == 1){
						this.channelList = user.channels.getVideoList();
						//this.channelList = this.filterLockChannel( user.channels.getVideoList() );
					}
					else if(__type == 2){
						this.channelList = user.channels.getAudioList();
					}
				}
			}
			else{
				this.channelList = user.channels.getVideoList();
				//this.channelList = this.filterLockChannel( user.channels.getVideoList() );
			}
		}
		this.channelListInitFinished = true;
		this.channelListLength = this.channelList.length;
		iPanel.debug("this.channelListLength="+this.channelListLength);
	},
	
	initCurrChannelPos: function(__channel){
		var curr_channel = null;
		if(typeof(__channel) == "object"){
			curr_channel = __channel;
		}
		else if(typeof(this.currChannel) == "object"){
			curr_channel = this.currChannel;
		}
		if(curr_channel != null){
			var off_channel_num = curr_channel.userChannel;
			for(var i = 0; i < this.channelListLength; i++){
				if(this.channelList[i].userChannel == off_channel_num){
					this.currChannelPos = i;
					break;
				}
			}
		}
	},

	prepareProgram: function(__channel){
		if(typeof(__channel) == "undefined") __channel = this.currChannel;
		this.currService = __channel.getService();
		this.currService.preparePrograms();
	},
	
	getPresentProgram: function(){
		if(this.currService != null && typeof(this.currService) == "object"){
			this.presentProgram = this.currService.presentProgram;
			return this.presentProgram;
		}
	},
	
	getFollowingProgram: function(){
		if(this.currService != null && typeof(this.currService) == "object"){
			this.followingProgram = this.currService.followingProgram;
			return this.followingProgram;
		}
	},

	getCurrProgramProgress: function(__barWidth, __program){
		if(typeof(__barWidth) == "number"){
			if(typeof(__program) == "undefined"){
				__program = this.presentProgram;
			}
			if(typeof(__program) == "object"){
				var __st = __program.startTime;
				if(typeof __st == "object"){//兼容返回的时间是一个Date()对象的情况
					__st = E.util.date.format(__st,"hh:mm:ss");	
				}
				var start_time = __st.substring(0, 5);
				var __et = __program.endTime;
				if(typeof __et == "object"){//兼容返回的时间是一个Date()对象的情况
					__et = E.util.date.format(__et,"hh:mm:ss");	
				}
				var end_time = __et.substring(0, 5);
				var now_time = E.util.date.format(new Date(), "hh:mm");
				if(start_time > now_time || end_time < now_time){
					return 0;
				}else{
					return parseInt(E.util.str.getDuration(start_time,now_time)/E.util.str.getDuration(start_time,end_time)*__barWidth);
				}
			}else{
				return 0;
			}
		}
		else{
			return 0;
		}
	},
	
	/*
	 *__type:是否立即打开频道播放；
	 *__sflag：是否要显示频道号
	 */
	channelUp: function(__type, __sflag){
		if(this.channelListInitFinished){
			if(this.channelListLength > 1){
				this.currChannelPos++;
				if(this.currChannelPos > (this.channelListLength - 1)){
					this.currChannelPos = 0;
				}
				this.currWindow.clearTimeout(this.goToOpenTimeout);
				if(this.channelNumPos != 0){
					this.channelNumPos = 0;
					this.inputChannelNum = "";
				}
				this.currChannel = this.channelList[this.currChannelPos];
				if(this.currChannel.type == 12){
					this.channelUp(__type,__sflag);
					return;
				}
				if(__type != 1){
					iPanel.debug("channelUp ="+this.openChannelTimer);
					if(this.openChannelTimer == 0){
						this.doChannelOpen();
					}
					else{
						var self = this;
						this.currWindow.clearTimeout(this.openChannelTimeout);
						this.openChannelTimeout = this.currWindow.setTimeout(function(){self.doChannelOpen();}, self.openChannelTimer);
					}
				}
				if(typeof(__sflag) == "undefined" || __sflag == 1){
					this.showChannelNumber();
				}
				return true;
			}
			else{
				return false;
			}
		}
		else{
			return false;
		}
	},

	 /*
	  *__type:非1，表示延时打开频道
	  *__sflag：为1或者没定义，为打开的时候要显示频道号
	  */
	 channelDown: function(__type, __sflag){
		 iPanel.debug("channelDown="+this.channelListInitFinished);
		if(this.channelListInitFinished){
			if(this.channelListLength > 1){
				this.currChannelPos--;
				if(this.currChannelPos < 0){
					this.currChannelPos = this.channelListLength - 1;
				}
				this.currWindow.clearTimeout(this.goToOpenTimeout);
				if(this.channelNumPos != 0){
					this.channelNumPos = 0;
					this.inputChannelNum = "";
				}
				this.currChannel = this.channelList[this.currChannelPos];
				if(this.currChannel.type == 12){
					this.channelDown(__type,__sflag);
					return;
				}
				if(__type != 1){
					iPanel.debug("channelDown ="+this.openChannelTimer);
					if(this.openChannelTimer == 0){
						this.doChannelOpen();
					}else{
						var self = this;
						this.currWindow.clearTimeout(this.openChannelTimeout);
						this.openChannelTimeout = this.currWindow.setTimeout(function(){self.doChannelOpen();}, self.openChannelTimer);
					}
				}
				if(typeof(__sflag) == "undefined" || __sflag == 1){
					this.showChannelNumber();
				}
				return true;
			}
			else{
				return false;
			}
		}
		else{
			return false;
		}
	},
	
	getCurrChannel: function(){
		return this.currChannel;
	},

	doChannelOpen: function(__type){
		if(__type == 1){
			user.setOffChannel(this.currChannel);	
			iPanel.mainFrame.location.href = "ui://play.html?ui";
		}else if(__type == 2){
			user.setOffChannel(this.currChannel);	
			iPanel.mainFrame.location.href = "ui://music.html?ui";
		}else{
			//this.currChannel.open(1);
			iPanel.sendSimulateEvent(256, 8301, 0);	
			var _lock = this.currChannel.lock;
			iPanel.debug("play doChannelOpen this.currChannel.lock="+_lock);
			if(_lock == 0){
				var service = this.currChannel.getService()
				DVB.playAV(service.frequency,service.serviceId);	
				//iPanel.debug("play doChannelOpen iPanel.sendSimulateEvent 8300");
				//iPanel.sendSimulateEvent(256, 8300, 0);	
			}else{
				user.setOffChannel(this.currChannel);
				DVB.clearVideoLevel();
				DVB.stopAV(0);  //不保留最后一帧
				this.currWindow.clearNavigationInfo();  //add by hj:数字键切到加锁频道时，PF条上的信息不会被清除，这里调用一下
				iPanel.sendSimulateEvent(256, 8302, 0);	
				//iPanel.sendSimulateEvent(256, 8300, 0);//现在playAV也会发8300		
			}
		}
	},
	doSpecChannel:function(_channel){
		
	},

	initChannelNum: function(__num){
		if(this.channelNumberType == "image"){
			var re_num = this.generateChannelNum(this.paddingInputNumber(__num));
			this.$(this.channelNumberInputId).innerHTML = re_num;
		}else{
			var tempstr = this.paddingInputNumber(__num,"0");
			this.$(this.channelNumberInputId).innerText = tempstr;
		}
	},

	generateChannelNum: function(__num){
		var channelNum = '';
		__num = __num.toString();								//如果匹配,那么userchannel是15这种形式的
		for (var i = 0; i < __num.length ; i++) {
			var number = __num.substr(i, 1);
			if (number != '-') {
				channelNum += '<img src="'+this.channelNumberImages[parseInt(number)]+'">';
			} else {
				if(this.channelNumberShowType){
					channelNum += '<img src="'+this.channelNullImage+'">';
				}
			}
		}	
		return channelNum;
	},

	showChannelNumber: function(){
		var channel_num = this.currChannel.userChannel;
		this.initChannelNum(channel_num);
		var self = this;
		this.currWindow.clearTimeout(this.channelNumTimeout);
		this.channelNumTimeout = this.currWindow.setTimeout(function(){self.hideChannelNubmer();}, this.channelNumTimer);
		if(!this.channelNumShowFlag){
			this.channelNumShowFlag = true;
			this.$(this.channelNumberId).style.visibility = "visible";
		}
	},

	 hideChannelNubmer: function(__type, __num){
		this.currWindow.clearTimeout(this.channelNumTimeout);
		this.currWindow.clearTimeout(this.goToOpenTimeout);
		this.inInputStatus = false;
		if(__type == 1 && this.channelNumPos != 0){
			this.channelNumPos = 0;
			this.inputChannelNum = "";
			this.initChannelNum(__num);
		}
		if(this.channelNumShowFlag){
			this.channelNumShowFlag = false;
			this.$(this.channelNumberId).style.visibility = "hidden";
		}
	},

	getInputChannelNumber: function(__num, __type, __addstr){
		this.currWindow.clearTimeout(this.openChannelTimeout);
		iPanel.debug("getInputChannelNumber __num = "+__num+", __type = "+__type+", __addstr = "+__addstr+", this.maxChannelNumLength = "+this.maxChannelNumLength+", this.channelNumPos = "+this.channelNumPos);
		if(this.channelNumPos < this.maxChannelNumLength){
			this.inInputStatus = true;
			this.channelNumPos++;
				this.inputChannelNum += __num;
				this.showChannelNumber();
				this.initChannelNum(this.paddingInputNumber(this.inputChannelNum, __addstr));
				var self = this;
				this.currWindow.clearTimeout(this.goToOpenTimeout);
				if(this.channelNumPos!=this.maxChannelNumLength){
					this.goToOpenTimeout = this.currWindow.setTimeout(function(){self.goChannelImmediately(__type);}, this.goToOpenTimer);
				}else{
					self.goChannelImmediately(__type);	
				}
		}else{//大于三位后重新开始
			this.inInputStatus = true;
			this.channelNumPos = 0;
			this.inputChannelNum = "";
			this.getInputChannelNumber(__num, __type, __addstr);
		}
	},

	goChannelImmediately: function(__type,__flag){
		iPanel.debug("play.js goChannelImmediately");
		var specType = 65533;
		this.inInputStatus = false;
		this.currWindow.clearTimeout(this.goToOpenTimeout);
		if(this.inputChannelNum == ""){
			this.hideChannelNubmer();
			return;
		}
		var tmpInputNum = Math.floor(this.inputChannelNum);
		this.inputChannelNum = "";
		this.channelNumPos = 0;
		var curr_channel;
		if(tmpInputNum == 0){
			this.doSpecChannel("help");
			return;
		}else if(tmpInputNum >= 900 && tmpInputNum < 1000){
			iPanel.debug("play.js goChannelImmediately specType="+specType);
			curr_channel = user.channels.getChannelByNum(tmpInputNum, specType);
		}else if(typeof(__type) == "number"){
			iPanel.debug("play.js goChannelImmediately __type="+__type);
			curr_channel = user.channels.getChannelByNum(tmpInputNum, __type);	
		}else{
			curr_channel = user.channels.getChannelByNum(tmpInputNum);
		}
		if(typeof(curr_channel) != 'undefined' && curr_channel.hide == 0 && curr_channel.type != 12){
			iPanel.debug("curr_channel.name="+curr_channel.name);
				/*if(typeof(__flag) == "undefined" || __flag == 1) this.showChannelNumber();
				else this.hideChannelNubmer();*/
				if(curr_channel.type == specType){
					this.doSpecChannel(curr_channel);
				}else if(this.currChannel.type == curr_channel.type){
					this.currChannel = curr_channel;
					this.doChannelOpen();
					iPanel.sendSimulateEvent(256, 9001, 0);
				}else{
					this.currChannel = curr_channel;
					this.doChannelOpen(this.currChannel.type);
				}
		}else{
			iPanel.sendSimulateEvent(256, 9002, tmpInputNum);
		}
	},

	paddingInputNumber: function(__num, __addstr){
		var add_str = "-";
		if(typeof(__addstr) != "undefined") add_str = __addstr;
		var str = __num.toString();
		var str_length = str.length;
		for (var i = 0; i< (this.maxChannelNumLength - str_length); i++) {
			str = add_str + str;
		}
		return str;
	},

	playLastChannel: function(__type){
		var curr_channel = user.lastChannel(128);
		iPanel.debug("play.js playLastChannel curr_channel.name"+curr_channel.name);
		if(typeof(curr_channel) != "undefined"){
			iPanel.debug("play.js playLastChannel curr_channel.type:"+curr_channel.type+"  this.currChannel.type:"+this.currChannel.type);
			if(curr_channel.type != this.currChannel.type){
				this.currChannel = curr_channel;
				this.doChannelOpen(this.currChannel.type);
				iPanel.sendSimulateEvent(256, 9001, 0);
				return true;
			}else{
				this.currWindow.clearTimeout(this.goToOpenTimeout);
				if(this.channelNumPos != 0){
					this.channelNumPos = 0;
					this.inputChannelNum = "";
				}
				this.currChannel = curr_channel;
				if(__type != 0){
					this.showChannelNumber();
				}
				this.doChannelOpen();
				iPanel.sendSimulateEvent(256, 9001, 0);
				return true;
			}
		}else{
			return false;
		}
	},
	
	openChannelByNum: function(__num, __type,__sflag){
		if(typeof(__num) != "undefined"){
			var curr_channel = user.channels.getChannelByNum(__num,__type);
			if(typeof(curr_channel) != "undefined"){
				if(curr_channel.type == this.currChannel.type){
					this.currChannel = curr_channel;
					this.doChannelOpen();
					if(typeof(__sflag) == "undefined" || __sflag == 1){
						this.showChannelNumber();
					}
					iPanel.sendSimulateEvent(256, 9001, 0);
				}
				else{
					this.currChannel = curr_channel;
					this.doChannelOpen(this.currChannel.type);
				}
			}
		}
	},
	
	getInfoTimeout: function(){
		return user.infoTimeout;
	},
	
	$: function(__id){
			return this.currWindow.document.getElementById(__id);
	}
};