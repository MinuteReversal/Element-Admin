/**
 * author      : 反转的分针
 * date        : 20170810
 * mail        : 114233763@qq.com
 * description : 区域选择
 * @param {String} placeholder
 * @param {String} returnType v-model
 * @returns {String|Array} item.DataValue
 */
var vueBizAreaTree = {
    template: '<el-cascader :options="options"v-model="val" change-on-select @change="handleChange" :placeholder="placeholder"></el-cascader>',
    props: {
        "src": {
            "type": String,
            "default": "/api/Region"
        },
        "value": {
            "type": [String, Array],
            "default": ""
        },
        "placeholder": {
            "type": String,
            "default": "请选择"
        },
        "mode": {
            "type": String,
            "default": "array"//six|variable
        },
        "needValueWrapper": {
            "type": Boolean,
            "default": true
        },
        "valueWrapper": {
            "type": String,
            "default": "/Area({value})/"
        }
    },
    data: function () {
        return {
            "val": [],
            "options": []
        };
    },
    watch: {
        "value": function (val, oldVal) {
            var me = this;
            var areaCode = /\d+/.exec(val);
            if (!areaCode) areaCode = "";
            me.setValue(areaCode);
        }
    },
    methods: {
        setValue: function (val) {
            var me = this;
            me.val = me.areaCodeToArray(val);
        },
        updateValue: function (val) {
            var me = this;
            var code = [];

            if (me.mode === "six") {
                code = me.arrayToSixText(val);
            }
            else if (me.mode === "variable") {
                code = me.areaCodeArrayToText(val);
            }

            if (me.needValueWrapper) {
                code = me.valueWrapper.replace("{value}", code);
            }

            me.$emit("input", code);
        },
        handleChange: function (val) {
            var me = this;
            me.updateValue(val);
        },
        getOptions: function () {
            var me = this;
            me.$http.get(me.src).then(function (response) {
                me.options = me.areaTreeToCaseCaderTree(response.data);
            });
        },
        areaTreeToCaseCaderTree: function (areaTree) {
            var me = this;
            var tree = [];
            for (var i = 0, item; item = areaTree[i]; i++) {
                var node = { "value": "", "label": "" };

                for (var p in item) {
                    if (p === "SubCode") {
                        node.value = item[p];
                    }
                    else if (p === "Name") {
                        node.label = item[p];
                    }
                    else if (item[p] instanceof Array && item[p].length > 0) {
                        node.children = me.areaTreeToCaseCaderTree(item[p]);;
                    }
                }
                tree.push(node);
            }
            return tree;
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
        areaCodeArrayToText: function (array) {
            var me = this;
            return array.join("");
        },
        arrayToSixText: function (array) {
            var me = this;
            return me.areaCodePadRight(me.areaCodeArrayToText(array));
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
        }
    },
    components: {
        "el-cascader": ELEMENT.Cascader
    },
    mounted: function () {
        this.getOptions();
        this.setValue(this.value);
    }
};