var portalSearchIP = '10.9.219.24:8080';

/**
 *得到年月日字符串
 * @param fmt_split,分隔字符
 */
function getTodayDateStr(fmt_split){
    if(fmt_split == null || fmt_split == ""){
        fmt_split = "-";
    }
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth()+1;
    var monthDay = today.getDate();
    if(month < 10){
        month = "0" + month;
    }
    if(monthDay < 10){
        monthDay = "0" + monthDay;
    }
    return year + fmt_split + month + fmt_split + monthDay;
}
/**
 *截取补全 
 * @param {Object} txt:原字符串
 * @param {Object} len:截取长度
 * @param {Object} afStr:补全字符串
 */
function subString(txt,len,afStr){
    var reTxt = "";
    if (typeof(txt) != "undefined" && txt != null && txt != "") {
        var tLen = txt.length;
        if (len == null || len == "") {
            reTxt = txt;
        }else{
            if (tLen < len) {
                reTxt = txt;
            }else{
                reTxt = txt.substr(0,len)+afStr;
            }
        }
    }
    return reTxt;
}
//设置当前时间信息
function setCurrentDateInfo(){
    var nowDate = new Date();
    var year = nowDate.getFullYear();
    var month = nowDate.getMonth()+1;
    var monthDay = nowDate.getDate();
    var weekDay = nowDate.getDay();
    var hours = nowDate.getHours().toString();
    var min = nowDate.getMinutes().toString();
    if(hours.length < 2){
        hours = "0"+hours;
    }
    if(min.length < 2){
        min = "0"+min;
    }
    var showTime = hours+":"+min;
    var showDayStr = "星期";
    switch(weekDay){
        case 1:
            showDayStr += "一&nbsp;&nbsp;&nbsp;&nbsp;"+month+"/"+monthDay;
            break;
        case 2:
            showDayStr += "二&nbsp;&nbsp;&nbsp;&nbsp;"+month+"/"+monthDay;
            break;
        case 3:
            showDayStr += "三&nbsp;&nbsp;&nbsp;&nbsp;"+month+"/"+monthDay;
            break;
        case 4:
            showDayStr += "四&nbsp;&nbsp;&nbsp;&nbsp;"+month+"/"+monthDay;
            break;
        case 5:
            showDayStr += "五&nbsp;&nbsp;&nbsp;&nbsp;"+month+"/"+monthDay;
            break;
        case 6:
            showDayStr += "六&nbsp;&nbsp;&nbsp;&nbsp;"+month+"/"+monthDay;
            break;
        case 0:
            showDayStr += "日&nbsp;&nbsp;&nbsp;&nbsp;"+month+"/"+monthDay;
            break;
    }
    setEleInnerHTML("timeSpan",showTime);
    //setEleInnerHTML("daySpan",showDayStr);
    setTimeout(setCurrentDateInfo,60000);
}
/**
 * 设置指定节点id的innerHTML内容
 * @param eleId:节点id
 * @param htmlStr:innerHTML内容
 */
function setEleInnerHTML(eleId,htmlStr){
    if(checkExistById(eleId)){
        if(htmlStr != null && htmlStr != ""){
            document.getElementById(eleId).innerHTML = htmlStr;
        }
    }
}
/**
 * 校验对象是否存在
 * @param eleId:element对象id
 * @returns {Boolean} true:存在，false:不存在
 */
function checkExistById(eleId){
    if(eleId != null && eleId != "" && Object.prototype.toString.call(eleId) === "[object String]"){
        var eleObj = document.getElementById(eleId);
        if(eleObj != null){
            return true;
        }
    }
    return false;
}
/**
 *替换所有标签 
 * @param {Object} str
 */
function replaceAllHtml(str){
    return str.replace(/<[^>]+>/g,"");
}
/*
 * 替换html标签为指定内容
 */
function replaceHtml(str,reStr){
    return str.replace(/<[^>]+>/g,reStr);
}
/**
 *替换&nbsp空格 为指定字符
 */
function replaceHtmlBlank(str,reStr){
    var rStr = str.replace(/\&nbsp/g,reStr);
    return rStr.replace(/\;/g,"");
}
function replaceAll(oldStr,replaceStr,toReStr){
    var finalStr = oldStr.replace(new RegExp(replaceStr,'gm'),toReStr);
    return finalStr;
}
//字符串转化为xml 
function toXmlDom(source){ 
    var xmlDoc = null; 
    if (window.ActiveXObject) { 
        var ARR_ACTIVEX = 
        ["MSXML4.DOMDocument","MSXML3.DOMDocument","MSXML2.DOMDocument","MSXML.DOMDocument","Microsoft.XmlDom"]; 
        var XmlDomflag = false; 
        for (var i = 0;i < ARR_ACTIVEX.length && !XmlDomflag ;i++) { 
            try { 
                var objXML = new ActiveXObject(ARR_ACTIVEX[i]); 
                xmlDoc = objXML; 
                XmlDomflag = true; 
            } catch (e) { 
            
            } 
        } 
        if (xmlDoc) { 
            xmlDoc.async = false; 
            xmlDoc.loadXML(source); 
        } 
    }else{ 
        var parser=new DOMParser(); 
        var xmlDoc=parser.parseFromString(source,"text/xml"); 
    } 
    return xmlDoc; 
} 
/**
 *正则表达式校验 
 * @param {Object} reg，例如var reg = /^1[3|4|5|7|8][0-9]{9}$/; 不要打引号
 * @param {Object} checkVal 待校验的值
 */
function regCheck(reg,checkVal){
    var reBol = true;
    if(reg != null && reg != ""){
        if(checkVal == null || checkVal == ""){
            reBol = false;
        }else{
            if(!reg.test(checkVal)){ 
                reBol = false;
            }
        }
    }else{
        reBol = false; 
    }
    return reBol;
}
/**
 * js实现trim 
 * @param {Object} str
 */
function jsTrim(str) {
    return str.replace(/^\s+|\s+$/gm,'');
}
/**
 * 
 * @param nId
 * @param className
 * @param callback
 * @returns
 */
function addClassCheckNext(nId,className,callback){
	if(checkExistById(nId)){
		addClass(document.getElementById(nId),className);
	}else{
		return false;
	}
	if(typeof(callback) == "function"){
		callback();
    }
}
/**
 *按钮方向键下一个获焦对象 
 * @param {Object} up
 * @param {Object} down
 * @param {Object} left
 * @param {Object} right
 */
function focusChannel(up,down,left,right){
    var obj = new Object();
    obj.left = left;
    obj.right = right;
    obj.up = up;
    obj.down = down;
    return obj;
}  
/**
 *设置焦点样式
 * @param oldId 原id
 * @param newId 新id
 * @styleName 样式名称
 */
function setFocusClassBy2(oldId,newId,styleName){
    var oldEleObj = document.getElementById(oldId);
    var newEleObj = document.getElementById(newId);
    if(oldEleObj != null && typeof(oldEleObj) != "undefined"){
        //oldEleObj.setAttribute("class", ""); 
        removeClass(oldEleObj,styleName);
    }
    if(newEleObj != null && typeof(newEleObj) != "undefined"){
        //newEleObj.setAttribute("class", "current"); 
        addClass(newEleObj,styleName);
    }
}
/**
 * 动态加载css样式文件
 * @param url
 * @returns
 */
function loadNewCss(cssUrl){ 
	var link = document.createElement( "link" ); 
	link.type = "text/css"; 
	link.rel = "stylesheet"; 
	link.href = cssUrl; 
	document.getElementsByTagName( "head" )[0].appendChild( link ); 
}
/**
 * 动态删除js.css文件的加载
 * @param filename
 * @param filetype
 * @returns
 */
function removejscssfile(filename, filetype){ 
	//判断文件类型 
	var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none"; 
	//判断文件名 
	var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none"; 
	var allsuspects=document.getElementsByTagName(targetelement); 
	//遍历元素， 并删除匹配的元素 
	for (var i=allsuspects.length; i>=0; i--){ 
	if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1) 
		allsuspects[i].parentNode.removeChild(allsuspects[i]); 
	} 
} 

/**
 * 
 * @param mss
 * @param style样式:hh:mi:ss 时分秒,mi:ss时分
 * @returns
 */
function formatDuring(mss,style) {
    //var days = parseInt(mss / (1000 * 60 * 60 * 24));
	var hours = "";
    var minutes = "";
    var seconds = "";
    if(style == null || style == ""){
    	style = "mi:ss";
    }
    var showHour = true;
    switch(style){
	    case "hh:mi:ss":
	    	hours = parseInt(mss / (1000 * 60 * 60));
	    	minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
	    	seconds = (mss % (1000 * 60)) / 1000;
	    	break;
	    case "mi:ss":
	    	showHour = false;
	    	minutes = parseInt(mss / (1000 * 60));
	    	seconds = (mss % (1000 * 60)) / 1000;
	    	break;
    }
    var finStr = "";
    if(hours != null && hours != ""){
    	if(hours < 10){
    		hours = "0" + hours;
    	}
    	finStr += hours + ":";
    }else{
    	if(showHour){
    		finStr +=  "00:";
    	}
    }
    if(minutes != null && minutes != ""){
    	if(minutes < 10){
    		minutes = "0" + minutes;
    	}
    	finStr += minutes + ":";
    }else{
    	finStr += "00:";
    }
    if(seconds != null && seconds != ""){
    	if(seconds < 10){
    		seconds = "0" + seconds;
    	}
    	finStr += seconds;
    }
    return finStr;
}
/**
 * 设置节点的背景图片，background
 * @param eleId:节点id
 * @param imgPath:图片相对路径
 * @returns
 */
function setEleBgImg(eleId,imgPath){
	if(eleId != null && eleId != "" && imgPath != null && imgPath != ""){
		var eleObj = document.getElementById(eleId);
		if(eleObj != null){
			var imgUrl = "url('"+ imgPath +"')";
			eleObj.style.background = imgUrl;
		}
	}
}
/**
 * 设置移动焦点有回调函数
 * @param oldId
 * @param newId
 * @param styleName
 * @param fun
 * @returns
 */
function setMoveClassCall(oldId,newId,styleName,fun){
	if(checkExistByIdLow(oldId) && checkExistByIdLow(newId)){
		var oldObj = document.getElementById(oldId);
		var newObj = document.getElementById(newId);
		removeClass(oldObj,styleName);
		addClass(newObj,styleName);
		if(typeof(fun) == "function"){
			fun();
		}
	}
}
/**
 * 校验对象是否存在（四平盒子）
 * @param eleId:element对象id
 * @returns {Boolean} true:存在，false:不存在
 */
function checkExistByIdLow(eleId){
	var isExits = false;
    if(eleId != null && eleId != ""){
        var eleObj = document.getElementById(eleId);
        if(eleObj != null){
        	isExits = true;
        }
    }
    return isExits;
}
/**
 * 数组复制
 * @param oldArr
 * @returns
 */
function arrayCopy(oldArr){
	var reArr = [];
	if(oldArr != null && oldArr.length > 0){
		var len = oldArr.length;
		for(var i = 0;i < len;i++){
			var oldItem = oldArr[i];
			reArr.push(oldItem);
		}
	}
	return reArr;
}
/**
 * 获取页面展示数组部分数据
 * @param mDataArr
 * @param start
 * @param end
 * @returns
 */
function getPageArr(mDataArr,start,end){
	var reArr = [];
	if(mDataArr != null && mDataArr.length > 0 && start != null && end != null){
		var len = mDataArr.length;
		if(end > len){
			end = len;
		}
		try{
			start = parseInt(start);
			end = parseInt(end);
			for(var i = start;i < end;i++){
				var oldItem = mDataArr[i];
				reArr.push(oldItem);
			}
		}catch(e){
			console.log("----getPageArr error-----");
		}
	}
	return reArr;
}
/**
 * 获取数组，通过比较字段值
 * @param mDataArr 原数组
 * @param colName 字段名称
 * @param colVal 字段值
 * @param colSpl 比较值间隔
 * @returns 
 */
function getPageArrByCol(mDataArr,colName,colVal,colSpl,pageSelArr){
	if(mDataArr != null && mDataArr.length > 0 && colName != null && colVal != null){
		var colArr = [];
		var len = mDataArr.length;
		if(colVal.indexOf(colSpl) > -1){
			colArr = colVal.split(colSpl);
			var cLen = colArr.length;
			for(var i = 0;i < cLen;i++){
				var tmpVal = colArr[i];
				if(tmpVal != null && tmpVal != "" && tmpVal != colSpl){
					for(var j = 0;j < len;j++){
						var oldItem = mDataArr[j];
						var goBre = false;
						for(var name in oldItem){  
			                var msg = name+": "+ oldItem[name]+"\r\n ";  
			                console.log(msg);
			                if(name == colName){
			                	if(oldItem[name] == tmpVal){
			                		//alert("getPageArrByCol--oldItem[name]:"+ oldItem[name] + "==tmpVal"+ tmpVal);
			                		pageSelArr.push(oldItem);
									goBre = true;
									break;
								}
			                }
			            } 
						if(goBre){
							break;
						}
					}
				}
			}
		}else{
			for(var i = 0;i < len;i++){
				var oldItem = mDataArr[i];
				var mVal = getColVal(oldItem,colName);
				if(mVal == colVal){
					pageSelArr.push(oldItem);
					break;
				}
			}
		}
	}
	//alert("pageSelArr----------------"+pageSelArr.length);
}
/**
 * 获取对象字段值
 * @param objItem
 * @param col 字段名称
 * @returns
 */
function getColVal(objItem,col){
	var reVal = "";
	for(var name in objItem){  
        var msg = name+": "+ objItem[name]+"\r\n ";  
        console.log(msg);
        if(name == col){
    		reVal = objItem[name];
			break;
        }
    } 
	return reVal;
}