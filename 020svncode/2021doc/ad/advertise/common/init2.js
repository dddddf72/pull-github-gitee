
window.addEventListener("load", function() {
  if (typeof initPage != "undefined") {
      initPage();
  }
}, false);

window.addEventListener("unload", function() {
  if (typeof exitPage != "undefined") {
      exitPage();
  }
}, false);
function initPage () {
  // setRefreshableTimer();
  App.init();
}
function $ (_id) {
  return document.getElementById(_id);
}
var App = {
  num: 0,
  mp: null,
  playUrl: '',
  playTimer: '',
  timersCurrent: 0,
  timersAll: 0,
  timer: '',

  init: function () {
    clearGlobalVar();
    // this.setArea();
    this.initMp();
    this.getData();
    this.Count()
  },
  
  // setArea: function() {
  //   setGlobalVar('area', getURLParameter('area'));
  // },
  initMp: function () {
    try {
      this.mp = new MediaPlayer();
      this.mp.setVideoDisplayMode(2);
    } catch (e) {
    }
  },
  getData: function () {
    var self = this;
    // ServerAPI.getRecommendList(function(res) {
    // if (res.success) {
    // if (res.totalCount > 0) {
    // self.nameData[self.typeKeys[1]] = res.dataList;
    self.checkLivePlay();
    // }
    // }
    // })
  },
  checkLivePlay: function () {
    try {
      this.playTimer = setTimeout(function () {
        this.mp = new MediaPlayer()
        this.mp.setVideoDisplayArea(0, 0, 1280, 720);
        this.playUrl = 'http://10.10.53.10:8080/video/m3u8/2012.m3u8'
        this.mp.setSingleMedia(this.playUrl);

        showLog(this.mp.getCurrentPlayTime())
        showLog(this.mp.getMediaDuration())
        showLog(Math.ceil(this.mp.getCurrentPlayTime()))

        this.timersCurrent = Math.ceil(this.mp.getCurrentPlayTime());//视频当前播放时长
        $('time1').innerHTML = timeToMinute(this.timersCurrent);
        this.timersAll = Math.ceil(this.mp.getMediaDuration()); //视频总时长
        this.num = Math.ceil(this.mp.getMediaDuration())
        $('time2').innerHTML = timeToMinute(this.timersAll);
        this.mp.refreshVideoDisplay();
        this.mp.playFromStart();
      }, 500)
    } catch (e) { }
  },
  Count: function () {
    var self = this;
    this.timer = setTimeout(() => {
      this.num--;
      if (this.num > 0) {
        $('time').innerHTML = "广告" + this.num + "秒" + "|按返回键退出"
      }
      if (this.num == 0) {
        clearInterval(this.timer)
        this.mp.stop()
        $('box').style.display = 'none'
        window.location.href = 'http://10.9.219.25'
      }
      self.Count()
    }, 1000);
  }
}
function showLog(log) {
  if (!$('debug')) {
    var debug = document.createElement('div')
    debug.id = 'debug'
    debug.style.cssText =
      'position: absolute;top: 50px;left: 100px; color: yellow;z-index: 2222'
    document.body.appendChild(debug)
  }
  $('debug').innerHTML = $('debug').innerHTML + '<br/>' + log
}
function debug (_configs) {
  var paramArr = [],
    debugType = '0',
    arrLength
  if (typeof _configs != 'object') {
    return
  }
  arrLength = _configs.length
  if (arrLength == undefined) {
    var i = 0
    for (var key in _configs) {
      paramArr[i] = key + '=' + _configs[key]
      i++
    }
    arrLength = paramArr.length
    debugType = '1'
  } else {
    arrLength = _configs.length
  }
  var newDiv = document.createElement('div')
  newDiv.setAttribute('id', 'DEBUG')
  newDiv.setAttribute(
    'style',
    'background:#D6D6D6; width:auto; heigth:auto; position:absolute; left:50px; top:50px;'
  )
  document.body.appendChild(newDiv)
  var obj = document.getElementById('DEBUG')
  for (var i = 0; i < arrLength; i++) {
    var testDiv = document.createElement('div')
    testDiv.setAttribute('id', 'MSG_' + i)
    if (i % 2 == 0) {
      //偶数样式
      testDiv.setAttribute('style', 'background:#A9A9A9;')
    }
    if (debugType == '0') {
      //为数组
      testDiv.innerHTML = 'No.' + i + ' ==== ' + _configs[i]
    } else {
      //为json对象
      var arr = paramArr[i].split('=')
      testDiv.innerHTML = arr[0] + ' ==== ' + arr[1]
    }
    obj.appendChild(testDiv)
  }
}

function clearGlobalVar() {
  if (typeof Utility != 'undefined' && Utility.getEnv) {
      var envList = Utility.getEnv(globalEnvArr);
      if (envList) {
          envList = envList.split(',');
          envList.forEach(function(item) {
              Utility.setEnv(item, '');
          })
      }
  } else if (window.localStorage) {
      localStorage.clear();
  } else {
      document.cookie = "";
  }
}


function getURLParameter (_text) {
  var ret = (new RegExp("[\\?&]" + _text + "=([^&#]*)")).exec(location.search);
  return ret ? ret[1] : "";
}

function timeToMinute (times) {
  var t;
  if (times > -1) {
    var hour = Math.floor(times / 3600);
    var min = Math.floor(times / 60) % 60;
    var sec = times % 60;
    if (hour < 10) {
      t = '0' + hour + ":";
    } else {
      t = hour + ":";
    }
    if (min < 10) { t += "0"; }
    t += min + ":";
    if (sec < 10) { t += "0"; }
    t += sec.toFixed(2);
  }
  t = t.substring(0, t.length - 3);
  return t;
}

function setLivePlay (liveObj) {
  try {
    var left = liveObj.cellX + 5;
    var top = liveObj.cellY + tabCellY - 75;
    var width = liveObj.width - 10;
    var heigth = liveObj.height - 10;
    if (liveObj.type == "live" || liveObj.type == "ad") {
      //media.video.setPosition(91,155,442,260);
      media.video.setPosition(left, top, width, heigth);
      if (liveObj.frequency && liveObj.serviceId) {
        frequency = parseInt(liveObj.frequency + "0000");//默认给频点后面加4个0
        rawFrequency = parseInt(liveObj.frequency);
        serviceId = parseInt(liveObj.serviceId);
        playTimer = setTimeout(function () {
          DVB.playAV(frequency, serviceId);
        }, 500)
      } else {  //播放关机频道
        var channel = user.getOffChannel(1);
        if (typeof (channel) == "object" && channel != null) {
          playTimer = setTimeout(function () {
            DVB.playAV(channel.getService().frequency, channel.getService().serviceId);
          }, 500)
        }
      }
    } else if (liveObj.type == "vod") {
      debugger
      playTimer = setTimeout(function () {
        mp.setVideoDisplayArea(left, top, width, heigth);
        mp.setSingleMedia(liveObj.playUrl);
        mp.refreshVideoDisplay();
        mp.playFromStart();
      }, 500)
    }
  } catch (e) {
    mp.stop();
  }
}

function stopLivePlay () {
  clearTimeout(playTimer);
  //return;
  try {
    // DVB.stopAV(0);
    // videoflag = 0;
    media.video.setPosition(0, 0, 0, 0);
    DVB.stopAV(0);
    mp.stop();
  } catch (e) {
  }
}


//菜单键刷新间隔
var doMenuInterval = 3000;
function setRefreshableTimer () {
  refreshTimer = setTimeout(function () {
    refreshable = true;
  }, doMenuInterval);
}