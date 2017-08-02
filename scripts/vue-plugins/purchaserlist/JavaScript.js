/*
* author : zhy
*   mail : mailzy@vip.qq.com
*   date : 20170409
* plugin : purchaselist
* example: this.$purchaselist.open({ProductGuid:"00000000-0000-0000-0000-000000000000",SupplierGuid:"00000000-0000-0000-0000-000000000000" });
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global.VueResource = factory());
}(this, (function () {
    'use strict';

    function toElement(html) {
        var tempContainer = document.createElement("div");
        tempContainer.innerHTML = html;
        return tempContainer.firstElementChild;
    }

    var purchaselistPlugin = {
        install: function (vue) {
            if (this.installed) return;
            this.installed = true;

            vue.prototype.$purchaselist = new Vue({
                created: function () {
                    var me = this;
                    window.addEventListener("load", function () {
                        var div= toElement("<div></div>");
                        document.body.appendChild(div);
                        me.$mount(div);
                    });
                },
                components: {
                    "el-table": ELEMENT.Table,
                    "el-table-column": ELEMENT.TableColumn,
                    "el-button": ELEMENT.Button,
                    "el-pagination": ELEMENT.Pagination,
                    "el-dialog": ELEMENT.Dialog
                },
                filters: {
                    dataFromat:function(v) {
                        return MSJsonDateToDate(v).Format("yyyy-MM-dd HH:mm:ss");
                    }  
                },
                data: function () {
                    return {
                            isVisible: false,
                            title: "信息",
                            model: {
                                Guid: Guid.empty.toString(),
                                SupplierName: '',
                                SupplierPhone: '',
                                SupplierAddress: '',
                                TimeCreated: new Date()
                            },
                            search: {
                                ProductGuid : null,
                                SupplierGuid : null
                            },
                            list: {
                                loading: false,
                                pageSize: 10,
                                tableData: [],
                                currentPage: 1,
                                total: 0
                            }
                        };
                },
                template:
                '<el-dialog :title="title" v-model="isVisible">'+
                    '<el-table v-bind:data="list.tableData"'+
                      'border highlight-current-row'+
                      'v-bind:default-sort="{prop: \'name\', order: \'descending\'}"'+
                      'class="col-12">'+
                        '<el-table-column prop="ProductName"'+
                                         'label="产品名称 "'+
                                         'sortable'+
                                         'width="160">'+
                        '</el-table-column>'+
                        '<el-table-column prop="SupplierName"'+
                                         'label="供货商名称"'+
                                         '>'+
                        '</el-table-column>'+
                        '<el-table-column prop="OperatorName"'+
                                         'label="操作员"'+
                                         '>'+
                        '</el-table-column>'+
                        '<el-table-column prop="Purchaser"'+
                                         'label="进货员"'+
                                         '>'+
                        '</el-table-column>'+
                        '<el-table-column prop="Number"'+
                                         'label="数量">'+
                        '</el-table-column>'+
                        '<el-table-column prop="Remark"'+
                                         'label="备注">'+
                        '</el-table-column>'+
                        '<el-table-column prop="TimeCreated"'+
                                         'label="创建时间"'+
                                        'width="240">'+
                            '<template scope="scope">'+
                                '<el-icon name="time"></el-icon>'+
                                '<span style="margin-left: 10px">{{scope.row.TimeCreated|dataFromat}}</span>'+
                            '</template>'+
                        '</el-table-column>'+
                    '</el-table>'+
                    '<el-pagination class="clear"'+
                                   'v-on:size-change="handleSizeChange"'+
                                   'v-on:current-change="handleCurrentChange"'+
                                   'v-bind:current-page="list.currentPage"'+
                                   'v-bind:page-sizes="[10, 20, 50, 100]"'+
                                   'v-bind:page-size="list.pageSize"'+
                                   'layout="total, sizes, prev, pager, next, jumper"'+
                                   'v-bind:total="list.total">'+
                    '</el-pagination>'+
                  '</el-dialog>',
                methods: {
                    handleSizeChange: function (val) {
                        this.list.pageSize = val;
                        this.loadData();
                    },
                    handleCurrentChange: function (val) {
                        this.list.currentPage = val;
                        this.loadData();
                    },
                    getSkip: function () {
                        var me = this;
                        return (me.list.currentPage - 1) * me.list.pageSize;
                    },
                    loadData: function () {
                        var me = this;

                        var queryModel = Object.assign({
                            skip: me.getSkip(),
                            top: me.list.pageSize
                        },
                        me.search
                        );

                        me.$http.get(apiConfig.purchase_query, {
                            params: queryModel
                        })
                        .then(function (response) {
                            me.list.total = response.data.Total;
                            me.list.tableData = response.data.Data;
                        });
                    },
                    open: function (options) {
                        var me = this;

                        if (typeof options === "object" && options !== null) {
                            for (var propertyName in options) {
                                if (options.hasOwnProperty(propertyName)) {
                                    me[propertyName] = options[propertyName];
                                }
                            }
                        }

                        me.isVisible = true;
                    },
                    close: function () {
                        this.isVisible = false;
                    }
                },
                mounted: function () {
                   this.loadData();
                }
            });
        }
    };

    if (typeof window !== "undefined" && window.Vue) {
        window.Vue.use(purchaselistPlugin);
    }

    return purchaselistPlugin;
})));