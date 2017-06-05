const map = require('../map/map')
const markers = require('../markers/markers')
const card = require('../card/card')
const controlcard = require('../card/control')
const infocard = require('../card/info')
const slider = require('../slider/slider')
const neo4jutils = require('../neo4j_utils/neo4j_utils')
// const relations = require('../relations/relations')

const googleMap = map.initMap('map')
var MARKERS = null;

function cityClick(e, city) {
    console.log('city: ', city);
    const marker = MARKERS[city]
    console.log('marker:', marker);
    marker.getVisible() ? marker.setVisible(false) : marker.setVisible(true)
}

function markerClick(marker) {
    infocard.markerInfo(marker)
}

function markerDblClick(marker) {
    console.log('marker dblclicked');
}

function popSliderUpdate(range) {
    for (let id of Object.keys(MARKERS)) {
        let visible = slider.inRange(MARKERS[id].city.population, range)
        MARKERS[id].setVisible(visible)
    }
    controlcard.filterCityList(values[0], values[1])
}

neo4jutils.getCities()
    .then(cities => {
        controlcard.initCityList({cities, click: cityClick})
        MARKERS = markers.createAll({
            'map': googleMap,
            'cities': cities,
            'click': markerClick,
            'dblclick': markerDblClick
        })
    })
    .then(e => {
        // Must happen after MARKER filling
        slider.createPopulationSlider({'callback': popSliderUpdate})
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
