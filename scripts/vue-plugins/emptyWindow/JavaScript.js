/*
* author : zhy
*   mail : mailzy@vip.qq.com
*   date : 20170702
* plugin : visittask
* example: this.$emptywindow().then().catch();
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global.VueResource = factory());
}(this, (function () {
    'use strict';

    var emptyWindowPlugin = {
        install: function (vue) {
            if (this.installed) return;
            this.installed = true;

            vue.prototype.$emptywindow = function (customers) {
                var div = document.createElement("div");
                document.body.appendChild(div);

                return new Vue({
                    el:div,
                    components: {
                        "el-dialog": ELEMENT.Dialog
                    },
                    filters:$f.filters,
                    data: function () {
                        return {
                                isVisible: false,
                                isUserClose: true,
                                fnThen: function () { },
                                fnCatch: function () { }
                            };
                    },
                    template:
                    '<el-dialog :title="title" v-model="isVisible" @close="onClose">' +
                        '<div>hello window</div>'+
                    '</el-dialog>',
                    methods: {
                        open: function (customers,fnThen,fnCatch) {
                            var me = this;
                            if (!customers) throw new Error("请传入客户");

                            me.detail.customers = customers;

                            if (fnThen) me.fnThen = fnThen;
                            if (fnCatch) me.fnCatch = fnCatch;

                            me.isUserClose = true;
                            me.isVisible = true;
                            return me;
                        },
                        close: function () {
                            var me = this;
                            me.isUserClose = false;
                            me.isVisible = false;
                            return me;
                        },
                        onClose: function () {
                            var me = this;
                            if (me.isUserClose) me.fnCatch();
                            document.body.removeChild(me.$el);
                        },
                        then: function (fn) {
                            var me = this;
                            me.fnThen = fn;
                            return me;
                        },
                        catch: function (fn) {
                            var me = this;
                            me.fnCatch = fn;
                            return me;
                        }
                    },
                    mounted: function () {
                       var me = this;
                       me.open();
                    }
                });
            };
        }
    };

    if (typeof window !== "undefined" && window.Vue) {
        window.Vue.use(emptyWindowPlugin);
    }

    return emptyWindowPlugin;
})));