/**
 * @description 页面在取数据时，涉及到所有URL前缀接口部分 。
 * @param {string}
    * URL.VOD_getRootContent为接口URL,注所有"键"都是以模块名称加"_"开头，如"VOD_"，以接口方法名结尾"getRootContent",取根栏目接口方法名
 * @param {string} "/column/columnAction!getRootContent.action" 根栏目数据请求接口
 * @return 共48个接口URL
 */

var URL = {
    /**********   包月接口    **********/
    "VOD_getMonthOrder" : "/monthOrderAction",

    /**********   取根套餐栏目    **********/
    "VOD_getRootContent" : "/GetRootContents",

    /**********   取子栏目    **********/
    "VOD_getChildColumnList" : "/GetFolderContents",

    /**********   取栏目下的媒资列表    **********/
    "VOD_getAssetList" : "/GetFolderContents",

    /**********   取关联节目    **********/
    "VOD_getAssociatedAsset" : "/GetAssociatedFolderContents",

    /**********   获取影片详情    **********/
    "VOD_getAssetDetail" : "/GetItemData",

    /**********   获取点播排行信息（单片、电视剧、新闻等）    **********/
    "VOD_getPlayTop" : "/GetOnDemandRanking",

    /**********   vod搜索（站点全局搜索或指定栏目搜索）    **********/
    "VOD_getAssetListByKeyword" : "/SearchAction",

    /**********   对资源进行推荐（人气）或好评    **********/
    "VOD_recommendAsset" : "/RecommandProgram",

    /**********   检查购买    **********/
    "VOD_checkBuy" : "/ValidatePlayEligibility",

    /**********   购买    **********/
    "VOD_doBuy" : "/Purchase",

    /**********   获取播放时的Token    **********/
    "VOD_getToken" : "/SelectionStart",

    /**********   获取产品的价格、优惠信息    **********/
    "VOD_getPrice" : "/GetUpsellOffer",

    /**********   vod点播获取播放列表（试看 & 正看）    **********/
    "VOD_getPlaylist" : "/GetPlaylist",

    /**********   vod书签播放    **********/
    "VOD_bookmarkPlay" : "/SelectionResume",

    /**********   vod书签列表    **********/
    "VOD_getVodFavorites" : "/GetSavedPrograms",

    /**********   检查电视剧书签    **********/
    "VOD_checkBookmark" : "/CheckSavedProgram",

    /**********   vod保存书签    **********/
    "VOD_saveVodFavorites" : "/AddSavedProgram",

    /**********   vod增加收藏    **********/
    "VOD_addSavedProgram" : "/AddBookmark",

    /**********   vod获取收藏    **********/
    "VOD_getSavedProgram" : "/GetBookmarks",

    /**********   vod删除收藏    **********/
    "VOD_removeVodFavorites" : "/DeleteBookmark",


    /**********   vod点播记录查询    **********/
    "VOD_getHistorys" : "/GetHistorys",

    /**********   btv频道列表    **********/
    "BTV_getChannelList" : "/GetChannels",

    /**********   btv节目列表    **********/
    "BTV_getProgramList" :"/GetPrograms",

    /**********   btv关联节目    **********/
    "BTV_getAssociatedProgram" : "/GetAssociatedPrograms",

    /**********   btv节目播放    **********/
    "BTV_getTvPlayRtsp" : "/ChannelSelectionStart",

    /**********   NPVR录像清单列表数据 **********/
    "NPVR_recordList" : "/NpvrRecordListAction",

    /**********   npvr的录制功能    **********/
    "NPVR_saveRecord" : "/NpvrProgramAction",

    /**********   获取BOSS用户信息    **********/
    "VOD_queryUserInfo" : "/QueryUserInfo",

    /**********   获取二维码    **********/
    "VOD_cdQRCode" : "/GetCDQRCode",

    /**********   查询订单相关结果  **********/
    "VOD_queryPaymentResult" : "/QueryPaymentResult",

    /**********   预订购    **********/
    "VOD_prePurchase" : "/PrePurchase"

};
var getData = {
	 /*   获取该栏目节点栏目详情、栏目下子栏目列表、栏目下节目列表信息、电视剧详情与电视剧子集列表。
	 * 参数说明:
	 * _config = {
	 * 		param : columnId 栏目Id
	 * 	    param : listPageSize 显示条数
	 * 	    param : curPage 当前页码
	 * }
	 * 
	 * */
	 cate : function(_config) {
         var columnId =  _config.columnId || "";
         var listPageSize = _config.listPageSize || 12;
         var curPage = _config.curPage || 1;
         var startAt = (curPage - 1)*listPageSize + 1;
         var VOD_getColumnList = {
             "data":"<GetFolderContents  mergeTV='1' maxItems='"+listPageSize+"' startAt='"+startAt+"' includeFolderProperties='Y'  includeSubFolder='Y' includeSelectableItem='Y' assetId='"+columnId+"' portalId='"+portalId+"' client='"+cardId+"' account='"+userId+"'/>",
             "callBack":_config.callBack
         };
         IEPG.getData(URL.VOD_getAssetList, VOD_getColumnList);
	 },
	 /*   根据栏目id获取栏目下的推荐节目 
      * 参数说明:
      * _config = {
      * 		param : assetId 媒资Id
      * 	    param : listPageSize 显示条数
      * 	    param : curPage 当前页码
	 * 
	 * */
	 recList : function(_config) {
         var assetId =  _config.assetId || "";
         var listPageSize = _config.listPageSize || 3;
         var VOD_getAssociatedAsset = {//关联媒资
             "data":"<GetAssociatedFolderContents  mergeTV=\"1\"  quickId=\"" +assetId + "\" targetLabel=\"A" + "\" startAt=\"1"  + "\" maxItems=\"" +listPageSize + "\" associatedType=\"4" + "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
             "callBack" : _config.callBack
         };
         IEPG.getData(URL.VOD_getAssociatedAsset, VOD_getAssociatedAsset);
	 },	
	 /*   根据栏目id获取栏目下的推荐节目 
	 * 参数说明:
	 * _config = {
	 * 		param : cateId 栏目ID
	 * 	  handler ：handler回调函数
	 * }
	 * 
	 * */
	 recNewsList : function(_config) {
			var curPage = _config.curPage || 1;
    		var pageSize = _config.pageSize || 999;
			var recommendNum = _config.recommendNum || 3;
			this.url = "CatalogListAction.do?userId=" + userId + "&svstype=vodcate&recommendNum="+recommendNum+"&cateId="+_config.cateId + "&curPage=" + curPage + "&pageSize=" + pageSize;
			this.get(_config.handler, _config.param);
	 },	 	 
	 /* 检查套餐栏目是否购买
	 * 参数说明:
	 * _config = {
	 * 		param : 套餐传catalogId 栏目ID，单片传catalogResourceId 影片上下架id，如果是资源包子集，再传个子集的资源resourceId
	 * 	  handler ：handler回调函数
	 * }
	 * 
	 * */
	 checkBuy : function(_config) {
         var serviceId= _config.serviceId ||"";
         var columnId = _config.columnId ||"";
         var isColumnAuth =  _config.isColumnAuth ||"N";
         if(isColumnAuth=="Y")
         {
             var VOD_checkBuy = {  //栏目鉴权鉴权
                 "data":"<ValidatePlayEligibility  serviceId=\"\" assetId=\"" + columnId +"\" isColumnAuth=\"" + isColumnAuth +"\"  portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
                 "callBack":_config.callBack
             };
             IEPG.getData(URL.VOD_checkBuy, VOD_checkBuy);
         }else{
             var VOD_checkBuy = {  //非按栏目鉴权
                 "data":"<ValidatePlayEligibility  serviceId=\""+ serviceId+"\"  portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
                 "callBack":_config.callBack
             };
             IEPG.getData(URL.VOD_checkBuy, VOD_checkBuy);
         }
	 },
	 /*   显示套餐订购列表
	 * 参数说明:
	 * _config = {
	 * 		param : mainPmId 资源上架ID
	 * 	  handler ：handler回调函数
	 * }
	 * 
	 * */
	 buyList : function(_config,flag) {
		var cateId = _config.cateId|| "";
		var buyType=_config.buyType|| "vod";
		if(cateId ==""){
			 this.url = "BuyCatalogTip.do?userId=" +userId + "&svstype=yytc&catalogResourceId=" +_config. mainPmId;	 
		}else{
			this.url = "BuyCatalogTip.do?userId=" +userId + "&svstype=yytc&cateId=" +cateId;
		}
		if(flag){
			this.url = this.url.replace("BuyCatalogTip","BuyCatalogTipNew");
        }
        if(buyType!=="vod"){
			if(_config.channelId!="" && _config.channelId!="undefined"){
				this.url = "BuyCatalogTip.do?userId=" +userId + "&svstype=yytc&serviceCode=" +_config.serviceCode+"&channelId="+_config.channelId;
			}else{
				this.url = "BuyCatalogTipNew.do?userId=" +userId + "&svstype=yytc&serviceCode=" +_config.serviceCode;				
			}
		}
		this.get(_config.handler);
	 },
	/** @description  取栏目下子栏目  
	 * 参数说明:
	 * _config = {
	 * 		param : cateId 或   serviceCode
	 * 	  handler ：handler回调函数
	 * }
	 * 
	 * */
    subCate : function(_config) {
        var columnId =  _config.columnId || "";
        var listPageSize = _config.listPageSize || 999;
        var curPage = _config.curPage || 1;
        var startAt = (curPage - 1)*listPageSize + 1;
        var VOD_getColumnList = {
            "data":"<GetFolderContents  mergeTV='1' maxItems='"+listPageSize+"' startAt='"+startAt+"' includeFolderProperties='Y'  includeSubFolder='Y' includeSelectableItem='Y' assetId='"+columnId+"' portalId='"+portalId+"' client='"+cardId+"' account='"+userId+"'/>",
            "callBack":_config.callBack
        };
        IEPG.getData(URL.VOD_getAssetList, VOD_getColumnList);
    },
	/** @description  获取栏目下的影片列表节目
	 * 参数说明:
	 * _config = {
	 * 		param : cateId 或   serviceCode
	 * 	  curPage : 当前页码
	 *   pageSize : 数据显示长度
	 * 	  handler ：handler回调函数
	 * }
	 * */    
    list : function(_config) {
        var assetId =  _config.assetId || "";
        var listPageSize = _config.listPageSize || 12;
        var curPage = _config.curPage || 1;
        var startAt = (curPage - 1)*listPageSize + 1;
        var VOD_getColumnList = {
            "data":"<GetFolderContents  mergeTV='1' maxItems='"+listPageSize+"' startAt='"+startAt+"' includeFolderProperties='Y'  includeSubFolder='Y' includeSelectableItem='Y' assetId='"+assetId+"' portalId='"+portalId+"' client='"+cardId+"' account='"+userId+"'/>",
            "callBack":_config.callBack
        };
        IEPG.getData(URL.VOD_getAssetList, VOD_getColumnList);
    },
	/** @description  获取详情页面数据
	 * 参数说明:
	 * _config = {
	 * 		 columnId :  栏目Id
     * 		 assetid : 媒资id
     * 		 providerId : 提供商Id
	 * }
	 * */
    detail : function(_config){
        var columnId =  _config.columnId || "";
        var assetId =  _config.assetId || "";
        var providerId =  _config.providerId || "";
        var VOD_getAssetDetail = {//媒资详情
            "data":"<GetItemData  folderAssetId=\""+columnId +"\" titleProviderId=\"" + providerId + "\" titleAssetId=\"" + assetId + "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
            "callBack":_config.callBack
        };
        IEPG.getData(URL.VOD_getAssetDetail, VOD_getAssetDetail);
    },
	/** @description  获取电视剧子集详情页面数据
	 * 参数说明:
	 * _config = {
     * 		 assetid : 媒资id
     * 		 providerId : 提供商Id
	 * }
	 * */
    mediaDetail : function(_config){
        var providerId =  _config.providerId || "";
        var assetId =  _config.assetId || "";
        var VOD_getAssetSubDetail = {//媒资详情
            "data":'<GetFolderContents titleProviderId="'+providerId+'" mergeTV="1" assetId="'+assetId+'" portalId="'+portalId+'" client="'+cardId+'" account="'+userId+'"  includeFolderProperties="Y" includeSubFolder="Y" includeSelectableItem="Y"/>',
            "callBack":_config.callBack
        };
        IEPG.getData(URL.VOD_getAssetList, VOD_getAssetSubDetail);
    },
	/** @description  获取详情连续剧数据(校验书签)
	 * 参数说明:
	 * _config = {
     * 		 assetid : 媒资id
     * 		 providerId : 提供商Id
	 * }
	 * */
    mediaList : function(_config){
        var providerId =  _config.providerId || "";
        var assetId =  _config.assetId || "";
        var VOD_getAssetSubDetail = {//媒资详情
            "data":'<GetFolderContents titleProviderId="'+providerId+'" mergeTV="1" assetId="'+assetId+'" portalId="'+portalId+'" client="'+cardId+'" account="'+userId+'"  includeFolderProperties="Y" includeSubFolder="Y" includeSelectableItem="Y"/>',
            "callBack":_config.callBack
        };
        IEPG.getData(URL.VOD_getAssetList, VOD_getAssetSubDetail);
    },
	
	/** @description  获取详情连续剧数据(校验收藏)
	 * 参数说明:
	 * _config = {
     * 		 assetid : 媒资id
     * 		 providerId : 提供商Id
	 * }
	 * */
    mediaList2 : function(_config){
        var providerId =  _config.providerId || "";
        var assetId =  _config.assetId || "";
        var VOD_getAssetSubDetail = {//媒资详情
            "data":'<GetFolderContents titleProviderId="'+providerId+'" mergeTV="1" assetId="'+assetId+'" portalId="'+portalId+'" client="'+cardId+'" account="'+userId+'"  includeFolderProperties="Y" includeSubFolder="Y" includeSelectableItem="Y"/>',
            "callBack":_config.callBack
        };
        IEPG.getData(URL.VOD_getAssetList, VOD_getAssetSubDetail);
    },
	
	/** @description  获取收藏的影片数据
	 * 参数说明:
	 * _config = {
	 * 	  curPage : 当前页码
	 *   pageSize : 数据显示长度
	 * 	  handler ：handler回调函数
	 * }
	 * */
    collectList : function(_config){
        var columnId =  _config.columnId || "";
        var assetId =  _config.assetId || "";
        var custom =  _config.custom || "VOD";
        var VOD_saveVodFavorites = {
            "data":"<AddBookmark titleAssetId=\"" + assetId +"\" custom=\"" + custom+"\" folderAssetId=\"" + columnId + "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
            "callBack":_config.callBack
        };
        IEPG.getData(URL.VOD_addSavedProgram, VOD_saveVodFavorites);
    },
    /**
     *
     * @param _config
     */
    recommendProgram: function(_config){
        var assetId =  _config.assetId || "";
        var providerId =  _config.providerId || "";
        var VOD_recommendProgram = {
            "data":"<RecommandProgram assetId =\"" + assetId +"\" providerId=\"" + providerId + "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
            "callBack":_config.callBack
        };
        IEPG.getData(URL.VOD_recommendAsset, VOD_recommendProgram);
    },
    selectionStart: function(_config){
        if(_config.tryFlag == "1"){
            var VOD_getToken = {
                "data":"<SelectionStart titleProviderId=\""+ _config.providerId +"\" titleAssetId=\"" + _config.resourceId + "\" folderAssetId=\"\" serviceId=\"\" playPreview=\"Y\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
                "callBack" : _config.callBack
            };
        }else{
            var VOD_getToken = {
                "data":"<SelectionStart titleProviderId=\""+ _config.providerId +"\" titleAssetId=\"" + _config.resourceId + "\" folderAssetId=\""+ _config.columnMapId+"\" serviceId=\"\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
                "callBack" : _config.callBack
            };
        }
        IEPG.getData(URL.VOD_getToken, VOD_getToken);
    },
	/** @description  获取收藏的回看频道数据
	 * 参数说明:
	 * _config = {
	 * 	  curPage : 当前页码
	 *   pageSize : 数据显示长度
	 * 	  handler ：handler回调函数
	 * }
	 * */
    tvCollectList : function(_config){
        var columnId =  _config.columnId || "";
        var listPageSize = _config.listPageSize || 12;
        var curPage = _config.curPage || 1;
        var startAt = (curPage - 1)*listPageSize + 1;
        var VOD_getSavedProgram = {
            "data" : "<GetBookmarks  startAt=\"" + startAt + "\" maxItems=\"" + listPageSize +"\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
            "callBack":_config.callBack
        };
        IEPG.getData(URL.VOD_getSavedProgram, VOD_getSavedProgram);
    },	
	weekFilmTop : function(_config){
    	var curPage = _config.curPage || 1;
    	var pageSize = _config.pageSize || 999;
        this.url = "WeekPlayTop.do?userId=" + userId + "&pageSize="+ pageSize +"&pkgFlag=2&curPage="+ curPage+"&searchCataIds="+searchCataIds;
        this.get(_config.handler);
    },	
	filmTop : function(_config){
    	var curPage = _config.curPage || 1;
    	var pageSize = _config.pageSize || 999;    	
        this.url = "MoviePm.do?userId=" + userId + "&pageSize="+ pageSize +"&flag=top&svstype=assetData&pkgFlag=2&curPage="+ curPage+"&searchCataIds="+searchCataIds;
        this.get(_config.handler);  
    },	
	weekTvTop : function(_config){
    	var curPage = _config.curPage || 1;
    	var pageSize = _config.pageSize || 999;    	
        this.url = "WeekPlayTop.do?userId=" + userId + "&pageSize="+ pageSize +"&pkgFlag=1&curPage="+ curPage+"&searchCataIds="+searchCataIds;
        this.get(_config.handler);  
    },	
	tvTop : function(_config){
    	var curPage = _config.curPage || 1;
    	var pageSize = _config.pageSize || 999;    	
        this.url = "MoviePm.do?userId=" + userId + "&pageSize="+ pageSize +"&flag=top&svstype=assetData&pkgFlag=1&curPage="+ curPage+"&searchCataIds="+searchCataIds;
        this.get(_config.handler);  
    },	
 
 
 
	/** @description  获取收藏的回看频道数据
	 * 参数说明:
	 * _config = {
	 * 	  curPage : 当前页码
	 *   pageSize : 数据显示长度
	 * 	  handler ：handler回调函数
	 * }
	 * */
    channelCollectList : function(_config){
        var columnId =  _config.columnId || "";
        var listPageSize = _config.listPageSize || 12;
        var curPage = _config.curPage || 1;
        var startAt = (curPage - 1)*listPageSize + 1;
        var VOD_getSavedProgram = {
            "data" : "<GetBookmarks  startAt=\"" + startAt + "\" maxItems=\"" + listPageSize +"\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
            "callBack":_config.callBack
        };
        IEPG.getData(URL.VOD_getSavedProgram, VOD_getSavedProgram);
    },
	/** @description  删除收藏的影片数据
	 * 参数说明:
	 * _config = {
	 * 	   pmId :  节目上架Id
	 *  handler ： handler回调函数
	 * }
	 * */    
	delCollect : function(_config) {
      var assetId =  _config.assetId || "";
      var serviceType =  _config.serviceType || "VOD";
      var VOD_removeFavorites = {
          "data":"<DeleteBookmark titleAssetId=\"" + assetId +"\" custom=\"" + serviceType+ "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
          "callBack":_config.callBack
      };
      IEPG.getData(URL.VOD_removeVodFavorites, VOD_removeFavorites);
	},
	
	 /**********   获取点播排行信息    **********/
	top : function(_config){
         var listPageSize = _config.listPageSize || 12;
         var columnId =  _config.columnId || "";
         var curPage = _config.curPage || 1;
         var startAt = (curPage - 1) * listPageSize + 1;
         var showType = _config.showType;
         if(_config.days){
             var days = _config.days;
             var  VOD_getPlayTop = {
                 "data" : "<GetOnDemandRanking days=\"" + days + "\" showType=\"" + showType + "\" mergeTV=\"1\"  startAt=\"" + startAt + "\" maxItems=\"" + listPageSize +"\" portalId=\"" + portalId +"\" folderAssetId=\"" + columnId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
                 "callBack":_config.callBack
             };
         } else {
             var  VOD_getPlayTop = {
                 "data" : "<GetOnDemandRanking showType=\"" + showType + "\" mergeTV=\"1\"  startAt=\"" + startAt + "\" maxItems=\"" + listPageSize +"\" portalId=\"" + portalId +"\" folderAssetId=\"" + columnId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
                 "callBack":_config.callBack
             };
         }
         IEPG.getData(URL.VOD_getPlayTop, VOD_getPlayTop);
	}, 
	
	/** @description  获取搜索页面数据 
	 * 参数说明:
	 * _config = {
	 * 	  forward : 跳转路径
	 *    keyword : 关键字
	 * type : 1：影片名称，2：演员 ，3：导演
	 * 	  curPage : 当前页码
	 *   pageSize : 数据显示长度
	 * 	  handler : handler回调函数
	 * }
	 * */     
    search : function(_config){
        var searchTimer;
        clearTimeout(searchTimer);
        var keyword =  _config.keyword || "";
        var searchType = _config.searchType || "VOD";
    	var curPage = _config.curPage || 1;
    	var listPageSize = _config.listPageSize || 999;
        var startAt = (curPage - 1)*listPageSize + 1;
        var VOD_getAssetListByKeyword = {//媒资详情
            "data" : "<SearchAction mergeTV=\"1\"  keywordType=\"2\" matchType=\"1\"  keyword=\"" + keyword + "\" startAt=\""+startAt+"\" maxItems=\""+pageSize+"\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId+"\"><UserParams><FilterBoxes showType=\""+searchType+"\" ></FilterBoxes></UserParams></SearchAction>",
            "callBack":_config.callBack
        };
         searchTimer = setTimeout(function(){
            IEPG.getData(URL.VOD_getAssetListByKeyword, VOD_getAssetListByKeyword);
        },400);
    },
	
	/** @description  获取书签列表数据 
	 * 参数说明:
	 * _config = {
	 * 	  curPage : 当前页码
	 *   pageSize : 数据显示长度
	 *    handler : handler回调函数
	 * }
	 * */    
	bookMarkList : function(_config) {
        var columnId =  _config.columnId || "";
        var listPageSize = _config.listPageSize || 12;
        var curPage = _config.curPage || 1;
        var startAt = (curPage - 1)*listPageSize + 1;
        var VOD_getSavedProgram = {
            "data" : "<GetBookmarks  startAt=\"" + startAt + "\" maxItems=\"" + listPageSize +"\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
            "callBack":_config.callBack
        };
        IEPG.getData(URL.VOD_getSavedProgram, VOD_getSavedProgram);
	},
      

	/** @description  获取历史点播数据
	 * 参数说明:
	 * _config = {
	 * 	  curPage : 当前页码
	 *   pageSize : 数据显示长度
	 *    handler : handler回调函数
	 * }
	 * */        
	vodhistoryList : function(_config) {
        var listPageSize = _config.listPageSize || 12;
        var curPage = _config.curPage || 1;
        var startAt = (curPage - 1)*listPageSize + 1;
        var VOD_getHistorys = {
            "data" : "<GetHistorys mergeTV=\"1\" startAt=\"" + startAt + "\" maxItems=\"" + listPageSize +"\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
            "callBack":_config.callBack
        };
        IEPG.getData(URL.VOD_getHistorys, VOD_getHistorys);
	},
    /** @description  获取历史点播数据
     * 参数说明:
     * _config = {
     * 	  curPage : 当前页码
     *   pageSize : 数据显示长度
     *    handler : handler回调函数
     * }
     * */
    btvhistoryList : function(_config) {
        var listPageSize = _config.listPageSize || 12;
        var curPage = _config.curPage || 1;
        var startAt = (curPage - 1)*listPageSize + 1;
        var VOD_getHistorys = {
            "data" : "<GetHistorys mergeTV=\"1\" startAt=\"" + startAt + "\" maxItems=\"" + listPageSize +"\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
            "callBack":_config.callBack
        };
        IEPG.getData(URL.VOD_getHistorys, VOD_getHistorys);
    },
    
    /** @description  获取页面广告数据
     * 参数说明：placementIds=1001&categoryId=5002&regionId=1000&sno=908343432432
     *  _config = {
     * 		placementIds: 广告位ID
     * 		categoryId: 栏目ID
     * 		regionId :区域ID
     * 		handler: handler回调函数
     * }
     * pageAd.do?placementIds=1001&categoryId=5002&regionId=1000&sno=908343432432&userId
     * */
    pageAdList : function(_config) {
        //重写pageAdList 改为A7 post请求
        var placementIds = _config.placementIds;
        var categoryId = _config.categoryId;
        var regionId = _config.regionId;
        var VOD_getPageAd = {
            "data":'<GetPageAd placementIds="' + placementIds + '" columnId="' + categoryId + '" areaCode="' + regionId +'" portalId="' + portalId + '" client="' + cardId + '" account="' + userId + '"/>',
            "callBack" : _config.callBack
        };
        IEPG.getData("/GetPageAD", VOD_getPageAd);
    	// var placementIds = _config.placementIds;
    	// var categoryId = _config.categoryId;
    	// var regionId = _config.regionId;
    	// var sno = getSid();
    	//
    	// this.url = "pageAd.do?placementIds="+placementIds+"&categoryId="+categoryId+"&regionId="+regionId+"&sno="+sno+"&userId="+userId;
    	// this.get(_config.handler);
    },
    
    /** @description  获取悬浮广告数据
     * 参数说明：placementIds=1001&categoryId=5002&regionId=1000&sno=908343432432
     *  _config = {
     * 		type: 广告类型  0 回看 1点播
     * 		categoryId: 栏目ID
     * 		regionId :区域ID
     * 		programId : 节目ID
     * 		channelId : 频道ID 回看时必须
     * 		handler: handler回调函数
     * }
     * 
     * overlayAd.do?type=1&userId=11&sno=sno123456789&categoryId=50002&regionId=101
     * */
    overlayAdList : function(_config) {
        var type = _config.type;
        var regionId = _config.regionId;
        var programId = _config.programId;
        var overlayAd = "";
        if(type == 1) {// VOD
            var categoryId = _config.categoryId;
            var overlayAd = {
                "data":'<GetOverlayAd client="' + cardId + '" account="' + userId +'" portalId="' + portalId + '" serviceType="' + type + '" areaCode="' + regionId + '" programId="' + programId + '" columnId="' + categoryId + '"/>',
                "callBack" : _config.callBack
            };
        }else if (type == 0){
            var channelId = _config.channelId;
            var overlayAd = {
                "data":'<GetOverlayAd client="' + cardId + '" account="' + userId +'" portalId="' + portalId + '" serviceType="' + type + '" areaCode="' + regionId + '" programId="' + programId + '" channelId="' + channelId + '"/>',
                "callBack" : _config.callBack
            };
        }
        IEPG.getData("/GetOverlayAD", overlayAd);
    	// var type = _config.type;
    	// var regionId = _config.regionId;
    	// var programId = _config.programId;
    	// var sno = getSid();
    	//
    	// if(type == 1){// VOD
    	// 	var categoryId = _config.categoryId;
			// this.url = "overlayAd.do?type="+type+"&regionId="+regionId+"&programId="+programId+"&sno="+sno+"&userId="+userId+"&categoryId="+categoryId;
    	// } else if (type == 0) { // playback
	    // 	var channelId = _config.channelId;
    	// 	this.url = "overlayAd.do?type="+type+"&channelId="+channelId+"&regionId="+regionId+"&programId="+programId+"&sno="+sno+"&userId="+userId;
    	// }
    	// Utility.println("crespo overlayAdList this.url: "+this.url);
    	// this.get(_config.handler);
    },
    
        /** @description  反馈广告显示
     * 参数说明：userId=11&sno=sno12389&terminalType=CA&orderId=123234545
     *  _config = {
     * 		orderId: 订单ID
     * 		handler: handler回调函数
     * }
     * feedback.do?userId=11&sno=sno12389&terminalType=CA&orderId=123234545
     * 
     * */
    adFeedback : function(_config) {
        var orderId = _config.orderId;
        var adFeedback = {
            "data":'<SyncFeedBack client="' + cardId + '" account="' + userId + '" terminalType=\"CA\"' +' portalId="' + portalId + '" orderId="' + orderId + '"/>',
            "callBack" : _config.callBack
        };
        IEPG.getData("/SyncFeedBack", adFeedback);
    	// var orderId = _config.orderId;
    	// var sno = getSid();
    	// var tmpuserId = getUserId();
    	//
    	//
    	// this.url = "feedback.do?userId="+tmpuserId+"&sno="+sno+"&terminalType=CA&orderId="+orderId;
    	// this.get(_config.handler);
    },

	/** @description  获取指定URL的数据 */
	download : function(_config) {
		
		Utility.println("crespo getData get:"+_config.url);
		new ajaxUrl({
			url : _config.url,
			handler : _config.handler
		}, "html");    
	},

    /** @description  获取数据 */
    get : function(_APIUrl, _configs){
        var paramUrl, dataUrl;
        var _data = xmlHead + _configs.data;
        var reqUrl = _APIUrl + "?dataType=json";
        new ajaxUrl(reqUrl, _data);
    }
};

/** @description  获取数据参数判断（主要是区分cateId和serviceCode）*/
function chooseType(_param){
	var param;
    if(!isNaN(_param)){
        param = "columnId=" + _param;
    }else{
        param = "serviceCode=" + _param;
    }
    return param;
}


var dofun = {
	/** @description  收藏节目*/
    onCollect : function(pmJson) {//收藏	
        if (!checkUser()) {
            return;
        }
        var url = "Collect.do?userId=" + userId + "&catalogResourceId=" + pmJson.mainPmId + "&svstype=yytc&type=VOD&url=" + encodeURIComponent(location.href) + "&collectType=vod&resourceId=" + pmJson.resourceId;
        if (pmJson.isPack == 1) {//连续剧中要加入isPack=1
            url = url + "&isPack=1";
        }
		showMsg(epgUrl+url,"");
    },
    /** @description  推荐节目*/
    onRecmd : function(pmJson){//推荐
        if(!checkUser()) {
            return;
        }
        var url = "Recmd.do?userId=" + userId + "&svstype=yytc&recmdType=2&pmId=" + pmJson.resourceId;
		showMsg(epgUrl+url,"");
    }
}; 


// function playNextMedia(packageId, curPmId) {
// clearInterval(countdownTimer);
// $("ok").removeAttribute("onFun");
// var url = epgUrl + "FindNextMedia.do?userId=" + getUserId() + "&packageId=" + packageId + "&curPmId=" + curPmId + "&nextOffset=1";
// //alert(url);
// ajax(url, playNextMediaCB);
// }


//**************************推荐位海报**************
function showRec(recSize,num,width,height){   //recSize为显示海报的个数，num为截取的字符
	for (var i = 0; i < recSize; i++) {
		if (i < recJson.pmList.length) {
			if(recJson.pmList[i].picsrc.length == 0){
				$("pic_" + i).src = epgResUrl+"images/show_pic.jpg";
			}else if(recJson.pmList[i].picsrc.length == 1){
				$("pic_"+i).src = recJson.pmList[i].picsrc[0].src;
			}else{
				$("pic_"+i).src =getPoster(recJson.pmList[i],width, height);
			}
			$("resText_"+i).innerHTML=subText(recJson.pmList[i].name,num,0);
		}else{
			$("pic_"+i).src = epgResUrl+"images/show_pic.jpg";
			$("resText_"+i).innerHTML="";
		}
	}
}

/**
 * @description subText 获取海报
 */
function getPoster(imageList,width,height) {
    var picUrl = defaultPic;
    var standard = 999999;
    if(imageList){
        for(var i = 0; i < imageList.length; i++){
            var imgUrl = imageList[i].posterUrl || imageList[i].displayUrl;
            getImgSize(imageList[i]);
            var distance = Math.sqrt((imageList[i].width - width)*(imageList[i].width - width) + (imageList[i].height - height)*(imageList[i].height - height));
            if(distance < standard){
                standard = distance;
                // picUrl = goUrl+"/"+imgUrl;
                // 天津页面带有iPG前缀，需要去除
                picUrl = goUrl.split("/iPG")[0] + "/" + imgUrl;
            }
        }

    }
    return picUrl;
}
function getImgSize(imgJson){
    if(imgJson.width == 0){
        var url = imgJson.posterUrl || imgJson.displayUrl;
        var width = url.split("/")[1].split("x")[0];
        var height = url.split("/")[1].split("x")[1];
        imgJson.width = parseInt(width,10);
        imgJson.height = parseInt(height,10);
    }else{

    }
}
//---------------------- 按1-8数字键调用方法-----------------------
function goToRec(recData,recSize,cateId){
	if(recSize != 0){  //推荐海报数据长度
		keycode = keycode - 49 >= 0?keycode - 49 : -1;  
		if(recSize - 1 < keycode||keycode<0){  //页面显示的推荐海报个数
			return;
		}else{
			goTo.detail(
                cateId,
                recData[keycode].assetId,
                recData[keycode].providerId,
                recData[keycode].isPackage);
		}
	}
}
//----------------------播放广告---------------------------------
function goToplayAd(resourceId,mainPmId){
		var mpiPara = (mainPmId == "" ) ? "" : "&mainPmId=" + mainPmId;
       // var url = "PreviewPlay.do?userId=" + userId + "&pmId=" + resourceId + "&noAuth=N&svstype=yytc" + mpiPara;
		var url = "PreviewPlay.do?userId=" + userId + "&&svstype=preview&pmId="+ resourceId  +mpiPara;
        new ajaxUrl({
            url : epgUrl + url,
            handler : function(rtspResult) {
				setGlobalVar("nextMediaListFocus","");
				setGlobalVar("prePlayFlag","");
                setGlobalVar("vod_play_type", "0");
				setGlobalVar("vod_ctrl_rtsp", encodeURIComponent(rtspResult.rtsp));
				setGlobalVar("displayName", encodeURIComponent(rtspResult.displayName));
				setGlobalVar("ntpTime", rtspResult.ntpTime);
				var backUrl = location.href;
				setGlobalVar("vod_ctrl_backurl", backUrl);
				setGlobalVar("isBack", "Y");
                AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtspResult.rtsp)+"\",\"E2\",\""+mainPmId+"\",\"E3\",\"0\",\"E4\",\"0\",\"E5\",\"0\",\"D1\",\"0003\",\"D2\",\""+encodeURI(rtspResult.displayName)+"\",\"D3\",\"0\",\"T\",\"V\"]}");
                Utility.ioctlWrite("SEND_BROADCAST", "Broadcast:com.coship.action.uplaod.vodads,Param:E1=\""+encodeURI(rtspResult.rtsp)+"\";E2=\""+mainPmId+"\";E3=\"0\";E4=\"0\";E5=\"0\";D1=\"0003\";D2=\""+encodeURI(rtspResult.displayName)+"\";D3=\"0\",\"T\",\"V\"");
				location.href = epgUrl + "vodctrl1/vodplay.htm";
            }
        });	
	
}

/** @description 页面静态跳转*/
var goTo = {
    /** @description  进入列表页*/
    list : function(_param,_saleType){
    	location.href = epgPageUrl + "nav_list.htm?" + "columnId="+_param+"&saleType="+_saleType;
    },
	listOrDetail : function(_mainPmId,_cateId,isPack) {
		isPack = trim(isPack);
		if(isPack=="1"){
			location.href = epgPageUrl + "news_list.htm?pmId=" + _mainPmId+"&cateId="+_cateId;
		}else{
			location.href = epgPageUrl + "news_detail.htm?pmId=" + _mainPmId+"&cateId="+_cateId+"&isPack="+isPack;
		}
    },
	/** @description  进入套餐频道订购页*/
	tvOrderList: function(serviceCode,channelId){
		globalPath.setUrl();
		location.href="http://10.80.0.61/HD/200908151100/index_ywbl.htm";
		//location.href=epgPageUrl+"order_list.htm?serviceCode="+serviceCode+"&channelId="+channelId;
	},
	 /** @description  进入套餐订购页*/
	orderList: function(){
		//location.href=epgPageUrl+"order_list.htm";
		location.href="http://10.80.0.61/HD/200908151100/index_ywbl.htm";
	},
    /** @description  进入详情页*/
    detail : function(columnId,assetId,providerId,isPack) {
		isPack = trim(isPack+"");
		if(isPack=="1"){
    		location.href = epgPageUrl + "pakg_detail.htm?columnId=" + columnId+"&assetId="+assetId+"&providerId="+providerId;
		}else{
			location.href = epgPageUrl + "movie_detail.htm?columnId=" + columnId+"&assetId="+assetId+"&providerId="+providerId;
		}
    },
    /** @description  进入点播排行*/
    top : function(_param) {
        location.href = epgPageUrl + "top.htm?" + chooseType(_param);
    },
    /** @description  进入我的点播*/
    myZone : function() {
        location.href = epgPageUrl + "myZone.htm";
    },
    /** @description  进入我的搜索*/
    search : function() {
        location.href = epgPageUrl + "daital.htm";
    },
    /** @description  退出回到portal首页*/
    portal : function() {
        globalPath.cleanUrl();
        location.href = getGlobalVar("PORTAL_ADDR");
    },
	/** @description  进入操作帮助*/
    help : function() {
        setGlobalVar("isBack", "Y");
        location.href = epgPageUrl + "help.htm";
    },
    /** @description  进入我的点播操作帮助*/
    wddbhelp : function() {
        setGlobalVar("isBack", "Y");
        location.href = epgPageUrl + "help.htm?helpFlag=wddb";
    },
    /** @description  进入预约录制操作帮助*/
    npvrhelp : function() {
        setGlobalVar("isBack", "Y");
        location.href = epgPageUrl + "help.htm?helpFlag=npvr";
    },
    /** @description  进入录制管理操作帮助*/
    npvrGLhelp: function() {
        setGlobalVar("isBack", "Y");
        location.href = epgPageUrl + "help.htm?helpFlag=npvrgl";
    },
    /** @description  进入单片详情操作帮助*/
    mdhelp: function() {
        setGlobalVar("isBack", "Y");
        location.href = epgPageUrl + "help.htm?helpFlag=md";
    },
    /** @description  进入剧集详情操作帮助*/
    pdhelp: function() {
        setGlobalVar("isBack", "Y");
        location.href = epgPageUrl + "help.htm?helpFlag=pd";
    },
    /** @description  进入热播栏目/新闻中心操作帮助*/
    hwnchelp: function() {
        setGlobalVar("isBack", "Y");
        location.href = epgPageUrl + "help.htm?helpFlag=hwnc";
    },
    nlhelp: function() {
        setGlobalVar("isBack", "Y");
        location.href = epgPageUrl + "help.htm?helpFlag=nl";
    },
    /** @description  返回上一目录*/
    back : function() {
        setGlobalVar("isBack", "Y");
        globalPath.getUrl();
    },
    /** @description  返回index目录*/
    toIndex : function() {
        setGlobalVar("isBack", "Y");
       setGlobalVar("GLOBALURLPATH","");
        location.href = getGlobalVar("PORTAL_INDEX");
    }
};
//检查是否订购后调用的方法，页面实现
function doCheckBuyCallBack(buyFlag){
	
}

var BUY = function(_config) {
    this.name = _config.name || "";
    this.isPack = _config.isPack || "2";
    this.pakgSaleType = _config.pakgSaleType || "";
    this.saleType = _config.saleType || "";
    this.pakgGoodsId = _config.pakgGoodsId || "";
    this.goodsId = _config.goodsId || "";
    this.productId = _config.productId || "";
    this.price = _config.price || "";
    this.mainPmId = _config.mainPmId || "";
	this.resourceId = _config.resourceId || "";
	this.cateId = _config.cateId || "";
    this.noAuth = _config.noAuth || "N";
    this.playType = _config.playType || "0";
	this.breakTime = _config.breakTime || "0";
    this.buyOnlineSupport = _config.buyOnlineSupport || "Y";
    this.prePlayFlag = _config.prePlayFlag || false;
	this.elementId = _config.elementId || "0";
	this.buyFlag = _config.buyFlag || "false"; 
	this.playFlag =  _config.playFlag || "0";
	this.playTime  = _config.playTime;
    this.url = "";
};

BUY.prototype = {
    playAction : function() {
        if(this.pakgSaleType != "") {
            this.saleType = this.pakgSaleType;
        }
        if(this.saleType == "99") {
            this.checkBookMark();
        } else {
            this.checkBuyOK();
        }
    },
    checkBuyOK : function() {
        if(this.pakgGoodsId != "") {
            this.goodsId = this.pakgGoodsId;
        }
		var url="";
        switch(this.saleType) {
            case "2"://套餐
                url = "CheckBuy.do?userId=" + getUserId() + "&svstype=yytc&catalogId=" + this.cateId;
                break;
            case "1"://单片
				url = "CheckBuy.do?userId=" + getUserId() + "&svstype=yytc&catalogResourceId=" + this.mainPmId;
				if(this.isPack=="1"){
					url+="&resourceId=" + this.resourceId;
				}			
                break;
        }
		new ajaxUrl({
			"url" : epgUrl + url,
			"handler" : function(dataJson) {
				doCheckBuyCallBack(dataJson.buyFlag);
			}
		});
		

    },
    doBuyTip : function() {
        var buyTipUrl = "";
		 if(this.saleType == "1"){
			Buy.playTimes=Math.ceil(Buy.playTime/60);  //弹框显示用
			if(this.isPack == "1") {//资源包整包订购(不支持)
				buyTipUrl = "BuyTip.do?userId=" + getUserId() +  "&svstype=yytc" + "&mainPmId=" + Buy.mainPmId + "&pmId="+Buy.resourceId;
				showMsg(epgUrl + buyTipUrl,"");
			} else {   //资源包子集订购
				buyTipUrl = "BuyTip.do?userId=" + getUserId() +  "&svstype=yytc" + "&mainPmId=" + Buy.mainPmId + "&pmId="+Buy.resourceId;
				showMsg(epgUrl + buyTipUrl,"");		
			}
		 }else if(this.saleType == "2"){
			 	getData.buyList({
					"mainPmId" : this.mainPmId,
					"handler" : function(_dataJson) {
						var goodsListData = _dataJson.goodsList;
						var payAmount = parseInt(goodsListData[0].payAmount);
						if(payAmount<2){
							payAmount ="";
						}
						var price=goodsListData[0].price;
						goodsPriceTC = price + " 元/" + payAmount + getGoodsPriceUnit(goodsListData[0].priceUnit);
						goodsName=goodsListData[0].goodsName;
						showMsg(epgUrl + "tip/a_buyPackTip.htm","");
					}
				});			
		 }
    },
	doBuy:function(){
		//mainPmId 整部, pmId 当前集或电影, 不传mainPmId 只传 pmId  表示购买单集或电影,暂时未实现整部购买
		var buyUrl = "";
		if(Buy.goodsId){
			if(this.saleType == "1") {
				buyUrl = "Buy.do?userId=" + getUserId() + "&goodsId=" + Buy.goodsId + "&resourceId=" + Buy.resourceId + "&svstype=yytc";
			} else if(this.saleType == "2") {//套餐
				buyUrl = "Buy.do?userId=" + getUserId() + "&goodsId=" + Buy.goodsId + "&svstype=yytc";
			}
		}else{
			buyUrl = "Buy.do?userId=" + getUserId() + "&pmId=" + Buy.mainPmId + "&resourceId=" + Buy.resourceId + "&svstype=yytc";
		}

		showMsg(epgUrl + buyUrl,"");
	},
	doBookMarkTip:function(){
		var bookMarkTipUrl = "tip/a_bookMarkTip.htm";
		showMsg(epgUrl + bookMarkTipUrl,"");	
	},
    doPlay : function() {
        var pmId = this.resourceId;
        var mainPmId = this.mainPmId;
		setGlobalVar("mainPmId",mainPmId);
		setGlobalVar("resourceId",pmId);
		var noAuth = (this.saleType=="99" || this.prePlayFlag) ? "&noAuth=N" : "";//免费和试看不用鉴权
		var isTrySee = (this.prePlayFlag) ? "&isTry=1" : "";
        if(pmId + "" == mainPmId + "") {pmId = "0";}
        var mpiPara = (mainPmId == "" ) ? "" : "&mainPmId=" + mainPmId;
        this.url = "VodPlay.do?userId=" + userId + "&pmId=" + pmId + "&noAuth="+noAuth+"&svstype=yytc" + mpiPara+isTrySee+"&isHd=1";
        if(Buy.playType == "1") {//从断点时间开始播
            this.url = this.url + "&beginTime=" +Buy.breakTime;
        }
		if(Buy.isPack == "1"){			
			this.saveBookMark();  // 子集开始播放时保存书签
		}
		if(null!=Buy.dismantleId && ""!=Buy.dismantleId){
			this.url += "&dismantleId="+Buy.dismantleId;
		}		
        new ajaxUrl({
            url : epgUrl + this.url,
            handler : function(rtspResultJson) {
				//播放类型，1:VOD点播 2:直播  3:回看
				setGlobalVar("videoPlayType","1")
                getPlayList(rtspResultJson,Buy.prePlayFlag);
            }
        });
    },
    doPrePlay : function() {
		this.url = "PreviewPlay.do?userId=" + userId + "&&svstype=preview&mainPmId=" + pmId + "&pmId="+ Buy.elementId;
		if(Buy.elementId){
			new ajaxUrl({
				url : epgUrl + this.url,
				handler : function(rtspResultJson) {
					getPlayList(rtspResultJson,Buy.prePlayFlag);
				}
			});
		}else {
			showMsg("","您好！很抱歉，该节目不支持预览观看。");
			
		}
    },
    checkBookMark : function() {
        var url = "BookMark.do?pmId=" + Buy.mainPmId + "&subId=" + Buy.resourceId + "&userId=" + userId+ "&invoke=check";
        new ajaxUrl({
            url : epgUrl + url,
            handler : function(resText) {
                var backText = resText;
                var breakTime = backText.bookmark.breakTime;
				Buy.mainPmId = backText.bookmark.pmId;
				Buy.resourceId = backText.bookmark.subId;
                if(breakTime == undefined || breakTime == "" || breakTime == "0") {
                    setGlobalVar("breakTime", "0");
                    Buy.doPlay();
                } else {
					Buy.breakTime = breakTime;
                    Buy.doPlay();
                }
            }
        });
    },
    saveBookMark : function() {
        var breakPoint = getQueryStr(location.href, "vod_ctrl_breakpoint") == "" ? "1" : getQueryStr(location.href, "vod_ctrl_breakpoint");
        if(breakPoint != undefined && breakPoint != "") {
            // 获取节目id,上架ID，若为连续剧，则为资源包的上架ID
            //var pmId = getGlobalVar("BREAKPOINT_PMID");
            var saveUrl = "BookMark.do?pmId=" + this.mainPmId + "&subId=" + this.resourceId + "&userId=" + getUserId() + "&invoke=save&timePosition=" + breakPoint;
            new ajaxUrl({
				url : epgUrl + saveUrl,
				handler : function(xmlHttp) {
               }
            });

        }
    },
    deteleBookMark : function() {
        this.url = "BookMark.do?pmId=" + this.mainPmId + "&subId=" + this.resourceId + "&userId=" + getUserId() + "&invoke=delete";
        new ajaxUrl({
            url : epgUrl + this.url,
            handler : function(xmlHttp) {
            }
        });
    },
    breakPlay : function(flag) {
		if(flag == 1){
			Buy.playType=1;	
		}else{
			Buy.playType=0;	
		}	
		Buy.doPlay();
    }
};
var userProgramId = 0;
function doTvPlay(playJson){
	var playUrl="TvPlay.do?pmId="+playJson.programId+"&noCheck=1&channelId="+playJson.channelId+"&svstype=timeshift&isHd=1&userId="+userId;
	if(playJson.playType==2){
		playUrl="TvPlay.do?pmId="+playJson.programId+"&noCheck=1&channelId="+playJson.channelId+"&svstype=npvr&playType=2&isHd=1&userId="+userId;
	}	
	userProgramId = playJson.programId;
	setGlobalVar("programId",userProgramId);
	setGlobalVar("channelCode",playJson.channelCode);
	var url = epgUrl + playUrl;
	ajaxUrlNotEval(url,function(resText){
			var RTSP = resText;
			if(RTSP.indexOf("a_") >=0){
				var tipDiv = $(tipDivId);
				var tipWindow = $(messInfoId);
				tipDiv.style.visibility = "visible";
				tipWindow.innerHTML = RTSP;
				$("pmName").innerHTML =subText(playJson.name,40,0);
				tipFlag = true;
				//弹出窗口确定按钮Id必须为 OKButton ,OKButton为弹出窗口专用ID
				if($(OKButtonId)){		
					$(OKButtonId).focus();
					
				}
				if(RTSP.indexOf("a_buy") >=0){
					$(OKButtonId).onclick = function() {				
						goTo.tvOrderList(playJson.serviceCode,playJson.channelId);
					};
				}
			}else {
				RTSP = eval("("+resText+")");		
				RTSP.displayName = playJson.name;
				setGlobalVar("VODType","tv");
				setGlobalVar("tvPlayTime",RTSP.tvPlayTime);
				//播放类型，1:VOD点播 2:直播  3:回看
				setGlobalVar("videoPlayType","3")
				getPlayList(RTSP,false);
			}
		
		}
	);
}

// function getADPlayString(contentRefList) {//获取前置视频广告的结束时间、按键响应操作
//     var a = [];
//     for (var i = 0; i < contentList.length; i++) {
//         var type = 1; //正片
//         if (contentRefList[i].trickModesRestricted.indexOf("Z") != -1){
//             type = 0; //广告
//         }
//         if (i == 0) {
//             a[0] = {
//                 s: parseInt(contentRefList[0].start_npt),
//                 e: parseInt(contentRefList[0].end_npt),
//                 o: contentRefList[0].orderId,
//                 v: type
//             };
//         } else {
//             a[i] = {
//                 s: contentRefList[i-1].end_npt,//开始时间就是上一个播放节的结束时间
//                 e: contentRefList[i-1].end_npt + parseInt(contentRefList[i].end_npt) - parseInt(contentRefList[i].start_npt),//结束时间是上一个节目的结束时间+本节目的结束时间-本节目的开始时间
//                 o: contentRefList[i].orderId,
//                 v: type
//             };
//         }
//     }
//     return JSON.stringify(a);
// }
//数据上报智能盒子 星红安
function sendMsgFromSmartSTB(videoPlayType) {
    var rtsp = encodeURI(decodeURIComponent(getGlobalVar("vod_ctrl_rtsp")));
    var columnId = getGlobalVar("catalogId");
    var name = encodeURI(decodeURIComponent(getGlobalVar("displayName")));
    if(videoPlayType == 1){
        AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+rtsp+"\",\"E2\",\""+columnId+"\",\"E3\",\"0\",\"E4\",\"0\",\"E5\",\"0\",\"D1\",\"0003\",\"D2\",\""+name+"\",\"D3\",\"0\",\"T\",\"V\"]}");
        Utility.ioctlWrite("SEND_BROADCAST", "Broadcast:com.coship.action.uplaod.vod,Param:E1=\""+rtsp+"\";E2=\""+columnId+"\";E3=\"0\";E4=\"0\";E5=\"0\";D1=\"0003\";D2=\""+name+"\";D3=\"0\",\"T\",\"V\"");
    }else{
        AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+rtsp+"\",\"E2\",\""+columnId+"\",\"E3\",\"0\",\"E4\",\"0\",\"E5\",\"0\",\"D1\",\"0002\",\"D2\",\""+name+"\",\"D3\",\"0\",\"T\",\"V\"]}");
        Utility.ioctlWrite("SEND_BROADCAST", "Broadcast:com.coship.action.upload.playback,Param:E1=\""+rtsp+"\";E2=\""+columnId+"\";E3=\"0\";E4=\"0\";E5=\"0\";D1=\"0002\";D2=\""+name+"\";D3=\"0\",\"T\",\"V\"");
    }
}
function setAdGlobalVars(contentRefList) {
    var contentList = new Array();
    for (var i = 0; i < contentRefList.length; i++) {
        var json = {};
        if (contentRefList[i].trickModesRestricted.indexOf("Z") != -1){
            json.v = 0; //广告
        } else {
            json.v = 1; //正片
        }
        json.s = contentRefList[i].start_npt;
        json.e = contentRefList[i].end_npt;
        json.t = contentRefList[i].trickModesRestricted;
        json.o = contentRefList[i].orderId;
        contentList.push(json);
    }
    var newvideoList=[];
    var fbVideoAdList = [];
    for(i=0;i<contentList.length;i++){
        var json={};
        if(i==0){
            json.s=+contentList[i].s;
            json.e=+contentList[i].e;
        }else{
            json.s=+newvideoList[i-1].e;
            json.e=+json.s+(contentList[i].e-contentList[i].s);
        }
        json.v=contentList[i].v;
        json.o=contentList[i].o;
        // 广告流不能进行播控 crespo
        if(contentList.v == 0){
            json.t = "FRPD";
        } else {
            json.t=contentList[i].t;
        }
        newvideoList.push(json);
        // f 字段标识该广告是否已反馈
        json.f = "n";
        fbVideoAdList.push(json);
    }
    var videoList=JSON.stringify(contentList);	 ////将对象转换成字符串
    setGlobalVar("videoList", videoList); //原播放串  断点时间需要
    var json=JSON.stringify(newvideoList); // 将对象转换成字符串
    setGlobalVar("video",json); //构造后新的播放串 断点时间及权限控制需要
    var fbVAdListStr =JSON.stringify(fbVideoAdList);
    setGlobalVar("fbVAdList",fbVAdListStr);
    setGlobalVar("adJSON",json);//拼接好的播放串 显示广告倒计时
}
function getPlayList(rtspResult,prePlayFlag){
	
	var videoPlayType = getGlobalVar("videoPlayType");

	if (prePlayFlag) {//预览
		//var rtspResult =  eval('('+resText+')');
        setGlobalVar("prePlayFlag", "Y");
        setGlobalVar("vod_play_type", "1");
        setGlobalVar("vod_ctrl_rtsp", encodeURIComponent(rtspResult.rtsp));
        setGlobalVar("displayName", encodeURIComponent(rtspResult.displayName));
        setGlobalVar("ntpTime", rtspResult.ntpTime);
		var backUrl = location.href;
		setGlobalVar("vod_ctrl_backurl", backUrl);
    	setGlobalVar("isBack", "Y");
        AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtspResult.rtsp)+"\",\"E2\",\"0\",\"E3\",\"1\",\"E4\",\"0\",\"E5\",\"0\",\"D1\",\"0003\",\"D2\",\""+encodeURI(rtspResult.displayName)+"\",\"D3\",\"0\",\"T\",\"V\"]}");
		location.href = epgUrl + "vodctrl1/vodplay.htm";
    } else {
        setGlobalVar("vod_play_type", "0");
	 	//var rtspResult =  eval('('+resText+')');
		var ListLength = rtspResult.video.length; 
		//*****************************************************
			      /*A  0-800     (0,800)      ---正片
					B  800-1100  (0-300)      ---广告
					C  1100-4100 (800-3800)   ---正片
					D  4100-4600 (0-500)      ---广告
					E  4600-8000 (3800-7200)  ---正片 */
		//*****************************************************
		//将取出的播放列表拼装成一个完成的播放进度条
		//var contentid=rtspResult.rtsp.substring(rtspResult.rtsp.lastIndexOf("/") + 1,rtspResult.rtsp.indexOf("^"));
  		var newvideoList=[];
  		var fbVideoAdList = [];
		  for(i=0;i<ListLength;i++){  
			var json={};
			if(i==0){
			  json.s=+rtspResult.video[i].s;
			  json.e=+rtspResult.video[i].e;
			}else{				
			 json.s=+newvideoList[i-1].e;
			 json.e=+json.s+(rtspResult.video[i].e-rtspResult.video[i].s);
			}
			json.v=rtspResult.video[i].v;
			json.o=rtspResult.video[i].o;
			
			// 广告流不能进行播控 crespo
			if(rtspResult.video[i].v == 0){
				json.t = "FRPD";
			} else {
				json.t=rtspResult.video[i].t;
			}
			newvideoList.push(json);
			// f 字段标识该广告是否已反馈 
			json.f = "n";  
			fbVideoAdList.push(json);
		}		
    	var videoList=JSON.stringify(rtspResult.video);	 ////将对象转换成字符串
    	
//  	Utility.println("crespo commonAPI getPlayList rtspResult.video string:"+videoList);
    	var json=JSON.stringify(newvideoList); // 将对象转换成字符串
//  	Utility.println("crespo commonAPI getPlayList newvideoList.video string:"+json);
    	var advertiseList=JSON.stringify(rtspResult.advertiseList); // 构造后的
//  	Utility.println("crespo commonAPI getPlayList advertiseList:"+advertiseList);
    	var fbVAdListStr =JSON.stringify(fbVideoAdList);
    	Utility.println("crespo commonAPI getPlayList feedbackVideoAdListStr:"+fbVAdListStr);
    //===========================end===================================
        setGlobalVar("vod_ctrl_rtsp", encodeURIComponent(rtspResult.rtsp));
        setGlobalVar("displayName", encodeURIComponent(rtspResult.displayName));
        setGlobalVar("ntpTime", rtspResult.ntpTime);
        setGlobalVar("ip", rtspResult.ip);
		//var startTime = rtspResult.rtsp.substring(rtspResult.rtsp.indexOf("startTime")+10,rtspResult.rtsp.indexOf("endTime")-1);
		//var endTime = rtspResult.rtsp.substring(rtspResult.rtsp.indexOf("endTime")+8,rtspResult.rtsp.indexOf("areaCode")-1);
		//setGlobalVar("startTime",startTime);
		//setGlobalVar("endTime",endTime);
        setGlobalVar("catalogId", rtspResult.catalogId);
        //setGlobalVar("channelId", rtspResult.channelId);
		setGlobalVar("videoList", videoList); //原播放串  断点时间需要
		setGlobalVar("adJSON",advertiseList); //core转换后播放串 倒计时需要
        setGlobalVar("video",json);           //构造后新的播放串 断点时间及权限控制需要
        setGlobalVar("fbVAdList",fbVAdListStr);
		setGlobalVar("assetId",rtspResult.assetId);
    
		var backUrl = location.href;
		var nexturl = getGlobalVar("next_location_href");
		if (nexturl != null && nexturl != "") { backUrl = nexturl; setGlobalVar("next_location_href", ""); }
		var index = backUrl.indexOf('&vod_ctrl_breakpoint');
		if (index > 0) backUrl = backUrl.substring(0, index);
		setGlobalVar("vod_ctrl_backurl", backUrl);
		setGlobalVar("isBack", "Y");
		var VODType=getGlobalVar("VODType");
		if(VODType=="news"){
            var rtspCode = decodeURIComponent(getGlobalVar("vod_ctrl_rtsp"));
            
            if(videoPlayType == 1){
//          if(rtspCode.indexOf("^^^") > 0){
                AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtspResult.rtsp)+"\",\"E2\",\""+rtspResult.catalogId+"\",\"E3\",\"0\",\"E4\",\"0\",\"E5\",\"0\",\"D1\",\"0003\",\"D2\",\""+encodeURI(rtspResult.displayName)+"\",\"D3\",\"0\",\"T\",\"V\"]}");
            }else{
                AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtspResult.rtsp)+"\",\"E2\",\""+rtspResult.catalogId+"\",\"E3\",\"0\",\"E4\",\"0\",\"E5\",\"0\",\"D1\",\"0002\",\"D2\",\""+encodeURI(rtspResult.displayName)+"\",\"D3\",\"0\",\"T\",\"V\"]}");
            }

			location.href = epgUrl + "vodctrl1/vodplay.htm";
		}else{
			setGlobalVar("mainPmId",Buy.mainPmId);
			setGlobalVar("resourceId",Buy.resourceId);
			setGlobalVar("saleType",Buy.saleType);
            var rtspCode = decodeURIComponent(getGlobalVar("vod_ctrl_rtsp"));
            
            if(videoPlayType == 1){
//          if(rtspCode.indexOf("^^^") > 0){

                AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtspResult.rtsp)+"\",\"E2\",\""+rtspResult.catalogId+"\",\"E3\",\"0\",\"E4\",\"0\",\"E5\",\"0\",\"D1\",\"0003\",\"D2\",\""+encodeURI(rtspResult.displayName)+"\",\"D3\",\"0\",\"T\",\"V\"]}");
                Utility.ioctlWrite("SEND_BROADCAST", "Broadcast:com.coship.action.uplaod.vod,Param:E1=\""+encodeURI(rtspResult.rtsp)+"\";E2=\""+rtspResult.catalogId+"\";E3=\"0\";E4=\"0\";E5=\"0\";D1=\"0003\";D2=\""+encodeURI(rtspResult.displayName)+"\";D3=\"0\",\"T\",\"V\"");
            }else{
                AppManager.invoke("TVRating", "addAction", "{\"action\":\"vodPlay\",\"data\":[\"E1\",\""+encodeURI(rtspResult.rtsp)+"\",\"E2\",\""+rtspResult.catalogId+"\",\"E3\",\"0\",\"E4\",\"0\",\"E5\",\"0\",\"D1\",\"0002\",\"D2\",\""+encodeURI(rtspResult.displayName)+"\",\"D3\",\"0\",\"T\",\"V\"]}");
				Utility.ioctlWrite("SEND_BROADCAST", "Broadcast:com.coship.action.upload.playback,Param:E1=\""+encodeURI(rtspResult.rtsp)+"\";E2=\""+rtspResult.catalogId+"\";E3=\"0\";E4=\"0\";E5=\"0\";D1=\"0002\";D2=\""+encodeURI(rtspResult.displayName)+"\";D3=\"0\",\"T\",\"V\"");
            }

			location.href = epgUrl + "vodctrl/vodplay.htm";
		}
	}
}

function displayProp(obj){
	var names = "";
	for(var name in obj){
		names+=name+": "+obj[name]+", ";
	}
	alert(names);
}

/*******订购时检查机顶盒是否设置应用密码start******/ 
var IS_INPUT_PASSWORD = false; //是否提示输入业务密码标志
var pwdFlag=false;//业务密码提示框
var pwdBuytype=0;//有业务密码输入后，订购单片1  订购套餐2  订购单片中的单集和整部订购3
var errorCount=0;//输入错误密码的次数y65
var pwdTip1="您好！请输入点播付费权限密码！";
var pwdTip2="您好！您输入的点播付费权限密码有误，请重新输入密码！";
var pwdTip3="您好！您已连续三次输入错误密码，本次订购失败！请重新订购或请咨询服务热线96596。";
var pwdTipStr="";
function controlPassword(flag){ //检查机顶盒是否设置应用密码
	try { 
		if (AppManager.existPassword() == 1){
			IS_INPUT_PASSWORD = true;
		}
	}catch(e){ } 
}
controlPassword(1);
function CheckAppPWS(){//检查输入的密码是否正确 flag为0时正确	
    //var flag = AppManager.checkPassword($("pwd").value);
	if(errorCount==3){
		errorCount=0;
		pwdTipStr='<p id="message" style="font-size:20px; line-height:30px;">'+pwdTip3+'</p><div class="tip_button"><ul class="one_button"><li><input type="button" value="确定" id="OKButton" onclick="closeTip();"/></li></ul></div>';
		$("buyTipPwd").innerHTML=pwdTipStr;
		setTimeout(function(){
			 $("OKButton").focus();
		},100);
		return false;
	}
    if (flag != 0) {
        $("message").innerHTML = pwdTip2;
        $("pwd").value = "";
		setTimeout(function(){
			 $("pwd").focus();
		},100);
		
		errorCount++;
        return false;
    }
    return true;
}
function inputPassword(){//应用密码输入框
	pwdTipStr='<p id="message" style="font-size:20px; line-height:30px;">'+pwdTip1+'</p><div class="pwd_button"><input type="password" name="pwd" id="pwd" class="text_pwd"/></div>' ;
	$("buyTipPwd").innerHTML=pwdTipStr;
	$("pwd").focus();
	pwdFlag=true;

}
/**********应用密码end************/

// add by wmj
var vodPath = "vodctrl/vodplay.htm";
var getDataWmj = {
    getChildAssetList: function(_config){
        var pageSize = _config.pageSize || 40;
        var curPage = _config.curPage || 1;
        var startAt = (curPage - 1) * pageSize + 1;
        var providerId =  _config.providerId || "";
        var assetId =  _config.assetId || "";
        var VOD_getAssetSubDetail = {//媒资详情
            "data":'<GetFolderContents startAt="' + startAt + '" maxItems="' + pageSize + '" titleProviderId="'
                + providerId + '" mergeTV="1" assetId="' + assetId + '" portalId="' + portalId + '" client="' + cardId
                + '" account="'+ userId + '" includeFolderProperties="Y" includeSubFolder="Y" includeSelectableItem="Y"/>',
            "callBack":_config.callBack
        };
        IEPG.getData(URL.VOD_getAssetList, VOD_getAssetSubDetail);
    },
    selectionStart : function(_config){
        var folderAssetId = _config.folderAssetId || "";
        var titleProviderId = _config.providerId || "";
        var titleAssetId = _config.assetId || "";
        var playPreview = _config.isPreview || "N";
        var VOD_selectionStart = {
            "data":"<SelectionStart titleProviderId=\""+ titleProviderId +"\" titleAssetId=\"" + titleAssetId+"\" folderAssetId=\"" + folderAssetId + "\" serviceId=\"\" playPreview=\"" + playPreview + "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
            "callBack" : _config.callBack
        };
        IEPG.getData(URL.VOD_getToken, VOD_selectionStart);
    },
    getPlayList : function(_config){
        var usage = _config.usage || "Start";
        var purchaseToken = _config.purchaseToken || "";
        var VOD_getPlayList = {
            "data":'<GetPlaylist usage="' + usage + '" deviceID="' + cardId + '" PT="' + purchaseToken + '"/>',
            "callBack" : _config.callBack
        };
        IEPG.getData(URL.VOD_getPlaylist, VOD_getPlayList);
    },
    validatePlayEligibility : function(_config) {
        var assetId = _config.assetId || "";
        var columnId = _config.columnId || "";
        var isColumnAuth =  _config.isColumnAuth || "Y";
        var trueValidataId = "";
        if(isColumnAuth=="Y")
        {
            trueValidataId = columnId;
        }else{
            trueValidataId = assetId;
        }
        var VOD_checkBuy = {
            "data":"<ValidatePlayEligibility  serviceId=\"\" assetId=\"" + trueValidataId +"\" isColumnAuth=\"" + isColumnAuth +"\"  portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
            "callBack":_config.callBack
        };
        IEPG.getData(URL.VOD_checkBuy, VOD_checkBuy);
    },
    getBookmarks : function(_config){
        var pageSize = _config.pageSize || 12;
        var curPage = _config.curPage || 1;
        var startAt = (curPage - 1) * pageSize + 1;
        var custom = _config.custom || "VOD"; // VOD BTV
        // alert("custom:" + custom + ",pageSize:" + pageSize + ",curPage:" + curPage);
        var VOD_getBookmarks = {
            "data": "<GetBookmarks custom=\"" + custom + "\" startAt=\"" + startAt + "\" maxItems=\"" + pageSize +"\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
            "callBack":_config.callBack
        };
        IEPG.getData(URL.VOD_getSavedProgram, VOD_getBookmarks);
    },
    delBookMark: function(_config){
        var assetId =  _config.assetId || "";
        var serviceType =  _config.serviceType || "VOD";
        if(serviceType == "VOD"){
            var VOD_removeFavorites = {
                "data":"<DeleteBookmark titleAssetId=\"" + assetId +"\" custom=\"" + serviceType+ "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
                "callBack":_config.callBack
            };
        } else if(serviceType == "BTV"){
            var beginTime = _config.beginTime || "";
            var endTime = _config.endTime || "";
            var programName = _config.programName || "";
            var VOD_removeFavorites = {
                "data":"<DeleteBookmark titleAssetId=\"" + assetId +"\" custom=\"" + serviceType+ "\" portalId=\""
                    + portalId +"\" client=\"" + cardId +"\" account=\"" + userId + "\" beginTime=\"" + beginTime
                    + "\" endTime=\"" + endTime + "\" programName=\"" + programName + "\"/>",
                "callBack":_config.callBack
            };
        }
        IEPG.getData(URL.VOD_removeVodFavorites, VOD_removeFavorites);
    },
    getSavedPrograms : function(_config){
        var pageSize = _config.pageSize || 12;
        var curPage = _config.curPage || 1;
        var startAt = (curPage - 1) * pageSize + 1;
        var VOD_getSavedProgram = {
            "data": "<GetSavedPrograms startAt=\"" + startAt + "\" maxItems=\"" + pageSize +"\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
            "callBack":_config.callBack
        };
        IEPG.getData(URL.VOD_getVodFavorites, VOD_getSavedProgram);
    },
    getHistorys : function(_config){
        var pageSize = _config.pageSize || 12;
        var curPage = _config.curPage || 1;
        var startAt = (curPage - 1) * pageSize + 1;
        var type;
        switch(_config.serviceType){
            case "VOD": type = 0;break;
            case "BTV": type = 2;break;
            default: type = 0;break;
        }
        var VOD_getHistorys = {
            "data" : "<GetHistorys serviceType=\"" + type + "\" mergeTV=\"1\" startAt=\"" + startAt + "\" maxItems=\"" + pageSize +"\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
            "callBack":_config.callBack
        };
        IEPG.getData(URL.VOD_getHistorys, VOD_getHistorys);
    },
    channelSelectionStart : function(_config){
        var assetId = _config.assetId || "";
        var channelId = _config.channelId || "";
        var Channel_selectionStart = {
            "data": "<ChannelSelectionStart assetId=\"" + assetId + "\" channelId=\"" + channelId + "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
            "callBack": _config.callBack
        };
        IEPG.getData(URL.BTV_getTvPlayRtsp, Channel_selectionStart);
    },
    deleteSavedProgram: function(_config){
        var assetId = _config.assetId || "";
        var providerId = _config.providerId || "";
        var VOD_deleteSavedProgram = {
            "data": "<DeleteSavedProgram assetId=\"" + assetId + "\" providerId=\"" + providerId + "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
            "callBack": _config.callBack
        };
        IEPG.getData("/DeleteSavedProgram", VOD_deleteSavedProgram);
    },
    getProductPrice: function(_config){
        var serviceId = _config.serviceId || "";
        var VOD_getPrice = {
            "data":'<GetUpsellOffer serviceId="' + serviceId + '" portalId="' + portalId + '" client="' + cardId
            + '" account="'+ userId + '"/>',
            "callBack":_config.callBack
        };
        IEPG.getData(URL.VOD_getPrice, VOD_getPrice);
    },
    purchase : function(_config){ // 按次订购
        var serviceId = _config.serviceId || "";
        var assetId = _config.assetId || "";
        var buyMode = _config.buyMode || "2"; // 1 包月(serviceId必填) 2 按次(assetId必填)
        var VOD_purchase = {
            "data": "<Purchase assetId=\"" + assetId + "\" serviceId=\"" + serviceId  + "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\" profile=\"1.0\" buyMode=\"" + buyMode + "\" />",
            "callBack": _config.callBack
        };
        IEPG.getData(URL.VOD_doBuy, VOD_purchase);
    }
};
function showMsgWmj(url, msg, data) {
    var tipUrl = epgUrl + "tip/";
    if(!tipFlag)// 如果当前已经没有弹出窗口,则需要保存当前焦点对象和面页按键的有效状态
    {
        if(!lastObj){
            lastObj = document.activeElement;
            disabledAll();
        }
    }
    var tipDiv = $(tipDivId);
    var tipWindow = $(messInfoId);
    if(url == "") {
        url = tipUrl + "a_info.htm";
    } else {
        url = tipUrl + url;
    }
    new ajaxUrl(url, function(resText) {
        tipDiv.style.visibility = "visible";
        tipWindow.innerHTML = resText;
        tipFlag = true;
        if(msg != ""){
            $("message").innerHTML = msg;
        }
        //弹出窗口确定按钮Id必须为 OKButton ,OKButton为弹出窗口专用ID
        if($(OKButtonId)){
            $(OKButtonId).focus();
        }
        /**
         * 对返回的提示框进行细节修改
         */
        if(resText.indexOf("a_buyPackTip") >= 0){ // 包月订购提示
            $("pmName").innerHTML = data.assetName;
            $("TCName1").innerHTML = data.productName;
            $("TCName2").innerHTML = data.productName;
            $("TCPrice").innerHTML = data.productPrice;
        } else if(resText.indexOf("a_buyTip") >= 0){ // 单片按次订购提示
            $("tipAssetName").innerHTML = data.assetName;
            $("tipPlayTime").innerHTML = data.playTime;
            $("tipPrice").innerHTML = data.price;
            $("tipEffectTime").innerHTML = data.effectTime;
        }
        //订购提示不消失，由页面点击返回确定
        if(resText.indexOf("a_buyPackTip") == -1 && resText.indexOf("a_buyTip") == -1){
        if(closeTimer){
            clearInterval(closeTimer);
            closeCount = 0;
        }
        closeTimer = setInterval(function(){
                if(closeCount < 10){
                closeCount++;
            }else{
                closeTip();
            }
        },1000);
        }
    });
}