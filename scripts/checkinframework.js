/*
*检查用户是否跳出框架
*/
(function (w) {
    if (webConfig.debug) {
        if (w.$f.ui) w.$f.ui.loadPage("/Home/Login");
        return;
    }

    //没有加载器
    if (!w.$f.ui) {
        location.href = "/?returnUrl=" + location.pathname;
        return;
    }

    /**
     * 是否需要菜单
     * @param {} url 
     * @returns {} 
     */
    function isNeedMenu(url) {
        if (/^Home\/Index/i.test(url)) {
            return false;
        }
        else if (/^Home\/Login/i.test(url)) {
            return false;
        }
        else if (/^Home\/PageLoader/i.test(url)) {
            return false;
        }
        return true;
    }

    //有加载器加载页面
    var returnUrl = w.$f.getQueryString("returnUrl");
    if (w.$f.ui && returnUrl) {
        if (isNeedMenu(returnUrl)) {
            //需要菜单
            w.$f.ui.loadPage("/Home/Index", function () {
                w.$f.setUrl(returnUrl);
                w.$f.ui.$children[0].selectMenuByUrl();
            });
        } else {
            //不需要菜单
            w.$f.ui.loadPage(returnUrl);
        }
    } else {
        //默认加载登录页面
        w.$f.ui.loadPage("/Home/Login");
    }
})(window)