// 资源轮播相关

var carouselIndex = []; //当前显示的是folder中的第几个资源
var carouselLength = []; //轮播的个数，取文件夹最小长度
var currentCarouseArr = [];
var currentCarouseIdArr = [];
//var pageMap[tabIndex] = [];
var timeInterval = 4000;
var pageMap = {};
var timer;

function setCarouseGlobal(){
    setGlobalVar('carouselIndex',JSON.stringify(carouselIndex).toString());
    setGlobalVar('carouselLength',JSON.stringify(carouselLength).toString());
    setGlobalVar('currentCarouseArr',JSON.stringify(currentCarouseArr).toString());
    setGlobalVar('currentCarouseIdArr',JSON.stringify(currentCarouseIdArr).toString());  
    setGlobalVar('pageMap',JSON.stringify(pageMap).toString()); 
}

function getCarouseGlobal() {
    carouselIndex = getGlobalJson('carouselIndex');
    carouselLength = getGlobalJson('carouselLength');
    currentCarouseArr = getGlobalJson('currentCarouseArr');
    currentCarouseIdArr = getGlobalJson('currentCarouseIdArr');
    pageMap = getGlobalJson('pageMap');
}

function getGlobalJson(paramName){
    var json = {};
    var jsonStr = getGlobalVar(paramName) || "";
    if (jsonStr != null && jsonStr.length>0) {
        json = JSON.parse(jsonStr) || {};
    }
    return json;
}

//找出文件夹及其子集
function parseCellData(data,pageIndex){
    if(isBack === "y" && !isNeedUpdate){
        parseReturnData(data,pageIndex);
        return data;
    }
    console.log(tabIndex);
    pageMap[tabIndex] = [];
    currentCarouseArr[tabIndex] = [];
    currentCarouseIdArr[tabIndex] = [];
    carouselIndex[tabIndex] = [];
    carouselLength[tabIndex] = [];

    //第一步 找出文件夹
    for (var i = 0; i < data.length; i++) {
        if(data[i].mediaType == 10){
            data[i].son = [];
            pageMap[tabIndex].push(data[i]);
            //去掉文件夹
            data.splice(i,1); 
            i--;
        }
    }

    //如果没有文件夹 直接返回
    if (pageMap[tabIndex].length <= 0) {

        return data;
    }

    //找到文件夹中的资源，并将其放进文件夹中
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < pageMap[tabIndex].length; j++) {
            if(data[i].container == pageMap[tabIndex][j].cellId){
                
                data[i].folderIndex = j;                        //记录是第几个文件夹
                //data[i].cellIndex = pageMap[tabIndex][j].son.length;     //记录是文件夹中的第几个资源
                
                pageMap[tabIndex][j].son.push(data[i]);
                //去掉data中的文件夹资源
                data.splice(i,1);
                i--;
                break;
            }
        } 
    }

    //根据rank字段，为文件夹中的元素排序
    sortFolderCell();

    //将文件夹中的第一个资源放回data中
    for (var k = 0; k < pageMap[tabIndex].length; k++) {
        data.push(pageMap[tabIndex][k].son[0]);
        currentCarouseArr[tabIndex].push(pageMap[tabIndex][k].son[0]);
        currentCarouseIdArr[tabIndex].push(pageMap[tabIndex][k].son[0].cellId);
    }

    setCarouselLength();

    return data;
}

function parseReturnData(data,pageIndex) {

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < pageMap[tabIndex].length; j++) {
            if(data[i].container == pageMap[tabIndex][j].cellId){
                //去掉data中的文件夹资源
                var index_ = carouselIndex[pageIndex][j];

                data[i].posterUrl = pageMap[tabIndex][j].son[index_].posterUrl;
                data[i].intent = pageMap[tabIndex][j].son[index_].intent;
                break;
            }
        } 
    }
    return data;
}

function sortFolderCell(){
    for (var k = 0; k < pageMap[tabIndex].length; k++) {
        pageMap[tabIndex][k].son.sort(function(a,b){
                return (a.rank-b.rank);
        });
    }
}


//开始轮播
function startCarouse() {
    if (timer != null) {return;}
    timer = setInterval(function(){
        for (var i = 0; i < currentCarouseArr[tabIndex].length; i++) {
            var id = currentCarouseArr[tabIndex][i].cellId;
            
            var currfolderIndex = currentCarouseArr[tabIndex][i].folderIndex;
            carouselIndex[tabIndex][currfolderIndex] = getCarouseIndex(currfolderIndex);

            var replaceEle = pageMap[tabIndex][currentCarouseArr[tabIndex][i].folderIndex].son[carouselIndex[tabIndex][currfolderIndex]];
            $(id).innerHTML = '<img src="'+ replaceEle.posterUrl +'">'
            $(id).setAttribute("carouseLink",replaceEle.intent);
        }
        
    }, timeInterval);
}

function stopCarouse() {
    clearInterval(timer);
    timer = null;
}


function setCarouselLength(){ 
    var arr = [];
    for (var i = 0; i < pageMap[tabIndex].length; i++) {
        arr.push(pageMap[tabIndex][i].son.length);
        carouselIndex[tabIndex][i] = 0;
    }
    //arr.sort();
    carouselLength[tabIndex] = arr;
}

function getCarouseIndex(folderIndex) {
    if(carouselIndex[tabIndex][folderIndex] + 1 == carouselLength[tabIndex][folderIndex]){
        return 0;
    }
    return carouselIndex[tabIndex][folderIndex] + 1;
}

//tab.down  ScrollHView.onkey
function cellCheckCarouse(lastFocusId,current) {
    if(pageMap[tabIndex].length <= 0) return;
    
    if (currentCarouseIdArr[tabIndex].indexOf(lastFocusId) == -1) {
        if (Area == 0 || current==null) {
            
        }else if(currentCarouseIdArr[tabIndex].indexOf(current.cellId)!=-1){
            stopCarouse();
        }
    
    }else{
        if (Area == 0 || current==null) {
            startCarouse();
        }else if(currentCarouseIdArr[tabIndex].indexOf(current.cellId)==-1){
            startCarouse();
        }
    }
}

//Tab.tabFub ScrollHView.init
function checkCarouse(currentId) {
    stopCarouse();
    if (pageMap[tabIndex].length <= 0) return;
    if(currentCarouseIdArr[tabIndex].indexOf(currentId)==-1){
        startCarouse();
    }else{
        stopCarouse();
    }
}