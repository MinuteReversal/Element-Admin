/**
 * author      : 反转的分针
 * date        : 20170808
 * mail        : 114233763@qq.com
 * description : 地区查询
 * @param {String} src http://xxx.yyy.zzz/abc/def?gh=ijk&lm=nop#qrst 
 * @param {String} valueField
 * @param {String} displayField
 * @param {String} value v-model
 * @returns {String|Object} item.DataValue
 * @example
 */
var vueBizAreaSelect = {
    template: '<div v-loading="loading">' +
    '<el-select v-if="showProvince" v-model="province.value" clearable filterable remote :remote-method="getData" placeholder="省" @change="onProvinceSelect">' +
    '<el-option v-for="item in province.options"\n' +
    ':key = "item.value"\n' +
    ':label = "item.label"\n' +
    ':value = "item">' +
    '<span style="float: left">{{ item.label }}</span>' +
    '<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>' +
    '</el-option>' +
    '</el-select>' +
    '<el-select v-if="showCity" v-model="city.value" clearable filterable remote :remote-method="getData" placeholder="市" @change="onCitySelect">' +
    '<el-option v-for="item in city.options"\n' +
    ':key = "item.value"\n' +
    ':label = "item.label"\n' +
    ':value = "item">' +
    '<span style="float: left">{{ item.label }}</span>' +
    '<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>' +
    '</el-option>' +
    '</el-select>' +
    '<el-select v-if="showCounty" v-model="county.value" clearable filterable remote :remote-method="getData" placeholder="区" @change="onCountySelect">' +
    '<el-option v-for="item in county.options"\n' +
    ':key = "item.value"\n' +
    ':label = "item.label"\n' +
    ':value = "item">' +
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
        "valueWraper": {
            "type": String,
            "default": "Areacode({value})"
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
            "loading": false,
            "val": "",
            "areas": []
        };
    },
    watch: {
        "value": function (val, oldVal) {
            var me = this;
            me.updateValue(val);
        }
    },
    methods: {
        updateValue: function (val) {
            var me = this;
            me.selectOptionsByCode(val);
        },
        areaTreeToCaseCaderTree: function (areaTree) {
            var me = this;
            var tree = [];
            for (var i = 0, item; item = areaTree[i]; i++) {
                var node = { "value": "", "label": "", "code": "" };

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
        onProvinceSelect: function () {
            var me = this;
            me.city.options = me.province.value.children;
            me.city.value = "";
            me.county.options = [];
            me.county.value = "";
        },
        onCitySelect: function () {
            var me = this;
            me.county.options = me.city.value.children;
            me.county.value = "";
        },
        onCountySelect: function (value) {
            var me = this;
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
        selectOptionsByCode: function (code) {
            var me = this;
            me.province.value = "";
            me.city.value = "";
            me.county.value = "";
            
            me.recurseArea(me.areas, me.areaCodeToArray(code), 0);
        },
        recurseArea: function (areas, codes, level) {
            var me = this;
            for (var i = 0, area; area = areas[i]; i++) {

                if (area.value === codes[level]) {
                    if (level === 0) {
                        me.province.value = area;
                        me.city.options = area.children;

                        if (area.children && area.children.length) {
                            me.recurseArea(area.children, codes, level + 1);
                        }

                    }
                    else if (level === 1) {
                        me.city.value = area;
                        me.county.options = area.children;

                        if (area.children && area.children.length) {
                            me.recurseArea(area.children, codes, level + 1);
                        }
                    }
                    else if (level === 2) {
                        me.county.value = area;
                        if (area.children && area.children.length) {
                            me.recurseArea(area.children, codes, level + 1);
                        }
                        break;
                    }
                }
            }
        },
        getData: function () {
            var me = this;
            me.loading = true;
            me.$http.get(me.src).then(function (response) {
                me.loading = false;
                me.areas = me.areaTreeToCaseCaderTree(response.data);
                me.province.options = me.areas;
                //me.updateValue(me.value);
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