/*
* author : zhy
*   mail : mailzy@vip.qq.com
*   date : 20161116
* plugin : alert
* example: this.$alert.open("hello",function(){});
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

    var alertPlugin = {
        install: function (vue) {
            if (this.installed) return;
            this.installed = true;

            vue.prototype.$alert = new Vue({
                compiled: function () {
                    var me = this;
                    window.addEventListener("load", function () {
                        me.$appendTo("body");
                    });
                },
                data: function () {
                    return {
                        isShow: false,
                        title: "信息",
                        message: "信息",
                        okButtonText: "确定",
                        onOk: function () { }
                    };
                },
                el: toElement("<div></div>"),
                template: "<div :style='{ display: isShow ? \"block\":\"none\" }' class='weui_dialog_alert'>" +
                    "<div class=\"weui_mask\">" +
                    "<section class='weui_dialog'>" +
                    "<div class='weui_dialog_hd'>{{title}}</div>" +
                    "<div class=\"weui_dialog_bd\">{{{message}}}</div>" +
                    "<footer class='weui_dialog_ft'>" +
                    "<a href=\"javascript:void(0);\" @click=\"onOkClick\" class=\"weui_btn_dialog primary\">{{okButtonText}}</a>" +
                    "</footer>" +
                    "</section>" +
                    "</div>" +
                    "</div>",
                methods: {
                    open: function (options) {
                        var me = this;

                        if (typeof options === "string") {
                            me.message = options;

                            //第二个参数是方法
                            if (typeof arguments[1] === "function") {
                                me.onOk = arguments[1];
                            }

                            if (typeof arguments[1] === "string") {
                                me.title = arguments[1];
                            }
                        } else if (typeof options === "object" && options !== null) {
                            for (var propertyName in options) {
                                if (options.hasOwnProperty(propertyName)) {
                                    me[propertyName] = options[propertyName];
                                }
                            }
                        }

                        me.isShow = true;
                    },
                    close: function () {
                        this.isShow = false;
                    },
                    onOkClick: function () {
                        this.isShow = false;
                        this.onOk();
                    }
                }
            });
        }
    };

    if (typeof window !== "undefined" && window.Vue) {
        window.Vue.use(alertPlugin);
    }

    return alertPlugin;
})));