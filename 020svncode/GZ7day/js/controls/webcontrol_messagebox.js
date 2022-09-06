/**
 * @constructor MessageBox
 * @description 提示框消息基类
 */
function MessageBox() {
	this.boxHandle = null; //提示框dom对象
	var showTag = true;//显示状态，默认提示框是显示的
	var okBut = {};//ok按钮对象
	var cancelBut = {};//cancel按钮对象
	var titleDom = null; //标题dom对象
	var msgDom = null; //消息的dom对象
	var msgArray = [];/*提示队列*/
	var currentMsg = null;/*当前的提示信息对象*/
	var bgDom = null; //背景dom对象
	
	this.focus = 0;
	/**
	 * @description 根据提示信息名称移除提示信息
	 * @param {String} msgName
	 */
	this.removeMsg = function(msgName) {
		var removePos = -1;
		for (var i = 0; i < msgArray.length; i++) {
			if (msgArray[i].name == msgName) {
				if(msgArray[i].timeout && typeof(msgArray[i].timeout.timeHandle) !="undefined"){
					clearTimeout(msgArray[i].timeout.timeHandle);	
				}
				msgArray.splice(i, 1);
				removePos = i;
				break;
			}
		}
		if (msgArray.length == 0) {
			this.hide();
			currentMsg = null;
		} else if (removePos == 0) {
			this.createBox(msgArray[0]);
		}
	};
	/**
	 * @description 检查提示信息队列中是否存在该提示信息，并返回信息在队列中的位置
	 * @param {String} msgName
	 * @return {Number} 提示信息对象在队列中的位置
	 */
	this.check = function(msgName) {
		for ( var i = 0; i < msgArray.length; i++) {
			if (msgArray[i].name == msgName) {
				return i;
			}
		}
		return -1;
	};

	/**
	 * @description 对提示信息队列中的对象按照现实的优先级升序排序
	 */
	this.sort = function() {
		if (msgArray.length > 1) {
			msgArray.sort(function(msg1, msg2) {
				if (msg1.priority < msg2.priority) {
					return -1;
				} else if (msg1.priority > msg2.priority) {
					return 1;
				} else {
					return 0;
				}
			});
		}
	};
	/**
	 * @description 设置元素的innerHTML
	 * @param {Object}DomObj 需要设置innerHTML的节点的对象
	 * @param {String}innerString 设置的文本（可包含html代码）
	 */
	this.setInnerHTML = function(DomObj, innerString) {
		if (DomObj) {
			DomObj.innerHTML = innerString;
		}
	};
	/**
	 * @description 重置提示框Dom节点
	 *@param {Object}DomObj 重置的Dom对象
	 */
	this.setBoxHandle = function(DomObj) {
		if (this.boxHandle) {
			this.destroy();
		}
		this.boxHandle = DomObj;
	}
	/**
	 * @description 销毁提示框
	 */
	this.destroy = function() {
		if(this.boxHandle){
			document.body.removeChild(this.boxHandle);
		}
		this.boxHandle = null;
	};
	/**
	 * @description 显示提示框
	 */
	this.show = function() {
		showTag = true;
		this.boxHandle.style.display = "block";
		this.focus = 1;

	};
	/**
	 * @description 隐藏提示框
	 */
	this.hide = function() {
		showTag = false;
		msgArray = [];/*提示队列*/
		this.boxHandle.style.display = "none";
		this.focus = 0;
	};

	/**
	 * @description 创建confirm提示框dom
	 * @param {Object}cfg 创建提示框的信息
	 */
	this.createBox = function(cfg) {
		var msgPostion = this.check(cfg.name);
		if (msgPostion == -1) {
			msgArray.push(cfg);
		} else {
			msgArray[msgPostion] = cfg;
		}
		/*对提示消息按照优先级升序排列，优先级值越小，优先级越高*/
		this.sort();
		/*第一个优先级最高，取它来显示*/
		var readyMsg = msgArray[0];
		if (currentMsg && currentMsg.name == readyMsg.name) {
			if (currentMsg.msgObj.msg == readyMsg.msgObj.msg) {
				//return;	
			}else{
				if (readyMsg.timeout && typeof (readyMsg.timeout.timeHandle) != "undefined"){
					clearTimeout(readyMsg.timeout.timeHandle);	
				}	
			}
		}
		var createFlag = true; /*如果提示框节点的Dom不存在，则创建，也可以在html代码中创建，如果再html中创建，则需要指定，如var msgbox = new MessageBox(); msgbox.setBoxHandle(document.getElementById("www"));*/
		if (this.boxHandle == null) {
			this.boxHandle = document.createElement('div');
		} else {
			createFlag = false;
		}
		this.boxHandle.className = readyMsg.boxCss;
		if (bgDom == null) {
			bgDom = document.createElement('div');
			this.boxHandle.appendChild(bgDom);
		}
		if (readyMsg.titleObj) {//创建标题dom
			if (titleDom == null) {
				titleDom = document.createElement('div');
				this.boxHandle.appendChild(titleDom);
			}
			titleDom.className = readyMsg.titleObj.style;
			
			titleDom.innerHTML = readyMsg.titleObj.title;

		} else {
			if (titleDom) {
				this.boxHandle.removeChild(titleDom);
			}
			titleDom = null;
		}
		if (readyMsg.msgObj) {//创建提示信息dom
			if (msgDom == null) {
				msgDom = document.createElement('div');
				this.boxHandle.appendChild(msgDom);
			}
			msgDom.className = readyMsg.msgObj.css;
			msgDom.innerHTML = readyMsg.msgObj.msg;
		} else {
			if (msgDom) {
				this.boxHandle.removeChild(msgDom);
			}
			msgDom = null;
		}
		if (readyMsg.okButObj) {//创建ok按钮
			if (okBut && okBut.domNode) {
				//每次都重新创建，避免上次的样式代码残留
				this.boxHandle.removeChild(okBut.domNode);
				okBut = {};
			}
			okBut.blur = readyMsg.okButObj.blur;
			okBut.focus = readyMsg.okButObj.focus;
			okBut.click = readyMsg.okButObj.click;
			//if (typeof okBut.domNode == "undefined") {
				okBut.domNode = document.createElement('div');
				this.boxHandle.appendChild(okBut.domNode);
		//	}
			okBut.domNode.className = readyMsg.okButObj.css;
			okBut.domNode.innerHTML = readyMsg.okButObj.title || "";
		} else if (okBut.domNode) {
			this.boxHandle.removeChild(okBut.domNode);
			okBut = {};
		}
		if (readyMsg.cancelButObj) {/*如果提供了取消按钮的创建参数，则创建取消按钮*/
			if (cancelBut && cancelBut.domNode) {
				//每次都重新创建，避免上次的样式代码残留
				this.boxHandle.removeChild(cancelBut.domNode);
				cancelBut = {};
			}
			cancelBut.blur = readyMsg.cancelButObj.blur;
			cancelBut.focus = readyMsg.cancelButObj.focus;
			cancelBut.click = readyMsg.cancelButObj.click;
			/*如果取消按钮的Dom节点不存在，则创建dom节点*/
			//if (typeof cancelBut.domNode == "undefined") {
				cancelBut.domNode = document.createElement('div');
				this.boxHandle.appendChild(cancelBut.domNode);
			//}
			cancelBut.domNode.className = readyMsg.cancelButObj.css;
			cancelBut.domNode.innerHTML = readyMsg.cancelButObj.title || "";
		} else if (cancelBut.domNode) {/*如果原来存在取消按钮的Dom节点，且配置参数中没有提供取消按钮的创建参数，则销毁取消按钮的dom节点，并初始化取消按钮的参数对象*/
			this.boxHandle.removeChild(cancelBut.domNode);
			cancelBut = {};
		}
		if (createFlag) {
		//	var parentDom = document.getElementById("msg_tip_parent_box");
			document.body.appendChild(this.boxHandle);
		}
		if (typeof readyMsg.eventHandler != "undefined") {
			this.eventHandler = readyMsg.eventHandler;
		}else{
			this.eventHandler = function(event){
				return true;
			}	
		}
		/*此处重置焦点的目的是处理在confirm类型的弹出框在切换焦点后，再次弹出会存在两个焦点的情况*/
		this.okButFocus();//按钮焦点
		this.cancelButBlur();//取消按钮失去焦点
		if (!showTag) {
			this.show();
		}
		if (typeof(readyMsg.timeout) != "undefined") {
			readyMsg.timeout.timeHandle = setTimeout(readyMsg.timeout.funcHandle, readyMsg.timeout.delayTime);
		}
		/*重置当前优先显示的提示消息体*/
		currentMsg = readyMsg;
		
		this.focus = 1;
	};

	/**
	 * @description 获取ok按钮的dom节点
	 * @return {Object}返回ok按钮的domNode
	 */
	this.getOkButDomObj = function() {
		if (okBut.domNode) {
			return okBut.domNode;
		}
		return null;
	};

	/**
	 * @description 获取cancel按钮的dom节点
	 * @return {Object}返回cancel按钮的domNode
	 */
	this.getCancelDomObj = function() {
		if (cancelBut.domNode) {
			return cancelBut.domNode;
		}
		return null;
	};

	/**
	 * @description 设置提示框的标题
	 * @param {String}txt 提示框的标题
	 */
	this.setTitle = function(txt) {
		this.setInnerHTML(titleDom, txt);
	};

	/**
	 * @description 设置提示框的提示消息
	 * @param {String}txt 提示框的提示消息
	 */
	this.setMsg = function(txt) {
		this.setInnerHTML(msgDom, txt);
	};

	/**
	 * @description ok按钮的获得焦点事件
	 */
	this.okButFocus = function() {
		if (typeof okBut.focus == "function") {
			okBut.focus(this);
		}
		this.onclick = okBut.click || function() {
		}; /* 把焦点按钮的click方法注册给Box的onclick */
	};

	/**
	 * @description ok按钮的失去焦点事件
	 */
	this.okButBlur = function() {
		if (typeof okBut.blur == "function") {
			okBut.blur(this);
		}
	};

	/**
	 * @description cancel按钮的获得焦点事件
	 */
	this.cancelButFocus = function() {
		if (typeof cancelBut.focus == "function") {
			cancelBut.focus(this);
		}
		this.onclick = cancelBut.click || function() {
		}; /* 把焦点按钮的click方法注册给Box的onclick */
	};

	/**
	 * @description cancel按钮的失去焦点事件
	 */
	this.cancelButBlur = function() {
		if (typeof cancelBut.blur == "function") {
			cancelBut.blur(this);
		}
	};

	/**
	 * @description 提示框的onclick事件,
	 */
	this.click = function() {
		this.onclick(this);
	};

	this.eventHandler = function() {
		return true;
	}
	/**
	 * @description 重置提示框背景Dom节点
	 *@param {Object}DomObj 重置的Dom对象
	 */
	this.getBgDom = function() {
		return bgDom;
	}
}