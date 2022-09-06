
/* 本JS中包含了showList和showList_2D两个封装 */

/**
 * @class
 * @desc 控制在页面列表数据信息上下（或左右）滚动切换以及翻页
 * @param {number} _listSize - [必选] 列表显示的长度
 * @param {number} _dataSize - [必选] 所有数据的长度
 * @param {number} _position - [可选] 数据焦点的位置，默认为0
 * @param {number} _startplace - [可选] 列表焦点Div开始位置的值，默认为0
 * @param {number} _f - [可选] 应用封装的窗口对象，默认为iPanel.mainFrame（非iPanel则为window）
 * 其他属性可自行设置：
 * 		{string/object} focusDiv - [可选] 列表焦点的ID名称或者定义为滑动对象（不设置则不操作焦点）
 *		{number/object} listHigh - [可选] 列表中每个行的高度（或每个列的宽度），可以是数值或者数值型数组（不设置则默认30，不操作焦点也可不设置）
 *		{number/string} listSign - [可选] 列表移动类型，0表示top属性，1表示left属性，也可以直接用"top"或"left"，默认0
 *		{boolean} showLoop - [可选] 是否循环显示内容，为true则自动打开焦点首尾循环与循环翻页，默认不循环
 *		{boolean} focusLoop - [可选] 焦点是否首尾循环切换，默认否
 *		{boolean} pageLoop - [可选] 焦点是否循环翻页，默认否
 *		{number} showType - [可选] 呈现的类型，0表示老的呈现方式（翻页的效果），1表示新的滚屏呈现方式，默认1
 *		{boolean} focusFixed - [可选] 焦点是否固定，默认否，为true则自动打开循环显示内容，如果当前showType是0，那么设置固定是无效的，如需要固定焦点，可设置focusPos属性表示焦点固定在哪个位置
 *		{function} haveData - [必选] 显示一条数据的回调方法
 *		{function} notData - [必选] 清除一条数据的回调方法
 * 方法调用和获取信息：
 *		{function} startShow - [必选] 调用该方法开始显示列表
 *		{function} changeList - [可选] 调用该方法切换焦点的位置
 *		{function} changePage - [可选] 调用该方法翻页
 *		{number} focusPos - [可选] 调用该属性得到当前焦点位置
 *		{number} position - [可选] 调用该属性得到当前焦点所在数据的位置
 *		{number} listPage - [可选] 调用该属性得到列表的总页数
 *		{number} currPage - [可选] 调用该属性得到当前焦点所在页数
 */
function showList(_listSize, _dataSize, _position, _startplace, _f) {
		this.currWindow = typeof(_f)     =="undefined" ? window : _f;
		this.listSize = typeof(_listSize)=="undefined" ? 0 : _listSize;  //列表显示的长度；
		this.dataSize = typeof(_dataSize)=="undefined" ? 0 : _dataSize;  //所有数据的长度；
		this.position = typeof(_position)=="undefined" ? 0 : _position;  //当前数据焦点的位置；
		this.focusPos = 0;      //当前列表焦点的位置；
		this.lastPosition = 0;  //前一个数据焦点的位置；
		this.lastFocusPos = 0;  //前一个列表焦点的位置；
		this.tempSize = 0;  //实际显示的长度；
		this.infinite = 0; //记录数值，用来获取数据焦点的位置；
		
		this.pageStyle  = 0;  //翻页时焦点的定位，0表示不变，1表示移到列表首部；
		this.pageLoop   = null;  //是否循环翻页, true表示是，false表示否；
		this.showLoop   = null;  //是否循环显示内容,this.showLoop如果定义为true,则自动打开焦点首尾循环与循环翻页；
		this.focusLoop  = null;  //焦点是否首尾循环切换；
		this.focusFixed = null;  //焦点是否固定，this.focusFixed如果定义为true,则自动打开循环显示内容；
		this.focusVary  = 1;  //当焦点发生改变时，如果前后焦点差的绝对值大于此值时，焦点再根据this.focusStyle的值做表现处理，此值必需大于0，否则默认为1；
		this.focusStyle = 0;  //切换焦点时，列表焦点的表现样式，0是跳动，1表示滑动；
		
		this.showType = 1; //呈现的类型，0表示老的呈现方式，1表示新的滚屏呈现方式；	
		this.listSign = 0; //0表示top属性，1表示left属性，也可以直接用"top"或"left"；
		this.listHigh = 30;  //列表中每个行的高度，可以是数值或者数组，例如：40 或 [40,41,41,40,42];
		this.listPage = 1;  //列表的总页数量；
		this.currPage = 1;  //当前焦点所在页数；
		
		this.focusDiv = -1;  //列表焦点的ID名称或者定义为滑动对象，例如："focusDiv" 或 new showSlip("focusDiv",0,3,40);
		this.focusPlace = new Array();  //记录每行列表焦点的位置值；
		this.startPlace = typeof(_startplace)=="undefined" ? 0 : _startplace;	 //列表焦点Div开始位置的值；
		
		this.haveData = function(){}; //在显示列表信息时，有数据信息就会调用该方法；
		this.notData = function(){}; //在显示列表信息时，无数据信息就会调用该方法；
		//调用以上两个方法都会收到参数为{idPos:Num, dataPos:Num}的对象，该对象属性idPos为列表焦点的值，属性dataPos为数据焦点的值；
		
		this.focusUp  = function(){this.changeList(-1);}; //焦点向上移动；
		this.focusDown= function(){this.changeList(1); }; //焦点向下移动；
		this.pageUp   = function(){this.changePage(-1);}; //列表向上鄱页；
		this.pageDown = function(){this.changePage(1); }; //列表向下鄱页；
		
		//开始显示列表信息
		this.startShow = function(){
			this.initAttrib();
			this.setFocus();
			this.showList();
		}
		//初始化所有属性；
		this.initAttrib = function(){	
			if(typeof(this.listSign)=="number") this.listSign = this.listSign==0 ? "top":"left";  //把数值转换成字符串；
			if(typeof(this.focusDiv)=="object") this.focusDiv.moveSign = this.listSign;  //设置滑动对象的方向值;
					
			if(this.focusFixed==null||(this.focusFixed&&this.showType==0)) this.focusFixed = false;  //初始化焦点是否固定，如果用户没有定义，则默认为false，如果当前showType是0，那么设置固定是无效的；
			if(this.showLoop  ==null) this.showLoop   = this.focusFixed ? true : false;  //初始化是否循环显示内容，如果用户没有定义并且焦点为固定，就会自动打开为true，否则为false, 需要注意的是焦点为固定时，不要强制定义为false;
			if(this.pageLoop  ==null) this.pageLoop   = this.showLoop ? true : false;	//初始化是否循环翻页，如果用户没有定义并且循环显示内容，就会自动打开为true，否则为false, 需要注意的是循环显示内容时，不要强制定义为false;
			if(this.focusLoop ==null) this.focusLoop  = this.showLoop ? true : false;   //初始化焦点是否首尾循环切换，如果用户没有定义并且循环显示内容，就会自动打开为true，否则为false, 需要注意的是循环显示内容时，不要强制定义为false;
			if(!this.focusFixed&&this.dataSize<this.listSize) this.showLoop = false;   //如果焦点不固定，并且数据长度小于列表显示长度，则强制设置循环显示内容为否；
			
			if(this.focusVary<1) this.focusVary = 1;
			if(this.focusPos>=this.listSize) this.focusPos = this.listSize-1;
			if(this.focusPos<0) this.focusPos = 0;
			if(this.position>=this.dataSize) this.position = this.dataSize-1;
			if(this.position<0) this.position = 0;
			this.lastPosition = this.infinite = this.position;
			
			this.initPlace();
			this.initFocus();
			this.lastFocusPos = this.focusPos;
		}
		//初始化焦点位置；
		this.initFocus = function(){
			this.tempSize = this.dataSize<this.listSize?this.dataSize:this.listSize;
			if(this.showType == 0){  //当前showType为0时，用户定义列表焦点是无效的，都会通过数据焦点来获取；
				this.focusPos = this.position%this.listSize;
			}else if(!this.focusFixed&&!this.showLoop){  //当前showType为1，焦点不固定并且不循环显示内容时，判断当前用户定义的列表焦点是否超出范围，如果是则重新定义；
				var tempNum = this.position-this.focusPos;
				if(tempNum<0||tempNum>this.dataSize-this.tempSize) this.focusPos = this.position<this.tempSize ? this.position : this.tempSize-(this.dataSize-this.position);
			}
		}
		//处理每行(列)所在的位置，并保存在数组里；
		this.initPlace = function(){
			var tmph = this.listHigh;
			var tmpp = [this.startPlace];		
			for(var i=1; i<this.listSize; i++) tmpp[i] = typeof(tmph)=="object" ? (typeof(tmph[i-1])=="undefined" ? tmph[tmph.length-1]+tmpp[i-1] : tmph[i-1]+tmpp[i-1]) : tmph*i+tmpp[0];
			this.focusPlace = tmpp;
		}
		//切换焦点的位置
		this.changeList = function(__num){
			if(this.dataSize==0) return;
			if((this.position+__num<0||this.position+__num>this.dataSize-1)&&!this.focusLoop) return;
			this.changePosition(__num);
			this.checkFocusPos(__num);
		}
		//切换数据焦点的值
		this.changePosition = function(__num){
			this.infinite += __num;
			this.lastPosition = this.position;	
			this.position = this.getPos(this.infinite, this.dataSize);
		}
		//调整列表焦点并刷新列表；
		this.checkFocusPos = function(__num){
			if(this.showType==0){	
				var tempNum  = this.showLoop ? this.infinite : this.position;
				var tempPage = Math.ceil((tempNum+1)/this.listSize);
				this.changeFocus(this.getPos(tempNum, this.listSize)-this.focusPos);
				if(this.currPage!=tempPage){ this.currPage = tempPage;this.showList(); }		
			}else{
				if((this.lastPosition+__num<0||this.lastPosition+__num>this.dataSize-1)&&!this.showLoop&&!this.focusFixed){
					this.changeFocus(__num*(this.tempSize-1)*-1);
					this.showList();
					return;
				}
				if(this.focusPos+__num<0||this.focusPos+__num>this.listSize-1||this.focusFixed){				
					this.showList();
				}else{
					this.changeFocus(__num);
				}
			}		
		}
		//切换列表焦点的位置
		this.changeFocus = function(__num){
			this.lastFocusPos = this.focusPos;
			this.focusPos += __num;
			this.setFocus(__num);
		}
		//设置调整当前焦点的位置；
		this.setFocus = function(__num){
			if(typeof(this.focusDiv)=="number") return;  //如果没定义焦点DIV，则不进行设置操作；
			var tempBool = this.focusStyle==0&&(Math.abs(this.focusPos-this.lastFocusPos)>this.focusVary||(Math.abs(this.position-this.lastPosition)>1&&!this.showLoop));  //当焦点发生改变时，根所前后焦点差的绝对值与focusStyle的值判断焦点表现效果；
			if(typeof(this.focusDiv)=="string"){  //直接设置焦点位置；
				this.$(this.focusDiv).style[this.listSign] = this.focusPlace[this.focusPos] + "px";
			}else if(typeof(__num)=="undefined"||tempBool){  //直接定位焦点；
				this.focusDiv.tunePlace(this.focusPlace[this.focusPos]);
			}else if(__num!=0){  //滑动焦点；
				this.focusDiv.moveStart(__num/Math.abs(__num), Math.abs(this.focusPlace[this.focusPos]-this.focusPlace[this.lastFocusPos]));
			}
		}	
		//切换页面列表翻页
		this.changePage = function(__num){	
			if(this.dataSize==0) return;
			var isBeginOrEnd = this.currPage+__num<1||this.currPage+__num>this.listPage;  //判断当前是否首页跳转尾页或尾页跳转首页;
			if(this.showLoop){   //如果内容是循环显示，则执行下面的翻页代码；
				if(isBeginOrEnd&&!this.pageLoop) return;
				var tempNum = this.listSize*__num;
				if(!this.focusFixed&&this.pageStyle!=0&&this.focusPos!=0){
					this.changePosition(this.focusPos*-1);
					this.checkFocusPos(this.focusPos*-1);
				}
				this.changePosition(tempNum);
				this.checkFocusPos(tempNum);
			}else{
				if(this.dataSize<=this.listSize) return;  //如果数据长度小长或等于列表显示长度，则不进行翻页；
				if(this.showType==0){
					if(isBeginOrEnd&&!this.pageLoop) return;   //如果是首页跳转尾页或尾页跳转首页, this.pageLoop为否，则不进行翻页；
					var endPageNum = this.dataSize%this.listSize;  //获取尾页个数;
					var isEndPages = (this.getPos(this.currPage-1+__num, this.listPage)+1)*this.listSize>this.dataSize;  //判断目标页是否为尾页;
					var overNum = isEndPages && this.focusPos >= endPageNum ? this.focusPos+1-endPageNum : 0;	  //判断目标页是否为尾页，如果是并且当前列表焦点大于或等于尾页个数，则获取它们之间的差；		
					var tempNum = isBeginOrEnd && endPageNum != 0 ? endPageNum : this.listSize;  //判断当前是否首页跳转尾页或尾页跳转首页，如果是并且尾页小于this.listSize，则获取当前页焦点与目标页焦点的差值，否则为默认页面显示行数；
					overNum = this.pageStyle==0 ? overNum : this.focusPos;  //判断当前翻页时焦点的style, 0表示不变，1表示移到列表首部；
					tempNum = tempNum*__num-overNum;				
					this.changePosition(tempNum);
					this.checkFocusPos(tempNum);
				}else{
					var tempPos   = this.position-this.focusPos;  //获取当前页列表首部的数据焦点；
					var tempFirst = this.dataSize-this.tempSize;  //获取尾页第一个数据焦点的位置；
					if(tempPos+__num<0||tempPos+__num>tempFirst){
						if(!this.pageLoop) return;  //不循环翻页时跳出，否则获取翻页后的数据焦点;
						tempPos = __num<0 ? tempFirst : 0;
					}else{
						tempPos += this.tempSize*__num;
						if(tempPos<0||tempPos>tempFirst) tempPos = __num<0 ? 0 : tempFirst;
					}		
					var tempNum = this.pageStyle==0||this.focusFixed ? this.focusPos : 0;  //判断当前翻页时焦点的style, 取得列表焦点位置；
					if(!this.focusFixed&&this.pageStyle!=0&&this.focusPos!=0) this.changeFocus(this.focusPos*-1);  //如果this.focusPos不为0，则移动列表焦点到列表首部；
					this.changePosition(tempPos-this.position+tempNum); 
					this.showList();
				}
			}
		}
		//显示列表信息
		this.showList = function(){
			var tempPos = this.position-this.focusPos;	 //获取当前页列表首部的数据焦点；
			for(var i=tempPos; i<tempPos+this.listSize; i++){		
				var tempObj = { idPos:i-tempPos, dataPos:this.getPos(i, this.dataSize) };  //定义一个对象，设置当前列表焦点和数据焦点值；
				( i >= 0 && i < this.dataSize)||(this.showLoop && this.dataSize !=0 ) ? this.haveData(tempObj) : this.notData(tempObj);  //当i的值在this.dataSize的范围内或内容循环显示时，调用显示数据的函数，否则调用清除的函数；
			}
			this.currPage = Math.ceil((this.position+1)/this.listSize);
			this.listPage = Math.ceil(this.dataSize/this.listSize);
		}
		//清除列表信息
		this.clearList = function(){
			for(var i=0; i<this.listSize; i++) this.notData( { idPos:i, dataPos:this.getPos(i, this.dataSize) } );
		}
		this.getPos = function(__num, __size){
			return __size==0 ? 0 : (__num%__size+__size)%__size;
		}
		this.$ = function(__id){
			return this.currWindow.document.getElementById(__id);
		}
}
