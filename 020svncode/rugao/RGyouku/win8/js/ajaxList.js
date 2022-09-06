/**
 * @fileOverview List控件
 * @author 905576 ，905112
 * @version 1.00
 *
 */

/**
 * @description 带有数据显示、上下移动、上下翻页、焦点控制、滑动功能的List控件,支持分页取数据显示
 * @constructor List
 * @param {Number}
    *            pageSize 页能够显示的最大行数 ,默认为7
 * @param {Function}
    *            iterator 遍历显示每行数据的函数，默认为空函数
 * @param {Function}
    *            onFocus 焦点移动时调用的函数
 * @param {Function}
    *            onBlur 焦点移动时调用的函数
 * @param {Function}
    *            onNoData 没有数据时处理方式
 * @param {String}
    *            focusId 焦点条的ID
 * @param {Number}
    *            focusTop 焦点条处于第一行时的top值
 * @param {Number}
    *            focusStep 焦点每移动一行的步长
 * @param {Number}
    *            isLoop 列表循环翻页标志 true：循环翻页， false：不循环，默认为false【第一条记录和最后一条记录之间循环】
 * @param {String}
    *            isTurnPage 列表翻页标志，默认为""，则表示不是翻页取数据
 * @param {String}
    *            moveDir 焦点移动的方向，"H"为横向，"V"为纵向，默认为"V"
 * @param {Number}
    *            percent 滑动系数  默认0.7
 * @param {Function}
    *            updateData 更新翻页数据，默认为空函数
 * @param {String}
    *            currPage 当前页
 * @param {String}
    *            totalPage 总页数
 */

// var listJson = {   //必填参数如下，如有需要加入其他参数
// "pageSize" : pageSize,
// "iterator" : iterator,
// "focusId" : focusId,
// "focusStep" : focusStep,
//"updateData" : updateData
// }

IEPG.AjaxList = function(_listJson) {

    this.pageSize = _listJson.pageSize || 7;
    this.iterator = _listJson.iterator || this._blank;
    this.onFocus = _listJson.onFocus || this._blank;
    this.onBlur = _listJson.onBlur || this._blank;
    this.focusId = _listJson.focusId;
    this.focusTop = _listJson.focusTop;
    this.focusStep = _listJson.focusStep;
    this.isLoop = _listJson.isLoop || false;
    this.moveFlag = Boolean(typeof (this.focusId) != 'undefined' && typeof (this.focusTop) != 'undefined' && typeof (this.focusStep) != 'undefined');
    this.isTurnPage = _listJson.isTurnPage || "";
    this.updateData = _listJson.updateData || this._blank;
    this.moveDir = _listJson.moveDir || "V";
    this.percent = _listJson.percent || 1;
    this.up = function() {
        this._upDown(-1);
    };
    this.down = function() {
        this._upDown(1);
    };
    this.currPage = null;
    this.totalPage = null;
};

IEPG.AjaxList.prototype = {
    /**
     * @description 获取每页数据，服务器端做分页处理，每次翻页请求一次数据;
     * 			判断是否是取翻页数据，翻页后改变光标焦点
     * @param {Object} _data 获取的节目列表数据
     * @param {Number} _curPage 当前页码
     * @param {Number} _totalPage 总页数
     * @param {Number} _index 当前焦点所处下标
     * @return null
     */
    initData : function(_data, _curPage, _totalPage, _index) {
        this.data = _data;
        this.currPage = _curPage;
        this.totalPage = _totalPage;
        this.length = _data.length;
        this.listFocus =_index;
        this._showAjaxList();
        if( typeof (this.isTurnPage) != 'undefined' && this.isTurnPage != "") {
            if(this.isTurnPage == 1) {	//翻页取数据后，光标焦点值改变
                //新增向下翻页后记住翻页前焦点值
                if(this.listFocus<=this.length - 1)
                {
                     this.currIndex=this.listFocus;
                }
                else
                {
                     this.currIndex = 0;
                }
            } else if(this.isTurnPage == -1) {       //新增向上翻页后记住翻页前焦点值
                if(this.listFocus<=this.length - 1)
                {
                     this.currIndex=this.listFocus;
                }
                else
                {
                     this.currIndex = this.length - 1;
                }
            }
            if(this.moveFlag) {			//光标滑动
                slide(this.focusId, this.focusTop + (this.focusIndex * this.focusStep), this.focusTop + (this.currIndex * this.focusStep), this.moveDir, this.percent);
            }
            this.isTurnPage = "";
        } else {
            this.currIndex = _index;//初始化数据时，光标焦点默认页面保存的焦点值
            if(this.moveFlag) {	//光标滑动
                var initTop = this.focusTop + (this.currIndex * this.focusStep);
                $(this.focusId).style.top = initTop + "px";
            }
        }

        this._setFocus();
    },
    /**
     * @description 显示列表数据
     * @return null
     */
    _showAjaxList : function() {
        for( i = 0; i < this.pageSize; i++) {
            this.iterator(i < this.length ? this.data[i] : null, i, i);
        }
        this.isTurn = true;
    },
    /**
     * @description 向上移动一行焦点
     * @return null
     */
    _upDown : function(offset) {
        if(this.length == 0 && !this.isTurn) {
            return;
        }
        if(!this.isLoop && ((this.currPage == 1 && this.currIndex == 0 && offset == -1) || (this.currPage == this.totalPage && this.currIndex == this.length - 1 && offset == 1))){
            return;
        }
        var oldFocusIndex = this.currIndex;
        this._setBlur();
        this.currIndex += offset;
		
		//修改列表数据1/7上翻 6/12下翻
        if(1 < this.totalPage){
			if(this.currPage == 1){
				if(offset>0){
					if(this.currIndex == 6 || this.currIndex > this.length - 1){
					this.currIndex = 0;
					this._changePage(offset);
					this._setFocus();
					return;
                    }
				
				}else{
	
				
			    }
				
				
			}else if(this.currPage == this.totalPage){
				if(offset>0){
					
				
				}else{
	
					if(this.currIndex < 0 || this.currIndex == 5 ){
					this.currIndex = 0;
					this._changePage(offset);
					this._setFocus();
					return;
                     }
				
			    }
				
			}else {
				if(offset>0){
					if(this.currIndex == 6 || this.currIndex > this.length - 1){
					this.currIndex = 0;
					this._changePage(offset);
					this._setFocus();
					return;
                    }
				
				}else{
					if(this.currIndex < 0 || this.currIndex == 5 ){
					this.currIndex = 0;
					this._changePage(offset);
				    this._setFocus();
					return;
                     }
				
			    }
					
			}
            
        }else{
            if(this.currIndex < 0) {
                this.currIndex = this.length - 1;
            }
            if(this.currIndex > this.length - 1) {
                this.currIndex = 0;
            }
        }
        var newFocusIndex = this.currIndex;
        if(this.moveFlag) {
            slide(this.focusId, this.focusTop + (oldFocusIndex * this.focusStep), this.focusTop + (newFocusIndex * this.focusStep), this.moveDir, this.percent);
        }
        this._setFocus();
    },
    /**
     * @description 翻页
     * @param {Number} _offset -1:翻上页 1:翻下页
     * @return null
     */
    _changePage : function(_offset) {
        if(!this.isTurn && (this.length == 0 || this.totalPage == 1)){
            return;
        }
        this.isTurnPage = _offset;//翻页标志
        this.currPage += _offset;
		/*
        if(this.currPage > this.totalPage) {
            this.currPage = 1;
        }
        if(this.currPage < 1) {
            this.currPage = this.totalPage;
        }
		*/
        this._update();
    },
    /**
     * @description 向上翻页
     * @return null
     */
    pageUp : function() {
        if(this.totalPage < 2) {
            return;
        }
        if(!this.isTurn || this.length == 0 || this.totalPage == 1){
            return;
        }
        if((!this.isLoop || typeof (this.isLoop) == 'undefined') && (this.currPage == 1)) {
            return;
        }
        this._setBlur();
        this._changePage(-1);
    },
    /**
     * @description 向下翻页
     * @return null
     */
    pageDown : function() {
        if(this.totalPage < 2) {
            return;
        }
        if(!this.isTurn || this.length == 0 || this.totalPage == 1){
            return;
        }
        if((!this.isLoop || typeof (this.isLoop) == 'undefined') && (this.currPage == this.totalPage)) {
            return;
        }
        this._setBlur();
        this._changePage(1);
    },
    /**
     * @description 没数据时，隐藏焦点
     * @return null
     */
    hideFocus : function() {
        if(this.moveFlag) {
            $(this.focusId).style.display = "none";
        }
    },
    /**
     * @description 有数据时，显示焦点
     * @return null
     */
    showFocus : function() {
        if(this.moveFlag) {
            $(this.focusId).style.display = "block";
        }
    },
    /**
     * @description 获焦后关联处理
     * @return null
     */
    _setFocus : function() {
        this.onFocus(this.currIndex);
    },
    /**
     * @description 失焦后关联处理
     * @return null
     */
    _setBlur : function() {
        this.onBlur(this.currIndex);
    },
    /**
     * @description 翻页后更新数据
     * @return null
     */
    _update : function() {
        this.isTurn = false;
        this.updateData(this.currPage);
    },
    /**
     * @description 设置页码
     * @param {string} _pageId 页码id
     * @return null
     */
    setPageInfo : function(_pageId) {
        if(this.totalPage <= 0) {
            this.currPage = 0;
            this.totalPage = 0;
        }
       // $(_countPage).innerHTML =  this.totalPage ;
       // $(_currPage).innerHTML =  this.currPage ;
        $(_pageId).innerHTML = this.currPage + "/" + this.totalPage;

    },
    /**
     * @description 空函数
     * @return null
     */
    _blank : function() {
    }
};
