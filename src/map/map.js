const CENTER = {lat: 52.184641, lng: 5.770469}
const MAP_OPTIONS = {
    zoom: 8,
    minZoom: 4,
    center: CENTER,
    styles: require('./styles'),
    mapTypeControl: false,
    streetViewControl: false,
    zoomControl: true,
    zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
    }
}

function initMap(div_id) {
    map = new google.maps.Map(document.getElementById(div_id), MAP_OPTIONS);
    return map
}

module.exports = {
    initMap
}
