/**
 * @fileOverview 栏目、列表操作逻辑
 * @description 焦点循环、固定可配，数据循环可配
 * @author 905112
 * @version 1.0
 */


/**
 * @description MultiMove 逻辑操作初始对象，涉及栏目、列表移动公用的函数。
 */   
var MultiMove = {
	/**
	 * @description initializ对象初始化函数，主要是对组件相关参数进行赋值。
	 * @param {Number}
	 *            focusId 焦点ID
	 * @param {Number}
	 *            focusIndex 焦点下标，默认为0
	 * @param {String}
	 *            focusName 获焦样式名称（可选）
	 * @param {String}
	 *            blurName 失焦样式名称（可选）
	 * @param {Number}
	 *            size 页面展示数据长度，默认为1
	 * @param {Number}
	 *            splitNum 多行多列时，表示几列，当isMultSplit为true时，必传（可选）
	 * @param {Function}
	 *            iterator 数据遍历函数，默认为空函数（可选）
	 * @param {Function}
	 *            onBlur 焦点失焦后关联函数（可选）
	 * @param {Function}
	 *            onFocus 焦点获焦后的关联函（可选）
	 * @param {Function}
	 *            changeArea 多行多列时，存在多个区域时，区域切换函数。（可选）
	 * @param {Boolean}
	 *            isMultSplit 是否多行多列标识符，默认为false（可选）
	 * @param {Boolean}
	 *            isSplitPage 多行多列时，是否需要翻页标识，默认为false（可选）
	 * @param {Boolean}
	 *            isLoop 数据是否循法，默认为false（可选）
	 * @param {Function}
	 *            updateData 媒资列表页面翻页后数据更新函数（可选）
	 * @param {Number}
	 *            dataIndex 数据下标，当焦点与数据存在偏移时必传，默认为0（可选）
	 * @param {Boolean}
	 *            isFocusFix 焦点是否固定，默认为false（可选）
	 * @param {Number}
	 *            focusTop 焦点距容器的初始top值，默认为0（可选）
	 * @param {Number}
	 *            focusLeft 焦点距容器的初始left值，默认为0（可选）
	 * @param {Number}
	 *            focusLeftStep 焦点横向移动时步长，默认为0（可选）
	 * @param {Number}
	 *            focusStep 焦点纵向移动时步长，默认为0（可选）
	 * @param {String}
	 *            moveDir 焦点移动的方向，单一方向移动时有效。（可选）
	 * @param {Number}
	 *            percent 滑动系数  默认0.7（可选）
	 * @param {String}
	 *            arrowUL 上或下箭头的ID名称（可选）
	 * @param {String}
	 *            arrowDR 左或右箭头的ID名称（可选）
	 * @param {Number}
	 *            length 数据长度（可选）
	 * @param {Boolean}
	 *            initFocusStep 焦点纵向移动时初始步长（可选）
	 * @param {Number}
	 *            showSize 页面媒资展示有效长度
	 * @param {Boolean}
	 *            isTurn 是否已经翻页完成，初始化为true主要是用在快捷翻页
	 * @param {Number}
	 *            isPageTurn 前后翻页标示，1为向后、-1为向前
	 */
    initializ : function(_config) {
        this.focusId = _config.focusId || "";
        this.focusIndex = _config.focusIndex || 0;
        this.focusName = _config.focusName || "";
        this.blurName = _config.blurName || "";

        this.size = _config.size || 1;
        this.splitNum = _config.splitNum || parseInt(this.size / 2);

        this.iterator = _config.iterator || this._blank;
        this.onBlur = _config.onBlur || this._blank;
        this.onFocus = _config.onFocus || this._blank;
        this.changeArea = _config.changeArea || this._blank;
        this.isMultSplit = _config.isMultSplit || false;
        this.isSplitPage = _config.isSplitPage || false;
        this.isLoop = _config.isLoop || false;
        this.updateData = _config.updateData || this._blank;

        this.dataIndex = _config.dataIndex || 0;
        this.isFocusFix = _config.isFocusFix || false;
        this.focusTop = _config.focusTop || 0;//初始top和left不能为0
        this.finalFocusTop = this.focusTop || 0;//add by honggj
		this.finalFocusLeft = this.focusLeft || 0;
        this.focusLeft = _config.focusLeft || 0;
        this.focusLeftStep = _config.focusLeftStep || 0;
        this.focusStep = _config.focusStep || 0;
        this.moveDir = _config.moveDir || "V";
        this.percent = _config.percent || 1;

        this.arrowUL = _config.arrowUL || "";
        this.arrowDR = _config.arrowDR || "";
        this.length = _config.length || 0;
        this.isTurn = true;
        this.isPageTurn = 0;
        this.showSize = this.length > this.size ? this.size : this.length;
        this.initFocusStep = this.focusStep;
        this.initFocusTop = this.focusTop;
        this.moveFlag = Boolean(this.focusId != "");
    },
	/**
	 * @description initFocus 焦点初始化函数
     */
    initFocus : function() {
        if(this.length != 0) {
            this.showFocus();
            this.setFocus();
        } else {
            this.hideFocus();
        }
    },
	/**
	 * @description move 简单的焦点移动函数
     */ 
    move : function(offset){
        if(this.length == 0) {
            return;
        }
        this.oldFocusIndex = this.focusIndex;
        this.setBlur();
        this.focusIndex += offset;
        if(this.focusIndex > this.showSize - 1) {
            this.focusIndex = this.showSize - 1;
        } else if(this.focusIndex < 0) {
            this.focusIndex = 0;
        }
        this.setFocus();
    },
	/**
	 * @description setBlur 设置失焦函数
     */       
    setBlur : function() {
        this.onBlur(this.focusIndex, this.dataIndex);
        if(this.focusId && this.focusName) {
            $(this.focusId + this.focusIndex).className = this.blurName;
        }
    },
	/**
	 * @description setFocus 设置获焦函数
     */ 
    setFocus : function() {     
		this.onFocus(this.focusIndex, this.dataIndex);
        if(this.moveFlag) {
            if(!this.isFocusFix){
                if(this.oldFocusIndex == undefined) {
                    this.oldFocusIndex = 0;
                }
                this.newFocusIndex = this.focusIndex;
                if(this.focusLeft && this.focusTop){//change by honggj
                    moveSplit({"element" : this.focusId, "destination" : {"left" : this.focusLeft + (this.focusIndex % this.splitNum) * this.focusLeftStep, "top" : this.focusTop }, "speed" : this.percent})
                }else{
                    slide(this.focusId, this.focusTop + (this.oldFocusIndex * this.focusStep), this.focusTop + (this.newFocusIndex * this.focusStep), this.moveDir, this.percent);
                }
            }
        } else {
            if(this.focusId && this.focusName) {
                $(this.focusId + this.focusIndex).className = this.focusName;
            }
        }
		 
    },
	/**
	 * @description hideFocus 隐藏焦点样式函数
     */     
    hideFocus : function() {
        if(this.focusId) {
            $(this.focusId).style.display = "none";
        }
    },
	/**
	 * @description showFocus 显示焦点样式函数
     */     
    showFocus : function() {
        if(this.focusId) {
            $(this.focusId).style.display = "block";
        }
    },
	/**
	 * @description slideUpdown 滚动条滑动函数
     */      
    slideUpdown : function() {
        var currstep = srcollPos.initTop + Math.ceil((srcollPos.totallength - srcollPos.length) * (this.curPage - 1)/(this.totalPage - 1));
        //var currstep = 80 + Math.ceil((523 - 96) * (listFocus +(curPage - 1) * listPageSize)/(totalLength - 1));
        if(currstep <= 0) {
            $("srcoll").style.top = srcollPos.initTop + "px";
        //} else if(currstep >= 507) {
        //    $("srcoll").style.top = (srcollPos.totallength - srcollPos.length) + "px";
        }else{
            $("srcoll").style.top = currstep +"px";
        }
    },
	/**
	 * @description resetSlide 初始化滚动条位置函数
     */       
    resetSlidePos : function(){
    	$("srcoll").style.top = srcollPos.initTop + "px";
    },
	/**
	 * @description getCurrentStyle 取对象中指定属性值
	 * @param {Object}
	 *            _obj 源对象值
	 * @param {String}
	 * 			  _styleName 需要获取的指定样式属性值
	 */    
    getCurrentStyle : function(_obj, _styleName){
        var currentStyle = "";
        if(document.defaultView){//firefox
            currentStyle = document.defaultView.getComputedStyle(_obj, null)[_styleName];
        }else{//IE
            currentStyle = _obj.currentStyle[_styleName];
        }
        return currentStyle;
    },
	/**
	 * @description _blank 空函数
     */    
    _blank : function() {

    }
};


/**
 * @description Menu 栏目数据展示、箭头展示、移动处理对象
 */   

var Menu = {
	/**
	 * @description initMenuData 栏目数据初始化函数
	 */  
    initMenuData : function(_data){
        this.data = _data || "";
        this.length = this.data.length || 0;
        this.showSize = this.length > this.size ? this.size : this.length;
        this.showMenuData();
    },
	/**
	 * @description showMenuData 栏目数据遍历函数
	 */     
    showMenuData : function() {
        var offsetPos, i;
        if(this.isFocusFix) {
            offsetPos = 0;
            if(!this.dataMove) {//初始化菜单数据
                var pos = this.dataIndex;
                var newArr1 = this.data.slice(pos);//从指定位置开始复制数组，一直到最后
                var newArr2 = this.data.slice(0, pos);//从指定位置开始复制数组，一直到指定结束位置
                this.data = newArr1.concat(newArr2);//合并两个数组后返回新的数组
            }
        } else {
            offsetPos = this.dataIndex - this.focusIndex;
        }
        for(i = 0; i < this.size; i++) {//页面上处理函数this.iterator
            this.iterator(i < this.length ? this.data[i + offsetPos] : null, i, i + offsetPos);
        }
    },
	/**
	 * @description initMenuArrow 箭头初始化
	 */      
    initMenuArrow : function() {
        this.arrowUL = arrowUL || "";
        this.arrowDR = arrowDR || "";
        if(this.arrowUL && this.arrowDR) {
            var offset = this.dataIndex - this.focusIndex;
            if(this.length == 0 || this.length < this.size) {
                $(this.arrowDR).style.visibility = "hidden";
                $(this.arrowUL).style.visibility = "hidden";
            }
            if(this.length > this.size && offset < this.length - this.size) {
                $(this.arrowDR).style.visibility = "visible";
            } else {
                $(this.arrowDR).style.visibility = "hidden";
            }
            if(offset > 0) {
                $(this.arrowUL).style.visibility = "visible";
            } else {
                $(this.arrowUL).style.visibility = "hidden";
            }
        }
    },
	/**
	 * @description resetMenuArrow 箭头重新设置函数
	 */    
    resetMenuArrow : function() {
        if(this.arrowUL && this.arrowDR) {
            if(this.dataIndex >= this.length - 1) {
                $(this.arrowDR).style.visibility = "hidden";
            }
            if(this.dataIndex <= 0) {
                $(this.arrowUL).style.visibility = "hidden";
            }
            if(this.dataIndex >= this.focusIndex) {
                var offset = this.dataIndex - this.focusIndex;
                if(offset > 0) {
                    $(this.arrowUL).style.visibility = "visible";
                }
                if(offset < this.length - this.size) {
                    $(this.arrowDR).style.visibility = "visible";
                }
            }
        }
    },
	/**
	 * @description moveMenu 栏目移动函数
	 */     
    moveMenu : function(offset){
        if(this.length == 0) {
            return;
        }
        this.oldFocusIndex = this.focusIndex;
        this.setBlur();        
        if(this.isFocusFix){
            this.moveMenuFocusFixed(offset);
        }else{
            this.moveMenuFocus(offset);
        }
        this.setFocus();
        
    },
	/**
	 * @description moveMenuFocus 焦点移动函数
	 */      
    moveMenuFocus : function(offset) {
        this.focusIndex += offset;
        this.dataIndex += offset;
        if(this.focusIndex < 0) {
            this.focusIndex = 0;
            if(this.dataIndex < 0) {
                if(this.isLoop) {
                    this.dataIndex = this.length - 1;
                    this.focusIndex = this.showSize - 1;
                } else {
                    this.dataIndex = 0;
                    this.focusIndex = 0;
                    this.setFocus();
                    return;
                }
            }
            this.showMenuData();   
            this.resetMenuArrow();
        } else if(this.focusIndex > this.showSize - 1) {
            this.focusIndex = this.showSize - 1;
            if(this.dataIndex > this.length - 1) {
                if(this.isLoop) {
                    this.dataIndex = 0;
                    this.focusIndex = 0;
                } else {
                    this.dataIndex = this.length - 1;
                    this.focusIndex = this.showSize - 1;
                    this.setFocus();
                    return;
                }
            }
            this.showMenuData();
            this.resetMenuArrow();
        }else if(this.dataIndex > this.length - 1){
			this.dataIndex = 0;
            this.focusIndex = 0;
			this.showMenuData();
            this.resetMenuArrow();
		}
    },
	/**
	 * @description 焦点固定函数 
	 */   
    moveMenuFocusFixed : function(offset){
        this.dataMove = true;
        this.dataIndex += offset;
        if(offset < 0){
            if(this.dataIndex < 0) {
                this.dataIndex = this.length - 1;
            }
            var dateItem = this.data.pop();//移除数组中最后第一个元素并返回该元素
            this.data.unshift(dateItem);//向数组的末尾添加一个元素，并返回新的长度            
        }else{
            if(this.dataIndex > this.length - 1) {
                this.dataIndex = 0;
            }
            var dateItem = this.data.shift();//移除数组中第一个元素并返回该元素
            this.data.push(dateItem);//向数组的末尾添加一个元素，并返回新的长度            
        }
        this.showMenuData();
    },
	/**
	 * @description resetSlide 栏目移动后复位函数
	 */    
    resetSlide : function() {
        this.dataIndex = 0;
        this.focusIndex = 0;
        if(this.length !== 0) {
            this.showFocus();
        } else {
            this.hideFocus();
        }
        if(this.moveFlag){
        	 slide(this.focusId, this.focusTop + (this.focusIndex * this.focusStep), this.focusTop + (this.focusIndex * this.focusStep), this.moveDir,this.percent);
        }
    } 
};

/**
 * @description List 列表媒资的展示、箭头展示、焦点的移动的对象
 */ 
var List = {
	/**
	 * @description initListData 列表初始化函数
	 */    
    initListData : function(_data, _curPage, _totalPage){
        this.data = _data;
        this.length = this.data.length;
        this.showSize = this.length > this.size ? this.size : this.length;
        this.curPage = parseInt(_curPage) || 1;
        this.totalPage = parseInt(_totalPage) || 0;//默认为0
        // if($("srcoll")){//当页数小于2时，是否隐藏滚动条
        	// if(this.totalPage<=1)$("srcoll").style.visibility="hidden";
        	// else $("srcoll").style.visibility="visible";
        // }

        this.showListData();
		if(this.length > 0&&this.focusIndex > this.showSize - 1){ // edit by llb  删除某页最后一条数据时 focusIndex更新
			this.focusIndex = this.showSize - 1;
		}
        if(this.isPageTurn == -1){
    		this.focusIndex = this.showSize - 1;
			//this.focusLeft = this.finalFocusLeft + (this.splitNum - 1) * this.focusLeftStep;//add by llb
        }else if(this.isPageTurn == 1){
        	this.focusIndex = 0;
			//this.focusLeft = this.finalFocusLeft;//add by llb
        }
		if(this.isMultSplit) {  // edit by llb
            this.curCol = (this.focusIndex + 1) % this.splitNum != 0 ? parseInt((this.focusIndex + 1) / this.splitNum) + 1 : (this.focusIndex + 1) / this.splitNum;
            this.totalCol = this.length % this.splitNum != 0 ? parseInt(this.length / this.splitNum) + 1 : this.length / this.splitNum;
			this.focusTop = this.finalFocusTop + (this.curCol - 1) * this.focusStep;//add by honggja
        }
    },
	/**
	 * @description showListData 列表数据遍历函数
	 */        
    showListData : function(){
        var i;
        for(i = 0; i < this.size; i++) {
            this.iterator(i < this.length ? this.data[i] : null, i);
        }
        this.isTurn = true;        
    },
	/**
	 * @description moveList 单行列表数据移动函数
	 */     
    moveList : function(offset) {
        if(this.length == 0 || !this.isTurn) {
            return;
        }
    	if(!this.isLoop && ((this.curPage == 1 && this.focusIndex == 0 && offset == -1) || (this.curPage == this.totalPage && this.focusIndex == this.length - 1 && offset == 1))){
    		return;
    	}        
        this.oldFocusIndex = this.focusIndex;
        this.setBlur();
        this.focusIndex += offset;		
        if(1 < this.totalPage){
            if(this.focusIndex < 0 || this.focusIndex > this.length - 1){
                this.turnPage(offset);
                this.focusIndex = 0;
                return;
            } else{  // add by llb 
				this.changeCol(offset);//左右移动时更改curCol的值
				if(this.isMultSplit && this.curCol > 1){
					this.focusTop = this.initFocusTop + (this.curCol-1)*this.initFocusStep;
				}
			}           
        }else{   // edit by  llb  
            if(this.focusIndex < 0) {
				this.focusIndex = this.length - 1;
            }else if(this.focusIndex > this.length - 1) {
            	this.focusIndex = 0;
            }
			this.changeCol(offset);//左右移动时更改curCol的值
			if(this.isMultSplit){
				this.focusTop = this.initFocusTop + (this.curCol-1)*this.initFocusStep;
			}			
        }
		this.setFocus();
		
    }, 
	/**
	 * @description multiSplit 多行多列列表数据移动函数
	 */        
    multiSplit : function(offset) {
        if(this.length == 0 || !this.isTurn || !this.isMultSplit) {
            return;
        }
        if((this.curCol <= 1 && offset == -1) || (this.curCol == this.totalCol && offset == 1)) {
			this.setBlur();
            if(this.isSplitPage) {
            	if(!this.isLoop && ((this.curPage == 1 && offset == -1 && this.curCol <= 1) || (this.curPage == this.totalPage && offset == 1 && this.curCol == this.totalCol))){
            		return;
            	}
            	if(1 < this.totalPage){
	                this.turnPage(offset);
	                //this.focusIndex = 0;
            	}
            } else {
                this.changeArea(offset, this.focusIndex);
            }
        } else {
            this.setBlur();
            if(this.curCol > 1 && offset == -1) {
                this.curCol--;
                this.focusIndex = this.focusIndex - this.splitNum;
                this.focusTop = this.focusTop - this.initFocusStep;
            } else if(this.curCol <= this.totalCol - 1 && offset == 1) {
                this.curCol++;
                this.focusIndex = this.focusIndex + this.splitNum;
                if(this.focusIndex > this.showSize - 1) {
                    this.focusIndex = this.focusIndex - this.splitNum;
                    this.curCol = this.curCol - 1;
                }else{
                	this.focusTop = this.initFocusStep + this.focusTop;
                }
            }
            this.setFocus();
        }
    },
	/**
	 * @description changeCol 多行多列改变行数的关联函数
	 */     
    changeCol : function(offset) {
        if(this.isMultSplit) {
        	if(this.isLoop){
        		if(this.focusIndex == 0){
        			this.curCol = 1;
        		}else if(this.focusIndex == this.showSize - 1){
        			this.curCol = this.totalCol;
        		}
				
        	}
			if(this.focusIndex > this.curCol * this.splitNum - 1 && offset == 1) {
				this.curCol++;
			} else if(this.focusIndex < (this.curCol - 1) * this.splitNum && offset == -1) {
				this.curCol--;
			}        		
        	
        }
    },
	/**
	 * @description turnPage 列表翻页函数
	 */     
    turnPage : function(_offset){
        if(!this.isTurn || this.length == 0 || this.totalPage == 1){
            return;
        }        
        this.curPage += _offset;
        if(_offset > 0){
        	this.isPageTurn = 1;
        }else{
        	this.isPageTurn = -1;
        }
        if(this.curPage > this.totalPage) {
            this.curPage = 1;
        }
        if(this.curPage < 1) {
            this.curPage = this.totalPage;
        }
        this.updata();
    },
	/**
	 * @description updata 翻页后数据更新函数
	 */        
    updata : function() {
        this.isTurn = false;
        this.updateData(this.curPage);
		this.isPageTurn = 0;   //edit by llb
    },
	/**
	 * @description setPageInfo 页码设置函数
	 */        
    setPageInfo : function(_pageId) {
        if(this.totalPage <= 0) {
            this.curPage = 0;
            this.totalPage = 0;
        }
		$(_pageId).style.display = "block";
        $(_pageId).innerHTML = "第" + this.curPage + "/" + this.totalPage + "页";
    },
	/**
	 * @description initListArrow 列表页面初始化箭头函数
	 */        
    initListArrow : function(){
        if(this.length > 0){
            $(this.arrowDR).style.visibility = "visible";
            $(this.arrowUL).style.visibility = "visible";
            this.setListArrow();
        }else{
            $(this.arrowDR).style.visibility = "hidden";
            $(this.arrowUL).style.visibility = "hidden";         
        }
    },
		/**
	 * @description setListArrow 重新设置箭头函数
	 */      
    setListArrow : function() {
        if (this.totalPage > 1 && this.curPage != this.totalPage) {
            $(this.arrowDR).style.visibility = "visible";
        } else {
            $(this.arrowDR).style.visibility = "hidden";
        }
        if (this.curPage > 1) {
            $(this.arrowUL).style.visibility = "visible";
        } else {
            $(this.arrowUL).style.visibility = "hidden";
        }
    }
	
	
	/**
	 * @description setListArrow 重新设置箭头函数
	 */      
/*    setListArrow : function(_upSrcName, _downSrcName) {
        if (this.totalPage > 1 && this.curPage != this.totalPage) {
            $(this.arrowDR).src = _downSrcName + "_focus.png";
        } else {
            $(this.arrowDR).src = _downSrcName + ".png";
        }
        if (this.curPage > 1) {
            $(this.arrowUL).src = _upSrcName + "_focus.png";
        } else {
            $(this.arrowUL).src = _upSrcName + ".png";
        }
    }*/
};

/**
 *
 * @description moveSplit 焦点横向和纵向同时移动函数。
 * @param {Object}
 *            data 传给焦点移动的对象
 * 			  data格式：{element:$("choiceBar"), destination:{left:805, top:309}, current:{left:100, top:200},speed:0.4}
 * @param {Object}
 *            element 焦点ID对应的对象
 * @param {Object}
 *            destination 焦点ID的目的left和top值
 * @param {Object}
 *            current 焦点ID的初始left和top值，默认为当前位置
 * @param {Number}
 *            speed  焦点的滑动系数，范围0-1
 */
/*function moveSplit(data){
    var obj = $(data.element);
    var moveTimer = null;
    if (data.current) {
        var startPosition = data.current;
    } else {
        var startPosition = {
            left : parseInt(getCurrentStyle(obj, "left")),
            top : parseInt(getCurrentStyle(obj, "top"))
        };
    }
    var keydownHandler = document.onkeydown;
    document.onkeydown = function(event) {//移动的过程中，不响应任何操作
        var e = event || window.event;
        e.preventDefault();
    };
    moveTimer = window.setInterval(function() {
        var step = {
            left : data.speed * (data.destination.left - startPosition.left),
            top : data.speed * (data.destination.top - startPosition.top)
        };
        step.left = step.left > 0 ? Math.ceil(step.left) : Math.floor(step.left);
        step.top = step.top > 0 ? Math.ceil(step.top) : Math.floor(step.top);
        obj.style.left = parseInt(getCurrentStyle(obj, "left")) + step.left + "px";
        obj.style.top = parseInt(getCurrentStyle(obj, "top")) + step.top + "px";
        startPosition.top += step.top;
        startPosition.left += step.left;
        if (startPosition.left == data.destination.left && startPosition.top == data.destination.top) {
            obj.style.left = data.destination.left + "px";
            obj.style.top = data.destination.top + "px";
            window.clearInterval(moveTimer);
            document.onkeydown = keydownHandler;
        }
    }, 10);
}*/

function moveSplit(data){
    var obj = $(data.element);
	obj.style.left = data.destination.left + "px";
	obj.style.top = data.destination.top + "px";
}

/**
 * @description getCurrentStyle 取对象中指定属性值
 * @param {Object}
 *            obj 源对象值
 * @param {String}
 * 			  styleName 需要获取的指定样式属性值
 */ 
function getCurrentStyle(obj, styleName){
    var currentStyle = "";
    if(document.defaultView){       //firefox
        currentStyle = document.defaultView.getComputedStyle(obj, null)[styleName];
    }else{                      //IE
        currentStyle = obj.currentStyle[styleName];
    }
    return currentStyle;
}


/**
 * @description 整图滑动逻辑
 * @param {object}
 *            data 图片数据
 * @param {Number}
 *            length 图片数据的长度
 * @param {String}
 *            container 当前容器ID
 * @param {Number}
 *            pageSize 页面展示长度
 * @param {Number}
 * 			  listSize 页面有效展示长度
 * @param {Number}
 *            dataIndex 数据下标
 * @param {Number}
 * 			  focusIndex 焦点下标
 * @param {Boolean}
 * 			  moveFlag 是否移动标识
 * @param {Number} 
 *			  moveSpeed 移动系数，0~1之间，越大越快，反正越慢。 
 * @return null
 */

var ViewImage = function(_config) {
    this.data = _config.data || "";
    this.length = this.data.length || 0;
    this.container = _config.container || "";
    this.pageSize = _config.pageSize || 1;
    this.dataIndex = _config.dataIndex || 0;
    this.focusIndex = _config.focusIndex || 0;
    this.viewStyle = _config.viewStyle || "";
    this.moveSpeed = _config.moveSpeed || 0.3;
    this.moveFlag = true;
}

ViewImage.prototype = {
	/**
	 * @description initImage 初始化展示图片
	 */    
    initImage : function() {
        document.getElementById(this.container).innerHTML = "";
        this.listSize = Math.min(this.length, this.pageSize);
        var newul = document.createElement("ul");
        var licon = document.createDocumentFragment();
        for (var i = 0; i < this.listSize; i++) {
            var index = (i - this.focusIndex + this.dataIndex + this.length) % this.length;
            var newli = this.createLi(index)[0];
            var newimg = this.createLi(index)[1];
            var $this = this;
            newimg.onload = function() {
                $this.setImageSize(newimg);
            }
            licon.appendChild(newli);
        }
        newul.appendChild(licon);
        document.getElementById(this.container).appendChild(newul);
        document.getElementById(this.container).appendChild(this.createDotElement());
        this.setViewStyle();
    },
	/**
	 * @description createDotElement 初始化原点图片
	 */        
    createDotElement : function(){
    	/* 创建存放dot点和对应的文本信息的div */
    	var dotDiv = document.createElement("div");
    	dotDiv.setAttribute("class", "rectxt");
    	/* dot对应的文本信息 */
    	var dotTxt = document.createElement("div");
    	dotTxt.setAttribute("class", "txt");
    	dotTxt.setAttribute("id", "dotText");
    	dotTxt.innerHTML = this.data[this.dataIndex].name;
    	dotDiv.appendChild(dotTxt);
    	/* 动态创建dot */
    	var dotUl = document.createElement("div");
    	dotUl.setAttribute("class", "dotImg");
    	var dotFragment = document.createDocumentFragment();
    	for(var i = 0; i < this.length; i++){
    		var newli = document.createElement("li");
    		newli.setAttribute("id", "dot_" + i);
			dotFragment.appendChild(newli);
    	}
    	dotUl.appendChild(dotFragment);
    	dotDiv.appendChild(dotUl);
    	/* 焦点dot */
    	var dotFocusDiv = document.createElement("div");
    	dotFocusDiv.setAttribute("class", "dotblur");
    	dotFocusDiv.setAttribute("id", "dot_focus");
    	dotDiv.appendChild(dotFocusDiv);
    	//返回div对象
    	return dotDiv;
    },
	/**
	 * @description moveDot 当小圆点获焦时，图片滑动变为手动，可以对焦点进行移动操作
	 */      
    moveDot : function(_offset){
		if(_offset == 1){
			this.move(1);
		}else{
			this.move(-1);
		}
    },
	/**
	 * @description setDotPos 设置小原点的焦点方式
	 */      
    setDotPos : function(){
    	if(this.viewStyle){
	    	window.clearInterval(this.autoViewStyle);
	    	$("dot_focus").className = "dotfocus";
	    	this.viewStyle = "";    		
    	}else{
    		this.viewStyle = "auto";
    		$("dot_focus").className = "dotblur";
    		this.setViewStyle();
    	}
    },
	/**
	 * @description getJsonValue 取对象中指定属性值
	 * @param {Object}
	 *            _object 源对象值
	 * @param {String}
	 * 			  _attribute 需要获取的属性值
	 */      
    getJsonValue : function(_object, _attribute) {
        if (_attribute == "" || !_attribute) {
            return "";
        }
        return eval("_object" + "." + _attribute);
    },
	/**
	 * @description getStyle 取对象中指定属性值
	 * @param {Object}
	 *            _obj 源对象值
	 * @param {String}
	 * 			  _styleName 需要获取的指定样式属性值
	 */    
    getStyle : function(_obj, _styleName) {
        var currentStyle = "";
        if (document.defaultView) {//firefox
            currentStyle = document.defaultView.getComputedStyle(_obj,null)[_styleName];
        } else {//ie
            currentStyle = _obj.currentStyle[_styleName];
        }
        return currentStyle;
    },
	/**
	 * @description createLi 取对象中指定属性值
	 * @param {Number}
	 *            _index 数据下标
	 */        
    createLi : function(_index) {
        var newli = document.createElement("li");
        newli.innerHTML = "<span></span>";
        var newimg = document.createElement("img");
        newimg.setAttribute("src", this.data[_index].src);
        newli.getElementsByTagName("span")[0].appendChild(newimg);
        return [newli, newimg];
    },
	/**
	 * @description showImage 显示图片
	 * @param {Number}
	 *            pressEnter 
	 */   
    showImage : function() {
        if(this.viewStyle == ""){
        	$("dot_focus").className = "dotfocus";
        }else{
	        $("dot_focus").className = "dotblur";     	
        }
        $("dot_focus").style.left = 246 + this.dataIndex * 30 + "px";
        $("dotText").innerHTML = this.data[this.dataIndex].name;
    },
	/**
	 * @description setViewStyle 设置图片展示方式，可以为自动，可以手动控制
	 */     
    setViewStyle : function() {
        this.viewStyle = this.viewStyle == "auto" ? "auto" : "";
        //document.getElementById("view_style").getElementsByTagName("span")[0].innerHTML = this.viewStyle;
        var $this = this;
        if(this.viewStyle == "auto"){
        	if(this.length <= 1){
        		return; //当只有一张图片时，关闭滑动效果
        	}
			this.autoViewStyle = window.setInterval(function() {
				$this.move(1);
			}, 5000); 
        }else{
            window.clearInterval(this.autoViewStyle);
        }
    },
	/**
	 * @description move 图片整屏滑动逻辑
	 * @param {Number}
	 *            _offset 滑动方向，-1向左，1向右。
	 */      
    move : function(_offset) {
        if(this.moveFlag == false){
            return;
        }
        this.moveFlag = false;
        this.dataIndex += _offset;
        this.dataIndex %= this.data.length;
        this.dataIndex = this.dataIndex < 0 ? this.dataIndex+this.data.length : this.dataIndex;
        var referUl = document.getElementById(this.container).getElementsByTagName("ul")[0];
        var referLi = document.getElementById(this.container).getElementsByTagName("li")[0];
        var referLiTop = parseInt(this.getStyle(referLi,"top"));
        var referLiLeft = parseInt(this.getStyle(referLi,"left"));
        var referLiWidth = parseInt(this.getStyle(referLi,"width"));
        if(_offset == -1){
            var index = (this.listSize-this.focusIndex+this.dataIndex+this.data.length-1)%this.data.length;
        }else{
            var index = (0-this.focusIndex+this.dataIndex+this.data.length)%this.data.length;
        }
        
        var newli = this.createLi(index)[0];//li对象
        var newimg = this.createLi(index)[1];//图片对象
        newli.style.top = referLiTop + "px";
        newli.style.left = (referLiLeft + referLiWidth * _offset) + "px";
        referUl.appendChild(newli);
        var $this = this;
        newimg.onload = function(){
            $this.setImageSize(newimg);
            var startVal = 0;
            var stopVal = -_offset * referLiWidth;
            var nowVal = 0;
            var moveElement = referUl;
            $this.timer = window.setInterval(function(){
                nowVal = $this.moveSpeed *(stopVal-startVal);
                nowVal = nowVal > 0 ? Math.ceil(nowVal) : Math.floor(nowVal);
                moveElement.style.left = parseInt($this.getStyle(moveElement,"left")) + nowVal + "px";
                startVal += nowVal;
                if(startVal == stopVal){
                    referLi.getElementsByTagName("img")[0].setAttribute("src","");
                    referLi.parentNode.removeChild(referLi);
                    $this.moveFlag = true;
                    window.clearInterval($this.timer);
                    $this.showImage();
                }
            },1);
        }
    },
	/**
	 * @description setImageSize 设置图片尺寸大小
	 * @param {Number}
	 *            imgObj 当前图片对象
	 */      
    setImageSize : function(imgObj){
        var rateHeight = parseInt(imgObj.height)/338;
        var rateWidth = parseInt(imgObj.width)/684;
        var rateAdjustSize = Math.max(rateHeight,rateWidth);
        if(rateAdjustSize > 1){
            if(rateHeight == rateAdjustSize){
                imgObj.style.height = "338px";
            }else{
                imgObj.style.width = "684px";
            }
        }       
    }
}
