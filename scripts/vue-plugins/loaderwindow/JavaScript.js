/*
* author : zhy
*   mail : mailzy@vip.qq.com
*   date : 20170709
* plugin : visittask
* example: this.$emptywindow().then().catch();
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.VueResource = factory());
}(this, (function () {
    'use strict';

    var loaderWindowPlugin = {
        install: function (vue) {
            if (this.installed) return;
            this.installed = true;

            vue.prototype.$loaderwindow = function (options) {

                var div = document.createElement("div");
                document.body.appendChild(div);

                var settings = {
                    title: "",
                    url: "",
                    size: "small",//tiny/small/large/full
                    parameters: null,
                    fnThen: function () { },
                    fnCatch: function () { }
                };

                if (typeof arguments[0] === "string") {
                    settings.url = arguments[0];
                }
                else if (typeof arguments[0] === "object") {
                    Object.assign(settings, options);
                }

                if (typeof arguments[1] === "object") {
                    settings.parameters = arguments[1];
                }
                else if (typeof arguments[1] === "string") {
                    settings.title = arguments[1];
                }

                if (typeof arguments[2] === "string") {
                    settings.title = arguments[2];
                }

                if (typeof arguments[3] === "string") {
                    settings.size = arguments[3];
                }

                return new Vue({
                    el: div,
                    components: {
                        "el-dialog": ELEMENT.Dialog,
                        "load-component": vueLoadComponent
                    },
                    filters: $f.filters,
                    data: function () {
                        return {
                            isVisible: false,
                            isUserClose: true,
                            title: settings.title,
                            url: settings.url,
                            parameters: settings.parameters,
                            fnThen: settings.fnThen,
                            fnCatch: settings.fnCatch,
                            size: settings.size
                        };
                    },
                    template:
                    '<el-dialog :title="title" v-model="isVisible" @close="onClose" :size="size">' +
                    '<load-component :url="url" :parameters="parameters" @load="onComponentloader" ref="lc"></load-component>' +
                    '</el-dialog>',
                    methods: {
                        open: function (parameters, fnThen, fnCatch) {
                            var me = this;
                            if (parameters) me.parameters = parameters;
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

                            var $data = Object.assign({}, me.$refs.lc.val);
                            me.$refs.lc.$destroy();
                            if (me.isUserClose) me.fnCatch($data);

                            document.body.removeChild(me.$el);
                        },
                        onComponentloader: function (c) {
                            var me = this;

                            c.$on("confirm", function (evt) {
                                me.fnThen(evt);
                                me.close();
                            });
                            c.$on("cancel", function (evt) {
                                me.fnCatch(evt);
                                me.close();
                            });
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
        window.Vue.use(loaderWindowPlugin);
    }

    return loaderWindowPlugin;
})));