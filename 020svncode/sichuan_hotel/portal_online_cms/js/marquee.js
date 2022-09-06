   function initMarqueeData(planType){
        ajax({
            type:"GET",
            url: iepgIP+'getMarquee?version='+version+'&areaCode='+areaCode+'&marqueeVersion=0'+'&isTest='+canPreview+'&appType='+planType,
            success: function (data)  {
                setGlobalVar("marqueeData",data);
                initMarquee(JSON.parse(data).marqueeList);
            },
            error: function () {
            }
        }); 
    }
    
    function initMarquee(data) {
        focusLogoArr = [];
        for(var i = 0;i<data.length;i++){
            var marquee = data[i];
            if(marquee.type === 0){
                var txt = marquee.infoList[0].font.text;
            //  $("notice").innerHTML ="";
            //  $("notice").innerHTML = txt;
                var marqueeObj = document.getElementById("marquee");
                var W = marqueeObj.offsetWidth;
                var  marqueeSpan = marqueeObj.getElementsByTagName('span')[0];
                marqueeSpan.innerHTML = txt;
                if (txt.length < 40) {
                    marqueeObj.innerHTML = "<span style='padding-left:0px'>"+txt+"</span>";
                }else{
                    var w = marqueeSpan.offsetWidth;
                    marqueeObj.innerHTML += marqueeObj.innerHTML;
                    marqueeObj.timer && clearInterval(marqueeObj.timer);
                    marqueeObj.timer = setInterval(function(){
                        if(marqueeObj.scrollLeft+W>=w*2){                   
                            marqueeObj.scrollLeft = w-W;
                        }else{
                            marqueeObj.scrollLeft += 1;
                        }
                    },40)
                }
                
            }else if(marquee.type === 1){
                if(marquee.intent.indexOf("logo")==0){
                    $("logo").style.background = "url('"+marquee.bgImage+"')";
                }else if(marquee.intent.indexOf("history")==0){
                    focusLogoArr.unshift(marquee);
                    //$("history").style.background = "url('"+marquee.bgImage+"')";
                }else if(marquee.intent.indexOf("search")==0){
                    focusLogoArr.push(marquee);
                    //$("search").style.background = "url('"+marquee.bgImage+"')";
                }
                
            }else if(marquee.type === 2){
                $('bg').style.background = 'url(' + marquee.bgImage + ')';
            }
        }
        /*Logo = new FocusLogo(focusLogoArr);
        Logo.init("focusLogoContainer");
        if (Area == -1) {
            Logo.onfocus();
            Tab.onblur(true);
        }*/
    }

    function parseMarqueeStyle(marquee){
        var marqueeObj = document.getElementById("marquee");
        var footerObj = document.getElementById("footer");

        var txt = marquee.infoList[0].font.text;
        var direction = marquee.direction || "left";
        var stepInterval = marquee.stepInterval || 40;
        var stepDistance = marquee.stepDistance || 1;
        var position = marquee.position;  
        var fontSize =  marquee.infoList[0].font.size || "24px";
        var fontColor = marquee.infoList[0].font.color || "white";
        var fontAlpha = marquee.infoList[0].font.alpha || 100;
        var bgColor = marquee.bgColor;
        var bgAlpha = marquee.bgAlpha;
        var direction = marquee.direction;
        
        footerObj.style.left = position[0]+"px";
        footerObj.style.top = position[1]+"px";
        footerObj.style.width = position[2]+"px";
        footerObj.style.height = position[3]+"px";

        marqueeObj.style.fontSize = fontSize;
        marqueeObj.style.color = fontColor;
        marqueeObj.style.opacity = fontAlpha/100;

        footerObj.style.backgroundColor = bgColor;
        footerObj.style.opacity = bgAlpha/255;

        var W = marqueeObj.offsetWidth;
        //W = 1280-88-20;
        var  marqueeSpan = marqueeObj.getElementsByTagName('span')[0];
        marqueeSpan.innerHTML = txt;
        var w = marqueeSpan.offsetWidth;
        marqueeObj.innerHTML += marqueeObj.innerHTML;
        marqueeObj.timer && clearInterval(marqueeObj.timer);
        marqueeObj.timer = setInterval(function(){
            switch (direction){
                case "left":
                if(marqueeObj.scrollLeft+W>=w*2){                   
                    marqueeObj.scrollLeft = w-W;
                }else{
                    marqueeObj.scrollLeft += stepDistance;
                }
                break;

                case "right":
                break;

                case "up":
                break;

                case "down":
                break;

            }
            
        },stepInterval)
    }