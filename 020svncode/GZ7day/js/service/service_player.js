/**
* @constructor Player
* @description 初始化mediaPlayer对象，并将对象和播放器实例绑定
*/
function Player(cfg) {
	/**
	 * @description 内置媒体播放器对象
	 * @type {Object}
	 */
	this.mediaPlayer = new MediaPlayer();
	this.service = null;
	this.focus = 1;
	
	this.onSetURLValid = typeof cfg.onSetURLValid != "undefined" ? cfg.onSetURLValid : function() {
		return true;
	};
	this.onSetURLInvalid = typeof cfg.onSetURLInvalid != "undefined" ? cfg.onSetURLInvalid : function() {
		return true;
	};
	this.onPlaySuccess = typeof cfg.onPlaySuccess != "undefined" ? cfg.onPlaySuccess : function() {
		return true;
	};
	this.onPlayFailed = typeof cfg.onPlayFailed != "undefined" ? cfg.onPlayFailed : function() {
		return true;
	};
	this.onSetPaceSuccess = typeof cfg.onSetPaceSuccess != "undefined" ? cfg.onSetPaceSuccess : function() {
		return true;
	};
	this.onSetPaceFailed = typeof cfg.onSetPaceFailed != "undefined" ? cfg.onSetPaceFailed : function() {
		return true;
	};
	this.onPauseFailed = typeof cfg.onPauseFailed != "undefined" ? cfg.onPauseFailed : function() {
		return true;
	};
	this.onPauseSuccess = typeof cfg.onPauseSuccess != "undefined" ? cfg.onPauseSuccess : function() {
		return true;
	};
	this.onSeekSuccess = typeof cfg.onSeekSuccess != "undefined" ? cfg.onSeekSuccess : function() {
		return true;
	};
	this.onSeekFailed = typeof cfg.onSeekFailed != "undefined" ? cfg.onSeekFailed : function() {
		return true;
	};
	this.onResumeSuccess = typeof cfg.onResumeSuccess != "undefined" ? cfg.onResumeSuccess : function() {
		return true;
	};
	this.onResumeFailed = typeof cfg.onResumeFailed != "undefined" ? cfg.onResumeFailed : function() {
		return true;
	};
	this.onStopSuccess = typeof cfg.onStopSuccess != "undefined" ? cfg.onStopSuccess : function() {
		return true;
	};
	this.onStopFailed = typeof cfg.onStopFailed != "undefined" ? cfg.onStopFailed : function() {
		return true;
	};
	this.onTuneSuccess = typeof cfg.onTuneSuccess != "undefined" ? cfg.onTuneSuccess : function() {
		return true;
	};
	this.onTuneFailed = typeof cfg.onTuneFailed != "undefined" ? cfg.onTuneFailed : function() {
		return true;
	};
	
	this.rect = typeof cfg.rect != "undefined" ? cfg.rect : "1,0,0,0,0";
	this.init(this.rect);
};

Player.prototype.playService = function(service) {
	this.service = service;
	playJSService.call(this);	
};

//add by liwenlei 播放nvod视频
Player.prototype.playNvodService = function(service) {
	this.service = service;
	playJSNvodService.call(this,service);
};


Player.prototype.playUrl = function(source) {
	playUrl.call(this, source);	
};

Player.prototype.init = function() {
	initMediaPlayer.call(this);
};

Player.prototype.pause = function(mode) {
	pauseMediaPlayer.call(this, mode);
};

Player.prototype.setPauseMode = function(mode) {
	return this.mediaPlayer.setPauseMode(mode);
};

Player.prototype.setEnableTrickMode = function(flag) {
	return setEnableTrickMode.call(this, flag);
}

Player.prototype.resume = function() {
	return this.mediaPlayer.resume();
};

Player.prototype.stop = function() {
	this.state = 1;
	return this.mediaPlayer.stop();
};

Player.prototype.replay = function() {
	return this.mediaPlayer.play();
};

Player.prototype.setVideoAspect = function(videoAspect) {
	this.mediaPlayer.videoAspect = videoAspect;
	this.mediaPlayer.refresh();
};

Player.prototype.refresh = function() {
	var ret = this.mediaPlayer.refresh();
	return ret;
};

Player.prototype.setVideoDisplayArea = function(rect) {
	this.rect = rect;
	setMediaPlayerArea.call(this);
};

Player.prototype.setVolume = function(volume) {
	mediaPlayerSetVolume.call(this, volume);
};

Player.prototype.release = function() {
	releaseMediaPlayer.call(this);
};

Player.prototype.clearVideoOutput = function() {
	return clearVideoOutput.call(this);
};

Player.prototype.getCurrPlayTime = function() {
	return getCurrPlayTime.call(this);
};

Player.prototype.getDuration = function() {
	return getPlayDuration.call(this);
};

Player.prototype.seek = function(type,time) {
	return playSeek.call(this,type,time);
};

Player.prototype.enableTrickMode = function(mode) {
	return this.mediaPlayer.enableTrickMode(mode);
};

Player.prototype.getTrickModeFlag = function() {
	return this.mediaPlayer.getTrickModeFlag();
};

Player.prototype.setFocusState = function(focus) {
	this.focus = focus;
};