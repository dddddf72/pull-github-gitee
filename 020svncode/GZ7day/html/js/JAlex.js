var $J = new JAlex();

function JPage(){
	//$J.debug.msg("<span style='color:#ff00ff;'>[START LOAD PAGE][PGAE:"+ADD_PA+"]</span>")
	this.UserCard = new UserCard();
	this.grabWidget = new grabWidget();
	//页面组件分组
	this.grabEvent = new grabEvent();
	//事件监控对象
	this.mediaPlayer = new mediaPlayer()
	function UserCard(){
		this.id = "";
		this.cache = function(_val){
			return $J.evn("cacheUserCard",_val);
		}
		this.check = function(){
			this.id = this.cache();
			return (this.id==CA.icNo)
		}
		this.init = function(){
			this.cache(CA.icNo);
		}
		this.init();
	}
	function mediaPlayer(){
		this.id = "";		
		this.init = function(_position){
			this.id = $J.evn("mediaPlayerId");
			this.player = new MediaPlayer();
			if(this.id == ""){
				this.id = this.player.createPlayerInstance("Video",2);
				$J.evn("mediaPlayerId",this.id);
			}else{
				this.player.bindPlayerInstance(parseInt(this.id))
			}
			//设置默认全屏position
			if(_position==null){
				this.player.position = "1,0,0,0,0";
			}else{
				this.player.position = _position;
			}
		}
		this.stop = function(_type){
			if(typeof _type=='undefined'){_type=0}
			this.player.pause(_type);
			this.player.releasePlayerInstance()
			$J.evn("mediaPlayerId","");
		}
		
	}
	
	
	
	this.regedit = function(_obj){
		//注册页面对象
		this.grabEvent.regedit(_obj);
		this.grabWidget.regedit(_obj);
	}
	function grabWidget(){
		this.widgetGroup = new Array();
		this.regedit = function(_obj){
			if(_obj!=null){
				if(_obj.widgetGroup!=null){
					for(var i=0,len = _obj.widgetGroup.length;i<len;i++){
						if(this.widgetGroup[_obj.widgetGroup[i]] == null){
							this.widgetGroup[_obj.widgetGroup[i]] = new Array();
						}
						this.widgetGroup[_obj.widgetGroup[i]].push(_obj)
					}
				}
			}
		}
		this.Listener = function(_obj){
			if(_obj.widgetGroup!=null){
				for(var j=0,lens = _obj.widgetGroup.length;j<lens;j++){
					for(var i = 0,len = this.widgetGroup[_obj.widgetGroup[j]].length;i<len;i++){
						if(this.widgetGroup[_obj.widgetGroup[j]][i] != _obj){
							this.widgetGroup[_obj.widgetGroup[j]][i].hide();
						}
					}
				}
			}
		}
	}
	function grabEvent(){
		this.pageEvent = function pageEvnt(event){return true}
		this.eventGroup = {"sup":[],"pro":[],"sta":[],"low":[]};
		this.eventLevel = ["sup","pro","sta","low"];
		this.eventHandling = false;
		this.regedit = function(_obj){
			//注册页面事件
			if(_obj.Listener!=null){
				if(_obj.eventLeval=="sup"||_obj.eventLeval=="pro"||_obj.eventLeval=="sta"||_obj.eventLeval=="low"&&_obj.Listener!=null){
					this.eventGroup[_obj.eventLeval].push(_obj);
				}else{
					this.eventGroup["sta"].push(_obj);
				}
				if(_obj.fnName!=null){
					$J.debug.Msg("注册组件:"+_obj.fnName,6,"Regedit Debug")
				}
			}
			
		}
		this.ListenerSubFunc = function(_level,i,event){
			//try{
				return this.eventGroup[_level][i].Listener(event);
			//}catch(e){
				$J.debug.Msg("ERROR:"+e.message,1,"Event Error");
				return true;
			//}
		}
		this.ListenerSub = function(event,_level){
			var re = true;
			var val = event.which|event.keyCode;
			for(var i = 0,len = this.eventGroup[_level].length;i<len;i++){
				var result = this.ListenerSubFunc(_level,i,event);
				re = result==0?0:re;
				if(!re){break}
			}
			return re;
		}
		this.Listener = function(event){		
			this.eventHandling = true;
			var val = event.which|event.keyCode;
			//try{
			if(val!=10601)
			$J.debug.Msg("CODE:"+util.str.addZero(val,5)+" MSG:"+$J.key.code[val+""],5,"Event Debug")
			var re = true;
			for(var i = 0,len=this.eventLevel.length;i<len;i++){
				var re = this.ListenerSub(event,this.eventLevel[i])
				if(!re){break}
			}
			if(re){
				re = this.pageEvent(event);
			}
			return re;
			//}catch(e){
				$J.debug.Msg("ERROR:"+e.message,1,"Event Error");
				return true;
			//}
		}
		
	}
	
	
	
}
function JAlex(_id){
	this.key = new key()
	function key(){
		this.code = {};
		this.code["27"] = "取消/退出键";
		this.code["8"] = "返回键";
		this.code["13"] = "确定键";
		this.code["19"] = "电源";
		this.code["306"] = "上翻页键";
		this.code["307"] = "下翻页键";
		this.code["312"] = "帮助键";
		this.code["313"] = "电视键";
		this.code["314"] = "回看键";
		this.code["315"] = "点播键";
		this.code["316"] = "刷新网页";
		this.code["317"] = "系统设置键";
		this.code["318"] = "*号键";
		this.code["319"] = "#号键";
		this.code["320"] = "红色按键";
		this.code["321"] = "绿色按键";
		this.code["322"] = "黄色按键";
		this.code["323"] = "蓝色按键";
		this.code["48"] = "数字键0";
		this.code["49"] = "数字键1";
		this.code["50"] = "数字键2";
		this.code["51"] = "数字键3";
		this.code["52"] = "数字键4";
		this.code["53"] = "数字键5";
		this.code["54"] = "数字键6";
		this.code["55"] = "数字键7";
		this.code["56"] = "数字键8";
		this.code["57"] = "数字键9";
		this.code["65"] = "向左键";
		this.code["68"] = "向右键";
		this.code["67"] = "静音键";
		this.code["69"] = "节目指南键";
		this.code["71"] = "导视键";
		this.code["72"] = "主菜单键";
		this.code["73"] = "信息键";
		this.code["76"] = "喜爱键";
		this.code["77"] = "邮件键";
		this.code["82"] = "录制键";
		this.code["83"] = "向下键";
		this.code["87"] = "向上键";
		this.code["86"] = "声道键";
		this.code["45"] = "音量减小键";
		this.code["61"] = "音量增大键";
		this.code["91"] = "频道减少键";
		this.code["93"] = "频道增加键";
		this.code["59"] = "暂停键";
		this.code["39"] = "播放键";
		this.code["44"] = "快退键";
		this.code["46"] = "快进键";
		this.code["47"] = "停止键";
		this.code["10001"] = "自动、手动或全频段搜索已完毕";
		this.code["10002"] = "自动、手动或全频段搜索失败";
		this.code["10003"] = "开始搜索某个频点";
		this.code["10004"] = "在当前频点下，已经搜索到";
		this.code["10005"] = "成功终止频道搜索";
		this.code["10031"] = "成功锁定频点";
		this.code["10032"] = "锁频失败";
		this.code["10041"] = "NIT版本变化";
		this.code["10042"] = "已获取到NIT表的某个Network_Descriptor值";
		this.code["10043"] = "已获取到NIT表的某个Transport_Descriptor值";
		this.code["10044"] = "已获取到整个NIT表内容";
		this.code["10081"] = "已获取到BAT表的某个Bouquet_Descriptor值";
		this.code["10082"] = "已获取到BAT表的某个Transport_Descriptor值";
		this.code["10091"] = "已获取到SDT表的某个Service_Descriptor的值";
		this.code["10101"] = "成功清除A、B、D区中PSI/SI数据";
		this.code["10102"] = "无法清除A、B、D区中PSI/SI数据";
		this.code["10103"] = "成功清除D区PSI/SI数据";
		this.code["10104"] = "无法清除D区PSI/SI数据";
		this.code["10105"] = "成功用D区更新A区数据";
		this.code["10106"] = "无法用D区更新A区数据";
		this.code["10107"] = "成功用B区更换A区数据";
		this.code["10108"] = "无法用B区更换A区数据";
		this.code["10109"] = "成功将A区数据写入B区";
		this.code["10110"] = "无法将A区数据写入B区";
		this.code["10111"] = "成功将B区数据备份到C区";
		this.code["10112"] = "无法将B区数据备份到C区";
		this.code["10113"] = "成功恢复A、B区数据";
		this.code["10114"] = "无法恢复A、B区数据";
		this.code["10151"] = "已下载前端文件到内存中";
		this.code["10152"] = "前端不存在要下载的文件";
		this.code["10153"] = "文件下载失败";
		this.code["10154"] = "超时时间到，文件下载未完成";
		this.code["10155"] = "前端存在指定的文件";
		this.code["10156"] = "前端不存在指定的文件";
		this.code["10157"] = "超时时间到，文件查找未完成";
		this.code["10158"] = "复制目录完成或失败";
		this.code["10159"] = "移动目录完成或失败";
		this.code["10160"] = "删除目录完成或失败";
		this.code["10201"] = "成功完成EPG搜索";
		this.code["10202"] = "搜索结果达到255个，搜索自动停止";
		this.code["10203"] = "搜索EPG超时";
		this.code["10204"] = "PF信息收取完毕。";
		this.code["10205"] = "PF信息收取完毕";
		this.code["10206"] = "schedule信息收取完毕";
		this.code["10207"] = "schedule信息收取完毕";
		this.code["10208"] = "已获取到EIT表的某个Event_Descriptor的值";
		this.code["10221"] = "接收NVOD参考事件成功";
		this.code["10222"] = "NVOD参考事件接收超时";
		this.code["10223"] = "接收某参考事件下的时移事件成功";
		this.code["10224"] = "NVOD时移事件接收超时";
		this.code["10225"] = "NVOD时移事件结束";
		this.code["10501"] = "网线已插上";
		this.code["10502"] = "网线已断开";
		this.code["10503"] = "LAN模式网络已连接";
		this.code["10504"] = "LAN模式网络已断开";
		this.code["10521"] = "网络NTP时间同步成功";
		this.code["10522"] = "网络 NTP时间同步超时";
		this.code["10523"] = "PING命令响应";
		this.code["10524"] = "IP地址有更新";
		this.code["10601"] = "Flash写入成功";
		this.code["10602"] = "已成功更新Booter的A类应用";
		this.code["10603"] = "更新Booter的A类应用失败";
		this.code["10701"] = "OTA强制升级";
		this.code["10702"] = "OTA自动升级";
		this.code["10703"] = "OTA手动升级";
		this.code["10801"] = "用户预订的节目将要开始";
		this.code["10802"] = "用户预订的节目开始";
		this.code["10901"] = "当前媒体已播放到末尾";
		this.code["10902"] = "当前媒体已退到开头";
		this.code["10903"] = "收到Session Manager返回的NGOD-S1 Session Setup响应";
		this.code["10904"] = "收到Session Manager返回的NGOD-S1 Session Teardown响应";
		this.code["10905"] = "收到Session Manager的NGOD-S1 Announce请求";
		this.code["10906"] = "收到Session Manager返回的NGOD-S1 Ping响应";
		this.code["10907"] = "收到推流服务器返回的NGOD-C1 Play响应";
		this.code["10908"] = "收到推流服务器返回的NGOD-C1 Pause响应";
		this.code["10909"] = "收到推流服务器的NGOD- C1 Announce请求";
		this.code["10910"] = "收到推流服务器返回的NGOD-C1 Get Parameter响应";
		this.code["10911"] = "收到推流服务器返回的NGOD-C1 Set Parameter响应";
		this.code["10912"] = "尚未收到session manager的响应";
		this.code["10913"] = "尚未收到session manager的响应";
		this.code["10914"] = "尚未收到session manager的响应";
		this.code["10915"] = "尚未收到推流服务器的响应";
		this.code["10916"] = "尚未收到推流服务器的响应";
		this.code["10917"] = "尚未收到推流服务器的响应";
		this.code["10918"] = "尚未收到推流服务器的响应";
		this.code["10919"] = "发出某个视频播放实例的NGOD-VOD节目消息到页面";
		this.code["10920"] = "在发出10919消息后，发出本消息到页面";
		this.code["10921"] = "在对应频点的PAT表中无法找到对应节目的PMT描述";
		this.code["11001"] = "错误的操作码或序列";
		this.code["11003"] = "格式错误";
		this.code["11004"] = "业务运行正常";
		this.code["11006"] = "EMM业务运行正常";
		this.code["11008"] = "解扰器运行正常";
		this.code["11010"] = "PVR录制业务运行正常";
		this.code["11012"] = "PVR回放业务运行正常";
		this.code["11014"] = "PVR业务运行正常";
		this.code["11016"] = "卡已插入";
		this.code["11017"] = "请插入智能卡";
		this.code["11018"] = "未知智能卡";
		this.code["11019"] = "智能卡故障";
		this.code["11020"] = "验证智能卡";
		this.code["11021"] = "错误的家庭网络";
		this.code["11022"] = "EMM源运行正常";
		this.code["11023"] = "不匹配";
		this.code["11024"] = "EMM过滤器运行故障";
		this.code["11025"] = "无CAT";
		this.code["11026"] = "无供应商ID";
		this.code["11027"] = "无法打开EMM通道";
		this.code["11028"] = "ECM源运行正常";
		this.code["11029"] = "无PMT";
		this.code["11030"] = "无收看该频道的权限";
		this.code["11031"] = "本地区不提供该频道";
		this.code["11032"] = "该频道的订购已过期";
		this.code["11033"] = "本地区不提供该频道";
		this.code["11034"] = "目前无法收看该频道";
		this.code["11035"] = "业务目前已解扰";
		this.code["11036"] = "目前无法收看该频道";
		this.code["11037"] = "收看暂时受阻，请耐心等待";
		this.code["11038"] = "检查插入的智能卡是否为正确的智能卡";
		this.code["11039"] = "正在验证订购，请等待";
		this.code["11040"] = "正在进行订购更新";
		this.code["11041"] = "目前无法收看该频道";
		this.code["11042"] = "目前无法收看该频道";
		this.code["11043"] = "目前无法收看该频道";
		this.code["11044"] = "目前无法收看该频道";
		this.code["11045"] = "无供应商ID";
		this.code["11046"] = "目前无法收看该频道";
		this.code["11047"] = "业务目前已被加扰";
		this.code["11048"] = "目前无法收看该频道";
		this.code["11049"] = "FTA业务";
		this.code["11050"] = "请插入正确的智能卡";
		this.code["11051"] = "智能卡未经充分授权";
		this.code["11052"] = "目前无法收看该频道";
		this.code["11053"] = "目前无法收看该频道";
		this.code["11054"] = "目前无法收看该频道";
		this.code["11055"] = "目前无法收看该频道";
		this.code["11056"] = "目前无法收看该频道";
		this.code["11057"] = "保留的智能卡返回代码";
		this.code["11058"] = "请等待，直到智能卡完成同步";
		this.code["11059"] = "目前无法收看该频道";
		this.code["11060"] = "该频道的收视权限已过期";
		this.code["11061"] = "目前无法收看该频道";
		this.code["11062"] = "对该频道的收看有年龄限制插入父母级PIN码进行收看";
		this.code["11063"] = "目前无法收看该频道";
		this.code["11064"] = "父母级PIN码暂时被锁定，请等待";
		this.code["11065"] = "正在验证订购，请等待";
		this.code["11066"] = "该地区不提供该频道";
		this.code["11067"] = "目前无法收看该频道";
		this.code["11068"] = "在主解码器中插入副卡以继续通过副解码器进行收看";
		this.code["11069"] = "请等待";
		this.code["11070"] = "错误的家庭网络";
		this.code["11071"] = "您无权在第二台电视机上收看该频道";
		this.code["11072"] = "未提供时间戳";
		this.code["11073"] = "无备用卡";
		this.code["11074"] = "请插入正确的智能卡";
		this.code["11075"] = "解扰器运行正常";
		this.code["11076"] = "无法分配解扰器";
		this.code["11077"] = "启用监控";
		this.code["11078"] = "不支持该业务";
		this.code["11079"] = "已购买事件";
		this.code["11080"] = "预览期";
		this.code["11081"] = "预览期过期";
		this.code["11082"] = "事件已被购买";
		this.code["11083"] = "事件已被录制";
		this.code["11084"] = "无法再次购买";
		this.code["11085"] = "已达到信用限额";
		this.code["11086"] = "业务目前已被加扰";
		this.code["11087"] = "运行正常";
		this.code["11088"] = "无主会话密钥（MSK）";
		this.code["11089"] = "没有订购";
		this.code["11090"] = "会话记录存储失败";
		this.code["11091"] = "会话记录数据错误";
		this.code["11092"] = "会话初始化";
		this.code["11093"] = "未知的爱迪德PVR阶段";
		this.code["11094"] = "录制密码错误";
		this.code["11095"] = "不允许PVR";
		this.code["11096"] = "获取内容的初始版权";
		this.code["11097"] = "获取内容的初始版权";
		this.code["11098"] = "链录制失败";
		this.code["11099"] = "查看内容版权";
		this.code["11100"] = "无更多可用的回放会话";
		this.code["11101"] = "禁止永久录制";
		this.code["11102"] = "禁止回放";
		this.code["11103"] = "鉴权失败";
		this.code["11104"] = "无效的智能卡";
		this.code["11105"] = "运行正常";
		this.code["11106"] = "禁止回放";
		this.code["11107"] = "无PVR订购";
		this.code["11108"] = "外部收视窗口";
		this.code["11109"] = "不允许PVR";
		this.code["11110"] = "无PVR主会话密钥";
		this.code["11111"] = "无更多可用的回放会话";
		this.code["11112"] = "无法获取内容版权";
		this.code["11113"] = "已超出回放次数限制";
		this.code["11114"] = "禁止录制";
		this.code["11115"] = "年龄分级锁定";
		this.code["11116"] = "年龄分级PIN码错误";
		this.code["11117"] = "年龄分级PIN码锁定";
		this.code["11118"] = "运行正常";
		this.code["11119"] = "无法实现PVR加密";
		this.code["11120"] = "密钥未被加载";
		this.code["11121"] = "运行正常";
		this.code["11122"] = "无可用的资源";
		this.code["11123"] = "已购买事件";
		this.code["11124"] = "预览期";
		this.code["11125"] = "事件已被购买";
		this.code["11126"] = "录制存储已满";
		this.code["11127"] = "无订购";
		this.code["11128"] = "无购买窗口";
		this.code["11129"] = "已到达信用额度";
		this.code["11130"] = "太昂贵";
		this.code["11131"] = "错误的PPV模式";
		this.code["11301"] = "无法识别卡";                           
		this.code["11302"] = "智能卡过期，请更换新卡";            
		this.code["11303"] = "加扰节目，请插入智能卡";               
		this.code["11304"] = "卡中不存在节目运营商";                 
		this.code["11305"] = "条件禁播";                               
		this.code["11306"] = "当前时段被设定为不能观看";               
		this.code["11307"] = "节目级别高于设定的观看级别";          
		this.code["11308"] = "智能卡与本机顶盒不对应";               
		this.code["11309"] = "没有授权";                              
		this.code["11310"] = "节目解密失败";                           
		this.code["11311"] = "卡内金额不足";                          
		this.code["11312"] = "区域不正确";                            
		this.code["11313"] = "子卡需要和母卡对应，请插入母卡";         
		this.code["11314"] = "智能卡校验失败，请联系运营商";
		this.code["11315"] = "智能卡升级中，请不要拔卡或者关机"; 
		this.code["11316"] = "请升级智能卡";
		this.code["11317"] = "请勿频繁切换频道";
		this.code["11318"] = "智能卡暂时休眠，请5分钟后重新开机";
		this.code["11319"] = "智能卡已冻结，请联系运营商";
		this.code["11320"] = "智能卡已暂停，请回传收视记录给运营商";
		this.code["11321"] = "窗帘节目，不可预览阶段";                 
		this.code["11322"] = "升级测试卡测试中";                       
		this.code["11323"] = "升级测试卡测试失败，请检查机卡通讯模块";
		this.code["11324"] = "升级测试卡测试成功";
		this.code["11325"] = "卡中不存在移植库定制运营商";
		this.code["11326"] = "请重启机顶盒";                           
		this.code["11327"] = "机顶盒被冻结"; 
		this.code["11501"] = "收看级别不够";
		this.code["11502"] = "不在收看时段内";
		this.code["11503"] = "没有机卡对应";
		this.code["11504"] = "IC卡与其它机顶盒对应";
		this.code["11505"] = "请插卡";
		this.code["11506"] = "没有购买此节目";
		this.code["11507"] = "运营商限制观看该节目";
		this.code["11508"] = "运营商限制区域观看";
		this.code["11509"] = "此卡为子卡，已经被限制收看，请与母卡配对";
		this.code["11510"] = "余额不足，不能观看此节目，请及时充值";
		this.code["11511"] = "请到IPPV节目确认/取消购买菜单下确认购买此节目";
		this.code["11512"] = "您没有预订和确认购买，不能观看此节目";
		this.code["11513"] = "请到IPPT节目确认/取消购买菜单下确认购买此节目";
		this.code["11514"] = "您没有预订和确认购买，不能观看此节目";
		this.code["11515"] = "余额不足，不能观看，请及时充值";
		this.code["11516"] = "余额不足，不能观看，请及时充值";
		this.code["11517"] = "STB不做任何提示";
		this.code["11518"] = "钱包不存在";
		this.code["11519"] = "IC卡被禁止服务";
		this.code["11520"] = "运营商不存在";
		this.code["11521"] = "此卡未被激活，请联系运营商";
		this.code["11522"] = "请联系运营商回传IPP节目信息";
		this.code["11523"] = "您已经选择了不观看此节目，请切台到其他节目观看";
		this.code["11524"] = "请购买此节目。正在免费预览中";
		this.code["11525"] = "STB不做任何提示";
		this.code["11526"] = "获取信息失败";
		this.code["11527"] = "修改PIN码成功";
		this.code["11528"] = "修改PIN码失败";
		this.code["11529"] = "两次输入的新PIN码不一致";
		this.code["11530"] = "输入PIN码错误，如果连续错误3次，PIN码将被锁定";
		this.code["11531"] = "修改观看级别成功";
		this.code["11532"] = "修改观看级别失败";
		this.code["11533"] = "修改工作时段成功";
		this.code["11534"] = "修改工作时段失败";
		this.code["11535"] = "指纹显示";
		this.code["11536"] = "有新邮件";
		this.code["11537"] = "邮箱已满";
		this.code["11538"] = "不是此用户的邮件,不能浏览";
		this.code["11539"] = "正在获取区域信息，请稍后......";
		this.code["11540"] = "正在获取母卡配对信息，请稍后";
		this.code["11541"] = "获取母卡信息失败，请插入要配对的母卡";
		this.code["11542"] = "成功获取母卡信息，请插入要配对的子卡";
		this.code["11543"] = "配对失败，请插入要配对的母卡";
		this.code["11544"] = "请插入要配对的子卡";
		this.code["11545"] = "恭喜，配对成功，请插入其他的子卡";
		this.code["11546"] = "配对失败，请确认插入的是要配对的子卡";
		this.code["11547"] = "无钱包信息";
		this.code["11548"] = "此价格无效，请选择其他价格";
		this.code["11549"] = "退订成功";
		this.code["11550"] = "订购成功";
		this.code["11551"] = "正在应急广播";
		this.code["11552"] = "输入的指针无效";
		this.code["11553"] = "输入的数据长度不合法";
		this.code["11554"] = "没有找到符合要求的运营商";
		this.code["11555"] = "超过了允许的最大的个数";
		this.code["11556"] = "没有找到解密密钥";
		this.code["11557"] = "输入的PIN码无效";
		this.code["11558"] = "PIN码被锁定";
		this.code["11559"] = "MAC校验错误";
		this.code["11560"] = "数据已经过期";
		this.code["11561"] = "运营商的名称超过最大的长度";
		this.code["11562"] = "已经没有空间";
		this.code["11563"] = "智能卡与当前机顶盒没有对应";
		this.code["11564"] = "工作时段设置不合法";
		this.code["11565"] = "智能卡无效";
		this.code["11566"] = "智能卡设置的收看级别比当前收看的节目低";
		this.code["11567"] = "未知错误，STB不做任何提示，可通过卡复位恢复";
		this.code["11568"] = "没有此E-mail";
		this.code["11569"] = "E-mail信箱满";
		this.code["11570"] = "余额不多，请及时充值";
		this.code["11571"] = "产品未找到";
		this.code["11572"] = "产品已存在，不能操作";
		this.code["11573"] = "需要PIN验证通过";
		this.code["11574"] = "与IC卡通讯错误";
		this.code["11575"] = "运营商钱包没有发现";
		this.code["11576"] = "价格无效";
		this.code["11577"] = "产品已经过期";
		this.code["11578"] = "产品已经过期";
		this.code["11579"] = "IPP记录不存在";
		this.code["11580"] = "当前时间无效";
		this.code["11581"] = "产品未预定";
		this.code["11582"] = "产品已经确认";
		this.code["11583"] = "产品已经取消确认";
		this.code["11584"] = "输入的数据无效";
		this.code["11701"] = "即时购买IPP";
		this.code["11702"] = "隐藏不能播放节目的CA提示";
		this.code["12009"] = "通过AIT表收到应用更新信息";
		
	}
	this.debug = new debugObj(this);
	function debugObj(_J){
		this.debugMo = 1;
		this.debugUsed = SysSetting.getEnv("debugUsed")==""?0:1;
		this.debugTy = ["<span style='color:#ff0000;'>消息模式</span>","<span style='color:#00ff00;'>监控模式</span>"]
		this.showTag = false;
		this.div = null;
		this.debugMsg = [""];
		this.init = function(){
			this.div = document.createElement("div");	
			this.div.style.fontSize="24px";	
			this.div.style.position = "absolute";
			this.div.style.background = "#000000";
			this.div.style.right = "0px";
			this.div.style.top = "0px";
			this.div.style.width = "1180px";
			this.div.style.zIndex = 9999;
			this.div.style.height = "620px";
			this.div.style.padding = "50px";
			this.div.style.overflow = "hidden";
			this.div.style.display = "none";
			this.div2 = document.createElement("div");			
			this.div2.style.fontSize="24px";	
			this.div2.style.position = "absolute";
			this.div2.style.right = "0px";
			this.div2.style.top = "0px";
			this.div2.style.width = "1180px";
			this.div2.style.color ="#ffffff";
			this.div2.style.position = "absolute";
			this.div2.id = "debugObj";
			this.div2.innerHTML = this.debugMsg.join("</br>")
			this.div3 = document.createElement("div");			
			this.div3.style.fontSize="24px";	
			this.div3.style.position = "absolute";
			this.div3.style.background = "#000000";
			this.div3.style.right = "0px";
			this.div3.style.top = "0px";
			this.div3.style.width = "1180px";
			this.div3.style.height = "30px";
			this.div3.style.color ="#ffffff";
			this.div3.style.position = "absolute";
			this.div3.innerHTML = "[DEBUG 平台:"+this.debugTy[this.debugMo]+"]<信息键> 隐藏 / <红键> 删除信息 / <蓝键> 切换模式"
			document.body.appendChild(this.div);
			this.div.appendChild(this.div2);
			this.div.appendChild(this.div3);
			page.regedit($J.debug);
		}
		this.start = function(){
			this.debugUsed = 1;
			SysSetting.setEnv("debugUsed","1")
		}
		this.stops = function(){
			this.debugUsed = 0;
			SysSetting.setEnv("debugUsed","0")
		}
		this.show = function(){
			this.showTag = true;
			this.div2.innerHTML = this.debugMsg.join("<br/>")			
			this.div.style.display = "block";
			var h = document.getElementById("debugObj").clientHeight;
			document.getElementById("debugObj").style.top = Math.min(690-h,0)+"px"
			
		}
		this.hide = function(){
			this.showTag = false;
			this.div.style.display = "none";
			
		}
		this.Listener = function(event){
			var val = event.which;
        	var event_modifer = parseInt(event.modifiers);
			if(!this.debugUsed){
				return true;
			}
			switch(val){
				case ROC_IRKEY_INFO:
				if(this.showTag){
					this.hide();
				}else{
					this.show();
				}
				break;
				case ROC_IRKEY_RED:
				if(this.showTag){
					this.debugMsg = [];
					this.div2.innerHTML = this.debugMsg.join("<br/>");
					return false;
				}
				break;
				case ROC_IRKEY_BLUE:
				if(this.showTag){
					this.debugMo = this.debugMo == 1?0:1;
					this.div3.innerHTML = "[DEBUG 平台:"+this.debugTy[this.debugMo]+"]<信息键> 隐藏 / <红键> 删除信息 / <蓝键> 切换模式";
					return false;
				}
				break;
				case ROC_IRKEY_UP:
					if(this.debugMo==0){
						var top = parseInt(document.getElementById("debugObj").style.top)
						document.getElementById("debugObj").style.top = Math.min(top+300,0)+"px";
					}
				break;
				case ROC_IRKEY_DOWN:
					if(this.debugMo==0){
						var top = parseInt(document.getElementById("debugObj").style.top)
						var h = document.getElementById("debugObj").clientHeight;
						document.getElementById("debugObj").style.top = Math.max(top-300,690-h)+"px";
					}
				break;
				case ROC_IRKEY_EXIT:
					if(this.showTag){
						this.hide();
						return false;
					}
				break;
			}
			return this.debugMo;
		}
		this.Msg = function(_msg,_level,_model){
			var colorArr = new Array();
			colorArr[1] = ["#ff0000"];
			colorArr[2] = ["#ff7e00"];
			colorArr[3] = ["#ffde00"];
			colorArr[4] = ["#00b4ff"];
			colorArr[5] = ["#ff00cc"];
			colorArr[6] = ["#00ff06"];
			var msg = "<font style='color:"+colorArr[_level]+";'>["+_model+"] "+_msg+"</font>";
			this.msg(msg)
		}
		this.msg = function(_val){
			if(!this.debugUsed){
				return;
			}
			var d = new Date();
			var dStr = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
			if(typeof(page)=="undefined"){
				return
			}
			if(page==null){
				this.debugMsg.push("["+this.debugMsg.length+"] ["+dStr+"]"+_val)
				return 
			}
			if(this.div==null){this.init()}			
			if(this.showTag == false){
				this.debugMsg.push("["+this.debugMsg.length+"] ["+dStr+"]"+_val)
				return 
			}
			if(this.debugMo==1){
				var h = document.getElementById("debugObj").clientHeight;
				document.getElementById("debugObj").style.top = Math.min(690-h,0)+"px"
				this.debugMsg.push("["+this.debugMsg.length+"] ["+dStr+"]"+_val)
				this.div2.innerHTML = this.debugMsg.join("<br/>")
			}
		}
		
	}
	this.getParameter = function(_id){
		var query = window.location.search; //获取URL"?"后面的字符串
				if(query.length==0){
					return "";
				}
				else{
					var iLen = _id.length;
					var iStart = query.indexOf(_id);
					if (iStart == -1) //判断是否有那个需要查询值的传递参数
						return ""; //没有就返回一个空值
					iStart += iLen + 1;
					var iEnd = query.indexOf("&", iStart); //判断是不是带有多个参数   &为多个参数的连接符号
					if (iEnd == -1) {
						return query.substring(iStart);
					}
					return query.substring(iStart, iEnd);
				}
	}
	this.evn = function(_attr,_val){
		if(_val==null){
			var result = SysSetting.getEnv(_attr);
			this.debug.Msg("GET ATTR:"+_attr+" VAL:"+result,4,"SysSetting Debug")
			return result;
		}else{
			this.debug.Msg("SAVE ATTR:"+_attr+" VAL:"+_val,4,"SysSetting Debug")
			return SysSetting.setEnv(_attr,_val+"")		
		}
	}
	this.evnMulti = function(_attr,_val){
		if(_val==null){
			var result = "";                                           
			for(var i = 0 ; ; i++){                                                
				 var temp = SysSetting.getEnv(_attr+i);               
				 if(temp == null || temp == '' || temp.length <= 0 || temp == 'undefined') break;
				 result += temp;                                   
			} 
			$J.debug.msg("[<font style='color:#00ffff;'>SysSetting Debug</font>] TYPE:GET ATTR:"+_attr+" VAL:"+result);
			return result;
		}else{
			this.debug.msg("[<font style='color:#00ffff;'>SysSetting Debug</font>] TYPE:SAVE ATTR:"+_attr+" VAL:"+_val);
			if(_val == ''){
				SysSetting.setEnv(_attr+0,_val+""); 
			}else{
				var length = _val.length;
				for(var i = 0 ; ; i++){    
					  var start = i * 255 ;
					  var end = ((i + 1) * 255);
					  end = end >= length ? length : end ; 
					  SysSetting.setEnv(_attr+i,_val.substring(start,end)); 
					  if(end >= length){
							SysSetting.setEnv(_attr+(i+1),null); 
							break;
					  } 
				}
			}
		}
	}
	this.access = function(_class,_attr,_val){
		if(_val==null){
			var result = DataAccess.getInfo (_class,_attr);
			this.debug.Msg("GET CLASS:"+_class+" ATTR:"+_attr+"VAL:"+result,4,"DateAccess Debug")
			return result;
		}else{
			var result = DataAccess.setInfo (_class,_attr,_val)
			this.debug.Msg("SET CLASS:"+_class+" ATTR:"+_attr+"VAL:"+_val,4,"DateAccess Debug")
			if(result){
				this.debug.Msg("SAVE CLASS:"+_class+" ATTR:"+_attr,4,"DateAccess Debug")
				return DataAccess.save(_class,_attr)
			}else{
				this.debug.Msg("SET CLASS:"+_class+" ATTR:"+_attr+"VAL:"+_val,1,"DateAccess Error")
				return 0;	
			}
		}
	}
	this.json2str = function json2str(o) {
		var arr = [];
		var fmt = function(s) {
			if (typeof s == 'object' && s != null) return json2str(s);
			return /^(string|number)$/.test(typeof s) ? "'" + s + "'" : s;
		}
		if(o.length>0){
			for(var i in o) arr.push(fmt(o[i]))
			return '[' + arr.join(',') + ']';
		}else{
			for (var i in o) arr.push("'" + i + "':" + fmt(o[i]));
			return '{' + arr.join(',') + '}';
		}
	}
	var obj = document.getElementById(_id)
	return obj;
}