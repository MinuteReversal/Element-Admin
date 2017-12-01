/**
 * author      : 反转的分针
 * date        : 2017-11-30
 * mail        : 114233763@qq.com
 * description : 面包削
 */
var vueBreadcrumb = {
    template:
        '<div class="el-breadcrumb">' +
        '<span class="el-breadcrumb__item" v-for="p in paths" @click="onClick(p)">' +
        '<span class="el-breadcrumb__item__inner">{{p[displayField]}}</span>' +
        '<span class="el-breadcrumb__separator">{{separator}}</span>' +
        '</span>' +
        '</div>',
    props: {
        "menus": {
            "type": Array,
            "default": []
        },
        "separator": {
            "type": String,
            "default": '/'
        },
        "childrenField": {
            "type": String,
            "default": "ChildrenModels"
        },
        "displayField": {
            "type": String,
            "default": "DisplayName"
        },
        "currentDisplayName": {
            "type": String,
            "default": ""
        }
    },
    data: function () {
        return {};
    },
    computed: {
        paths: function () {
            var me = this;
            var paths = me.getPaths(me.menus, []);
            return paths;
        }
    },
    methods: {
        onClick: function (model) {
            this.$emit("click", model);
        },
        getPaths: function (menus, path) {
            var me = this;
            var paths = [];
            for (var i = 0, item; item = menus[i]; i++) {
                if (me.currentDisplayName === item[me.displayField]) {
                    path.push(item)
                    return path;
                }
                else if (item[me.childrenField].length) {
                    var result = me.getPaths(item[me.childrenField], path.concat([item]));
                    paths = paths.concat(result);
                }
            }
            return paths;
        }
    },
    mounted: function () {
    }
};