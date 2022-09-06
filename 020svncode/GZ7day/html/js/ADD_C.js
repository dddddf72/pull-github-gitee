// JavaScript Document
//try{
var LAST_ADD_MO = SysSetting.getEnv("ADD_MO");
var LAST_ADD_LE = parseInt(SysSetting.getEnv("ADD_LE")); //le == level ???
var LAST_ADD_OT = SysSetting.getEnv("ADD_OT");
var LAST_ADD_PA = SysSetting.getEnv("ADD_PA"); // pa == page ???
var ADD_LINK = SysSetting.getEnv("ADD_LINK");
//var ADD_LINK = $J.evnMulti("ADD_LINK");
var ADD_LEVEL_LINK = SysSetting.getEnv("ADD_LEVEL_LINK");
var LAST_ADD_LES = parseInt(LAST_ADD_LE/10);
var ADD_LES = parseInt(ADD_LE/10);
var ADD_LINK_ARR = new Array();
var ADD_LEVEL_LINK_ARR = new Array();

//document.write("<div style='text-align:center;'>before:"+ADD_LINK_ARR.join("<br>")+"</div>")
//document.write("<div style='text-align:center;'>before:"+ADD_LEVEL_LINK+"</div>")
//document.write("<div style='text-align:center;'>before:"+ADD_MO+"</div>")
//document.write("<div style='text-align:center;'>----------------------</div>")

if(ADD_LINK!=""){
	ADD_LINK_ARR = ADD_LINK.split("$#$");
	ADD_LEVEL_LINK_ARR = ADD_LEVEL_LINK.split("$#$");
	//document.write("<div style='text-align:center;'>------- CKCKCK---------</div>")

}
//document.write("<div style='text-align:center;'>-------    "+ADD_LINK_ARR.join("$#$")+" ----------</div>")
if(LAST_ADD_MO == ADD_MO){
	if(LAST_ADD_LE == ADD_LE){
	//同一层级
		if(LAST_ADD_PA == ADD_PA){
			//同一页面
			ADD_LINK_ARR.pop();
			ADD_LINK_ARR.push(window.location.href)
						
		}else{
			//document.write("<div style='text-align:center;'>-------    MO LE -PA ----------</div>")
			ADD_LEVEL_LINK_ARR.push(ADD_LE)
			ADD_LINK_ARR.push(window.location.href)
			//document.write("<div style='text-align:center;'>-------    "+ADD_LINK_ARR.join("$#$")+" ----------</div>")
			
		}
	}else if(LAST_ADD_LE > ADD_LE){
	//上层级
		for(var i=ADD_LEVEL_LINK_ARR.length-1;i>=0;i--){
			if(ADD_LEVEL_LINK_ARR[i]>=ADD_LE){
				var temp1 = ADD_LINK_ARR.pop();
				ADD_LEVEL_LINK_ARR.pop();
				//document.write("<div style='text-align:center;'>pop:"+temp1+"</div>")

			}
		}
		ADD_LEVEL_LINK_ARR.push(ADD_LE)
		ADD_LINK_ARR.push(window.location.href)
		
		
	}else if(LAST_ADD_LE < ADD_LE){
	//下层级	
		ADD_LEVEL_LINK_ARR.push(ADD_LE)
		ADD_LINK_ARR.push(window.location.href)
		
	}


}else if(LAST_ADD_MO!="main"){
	ADD_LEVEL_LINK_ARR = new Array();
	ADD_LINK_ARR = new Array();
	ADD_LEVEL_LINK_ARR.push(ADD_LE)
	ADD_LINK_ARR.push(window.location.href)
}else{
	ADD_LEVEL_LINK_ARR.push(ADD_LE)
	ADD_LINK_ARR.push(window.location.href)
}

var ADD_LINK = ADD_LINK_ARR.join("$#$");
var ADD_LEVEL_LINK = ADD_LEVEL_LINK_ARR.join("$#$");
//设置配置
SysSetting.setEnv("ADD_MO",ADD_MO);
SysSetting.setEnv("ADD_LE",ADD_LE+"");
SysSetting.setEnv("ADD_OT",ADD_OT);
SysSetting.setEnv("ADD_PA",ADD_PA);
//$J.evnMulti("ADD_LINK",ADD_LINK);
SysSetting.setEnv("ADD_LINK",ADD_LINK);
SysSetting.setEnv("ADD_LEVEL_LINK",ADD_LEVEL_LINK);
//document.write("<div style='text-align:center;'>after:"+ADD_LINK_ARR.join("<br>")+"</div>")
//document.write("<div style='text-align:center;'>after:"+ADD_LEVEL_LINK+"</div>")
//document.write("<div style='text-align:center;'>after:"+LAST_ADD_MO+"</div>")
//document.write("<div style='text-align:center;'>----------------------</div>")

if(ADD_MO != "nvod"){ //clear nvod data
	EPG.exitNVODMode();
	$J.evn("nvod_isSearch","0");
} 

//}catch(e){
	//document.write("<div style='text-align:center;'>error:"+e.message+"</div>")
//}



function add_back(){
	//try{
	if(ADD_LINK_ARR.length>1){
		location.href = ADD_LINK_ARR[ADD_LINK_ARR.length-2]
	}else if(ADD_OT != "none"){
		location.href = ADD_OT;
	}
	//}catch(e){
		//alert(e.message)	
	//}
}
function add_exit(){
	if(ADD_LINK_ARR.length>1){
		var ci = -2;
		for(var i=ADD_LEVEL_LINK_ARR.length-1;i>=0;i--){
			if(parseInt(parseInt(ADD_LEVEL_LINK_ARR[i]/10)) < ADD_LES){
				//document.write("<div style='text-align:center;'>---------OKOKOK--["+i+"]-------</div>")
				ci=i;
				break;
			}
		}
		if(ci>-2){
			//alert(ADD_LINK_ARR[ci])
			window.location.href = ADD_LINK_ARR[ci];			
		}else{
			location.href = ADD_OT;
		}
		
	}else if(ADD_OT != "none"){
		location.href = ADD_OT;
	}
}
