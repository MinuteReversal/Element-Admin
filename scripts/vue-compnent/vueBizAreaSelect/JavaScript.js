/**
 * author      : 反转的分针
 * date        : 20170808
 * mail        : 114233763@qq.com
 * description : 地区查询
 * @param {String} src http://xxx.yyy.zzz/abc/def?gh=ijk&lm=nop#qrst 
 * @param {String} value v-model
 * @returns {String|Object} item.DataValue
 * @example <biz-area-select v-model="search.AreaCode" :show-province="false" ref="as" :need-value-wrapper="true" src="/api/Region"></biz-area-select>
 */
var vueBizAreaSelect = {
    template: '<div v-loading="loading">' +
                    '<el-select v-show="showProvince" v-model="province.value" clearable placeholder="省" @change="onProvinceSelect">' +
                        '<el-option v-for="item in province.options"\n' +
                            ':key = "item.value"\n' +
                            ':label = "item.label"\n' +
                            ':value = "item.value">' +
                                '<span style="float: left">{{ item.label }}</span>' +
                                '<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>' +
                        '</el-option>' +
                    '</el-select>' +
                    '<el-select v-show="showCity" v-model="city.value" clearable placeholder="市" @change="onCitySelect">' +
                        '<el-option v-for="item in city.options"\n' +
                            ':key = "item.value"\n' +
                            ':label = "item.label"\n' +
                            ':value = "item.value">' +
                                '<span style="float: left">{{ item.label }}</span>' +
                                '<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>' +
                        '</el-option>' +
                    '</el-select>' +
                    '<el-select v-show="showCounty" v-model="county.value" clearable placeholder="区" @change="onCountySelect">' +
                        '<el-option v-for="item in county.options"\n' +
                            ':key = "item.value"\n' +
                            ':label = "item.label"\n' +
                            ':value = "item.value">' +
                                '<span style="float: left">{{ item.label }}</span>' +
                                '<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>' +
                        '</el-option>' +
                    '</el-select>' +
                '</div>',
    props: {
        "showProvince": {
            "type": Boolean,
            "default": true
        },
        "showCity": {
            "type": Boolean,
            "default": true
        },
        "showCounty": {
            "type": Boolean,
            "default": true
        },
        "needValueWrapper": {
            "type": Boolean,
            "default": false
        },
        "valueWrapper": {
            "type": String,
            "default": "/Area({value})/"
        },
        "valueType": {
            "type": String,
            "default": "dynamic" //dynamic|six
        },
        "src": {
            "type": String,
            "default": "data.json"
        },
        "value": {
            "type": String,
            "default": ""
        }
    },
    data: function () {
        return {
            "province": {
                "options": [],
                "value": ""
            },
            "city": {
                "options": [],
                "value": ""
            },
            "county": {
                "options": [],
                "value": ""
            },
            "loading": true,
            "val": "",
            "areas": [],
            "syncValue":""
        };
    },
    watch: {
        "value": function (val, oldVal) {
            var me = this;
            if (me.loading) {
                me.syncValue = val;
                return;
            }

            var areaCode = /\d+/.exec(val);
            if (!areaCode) areaCode = "";
            me.setValue(areaCode);
        }
    },
    methods: {
        setValue: function (val) {
            var me = this;
            me.selectOptionsByCode(val);
        },
        updateValue: function () {
            var me = this;
            var code = me.province.value + me.city.value + me.county.value;

            if (me.valueType === "six") {
                code = me.areaCodePadRight(code);
            }

            if (me.needValueWrapper) {
                code = me.valueWrapper.replace("{value}", code);
            }

            me.$emit("input", code);
        },
        print: function () {
            var me = this;
            console.log(me.province);
            console.log(me.city);
            console.log(me.county);
        },
        areaTreeToCaseCaderTree: function (areaTree) {
            var me = this;
            var tree = [];
            for (var i = 0, item; item = areaTree[i]; i++) {
                var node = { "value": "", "label": "", "code": "", "children": [] };

                for (var p in item) {
                    if (p === "SubCode") {
                        node.value = item[p];
                    }
                    else if (p === "Name") {
                        node.label = item[p];
                    }
                    else if (p === "Code") {
                        node.code = item[p].toString();
                    }
                    else if (item[p] instanceof Array && item[p].length > 0) {
                        node.children = me.areaTreeToCaseCaderTree(item[p]);;
                    }
                }
                tree.push(node);
            }
            return tree;
        },
        onProvinceSelect: function (value) {
            var me = this;
            me.city.options = me.getChildrenByValue(me.province.options, value);
            if (me.city.options.length === 0) {
                me.city.value = "";
            }

            if (!me.hasItem(me.city.options, me.city.value)) {
                me.city.value = "";
            }

            if (value === "") {
                me.city.value = "";
                me.county.value = "";
            }
            me.updateValue();
        },
        onCitySelect: function (value) {
            var me = this;
            me.county.options = me.getChildrenByValue(me.city.options, value);
            if (me.county.options.length === 0) {
                me.county.value = "";
            }

            if (!me.hasItem(me.county.options, me.county.value)) {
                me.county.value = "";
            }

            if (value === "") {
                me.county.value = "";
            }
            me.updateValue();
        },
        onCountySelect: function (value) {
            var me = this;
            me.updateValue();
        },
        areaCodeToArray: function (areaCode) {
            var me = this;
            var sp = me.areaCodeSplit(areaCode);
            var a = [];
            if (sp === null) return a;
            for (var i = 0, code; code = sp[i]; i++) {
                if (code !== "00") a.push(code);
            }
            return a;
        },
        areaCodeSplit: function (areaCode) {
            var me = this;
            if (typeof areaCode !== "string")
                areaCode = areaCode.toString();
            return areaCode.match(/\d{2}/g);
        },
        areaCodePadRight: function (code) {
            if (code.length < 6) {
                for (var i = code.length; i < 6; i++) {
                    code += "0";
                }
            }
            return code;
        },
        getChildrenByValue: function (nodes, value) {
            for (var i = 0, node; node = nodes[i]; i++) {
                if (node.value === value) return node.children;
            }
            return [];
        },
        hasItem: function (list, value) {
            for (var i = 0, node; node = list[i]; i++) {
                if (node.value === value) return true;
            }
            return false;
        },
        selectOptionsByCode: function (code) {
            var me = this;

            var codes = me.areaCodeToArray(code);

            if (codes[0]) {
                me.province.value = codes[0];
            }
            if (codes[1]) {
                me.city.value = codes[1];
            }
            if (codes[2]) {
                me.county.value = codes[2];
            }
        },
        areaCodePadRight: function (code) {
            if (code.length < 6) {
                for (var i = code.length; i < 6; i++) {
                    code += "0";
                }
            }
            return code;
        },
        getData: function () {
            var me = this;
            me.loading = true;
            me.$http.get(me.src).then(function (response) {
                me.loading = false;
                me.areas = me.areaTreeToCaseCaderTree(response.data);
                me.province.options = me.areas;
                me.setValue(me.syncValue);
            });
        }
    },
    components: {
        "el-select": ELEMENT.Select,
        "el-option": ELEMENT.Option
    },
    mounted: function () {
        this.getData();
    }
};