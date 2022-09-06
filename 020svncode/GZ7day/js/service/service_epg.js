function EPGControl(cfg) {
	this.maskId = -1;
	this.endureTime = -1;
	this.mask = -1;
	this.service = -1;
	this.ts = -1;
	this.epgFlag = 0;
	this.onTuneSuccess = typeof cfg.onTuneSuccess != "undefined" ? cfg.onTuneSuccess : function(array) {
		return false;
	};
	this.onTuneFailed = typeof cfg.onTuneFailed != "undefined" ? cfg.onTuneFailed : function() {
		return false;
	};
	this.onSearchSuccess = typeof cfg.onSearchSuccess != "undefined" ? cfg.onSearchSuccess : function() {
		return false;
	};
	this.onSearchRefresh = typeof cfg.onSearchRefresh != "undefined" ? cfg.onSearchRefresh : function() {
		return false;
	};
	this.onSearchExceedMaxCount = typeof cfg.onSearchExceedMaxCount != "undefined" ? cfg.onSearchExceedMaxCount : function() {
		return false;
	};
	this.onSearchTimeout = typeof cfg.onSearchTimeout != "undefined" ? cfg.onSearchTimeout : function() {
		return false;
	};
}

EPGControl.prototype.searchByService = function(service, mask, endureTime, dateObj, notTuneFlag) {
	if (mask == 0x13) {
		this.date = dateObj;
		if (service == this.service) {
			SumaJS.debug("mask = 0x13, Do not need to search");
			var ret = getEventArrayByDate.call(this);
			var array = [];
			for(var i = 0, len = ret.length; i < len; ++i) {
				array.push(createJSEvent(ret[i]));
			}
			this.onSearchSuccess(array);
			return true;
		}
	}
	this.service = service;
	if (!service) {
		SumaJS.debug("epg,an error occured in EPGControl, service = " + service);
		return false;
	}
	this.ts = service.getTs();
	if (!this.ts) {
		SumaJS.debug("epg,an error occured in EPGControl, ts = " + this.ts);
		return false;
	}
	this.mask = mask;
	this.endureTime = endureTime;	

	if (notTuneFlag) {
		this.epgFlag = 1;	
	} else {
		searchProgramByService.call(this);
	}
}

EPGControl.prototype.eventHandler = function(event) {
	var code = event.keyCode||event.which;
	var event_modifer = parseInt(event.modifiers);
	switch (code) {
	case MSG_DVB_TUNE_SUCCESS:
		SumaJS.debug("########epg, MSG_DVB_TUNE_SUCCESS");
		if (this.epgFlag) {
			if (this.mask == 0x01 || this.mask == 0x02 || this.mask == 0x4 || this.mask == 0x8) {
				searchProgramByService.call(this);
			}
			this.epgFlag = 0;
			this.onTuneSuccess();
		}
		break;
	case MSG_DVB_TUNE_FAILED:
		SumaJS.debug("########epg, MSG_DVB_TUNE_FAILED");
		if (this.epgFlag) {
			this.epgFlag = 0;
			this.onTuneFailed();
		}
		break;
	case MSG_EPG_SEARCH_SUCCESS: //成功完成EPG搜索。
		SumaJS.debug("########epg, MSG_EPG_SEARCH_SUCCESS");
		
		if (event_modifer == this.maskId) {
			SumaJS.debug("MSG_EPG_SEARCH_SUCCESS, modifiers = " + event.modifiers + ", maskId = " + this.maskId);
			var array;
			if (this.mask == 0x01) {
				var tempOriginalArray = getPFPEvent.call(this);
				array = [createJSEvent(tempOriginalArray[0]), createJSEvent(tempOriginalArray[1])];
			} else if (this.mask == 0x02) {
				var ret = getActualSchedule.call(this);
				array = [];
				for(var i = 0, len = ret.length; i < len; ++i) {
					array.push(createJSEvent(ret[i]));
				}
			} else if (this.mask == 0x11) {
				var ret = getWeekEvent.call(this);
				array = [];
				for(var i = 0, len = ret.length; i < len; ++i) {
					array.push(createJSEvent(ret[i]));
				}
			} else if (this.mask == 0x12) { // epg Array
				var ret = getWeekEventArray.call(this);
				array = [];
				for(var i = 0, len = ret.length; i < len; ++i) {
					array[i] = [];
					for (var j = 0, oLen = ret[i].length; j < oLen; ++j) {
						array[i].push(createJSEvent(ret[i][j]));
					}
				}
			} else if (this.mask == 0x13) { // array
				var ret = getEventArrayByDate.call(this);
				array = [];
				for(var i = 0, len = ret.length; i < len; ++i) {
					array.push(createJSEvent(ret[i]));
				}
			}
			this.onSearchSuccess(array, this.mask);
		} else {
			SumaJS.debug("modifiers does not match, modifiers = " + event.modifiers + ", maskId = " + this.maskId);
		}
		break;
	case MSG_EPG_SEARCH_REFRESH: //EPG数据更新。当EPG搜索到部分数据时，发送该消息。
		SumaJS.debug("########epg, MSG_EPG_SEARCH_REFRESH");
		if (event_modifer == this.maskId) {
			var array;
			if (this.mask == 0x01) {
				var tempOriginalArray = getPFPEvent.call(this);
				array = [createJSEvent(tempOriginalArray[0]), createJSEvent(tempOriginalArray[1])];
			} else if (this.mask == 0x02) {
				var ret = getActualSchedule.call(this);
				array = [];
				for(var i = 0, len = ret.length; i < len; ++i) {
					array.push(createJSEvent(ret[i]));
				}
			} else if (this.mask == 0x11) {
				var ret = getWeekEvent.call(this);
				array = [];
				for(var i = 0, len = ret.length; i < len; ++i) {
					array.push(createJSEvent(ret[i]));
				}
			} else if (this.mask == 0x12) { // epg Array
				var ret = getWeekEventArray.call(this);
				array = [];
				for(var i = 0, len = ret.length; i < len; ++i) {
					array[i] = [];
					for (var j = 0, oLen = ret[i].length; j < oLen; ++j) {
						array[i].push(createJSEvent(ret[i][j]));
					}
				}
			} else if (this.mask == 0x13) { // array
				var ret = getEventArrayByDate.call(this);
				array = [];
				for(var i = 0, len = ret.length; i < len; ++i) {
					array.push(createJSEvent(ret[i]));
				}
			}
			this.onSearchRefresh(array, this.mask);
		} else {
			SumaJS.debug("modifiers does not match, modifiers = " + event.modifiers + ", maskId = " + this.maskId);
		}
		break;
	case MSG_EPG_SEARCH_EXCEED_MAX_COUNT: //搜索结果达到最大值，搜索自动停止。
		SumaJS.debug("########epg, MSG_EPG_SEARCH_EXCEED_MAX_COUNT");
		if (event_modifer == this.maskId) {
			var array;
			if (this.mask == 0x01) {
				var tempOriginalArray = getPFPEvent.call(this);
				array = [createJSEvent(tempOriginalArray[0]), createJSEvent(tempOriginalArray[1])];
			} else if (this.mask == 0x02) {
				var ret = getActualSchedule.call(this);
				array = [];
				for(var i = 0, len = ret.length; i < len; ++i) {
					array.push(createJSEvent(ret[i]));
				}
			} else if (this.mask == 0x11) {
				var ret = getWeekEvent.call(this);
				array = [];
				for(var i = 0, len = ret.length; i < len; ++i) {
					array.push(createJSEvent(ret[i]));
				}
			} else if (this.mask == 0x12) { // epg Array
				var ret = getWeekEventArray.call(this);
				array = [];
				for(var i = 0, len = ret.length; i < len; ++i) {
					array[i] = [];
					for (var j = 0, oLen = ret[i].length; j < oLen; ++j) {
						array[i].push(createJSEvent(ret[i][j]));
					}
				}
			} else if (this.mask == 0x13) { // array
				var ret = getEventArrayByDate.call(this);
				array = [];
				for(var i = 0, len = ret.length; i < len; ++i) {
					array.push(createJSEvent(ret[i]));
				}
			}
			this.onSearchExceedMaxCount(array,this.mask);
		} else {
			SumaJS.debug("modifiers does not match, modifiers = " + event.modifiers + ", maskId = " + this.maskId);
		}
		break;
	case MSG_EPG_SEARCH_TIMEOUT: //搜索EPG超时。在接口指定的时间段内没有搜索到任何节目信息时，发送该消息。
		SumaJS.debug("########epg, MSG_EPG_SEARCH_TIMEOUT");
		if (event_modifer == this.maskId) {
			var array;
			if (this.mask == 0x01) { //pf
				var tempOriginalArray = getPFPEvent.call(this);
				array = [createJSEvent(tempOriginalArray[0]), createJSEvent(tempOriginalArray[1])];
			} else if (this.mask == 0x02) { //schedule
				var ret = getActualSchedule.call(this);
				array = [];
				for(var i = 0, len = ret.length; i < len; ++i) {
					array.push(createJSEvent(ret[i]));
				}
			} else if (this.mask == 0x11) { //epg
				var ret = getWeekEvent.call(this);
				array = [];
				for(var i = 0, len = ret.length; i < len; ++i) {
					array.push(createJSEvent(ret[i]));
				}
			} else if (this.mask == 0x12) { // epg Array
				var ret = getWeekEventArray.call(this);
				array = [];
				for(var i = 0, len = ret.length; i < len; ++i) {
					array[i] = [];
					for (var j = 0, oLen = ret[i].length; j < oLen; ++j) {
						array[i].push(createJSEvent(ret[i][j]));
					}
				}
			} else if (this.mask == 0x13) { // array
				var ret = getEventArrayByDate.call(this);
				array = [];
				for(var i = 0, len = ret.length; i < len; ++i) {
					array.push(createJSEvent(ret[i]));
				}
			}
			this.onSearchTimeout(array,this.mask);
		} else {
			SumaJS.debug("modifiers does not match, modifiers = " + event.modifiers + ", maskId = " + this.maskId);
		}
		break;
	default:
		return true;
		break;
	}
	return true;
};