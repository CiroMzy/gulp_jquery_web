(function(win) {
    var doc = win.document;
    var docEl = doc.documentElement;
    resizeFn ();
    window.addEventListener('resize', resizeFn);
    function resizeFn (){
        var width = docEl.getBoundingClientRect().width;
        var rem = width / 10;
        docEl.style.fontSize = rem + 'px';
        console.log('index resize')
    };
})(window);
// window.mode = 'test'
var hasUserInfo = false
if (window.location.href.indexOf('isShare') > -1) {
    window.mode = 'test'
}