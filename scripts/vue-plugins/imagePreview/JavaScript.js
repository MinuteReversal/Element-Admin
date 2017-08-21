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

    var imagePreviewPlugin = {
        install: function (vue) {
            if (this.installed) return;
            this.installed = true;

            vue.prototype.$imagePreview = function (uid) {
                var div = document.createElement("div");
                document.body.appendChild(div);

                return new Vue({
                    el:div,
                    components: $f.allComponents,
                    filters:$f.filters,
                    data: function () {
                        return {
                                isVisible: false,
                                isUserClose: true,
                                fnThen: function () { },
                                fnCatch: function () { },
                                title: "预览",
                                uid:""
                            };
                    },
                    template:
                    '<el-dialog :title="title" v-model="isVisible" @close="onClose" size="tiny">' +
                        '<img width="100%" :src="uid|image" />'+
                    '</el-dialog>',
                    methods: {
                        open: function (uid,fnThen,fnCatch) {
                            var me = this;

                            if (uid) {
                                me.uid = uid;
                            };

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
                       me.open(uid);
                    }
                });
            };
        }
    };

    if (typeof window !== "undefined" && window.Vue) {
        window.Vue.use(imagePreviewPlugin);
    }

    return imagePreviewPlugin;
})));