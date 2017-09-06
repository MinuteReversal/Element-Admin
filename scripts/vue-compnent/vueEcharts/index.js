/**
 * author : zhy
 *   date : 20170615
 */
var vueEcharts = {
    template: '<div :style="{width:width,height:height}"></div>',
    props: {
        //http://echarts.baidu.com/option.html#title
        option: {
            type: Object,
            default: {
                title: {
                    text: 'ECharts Hello World'
                },
                tooltip: {},
                xAxis: {
                    data: ['Shirt', 'Sweater', 'Chiffon Shirt', 'Pants', 'High Heels', 'Socks']
                },
                yAxis: {},
                series: [{
                    name: 'Sales',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }]
            }
        },
        width: {
            type: String,
            default: "100%"
        },
        height: {
            type: String,
            default: "400px"
        },
        loading: {
            type: Boolean,
            default: false
        },
        loadingOption: {
            type: Object,
            default: function () {
                return {
                    //http://echarts.baidu.com/api.html#echartsInstance.showLoading
                    text: '加载中',
                    color: '#c23531',
                    textColor: '#000',
                    maskColor: 'rgba(255, 255, 255, 0.8)',
                    zlevel: 0
                };
            }
        }
    },
    methods: {
        num2px: function (val) {
            return val + "px";
        },
        enableLoading: function (val) {
            val ? this.echarts.showLoading(this.loadingOption) : this.echarts.hideLoading();
        }
    },
    watch: {
        option: {
            handler: function (val, oldVal) {
                this.echarts.setOption(val);
            },
            deep: true
        },
        loading: function (val, oldVal) {
            this.enableLoading(val);
        }
    },
    mounted: function () {
        var me = this;
        me.echarts = echarts.init(me.$el);
        me.echarts.setOption(me.option);//http://echarts.baidu.com/api.html#echartsInstance.setOption
        me.enableLoading(me.loading);
        window.addEventListener("resize", function () {
            me.echarts.resize();
        });
    }
};