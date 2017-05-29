function relation(from, to) {
    if (from.city_name === to.city_name) {
        return
    }

    let path = [
        {lat: from.lat, lng: from.lng},
        {lat: to.lat, lng: to.lng}
    ]

    let flightPath = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#f8bbd0',
        strokeOpacity: 1.0,
        strokeWeight: Math.random() * 4,
        visible: false,
        zIndex: 3
    })

    let infoWindow = new google.maps.InfoWindow({
        content: '' + from.city_name.capitalize() + ' - '
            + to.city_name.capitalize()
    })

    flightPath.addListener('mouseover', (e) => {
        infoWindow.setPosition(e.latLng)
        infoWindow.open(map, flightPath);
    })

    flightPath.addListener('mouseout', (e) => {
        infoWindow.close();
    })
}
