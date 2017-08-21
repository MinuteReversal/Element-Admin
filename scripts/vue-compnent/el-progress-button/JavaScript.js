/**
 * author      : 反转的分针
 * date        : 20170713
 * mail        : 114233763@qq.com
 * description : 进度按钮
 * @param {String} src http://xxx.yyy.zzz/abc/def?gh=ijk&lm=nop#qrst
 * @param {String} value v-model
 * @returns {String|Object} item.DataValue
 * @example
 */
var vueBizMuddled = {
    template: '<button class="el-button el-button--default">' +
    '</button>',
    props: {
        "progress": {
            "type": Number,
            "default": 0
        }
    },
    data: function () {
        return {
        };
    },
    watch: {
        "value": function (val, oldVal) {
            var me = this;
            me.val = val;
        }
    },
    methods: {
        getValueField: function (item) {
            var me = this;
            if (me.valueField !== "model") {
                return item[me.valueField];
            }
            return item;
        },
        handleChange: function (val) {
            this.$emit("input", val);
        },
        updateValue: function (val) {
            this.val = val;
        },
        getOdataFilter: function (query) {
            var me = this;
            if (!query) return undefined;
            var odata = [];
            for (var i = 0, column; column = me.showColumns[i]; i++) {
                odata.push("substringof('" + query + "', " + column + ") eq true");
            }
            return odata.join(" or ");
        },
        getData: function (query) {
            var me = this;
            me.loading = true;
            if (query !== '') {
                me.$http.get(me.src, {
                    params: {
                        $filter: me.getOdataFilter(query)
                    }
                }).then(function (response) {
                    me.options = response.data["value"];
                    me.loading = false;
                });
            }
            else {
                me.options = [];
                me.loading = false;
            }
        }
    },
    components: {
        "el-select": ELEMENT.Select,
        "el-option": ELEMENT.Option
    },
    mounted: function () {
        this.getData();
        this.updateValue(this.value);
    }
};