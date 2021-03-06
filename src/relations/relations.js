const config = require('../../config')
const crypto = require('../crypto_utils/crypto')
const watcher = require('watch-object')
const LINE_OPTS = {
    geodesic: true,
    strokeColor: '#00a6d6',
    strokeWeight: 6,
    zindex: 5
}

const CATEGORIES = config.get('rel_categories')
const MAX_RELATION_VALUES = {}
const ACTIVE = CATEGORIES.reduce(function(obj, v) {
    obj[v] = true;
    return obj;
}, {})
const RELATIONS = {}



function addInfoWindow(path, cityA, cityB) {
    let infoWindow = new google.maps.InfoWindow({
        content: cityA + ' - ' + cityB
    })

    path.addListener('mouseover', (e) => {
        // Move window slightly up to allow for clicking the relation
        path.setOptions({strokeWeight: 10})
        infoWindow.setPosition({
            'lat': e.latLng.lat() + 0.009,
            'lng': e.latLng.lng()
        })
        infoWindow.open(map, path)
    })

    path.addListener('mouseout', () => {
        path.setOptions({strokeWeight: 4})
        infoWindow.close()
    })
}

function addWatcher(path, markerA, markerB) {
    const relation = path.rel

    watcher.watch(markerA, 'visible', (newval, oldval) => {
        path.setVisible(markerB.getVisible() && getRelationVisibility(relation) && newval && (markerA.selected || markerB.selected))
    })
    watcher.watch(markerB, 'visible', (newval, oldval) => {
        path.setVisible(markerA.getVisible() && getRelationVisibility(relation) && newval && (markerA.selected || markerB.selected))
    })
    watcher.watch(path, 'visible', (newval, oldval) => {
        path.setVisible(markerA.getVisible() && markerB.getVisible() && newval && (markerA.selected || markerB.selected))
    })
    watcher.watch(markerA, 'selected', (newval, oldval) => {
        path.setVisible(getRelationVisibility(relation) && markerA.getVisible() && markerB.getVisible() && (markerA.selected || markerB.selected))
    })
    watcher.watch(markerB, 'selected', (newval, oldval) => {
        path.setVisible(getRelationVisibility(relation) && markerA.getVisible() && markerB.getVisible() && (markerA.selected || markerB.selected))
    })
}

function calculateMax(max, r) {
    CATEGORIES.forEach((c) => {
        if(!max[c] || r[c].current > max[c]) {
            max[c] = r[c].current
        }
    })

    return max
}

function calculateTotal(r) {
    let total = 0

    CATEGORIES.forEach((c) => {
        if(ACTIVE[c]) {
            total = total + r[c].current
        }
    })

    return total
}

function create(options) {
    if (options.rel.from.id === options.rel.to.id) {
        console.log('should never happen!')
        return
    }

    return ICRelation(options)
}

function createAll(options) {
    options.relations.forEach(rel => {
        updateRelationMax(rel)
    })

    options.relations.forEach(rel => {
        let from = options.markers[rel.from.id]
        let to = options.markers[rel.to.id]
        let rel_id = crypto.uuidv4()

        RELATIONS[rel_id] = create({
            'map': options.map,
            'click': options.click,
            'markerFrom': from,
            'markerTo': to,
            'rel': rel,
            'relID': rel_id,
            'visible': options.visible
        })
    })

    return RELATIONS
}

function getActive() {
    return ACTIVE
}

function getRelations() {
    return RELATIONS
}

function getRelationMax() {
    return MAX_RELATION_VALUES
}

function getRelationVisibility(relation) {
    return CATEGORIES.reduce((result, category) => {
        return (result && relation[category].visible)
    }, true)
}

function ICRelation(options) {
    LINE_OPTS['path'] = [
        {lat: options.rel.from.lat, lng: options.rel.from.lng},
        {lat: options.rel.to.lat, lng: options.rel.to.lng}
    ]
    LINE_OPTS['strokeOpacity'] = Math.sqrt(options.rel['total'] / MAX_RELATION_VALUES.total)

    let flightPath = new google.maps.Polyline(LINE_OPTS)

    flightPath.relID = options.relID
    flightPath.rel = rel(options.rel)
    flightPath.rel.from.population = options.markerFrom.city.population
    flightPath.rel.to.population = options.markerTo.city.population

    if(typeof options.visible !== 'undefined') {
        flightPath.setVisible(options.visible)
    }
    else {
        flightPath.setVisible(options.markerFrom.getVisible() && options.markerTo.getVisible())
    }
    flightPath.setMap(options.map)
    flightPath.addListener('click', () => options.click(flightPath.rel))
    addInfoWindow(flightPath, options.rel.from.name, options.rel.to.name)
    addWatcher(flightPath, options.markerFrom, options.markerTo)
    return flightPath
}

function rel(relation) {
    return CATEGORIES.reduce((result, category) => {
        result[category] = {
            current: relation[category],
            original: relation[category],
            visible: true
        }
        return result
    }, {
        from: relation.from,
        to: relation.to
    })
}

function relationDict(arg) {
    return CATEGORIES.reduce((result, item) => {
        result[item] = arg
        return result
    }, {})
}

function updateMax(name, value) {
    if(!MAX_RELATION_VALUES[name] || value > MAX_RELATION_VALUES[name]) {
        MAX_RELATION_VALUES[name] = value
    }
}

function updateRelationMax(relation) {
    CATEGORIES.forEach((rel_name) => {
        updateMax(rel_name, relation[rel_name])
    })
}

function updateRelationVisibility(relation, rel_name, value) {
    const rel = relation.rel

    rel[rel_name].visible = rel[rel_name].current >= value

    if(rel[rel_name].visible) {
        relation.setVisible(getRelationVisibility(rel))
    } else {
        relation.setVisible(false)
    }
}

function updateVisibility(rel_name, value) {
    for(let rel in RELATIONS) {
        updateRelationVisibility(RELATIONS[rel], rel_name, value)
    }
}

module.exports = {
    calculateMax,
    calculateTotal,
    createAll,
    getActive,
    getRelations,
    getRelationMax,
    relationDict,
    updateVisibility
}
