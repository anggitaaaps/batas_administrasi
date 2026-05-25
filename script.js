/* =========================
   MEMBUAT PETA
========================= */

var map = L.map('map', {
    renderer: L.canvas()
}).setView([-2, 118], 5);

/* =========================
   BASEMAP
========================= */

/* OpenStreetMap */
var osm = L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '&copy; OpenStreetMap'
    }
).addTo(map);


/* Satellite Esri */
var satellite = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
        attribution: 'Tiles &copy; Esri'
    }
);


/* =========================
   LAYER CONTROL
========================= */

var baseMaps = {
    "OpenStreetMap": osm,
    "Satellite": satellite
};

L.control.layers(baseMaps).addTo(map);

/* =========================
   MEMBACA GEOJSON
========================= */

fetch('batas_adm.json')

.then(function(response){

    return response.json();

})

.then(function(data){

    console.log("Jumlah Feature:", data.features.length);

    console.log("Field:", data.features[0].properties);

    /* =========================
       LAYER GEOJSON
    ========================= */

    var batasAdm = L.geoJSON(data, {

        /* Style Polygon */
        style: function(feature){

            return {

                color: '#333',
                weight: 1,
                fillColor: '#87CEFA',
                fillOpacity: 0.5

            };

        },

        /* Popup */
        onEachFeature: function(feature, layer){

            var popupContent =

                "<h3>Informasi Provinsi</h3>" +

                "<table border='1' style='border-collapse:collapse; width:100%;'>" +

                "<tr>" +
                "<td><b>Provinsi</b></td>" +
                "<td>" + (feature.properties.PROVINSI || "-") + "</td>" +
                "</tr>" +

                "</table>";

            layer.bindPopup(popupContent);


            /* Highlight saat mouse masuk */
            layer.on({

                mouseover: function(e){

                    e.target.setStyle({

                        weight: 2,
                        color: 'yellow',
                        fillOpacity: 0.7

                    });

                },

                mouseout: function(e){

                    batasAdm.resetStyle(e.target);

                }

            });
        }

    }).addTo(map);


    /* =========================
       ZOOM KE DATA
    ========================= */

    map.fitBounds(batasAdm.getBounds());

})


/* =========================
   ERROR HANDLER
========================= */

.catch(function(error){

    console.log("Error membaca GeoJSON:", error);

});


/* =========================
   SCALE BAR
========================= */

L.control.scale().addTo(map);

/* =========================
   LEGENDA
========================= */

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');

    div.innerHTML +=
        "<h4>Legenda</h4>" +
        "<i style='background:#87CEFA; width:18px; height:18px; float:left; margin-right:8px; opacity:0.7;'></i>" +
        "<span>Batas Administrasi Provinsi</span><br>";

    return div;
};

legend.addTo(map);

/* =========================
   SEARCH PROVINSI
========================= */

var searchControl = new L.Control.Search({
    layer: batasAdm,
    propertyName: 'PROVINSI',
    marker: false,
    moveToLocation: function(latlng, title, map) {
        map.setView(latlng, 7);
    }
});

map.addControl(searchControl);

/* =========================
   KOORDINAT CURSOR
========================= */

var koordinat = L.control({position: 'bottomleft'});

koordinat.onAdd = function(map){

    this._div = L.DomUtil.create('div', 'info koordinat');
    this.update();
    return this._div;

};

koordinat.update = function(latlng){

    this._div.innerHTML = latlng
        ? 'Lat: ' + latlng.lat.toFixed(5) +
          '<br>Lng: ' + latlng.lng.toFixed(5)
        : 'Arahkan cursor ke peta';

};

koordinat.addTo(map);

map.on('mousemove', function(e){

    koordinat.update(e.latlng);

});
