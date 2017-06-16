const watcher = require('watch-object')
const config = require('../../config')
const LINE_OPTS = {
    // geodesic: true,
    strokeColor: '#F8BBD0',
    strokeOpacity: 1,
    strokeWeight: 4,
    zindex: 5
}

const MAX_RELATION_VALUES = {}
const RELATIONS = {}
const RELATIONS_VISIBILTY = config.get('rel_categories').reduce((result, item) => {
    result[item] = true
    return result
}, {total:true})


function addInfoWindow(path, cityA, cityB) {
    let infoWindow = new google.maps.InfoWindow({
        content: cityA + ' - ' + cityB
    })

    path.addListener('mouseover', (e) => {
        // Move window slightly up to allow for clicking the relation
        infoWindow.setPosition({
            'lat': e.latLng.lat() + 0.02,
            'lng': e.latLng.lng()
        })
        infoWindow.open(map, path)
    })

    path.addListener('mouseout', () => infoWindow.close())
}

function addWatcher(path, markerA, markerB) {
    watcher.watch(markerA, 'visible', (newval, oldval) => {
        path.setVisible(markerB.getVisible() && newval)
    })
    watcher.watch(markerB, 'visible', (newval, oldval) => {
        path.setVisible(markerA.getVisible() && newval)
    })
}

function calculateRelationScore(relation) {
    return config.get('rel_categories').reduce((total, rel_name) => {
        let strength = Number(relation[rel_name])
        if(!isNaN(strength)) {
            total = total + strength
        }
        return total
    }, 0)
}

function create(options) {
    if (options.rel.from.id === options.rel.to.id) {
        console.log('should never happen!')
        return
    }

    LINE_OPTS['path'] = [
        {lat: options.rel.from.lat, lng: options.rel.from.lng},
        {lat: options.rel.to.lat, lng: options.rel.to.lng}
    ]

    let flightPath = new google.maps.Polyline(LINE_OPTS)
    flightPath['relID'] = options.relID
    flightPath['rel'] = options.rel
    flightPath['relTotal'] = options.relTotal
    flightPath['visibility'] = Object.assign({}, RELATIONS_VISIBILTY)
    flightPath.setVisible(options.markerFrom.getVisible() && options.markerTo.getVisible())
    flightPath.setMap(options.map)
    flightPath.addListener('click', () => options.click(options.rel))
    addInfoWindow(flightPath, options.rel.from.name, options.rel.to.name)
    addWatcher(flightPath, options.markerFrom, options.markerTo)

    return flightPath
}

function createAll(options) {
    options.relations.forEach(rel => {
        let from = options.markers[rel.from.id]
        let to = options.markers[rel.to.id]
        let total = calculateRelationScore(rel)
        let rel_id = rel.from.id.toString() + rel.to.id.toString()

        RELATIONS[rel_id] = create({
            'map': options.map,
            'click': options.click,
            'markerFrom': from,
            'markerTo': to,
            'rel': rel,
            'relID': rel_id,
            'relTotal': total
        })

        updateMaxTotal(total)
        updateRelationMax(rel)
    })
}

function getRelationMax() {
    return MAX_RELATION_VALUES
}

function updateMax(name, value) {
    if(!MAX_RELATION_VALUES[name] || value > MAX_RELATION_VALUES[name]) {
        MAX_RELATION_VALUES[name] = value
    }
}

function updateMaxTotal(total) {
    updateMax('total', total)
}

function updateRelationMax(relation) {
    config.get('rel_categories').forEach((rel_name) => {
        updateMax(rel_name, relation[rel_name])
    })
}

function updateRelationVisibility(relation, rel_name, value) {
    let visibility = relation['visibility']

    if(rel_name==='total') {
        visibility[rel_name] = relation.relTotal >= value
    } else {
        visibility[rel_name] = relation.rel[rel_name] >= value
    }

    if(visibility[rel_name]) {
        relation.setVisible(Object.keys(visibility).reduce((result, category) => {
            return (result && visibility[category])
        }, true))
    } else {
        relation.setVisible(false)
    }
}

function updateVisibility(rel_name, value) {
    console.log('in update');
    for(let rel in RELATIONS) {
        updateRelationVisibility(RELATIONS[rel], rel_name, value)
    }
}

module.exports = {
    createAll,
    getRelationMax,
    updateVisibility
}
