//server API
var Path = (function(list) {
    return Object.keys(list).reduce(function(copy, name) {
        copy[name] = Config.serverUrl + list[name];
        return copy;
    }, {})

})({
    getProductTypes: 'getProductTypes',
    getProducts: 'getProducts',
    getProductDetail: 'getProductDetail',
    searchProducts: 'searchProducts',
    getHomePageData: 'getHomePageData',
    getQrCodeImage: 'getWxQrCode',
    reportData: 'report',
    getRecommendList: 'getRecommendList',
    // 专题商品获取接口
    getSpecialProducts: 'getSpecialProducts',
    getPlayInfo: 'getTvExplain',
    // getWxQrCode: 'getWxQrCodewx'
});

var qcord = {
    t: Config.smartCard(),
    d: Config.getArea(),
    c: 'tv',
};


var getServerData = function(options) {
    var
        success = options.success || function() {},
        error = options.error || function() {},
        data = options.data || {},
        timeout = options.timeout || Config.serverTimeout,
        method = options.method || 'GET';

    return $.ajax({
        method: method,
        async: false,
        url: options.url,
        data: Object.assign({ smartCard: Config.smartCard(), area: Config.getArea() }, data),
        timeout: timeout,
        success: success,
        error: error,
    })
}


var ServerAPI = {
    // 获取商品分类列表
    getProductTypes: function(page, limit, cateId, success, error) {
        getServerData({ url: Path.getProductTypes, data: { page: page, limit: limit, cateId: cateId }, success: success, error: error });
    },
    //获取商品列表
    getProducts: function(page, limit, cateId, success, error) {
        getServerData({ url: Path.getProducts, data: { page: page, limit: limit, cateId: cateId }, success: success, error: error });
    },
    //获取商品详情
    getProductDetail: function(id, success, error) {
        getServerData({ url: Path.getProductDetail, data: { id: id }, success: success, error: error });
    },
    // 获取推荐商品分类列表
    getRecommendList: function(success, error) {
        getServerData({ url: Path.getRecommendList, success: success, error: error });
    },

    //专题商品获取接口
    getSpecialProducts: function(homePageId, sort, limit, cateId, success, error) {
        getServerData({ url: Path.getSpecialProducts, data: { homePageId: homePageId, sort: sort, limit: limit, cateId: cateId }, success: success, error: error });
    },

    searchProducts: function(page, limit, keyword, success, error) {
        getServerData({ url: Path.searchProducts, data: { page: page, limit: limit, keyword: keyword }, success: success, error: error });
    },
    getHomePageData: function(success, error) {
        getServerData({ url: Path.getHomePageData, success: success, error: error });
    },
    getQrCodeImage: function(text, width, height) {
        var obj = { text: text, width: width, height: height };
        return Path.getQrCodeImage.concat('?', Object.keys(obj).map(function(prop) {
            return prop + '=' + obj[prop];
        }).join('&'), '&nomd5=1');
    },
    getProductLocaPath: function(localPath) {
        return Config.serverPicUrl + localPath;
    },
    getHainanQrCodeImage: function(options) {
        var obj = Object.assign({}, qcord, options);
        var url = 'http://hainanonline.com/shop/qrcode?';
        return this.getQrCodeImage(url.concat(Object.keys(obj).map(function(prop) {
            return prop + '=' + obj[prop];
        }).join('&')), 130, 130);
    },
    //微信图片 二维码图片
    getWeiXinQrCodeImage: function(type, keyword, success, error) {
        getServerData({ url: Path.getQrCodeImage, data: { type: type, keyword: keyword }, success: success, error: error });
    },

    // getWxQrCode: function(type, keyword, success, error) {
    //     getServerData({ url: Path.getQrCodewx, data: { type: type, keyword: keyword }, success: success, error: error });
    // },

    reportProductData: function(productId, productTypeId) { // 数据上报
        getServerData({
            url: Path.reportData,
            data: { productId: productId, productTypeId: productTypeId, createTime: new Date().toLocaleString('zh', { hour12: false }) }
        });
    },
    // getPlayInfo: function(type, success, error) {
    //     getServerData({ url: Path.getPlayInfo, data: { type: type }, success: success, error: error });
    // }
    getPlayInfo: function(typeTag, success, error) {
        getServerData({ url: Path.getPlayInfo, data: { typeTag: typeTag }, success: success, error: error });
    }

};