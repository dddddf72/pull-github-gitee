/**
 * @fileOverview 栏目操作逻辑
 * @description 焦点循环、固定可配，数据循环可配
 * @author 905576 ，905112
 * @version 1.0
 */

/**
 * @description 带有数据显示、上下（左右）移动、焦点控制、滑动功能的menu控件
 * @constructor menu
 * @param {Number}
 *            menuIndex 数据下标 ,默认为0
 * @param {Number}
 *            menuFocus 焦点下标，默认为0
 * @param {Number}
 *            moveDir 焦点移动的方向，"H"为横向，"V"为纵向，默认为"H"
 * @param {Number}
 *            percent 滑动系数  默认0.7
 * @param {Number}
 *            menuSize 页面展示数据长度，默认为7
 * @param {Function}
 *            onFocus 获焦后相关联的处理函数，默认为空函数
 * @param {Function}
 *            iterator 数据展示函数，默认为空函数
 * @param {Boolean}
 *            isLoop 数据，焦点是否循环移动，默认false，焦点不循环移动
 * @param {Boolean}
 *            isFocusLoop 焦点是否移动，默认为false，true焦点不移动
 * @param {String}
 *            focusId 焦点div的Id，默认为空
 * @param {Number}
 *            focusTop 初始div的top值，默认为0
 * @param {Number}
 *            focusStep 移动的步长，默认0
 */

IEPG.Menu = function(_config) {
	this.menuIndex = _config.menuIndex || 0;
	this.menuFocus = _config.menuFocus || 0;
	this.moveDir = _config.moveDir || "V";
	this.percent = _config.percent || 0.1;
	this.menuSize = _config.menuSize || 7;
	this.onBlur = _config.onBlur || this._blank;
	this.onFocus = _config.onFocus || this._blank;
	this.iterator = _config.iterator || this._blank;
	this.isLoop = _config.isLoop || false;
	this.isFocusLoop = _config.isFocusLoop || false;
	this.focusId = _config.focusId || "";
	this.arrowUp = _config.arrowUp || "";
	this.arrowDown = _config.arrowDown || "";
	this.focusTop = _config.focusTop || 0;
	this.focusStep = _config.focusStep || 0;
	this.showSize = null;
	this.moveFlag = Boolean( typeof (this.focusId) != 'undefined' && typeof (this.focusTop) != 'undefined' && typeof (this.focusStep) != 'undefined');
};

IEPG.Menu.prototype = {
	/**
	 * @description 初始化数据
	 * @param {Object} _data 数组
	 * @return null
	 */
	initData : function(_data) {
		this.data = _data;
		this.dataLength = _data.length;
		this.showSize = this.menuSize < this.dataLength ? this.menuSize : this.dataLength;
		this._showData();
		if(this.dataLength == 0) {
			this._hideFocus();
		} else {
			this._setFocus();
			this._showFocus();
		}
		if(this.arrowUp && this.arrowDown) {
			var offset = this.menuIndex - this.menuFocus;
			if(this.dataLength == 0 || this.dataLength < this.menuSize){
				$(this.arrowDown).style.visibility = "hidden";
				$(this.arrowUp).style.visibility = "hidden";
			}
			if(this.dataLength > this.menuSize && offset < this.dataLength - this.menuSize) {
				$(this.arrowDown).style.visibility = "visible";
			} else {
				$(this.arrowDown).style.visibility = "hidden";
			}
			if(offset > 0) {
				$(this.arrowUp).style.visibility = "visible";
			} else {
				$(this.arrowUp).style.visibility = "hidden";
			}
		}
	},
	/**
	 * @description 显示数据
	 * @return null
	 */
	_showData : function() {
		var offsetPos;
		if(this.isFocusLoop) {//焦点不动
			offsetPos = 0;
			if(!this.dataMove) {//初始化菜单数据
				var pos = this.menuIndex;
				var newArr1 = this.data.slice(pos);//从指定位置开始复制数组，一直到最后
				var newArr2 = this.data.slice(0, pos);//从指定位置开始复制数组，一直到指定结束位置
				this.data = newArr1.concat(newArr2);//合并两个数组后返回新的数组
			}
		} else {
			offsetPos = this.menuIndex - this.menuFocus;
		}
		for(var i = 0; i < this.menuSize; i++) {//页面上处理函数this.iterator
			this.iterator(i < this.dataLength ? this.data[i + offsetPos] : null, i + offsetPos, i);
		}
	},
	/**
	 * @description 向左或向上移动
	 * @return null
	 */
	menuUp : function() {
		if(this.dataLength == 0){
			return;
		}
		this.dataMove = true;
		this._setBlur();
		this.oldFocusIndex = this.menuFocus;//焦点不动，文字循环
		if(this.isFocusLoop) {
			this.menuIndex--;
			if(this.menuIndex < 0) {
				this.menuIndex = this.data.length - 1;
			}
			var dateItem = this.data.pop();//移除数组中最后第一个元素并返回该元素
			this.data.unshift(dateItem);//向数组的末尾添加一个元素，并返回新的长度
			this._showData();
		} else {
			this.menuFocus--;
			this.menuIndex--;
			if(this.menuFocus < 0) {
				this.menuFocus = 0;
				if(this.menuIndex < 0) {
					if(this.isLoop) {
						this.menuIndex = this.data.length - 1;
						this.menuFocus = this.showSize - 1;
					} else {
						this.menuIndex = 0;
						this.menuFocus = 0;
						this._setFocus();
						return;
					}
				}
				this._showData();
				this._showArrow();
			}
		}
		this._setFocus();
	},
	/**
	 * @description 向右或向下移动
	 * @return null
	 */
	menuDown : function() {
		if(this.dataLength == 0){
			return;
		}
		this.dataMove = true;
		this._setBlur();
		this.oldFocusIndex = this.menuFocus;
		if(this.isFocusLoop) {//焦点不动，文字循环
			this.menuIndex++;
			if(this.menuIndex > this.data.length - 1) {
				this.menuIndex = 0;
			}
			var dateItem = this.data.shift();//移除数组中第一个元素并返回该元素
			this.data.push(dateItem);//向数组的末尾添加一个元素，并返回新的长度
			this._showData();
		} else {
			this.menuFocus++;
			this.menuIndex++;
			if(this.menuFocus > this.showSize - 1) {
				this.menuFocus = this.showSize - 1;
				if(this.menuIndex > this.data.length - 1) {
					if(this.isLoop) {
						this.menuIndex = 0;
						this.menuFocus = 0;
					} else {
						this.menuIndex = this.data.length - 1;
						this.menuFocus = this.showSize - 1;
						this._setFocus();
						return;
					}
				}
				this._showData();
				this._showArrow();
			}
		}
		this._setFocus();
	},
	/**
	 * @description 使某行获取焦点
	 * @return null
	 */
	_setFocus : function() {
		this.onFocus(this.menuFocus, this.menuIndex);//this.onFocus为页面上处理获焦的后相关联的函数
		if(!this.isFocusLoop) {//焦点移动
			if(!this.dataMove) {
				this.oldFocusIndex = 0;
			}
			this.newFocusIndex = this.menuFocus;
			if(this.moveFlag) {
				slide(this.focusId, this.focusTop + (this.oldFocusIndex * this.focusStep), this.focusTop + (this.newFocusIndex * this.focusStep), this.moveDir,this.percent);
			}
		}
	},
	/**
	 * @description 失焦后关联处理
	 * @return null
	 */
	_setBlur : function() {
		this.onBlur(this.menuFocus, this.menuIndex);
	},
	/**
	 * @description 移动后焦点初始化处理
	 * @return null
	 */
	resetSlide : function() {
		this.menuIndex = 0;
		this.menuFocus = 0;
		if(this.dataLength !== 0) {
			this._showFocus();
		} else {
			this._hideFocus();
		}
		if(this.moveFlag) {
			slide(this.focusId, this.focusTop + (this.menuFocus * this.focusStep), this.focusTop + (this.menuFocus * this.focusStep), this.moveDir,this.percent);
		}
	},
	/**
	 * @description 没数据时，隐藏焦点
	 * @return null
	 */
	_hideFocus : function() {
		$(this.focusId).style.display = "none";
	},
	/**
	 * @description 有数据时，显示焦点
	 * @return null
	 */
	_showFocus : function() {
		$(this.focusId).style.display = "block";
	},
	/**
	 * @description 栏目箭头
	 * @return null
	 */
	_showArrow : function() {
		if(this.arrowUp && this.arrowDown) {
			if(this.menuIndex >= this.dataLength - 1 ) {
				$(this.arrowDown).style.visibility = "hidden";
			}
			if(this.menuIndex <= 0) {
				$(this.arrowUp).style.visibility = "hidden";
			}
			if(this.menuIndex >= this.menuFocus) {
				var offset = this.menuIndex - this.menuFocus;
				if(offset > 0) {
					$(this.arrowUp).style.visibility = "visible";
				}
				if(offset < this.dataLength - this.menuSize) {
					$(this.arrowDown).style.visibility = "visible";
				}
			}
		}
	},
	/**
	 * @description 空函数，做默认处理
	 * @return null
	 */
	_blank : function() {
	}
};
