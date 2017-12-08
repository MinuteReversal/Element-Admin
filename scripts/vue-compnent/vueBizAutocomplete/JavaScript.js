/**
 * author      : 反转的分针
 * date        : 20171206
 * mail        : 114233763@qq.com
 * description : 模糊查询保留输入内容
 * @param {String} src http://xxx.yyy.zzz/abc/def?gh=ijk&lm=nop#qrst
 * @param {String} placeholder
 * @param {String} valueField
 * @param {String} value v-model
 * @returns {String|Object} item.value
 * @example
 *    <biz-autocomplete v-model="name" :src="webconfig.apiServer+'/data/ICBCStaff'" value-field="FullName" placeholder="输入姓名"></biz-autocomplete>
*/
var vueBizAutocomplete = {
    template: '<el-autocomplete v-model="val" :fetch-suggestions="getData" :placeholder="placeholder" @select="handleSelect" @input="$emit(\'input\',val)"></el-autocomplete>',
    props: {
        "src": {
            "type": String,
            "default": ""
        },
        "placeholder": {
            "type": String,
            "default": "请选择"
        },
        "valueField": {
            "type": String,
            "default": "Uid"//item.fieldName
        },
        "disabled": {
            "type": Boolean,
            "default": false
        },
        "adapter": {
            "type": Function,
            "default": function (arr) {
                var me = this;
                return arr.map(function (x) { return { value: x[me.valueField] }; });
            }
        },
        "value": {
            "type": String,
            "default": ""
        }
    },
    data: function () {
        return {
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
        handleSelect: function (item) {
            this.$emit("input", item.value);
        },
        updateValue: function (val) {
            this.val = val;
        },
        getOdataFilter: function (query) {
            var me = this;
            if (!query) return undefined;
            var odata = [];
            odata.push("substringof('" + query + "', " + me.valueField + ") eq true");
            return odata.join(" or ");
        },
        getData: function (queryString, cb) {
            var me = this;
            if (me.options.length > 0 && queryString === "") {
                cb(me.options);
            }
            else if (typeof queryString === "string") {
                me.$http.get(me.src, {
                    params: {
                        $filter: me.getOdataFilter(queryString)
                    }
                }).then(function (response) {
                    var list = me.adapter(response.data.value);
                    if (queryString === "") me.options=list;
                    cb(list);
                });
            }
        }
    },
    components: {
        "el-autocomplete": ELEMENT.Autocomplete
    },
    mounted: function () {
        this.getData();
        this.updateValue(this.value);
    }
};