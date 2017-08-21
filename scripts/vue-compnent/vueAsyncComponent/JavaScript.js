/**
 * author      : 反转的分针
 * mail        : 114233763@qq.com
 * date        : 20170702
 * description : 远程加载页面并转化为组件
 */

/**
* 异步加载组件
* @example:
*    var vm = new Vue({
*       el:"#demo",
*        components: {
*            "demo-detail": vueAsyncComponent("/Demo/Detail", function () {
*                vm.$refs.detail.$on("submit", function () {
*                    me.$message({
*                        type: "info",
*                        message: "submit"
*                    });
*                });
*            })
*        }
*    });
*/
var vueAsyncComponent = function (url,fnCallback) {
    return function (resolve, reject) {
        $f.getPageComponent({
            url: url,
            isBack: true,
            isChangeUrl:false,
            success: function (c) {
                resolve(c);
                if (fnCallback) fnCallback();
            },
            error: function (error) {
                reject(error);
            }
        });
    };
};