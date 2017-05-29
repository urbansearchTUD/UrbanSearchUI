const map = require('../map/map')
const markers = require('../markers/markers')
const card = require('../card/card')
// const relations = require('../relations/relations')

const googleMap = map.initMap('map')

fetch('/data/city_latlng.json')
    .then(response => {
        return response.json()
    })
    .then(cities => {
        console.log(card.createList(cities));
        cities.forEach(city => {
            markers.create(googleMap, city)
        })
    })
