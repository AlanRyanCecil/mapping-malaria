let world = L.map('world').setView([3, 16.845402], 3);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.light',
    accessToken: API_KEY
});


var africa = 'json/africa_geo.json';
let world_json = 'json/world.geojson';
var myCustomStyle = {
    stroke: false,
    color: '#000',
    weight: 1,
    fill: true,
    fillColor: '#9FD341',
    fillOpacity: 0.8
}


d3.json(world_json).then(function(data) {
    // console.log(data);
    L.geoJson(data, {
        style: myCustomStyle
    }).bindPopup(function (layer) {
        return layer.feature.properties.name_long;
    });


    let geojson = L.choropleth(data, {
        valueProperty: "density",
        scale: ["#F00", "#00F"],
        steps: 32,
        mode: "q",
        style: {
            color: "#000",
            weight: 0.5,
            fillOpacity: 0.8
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(
                `<h6>${feature.properties.name}</h6>`
            );
            layer.on('mouseover', function() {
                this.openPopup();
            });
            layer.on('mouseout', function() {
                this.closePopup();
            });
        }
    }).addTo(world);





});

// L.geoJSON(data, {
//     style: function (feature) {
//         return {color: feature.properties.color};
//     }
// }).bindPopup(function (layer) {
//     return layer.feature.properties.description;
// }).addTo(map);