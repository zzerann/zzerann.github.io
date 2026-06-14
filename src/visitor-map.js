(function () {
    var mount = document.getElementById("visitor-map-mount");
    if (!mount) {
        return;
    }

    var fallbackWrap = document.getElementById("visitor-map-fallback");
    var staticImg = document.getElementById("visitor-map-static");
    var note = document.getElementById("visitor-map-note");
    var attempts = 0;
    var maxAttempts = 24;

    function showInteractiveMap() {
        mount.classList.add("has-interactive");
        if (fallbackWrap) {
            fallbackWrap.hidden = true;
        }
        if (note) {
            note.hidden = true;
        }
    }

    function showFallbackMessage(message) {
        if (note) {
            note.textContent = message;
            note.hidden = false;
        }
    }

    function interactiveReady() {
        var widget = document.getElementById("mapmyvisitors-widget");
        if (!widget) {
            return false;
        }
        var map = widget.querySelector(".mapmyvisitors-map");
        return map && widget.offsetHeight > 80;
    }

    var timer = window.setInterval(function () {
        attempts += 1;
        if (interactiveReady()) {
            showInteractiveMap();
            window.clearInterval(timer);
            return;
        }
        if (attempts >= maxAttempts) {
            window.clearInterval(timer);
            showFallbackMessage("Interactive map could not load on your network. Showing static visitor map instead.");
        }
    }, 500);

    if (staticImg) {
        staticImg.addEventListener("load", function () {
            if (!mount.classList.contains("has-interactive") && note) {
                note.hidden = false;
                note.textContent = "Loading interactive visitor map...";
            }
        });
        staticImg.addEventListener("error", function () {
            window.clearInterval(timer);
            if (fallbackWrap) {
                fallbackWrap.innerHTML =
                    '<p class="visitor-map-fallback">' +
                    "MapMyVisitors is unavailable on your current network. " +
                    "The map usually works for international visitors. " +
                    'Check your stats at <a href="https://mapmyvisitors.com/" target="_blank" rel="noopener">MapMyVisitors</a>.' +
                    "</p>";
            }
        });
    }
})();
