const scale = require('../scale/scale')
const ICON = {
    path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
    fillColor: '#d81b60',
    fillOpacity: .6,
    anchor: new google.maps.Point(0,0),
    strokeWeight: 1,
    strokeColor: '#a00037',
    strokeOpacity: .6
}

function createAll(map, cities) {
    cities.forEach(city => {
        create(map, city)
    })
}

function create(map, city) {
    ICON['scale'] = scale.sqrt(city.population)

    const marker = new google.maps.Marker({
      position: {lat: city.lat, lng: city.lng},
      map: map,
      zIndex: 999,
      icon: ICON
    })

    return marker
}

module.exports = {
    create,
    createAll
}
