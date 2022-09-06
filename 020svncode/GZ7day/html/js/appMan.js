try{
var total;

//var app_collection = AppManager.appCollection;

var testData = [{"orgId":"1","appId":"1","name":"name","type":"type","version":"version","state":"state","size":"size"},
				 {"orgId":"2","appId":"1","name":"name","type":"type","version":"version","state":"state","size":"size"},
				 {"orgId":"3","appId":"1","name":"name","type":"type","version":"version","state":"state","size":"size"},
				 {"orgId":"4","appId":"1","name":"name","type":"type","version":"version","state":"state","size":"size"},
				 {"orgId":"5","appId":"1","name":"name","type":"type","version":"version","state":"state","size":"size"},
				 {"orgId":"6","appId":"1","name":"name","type":"type","version":"version","state":"state","size":"size"},
				 {"orgId":"7","appId":"1","name":"name","type":"type","version":"version","state":"state","size":"size"}];
var APPLICATIONS = AppManager.getApplications("null"); //testData; //AppManager.getApplications("null"); //

function startApp(orgId,appId)
{
	AppManager.startApp(orgId,appId,"");
}

function uninstallApp(orgId,appId){
	Autodeployer.stop(1);
	AppManager.uninstallApp(orgId, appId);

}

function stopApp(orgId,appId){
	AppManager.stopApp(orgId, appId);
}



//document.onsystemevent = grabSystemEvent;

function grabEvent(event)
{
	var code = event.which;
	console.debug("########### in grabEvent  #########code is "+code);
	switch(code)
	{
		case ROC_IRKEY_LEFT:
			break;
		case ROC_IRKEY_RIGHT:
			break;
		case ROC_IRKEY_UP:
		break;
		case ROC_IRKEY_DOWN:
		break;
		default:
			break;
	}
	return true;
}

function page_systemevent_handler(event){
	var val = event.which;
	var jsonString = SysSetting.getEventInfo(event.modifiers);
	var jsonObj;
	console.debug("====onsystemevent=== which["+event.which+"], type["+event.type+"], jsonString["+jsonString+"]");
	switch(val)
	{
		case AppManager_APPLICATION_START: //下载消息
			eval("jsonObj="+jsonString);
			if(jsonObj.actionStatus == "succeed")
			{
				//alert("启动成功！");
				console.debug("========xml download succeed!!=====");
			}else if(jsonObj.actionStatus == "failed"){
				alert("启动失败！");
				console.debug("========xml download failed!!=====");
			}
			break;
		case AppManager_APPLICATION_UNINSTALL:
			eval("jsonObj="+jsonString);

			console.debug("========xml uninstall "+jsonObj.actionStatus+"!=====");
			 if(jsonObj.actionStatus == "succeed")
			{
				alert("卸载成功！");
			}else if(jsonObj.actionStatus == "failed"){
				alert("卸载失败！");
			}
		   location.href = "appMan1.html";
		break;
		case AppManager_APPLICATION_STOP:
		   eval("jsonObj="+jsonString);
			if(jsonObj.actionStatus == "succeed")
			{
				alert("停止成功！");
			}else if(jsonObj.actionStatus == "failed"){
				alert("停止失败！");
			}
		   location.href = "appMan1.html";
		   break;
		case 11901:
				var deployType = DataAccess.getInfo("Autodeployer","type");
				alert("deployType:"+deployType);
				  if(deployType == "oc" || deployType == "auto-oc")
				  {
					   if(confirm("检测到应用列表已更新，需要立刻升级")){
							//tempArea = focusArea;
							//focusArea = FOCUS_UPDATE;
							//$("confirm_step_div").style.visibility = "visible";
							//$("confirm_step_content").innerHTML = "升级中请勿做任何操作,请勿断电."
							Autodeployer.startDeploy();
							//升级后要隐藏信息
					   }else{
							Autodeployer.cancelDeploy();
					   }

				  }else{
					 alert("检测到应用列表已更新，后台升级中！");
				  }
			break;
			case 11902:
				if(confirm("应用部署完成,是否查看应用")){
					location.href = "appMan1.html";
				}else{

				}
			break;
			case 11903:
				alert("应用部署失败");
				window.location.reload();
				//focusArea = focusArea;
				//$("confirm_step_div").style.visibility = "hidden";
				//$("confirm_step_content").innerHTML = ""
			break;
	}
}

window.onload = init;
function init()
{
	 showDateTime();
	 /*
	 var modelValue = DataAccess.getInfo("Autodeployer","type");// $("model").value;
	 if(modelValue=="oc"){
		$("model").options[0].selected=true;//value=modelValue;
	 }else if(modelValue=="ip"){
		 $("model").options[1].selected=true;
	 }
	 */
	//AppManager.downloadApp("http://192.166.162.53/testAppMan/applicationlist.xml");
	EMAIL_COUNT = APPLICATIONS.length;
	if(EMAIL_COUNT>0){
		showEMAIL();
		}
	DataCollection.collectData(["01","main://html/html/appMan1.html"+window.location.search,SysSetting.getEnv("SOURCE_PATH"),"应用管理列表"]);
	SysSetting.setEnv("SOURCE_PATH","main://html/html/appMan1.html"+window.location.search);
	//initAppList();
	//showPage();
}

function changeModel(){
	  var modelValue =  $("model").value;
	  Autodeployer.stop(0);
	  DataAccess.setInfo("Autodeployer","type",modelValue);
	  DataAccess.save("Autodeployer","type");
	  //if(modelValue=="ip"){
		Autodeployer.start();
		try{
		alert("部署模式已经修改为"+modelValue);
		}catch(e){alert(e.message)}
	  //}
}

function stopAutodeployer(){
	  Autodeployer.stop(0);
	  //Autodeployer.stop(1);
}

/***********************************/
var EMAIL_PAGENUM=1;   //当前页数
var EMAIL_PAGECOUNT=0; //总页数

var EMAIL_SIZE=4;       //应用每页显示条数
var EMAIL_COUNT=testData.length;     //应用数量
var EMAIL_NUM=0;

function mainsfm_pageup(){
			 if (EMAIL_PAGENUM>1){
				 EMAIL_PAGENUM--;
			   showEMAIL();

			 }else{
			   return;
			 }
	}

   // P+键响应事件
	function mainsfm_pagedown(){
		 if (EMAIL_PAGENUM<EMAIL_PAGECOUNT){
				EMAIL_PAGENUM++;
				showEMAIL();

			 }else{
			   return;
			 }
	}

 function showEMAIL(){
		if(typeof(EMAIL_COUNT)=='undefined'){
		   return -1;
		 }
	  //分页数
		var  z =parseInt( EMAIL_COUNT / EMAIL_SIZE);
		var y = EMAIL_COUNT % EMAIL_SIZE;
		//分页数
		EMAIL_PAGECOUNT = y == 0 ? z : ++z;

	//alert("记录："+CARD_COUNT);
	//alert("页数:"+CARD_PAGECOUNT);
	//先清空
	for (var i=0;i<EMAIL_SIZE;i++){
		$("name"+i).innerHTML = "";
		//$("orgAppId"+i).innerHTML = "";
		$("state"+i).innerHTML = "";
		$("type"+i).innerHTML = "";
		$("size"+i).innerHTML = "";
		$("boot"+i).innerHTML = "";

	}

	//$("pre_page_btn").src  ="${imagespath}/pre_page_btn.png";
	//$("next_page_btn").src  ="${imagespath}/next_page_btn.png";

		 EMAIL_NUM=0;
		 if (EMAIL_COUNT!=0){
			 if (EMAIL_PAGECOUNT<=1){  //只有一页
				for (var i=0;i<EMAIL_COUNT;i++){
					app= APPLICATIONS[i];   //app_collection.getApplicationByIdx(idx);
					$("name"+i).innerHTML = displayText(app.name, 238, 28);
					//$("orgAppId"+i).innerHTML = "("+app.appId+","+app.orgId+")";
					//$("name"+i).innerHTML="<a href='appInfo1.html?orgId="+app.orgId+"&appId="+app.appId+"'>"+app.name+"</a>"
				   // $("name"+i).innerHTML =  app.name;
					$("state"+i).innerHTML = app.state;
					$("type"+i).innerHTML = app.type;
					$("size"+i).innerHTML = app.version;//app.size+"&nbsp;B";
					$("boot"+i).innerHTML ="<input type='button'  class='appManBtn'  value='启动'  onclick='startApp("+app.orgId+","+app.appId+");'></input>&nbsp;<input type='button'  class='appManBtn'  value='停止'  onclick='stopApp("+app.orgId+","+app.appId+");'></input>";


					EMAIL_NUM++;
				 }
		   }else if (EMAIL_PAGECOUNT==EMAIL_PAGENUM){ //最后一页
			   var j=(EMAIL_PAGENUM-1)*EMAIL_SIZE;
			   for (var i=j;i<EMAIL_COUNT;i++){
					app= APPLICATIONS[i];   //app_collection.getApplicationByIdx(idx);
					$("name"+EMAIL_NUM).innerHTML = displayText(app.name, 238, 28);;
					//$("orgAppId"+EMAIL_NUM).innerHTML = "("+app.appId+","+app.orgId+")";
					//$("name"+i).innerHTML="<a href='appInfo1.html?orgId="+app.orgId+"&appId="+app.appId+"'>"+app.name+"</a>"
				   // $("name"+i).innerHTML =  app.name;
					$("state"+EMAIL_NUM).innerHTML = app.state;
					$("type"+EMAIL_NUM).innerHTML = app.type;
					$("size"+EMAIL_NUM).innerHTML = app.version;//app.size+"&nbsp;B";
					$("boot"+EMAIL_NUM).innerHTML = "<input type='button'  class='appManBtn'  value='启动'  onclick='startApp("+app.orgId+","+app.appId+");'></input>&nbsp;<input type='button'  class='appManBtn'  value='停止'  onclick='stopApp("+app.orgId+","+app.appId+");'></input>";
				  EMAIL_NUM++;
				 }

		   } else if (EMAIL_PAGENUM==1){ //第一页
			   for (var i=0;i<EMAIL_SIZE;i++){
				   app= APPLICATIONS[i];   //app_collection.getApplicationByIdx(idx);
					$("name"+i).innerHTML = displayText(app.name, 238, 28);;
					//$("orgAppId"+i).innerHTML = "("+app.appId+","+app.orgId+")";
					//$("name"+i).innerHTML="<a href='appInfo1.html?orgId="+app.orgId+"&appId="+app.appId+"'>"+app.name+"</a>"
				   // $("name"+i).innerHTML =  app.name;
					$("state"+i).innerHTML = app.state;
					$("type"+i).innerHTML = app.type;
					$("size"+i).innerHTML = app.version;//app.size+"&nbsp;B";
					$("boot"+i).innerHTML = "<input type='button'  class='appManBtn'  value='启动'  onclick='startApp("+app.orgId+","+app.appId+");'></input>&nbsp;<input type='button'  class='appManBtn'  value='停止'  onclick='stopApp("+app.orgId+","+app.appId+");'></input>";



				  EMAIL_NUM++;
				 }
	   }   else{
			   var j=(EMAIL_PAGENUM-1)*EMAIL_SIZE;
			   for (var i=j;i<EMAIL_PAGENUM*EMAIL_SIZE;i++){
					app= APPLICATIONS[i];   //app_collection.getApplicationByIdx(idx);
					$("name"+EMAIL_NUM).innerHTML = displayText(app.name, 238, 28);;
					//$("orgAppId"+EMAIL_NUM).innerHTML = "("+app.appId+","+app.orgId+")";
					//$("name"+i).innerHTML="<a href='appInfo1.html?orgId="+app.orgId+"&appId="+app.appId+"'>"+app.name+"</a>"
				   // $("name"+i).innerHTML =  app.name;
					$("state"+EMAIL_NUM).innerHTML = app.state;
					$("type"+EMAIL_NUM).innerHTML = app.type;
					$("size"+EMAIL_NUM).innerHTML = app.version;//app.size+"&nbsp;B";
					$("boot"+EMAIL_NUM).innerHTML = "<input type='button'  class='appManBtn'  value='启动'  onclick='startApp("+app.orgId+","+app.appId+");'></input>&nbsp;<input type='button'  class='appManBtn'  value='停止'  onclick='stopApp("+app.orgId+","+app.appId+");'></input>";

				   EMAIL_NUM++;
				 }
	   }
	}
  }


function backToMain(){
	window.location.href = "../index.html";
}
}catch(e){
   $J.debug.Msg("Page Error:"+e.message,1,"Page Init");
}


//文字跑马灯
function displayText(text, width, fontSize) {
	var calculateWidthId = $("width_calc");
	calculateWidthId.innerHTML = text;
	calculateWidthId.style.fontSize = fontSize + "px";
	if (calculateWidthId.offsetWidth > width) {
		return "<marquee style='width:" + width + "px;'>" + text + "</marquee>";
	} else {
		return text;
	}
}