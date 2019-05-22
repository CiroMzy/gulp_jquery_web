
let _openid = getLocalStorage('openid')

if (!_openid){
    wx_login_handler()
}
getInitData()


// 获取项目配置信息
function getInitData() {
    let hasSettings = getSessionStorage('weixinshangcheng')
    if (!hasSettings || (typeof hasSettings !== 'object')) {
        let obj = {
            activity: globalVar.isActivity,
            activity_id: globalVar.activityId
        }
        $.ajax({
            type: "POST",
            url: URI.globalSettings,
            headers:{
                token: (getSessionStorage('userInfo') && getSessionStorage('userInfo').token) ? getSessionStorage('userInfo').token : ''
            },
            async: false,
            data: obj,
            success (data) {
                if (data.code === 0){
                    setSessionStorage({weixinshangcheng: data.data})
                    resetGlobalVar()
                } else {
                    alert('获取配置失败')
                }
            },
            error () {
                alert('获取配置失败')
            }
        });
    } else {
        resetGlobalVar()
    }
}

// 根据项目信息配置
function resetGlobalVar() {
    let globalSettings = getSessionStorage('weixinshangcheng')
    globalVar.payType = globalSettings.pay_type + ''
    globalVar.deliveryType = globalSettings.is_delivery_fee + ''
    globalVar.mianYunFei = globalSettings.free_delivery_fee
    globalVar.mianYunFeiMian = globalSettings.delivery_fee
    globalVar.mianYunFeiPoints = globalSettings.free_delivery_points
    globalVar.mianYunFeiPointsMian = globalSettings.delivery_points
}



// 执行支付
function mainPayHandler(type, id) {
    let layerPay = layer.open({
        content: '支付中',
        type: 2,
        shadeClose: false
        , time: 5
    });
    Fecth(URI.wxPay, {order_id: id, platform_pay_type: 1},{origin: true}).then(payResult => {
        layer.close(layerPay)
        if (payResult.type === '1'){
            layer.open({
                content: '购买成功'
                , skin: 'msg'
                , time: 2
            })
            setTimeout(() => {
                window.location.href = `./${router.orderList.page}`
            }, 2000)
            return
        }

        console.log(payResult, 'payResult')
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": payResult.appid,     //公众号名称，由商户传入
                "timeStamp": payResult.timeStamp,         //时间戳，自1970年以来的秒数
                "nonceStr": payResult.nonceStr, //随机串
                "package": payResult.packageValue,
                "signType": "MD5",         //微信签名方式:
                "paySign": payResult.paySign    //微信签名
            }, function (res) {
                console.log(res)
                sessionStorage.setItem("payFlag", "zhifu");
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    layer.open({
                        content: '支付成功'
                        , skin: 'msg'
                        , time: 2
                    })
                    setTimeout(() => {
                        window.location.href = `./${router.orderList.page}`
                    }, 2000)
                } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                    layer.open({
                        content: '用户取消支付'
                        , skin: 'msg'
                        , time: 2
                    })
                } else {
                    layer.open({
                        content: '支付失败!'
                        , skin: 'msg'
                        , time: 2
                    })
                }
            }
        );

    }).catch(e => {
        layer.close(layerPay)
    })

}

function wx_login_handler() {

    //登陆微信
    if (!getLocalStorage('openid')) {
        let code = getQueryString('code')
        if (!code) {
            weChat.method.auth(window.location.href);
            return
        }

        // 获取信息
        Fecth(URI.getOpenId, {code: code}).then(res => {
            console.log(res)

            setLocalStorage({openid: res.openId, WX_NAME: res.nickname, PHOTO_URL: res.headimgurl})


            let data = {
                openID: res.openId,
                WX_NAME: res.nickname,
                PHOTO_URL: res.headimgurl,
            }
            Fecth(URI.LoginWeChat, data).then(res => {
                console.log(res)
                setSessionStorage({token: res.token, USER_ID: res.USER_ID, PHONE: res.PHONE})
            })

        })

    } else {

        // 登陆
        let openid = getLocalStorage('openid')
        let WX_NAME = getLocalStorage('WX_NAME')
        let PHOTO_URL = getLocalStorage('PHOTO_URL')

        let data = {
            openID: openid,
            WX_NAME: WX_NAME,
            PHOTO_URL: PHOTO_URL,
        }
        Fecth(URI.LoginWeChat, data).then(res => {
            console.log(res)
            setSessionStorage({token: res.token, USER_ID: res.USER_ID, PHONE: res.PHONE})
        })

    }
}
