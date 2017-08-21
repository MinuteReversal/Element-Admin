/*
* author : zhy
*   mail : mailzy@vip.qq.com
*   date : 20170702
* plugin : visitTaskComplexPlugin
* example: this.$visittaskcomplex.open();
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.VueResource = factory());
}(this, (function () {
    'use strict';

    var visitTaskComplexPlugin = {
        install: function (vue) {
            if (this.installed) return;
            this.installed = true;

            vue.prototype.$visittaskcomplex = function (options) {
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
                        title: "创建回访任务",
                        fnThen: function () { },
                        fnCatch: function () { },
                        limitDaysOptions: [],
                        model: {
                            customers: [],
                            staff: null,
                            startDate: new Date(),
                            limitDays: 1
                        },
                        customers: {
                            search: {
                                name: "",
                                phone: ""
                            },
                            loading: false,
                            pageSize: 10,
                            tableData: [
                                { id: 1, name: "王五", phone: "13888001001", taskCount: 2 },
                                { id: 2, name: "周六", phone: "13888001002", taskCount: 5 }
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
                                { id: 1, name: "王五", phone: "13888001001", taskCount: 2 },
                                { id: 2, name: "周六", phone: "13888001002", taskCount: 5 }
                            ],
                            currentPage: 1,
                            total: 0,
                            currentRow: null
                        },
                        ruleForm: {
                            customers: [],
                            staff: null,
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
                template:/*注意模板中的html属性要空格分隔*/
                '<el-dialog :title="title" v-model="isVisible" @close="onClose">' +
                    '<el-form :inline="true" :model="customers.search" label-width="120px">'+
                        '<el-form-item label="客户姓名">'+
                            '<el-input v-model="customers.search.name" placeholder="客户姓名"></el-input>'+
                        '</el-form-item>'+
                        '<el-form-item label="客户电话">' +
                            '<el-input v-model="customers.search.phone" placeholder="客户电话"></el-input>' +
                        '</el-form-item>' +
                        '<el-form-item>' +
                            '<el-button type="primary" @click="loadDataCustomers" icon="search">查询</el-button>'+
                        '</el-form-item>'+
                    '</el-form>'+
                    '<el-table v-bind:data="customers.tableData" '+
                      'border highlight-current-row height="250" ' +
                      '@selection-change="handleCustomersSelectionChange" '+
                      'v-bind:default-sort="{prop: \'name\', order: \'descending\'}" '+
                        'class="col-12">' +
                        '<el-table-column type="selection" '+
                            'width="55">'+
                        '</el-table-column>'+
                         '<el-table-column prop="CityName" '+
                                         'label="地市" '+
                                         'width="160">'+
                         '</el-table-column>' +
                         '<el-table-column prop="CountyName" '+
                                         'label="县" '+
                                         'width="160">'+
                         '</el-table-column>' +
                         '<el-table-column prop="Name" '+
                                         'label="客户名称" '+
                                         'width="160">'+
                         '</el-table-column>' +
                         '<el-table-column prop="Phone" '+
                                         'label="电话" '+
                                         'width="160">'+
                         '</el-table-column>' +
                         '<el-table-column prop="GroupTypeCaption" '+
                                         'label="类别" '+
                                         'width="160">'+
                         '</el-table-column>' +
                         '</el-table-column>' +
                                         '<el-table-column prop="TimeTaskCreated" '+
                                         'label="上次回访日期" '+
                                         'width="160">'+
                                '<template scope="scope">'+
                                    '<el-icon name="time"></el-icon>'+
                                    '<span style="margin-left: 10px">{{ scope.row.TimeCreated | date }}</span>'+
                                '</template>'+
                         '</el-table-column>' +
                         '</el-table-column>' +
                                         '<el-table-column prop="OperatorName" '+
                                         'label="上次回访人员" '+
                                         'width="160">'+
                         '</el-table-column>'+
                    '</el-table>'+
                    '<el-pagination class="clear" '+
                                   '@size-change="handleCustomersSizeChange" '+
                                   '@current-change="handleCustomersCurrentPageChange" '+
                                   ':current-page="customers.currentPage" '+
                                   ':page-sizes="[10, 20, 50, 100]" '+
                                   ':page-size="customers.pageSize" '+
                                   'layout="total, sizes, prev, pager, next, jumper" '+
                                   ':total="customers.total">'+
                     '</el-pagination>' +
                     '<el-form :inline="true" :model="staffs.search" label-width="120px" class="margin-top-xl">'+
                        '<el-form-item label="回访人员姓名">'+
                            '<el-input v-model="staffs.search.name" placeholder="回访人员姓名"></el-input>'+
                        '</el-form-item>'+
                        '<el-form-item label="回访人员电话">' +
                            '<el-input v-model="staffs.search.mobile" placeholder="回访人员电话"></el-input>' +
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
                        '<el-form-item label="任务开始日期" prop="startDate">' +
                            '<el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.startDate"></el-date-picker>'+
                        '</el-form-item>' +
                        '<el-form-item label="限定完成天数" prop="limitDays">'+
                            '<el-select v-model="ruleForm.limitDays" placeholder="请选择">'+
                                '<el-option v-for="item in limitDaysOptions" :key="item.value" :label="item.lable" :value="item.value">'+
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
                    handleCustomersSelectionChange: function (val) {
                        this.ruleForm.customers = val;  
                    },
                    handleCustomersSizeChange: function (val) {
                        this.customers.pageSize = val;
                        this.loadDataCustomers();
                    },
                    handleCustomersCurrentPageChange: function (val) {
                        this.customers.currentPage = val;
                        this.loadDataCustomers();
                    },
                    getCustomersSkip: function () {
                        var me = this;
                        return (me.customers.currentPage - 1) * me.customers.pageSize;
                    },
                    loadDataCustomers: function () {
                        var me = this;
                        me.$http.get("/CRMApi/VisitingTask_Create_Customers", {
                            params: {
                                $skip: me.getCustomersSkip(),
                                $top: me.customers.pageSize,
                                $inlinecount: "allpages",
                                $filter: "substringof('" + me.customers.search.name + "',Name) eq true and substringof('" + me.customers.search.phone + "',Phone) eq true"//http://www.odata.org/getting-started/basic-tutorial/
                            }
                        })
                        .then(function (response) {
                            me.customers.total = parseInt(response.data["odata.count"]);
                            me.customers.tableData = response.data["value"];
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
                        me.$http.get("/CRMApi/VisitingTask_Create_Staffs", {
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
                                        message: '请选择回访工作人员!'
                                    });
                                    return;
                                }

                                if (f.customers.length === 0) {
                                    me.$message({
                                        type: 'info',
                                        message: '请勾选客户!'
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
                            "OperatorUid": f.staff.Uid,
                            "CustomerUidList": f.customers.map(function (x) { return x.Uid; }),
                            "TimeTaskBegin": f.startDate.Format("yyyy-MM-dd"),
                            "TaskLimitDays": f.limitDays
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
                            this.limitDaysOptions.push({ value: i, lable: i });
                        }
                    }
                },
                mounted: function () {
                    var me = this;
                    me.loadDataCustomers();
                    me.loadDataStaffs();
                    me.generateOptions();
                    me.open();
                }
            });
            };
        }
    };

    if (typeof window !== "undefined" && window.Vue) {
        window.Vue.use(visitTaskComplexPlugin);
    }

    return visitTaskComplexPlugin;
})));