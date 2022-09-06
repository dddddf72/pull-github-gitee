
/**动态排版需要,
	cellW*cellH基本单元格，
	marginW左右间隔，
	marginH上下间隔，
	marginFillStyle:单元格之间的填充方式，-1不填充，0是用颜色填充，1是用图片填充 
	unitBgStyle:单元格背景的样式，-1：不需要处理，0：背景用颜色显示，1：背景用图片显示
**/
var drawInfoObj = {
	"cellW":51,//基本单元格的宽度
	"cellH":30,//基本单元格的高度
	"marginW":6,//单元格之间的左右间隔
	"marginH":7,//单元格之间的上下间隔
	"marginFillStyle":-1,//单元格之间间隙填充样式
	"marginValue":"images/bg1_1.jpg",//"#CCCCCC"
	"unitBgStyle":-1,//单元格背景填充样式
	"unitBgValue":"images/bg1_1.jpg"//"#CCCCCC",
};

//功能模块开关
var funcConfig = {	
	neediPanelRate:1//大数据采集的开关，1是需要采集，0是不需要采集
};

//华为的调度地址
var vodMainPath =  "http://172.18.0.131:8082/EDS/jsp/index.jsp"; //大网
//var vodMainPath =  "http://172.18.0.19:33200/EPG/jsp/index.jsp";   //测试网