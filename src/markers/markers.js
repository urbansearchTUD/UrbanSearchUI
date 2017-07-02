const scale = require('../scale/scale')
const config = require('../../config')
const ICON_URL = '/img/circle.svg'


function addInfoWindow(marker) {
    let infoWindow = new google.maps.InfoWindow({
        content: marker.city.name + '\n - Population: ' + marker.city.population
    })

    marker.addListener('mouseover', (e) => {
        infoWindow.setPosition({
            'lat': e.latLng.lat() + 0.009,
            'lng': e.latLng.lng()
        })
        infoWindow.open(map, marker)
    })

    marker.addListener('mouseout', () => {
        infoWindow.close()
    })
}

function createAll(options) {
    const cityMakerMap = {}

    options.cities.forEach(city => {
        cityMakerMap[city.id] = create({
            city: city,
            map: options.map,
            click: options.click,
            dblclick: options.dblclick,
            minPop: config.get('popslider_start')[0],
            maxPop: config.get('popslider_start')[1]
        })
    })

    return cityMakerMap
}

function create(options) {
    const city = options.city
    const min = options.minPop
    const max = options.maxPop
    const marker = new google.maps.Marker({
        position: {lat: city.latitude, lng: city.longitude},
        map: options.map,
        icon: scaledIcon(city.population),
        opacity: .5,
        city: city,
        visible: city.population >= min && city.population <= max,
        selected: false
    })

    marker.addListener('click', () => options.click(marker))
    marker.addListener('dblclick', () => options.dblclick(marker))
    addInfoWindow(marker)

    return marker
}

function scaledIcon(population) {
    let size = Math.max(50 * scale.sqrt(population), 10)
    return {
        url: ICON_URL,
        scaledSize: new google.maps.Size(size, size),
        anchor: new google.maps.Point(.5 * size, .5 * size)
    }
}

module.exports = {
    create,
    createAll
}
