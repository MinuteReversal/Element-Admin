/*
* author : zhy
*   mail : mailzy@vip.qq.com
*   date : 20161116
* plugin : confirm
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

    var confirmPlugin = {
        install: function (vue) {
            if (this.installed) return;
            this.installed = true;

            vue.prototype.$confirm = new Vue({
                compiled: function () {
                    var me = this;
                    window.addEventListener("load", function () {
                        me.$appendTo("body");
                    });
                },
                data: function () {
                    return {
                        isShow: false,
                        title: "确认",
                        message: "请确认！",
                        yesButtonText: "确定",
                        noButtonText: "取消",
                        onYes: function () { },
                        onNo: function () { }
                    };
                },
                el: toElement("<div></div>"),
                template: '<div :style="{ display: isShow ? \'block\':\'none\' }"  class="weui_dialog_confirm">' +
                            '<div class="weui_mask"></div>' +
                                '<section class="weui_dialog">' +
                                    '<header class="weui_dialog_hd">{{title}}</header>' +
                                        '<div class="weui_dialog_bd">{{{message}}}</div>' +
                                        '<footer class="weui_dialog_ft">' +
                                        '<a href="javascript:void(0);" @click="onNoClick" class="weui_btn_dialog default">{{noButtonText}}</a>' +
                                        '<a href="javascript:void(0);" @click="onYesClick" class="weui_btn_dialog primary">{{yesButtonText}}</a>' +
                                    '</footer>' +
                            '</section>' +
                        '</div>',
                methods: {
                    open: function (options) {
                        var me = this;

                        if (typeof options === "string") {
                            me.message = options;

                            /*#region vm.$comfirm.open("是否删除？",function(){},function(){})*/
                            if (typeof arguments[1] === "function") {
                                me.onYes = arguments[1];
                            }

                            if (typeof arguments[2] === "function") {
                                me.onNo = arguments[2];
                            }
                            /*endregion*/

                            /*#region vm.$comfirm.open("是否删除？","标题1",function(){},function(){})*/
                            if (typeof arguments[1] === "string") {
                                me.title = arguments[1];
                            }

                            if (typeof arguments[1] === "string" && typeof arguments[2] === "function") {
                                me.onYes = arguments[2];
                            }

                            if (typeof arguments[1] === "string" && typeof arguments[3] === "function") {
                                me.onNo = arguments[3];
                            }
                            /*#endregion*/
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
                    onYesClick: function () {
                        this.close();
                        this.onYes();
                    },
                    onNoClick: function () {
                        this.close();
                        this.onNo();
                    }
                }
            });
        }
    };

    if (typeof window !== "undefined" && window.Vue) {
        window.Vue.use(confirmPlugin);
    }

    return confirmPlugin;
})));