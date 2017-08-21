/**
 * author      : 反转的分针
 * date        : 20170709
 * mail        : 114233763@qq.com
 * description : 图片加载
 */
var vueImagePreview = {
    template: '<div v-loading="loading" :style="{width:width,height:height}"><img style="width:100%;height:100%;vertical-align:middle;" :src="path" @load="onLoaded" @click="$emit(\'click\')"/></div>',
    props: {
        "src": {
            "type": String,
            "default": ""
        },
        "type": {
            "type": String,
            "default": "default" //add|default
        },
        "width": {
            "type": String,
            "default": "100%"
        },
        "height": {
            "type": String,
            "default": "100%"
        }
    },
    computed: {
        "path": function () {
            var me = this;
            if (typeof me.src === "string" && me.src !== "" && me.src !== Guid.empty.toString()) {
               return webconfig.resourceServerAddress + me.src;
            }

            if (me.type === "add") {
                return me.addImage;
            }
            return me.defaultImage;
        }
    },
    data: function () {
        return {
            loading: false,
            defaultImage: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjM2cHgiIGhlaWdodD0iMzUuOTk1cHgiIHZpZXdCb3g9IjAgMCAzNiAzNS45OTUiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDM2IDM1Ljk5NSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8cGF0aCBmaWxsPSIjNEQ0RDREIiBkPSJNMzQuNjE3LDIuNjI3SDEuNDE5SDEuMzg5Yy0wLjc2NiwwLTEuMzk1LDAuNjItMS4zOTUsMS4zOTF2MjcuOTE0djAuMDQ0YzAsMC43NTMsMC42MjksMS4zOTEsMS4zOTUsMS4zOTENCgloMzMuMTkyaDAuMDM2YzAuNzQ4LDAsMS4zNzctMC42MzgsMS4zNzctMS4zOTFWNC4wNjJWNC4wMThDMzUuOTk0LDMuMjQ3LDM1LjM2NSwyLjYyNywzNC42MTcsMi42MjdMMzQuNjE3LDIuNjI3eiBNMzMuMjI2LDMwLjYwNA0KCUwzMy4yMjYsMzAuNjA0SDIuNzY2di0zLjA2NGw3LjE0My03LjEyOWw0LjkyNCw0LjkxNXYwLjAwOWwwLjAxOCwwLjAxOGwwLjAwOSwwLjAwOWwwLjAyMiwwLjAxOGwwLjAwOSwwLjAxOGwwLjAyMiwwLjAxOA0KCWwyLjkwNSwyLjkyM2MwLjMzNywwLjMxMSwwLjg0NiwwLjMxMSwxLjE4MywwYzAuMzE0LTAuMzM2LDAuMzE0LTAuODY4LDAtMS4xODdsLTIuMzc4LTIuMzU1bDYuNzE3LTYuNzNsOS44ODgsOS44ODNWMzAuNjA0DQoJTDMzLjIyNiwzMC42MDR6IE0zMy4yMjYsMjUuNkwzMy4yMjYsMjUuNmwtOS4yOTktOS4yOWMtMC4zMjMtMC4zMjgtMC44NDEtMC4zMjgtMS4xNzgsMGwtNy4yODksNy4zMDdsLTQuOTczLTQuOTUxDQoJYy0wLjMyMy0wLjMzNi0wLjg0Ni0wLjMzNi0xLjE2LDBsLTYuNTYzLDYuNTE5VjUuMzk4aDMwLjQ2VjI1LjZMMzMuMjI2LDI1LjZ6IE0xMC40MzksMTYuNTRMMTAuNDM5LDE2LjU0DQoJYzIuNjQ0LDAsNC44MjItMi4xNzksNC44MjItNC44MzZjMC0yLjYzOS0yLjE3OS00LjgxNy00LjgyMi00LjgxN2MtMi42NTIsMC00LjgyNywyLjE3OS00LjgyNyw0LjgxNw0KCUM1LjYxMywxNC4zNjEsNy43ODcsMTYuNTQsMTAuNDM5LDE2LjU0TDEwLjQzOSwxNi41NHogTTEwLjQzOSw4LjU2MUwxMC40MzksOC41NjFjMS43NCwwLDMuMTc1LDEuNDE3LDMuMTc1LDMuMTQ0DQoJYzAsMS43NTQtMS40MzUsMy4xODgtMy4xNzUsMy4xODhzLTMuMTc1LTEuNDM1LTMuMTc1LTMuMTg4QzcuMjY1LDkuOTc4LDguNjk5LDguNTYxLDEwLjQzOSw4LjU2MUwxMC40MzksOC41NjF6Ii8+DQo8L3N2Zz4NCg==",
            addImage: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjM2cHgiIGhlaWdodD0iMzUuOTk1cHgiIHZpZXdCb3g9IjAgMCAzNiAzNS45OTUiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDM2IDM1Ljk5NSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8cGF0aCBmaWxsPSIjNEQ0RDREIiBkPSJNMzQuNjE3LDIuNjI3SDEuNDE5SDEuMzg5Yy0wLjc2NiwwLTEuMzk1LDAuNjItMS4zOTUsMS4zOTF2MjcuOTE0djAuMDQ0YzAsMC43NTMsMC42MjksMS4zOTEsMS4zOTUsMS4zOTENCgloMzMuMTkyaDAuMDM2YzAuNzQ4LDAsMS4zNzctMC42MzgsMS4zNzctMS4zOTFWNC4wNjJWNC4wMThDMzUuOTk0LDMuMjQ3LDM1LjM2NSwyLjYyNywzNC42MTcsMi42MjdMMzQuNjE3LDIuNjI3eiBNMzMuMjI2LDMwLjYwNA0KCUwzMy4yMjYsMzAuNjA0SDIuNzY2di0zLjA2NGw3LjE0My03LjEyOWw0LjkyNCw0LjkxNXYwLjAwOWwwLjAxOCwwLjAxOGwwLjAwOSwwLjAwOWwwLjAyMiwwLjAxOGwwLjAwOSwwLjAxOGwwLjAyMiwwLjAxOA0KCWwyLjkwNSwyLjkyM2MwLjMzNywwLjMxMSwwLjg0NiwwLjMxMSwxLjE4MywwYzAuMzE0LTAuMzM2LDAuMzE0LTAuODY4LDAtMS4xODdsLTIuMzc4LTIuMzU1bDYuNzE3LTYuNzNsOS44ODgsOS44ODNWMzAuNjA0DQoJTDMzLjIyNiwzMC42MDR6IE0zMy4yMjYsMjUuNkwzMy4yMjYsMjUuNmwtOS4yOTktOS4yOWMtMC4zMjMtMC4zMjgtMC44NDEtMC4zMjgtMS4xNzgsMGwtNy4yODksNy4zMDdsLTQuOTczLTQuOTUxDQoJYy0wLjMyMy0wLjMzNi0wLjg0Ni0wLjMzNi0xLjE2LDBsLTYuNTYzLDYuNTE5VjUuMzk4aDMwLjQ2VjI1LjZMMzMuMjI2LDI1LjZ6IE0xMC40MzksMTYuNTRMMTAuNDM5LDE2LjU0DQoJYzIuNjQ0LDAsNC44MjItMi4xNzksNC44MjItNC44MzZjMC0yLjYzOS0yLjE3OS00LjgxNy00LjgyMi00LjgxN2MtMi42NTIsMC00LjgyNywyLjE3OS00LjgyNyw0LjgxNw0KCUM1LjYxMywxNC4zNjEsNy43ODcsMTYuNTQsMTAuNDM5LDE2LjU0TDEwLjQzOSwxNi41NHogTTEwLjQzOSw4LjU2MUwxMC40MzksOC41NjFjMS43NCwwLDMuMTc1LDEuNDE3LDMuMTc1LDMuMTQ0DQoJYzAsMS43NTQtMS40MzUsMy4xODgtMy4xNzUsMy4xODhzLTMuMTc1LTEuNDM1LTMuMTc1LTMuMTg4QzcuMjY1LDkuOTc4LDguNjk5LDguNTYxLDEwLjQzOSw4LjU2MUwxMC40MzksOC41NjF6Ii8+DQo8cGF0aCBzdHJva2U9IiM0RDRENEQiIGQ9Ik0gMzAgMTIuMCBIIDIwIi8+DQo8cGF0aCBzdHJva2U9IiM0RDRENEQiIGQ9Ik0gMjUgOCBWIDE2Ii8+DQo8L3N2Zz4NCg=="
        }
    },
    methods: {
        onLoaded: function () {
            var me = this;
            me.loading = false;
        }
    }
};