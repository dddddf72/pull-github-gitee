var Config = {
    //monitorUrl: 'http://10.1.5.118:8080/',
    monitorUrl: 'http://10.9.218.102:8080/',
    browserType: 'common',
};

var ThirdPath = {
    //有事好商量
    'yshsl': 'http://172.20.20.16:28888/gaoyou-master/html/yshsl.html?id=472&title=%E6%9C%89%E4%BA%8B%E5%A5%BD%E5%95%86%E9%87%8F',
    //智慧残联
    'zhcl': 'http://172.20.20.2:8080/SPSmartCMS/index.jhtml',
    //电影院线 最新院线
    'dyyx': 'http://172.20.224.223:8096/page_template/category_theaterIndex.html?category=1089196',
    //学霸宝盒
    'xbbh': 'http://172.31.222.3/webapp_v2/xlzq/player_vod_page.html?nns_video_id=5f60219d311003a65a5b5fefaedf33c6&nns_time=0&nns_media_asset_id=tbkt_kxdyk&nns_category_id=1000001&bg_src=images%2Flist_page%2Flist_bg.jpg&nns_user_id=test-11-12',
    //热播追剧
    'rbzj': 'http://172.20.224.18/page_template/list_ymtgqVideo1.html?categoryId=567719&remark=dsj&random=0.17046859524070768&version=vod',
    //孝乐神州
    'xlsz': 'http://172.31.222.3/webapp_v2/xlzq/index.html',
    //名师空中课堂
    'kzkt': ' http://172.31.183.147:8080/webapp_v2/tbkt/index.html',
    //文旅在线
    'wlzx': 'http://172.20.20.16:28888/gaoyou-master/index.html?index=6',
    //http://10.9.212.22/%E5%89%8D%E7%AB%AF/%E4%BB%8A%E6%97%A5%E9%AB%98%E9%82%AE/code/portal/index.html?index=6

};

var $ = function(id) {
    return document.getElementById(id);
};

function isAndroid() {
    return window.navigator.userAgent.toLowerCase().indexOf('android') > -1;
}

var globalEnvArr = 'Global_Env_Arr';

function setGlobalVar(_sName, _sValue) {
    if (typeof Utility != 'undefined' && Utility.setEnv) {
        Utility.setEnv(_sName, '' + _sValue);
        Utility.setEnv(globalEnvArr, Utility.getEnv(globalEnvArr) + ',' + _sName);
    } else if (window.localStorage) {
        localStorage[_sName] = _sValue;
    } else {
        document.cookie = escape(_sName) + "=" + escape(_sValue);
    }
}

function getGlobalVar(_sName) {
    var result = "";
    if (typeof Utility != 'undefined' && Utility.getEnv) {
        result = Utility.getEnv(_sName)
    } else if (window.localStorage) {
        result = localStorage.getItem(_sName);
    } else {
        var aCookie = document.cookie.split("; ");
        for (var i = 0; i < aCookie.length; i++) {
            var aCrumb = aCookie[i].split("=");
            if (escape(_sName) == aCrumb[0]) {
                result = unescape(aCrumb[1]);
                break;
            }
        }
    }
    return result;
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

function preventDefault(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    return false;
}

function hasClass(obj, className) {
    return obj.className.indexOf(className) > -1 ? true : false;
}

function addClass(obj, className) {
    if (hasClass(obj, className) || !obj) return;
    if (obj.classList) {
        obj.classList.add(className);
    } else {
        obj.className += ' ' + className;
    }
}

function removeClass(obj, className) {
    if (hasClass(obj, className)) {
        var newClass = obj.className.replace(className, "");
        obj.className = newClass.replace(/(^\s*)/g, "");
    }
}


function getURLParameter(_text) {
    var ret = (new RegExp("[\\?&]" + _text + "=([^&#]*)")).exec(location.search);
    return ret ? ret[1] : "";
}

function showLog(log) {
    if (!$('debug')) {
        var debug = document.createElement('div');
        debug.id = 'debug';
        debug.style.cssText = 'position: absolute;top: 40px;left: 40px; color: yellow;z-index: 2222';
        document.body.appendChild(debug);
    }
    $('debug').innerHTML = $('debug').innerHTML + '<br/>' + log;
}



var playTimer;
var mp = null;

function setLivePlay(url, liveObj) {
    clearTimeout(playTimer);
    try {
        var left = liveObj.x;
        var top = liveObj.y;
        var width = liveObj.w;
        var height = liveObj.h;
        // playTimer = setTimeout(function() {
        if (!mp) mp = new MediaPlayer();
        mp.setVideoDisplayMode(0);
        mp.setVideoDisplayArea(left, top, width, height);
        mp.setSingleMedia(url);
        mp.refreshVideoDisplay();
        mp.playFromStart();
        // }, 500)
    } catch (e) {}
}

function stopLivePlay() {
    clearTimeout(playTimer);
    try {
        mp.stop();
    } catch (e) {

    }
}

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