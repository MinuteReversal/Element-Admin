(function () {
    var jsList = [
        "/apiconfig.js",
        "/scripts/polyfill/Array.prototype.forEach.js",
        "/scripts/polyfill/Array.prototype.indexOf.js",
        "/scripts/polyfill/Array.prototype.filter.js",
        "/scripts/polyfill/DOMParser.js",
        "/scripts/polyfill/HTMLCanvasElement.toBlob.js",
        "/scripts/polyfill/Object.assign.js",
        "/scripts/cookies.js",
        "/scripts/guid.js",
        "/scripts/dateformat.js",
        "/scripts/jszip.js",
        "/scripts/linq.js",
        "/scripts/md5.js",
        "/scripts/stringFormat.js",
        "/scripts/vue.js",
        "/scripts/vue-plugins/vue-resource/vue-resource.js",
        "/scripts/element-ui/lib/index.js",
        "/scripts/vue-compnent/ckeditor/ckeditor/ckeditor.js",
        "/scripts/vue-compnent/ckeditor/ckeditor/config.js",
        "/scripts/vue-compnent/ckeditor/index.js",
        "/scripts/vue-compnent/vueAsyncComponent/JavaScript.js",
        "/scripts/vue-compnent/vueLoadComponent/JavaScript.js",
        "/scripts/vue-plugins/loaderwindow/JavaScript.js",
        "/scripts/framework.js"
    ];

    for (var i = 0, item; item = jsList[i++];) {
        document.writeln('<script src="/wwwroot' + webConfig.apiServerAddress + item + '"></script>');
    }
})();

