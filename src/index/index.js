const map = require('../map/map')
const markers = require('../markers/markers')
const card = require('../card/card')
const controlcard = require('../card/control')
const infocard = require('../card/info')
const slider = require('../slider/slider')
const neo4jutils = require('../neo4j_utils/neo4j_utils')
const relations = require('../relations/relations')
const transforms = require('../relations/transforms')

const googleMap = map.initMap('map')
var MARKERS = null;
const RELATIONS_ACTIVE = relations.relationDict(true)

function cityClick(cityId) {
    const marker = MARKERS[cityId]
    marker.setVisible(!marker.getVisible())
}

function markerClick(marker) {
    infocard.markerInfo(marker)
}

function popSliderUpdate(range) {
    for (let id of Object.keys(MARKERS)) {
        let visible = slider.inRange(MARKERS[id].city.population, range)
        MARKERS[id].setVisible(visible)
    }
    controlcard.filterCityList(null, range)
}

function relationClick(relation) {
    infocard.relationInfo(relation)
}

function transformCallback(e) {
    transforms[e.target.value](relations.getRelations())
}

neo4jutils.getCities()
    .then(cities => {
    MARKERS = markers.createAll({
        'map': googleMap,
        'cities': cities,
        'click': markerClick
    })
    return cities
    })
    .then((cities) => {
        controlcard.initCityList({
            'cities': cities,
            'click': cityClick,
        })
    })
    .then(() => {
        // Must happen after MARKER filling and city list creation
        slider.createPopulationSlider({
            'callback': popSliderUpdate,
        })
        controlcard.filterCityList()
    })
    .then(() => {
        return neo4jutils.getICRelations()
    })
    .then(icRels => {
        relations.createAll({
            'map': googleMap,
            'markers': MARKERS,
            'relations': icRels,
            'click': relationClick
        })
    })
    .then(() => {
        controlcard.initRelationList({
            relations: relations.getRelationMax(),
            transform: transformCallback
        })
    })
