/**
 * author      : 反转的分针
 * date        : 20170713
 * mail        : 114233763@qq.com
 * description : 模糊查询
 * @param {String} src http://xxx.yyy.zzz/abc/def?gh=ijk&lm=nop#qrst
 * @param {String} placeholder
 * @param {Array} showColumns
 * @param {String} valueField
 * @param {String} displayField
 * @param {String} value v-model
 * @returns {String|Object} item.DataValue
 * @example
 *  <biz-muddled v-model="ruleForm.store1" src="/Data/Stores" :show-columns="['Name','SerialNumber']" display-field="Name" value-field="Uid" placeholder="门店列表绑定Uid"></biz-muddled><br />
 *  <biz-muddled v-model="ruleForm.store2" src="/Data/Stores" :show-columns="['Name','SerialNumber']" display-field="Name" value-field="model" placeholder="门店列表绑定模型"></biz-muddled><br />
 */
var vueBizMuddled = {
    template: '<el-select v-model="val" clearable filterable remote :loading="loading" :remote-method="getData" :placeholder="placeholder" @change="handleChange">' +
                    '<el-option v-for="item in options"' +
                            ':key = "getValueField(item)"' +
                            ':label = "item[displayField]"' +
                            ':value = "getValueField(item)">' +
                        '<span style="float: left">{{ item[showColumns[0]] }}</span>' +
                        '<span v-show="showColumns[1]" style="float: right; color: #8492a6; font-size: 13px">{{ item[showColumns[1]] }}</span>' +
                    '</el-option>' +
               '</el-select>',
    props: {
        "src": {
            "type": String,
            "default": ""
        },
        "placeholder": {
            "type": String,
            "default": "请选择"
        },
        "showColumns": {
            "type": Array,
            "default": ["Uid", "Name"]
        },
        "valueField": {
            "type": String,
            "default": ""//model:item|fieldName:item.fieldName
        },
        "displayField": {
            "type": String,
            "default": "Name"
        },
        "value": {
            "type": String,
            "default": ""
        }
    },
    data: function () {
        return {
            "loading":false,
            "val": "",
            "options": []
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
            for (var i=0, column; column = me.showColumns[i]; i++) {
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