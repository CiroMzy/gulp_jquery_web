
getInitData()


// 获取项目配置信息
function getInitData() {
    let hasSettings = getSessionStorage('weixinshangcheng')
    if (!hasSettings || (typeof hasSettings !== 'object')) {
        // 请求配置数据

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

