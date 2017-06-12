const map = require('../map/map')
const markers = require('../markers/markers')
const card = require('../card/card')
const controlcard = require('../card/control')
const infocard = require('../card/info')
const slider = require('../slider/slider')
const neo4jutils = require('../neo4j_utils/neo4j_utils')
const relations = require('../relations/relations')

const googleMap = map.initMap('map')
var MARKERS = null;

function cityClick(cityId) {
    const marker = MARKERS[cityId]
    marker.setVisible(!marker.getVisible())
}

function markerClick(marker) {
    infocard.markerInfo(marker)
}

function relationClick(relation) {
    infocard.relationInfo(relation)
}

function markerDblClick(marker) {
    console.log('marker dblclicked');
}

function popSliderUpdate(range) {
    for (let id of Object.keys(MARKERS)) {
        let visible = slider.inRange(MARKERS[id].city.population, range)
        MARKERS[id].setVisible(visible)
    }
    controlcard.filterCityList(null, range)
}

neo4jutils.getCities().then(cities => {
    MARKERS = markers.createAll({
        'map': googleMap,
        'cities': cities,
        'click': markerClick,
        'dblclick': markerDblClick,
    })
    return cities
}).then((cities) => {
    controlcard.initCityList({
        'cities': cities,
        'click': cityClick,
    })
}).then(() => {
    // Must happen after MARKER filling and city list creation
    slider.createPopulationSlider({
        'callback': popSliderUpdate,
    })
    controlcard.filterCityList()
}).then(() => {
    neo4jutils.getICRelations().then(icRels => {
        relations.createAll({
            'map': googleMap,
            'markers': MARKERS,
            'relations': icRels,
            'click': relationClick
        })
    })
})

// fetch('/data/city_latlng.json')
//     .then(response => {
//         return response.json()
//     })
//     .then(cities => {
//         controlcard.initCityList({cities, click: cityClick})
//         MARKERS = markers.createAll({
//             'map': googleMap,
//             'cities': cities,
//             'click': markerClick,
//             'dblclick': markerDblClick
//         })
//     })
