var Config = {
    monitorUrl: 'http://10.1.5.118:8080/',
    serverUrl: 'http://10.1.5.118:8080/GetFolderContents',
    // browserType: 'common',
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
        playTimer = setTimeout(function() {
            if (!mp) mp = new MediaPlayer();
            mp.setVideoDisplayMode(0);
            mp.setVideoDisplayArea(left, top, width, height);
            mp.setSingleMedia(url);
            mp.refreshVideoDisplay();
            mp.playFromStart();
        }, 500)
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
