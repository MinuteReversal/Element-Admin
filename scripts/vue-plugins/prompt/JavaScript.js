/*
* author : zhy
*   mail : mailzy@vip.qq.com
*   date : 20161116
* plugin : prompt
* example: this.$prompt.open("hello",function(){},function(){})
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

    var promptPlugin = {
        install: function (vue) {
            if (this.installed) return;
            this.installed = true;

            vue.prototype.$prompt = new Vue({
                compiled: function () {
                    var me = this;
                    window.addEventListener("load", function () {
                        me.$appendTo("body");
                    });
                },
                data: function () {
                    return {
                        isShow: false,
                        title: "输入对话框",
                        message: "请输入！",
                        yesButtonText: "确定",
                        noButtonText: "取消",
                        inputLabel: "请输入",
                        defaultValue: "",
                        value: "",
                        onYes: function (text) { },
                        onNo: function () { }
                    };
                },
                el: toElement("<div></div>"),
                template: '<div :style="{ display: isShow ? \'block\':\'none\' }" class="weui_dialog_confirm">' +
                               '<div class="weui_mask"></div>' +
                               '<section class="weui_dialog">' +
                                   '<header class="weui_dialog_hd">{{title}}</header>' +
                                   '<div class="weui_dialog_bd">{{{message}}}</div>' +
                                   '<div class="weui_cells weui_cells_form">' +
                                   '<div class="weui_cell">' +
                                       '<div class="weui_cell_hd"><label class="weui_label">{{inputLabel}}</label></div>' +
                                           '<div class="weui_cell_bd weui_cell_primary">' +
                                               '<input class="weui_input" type="text" placeholder="文字内容" v-model="value" />' +
                                           '</div>' +
                                       '</div>' +
                                   '</div>' +
                                   '<footer class="weui_dialog_ft">' +
                                   '<a href="javascript:void(0);" @click="onNoClick" class="weui_btn_dialog default">{{noButtonText}}</a>' +
                                   '<a href="javascript:void(0);" @click="onYesClick" class="weui_btn_dialog primary">{{yesButtonText}}</a>' +
                                   '</footer>' +
                               '</section>' +
                            '</div>',
                methods: {
                    open: function () {
                        var me = this;

                        if (typeof arguments[0] === "object" && arguments[0] !== null) {
                            for (var propertyName in arguments[0]) {
                                if (arguments[0].hasOwnProperty(propertyName)) {
                                    me[propertyName] = arguments[0][propertyName];
                                }
                            }
                        }
                        else {

                            if (typeof arguments[0] === "string") {
                                me.message = arguments[0];
                            }

                            /* this.$prompt.open(function(value){},function(){}) */
                            if (arguments.length <= 2 && typeof arguments[0] === "function") {
                                if (typeof arguments[0] === "function") {
                                    me.onYes = arguments[0];
                                }

                                if (typeof arguments[1] === "function") {
                                    me.onNo = arguments[1];
                                }
                            }
                                /* this.$prompt.open("请输入电话",function(value){},function(){}) */
                            else if (arguments.length <= 3) {
                                if (typeof arguments[1] === "function") {
                                    me.onYes = arguments[1];
                                }

                                if (typeof arguments[2] === "function") {
                                    me.onNo = arguments[2];
                                }
                            }
                                /* this.$prompt.open("请输入电话","请您输入",function(value){},function(){}) */
                            else if (arguments.length <= 4) {
                                if (typeof arguments[1] === "string") {
                                    me.inputLabel = arguments[1];
                                }

                                if (typeof arguments[2] === "function") {
                                    me.onYes = arguments[2];
                                }

                                if (typeof arguments[3] === "function") {
                                    me.onNo = arguments[3];
                                }
                            }
                        }

                        me.value = me.defaultValue;
                        me.isShow = true;
                        setTimeout(function () {
                            me.$el.querySelector("input").focus();
                        }, 0);
                    },
                    close: function () {
                        this.isShow = false;
                    },
                    onYesClick: function () {
                        this.close();
                        this.onYes(this.value);
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
        window.Vue.use(promptPlugin);
    }

    return promptPlugin;
})));