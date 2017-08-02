/*
* author : zhy
*   mail : mailzy@vip.qq.com
*   date : 20161117
* plugin : actionsheet
* example: this.$actionsheet.open({
*            menus: [
*                { text: "来点音乐", click: function () { alert("音乐来了") } },
*                { text: "都给我站好了", click: function () { alert("啪啪啪") } },
*                { text: "竜神の剣を喰らえ", click: function () { alert("额~") } },
*                { text: "我已准备释放暴雪了", click: function () { alert("咻咻咻") } }
*            ],
*            cancelText: "退出",
*            onCancel: function () {
*            }
*        });
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

    var actionSheetPlugin = {
        install: function (vue) {
            if (this.installed) return;
            this.installed = true;

            vue.prototype.$actionsheet = new Vue({
                compiled: function () {
                    var me = this;
                    window.addEventListener("load", function () {
                        me.$appendTo("body");
                    });
                },
                data: function () {
                    return {
                        isShow: false,
                        isDispaly:false,
                        needCancel: true,
                        cancelText: "取消",
                        onCancel: function () { },
                        menus: [{ text: "确定", click: function (menu) { } }]
                    };
                },
                el: toElement("<div></div>"),
                template: '<div class="actionSheet_wrap">' +
                               '<div @click="emitEvent(\'cancel\')" class="weui_mask_transition" :class="{ \'weui_fade_toggle\':isShow }" :style="{ display: isDispaly ? \'block\':\'none\' }"></div>' +
                               '<section class="weui_actionsheet" @transitionend="emitEvent(\'transitionend\')" @webkitTransitionEnd="emitEvent(\'transitionend\')" :class="{ \'weui_actionsheet_toggle\':isShow }">' +
                                   '<div class="weui_actionsheet_menu">' +
                                        '<div v-for="menu in menus" class="weui_actionsheet_cell" @click="emitEvent(\'choose\',menu)">{{{menu.text}}}</div>' +
                                    '</div>' +
                                    '<div :style="{ display: needCancel?\'block\':\'none\'}" class="weui_actionsheet_action">' +
                                        '<div @click="emitEvent(\'cancel\')" class="weui_actionsheet_cell">{{cancelText}}</div>' +
                                    '</div>' +
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
                        me.isDispaly = true;
                        me.isShow = true;
                    },
                    close: function () {
                        this.isShow = false;
                    },
                    emitEvent: function (eventName, args) {
                        this.$emit(eventName, args);
                    }
                },
                events: {
                    cancel: function () {
                        this.close();
                        this.onCancel();
                    },
                    choose: function (menu) {
                        this.close();
                        menu.click(menu.text);
                    },
                    transitionend: function () {
                        if(!this.isShow)this.isDispaly = false;
                    }
                }
            });
        }
    };

    if (typeof window !== "undefined" && window.Vue) {
        window.Vue.use(actionSheetPlugin);
    }

    return actionSheetPlugin;
})));