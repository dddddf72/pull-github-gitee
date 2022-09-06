var beyondTop = 500;//top值超出500则设置为隐藏
var rollLeft = 0;//需要滚动的资源块的left值,0代表不需要滚动
var rollArr = [];
var rollTabId = null;
var rollTop = 470;  //小于beyondTop但为最大的top值
var maxTop = 0;//rollArr中最大的cellY值
var firstRoll;//初始rollArr中的第0个元素
var liveTabId = 0;//直播小窗口所在的标签ID
//横向瀑布流布局
function ScrollHView(data, pageIndex) {
    this.data = data;
    this._data = {};
    this.pageIndex = pageIndex;
    this.map = {};
    this.id = '';
    this.focusId = getGlobalVar('focusId')||'';
    this.upFun = null;
    this.downFun = function () {
        this.onfocus()
    };
    this.sort();
}

ScrollHView.prototype.init = function (index){
    var data = this.data;
    var html = '';
	if(index === rollTabId){
		rollArr = [];
	}
    data.forEach(function (el, j) {
        if(index === rollTabId && rollLeft !==0 && el.cellX === rollLeft){
			var elBak = JSON.parse(JSON.stringify(el));//对象深拷贝
            rollArr.push(elBak);
			//rollArr.push(el);
        }
		if(el.option && el.option.isLive){
			liveTabId = index;
		}
        var style = 'position:absolute;' + 'left:' + el.cellX + 'px;top:' + el.cellY + 'px;width:' + el.width + 'px;height:' + el.height + 'px';
        if(el.cellY > beyondTop){
            style+= ';display:none;';
        }
        html += '<div class="main_cell" id="' + el.cellId + '" style=' + style + '><img src=' + el.posterUrl + ' /></div>'
        //html += '<h2>' + el.cellId + '</h2>'//标题
    })
	if(index === rollTabId && rollArr.length > 0){
		rollArr.sort(function(a,b){return a.cellY-b.cellY});
		console.log(rollArr);
		firstRoll = rollArr[0];
		maxTop = rollArr[rollArr.length-1].cellY;
	}
    this.id = 'tab' + index;
    $('tab' + index).innerHTML = html;
}

ScrollHView.prototype.sort = function (){
    var map = {};
    var obj = this.data;
    var len = obj.length;
    this.focusId = parseInt(getGlobalVar('tabIndex'))===Tab.focusPos?this.focusId:getFirstId(obj);
    for (var i = 0; i < len; i++) {
        //
        this._data[obj[i].cellId] = obj[i];
        //
        var item = obj[i];
        var X = item.cellX;
        var Y = item.cellY;
        if(Y>beyondTop){
            rollLeft = X;
        }
        var W = item.width;
        var H = item.height;
		var canGetFocus = getBinaryE(item.cellState,3);
//var Right = obj.filter((el) => (el.cellX >= X + W) && (el.cellY <= Y)).sort((a, b) => (a.cellX - b.cellX) || (b.cellY - a.cellY))[0];
        var Right = obj.filter(function (el) { return (el.cellX >= X + W*.5) && (el.cellY>=Y&&el.cellY<=Y+H || el.cellY<=Y&&el.cellY+el.height>=Y) }).sort(function (a, b) { return (a.cellX - b.cellX) || ( a.cellY + a.height*.5 +  b.cellY + b.height*.5 - 2*Y - H)*(a.cellY + a.height*.5 -  b.cellY - b.height*.5) || (a.cellY - b.cellY) })[0];
        var Bottom = obj.filter(function (el) { return (el.cellY >= Y+H*.5) && (el.cellX>=X&&el.cellX<=X+W || el.cellX<=X&&el.cellX+el.width>=X) }).sort(function (a, b) { return (a.cellY - b.cellY) || ( a.cellX + a.width*.5 +  b.cellX + b.width*.5 - 2*X - W)*(a.cellX + a.width*.5 -  b.cellX - b.width*.5) || (a.cellX - b.cellX) })[0];
        var Left = obj.filter(function (el) { return (el.cellX + el.width <= X+W*.5) && (el.cellY>=Y&&el.cellY<=Y+H || el.cellY<=Y&&el.cellY+el.height>=Y ) }).sort(function (a, b) { return (b.cellX + b.width - a.cellX - a.width) || ( a.cellY + a.height*.5 +  b.cellY + b.height*.5 - 2*Y - H)*(a.cellY + a.height*.5 -  b.cellY - b.height*.5) || (a.cellY - b.cellY) })[0];
        var Top = obj.filter(function (el) { return (el.cellY + el.height <= Y+H*.5) && (el.cellX>=X&&el.cellX<=X+W || el.cellX<=X&&el.cellX+el.width>=X) }).sort(function (a, b) { return (b.cellY + b.height - a.cellY - a.height) || ( a.cellX + a.width*.5 +  b.cellX + b.width*.5 - 2*X - W)*(a.cellX + a.width*.5 -  b.cellX - b.width*.5) || (a.cellX - b.cellX) })[0];
        map[item.cellId] = {
            left: Left,
            right: Right,
            up: Top,
            down: Bottom,
			canGetFocus:canGetFocus,
        };
    }
	if(rollTabId === null && rollLeft !== 0){
		console.log("rollTabId:"+rollTabId);
		rollTabId = Tab.focusPos;
	}
    this.map = map;
}

/*
ScrollHView.prototype.cellSort = function (obj){
        var left = obj[0].cellX;
        var index=0;
        var array = new Array();
        var topIndex = 0;
        for(var i = 1;i<obj.length;i++){
            if(left>obj[i].cellX){
                left = obj[i].cellX;
                index = i;
                array.push(i);
			}
        }
		if(array.length === 0){
			array.push(0)
		}
        for(var i= 0;i<obj.length;i++){
            if(i !== index){
                if(obj[i].cellX=== left){
                    array.push(i);
                }
            }
        }
        var top = obj[array[0]].cellY;
        for(var i = 0;i<array.length;i++){
            if(top>obj[array[i]].cellY){
                topIndex = array[i];
            }
        }
        return topIndex;
    }
	*/
	//取第一个焦点
    function getFirstId(obj){
        var item = obj[0];
		item = obj.sort(function(a,b){return (a.cellX-b.cellX) || (a.cellY-b.cellY)})[0];
		return item.cellId;
    }


ScrollHView.prototype.onkey = function (action) {
    this.onblur();
    var scrollview = this.id;
    var current = this.map[this.focusId][action];
    if (current) {
        this.focusId = current.cellId;
        var left = parseInt($(scrollview).style.left);
        if (current.cellX + current.width + left > 1920) {
            $(scrollview).style.left = (1920 - current.cellX - 180 - current.width) + 'px';
        }
        if (current.cellX + left < 0) {
            $(scrollview).style.left = (180 - current.cellX) + 'px';
        }
        this.onfocus();
    } else {
        switch (action) {
            case 'up':
                this.up();
                break;
            case 'down':
                this.down();
                break;
            default:
                this.onfocus();
                break;
        }
    }
}

ScrollHView.prototype.onfocus = function () {
    addClass($(this.focusId), 'focus');
}

ScrollHView.prototype.onblur = function () {
    removeClass($(this.focusId), 'focus');
}

ScrollHView.prototype.up = function () {
    if (this.upFun) {
        this.onblur();
        this.upFun();
    }
}

ScrollHView.prototype.down = function () {
    if (this.downFun) {
        this.onblur();
        this.downFun();
    }
}

//Tab 布局
function TabView(data, pageIndex) {
    this.pageIndex = pageIndex;
    this.data = data;
    this.len = data.length;
    this.downFun = null;
    this.tabFub = null;
    this.focusPos = pageIndex;
}

TabView.prototype.init = function (obj, obj2) {
    var data = this.data;
    var html = '';
    var html2 = '';
    data.forEach(function (el, i) {
        if(el.spacing=="190" && el.size=="50"){//有网络时,oms间距和字体默认值
            html += '<a  style="margin: 0 19px; font-size:29px;" id="nav' + i + '">' + el.tabName + '</a>';
        }else{
            if(el.tabDetail.indexOf("-native")){//无网络时
                html += '<a  style="margin: 0 '+el.spacing+'px; font-size:'+el.size+'px;" id="nav' + i + '">' + el.tabName + '</a>';
            }else{
                html += '<a  style="margin: 0 '+el.spacing+'px; font-size:'+el.size+'px;" id="nav' + i + '">' + el.tabName + '</a>';
            }
        }
        html2 += '<div class="main_list" style="left:0px" id="tab' + i + '"><div class="tabloading">正在加载...</div></div>';
    })
    $(obj).innerHTML = html;
    $(obj2).innerHTML = html2;
}

TabView.prototype.onkey = function (action) {
    if (action === 'down') {
        this.down();
    } else {
        this.onblur();
        switch (action) {
            case 'left':
                this.focusPos--;
                break;
            case 'right':
                this.focusPos++;
                break;
            case 'up':
				this.onfocus();
				return;
                break;
        }
        if (this.focusPos < 0) {
        //    this.focusPos = 0;
			this.focusPos = this.len - 1;
        }
        if (this.focusPos > this.len - 1) {
         //   this.focusPos = this.len - 1;
			this.focusPos = 0;
        }
        this.tabFub && this.tabFub(this.focusPos);
        this.onfocus();
    }
}

TabView.prototype.onfocus = function (bool) {
    if (bool) {
        var data = getGlobalVar("tabData");
        var jsonData = JSON.parse(data);
        $('nav' + this.focusPos).className = 'current';
    } else {
        $('bg').style.background = 'url(' + imgar[tabIndex].src + ')';
        //$('bg').style.background = 'url(' + jsonData.roleList[0].tabList[tabIndex].tabBgUrl + ')';
        $('nav' + this.focusPos).className = 'current focus';
        addClass($('tab' + this.focusPos), 'current');
    }
}

TabView.prototype.onblur = function (bool) {
    if (bool) {
        $('nav' + this.focusPos).className = 'current';
    } else {
        $('nav' + this.focusPos).className = '';

        removeClass($('tab' + this.focusPos), 'current');
    }
}

TabView.prototype.down = function () {
    this.downFun&&this.downFun();
}


//初始化
var Area = 0;
var Tab;
var ScrollH;

//键盘逻辑
function moveLeft() {
    switch (Area) {
        case 0:
//			if(lock){
//				lock =false;
				Tab && Tab.onkey('left');
//			}
            break;
        case 1:
            ScrollH && ScrollH.onkey('left');
            break;
        default:
            break;
    }
}

function moveRight() {
    switch (Area) {
        case 0:
            Tab && Tab.onkey('right');
            break;
        case 1:
            ScrollH && ScrollH.onkey('right');
            break;
        default:
            break;
    }
}

function moveUp() {
    switch (Area) {
        case 0:
            Tab && Tab.onkey('up');
            break;
        case 1:
            ScrollH && ScrollH.onkey('up');
            break;
        default:
            break;
    }
}

function moveDown() {
    switch (Area) {
        case 0:
            Tab && Tab.onkey('down');
            break;
        case 1:
            ScrollH && ScrollH.onkey('down');
            break;
        default:
            break;
    }
}

//缓存
function saveData(){
    setGlobalVar('focusId',ScrollH.focusId);
    setGlobalVar('Area',1);
    setGlobalVar('tabIndex',Tab.focusPos);
}

function getBinaryE(integer,index) {
        var str = integer.toString(2);
        var resStr = str.split("").reverse().join("");
        var e =resStr[index];
        if(e !== "1"){
            return 0;
        }else{
            return 1;
        }
    }
