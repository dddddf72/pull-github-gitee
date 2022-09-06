var passwordBox = null;
function createPasswordBox(successFun, failedFun, cancelFun) {
	var currPass = JSDataAccess.getPassword();
	var input = document.createElement("div");
	input.id = "password_box";
	input.className = "play_tv_password_input";
	document.body.appendChild(input);
	
	var prompt = document.createElement("div");
	prompt.id = "password_box_prompt";
	prompt.className = "play_tv_password_prompt";
	prompt.innerHTML = "请输入密码";
	input.appendChild(prompt);
	
	var content = document.createElement("div");
	content.id = "password_box_content";
	content.className = "play_tv_password_content";
	input.appendChild(content);
	
	var cancelBtn = document.createElement("div");
	cancelBtn.id = "pwd_input_btn_cancel";
	cancelBtn.className = "sys_btn";
	cancelBtn.style.top = "145px";
	cancelBtn.style.left = "255px";
	cancelBtn.style.background = "url(images/message_box/cancel.png) center no-repeat";
	input.appendChild(cancelBtn);
	
	var okBtn = document.createElement("div");
	okBtn.id = "pwd_input_btn_cancel";
	okBtn.className = "sys_btn";
	okBtn.style.top = "145px";
	okBtn.style.left = "40px";
	okBtn.style.background = "url(images/message_box/determine_focus.png) center no-repeat";
	input.appendChild(okBtn);
	
	var itemArray = [];
	for(var i = 0; i < 6; ++i) {
		var item = document.createElement("div");
		item.id = "password_box_content_item" + i;
		item.className = "play_tv_password_content_item";
		content.appendChild(item);
		itemArray.push(item);
	}
	
	var tip = document.createElement("div");
	tip.className = "password_input_tip";
	tip.style.marinTop = "20px";
	tip.innerHTML = "密码输入错误!";
	input.appendChild(tip);
	
	var result = document.createElement("div");
	result.id = "password_box_result";
	result.className = "play_tv_password_result";
	input.appendChild(result);
	var usrPassword = JSDataAccess.getPassword();
	SumaJS.debug("usr password = " + usrPassword);
	var btnIdx = 0;
	var cfg = {
		id : input,
		idArray : itemArray,
		type : 1,
		originStr : "",
		maxLen : "6",
		inputFinish : function() {
		},
		onFocus : function(id) {
			id.style.display = "block";	
		},
		onBlur : function(id) {
			this.reset();
			result.innerHTML = "";
			id.style.display = "none";	
		},
		okBtnFocus : function(id){
			btnIdx = 0;
			okBtn.style.background = "url(images/message_box/determine_focus.png) center no-repeat";
			cancelBtn.style.background = "url(images/message_box/cancel.png) center no-repeat";			
		},
		onEventHandler : function(event) {
			if (this.focus && event.type != 1001) {
				var val = event.keyCode||event.which;
				switch (val) {
				case KEY_NUM0:
				case KEY_NUM1:
				case KEY_NUM2:
				case KEY_NUM3:
				case KEY_NUM4:
				case KEY_NUM5:
				case KEY_NUM6:
				case KEY_NUM7:
				case KEY_NUM8:
				case KEY_NUM9:
					this.input(val - 48);
					tip.style.display = "none";
					break;
				case KEY_LEFT:
				case KEY_RIGHT:
					btnIdx = btnIdx == 0? 1:0;
					if(btnIdx == 0){
						okBtn.style.background = "url(images/message_box/determine_focus.png) center no-repeat";
						cancelBtn.style.background = "url(images/message_box/cancel.png) center no-repeat";
					} else {
						okBtn.style.background = "url(images/message_box/determine.png) center no-repeat";
						cancelBtn.style.background = "url(images/message_box/cancel_focus.png) center no-repeat";
					}
					break;
				case KEY_ENTER:
					if(btnIdx == 0) {
						var pwd = this.getValue();
						if(pwd == SUPER_PASSWORD) {
							if(successFun){
								successFun();
							}
							tip.style.display = "none";
							this.reset();
							this.setFocusState(0);
						} else {
							if(failedFun){
								failedFun();
							}							
							this.reset();
							tip.style.display = "block";
						}
						
					} else {
						if(cancelFun){
							cancelFun();
						}	
						tip.style.display = "none";	
						this.reset();		
						this.setFocusState(0);
					}
					break;
				case KEY_MENU:
				case KEY_EPG:
				case KEY_MAIL:
				case KEY_FAV:
				case KEY_TV:
				case KEY_DOWN:
				case KEY_UP:
				case KEY_EXIT:			
					this.setFocusState(0);
					return true;
					break;
				default:
					return false;
					break;
				}
				return false;
			} else {
				return true;
			}
		}
	};
	var passwordInput = new InputBox(cfg);
	passwordBox = passwordInput;
	SumaJS.eventManager.addEventListener("passwordBoxInput", passwordInput,85);
	passwordInput.setFocusState(1);
}