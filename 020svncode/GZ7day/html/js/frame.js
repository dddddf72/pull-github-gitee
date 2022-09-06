


function getKey2Value(event){
	var val = event.which | event.keyCode;
	switch(val){
		case ROC_IRKEY_NUM0:
		case ROC_IRKEY_NUM1:
		case ROC_IRKEY_NUM2:
		case ROC_IRKEY_NUM3:
		case ROC_IRKEY_NUM4:
		case ROC_IRKEY_NUM5:
		case ROC_IRKEY_NUM6:
		case ROC_IRKEY_NUM7:
		case ROC_IRKEY_NUM8:
		case ROC_IRKEY_NUM9:
		//case ROC_IRKEY_FUN10:
			return	String.fromCharCode(event.which);
		break;
		default:
			return false;
		break;
	}
}

//{defaultVal:"3358",tagName:"主频点",insertId:"input1",valLen:6}

function INPUT(_json){ 
	this.div = null;
	this.group = "sig";
	this.name = _json.tagName;
	this.value =/^\s*\d*\s*$/.test(_json.defaultVal)?_json.defaultVal+"":"";
	this.className=typeof(_json.className)!="undefined"?(" "+_json.className):"";
	this.parentId = _json.insertId;
	this.valueLen = typeof(_json.valLen)=="undefined"?6:_json.valLen;
	this.textType = _json.textType||"text";//password
	this.remark = _json.remark||"";
	this.seletAllText = false;
	this.init = function(){
		this.div = document.createElement("div");
		this.div.className="f_input_blur"+this.className;
		var tag = document.createElement("div");
		tag.className = "f_tag";
		this.showValue();
		document.getElementById(this.parentId).appendChild(tag);
		document.getElementById(this.parentId).appendChild(this.div);
		
		if(this.remark!=""){
		   var rek = document.createElement("div");
		   rek.className = "f_remark";
		   rek.innerHTML = this.remark;
		   document.getElementById(this.parentId).appendChild(rek);
		}
		tag.innerHTML=this.name;	
		G_INPUT.arr.push(this);
	}
	
	this.Listener = function(event){
		var code = getKey2Value(event);
		if(code){
		    if(this.seletAllText){
			   this.value = "";
			   this.seletAllText = false;
			}
			this.addCode(code)
			return false;	   
		}else{
		    var val = event.which | event.keyCode;
			switch(val){
			  case ROC_IRKEY_BACK:
			  	return this.delCode();
			  break;
			  case ROC_IRKEY_RIGHT:
			     if(this.seletAllText){
				    this.seletAllText = false;
					this.showValue();
					return false;
				 }else{
				    return true;
				 }				 
			  break;
			}
			return true;
		}
	}	
	this.addCode = function(code){
		if(this.value.length<this.valueLen){
		  this.value +=code+""
		  this.showValue();
		}
	}
	this.delCode = function(){
		if(this.seletAllText){
			this.seletAllText=false;
			this.value ="";
		}else if(this.value!=""&&this.value.length>0){
			this.value = this.value.substring(0,this.value.length-1);
		}
		this.showValue();
	    return false;
	}
	this.showValue = function(){
		var  text = this.textType=="pwd"?this.value.replace(/./g,"●"):this.value;
		if(this.seletAllText){
		   this.div.innerHTML ="<span class='text_selected'>"+text+"</span>";
		}else{
		   this.div.innerHTML = text;
		}
	}
	this.focus = function(){
		this.div.className = "f_input_focus"+this.className;
		if(this.value!=""&&this.value.length>0){
		  this.seletAllText = true;
		  this.showValue();
		}
	}
	this.blur = function(){
		this.div.className = "f_input_blur"+this.className;
		if(this.value!=""&&this.value.length>0){
		  this.seletAllText = false;
		  this.showValue();
		}
	}
	this.init();
}

function SELECT(_json){
	this.div = null;
	this.group = "sig";
	this.name = _json.tagName;
	this.values = _json.options;
	this.parentId = _json.innserId;
	this.value = _json.defaultVal==null?this.values[0].value:_json.defaultVal;
	this.options = new Array();
	this.clickOk = false;
	this.index = 0;
	this.init = function(){
		this.div = document.createElement("div");
		this.div.className="f_select_com";
		var tag = document.createElement("div");
		tag.className = "f_tag";
		var selectValue = document.createElement("div");
		selectValue.className="f_select_blur"
		this.options.push(selectValue);
		this.div.appendChild(selectValue);
		for(var i=0;i<this.values.length;i++){
			var option = document.createElement("div");
			if(this.values[i].value==this.value){
			   option.className="f_option_focus";
			   	selectValue.innerHTML=this.values[i].key;
			   this.index=i;
			}else{
			   option.className="f_option_blur";
			}
			option.innerHTML=this.values[i].key;
			this.options.push(option);
			this.div.appendChild(option);
		}		
		document.getElementById(this.parentId).appendChild(tag);		
		document.getElementById(this.parentId).appendChild(this.div);	
		tag.innerHTML=this.name;	
		G_INPUT.arr.push(this);
	}
	
	this.changeValue = function(){
		this.value = this.values[this.index].value;
		this.options[0].innerHTML=this.values[this.index].key;
	}
	this.resetOptions = function(){
		 for(var i=1;i<this.options.length;i++){
			   if(i==this.index+1){
			  	  this.options[i].className="f_option_focus";
				}else{
			  	  this.options[i].className="f_option_blur";
				}
		 }
	}
	this.Listener = function(event){
		    var val = event.which | event.keyCode;
			
			switch(val){
			  case ROC_IRKEY_SELECT:
			    if(this.clickOk){
					this.clickOk = false;
					this.div.style.overflow="hidden";
					this.div.style.zIndex =0;
					this.changeValue();
				}else{
					this.clickOk = true;
					this.div.style.overflow="visible";
					this.div.style.zIndex =999;
				}   
				return false;
			   break;
			   case ROC_IRKEY_BACK:
			    if(this.clickOk){
			      this.clickOk = false;
				  this.div.style.overflow="hidden";
				  this.div.style.zIndex =0;
				  for(var i=0;i<this.values.length;i++){
					  if(this.values[i].key==this.value.key){this.index=i;break;}
				   }
				  this.resetOptions();
				  return false;
				}else{
				  return true;
				}
			   break;
			   case ROC_IRKEY_DOWN:
			     if(this.clickOk){
			       if(this.index<this.values.length-1){
					   this.index++;
					   this.resetOptions();
				   }
				    return false;
				  }else{
				    return true
				  }
			  
			   break;
			   case ROC_IRKEY_UP:
			     if(this.clickOk){
			       if(this.index>0){
					   this.index--;
					   this.resetOptions();
				   }
				return false;
			   }else{
				 return true;
				}
			   break;
			 case ROC_IRKEY_LEFT:
			     if(this.clickOk){
				    return false;
				  }else{
					  return true;
					  }
			   break;
			 case ROC_IRKEY_RIGHT:
			 	 if(this.clickOk){
				    return false;
				  }else{
					 return true;
					 }
			   break;
			 }
			return true;
	}	
	this.focus = function(){
		this.options[0].style.background = 'url(../images/input/select_focus.png) no-repeat';
	}
	this.blur = function(){
		this.options[0].style.background = 'url(../images/input/select_blur.png) no-repeat';
	}
	this.init();
}

var G_BTN_IMGS = {
				  "ok":["../images/ok.png","../images/ok_02.png"],
				  "returns":["../images/returns.png","../images/returns_02.png"],
				  "cancel":["../images/cancel.png","../images/cancel_02.png"],
				  "search":["../images/startSearch.png","../images/startSearch_02.png"],
				  "reset":["../images/reSet.png","../images/reSet_02.png"]
			     };
				
//{btnImgName:"ok",innserId:"button1",onClick:ok}
function BUTTON(_json){
	this.div = null;
	this.group = "dou";
	this.name = _json.btnImgName;
	this.parentId = _json.innserId;
	this.onClick = _json.onClick;
	this.init = function(){
		this.div = document.createElement("div");
		this.div.className="f_btn";
		this.div.style.background = 'url('+G_BTN_IMGS[this.name][0]+') no-repeat'
		document.getElementById(this.parentId).appendChild(this.div);
		G_INPUT.arr.push(this);
	}	
	this.Listener = function(event){
		var val = event.which | event.keyCode;
			switch(val){
			  case ROC_IRKEY_SELECT:
			  	this.onClick();
				return false;
			  break;
			}
			return true;	
	}	
	this.focus = function(){
		this.div.style.background = 'url('+G_BTN_IMGS[this.name][1]+') no-repeat';
	}
	this.blur = function(){
		this.div.style.background = 'url('+G_BTN_IMGS[this.name][0]+') no-repeat';
	}
	this.init();
}

function G_INPUT(){
  this.arr = new Array();
  this.index = 0;
  this.Listener = function(event){
  	    if((this.arr[this.index]).Listener(event)){
					 var val = event.which | event.keyCode;
					 switch(val){
			  			case ROC_IRKEY_UP:
						   if(this.index>0){
							   if(this.arr[this.index].group!="sig"&&this.index>1){
								   (this.arr[this.index]).blur();
								   for(;this.index>1&&this.arr[this.index].group==this.arr[this.index-1].group;this.index--){}
								   this.index--;
								   (this.arr[this.index]).focus();
							   }else if(this.index>0){
								   (this.arr[this.index]).blur();
								   this.index--
								   (this.arr[this.index]).focus();
							   }
						   }
						 return false;
					     break;
						 case ROC_IRKEY_DOWN:
							   if(this.arr[this.index].group!="sig"&&this.index<this.arr.length-2){
								   (this.arr[this.index]).blur();
								   for(;this.index<this.arr.length-2&&this.arr[this.index].group==this.arr[this.index+1].group;this.index++){}
								     this.index++;
								   (this.arr[this.index]).focus();
							   }else if(this.index<this.arr.length-1){
								   (this.arr[this.index]).blur();
								   this.index++
								   (this.arr[this.index]).focus();
							   }
						 return false;
						 break;
						 case ROC_IRKEY_RIGHT:
						    if(this.arr[this.index].group!="sig"){
							   if((this.index+1<=this.arr.length-1)&&this.arr[this.index+1].group==this.arr[this.index].group){
							       (this.arr[this.index]).blur();
						     		 this.index++
							 	   (this.arr[this.index]).focus();
							   }
							}
						 return false;
						 break;
						 case ROC_IRKEY_LEFT:
						   if(this.arr[this.index].group!="sig"){
							 if(this.index-1>=0&&this.arr[this.index-1].group==this.arr[this.index].group){
							     (this.arr[this.index]).blur();
						          this.index--
							     (this.arr[this.index]).focus();
							   }
						   }
						 return false;
						 break;					 
						 default:
						 	//return (o.arr[o.index]).Listener(event);
						 break;
					  }
					  return true;
					 }else{
					   return false;
					 }
  }
}

function SHORT_INPUT(_json){ 
	this.div = null;
	this.group = _json.group||"dou";
	this.value =(_json.defaultVal||"")+"";
	this.className="f_input_blur_short";
	this.parentId = _json.insertId;
	this.valueLen = typeof(_json.valLen)=="undefined"?3:_json.valLen;
	this.textType = _json.textType||"text";//password
	this.name = _json.tagName||"";
	this.seletAllText = false;
	this.init = function(){
		this.div = document.createElement("div");
		this.div.className=this.className;
		if(this.name!=""){
		  var tag = document.createElement("div");
		  tag.className = "f_input_blur_short_split";
		  document.getElementById(this.parentId).appendChild(tag);
		  tag.innerHTML=this.name;	
		}
		document.getElementById(this.parentId).appendChild(this.div);
		this.showValue();
		
		G_INPUT.arr.push(this);
	}
	
	this.Listener = function(event){
		var code = getKey2Value(event);
		if(code){
			 if(this.seletAllText){
			   this.value = "";
			   this.seletAllText = false;
			}
			this.addCode(code)
			return false;	   
		}else{
		    var val = event.which | event.keyCode;
			switch(val){
			  case ROC_IRKEY_BACK:
			  	return this.delCode();
			  break;
			  case ROC_IRKEY_RIGHT:
			     if(this.seletAllText){
				    this.seletAllText = false;
					this.showValue();
					return false;
				 }else{
				    return true;
				 }				 
			  break;
			}
			return true;
		}
	}	
	this.addCode = function(code){
		if(this.value.length<this.valueLen){
		  this.value +=code+""
		  this.showValue();
		}
	}
	this.delCode = function(){
		if(this.seletAllText){
			this.seletAllText=false;
			this.value ="";
		}else if(this.value!=""&&this.value.length>0){
			this.value = this.value.substring(0,this.value.length-1);
		}
		this.showValue();
	    return false;
		
	}
	this.showValue = function(){
		var  text =this.value;
		if(this.seletAllText){
		   this.div.innerHTML ="<span class='text_selected'>"+text+"</span>";
		}else{
		   this.div.innerHTML = text;
		}
	}
	this.focus = function(){
		this.div.className = "f_input_focus_short";
		if(this.value!=""&&this.value.length>0){
		  this.seletAllText = true;
		  this.showValue();
		}
	}
	this.blur = function(){
		this.div.className = "f_input_blur_short";
		if(this.value!=""&&this.value.length>0){
		  this.seletAllText = false;
		  this.showValue();
		}
	}
	this.init();
}

G_INPUT = new G_INPUT();



	