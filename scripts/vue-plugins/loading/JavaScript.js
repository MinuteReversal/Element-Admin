/*
* author : zhy
*   mail : mailzy@vip.qq.com
*   date : 20161116
* plugin : loading
* example: this.$loading.show();
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global.VueResource = factory());
}(this, (function () {
    'use strict';

    function toElement(html) {
        var tempContainer = document.createElement("div");
        tempContainer.innerHTML = html;
        return tempContainer.firstElementChild;
    }

    var loadingPlugin = {
        install: function (vue) {
            if (this.installed) return;
            this.installed = true;

            vue.prototype.$loading = new Vue({
                compiled: function () {
                    var me = this;
                    window.addEventListener("load", function () {
                        me.$appendTo("body");
                    });
                },
                data: function () {
                    return {
                        isShow: false,
                        message: "数据加载中"
                    };
                },
                el: toElement("<div></div>"),
                template: '<div :style="{ display: isShow ? \'block\':\'none\' }" class="weui_loading_toast" >' +
                                '<div class="weui_mask_transparent"></div>' +
                                '<div class="weui_toast">' +
                                '<div class="weui_loading">' +
                                '<div class="weui_loading_leaf weui_loading_leaf_0"></div>' +
                                '<div class="weui_loading_leaf weui_loading_leaf_1"></div>' +
                                '<div class="weui_loading_leaf weui_loading_leaf_2"></div>' +
                                '<div class="weui_loading_leaf weui_loading_leaf_3"></div>' +
                                '<div class="weui_loading_leaf weui_loading_leaf_4"></div>' +
                                '<div class="weui_loading_leaf weui_loading_leaf_5"></div>' +
                                '<div class="weui_loading_leaf weui_loading_leaf_6"></div>' +
                                '<div class="weui_loading_leaf weui_loading_leaf_7"></div>' +
                                '<div class="weui_loading_leaf weui_loading_leaf_8"></div>' +
                                '<div class="weui_loading_leaf weui_loading_leaf_9"></div>' +
                                '<div class="weui_loading_leaf weui_loading_leaf_10"></div>' +
                                '<div class="weui_loading_leaf weui_loading_leaf_11"></div>' +
                                '</div>' +
                                '<p class="weui_toast_content">{{message}}</p>' +
                                '</div>' +
                           '</div>',
                methods: {
                    show: function (options) {
                        var me = this;

                        if (typeof options === "string") {
                            me.message = options;
                        } else if (typeof options === "object" && options !== null) {
                            for (var propertyName in options) {
                                if (options.hasOwnProperty(propertyName)) {
                                    me[propertyName] = options[propertyName];
                                }
                            }
                        }

                        me.isShow = true;
                    },
                    hide: function () {
                        this.isShow = false;
                    }
                }
            });
        }
    };

    if (typeof window !== "undefined" && window.Vue) {
        window.Vue.use(loadingPlugin);
    }

    return loadingPlugin;
})));