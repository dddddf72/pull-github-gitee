﻿if (isIPanel) {
    document.onkeypress = grabEvent;
    document.onsystemevent = handleSysEvent;
    document.onirkeypress = grabEvent;
} else {
    document.onkeypress = operaterMethod;
}
var rtsp = decodeURIComponent(getGlobalVar("vod_ctrl_rtsp"));//得到rtsp串
var initPlayTime = -1;//初始化播放时间
var currentStatus = -1;//设置播放状态
var playAgainFlag = false;//是否续播
var continuePointTime = 0;//续播时间点
var videoEndTime = 0;//视频结束时间
var zeroDurationFlag = false;//是否时间为零
var timeControl;//时间控制函数
var resetTimeControlFlag = true;//是否重置时间控制
var execCount = 0;//续看时加载计数
var voice;//定义声音对象
var forbidenFlag = false;//403消息
var speedAction = 0;//快进与快退参数
var rewindFlag = false;//是否快速后退
var E = null;
var volume = null; //茁壮创建声音对象
var muteFlag = 0;//parseInt((typeof(iPanel.getGlobalVar("mute_status")) != "undefined" && iPanel.getGlobalVar("mute_status") != '') ? iPanel.getGlobalVar("mute_status") : '0',10);//mp.getMute();//静音标示
var speed = 0;//快进与快退倍数
var maxSpeed = 32;//最大快进与快退倍数
var moveFlag = false;//是否在移动
var fastTimer;//快进与快退检测时间
var isFastTimerFlag;//是否正在快进快退
var pSeconds = 0;//时间输入框15秒后自动隐藏
var checkPos;//时间输入框函数执行时间
var trackSeconds = 0;//声道5秒后自动隐藏
var trackTimeout;//声道函数执行时间
var _currentMatchMode = 0;
var _currentDisplayMode = 0;
var move_default = 10;//快进与快退默认移动步长
var perStepLen = 10;//移动快进与快退的步长参数
var move_maxlen = -1;//快进与快退最大移动步长
var move_count = 1;//记录快进与快退移动的次数
var move_addLen = 0;//快进与快退每次增加的步长
var waitCount = 0;//时间等待(信号中断等情况)计数参数
var waitTimer;//时间等待(信号中断等情况)检测时间
var seconds = 0;//时间条隐藏时间参数
var isShowPosition = 0;//是否显示时间输入框(0:隐藏;1:显示)
var videoFlag = false;//离开播放页面是否保持视频播放
var stopFlag = true;//是否关视频
var isTCTimerExist = false;
var p = [], a = [];
var playString = getGlobalVar("playString");
var adType = playString.split(",");
var infoFlage = false;


var timer = null;
var show_timer = null;
var isPause = false;
var resumePoint = 0;
var tol = 0;

var MYKEY = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    ENTER: 13,
    PAGEUP: 120,
    PAGEDOWN: 121,
    BACK: 640,
    EXIT: 114,
    NUMBER0: 48,
    NUMBER1: 49,
    NUMBER2: 50,
    NUMBER3: 51,
    NUMBER4: 52,
    NUMBER5: 53,
    NUMBER6: 54,
    NUMBER7: 55,
    NUMBER8: 56,
    NUMBER9: 57,
    VOLUMNUP: 190,
    VOLUMNDOWN: 188,
    VOLUMNNO: 0x28,//静音
    STOP: 48,//播放时按退出响应的键值
    STOPPOINT: 65,//播放时按后退响应的键值
    STOPPOINT1: 65,
    MENU: 113,
    F1: 96,
    F2: 97,
    F3: 98,
    F4: 99,
    END: 0x20, //播放结束事件
    END1: 0x2B,
    INFO: 112//信息
};

function initMp() {
    mp = new MediaPlayer();
    mp.setAllowTrickmodeFlag(0);
    mp.setCurrentAudioChannel("Stereo");
    mp.setVideoDisplayMode(1); // 设置全屏模式
    mp.refreshVideoDisplay();
}

function normalMp(timeDis) {
    debug("------play--rtsp-------" + rtsp);
    initPlayTime = 0;
    mp.setSingleMedia(rtsp);
    if (timeDis) {
        mp.playByTime(1, timeDis, 1);
    }
    else mp.playFromStart();
}


function mpPlay() {
    if (forbidenFlag) {
        forbidenFlag = false;
        return;
    }
    if (speedAction != 0) {
        if (showPauseStatus()) {
            mp.resume();
        } else {
            rewindFlag = false;
            mp.resume();
            speed = 0;
            speedAction = 0;
        }
    } else {
        if(!getDisplay_loc()) mp.resume();
        else {
            mp.playByTime(1, timeControl.currentTimes, 1);
        }

    }
}

function destoryMp() {
    //mp.setStopMode(0);
    mp.stop();
}

var ExitBoxObj = {
    timer: -1,
    isVisible: false,
    index: 0,
    show: function() {
        if(!this.isVisible) {
            this.isVisible = true;
            $("exitBox").style.visibility = "visible";
        }
        clearTimeout(this.timer);
        this.timer = setTimeout(function () {
            ExitBoxObj.hide();
        }, 20000);
    },
    hide: function() {
        if(this.isVisible) {
            this.isVisible = false;
            $("exitBox").style.visibility = "hidden";
        }
        clearTimeout(this.timer);
        if(this.index != 0) {
            this.switchBtn();
        }
    },

    switchBtn: function() {
        var obj = $("exitBoxImage" + this.index);
        obj.src = obj.src.replace("_s.png", ".png");
        this.index = this.index == 0 ? 1 : 0;
        obj = $("exitBoxImage" + this.index);
        obj.src = obj.src.replace(".png", "_s.png");
    },

    keyHandler: function (keyCode) {
        this.show();
        switch (keyCode) {
            case MYKEY.LEFT:
                if(this.index == 1) {
                    this.switchBtn();
                }
                break;
            case MYKEY.RIGHT:
                if(this.index == 0) {
                    this.switchBtn();
                }
                break;
            case MYKEY.ENTER:
                if(this.index == 0) {//确定按钮
                    var returnUrl = getGlobalVar("vod_ctrl_backurl");
                    setGlobalVar("PLAY_JCHC", "");
                    setGlobalVar("is_play_back", "Y");
                    setGlobalVar("isBack", "Y");
                    if(getGlobalVar("tryFlag") != "1" && getGlobalVar("vod_recordType") != "news" && mp.getCurrentPlayTime() >= 0){//非试看，保存书签操作
                        saveBookMark(mp.getCurrentPlayTime());
                    }

                    setTimeout(function(){
                        location.href = returnUrl;
                    },500);
                } else {
                    this.hide();
                }
                break;
            case MYKEY.BACK:
            case MYKEY.EXIT:
                this.hide();
                break;
        }
    }
};

var portalId = 102;
function saveBookMark(timePosition){
    var URL_addSavedProgram = "/AddSavedProgram";
    var VOD_addSavedProgram = {//媒资详情
        "data":"<AddSavedProgram  assetId=\"" + getGlobalVar("assetId") + "\" resumePointDisplay=\"" + timePosition + "\" folderAssetId=\"" + getGlobalVar("columnMapId") + "\" purchaseToken=\"" + getGlobalVar("purchaseToken") + "\" portalId=\"" + portalId +"\" client=\"" + getSmartCardId() +"\" account=\"" + getUserId() +"\"/>",
        "callBack" : function(resp){

        }
    };

    IEPG.getData(URL_addSavedProgram, VOD_addSavedProgram);
}

function operaterMethod() {
    var keyCode = event.keyCode || event.which;
    event.preventDefault();
    if(ExitBoxObj.isVisible) return ExitBoxObj.keyHandler(keyCode);

    setPostionTipDisplay(false, -1);
    seconds = 0;
    resetTimeControlFlag = true;

    switch (keyCode) {
        case 40201:
            var evt = Utility.getEvent();
            evt = eval("(" + evt + ")");
            if (evt.type == 'EVENT_MEDIA_END') {
                destoryMp();
                gotoHref(1, "200000");
            }
            break;
        case MYKEY.BACK:
        case MYKEY.EXIT:
            if (getDisplay()) {
                setDisplay_loc(0);
                setDisplay(false, false);
                return false;
            }
            if (moveFlag) {
                currentStatus = 0;//快进快退的时候把显示的状态改变
            }
            /*var parameter = "2";
            gotoHref(0, parameter + getEndPlayTimeParmeter());*/

            ExitBoxObj.show();
            return false;
            break;
        case 40200:
            gotoHref(1, "100000");
            break;
        case MYKEY.END:
            // close();
            // window.history.go(-1);
            break;
        case MYKEY.UP:
            setTimerControl();
            if (zeroDurationFlag) {
                return;
            }
            if (!showPauseStatus() && !rewindFlag) {
                setStatusImg(1);
                mp.pause();
            } else {
                mediaPlay();
                setDisplay(false, false);
                setStatusImg(0);
            }
            break;
        case MYKEY.ENTER:
            if (zeroDurationFlag) {
                return;
            }
            enterAction();

            break;
        case MYKEY.RIGHT:
        case MYKEY.LEFT:
            if (zeroDurationFlag) {
                return;
            }
            fastmove(keyCode);
            break;
        case MYKEY.DOWN:
            $("txtInput").innerHTML = "";
            isShowPosition = ++isShowPosition % 2;
            setDisplay_loc(isShowPosition);
            break;
        case MYKEY.NUMBER0:
        case MYKEY.NUMBER1:
        case MYKEY.NUMBER2:
        case MYKEY.NUMBER3:
        case MYKEY.NUMBER4:
        case MYKEY.NUMBER5:
        case MYKEY.NUMBER6:
        case MYKEY.NUMBER7:
        case MYKEY.NUMBER8:
        case MYKEY.NUMBER9:
            $("txtInput").innerHTML += (parseInt(keyCode) - 48);
            break;
        default:
            break;
    }
}


//函数执行动作
function grabEvent(event) {
    setPostionTipDisplay(false, -1);
    seconds = 0;	// time control hidden seconds
    resetTimeControlFlag = true;
    var val = event.which || event.keyCode;
    var keyType = 1;
    var type;
    // document.getElementById('pop').innerHTML = ('执行1：'+val);
    event.preventDefault();

    if (keyType == 1) {
        switch (val) {
            case KEY_ZERO:
            case KEY_ONE:
            case KEY_TWO:
            case KEY_THREE:
            case KEY_FOUR:
            case KEY_FIVE:
            case KEY_SIX:
            case KEY_SEVER:
            case KEY_EIGHT:
            case KEY_NINE:
                $("txtInput").innerHTML += (parseInt(val) - 48);
                break;
            case KEY_VOICEUP:
            case KEY_VOICEDOWN:
                setDisplay_loc(0);
                setDisplay(false, false);
                if (!getDisplay()) {
                    if (!voice.isVoiceDisplay()) {
                        voice.voiceDisplay(true);
                    } else {
                        doVoice(val, e);
                    }
                }
                break;
            case KEY_FORWARD:
            case KEY_REWIND:
                if (rewindFlag) {
                    return;
                }
                if (zeroDurationFlag) {
                    return;
                }
                if (getDisplay_loc()) {
                    return;
                }
                //can't move time controler when position appear
                if (getDisplay()) {
                    getPerMoveLen();
                    resetTimeControlFlag = false;
                    if (val == KEY_FORWARD) {
                        type = perStepLen;
                    } else {
                        type = -perStepLen;
                    }
                    timeMove(type);
                    move_count++;
                    moveFlag = true;
                } else {
                    doVoice(val, event);
                }
                break;
            case KEY_FAST_FORWARD:
            case KEY_FAST_REWIND:
            case KEY_PANGE_FORWARD:
            case KEY_PAGE_REWIND:
            case KEY_FAST_REWIND_N:
            case KEY_FAST_REWIND_RG:
            case KEY_FAST_FORWARD_N:
            case KEY_FAST_FORWARD_RG:
                if (zeroDurationFlag) {
                    return;
                }
                fastmove(val);
                break;
            case KEY_PAUSE:
            case KEY_PAUSE_N:
            case KEY_PAUSE_RG:
                setTimerControl();
                if (zeroDurationFlag) {
                    return;
                }
                if (!showPauseStatus() && !rewindFlag) {
                    setStatusImg(1);
                    media.AV.pause(1);
                } else {
                    mediaPlay();
                    setDisplay(false, false);
                    setStatusImg(0);
                }
                break;
            case KEY_PLAY_MIN:

                setTimerControl();
                if (zeroDurationFlag) {
                    return;
                }
                if (!showPauseStatus() && !rewindFlag) {
                    setStatusImg(1);

                    media.AV.pause(1);

                } else {
                    mediaPlay();
                    setDisplay(false, false);
                    setStatusImg(0);
                }
                break;
            case KEY_ENTER:
                if (voice.isVoiceDisplay()) {
                    voice.voiceDisplay(false);

                } else {
                    if (zeroDurationFlag) {

                        return;
                    }

                    enterAction(val);
                }
                break;
            case KEY_RED:

                break;
            case KEY_BLUE:

                break;
            case KEY_YELLOW:

                break;
            case KEY_POSITION:
            case KEY_POSITION_N:
            case KEY_POSITION_RG:
                //isTCTimerExist = true;
                //setDisplay(false, false);
                isShowPosition = ++isShowPosition % 2;
                setDisplay_loc(isShowPosition);
                break;
            case KEY_INFORMATION:
            case KEY_GREEN:
                // if(getDisplay()) {
                //     setDisplay(false, false);
                // }else {
                //     setTimerControl();
                // }
                break;
            case KEY_TRACK:
                displayTrack(1);
                break;
            case KEY_MUTE:
                if (voice.isVoiceDisplay()) {
                    voice.voiceDisplay(false);
                }
                setMute();
                break;
            case KEY_HOMEPAGE:
                //document.getElementById('pop').innerHTML += ('执行2：'+val);
                break;
            case KEY_QUIT:
            case KEY_STOP:
            case KEY_RETURN:
            case KEY_EXIT:
            case KEY_QUIT_RG:
            case MYKEY.BACK:

                //document.getElementById('pop').innerHTML += ('执行3：'+val);
                var keyRet = 1;
                if (val == KEY_RETURN || val == KEY_EXIT || val == KEY_QUIT || val == KEY_QUIT_RG || val == MYKEY.BACK) {
                    keyRet = 0;
                }
                // document.getElementById('pop').innerHTML += ('执行3：'+keyRet);
                //document.getElementById('pop').innerHTML += ('执行4：'+val);
                if (getDisplay() && (val == KEY_QUIT || val == KEY_RETURN || val == KEY_EXIT || val == KEY_QUIT_RG || val == MYKEY.BACK)) {// when showed controler, close controler and resume play
                    setDisplay_loc(0);
                    setDisplay(false, false);
                    return keyRet;
                }
                // document.getElementById('pop').innerHTML += ('执行4：'+keyRet);
                //document.getElementById('pop').innerHTML += ('执行5：'+val);
                if (moveFlag) {
                    currentStatus = 0;//快进快退的时候把显示的状态改变
                }
                if (val == KEY_HOMEPAGE) {
                    //document.getElementById('pop').innerHTML += ('执行6：'+val);
                    gotoHref(0, "1");
                    return keyRet;
                }
                //document.getElementById('pop').innerHTML += ('执行7：'+val);
                var parameter = "2";

                gotoHref(0, parameter + getEndPlayTimeParmeter());
                return false;
                if (keyRet == 0) {
                    return 0;
                }

                break;
            case KEY_LANGUAGE:

                break;
            case KEY_SCREENDISPLAY:

                displayTrack(2);
                break;
            default:
                break;
        }
    }
}

function handleSysEvent(event) {
    var code = event.which || event.keyCode;
    var keyType = event.type ? event.type : 1001;
    if (code == 5301) {
        setGlobalVar('userId', '');
    } else if (code == 5372) {
        var nev = {
            "data": '<NavCheck deviceId="' + getSmartCardId() + '" client="' + getSmartCardId() + '"/>',
            "callBack": function (_dataJson) {
                var userId = _dataJson.account;
                setGlobalVar('userId', userId);
            }
        };
        IEPG.getData("/NavCheck", nev);
    }
    var val = event.which || event.keyCode;
    //document.getElementById('pop').innerHTML += "=="+val+"==";
    switch (val) {
        case 5209: //文件到头
            media.AV.close();
            gotoHref(1, "200000");
            break;
        case 5210://文件到尾
            //document.getElementById('pop').innerHTML += ('文件到尾');
            media.AV.close();
            gotoHref(1, "100000");
            break;
        case 5203://网络故障
            break;
        case 5206://锁频失败
            gotoHref(1, "32");
            break;
        case 5202:
            //media.AV.play();
            mediaPlay();
            return 0;
            break;
        case 5225:
        case 5221:
            if (val == 5225 && event.modifiers == 2205) {
                return;
            }
            if (val == 5225 && event.modifiers == 2103) {
                return;
            }
            gotoHref(1, "28");
            break;
        case 512:
        case 513:
            return 1;
            break;
        case 5301:
            pulloutCA();
            break;
        case 5226:
            debug("5226522652265226522652265226522652265226");
            if (!infoFlage) {
                infoFlage = true;
                debug("捕获5226消息，获取得到区域码为：" + VOD.server.nodeGroupID);
                var areaCode = VOD.server.nodeGroupID;
                //var areaCode = '52';
                playVideo(rtsp, areaCode);
            }
            break;
        case 5227:
            debug("522752275227522752275227522752275227");
            if (!infoFlage) {
                infoFlage = true;
                debug("捕获5227消息，获取得到区域码为：" + VOD.server.nodeGroupID);
                var areaCode = VOD.server.nodeGroupID;
                //var areaCode = '52';
                playVideo(rtsp, areaCode);
            }
            break;
        case 5974:
            debug("522752275227522752275227522752275227");
            if (!infoFlage) {
                infoFlage = true;
                debug("捕获5227消息，获取得到区域码为：" + VOD.server.nodeGroupID);
                var areaCode = VOD.server.nodeGroupID;
                //var areaCode = '52';
                playVideo(rtsp, areaCode);
            }
            break;
    }
}

function getADPlayString() {//获取前置视频广告的结束时间、按键响应操作
    var playString = getGlobalVar("playString");
    if (playString != "" && playString != "undefined") {
        p = playString.split(";");
        a[0] = {s: parseInt(p[0].split(",")[0]), e: parseInt(p[0].split(",")[1]), k: p[0].split(",")[2]};
        for (var i = 1; i < p.length; i++) {
            a[i] = {
                s: a[i - 1].e,
                e: a[i - 1].e + parseInt(p[i].split(",")[1]) - parseInt(p[i].split(",")[0]),
                k: p[i].split(",")[2]
            };
        }
        setGlobalVar("playString", "");
        if (a[0].k != "null") {
            //showADPlayTime();
        }
    }
}


var vodPos = 0;

function getFrequency() {
    debug("开始执行获取点播频点方法----getFrequency");
    var frequency = 0;
    if (E.navCheckResult.length > 0) {
        if (vodPos < E.navCheckResult.length)
            frequency = E.navCheckResult[vodPos].frequency;
        else {
            vodPos = E.navCheckResult.length - 1;
            debug("serviceStart----;vodPos=" + vodPos);
            frequency = E.navCheckResult[vodPos].frequency;
        }
    }
    debug("执行获取点播频点方法完毕获取频点值frequency为" + parseInt(frequency));
    debug("VOD.server.enterVOD-------start");
//	VOD.serviceStart("coship",parseInt(frequency),68750,"64-QAM");
    VOD.server.enterVOD(parseInt(frequency));
    debug("VOD.server.enterVOD-------end");
}

function show_Count(adEndTime) {
    var showAdtime = adEndTime - getPlayCurrTime();//mp.currentPoint;
    if (showAdtime <= 0) {
        clear_Count();
    } else {
        $("adtime").style.visibility = "visible";
        $("ad_tip").style.visibility = "visible";
        $("ad_showtime").innerHTML = showAdtime;
    }
}

function init() {
    //document.getElementById('test').innerHTML ="dddd";
    //getADPlayString();//获取广告
    setSmartCardId();
    if (isIPanel) {
        E = iPanel.eventFrame;
        volume = new E.volume(); //茁壮创建声音对象
        muteFlag = volume.getMuteStatus();//parseInt((typeof(iPanel.getGlobalVar("mute_status")) != "undefined" && iPanel.getGlobalVar("mute_status") != '') ? iPanel.getGlobalVar("mute_status") : '0',10);//mp.getMute();//静音标示
        getFrequency();
        initSound();
        initVoiceControl();
    } else {
        initMp();

    }


    timeControl = new TimeControl(265, 690);
    if (rtsp == "") {//rtsp串为空则退出播放
        gotoHref(1, "100001");
    }
    if (!isCancelQuit()) {
        //document.getElementById("pop").innerHTML="111111";
        setDisplay(false, false);
        setStatusImg(0);
        execCount++;

        if (execCount >= 2) {
            stopCount();
        }

        if (getGlobalVar("vod_play_type") == "1") {
            if (getGlobalVar("vod_recordType") == "VOD") {
                continuePointTime = getGlobalVar("vod_ctrl_startime");
                var parameter = "1313";
                if(isIPanel) gotoHref(0, parameter + getEndPlayTimeParmeter());
                else gotoHref(0, parameter + "&endPlayTime=" + getGlobalVar("vod_ctrl_startime"));
                return;
            }
        }
    } else {
        //document.getElementById("pop").innerHTML="22222";
        //setDisplay(true, true);
        setDisplay(false, false);
        var nativePlayerInstanceId = getGlobalVar("nativePlayerInstanceId");

        if(isIPanel) continuePointTime = media.AV.elapsed;

        // continuePointTime = getIntValue(getQueryStr("endPlayTime", LocString));

       // document.getElementById("pop").innerHTML="=init:media.e="+media.AV.elapsed+"==aa==";
        currentStatus = getIntValue(getQueryStr("currentStatus", LocString));
        //alert(continuePointTime)
        //LocString = LocString.replaceQueryStr(continuePointTime,'endPlayTime');

        initPlayTime = getIntValue(getQueryStr("initPlayTime", LocString));
        setStatusImg(currentStatus);
        // resetTimerControl();
    }
    getRTSPTime();
    initTimeControl(0, videoEndTime, continuePointTime);
    getProgram();
    setEndTime(convertToShowTime(timeControl.allTimes));

    if (!isIPanel) normalMp(continuePointTime);
}

//页面跳转
function gotoHref(isTip, parame) {
    stopFlag = false;
    videoFlag = true;
    if(initPlayTime == -1) initPlayTime = 0;
    var url = "vod_exit.htm?initPlayTime=" + initPlayTime + "&currentStatus=" + currentStatus + "&tipType=" + parame;
    if(isTip == 1) {
        url = "check_out.htm?initPlayTime=" + initPlayTime + "&currentStatus=" + currentStatus + "&errorCode=" + parame;
    }
    setGlobalVar('scanTestBack', '');
    window.location.href = url;
}

//获取与显示时间
function getRTSPTime() {
    var pointPlayTime = getIntValue(getQueryStr("endPlayTime", LocString));
    var vod_play_type = getGlobalVar("vod_play_type");//is only view a few seconds.
    if (pointPlayTime != null & pointPlayTime != 0 & pointPlayTime != "undefined") {
        playAgainFlag = true;
        vod_play_type = "1";
    }
    if (vod_play_type == "1") {//1是续播
        var totalTime = getGlobalVar("vod_ctrl_endtime");
        if (totalTime != null && totalTime != "") {//总时长不为0时处理
            videoEndTime = parseInt(totalTime, 10);
            if (!isCancelQuit()) {
                continuePointTime = parseInt(getGlobalVar("vod_ctrl_startime"), 10);
            } else {
                if(!isIPanel && playAgainFlag) continuePointTime = parseInt(pointPlayTime, 10);
            }
            if (getQueryStr('tipType', LocString) == '1313' || getQueryStr('tipType', LocString) == 1313) {
                continuePointTime = parseInt(getGlobalVar("vod_ctrl_startime"), 10);
            }
        } else {
            videoEndTime = parseInt(getGlobalVar("vod_ctrl_endtime"), 10);
            if (playAgainFlag) {

                continuePointTime = parseInt(pointPlayTime, 10);
            } else {

                continuePointTime = parseInt(getGlobalVar("vod_ctrl_startime"), 10);
            }
        }
    } else {
        videoEndTime = parseInt(getGlobalVar("vod_ctrl_endtime"), 10);//0从头开始播
        //continuePointTime = parseInt(getGlobalVar("vod_ctrl_startime"), 10);
    }
    // document.getElementById("pop").innerHTML+='4444'+continuePointTime;
    if (isNaN(videoEndTime)) {
        videoEndTime = 0;
    }
    //if(!isNaN(videoEndTime)) { getMoveParams();}
    if (videoEndTime <= 0) {
        zeroDurationFlag = true;
    }
}

//播放视频
function playVideo(mediaStr, areaCode) {
    initPlayTime = 0;
    var qam_name = "" + areaCode;
    var client = CA.card.cardId;
    var rtsp_url = mediaStr + ";qam_name=" + qam_name + ";client=" + client;
    debug("播放的RTSP为：" + rtsp_url);
    VOD.changeServer("cisco_dmx", "dvb");
    media.AV.open(rtsp_url, 'VOD');
    media.video.fullScreen();
}

//初始化时间控制条
function initTimeControl(bTime, eTime, sTime) {
    timeControl.init($("begin_end_time"), bTime, eTime, parseInt(sTime, 10));
//document.getElementById("pop").innerHTML+="==dddd==="+timeControl.showTime+"===dddd==";
    setStartTime(timeControl.showTime);
}

//设置时间控制条
function setTimerControl() {//showFlag time control and reset time
    resetTimerControl();
    setDisplay(true, true);
}

//重置时间控制条
function resetTimerControl() { //only set time control and play time display
    if (initPlayTime == -1)
        return;
    if (videoEndTime <= 0) {
        getRTSPTime();
        timeControl.resetEndTime(0, videoEndTime);
        // setProgrammeInfo(convertToShowTime(timeControl.allTimes));
    }
    var currentPT = getPlayCurrTime();
    if (isNaN(currentPT) || parseInt(currentPT, 10) < 0) {//this time always must be a plus int.
        return;
    }
    ///document.getElementById("pop").innerHTML+="=res="+timeControl.showTime+"=res=";
    var disTimes = parseInt(currentPT, 10);
    timeControl.resetTC(Math.max(disTimes, 0));
//document.getElementById("pop").innerHTML+="==cccc==="+timeControl.showTime+"===cccc==";
    setStartTime(timeControl.showTime);
    //$("txtInput").focus();
}


//检查时间控制
function checkTimerControl() {
    if (speedAction == 0) {
        seconds++;
    }
    if (resetTimeControlFlag) {
        resetTimerControl();
    }
    if (seconds > 10) {
        var showStatusImg = false;
        if (showPauseStatus()) {
            showStatusImg = true;
        }
        setDisplay(false, showStatusImg); // the status image still exist when status is pause.
    }
}

function setStartTime(sTime) {
    $("play_time").innerHTML = sTime;
}

function setEndTime(eTime) {
    $("end_time").innerHTML = eTime;
    try {
        Utility.setEnv("MediaDuration", eTime);
    } catch (e) {
    }
}

//获取当前播放节目
function getProgram() {
    $("play_program").innerHTML = decodeURIComponent(getGlobalVar("displayName"));
}

//续看加载计数
function stopCount() {
    if (cControl != null) {
        cControl.stopTimer();
    }
    setDisplay(true, true);
}

//设置播放图标的显示状态
function setStatusImg(status) {
    var src = getStatusImgSrc(status);
    var speedStr = "";
    if (status == 1) {
        resetTimeControlFlag = false;
        //moveFlag = true;
    } else if (status == 3) {
        speedStr = "X" + speed;
    } else if (status == 4) {
        speedStr = "X-" + speed;
    }
    if (src != "") {
        $("imgStatus").src = src;
    }
    $("g_speed").innerText = speedStr;
    currentStatus = status;
}

//播放条显示与隐藏
function setDisplay(showFlag, imgShowFlag) {
    if (showFlag) {
        try {
            voice.voiceDisplay(false);
        } catch (e) {

        }
        $("main").style.visibility = "visible";
    } else {
        $("main").style.visibility = "hidden";
    }
    if (imgShowFlag) {
        $("g_button").style.visibility = "visible";
        $("g_speed").style.visibility = "visible";
    } else {
        $("g_button").style.visibility = "hidden";
        $("g_speed").style.visibility = "hidden";
    }
    if (showFlag && imgShowFlag && !isTCTimerExist) {
        checkTimer = setInterval("checkTimerControl();", 1000);
        isTCTimerExist = true;
    }
    if (!showFlag && isTCTimerExist) {
        //document.getElementById("pop").innerHTML+="||cleanCheckTimer";
        clearInterval(checkTimer);
        isTCTimerExist = false;
    }
}

function getDisplay() {
    return ($("main").style.visibility != "hidden");
}

function showPauseStatus() {
    return (currentStatus == 1);
}

function showPlayStatus() {
    return (currentStatus == 0);
}


function ipanelPlay() {
    if (forbidenFlag) {
        forbidenFlag = false;
        return;
    }
    if (speedAction != 0) {
        if (showPauseStatus()) {
            media.AV.play();
        } else {
            rewindFlag = false;
            media.AV.play();
            speed = 0;
            speedAction = 0;
        }
    } else {
        var timeDis = timeControl.currentTimes;
        var hour = Math.floor(timeDis / 3600);
        var minute = Math.floor((timeDis - hour * 3600) / 60);
        var second = timeDis - hour * 3600 - minute * 60;
        hour = hour > 9 ? hour : "0" + hour;
        minute = minute > 9 ? minute : "0" + minute;
        second = second > 9 ? second : "0" + second;
        var goto_time = hour + ":" + minute + ":" + second;
        media.AV.seek(goto_time);
    }
}

//播放控制
function mediaPlay() {//playTime : second
    if (isIPanel) ipanelPlay();
    else mpPlay();
}

//静音设置
function setMute() {
    muteFlag = muteFlag == 0 ? 1 : 0;
    setMuteFlag(muteFlag);
}

function setMuteFlag(flag) {
    if (flag == 0) {//有声
        media.sound.resume();
        //mp.audioUnmute();
        $('mutePic').style.visibility = "hidden";
    } else {
        media.sound.mute();
        //mp.audioMute();
        $('mutePic').style.visibility = "visible";
    }
    initSound();
}

//声音设置
function initSound() {
    if (volume.getMuteStatus() == 1) {
        $('mutePic').style.visibility = "visible";
    } else {
        $('mutePic').style.visibility = "hidden";
    }
}

function initVoiceControl() {
    var defaultVoice = media.sound.value;
    voice = new Voices(343, 600, 0);
    var realVoice = 0;
    if (!isNaN(defaultVoice)) {
        realVoice = Math.round(parseInt(defaultVoice, 10) * voice.maxVoice / 100);
    }
    voice.currentVoice = realVoice;
    voice.currentLen = voice.setVoiceLen(realVoice);
    voice.init($("dv_voice"));
    /***********************音量初始化Start********************************/
    //DataAccess.setInfo("MediaSetting", "OutputVolumn", defaultVoice + "");
    /***********************音量初始化End******************************/
}

function doVoice(val, e) {
    //e.preventDefault();
    if (muteFlag == 1) {
        setMute();
    }
    voice.voiceSeconds = 0;
    voice.voiceDisplay(true);
    if (val == KEY_VOICEDOWN || val == KEY_REWIND) {
        type = -1;
    } else {
        type = 1;
    }
    voice.UpDown(type);
    media.sound.value = (Math.round(voice.currentVoice));
}

function checkVoiceControl() {
    voice.voiceSeconds++;
    if (voice.voiceSeconds > 5) {
        voice.voiceDisplay(false);
    }
}

function timeMove(type) {
    timeControl.UpDown(type);
    //document.getElementById("pop").innerHTML+="==bbb==="+timeControl.showTime+"===bbbb==";
    setStartTime(timeControl.showTime);
}

//快进动作
function fastmove(val) {
    if (val == KEY_PANGE_FORWARD || val == KEY_FAST_FORWARD_N || val == KEY_FAST_FORWARD_RG) {
        val = KEY_FAST_FORWARD;
    }
    if (val == KEY_PAGE_REWIND || val == KEY_FAST_REWIND_N || val == KEY_FAST_REWIND_RG) {
        val = KEY_FAST_REWIND;
    }
    setDisplay(true, true);
    if (speed >= maxSpeed && val == KEY_FAST_FORWARD && speedAction == 1) {
        speed = 0;
    } else if (speed >= maxSpeed && val == KEY_FAST_REWIND && speedAction == -1) {
        speed = 0;
    }
    if ((val == KEY_FAST_FORWARD && speedAction == -1) || (val == KEY_FAST_REWIND && speedAction == 1)) {
        if (rewindFlag) {
            setStatusImg(1);
            rewindFlag = false;
            if (isIPanel) media.AV.pause(1);
            else mp.pause();
            return;
        } else {
            speed = 0;
        }
    }
    if (speed == 0) {
        speed = 32;
    }
    if (val == KEY_FAST_FORWARD) {
        speedAction = 1;
        setStatusImg(3);
        if (isIPanel) media.AV.forward(speed);
        else mp.fastForward(speed);
    } else {
        speedAction = -1;
        setStatusImg(4);
        if (isIPanel) media.AV.backward(-speed);
        else mp.fastRewind(-speed);
        if (speedAction != 0) {//random preplay need to know current play time
            fastTimer = setInterval("checkFastRewind();", 1000);
            isFastTimerFlag = true;
        }
    }
    moveFlag = true;
    rewindFlag = true;
}

//检查快进与快退状态
function checkFastRewind() {
    var currentPT = getPlayCurrTime();
    if (isNaN(currentPT) || parseInt(currentPT, 10) < 0 || currentStatus != 4) {
        stopfastTimer();
        return;
    }
    var disTimes = parseInt(currentPT, 10) - 0;
    if (disTimes <= 0) {
        stopfastTimer();
        beginReplay();
    }
}

function stopfastTimer() {
    clearInterval(fastTimer);
    isFastTimerFlag = false;
}

//时间选择函数
//是否显示时间选择框
function setPostionTipDisplay(isdisplay, type) {
    var str = "";
    switch (type) {
        case 0:
            str = "输入时间超过总时间";
            //the input time is longer than all time
            break;
        case 1:
            str = "输入时间无效";
            // the input time is invalidate
            break;
    }
    if (str != "") {
        $("locationTip").innerHTML = decodeURIComponent(str);
    }
    if (isdisplay && getDisplay_loc()) {
        $("locationTip").style.visibility = "visible";
    } else {
        $("locationTip").style.visibility = "hidden";
    }
}

function getDisplay_loc() {
    return ($("input_box").style.visibility != "hidden");
}

function setDisplay_loc(isdisplay) {
    if (isdisplay == 1) {
        pSeconds = 0;
        $("input_box").style.visibility = "visible";
        setTimerControl();
        //$("txtInput").focus();
        checkPos = setInterval("checkPosition()", 1000);
    } else {
        $("input_box").style.visibility = "hidden";
        //$("txtInput").blur();
        setPostionTipDisplay(false, -1);
        isShowPosition = 0;
        clearInterval(checkPos);
    }
}

//检测时间输入框的状态，时间超过15秒自动隐藏
function checkPosition() {
    pSeconds++;
    if (pSeconds > 15) {
        setDisplay_loc(0);
        clearInterval(checkPos);
    }
}

//时间输入框动作函数
function enterAction(val) {
    if (getDisplay_loc()) {

        var txtTime = $("txtInput").innerHTML.trim();
        if (txtTime == "" || txtTime == null) {
            setDisplay_loc(0);
            $("txtInput").innerHTML = "";
            return;
        }
        if (isNaN(txtTime)) {

            setPostionTipDisplay(true, 1);
            $("txtInput").innerHTML = "";
            return;
        }
        var time = getIntValue(txtTime) * 60;
        if (time - timeControl.allTimes > 0) {
            setPostionTipDisplay(true, 0);
        } else {
            timeControl.resetTC(time);
//document.getElementById('pop').innerHTML += timeControl.showTime+"==aaaaa===";
            setStartTime(timeControl.showTime);
            mediaPlay();
            setDisplay_loc(0);
            setStatusImg(0);
        }
        //$("txtInput").focus();
        //$("txtInput").value = "";
        $("txtInput").innerHTML = "";

    } else if (!getDisplay() && showPlayStatus()) {	 //when time control not display and in play status, showFlag time control
        if (speedAction != 0) {/*mp.resume()*/
            setStatusImg(0);
        }
        setTimerControl();
    } else { 	//when time control display or not in play status, display and reset time control
        setDisplay(false, false);
        if (showPauseStatus()) {
            mediaPlay();
        } else {
            if (moveFlag) { //play by the time of user choice
                mediaPlay();
            }
        }
        moveFlag = false;
        setStatusImg(0);
    }
}

//声道函数
function displayTrack(isPlay) {
    if (isPlay != 0 && _currentDisplayMode != 0 && _currentDisplayMode != isPlay) {
        removeTrack();
    }
    if (isPlay == 1) {
        resetTrack();
    } else if (isPlay == 2) {
        resetScreenMatchMode();
    } else {
        removeTrack();
    }
    _currentDisplayMode = isPlay;
}

function countTrack() {
    if (trackSeconds > 5) {
        trackSeconds = 0;
        $("g_track").style.visibility = "hidden";
        clearInterval(trackTimeout);
    } else {
        trackSeconds++;
    }
}

function resetTrack() {
    if (!showPlayStatus()) {// when is play status
        return;
    }
    trackSeconds = 0;
    setDisplay(false, false);// the time control hidden and the status image hidden
    var obj = $("g_track");
    var audioOptions = ['left', 'right', 'stereo'];
    var soundMode = 'left';
    var trackStr = DataAccess.getInfo('MediaSetting', 'soundMode');
    if (obj.style.visibility != "hidden") {
        for (var i = 0; i < 3; i++) {
            if (audioOptions[i] === trackStr) {
                soundMode = audioOptions[(i + 1) % 3];
                break;
            }
        }
        DataAccess.setInfo('MediaSetting', 'soundMode', soundMode);
        DataAccess.save("MediaSetting", "soundMode");
    } else {
        obj.style.visibility = "visible";
        if (trackTimeout != null)
            clearInterval(trackTimeout);
        trackTimeout = setInterval("countTrack()", 1000);
    }
    trackStr = DataAccess.getInfo('MediaSetting', 'soundMode');
    obj.innerHTML = getTrackStr(trackStr);
}

function removeTrack() {
    trackSeconds = 6;
    countTrack();
}

function resetScreenMatchMode() {//setScreenMatchMode
    trackSeconds = 0;
    setDisplay(false, false);// the time control hidden and the status image hidden
    var obj = $("g_track");
    if (obj.style.visibility != "hidden") {
        _currentMatchMode = ++_currentMatchMode % 3;
        //mp.setMatchMode(_currentMatchMode);
        media.sound.mode = _currentMatchMode;
    } else {
        obj.style.visibility = "visible";
        if (trackTimeout != null)
            clearInterval(trackTimeout);
        trackTimeout = setInterval("countTrack()", 1000);
    }
    _currentMatchMode = parseInt(media.sound.mode, 10);
    obj.innerHTML = getMatchModeStr(_currentMatchMode);
}

//获取最后播放时间进行记录传值
function getEndPlayTimeParmeter() {//getEndPlayTimeParmeter
    var cPlayTime = getPlayCurrTime();
    var endPlayTime = initPlayTime;
    if (!isNaN(cPlayTime)) {
        endPlayTime += parseInt(cPlayTime, 10);
    }
    if (videoEndTime == 0) {
        getRTSPTime();
    }
    return "&endPlayTime=" + endPlayTime;
}


function getPlayCurrTime() {
    if (isIPanel) {
        return media.AV.elapsed;
    } else {
        return mp.getCurrentPlayTime();
    }
}

//快进与快退步长函数算法
function getPerMoveLen() {
    if (move_addLen == 0) {
        return;
    }
    if (move_maxlen > 0 && perStepLen >= move_maxlen) {
        return;
    }
    if (move_count > 1) {
        perStepLen += move_addLen;
    } else {
        perStepLen = move_default;
    }
    if (move_maxlen > 0 && perStepLen > move_maxlen) {
        perStepLen = move_maxlen;
    }
}

function getMoveParams() {
    move_default = Math.round(videoEndTime * 0.005);
    move_maxlen = Math.round(videoEndTime * 0.04);
    move_addLen = Math.round(videoEndTime * 0.02);
    perStepLen = move_default;
}

//超时处理函数
function waitRecover(errorCode) {
    waitCount++;
    if (waitCount > 30) {
        clearInterval(waitTimer);
        gotoHref(1, errorCode);
    }
}

//快进与快退到影片开始播放时间,停止动作，初始化播放
function beginReplay() {
    if (isIPanel) media.AV.play();
    else mp.playFromStart();
    setDisplay(false, false);
    speedAction = 0;
    speed = 0;
    setStatusImg(0);
}

var log = "";

function printLog(str) {//调试时打开下面两行//2011.05.05
    //log += str;
    //document.getElementById("test").innerHTML = log;
}

window.onunload = function () {
    if (!videoFlag) {
        if (isIPanel) {
            media.AV.close();
            DVB.stopAV(0, 1);
        } else {
            destoryMp();
        }

    }
};
