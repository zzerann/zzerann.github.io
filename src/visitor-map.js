(function () {
    var WIDGET_ID = "GKZwpWNrvpPixp-O0IeMpDSLq76lqkQ8XKM2opJF2FE";
    var STATS_URL = "https://mapmyvisitors.com/web/1c5ej";

    function isStillLoading() {
        return document.querySelector(".mapmyvisitors-loading") !== null;
    }

    function loadWidgetData() {
        var script = document.createElement("script");
        script.src =
            "https://mapmyvisitors.com/widget_call_home.js?d=" +
            encodeURIComponent(WIDGET_ID) +
            "&cl=ffffff&w=720&_=" +
            Date.now();
        document.body.appendChild(script);
    }

    function showStatsLink() {
        var note = document.getElementById("visitor-map-note");
        if (!note) {
            return;
        }
        note.hidden = false;
        note.innerHTML =
            'Map data is slow to load on your network. ' +
            '<a href="' + STATS_URL + '" target="_blank" rel="noopener">View full visitor map</a>';
    }

    function waitForWidget() {
        var attempts = 0;
        var dataLoads = 0;
        var timer = window.setInterval(function () {
            attempts += 1;
            var widget = document.getElementById("mapmyvisitors-widget");

            if (!widget) {
                if (attempts >= 40) {
                    window.clearInterval(timer);
                    showStatsLink();
                }
                return;
            }

            if (isStillLoading()) {
                if (attempts % 6 === 0 && dataLoads < 4) {
                    dataLoads += 1;
                    loadWidgetData();
                }
            } else {
                window.clearInterval(timer);
                return;
            }

            if (attempts >= 40) {
                window.clearInterval(timer);
                showStatsLink();
            }
        }, 500);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", waitForWidget);
    } else {
        waitForWidget();
    }
})();
