const watcher = require('watch-object')

const LINE_OPTS = {
    // geodesic: true,
    strokeColor: '#F8BBD0',
    strokeOpacity: 1,
    strokeWeight: 4,
    zindex: 5
}

function createAll(options) {
    options.relations.forEach(rel => {
        let from = options.markers[rel.from.id]
        let to = options.markers[rel.to.id]
        create({
            'map': options.map,
            'click': options.click,
            'markerFrom': from,
            'markerTo': to,
            'rel': rel
        })
    })
}

function addInfoWindow(path, cityA, cityB) {
    let infoWindow = new google.maps.InfoWindow({
        content: cityA + ' - ' + cityB
    })

    path.addListener('mouseover', (e) => {
        // Move window slightly up to allow for clicking the relation
        infoWindow.setPosition({
            'lat': e.latLng.lat() + 0.02,
            'lng': e.latLng.lng()
        })
        infoWindow.open(map, path)
    })

    path.addListener('mouseout', () => infoWindow.close())
}

function addWatcher(path, markerA, markerB) {
    watcher.watch(markerA, 'visible', (newval, oldval) => {
        path.setVisible(markerB.getVisible() && newval)
    })
    watcher.watch(markerB, 'visible', (newval, oldval) => {
        path.setVisible(markerA.getVisible() && newval)
    })
}

function create(options) {
    if (options.rel.from.id === options.rel.to.id) {
        console.log('should never happen!')
        return
    }

    LINE_OPTS['path'] = [
        {lat: options.rel.from.lat, lng: options.rel.from.lng},
        {lat: options.rel.to.lat, lng: options.rel.to.lng}
    ]

    let flightPath = new google.maps.Polyline(LINE_OPTS)
    flightPath.setVisible(options.markerFrom.getVisible() && options.markerTo.getVisible())
    flightPath.setMap(options.map)
    flightPath.addListener('click', () => click(options.rel))
    addInfoWindow(flightPath, options.rel.from.name, options.rel.to.name)
    addWatcher(flightPath, options.markerFrom, options.markerTo)
}

module.exports = {
    createAll
}
