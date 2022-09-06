/**
 * [menuListSlipObj description]
 * @fun
 * @desc win8风格的菜单
 */

function drawSquareObj(_paramObj) {
    this.callBack = _paramObj.callBack || function () {
    };
    this.panelId = _paramObj.panelId || "menuSquareBox";//要写入宫格数据的元素id
    this.unitId = _paramObj.unitId || "unit";//单元格的dom id
    this.dataPos = _paramObj.dataPos || 0;//当前焦点位置
    this.focusPos = _paramObj.focusPos || 0;
    this.data = _paramObj.data || [];//要显示的pos数组数据
    this.drawInfoObj = _paramObj.drawInfoObj;//生成单元格的基本信息

    this.unitInfoList = [];//单元格坐标信息
    this.videoInfo = {haveVideo: false};//小视频信息

    this.initData = function () {
      debugger
        this.iDebug("drawUnit--initData--in");
        this.reset();
        this.drawPanel();
        this.checkPos();
        //this.moveCallBack();
    };

    this.checkPos = function () {
        if (this.dataPos > this.unitInfoList.length - 1) {
            this.dataPos = 0;
        }
    };


    this.showFocus = function (_type) {
        if (_type == 1) {
            this.moveCallBack("moveFocus");
        }
        this.moveCallBack("showFocus");
        this.moveCallBack("onFocus");
    };

    this.hideFocus = function (_type) {
        this.moveCallBack("hideFocus");
        this.moveCallBack("loseFocus");
    };

    this.drawPanel = function () {
		if(this.unitInfoList.length > 0){
			this.reset();	
		}
        this.drawFinish = false;
        var _tmpList = [];
		var _haveChange = false;
		var _showStr = "";
        for (var i = 0; i < this.data.length; i++) {
            var _retObj = this.drawUnit(this.data[i]);
            if (_retObj.ret == 0) {
                //无效数据
                this.data.splice(i,1);
				_haveChange = true;
            } else if (_retObj.ret == 2) {
                //排到第一的位置
                _tmpList.unshift(this.data[i]);
				_haveChange = true;
				_showStr += 	_retObj.str;
            } else {
                _tmpList.push(this.data[i]);
				_showStr += 	_retObj.str;
            }
        }
        this.data = _tmpList;
		if(_haveChange){
        	this.callBack("changeData", this.data);
		}
		document.getElementById(this.panelId).innerHTML = _showStr;//画出当前的unit
        this.drawFinish = true;
        this.iDebug("drawPanel--this.data.length=" + this.data.length);
    };


    /**
     *退出清空
     */
    this.reset = function () {
        this.unitInfoList = [];
        document.getElementById(this.panelId).innerHTML = "";
    };

    this.getUnitStyle = function (_posObj) {
        return this.callBack("getUnitStyle", _posObj) || {};
    };

    /**
     画具体的某单元格
     */
    this.drawUnit = function (_posObj, dataPos) {
        var _drawMap = _posObj.grid;
        var _squareInfo = this.drawSkeleton(_drawMap);
        if (_squareInfo.ws == -1 && _squareInfo.we == -1 && _squareInfo.ls == -1 && _squareInfo.le == -1) {
            //-1的单元格不处理
            return {
				ret:0	
			};
        }
        var _darwInfoObj = this.drawInfoObj;
        var _unitInfo = {
            ws: _squareInfo.ws,	// 宽的起始横向下标
            we: _squareInfo.we,	// 宽的结束横向下标
            ls: _squareInfo.ls,	// 长的起始纵向下标
            le: _squareInfo.le,	// 长的结束纵向下标
            wMax: _drawMap[0].length,	// 几列
            lMax: _drawMap.length,	// 几列
            left: _squareInfo.ws * (_darwInfoObj.cellW + _darwInfoObj.marginW),
            top: _squareInfo.ls * (_darwInfoObj.cellH + _darwInfoObj.marginH),
            width: (_squareInfo.we - _squareInfo.ws + 1) * _darwInfoObj.cellW + (_squareInfo.we - _squareInfo.ws) * _darwInfoObj.marginW,
            height: (_squareInfo.le - _squareInfo.ls + 1) * _darwInfoObj.cellH + (_squareInfo.le - _squareInfo.ls) * _darwInfoObj.marginH
        }
        var wMax = _unitInfo.wMax;	// 几列
        var lMax = _unitInfo.lMax;		// 几行

        var _poster = _posObj.poster;
        var _posterLen = _poster.length;
        if (_posterLen == 0) return;//没描述poster的话，不做任何的操作
        var _img = "";
        if (_posterLen > 0) {
            _img = _poster[0].src[1] ? _poster[0].src[1] : _poster[0].src[0] ? _poster[0].src[0] : "";
        }
        var _title = (_posterLen > 0 ? _poster[0].title : "");
        var _key = (_posterLen > 0 ? _poster[0].key : "");
        var _desc = (_posterLen > 0 ? _poster[0].desc : "");


        var _unitId = this.unitId + this.unitInfoList.length;
        var _imgId = "imgId" + this.unitInfoList.length;
        _posObj.unitId = _unitId;
        var unitStyleObj = this.getUnitStyle(_posObj);//回调获取单元格的显示样式

        var _imgStyle = unitStyleObj.imgStyle || "";
        var _needShowTitle = typeof unitStyleObj.show != "undefined" ? unitStyleObj.show : true;

        _unitInfo.id = _unitId;//id也记录下来
        var rowNum = _unitInfo.le - _unitInfo.ls + 1;//占用几行，占用几列
        var colNum = _unitInfo.we - _unitInfo.ws + 1;
        var _classNum = "" + rowNum + colNum;

        if (_img) {
            if (typeof unitStyleObj.imgShow != "undefined" && !unitStyleObj.imgShow) {
                _img = "";
            }
            if (_imgStyle) { //传了样式的，以img32表示占据3行二列
                _imgStyle = _imgStyle + _classNum;
                var _str = '<div id="' + _unitId + '" style="position:absolute; width:' + _unitInfo.width + 'px; height:' + _unitInfo.height + 'px; top:' + _unitInfo.top + 'px; left:'+_unitInfo.left + 'px;"><img id="'+_imgId+'" class="' + _imgStyle + '" src="' + _img +'">';
            }
            else {  //没有传img的样式
                var _str = '<div id="' + _unitId + '" style="position:absolute; width:' + _unitInfo.width + 'px; height:' + _unitInfo.height + 'px; top:' + _unitInfo.top + 'px; left:' + _unitInfo.left + 'px;"><img id="'+_imgId+'" src="' + _img + '" width="100%" height="100%" >'
            }
            /*
			if(unitStyleObj.videoIcon){
				_str += '<div style="position:absolute; width:' + _unitInfo.width + 'px; height:' + _unitInfo.height + 'px; top:0px; left:0px;background:url(images/icon_play.png) no-repeat center"></div>'
			}*/
			
        } else {
            var unitBg = "";
            //判断是否为小视频，小视频的话不需要填充，可通过callBack回调获取判断
            if (!unitStyleObj.isVideo) {
                if (_darwInfoObj.unitBgStyle == 0) {
                    unitBg = "background-color:" + _darwInfoObj.unitBgStyle;
                } else if (_darwInfoObj.unitBgStyle == 1) {
                    unitBg = "background:url(" + _darwInfoObj.unitBgValue + ") -" + (_unitInfo.left) + "px -" + (_unitInfo.top) + "px";
                }
            } else {
                //保存小视频信息
                if (!this.videoInfo.haveVideo) {
                    //只保存第一个配置为小视频的
                    this.videoInfo.haveVideo = true;
                    this.videoInfo.left = _unitInfo.left;
                    this.videoInfo.top = _unitInfo.top;
                    this.videoInfo.width = _unitInfo.width;
                    this.videoInfo.height = _unitInfo.height;
                    this.videoInfo.dataObj = _posObj.poster;
                }
                _posObj.haveVideo = true;
            }
            var _str = '<div id="' + _unitId + '" style="position:absolute; width:' + _unitInfo.width + 'px; height:' + _unitInfo.height + 'px; top:' + _unitInfo.top + 'px; left:' + _unitInfo.left + 'px;' + unitBg + '">';

        }
        this.iDebug("drawUnit--_needShowTitle=" + _needShowTitle);
        // if (_title && _needShowTitle) {//需要通过文本输入子栏目的名称
        //     var _titleStyle = unitStyleObj.titleStyle || "";
        //     var _titleFontStyle = unitStyleObj.titleFontStyle || "";
        //     var _descStyle = unitStyleObj.descStyle || "";
        //     var _titleStr = "";
        //     this.iDebug("drawUnit--_titleStyle=" + _titleStyle);
        //     if (_titleFontStyle) {
        //         _titleStr = "<span class=\"" + _titleFontStyle + _classNum + "\">" + _title + "</span>";
        //     } else {
        //         _titleStr = "<span class=\"titleFontStyleDefault\">" + _title + "</span>";
        //     }
        //     if (_desc != '') {  //有描述字段
        //         if (_descStyle) {
        //             _titleStr += "<span class=\"" + _descStyle + _classNum + "\">" + _desc + "</span>";
        //         } else {
        //             _titleStr += "<span class=\"descStyleDefault\">" + _desc + "</span>";
        //         }
        //     }
        //     if (_titleStyle) {
        //         _str += "<div class=\"" + _titleStyle + _classNum + "\" >" + _titleStr + "</div>";
        //     } else {
        //         _str += "<div class=\"titleStyleDefault\">" + _titleStr + "</div>";
        //     }
        // }

        _str += "</div>";
        if (_darwInfoObj.marginFillStyle == 0) {//需要填充间隙颜色
            //右侧空隙填充
            _str += "<div style=\"position:absolute; width:" + _darwInfoObj.marginW + "px; height:" + _unitInfo.height + "px; top:" + _unitInfo.top + "px; left:" + (_unitInfo.left + _unitInfo.width) + "px;background-color:" + _darwInfoObj.marginValue + ";\"></div>";
            //下侧空隙填充
            _str += "<div style=\"position:absolute; width:" + (_unitInfo.width + _darwInfoObj.marginW) + "px; height:" + _darwInfoObj.marginH + "px; top:" + (_unitInfo.top + _unitInfo.height) + "px; left:" + _unitInfo.left + "px;background-color:" + _darwInfoObj.marginValue + ";\"></div>";
        } else if (_darwInfoObj.marginFillStyle == 1) {//用背景图填充
            //右侧空隙填充
            if (_unitInfo.we < wMax - 1) {
                var background0 = "background:url(" + _darwInfoObj.marginValue + ") -" + (_unitInfo.left + _unitInfo.width) + "px -" + (_unitInfo.top) + "px";
                _str += "<div style=\"position:absolute; width:" + _darwInfoObj.marginW + "px; height:" + _unitInfo.height + "px; top:" + _unitInfo.top + "px; left:" + (_unitInfo.left + _unitInfo.width) + "px;" + background0 + ";\"></div>";
            }
            //下侧空隙填充
            if (_unitInfo.le < lMax - 1) {
                if (_unitInfo.we < wMax - 1) {
                    var _w1 = _unitInfo.width + _darwInfoObj.marginW;
                } else {
                    var _w1 = _unitInfo.width;
                }
                var background1 = "background:url(" + _darwInfoObj.marginValue + ") -" + (_unitInfo.left) + "px -" + (_unitInfo.top + _unitInfo.height) + "px";
                _str += "<div style=\"position:absolute; width:" + (_w1) + "px; height:" + _darwInfoObj.marginH + "px; top:" + (_unitInfo.top + _unitInfo.height) + "px; left:" + _unitInfo.left + "px;" + background1 + ";\"></div>";
            }
        }
        this.iDebug("drawUnit--_str=" + _str);
        //document.getElementById(this.panelId).innerHTML += _str;//画出当前的unit
       var _ret = 1;
	    if (_unitInfo.ws == 0 && _unitInfo.ls == 0) {
            //左上的位置放在数组的第一个
            this.unitInfoList.unshift(_unitInfo);//当前unit的坐标信息
            _ret = 2;
        } else {
            this.unitInfoList.push(_unitInfo);//当前unit的坐标信息
        }
		return {
			str:_str,
			ret:_ret	
		};
    };


    /**
     * 假设数据符合长方形规则，画出长方形的4个顶点
     * _drawMap : 整张画布以及图形(2维数组表示所有可画的网格，值为0和1，0表示未画的网格，1表示已画的网格)
     */
    this.drawSkeleton = function (_drawMap) {
        //"grid":[[0,0,1,1,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]],
        var wMax = _drawMap[0].length;	// 几列
        var lMax = _drawMap.length;		// 几行
        var squareInfo = {
            ws: -1,	// 宽的起始横向下标
            we: -1,	// 宽的结束横向下标
            ls: -1,	// 长的起始纵向下标
            le: -1		// 长的结束纵向下标
        };
        // 遍历所有网格，从左上方第1个网格开始逐行读取
        for (var i = 0; i < lMax; i++) {
            for (var j = 0; j < wMax; j++) {
                if (_drawMap[i][j] == -1) {
                    //-1的单元格不要，去掉
                    return {
                        ws: -1,	// 宽的起始横向下标
                        we: -1,	// 宽的结束横向下标
                        ls: -1,	// 长的起始纵向下标
                        le: -1	// 长的结束纵向下标
                    };
                }
                // 第一次读取到1时，确定长方形左上方的顶点的坐标
                if (_drawMap[i][j] > 0 && squareInfo.ws == -1) {//查找左上
                    squareInfo.ws = j;
                    squareInfo.ls = i;
                    // 从第一个顶点纵向读取，再读到0或者读到最大长度即可确定squareInfo.le，确定左下方顶点的坐标
                    for (var k = i; k < lMax; k++) {//查找左下
                        if ((k < lMax - 1 && _drawMap[k + 1][j] == 0) || (k == lMax - 1 && _drawMap[k][j] > 0)) {
                            squareInfo.le = k;
                            break;
                        }
                    }
                    // 从第一个顶点横向读取，再读到0或者读到最大长度确定长方形的宽度，得到右上方和右下方顶点的坐标
                } else if (_drawMap[i][j] == 0 && squareInfo.ws != -1) { //查找右上
                    squareInfo.we = j - 1;
                    break;
                }
                if (j == wMax - 1 && _drawMap[i][j] > 0) {//如果  j已经走到了 最右边  并且 _drawMap[i][j] != 0  那么宽的结束坐标为整个布局的最右边
                    squareInfo.we = j;
                    break;
                }
            }
            if (squareInfo.le != -1) {//如果左下已经找到了就代表长方形的顶点已确认完毕
                break;
            }
        }
        return squareInfo;
    };


    //按键移动
    this.doKeyLeft = function () {
        var subFocusPos = this.dataPos;
        var unitInfoList = this.unitInfoList;
        if (unitInfoList[subFocusPos].ws == 0) {
            //最左边的单元格
            return {res: "nomove", desc: "first", "key": "left"};
        }
        for (var i = 0; i < unitInfoList.length; i++) {
            if (unitInfoList[subFocusPos].ws - 1 == unitInfoList[i].we && (unitInfoList[subFocusPos].ls == unitInfoList[i].ls || unitInfoList[subFocusPos].le == unitInfoList[i].le)) {
                subFocusPos = i;
                break;
            }
        }
        if (this.dataPos == subFocusPos) {
            for (var i = 0; i < unitInfoList.length; i++) {
                if (unitInfoList[subFocusPos].ws - 1 == unitInfoList[i].we) {
                    subFocusPos = i;
                    break;
                }
            }
        }
        if (this.dataPos == subFocusPos) {
            return {res: "nomove", desc: "last", "key": "left"};
        } else {
            this.moveCallBack("loseFocus");
            this.dataPos = subFocusPos;
            this.moveCallBack("moveFocus");
            this.moveCallBack("onFocus");
        }
        return {res: "success", desc: "", "key": "left"};

    };
    this.doKeyRight = function () {
        var subFocusPos = this.dataPos;
        var unitInfoList = this.unitInfoList;
        this.iDebug("doKeyRight--subFocusPos=" + subFocusPos);
        if (unitInfoList[subFocusPos].we == unitInfoList[subFocusPos].wMax - 1) {
            //最右边的单元格
            return {res: "nomove", desc: "last", "key": "right"};
        }
        for (var i = 0; i < unitInfoList.length; i++) {
            if (unitInfoList[subFocusPos].we + 1 == unitInfoList[i].ws && (unitInfoList[subFocusPos].ls == unitInfoList[i].ls || unitInfoList[subFocusPos].le == unitInfoList[i].le)) {
                //这个是图片都在同一行的情况
                subFocusPos = i;
                break;
            }
        }
        if (this.dataPos == subFocusPos) {
            //上述情况不符合时
            for (var i = 0; i < unitInfoList.length; i++) {
                if (unitInfoList[subFocusPos].we + 1 == unitInfoList[i].ws) {
                    //这个是不再同一行的情况,比如第一个图片在第二行第一列 第二个图片包含三行在第二列
                    subFocusPos = i;
                    break;
                }
            }
        }
        this.iDebug("doKeyRight--end--subFocusPos=" + subFocusPos + "--this.dataPos=" + this.dataPos);
        if (this.dataPos == subFocusPos) {
            return {res: "nomove", desc: "last", "key": "right"};
        } else {
            this.moveCallBack("loseFocus");
            this.dataPos = subFocusPos;
            this.moveCallBack("moveFocus");
            this.moveCallBack("onFocus");
        }
        return {res: "success", desc: "", "key": "right"};
    };

    this.doKeyUp = function () {
        var subFocusPos = this.dataPos;
        var unitInfoList = this.unitInfoList;
        if (unitInfoList[subFocusPos].ls == 0) {
            //最上边一列的单元格
            return {res: "nomove", desc: "first", "key": "up"};
        }
        for (var i = 0; i < unitInfoList.length; i++) {
            if (unitInfoList[subFocusPos].ls - 1 == unitInfoList[i].le && (unitInfoList[subFocusPos].ws == unitInfoList[i].ws || unitInfoList[subFocusPos].we == unitInfoList[i].we)) {
                subFocusPos = i;
                break;
            }
        }
        if (this.dataPos == subFocusPos) {    //上述情况不符合时
            for (var i = 0; i < unitInfoList.length; i++) {
                if (unitInfoList[subFocusPos].ls - 1 == unitInfoList[i].le) {
                    subFocusPos = i;
                    break;
                }
            }
        }
        if (this.dataPos == subFocusPos) {
            return {res: "nomove", desc: "last", "key": "up"};
        } else {
            this.moveCallBack("loseFocus");
            this.dataPos = subFocusPos;
            this.moveCallBack("moveFocus");
            this.moveCallBack("onFocus");
        }
        return {res: "success", desc: "", "key": "up"};
    };

    this.doKeyDown = function () {
        var subFocusPos = this.dataPos;
        var unitInfoList = this.unitInfoList;
        if (unitInfoList[subFocusPos].le == unitInfoList[subFocusPos].lMax - 1) {
            //最下边的单元格
            return {res: "nomove", desc: "last", "key": "down"};
        }
        for (var i = 0; i < unitInfoList.length; i++) {
            if (unitInfoList[subFocusPos].le + 1 == unitInfoList[i].ls && (unitInfoList[subFocusPos].ws == unitInfoList[i].ws || unitInfoList[subFocusPos].we == unitInfoList[i].we)) {
                subFocusPos = i;
                break;
            }
        }
        if (this.dataPos == subFocusPos) {    //上述情况不符合时
            for (var i = 0; i < unitInfoList.length; i++) {
                if (unitInfoList[subFocusPos].le + 1 == unitInfoList[i].ls) {
                    subFocusPos = i;
                    break;
                }
            }
        }
        if (this.dataPos == subFocusPos) {
            return {res: "nomove", desc: "last", "key": "down"};
        } else {
            this.moveCallBack("loseFocus");
            this.dataPos = subFocusPos;
            this.moveCallBack("moveFocus");
            this.moveCallBack("onFocus");
        }
        return {res: "success", desc: "", "key": "down"};

    };

    this.doKeySelect = function () {
        var _tmpObj = this.getCurrFocusObj();
        this.callBack("select", _tmpObj);
    };

    this.moveCallBack = function (_type, _isFirst) {
        if (typeof _isFirst == "undefiend") {
            _isFirst = false;
        }
        var _tmpObj = {
            dataPos: this.dataPos,
            focusPos: this.dataPos,
            unitInfo: this.unitInfoList[this.dataPos],
            isFirst: _isFirst
        };
        this.iDebug("moveCallBack--_tmpObj=" + JSON.stringify(_tmpObj));
        if (typeof _type == "undefined" || _type == "") {
            this.callBack("moveFocus", _tmpObj);
            this.callBack("onFocus", _tmpObj);
        } else if (_type == "moveFocus") {
            this.callBack("moveFocus", _tmpObj);
        } else if (_type == "loseFocus") {
            this.callBack("loseFocus", _tmpObj);
        } else if (_type == "onFocus") {
            this.callBack("onFocus", _tmpObj);
        } else if (_type == "showFocus") {
            this.callBack("showFocus", _tmpObj);
        } else if (_type == "hideFocus") {
            this.callBack("hideFocus", _tmpObj);
        }
    };

    this.getCurrFocusObj = function () {
        var _tmpObj = {dataPos: this.dataPos, focusPos: this.focusPos};
        return _tmpObj;
    };

    /*
    *打印函数
    */
    this.iDebug = function (_str) {
        _str = "[drawSquareObj.js]" + _str;
        if (navigator.appName.indexOf("iPanel") != -1) {
            iPanel.debug(_str);
        } else if (navigator.appName.indexOf("Opera") != -1) {
            opera.postError(_str);
        } else if (navigator.appName.indexOf("Netscape") != -1 || navigator.appName.indexOf("Google") != -1) {
            console.log(_str);
        }
    }
}
