(function () {
    var mapId = window.VISITOR_MAP_ID || "";
    var container = document.getElementById("visitor-map-mount");
    if (!container) {
        return;
    }

    if (mapId) {
        var pixel = document.createElement("img");
        pixel.width = 1;
        pixel.height = 1;
        pixel.alt = "";
        pixel.src = "https://mapmyvisitors.com/map.png?d=" + encodeURIComponent(mapId) + "&cl=ffffff";
        pixel.style.cssText = "position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;";
        document.body.appendChild(pixel);

        var script = document.createElement("script");
        script.type = "text/javascript";
        script.id = "mmvst_globe";
        script.src = "https://mapmyvisitors.com/globe.js?d=" + encodeURIComponent(mapId) + "&x=y";
        container.appendChild(script);
        return;
    }

    container.innerHTML = '<div id="visitor-leaflet-map" class="visitor-leaflet-map"></div>';

    function loadStylesheet(href) {
        if (document.querySelector('link[href="' + href + '"]')) {
            return;
        }
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
    }

    function loadScript(src, callback) {
        var existing = document.querySelector('script[src="' + src + '"]');
        if (existing) {
            if (existing.getAttribute("data-loaded") === "true") {
                callback();
                return;
            }
            existing.addEventListener("load", callback, { once: true });
            return;
        }
        var script = document.createElement("script");
        script.src = src;
        script.onload = function () {
            script.setAttribute("data-loaded", "true");
            callback();
        };
        document.body.appendChild(script);
    }

    loadStylesheet("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
    loadScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", function () {
        fetch("https://ip-api.com/json/?fields=status,country,countryCode,city,lat,lon")
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data.status !== "success") {
                    container.innerHTML = '<p class="visitor-map-fallback">Visitor map is loading...</p>';
                    return;
                }

                var map = L.map("visitor-leaflet-map", {
                    scrollWheelZoom: false,
                    worldCopyJump: true
                }).setView([20, 0], 2);

                L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    subdomains: "abcd",
                    maxZoom: 19
                }).addTo(map);

                L.circleMarker([data.lat, data.lon], {
                    radius: 8,
                    color: "#2563eb",
                    weight: 2,
                    fillColor: "#3b82f6",
                    fillOpacity: 0.85
                }).addTo(map).bindPopup(
                    "<strong>Your approximate location</strong><br>" +
                    data.city + ", " + data.country +
                    "<br><span style='color:#666;font-size:12px;'>Based on IP geolocation</span>"
                ).openPopup();

                map.fitWorld();
            })
            .catch(function () {
                container.innerHTML = '<p class="visitor-map-fallback">Unable to load visitor map.</p>';
            });
    });
})();
