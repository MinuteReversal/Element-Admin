/*
* author  : zhy
* version : 1.2 
*/
/**
 * @method download
 * @param {String} url
 * @param {Object} postData
 * @param {String} fileName
 * @param {Function} fnProgress
 * @param {Function} fnSuccess
 * @param {Function} fnError
 */
function download(url, postData, method, fileName, fnProgress, fnSuccess, fnError) {
    var setting = {
        url: "",
        postData: null,
        method: "GET",
        fileName: "1.txt",
        fnProgress: function (e) { },
        fuSuccess: function (e) { },
        fnError: function (e) { }
    };

    if (url !== "") {
        setting.url = url;
    }

    if (postData) {
        setting.postData = postData;
    }

    if (method) {
        setting.method = method;
    }

    if (fileName) {
        setting.fileName = fileName;
    }

    if (fnProgress && typeof fnProgress === "function") {
        setting.fnProgress = fnProgress;
    }

    if (fnSuccess) {
        setting.fnSuccess = fnSuccess;
    }

    if (fnError) {
        setting.fnError = fnError;
    }

    if (typeof arguments[0] === "object") {
        Object.assign(setting, arguments[0]);
    }

    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function (e) {
        var me = e.target;
        if (me.status === 200) {
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(me.response, setting.fileName);
            } else {
                var anchor = document.createElement("a");
                anchor.href = URL.createObjectURL(me.response);
                anchor.setAttribute("download", setting.fileName);
                anchor.text = "下载";
                anchor.style.visibility = "hidden";
                anchor.addEventListener("load", function (loadEvent) {
                    loadEvent.stopPropagation();
                });

                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
                setting.fuSuccess(me);
            }
        }
        else {
            if (setting.fnError(me));
        }
    });
    xhr.addEventListener("progress", function (e) {
        setting.fnProgress(e);
    });
    xhr.open(setting.method, setting.url);
    xhr.setRequestHeader("content-type", "application/json");
    xhr.responseType = "blob";
    xhr.send(setting.postData ? JSON.stringify(setting.postData) : setting.postData);
}