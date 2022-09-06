function EvtManager() {
	this.handlers = {
		"count" : 0,
		"next" : null
	};
	this.eventQueue = [];
	this.keyFlag = true;
	this.sysFlag = true;
	this.completeFlag = false;
	this.dispatchTimer = -1;
}

EvtManager.prototype.printHandler = function() {
	SumaJS.debug("print handlers");
	for (var prior = this.handlers.next; prior != null; prior = prior.next) {
		SumaJS.debug("id = " + prior.id);
		SumaJS.debug("priority = " + prior.priority);
	}
};

EvtManager.prototype.addEventListener = function(id, control, priority) {
	for (var prior = this.handlers; prior != null; prior = prior.next) {
		if (prior.next == null) {
			prior.next = {
				"id" : id,
				"priority" : priority,
				"control" : control,
				"next" : null
			};
			++this.handlers.count;
			SumaJS.debug("addEventListener id = " + prior.next.id + ", priority = " + prior.next.priority);
			return 1;
			break;
		} else if (prior.next.priority == priority) {
			SumaJS.debug("an error occured in addEventListener, priority (" + priority + ") already exist, id ( " + id + ") add failed" + ", original id = " + prior.next.id);
			return 0;
			break;
		} else if (prior.next.priority > priority) {
			var next = prior.next;
			prior.next = {
				"id" : id,
				"priority" : priority,
				"control" : control,
				"next" : next
			};

			++this.handlers.count;
			SumaJS.debug("addEventListener id = " + prior.next.id + ", priority = " + prior.next.priority);
			return 1;
			break;
		}
	}
};

EvtManager.prototype.handleEvent = function(event) {
	var keyCode = event.keyCode||event.which;
	for (var prior = this.handlers.next; prior != null; prior = prior.next) {
		//alert(prior.id+", "+prior.control.eventHandler)
		if (prior.control && prior.control.eventHandler) {
			if (!prior.control.eventHandler(event)) {
				SumaJS.debug("event [ " + keyCode + " ] handle by [" + prior.id + "]");
				return false;
			}
		}
	}
	SumaJS.debug("warning, event [ " + keyCode + " ] is not handled");
	return true;
};

EvtManager.prototype.removeEventListener = function(id) {
	for (var prior = this.handlers; prior != null; prior = prior.next) {	
		if (prior.next == null) {
			SumaJS.debug("an error occured in removeEventListener, id(" + id + ") not exist");
		} else if (prior.next.id == id) {
			prior.next = prior.next.next;
			--this.handlers.count
			break;
		}
	}
};

EvtManager.prototype.checkHandler = function(id) {
	for (var prior = this.handlers; prior != null; prior = prior.next) {
		if (prior.next == null) {
			return false;
		} else if (prior.next.id == id) {
			return true;
		}
	}
};

EvtManager.prototype.getControl = function(id) {
	for (var prior = this.handlers; prior != null; prior = prior.next) {
		if (prior.next == null) {
			return null;
		} else if (prior.next.id == id) {
			return prior.next.control;
		}
	}
};

EvtManager.prototype.getPriority = function(id) {
	for (var prior = this.handlers; prior != null; prior = prior.next) {
		if (prior.next == null) {
			return null;
		} else if (prior.next.id == id) {
			return prior.next.priority;
		}
	}
};

EvtManager.prototype.changePriority = function(id, priority) {
	// to do;
	for (var prior = this.handlers; prior != null; prior = prior.next) {
		if (prior.next == null) {
			SumaJS.debug("an error occured in changePriority, id(" + id + ") not exist");
			return false;
		} else if (prior.next.id == id) {
			if (prior.next.priority == priority) {
				SumaJS.debug("priority does not change, id = " +  id + ", priority = " + priority);
				return false;
			} else {
				var control = prior.next.control;
				this.removeEventListener(id);
				this.addEventListener(id, control, priority);
				return true;
			}
		}
	}	
};

EvtManager.prototype.setFlag = function(flag) {
	this.completeFlag = flag;
};

EvtManager.prototype.setKeyFlag = function(flag) {
	this.keyFlag = flag;
};

EvtManager.prototype.setSysFlag = function(flag) {
	this.sysFlag = flag;
};

EvtManager.prototype.run = function() {	
	var self = this;
	document.onkeypress= function(event) {
		var code = event.keyCode||event.which;
		SumaJS.debug("keyCode = " + code);
        /*if(code == KEY_NUM8){
            window.location.reload();
            return false;
        }*/
		//有动作清除开机自动跳直播
		clearTimeout(playTvTimer);
		SysSetting.setEnv("KAIJIZHIBO","false");
		
		var myEvent = getPageEvent(event);
		if (self.keyFlag ) {
			return self.handleEvent(myEvent);
		} else {
			SumaJS.debug("keyFlag is false");
			return false;
		}
		//self.eventQueue.push(event);
	};
	
	document.onsystemevent = function(event) {
		var code = event.keyCode||event.which;
		SumaJS.debug("system keyCode = " + code);
		var myEvent = getPageEvent(event,1001);
		if (self.sysFlag) {
			return self.handleEvent(myEvent);
		} else {
			SumaJS.debug("sysFlag is false");
			return false;
		}
		//self.eventQueue.push(event);
	};
	//this.dispatchEvent();
};

EvtManager.prototype.dispatchEvent = function() {
	clearTimeout(this.dispatchTimer);
	var self = this;
	if (this.completeFlag) {
		var temp = this.eventQueue.shift();
		while (temp) {
			this.handleEvent(temp);
			temp = this.eventQueue.shift();
		}
	}
	this.dispatchTimer = setTimeout(function() {
		self.dispatchEvent();
	}, 50);
};

EvtManager.prototype.broadcastEvent = function(event) {
	broadcastEvent.call(this, event)
};