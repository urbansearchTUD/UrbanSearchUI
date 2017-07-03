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

// Module constants
const googleMap = map.initMap('map')
var MARKERS = null

// Page elements
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

    html.querySelector('[data-documentget-button]').addEventListener('click', (e) => {
        relationDocs(relation)
    })

    const card = html.querySelector('.card--control__content')
    SIDEMENU.insertBefore(html, SIDEMENU.firstChild)

    setTimeout(() => {
        card.classList.remove('init')
    }, 10);
}

function relationDocs(relation) {
    scrollSidemenuTop()
    loaderReldocs(true)

    relDocs.getRelations(relation)
    .then((json) => {
        const html = infocard.relationDocs({
            documents: json.documents,
            from: relation.from.name,
            to: relation.to.name
        })

        const card = html.querySelector('.card--control__content')
        SIDEMENU.insertBefore(html, SIDEMENU.firstChild)

        setTimeout(() => {
            card.classList.remove('init')
            loaderReldocs(false)
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
        LOADER_RELATIONS.classList.remove('hide')
    }
    else {
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

function toggleActive(category, active) {
    // transforms['activeToggle'](relations.getRelations(), category, value)
    const max = {}
    const old_max = {}
    const rels = relations.getRelations()

    for(let r in rels) {
        let relation = rels[r].rel
        relations.calculateMax(old_max, relation)

        if(active && category === 'total') {
            relation['total'].current = relation['total'].current + relation[category].original
        }
        else if(active) {
            relation['total'].current = relation['total'].current + relation[category].current
        }
        else {
            relation['total'].current = relation['total'].current - relation[category].current
        }

        relations.calculateMax(max, relation)
    }

    for(let r in rels) {
        rels[r].setOptions({
            strokeOpacity: Math.sqrt(rels[r].rel.total.current/max.total)
        })
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
        'click': cityClick
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
    loaderRelations(false)
    const rels = relations.createAll({
        'map': googleMap,
        'markers': MARKERS,
        'relations': icRels,
        'click': relationClick,
        'visible': false
    })
})
.then(() => {
    loaderRelations(false)
    controlcard.initRelationList({
        relations: relations.getRelationMax(),
        toggleActive: toggleActive,
        transform: transformCallback
    })
})
.catch((err) => {
    console.log(err)
})
