/***
	分块区域构造函数。
***/
function Block(cfg){
	
	this.firstLevel = cfg;
	this.secondLevel = [];
	this.thirdLevel = [];
	this.fourthLevel = []; 
	
	this.initialLevel = function(parentLevel,sonLevel){
		for(var i=0,length=parentLevel.length;i<length;i++){
			for(var j=0;j<parentLevel[i].children.length;j++){
				sonLevel.push(parentLevel[i].children[j]);
			}
		}
	};
	this.initialLevel(this.firstLevel,this.secondLevel);
	this.initialLevel(this.secondLevel,this.thirdLevel);
	this.initialLevel(this.thirdLevel,this.fourthLevel);
	
	
	//获取这个对象
	this.getObjByName = function(name){
		for(var i=0,length=this.firstLevel.length;i<length;i++){
			if(this.firstLevel[i].name==name){
				return this.firstLevel[i];
			}
		}
		for(var i=0,length=this.secondLevel.length;i<length;i++){
			if(this.secondLevel[i].name==name){
				return this.secondLevel[i];
			}
		}
		for(var i=0,length=this.thirdLevel.length;i<length;i++){
			if(this.thirdLevel[i].name==name){
				return this.thirdLevel[i];
			}
		}
		for(var i=0,length=this.fourthLevel.length;i<length;i++){
			if(this.fourthLevel[i].name==name){
				return this.fourthLevel[i];
			}
		}
		return null;
	};
	
	//获取父对象
	this.getParentObj = function(name){
		var thisObj = this.getObjByName(name);
		return this.getObjByName(thisObj.parentBlockName);
	};	
	
	//得到所有的父级对象数组，从level=1开始。
	this.getParentObjs = function(name){
		var objArray = [];
		var thisObj=this.getObjByName(name);
		if(thisObj){
			switch (thisObj.level){
				case 1:
					break;
				case 2:
					objArray.push(this.getParentObj(name));
					break;
				case 3:
					var parentObj = this.getParentObj(name);
					var grandPar = this.getParentObj(parentObj.name);
					objArray.push(grandPar);
					objArray.push(parentObj);
					break;
				case 4:
					var parentObj = this.getParentObj(name);
					var grandPar = this.getParentObj(parentObj.name);
					var grandGrandPar = this.getParentObj(grandPar.name);
					objArray.push(grandGrandPar);
					objArray.push(grandPar);
					objArray.push(parentObj);
					break;
				default:
					break;
			}
		}
		return objArray;
	};

	
	//检测该元素是否在数组中
	this.containElem = function(arr,elem){
		for(var i=0;i<arr.length;i++){
			if(arr[i].name === elem.name){
				return true;
			}
		}
		return false;
	};
	

	this.jumpObj = [];
	this.clearJumpObj = function(){
		this.jumpObj = [];
	}
	//跳转时，获取所有需要保存信息有关的obj对象。
	this.getAllJumpObj = function(name){
		this.clearJumpObj();
		this.jumpObj = this.getParentObjs(name);
		this.jumpObj.push(this.getObjByName(name));
		return this.jumpObj;
	};
	

	this.setBlockFocus = function(block,infor){
		block.eventHandler.getFocus(infor.content);
		if(typeof infor.children.name!="undefined"
			&&typeof infor.children.name!=""){
				var thisObj = this.getObjByName(infor.children.name);
				this.setBlockFocus(thisObj,infor.children);
			}
	};
	
}





