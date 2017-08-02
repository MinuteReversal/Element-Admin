/*
* author : zhy
*   mail : mailzy@vip.qq.com
*   date : 20170409
* plugin : purchaserecord
* example: this.$purchaserecord.open({ProductGuid:"00000000-0000-0000-0000-000000000000",SupplierGuid:"00000000-0000-0000-0000-000000000000" });
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

    var purchaserecordPlugin = {
        install: function (vue) {
            if (this.installed) return;
            this.installed = true;

            vue.prototype.$purchaserecord = new Vue({
                created: function () {
                    var me = this;
                    window.addEventListener("load", function () {
                        var div = toElement("<div></div>");
                        document.body.appendChild(div);
                        me.$mount(div);
                    });
                },
                components: {
                    "el-form": ELEMENT.Form,
                    "el-form-item": ELEMENT.FormItem,
                    "el-input": ELEMENT.Input,
                    "el-input-number": ELEMENT.InputNumber,
                    "el-button": ELEMENT.Button,
                    "el-dialog": ELEMENT.Dialog
                },
                filters: {
                    dataFromat: function (v) {
                        return MSJsonDateToDate(v).Format("yyyy-MM-dd HH:mm:ss");
                    }
                },
                template:
                '<el-dialog :title="title" v-model="isVisible">' +
                '<el-form v-bind:model="form" v-bind:rules="rules" ref="form" label-width="100px" class="demo-form">' +
                '<el-form-item label="商品颜色分类" prop="SaleSubTitle">' +
                '<el-select label="商品颜色分类" v-model="form.ClassificationGuid" placeholder="Select">' +
                '<el-option v-for="item in classifications"' +
                ':label="item.Name"' +
                ':value="item.Guid">' +
                '</el-option>' +
                '</el-select>' +
                '</el-form-item >' +
                '<el-form-item label="供货商" prop="SaleSubTitle">' +
                '<el-select label="供货商" v-model="form.SupplierGuid" placeholder="Select">' +
                '<el-option v-for="item in suppliers"' +
                ':label="item.SupplierName"' +
                ':value="item.Guid">' +
                '</el-option>' +
                '</el-select>' +
                '</el-form-item >' +
                '<el-form-item label="进货人" prop="Purchaser">' +
                '<el-input v-model="form.Purchaser"></el-input>' +
                '</el-form-item>' +
                '<el-form-item label="数量" prop="Number">' +
                '<el-input-number :min=1 v-model="form.Number"></el-input-number>' +
                '</el-form-item>' +
                '<el-form-item label="备注" prop="Remark">' +
                '<el-input type="textarea" autosize v-model="form.Remark"></el-input-number>' +
                '</el-form-item>' +
                '</el-form>' +
                '<div slot="footer" class="dialog-footer">' +
                '<el-button @click="isVisible = false">取 消</el-button>' +
                '<el-button type="primary" @click="submit"> 确 定</el-button >' +
                '</div >' +
                '</el-dialog>',
                data: function () {
                    return {
                        title:"进货",
                        isVisible: false,
                        classifications: [],
                        suppliers: [],
                        model: {
                            ProductGuid: "00000000-0000-0000-0000-000000000000",
                            ClassificationGuid: "",
                            SupplierGuid: "",
                            Purchaser: "",
                            Number: 1,
                            Remark: "",
                            TimeCreated: new Date()
                        },
                        form: {
                            ProductGuid: "00000000-0000-0000-0000-000000000000",
                            ClassificationGuid: "",
                            SupplierGuid: "",
                            Purchaser: "",
                            Number: 1,
                            Remark: "",
                            TimeCreated: new Date()
                        },
                        rules: {
                            ClassificationGuid: [
                                { required: true, message: '请输选择颜色分类', trigger: 'blur' },
                            ],
                            SupplierGuid: [
                                { required: true, message: '请输供货商', trigger: 'blur' },
                            ],
                            Purchaser: [
                                { required: true, message: '请输入进货人', trigger: 'blur' },
                                { min: 2, max: 5, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                            ]
                        }
                    };
                },
                methods: {
                    submit: function () {
                        var me = this;
                        //me.$http.post(apiConfig.purchase_save,me.form).then(function (response) {
                        //    me.$message({
                        //        type: 'success',
                        //        message: '保存成功!'
                        //    });
                        //});
                        this.$refs.form.validate(function (valid) {
                            if (valid) {
                                console.log(me.form);
                                return true;
                            } else {
                                console.log('error submit!!');
                                return false;
                            }
                        });
                       
                    },
                    getClassifications: function () {
                        var me = this;
                        me.$http.get(apiConfig.classification_query, {
                            params: {
                                skip: 0,
                                top: 0
                            }
                        }).then(function (response) {
                            me.classifications = response.data.Data;
                        });
                    },
                    getSuppliers: function () {
                        var me = this;
                        me.$http.get(apiConfig.supplier_query, {
                            params: {
                                skip: 0,
                                top: 0
                            }
                        }).then(function (response) {
                            me.suppliers = response.data.Data;
                        });
                    },
                    open: function (productGuid) {
                        var me = this;
                        me.form = Object.assign({
                            ProductGuid: productGuid
                        }, me.model);
                        me.getSuppliers();
                        me.getClassifications();
                        me.isVisible = true;
                    },
                    close: function () {
                        this.isVisible = false;
                    }
                }
            });
        }
    };

    if (typeof window !== "undefined" && window.Vue) {
        window.Vue.use(purchaserecordPlugin);
    }

    return purchaserecordPlugin;
})));