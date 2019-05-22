
var weChat = {

    wx_base_para: {
        appid: '1111',
        xmlhttp: '',
        access_token: '',
        openid: ''
    },
    wx_url: {
        //授权
        authorize_url: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect',
        //拉取用户信息
        userinfo_url: 'https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN'
    },
    method: {

        auth: function (url) {
            var code = this.getParams(url, "code");
            //获取不到本地存储的openID则走获取流程
            if (!sessionStorage.openID) {
                // layer.msg("code:" + code)
                if (code) {
                    $.ajax({
                        url: getOpenID,
                        data: {code: code},
                        dataType: "json",
                        success: function (data) {
                            // alert(JSON.stringify(data))
                            if (data.code === 0) {
                                if (data.data.flag) {
                                    window.location.href = "index.html";
                                }
                                sessionStorage.openID = data.data.openId;
                            }
                        }
                    });
                } else {
                    weChat.method.m_authorize(url);
                }
            }
        },
        getParams: function (url, key) {
            var str = url;
            var index = -1;
            do {
                str = str.replace("?", "&");
                index = str.indexOf("?");
            } while (index > -1);
            var strsz = str.split("&");
            var map = {};
            $.each(strsz, function (n, strs) {
                if (strs.indexOf("=") != -1) {
                    var tempsz = strs.split("=");
                    var tempkey = tempsz[0];
                    var tempvalue = tempsz[1];
                    map[tempkey] = tempvalue;
                }
            });
            return map[key];
        },
        //授权
        m_authorize: function (redirect_uri) {
            var aut_url = weChat.wx_url.authorize_url;
            aut_url = aut_url.replace(/APPID/g, weChat.wx_base_para.appid);
            aut_url = aut_url.replace(/REDIRECT_URI/g, redirect_uri);
            window.location.href = aut_url;

        },
        share: function (title, content, img) {
            $.ajax({
                url: wxShareUrl,
                data: {url: window.location.href},
                type: "post",
                dataType: "json",
                success: function (data) {
                    wx.config({
                        debug: false,
                        appId: data.appId,
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        signature: data.signature, // 签名
                        jsApiList: [
                            // 所有要调用的 API 都要加到这个列表中
                            'onMenuShareTimeline',       // 分享到朋友圈接口
                            'onMenuShareAppMessage',  //  分享到朋友接口
                            'onMenuShareQQ',         // 分享到QQ接口
                            'onMenuShareWeibo',      // 分享到微博接口
                            'onMenuShareQZone'         //分享到QQ空间
                        ]
                    });
                }
            });
            wx.error(function (res) {
                // alert("接口处理失败" + JSON.stringify(res))
            });
            weChat.method.setWxParams(title, content, img);
        },
        setWxParams: function (title, content, img) {
            var mImgUrl = img ? img : defaultImgBaseUrl + "/static/images/main/share-logo.png";
            var params = {
                title: title,   // 分享标题
                link: window.location.href,  // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                desc: content, // 分享描述
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                imgUrl: mImgUrl,
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            };
            wx.ready(function () {
                wx.onMenuShareTimeline(params);
                wx.onMenuShareAppMessage(params);
                wx.onMenuShareQQ(params);
                wx.onMenuShareWeibo(params);
                wx.onMenuShareQZone(params);
            });
        }, //判断当前页面是否加载过指定js
        hasJs: function (js) {
            var scripts = document.getElementsByTagName("script");
            var has = false;
            for (var i = 0, l = scripts.length; i < l; i++) {
                var src = scripts[i].src;
                if (src.indexOf(js) != -1) {
                    has = true;
                    break;
                }
            }
            return has;
        }
    }
};


//如果没有微信js并且需要分享,则加载微信js
if (!weChat.method.hasJs("jweixin-1.2.0.js")) {
    document.write("<script src='http://res.wx.qq.com/open/js/jweixin-1.2.0.js' type='text/javascript'></script>");
}

