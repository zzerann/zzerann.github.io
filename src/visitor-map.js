(function () {
    function initVisitorMap() {
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

        container.innerHTML =
            '<div id="visitor-leaflet-map" class="visitor-leaflet-map"></div>' +
            '<p id="visitor-map-status" class="visitor-map-fallback"></p>';

        function loadStylesheet(href) {
            if (document.querySelector('link[href="' + href + '"]')) {
                return;
            }
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = href;
            document.head.appendChild(link);
        }

        function loadScript(src) {
            return new Promise(function (resolve, reject) {
                var existing = document.querySelector('script[src="' + src + '"]');
                if (existing) {
                    if (existing.getAttribute("data-loaded") === "true") {
                        resolve();
                        return;
                    }
                    existing.addEventListener("load", resolve, { once: true });
                    existing.addEventListener("error", reject, { once: true });
                    return;
                }
                var script = document.createElement("script");
                script.src = src;
                script.onload = function () {
                    script.setAttribute("data-loaded", "true");
                    resolve();
                };
                script.onerror = reject;
                document.body.appendChild(script);
            });
        }

        function fetchLocation() {
            return fetch("https://ipwho.is/")
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    if (!data.success) {
                        throw new Error("ipwho.is failed");
                    }
                    return {
                        lat: data.latitude,
                        lon: data.longitude,
                        city: data.city,
                        country: data.country
                    };
                });
        }

        loadStylesheet("https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css");
        loadScript("https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js")
            .then(function () {
                var map = L.map("visitor-leaflet-map", {
                    scrollWheelZoom: false,
                    worldCopyJump: true
                }).setView([20, 0], 2);

                L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    subdomains: "abcd",
                    maxZoom: 19
                }).addTo(map);

                return fetchLocation()
                    .then(function (data) {
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
                    })
                    .catch(function () {
                        var status = document.getElementById("visitor-map-status");
                        if (status) {
                            status.textContent = "Showing world map. Location lookup is temporarily unavailable.";
                        }
                    })
                    .finally(function () {
                        map.fitWorld();
                    });
            })
            .catch(function () {
                container.innerHTML = '<p class="visitor-map-fallback">Unable to load visitor map.</p>';
            });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initVisitorMap);
    } else {
        initVisitorMap();
    }
})();
