const map = require('../map/map')
const markers = require('../markers/markers')
const card = require('../card/card')
const controlcard = require('../card/control')
const infocard = require('../card/info')
// const relations = require('../relations/relations')

const googleMap = map.initMap('map')

function markerClick(marker) {
    console.log('marker clicked');
    infocard.markerInfo(marker)
}

function markerDblClick(marker) {
    console.log('marker dblclicked');
}

fetch('/data/city_latlng.json')
    .then(response => {
        return response.json()
    })
    .then(cities => {
        controlcard.initCityList(cities)
        markers.createAll({
            'map': googleMap,
            'cities': cities,
            'click': markerClick,
            'dblclick': markerDblClick
        })
    })
