//server API
// var ServerPath = {
//     channel_list: Config.serverUrl + 'channel_list.jspx',
//     content_list: Config.serverUrl + 'content_list.jspx',
//     list_count: Config.serverUrl + 'content_getTotal.jspx',
//     channel_count: Config.serverUrl + 'channel_getTotal.jspx',
//     channel: Config.serverUrl + 'channel_get.jspx',
//     marquee: Config.serverUrl + 'getMarquee.jspx',
//     content: Config.serverUrl + 'content_get.jspx',
//     confirm: Config.serverUrl + 'exchangeContent.jspx',
// };

// var ServerAPI = {
//     getChannelList: function(parentId, first, count, successCallBack, failCallBack) {
//         var url = ServerPath.channel_list + "?parentId=" + parentId + "&first=" + first + "&count=" + count;
//         var http = new Ajax({ url: url, success: successCallBack, error: failCallBack });
//         http.get();
//         return http;
//     },
//     getListCount: function(channelIds, successCallBack, failCallBack) {
//         var url = ServerPath.list_count + "?channelIds[]=" + channelIds;
//         var http = new Ajax({ url: url, success: successCallBack, error: failCallBack });
//         http.get();
//         return http;
//     },
//     getChannelCount: function(parentId, successCallBack, failCallBack) {
//         var url = ServerPath.channel_count + "?parentId=" + parentId;
//         var http = new Ajax({ url: url, success: successCallBack, error: failCallBack });
//         http.get();
//         return http;
//     },
//     getChannel: function(parentId, siteId, successCallBack, failCallBack) {
//         var url = ServerPath.channel + "?id=" + parentId + "&siteId=" + siteId;
//         var http = new Ajax({ url: url, success: successCallBack, error: failCallBack });
//         http.get();
//         return http;
//     },
//     getContentList: function(channelIds, first, count, successCallBack, failCallBack) {
//         var url = ServerPath.content_list + "?channelIds[]=" + channelIds + "&first=" + first + "&count=" + count;
//         var http = new Ajax({ url: url, success: successCallBack, error: failCallBack });
//         http.get();
//         return http;
//     },
//     getMarquee: function(successCallBack, failCallBack) {
//         var url = ServerPath.marquee;
//         var http = new Ajax({ url: url, success: successCallBack, error: failCallBack });
//         http.get();
//         return http;
//     },
//     getContent: function(contentId, successCallBack, failCallBack) {
//         var url = ServerPath.content + "?contentId=" + contentId;
//         var http = new Ajax({ url: url, success: successCallBack, error: failCallBack });
//         http.get();
//         return http;
//     },
//     confirm: function(data, successCallBack, failCallBack) {
//         var url = ServerPath.confirm;
//         var http = new Ajax({ url: url, success: successCallBack, error: failCallBack, contentType: 'application/x-www-form-urlencoded' });
//         http.post(data);
//         return http;
//     }
// };

// var MonitorPath = {
//     columns: Config.monitorUrl + 'GetColumns',
// }

var MonitorAPI = {
    getColumns: function(successCallBack, failCallBack) {
        var url = Config.monitorUrl + "GetFolderContents?dataType=json";
        var http = new Ajax({ url: url, success: successCallBack, error: failCallBack });
        http.post('<GetFolderContents assetId="MANU50082" portalId="1" account="8001002110042106" client="8001002110042106" includeFolderProperties="Y" includeSubFolder="Y"/>');
        return http;
    },
    getColumnsone: function(assetID, successCallBack, failCallBack) {
        var url = Config.monitorUrl + "GetFolderContents?dataType=json";
        var http = new Ajax({ url: url, success: successCallBack, error: failCallBack });
        http.post('<GetFolderContents assetId="' + assetID + '" portalId="1" account="1" client="1" includeSelectableItem="Y" startAt="1" maxItems="400" queryAssetIsOtt="Y"/>');
        return http;
    },
    getColumnstwo: function(assetID, successCallBack, failCallBack) {
        var url = Config.monitorUrl + "GetFolderContents?dataType=json";
        var http = new Ajax({ url: url, success: successCallBack, error: failCallBack });
        http.post('<GetFolderContents assetId="' + assetID + '" portalId="1" account="1" client="1" includeSelectableItem="Y" startAt="1" maxItems="18" queryAssetIsOtt="Y" />');
        return http;
    },
    getColumnsthree: function(assetID, startAt, maxItems, successCallBack, failCallBack) {
        var url = Config.monitorUrl + "GetFolderContents?dataType=json";
        var http = new Ajax({ url: url, success: successCallBack, error: failCallBack });
        http.post('<GetFolderContents assetId="' + assetID + '" portalId="1" account="1" client="1" includeSelectableItem="Y" startAt="' + startAt + '" maxItems="' + maxItems + '" queryAssetIsOtt="Y" />');
        return http;
    },
}

var ServerAPI = {
    getPlayURL: function(assetID, successCallBack, failCallBack) {
        var url = Config.monitorUrl + "getPlayURL?dataType=json";
        var http = new Ajax({ url: url, success: successCallBack, error: failCallBack });
        http.post('{"productCode": "vod","userCode": "8555002461150359","assetID":"' + assetID + '","terminalType": 7,"resolution": "1280*720","playType": 1,"fmt":"1","providerID": "MASGD","version": "1.2.24"}');
        return http;
    },
}
