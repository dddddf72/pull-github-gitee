var FSMsgBox={};
(function(){
	document.onappevent = function(event){
		if (event.which == 100){
			var str = SysSetting.getEventInfo(event.modifiers);
			FSMsgBox.show(eval("("+str+")"));
		}
		
	};
	
	document.addEventListener("keydown",msgKeyHandle);
	
	function msgKeyHandle(event){
		if(event.keyCode==56){//按8 通知
			if(FSMsgBox.flag==1){
				if(FSMsgBox.url && FSMsgBox.url !=""){
					window.location.href=FSMsgBox.url;
				}
			}
		}
	}
	
	FSMsgBox = {
		url:"",
		flag: "",
		timer: "",
		init:function(){ // 初始化应用，在页面加载完成后自动设置当前场景,btype是场景编号，不为空
			var data = '{"btype":0,"subpara":123}';
			var nRe = SysSetting.sendAppEvent(102, data, 0, 0);
			if (nRe == 1){
			}else if (nRe == 0){
			}else{
			}
		},
		set:function(m,n){ //设置应用场景，网页加载时需要添加
			var data = '{"btype":0,"subpara":123}';
			SysSetting.sendAppEvent(102, data, 0, 0);
		},
		show:function(obj){ // 显示消息
			var sty = obj.boxStyle.split(",");
			var num = sty[4]*1,_self=this;
			var dom = document.createElement("div");
			var str = "position:absolute;left:"+sty[1]+"px;top:"+sty[0]+"px;width:"+sty[2]+"px;height:"+sty[3]+"px;z-index:1000;";
			dom.setAttribute("id","MsgBox");
			dom.setAttribute("style",str);
			switch(num){
				case 0: // 文字
				this.url = obj.href;
				this.flag = 0;
				var marq = document.createElement("marquee");
				marq.setAttribute("style","background:-webkit-linear-gradient(left, rgba(69,82,100,0) 1%, rgba(69,82,100,0.8) 20%,rgba(69,82,100,0.8) 80%,rgba(69,82,100,0) 99%);line-height:60px");
				marq.innerHTML = obj.title;
				dom.appendChild(marq);
				break;

				case 1: // 图片
				var img = document.createElement("img");
				img.setAttribute("style","width:100%;height:100%");
				img.setAttribute("src",obj.content[0].img[0].u);
				this.url = obj.content[0].dUrl;
				this.flag = 1;
				dom.appendChild(img);
				break;

				case 2: // 通知
				selectMsgBox("msg_notice", "温馨提示", obj.title, function(){window.location.href=obj.content[0].dUrl}, function(){SumaJS.msgBox.removeMsg("global_tip_box");});
				break;
			}
			document.body.appendChild(dom);
			if(document.getElementById("MsgIfrm")) document.getElementById("MsgIfrm").focus();
			if(num!=2){
				this.timer = setTimeout(function(){_self.hide(dom)},sty[5]*1000);
			}
		},
		hide:function(obj){ // 隐藏
			var dom = obj?obj:document.getElementById("MsgBox");
			document.body.removeChild(dom);
			this.url = "";
			this.flag = "";
			this.timer = "";
		}
	};
	FSMsgBox.init();
})();