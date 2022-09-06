function $ (id) {
  return document.getElementById(id);
}

function hasClass (obj, className) {
  return obj.className.indexOf(className) > -1 ? true : false;
}

function addClass (obj, className) {
  if (hasClass(obj, className) || !obj) return;
  if (obj.classList) {
    obj.classList.add(className);
  } else {
    obj.className += ' ' + className;
  }
  // if(className == "show"){
  //   var res = obj.getElementsByTagName("div")
  //   for(var i=0;i<res.length;i++){
  //     if (hasClass(res[i], className) || !res[i]) return;
  //     if (res[i].classList) {
  //       res[i].classList.add(className);
  //     } else {
  //       res[i].className += ' ' + className;
  //     }
  //   }
  // }
}

function removeClass (obj, className) {
  if (hasClass(obj, className)) {
    var newClass = obj.className.replace(className, "");
    obj.className = newClass.replace(/(^\s*)/g, "");
  }
  // if(className == "show"){
  //   var res = obj.getElementsByTagName("div")
  //   for(var i=0;i<res.length;i++){
  //     if (hasClass(res[i], className)) {
  //         var newClass = res[i].className.replace(className, "");
  //         res[i].className = newClass.replace(/(^\s*)/g, "");
  //     }
  //   }
  // }
}

function isUtility () {
  try {
    return !!Utility;
  } catch (e) {
    return false;
  }
}

String.prototype.clip = function (n) {//中英文混合截取子字符串
  showLog('show...')
  var r = /[^\x00-\xff]/g;
  if (this.replace(r, "mm").length <= n) return this;
  var m = Math.floor(n / 2);
  for (var i = m; i < this.length; i++) {
    if (this.substr(0, i).replace(r, "mm").length >= n) { return this.substr(0, i) + "..."; }
  }
  return this;
}

String.prototype.len = function () {
  return this.replace(/[^\x00-\xff]/g, "rr").length;
}

//ajax封装
function ajax (obj) {
  if (!obj.url)
    return;
  var xmlhttp = new XMLHttpRequest() || new ActiveXObject('Microsoft.XMLHTTP');    //这里扩展兼容性
  var type = (obj.type || 'POST').toUpperCase();
  xmlhttp.onreadystatechange = function () {    //这里扩展ajax回调事件
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200 && !!obj.success)
      obj.success(xmlhttp.responseText);
    if (xmlhttp.readyState == 4 && xmlhttp.status != 200 && !!obj.error) {
      obj.error();
    }
  };
  if (type == 'POST') {
    xmlhttp.open(type, obj.url, obj.async || true);
    if (obj.contentType == 'xml') {
      xmlhttp.setRequestHeader('Content-type', 'content-type:text/plain');
      xmlhttp.send(obj.data);
    } else if (obj.contentType == 'json') {
      xmlhttp.setRequestHeader('Content-type', 'application/json');
      xmlhttp.send(_params(obj.data || null));
    } else {
      xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xmlhttp.send(_params(obj.data || null));
    }
  }
  else if (type == 'GET') {
    xmlhttp.open(type, obj.url + (obj.data ? ('?' + _params(obj.data || null)) : ''), obj.async || true);
    xmlhttp.send(null);
  }
}
//_params函数解析发送的data数据，对其进行URL编码并返回
function _params (data, key) {
  var params = '';
  key = key || '';
  var type = { 'string': true, 'number': true, 'boolean': true };
  if (type[typeof (data)])
    params = data;
  else
    for (var i in data) {
      if (type[typeof (data[i])])
        params += "&" + key + (!key ? i : ('[' + i + ']')) + "=" + data[i];
      else
        params += _params(data[i], key + (!key ? i : ('[' + i + ']')));
    }
  return !key ? encodeURI(params).replace(/%5B/g, '[').replace(/%5D/g, ']') : params;
}



//forEach
if (typeof Array.prototype.forEach != "function") {
  Array.prototype.forEach = function (fn, context) {
    for (var k = 0, length = this.length; k < length; k++) {
      if (typeof fn === "function" && Object.prototype.hasOwnProperty.call(this, k)) {
        fn.call(context, this[k], k, this);
      }
    }
  };
}

//filter
if (typeof Array.prototype.filter != "function") {
  Array.prototype.filter = function (fn, context) {
    var arr = [];
    if (typeof fn === "function") {
      for (var k = 0, length = this.length; k < length; k++) {
        fn.call(context, this[k], k, this) && arr.push(this[k]);
      }
    }
    return arr;
  };
}

//左
function moveLeft () {
  document.onkeydown({ keyCode: 37 });
}
//上
function moveUp () {
  document.onkeydown({ keyCode: 38 });
}
//右
function moveRight () {
  document.onkeydown({ keyCode: 39 });
}
//下
function moveDown () {
  document.onkeydown({ keyCode: 40 });
}
//ok
function doConfirm () {
  document.onkeydown({ keyCode: 13 });
}
//返回
function keyBack () {
  document.onkeydown({ keyCode: 8 });
}

function setGlobalVar (_sName, _sValue) {
  console.log("baseJs_setGlobalVar" + _sName + "：" + _sValue)
  try {
    _sValue = _sValue + "";
    iPanel.setGlobalVar(_sName, _sValue);
  } catch (e) {
    if (window.localStorage) {
      localStorage[_sName] = _sValue;
    } else {
        document.cookie = escape(_sName) + "=" + escape(_sValue);
    }
  }
}
function getGlobalVar (_sName) {
  var result = "";
  try {
    result = iPanel.getGlobalVar(_sName);
    if (result == "undefined") {
      result = "";
    }
  } catch (e) {
    if (window.localStorage) {
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
  }
  // console.log("baseJs_getGlobalVar" + _sName + "：" + result)
  return result;
}

function parseStrObjByRegExp (strDes) {
  var obj = {};
  if (strDes) {
    strDes.replace(/(\w+)(?:=([^&]*))?/g, function (str, key, value) {
      if (value === "true") {
        obj[key] = true;
      } else if (value === "false" || value === "undefined") {
        obj[key] = false;
      } else {
        obj[key] = value;
      }
    });
  }
  return obj;
}

function showMessage (txt) {
  this.timer && clearTimeout(this.timer);
  var oDiv = document.getElementById('messageInfo');
  if (!oDiv) {
    oDiv = document.createElement('div');
    oDiv.className = 'messageInfo';
    oDiv.id = 'messageInfo';
    document.body.appendChild(oDiv);
  }
  oDiv.innerHTML = txt;
  oDiv.offsetWidth;
  //document.getElementById("messageInfo").style.left = 640-oDiv.offsetWidth/2 +'px';
  // if(oDiv.offsetWidth==553){
  //     addClass(oDiv, 'longerLength')//left: 32%;
  // }else if(oDiv.offsetWidth==270){
  //     // left: 39.47%;
  //     addClass(oDiv, 'shorterLength')
  // }else if(oDiv.offsetWidth==300){
  //     addClass(oDiv, 'left8Length')//left: 490px;
  // }

  addClass(oDiv, 'show');
  this.timer = setTimeout(function () {
    removeClass(oDiv, 'show');
  }, 2000)
}
