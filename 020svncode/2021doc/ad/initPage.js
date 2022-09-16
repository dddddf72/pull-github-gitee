//init部分
var mp = null;
var focusObj = null;

//adplay部分
var playTimer = null;
var tmTimer = null;//t*1000后访问url完成数据上报
var tmExposureMonitorTimeArr = [];
var timer = null;
var adObj = {};
var htmlVAd1 = null;
var styleVAd1 = "width:" + 100 + "px;";
var htmlVAd2 = null;
var styleVAd2 = "width:" + 220 + "px;";
var htmlNoVAd1 = null;
var styleNoVAd1 = "width:" + 64 + "px;";
var htmlVNoAd2 = null;
var styleNoVAd2 = "width:" + 175 + "px;";

function showLog (log) {
  // document.getElementById('conTLeft').innerHTML = log
  var htmlIntent = ''
  var debug = document.getElementById('conTLeft');
  debug.style.display = "block";
  htmlIntent += debug.innerHTML + '<div>' + log + '</div>'
  debug.innerHTML = htmlIntent;
  //   $('debug').innerHTML = $('debug').innerHTML + '<br/>' + log;
}
var data = {
  imp: [{
    ad_mark: defaultAdMark
  }],
  appkey: defaultAppkey,
  app: {
    name: defaultAppName,
    pkgname: defaultPkgname,
    appversion: defaultAppversion
  },
  device: {
    area_id: defaultDeviceAreaId,//districtCode
    manufacture: defaultManufacture,
    model: defaultModel
  },
  user: {
    user_code: "test" || hardware.STB.serialNumber  //SN
  }
};

function initMp () {
  // showLog("load2initMp")
  try {
    // showLog("loadmp")
    mp = new MediaPlayer();
    mp.setVideoDisplayMode(2);
    // loadAd()
    // showLog("load3loadad")
  } catch (e) {
  }
}

function initAdData () {
  //发起获取开机广告系统参数请求
  getAdSystemParameter()
}

function init () {

  initMp()
  initAdData()
  // setRefreshableTimer();
}
function loadAd () {
  // var url = "http://10.10.53.8:8080/m3u8/2012.m3u8"
  var URL = "http://114.118.12.134:8197/api/getInfo"
  // AdAPI.getAdPageData(data, function (data) {
  ajax({
    type: "POST",
    url: URL,
    async: true,
    data: JSON.stringify(data),
    success: function (result) {
      try {
        var result = JSON.parse(result)
        if (result.code == 200) {
          var res = result.ad_info[0];
          if (res.video) {//播放视频广告
            adObj = res.video;
            adObj.url = "http://10.10.53.8:8080/m3u8/2012.m3u8";
            adObj.curDuration = adObj.duration;
            if (adObj.exit_time) {
              if (adObj.exit_time > 0) {
                setTimeout(function () {
                  //  按键退出实际操作
                  initFocus()
                }, adObj.exit_time * 1000);//客户端广告最少观看时长
              }
            }
            // Count()
            setLivePlay(adObj)
            if (res.ext.pm) {
              var pmArr = res.ext.pm;//曝光监测URL，可以有多条
              ExposureMonitor(pmArr)
            }
            if (res.ext.tm) {
              //视频素材播放中间曝光监测URL
              res.ext.tm.forEach(function (tmItem) {
                // showLog("数据上报"+tmItem)
                tmTimer = setTimeout(function () {
                  ExposureMonitorWhenPlay(tmItem.url);
                  // return;
                }, tmItem.t * 1000);
                tmExposureMonitorTimeArr.push(tmItem.t)
              })
            }
          } else {
            showLog("NOvideo")
            // location.href = '/index.htm'
          }
        } else {
          showLog("resCode---200err")
          // setTimeout(() => {
          //   console.log("广告请求时间超时" + ADS_LAUNCHER_TIMEOUT)
          // }, ADS_LAUNCHER_TIMEOUT * 1000);//控制广告请求超时时间
        }
      } catch (e) {
        showLog("catch----err")
        // setTimeout(() => {
        //   console.log("广告请求时间超时" + ADS_LAUNCHER_TIMEOUT)
        // }, ADS_LAUNCHER_TIMEOUT * 1000);//控制广告请求超时时间
      }
    },
    error: function (err) {
      showLog("error----err")
    }
  })
  // })
}


//获取开机广告系统参数 ADS_LAUNCHER_SWITCH
function getAdSystemParameter () {
  ajax({
    type: "GET",
    url: adEpgUrl.iepg + '/getPram?version=V200&PramName=iepgConfig',
    async: true,
    success: function (dataParam) {
      dataParam = JSON.parse(dataParam);
      if (dataParam.ret == 0) {
        var dataParamAll = dataParam.datas;
        for (var i = 0; i < dataParamAll.length; i++) {
          if (dataParamAll[i].pramKey === "ADS_LAUNCHER_SWITCH") {
            ADS_LAUNCHER_SWITCH = dataParamAll[i].pramValue; // 是否播广告
            if (ADS_LAUNCHER_SWITCH == 'OFF') {
              location.href = '/index.htm';
            } else {
              //发起AAA请求 发起开机广告getInfo请求
              // showLog("GbootAAA:" + getGbootAAA())
              // queryTownUserInfo(function () {
                // App.loadAd()
                setGbootAAA(1);
                // showLog("GbootAAA:" + getGbootAAA())
                loadAd();
                // mp = new MediaPlayer();
                // mp.setVideoDisplayMode(2);
                // mp.setVideoDisplayArea(0, 0, 1280, 720);
                // mp.setSingleMedia("http://10.10.53.8:8080/m3u8/2012.m3u8");
                // mp.refreshVideoDisplay();
                // mp.playFromStart();

              // })
            }
          }
          if (dataParamAll[i].pramKey == "ADS_LAUNCHER_TIMEOUT") {
            ADS_LAUNCHER_TIMEOUT = dataParamAll[i].pramValue; // 控制广告请求超时时间
          }
        }
      } else {
        //需求修改，参数错误不跳转直播
        //gotoOther("ui://play.html");
      }
    },
    error: function () {
      //需求修改，参数错误不跳转直播
      //gotoOther("ui://play.html");
    }
  })
}


function doBackOrExit () {
  onKey('ok');
}

function onKey (action) {
  debugger
  focusObj !== null && focusObj.onkey(action);
};

function initFocus () {
  focusObj = new View();
};
function checkLivePlay (adObj) {
  // for (var i = 0; i < adObj.length; i++) {
  setLivePlay(adObj);
  //   return;
  // }
  // stopLivePlay();
}
function ExposureMonitor (pmArr) {
  for (var i = 0; i < pmArr.length; i++) {
    ExposureMonitorUrl(pmArr[i]);
  }
};
function ExposureMonitorWhenPlay (tmArr) {
  for (var i = 0; i < tmArr.length; i++) {
    ExposureMonitorUrl(tmArr[i]);
  }
};
function ExposureMonitorUrl (url) {
  // AdAPI.getExposureUrl(url, function (res) {
  //   debugger
  //   console.log(res)
  // })

  ajax({
    type: "GET",
    url: url,
    success: function (data) {
      try {
        // showLog("GETSuccess")

      } catch (e) {
        showLog("GETERROR")
      }
    },
    error: function () { }
  });
  // showLog("访问曝光url：" + url)
};


function showAd (adObj) {
  // timersExit = adObj.exit_time;//视频可退出时长
  // timersAll = adObj.curDuration; //视频当前退出倒计时时长
  //视频广告(广告15)
  htmlVAd1 = "<div class='adRight' style='" + styleVAd1 + "'><div id='adtext' class='adtext'><div><div>" + "广告" + "</div><div>" + adObj.curDuration + "秒" + "</div></div></div></div>"
  //视频广告(广告10关闭)
  htmlVAd2 = "<div class='adRight' style='" + styleVAd2 + "'><div id='adtext' class='adtext'><div><div>" + "广告" + "</div><div>" + adObj.curDuration + "秒" + "</div><div>" + "|" + "</div><div>" + "按返回键关闭" + "</div></div></div></div>"
  //非视频广告(15)
  htmlNoVAd1 = "<div class='adRight' style='" + styleNoVAd1 + "'><div id='adtext' class='adtext'><div><div>" + adObj.curDuration + "秒" + "</div></div></div></div>"
  // 非视频广告(10关闭)
  htmlVNoAd2 = "<div class='adRight' style='" + styleNoVAd2 + "'><div id='adtext' class='adtext'><div><div>" + adObj.curDuration + "秒" + "</div><div>" + "|" + "</div><div>" + "按返回键关闭" + "</div></div></div></div></div>"
  if (adObj.duration - adObj.curDuration >= adObj.exit_time) {
    $('conTRight').innerHTML = htmlVAd2//htmlVAd2 htmlVNoAd2
  } else {
    $('conTRight').innerHTML = htmlVAd1//htmlVAd1 htmlNoVAd1
  }
}
//adplay部分
function setLivePlay (adObj) {

  try {

    playTimer = setTimeout(function () {
      mp.setVideoDisplayArea(0, 0, 1280, 720);
      mp.setSingleMedia(adObj.url);
      mp.refreshVideoDisplay();
      mp.playFromStart();
      Count()
    })

  } catch (e) { }
}
function Count () {
  timer = setInterval(function () {
    adObj.curDuration--;
    if (adObj.curDuration >= 0) {
      if (adObj.curDuration == 0) {
        handleJump()
      }
    }
    showAd(adObj)
  }, 1000);
}
function handleJump () {
  // clearTimeout(timer)
  // clearInterval(timer)
  stopTmExposureMonitor()
  showLog(adObj.duration - adObj.curDuration)
  debugger
  
  $('main').style.display = 'none'
  stopLivePlay()
  // window.location.href = "/index.htm"
}

function stopLivePlay () {
  clearTimeout(playTimer);
  //return;
  try {
    // DVB.stopAV(0);
    videoflag = 0;
    // media.video.setPosition(0, 0, 0, 0);
    // DVB.stopAV(0);
    mp.stop();
  } catch (e) { }
}
//退出数据上报
function stopTmExposureMonitor(){
  //退出时间大于
  var playedTime = adObj.duration - adObj.curDuration;
  tmExposureMonitorTimeArr.forEach(function(tmTime){
    if(tmTime>playedTime){
      clearTimeout(tmTimer);
    }
  })
}


// function timeToMinute (times) {
//   var t;
//   if (times > -1) {
//     var hour = Math.floor(times / 3600);
//     var min = Math.floor(times / 60) % 60;
//     var sec = times % 60;
//     if (hour < 10) {
//       t = '0' + hour + ":";
//     } else {
//       t = hour + ":";
//     }
//     if (min < 10) { t += "0"; }
//     t += min + ":";
//     if (sec < 10) { t += "0"; }
//     t += sec.toFixed(2);
//   }
//   t = t.substring(0, t.length - 3);
//   return t;
// }

//菜单键刷新间隔
// var doMenuInterval = 3000;
// function setRefreshableTimer () {
//   refreshTimer = setTimeout(function () {
//     refreshable = true;
//   }, doMenuInterval);
// }