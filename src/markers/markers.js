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

function createAll(options) {
    options.cities.forEach(city => {
        create({
            city: city,
            map: options.map,
            click: options.click,
            dblclick: options.dblclick
        })
    })
}

function create(options) {
    const city = options.city

    const marker = new google.maps.Marker({
      position: {lat: city.lat, lng: city.lng},
      map: options.map,
      icon: scaledIcon(options.city.population),
      city: city
    })

    marker.addListener('click', () => {
        options.click(marker)
    })

    marker.addListener('dblclick', () => {
        options.dblclick(marker)
    })

    return marker
}

function scaledIcon(population) {
    ICON.scale = scale.sqrt(city.population)

    return ICON
}

module.exports = {
    create,
    createAll
}
