function pageFunc(conf){
    this.containerId = conf.containerId
    this.myFunc = conf.click //用户点击要执行的方法
    this.total = conf.total; //总页数
    this.currentPage = 1;    //当前页码
    this.centerUId = conf.centerUId;//滚动的pdf
    this.init()              //初始化
}

pageFunc.prototype.init = function(){
    var total = this.total,
        containerId=this.containerId,
        currentPage = this.currentPage,
        centerUId = this.centerUId,
        _this = this;

    listeners = {
        'setWhat' : function(opts) {
            _this.aClick(opts.src)
            return false;
        }
    };

    listenersPre = {
        'lmw-pre' : function(opts) {
            _this.prevClick()
            return false;
        }
    };

    listenersAdd = {
        'lmw-add' : function(opts) {
            _this.addClick()
            return false;
        }
    };

    listenersScroll = function (opts) {
        _this.aScroll()
        return false;
    }

    var rootele = this.createPage(currentPage,total);
    document.getElementById(containerId).innerHTML = rootele
    $on(document.getElementById(containerId), ['click'], listeners);//点击a标签
    $on(document.getElementById(containerId), ['click'], listenersPre);//点击上一页
    $on(document.getElementById(containerId), ['click'], listenersAdd);//点击下一页
    document.getElementById(centerUId).addEventListener('scroll', listenersScroll, false);

}
// //创建HTML分页结构字符串
pageFunc.prototype.createPage = function(page,total){
    var str = '<a class="lmw-current" href="#">'+ page +'</a>'
    for(var i=1;i<=3;i++){
        if(page-i>1){
            str = '<a attr-action="setWhat" href="#">'+ (page-i) + '</a>'+str
        }
        if(page+i<total){
            str = str+'<a attr-action="setWhat" href="#"> '+ (page+i) + '</a>'
        }
    };
    if(page-4>1){
        str = '<span>...</span>'+str
    };
    if(page+4<total){
        str = str+'<span>...</span>'
    };
    if(page>1){
        str = '<a class="lmw-pre" href="#">上一页</a><a attr-action="setWhat" href="#">1</a>'+str
    };
    if(page<total){
        str = str+'<a attr-action="setWhat"  href="#">'+total+'</a><a class="lmw-add"  href="#">下一页</a>'
    };
    return str
};
//上一页方法
pageFunc.prototype.prevClick = function(){
    var total = this.total
    var containerId = this.containerId
    var va = --this.currentPage
    var newret = this.createPage(va, total)
    document.getElementById(containerId).innerHTML = newret
    this.myFunc(va)
}
//下一页方法
pageFunc.prototype.addClick = function(){
    var total = this.total
    var va = ++this.currentPage
    var containerId = this.containerId
    var newret = this.createPage(va, total)
    document.getElementById(containerId).innerHTML = newret
    this.myFunc(va)
};
//点击方法
pageFunc.prototype.aClick = function(_this){
    var total = this.total
    var va = parseInt(_this.innerText);
    var containerId = this.containerId
    this.currentPage = va
    var rootele = this.createPage(va, total)
    document.getElementById(containerId).innerHTML = rootele
    this.myFunc(va)
};
//滚动定位方法
pageFunc.prototype.aScroll = function(_this){
    var scrollUl = parseInt(document.getElementById(this.centerUId).scrollTop/(842 + 10))+1;
    if(!(this.currentPage == scrollUl)){
        var total = this.total
        var containerId = this.containerId
        this.currentPage = scrollUl
        var rootele = this.createPage(scrollUl, total)
        document.getElementById(containerId).innerHTML = rootele
    }
};
//二：封装事件代理方法
function $on(dom, event, listeners) {
    $addEvent(dom, event, function(e) {
        var e = e || window.event,
            src = e.target || e.srcElement,
            action,
            returnVal;

        while (src && src !== dom) {
            action = src.getAttribute('attr-action') || src.getAttribute('class') ;
            if (listeners[action]) {
                returnVal = listeners[action]({
                    src : src,
                    e : e,
                    action : action
                });

                if (returnVal === false) {
                    break;
                }
            }
            src = src.parentNode;
        }
    });
};
//1、封装跨浏览器事件绑定方法
function $addEvent(obj, type, handle) {
    if(!obj || !type || !handle) {
        return;
    }

    if( obj instanceof Array) {
        for(var i = 0, l = obj.length; i < l; i++) {
            $addEvent(obj[i], type, handle);
        }
        return;
    }

    if( type instanceof Array) {
        for(var i = 0, l = type.length; i < l; i++) {
            $addEvent(obj, type[i], handle);
        }
        return;
    }
//2、解决IE中this指向window的问题
    function createDelegate(handle, context) {
        return function() {
            return handle.apply(context, arguments);
        };
    }

    if(window.addEventListener) {
        var wrapper = createDelegate(handle, obj);
        obj.addEventListener(type, wrapper, false);
    }
    else if(window.attachEvent) {
        var wrapper = createDelegate(handle, obj);
        obj.attachEvent("on" + type, wrapper);
    }
    else {
        obj["on" + type] = handle;
    }
};
