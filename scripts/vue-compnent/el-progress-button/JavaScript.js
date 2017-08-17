/**
 * author      : 反转的分针
 * date        : 20170810
 * mail        : 114233763@qq.com
 * description : 区域选择
 * @param {String} placeholder
 * @param {String} returnType v-model
 * @returns {String|Array} item.DataValue
 */
var elProgressButton = {
    template:
    '<div>' +
    '<button class="el-button el-button-default" @click="$emit(\'click\')">' +
    '<span v-show="percentage === 0">下载</span>' +
    '<el-progress type="line" v-show="percentage > 0" :percentage="percentage" :width=30 :stroke-width=2 ></el-progress>' +
    '</button>' +
    '</div>'
    ,
    props: {
        "percentage": {
            "type": Number,
            "default": 0
        }
    },
    data: function () {
        return {
        };
    },
    methods: {

    },
    components: {
        "el-progress": ELEMENT.Progress
    },
    mounted: function () {
    }
};