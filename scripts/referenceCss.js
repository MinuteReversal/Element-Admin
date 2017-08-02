(function () {
    var cssList = [
        "/scripts/element-ui/lib/theme-default/index.css",
        "/css/schema.default.css",
        "/css/theme/default.css",
        "/css/app.css"
    ];

    for (var i = 0, item; item = cssList[i++];) {
        document.writeln('<link href="/wwwroot' + webConfig.apiServerAddress + item + '" rel="stylesheet"/>');
    }
})();

