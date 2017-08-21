/*
* author : zhy
*   mail : mailzy@vip.qq.com
*   date : 20170702
* plugin : huntingTaskComplexPlugin
* example: this.$huntingtaskcomplex.open();
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.VueResource = factory());
}(this, (function () {
    'use strict';

    var huntingTaskComplexPlugin = {
        install: function (vue) {
            if (this.installed) return;
            this.installed = true;

            vue.prototype.$huntingtaskcomplex = function (options) {
                var div = document.createElement("div");
                document.body.appendChild(div);

                return new Vue({
                el:div,
                filters:$f.filters,
                components: $f.allComponents,
                data: function () {
                    return {
                        isVisible: false,
                        isUserClose: true,
                        title: "创建走访任务",
                        fnThen: function () { },
                        fnCatch: function () { },
                        TaskLimitDays: [],
                        model: {
                            areas: [],
                            staff: null,
                            TimeTaskBegin: new Date(),
                            limitDays: 1
                        },
                        areas: {
                            search: {
                                Name: "",
                                OperatorName: ""
                            },
                            loading: false,
                            pageSize: 10,
                            tableData: [
                            ],
                            currentPage: 1,
                            total: 0,
                            currentRow: null
                        },
                        staffs: {
                            search: {
                                name: "",
                                mobile: ""
                            },
                            loading: false,
                            pageSize: 10,
                            tableData: [
                            ],
                            currentPage: 1,
                            total: 0,
                            currentRow: null
                        },
                        ruleForm: {
                            areas: [],
                            staff: null,
                            TimeTaskBegin: new Date(),
                            limitDays: 1,
                            HuntingTargetLimit:50
                        },
                        rules: {
                            TimeTaskBegin: [
                                { required: true, type: 'date', message: '请选择任务开始日期', trigger: 'change' }
                            ]
                        }
                    };
                },
                template:/*注意模板中的html属性要空格分隔*/
                '<el-dialog :title="title" v-model="isVisible" @close="onClose">' +
                    '<el-form :inline="true" :model="areas.search" label-width="120px">'+
                        '<el-form-item label="片区名称">'+
                            '<el-input v-model="areas.search.Name" placeholder="片区名称"></el-input>'+
                        '</el-form-item>'+
                        '<el-form-item label="走访人员">' +
                            '<el-input v-model="areas.search.OperatorName" placeholder="走访人员"></el-input>' +
                        '</el-form-item>' +
                        '<el-form-item>' +
                            '<el-button type="primary" @click="loadDataAreas" icon="search">查询</el-button>'+
                        '</el-form-item>'+
                    '</el-form>'+
                    '<el-table v-bind:data="areas.tableData" '+
                      'border highlight-current-row height="250" ' +
                      '@selection-change="handleAreasSelectionChange" '+
                      'v-bind:default-sort="{prop: \'name\', order: \'descending\'}" '+
                        'class="col-12">' +
                        '<el-table-column type="selection" '+
                            'width="55">'+
                        '</el-table-column>'+
                         '<el-table-column prop="City" '+
                                         'label="地市" '+
                                         'width="160">'+
                         '</el-table-column>' +
                         '<el-table-column prop="County" '+
                                         'label="县" '+
                                         'width="160">'+
                         '</el-table-column>' +
                         '<el-table-column prop="Name" '+
                                         'label="片区名称" '+
                                         '>'+
                         '</el-table-column>' +
                         '<el-table-column prop="TimeTaskCreated" ' +
                                         'label="上次走访时间" ' +
                                         'width="160">' +
                                         '<template scope="scope">' +
                                         '<el-icon name="time"></el-icon>' +
                                         '<span style="margin-left: 10px">{{ scope.row.TimeCreated | time }}</span>' +
                                         '</template>' +
                        '</el-table-column>' +
                         '<el-table-column prop="OperatorName" '+
                                         'label="上次走访人员" '+
                                         'width="160">'+
                         '</el-table-column>' +
                    '</el-table>'+
                    '<el-pagination class="clear" '+
                                   '@size-change="handleAreasSizeChange" '+
                                   '@current-change="handleAreasCurrentPageChange" '+
                                   ':current-page="areas.currentPage" '+
                                   ':page-sizes="[10, 20, 50, 100]" '+
                                   ':page-size="areas.pageSize" '+
                                   'layout="total, sizes, prev, pager, next, jumper" '+
                                   ':total="areas.total">'+
                     '</el-pagination>' +
                     '<el-form :inline="true" :model="staffs.search" label-width="120px" class="margin-top-xl">'+
                        '<el-form-item label="走访人员姓名">'+
                            '<el-input v-model="staffs.search.name" placeholder="走访人员姓名"></el-input>'+
                        '</el-form-item>'+
                        '<el-form-item label="走访人员电话">' +
                            '<el-input v-model="staffs.search.mobile" placeholder="走访人员电话"></el-input>' +
                        '</el-form-item>' +
                        '<el-form-item>' +
                            '<el-button type="primary" @click="loadDataStaffs" icon="search">查询</el-button>'+
                        '</el-form-item>'+
                    '</el-form>'+
                    '<el-table v-bind:data="staffs.tableData" ref="singleTable" '+
                      'border highlight-current-row height="250" ' +
                      '@current-change="handleStaffsCurrentRowChange" '+
                      'v-bind:default-sort="{prop: \'name\', order: \'descending\'}" '+
                        'class="col-12">' +
                        '<el-table-column type="index" width="50">'+
                        '</el-table-column>'+
                        '<el-table-column prop="Name" '+
                                         'label="姓名" '+
                                         'width="160">'+
                        '</el-table-column>'+
                        '<el-table-column prop="Mobile" '+
                                         'label="电话" '+
                                         'sortable '+
                                         'width="160">'+
                        '</el-table-column>'+
                        '<el-table-column prop="InProgressTaskCount" '+
                                         'label="已分配任务数"'+
                                         '>'+
                        '</el-table-column>'+
                    '</el-table>'+
                    '<el-pagination class="clear" '+
                                   '@size-change="handleStaffsSizeChange" '+
                                   '@current-change="handleStaffsCurrentPageChange" '+
                                   ':current-page="staffs.currentPage" '+
                                   ':page-sizes="[10, 20, 50, 100]" '+
                                   ':page-size="staffs.pageSize" '+
                                   'layout="total, sizes, prev, pager, next, jumper" '+
                                   ':total="staffs.total">'+
                    '</el-pagination>' +
                    '<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="margin-top-xl">'+
                        '<el-form-item label="客户走访指标">' +
                            '<el-input-number v-model="ruleForm.HuntingTargetLimit" :min=1 placeholder="客户走访指标"></el-input-number>' +
                        '</el-form-item>' +
                        '<el-form-item label="任务开始日期" prop="TimeTaskBegin">' +
                            '<el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.TimeTaskBegin"></el-date-picker>'+
                        '</el-form-item>' +
                        '<el-form-item label="任务持续天数" prop="limitDays">'+
                            '<el-select v-model="ruleForm.limitDays" placeholder="请选择">'+
                                '<el-option v-for="item in TaskLimitDays" :key="item.value" :label="item.lable" :value="item.value">'+
                                '</el-option>'+
                            '</el-select>'+
                        '</el-form-item>' +
                        '<el-form-item class="text-align-center">' +
                            '<el-button @click="isVisible=false">取消</el-button >' +
                            '<el-button type="primary" @click="submitForm">提交</el-button>'+
                        '</el-form-item>' +
                    '</el-form>'+
                '</el-dialog>',
                methods: {
                    /*#region  Customer*/
                    handleAreasSelectionChange: function (val) {
                        this.ruleForm.areas = val;
                    },
                    handleAreasSizeChange: function (val) {
                        this.areas.pageSize = val;
                        this.loadDataAreas();
                    },
                    handleAreasCurrentPageChange: function (val) {
                        this.areas.currentPage = val;
                        this.loadDataAreas();
                    },
                    getAreasSkip: function () {
                        var me = this;
                        return (me.areas.currentPage - 1) * me.areas.pageSize;
                    },
                    loadDataAreas: function () {
                        var me = this;
                        me.$http.get("/CRMApi/HuntingTask_Create_Areas", {
                            params: {
                                $skip: me.getAreasSkip(),
                                $top: me.areas.pageSize,
                                $inlinecount: "allpages",
                                $filter: "substringof('" + me.areas.search.Name + "',Name) eq true and substringof('" + me.areas.search.OperatorName + "',OperatorName) eq true"//http://www.odata.org/getting-started/basic-tutorial/
                            }
                        })
                        .then(function (response) {
                            me.areas.total = parseInt(response.data["odata.count"]);
                            me.areas.tableData = response.data["value"];
                        });
                    },
                    /*#endregion*/
                    /*#region staff*/
                    handleStaffsCurrentRowChange: function (val) {
                        this.ruleForm.staff = val;
                    },
                    setStaffCurrent: function (row) {
                        this.$refs.singleTable.setCurrentRow(row);
                    },
                    handleStaffsSizeChange: function (val) {
                        this.staffs.pageSize = val;
                        this.loadDataStaffs();
                    },
                    handleStaffsCurrentPageChange: function (val) {
                        this.staffs.currentPage = val;
                        this.loadDataStaffs();
                    },
                    getStaffsSkip: function () {
                        var me = this;
                        return (me.staffs.currentPage - 1) * me.staffs.pageSize;
                    },
                    loadDataStaffs: function () {
                        var me = this;
                        me.$http.get("/CRMApi/HuntingTask_Create_Staffs", {
                            params: {
                                $skip: me.getStaffsSkip(),
                                $top: me.staffs.pageSize,
                                $inlinecount: "allpages",
                                $filter: "substringof('" + me.staffs.search.name + "',Name) eq true and substringof('" + me.staffs.search.mobile + "',Mobile) eq true"//http://www.odata.org/getting-started/basic-tutorial/
                            }
                        })
                        .then(function (response) {
                            me.staffs.total = parseInt(response.data["odata.count"]);
                            me.staffs.tableData = response.data["value"];
                        });
                    },
                    /*#endreigon*/
                    submitForm: function () {
                        var me = this;
                        if (me.$refs.ruleForm.validate(function (valid) {
                            if (valid) {

                                var f = me.ruleForm;
                                if (f.staff === null) {
                                    me.$message({
                                        type: 'info',
                                        message: '请选择走访工作人员!'
                                    });
                                    return;
                                }

                                if (f.areas.length === 0) {
                                    me.$message({
                                        type: 'info',
                                        message: '请勾选区域!'
                                    });
                                    return;
                                }

                                me.$http.post("/CRM/Api/Task/Hunting", me.fillServerModel()).then(function () {
                                    me.$message({
                                        type: 'success',
                                        message: '任务创建成功'
                                    });
                                    me.close();
                                    me.fnThen();
                                });
                            }
                        }));
                    },
                    fillServerModel: function () {
                        var me = this;
                        var f = me.ruleForm;
                        return {
                            "OperatorUid": f.staff.Uid,
                            "AreaUidList": f.areas.map(function (x) { return x.Uid; }),
                            "TimeTaskBegin": f.TimeTaskBegin.Format("yyyy-MM-dd"),
                            "TaskLimitDays": f.limitDays,
                            "HuntingTargetLimit": f.HuntingTargetLimit
                        };
                    },
                    resetForm: function () {
                        this.$refs.ruleForm.resetFields();
                    },
                    open: function (fnThen, fnCatch) {
                        var me = this;

                        if (fnThen) me.fnThen = fnThen;
                        if (fnCatch) me.fnCatch = fnCatch;

                        me.isUserClose = true;
                        me.isVisible = true;
                        return me;
                    },
                    close: function () {
                        var me = this;
                        me.isUserClose = false;
                        me.isVisible = false;
                        return me;
                    },
                    onClose: function () {
                        var me = this;
                        if (me.isUserClose) me.fnCatch();
                        document.body.removeChild(me.$el);
                    },
                    then: function (fn) {
                        var me = this;
                        me.fnThen = fn;
                        return me;
                    },
                    catch: function (fn) {
                        var me = this;
                        me.fnCatch = fn;
                        return me;
                    },
                    generateOptions: function () {
                        for (var i = 1; i < 8; i++) {
                            this.TaskLimitDays.push({ value: i, lable: i });
                        }
                    }
                },
                mounted: function () {
                    var me = this;
                    me.loadDataAreas();
                    me.loadDataStaffs();
                    me.generateOptions();
                    me.open();
                }
            });
            };
        }
    };

    if (typeof window !== "undefined" && window.Vue) {
        window.Vue.use(huntingTaskComplexPlugin);
    }

    return huntingTaskComplexPlugin;
})));