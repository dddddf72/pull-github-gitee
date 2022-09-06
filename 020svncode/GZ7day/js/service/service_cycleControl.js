/***
	分块区域构造函数。
***/

var closeCycleControl = new function(){
	var stackSavePath = "/storage/storage0/closeCycleMgr.json";  //json文件路径
	
    this.stack = [];
	this.tmpNodeInfo = {moduleName:"",infor:{}};
	this.isBack = 0;  //是否是闭环标志位
	
	this.setIsBackToPage = function(isback){
        this.isBack = isback;
    };
	//检测当前板块是否为闭环返回
    this.checkIfDoCloseCycle = function(currentModelName){
		SumaJS.debug("this.checkIfDoCloseCycle isBack = "+this.isBack);
        if(this.isBack && this.stack.length >0 && this.stack[this.stack.length-1].moduleName == currentModelName){
            return 1;
        }		
        return 0;
    };
	
	this.setNode = function(moduleName,indexArr,name){
        this.clearTmpNodeInfo();
		this.tmpNodeInfo.moduleName = moduleName;
		this.saveInfor(indexArr,name);
    };
	//保存对象
	this.saveInfor = function(indexArr,name){		
		this.tmpNodeInfo.infor.indexArr = indexArr;
		this.tmpNodeInfo.infor.name = name;
	};
	
	
	this.clearTmpNodeInfo = function(){
        this.tmpNodeInfo = {moduleName:"",infor:{}};
    };
	
	//将tmpNodeInfo推入stack中
    this.pushNodeToStack = function(){
        var obj = this.clone(this.tmpNodeInfo);
        SumaJS.debug("node = "+JSON.stringify(obj));
        this.pushNode(obj);
        this.clearTmpNodeInfo();
    };
    this.pushNode = function(node){
        this.stack.push(node);
    };
    this.popNode = function(){
        this.isBack = 0;
        var item = this.stack.pop();
        //this.saveStack();
        return item;
    };
	
	//跳转页面时将其保存到json文件
    this.saveStack = function(){
        //SumaJS.saveFile(stackSavePath,{isBack:this.isBack,stack:this.stack});
		saveJSONFile(stackSavePath, {isBack:this.isBack,stack:this.stack}, 1); //保存json文件
    };
    this.recoverStack = function(){
        //var ret = SumaJS.readFile(stackSavePath,"json");
		var ret = {};
		try {
			ret = JSON.parse(readFile(stackSavePath, 3));
		}catch(e){
			SumaJS.debug("error:cycleControl "+ e.toString());
		}
        if(ret) {
			SumaJS.debug("this recoverStack infor = "+JSON.stringify(ret));
            this.isBack = ret.isBack;
            this.stack = ret.stack;
            SumaJS.debug("recoverStack isBack="+this.isBack+" stack="+this.stack);
        }else{
            this.clearStack();
            SumaJS.debug("closecycle recoverStack read "+stackSavePath+" failed!");
        }
    };
    this.clearStack = function(){
        SumaJS.debug("clearStack");
        this.isBack = 0;
        this.stack = [];
        this.saveStack();
    };
	this.clearStackS = function(){
        SumaJS.debug("clearStackS");
        this.isBack = 0;
        this.stack = [];
    };
	this.isArray = function (obj){
        return (typeof obj=='object')&&obj.constructor==Array;
    };
	this.clone = function(myObj){
        if (myObj == null) return myObj;
        if(this.isArray(myObj)) return myObj.concat();
        if(typeof myObj == "string") return myObj+"";
        if(typeof myObj == "number") return myObj-0;
        if (typeof(myObj) != 'object') return myObj;
        var myNewObj = new Object();
        for (var i in myObj) {
            myNewObj[i] = this.clone(myObj[i]);
        }
        return myNewObj;
    };
	
	//从闭环返回的处理，
	this.cycleBack = function(pageObj,node){
		var objArr = pageObj.getAllJumpObj(node.infor.name);
		for(var i=0;i<objArr.length;i++){
			//objArr[i].barObj.eventObj.getFocus(node.infor.indexArr[i]);
			objArr[i].barObj.getFocus(node.infor.indexArr[i]);
		}
	};
	
}();




