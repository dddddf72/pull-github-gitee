// console.log('global.js enter==')
// var globalEnvArr = 'globalEnvArr';

var Config = {
    serverUrl: 'http://10.9.216.12:8181/yezigou/',
    serverPicUrl: 'http://10.9.216.12:8181',
    browserType: 'common',
    serverTimeout: 10000,
    smartCard: function() {
        return systemInfo.getSmartCard() || '123'
    },
    getArea: function() {
        return getGlobalVar('area') || '40';
    },
};

var GlobalPath = (function() {
    var lastIndex = window.location.href.indexOf('/html');
    var prefix = './html/';
    if (lastIndex != -1) {
        prefix = window.location.href.substring(0, lastIndex + 1) + 'html/';
    }
    return {
        detailsUrl: prefix + 'product-detail.html',
        playUrl: prefix + 'play.html',
    }
})();


var systemInfo = {
    sc: 'CID',
    sn: 'STBID',
    mac: 'STBMAC',
    isEnable: function() {
        return typeof UtilityEx != 'undefined' && UtilityEx.getSystemInfo;
    },
    getSmartCard: function() {
        if (this.isEnable()) {
            UtilityEx.getSystemInfo(this.sc);
        }
    },
    getSID: function() {
        if (this.isEnable()) {
            UtilityEx.getSystemInfo(this.sn);
        }
    },
    getMac: function() {
        if (this.isEnable()) {
            UtilityEx.getSystemInfo(this.mac);
        }
    }
}


function setGlobalVar(_sName, _sValue) {
    if (typeof Utility != 'undefined' && Utility.setEnv) {
        Utility.setEnv(_sName, '' + _sValue);
        // Utility.setEnv(globalEnvArr, Utility.getEnv(globalEnvArr) + ',' + _sName);
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

var Carousel = function(parentId, data, defaultTime) {
    this.index = 0;
    this.eles = [];
    this.defaultTime = defaultTime || 3;
    this.time = this.defaultTime;
    this.timer = -1;
    this.data = data;
    this.length = data.length;
    this.init = function() {
        if (this.length == 0) return;
        $(parentId).html(this.data.reduce(function(con) {
            return con + '<div class="item"></div>'
        }, ''));
        this.eles = $(parentId).find('.item');
        this.focus();
        this.start();
    }

    this.focus = function() {
        $(parentId).prev('img').attr('src', this.data[this.index].pic);
        this.eles.eq(this.index).addClass('active');
    }

    this.blur = function() {
        this.eles.eq(this.index).removeClass('active');
    }

    this.start = function() {
        var self = this;
        clearInterval(this.timer);
        /*this.timer = setInterval(() => {
            this.blur();
            this.index = (this.index + this.length + 1 ) % this.length;
            this.focus();
            this.time = this.data[this.index].time * 1000;
        }, this.time);*/
        this.time = (this.data[this.index].time || this.defaultTime) * 1000;
        this.timer = setTimeout(function() {
            self.blur();
            self.index = (self.index + self.length + 1) % self.length;
            self.focus();
            self.start();
        }, this.time);
    }

    this.stop = function() {
        clearInterval(this.timer);
    }

    this.getIndex = function() {
        return this.index;
    }

    this.getCurrItem = function() {
        return this.data[this.index];
    }

    this.init();
};

/**
 * 日期对象格式化
 * y或Y：表示年份，当y为两位时，输出年份后两位，为四位时，输出完整的年份
 * M：表示月份
 * d：表示日期
 * h：表示小时
 * m：表示分钟
 * s：表示秒钟
 * w：表示星期
 * @param {Object} d 要进行格式化的Date对象
 * @param {String} formatter 格式字符串，形如“yyyy-MM-dd hh:mm:ss w”
 * @return {String} dateStr 格式化后的日期字符串
 */
function dateFormat(d, formatter) {
    if (!formatter || formatter == "") {
        formatter = "yyyy-MM-dd";
    }
    var weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

    var year = (d.getFullYear()).toString();
    var month = (d.getMonth() + 1).toString();
    var date = d.getDate().toString();
    var day = d.getDay();
    var hour = d.getHours().toString();
    var minute = d.getMinutes().toString();
    var second = d.getSeconds().toString();

    var yearMarker = formatter.replace(/[^y|Y]/g, '');
    if (yearMarker.length == 2) {
        year = year.substring(2, 4);
    } else if (yearMarker.length == 0) {
        year = "";
    }

    var monthMarker = formatter.replace(/[^M]/g, '');
    if (monthMarker.length > 1) {
        if (month.length == 1) {
            month = "0" + month;
        }
    } else if (monthMarker.length == 0) {
        month = "";
    }

    var dateMarker = formatter.replace(/[^d]/g, '');
    if (dateMarker.length > 1) {
        if (date.length == 1) {
            date = "0" + date;
        }
    } else if (dateMarker.length == 0) {
        date = "";
    }

    var hourMarker = formatter.replace(/[^h]/g, '');
    if (hourMarker.length > 1) {
        if (hour.length == 1) {
            hour = "0" + hour;
        }
    } else if (hourMarker.length == 0) {
        hour = "";
    }

    var minuteMarker = formatter.replace(/[^m]/g, '');
    if (minuteMarker.length > 1) {
        if (minute.length == 1) {
            minute = "0" + minute;
        }
    } else if (minuteMarker.length == 0) {
        minute = "";
    }

    var secondMarker = formatter.replace(/[^s]/g, '');
    if (secondMarker.length > 1) {
        if (second.length == 1) {
            second = "0" + second;
        }
    } else if (secondMarker.length == 0) {
        second = "";
    }

    var dayMarker = formatter.replace(/[^w]/g, '');
    var weekDay = "";
    if (dayMarker.length > 0) weekDay = weekdays[day];
    var dateStr = formatter.replace(yearMarker, year).replace(monthMarker, month).replace(dateMarker, date).replace(hourMarker, hour).replace(minuteMarker, minute).replace(secondMarker, second).replace(dayMarker, weekDay);
    return dateStr;
}


/**
 * 当字符串不足length位时，自动在右侧填充padding指定的字符串
 * @param str 需要处理的字符串
 * @param padding 用于填充的字符
 * @param length 字符串填充后的总长度
 * @returns {string | any} 进行填充处理后的结果
 */
function rightPadStr(str, padding, length) {
    str = str.toString();
    var s = str;

    for (var i = 0; i < length - str.length; i++) {
        s += padding;
    }
    return s;
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


/**
 * judge data type
 */

! function(window) {
    var objString = {}.toString;

    window.isSupportEs6 = function() {
        var arrowFunction = 'var a = () => {}';
        try {
            var fun = new Function(arrowFunction);
            fun();
            return true;
        } catch (e) {
            // console.log('*********not support es6!!!');
            return false;
        }
    }

    window.isArray = function() {
        var obj = arguments[0];
        if (window.isSupportEs6()) return Array.isArray(obj);
        else {
            return objString.call(obj) === '[object Array]';
        }
    }

    window.isNumber = function(num) {
        return objString.call(num) === '[object Number]';
    }

    window.isString = function(str) {
        return objString.call(str) === '[object String]';
    }

    window.isDate = function(date) {
        return objString.call(date) === '[object Date]';
    }

    window.isFunction = function(fun) {
        return objString.call(fun) === '[object Function]';
    }

    window.isObject = function(obj) {
        return objString.call(obj) === '[object Object]';
    }

    window.isEmptyObject = function(obj) {
        if (!window.isObject(obj)) return false;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
}(window);


/**
 *  support es6
 */

(function(global, factory) {
    var arrowFunction = 'var a = () => {}';
    try {
        var fun = new Function(arrowFunction);
        fun();

    } catch (e) {
        // console.log('*********not support es6!!!');
        factory(global);
    }


})(window, function(window) {
    if (!Object.assign) {
        Object.assign = function() {
            if (arguments.length <= 1) return arguments[0] || {};
            var source = arguments[0],
                i = 1;
            for (; i < arguments.length; i++) {
                for (var key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key)) {
                        source[key] = arguments[i][key];
                    }
                }
            }
            return source;
        }
    }

    if (!Array.from) {
        Array.from = function() {
            if (typeof arguments[0] == 'object') {
                return [].slice.call(arguments[0]);
            } else {
                return [];
            }
        }
    }

    if (![].find) {
        Array.prototype.find = function(fn) {
            for (var i = 0; i < this.length; i++) {
                if (fn(this[i], i)) return this[i];
            }
            return null;
        }
    }

    if (!''.includes) {
        String.prototype.includes = function(ele) {
            if (!ele) return false;
            return this.indexOf(ele) == -1 ? false : true;
        }
    }

    if (![].findIndex) {
        Array.prototype.findIndex = function(fn, thisArg) {
            var This = thisArg || this;

            for (var i = 0; i < this.length; i++) {
                if (fn.apply(This, [this[i], i, this])) return i;
            }
            return -1;
        }
    }
});