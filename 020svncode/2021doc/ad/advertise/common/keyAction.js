document.onkeydown = function (event) {
    var e = event || window.event,
        keyCode = e.keyCode || e.which;
    // console.log('----------------keyCode:' + keyCode);
    switch (keyCode) {
        case 37:
            moveLeft && moveLeft();
            break;
        case 38:
            moveUp && moveUp();
            break;
        case 39:
            moveRight && moveRight();
            break;
        case 40:
            moveDown && moveDown();
            break;
        case 13:
            doConfirm && doConfirm();
            break;
        case 48:
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
            doNum && doNum(keyCode - 48);
            break;
        case 8:
        case 640:
            if(keyBack) {
                preventDefault(e);
                keyBack();
            }
            break;
        case 114:
            if(keyExit) {
                preventDefault(e);
                keyExit();
            }
            break;
        case 120:// page_up
            pageUp && pageUp();
            break;
        case 121: //// page_down
            pageDown && pageDown();
            break;
        default:
            break;
    }
};

document.onkeypress = function (e) {
    var keyCode = e.which || e.keyCode;
    //document.getElementById('test').innerHTML = "事件"+keyCode;
    // showLog(keyCode);
    switch (keyCode) {
        case 40200:
            if(mp) {
                if(isAndroid()) mp.stop();
                mp.playFromStart();
            }
            break;
    }
};
