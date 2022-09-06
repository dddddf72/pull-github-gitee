function New(aClass, params) {
    function _new() {
        if(aClass.initializ) {
            aClass.initializ.call(this, params);
        }
    }
    _new.prototype = aClass;
    return new _new();
}

Object.extend = function(destination, source) {
    for(var property in source) {
        destination[property] = source[property];
    }
    return destination;
};

var $ = function(_id) {
    return typeof _id == 'string' ? document.getElementById(_id) : _id;
};
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
 * @param {Number} 
 *			  dot_focusLeft 小圆点的初始左边距。
  * @param {Number} 
 *			  imageWidth 图片宽。
 * @param {Number} 
 *			  imageHeight 图片高度。
 * @param {Number} 
 *			  autoTime 自动滑动的时间间隔。
 * @param {Boolean}
    *			  isJump 是否跳转出去。
 * @param {String}
    *			  当isJump 为true，JumpUrl必填 , 跳转地址。
 * @return null
 */

var ViewImage = function(_config) {
    this.data = _config.data || "";
    this.length = this.data.length || 0;
    this.container = _config.container || "";
    this.pageSize = _config.pageSize || 1;
    this.dataIndex = _config.dataIndex || 0;
    this.focusIndex = _config.focusIndex || 0;
    this.numIndex = _config.numIndex || 1;
    this.viewStyle = _config.viewStyle || "";
    this.moveSpeed = _config.moveSpeed || 0.3;
    this.moveFlag = true;
	this.dot_focusLeft= _config.dot_focusLeft || 0;
	this.imageWidth = _config.imageWidth || 0;
	this.imageHeight = _config.imageHeight || 0;
	this.autoTime = _config.autoTime || 3000;
    this.isJump = _config.isJump || false;
    this.JumpUrl = _config.JumpUrl || "";
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
    	//var dotTxt = document.createElement("div");
    	//dotTxt.setAttribute("class", "txt");
    	//dotTxt.setAttribute("id", "dotText");
    	//dotTxt.innerHTML = this.data[this.dataIndex].name;
    	//dotDiv.appendChild(dotTxt);
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
        newimg.setAttribute("src", this.data[_index].openpictureInfo.localPath);
		newimg.setAttribute("width", this.data[_index].openpictureInfo.width);
		newimg.setAttribute("height", this.data[_index].openpictureInfo.height);
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
        $("dot_focus").style.left = this.dot_focusLeft  + this.dataIndex * 30 + "px";
        //$("dotText").innerHTML = this.data[this.dataIndex].name;
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
			}, this.data[this.dataIndex].openpictureInfo.roration*1000);
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
        this.numIndex+=_offset;
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
            if(this.numIndex>this.data.length){
                if(this.isJump){//是否跳转出去
                    window.location.href=this.JumpUrl;
                    return;
                }
            }
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
        var rateHeight = parseInt(imgObj.height)/this.imageWidth;
        var rateWidth = parseInt(imgObj.width)/this.imageHeight;
        var rateAdjustSize = Math.max(rateHeight,rateWidth);
        if(rateAdjustSize > 1){
            if(rateHeight == rateAdjustSize){
                imgObj.style.height = this.imageWidth+"px";
            }else{
                imgObj.style.width = this.imageHeight+"px";
            }
        }       
    }
}
