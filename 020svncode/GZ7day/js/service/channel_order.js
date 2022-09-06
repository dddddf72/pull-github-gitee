//PORTAL部门工号列表
var BOSS_PORTAL_TABLE = {
    GD: {deptid: "3002030", clientcode: "PORTAL", clientpwd: "0371508b40d1c77521ee6db761a3906e"}, //广东省
    QY: {deptid: "2903806", clientcode: "PORTAL", clientpwd: "0371508b40d1c77521ee6db761a3906e"}, //清远
    JM: {deptid: "2903807", clientcode: "PORTAL", clientpwd: "0371508b40d1c77521ee6db761a3906e"}, //江门
    ST: {deptid: "2903808", clientcode: "PORTAL", clientpwd: "0371508b40d1c77521ee6db761a3906e"}, //汕头
    DG: {deptid: "2903809", clientcode: "PORTAL", clientpwd: "0371508b40d1c77521ee6db761a3906e"}, //东莞
    ZS: {deptid: "2903810", clientcode: "PORTAL", clientpwd: "0371508b40d1c77521ee6db761a3906e"}, //中山
    ZH: {deptid: "2903811", clientcode: "PORTAL", clientpwd: "0371508b40d1c77521ee6db761a3906e"}, //珠海
    HZ: {deptid: "2903812", clientcode: "PORTAL", clientpwd: "0371508b40d1c77521ee6db761a3906e"}, //惠州
    JY: {deptid: "2903813", clientcode: "PORTAL", clientpwd: "0371508b40d1c77521ee6db761a3906e"}, //揭阳
    YF: {deptid: "2903814", clientcode: "PORTAL", clientpwd: "0371508b40d1c77521ee6db761a3906e"}, //云浮
    ZJ: {deptid: "2903815", clientcode: "PORTAL", clientpwd: "0371508b40d1c77521ee6db761a3906e"}, //湛江
    MZ: {deptid: "2903816", clientcode: "PORTAL", clientpwd: "0371508b40d1c77521ee6db761a3906e"}, //梅州
    FS: {deptid: "2903817", clientcode: "PORTAL", clientpwd: "0371508b40d1c77521ee6db761a3906e"}, //佛山
    CZ: {deptid: "2903818", clientcode: "PORTAL", clientpwd: "0371508b40d1c77521ee6db761a3906e"}, //潮州
    SW: {deptid: "2903819", clientcode: "PORTAL", clientpwd: "0371508b40d1c77521ee6db761a3906e"}, //汕尾
    SG: {deptid: "2903820", clientcode: "PORTAL", clientpwd: "0371508b40d1c77521ee6db761a3906e"}, //韶关
    HY: {deptid: "2903821", clientcode: "PORTAL", clientpwd: "0371508b40d1c77521ee6db761a3906e"}, //河源
    ZQ: {deptid: "2903822", clientcode: "PORTAL", clientpwd: "0371508b40d1c77521ee6db761a3906e"}, //肇庆
    MM: {deptid: "2903823", clientcode: "PORTAL", clientpwd: "0371508b40d1c77521ee6db761a3906e"}, //茂名
    GZ: {deptid: "2903824", clientcode: "PORTAL", clientpwd: "0371508b40d1c77521ee6db761a3906e"}, //广州
    SZ: {deptid: "2903825", clientcode: "PORTAL", clientpwd: "0371508b40d1c77521ee6db761a3906e"}, //深圳
    YJ: {deptid: "2903826", clientcode: "PORTAL", clientpwd: "0371508b40d1c77521ee6db761a3906e"}  //阳江
};

//BOSS请求(需要AJAX支持)
var bossRequest = {
    BossUrl: "",
    TvBackUrl: "",
    TvPostUrl: "",
    version: 1,
    citycode: "GD",
    clientcode: "PORTAL",
    clientpwd: "0371508b40d1c77521ee6db761a3906e",
    uerInfoFlag: false,
    icno: CA.icNo,
    //icno: "40803775978",	//test
    custid: "",
    deptid: "3002030",
    servicecode: "",
    requestid: "",
    requestContent: "",
    isCanYulan: 0,
    AjaxRequestType: [],	//异步Ajax请求列表(队列)
    AjaxRequestParam: [],	//异步Ajax请求参数(队列)
    AjaxHandler: null,
    doRequest: function () {
        servicecode = this.AjaxRequestType[0];
        data = this.AjaxRequestParam[0];
        function paddingNum(str, num) {
            str = str.toString();
            for (var i = str.length; i < num; i++) {
                str = "0" + str;
            }
            return str;
        }

        function getRequestId(num) {
            var d = new Date();
            var year = d.getFullYear();
            var date = paddingNum(d.getDate(), 2);
            var month = paddingNum(d.getMonth() + 1, 2);
            var hour = paddingNum(d.getHours(), 2);
            var minute = paddingNum(d.getMinutes(), 2);
            var second = paddingNum(d.getSeconds(), 2);
            var requestid = year + month + date + hour + minute + second + paddingNum(Math.floor(Math.random() * Math.pow(10, num)), num);
            return requestid;
        }

        function params2Str(paramObj) {
            var data = [];
            for (var i in paramObj) {
                data.push(i + "=" + paramObj[i]);
            }
            data = data.join("&");
            return data;
        }

        var params = null;
        var url = "";
        var postData = "";
        if (servicecode != "QUE_CHANNELPRODUCTS" && servicecode != "BIZ_TV_ORDER") {
            url = this.BossUrl;
            params = {
                version: this.version,
                citycode: this.citycode,
                deptid: this.deptid,
                clientcode: this.clientcode,
                clientpwd: this.clientpwd,
                system: "PORTAL",  //modified by liwenlei  BOSS新添加
                servicecode: "",
                requestid: "",
                requestContent: ""
            };
            params.servicecode = servicecode;
            params.requestid = this.clientcode + getRequestId(2);
            params.requestContent = JSON.stringify(data);
            postData = params2Str(params);
        } else if (servicecode == "QUE_CHANNELPRODUCTS") {
            params = {requestId: "", serviceCode: "QUE_CHANNELPRODUCTS", dataSign: "", sysMark: "", requestContent: ""};
            url = this.TvBackUrl;
            params.sysMark = "5";
            params.requestId = params.sysMark + getRequestId(4);
            params.dataSign = hex_md5(params.requestId + params.serviceCode + params.sysMark + "183F3364ED7564A9F5624DA2421EDEED");
            params.requestContent = JSON.stringify(data);
            postData = JSON.stringify(params);
        } else if (servicecode == "BIZ_TV_ORDER") {
            params = {sysMark: "", serviceCode: "BIZ_TV_ORDER", requestId: "", dataSign: "", requestContent: ""};
            url = this.TvPostUrl;
            params.sysMark = "5";
            params.requestId = params.sysMark + getRequestId(4);
            params.dataSign = hex_md5(params.requestId + params.serviceCode + params.sysMark + "183F3364ED7564A9F5624DA2421EDEED");
            params.requestContent = JSON.stringify(data);

            var form = document.createElement("form");
            form.target = '_self';
            form.action = url;
            form.method = "POST";
            form.enctype = 'application/x-www-form-urlencoded';

            var input;
            for (var j in params) {
                input = document.createElement("input");
                input.type = "hidden";
                input.name = j + "";
                input.value = params[j];
                form.appendChild(input);
            }

            document.body.appendChild(form);
            form.submit();
            return;
        }
        //alert(postData);
        var rtn = {status: "-1", output: null, message: ""};
        var self = this;
        this.AjaxHandler = Ajax.request(url, {
            async: true,
            method: "post",
            type: "text",
            timeout: 30000,
            data: postData,
            success: function (result) {//alert(result);
                try {
                    rtn = eval("(" + result + ")");
                    switch (self.AjaxRequestType[0]) {
                        case "QUE_USERINFO":
                            if (!rtn.output) {
                                channelOrder.show(5, "查询不到用户信息,请联系客服96956");
                                return;
                            }
                            self.custid = rtn.output.custid;

                            //根据用户所在地区配置相应参数值
                            self.citycode = rtn.output.city;
                            self.deptid = BOSS_PORTAL_TABLE[self.citycode].deptid;
                            self.clientcode = BOSS_PORTAL_TABLE[self.citycode].clientcode;
                            self.clientpwd = BOSS_PORTAL_TABLE[self.citycode].clientpwd;
                            if (self.AjaxRequestType[1] == "QUE_CHANNELPRODUCTS") {
                                self.AjaxRequestParam[1].city = self.citycode;
                            }
                            self.uerInfoFlag = true;
                            self.icno = CA.icNo;
                            break;
                        case "QUE_CHANNELPRODUCTS":
                            if (rtn.responseContent) {
                                try {
                                    temp = eval("(" + rtn.responseContent + ")");
                                    if (temp.prods && temp.prods.length > 0) {
                                        channelOrder.orderSelect = temp.prods;
                                        channelOrder.show(5);
                                        return;
                                    } else {
                                        channelOrder.show(5, "暂无对应产品列表,请联系客服96956");
                                        return;
                                    }
                                } catch (e) {
                                    channelOrder.show(5, "暂无对应产品列表,请联系客服96956");
                                    return;
                                }
                            } else {
                                channelOrder.show(5, "暂无对应产品列表,请联系客服96956");
                                return;
                            }
                            break;
                        case "BIZ_PREPROCESS":
                            if (!rtn.output) {
                                channelOrder.show(4, rtn.message);
                                return;
                            } else {
                                if (self.AjaxRequestType[1] == "BIZ_ORDERCOMMIT") {
                                    self.AjaxRequestParam[1].orderid = rtn.output.orderid;
                                }
                            }
                            break;
                        case "BIZ_ORDERCOMMIT":
                            if (rtn.status == "0") {
                                channelOrder.show(3);
                                return;
                            } else {
                                channelOrder.show(4, rtn.message);
                                return;
                            }
                            break;
                        case "BIZ_TV_ORDER":
                            break;
                    }
                    self.AjaxRequestType.shift();
                    self.AjaxRequestParam.shift();
                    if (self.AjaxRequestType.length > 0) {
                        self.doRequest();
                    }
                } catch (e) {
                    switch (self.AjaxRequestType[0]) {
                        case "QUE_USERINFO":
                            channelOrder.show(5, "查询不到用户信息,请联系客服96956");
                            return;
                            break;
                        case "QUE_CHANNELPRODUCTS":
                            channelOrder.show(5, "暂无对应产品列表,请联系客服96956");
                            return;
                            break;
                        case "BIZ_PREPROCESS":
                            channelOrder.show(4);
                            return;
                            break;
                        case "BIZ_ORDERCOMMIT":
                            channelOrder.show(4);
                            return;
                        case "BIZ_TV_ORDER":
                            return;
                            break;
                    }
                }
            },
            failure: function () {
                switch (self.AjaxRequestType[0]) {
                    case "QUE_USERINFO":
                        channelOrder.show(5, "查询不到用户信息,请联系客服96956");
                        return;
                        break;
                    case "QUE_CHANNELPRODUCTS":
                        channelOrder.show(5, "暂无对应产品列表,,请联系客服96956");
                        return;
                        break;
                    case "BIZ_PREPROCESS":
                        channelOrder.show(4);
                        return;
                        break;
                    case "BIZ_ORDERCOMMIT":
                        channelOrder.show(4);
                        return;
                        break;
                }
            }
        });
        return rtn;
    },
    getUserInfo: function () {
        if (this.uerInfoFlag && this.icno == CA.icNo) {
            return;
        }
        this.AjaxRequestType.push("QUE_USERINFO");
        this.AjaxRequestParam.push({icno: CA.icNo});
    },
    getProductList: function (channelId) {
        this.AjaxRequestType = [];
        this.AjaxRequestParam = [];
        this.getUserInfo();
        this.AjaxRequestType.push("QUE_CHANNELPRODUCTS");
        this.AjaxRequestParam.push({city: this.citycode, channelid: channelId + "", keyno: CA.icNo});
        this.doRequest();
    },
    orderProduct: function (pcode, ordertype, count, unit_, ispostpone) {
        this.AjaxRequestType = [];
        this.AjaxRequestParam = [];
        this.AjaxRequestType.push("BIZ_PREPROCESS");
        var requestData = {
            custid: this.custid,
            iscrtorder: "Y",
            gdnoid: "",
            gdno: "",
            buff: "",
            orderparams: [{
                "count": count,
                "iscrtorder": "Y",
                "ispostpone": ispostpone,
                "keyno": this.icno,
                "ordertype": ordertype,
                "permark": "1",
                "salescode": pcode,
                "unit": unit_
            }]
        };
        this.AjaxRequestParam.push(requestData);

        this.AjaxRequestType.push("BIZ_ORDERCOMMIT");
        var requestData = {
            orderid: "",
            payway: "22",
            bankaccno: "",
            payreqid: "134",
            paycode: "134"
        };
        this.AjaxRequestParam.push(requestData);
        this.doRequest();
    },
    orderProduct2: function (productid) {
        this.AjaxRequestType = [];
        this.AjaxRequestParam = [];
        this.AjaxRequestType.push("BIZ_TV_ORDER");
        this.AjaxRequestParam.push({
            keyno: CA.icNo,
            productid: productid,
            payment: "",
            redirectUrl: "main://index.html?page=play_tv&type=0d",
            noticeAction: ""
        });
        SysSetting.setEnv("LAST_PRODUCTID", productid);
        this.doRequest();
    }
};

//未授权付费频道订购
var channelOrder = {
    focus: 0,
    alertDom: null,
    orderSelectDom: null,
    imgPreDir: "images/channel_order/",
    imgList: ["alert_bg.png", "cancel_order.png", "failed.png", "order_select_bg.png", "ok.png", "order_focus.png", "others.png", "selected.png", "success.png", "", "cancel_order_focus.png", "order.png", "others_focus.png", "yulan.png", "unavalible_focus.png", "yulan_order.png", "unavalible_focus.png", "order_select_pop.png"],
    keyValue: {enter: 13, up: 87, down: 83, left: 65, right: 68, back: 8, exit: 27, pageUp: 306, pageDown: 307},
    OrderKeys: [],
    type: 1,
    selectedName: "",
    selectedPrice: "",
    alertOption: 1,
    orderSelect: [],
    orderSelectOption: 1,
    successFunction: null,
    failedFunction: null,
    currentService: null,
    TvHallUrl: "",
    init: function (TvHallUrl, TvBackUrl, BossUrl, TvPostUrl, zIndex) {
        this.TvHallUrl = TvHallUrl;
        bossRequest.TvBackUrl = TvBackUrl;
        bossRequest.BossUrl = BossUrl;
        bossRequest.TvPostUrl = TvPostUrl;
        //预加载图片
        if (!document.preImgs) {
            document.preImgs = [];
        }
        for (var i = 0; i < this.imgList.length; i++) {
            var img = new Image();
            img.src = this.imgPreDir + this.imgList[i];
            document.preImgs.push(img);
        }

        //创建添加元素
        this.alertDom = document.createElement("div");
        this.alertDom.style.width = "549px";
        this.alertDom.style.height = "328px";
        this.alertDom.style.position = "absolute";
        this.alertDom.style.top = "200px";
        this.alertDom.style.left = "318px";
        this.alertDom.style.color = "#fff";
        this.alertDom.style.background = "url(" + this.imgPreDir + this.imgList[0] + ") no-repeat";
        this.alertDom.style.zIndex = zIndex + "";
        this.alertDom.style.display = "none";
        document.body.appendChild(this.alertDom);

        this.orderSelectDom = document.createElement("div");
        this.orderSelectDom.style.width = "794px";
        this.orderSelectDom.style.height = "462px";
        this.orderSelectDom.style.position = "absolute";
        this.orderSelectDom.style.top = "78px";
        this.orderSelectDom.style.left = "200px";
        this.orderSelectDom.style.color = "#fff";
        this.orderSelectDom.style.background = "url(" + this.imgPreDir + this.imgList[3] + ") no-repeat";
        this.orderSelectDom.style.backgroundSize = "794px 462px";
        this.orderSelectDom.style.zIndex = zIndex + "";
        this.orderSelectDom.style.display = "none";
        document.body.appendChild(this.orderSelectDom);
    },
    start: function (service) {
        this.isCanYulan = service.playback;
        this.currentService = service;
        this.focus = 1;
    },
    reset: function () {
        this.OrderKeys = [];
        this.type = 1;
        this.selectedName = "";
        this.selectedPrice = "";
        this.alertOption = 1;
        this.orderSelect = [];
        this.orderSelectOption = 1;
        this.currentService = null;
    },
    eventHandler: function (event) {
        if (this.focus == 0) {
            return true;
        }
        var code = event.keyCode || event.which;

        switch (this.type) {
            case 1:
                if (code == this.keyValue.enter) {
                    this.orderSelect = [];
                    this.orderSelectOption = 1;
                    this.show(5);
                    return false;
                }else if(code == this.keyValue.left || code == this.keyValue.right){
                    return false;
                }
                break;
            case 2:
                switch (code) {
                    case this.keyValue.left:
                        this.alertOption = this.alertOption == 1 ? 1 : --this.alertOption;
                        this.show(2);
                        return false;
                        break;
                    case this.keyValue.right:
                        this.alertOption = this.alertOption == 3 ? 3 : ++this.alertOption;
                        this.show(2);
                        return false;
                        break;
                    case this.keyValue.enter:
                        switch (this.alertOption) {
                            case 1:
                                this.show(6);
                                break;
                            case 2:
                                this.show(5);
                                break;
                            case 3:
                                if (!this.isCanYulan) {
                                    this.show(1);
                                } else {
                                    if (!this.isCanYulan) {
                                        this.show(1);
                                    } else {
                                        this.alertOption = 1;
                                        this.show(7);
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                        return false;
                        break;
                    case this.keyValue.back:
                    case this.keyValue.exit:
                        this.show(5);
                        return false;
                        break;
                    case this.keyValue.down:
                    case this.keyValue.up:
                        return false;
                        break;
                    default:
                        break;
                }
                break;
            case 4:
                switch (code) {
                    case this.keyValue.back:
                    case this.keyValue.exit:
                        if (!this.isCanYulan) {
                            this.show(1);
                        } else {
                            this.alertOption = 1;
                            this.show(7);
                        }
                        return false;
                        break;
                    default:
                        break;
                }
                break;
            case 5:
                switch (code) {
                    case this.keyValue.enter:
                        if (this.orderSelect.length <= 0) {
                            return false;
                        }
                        if (false && this.orderSelect[this.orderSelectOption - 1].linktype == "1") {//禁用此分支
                            var url = this.TvHallUrl + "?type=3&pos=2022&param=" + this.orderSelect[this.orderSelectOption - 1].pcode;
                            window.location.href = url;
                        } else {
                            this.alertOption = 1;
                            this.show(2);
                        }
                        return false;
                        break;
                    case this.keyValue.up:
                        if (this.orderSelect.length <= 0) {
                            return false;
                        }
                        this.orderSelectOption = this.orderSelectOption == 1 ? 1 : --this.orderSelectOption;
                        this.show(5);
                        return false;
                        break;
                    case this.keyValue.down:
                        if (this.orderSelect.length <= 0) {
                            return false;
                        }
                        this.orderSelectOption = this.orderSelectOption == this.orderSelect.length ? this.orderSelect.length : ++this.orderSelectOption;
                        this.show(5);
                        return false;
                        break;
                    case this.keyValue.pageUp:
                        var contentDom = document.getElementById("orderContentDiv");
                        if (contentDom) {
                            var cHeight = contentDom.clientHeight;
                            if (cHeight > 120) {
                                var page = Math.ceil(cHeight / 120);
                                var topPx = contentDom.style.top;
                                topPx = parseInt(topPx);
                                if (topPx < 0) {
                                    contentDom.style.top = (topPx + 120) + "px";
                                    var curPage = Math.ceil((topPx + 120) / 120) + 1;
                                    document.getElementById("pageInfo").innerHTML = curPage + "/" + page + "	请用翻页键翻页";
                                }
                            }
                        }
                        break;
                    case this.keyValue.pageDown:
                        var contentDom = document.getElementById("orderContentDiv");
                        if (contentDom) {
                            var cHeight = contentDom.clientHeight;
                            var page = Math.ceil(cHeight / 120);
                            if (cHeight > 120) {
                                var topPx = contentDom.style.top;
                                topPx = parseInt(topPx);
                                if ((topPx + cHeight) > 120) {
                                    contentDom.style.top = (topPx - 120) + "px";
                                    var curPage = Math.ceil(Math.abs(topPx - 120) / 120) + 1;
                                    document.getElementById("pageInfo").innerHTML = curPage + "/" + page + "	请用翻页键翻页";
                                }
                            }
                        }
                        break;
                    case this.keyValue.back:
                        if (bossRequest.AjaxHandler) {
                            this.focus = 0;
                            bossRequest.AjaxHandler.abort();
                            this.focus = 1;
                        }
                        if (!this.isCanYulan) {
                            this.show(1);
                        } else {
                            this.alertOption = 1;
                            this.show(7);
                        }
                        return false;
                        break;
                    case this.keyValue.exit:
                        if (bossRequest.AjaxHandler) {
                            this.focus = 0;
                            bossRequest.AjaxHandler.abort();
                            this.focus = 1;
                        }
                        if (!this.isCanYulan) {
                            this.show(1);
                        } else {
                            this.alertOption = 1;
                            this.show(7);
                        }
                        return false;
                        break;
                    case this.keyValue.left:
                    case this.keyValue.right:
                        return false;
                    default:
                        break;
                }
                break;
            case 7://预览
                if (code == this.keyValue.left) {
                    if (this.alertOption == 1) {
                        this.alertOption = 0;
                        this.show(7);
                    }
                    return false;
                } else if (code == this.keyValue.right) {
                    if (this.alertOption == 0) {
                        this.alertOption = 1;
                        this.show(7);
                    }
                    return false;
                } else if (code == this.keyValue.enter) {
                    if (this.alertOption == 0) {
                        if (this.currentService) {
                            DataCollection.collectData(["18",this.currentService.channelId]);
                            //window.location.href = PORTAL_ADDR + "/NewFrameWork/web/tvPreview.html?channelId=" + this.currentService.channelId;
                            window.location.href = PORTAL_ADDR + "/NewFrameWork/UE/html/tvPreview.html?channelId=" + this.currentService.channelId;
                            //window.location.href = "http://192.168.88.1/gongdong_z/test/portal2.html";
                        }
                    } else {
                        this.orderSelect = [];
                        this.orderSelectOption = 1;
                        this.show(5);
                    }
                    return false;
                }
                break;
            case 8:
                if (code == this.keyValue.enter) {
                    this.orderSelect = [];
                    this.orderSelectOption = 1;
                    this.show(5);
                    return false;
                }
                break;
            default:
                break;
        }
        //遥控器上的快捷键：69-节目指南、76-喜爱、77-邮件、80-电视
        if (this.OrderKeys[0] == -1 && code != 69 && code != 76 && code != 77 && code != 80) {
            return false;
        }

        //在订购页面不响应绿键
        if(code == 321){
            return false;
        }
        return true;
    },
    show: function (type) {
        if (this.focus == 0 && this.type == type) {
            return true;
        }
        this.type = type;
        switch (type) {
            case 1:		//未授权频道订购提示
                var text1 = document.createElement("div");
                text1.style.width = "382px";
                text1.style.height = "auto";
                text1.style.margin = "72px 80px 0px 80px";
                text1.style.fontSize = "22px";
                text1.style.textAlign = "left";
                text1.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;该频道未授权，马上订购产品包立即观看精彩内容！详情可咨询当地营业厅或拨打客服热线96956.<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;若不需订购，按数字键或上下键切换观看其他频道";

                var text2 = document.createElement("div");
                text2.style.width = "549px";
                text2.style.height = "auto";
                text2.style.margin = "0px 0px 0px 100px";
                text2.style.fontSize = "22px";
                text2.style.textAlign = "left";
                text2.innerHTML = "按<img src='" + this.imgPreDir + this.imgList[4] + "' style='margin: 0px 5px -40px 5px;' />进入订购界面";

                //var text3 = document.createElement("div");
                //text3.style.width = "549px";
                //text3.style.height = "auto";
                //text3.style.fontSize = "20px";
                //text3.style.textAlign = "center";
                //text3.style.marginTop = "30px";
                //text3.innerHTML = "若不需订购，按数字键或上下键切换观看其他频道";

                this.alertDom.innerHTML = "";
                this.alertDom.appendChild(text1);
                this.alertDom.appendChild(text2);
                //this.alertDom.appendChild(text3);
                this.orderSelectDom.style.display = "none";
                this.alertDom.style.display = "block";
                this.OrderKeys = [this.keyValue.enter,this.keyValue.left,this.keyValue.right];
                break;
            case 2:		//操作选择
                var text1 = document.createElement("div");
                text1.style.width = "300px";
                text1.style.height = "auto";
                text1.style.marginTop = "70px";
                text1.style.marginLeft = "75px";
                text1.style.fontSize = "20px";
                text1.innerHTML = "您即将进行订购";

                var text2 = document.createElement("div");
                text2.style.width = "450px";
                text2.style.height = "auto";
                text2.style.margin = "20px 0px 0px 150px";
                text2.style.fontSize = "22px";
                text2.style.lineHeight = "35px";
                text2.style.textAlign = "left";
                text2.innerHTML = "产品名称：" + displayScroll(this.orderSelect[this.orderSelectOption - 1].pname, 450, 26) + "<br/>价&nbsp;&nbsp;格：" + this.orderSelect[this.orderSelectOption - 1].price + this.orderSelect[this.orderSelectOption - 1].unit;
                //text2.innerHTML = "产品名称：高清体育包<br/>价&nbsp;&nbsp;格：999元/年";

                var text3 = document.createElement("div");
                text3.id = "buttonWrap2";
                text3.style.width = "549px";
                text3.style.height = "auto";
                text3.style.marginTop = "20px";
                text3.style.textAlign = "center";
                text3.style.marginBottom = "10px";
                text3.style.fontSize = "22px";
                text3.innerHTML = "<div style='width:154px;height:94px;line-height: 94px; margin: 0px 0px 0px 40px;float: left'>马上订购" + " </div><div style='width:154px;height:94px;line-height: 94px; float:left;'>其他产品" + "</div><div style='width:154px;height:94px;line-height: 94px; float:left;'>取消订购</div>"


                this.alertDom.innerHTML = "";
                this.alertDom.appendChild(text1);
                this.alertDom.appendChild(text2);
                this.alertDom.appendChild(text3);
                document.getElementById("buttonWrap2").childNodes[0].style.background = "";
                document.getElementById("buttonWrap2").childNodes[1].style.background = "";
                document.getElementById("buttonWrap2").childNodes[2].style.background = "";

                switch (this.alertOption) {
                    case 1:
                        document.getElementById("buttonWrap2").childNodes[0].style.background = "url(" + this.imgPreDir + this.imgList[14] + ") no-repeat";
                        break;
                    case 2:
                        document.getElementById("buttonWrap2").childNodes[1].style.background = "url(" + this.imgPreDir + this.imgList[14] + ") no-repeat";
                        break;
                    case 3:
                        document.getElementById("buttonWrap2").childNodes[2].style.background = "url(" + this.imgPreDir + this.imgList[14] + ") no-repeat";
                        break;
                    default:
                        break;
                }

                this.orderSelectDom.style.display = "none";
                this.alertDom.style.display = "block";
                this.OrderKeys = [this.keyValue.enter, this.keyValue.back, this.keyValue.exit, this.keyValue.left, this.keyValue.right, this.keyValue.up, this.keyValue.down];
                break;
            case 3:		//订购成功
                var text1 = document.createElement("div");
                text1.style.width = "32px";
                text1.style.height = "32px";
                text1.style.position = "absolute";
                text1.style.top = "84px";
                text1.style.left = "365px";
                text1.style.background = "url(" + this.imgPreDir + this.imgList[8] + ") no-repeat";

                var text2 = document.createElement("div");
                text2.style.width = "521px";
                text2.style.height = "80px";
                text2.style.marginTop = "70px";
                text2.style.fontSize = "25px";
                text2.style.lineHeight = "60px";
                text2.style.textAlign = "center";
                text2.innerHTML = "恭喜您订购成功！";

                var text3 = document.createElement("div");
                text3.style.width = "382px";
                text3.style.height = "auto";
                text3.style.marginLeft = "88px";
                text3.style.fontSize = "20px";
                text3.style.lineHeight = "23px";
                text3.style.textAlign = "left";
                text3.style.textIndent = "30px";
                text3.innerHTML = "请耐心等待30S，稍后即可观看该频道精彩节目。若长时间等待后无法观看，请按主页后重新进入或拨打客服热线95956";

                this.alertDom.innerHTML = "";
                this.alertDom.appendChild(text1);
                this.alertDom.appendChild(text2);
                this.alertDom.appendChild(text3);
                this.orderSelectDom.style.display = "none";
                this.alertDom.style.display = "block";
                this.OrderKeys = [];
                var self = this;
                if (this.successFunction) {
                    setTimeout(function () {
                        self.successFunction();
                    }, 1500);
                } else {
                    setTimeout(function () {
                        self.exit();
                    }, 1500);
                }
                break;
            case 4:		//订购失败
                var text1 = document.createElement("div");
                text1.style.width = "32px";
                text1.style.height = "32px";
                text1.style.position = "absolute";
                text1.style.top = "80px";
                text1.style.left = "330px";
                text1.style.background = "url(" + this.imgPreDir + this.imgList[2] + ") no-repeat";

                var text2 = document.createElement("div");
                text2.style.width = "521px";
                text2.style.height = "80px";
                text2.style.marginTop = "70px";
                text2.style.fontSize = "25px";
                text2.style.lineHeight = "60px";
                text2.style.textAlign = "center";
                text2.innerHTML = "订购失败！";

                var text3 = document.createElement("div");
                text3.style.fontSize = "22px";
                text3.style.overflow = "hidden";
                text3.style.width = "382px";
                text3.style.height = "auto";
                text3.style.marginLeft = "88px";
                text3.style.fontSize = "20px";
                text3.style.lineHeight = "23px";
                text3.style.textAlign = "left";
                text3.style.textIndent = "30px";
                if (!arguments[1]) {
                    text3.innerHTML = "如需帮助，请咨询当地营业厅或拨打客服热线96956";
                } else {
                    text3.innerHTML = arguments[1];
                }

                this.alertDom.innerHTML = "";
                this.alertDom.appendChild(text1);
                this.alertDom.appendChild(text2);
                this.alertDom.appendChild(text3);
                this.orderSelectDom.style.display = "none";
                this.alertDom.style.display = "block";
                this.OrderKeys = [];

                if (this.failedFunction) {
                    this.failedFunction();
                } else {
                    //var self = this;
                    //setTimeout(function(){self.show(1);}, 5000);
                    this.OrderKeys = [this.keyValue.back, this.keyValue.exit];
                }
                break;
            case 5:		//产品列表
                var title = document.createElement("div");
                title.style.width = "794px";
                title.style.height = "48px";
                title.style.position = "absolute";
                title.style.top = "65px";
                title.style.fontSize = "23px";
                title.style.textAlign = "center";
                title.innerHTML = "产品订购";

                var text1 = document.createElement("div");
                text1.style.width = "200px";
                text1.style.height = "25px";
                text1.style.position = "absolute";
                text1.style.top = "138px";
                text1.style.left = "72px";
                text1.style.fontSize = "23px";
                text1.style.textAlign = "center";
                text1.innerHTML = "产品名称";

                var text2 = document.createElement("div");
                text2.style.width = "120px";
                text2.style.height = "25px";
                text2.style.position = "absolute";
                text2.style.top = "138px";
                text2.style.left = "330px";
                text2.style.fontSize = "23px";
                text2.style.textAlign = "center";
                text2.innerHTML = "价格";

                this.orderSelectDom.innerHTML = "";
                this.orderSelectDom.appendChild(title);
                this.orderSelectDom.appendChild(text1);
                this.orderSelectDom.appendChild(text2);


                //this.orderSelect =[{pname:"高清体育包",price:"999",unit:"元/年",originalprice:"10000",descption:"测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试"},{pname:"高清体育包",price:"999",unit:"元/年",originalprice:"10000",descption:"测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试"},{pname:"高清体育包",price:"999",unit:"元/年",originalprice:"10000",descption:"测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试"},{pname:"高清体育包",price:"999",unit:"元/年",originalprice:"10000",descption:"测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试"},{pname:"高清体育包",price:"999",unit:"元/年",originalprice:"10000",descption:"测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试"}]


                var elements = [];
                var retmsg = document.createElement("div");
                retmsg.id = "orderContentParentDiv";
                retmsg.style.background = "url(" + this.imgPreDir + this.imgList[17] + ") no-repeat";
                retmsg.style.zIndex = 9;

                if (this.orderSelect.length > 0) {
                    for (var i = 0; i < this.orderSelect.length && i < 3; i++) {
                        var temp = document.createElement("div");
                        temp.style.width = "794px";
                        temp.style.height = "95px";
                        temp.style.position = "absolute";
                        temp.style.left = "52px";
                        var text = document.createElement("div");
                        text.style.width = "200px";
                        text.style.height = "95px";
                        text.style.lineHeight = "95px";
                        text.style.position = "absolute";
                        text.style.left = "27px";
                        text.style.fontSize = "22px";
                        text.style.textAlign = "center";
                        text.style.overflow = "hidden";
                        text.style.textOverflow = "ellipsis";
                        text.style.whiteSpace = "nowrap";
                        if (i == this.orderSelectOption - 1) {
                            text.innerHTML = displayScroll(this.orderSelect[i].pname, 350, 28);
                        } else {
                            text.innerHTML = this.orderSelect[i].pname;
                        }
                        temp.appendChild(text);
                        text = document.createElement("div");
                        text.style.width = "150px";
                        text.style.height = "95px";
                        text.style.lineHeight = "95px";
                        text.style.position = "absolute";
                        text.style.left = "265px";
                        text.style.fontSize = "22px";
                        text.style.textAlign = "center";
                        text.innerHTML = this.orderSelect[i].price + this.orderSelect[i].unit;


                        var onsaleText = document.createElement("div");
                        onsaleText.className = "onsaleText";
                        onsaleText.style.width = "150px";
                        onsaleText.style.height = "95px";
                        onsaleText.style.lineHeight = "95px";
                        onsaleText.style.position = "absolute";
                        onsaleText.style.left = "390px";
                        onsaleText.style.fontSize = "22px";
                        onsaleText.style.textAlign = "center";
                        if (this.orderSelect[i].originalprice != "" || this.orderSelect[i].originalprice != 0) {
                            onsaleText.innerHTML = "促销";
                        } else {
                            onsaleText.innerHTML = "";
                        }
                        var orderButton = document.createElement("div");
                        orderButton.className = "orderButton";
                        orderButton.style.width = "70px";
                        orderButton.style.height = "95px";
                        orderButton.style.lineHeight = "95px";
                        orderButton.style.position = "absolute";
                        orderButton.style.left = "560px";
                        orderButton.style.fontSize = "22px";
                        orderButton.style.textAlign = "center";
                        orderButton.innerHTML = "订购";

                        temp.appendChild(text);
                        temp.appendChild(onsaleText);
                        temp.appendChild(orderButton);
                        elements.push(temp);
                    }

                    retmsg.style.width = "644px";
                    retmsg.style.height = "140px";
                    retmsg.style.position = "absolute";
                    retmsg.style.left = "78px";

                    var div1 = document.createElement("div");
                    div1.style.position = "absolute";
                    div1.style.left = "30px";
                    div1.style.top = "0px";
                    div1.style.width = "794px";
                    div1.style.height = "120px";
                    div1.style.overflow = "hidden";

                    var div2 = document.createElement("div");
                    div2.id = "orderContentDiv";
                    div2.style.position = "absolute";
                    div2.style.left = "0px";
                    div2.style.top = "10px";
                    div2.style.width = "613px";
                    //div2.style.height = "613px";
                    div2.style.lineHeight = "30px";
                    div2.style.fontSize = "20px";
                    div2.style.color = "#8b9299";
                    div2.innerHTML = "产品介绍：<br/><font style='visibility:hidden;'>两格</font>";

                    var imgs = [this.imgList[9], this.imgList[9], this.imgList[9]];
                    var top_position = [];
                    switch (this.orderSelectOption) {
                        case 1:
                            imgs[0] = this.imgList[7];
                            top_position = elements.length == 3 ? ["149px", "359px", "335px"] : ["149px", "335px"];
                            retmsg.style.top = "221px";
                            break;
                        case 2:
                            imgs[1] = this.imgList[7];
                            top_position = ["149px", "209px", "360px"];
                            retmsg.style.top = "279px";
                            break;
                        case 3:
                            imgs[2] = this.imgList[7];
                            top_position = ["149px", "209px", "259px"];
                            retmsg.style.top = "327px";
                            break;
                        default:
                            break;
                    }
                    var descption = this.orderSelect[this.orderSelectOption - 1].descption;
                    descption = descption ? descption : "暂无产品介绍";
                    div2.innerHTML += descption;
                    div1.appendChild(div2);
                    retmsg.appendChild(div1);
                }
                var div3 = document.createElement("div");
                div3.id = "pageInfo";
                div3.style.position = "absolute";
                div3.style.left = "180px";
                div3.style.top = "265px";
                div3.style.width = "216px";
                div3.style.height = "24px";
                div3.style.fontSize = "18px";
                div3.style.color = "#fff";
                div3.style.lineHeight = "24px";

                for (var i = 0; i < elements.length; i++) {
                    elements[i].style.top = top_position[i];
                    elements[i].style.background = "url(" + this.imgPreDir + imgs[i] + ") no-repeat";
                    this.orderSelectDom.appendChild(elements[i]);
                }

                retmsg.appendChild(div3);
                this.orderSelectDom.appendChild(retmsg);

                if (div2 && div2.clientHeight > 120) {
                    div3.innerHTML = "1/" + Math.ceil(div2.clientHeight / 120) + "  请用翻页键翻页";
                }

                var text3 = null;
                if (elements.length == 0) {
                    text3 = document.createElement("div");
                    text3.style.width = "794px";
                    text3.style.height = "25px";
                    text3.style.position = "absolute";
                    text3.style.top = "250px";
                    text3.style.left = "px";
                    text3.style.fontSize = "23px";
                    text3.style.textAlign = "center";
                    text3.style.color = "#fff";
                    if (arguments[1]) {
                        text3.innerHTML = arguments[1];
                    } else {
                        text3.innerHTML = "正在加载产品，请稍后...";
                    }
                    this.orderSelectDom.appendChild(text3);
                }

                this.alertDom.style.display = "none";
                this.orderSelectDom.style.display = "block";
                this.OrderKeys = [this.keyValue.enter, this.keyValue.up, this.keyValue.down, this.keyValue.back, this.keyValue.exit];

                //BOSS请求产品列表
                if (this.orderSelect.length == 0 && !arguments[1]) {
                    DataCollection.collectData(["0d", this.currentService.channelId + "", "0"]);
                    bossRequest.getProductList(this.currentService.channelId);
                }
                break;
            case 6:		//订购下单进行中
                var text = document.createElement("div");
                text.style.width = "382px";
                text.style.height = "auto";
                text.style.marginTop = "200px";
                text.style.marginLeft = "100px";
                text.style.fontSize = "22px";
                text.style.textAlign = "left";
                text.style.textIndent = "30px";
                text.innerHTML = "正在进行订购操作！请稍后...";

                this.alertDom.innerHTML = "";
                this.alertDom.appendChild(text);
                this.orderSelectDom.style.display = "none";
                this.alertDom.style.display = "none";
                this.OrderKeys = [-1];


                SysSetting.setEnv("LAST_PRODUCTNAME", this.orderSelect[this.orderSelectOption - 1].pname);
                var productid = this.orderSelect[this.orderSelectOption - 1].productid;
                bossRequest.orderProduct2(productid);
                break;
            case 7:
                var text1 = document.createElement("div");
                text1.style.width = "430px";
                text1.style.height = "auto";
                text1.style.margin = "60px 0px 0px 60px";
                text1.style.fontSize = "20px";
                text1.style.lineHeight = "30px";
                //text1.style.textAlign = "center";

                text1.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;该频道未授权可免费预览，马上订购可看完整节目，畅想尊贵特权！详情可咨询当地营业厅或拨打客服热线96956.";

                var text2 = document.createElement("div");
                text2.style.width = "549px";
                text2.style.height = "auto";
                //text2.style.marginTop = "20px";
                text2.style.marginBottom = "10px";
                text2.style.fontSize = "22px";
                text2.style.textAlign = "center";
                //var img = [];
                //if(this.alertOption == 1){
                //	img[0] = this.imgList[13];
                //	img[1] = this.imgList[16];
                //}else{
                //	img[0] = this.imgList[14];
                //	img[1] = this.imgList[15];
                //}
                //text2.innerHTML = s<img src='"+ this.imgPreDir + img[0] +"' style='margin:10px 5px -15px 5px;' /><img src='"+ this.imgPreDir + img[1] +"' style='margin:10px 5px -15px 5px;' />";
                text2.innerHTML = "<div id='freePrev' style='width:154px;height:94px;line-height: 94px; margin: 0px 130px 0px 60px;float: left'>免费预览" + " </div><div id='orderNow' style='width:154px;height:94px;line-height: 94px; float:left;'>马上订购</div>"


                var text3 = document.createElement("div");
                text3.style.width = "430px";
                text3.style.height = "auto";
                text3.style.fontSize = "20px";
                text3.style.lineHeight = "30px";
                //text3.style.textAlign = "center";
                text3.style.margin = "0px 0px 0px 60px";
                text3.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;若不需订购，按数字键或上下键切换观看其他频道";

                this.alertDom.innerHTML = "";
                this.alertDom.appendChild(text1);
                this.alertDom.appendChild(text3);
                this.alertDom.appendChild(text2);
                if (this.alertOption == 1) {
                    document.getElementById("freePrev").style.background = "";
                    document.getElementById("orderNow").style.background = "url(" + this.imgPreDir + this.imgList[16] + ") no-repeat";
                } else {
                    document.getElementById("freePrev").style.background = "url(" + this.imgPreDir + this.imgList[14] + ") no-repeat";
                    document.getElementById("orderNow").style.background = "";
                }

                this.orderSelectDom.style.display = "none";
                this.alertDom.style.display = "block";
                this.OrderKeys = [this.keyValue.enter, this.keyValue.left, this.keyValue.right];
                break;
            case 8:
                var text1 = document.createElement("div");
                text1.style.width = "382px";
                text1.style.height = "auto";
                text1.style.margin = "72px 80px 0px 80px";
                text1.style.fontSize = "22px";
                text1.style.textAlign = "left";
                text1.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;免费预览已结束。本频道为付费频道，马上订购可继续观看。详情可咨询当地营业厅或拨打客服热线96956.<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;若不需订购，按数字键或上下键切换观看其他频道";

                var text2 = document.createElement("div");
                text2.style.width = "549px";
                text2.style.height = "auto";
                text2.style.margin = "0px 0px 0px 100px";
                text2.style.fontSize = "22px";
                text2.style.textAlign = "left";
                text2.innerHTML = "按<img src='" + this.imgPreDir + this.imgList[4] + "' style='margin: 0px 5px -40px 5px;' />进入订购界面";


                //var text3 = document.createElement("div");
                //text3.style.width = "549px";
                //text3.style.height = "auto";
                //text3.style.fontSize = "20px";
                //text3.style.textAlign = "center";
                //text3.style.marginTop = "30px";
                //text3.innerHTML = "若不需订购，按数字键或上下键切换观看其他频道";

                this.alertDom.innerHTML = "";
                this.alertDom.appendChild(text1);
                this.alertDom.appendChild(text2);
                //this.alertDom.appendChild(text3);
                this.orderSelectDom.style.display = "none";
                this.alertDom.style.display = "block";
                this.OrderKeys = [this.keyValue.enter];
                break;
            default:
                break;
        }
    },
    loseFocus: function () {
        this.focus = 0;
    },
    getFocus: function () {
        this.focus = 1;
    },
    exit: function () {
        this.isCanYulan = 0;
        this.focus = 0;
        this.OrderKeys = [];
        this.alertDom.innerHTML = "";
        this.orderSelectDom.innerHTML = "";
        this.orderSelectDom.style.display = "none";
        this.alertDom.style.display = "none";
        if (bossRequest.AjaxHandler) {
            bossRequest.AjaxHandler.abort();
        }
    }
};

//文字跑马灯
function displayScroll(text, width, fontSize, fontWeight) {
    var calculateWidthId = document.createElement("div");
    document.body.appendChild(calculateWidthId);
    calculateWidthId.style.visibility = "hidden";
    calculateWidthId.style.display = "inline";
    calculateWidthId.style.whiteSpace = "nowrap";
    calculateWidthId.innerHTML = text;
    calculateWidthId.style.fontSize = fontSize + "px";
    if (typeof fontWeight != "undefined") {
        calculateWidthId.style.fontWeight = fontWeight;
    } else {
        calculateWidthId.style.fontWeight = "normal";
    }
    if (calculateWidthId.offsetWidth > width) {
        return "<marquee style='width:" + width + "px;margin-bottom:-8px;'>" + text + "</marquee>";
    } else {
        return text;
    }
}