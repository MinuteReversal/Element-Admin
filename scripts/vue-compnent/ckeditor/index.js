var vueCkeditor = {
    template: '<div v-once @><input type="text"/></div>',
    props: {
        // 只检测类型
        value: String,
        readOnly: {
            type: Boolean,
            default: false
        },
        isHtmlEncode: {
            type: Boolean,
            default: true
        },
        bodyClass: {
            type: String,
            default: ''
        },
        contentsCss: {
            type: [String, Array],
            default: ''
        },
        extraPlugins: {
            type: String,
            default: ''
        },
        height: {
            type: [String, Number],
            default: 200
        },
        width: {
            type: [String, Number],
            default: ''
        }
    },
    data: function () {
        return {
            ckeditor: null,
            timer: null,
            updateDelay: 300
        };
    },
    methods: {
        applyCkeditor: function () {
            var me = this;
            //http://docs.ckeditor.com/#!/api/CKEDITOR.config
            me.ckeditor = CKEDITOR.replace(me.$el.querySelector("input"), {
                bodyClass: me.bodyClass,
                contentsCss: me.contentsCss,
                extraPlugins: me.extraPlugins,
                readOnly: me.readOnly,
                width: me.width,
                height: me.height,
                on: {
                    instanceReady: function (evt) {
                        //http://stackoverflow.com/questions/18461206/how-to-retrieve-the-ckeditor-status-ready
                        me.setValue(me.value);
                    }
                }
            });
            me.ckeditor.on("change", function (evt) {
                me.onUpdateValue();
            });
        },
        addEventListenerInput: function () {
            //http://docs.ckeditor.com/#!/api/CKEDITOR.editor-event-change
            var me = this;
            var editable = me.ckeditor.editable();
            editable.attachListener(editable, 'input', function () {
                me.onUpdateValue();
            });
        },
        onUpdateValue: function () {
            var me = this;
            if (me.isHtmlEncode) {
                me.$emit("input", me.htmlEncode(me.ckeditor.getData()));
            }
            else {
                me.$emit("input", me.ckeditor.getData());
            }
        },
        setValue: function (value) {
            var me = this;
            if (me.isHtmlEncode) {
                me.setBodyValue(me.htmlDecode(value));
            }
            else {
                me.setBodyValue(value);
            }
        },
        /*
        *
        *fix Permission Denied in IE Edge
        *
        */
        setBodyValue: function (value) {
            var me = this;
            var cke = me.ckeditor.element.$.nextElementSibling;
            if (cke && cke.getAttribute("role") === "application") {
                var body = cke.querySelector("iframe").contentWindow.document.body;
                body.innerHTML = value;
            }
            else {
                me.ckeditor.setData(value);
            }
        },
        getValue: function () {
            var me = this;
            if (me.isHtmlEncode) {
                return me.htmlDecode(me.ckeditor.getData());
            }
            return me.ckeditor.getData();
        },
        getRawValue: function () {
            var me = this,
                value = me.ckeditor.getData();

            if (me.isHtmlEncode) {
                return me.htmlEncode(value);
            }

            return value;
        },
        htmlEncode: function (value) {
            return (value + "").replace(/&/g, "&amp;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
        },
        htmlDecode: function (value) {
            return (value + "").replace(/&amp;/g, "&")
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">");
        }
    },
    watch: {
        value: function (val, oldVal) {
            var me = this;
            if (me.getRawValue() !== val) {
                me.setValue(val);
            }
        }
    },
    mounted: function () {
        var me = this;
        me.$nextTick(function () {
            me.applyCkeditor();
        });
    }
};