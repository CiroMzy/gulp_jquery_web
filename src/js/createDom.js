function createDom() {
}
// --------------------------------------------首页 ----------------------------------------------------
// --------------------------------------------开始 ----------------------------------------------------

// ------------------创建轮播图
createDom.prototype.indexBanner = function(list) {
    let listDom = ''
    list.forEach(item => {
        listDom += `
          
             <div class="swiper-slide">
                <div class="swiper-slide" data-slideshow_type="${item.slideshow_type}" data-goods_id="${item.goods_id}"  data-link_url="${item.link_url}"  data-class_id="${item.class_id}" style="background-image: url('${ROOT_URI_IMAGE}${item.accessory_path}')"></div>
             </div>
        `
    })
    return listDom
}

// --------------------------------------------首页 ----------------------------------------------------
// --------------------------------------------结束 ----------------------------------------------------
