function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/********************************
 * localStorage
 */
/************
 * 是否存在localStorage
 * att 需要判断的属性
 */
function containLocalStorage(attr) {
    var storage = window.localStorage
    if (storage.hasOwnProperty(attr)) {
        return true
    } else {
        return false
    }

}

/**************
 * 添加localStorage
 * json 传入字面量对象格式如{name:'夏天'}
 */
function setLocalStorage(json) {
    if (!isJson(json) || !window.localStorage) {
        return
    }
    var storage = window.localStorage
    for (var item in json) {
        if (json.hasOwnProperty(item)) {
            storage[item] = JSON.stringify(json[item])
        }
    }
}

/**************
 * 获取localStorage
 * 存在，返回对应值
 * 不存在，返回''
 */
function getLocalStorage(attr) {
    var storage = window.localStorage
    if (containLocalStorage(attr)) {
        var json = {}
        try {
            json = JSON.parse(storage[attr])
        } catch (e) {
            json = {}
        }
        return json
    } else {
        return ''
    }
}
/*************
 * 删除localStorage
 *
 */
function delLocalStorage(attr) {
    var storage = window.localStorage
    if (containLocalStorage(attr)) {
        storage.removeItem(attr)
    }
}
/**************
 * 删除全部localStorage
 */
function delAllLocalStorage(attr) {
    var storage = window.localStorage
    storage.clear()
}





/**************
 * 添加sessionStorage
 * json 传入字面量对象格式如{name:'夏天'}
 */
function setSessionStorage(json) {
    if (!isJson(json) || !window.sessionStorage) {
        return
    }
    var storage = window.sessionStorage
    for (var item in json) {
        if (json.hasOwnProperty(item)) {
            storage[item] = JSON.stringify(json[item])
        }
    }
}
/**************
 * 获取sessionStorage
 * 存在，返回对应值
 * 不存在，返回''
 */
function getSessionStorage(attr) {
    var storage = window.sessionStorage
    if (containSessionStorage(attr)) {
        var json = {}
        try {
            json = JSON.parse(storage[attr])
        } catch (e) {
            json = {}
        }
        return json
    } else {
        return ''
    }
}
/********************************
 * localStorage
 */
/************
 * 是否存在localStorage
 * att 需要判断的属性
 */
function containSessionStorage(attr) {
    var storage = window.sessionStorage
    if (storage.hasOwnProperty(attr)) {
        return true
    } else {
        return false
    }

}

/**************************************************************************************************************************
 *                                  格式校验 相关
 ***************************************************************************************************************************/

/********************************
 * 判断是字面量对象
 *
 * true 是字面量对象， false 不是
 */
function isJson(data) {
    if (data instanceof Object && data.prototype === undefined) {
        return true
    }
    return false
}
/********************************
 * 判断是数字
 *
 * true 是数字
 */
function isNumber(data) {
    var reg = /^\d*$/
    return reg.test(data)
}