/**
 * author      : 反转的分针
 * date        : 20170709
 * description : 更多按钮
 * example     :
 *
           <el-table-column label="操作"
                             fixed="right"
                             width="80">
                <template scope="scope">
                    <el-more-button>
                        <el-button size="small" @click="onEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="onDelete(scope.$index, scope.row)">删除</el-button>
                    </el-more-button>
                </template>
            </el-table-column>
 */
var elMoreButton = {
    components: {
        "el-popover": ELEMENT.Popover
    },
    template: '<div>' +
                '<el-popover ref="popover" :trigger="trigger" :placement="placement" :width="width" v-model="visible">' +
                    '<slot></slot>'+
                '</el-popover>' +
                '<el-button icon="more" v-popover:popover ></el-button>' +
             '</div>',
    props: {
        "width": {
            "type": Number,
            "default": 160
        },
        "trigger": {
            "type": String,
            "default": "click" //click|focus|hover|manual
        },
        "placement": {
            "type": String,
            "default": "left" //top|top-start|top-end|bottom|bottom-start|bottom-end|left|left-start|left-end|right|right-start|right-end
        }
    },
    data: function () {
        return {
            visible: false
        };
    }
};