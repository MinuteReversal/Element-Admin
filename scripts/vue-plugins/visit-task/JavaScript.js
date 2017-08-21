/*
* author : zhy
*   mail : mailzy@vip.qq.com
*   date : 20170702
* plugin : visittask
* example: this.$visittask.open({customers:[]});
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global.VueResource = factory());
}(this, (function () {
    'use strict';

    var visitTaskPlugin = {
        install: function (vue) {
            if (this.installed) return;
            this.installed = true;

            vue.prototype.$visittask = function (customers) {
                

                var div = document.createElement("div");
                document.body.appendChild(div);

                return new Vue({
                    el:div,
                    components: $f.allComponents,
                    filters:$f.filters,
                    data: function () {
                        return {
                                isVisible: false,
                                isUserClose: true,
                                title: "创建回访任务",
                                fnThen: function () { },
                                fnCatch: function () { },
                                limitDaysOptions: [],
                                model: {
                                    customers: [],
                                    manager: null,
                                    startDate: new Date(),
                                    limitDays:1
                                },
                                search: {
                                    name :"",
                                    phone : ""
                                },
                                list: {
                                    loading: false,
                                    pageSize: 10,
                                    tableData: [
                                        { id: 1, name: "王五", phone: "13888001001", taskCount: 2 },
                                        { id: 2, name: "周六", phone: "13888001002", taskCount: 5 }
                                    ],
                                    currentPage: 1,
                                    total: 0,
                                    currentRow:null
                                },
                                ruleForm: {
                                    customers: [],
                                    manager: null,
                                    startDate: new Date(),
                                    limitDays: 1
                                },
                                rules: {
                                    startDate: [
                                        { required: true, type: 'date', message: '请输入任务开始日期', trigger: 'blur' }
                                    ]
                                }
                            };
                    },
                    template:
                    '<el-dialog :title="title" v-model="isVisible" @close="onClose">' +
                        '<el-form :inline="true" :model="search" label-width="120px">'+
                            '<el-form-item label="工作人员姓名">'+
                                '<el-input v-model="search.name" placeholder="工作人员姓名"></el-input>'+
                            '</el-form-item>'+
                            '<el-form-item label="工作人员电话">' +
                                '<el-input v-model="search.phone" placeholder="工作人员电话"></el-input>' +
                            '</el-form-item>' +
                            '<el-form-item>' +
                                '<el-button type="primary" @click="loadDataStaffs" icon="search">查询</el-button>'+
                            '</el-form-item>'+
                        '</el-form>'+
                        '<el-table v-bind:data="list.tableData" ref="singleTable" '+
                          'border highlight-current-row ' +
                          '@current-change="handleCurrentRowChange" '+
                          'v-bind:default-sort="{prop: \'name\', order: \'descending\'}" '+
                         'class="col-12">' +
                            '<el-table-column prop="Id"'+
                                             'label="序号 "'+
                                             'width="160">'+
                            '</el-table-column>'+
                            '<el-table-column prop="Name"'+
                                             'label="姓名 "'+
                                             'sortable'+
                                             'width="160">'+
                            '</el-table-column>'+
                            '<el-table-column prop="Mobile"'+
                                             'label="电话"'+
                                             '>'+
                            '</el-table-column>'+
                            '<el-table-column prop="InProgressTaskCount"'+
                                             'label="已分配任务数"'+
                                             '>'+
                            '</el-table-column>'+
                        '</el-table>'+
                        '<el-pagination class="clear" '+
                                       '@size-change="handleSizeChange" '+
                                       '@current-change="handleCurrentPageChange" '+
                                       ':current-page="list.currentPage" '+
                                       ':page-sizes="[10, 20, 50, 100]" '+
                                       ':page-size="list.pageSize" '+
                                       'layout="total, sizes, prev, pager, next, jumper" '+
                                       ':total="list.total">'+
                        '</el-pagination>' +
                        '<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="margin-top-xl">'+
                            '<el-form-item label="任务开始日期" prop="startDate">' +
                                '<el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.startDate"></el-date-picker>'+
                            '</el-form-item>' +
                            '<el-form-item label="限定完成天数" prop="limitDays">'+
                                '<el-select v-model="ruleForm.limitDays" placeholder="请选择">'+
                                    '<el-option v-for="item in limitDaysOptions" :key="item.value" :label="item.lable" :value="item.value">'+
                                    '</el-option>'+
                                '</el-select>'+
                            '</el-form-item>' +
                            '<el-form-item class="text-align-right">' +
                                '<el-button @click="isVisible=false">取消</el-button >' +
                                '<el-button type="primary" @click="submitForm">提交</el-button>'+    
                            '</el-form-item>' +
                        '</el-form>'+
                    '</el-dialog>',
                    methods: {
                        setCurrent: function (row) {
                            this.$refs.singleTable.setCurrentRow(row);
                        },
                        handleCurrentRowChange: function (val) {
                            this.ruleForm.manager= val;
                        },
                        handleSizeChange: function (val) {
                            this.list.pageSize = val;
                            this.loadData();
                        },
                        handleCurrentPageChange: function (val) {
                            this.list.currentPage = val;
                            this.loadData();
                        },
                        getSkip: function () {
                            var me = this;
                            return (me.list.currentPage - 1) * me.list.pageSize;
                        },
                        submitForm: function () {
                            var me = this;
                            if (me.$refs.ruleForm.validate(function (valid) {
                                if (valid) {

                                    var f = me.ruleForm;
                                    if (f.manager === null) {
                                        me.$message({
                                            type: 'info',
                                            message: '请选择回访工作人员!'
                                        });
                                        return;
                                    }

                                    me.$http.post("/CRM/Api/Task/Visiting", me.fillServerModel()).then(function () {
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
                                "OperatorUid": f.manager.Uid,
                                "CustomerUidList": f.customers.map(function (x) { return x.CustomerUid; }),
                                "TimeTaskBegin": f.startDate.Format("yyyy-MM-dd"),
                                "TaskLimitDays": f.limitDays
                            };
                        },
                        resetForm: function () {
                            this.$refs.ruleForm.resetFields();
                        },
                        open: function (customers,fnThen,fnCatch) {
                            var me = this;
                            if (!customers) throw new Error("请传入客户");

                            me.ruleForm.customers = customers;

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
                                this.limitDaysOptions.push({ value:i,lable:i});
                            }
                        },
                        loadDataStaffs: function () {
                            var me = this;
                            me.$http.get("/CRMApi/VisitingTask_Create_Staffs", {
                                params: {
                                    $skip: me.getSkip(),
                                    $top: me.pageSize,
                                    $inlinecount: "allpages",
                                    $filter: "substringof('" + me.search.name + "',Name) eq true and substringof('" + me.search.phone + "',Mobile) eq true"//http://www.odata.org/getting-started/basic-tutorial/
                                }
                            })
                            .then(function (response) {
                                me.list.total = parseInt(response.data["odata.count"]);
                                me.list.tableData = response.data["value"];
                            });
                        }
                    },
                    mounted: function () {
                        var me = this;
                        me.generateOptions();
                        me.loadDataStaffs();
                        if (!customers.length) {
                            me.$message({ "type": "info", message: "请选择客户" });
                            me.onClose();
                            return;
                        }

                        me.open(customers);
                    }
                });
            };
        }
    };

    if (typeof window !== "undefined" && window.Vue) {
        window.Vue.use(visitTaskPlugin);
    }

    return visitTaskPlugin;
})));