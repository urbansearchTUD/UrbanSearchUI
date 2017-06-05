const scale = require('../scale/scale')
const ICON_URL = '/static/circle.svg'

function createAll(options) {
    const cityMakerMap = {}

    options.cities.forEach(city => {
        cityMakerMap[city.id] = create({
            city: city,
            map: options.map,
            click: options.click,
            dblclick: options.dblclick
        })
    })

    return cityMakerMap
}

function create(options) {
    const city = options.city
    const marker = new google.maps.Marker({
        position: {lat: city.latitude, lng: city.longitude},
        map: options.map,
        icon: scaledIcon(city.population),
        opacity: .6,
        city: city
    })

    marker.addListener('click', () => options.click(marker))
    marker.addListener('dblclick', () => options.dblclick(marker))

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
