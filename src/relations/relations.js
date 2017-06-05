const LINE_OPTS = {
    // geodesic: true,
    strokeColor: '#F8BBD0',
    strokeOpacity: 1,
    strokeWeight: 4,
    zindex: 5
}

function createAll(options) {
    options.relations.forEach(rel => {
        create(options.map, options.click, rel)
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

function create(map, click, rel) {
    if (rel.from.name === rel.to.name) {
        console.log('should never happen!')
        return
    }

    LINE_OPTS['path'] = [
        {lat: rel.from.lat, lng: rel.from.lng},
        {lat: rel.to.lat, lng: rel.to.lng}
    ]

    let flightPath = new google.maps.Polyline(LINE_OPTS)
    flightPath.setMap(map)
    flightPath.addListener('click', () => click(rel))
    addInfoWindow(flightPath, rel.from.name, rel.to.name)
}

module.exports = {
    createAll
}
