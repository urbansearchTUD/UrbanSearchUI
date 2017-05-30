const map = require('../map/map')
const markers = require('../markers/markers')
const card = require('../card/card')
const controlcard = require('../card/control')
const infocard = require('../card/info')
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
