/*
* @author:mailzy@vip.qq.com
* @version:1.0.3
*/
(function (w) {
    /**
    * @constructor Framework
    * @returns {} 
    */
    var Framework = function () {
        var me = this;
        this.history = [];
        this.hashParameters = {};
        this.debug = false;
        this.isPing = false;
        this.timerId = null;
        this.pingInterval = 10 * 60 * 1000;
        this.ui = null;
        this.basiccomponents = {
            "el-row": ELEMENT.Row,
            "el-col": ELEMENT.Col,
            "el-button": ELEMENT.Button
        };
        me.formcomponents = {
            "el-radio": ELEMENT.Radio,
            "el-radio-group": ELEMENT.RadioGroup,
            "el-checkbox": ELEMENT.Checkbox,
            "el-checkbox-group": ELEMENT.CheckboxGroup,
            "el-input": ELEMENT.Input,
            "el-input-number": ELEMENT.InputNumber,
            "el-select": ELEMENT.Select,
            "el-switch": ELEMENT.Switch,
            "el-slider": ELEMENT.Slider,
            "el-time-picker": ELEMENT.TimePicker,
            "el-time-select": ELEMENT.TimeSelect,
            "el-date-picker": ELEMENT.DatePicker,
            "el-upload": ELEMENT.Upload,
            "el-rate": ELEMENT.Rate,
            "el-form": ELEMENT.Form,
            "el-form-item": ELEMENT.FormItem,
            "el-option": ELEMENT.Option
        };
        me.datacomponents = {
            "el-table": ELEMENT.Table,
            "el-table-column": ELEMENT.TableColumn,
            "el-tag": ELEMENT.Tag,
            "el-progress": ELEMENT.Progress,
            "el-tree": ELEMENT.Tree,
            "el-badge": ELEMENT.Badge,
            "el-pagination": ELEMENT.Pagination
        };
        me.noticecomponents = {
            "el-alert": ELEMENT.Alert
        };
        me.navigationcomponents = {
            "el-menu": ELEMENT.Menu,
            "el-menu-item": ELEMENT.MenuItem,
            "el-submenu": ELEMENT.Submenu,
            "el-tabs": ELEMENT.Tabs,
            "el-tab-pane": ELEMENT.TabPane,
            "el-breadcrumb": ELEMENT.Breadcrumb,
            "el-breadcrumb-item": ELEMENT.BreadcrumbItem,
            "el-dropdown": ELEMENT.Dropdown,
            "el-dropdown-menu": ELEMENT.DropdownMenu,
            "el-steps": ELEMENT.Steps,
            "el-step": ELEMENT.Step
        };
        me.otherscomponents = {
            "el-dialog": ELEMENT.Dialog,
            "el-tooltip": ELEMENT.Tooltip,
            "el-popover": ELEMENT.Popover,
            "el-card": ELEMENT.Card,
            "el-carousel": ELEMENT.Carousel,
            "el-collapse": ELEMENT.Collapse
        };
        me.allcomponents = {};
        for (var i, g; g = [this.basiccomponents, this.formcomponents, this.datacomponents, this.noticecomponents, this.navigationcomponents, this.otherscomponents][i++];) {
            for (var p in g) {
                if (g.hasOwnProperty(p)) {
                    this.allcomponents[p] = g[p];
                }
            }
        }

        me.filters = {
            /*
            *时间
            */
            "time": function (val) {
                var date = me.textToDate(val);
                if (isNaN(date.getTime())) {
                    return "不可用日期";
                }
                return date.Format("yyyy-MM-dd HH:mm:ss");
            },
            /*
           *日期
           */
            "date": function (val) {
                var date = me.textToDate(val);
                if (isNaN(date.getTime())) {
                    return "不可用日期";
                }
                return date.Format("yyyy-MM-dd");
            },
            /*
            * 钱
            */
            "money": function (val) {
                if (typeof val === "number") {
                    return val.toFixed(2);
                }
                return "0.00";
            },
            /*
            * 需要除以100
            */
            "intMoney": function (val) {
                if (typeof val === "number") {
                    return (val / 100).toFixed(2);
                }
                return "0.00";
            },
            "image": function (src) {
                var idx = src.indexOf('http');
                if (idx === 0) {
                    return src;
                } else {
                    return webconfig.resourceServerAddress + src;
                }
            }
        };

        me.directives = {
            /*
            * 跳转指令
            */
            'href': {
                "bind": function (el, binding, vnode, oldVnode) {
                    var fnPageLoader = $f.getPageLoader();
                    el.addEventListener("click", function (evt) {
                        var url = binding.expression;
                        if (typeof url === "string" && url !== "#" && url !== "" && fnPageLoader) {
                            fnPageLoader(url);
                        }
                    });
                }
            },
            "back": {
                "bind": function (el, binding, vnode, oldVnode) {
                    var fnPageLoader = $f.getPageLoader();
                    el.addEventListener("click", function (evt) {
                        $f.back();
                    });
                }
            }
        };
    };

    /**
    *@method textToDate
    *@return Date
    */
    Framework.prototype.textToDate = function (text) {
        var d = new Date("Invalid Date");
        if (text instanceof Date) {
            d = text;
        }
        else if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(text)) {
            //2016-09-18T03:46:11
            var t = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/.exec(text);
            d = new Date(t[1], parseInt(t[2]) - 1, t[3], t[4], t[5], t[6]);
        }
        else if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+/.test(text)) {
            //2016-09-18T03:46:11.893Z
            var t = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d+)/.exec(text);
            d = new Date(t[1], parseInt(t[2]) - 1, t[3], t[4], t[5], t[6], t[7].substr(0, 4));
        }
        else if (/\/Date\(-?\d+\)\//.test(text)) {
            //Microsoft json Date \/Date(1450800000000)\/ \/Date(-62135596800000)\/
            d = new Date(parseInt(text.substring(6)));
        }
        return d;
    };

    /**
     * 用户登录
     * @param {} response 
     * @param {} fnCallBack 
     * @returns {} 
     */
    Framework.prototype.login = function (user) {
        //user:{
        //    "Username": "admin",
        //    "UserId": 1,
        //    "RoleName": "SystemAdmin",
        //    "SessionName": "DMPSKey",
        //    "SessionKey": "d4791bb351d6c459b3eb5a232a0d27d6cd93c826",
        //    "ReturnUrl": "&username=admin&token=597f5441e7d174b607873874ed54b974674986ad543e7458e28a038671c9f64c"
        //}
        var me = this;
        me.setUser(user);
        //me.ping();
    };

    /**
     * 用户退出
     * @returns {} 
     */
    Framework.prototype.logout = function () {
        var me = this;
        localStorage.clear();
        clearInterval(me.timerId);
        me.ui.loadPage("/wwwroot/login.html");
        me.ajax({ method: "POST", url: "/Account/Logout" });
    };

    /**
     * ping pong
     * @returns {} 
     */
    Framework.prototype.ping = function () {
        var me = this;
        if (!me.isPing) {
            me.isPing = true;
            me.ajax({ url: "/api/Auth/Ping" });
            me.timerId = setInterval(function () {
                me.ajax({ url: "/api/Auth/Ping" });
            }, me.pingInterval);
        }
    };

    /**
     * 获取用户SessionKey
     * @returns {} 
     */
    Framework.prototype.getSessionKey = function () {
        var me = this;
        return me.getUser() ? me.getUser().SessionKey : null;
    };

    /**
     * 设置用户信息
     * @param {object} user 
     * @returns {void} 
     */
    Framework.prototype.setUser = function (user) {
        localStorage["User"] = JSON.stringify(user);
    };

    /**
     * 获取用户信息
     * @returns {object} 
     */
    Framework.prototype.getUser = function () {
        return JSON.parse(localStorage["User"], function (k, v) {
            if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v)) {
                //2016-09-18T03:46:11.893Z
                return new Date(v.replace("T", ""));
            }
            else if (/\/Date\(-?\d+\)\//.test(v)) {
                //Microsoft json Date \/Date(1450800000000)\/ \/Date(-62135596800000)\/
                return new Date(parseInt(v.substring(6)));
            }
            return v;
        });
    };

    Framework.prototype.fixDate = function (o) {
        for (var p in o) {
            if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(o[p])) {
                //2016-09-18T03:46:11.893Z
                o[p] = new Date(o[p].replace("T", ""));
            }
            else if (/\/Date\(-?\d+\)\//.test(o[p])) {
                //Microsoft json Date \/Date(1450800000000)\/ \/Date(-62135596800000)\/
                o[p] = new Date(parseInt(o[p].substring(6)));
            }

        }
        return o;
    };

    Framework.prototype.getMenu = function () {
        var me = this;
        var user = me.getUser();
        return user.UserMenuModels;
    };

    /**
   *服务器模型转客户端模型
   */
    Framework.prototype.toClientModel = function (model, isDeep) {
        var me = this;

        for (var property in model) {
            if (model.hasOwnProperty(property)) {
                var v = model[property];

                if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v)) {
                    //2016-09-18T03:46:11.893Z
                    model[property] = new Date(v);
                }
                else if (/\/Date\(-?\d+\)\//.test(v)) {
                    //Microsoft json Date \/Date(1450800000000)\/ \/Date(-62135596800000)\/
                    model[property] = new Date(parseInt(v.substring(6)));
                }
                else if (isDeep && v instanceof Object) {
                    me.toClientModel(v, isDeep);
                }
            }
        }
        return model;
    };

    /**
    *客户端面模型转服务器模型
    */
    Framework.prototype.toServerModel = function (model, isDeep) {
        var me = this;

        for (var property in model) {
            if (model.hasOwnProperty(property)) {
                var v = model[property];

                if (v instanceof Date) {
                    model[property] = v.Format("yyyy-MM-dd HH:mm:ss");
                    continue;
                }
                else if (isDeep && v instanceof Object) {
                    me.toServerModel(v, isDeep);
                }
            }
        }
        return model;
    };

    /**
     * 打印日志
     * @param {} text 
     * @param {} type 
     * @returns {} 
     */
    Framework.prototype.log = function (text, type) {
        var me = this;
        if (!type) type = "log";
        if (me.debug) {
            console[type](text);
        }
    };

    /**
     * 弹出对话框
     * @param {string} text 
     * @returns {void} 
     */
    Framework.prototype.alert = function (text, fnOk) {
        if (this.ui) {
            this.ui.$alert(text, "", {
                confirmButtonText: '确定',
                callback: fnOk
            });
        } else {
            alert(text);
        }

        if (webConfig.debug) {
            console.log(text);
        }
    };

    /**
     * 确定
     * @param {string} text 
     * @param {function} fnOk 
     * @param {function} fnCancel 
     * @returns {void} 
     */
    Framework.prototype.confirm = function (text, fnOk, fnCancel) {
        this.ui.$confirm(text, '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
        }).then(fnOk).catch(fnCancel);
    };

    /**
     * 输入
     * @param {string} text 
     * @param {function} fnOk 
     * @param {function} fnCancle 
     * @returns {void} 
     */
    Framework.prototype.prompt = function (text, fnOk, fnCancel) {
        this.ui.$prompt(text, '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }).then(fnOk).catch(fnCancel);
    };


    /**
     * ajax请求
     * @param {} options 
     * @returns {} 
     */
    Framework.prototype.ajax = function (options) {
        var me = this;
        var accept = {
            "html": "text/html",
            "json": "application/json",
            "text": "text/plain"
        };

        options.accept = options.accept ? accept[options.accept] : accept["json"];

        var settings = Object.assign({
            url: "",
            method: "GET",
            data: null,
            accept: accept["json"],
            progress: function (progressEvent) { },
            success: function (body, loadEvent) { },
            error: function (body, errorEvent) {
                var request = errorEvent.target;
                if (/application\/json/i.test(request.getResponseHeader("Content-Type"))) {
                    me.errorHander(JSON.parse(body));
                }
            },
            complete: function (body, loadendEvent) { }
        }, options);

        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function (loadEvent) {
            if (this.status === 200) {
                settings.success(this.responseText, loadEvent);
            } else {
                settings.error(this.responseText, loadEvent);
            }
        });
        xhr.addEventListener("loadend", function (loadendEvent) {
            settings.complete(this.responseText, loadendEvent);
        });
        xhr.addEventListener("progress", function (progressEvent) {
            settings.progress(this.responseText, progressEvent);
        });
        xhr.addEventListener("error", function (errorEvent) {
            settings.error(this.responseText, errorEvent);
        });
        xhr.open(settings.method, settings.url);
        xhr.setRequestHeader("Accept", settings.accept);
        xhr.send(settings.data);
    };

    /**
    * @method addParameters
    * @param {number} vueUid
    * @param {object}
    * @re
    */
    Framework.prototype.addParameters = function (vueUid, parameters) {
        return this.hashParameters[vueUid] = parameters;
    };

    /**
    * @method removeParameters
    * @param {number} vueUid
    */
    Framework.prototype.removeParameters = function (vueUid) {
        delete this.hashParameters[vueUid];
    };

    /**
    * @method getParameters
    * @param {number} vueUid
    */
    Framework.prototype.getParameters = function (vueUid) {
        return this.hashParameters[vueUid];
    };

    /**
    * @method getAllParameters
    * @return {array}
    */
    Framework.prototype.getAllParameters = function () {
        return this.hashParameters;
    }

    /**
    * @method getParameters
    * @param {number} vueUid
    * @returns {any}
    */
    Framework.prototype.getParametersByKey = function (vueUid, key) {
        var me = this;
        var o = me.getParameters(vueUid);
        for (var p in o) {
            if (p.toLowerCase() === key.toLowerCase()) {
                return o[p];
            }
        }
        return o;
    };

    /**
    * @method setUrl
    */
    Framework.prototype.setUrl = function (url, isBack) {
        var me = this;
        if (!isBack) me.pushUrl(url);
    };

    /**
    * @method pushUrl
    * @param {Btring} url
    * @param {Boolean} isShowUrl
    * @returns {void} 
    */
    Framework.prototype.pushUrl = function (url, notShow) {
        var me = this;
        if (typeof url === "string" && url !== "") {
            if (!notShow) history.pushState(null, "", location.origin + url);
            me.history.push(url);
        }
    };

    /**
    * @method popUrl
    * @param {Boolean} isShowUrl
    * @return {void}
    */
    Framework.prototype.popUrl = function (notShow) {
        var me = this;
        var url = me.history.pop();
        if (!notShow) history.pushState(null, "", location.origin + url);
        return url;
    };

    /*
    *@method updateCurrentUrl
    *@returns {void}
    */
    Framework.prototype.updateCurrentUrl = function () {
        var me = this;
        var history = me.history;
        history[history.length - 1] = location.pathname + location.search;
    }

    /**
    * @method back
    * @returns {void}
    */
    Framework.prototype.back = function () {
        var me = this;
        var fnPageLoader = me.getPageLoader();
        me.history.pop();//current
        var url = me.history[me.history.length - 1];//last
        if (fnPageLoader && url) fnPageLoader(url, true);
    }

    /**
    *@method go
    *@returns {void}
    */
    Framework.prototype.go = function (url) {
        var me = this;
        var fnPageLoader = me.getPageLoader();
        if (fnPageLoader) fnPageLoader(url);
    }

    /**
     * @method getPageComponent
     * @param {string} url 
     * @param {function} fn 
     * @returns {object} 
     */
    Framework.prototype.getPageComponent = function (options) {
        var me = this;

        var settings = Object.assign({}, {
            url: "",
            isBack: false,
            isChangeUrl: true,
            success: function (component) { },
            error: function (exception) { }
        }, options);

        if (settings.isChangeUrl) me.setUrl(settings.url, settings.isBack);

        try {
            me.ajax({
                url: settings.url,
                accept: "html",
                success: function (body) {
                    try {
                        var dp = new DOMParser();
                        var dom = dp.parseFromString(body, "text/html");
                        var div = dom.querySelector("body > div");
                        var script = dom.querySelector("body > script");
                        var template = div ? div.outerHTML : '<div><h1 class="horizontal-vertical-center">建设中……</span></div>';
                        var options = me.getVueOptions(script ? script.innerHTML : "");

                        if (options == null) {
                            options = {};
                        }

                        var component = {
                            template: template
                        };
                        component.template = template;
                        if (options.data) {
                            if (typeof options.data === "object") {
                                component.data = function () { return options.data; }
                            }
                            else if (typeof options.data === "function") {
                                component.data = options.data;
                            }
                        } else {
                            component.data = function () { return {}; }
                        }
                        me.convertToVueOptions(component, options);

                        settings.success(component);
                    } catch (ex) {
                        settings.error(ex);
                    }
                },
                error: function (body, event) {
                    var xhr = event.target;
                    settings.success({
                        template: '<div class="horizontal-vertical-center">' +
                        '<h1>{{status}}&nbsp;{{statusText}}</h1>' +
                        '<h2 class="horizontal-vertical-center">{{message}}</h2>' +
                        '</div>',
                        data: function () {
                            return {
                                status: xhr.status,
                                statusText: xhr.statusText,
                                message: ""
                            };
                        }
                    });
                }
            });
        } catch (e) {
            settings.error(e);
        }
    };

    /**
     * 
     * @param out {object} compoment 
     * @param {object} options 
     * @returns {void} 
     */
    Framework.prototype.convertToVueOptions = function (component, options) {
        for (var propertyName in options) {
            if (options.hasOwnProperty(propertyName)) {
                if (propertyName.toLowerCase() === "template") {
                    continue;
                }
                else if (propertyName.toLowerCase() === "data") {
                    continue;
                }
                /*Bug:js需要手动赋值?*/
                else if (propertyName.toLowerCase() === "methods") {
                    component[propertyName] = options["methods"];
                }
                else if (propertyName.toLowerCase() === "props") {
                    component[propertyName] = options["props"];
                }
                else if (propertyName.toLowerCase() === "propsData") {
                    component[propertyName] = options["propsData"];
                }
                else if (propertyName.toLowerCase() === "computed") {
                    component[propertyName] = options["computed"];
                }
                else if (propertyName.toLowerCase() === "watch") {
                    component[propertyName] = options["watch"];
                }
                //选项 / DOM
                else if (propertyName.toLowerCase() === "render") {
                    component[propertyName] = options["render"];
                }
                //选项 / 生命周期钩子
                else if (propertyName.toLowerCase() === "beforeCreate") {
                    component[propertyName] = options["beforeCreate"];
                }
                else if (propertyName.toLowerCase() === "created") {
                    component[propertyName] = options["created"];
                }
                else if (propertyName.toLowerCase() === "beforeMount") {
                    component[propertyName] = options["beforeMount"];
                }
                else if (propertyName.toLowerCase() === "mounted") {
                    component[propertyName] = options["mounted"];
                }
                else if (propertyName.toLowerCase() === "beforeUpdate") {
                    component[propertyName] = options["beforeUpdate"];
                }
                else if (propertyName.toLowerCase() === "updated") {
                    component[propertyName] = options["updated"];
                }
                else if (propertyName.toLowerCase() === "activated") {
                    component[propertyName] = options["activated"];
                }
                else if (propertyName.toLowerCase() === "deactivated") {
                    component[propertyName] = options["deactivated"];
                }
                else if (propertyName.toLowerCase() === "beforeDestroy") {
                    component[propertyName] = options["beforeDestroy"];
                }
                else if (propertyName.toLowerCase() === "destroyed") {
                    component[propertyName] = options["destroyed"];
                }
                //选项 / 资源
                else if (propertyName.toLowerCase() === "directives") {
                    component[propertyName] = options["directives"];
                }
                else if (propertyName.toLowerCase() === "filters") {
                    component[propertyName] = options["filters"];
                }
                else if (propertyName.toLowerCase() === "components") {
                    component[propertyName] = options["components"];
                }
                //选项 / 资源
                else if (propertyName.toLowerCase() === "parent") {
                    component[propertyName] = options["parent"];
                }
                else if (propertyName.toLowerCase() === "mixins") {
                    component[propertyName] = options["mixins"];
                }
                else if (propertyName.toLowerCase() === "name") {
                    component[propertyName] = options["name"];
                }
                else if (propertyName.toLowerCase() === "extends") {
                    component[propertyName] = options["extends"];
                }
                else if (propertyName.toLowerCase() === "delimiters") {
                    component[propertyName] = options["delimiters"];
                }
                else if (propertyName.toLowerCase() === "functional") {
                    component[propertyName] = options["functional"];
                }
            }
        }
    };

    /**
    *@method getVueOptionsFromStirng
    *@param {string} text
    *@returns {string}
    */
    Framework.prototype.getVueOptionsFromStirng = function (text) {
        var start = text.search(/(?!new Vue\(){/);
        var end = text.search(/(?=\);s*\r?\n\s*$)/);
        var ostr = text.substring(start, end);
        return ostr;
    };

    /**
     * @method getVueOptions
     * @param {sring} text 
     * @returns {object} 
     */
    Framework.prototype.getVueOptions = function (text) {
        var me = this;
        var result = me.getVueOptionsFromStirng(text);

        if (!result) return { data: function () { } };

        return me.createObjectFromText(result);
    };

    /**
     * 文本创建对象
     * @param {string} text 
     * @returns {object} 
     */
    Framework.prototype.createObjectFromText = function (text) {
        var me = this;
        var v = 1;
        if (v === 1) {
            return me.createObjectFromEval(text);
        }
        return null;
    };

    /**
     * 文本创建对象
     * @param {string} text 
     * @returns {object} 
     */
    Framework.prototype.createObjectFromEval = function (text) {
        var me = this;
        try {
            me.log("createObjectFromEval");
            me.log(text);
            var o = eval("(" + text + ")");
            me.log(o);
            return o;
        } catch (e) {
            me.errorHander(e);
            return null;
        }
    };

    /*
    *获取路径中的参数
    *@param {string} rule
    *@return {object}
    */
    Framework.prototype.getRouteParameters = function (rule) {
        var o = {};
        //rule:/{folder}/{guid}
        //path:http://x.y.z/Shop/90c4b3e2-3792-4ab3-8df8-89cbad89d58e
        var paths = location.pathname.slice(1).split('/');
        for (var i = 0, key; key = rule.slice(1).split('/')[i]; i++) {
            if (key === "") break;
            if (key.indexOf("{") > -1 && key.indexOf("}") > -1)
                o[key.replace(/{|}/g, "")] = paths[i];
        }
        return o;
    };

    /*
     *获取Url中的参数
     *@param {string} 参数名字
     *@return {string}
     *example:
     *  getQueryString("ID");
     */
    Framework.prototype.getQueryString = function (name, vueUid) {
        var me = this;

        var parameter = null;
        if (vueUid) parameter = me.getParametersByKey(vueUid, name);
        if (parameter) return parameter;

        return me.getQueryStringFromText(name, window.location.search);
    };

    /**
    * 从字串中找参数键值
    *@method getQueryStringFromText
    */
    Framework.prototype.getQueryStringFromText = function (name, url) {
        var me = this;
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var params = me.getQueryStringParametersFromText(url);
        if (params) {
            params.match(reg);
            var r = params.match(reg);
            if (r != null) return decodeURIComponent(r[2]);
        }
        return null;
    };

    /**
     * 获取全部参数
     * @returns {string} 
     */
    Framework.prototype.getQueryStringParameters = function (vueUid) {
        var me = this;

        var parameter = null;
        if (vueUid) parameter = me.getParameters(vueUid);
        if (parameter) return parameter;

        return me.getQueryStringParametersFromText(window.location.search);
    };

    /**
    * 从字串中分离参数和路径
    * @method getQueryStringParametersFromUrl
    */
    Framework.prototype.getQueryStringParametersUrlFromText = function (text) {
        var me = this;;
        var urlParams = text.split("?");
        return {
            url: me.undefinedToEmptyString(urlParams[0]),
            parameters: me.undefinedToEmptyString(urlParams[1])
        };
    };

    /*
    * 空转化为null
    * @param {val} text
    * @return {object|null}
    */
    Framework.prototype.emptyToNull = function (val) {
        if (val === undefined || val === "" || val === null || val === Guid.empty.toString()) {
            return null;
        }
        return val;
    };

    /*
    * 空转化为null
    * @param {val} text
    * @return {object|null}
    */
    Framework.prototype.undefinedToEmptyString = function (val) {
        if (val === undefined) {
            return "";
        }
        return val;
    };

    /*从字串中分离路径*/
    /**
    * @param {stirng} text
    * @return {stirng}
    */
    Framework.prototype.getUrlFromText = function (text) {
        return this.getQueryStringParametersUrlFromText(text).url;
    };

    /*从字串中分离参数*/
    /**
    * @param {stirng} text
    * @return {stirng}
    */
    Framework.prototype.getQueryStringParametersFromText = function (text) {
        return this.getQueryStringParametersUrlFromText(text).parameters;
    };

    /**
    *查询字串转对象
    *@method queryStringParamatersToObject
    */
    Framework.prototype.queryStringParamatersToObject = function (text) {
        var o = null;
        if (text.length > 0 && text.indexOf('=') > -1) {
            o = {};
            var keyValues = text.split("&");
            for (var i = 0, keyValue; keyValue = keyValues[i]; i++) {
                var kv = keyValue.split("=");
                o[kv[0].toLowerCase()] = kv[1];
            }
        }
        return o;
    };

    /**
    *对象转查询字串
    *@method objectToQueryString
    */
    Framework.prototype.objectToQueryString = function (o) {
        var queryString = [];
        for (var p in o) {
            queryString.push("{key}={value}".format({ key: p, value: encodeURIComponent(o[p]) }));
        }
        return queryString.join("&");
    };

    /**
     * 异常处理
     * @returns {void} 
     */
    Framework.prototype.errorHander = function (error) {
        var me = this;
        var e = me.unityError(error);

        if (e.name === 1) {
            me.ui.$alert("登录超时，请重新登录", {
                confirmButtonText: '重新登录',
                callback: function (action) {
                    me.ui.loadPage("/wwwroot/login.html");
                }
            });
        } else {
            me.alert(e.message);
        }
    };

    /**
     * 统一异常
     * @param {} error 
     * @returns {} 
     */
    Framework.prototype.unityError = function (error) {
        var e = new Error();

        //Business
        if (typeof error.Success === "boolean" && !error.Success) {
            e.name = error.ExceptionType;
            e.message = error.ErrorMsg;
        }
        //js Exception
        else if (error.message) {
            e.message = error.message;
        }

        return e;
    };

    w.$f = new Framework();


    /**
     * Vue 全局异常处理
     * @param {object} err 
     * @param {object} vm 
     * @returns {void} 
     * http://cn.vuejs.org/v2/api/#errorHandler
     */
    w.Vue.config.errorHandler = function (err, vm) {
        w.$f.errorHander(err);
    };

    /**
     * Vue-resource 全局异常处理
     * https://github.com/pagekit/vue-resource/blob/develop/docs/http.md
     */
    w.Vue.http.interceptors.push(function (request, next) {
        var vm = this;
        if (typeof vm.loading === "boolean") {
            vm.loading = true;//显示加载
        }



        // continue to next interceptor
        next(function (response) {
            if (typeof vm.loading === "boolean") {
                vm.loading = false; //隐藏加载
            }

            if (!response.ok) {
                if (/application\/json/i.test(response.headers.get("Content-Type")) && !response.data.Success) {
                    w.$f.errorHander(response.data);
                    // stop and return response
                    next(request.respondWith(body,
                        {
                            status: 404,
                            statusText: 'Not Find'
                        }));
                }
            }
        });
    });
})(window);