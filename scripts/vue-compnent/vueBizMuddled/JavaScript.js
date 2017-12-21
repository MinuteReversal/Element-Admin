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
 *  <biz-muddled v-model="ruleForm.store1" src="/Data/Stores" :show-columns="['Name','SerialNumber']" display-field="Name" value-field="Uid" placeholder="门店列表绑定Uid"></biz-muddled>
 *  <biz-muddled v-model="ruleForm.store2" src="/Data/Stores" :show-columns="['Name','SerialNumber']" display-field="Name" value-field="model" placeholder="门店列表绑定模型"></biz-muddled>
 */
var vueBizMuddled = {
    template: '<el-select v-model="val" clearable filterable :filter-method="filterMethod" ref="select" :remote="remote" :loading="loading" :remote-method="getData" :placeholder="placeholder" @change="handleChange">' +
        '<el-option v-for="item in options" ' +
        ':key = "item" ' +
        ':label = "item[displayField]" ' +
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
        "isDistinct": {
            "type": Boolean,
            "default": false
        },
        "remote": {
            "type": Boolean,
            "default": false
        },
        "value": {
            "type": String,
            "default": ""
        }
    },
    data: function () {
        return {
            "loading": false,
            "val": "",
            "options": [],
            "allOptions": []
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
            if (typeof query === "string" && query === "") return undefined;
            var odata = [];
            for (var i = 0, column; column = me.showColumns[i]; i++) {
                odata.push("substringof('" + query + "', " + column + ") eq true");
            }
            return odata.join(" or ");
        },
        getData: function (query) {
            var me = this;
            me.loading = true;

            if (typeof query === 'undefined') {
                query = "";
            }

            me.$http.get(me.src, {
                params: {
                    $filter: me.getOdataFilter(query),
                    $select: me.getFields()
                }
            }).then(function (response) {
                if (me.isDistinct && Enumerable) {
                    me.options = me.distinct(response.data["value"]);
                } else {
                    me.options = response.data["value"];
                }
                me.allOptions = me.options;
                me.loading = false;
            });
        },
        distinct: function (arr) {
            var list = [];
            var hash = {};
            for (var i = 0, item; item = arr[i]; i++) {
                var key = item;
                if (typeof key === "object") key = JSON.stringify(item);

                if (hash[key.toString()]) continue;

                hash[key.toString()] = item;
                list.push(item);
            }
            return list;
        },
        getFields: function () {
            var me = this;
            var fields = [];
            if (me.valueField === "model") {
                return "*";
            }

            fields = fields.concat(me.showColumns);

            me.testPush(fields, me.displayField);
            me.testPush(fields, me.valueField);

            return fields.join(',');
        },
        testPush: function (arr, val) {
            if (arr.indexOf(val) === -1) arr.push(val);
        },
        filterMethod: function (val) {
            var me = this;
            if (me.remote) return;
            var foundList = [];
            for (var i = 0, item; item = me.allOptions[i]; i++) {
                var isMatch = false;
                for (var j = 0, c; c = me.showColumns[j]; j++) {
                    if (item[c].toString().indexOf(val) > -1) isMatch = true;
                }

                if (isMatch) {
                    foundList.push(item);
                }

            }
            me.options = foundList;
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