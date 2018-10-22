'use strict';

let world = L.map('world').setView([3, 16.845402], 2);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.light',
    accessToken: API_KEY
});

var africa = 'static/json/africa_geo.json';
let world_json = 'static/json/world.geojson';
var myCustomStyle = {
    stroke: false,
    color: '#000',
    weight: 1,
    fill: true,
    fillColor: '#9FD341',
    fillOpacity: 0.8
}

let year = 2006;
let countryLookUp = {};
function getValueProperty(feature) {
    try {
        return countryLookUp[feature.properties.name]
            .filter(x => x.Year == year)[0]['Malaria cases/100,000 pop.'];
    } catch(err) {
        return 0;
    }
}

d3.json(world_json).then(function(geoData) {
    L.geoJson(geoData, {
        style: myCustomStyle
    }).bindPopup(function(layer) {
        return layer.feature.properties.name_long;
    });

    d3.json('/malaria').then(malData => {
        let countryNest = d3.nest()
            .key(x => x.Country)
            .entries(malData);
        countryNest.forEach(o => {
            countryLookUp[o.key] = o.values;
        });

        let geojson = L.choropleth(geoData, {
            valueProperty: x => getValueProperty(x),
            scale: ["#07F", "#F00"],
            steps: 32,
            mode: "q",
            style: {
                color: "#000",
                weight: 0.5,
                fillOpacity: 1
            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(
                    `<h6>${feature.properties.name}</h6>`
                );
                layer.on('mouseover', function(event) {
                    this.openPopup();
                    this.getPopup().setLatLng(event.latlng);
                    this.setStyle({fillOpacity: 0.5});
                });
                layer.on('mouseout', function(event) {
                    this.closePopup();
                    this.setStyle({fillOpacity: 1});
                });
                layer.on('click', function(event) {
                    world.fitBounds(this.getBounds());
                });
            }
        }).addTo(world);
    });
});
