
function init () {
  // setRefreshableTimer();
  App.initMp();
  App.initAdData()
}

var App = {
  mp: null,
  focusObj:null,
  timersCurrent: 0,
  timersAll: 0,
  
  init: function () {
    this.initAdData();
  },
  
  // setArea: function() {
  //   setGlobalVar('area', getURLParameter('area'));
  // },
  initMp: function () {
    var self = this
    try {
      self.mp = new MediaPlayer();
      self.mp.setVideoDisplayMode(2);
    } catch (e) {
    }
  },
  // adData

  data:{
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
  },
  initAdData: function () {
    //发起获取开机广告系统参数请求
    // var self = this;
    getAdSystemParameter()//在data.js里
  },
  loadAd:function(){
    var self = this;
    AdAPI.getAdPageData(self.data,function(result) {
      // success: function(result) {
        showLog(JSON.parse(result).code)
        if(JSON.parse(result).code == 200){
          // console.log(data)
          // console.log(JSON.parse(data))
          var res = JSON.parse(result).ad_info[0]
          if(res.video){//播放视频广告 是否播广告
            adPlay.adObj = res.video
            // adPlay.adObj.url = "https://www.runoob.com/try/demo_source/mov_bbb.mp4"
            adPlay.adObj.url = "http://10.10.53.8:8080/m3u8/2012.m3u8"
            adPlay.adObj.curDuration = adPlay.adObj.duration;
            if(adPlay.adObj.exit_time){
              if(adPlay.adObj.exit_time > 0){
                setTimeout(function() {
                  //  按键退出实际操作
                  debugger
                  // self.getKey()
                  self.initFocus()
                }, adPlay.adObj.exit_time * 1000);//客户端广告最少观看时长
              }
            }
            
            adPlay.setLivePlay(adPlay.adObj)
            // adPlay.Count()
            if(res.ext.pm){//曝光监测URL，可以有多条
              App.ExposureMonitor(res.ext.pm)
            }
            if(res.ext.tm){//视频素材播放中间曝光监测URL
              res.ext.tm.forEach(function (tmItem,j){
                setTimeout(function()  {
                    App.ExposureMonitorWhenPlay(tmItem.url);
                    return;
                }, tmItem.t * 1000);
              })
            }
            // if(res.pop){//泡泡广告
            //   var popObj = res.pop
            //   console.log("泡泡广告url："+popObj.url+"泡泡广告展示时长："+popObj.duration+"可退出时长："+popObj.exit_time)
            // }
            // if(res.image){//图片信息
            //   var imageObj = res.image
            //   console.log("图片信息url："+imageObj.url+"图片信息展示时长："+imageObj.duration+"可退出时长："+imageObj.exit_time)
            // }
            // if(res.text){//跑马灯广告
            //   var textObj = res.text
            //   console.log("跑马灯广告url："+textObj.url+"跑马灯广告展示时长："+textObj.duration+"可退出时长："+textObj.exit_time)
            // }
          }else{
            location.href = '/index.htm'
          }
        }else{
          setTimeout(() => {
            console.log("广告请求时间超时"+ADS_LAUNCHER_TIMEOUT)
          }, ADS_LAUNCHER_TIMEOUT * 1000);//控制广告请求超时时间
        }
      // },
      // error:function(err){
      //   showLog("error---err")
      // }
    })
  },
  showAd :function(adObj){
    // timersExit = adObj.exit_time;//视频可退出时长
    // timersAll = adObj.curDuration; //视频当前退出倒计时时长
    //视频广告(广告15)
    adPlay.htmlVAd1 = "<div class='adRight' style='" + adPlay.styleVAd1 + "'><div id='adtext' class='adtext'><div><div>" + "广告" + "</div><div>" + adObj.curDuration + "秒" + "</div></div></div>";
    //视频广告(广告10关闭)
    adPlay.htmlVAd2 = "<div class='adRight' style='" + adPlay.styleVAd2 + "'><div id='adtext' class='adtext'><div><div>" + "广告" + "</div><div>" + adObj.curDuration + "秒" + "</div><div>" + "|" + "</div><div>" + "按返回键关闭" + "</div></div></div>";
    //非视频广告(15)
    adPlay.htmlNoVAd1 = "<div class='adRight' style='" + adPlay.styleNoVAd1 + "'><div id='adtext' class='adtext'><div>" + adObj.curDuration + "秒" + "</div></div></div></div>";
    // 非视频广告(10关闭)
    adPlay.htmlVNoAd2 = "<div class='adRight' style='" + adPlay.styleNoVAd2 + "'><div id='adtext' class='adtext'><div>" + adObj.curDuration  + "秒" + "</div><div>" + "|" + "</div><div>" + "按返回键关闭" + "</div></div></div></div></div>";
    if (adObj.duration - adObj.curDuration  >= adObj.exit_time) {
      $('conTRight').innerHTML = adPlay.htmlVAd2
    } else {
      $('conTRight').innerHTML = adPlay.htmlVAd1
    }
  },
  getKey:function(){
    var self = this
    self.initFocus();
  },
  initFocus: function() {
    this.focusObj = new View();
  },
  onKey: function(action) {
      this.focusObj !==null && this.focusObj.onkey(action);
  },
  ExposureMonitor:function(pmArr){
    var self = this;
    for (var i = 0; i < pmArr.length; i++) {
      self.ExposureMonitorUrl(pmArr[i]);
    }
  },
  ExposureMonitorWhenPlay:function(tmArr){
    var self = this;
    for (var i = 0; i < tmArr.length; i++) {
      self.ExposureMonitorUrl(tmArr[i]);
    }
  },
  ExposureMonitorUrl:function(url){
    showLog("getExposureUrl")
    
    // AdAPI.getExposureUrl(url,function(res) {
    //   debugger
    //   console.log(res)
    // })

    // ajax({
    //   type: "GET",
    //   url: url,
    //   success: function (data) {
    //     try {
    //       // showLog("GETSuccess")
    //     } catch (e) {
    //       showLog("GETERROR")
    //     }
    //   },
    //   error: function () { }
    // });
    // showLog("访问曝光url：" + url)
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
      adPlay.setLivePlay(adPlay.adObj);
    } catch (e) { }
  },
}
var adPlay = {
  playTimer:null,
  timer:null,
  tmTimer:null,//t*1000后访问url完成数据上报
  tmExposureMonitorTimeArr:[],//tm曝光检测url集合
  adObj:{},
  htmlVAd1 : '',
  styleVAd1 : 'width:' + 100 + 'px;',
  htmlVAd2 :'',
  styleVAd2 : 'width:' + 220 + 'px;',
  htmlNoVAd1 : '',
  styleNoVAd1 : 'width:' + 64 + 'px;',
  htmlVNoAd2 :'',
  styleNoVAd2 : 'width:' + 175 + 'px;',
  setLivePlay :function (adObj) {
    var self = this;
    try {
      showLog("setLivePlay")
      self.playTimer = setTimeout(function () {
        App.mp.setVideoDisplayArea(0, 0, 1280, 720);
        App.mp.setSingleMedia(adObj.url);
        App.mp.refreshVideoDisplay();
        App.mp.playFromStart();
        self.Count()
      })
    } catch (e) { }
  },
  Count:function () {
    var self = this;
    // self.timer = setTimeout(function () {
    //   self.adObj.curDuration--;
    //   if (self.adObj.curDuration >= 0) {
    //     if (self.adObj.curDuration == 0) {
    //       self.handleJump()
    //     }
    //   }
    //   App.showAd(self.adObj)
    //   adPlay.Count()
    // }, 1000);
    self.timer = setInterval(function () {
      self.adObj.curDuration--;
      if (self.adObj.curDuration >= 0) {
        if (self.adObj.curDuration == 0) {
          debugger
          self.handleJump()
        }
      }
      App.showAd(self.adObj)
    }, 1000);
    showLog(self.adObj.curDuration)
  },
  handleJump(){
    var self = this;
    // clearTimeout(self.timer)
    // clearInterval(self.timer)
    self.stopTmExposureMonitor()
    showLog(adPlay.adObj.duration - adPlay.adObj.curDuration)
    debugger
    $('main').style.display = 'none'
    self.stopLivePlay()
    window.location.href = "/index.htm"
  },
  stopLivePlay :function () {
    showLog("stopLivePlay")
    clearTimeout(self.playTimer);
    //return;
    try {
      // DVB.stopAV(0);
      videoflag = 0;
      // media.video.setPosition(0, 0, 0, 0);
      // DVB.stopAV(0);
      App.mp.stop();
    } catch (e) {
    }
  },
  stopTmExposureMonitor:function(){
    showLog("stopTmExposureMonitor")
    var self = this
    self.tmExposureMonitorTimeArr.forEach(function(tmTime){
      if(tmTime>self.adObj.duration - self.adObj.curDuration){
        clearTimeout(tmTimer);
      }
    })
  },
}



