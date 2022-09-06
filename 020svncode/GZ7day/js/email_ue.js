/**
 * Created by smsx on 2016/9/23.
 */
//=================adapter========================================
var ROC_IRKEY_DOWN = KEY_DOWN;
var ROC_IRKEY_UP = KEY_UP;
var ROC_IRKEY_SELECT = KEY_ENTER;
var ROC_IRKEY_PAGE_DOWN = KEY_PAGE_DOWN;
var ROC_IRKEY_PAGE_UP = KEY_PAGE_UP;
var ROC_IRKEY_EXIT = KEY_EXIT;
var ROC_IRKEY_BACK = KEY_BACK;
var ROC_IRKEY_MENU = KEY_MENU;

function JPage(){
    var self = this;
    var objStack = [];
    this.grabEvent = {
        pageEvent:function(event){}
    };

    this.regedit = function(obj){
        objStack.push(obj);
    };

    document.onkeypress = function(event){
        var curObj = null;
        var keyCode = event.which;
        if(keyCode == KEY_TV){
            var infoStr = SysSetting.getEnv("KEYTV_USE_INFO");
            if(infoStr) {
                try{
                    var info = JSON.parse(infoStr);
                    var service = info.serviceObj;
                    var isRec = info.isRec;
                    if(isRec){
                        SysSetting.setEnv("HOMETOPLAYTV", "14");
                    }else{
                        SysSetting.setEnv("HOMETOPLAYTV", "08");
                    }
                    window.location.href = "./index.html?page=play_tv&channelId="+service.channelId;
                }catch(e){

                }
            }
            return false;
        }
        for(var i=0;i < objStack.length;i++){
            if(objStack[i].showTag == true){
                curObj = objStack[i];
                break;
            }
        }
        if(!curObj || curObj.Listener(event)){
            self.grabEvent.pageEvent(event);
        }
        return false;
    }

}

var $ = SumaJS.getDom;

function showDateTime(){
    SumaJS.showDateTime("time_HMS","time_YMDW");
}

function getStrChineseLength(str){
    str = str+"";
    str = str.replace(/[ ]*$/g,"");
    var w = 0;
    for (var i=0; i<str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
            w++;
        }else {
            w+=2;
        }
    }
    var length = w % 2 == 0 ? (w/2) : (parseInt(w/2)+1) ;
    return length;

}

function getStrChineseLen(str,len){
    str = str + "";
    var w = 0;
    str = str.replace(/[ ]*$/g,"");
    if(getStrChineseLength(str)>len){
        for (var i=0; i<str.length; i++) {
            var c = str.charCodeAt(i);
            //单字节加1
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
                w++;
            }else {
                w+=2;
            }
            if(parseInt((w+1)/2)>len){
                return str.substring(0,i-1)+"..";
                break;
            }

        }
    }
    return str;

}

SumaJS.registerModule("ue2_email", (function() {
    function onCreate(){}
    function onStart(){}
    function onDestroy(){}
    return {
        //parent:SumaJS.getDom("ue2_servicepage_content"),
        onCreate: onCreate,
        onStart: onStart,
        onDestroy: onDestroy
    };
})());
SumaJS.loadModule("ue2_email");

/*CAMail = function(sID){

    var o={
        ID:1,
        priority:0,
        senderID:!sID? "1":""+sID,
        content:"浮沉的云海留给天空一抺阴凉，把人间的八月点印出思念中的印斑，放入大脑。关于这个城市人影画像出现在脑海，印在上岗。让思念渲染绿叶，趁着花瓣还没有开放，慢慢生长。慢慢的等你走进万花丛中，闻着花香，飘进你心中的味道不是花香，而是我思念时的向往。在雨中， 我试着把你描绘。描绘出你的双眸和你最忧伤的目光。闪动着，张望远方。远方，有你的故乡。哪里有你的童年，有你的成长，有你的欢乐，也有你的忧伤。我把你的守望画在一张普通的白纸张上，白纸却因为有你的图像不在寻常。当你回到你的故乡，我就成了故乡里的游客。徘徊在青苔路中的石板上--- 晚霞，挂起一缕红光照在山上，用笔和纸描绘出你的模样，为何点缀不出你微笑时的酒窝。远方的你和留不下地青春，伴随着夕阳模糊在黑暗里。我们习惯用回忆祭奠青春；用放荡祭奠疯狂；用窘迫祭奠梦想。当回忆闪过，眼前的时光，剩下的不在是回忆，而是回忆后的忧伤，搁浅的没有沙滩的海面上。伴随着风，伴随着雨，伴随着你和我，飘去没有坐标的方向。",
        title:"我是姜浩我是姜浩我是姜浩我是姜浩",
        arrivalTime:"2011-8-5 15:10:28",
        readFlag:1
    };
    return o;
};*/
//============================================================================
