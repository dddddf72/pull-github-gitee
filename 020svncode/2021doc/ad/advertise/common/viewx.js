var View = (function() {
    "use strict"

    //公共组件
    function View(A) {
        this.isfocus = false; //区域焦点
        this.parentNode = A; //区域Dom
        this.a = []; //子元素
        this.map = []; //映射位置关系之后的子元素
        this.scrollX = false; //横向是否滚动
        this.scrollY = false; //纵向向是否滚动
        this.passageType = true; //是否为文章类型
        this.saveCurrent = false; //保存当前current
        this.saveCurrentDelay = false; //保存当前current，点击ok后保存
        this.scrollAnimate = false; //是否强制开启启动滚动动画(如果不支持会启用插件滚动)
        this.context = this;
    }

    //初始化
    View.prototype.init = function(a, index) {
      // debugger//加载区域内数据
        if (a.length > 0) {
            this.passageType = false;
            this.a = isArray(a) ? a : Array.prototype.slice.call(a);
            this.map = sort(a);
            this.focusId = typeof index == 'undefined' ? getFirst(this.map, this.a) : Number(index);//view.js 456
        } else {
            this.passageType = true;
        }
        this.scrollX = this.parentNode.scrollWidth > this.parentNode.offsetWidth;
        this.scrollY = this.parentNode.scrollHeight > this.parentNode.offsetHeight;
        this.parentNode.style.top = 0;
        this.parentNode.style.left = 0;
        // showLog(this.parentNode.scrollHeight + '=' + this.parentNode.offsetHeight)
        /*var This = this;
        this.parentNode.onclick = function (ev) {
            var pre = This.focusId;
            var index = This.a.findIndex(function (el) {
                return el.contains(ev.target);
            })
            if (index >= 0) {
                This.focusByIndex(index);
                This.onkey('ok');
                //This.onkeyUp('ok');
                This.move && This.move(This.a[pre], This.a[index]);
            } else {
                This.onfocus();
            }
        }*/
    }
    View.prototype.setContext = function(obj) {
      // debugger
        this.context = obj;
    }

    View.prototype.setIndex = function(index) {
      // debugger
        if (typeof index == 'undefined') return;
        this.focusId = Number(index);
        scroll.apply(this);
    }

    //insertAfter
    View.prototype.insertAfter = function (a) {
      // debugger
        this.a = this.a.concat(isArray(a) ? a : Array.prototype.slice.call(a));
        this.map = sort(this.a);
        this.scrollX = this.parentNode.scrollWidth > this.parentNode.offsetWidth;
        this.scrollY = this.parentNode.scrollHeight > this.parentNode.offsetHeight;
        //this.onfocus();
    }

    //insertBefore
    View.prototype.insertBefore = function (a) {
      // debugger
        this.a = Array.prototype.slice.apply(a).concat(this.a);
        this.map = sort(this.a);
        //this.focusId = getfocusId(this.focusItem(),this.a);
        this.focusId += a.length;
        this.scrollX = this.parentNode.scrollWidth > this.parentNode.offsetWidth;
        this.scrollY = this.parentNode.scrollHeight > this.parentNode.offsetHeight;
        //this.onfocus();
    }

    //焦点dom
    View.prototype.focusItem = function () {
        return this.a[this.focusId];
    }

    //区域聚焦
    View.prototype.onfocus = function () {
      debugger//第九步  
        if (window.focusView) {
            window.focusView.onblur();//区域失焦  View.prototype.onblur
        }
        window.focusView = this;
        this.isfocus = true;
        addClass(this.parentNode, 'focus');
        if (this.saveCurrentDelay && this.currentItem) {
            this.focusById(this.currentItem.id);
        }
        this.focus();//view.js  265//第十步
    }

    //区域失焦
    View.prototype.onblur = function () {//第四步//进入第五步View.prototype.blur  此时再次进入，是第七步
      debugger
        this.isfocus = false;
        removeClass(this.parentNode, 'focus');
        this.blur(true)
    }

    //区域内移动
    View.prototype.onkey = function (action) {
      debugger//第一步
        if (action === 'ok' && !this.passageType) {
            if (this.currentItem === this.focusItem()) {
                this.isCurrent = true;
            } else {
                this.isCurrent = false;
                if (this.currentItem) {
                    removeClass(this.currentItem, 'current');
                }
                this.currentItem = this.focusItem();

                addClass(this.focusItem(), 'current');
            }
            this.ok && this.ok.call(this.context, this.focusItem());
            return;
        }

        if (action === 'back') {
            if (this.back) {
                this.back.apply(this.context, [this.focusItem()]);
            } else {
                history.go(-1);
            }
            return;
        }
        var next = true;
        if (this.passageType) {
            next = false;
        } else {
            next = this.map[this.focusId][action];
            // console.log('focusId:', this.focusId);

        }
        if (next) {
            // console.log('区域内移动焦点');
            //区域内移动焦点
            this.blur(true);//view.js 285
            var _ = this.focusItem();//view.js  86
            debugger
          
            // 生活定位到左边第一个栏目
            // if(window.location.href.split("?")[0].split("html/") && window.location.href.split("?")[0].split("html/")[1] == "list-vc.html"){
            //   if (this.focusId == 1 && action === 'down') {
            //       this.focusId = 5;
            //   } else {
            //       this.focusId = next.index;
            //   } }else{this.focusId = next.index;}
              this.focusId = next.index;
              // console.log('focusId:', this.focusId);
            //监控移动操作
            if (this.move && this.move.apply(this.context, [_, this.focusItem()])) {

            } else {
                this.focus();//view.js  265
            }
        } else {
            // console.log('区域边界');//在list-vc页面需要这部分
            if(this.focusId ==12 && action === 'up'){
              this.blur(true)
              this.focusId=0;
              this.focus()
            }
            if(window.location.href.split("?")[0].split("html/") && window.location.href.split("?")[0].split("html/")[1] == "list-vc.html"){
              if (this.index == 0) {
                  FocusInfo.area = this._area;
                  this.focusObj.focusByIndex(this.index);
              } else if (this.index == 1) {
                  this.focusId = 1;
              } }
            //区域边界
            if (this[action] && action !== 'ok') {
                //this.onblur();
                this[action].call(this.context, this.focusItem());//第三步，此时进入View.prototype.focusItem 第四步View.prototype.onblur
            } else {
                if (!this.passageType && action == 'left' || action == 'up' || action == 'right' || action == 'down') {
                    var THIS = this;
                    addClass(this.focusItem(), 'shake');
                    this.shaketimer && clearTimeout(this.shaketimer);
                    this.shaketimer = setTimeout(function() {
                        removeClass(THIS.focusItem(), 'shake');
                    }, 300);
                }
            }
            if (this.passageType) {
                //边界滚动
                if (this.scrollX) {
                    //滚动
                    if (action == 'left') {
                        if (this.scrollAnimate) {
                            this.parentNode.scrollBy({ left: -100, behavior: 'smooth' })
                        } else {
                            this.parentNode.scrollLeft -= 100;
                        }
                    }
                    if (action == 'right') {
                        if (this.scrollAnimate) {
                            this.parentNode.scrollBy({ left: 100, behavior: 'smooth' })
                        } else {
                            this.parentNode.scrollLeft += 100;
                        }
                    }
                }
                if (this.scrollY) {
                    //滚动
                    if (action == 'up') {
                        if (this.scrollAnimate) {
                            this.parentNode.scrollBy({ top: -100, behavior: 'smooth' })
                        } else {
                            this.parentNode.scrollTop -= 100;
                        }
                    }
                    if (action == 'down') {
                        if (this.scrollAnimate) {
                            this.parentNode.scrollBy({ top: 100, behavior: 'smooth' })
                        } else {
                            this.parentNode.scrollTop += 100;
                        }
                    }
                    this.scroll && this.scroll.apply(this.context);
                }
            } else {
                if (this.scrollX) {
                    //滚动
                    if (action == 'left') {
                        if (this.scrollAnimate) {
                            this.parentNode.scroll({ left: 0, behavior: 'smooth' })
                        } else {
                            this.parentNode.scrollLeft = 0;
                        }
                    }
                    if (action == 'right') {
                        if (this.scrollAnimate) {
                            this.parentNode.scroll({ left: this.parentNode.scrollWidth, behavior: 'smooth' })
                        } else {
                            this.parentNode.scrollLeft = this.parentNode.scrollWidth;
                        }
                    }
                }
                if (this.scrollY) {
                    //滚动
                    if (action == 'up') {
                        if (this.scrollAnimate) {
                            this.parentNode.scroll({ top: 0, behavior: 'smooth' })
                        } else {
                            this.parentNode.scrollTop = 0;
                        }
                    }
                    if (action == 'down') {
                        if (this.scrollAnimate) {
                            this.parentNode.scroll({ top: this.parentNode.scrollHeight, behavior: 'smooth' })
                        } else {
                            this.parentNode.scrollTop = this.parentNode.scrollHeight;
                        }
                    }
                }
            }
        }
    }

    //区域内聚焦
    View.prototype.focus = function () {
      debugger//第八步  //第十一步
        if (!this.isfocus) {
            this.onfocus();//view.js  92
        }
        if (this.passageType) {
            return false;
        }
        scroll.apply(this);
        debugger

        addClass(this.focusItem(), 'focus');//view.js 86
        if (this.eleFocus) this.eleFocus.call(this.context, this.focusItem());
        if (this.saveCurrent) {
            removeClass(this.focusItem(), 'current');
        }
    }


    //区域内失焦
    View.prototype.blur = function (bool) {//第五步
      debugger
        if (this.passageType) {
            removeClass(this.parentNode, 'focus');
            return false;
        }
        removeClass(this.focusItem(), 'focus');//view.js 86
        if (this.eleBlur) this.eleBlur.call(this.context, this.focusItem());
        if (!bool && this.saveCurrent) {
            addClass(this.focusItem(), 'current');
        }
    }

    //focusById
    View.prototype.focusById = function (id) {
      // debugger
        var index = this.focusId;
        this.blur(true);
        this.a.forEach(function(el, i) {
            if (el.id == id) {
                index = i;
            }
        })
        this.focusId = index;
        this.focus();
        return index;
    }

    //focusByIndex
    View.prototype.focusByIndex = function (index) {
      debugger
        this.blur(true);//view.js 285//第六步
        this.focusId = index;
        this.focus();//view.js  265
    }
    return View;

    function scroll() {
        if (this.scrollX || this.scrollY) {
          debugger
            //滚动
            var node = this.focusItem();
            var offsetTop = node.offsetTop;
            var offsetHeight = node.offsetHeight;
            var nodeMarginHeight = parseInt(getComputedStyle(node, null).marginBottom) + parseInt(getComputedStyle(node, null).marginTop);
            var nodeMarginWidth = parseInt(getComputedStyle(node, null).marginLeft) + parseInt(getComputedStyle(node, null).marginRight)
            var scrollTop = this.parentNode.scrollTop;
            var scrollHeight = this.parentNode.offsetHeight;
            var offsetLeft = node.offsetLeft;
            var offsetWidth = node.offsetWidth;
            var scrollLeft = this.parentNode.scrollLeft;
            var scrollWidth = this.parentNode.offsetWidth;
            var X = offsetLeft + 50 <= scrollLeft || offsetLeft + offsetWidth + 50 >= scrollLeft + scrollWidth;
            var Y = offsetTop - 50 <= scrollTop || offsetTop + offsetHeight + 50 >= scrollTop + scrollHeight;
            //alert('X:'+X+'Y:'+Y+'scrollY:'+this.scrollY)
            if (this.scrollY) {
                if (this.scrollAnimate) {
                    this.parentNode.scroll({ top: offsetTop - (scrollHeight - offsetHeight) * .5, behavior: 'smooth' })
                } else {
                    //this.parentNode.scrollTop = offsetTop - (scrollHeight - offsetHeight) * .5;
                    //this.parentNode.scrollTop = 100
                    // console.log(this.parentNode.scrollHeight)
                    var top = this.parentNode.scrollHeight - this.parentNode.offsetHeight < offsetTop - (this.parentNode.offsetHeight - offsetHeight - nodeMarginHeight) * .5 ? this.parentNode.scrollHeight - this.parentNode.offsetHeight : offsetTop - (this.parentNode.offsetHeight - offsetHeight - nodeMarginHeight) * .5;
                    // var top = offsetTop - (scrollHeight - offsetHeight);
                    this.parentNode.style.top = top > 0 ? (-top + 'px') : '0px';
                    // showMessage(offsetTop+'-'+this.parentNode.offsetHeight+'-'+offsetHeight)
                }
            } else if (this.scrollX) {
                if (this.scrollAnimate) {
                    this.parentNode.scroll({ left: offsetLeft - (scrollWidth - offsetWidth) * .5, behavior: 'smooth' })
                } else {
                    // var left = offsetLeft - (720 - offsetWidth) * .5;
                    var left = this.parentNode.scrollWidth - this.parentNode.offsetWidth < offsetLeft - (this.parentNode.offsetWidth - offsetWidth - nodeMarginWidth) * .5 ? this.parentNode.scrollWidth - this.parentNode.offsetWidth : offsetLeft - (this.parentNode.offsetWidth - offsetWidth - nodeMarginWidth) * .5;
                    // console.log(top)
                    this.parentNode.style.left = left > 0 ? (-left + 'px') : '0px';
                    //this.parentNode.scrollLeft = offsetLeft - (scrollWidth - offsetWidth) * .5;
                }
            } else {
                if (this.scrollAnimate) {
                    this.parentNode.scroll({
                        top: offsetTop - (scrollHeight - offsetHeight) * .5,
                        left: offsetLeft - (scrollWidth - offsetWidth) * .5,
                        behavior: 'smooth'
                    })
                } else {
                    this.parentNode.scrollLeft = offsetLeft - (scrollWidth - offsetWidth) * .5;
                    this.parentNode.scrollTop = offsetTop - (scrollHeight - offsetHeight) * .5;
                }
            }
        }
    }

    //位置算法
    function sort(doms) {
      debugger
        var obj = [];
        var map = [];
        var len = doms.length;
        for (var i = 0; i < len; i++) {
            var el = doms[i];
            if (el.getAttribute("disabled")) {
                //跳过disabled
                obj.push({});
            } else {
                var x = 0,
                    y = 0,
                    ele = el;
                while (hasClass(ele.parentNode, 'viewParent')) {
                    x += ele.parentNode.offsetLeft;
                    y += ele.parentNode.offsetTop;
                    ele = ele.parentNode;
                }
                obj.push({
                    index: i,
                    cellX: x + el.offsetLeft,
                    cellY: y + el.offsetTop,
                    width: el.offsetWidth,
                    height: el.offsetHeight,
                });
            }
        }
        for (var j = 0; j < len; j++) {
            var item = obj[j];
            var X = item.cellX;
            var Y = item.cellY;
            var W = item.width;
            var H = item.height;
            //(Math.pow(a.cellX+a.width/2-a.cellX-b.width/2,2)+Math.pow(a.cellY+a.height/2-a.cellY-b.height/2,2))
            var Right = obj.filter(function(el) {
                return (el.cellX >= X + W) && (el.cellY >= Y && el.cellY <= Y + H || el.cellY <= Y && el.cellY + el.height >= Y)
            }).sort(function(a, b) {
                return (a.cellX - b.cellX) || (a.cellY + a.height * 0.5 + b.cellY + b.height * 0.5 - 2 * Y - H) * (a.cellY + a.height * 0.5 - b.cellY - b.height * 0.5) || (a.cellY - b.cellY)
            })[0];
            var Bottom = obj.filter(function(el) {
                return (el.cellY >= Y + H * 0.5) && (el.cellX >= X && el.cellX <= X + W || el.cellX <= X && el.cellX + el.width >= X)
            }).sort(function(a, b) {
                return (a.cellY - b.cellY) || (a.cellX + a.width * 0.5 + b.cellX + b.width * 0.5 - 2 * X - W) * (a.cellX + a.width * 0.5 - b.cellX - b.width * 0.5) || (a.cellX - b.cellX)
            })[0];
            var Left = obj.filter(function(el) {
                return (el.cellX + el.width <= X) && (el.cellY >= Y && el.cellY <= Y + H || el.cellY <= Y && el.cellY + el.height >= Y)
            }).sort(function(a, b) {
                return (b.cellX + b.width - a.cellX - a.width) || (a.cellY + a.height * 0.5 + b.cellY + b.height * 0.5 - 2 * Y - H) * (a.cellY + a.height * 0.5 - b.cellY - b.height * 0.5) || (a.cellY - b.cellY)
            })[0];
            var Top = obj.filter(function(el) {
                return (el.cellY + el.height <= Y + H * 0.5) && (el.cellX >= X && el.cellX <= X + W || el.cellX <= X && el.cellX + el.width >= X)
            }).sort(function(a, b) {
                return (b.cellY + b.height - a.cellY - a.height) || (a.cellX + a.width * 0.5 + b.cellX + b.width * 0.5 - 2 * X - W) * (a.cellX + a.width * 0.5 - b.cellX - b.width * 0.5) || (a.cellX - b.cellX)
            })[0];

            if (!Right) Right = obj.filter((function(el) {
                return (el.cellX + el.width) > X + W
            })).sort(function(a, b) {
                return (Math.pow((X + W - a.cellX), 2) + Math.pow((Y + H / 2 - a.cellY), 2)) - ((Math.pow((X + W - b.cellX), 2) + Math.pow((Y + H / 2 - b.cellY), 2)))
            })[0];
            if (!Bottom) Bottom = obj.filter((function(el) {
                return (el.cellY + el.height) > Y + H
            })).sort(function(a, b) {
                return (Math.pow((X + W / 2 - (a.cellX + a.width / 2)), 2) + Math.pow((Y + H - a.cellY), 2)) - ((Math.pow((X + W / 2 - (b.cellX + b.width / 2)), 2) + Math.pow((Y + H - b.cellY), 2)))
            })[0];
            map.push({
                left: Left,
                right: Right,
                up: Top,
                down: Bottom,
            });
        }
        debugger
        return map;
    }

    //取第一个焦点
    function getFirst(obj, a) {
      debugger
        var index = 0;
        var de = false;
        a.forEach(function(els, j) {
            if (!!els.getAttribute('autofocus')) {
                index = j;
                de = true;
            }
        })
        if (de) {
            return index;
        }
        obj.forEach(function(el, i) {
            if (el.autofocus || !el.left && !el.up && (el.right || el.down)) {
                index = i;
            }
        })
        return index;
    }

    //查找上次焦点
    function getfocusId(item, obj) {
        var index = 0;
        obj.forEach(function(el, i) {
            el === item;
            index = i;
        })
        return index;
    }

    //class
    function hasClass(obj, className) {
        return obj.className.indexOf(className) > -1 ? true : false;
    }

    function addClass(obj, className) {
        if (!obj || hasClass(obj, className)) return;
        if (obj.classList) {
            obj.classList.add(className);
        } else {
            obj.className += ' ' + className;
        }
    }

    function removeClass(obj, className) {
        if (obj && hasClass(obj, className)) {
            var newClass = obj.className.replace(className, "");
            obj.className = newClass.replace(/(^\s*)/g, "");
        }
    }

    function isArray(obj) {
        return Object.prototype.toString.call(obj).slice(8, -1) === 'Array';
    }

    //forEach
    if (typeof Array.prototype.forEach != "function") {
        Array.prototype.forEach = function(fn, context) {
            for (var k = 0, length = this.length; k < length; k++) {
                if (typeof fn === "function" && Object.prototype.hasOwnProperty.call(this, k)) {
                    fn.call(context, this[k], k, this);
                }
            }
        };
    }

    //filter
    if (typeof Array.prototype.filter != "function") {
        Array.prototype.filter = function(fn, context) {
            var arr = [];
            if (typeof fn === "function") {
                for (var k = 0, length = this.length; k < length; k++) {
                    fn.call(context, this[k], k, this) && arr.push(this[k]);
                }
            }
            return arr;
        };
    }

    //findIndex
    if (typeof Array.prototype.findIndex !== "function") {
        Array.prototype.findIndex = function(predicate, thisArg) {
            if (this === null) {
                throw new TypeError('Cannot read property \'findIndex\' of null');
            }

            if (typeof predicate !== "function") {
                throw new TypeError(typeof predicate + ' is not a function');
            }

            var arrLength = this.length;
            var index = -1;

            for (var i = 0; i < arrLength; i++) {
                if (predicate.call(thisArg, this[i], i, this)) {
                    index = i;
                    break;
                }
            }
            return index;
        };
    }

})();