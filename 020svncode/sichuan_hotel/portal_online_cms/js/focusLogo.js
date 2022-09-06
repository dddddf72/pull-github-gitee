var focusLogoArr = [];
var logoFocusIndex = 0;
function FocusLogo(data) {
	this.data = data;
	this.upFun = null;
	this.onkey = function (direction) {
		switch (direction){
			case "left":
				

				Logo.onblur();
				if (logoFocusIndex-1<0) {
					logoFocusIndex = focusLogoArr.length-1;
				}else{
					logoFocusIndex--;
				}
				Logo.onfocus();
				break;
			case "right":
				Logo.onblur();
				if (logoFocusIndex+1>=focusLogoArr.length) {
					logoFocusIndex = 0;
				}else{
					logoFocusIndex++;
				}
				Logo.onfocus();
				break;
			case "up":
				break;
			case "down":
				Logo.onblur();
				Area++;
				Tab && Tab.onfocus();
		}
	}
}


FocusLogo.prototype.init = function(obj) {
	var data = this.data;
    var html = '';
    for (var i = 0; i < data.length; i++) {
        	html += '<div url="'+resolveLogoUrl(data[i].intent)+'" class="focusLogo" id="focusLogo'+i+'"><img src="'+data[i].bgImage+'"></div>'
    }
    

    $(obj).innerHTML = html;
}; 

FocusLogo.prototype.onfocus = function () {
        $('focusLogo' + logoFocusIndex).className = 'focus focusLogo';
        confirmUrl = $('focusLogo' + logoFocusIndex).getAttribute("url");
}

FocusLogo.prototype.onblur = function () {
        $('focusLogo' + logoFocusIndex).className = 'focusLogo'; 
}

function resolveLogoUrl(intent) {
	var url;
	try{
		var jsonStr = intent.split("=")[1];
		var json = eval('('+jsonStr+')');
		url = json.httpUrl;
		return url;
	}catch(e){
		return null;
	}	
}