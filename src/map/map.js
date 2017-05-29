const CENTER = {lat: 51.98799603, lng: 5.922999562}
const MAP_OPTIONS = {
    zoom: 7,
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
