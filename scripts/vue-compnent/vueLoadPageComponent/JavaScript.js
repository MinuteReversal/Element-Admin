/**
 * author      : 反转的分针
 * date        : 20170709
 * description : 选项卡加载页面
 * depend on   : vueLoadComponent
 */
var vueLoadPageComponent = {
    components: {
        "el-tabs": ELEMENT.Tabs,
        "el-tab-pane": ELEMENT.TabPane,
        "load-component": vueLoadComponent
    },
    template: '<el-tabs v-model="current" type="card" closable @tab-remove="onTemoveTab">' +
    '<el-tab-pane v-for="(item, index) in list"\n' +
    ':key="item.name"\n' +
    ':label="item.title"\n' +
    ':name="item.name"\n' +
    '>' +
    '<load-component :url="item.url" :parameters="item.parameters" @load="onComponentloaded(item,index,$event)" ref="lc"></load-component>' +
    '</el-tab-pane>' +
    '</el-tabs>',
    data: function () {
        return {
            "list": [],
            "current": null
        };
    },
    methods: {
        /*
        * @methods add
        * @param {model} model : {name:"abc",title:"def",url:"/ghi/jkl",parameters:{id:"123",name:"mno"}}
        */
        add: function (model) {
            var me = this;
            if (me.findIndex(function (x) { return x.name === model.name }) === -1) {
                me.list.push(model);
            }
            me.current = model.name;
        },
        remove: function (model) {
            var me = this;
            var index = -1;

            if (typeof model === "object") {
                index = me.list.indexOf(model);

            }
            else if (typeof model === "number") {
                index = model;
            }

            var nextTab = me.list[index + 1] || me.list[index - 1];
            if (nextTab) {
                me.current = nextTab.name;
            }

            me.list.splice(index, 1);
        },
        clear: function () {
            var me = this;
            me.list = [];
        },
        onTemoveTab: function (name) {
            var me = this;
            me.remove(me.findIndex(function (x) { return x.name === name; }));
        },
        findIndex: function (fnCompare) {
            var me = this;
            for (var i = 0, item; item = me.list[i]; i++)
                if (fnCompare(item)) return i;
            return -1;
        },
        onComponentloaded: function (item, index, c) {
            var me = this;
            c.$on("confirm", function (evt) {
                me.remove(item);
            });
            c.$on("cancel", function (evt) {
                me.remove(item);
            });
        }
    }
};