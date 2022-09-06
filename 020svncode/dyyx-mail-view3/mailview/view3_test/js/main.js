//http://10.9.219.35:8881/portalMS/admin.jsp
//api
var CONFIGS = {
  // ip: 'http://10.1.5.118:8080',//现网版本
  ip: 'http://10.9.218.102:8080',
  portalId: 1,
  // titleProviderId: 'coship',
  titleProviderId: 'aiqiyi',//开发说要加这个参数
  searchAssetId: '',
  // assetId: 'MANU50139',//现网版本
  assetId: 'MANU50127',
  smartCard: getSmartCard(),
  userId: getUserId(),
  serialNum: getSerialNum(),
}

var userId = '';
// var needShowLog = 1;//此时页面左上角有打印，方便打印输出
// // var needShowLog = 0;
// function showLogs (log) {
//   if (needShowLog == 1) {
//     var htmlIntent = ''
//     var debug = document.getElementById('conTLeft');
//     debug.style.display = "block";
//     htmlIntent += debug.innerHTML + '<div>' + log + '</div>'
//     debug.innerHTML = htmlIntent;
//   } else {
//     console.log("needShowLog=false")
//   }
// }

function getSmartCardId () {

  try {
    if (CA.card.cardId == "") {
      return "0";
    } else {
      return CA.card.cardId;
    }
  } catch (e) {
    return "0";
  }
}

function getUserId () {
  debugger
  // try {
    userId = getGlobalVar('userId');
    console.log('mainjs---getGlobalVar--userId'+getGlobalVar('userId'))
    if(userId == "undefined" || userId == "" || userId == null|| userId == ''||userId == undefined){
      debugger
      userId = 'maanshan'
    }
  // } catch (err) {
  // }
  console.log('main.js---userId'+userId)
  return userId ;//现网用88888888888888888，（之前）测试用8120010480205746，后来maanshan
  
}


function getSmartCard () {
  var smartCard = '';
  try {
    smartCard = Utility.getSystemInfo("SID");
  } catch (error) {

  }
  return smartCard || 8120010480205746;
}

function strToJson (str) {
  var json = (new Function("return " + str))();
  return json;
}
function getSerialNum () {//获取序列号
  try {
    if (hardware.STB.serialNumber == "") {
      return "coship";
    } else {
      return hardware.STB.serialNumber;
    }

    // if (window.navigator.userAgent == 'compatible:Coship cooca Webkit') {//智能盒子获取序列号
    //     if (hardware.STB.serialNumber == "") {
    //         return "coship";
    //     }else{
    //         var str = hardware.STB.serialNumber
    //         // return JSON.stringify(str).slice(1,str.length);
    //         return str.slice(1,str.length);
    //     }
    // }else{
    //     if (hardware.STB.serialNumber == "") {
    //         return "coship";
    //     }else{
    //         return hardware.STB.serialNumber;
    //     }
    //
    // }
  } catch (e) {
    return "coship";
  }

}

var API = {
  //获取分类
  'GetNav': function (data, success, error) {
    // console.log("GetNav的account：" + CONFIGS.userId)
    // showLogs("GetNav的account：" + CONFIGS.userId)//为空
    ajax({
      url: CONFIGS.ip + '/GetFolderContents?dataType=JSON',
      contentType: 'xml',
      // data: '<GetFolderContents  folderAssetId="" titleProviderId="' + CONFIGS.titleProviderId + '" assetId="' + data.id + '" portalId="' + CONFIGS.portalId + '" account="' + CONFIGS.userId + '" client="' + CONFIGS.smartCard + '" includeSubFolder="Y" includeSelectableItem="N" mergeTV="1" subIncludeSelectableItem="N" startAt="1" maxItems="10" />',
      // 开发说要加这个参数queryAssetIsOtt="Y"
      data: '<GetFolderContents  folderAssetId="" titleProviderId="' + CONFIGS.titleProviderId + '" assetId="' + data.id + '" portalId="' + CONFIGS.portalId + '" account="' + CONFIGS.userId + '" client="' + CONFIGS.smartCard + '" includeSubFolder="Y" includeSelectableItem="Y" mergeTV="1" subIncludeSelectableItem="Y" startAt="1" maxItems="10" queryAssetIsOtt="Y" />',
      // account="' + CONFIGS.userId + '" 
      success: function (dataset) {
        console.log('GetFolderContents--account'+CONFIGS.userId)
        var _data = JSON.parse(dataset);
        success && success(_data.childFolderList);
      },
      error: error,
    })
  },
  //获取首页推荐
  'GetRecList': function (data, success, error) {
    // console.log("GetRecList的account：" + CONFIGS.userId)
    // showLogs("GetRecList的account：" + CONFIGS.userId)
    ajax({
      url: CONFIGS.ip + '/GetAssociatedFolderContents?dataType=JSON',
      contentType: 'xml',
      data: '<GetAssociatedFolderContents quickId="' + data.id + '" targetLabel="R" queryAssetIsOtt="Y" startAt="1" maxItems="19" associatedType="1" portalId="' + CONFIGS.portalId + '" client="' + CONFIGS.smartCard + '" account="' + CONFIGS.userId + '" mergeTV="1"/>',
      success: function (dataset) {
        var _data = JSON.parse(dataset);
        success && success(_data.selectableItem);
      },
      error: error,
    })
  },
  //获取列表
  'GetList': function (data, success, error) {
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(function () {
      if (this.isfetching) {
        return false;
      }
      this.isfetching = true;
      var _this = this;
      ajax({
        url: CONFIGS.ip + '/GetFolderContents?dataType=JSON',
        contentType: 'xml',
        data: '<GetFolderContents folderAssetId="" titleProviderId="' + CONFIGS.titleProviderId + '" assetId="' + data.id + '" portalId="' + CONFIGS.portalId + '" account="' + CONFIGS.userId + '" client="' + CONFIGS.smartCard + '" includeSubFolder="Y" queryAssetIsOtt="Y" includeSelectableItem="Y" mergeTV="1" subIncludeSelectableItem="Y" startAt="' + ((data.page - 1) * data.pageSize + 1) + '" maxItems="' + data.pageSize + '" />',
        success: function (dataset) {
          _this.isfetching = false;
          var _data = JSON.parse(dataset);
          success && success(_data.selectableItemList, _data.totalResults);
        },
        error: error,
      })
    }, 300)
  },
  //搜索
  'GetSearch': function (data, success, error) {
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(function () {
      if (this.isfetching) {
        return false;
      }
      this.isfetching = true;
      var _this = this;
      ajax({
        url: CONFIGS.ip + '/SearchAction?dataType=JSON',
        contentType: 'xml',
        data: '<SearchAction keyword="' + data.keyword + '" keywordType="2" startAt="' + ((data.page - 1) * data.pageSize + 1) + '" maxItems="' + data.pageSize + '" portalId="' + CONFIGS.portalId + '" client="' + CONFIGS.smartCard + '" assetId="' + CONFIGS.assetId + '" account="' + CONFIGS.userId + '" mergeTV="1"><UserParams><FilterBoxes serviceType="VOD" genre="" year="" origin=""/></UserParams></SearchAction>',
        success: function (dataset) {
          _this.isfetching = false;
          var _data = JSON.parse(dataset);
          success && success(_data.selectableItem, _data.totalResults);
        },
        error: error,
      })
    }, 300)
  },
  //获取详情
  'GetDetail': function (data, success, error) {
    // console.log("GetDetail的account：" + CONFIGS.userId)
    // showLogs("GetDetail的account：" + CONFIGS.userId)
    ajax({
      url: CONFIGS.ip + '/GetItemData?dataType=JSON',
      contentType: 'xml',
      data: '<GetItemData queryAssetIsOtt="Y" titleAssetId="' + data.id + '" portalId="' + CONFIGS.portalId + '" account="' + CONFIGS.userId + '" client="' + CONFIGS.smartCard + '"/>',
      success: function (dataset) {
        var _data = JSON.parse(dataset);
        if (_data.selectableItem) {
          success && success(_data.selectableItem);
        } else {
          success && success({ isOver: true });
        }

      },
      error: error,
    })
  },
  //媒资包子集
  'GetFolderList': function (data, success, error) {
    ajax({
      url: CONFIGS.ip + '/GetFolderContents?dataType=JSON',
      contentType: 'xml',
      data: '<GetFolderContents assetId="' + data.id + '" portalId="' + CONFIGS.portalId + '" folderAssetId="" account="' + CONFIGS.userId + '" client="' + CONFIGS.smartCard + '" includeSubFolder="Y" includeSelectableItem="Y" mergeTV="1" includeFolderProperties="Y" subIncludeSelectableItem="Y"  startAt="' + ((data.page - 1) * data.pageSize + 1) + '" maxItems="' + data.pageSize + '" />',
      success: function (dataset) {
        var _data = JSON.parse(dataset);
        success && success(_data.selectableItemList, _data.totalResults);
      },
      error: error,
    })
  },
  //获取推荐
  'GetAssociaList': function (data, success, error) {
    // console.log("GetAssociaList的account：" + CONFIGS.userId)
    // showLogs("GetAssociaList的account：" + CONFIGS.userId)
    ajax({
      url: CONFIGS.ip + '/GetAssociatedFolderContents?dataType=JSON',
      contentType: 'xml',
      data: '<GetAssociatedFolderContents quickId="' + data.id + '" folderAssetId="' + CONFIGS.assetId + '" targetLabel="A" queryAssetIsOtt="Y" startAt="1" maxItems="6" portalId="1" associatedType="1" account="' + CONFIGS.userId + '" client="' + CONFIGS.smartCard + '" mergeTV="1"/>',
      success: function (dataset) {
        var _data = JSON.parse(dataset);
        success && success(_data.selectableItem);
      },
      error: error,
    })
  },
  //收藏
  'AddBookmark': function (data, success, error) {
    ajax({
      url: CONFIGS.ip + '/AddBookmark?dataType=JSON',
      contentType: 'xml',
      data: '<AddBookmark titleAssetId="' + data.id + '" folderAssetId="' + CONFIGS.assetId + '" custom="VOD" portalId="' + CONFIGS.portalId + '" account="' + CONFIGS.userId + '" client="' + CONFIGS.smartCard + '" />',
      success: function (dataset) {
        var _data = JSON.parse(dataset);
        success && success(_data);
      },
      error: error,
    })
  },
  //取消收藏
  'DeleteBookmark': function (data, success, error) {
    ajax({
      url: CONFIGS.ip + '/DeleteBookmark?dataType=JSON',
      contentType: 'xml',
      data: '<DeleteBookmark titleAssetId="' + data.id + '" custom="VOD" portalId="' + CONFIGS.portalId + '" account="' + CONFIGS.userId + '" client="' + CONFIGS.smartCard + '" />',
      success: function (dataset) {
        var _data = JSON.parse(dataset);
        success && success(_data);
      },
      error: error,
    })
  },
  //获取收藏列表
  'GetBookmarks': function (data, success, error) {
    ajax({
      url: CONFIGS.ip + '/GetBookmarks?dataType=JSON',
      contentType: 'xml',
      data: '<GetBookmarks startAt="' + ((data.page - 1) * data.pageSize + 1) + '" maxItems="' + data.pageSize + '" columnId="' + CONFIGS.assetId + '" portalId="' + CONFIGS.portalId + '" account="' + CONFIGS.userId + '" client="' + CONFIGS.smartCard + '"/>',
      success: function (dataset) {
        var _data = JSON.parse(dataset);
        success && success(_data.bookmarkedItem, _data.totalResults);
      },
      error: error,
    })
  },
  //获取历史记录
  'GetHistorys': function (data, success, error) {
    // console.log("GetHistorys取的account的值：" + CONFIGS.userId)//为空
    ajax({
      url: CONFIGS.ip + '/GetHistorys?dataType=JSON',
      contentType: 'xml',
      data: '<GetHistorys startAt="' + ((data.page - 1) * data.pageSize + 1) + '" maxItems="' + data.pageSize + '" columnId="' + CONFIGS.assetId + '" portalId="' + CONFIGS.portalId + '" account="' + CONFIGS.userId + '" client="' + CONFIGS.smartCard + '"/>',
      success: function (dataset) {
        var _data = JSON.parse(dataset);
        success && success(_data.historyItem, _data.totalResults);
      },
      error: error,
    })
  },

  //获取续看信息
  'CheckSavedProgram': function (data, success, error) {
    var ID = data.isTV ? 'folderAssetId' : 'assetId';
    ajax({
      url: CONFIGS.ip + '/CheckSavedProgram?dataType=JSON',
      contentType: 'xml',
      data: '<CheckSavedProgram ' + ID + '="' + data.id + '" portalId="' + CONFIGS.portalId + '" account="' + CONFIGS.userId + '" client="' + CONFIGS.smartCard + '" profile="1.0"/>',
      success: function (dataset) {
        var _data = JSON.parse(dataset);
        success && success(_data);
      },
      error: error,
    })
  },

  //节目鉴权
  'ValidatePlayEligibility': function (data, success, error) {
    ajax({
      url: CONFIGS.ip + '/ValidatePlayEligibility?dataType=JSON',
      contentType: 'xml',
      // data: '<ValidatePlayEligibility assetId="' + data.id + '"   portalId="' + CONFIGS.portalId + '" account="' + getSerialNum() + '" client="' + CONFIGS.smartCard + '" isColumnAuth="' + data.isColumnAuth + '"/>',
      data: '<ValidatePlayEligibility assetId="' + data.id + '"   portalId="' + CONFIGS.portalId + '" account="' + CONFIGS.serialNum + '" client="' + CONFIGS.smartCard + '" isColumnAuth="' + data.isColumnAuth + '"/>',
      success: function (dataset) {
        var _data = JSON.parse(dataset)

        success && success(_data);
      },
      error: error,
    })
  },

  //退出记录播放时间
  'SetResumePoint': function (data, success, error) {
    ajax({
      url: CONFIGS.ip + '/SetResumePoint?dataType=JSON',
      contentType: 'xml',
      data: '<SetResumePoint assetId="' + data.id + '" portalId="' + CONFIGS.portalId + '" resumePointDisplay="' + data.resumePointDisplay + '" account="' + CONFIGS.userId + '" client="' + CONFIGS.smartCard + '"/>',
      success: function (dataset) {
        var _data = JSON.parse(dataset);
        success && success(_data);
      },
      error: error,
    })
  },
  //播放结束删除书签
  'DeleteSavedProgram': function (data, success, error) {
    ajax({
      url: CONFIGS.ip + '/DeleteSavedProgram?dataType=JSON',
      contentType: 'xml',
      data: '<DeleteSavedProgram assetId="' + data.id + '" providerId="' + data.providerId + '" folderAssetId="' + data.folderAssetId + '"  portalId="' + CONFIGS.portalId + '"  account="' + CONFIGS.userId + '" client="' + CONFIGS.smartCard + '"/>',
      success: function (dataset) {
        var _data = JSON.parse(dataset);
        success && success(_data);
      },
      error: error,
    })
  },


  //获取播放串
  'GetPlayUrl': function (data, success, error) {
    ajax({
      url: CONFIGS.ip + '/getPlayURL?dataType=JSON',
      contentType: 'xml',
      data: JSON.stringify({
        "userCode": CONFIGS.serialNum,//现网用serialNum，（之前）测试用userId
        "userName": CONFIGS.smartCard,
        "providerID": data.providerId,
        "assetID": data.id,
        "folderAssetId": data.folderAssetId,
        "resourceCode": "",
        "version": "1.2.24",
        "terminalType": 7,
        "resolution": "1024*768",
        "fmt": "1",
        "playType": "1",
        "shifttime": "0",
        "shiftend": "0",
        "delay": "0",
        "deviceName": "iPad4,1",
        "subID": "5046",
        "productCode": "0000002",
        //"areaCode":areaCode
      }),
      success: function (dataset) {
        var _data = JSON.parse(dataset);
        // bool = !bool;
        //var playUrl = bool? 'http://10.9.219.23:6666/vod/YZGD,TWSX1543023693284501.m3u8?fmt=x264_-1k_mpegts':'http://10.9.217.32/1.ts';
        var playUrl = "";
        var _playUrl = _data.palyURL;
        var runTime = parseInt(_data.displayRunTime);
        if (!_playUrl) {
          showMessage(_data.retInfo);
        } else {
          playUrl = _playUrl;
        }
        var obj = {
          playUrl: _playUrl,
          AdInfoList: _data.AdInfoList || [],
          runTime: runTime
        }

        //showMessage(playUrl);
        success && success(obj);
      },
      error: error,
    })
  },
}
