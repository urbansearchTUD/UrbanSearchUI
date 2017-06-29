const CENTER = {lat: 51.9225, lng: 4.47917}
const MAP_OPTIONS = {
    zoom: 8,
    minZoom: 4,
    center: CENTER,
    styles: require('./styles'),
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false
}

function initMap(div_id) {
    map = new google.maps.Map(document.getElementById(div_id), MAP_OPTIONS);
    // MAP = map
    // cities(map)
    return map
}

module.exports = {
    initMap
}
