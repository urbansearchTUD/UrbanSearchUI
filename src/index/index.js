const map = require('../map/map')
const markers = require('../markers/markers')
const card = require('../card/card')
const controlcard = require('../card/control')
const infocard = require('../card/info')
const slider = require('../slider/slider')
const neo4jutils = require('../neo4j_utils/neo4j_utils')
const relations = require('../relations/relations')
const relDocs = require('../relations/documents')
const transforms = require('../relations/transforms')
const exporter = require('../export/export')

const googleMap = map.initMap('map')
var MARKERS = null
const LOADER_RELATIONS = document.querySelector('[data-loader-relations]')
const LOADER_RELDOCS = document.querySelector('[data-loader-reldocs]')
const RELATIONS_ACTIVE = relations.relationDict(true)
const SIDEMENU = document.querySelector('[data-sidemenu]')

function cityClick(cityId) {
    const marker = MARKERS[cityId]
    marker.setVisible(!marker.getVisible())
}

function markerClick(marker) {
    marker.selected = !marker.selected
    marker.selected ? marker.setOpacity(0.95) : marker.setOpacity(0.5)
}

function popSliderUpdate(range) {
    for (let id of Object.keys(MARKERS)) {
        let visible = slider.inRange(MARKERS[id].city.population, range)
        MARKERS[id].setVisible(visible)
    }
    controlcard.filterCityList(null, range)
}

function relationClick(relation) {
    const html = infocard.relationInfo(relation, {})
    console.log(html.querySelector('[data-documentget-button]'));
    html.querySelector('[data-documentget-button]').addEventListener('click', (e) => {
        relationDocs(relation)
    })
    const el = SIDEMENU.insertBefore(html, SIDEMENU.firstChild)
    setTimeout(() => {
        SIDEMENU.firstChild.classList.remove('init')
    }, 10);
}

function relationDocs(relation) {
    scrollSidemenuTop()
    loaderReldocs(true)
    relDocs.getRelations(relation)
    .then((json) => {
        const t0 = performance.now();
        const html = infocard.relationDocs({
            documents: json.documents,
            from: relation.from.name,
            to: relation.to.name
        })
        SIDEMENU.insertBefore(html, SIDEMENU.firstChild)
        const t1 = performance.now();
        console.log(t1-t0);
        loaderReldocs(false)
        setTimeout(() => {
            SIDEMENU.firstChild.classList.remove('init')
        }, 10);
    })
    .catch((err) => {
        console.log(err);
    })

}

function scrollSidemenuTop() {
    SIDEMENU.scrollTop = 0;
}

function loaderRelations(show) {
    if(show) {
        console.log("SHOW");
        LOADER_RELATIONS.classList.remove('hide')
    }
    else {
        console.log("HIDE");
        LOADER_RELATIONS.classList.add('hide')
    }
}

function loaderReldocs(show) {
    if(show) {
        SIDEMENU.insertBefore(LOADER_RELDOCS, SIDEMENU.firstChild)
        LOADER_RELDOCS.classList.remove('hide')
    }
    else {
        LOADER_RELDOCS.classList.add('hide')
    }
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
    loaderRelations(true)
    return neo4jutils.getICRelations()
})
.then(icRels => {
    console.log('CLOSEs');
    loaderRelations(false)
    relations.createAll({
        'map': googleMap,
        'markers': MARKERS,
        'relations': icRels,
        'click': relationClick,
        'visible': false
    })
})
.then(() => {
    controlcard.initRelationList({
        relations: relations.getRelationMax(),
        transform: transformCallback
    })
})
