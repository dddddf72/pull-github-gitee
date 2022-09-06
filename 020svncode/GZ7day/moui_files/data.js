var iepgIP = "http://172.17.99.110:8088/iepg/";
//var iepgIP = "/iepg/";
var areaCode;
var version;

//分公司编码和moui区域码、终端版本号对照表
var cityData= {
    1002: {areaCode: "025001", version: "20020"},
    1003: {areaCode: "10000", version: "100001"},
    1004: {areaCode: "025001", version: "20021"}
};



function getAreaCodeAndver() {
    areaCode =  cityData[districtCode].areaCode;
    version = cityData[districtCode].version;
}