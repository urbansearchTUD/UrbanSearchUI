const LINE_OPTS = {
    // geodesic: true,
    strokeColor: '#00a6d6',
    strokeOpacity: 1,
    strokeWeight: 4,
    zindex: 5
}


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
    const categories = path.data.categories

    watcher.watch(markerA, 'visible', (newval, oldval) => {
        path.setVisible(markerB.getVisible() && getRelationVisibility(categories) && newval)
    })
    watcher.watch(markerB, 'visible', (newval, oldval) => {
        path.setVisible(markerA.getVisible() && getRelationVisibility(categories) && newval)
    })
    watcher.watch(path, 'visible', (newval, oldval) => {
        path.setVisible(markerA.getVisible() && markerB.getVisible() && newval)
    })
}


function category(value) {
    return {
        current: value,
        initial: value,
        visibile: true
    }
}


function getRelationVisibility(categories) {
    return Object.keys(categories).reduce((result, category) => {
        return (result && categories[category].visible)
    }, true)
}


function relationData(relation, options) {
    const categories = Object.keys(options.rel).reduce((categories, category) => {
        categories[category] = category(options.rel[category])
        return categories
    }, {total: category(options.relTotal)})

    return {
        categories: categories,
        id: options.relID,
        total: options.relTotal
    }
}

module.exports = (options) => {
    LINE_OPTS.path = [
        {lat: options.rel.from.lat, lng: options.rel.from.lng},
        {lat: options.rel.to.lat, lng: options.rel.to.lng}
    ]

    let relation = new google.maps.Polyline(LINE_OPTS)
    relation.data = relationData(relation, options)

    relation.setVisible(options.markerFrom.getVisible() && options.markerTo.getVisible())
    relation.setMap(options.map)
    relation.addListener('click', () => options.click(options.rel))
    addInfoWindow(relation, options.rel.from.name, options.rel.to.name)
    addWatcher(relation, options.markerFrom, options.markerTo)

    return relation
}
