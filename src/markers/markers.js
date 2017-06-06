const scale = require('../scale/scale')
const ICON_URL = '/static/circle.svg'
const ICON_POP_THRESHOLDS = [
    1000, 3000, 5000, 7500, 10000, 15000, 20000,
    25000, 50000, 75000, 100000, 200000, 400000,
    600000, 800000
]
const ICONS = {}

function createAll(options) {
    initIcons()
    const cityMakerMap = {}

    options.cities.forEach(city => {
        cityMakerMap[city.id] = create({
            city: city,
            map: options.map,
            click: options.click,
            dblclick: options.dblclick,
            minPop: options.minPop,
            maxPop: options.maxPop
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
        icon: getIcon(city.population),
        opacity: .6,
        city: city,
        visible: city.population >= min && city.population <= max
    })

    marker.addListener('click', () => options.click(marker))
    marker.addListener('dblclick', () => options.dblclick(marker))

    return marker
}

function initIcons() {
    ICON_POP_THRESHOLDS.forEach(pop => {
        ICONS[pop] = scaledIcon(pop)
    })
    console.log(Object.keys(ICONS).length)
}

function getIcon(population) {
    let closest = ICON_POP_THRESHOLDS.reduce((prev, cur) => {
        return population < prev ? prev : cur
    }, 750)
    console.log('closest for ' + population + ': ' + closest)
    return ICONS[closest]
}

function scaledIcon(population) {
    let size = Math.max(40 * scale.sqrt(population), 8)
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
