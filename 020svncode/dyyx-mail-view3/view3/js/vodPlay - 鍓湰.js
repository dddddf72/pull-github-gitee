﻿

if (window.navigator.userAgent == 'compatible:Coship cooca Webkit') {
    document.onkeydown = operaterMethod;
} else {
    document.onkeypress = grabEvent;
    document.onsystemevent = handleSysEvent;
    document.onirkeypress = grabEvent;

}



//var rtsp = "http://172.20.100.132:16666/vod/cp0001,TWSX1583219840592870.m3u8?fmt=x264_400k_mpegts&timecode=0&sk=89E9A3D96A2A0E6196313E9A0CF996F0&uuid=f0ea9051-2871-42e4-837b-0c22cd75d144&userCode=shenzhen&userName=0&spCode=484581254562&productCode=0000002&resourceCode=102410110&subId=123&resourceName=&authType=null&channelCode=null";//得到rtsp串
var rtsp = "";
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
var E = iPanel.eventFrame;
var volume = new E.volume(); //茁壮创建声音对象
var muteFlag = volume.getMuteStatus();//parseInt((typeof(iPanel.getGlobalVar("mute_status")) != "undefined" && iPanel.getGlobalVar("mute_status") != '') ? iPanel.getGlobalVar("mute_status") : '0',10);//mp.getMute();//静音标示
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

//关闭播放器功能
var isStop = true;
var errorCode = 0;
var tip = "";
var overTimer = null;
var curPlayTime = 0;
var pauseFlag = true;
var ablePause = 0;

//coship盒子
var timer = null;
var show_timer = null;
var isPause = false;
var resumePoint = 0;

var MYKEY = {
    UP: 28,
    DOWN: 29,
    LEFT: 30,
    RIGHT: 31,
    ENTER: 13,
    PAGEUP: 120,
    PAGEDOWN: 121,
    BACK: 32,
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

function operaterMethod() {
    var keyCode = event.keyCode || event.which;
    event.preventDefault();
    switch (keyCode) {
        case MYKEY.BACK:
        case MYKEY.EXIT:
        case MYKEY.END:
            close();
            window.history.go(-1);
            break;
        case MYKEY.UP:
            break;
        case MYKEY.ENTER:
            window.history.go(-1);
            // show();
            // if (isPause) {//暂停
            //     isPause = false;
            //     mp.resume();
            //     $("pause_tip").innerHTML("播放");
            // } else {
            //     isPause = true;
            //     mp.pause();
            //     $("pause_tip").innerHTML("暂停");
            // }
            // $("#current_time").text(secToTimeStr(mp.getCurrentPlayTime()));
            // $("#total_time").text(secToTimeStr(mp.getMediaDuration()));
            // $("#progress").css("width", (mp.getCurrentPlayTime() / mp.getMediaDuration()) * 100 + "%");
            break;
        case MYKEY.LEFT:
            show();
            if (isPause) { return; }
            if (mp.getCurrentPlayTime() < 20) {
                mp.playByTime(1, 0, 0);
            } else {
                mp.playByTime(1, parseInt(mp.getCurrentPlayTime()) - 20, 0);
            }
            // $("#current_time").text(secToTimeStr(mp.getCurrentPlayTime()));
            // $("#total_time").text(secToTimeStr(mp.getMediaDuration()));
            // $("#progress").css("width", (mp.getCurrentPlayTime() / mp.getMediaDuration()) * 100 + "%");
            break;
        case MYKEY.RIGHT:
            show();
            if (isPause) { return; }
            if (mp.getCurrentPlayTime() + 20 < mp.getMediaDuration()) {

                mp.playByTime(1, parseInt(mp.getCurrentPlayTime()) + 20, 0);
            }
            // $("#current_time").text(secToTimeStr(mp.getCurrentPlayTime()));
            // $("#total_time").text(secToTimeStr(mp.getMediaDuration()));
            // $("#progress").css("width", (mp.getCurrentPlayTime() / mp.getMediaDuration()) * 100 + "%");
            break;
        default: break;
    }
}

function show() {
    if (show_timer == null) {
        show_timer = setInterval(showTime, 1000);
    }
    if (timer != null) {
        clearTimeout(timer);
    }
    timer = setTimeout(hidden, 5000);
    // $("#progress_bar").show();
    // $("#play_bot").show();
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
    // event.preventDefault();
    if (windowFlag) {
        switch (val) {
            case KEY_FORWARD:
            case KEY_REWIND:
                if (enterFlag) {
                    enterFlag = false;
                    $('button-enter').className = 'button-enter';
                    $('button-cancel').className = 'button-cancel focus';
                } else {
                    enterFlag = true;
                    $('button-cancel').className = 'button-cancel';
                    $('button-enter').className = 'button-enter focus';
                }
                break;
            case KEY_QUIT:
            case KEY_STOP:
            case KEY_RETURN:
            case KEY_EXIT:
            case KEY_QUIT_RG:
                event.preventDefault();
                windowFlag = false;
                $('window').style.display = 'none';
                break;
            case KEY_ENTER:
                if (enterFlag) {
                    //var returnUrl = getGlobalVar("vod_ctrl_backurl");
                    // location.href = returnUrl;
                    var id = getQueryVariable("id");
                    API.SetResumePoint({
                        id: id,
                        resumePointDisplay: parseInt(mp.getCurrentPlayTime())
                    }, function (data) {
                        // clearInterval(overTimer);
                        history.go(-1);
                    })
                } else {
                    windowFlag = false;
                    $('window').style.display = 'none';
                }
                break;
        }
    } else {
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
                    $("main").style.visibility = "visible";
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
                        type = perStepLen;
                        timeMove(type);
                        move_count++;
                        moveFlag = true;
                    }
                    break
                case KEY_FAST_REWIND:
                    $("main").style.visibility = "visible";
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
                        type = -perStepLen;
                        timeMove(type);
                        move_count++;
                        moveFlag = true;
                    }
                    break;
                case KEY_PANGE_FORWARD:
                case KEY_PAGE_REWIND:
                case KEY_FAST_REWIND_N:
                case KEY_FAST_REWIND_RG:
                case KEY_FAST_FORWARD_N:
                case KEY_FAST_FORWARD_RG:
                    // if(zeroDurationFlag) {
                    //     return;
                    // }
                    // fastmove(val);
                    break;
                case KEY_PAUSE:
                case KEY_PAUSE_N:
                case KEY_STOP_VEDIO:
                    setTimerControl();
                    if (zeroDurationFlag) {
                        return;
                    }
                    if (!showPauseStatus() && !rewindFlag) {
                        setStatusImg(1);
                        pauseFlag = false;
                        mp.pause();
                    } else {
                        mediaPlay();
                        setDisplay(false, false);
                        setStatusImg(0);
                    }
                    break;
                case KEY_PAUSE_RG:
                    // setTimerControl();
                    // if (zeroDurationFlag) {
                    //     return;
                    // }
                    // if (!showPauseStatus() && !rewindFlag) {
                    //     setStatusImg(1);
                    //     mp.pause();
                    // } else {
                    //     mediaPlay();
                    //     setDisplay(false, false);
                    //     setStatusImg(0);
                    // }
                    break;
                case KEY_PLAY_MIN:

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
                    event.preventDefault();
                    windowFlag = true;
                    $('window').style.display = 'block';
                    break;
                // case KEY_QUIT:
                // case KEY_STOP:
                // case KEY_RETURN:
                // case KEY_EXIT:
                // case KEY_QUIT_RG:
                //
                //     var keyRet = 1;
                //     if(val == KEY_RETURN || val == KEY_EXIT || val == KEY_QUIT || val == KEY_QUIT_RG) {
                //         keyRet = 0;
                //     }
                //
                //     if(getDisplay() && (val == KEY_QUIT || val == KEY_RETURN || val == KEY_EXIT|| val == KEY_QUIT_RG)) {// when showed controler, close controler and resume play
                //         setDisplay_loc(0);
                //         setDisplay(false, false);
                //         return keyRet;
                //     }
                //
                //     if(moveFlag) {
                //         currentStatus = 0;//快进快退的时候把显示的状态改变
                //     }
                //     if(val == KEY_HOMEPAGE) {
                //         //document.getElementById('pop').innerHTML += ('执行6：'+val);
                //         gotoHref(0, "1");
                //         return keyRet;
                //     }
                //     //document.getElementById('pop').innerHTML += ('执行7：'+val);
                //     var parameter = "2";
                //
                //     gotoHref(0, parameter + getEndPlayTimeParmeter());
                //     return false;
                //     if(keyRet == 0) {
                //         return 0;
                //     }
                //
                //     break;
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

}
function exitPage() {
    if (navigator.userAgent.indexOf("iPanel 3.0") >= 0) {
        mp.setStopMode(0);
    }

    if (navigator.userAgent.indexOf("iPanel 3.0") >= 0) {
        mp.releaseMediaPlayer();
    }
    // mp.setStopMode(1);
    mp.stop();
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
            exitPage();
            gotoHref(1, "200000");
            break;
        case 5210://文件到尾
            //document.getElementById('pop').innerHTML += ('文件到尾');
            exitPage();
            var id = getQueryVariable("id");
            var providerId = getQueryVariable("providerId");
            var folderAssetId = getQueryVariable("folderAssetId");
            API.DeleteSavedProgram({
                id: id,
                providerId: providerId,
                folderAssetId: folderAssetId,
            }, function (data) {
                history.go(-1);
            })
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
            iPanel.debug("5226522652265226522652265226522652265226");
            if (!infoFlage) {
                infoFlage = true;
                // iPanel.debug("捕获5226消息，获取得到区域码为：" + VOD.server.nodeGroupID);
                // var areaCode = VOD.server.nodeGroupID;
                //var areaCode = '143';
                // playVideo(rtsp, areaCode);
                //playVideo1();
            }
            break;
        case 5227:
            iPanel.debug("522752275227522752275227522752275227");
            if (!infoFlage) {
                infoFlage = true;
                // iPanel.debug("捕获5227消息，获取得到区域码为：" + VOD.server.nodeGroupID);
                // var areaCode = VOD.server.nodeGroupID;
                //var areaCode = '143';
                //playVideo1();
                // playVideo(rtsp, areaCode);
            }
            break;
        case 5974:
            //playVideo1();
            break;
        case 5228:

            if (tol && tol > 0) {
                if (mp.getCurrentPlayTime() + 1 == tol) {
                    exitPage();
                    gotoHref(1, "100000");
                }
            } else {

            }

            break;
    }
}

function getADPlayString() {//获取前置视频广告的结束时间、按键响应操作
    var playString = getGlobalVar("playString");
    if (playString != "" && playString != "undefined") {
        p = playString.split(";");
        a[0] = { s: parseInt(p[0].split(",")[0]), e: parseInt(p[0].split(",")[1]), k: p[0].split(",")[2] };
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

var E = iPanel.eventFrame;
var vodPos = 0;
function getFrequency() {
    iPanel.debug("开始执行获取点播频点方法----getFrequency");
    var frequency = 0;
    if (E.navCheckResult.length > 0) {
        if (vodPos < E.navCheckResult.length)
            frequency = E.navCheckResult[vodPos].frequency;
        else {
            vodPos = E.navCheckResult.length - 1;
            iPanel.debug("serviceStart----;vodPos=" + vodPos);
            frequency = E.navCheckResult[vodPos].frequency;
        }
    }
    iPanel.debug("执行获取点播频点方法完毕获取频点值frequency为" + parseInt(frequency));
    iPanel.debug("VOD.server.enterVOD-------start");
    //	VOD.serviceStart("coship",parseInt(frequency),68750,"64-QAM");
    VOD.server.enterVOD(parseInt(frequency));
    iPanel.debug("VOD.server.enterVOD-------end");
}

function show_Count(adEndTime) {
    var showAdtime = adEndTime - mp.getCurrentPlayTime();//mp.currentPoint;
    if (showAdtime <= 0) {
        clear_Count();
    } else {
        $("adtime").style.visibility = "visible";
        $("ad_tip").style.visibility = "visible";
        $("ad_showtime").innerHTML = showAdtime;
    }
}


var tol = 0;
var cDiv = document.getElementById("imgProcess");
var bjDiv = document.getElementById("imgBj");
function init() {
    // playVideo1();
    // var mp = new mediaPlay();
    if (window.navigator.userAgent == 'compatible:Coship cooca Webkit') {
        mp = new MediaPlayer();
        mp.setAllowTrickmodeFlag(0);
        mp.setCurrentAudioChannel("Stereo");
        mp.setMuteFlag(0);
        mp.setVideoDisplayMode(1); // 全屏
        mp.refreshVideoDisplay();
        $("main").style.visibility = "hidden";
        $("g_button").style.visibility = "hidden";
        bjDiv.style.visibility = "hidden";
        url = "http://172.20.100.132:16666/vod/cp0001,TWSX1582622213531316.m3u8?fmt=x264_400k_mpegts&timecode=0&sk=3642D47533CF16C85A56E9859C7593D2&uuid=f283eab2-63a6-4cce-acdc-e241843a9312&userCode=8120010480205746&userName=8120010480205746&spCode=484581254562&productCode=0000002&resourceCode=102410011&subId=123&resourceName=&authType=null&channelCode=null";
        mp.setSingleMedia(url);
        mp.playFromStart();

        //监听mediaPlayer播放结束事件
        document.addEventListener('keypress', function (e) {
            var keycode = e.keyCode;
            alert("aaa" + keycode);

            if (keycode == '768') {
                window.history.go(-1);
                var evt = Utility.getEvent();
                var _evt = eval('(' + evt + ')');
                if (_evt.type == 'EVENT_MEDIA_END') {
                    close();
                    window.history.go(-1);
                }
            }
        });

        $("#total_time").text(secToTimeStr(mp.getMediaDuration()));
        if (istry == 'true') {
            setInterval(function () {
                _p = parseInt(mp.getCurrentPlayTime());
                if (_p >= 5 * 60 || _p >= parseInt(mp.getMediaDuration())) {
                    close();
                    window.history.go(-1);
                }
            }, 5 * 1000);
        }



    } else {
        mp = new mediaPlay();
        mp.setAllowTrickmodeFlag(0);
        mp.setCurrentAudioChannel("Stereo");
        mp.setVideoDisplayMode(1); // 设置全屏模式
        mp.refreshVideoDisplay();
        $("main").style.visibility = "hidden";
        $("g_button").style.visibility = "hidden";
        if (!isCancelQuit()) {
            setGlobalVar("nativePlayerInstanceId", mp.getNativePlayerInstanceId());
        } else {
            var nativePlayerInstanceId = getGlobalVar("nativePlayerInstanceId");
            mp.bindNativePlayerInstance(nativePlayerInstanceId);
        }
        playVideo1();
        setTimeout(function () {
            initPage();
        }, 1500);

    }

}



/************************ coship播放器 *****************************************/


/**以上是coship播放器 */

function initPage() {
    tol = mp.getMediaDuration() * 1;
    $("main").style.visibility = "hidden";
    timeControl = new TimeControl(265, 690);
    setGlobalVar('vod_ctrl_endtime', tol);

    getADPlayString();//获取广告

    setSmartCardId();

    getFrequency();
    initSound();

    initVoiceControl();
    mp.resume();
    if (rtsp == "") {//rtsp串为空则退出播放
        gotoHref(1, "100001");
    }
    if (!isCancelQuit()) {
        //document.getElementById("pop").innerHTML="111111";
        setDisplay(false, false);
        setStatusImg(0);
        execCount++;
        if (execCount >= 2) { stopCount(); }
        if (getGlobalVar("vod_play_type") == "1") {

            if (getGlobalVar("vod_recordType") == "VOD") {
                continuePointTime = continuePointTime;
                var parameter = "1313";
                gotoHref(0, parameter + getEndPlayTimeParmeter());
            }
        }
    } else {


        //document.getElementById("pop").innerHTML="22222";
        setDisplay(false, false);
        //continuePointTime = media.AV.elapsed;
        continuePointTime = mp.getCurrentPlayTime();
        // continuePointTime = getIntValue(getQueryStr("endPlayTime", LocString));

        // document.getElementById("pop").innerHTML="=init:media.e="+media.AV.elapsed+"==aa==";
        currentStatus = getIntValue(getQueryStr("currentStatus", LocString));
        //alert(continuePointTime)
        //LocString = LocString.replaceQueryStr(continuePointTime,'endPlayTime');

        initPlayTime = getIntValue(getQueryStr("initPlayTime", LocString));
        setStatusImg(currentStatus);
        resetTimerControl();
    }

    getRTSPTime();
    timeControl.currentTimes = parseInt(continuePointTime, 10);
    var timeDis = parseInt(continuePointTime, 10);
    var hour = Math.floor(timeDis / 3600);
    var minute = Math.floor((timeDis - hour * 3600) / 60);
    var second = timeDis - hour * 3600 - minute * 60;
    hour = hour > 9 ? hour : "0" + hour;
    minute = minute > 9 ? minute : "0" + minute;
    second = second > 9 ? second : "0" + second;
    var goto_time = hour + ":" + minute + ":" + second;
    mp.playByTime(1, goto_time, 1);
    initTimeControl(0, (videoEndTime + 5), continuePointTime);
    getProgram();
    setEndTime(convertToShowTime(timeControl.allTimes));



    //进行监听，当影片播放完毕，删除书签跳转详情页
    // overTimer = setInterval(function () {

    //     var curTime = -1;
    //     if (!pauseFlag) {
    //         curTime = timeControl.currentTimes;
    //     } else {
    //         curTime = parseInt(mp.getCurrentPlayTime());
    //     }


    //     if ((curTime == tol) && moveFlag == false && (timeControl.currentTimes > (tol - 10)) && pauseFlag == true) {

    //         clearInterval(overTimer);
    //         var id = getQueryVariable("id");
    //         var providerId = getQueryVariable("providerId");
    //         var folderAssetId = getQueryVariable("folderAssetId");
    //         API.DeleteSavedProgram({
    //             id: id,
    //             providerId: providerId,
    //             folderAssetId: folderAssetId,
    //         }, function (data) {
    //             history.go(-1);
    //         })

    //     }
    // }, 1000);


}
var windowFlag = false;
var enterFlag = true;
function isWindow() {

}

//页面跳转
function gotoHref(isTip, parame) {
    stopFlag = false;
    videoFlag = true;
    setGlobalVar('scanTestBack', '');
    var url;
    if (initPlayTime == -1) {
        initPlayTime = 0;
    }
    url = "vod_exit.htm?initPlayTime=" + initPlayTime + "&currentStatus=" + currentStatus + "&tipType=" + parame;
    if (isTip == 1) {
        url = "check_out.htm?initPlayTime=" + initPlayTime + "&currentStatus=" + currentStatus + "&errorCode=" + parame;
        window.location.href = url;
    } else if (isTip == 0) {
        window.location.href = url;
    } else if (isTip == 2) {
        if (windowFlag) {
            windowFlag = false;
            $('window').style.display = 'none';
        } else {
            windowFlag = true;
            $('window').style.display = 'block';
        }

    }

}

//获取与显示时间
function getRTSPTime() {
    var pointPlayTime = getIntValue(getQueryStr("endPlayTime", LocString));
    // alert("tottime1" + getGlobalVar("vod_ctrl_endtime"))//结束时间
    var vod_play_type = getGlobalVar("vod_play_type");//is only view a few seconds.
    if (pointPlayTime != null & pointPlayTime != "undefined") {
        playAgainFlag = true;
        vod_play_type = "1";
    }
    if (vod_play_type == "1") {//1是续播
        var totalTime = getGlobalVar("vod_ctrl_endtime");
        if (totalTime != null && totalTime != "") {//总时长不为0时处理
            videoEndTime = parseInt(totalTime, 10);
            if (!isCancelQuit()) {
                continuePointTime = parseInt(continuePointTime, 10);
            }
            if (getQueryStr('tipType', LocString) == '1313' || getQueryStr('tipType', LocString) == 1313) {
                continuePointTime = parseInt(continuePointTime, 10);
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
    if (isNaN(videoEndTime)) { videoEndTime = 0; }
    //if(!isNaN(videoEndTime)) { getMoveParams();}
    if (videoEndTime <= 0) { zeroDurationFlag = true; } else {
        zeroDurationFlag = false;
    }

}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

function playVideo1() {
    var rtsp_url = ""
    var providerId = getQueryVariable("providerId");
    var id = getQueryVariable("id");
    var folderAssetId = getQueryVariable("folderAssetId");
    continuePointTime = getQueryVariable("timePosition");
    API.GetPlayUrl({
        id: id,
        providerId: providerId,
        folderAssetId: folderAssetId,
    }, function (data) {
        rtsp_url = data.playUrl;
        rtsp = rtsp_url;
        mp.setSingleMedia(rtsp);
        mp.playFromStart();
        playVod11(parseInt(continuePointTime, 10), rtsp);

    })
}

function playVod11(startTime, playUrl) {
    initPlayTime = parseInt(continuePointTime, 10);
    if (parseInt(continuePointTime, 10) >= 0) {
        setGlobalVar('vod_play_type', '1');
    }

    $("begin_time").innerHTML = "00:00:00";
    bjDiv.style.visibility = "hidden";

    setTimeout(function () {
        bjDiv.innerHTML = "";
        cDiv.style.visibility = "hidden";
    }, 2000);
    // mp.playByTime(1, parseInt(getGlobalVar("vod_ctrl_startime"), 10), 1);
}
//播放视频
function playVideo(mediaStr, areaCode) {
    initPlayTime = parseInt(continuePointTime, 10);
    var qam_name = "" + areaCode;
    var client = CA.card.cardId;
    var rtsp_url = mediaStr + ";qam_name=" + qam_name + ";client=" + client;
    iPanel.debug("播放的RTSP为：" + rtsp_url);
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
    if (initPlayTime == -1) return;
    if (videoEndTime <= 0) {
        getRTSPTime();
        timeControl.resetEndTime(0, videoEndTime);
        setProgrammeInfo(convertToShowTime(timeControl.allTimes));
    }
    var currentPT = mp.getCurrentPlayTime();
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
    if (src != "") { $("imgStatus").src = src; }
    $("g_speed").innerText = speedStr;
    currentStatus = status;
}

//播放条显示与隐藏
function setDisplay(showFlag, imgShowFlag) {
    if (showFlag) {
        voice.voiceDisplay(false);
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

//播放控制
function mediaPlay() {//playTime : second
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

        var timeDis = timeControl.currentTimes;
        var hour = Math.floor(timeDis / 3600);
        var minute = Math.floor((timeDis - hour * 3600) / 60);
        var second = timeDis - hour * 3600 - minute * 60;
        hour = hour > 9 ? hour : "0" + hour;
        minute = minute > 9 ? minute : "0" + minute;
        second = second > 9 ? second : "0" + second;
        var goto_time = hour + ":" + minute + ":" + second;
        mp.playByTime(1, goto_time, 1);
        pauseFlag = true;
        // setTimeout(mp.resume(), 500);
    }
}

//静音设置
function setMute() {
    muteFlag = muteFlag == 0 ? 1 : 0;
    setMuteFlag(muteFlag);
}

function setMuteFlag(flag) {
    if (flag == 0) {//有声
        // media.sound.resume();
        mp.setMuteFlag(0);
        //mp.audioUnmute();
        $('mutePic').style.visibility = "hidden";
    } else {
        // media.sound.mute();
        mp.setMuteFlag(1);
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
    var defaultVoice = mp.getVolume();
    voice = new Voices(343, 600, 0);
    var realVoice = 0;
    if (!isNaN(defaultVoice)) { realVoice = Math.round(parseInt(defaultVoice, 10) * voice.maxVoice / 100); }
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
    }
    else {
        type = 1;
    }
    voice.UpDown(type);
    // media.sound.value = (Math.round(voice.currentVoice));
    mp.setVolume(Math.round(voice.currentVoice));
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
            mp.playByTime(1, seekPlayTime, 1);
            // media.AV.pause(1);
            return;
        }
        else {
            speed = 0;
        }
    }
    if (speed == 0) {
        speed = 32;
    }
    if (val == KEY_FAST_FORWARD) {
        speedAction = 1;
        setStatusImg(3);
        // media.AV.forward(speed);
        mp.fastForward(speed);
    } else {
        speedAction = -1;
        setStatusImg(4);
        // media.AV.backward(-speed);
        mp.fastRewind(-speed);
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
    var currentPT = mp.getCurrentPlayTime();
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

            setDisplay_loc(0);
            mediaPlay();
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
        // media.sound.mode = _currentMatchMode;
        mp.setMatchMode(_currentMatchMode);
    } else {
        obj.style.visibility = "visible";
        if (trackTimeout != null)
            clearInterval(trackTimeout);
        trackTimeout = setInterval("countTrack()", 1000);
    }
    _currentMatchMode = parseInt(mp.getMatchMode(), 10);
    obj.innerHTML = getMatchModeStr(_currentMatchMode);
}

//获取最后播放时间进行记录传值
function getEndPlayTimeParmeter() {//getEndPlayTimeParmeter
    var cPlayTime = mp.getCurrentPlayTime();
    var endPlayTime = initPlayTime;
    if (!isNaN(cPlayTime)) {
        endPlayTime += parseInt(cPlayTime, 10);
    }
    if (videoEndTime == 0) {
        getRTSPTime();
    }
    return "&endPlayTime=" + endPlayTime;
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
    // media.AV.play();
    mp.playByTime(1, 1 + startTimeOffset, 0);
    //mp.play();
    setDisplay(false, false);
    speedAction = 0;
    speed = 0;
    setStatusImg(0);
}






function closeVideo() {
    if (stopFlag) {
        exitPage();
        //mp.releasePlayerInstance();
    }
}
var log = "";
function printLog(str) {//调试时打开下面两行//2011.05.05
    //log += str;
    //document.getElementById("test").innerHTML = log;
}
// window.onunload = function() {
//     if(!videoFlag) {
//         exitPage();
//     }
// };

