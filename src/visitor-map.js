(function () {
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
            var script = document.createElement("script");
            script.src = src;
            script.onload = resolve;
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
            })
            .catch(function () {
                return fetch("https://api.ip.sb/geoip")
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        if (!data.latitude || !data.longitude) {
                            throw new Error("ip.sb failed");
                        }
                        return {
                            lat: data.latitude,
                            lon: data.longitude,
                            city: data.city || data.region || "Unknown",
                            country: data.country || "Unknown"
                        };
                    });
            });
    }

    function initVisitorMap() {
        var container = document.getElementById("visitor-leaflet-map");
        if (!container || container.dataset.initialized === "true") {
            return;
        }
        container.dataset.initialized = "true";

        loadStylesheet("https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css");
        loadScript("https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js")
            .then(function () {
                var map = L.map(container, {
                    scrollWheelZoom: false,
                    worldCopyJump: true
                }).setView([20, 0], 2);

                L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    subdomains: "abcd",
                    maxZoom: 19
                }).addTo(map);

                fetchLocation()
                    .then(function (data) {
                        L.circleMarker([data.lat, data.lon], {
                            radius: 8,
                            color: "#2563eb",
                            weight: 2,
                            fillColor: "#3b82f6",
                            fillOpacity: 0.85
                        }).addTo(map).bindPopup(
                            "<strong>Your approximate location</strong><br>" +
                            data.city + ", " + data.country
                        ).openPopup();
                        map.setView([data.lat, data.lon], 3);
                    })
                    .catch(function () {
                        map.fitWorld();
                    });

                setTimeout(function () {
                    map.invalidateSize();
                }, 100);
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
