/* =========================
   MEMBACA GEOJSON
========================= */

fetch('data/batas_adm.json')

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
