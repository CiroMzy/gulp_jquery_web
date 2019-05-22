// 是否开启debug模式
let debug = false
if(window.location.port === '2333'){
    debug = true
}
// 全局变量
let globalVar = {
    animateTime: 300,               // 动画执行时间
    animateLock: false,             // 动画锁定中
    address: '',                    // 地址
    addressId: '',                  // 地址id
    mianYunFei : 100,               // 运费-满减现金标准
    mianYunFeiMian : 10,            // 运费-现金
    mianYunFeiPoints : 66667,       // 运费-满减积分标准
    mianYunFeiPointsMian : 6667,    // 运费-积分
    shopTel: '400-630-8688',        // 客服电话
    isSingleLoading: false,         // 单loading限制
    payType: '1',                   // 支付方式 1：现金，2：积分，3：现金+积分
    deliveryType: '0',              // 配送方式 0：免邮费，1：不包邮，2：满免配送费
    activityId: '218',              // 活动id
    shareImg: 'https://aaaimage/icbc-icon-logo.png',                 // 分享后的图片logo
    shareUrl: `${ROOT_URI_FRONT}?isShared=true`,                                            // 分享后的连接
    shareTitle: '商城',                                                                  // 分享后的标题
    shareContent: '商城描述',                                                         // 分享后的标题


}

// 本地文件列表
let router = {
    activePage: {
    },
    index: {
        page: 'index.html',
        name: '商城',
        index: '0',
    },
    goodsList: {
        page: 'goodsList.html',
        name: '商品分类',
        index: '1',
    },
    mine: {
        page: 'mine.html',
        name: '个人中心',
        index: '1',
    },
    shoppingCart: {
        page: 'shoppingCart.html',
        name: '购物车',
        index: '1',
    }
}
setActivePage()

// 类型滤镜
let filters = {
    // 首页banner
    homeBanner: [
        {slideshow_type: 1,typeName:'商品'},
        {slideshow_type: 2,typeName:'分类'},
        {slideshow_type: 3,typeName:'链接'},
    ],
    // 通知公告传参数
    notice: [
        {notice_position:1, typeName:'首页'},
        {notice_position:2, typeName:'详情'},
    ],
    // 订单状态
    orderStatus: [
        {state:10, typeName:'待付款'},
        {state:20, typeName:'待发货'},
        {state:30, typeName:'已发货'},
        {state:40, typeName:'已取消'},
        {state:50, typeName:'已关闭'},
        {state:60, typeName:'待处理'},
        {state:70, typeName:'已同意'},
        {state:80, typeName:'已拒绝'},
        {state:100, typeName:'已完成'},
    ],
    // 订单类型
    orderType: [
        {state:10, typeName:'正常购买'},
        {state:20, typeName:'退货'},
        {state:30, typeName:'换货'},
        {state:40, typeName:'待发货，退款'},
    ],
    orderStatusType: [
        {
            orderType: 10,
            orderStatus: 10,
            typeName: '待付款'
        },
        {
            orderType: 10,
            orderStatus: 20,
            typeName: '待发货'
        },
        {
            orderType: 10,
            orderStatus: 30,
            typeName: '已发货'
        },
        {
            orderType: 10,
            orderStatus: 40,
            typeName: '已取消'
        },
        {
            orderType: 10,
            orderStatus: 100,
            typeName: '已完成'
        },

        {
            orderType: 20,
            orderStatus: 60,
            typeName: '待处理'
        },
        {
            orderType: 20,
            orderStatus: 70,
            typeName: '已同意'
        },
        {
            orderType: 20,
            orderStatus: 80,
            typeName: '已拒绝'
        },
        {
            orderType: 40,
            orderStatus: 60,
            typeName: '退款处理中'
        },
        {
            orderType: 40,
            orderStatus: 80,
            typeName: '已拒绝'
        },
        {
            orderType: 40,
            orderStatus: 100,
            typeName: '已退款'
        },
    ]

}


// fetch方法
/*
params{}
    loading: 显示loading
    origin：返回原始数据
    tongbu：同步加载
    noMsg: 不显示提示信息
 */
function Fecth(url, data={}, params) {
    return new Promise((res, rej) => {
        let loading;
        let asyc = (params && (params.asyc === false)) ? params.asyc : true
        if ((!params || (params.loading) || (params.loading === undefined) ) && !globalVar.isSingleLoading) {
            loading = layer.open({type: 2, shadeClose: false});
        }
        globalVar.isSingleLoading = true
        let postParams = {}
        for (var key in data) {
            if (typeof data[key] === "object" ){
                postParams[key] = JSON.stringify(data[key])
            }
            else {
                postParams[key] = data[key]
            }
        }
        // 添加活动设置
        postParams.activity = globalVar.isActivity
        postParams.activity_id = globalVar.activityId

        $.ajax({
            type: "POST",
            url: url,
            headers:{
                token: getSessionStorage('token') || ''
            },
            async: asyc,
            data: postParams,
            success (data) {
                setTimeout(() => {
                    layer.close(loading)
                }, 500)
                if (data.code === 2) {
                    layer.open({
                        content: '正在登录'
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
                    wx_login_handler()
                    return;
                }


                if (params && params.noMsg === true) {
                    exportData()
                    return;
                }

                if ((data.code !== 0)) {
                    layer.open({
                        content: data.msg? data.msg:"系统异常"
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
                    return;
                }

                setTimeout(() => {
                    globalVar.isSingleLoading = false
                }, 1500)
                exportData()

                function exportData() {
                    if (params && params.origin) {
                        res(data)
                    } else {
                        res(data.data)
                    }
                }

            },
            error () {
                layer.closeAll()
                globalVar.isSingleLoading = false
                layer.open({
                    content: '网络错误'
                    ,skin: 'msg'
                    ,time: 2 //2秒后自动关闭
                });

            }
        });
    })
}

// 设置当前匹配的路由页面
function setActivePage() {
    for (let key in router){
        let localHref = window.location.href
        if (localHref.indexOf(router[key].page) > -1){
            router.activePage = router[key]
        }
        if (localHref.charAt(localHref.length-1 ) === '/'){
            router.activePage = router['index']
        }
    }
}
