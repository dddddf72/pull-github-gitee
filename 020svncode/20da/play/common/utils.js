/**
 * http请求
 * @param {Object} obj http参数
 * url: {String} http请求链接
 * timeout:{Number}  连接超时时间，单位毫秒
 * error: {Function} 请求失败回调
 * success: {Function} 请求成功回调
 */
var Ajax = function(obj) {
    this.url = obj.url; //服务端地址
    this.async = true; //是否采用异步发送，true为采用,false为不采用
    this.timeout = obj.time || 15000;
    this.ajaxTimer = -1;
    this.xhr = null;
    this.contentType = obj.contentType || 'text/xml';

    this.init = function() {
        this.xhr = new XMLHttpRequest() || new ActiveXObject('Microsoft.XMLHTTP');
        if (this.xhr) {
            var self = this;
            this.xhr.onreadystatechange = function() { //这里扩展ajax回调事件
                if (self.xhr.readyState == 4) {
                    clearTimeout(self.ajaxTimer);
                    if (self.xhr.status == 200) { // 请求成功
                        obj.success && obj.success(self.xhr.responseText);
                    } else {
                        obj.error && obj.error();
                    }
                }
            };
        }
    };

    this.get = function() {
        this.init();
        this.handTimeout();
        this.xhr.open('GET', this.url, this.async);
        this.xhr.send(null);
    };

    this.post = function(data) {
        this.init();
        this.handTimeout();
        this.xhr.open('POST', this.url, this.async);
        this.xhr.setRequestHeader('Content-type', this.contentType);
        this.xhr.send(data || null);
    };

    this.handTimeout = function() {
        var self = this;
        clearTimeout(this.ajaxTimer); // 网络差时做的超时处理
        this.ajaxTimer = setTimeout(function() {
            obj.error && obj.error();
            self.xhr.abort();
        }, this.timeout);
    };

    this.abort = function() {
        if (this.xhr) {
            clearTimeout(this.ajaxTimer);
            this.xhr.abort();
        }
    }
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