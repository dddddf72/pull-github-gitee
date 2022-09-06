/**
 * @fileOverview InputBox 输入框控件控件接口及使用说明
 * @author yangxuezhong
 * @since version 0.1
 */

/**
 * @constructor InputBox
 * @description InputBox类,用于输入数字，密码，IP地址等数据。
 * @example var cfg = {id:"ip_",type:2,originStr:"192.168.1.5",maxLen:"12",inputFinish: function(){}};
 * var ipInput = new InputBox(cfg);
 * @param {object} cfg
 *
 */
function InputBox(cfg) {
		this.focus = 0;	
		this.onBlur = typeof cfg.onBlur != "undefined" ? cfg.onBlur : function(id) {
		};
		this.onFocus = typeof cfg.onFocus != "undefined" ? cfg.onFocus : function(id) {
		};
		/**
		 * @description {Sting} 输入单元格ID前缀。html页面的输入单元格命名需采用 XXX0，XXX1，XXX2 ...
		 * XXXn的命名方式，xxx是作为 prefixId 传入InputBox控件
		 * @field
		 */	
		this.id = cfg.id;
		this.idArray = cfg.idArray;
		/**
		 * @description {Number} 焦点单元格下标
		 * @field
		 */
		this.idx = 0;
		/**
		 * @description {Number} 输入的最大位数，对于IP，maxLen固定为12位。
		 * @field
		 */
		this.maxLen = cfg.maxLen || 0;
		/**
		 * @description {String} 初始字符串，留作以后备用。
		 * @field
		 */
		this.originStr = typeof cfg.originStr != 'undefined' ? cfg.originStr + "" : "";
		/**
		 * @description {Number} 输入框类型，0 普通输入（频点等）， 1 密码， 2 ip， 3 时间。
		 * @field
		 */
		this.type = cfg.type || 0;

		/**
		 * @description {String} 当前输入的字符串。
		 * @field
		 */
		if (this.type == 2) {
			this.inputStr = this.originStr;
		} else {
			this.inputStr = this.originStr.substring(0, this.maxLen);
		}

		/**
		 * @description {Char} 输入密码等数据时，用于掩盖真实输入的字符。
		 * @field
		 */
		this.maskChar = typeof cfg.maskChar != "undefined" ? cfg.maskChar : "●";
		/**
		 * @description {Function} 输入完最后一位时执行的回调函数。
		 * @field
		 */
		this.inputFinish = typeof cfg.inputFinish != "undefined" ? cfg.inputFinish : function() {
		};
		/**
		 * @description {String} 单元格获得焦点时的CSS classname，如果初始化的时候没有传入该参数，则使用默认样式。
		 * @field
		 */
		this.cellOnFocus = typeof cfg.cellOnFocus != "undefined" ?  cfg.cellOnFocus : function(id) {
			return true;
		};
		/**
		 * @description {String} 单元格失去焦点时的CSS classname，如果初始化的时候没有传入该参数，则使用默认样式。
		 * @field
		 */
		this.cellOnBlur = typeof cfg.cellOnBlur != "undefined" ? cfg.cellOnBlur : function() {
			return true;
		};
		this.eventHandler = typeof cfg.onEventHandler != "undefined" ? cfg.onEventHandler : function(event) {
		};
		/**
		 * @description {Number} 最后一位有效数字的下标，删除的时候只能从最后一位开始删除。
		 * @field
		 */
		this.validIdx = 0;
		
		this.okBtnFocus = typeof cfg.okBtnFocus != "undefined" ? cfg.okBtnFocus : function(event) {
		};
}
//把单元格格式放在外面显示，避免输入受样式限制。特别是中间有分隔符的情况，如果IP，时间等，如果中间的分隔符样式不同，封装到控件内部样式变化就就不灵活。
/**
 * @description  初始化函数，在创建实例对象后必须调用该函数进行初始化。
 */
InputBox.prototype.init = function() {
	switch (this.type) {
	case 0:
	case 3:
		this.inputStr = this.inputStr.replace(/[^\d]/g, "");
		break;
	case 1:
		this.inputStr = this.originStr;
		break;
	case 2:
		this.maxLen = 12;
		this.inputStr = this.ipToStr(this.inputStr);
		if (this.inputStr == -1) {
			this.inputStr = "000000000000";
		}
		break;
	}
	this.validIdx = this.inputStr.length - 1 >= 0 ? this.inputStr.length - 1 : 0;

	if (this.validIdx < this.maxLen - 1 && this.inputStr.length != 0) {
		this.idx = this.validIdx + 1;
	} else {
		this.idx = this.validIdx;
	}
	for ( var i = 0; i <= this.validIdx; i++) {	
		this.idArray[i].innerHTML = this.inputStr.charAt(i);
	}
	this.cellOnFocus(this.idArray[this.idx]);
};
/**
 * @description 重置，将所有输入清空。
 */
InputBox.prototype.reset = function() {
	this.cellOnBlur(this.idArray[this.idx]);
	this.idx = 0;
	this.inputStr = "";
	this.validIdx = 0;
	for ( var i = 0; i < this.maxLen; i++) {
		this.idArray[i].innerHTML = "&nbsp;";
	}
	this.cellOnFocus(this.idArray[this.idx]);
	this.okBtnFocus();
};

/**
 * @description 接收输入的字符并显示。
 * @param {Char} _str 输入的字符
    */
InputBox.prototype.input = function(_str) {
	if (this.type == 1 && this.validIdx == this.maxLen - 1) {
		//return; //密码单元格只能输入和删除，不能被更改
	}
	var str = "" + _str;
	if (this.validIdx == 0 && this.idx == 0) {
		this.inputStr = str;
	} else if (this.validIdx >= this.idx) {
		this.inputStr = this.replaceStrChar(this.inputStr, this.idx, str);
	} else {
		this.inputStr += str;
		this.validIdx = this.idx;
	}
	this.idArray[this.idx].innerHTML = 1 == this.type ? this.maskChar : str;
	this.cellOnBlur(this.idArray[this.idx]);
	var preIndex = this.idx;
	this.idx++;
	if (this.idx >= this.maxLen) {
		this.idx = this.maxLen - 1;
		this.validIdx = this.idx;
	}

	this.cellOnFocus(this.idArray[this.idx]);
	if (preIndex == this.maxLen - 1) {
		this.inputFinish();
	}
};

/**
 * @description 获取输入的值
 * @return {String} 跟进输入的类型，返回的，普通字符和密码返回数字格式的字符串；IP输入返回输入的IP地址，如果输入的不是一个正确的IP地址，返回 -1；
 * 如果是时间输入，返回格式为hh:mm:ss 或hh:mm 或mm:ss
 */
InputBox.prototype.getValue = function() {
	if (this.type != 1) {
		this.inputStr = "";//不能加空格，否则返回的字符串前面会多一个空格
		for ( var i = 0; i <= this.validIdx; i++) {
			this.inputStr += this.idArray[i].innerText;
		}
	}
	var str = this.type == 2 ? this.strToIp(this.inputStr) : this.inputStr;
	return str;
};

/**
 * @description  获取当前的输入字符串。
 * @return {String} 由数字组成的字符串。
 */
InputBox.prototype.getInputStr = function() {
	return this.inputStr;
};

/**
 * @description  移动焦点到前一个单元格。
 */
InputBox.prototype.left = function() {
	this.cellOnBlur(this.idArray[this.idx]);
	this.idx--;
	if (this.idx <= 0)
		this.idx = 0;
	this.cellOnFocus(this.idArray[this.idx]);
};

/**
 * @description  移动焦点到前后个单元格。
 */
InputBox.prototype.right = function() {
	if (this.idx > this.validIdx)
		return;
	if (this.validIdx && this.inputStr.length == 0)
		return;
	this.cellOnBlur(this.idArray[this.idx]);
	this.idx++;
	if (this.idx >= this.maxLen)
		this.idx = this.maxLen - 1;
	this.cellOnFocus(this.idArray[this.idx]);
};

/**
 * @description  删除最后输入字符串最后一位字符。
 */
InputBox.prototype.del = function() {
	if (this.validIdx > this.idx)
		return;
	this.inputStr += "";//强制转换为string类型，否则substring会报错
	this.inputStr = this.inputStr.substring(0, this.validIdx);
	this.idArray[this.validIdx].innerHTML = "&nbsp;";
	this.cellOnBlur(this.idArray[this.idx]);
	if (this.validIdx < this.idx) {
		this.idx--;
	}
	this.validIdx--;
	this.idx = this.idx >= 0 ? this.idx : 0;
	this.validIdx = this.validIdx >= 0 ? this.validIdx : 0;
	this.cellOnFocus(this.idArray[this.idx]);
};

/**
 * @description  InputBox控件获得焦点。
 */
InputBox.prototype.cellBlur = function() {
	this.cellOnBlur(this.idArray[this.idx]);
};

/**
 * @description  InputBox控件失去焦点。。
 */
InputBox.prototype.cellFocus = function() {
	this.cellOnFocus(this.idArray[this.idx]);
};
/**
 * @description  将IP转化为12位纯数字字符串
 * @param {String} ip IP格式字符串
 * @return {String} 由12位数字组成的字符串。
 */
InputBox.prototype.ipToStr = function(ip) {
	if (!this.isValidIp(ip))
		return -1;
	var ipArray = ip.split(".");
	for ( var i = 0; i < ipArray.length; i++) {
		var str = ipArray[i].toString();
		while (str.length < 3) {
			str = "0" + str;
		}
		ipArray[i] = str;
	}
	return ipArray.join("");
};

/**
 * @description  将12位纯数字字符串转化成IP格式字符串
 * @param {String} ipStr 12位数字字符串。
 * @return {String} IP格式字符串。
 */
InputBox.prototype.strToIp = function(ipStr) {
	var ipStr = ipStr + "";
	var ip = parseInt(ipStr.substring(0, 3), 10) + "." + parseInt(ipStr.substring(3, 6), 10) + "." + parseInt(ipStr.substring(6, 9), 10) + "."
			+ parseInt(ipStr.substring(9, 12), 10);
	if (this.isValidIp(ip)) {
		return ip;
	}
	return -1;
};

/**
 * @description  判断是否是正确的IP。
 * @param {String} ip  需要判断的字符串
 * @return {Boolean} true：字符串是一个格式正确的IP，false：字符串不是一个格式正确的IP。
 */
InputBox.prototype.isValidIp = function(ip) {
	return /^(([01]?[\d]{1,2})|(2[0-4][\d])|(25[0-5]))(\.(([01]?[\d]{1,2})|(2[0-4][\d])|(25[0-5]))){3}$/.test(ip);
};

/**
 * @description  判断是否是正确的时间。
 * @param {String} str  时间字符串，格式位 hh:mm:ss  hh:mm  mm:ss
 * @param {Number} type 0: 时间为时分秒；1：时间格式为时分； 2：时间格式为分秒
 * @return {Boolean} true：字符串符合时间格式，false：字符串不符合时间格式。
 */
InputBox.prototype.isValidIime = function(str, type) {
	var timeArray = str.split(":");
	var h;
	var m;
	var s;
	switch (type) {
	case 0:
		h = parseInt(timeArray[0], 10);
		m = parseInt(timeArray[1], 10);
		s = parseInt(timeArray[2], 10);
		if (h < 24 && m < 60 && s < 60) {
			return true;
		}
		break;
	case 1:
		h = parseInt(timeArray[0], 10);
		m = parseInt(timeArray[1], 10);
		if (h < 24 && m < 60) {
			return true;
		}
		break;
	case 2:
		m = parseInt(timeArray[0], 10);
		s = parseInt(timeArray[21], 10);
		if (m < 60 && s < 60) {
			return true;
		}
		break;
	}
	return false;
};

/**
 * @description  把6位或者4位的数字字符串转变为时间格式，时分秒中间用“：”作为分隔符
 * @param {String} str   把6位或者4位的数字字符串
 * @return {String} 如果参数符合规范，返回XX:XX:XX或XX:XX格式的字符串,否则返回-1。
 */
InputBox.prototype.strToTime = function(str) {
	if (!/^[0-9]*$/.test(str))
		return -1;
	var str = str + "";
	var length = str.length;
	switch (length) {
	case 4:
		return str.substring(0, 2) + ":" + str.substring(2, 4);
		break;
	case 6:
		return str.substring(0, 2)+ ":" + str.substring(2, 4)+ ":" + str.substring(4, 6);
		break;
	default:
		return -1;
		break;
	}
};

/**
 * @description  替换字符串其中的一个字符。
 * @param {string} str 需要被替换的字符串
 * @param {Number}  index 中需要被替换的字符下标。
 * @param {Char} newchar 新字符，用于替换原字符中的字符。
 * @return {String} 如果参数符合规范，返回替换后字符串,异常情况返回-1。
 */
InputBox.prototype.replaceStrChar = function(str, index, newchar) {
	if (index >= str.length)
		return -1;
	var strArray = str.split("");
	strArray[index] = newchar;
	return strArray.join("");
};

InputBox.prototype.resetStr = function(str) {
	this.cellOnBlur(this.idArray[this.idx]);
	this.originStr = typeof str != 'undefined' ? str + "" : "";
	if (this.type == 2) {
		this.inputStr = this.originStr;
	} else {
		this.inputStr = this.originStr.substring(0, this.maxLen);
	}
	this.idx = 0;
	this.init();
}

InputBox.prototype.cellResetFocus = function(index) {
	if (isNaN(parseInt(index)) || index < 0 || index > this.maxLen)
		return;
	this.cellOnBlur(this.idArray[this.idx]);
	this.idx = index;
	this.cellOnFocus(this.idArray[this.idx]);
}

InputBox.prototype.setFocusState = function(flag) {
	this.focus = flag;
	if (flag) {
		this.cellFocus();
		this.onFocus(this.id);
	} else {
		this.cellBlur();
		this.onBlur(this.id);
	}
}

InputBox.prototype.getFocusState = function() {
	return this.focus;
}