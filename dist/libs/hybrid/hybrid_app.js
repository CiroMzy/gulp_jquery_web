
var hybrid_app ={};
var ua = navigator.userAgent;
//判断e生活版本号
hybrid_app.elifeVer = function() {
    try {
        var version = navigator.userAgent.match(new RegExp('fullversion:(\\d\.\\d\.\\d\.\\d)'));
        if(version==undefined){
            version = navigator.userAgent.match(new RegExp('fullversion:(\\d\.\\d\.\\d)'));
        }
        version = (version == undefined ? "0" : version);
        version = parseInt(version[1].replace(/\./g, ''));
        version = (version==""?"1000":version);
        return version;
    } catch (e) {
        return "1000";
    }
};
//判断是否是融e联 ios
hybrid_app.isRELIphone = function () {
    if (ua.indexOf('ICBCiPhoneBS')>-1) {
        return true;
    }
    return false;
};
//  判断是否是融e联 android
hybrid_app.isRELAndroid = function () {
    if (ua.indexOf('ICBCAndroidBS')>-1 ) {
        return true;
    }
    return false;
};
/**
 * 检测当前浏览器是否为Android(Chrome)
 */
hybrid_app.isAndroid = function() {
    if (ua.indexOf('Android')>-1) {
        return true;
    }
    return false;
};
/**
 * 检测当前浏览器是否为iPhone(Safari)
 */
hybrid_app.isIPhone = function() {
    if (ua.indexOf('iPhone')>-1) {
        return true;
    }
    return false;
};
//android拦截native
hybrid_app.GetNativeFunctionAndroid = function(para) {
    setTimeout(function () {
        var res;
        switch (para.keyword) {
            case 'open' :
                res = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['open','" + para.callMethod + "']}");
                callLogin(res);
                break;
            case 'showToolBar' :
                res = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['showToolBar','" + para.isShow + "']}");
                break;
            case 'back' :
                res = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['back','']}");
                break;
            case 'openGPS' :
                res = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['openGPS','']}");
                break;
            case 'closeGPS' :
                res = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['closeGPS','']}");
                break;
            case 'getMyLocation' :
                res = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['getMyLocation','" + para.getGps + "']}");
                getGps(res);
                break;
            case 'callPhoneNumber' :
                res = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['callPhoneNumber','" + para.tel + "']}");
                break;
            case 'share' :
                res = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['share','" + para.shareInfo + "']}");
                break;
            case 'openAddress' :
                res = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['openAddress','" + para.custId + "','" + para.appId + "']}");
                break;
            case 'getDefaultAddress' :
                res = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['getDefaultAddress','" + para.custId + "','" + para.appId + "'],callBack:" + para.callback + "}");
                // if(local_debug == true)
                //     alert("getDefaultAddress bpshop");

                callBackAddress(res);
                break;
            case 'getThirdScan' :
                res = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['getThirdScan','" + para.callback + "']}");
                thirdScanCallback(res);
                break;
            case 'getThirdARScan' :
                res = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['getThirdARScan','" + para.callback + "']}");
                thirdARScanCallback(res);
                break;
        }
    });
};

//ios注册native
function connectWebViewJavascriptBridge(callback) {
    if(window.WebViewJavascriptBridge){
        return callback(WebViewJavascriptBridge);
    }else{
        document.addEventListener('WebViewJavascriptBridgeReady', function() {
            callback(WebViewJavascriptBridge);
        }, false);
    }
    if(window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe=document.createElement('iFrame');
    WVJBIframe.style.display='none';
    WVJBIframe.src='wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function(){document.documentElement.removeChild(WVJBIframe)});

}
connectWebViewJavascriptBridge(function(bridge) {
    bridge.init();
    bridge.registerHandler("callback",callback);
});

var ICBCBridge = {
    callHandler: function(name, params, callback) {
        connectWebViewJavascriptBridge(function(bridge) {
            bridge.callHandler(name, params, callback);
        });
    },
    send: function(params, callback) {
        connectWebViewJavascriptBridge(function(bridge) {
            bridge.send(params, callback);
        });
    }
};
window.ICBCBridge = ICBCBridge;

//中途登录
hybrid_app.merLogin = function(callMethod){
    // alert(1)
    if (window.location.port === '2333'){
        callLogin('OwxihdlSyQ8le1LO7qWH4CG4aw2HiA3dc2mMP1XFX2sPdCSIGI5UrIAw9+bhpf8l7OtS2JlEflK7upbGjjVO9N6g8bbe8Kuv+ZekdjNIWXSGImpFn6KaHqRNnZv1gdXsK+N/XQu5mutHkGbw5o24AC5GCu7+qh11vNQ1PUmOwvSLBq1YP48WFHslWp0a4QmbnjX4Wxv0ueyxXxGnglEsBA5QcpQW6MoF2/vuiseSKmd65PY3MacTEZquyM7j1PFlKGQpy97en0ajePnjUhsTTgF25aIhkBr0TdjJPVhV1RW4Do3ePbTDmtDpFe6mcYwd1JhPqXakwjKoRmwky1d5uxZ6CWT2MP0YMK2oF6NoyL0=')
        return
    }

    //如果是安卓
    if(hybrid_app.isAndroid()){
        if(callMethod != null){
            if(hybrid_app.elifeVer() < '213') {
                Myutils.open(callMethod);
            } else {
                hybrid_app.GetNativeFunctionAndroid({'keyword': 'open', 'callMethod': callMethod});
            }
        }else{
            if(hybrid_app.elifeVer() < '213') {
                Myutils.open("callLogin");
            } else {
                hybrid_app.GetNativeFunctionAndroid({'keyword': 'open', 'callMethod': "callLogin"});
            }
        }
    }else{  //ios
        if(callMethod != null){
            window.ICBCBridge.callHandler("Myutils.open",callMethod);
        }else{
            window.ICBCBridge.callHandler("Myutils.open","callLogin");
        }
    }

}
//第三方显示或隐藏tabbar isShow:true显示tabbar 反之隐藏
hybrid_app.showToolBar = function(isShow){
    //如果是安卓
    if(hybrid_app.isAndroid()){
        if(hybrid_app.elifeVer() < '213') {
            Myutils.showToolBar(isShow);
        } else {
            hybrid_app.GetNativeFunctionAndroid({'keyword': 'showToolBar', 'isShow': isShow});
        }
    }else{  //ios
        window.ICBCBridge.callHandler("Myutils.showToolBar",isShow);
    }
}

//第三方返回上一级页面
hybrid_app.back = function(){
    //如果是安卓
    if(hybrid_app.isAndroid()){
        if(hybrid_app.elifeVer() < '213') {
            Myutils.back();
        } else {
            hybrid_app.GetNativeFunctionAndroid({'keyword': 'back'});
        }
    }else{  //ios
        window.ICBCBridge.callHandler("Myutils.back");
    }
}
//第三方开启定位
hybrid_app.openGPS = function(){
    //如果是安卓
    if(hybrid_app.isAndroid()){
        if(hybrid_app.elifeVer() < '213') {
            Myutils.openGPS();
        } else {
            hybrid_app.GetNativeFunctionAndroid({'keyword': 'openGPS'});
        }
    }else{  //ios
        window.ICBCBridge.callHandler("Myutils.openGPS");
    }
}
//第三方关闭定位
hybrid_app.closeGPS = function(){
    //如果是安卓
    if(hybrid_app.isAndroid()){
        if(hybrid_app.elifeVer() < '213') {
            Myutils.closeGPS();
        } else {
            hybrid_app.GetNativeFunctionAndroid({'keyword': 'closeGPS'});
        }
    }else{  //ios
        window.ICBCBridge.callHandler("Myutils.closeGPS");
    }
}

//第三方获取定位  参数是回调的函数名的字符串
hybrid_app.getMyLocation = function(getGps){
    //如果是安卓
    if(hybrid_app.isAndroid()){
        if(getGps != null){
            if(hybrid_app.elifeVer() < '213') {
                Myutils.getMyLocation(getGps);
            } else {
                hybrid_app.GetNativeFunctionAndroid({'keyword': 'getMyLocation', 'getGps': getGps});
            }
        }else{
            if(hybrid_app.elifeVer() < '213') {
                Myutils.getMyLocation("getGps");
            } else {
                hybrid_app.GetNativeFunctionAndroid({'keyword': 'getMyLocation', 'getGps': "getGps"});
            }
        }

    }else{  //ios
        if(getGps != null){
            window.ICBCBridge.callHandler("Myutils.getMyLocation",getGps);
        }else{
            window.ICBCBridge.callHandler("Myutils.getMyLocation","getGps");
        }
    }
}


//第三方打电话功能  参数是电话号
hybrid_app.callPhoneNumber = function(tel){
    //如果是安卓
    if(hybrid_app.isAndroid()){
        if(hybrid_app.elifeVer() < '213') {
            Myutils.callPhoneNumber(tel);
        } else {
            hybrid_app.GetNativeFunctionAndroid({'keyword': 'callPhoneNumber', 'tel': tel});
        }
    }else{  //ios
        window.ICBCBridge.callHandler("Myutils.callPhoneNumber",tel);
    }
}

//base64转码（由于ios客户端对特殊字符拦截，故要转码后传值）
hybrid_app.base64Encode = function (str) {
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };

    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    str = _utf8_encode(str);
    while (i < str.length) {
        chr1 = str.charCodeAt(i++);
        chr2 = str.charCodeAt(i++);
        chr3 = str.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output = output +
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }
    return output;
},
//分享
    hybrid_app.share = function (shareInfo) {
        if (ICBCUtilTools.isAndroid()) {
            if(hybrid_app.elifeVer() < '213') {
                window.Myutils.share(shareInfo);
                return;
            } else {
                hybrid_app.GetNativeFunctionAndroid({'keyword': 'share','shareInfo': shareInfo});
            }
        }else if(ICBCUtilTools.isiPhone()){
            //（ios需要将参数base64加密）
            window.ICBCBridge.callHandler("Myutils.share", hybrid_app.base64Encode(shareInfo));
        }
    }





//获取定位信息的回调例，提供给第三方时，请删除方法体内容
//param位json格式，{"longitude":"","latitude":""},定位失败时，param为null,或""
function getGps(param) {
    if(param != null && param != ""){
        $("#myLocal").text(param.longitude+","+param.latitude);
    }else{
        $("#myLocal").text("定位获取失败！");
    }
}





//4月新增 1、获取默认地址(解密方式同中途登录) 2、打开管理收货地址页面 3、第三方唤起扫一扫
//获取默认地址回调，同中途登录，获取param值后做自有逻辑即可

//第三方扫一扫回调，同中途登录，获取param值后做自有逻辑即可
function thirdScanCallback(param) {
    parseAes(param.addredd)
}

//获取默认地址
hybrid_app.getDefaultAddress = function (custId, appId) {
    if (ICBCUtilTools.isAndroid()) {
        hybrid_app.GetNativeFunctionAndroid({'keyword': 'getDefaultAddress', 'custId': custId, 'appId': appId, 'callback': 'callBackAddress'});
    }else if(ICBCUtilTools.isiPhone()){
        var paraObj = {
            custId: custId,
            appId: appId,
            callback: 'callBackAddress'
        };
        paraObj = JSON.stringify(paraObj);
        window.ICBCBridge.callHandler("Myutils.getDefaultAddress",hybrid_app.base64Encode(paraObj));
    }
}
//打开管理收货地址页面
hybrid_app.openAddress = function (custId, appId) {
    if (ICBCUtilTools.isAndroid()) {
        hybrid_app.GetNativeFunctionAndroid({'keyword': 'openAddress', 'custId': custId, 'appId': appId});
    }else if(ICBCUtilTools.isiPhone()){
        var paraObj = {
            custId: custId,
            appId: appId
        };
        paraObj = JSON.stringify(paraObj);
        window.ICBCBridge.callHandler("Myutils.openAddress",hybrid_app.base64Encode(paraObj));
    }
}
//打开扫一扫
hybrid_app.getThirdScan = function () {
    if (ICBCUtilTools.isAndroid()) {
        hybrid_app.GetNativeFunctionAndroid({'keyword': 'getThirdScan', 'callback': "thirdScanCallback"});
    }else if(ICBCUtilTools.isiPhone()){
        window.WebViewJavascriptBridge.callHandler("Myutils.getThirdScan", "thirdScanCallback");
    }
}



function callLogin(param) {
    $.ajax({
        type : "POST",
        url : URI.Decrypt,
        data:{
            param:param
        },
        success : function(obj) {
            $.ajax({
                type : "POST",
                url : URI.Login,
                data:{
                    param:obj.data
                },
                success : function(obj2) {
                    setSessionStorage({'userInfo':obj2.data})
                },
                error : function(XMLHttpRequest, textStatus, errorThrown) {
                    alert('登陆失败')
                }
            });
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            alert('登陆失败')

        }
    });
}