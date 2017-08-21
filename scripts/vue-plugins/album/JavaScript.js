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

    var albumPlugin = {
        install: function (vue) {
            if (this.installed) return;
            this.installed = true;

            vue.prototype.$album = function (images,selectUid) {
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
                                title:"相册",
                                images: [],
                                index: 0,
                                height:"600px"
                            };
                    },
                    template:
                    '<el-dialog :title="title" v-model="isVisible" @close="onClose" ref="dialog">' +
                        '<el-carousel :interval="5000" arrow="always" :initial-index="index" :height="height" :autoplay="false">'+
                            '<el-carousel-item v-for="item in images" :key="item">'+
                                '<img width="100%" :src="item|image"/>'+
                            '</el-carousel-item>'+
                        '</el-carousel>'+
                    '</el-dialog>',
                    methods: {
                        open: function (images,selectUid,fnThen,fnCatch) {
                            var me = this;
                            if (!images) throw new Error("请传入图片Uid集合");

                            me.images = images;

                            if (selectUid) {
                                me.index = me.images.indexOf(selectUid);
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
                       me.open(images, selectUid);
                    }
                });
            };
        }
    };

    if (typeof window !== "undefined" && window.Vue) {
        window.Vue.use(albumPlugin);
    }

    return albumPlugin;
})));